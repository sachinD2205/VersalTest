import {
  Box,
  Button,
  FormLabel,
  Radio,
  InputLabel,
  RadioGroup,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  ThemeProvider,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import theme from "../../../../theme";
import { EncryptData,DecryptData } from "../../../../components/common/EncryptDecrypt";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SaveIcon from "@mui/icons-material/Save";
import { DataGrid } from "@mui/x-data-grid";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import hearingScheduleSchema from "../../../../containers/schema/rtiOnlineSystemSchema/hearingScheduleSchema";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import UploadButton from "../../../../components/fileUpload/UploadButton";
import { useState } from "react";
import axios from "axios";
import { useEffect, useRef } from "react";
import moment from "moment";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import urls from "../../../../URLS/urls";
import decisionSchema from "../../../../containers/schema/rtiOnlineSystemSchema/decisionSchema";
import { useSelector } from "react-redux";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { manageStatus } from "../../../../components/rtiOnlineSystem/commonStatus/manageEnMr";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useReactToPrint } from "react-to-print";
import UploadButton1 from "../../Document/UploadButton1";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";
import PostData from '../../transactions/postJson.json'
const EntryForm = () => {
  const {
    register,
    control,
    methods,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    mode: "onChange",
  });

  const {
    register: register1,
    handleSubmit: handleSubmit2,
    methods: methods2,
    watch: watch2,
    control: control2,
    setValue: setValue1,
    formState: { errors: error2 },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(hearingScheduleSchema),
  });

  const {
    register: register2,
    handleSubmit: handleSubmit3,
    setValue: setValue2,
    formState: { errors: error3 },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(decisionSchema),
  });
  const [infoSentByPost, setInfoSentByPost] = useState(false);
  const [mediumMaster, setMediumMaster] = useState([]);
  const [rejectedCat, setRejectedCategory] = useState([]);
  const [rejectedDocument, setRejectedDoc] = useState([]);
  const [appealDetails, setAppealDetails] = useState(null);
  var currDate = new Date();
  currDate.setDate(currDate.getDate() + 1);
  const [applicationCurrentStatus, setApplicationStatus] = useState();
  const language = useSelector((state) => state?.labels?.language);
  const [totalAmount, setTotalAmt] = useState(null);
  const [isBplval, setIsBpl] = useState(null);
  const [appReceievedDetails, setApplicationReceivedDetails] = useState(null);
  const [chargeTypeDetails, setChargeTypeDetails] = useState([]);
  const router = useRouter();
  const [dateOfappeal, setDateofAppeal] = useState(null);
  const [appealId, setAppealId] = useState(null);
  const inputState = getValues("inputState");
  const [subDepartments, setSubDepartmentList] = useState([]);
  const [isHearingSchedule, setHearingSchedule] = useState(false);
  const [showDisabled, showDisable] = useState(false);
  const [hearingId, setHearingId] = useState(null);
  const [applicationKey, setApplicationKey] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [document, setDocument] = useState(null);
  const [document1, setDocument1] = useState(null);
  const [completeAttach, setCompleteAttach] = useState([]);
  const [applicationDoc, setApplicationDoc] = useState([]);
  const [childDept, setChildDept] = useState([]);
  const [applications, setApplicationDetails] = useState([]);
  const [pageNo, setPageNo] = useState();
  let user = useSelector((state) => state.user.user);
  const [statusVal, setStatusVal] = useState(null);
  const [isDecisionEntry, setDecisionEntry] = useState(false);
  const [hearingDetails, setHearingDetails] = useState([]);
  const [appealDoc, setAppealDoc] = useState([]);
  const [decisionDetailsrow, setDecisionDoc] = useState([]);
  const [zoneDetails, setZoneDetails] = useState();
  const [applicationId, setApplicationID] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [genderDetails, setGenderDetails] = useState([]);
  const [loiDetails, setLoiDetails] = useState([]);
  const [selectedDate, setSelectedDate] = useState(currDate);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [officeLocationDetails, setOfficeLocationDetails] = useState([]);
  const [rtiApplicationDetails, setRTIApplicationDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusAll, setStatus] = useState([]);
  const [isHearingScheduleLoading, setHearingLoading] = useState(false);
  const [isDecisionLoading, setDecisionLoading] = useState(false);
  const [hearDate, setHearDate] = useState(null);
  const [rateChartList, setRateChartList] = useState([]);
  const componentRef = useRef(null);
  const [bplDocument, setBPLDocument] = useState();
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

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };
  const onPrint = useReactToPrint({
    content: () => componentRef.current,
    // documentTitle:
    //   language === "en" ? "RTI Appeal Acknowldgement" : "आरटीआय अपील पोचपावती",
  });
  useEffect(() => {
    getAllStatus();
    getZone();
    getDepartments();
    getGenders();
    getSubDepartments();
    getChargeType();
    getOfficeLocation();
    getTransferMedium();
    getRejectedCat();
  }, []);

  useEffect(() => {
    if (applicationKey != null) getRTIApplicationById();
  }, [applicationKey]);

  useEffect(() => {
    if (router.query.id) {
      setValue("appealApplicationNo", router.query.id);
      getAppealDetails();
    }
  }, [router.query.id]);

  useEffect(() => {
    if (applicationId != null) getLoi();
  }, [applicationId]);

  const cancellButton = () => {
    router.push({
      pathname: "/RTIOnlineSystem/dashboard/rtiAppealDashboard",
    });
  };

  const getAllStatus = () => {
    axios
      .get(`${urls.RTI}/mstStatus/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setStatus(
          res.data.mstStatusDaoList.map((r, i) => ({
            id: r.id,
            statusTxt: r.statusTxt,
            statusTxtMr: r.statusTxtMr,
            status: r.status,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getTransferMedium = () => {
    axios
      .get(`${urls.RTI}/mstTransferMedium/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res, i) => {
        let result = res.data.mstTransferMediumList;
        setMediumMaster(
          result.map((res) => ({
            id: res.id,
            mediumPrefix: res.mediumPrefix,
            nameOfMedium: res.nameOfMedium,
            nameOfMediumMr: res.nameOfMediumMr,
            activeFlag: res.activeFlag,
            status: res.activeFlag === "Y" ? "Active" : "InActive",
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getRejectedCat = () => {
    axios
      .get(`${urls.RTI}/mstRejectCategory/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res, i) => {
        setRejectedCategory(res?.data?.mstRejectCategoryDao);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getOfficeLocation = () => {
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setOfficeLocationDetails(
          res.data.officeLocation.map((r, i) => ({
            id: r.id,
            officeLocationName: r.officeLocationName,
            officeLocationNameMar: r.officeLocationNameMar,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // hearing table for dept user
  const columns = [
    {
      field: "srNo",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="srNo" />,
    },
    {
      field: "hearingDate",
      headerName: <FormattedLabel id="scheduleDate" />,
      flex: 1,
      headerAlign: "center",
      align: "left",
      minWidth: 150,
    },
    {
      field: "hearingTime",
      headerName: <FormattedLabel id="scheduleTime" />,
      flex: 1,
      headerAlign: "center",
      align: "left",
      minWidth: 150,
    },
    {
      field: "venue",
      headerName: <FormattedLabel id="venueForHearing" />,
      flex: 1,
      headerAlign: "center",
      align: "left",
      minWidth: 150,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={() => {
                setHearDate(params.row);
                getHearingById(params.row.id);
                showDisable(true);
                setHearingSchedule(true);
              }}
            >
              <VisibilityIcon style={{ color: "#556CD6" }} />
            </IconButton>
          </>
        );
      },
    },
  ];
  const getFilePreview = (filePath) => {
    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);
    const url = ` ${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        if (r?.data?.mimeType == "application/pdf") {
          const byteCharacters = atob(r?.data?.fileName);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "application/pdf" });
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
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };
  // Document table
  const docColumns = [
    {
      field: "id",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "filenm",
      headerName: <FormattedLabel id="fileNm" />,
      headerAlign: "center",
      align: "left",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "documentType",
      headerName: <FormattedLabel id="fileType" />,
      headerAlign: "center",
      align: "left",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "Action",
      headerName: <FormattedLabel id="actions" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      renderCell: (record) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
              gap: 12,
            }}
          >
            <IconButton
              color="primary"
              onClick={() => {
                // window.open(
                //   `${urls.CFCURL}/file/preview?filePath=${record.row.documentPath}`,
                //   "_blank"
                // );
                getFilePreview(record?.row?.documentPath);
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </div>
        );
      },
    },
  ];

  // child dept column
  const childDeptColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
      flex: 1,
      // width: 60,
    },
    {
      field: "applicationNo",
      headerName: <FormattedLabel id="applicationNo" />,
      headerAlign: "center",
      align: "left",
      // flex: 1,
      // minWidth: 200,
      width: 300,
    },
    {
      field: "departmentName",
      headerName: <FormattedLabel id="departmentKey" />,
      headerAlign: "center",
      align: "left",
      width: 300,
      // width: 300,
      // minWidth: 200,
    },
    // {
    //   field: "transferRemark",
    //   headerName: <FormattedLabel id="transferRemark" />,
    //   renderCell: (params) => (
    //     <div style={{ whiteSpace: "pre-line" }}>{params.value}</div>
    //   ),
    //   headerAlign: "center",
    //   align: "center",
    //   // flex: 1,
    //   width: 700,
    //   // minWidth: 500,
    // },

    {
      field: "transferRemark",
      headerName: <FormattedLabel id="transferRemark" />,
      width: 200,
      headerAlign: "center",
      align: "left",
      minWidth: 500,
      renderCell: (params) => (
        <div
          style={{
            maxHeight: "50px", // Adjust the value based on the fixed row height
            overflowY: "auto",
            whiteSpace: "pre-line",
          }}
        >
          {params.value}
        </div>
      ),
    },

    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line" }}>{params.value}</div>
      ),
      headerAlign: "center",
      align: "left",
      width: 300,
      // width: 300,
      // minWidth: 500,
    },
    {
      field: "completedDate",
      headerName: <FormattedLabel id="completeDate" />,
      headerAlign: "center",
      align: "left",
      // flex: 1,
      width: 300,
      // minWidth: 200,
    },
    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      headerAlign: "center",
      align: "left",
      width: 200,
      // minWidth: 200,
    },
    {
      field: "Action",
      headerName: <FormattedLabel id="viewAttach" />,
      headerAlign: "center",
      align: "center",
      // flex: 1,
      // minWidth: 200,
      width: 200,
      renderCell: (record) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
              gap: 12,
            }}
          >
            <IconButton
              color="primary"
              onClick={() => {
                if (record.row.documentPath) {
                  // window.open(
                  //   `${urls.CFCURL}/file/preview?filePath=${record.row.documentPath}`,
                  //   "_blank"
                  // );
                  getFilePreview(record?.row?.documentPath);
                }
              }}
            >
              <VisibilityIcon
                style={{ color: record.row.documentPath ? "#556CD6" : "grey" }}
              />
            </IconButton>
          </div>
        );
      },
    },
  ];

  // load zone
  const getZone = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setZoneDetails(
          res.data.zone.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            zoneName: r.zoneName,
            zone: r.zone,
            ward: r.ward,
            area: r.area,
            zooAddress: r.zooAddress,
            zooAddressAreaInAcres: r.zooAddressAreaInAcres,
            zooApproved: r.zooApproved,
            zooFamousFor: r.zooFamousFor,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // get charge type
  const getChargeType = () => {
    axios
      .get(`${urls.CFCURL}/master/serviceChargeType/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setChargeTypeDetails(
          r.data.serviceChargeType.map((row) => ({
            id: row.id,
            serviceChargeType: row.serviceChargeType,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // get all subdept
  const getSubDepartments = () => {
    axios
      .get(`${urls.RTI}/master/subDepartment/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setSubDepartmentList(
          res.data.subDepartment.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            departmentId: r.department,
            subDepartment: r.subDepartment,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // Get all department
  const getDepartments = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setDepartments(
          r.data.department.map((row) => ({
            id: row.id,
            department: row.department,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // load gender
  const getGenders = () => {
    axios
      .get(`${urls.CFCURL}/master/gender/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setGenderDetails(
          r.data.gender.map((row) => ({
            id: row.id,
            gender: row.gender,
            genderMr: row.genderMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // load get loi
  const getLoi = () => {
    axios
      .get(
        `${urls.RTI}/trnAppealLoi/getAllByApplication?applicationNo=${applicationId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        if (res.data.trnAppealLoiList.length != 0) {
          setLOIDetails(res);
        }
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // Set loi details on ui
  const setLOIDetails = (res) => {
    setLoiDetails(res.data.trnAppealLoiList[0]);
    setValue1("chargeTypeKey", res.data?.trnAppealLoiList[0].chargeTypeKey);
    setValue1("noOfPages", res.data.trnAppealLoiList[0].noOfPages);
    setValue1("amount", res.data?.trnAppealLoiList[0].amount);
    setValue1("totalAmount", res.data?.trnAppealLoiList[0].totalAmount);
    setValue1("remarks", res.data?.trnAppealLoiList[0].remarks);
    setPageNo(res.data.trnAppealLoiList[0].noOfPages);
    setTotalAmt(res.data?.trnAppealLoiList[0].totalAmount);
    const DummyRateChart = res.data.trnAppealLoiList[0]?.trnLoiChargesDaos?.map(
      (obj, index) => {
        return {
          id: obj.id,
          srNo: index + 1,
          serviceChargeTypeName: obj.serviceChargeTypeName,
          amount: obj.amount,
          unit: obj.unit,
        };
      }
    );
    setValue("serviceName", "RTI");

    setRateChartList(DummyRateChart);
  };

  const rateColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "serviceChargeTypeName",
      headerName: <FormattedLabel id="chargeType" />,
      headerAlign: "center",
      align: "left",
      flex: 1,
    },
    {
      field: "unit",
      headerName: <FormattedLabel id="quantity" />,
      headerAlign: "center",
      align: "center",
      width: "150",
    },
    {
      field: "amount",
      headerName: <FormattedLabel id="amount" />,
      headerAlign: "center",
      align: "center",
      width: "150",
    },
  ];

  // load hearing by id(clicking view icon)
  const getHearingById = (hearingByid) => {
    axios
      .get(`${urls.RTI}/trnRtiHearing/getById?id=${hearingByid}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setValue1("venue", r.data.venue);
        setSelectedDate(r.data.hearingDate);
        setSelectedTime(r.data.hearingTimeV3);
        setValue1("hearingRemark", r.data.remarks);
        setHearingId(r.data.id);
        setHearingDetails(r.data);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // load appeal details
  const getAppealDetails = () => {
    setIsLoading(true);
    axios
      .get(
        `${urls.RTI}/trnRtiAppeal/getByApplicationNo?applicationNo=${router.query.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        setIsLoading(false);
        setAppealDetails(res);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  useEffect(() => {
    if (appealDetails != null) {
      setAppealDetailsOnUi();
    }
  }, [appealDetails, language]);

  // set appeal detailsF
  const setAppealDetailsOnUi = () => {
    let res = appealDetails;
    setApplicationDetails(res.data);
    setAppealId(res.data.id);
    setValue("applicantFirstName", res.data?.applicantFirstName);
    setValue("applicantMiddleName", res.data?.applicantMiddleName);
    setValue("applicantLastName", res.data?.applicantLastName);
    setValue(
      "applicantName",
      res?.data.applicantFirstName +
        " " +
        res?.data.applicantMiddleName +
        " " +
        res?.data.applicantLastName
    );
    setValue("place", res.data?.place);
    setValue('date',res.data?.applicationDate)
    setValue("address", res.data?.address);
    setApplicationKey(res.data?.applicationKey);
    setValue("paymentAmount", res.data?.paymentAmount);
    setValue("address", res.data?.address);
    setValue("appealReason", res.data?.appealReason);
    setApplicationReceivedDetails(
      res.data?.createdUserType == 1
        ? "citizenuser"
        : res.data?.createdUserType == 2
        ? "cfcuser"
        : res.data?.createdUserType == 3
        ? "pcmcportal"
        : res.data?.createdUserType == 4
        ? "aaplesarkar"
        : ""
    );
    setValue("officerDetails", res.data?.officerDetails);
    setDateofAppeal(res.data?.applicationDate);
    setValue("informationSubject", res.data?.subject);
    setValue("concernedOfficeDetails", res.data?.concernedOfficeDetails);
    setValue("informationSubjectDesc", res.data?.informationSubjectDesc);
    setValue("informationDescription", res.data?.informationDescription);
    setStatusVal(res.data.status);
    setValue("selectedReturnMedia2", res?.data?.selectedReturnMediaKey);
    setValue("outwardNumberTxt1", res.data.outwardNumberTxt);
    setValue1("applicationNo", res.data?.applicationNo);
    setValue("status", manageStatus(res.data.status, language, statusAll));

    setDataSource(
      res.data.trnRtiHearingDaoList.map((row, i) => ({
        srNo: i + 1,
        id: row.id,
        hearingDate: moment(row.hearingDate).format("DD-MM-YYYY"),
        hearingTime: moment(row.hearingTimeV3).format("hh:mm a"),
        venue: row.venue,
        remarks: row.remarks,
      }))
    );
    if (res.data.trnRtiHearingDaoList.length != 0) {
      setValue2(
        "decisionDetails",
        res.data.trnRtiHearingDaoList[0].decisionDetails
          ? res.data.trnRtiHearingDaoList[0].decisionDetails
          : ""
      );
      setValue(
        "dateOfOfficialorderAgainstAppeal",
        res.data.trnRtiHearingDaoList[0].dateOfOrderAgainstAppeal != null &&
          res.data.trnRtiHearingDaoList[0].dateOfOrderAgainstAppeal != ""
          ? res.data.trnRtiHearingDaoList[0].dateOfOrderAgainstAppeal
          : res.data.trnRtiHearingDaoList[0].hearingDate
      );

      setValue2(
        "decisionStatus",
        res.data.trnRtiHearingDaoList[0].decisionStatus
          ? res.data.trnRtiHearingDaoList[0].decisionStatus
          : ""
      );
      setValue2("remarks", res.data.trnRtiHearingDaoList[0].remarks);

      const doc = [];
      if (res.data.trnRtiHearingDaoList[0].decisionOrderDocumentPath != null) {
        const DecryptPhoto = DecryptData(
          "passphraseaaaaaaaaupload",
          res.data.trnRtiHearingDaoList[0].decisionOrderDocumentPath
        );
        doc.push({
          id: 1,
          filenm: "Decision Order Document",
          documentPath:
            res.data.trnRtiHearingDaoList[0].decisionOrderDocumentPath,
          documentType:
          DecryptPhoto
              .split(".")
              .pop()
              .toUpperCase(),
        });
      }
      if (
        res.data.trnRtiHearingDaoList[0].informationDeliveredDocumentPath !=
        null
      ) {
        const DecryptPhoto = DecryptData(
          "passphraseaaaaaaaaupload",
          res.data.trnRtiHearingDaoList[0].informationDeliveredDocumentPath
        );
        doc.push({
          id: 2,
          filenm: "Information Delivered Document",
          documentPath:
            res.data.trnRtiHearingDaoList[0].informationDeliveredDocumentPath,
          documentType:
          DecryptPhoto
              .split(".")
              .pop()
              .toUpperCase(),
        });
      }
      setDecisionDoc(doc);
    }

    const doc = [];
    // Loop through each attached document and add it to the `doc` array
    for (let i = 1; i <= 10; i++) {
      const attachedDocument = res.data[`attachedDocument${i}`];
      if (attachedDocument != null) {
        const DecryptPhoto = DecryptData(
          "passphraseaaaaaaaaupload",
          attachedDocument
        );
        doc.push({
          id: i,
          filenm: DecryptPhoto.split("/").pop().split("_").pop(),
          documentPath: attachedDocument,
          documentType: DecryptPhoto.split(".").pop().toUpperCase(),
        });
      }
    }
    setAppealDoc(doc);
  };

  // for fetching rti application no and applicant name on hearing modal
  const getRTIApplicationById = () => {
    axios
      .get(`${urls.RTI}/trnRtiApplication/getById?id=${applicationKey}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setRTIApplicationDetails(res.data);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };
  useEffect(() => {
    if (rtiApplicationDetails != null) {
      setApplicationDetailsOnForm();
    }
  }, [rtiApplicationDetails,zoneDetails,genderDetails, language,departments,subDepartments,statusAll]);
  // set appeal details on form
  const setApplicationDetailsOnForm = () => {
    let _res = rtiApplicationDetails;
    setValue(
      "zoneKey",
      zoneDetails?.find((obj) => {
        return obj.id == _res?.zoneKey;
      })
        ? zoneDetails.find((obj) => {
            return obj.id == _res?.zoneKey;
          }).zoneName
        : "-"
    );
    setValue(
      "departmentKey",
      departments?.find((obj) => {
        return obj.id == _res?.departmentKey;
      })
        ? departments.find((obj) => {
            return obj.id == _res.departmentKey;
          }).department
        : "-"
    );
    setValue("infoSentByPost", _res.infoSentByPost);
    setInfoSentByPost(_res.infoSentByPost);
    setValue("postType", _res.postType);
    setValue(
      "subDepartmentKey",
      subDepartments?.find((obj) => {
        return obj.id == _res?.subDepartmentKey;
      })
        ? subDepartments.find((obj) => {
            return obj.id == _res.subDepartmentKey;
          }).subDepartment
        : "-"
    );
    setApplicationID(_res?.id);
    setValue("applicantFirstName", _res?.applicantFirstName);
    setValue1(
      "applicantFirstName",
      _res?.applicantFirstName +
        " " +
        _res?.applicantMiddleName +
        " " +
        _res?.applicantLastName
    );
    setValue1("serviceName", "RTI");
    setValue("applicantMiddleName", _res?.applicantMiddleName);
    setValue("applicantLastName", _res?.applicantLastName);
    setValue("address", _res?.address);
    setValue(
      "gender",
      genderDetails?.find((obj) => {
        return obj.id == _res?.gender;
      })
        ? genderDetails.find((obj) => {
            return obj.id == _res?.gender;
          }).gender
        : "-"
    );
    setValue("pinCode", _res?.pinCode);
    setValue("contactDetails", _res?.contactDetails);
    setValue1("applicationNo", _res?.applicationNo);
    setValue("emailId", _res?.emailId);
    setIsBpl(_res?.isBpl);
    setValue("bplCardNo", _res?.bplCardNo);
    setValue("yearOfIssues", _res?.bplCardIssueYear);
    setValue("informationSubject", _res?.subject);
    setBPLDocument(_res?.bplCardDoc);
    setValue("issuingAuthority", _res?.bplCardIssuingAuthority);
    setValue("remarks", _res?.remarks);
    setValue("completeRemark", _res?.remarks);
    setValue("applicationNo", _res?.applicationNo);
    setValue("applicationType", "Child Application");
    setValue("fromDate", moment(_res?.fromDate).format("DD-MM-YYYY")),
      setValue("toDate", moment(_res?.toDate).format("DD-MM-YYYY"));
    setValue(
      "applicationDate",
      moment(_res?.applicationDate).format("DD-MM-YYYY")
    ),
      setValue("outwardNumberTxt", _res?.outwardNumberTxt);
    setValue("requiredInformationPurpose", _res?.requiredInformationPurpose);
    setValue("informationReturnMedia1", _res?.informationReturnMediaKey);
    setValue("selectedReturnMediaKey", _res?.selectedReturnMediaKey);
    setValue("description", _res?.description);
    setValue("additionalInfo", _res?.additionalInfo);
    setValue("parentRemark", _res?.transferRemark);
    setValue("forwardRemark", _res?.forwardRemark);
    setApplicationStatus(_res.status);
    setValue(
      "applicationCurrentStatus1",
      manageStatus(_res.status, language, statusAll)
    );
    setApplicationReceivedDetails(
      _res?.createdUserType == 1
        ? "citizenuser"
        : _res?.createdUserType == 2
        ? "cfcuser"
        : _res?.createdUserType == 3
        ? "pcmcportal"
        : _res?.createdUserType == 4
        ? "aaplesarkar"
        : ""
    );
    setValue("infoPages", _res?.infoPages),
      setValue("infoRemark", _res?.infoAvailableRemarks);

    const completeDoc = [];
    if (_res.attachedDocumentPath != null) {
      const DecryptPhoto = DecryptData(
        "passphraseaaaaaaaaupload",
        _res?.attachedDocumentPath
      );
      completeDoc.push({
        id: 1,
        filenm:DecryptPhoto.split("/").pop().split("_").pop(),
        documentPath: _res.attachedDocumentPath,
        documentType: DecryptPhoto.split(".").pop().toUpperCase(),
      });
      setCompleteAttach(completeDoc);
    }
    const completeDoc1 = [];
    if (_res?.thirdPartyDoc1 != null) {
      const DecryptPhoto = DecryptData(
        "passphraseaaaaaaaaupload",
        _res?.thirdPartyDoc1
      );
      completeDoc1.push({
        id: 2,
        filenm: "Third Party document",
        documentPath: _res.thirdPartyDoc1,
        documentType: DecryptPhoto?.split(".").pop().toUpperCase(),
      });
    }
    setCompleteAttach([...completeDoc, ...completeDoc1]);
    if (_res.dependentRtiApplicationDaoList && departments) {
      const _res1 = _res.dependentRtiApplicationDaoList.map((res, i) => {
        // const DecryptPhoto = DecryptData(
        //   "passphraseaaaaaaaaupload",
        //   res.attachedDocumentPath
        // );
        // const DecryptPhoto1 = DecryptData(
        //   "passphraseaaaaaaaaupload",
        //   res.rejectDoc1
        // );
        return {
          srNo: i + 1,
          id: res.id,
          applicationNo: res.applicationNo,
          departmentName: departments.find((filterData) => {
            return filterData?.id == res?.departmentKey;
          })?.department,
          createdDate: res.createdDate,
          description: res.description,
          subject: res.subject,
          applicationDate: res.applicationDate
            ? moment(res.applicationDate).format("DD-MM-YYYY")
            : "-",
          completedDate: res.completionDate
            ? moment(res.completionDate).format("DD-MM-YYYY")
            : "-",
          statusVal: res.status,
          transferRemark: res.transferRemark,
          status: manageStatus(res.status, language, statusAll),
          activeFlag: res.activeFlag,
          remark: res.remarks,
          infoPages: res.infoPages,
          filenm:
          res.status == 11
            ? res.attachedDocumentPath
              ?  DecryptData(
                "passphraseaaaaaaaaupload",
                res.attachedDocumentPath
              ).split("/").pop()
              : ""
            : res.status === 15
            ? res.rejectDoc1
              ? DecryptData("passphraseaaaaaaaaupload", res.rejectDoc1).split("/").pop()
              : ""
            : "",
        documentPath:
          res.status == 11
            ? res.attachedDocumentPath
              ? res.attachedDocumentPath
              : ""
            : res.status === 15
            ? res.rejectDoc1
              ? res.rejectDoc1
              : ""
            : "",
        documentType:
          res.status == 11
            ? res.attachedDocumentPath
              ?  DecryptData(
                "passphraseaaaaaaaaupload",
                res.attachedDocumentPath
              ).split(".").pop().toUpperCase()
              : ""
            : res.status == 15
            ? res.rejectDoc1
              ? DecryptData("passphraseaaaaaaaaupload", res.rejectDoc1).split(".").pop().toUpperCase()
              : ""
            : "",
        };
      });
      setChildDept([..._res1]);
    }
    setValue1(
      "applicantName",
      _res?.applicantFirstName +
        " " +
        _res?.applicantMiddleName +
        " " +
        _res?.applicantLastName
    );
    setValue("officeLocationKey", _res?.officeLocationKey);
    setValue("rejectRemark", _res?.rejectRemark);
    setValue("rejectCategoryKey", _res?.rejectCategoryKey);
    setValue1("rtiapplicationNo", _res?.applicationNo);
    setValue1("description", _res?.description);
    setValue("informationSubject", _res?.subject);
    setValue("fromDate", moment(_res?.fromDate).format("DD-MM-YYYY")),
      setValue("toDate", moment(_res?.toDate).format("DD-MM-YYYY"));
    setValue(
      "applicationDate",
      moment(_res?.applicationDate).format("DD-MM-YYYY")
    ),
      setValue("toDate", moment(_res?.toDate).format("DD-MM-YYYY"));

    let rejectDoc = [];
    if (_res.rejectDoc1 != null) {
      const DecryptPhoto = DecryptData(
        "passphraseaaaaaaaaupload",
        _res?.rejectDoc1
      );
      rejectDoc.push({
        id: 1,
        filenm: DecryptPhoto.split("/").pop().split("_").pop(),
        documentPath: _res.rejectDoc1,
        documentType:DecryptPhoto.split(".").pop().toUpperCase(),
      });
    }
    setRejectedDoc(rejectDoc);
    const doc = [];
    // Loop through each attached document and add it to the `doc` array
    for (let i = 1; i <= 10; i++) {
      const attachedDocument = _res[`attachedDocument${i}`];
      if (attachedDocument != null) {
        const DecryptPhoto = DecryptData(
          "passphraseaaaaaaaaupload",
          attachedDocument
        );
        doc.push({
          id: i,
          filenm: DecryptPhoto.split("/").pop().split("_").pop(),
          documentPath: attachedDocument,
          documentType: DecryptPhoto.split(".").pop().toUpperCase(),
        });
      }
    }
    setApplicationDoc(doc);
  };

  // hearing modal close
  const handleCancel4 = () => {
    setHearingSchedule(false);
    showDisable(false);
  };

  // decision modal close
  const handleCancel5 = () => {
    setValue2("decisionRemarks", "");
    setValue2("decisionStatus", "");
    setValue2("decisionDetails", "");
    setDocument1();
    setDocument();
    setDecisionEntry(false);
  };

  // decision submit
  const onSubmitDecision = (formData) => {
    const dateOfOfficialorderAgainstAppeal = watch(
      "dateOfOfficialorderAgainstAppeal"
    )
      ? moment(watch("dateOfOfficialorderAgainstAppeal")).format("YYYY-MM-DD")
      : "";
    const body = {
      ...hearingDetails,
      hearingTimeV3: hearingDetails.hearingTimeV3,
      dateOfOrderAgainstAppeal: dateOfOfficialorderAgainstAppeal,
      decisionDetails: formData.decisionDetails,
      decisionStatus: formData.decisionStatus,
      remarks: formData.decisionRemarks,
      decisionOrderDocumentPath: document,
      informationDeliveredDocumentPath: document1,
      activeFlag: "Y",
      isComplete: true,
      isRescheduled: false,
    };
    setDecisionLoading(true);
    const tempData = axios
      .post(`${urls.RTI}/trnRtiHearing/save`, body, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          sweetAlert(
            language == "en" ? "Saved!" : "जतन केले!",
            language == "en"
              ? "Decision Entry Successfully!"
              : "निर्णय एंट्री यशस्वीरित्या जतन केली!",
            "success",
            {
              button: language == "en" ? "Ok" : "ठीक आहे",
              allowOutsideClick: false, // Prevent closing on outside click
              allowEscapeKey: false, // Prevent closing on Esc key
              closeOnClickOutside: false,
            }
          ).then((will) => {
            if (will) {
              // updateCompleteStatus()
              setDecisionEntry(false);
              router.push({
                pathname: "/RTIOnlineSystem/dashboard/rtiAppealDashboard",
              });
            }
          });
        } else {
          sweetAlert(
            language == "en" ? "Error!" : "त्रुटी",
            language == "en" ? "Something went wrong!" : "काहीतरी चूक झाली!",
            "error",
            { button: language == "en" ? "Ok" : "ठीक आहे" }
          );
        }
      })
      .catch((err) => {
        setDecisionLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  // hearing submit
  const onSubmitHearing = (formData) => {
    let selectedDate1 = moment(selectedDate).format("DD-MM-YYYY");
    let selecteTime1 = moment(selectedTime).format("hh:mm a");
    if (
      dataSource.length != 0 &&
      selectedDate1 === hearDate.hearingDate &&
      selecteTime1 === hearDate.hearingTime
    ) {
      sweetAlert(
        language === "en"
          ? "Selected date and time already exist!.. Please select other date or time!"
          : "निवडलेली तारीख आणि वेळ आधीच अस्तित्वात आहे.. कृपया इतर तारीख किंवा वेळ निवडा!",
        {
          button: language == "en" ? "Ok" : "ठीक आहे",
        }
      );
    } else {
      const body = {
        ...formData,
        hearingDate: selectedDate,
        hearingTimeV3: selectedTime,
        appealKey: appealId,
        isRescheduled: dataSource.length != 0 ? true : false,
        remarks: dataSource.length != 0 ? formData.hearingRemark : "",
        id: dataSource.length != 0 ? hearingId : null,
      };
      setHearingLoading(true);
      const tempData = axios
        .post(`${urls.RTI}/trnRtiHearing/save`, body, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          setHearingLoading(false);
          if (res.status == 201) {
            sweetAlert({
              title: language == "en" ? "Saved!" : "जतन केले!",
              text:
                dataSource.length == 0
                  ? language == "en"
                    ? "Hearing Scheduled Successfully!"
                    : "सुनावणी यशस्वीरित्या शेड्यूल झाली!"
                  : language == "en"
                  ? "Hearing Rescheduled Successfully!"
                  : "सुनावणी यशस्वीपणे पुन्हा शेड्यूल केली!",
              icon: "success",
              button: language == "en" ? "Ok" : "ठीक आहे",
              allowOutsideClick: false, // Prevent closing on outside click
              allowEscapeKey: false, // Prevent closing on Esc key
              closeOnClickOutside: false,
            }).then((will) => {
              if (will) {
                setHearingSchedule(false);
                router.push({
                  pathname: "/RTIOnlineSystem/dashboard/rtiAppealDashboard",
                });
              }
            });
          } else {
            sweetAlert(
              language == "en" ? "Error!" : "त्रुटी",
              language == "en" ? "Something went wrong!" : "काहीतरी चूक झाली!",
              "error",
              { button: language == "en" ? "Ok" : "ठीक आहे" }
            );
          }
        })
        .catch((err) => {
          setHearingLoading(false);

          cfcErrorCatchMethod(err, false);
        });
    }
  };

  // complete status of appeal
  const updateCompleteStatus = () => {
    const body = {
      ...applications,
      // outwardNumberTxt: watch("outwardNumberTxt1"),
      // selectedReturnMediaKey: watch("selectedReturnMedia2"),
      isComplete: "true",
      isApproved: false,
    };
    setIsLoading(true);
    const tempData = axios
      .post(`${urls.RTI}/trnRtiAppeal/save`, body, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          // getAppealDetails();
          // sweetAlert({
          //   title: language == "en" ? "Saved!" : "जतन केले!",
          //   text:
          //     language == "en"
          //       ? "RTI Appeal completed!"
          //       : "आरटीआय अपील पूर्ण झाले!",
          //   icon: "success",
          //   button: language == "en" ? "Ok" : "ठीक आहे",
          // }).then((will) => {
          //   if (will) {
          router.push({
            pathname: "/RTIOnlineSystem/dashboard/rtiAppealDashboard",
          });
          // }
          // });
        } else {
          sweetAlert(
            language == "en" ? "Error!" : "त्रुटी",
            language == "en" ? "Something went wrong!" : "काहीतरी चूक झाली!",
            "error",
            { button: language == "en" ? "Ok" : "ठीक आहे" }
          );
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  // View
  return (
    <>
      <ThemeProvider theme={theme}>
        {isLoading && <CommonLoader />}
        <Paper
          ref={componentRef}
          elevation={8}
          variant="outlined"
          sx={{
            border: 1,
            borderColor: "grey.500",
            marginLeft: "10px",
            marginRight: "10px",
            [theme.breakpoints.down("sm")]: {
              marginTop: "2rem",
              marginBottom: "2rem",
            },
            padding: 1,
          }}
        >
          <Box>
            <Grid container className={commonStyles.title}>
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
                  <FormattedLabel id="viewrtiAppeal" />
                </h3>
              </Grid>
            </Grid>
          </Box>
          {/* <Divider /> */}
          <Box>
            <FormProvider {...methods}>
              <form>
                <Grid container spacing={3} sx={{ padding: "1rem" }}>
                  <>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                      <FormControl
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      >
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          {<FormattedLabel id="applicationReceivedBy" />}
                        </FormLabel>

                        <Controller
                          disabled={true}
                          InputLabelProps={{ shrink: true }}
                          name="applicationReceivedBy"
                          control={control}
                          render={({ field }) => (
                            <RadioGroup
                              disabled={inputState}
                              value={appReceievedDetails}
                              selected={field.value}
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                            >
                              <FormControlLabel
                                value="cfcuser"
                                disabled={inputState}
                                control={<Radio size="small" />}
                                label={<FormattedLabel id="cfcuser" />}
                                error={!!errors.applicationReceivedBy}
                                helperText={
                                  errors?.applicationReceivedBy
                                    ? errors.applicationReceivedBy.message
                                    : null
                                }
                              />
                              <FormControlLabel
                                value="citizenuser"
                                disabled={inputState}
                                control={<Radio size="small" />}
                                label={<FormattedLabel id="citizenuser" />}
                                error={!!errors.applicationReceivedBy}
                                helperText={
                                  errors?.applicationReceivedBy
                                    ? errors.applicationReceivedBy.message
                                    : null
                                }
                              />
                              <FormControlLabel
                                value="pcmcportal"
                                disabled={inputState}
                                control={<Radio size="small" />}
                                label={<FormattedLabel id="pcmcportal" />}
                                error={!!errors.applicationReceivedBy}
                                helperText={
                                  errors?.applicationReceivedBy
                                    ? errors.applicationReceivedBy.message
                                    : null
                                }
                              />
                              <FormControlLabel
                                value="aaplesarkar"
                                disabled={inputState}
                                control={<Radio size="small" />}
                                label={<FormattedLabel id="aaplesarkar" />}
                                error={!!errors.applicationReceivedBy}
                                helperText={
                                  errors?.applicationReceivedBy
                                    ? errors.applicationReceivedBy.message
                                    : null
                                }
                              />
                            </RadioGroup>
                          )}
                        />
                      </FormControl>
                    </Grid>
                  </>

                  {/* applicant first name */}
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      id="standard-textarea"
                      label={<FormattedLabel id="rtiApplicationNO" />}
                      multiline
                      variant="standard"
                      {...register1("rtiapplicationNo")}
                      error={!!error2.rtiapplicationNo}
                      helperText={
                        error2?.rtiapplicationNo
                          ? error2.rtiapplicationNo.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      id="standard-textarea"
                      label={<FormattedLabel id="appealApplicationNo" />}
                      multiline
                      variant="standard"
                      {...register("appealApplicationNo")}
                      error={!!errors.applicationNo}
                      helperText={
                        errors?.applicationNo
                          ? errors.applicationNo.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                    {/* current status */}
                    <TextField
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      id="standard-textarea"
                      label={<FormattedLabel id="currentStatus" />}
                      multiline
                      variant="standard"
                      {...register("status")}
                      error={!!errors.status}
                      helperText={errors?.status ? errors.status.message : null}
                    />
                  </Grid>
                  {/* information description */}
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      id="standard-textarea"
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      label={<FormattedLabel id="descriptionOfInfo" />}
                      multiline
                      variant="standard"
                      {...register("informationDescription")}
                      error={!!errors.informationDescription}
                      helperText={
                        errors?.informationDescription
                          ? errors.informationDescription.message
                          : null
                      }
                    />
                  </Grid>
                  {/* officer details */}
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      id="standard-textarea"
                      label={<FormattedLabel id="descInfoOfOfficer" />}
                      multiline
                      variant="standard"
                      {...register("officerDetails")}
                      error={!!errors.officerDetails}
                      helperText={
                        errors?.officerDetails
                          ? errors.officerDetails.message
                          : null
                      }
                    />
                  </Grid>
                  {/* concern officer details */}
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      id="standard-textarea"
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      label={
                        <FormattedLabel id="concernOfficerDeptnmWhoseInfoRequired" />
                      }
                      multiline
                      variant="standard"
                      {...register("concernedOfficeDetails")}
                      error={!!errors.concernedOfficeDetails}
                      helperText={
                        errors?.concernedOfficeDetails
                          ? errors.concernedOfficeDetails.message
                          : null
                      }
                    />
                  </Grid>
                  {/* reason for appeal */}
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      id="standard-textarea"
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      label={<FormattedLabel id="reasonForAppeal" />}
                      multiline
                      variant="standard"
                      {...register("appealReason")}
                      error={!!errors.appealReason}
                      helperText={
                        errors?.appealReason
                          ? errors.appealReason.message
                          : null
                      }
                    />
                  </Grid>
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
                        alignItems: "center",marginTop:'0px'
                      }}
                    >
                        <FormControl
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%",marginTop:'0px' }}
                  >
                    <Controller
                      control={control}
                      name="date"
                      defaultValue={currDate}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            disabled
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                <FormattedLabel id="date" required />
                              </span>
                            }
                            value={field.value || null}
                            onChange={(date) => field.onChange(date)}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                {...params}
                                size="small"
                                fullWidth
                                variant="standard"
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                  </FormControl>
                     
                    </Grid>
                    <Grid item
                      xl={4}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                      // sx={{
                      //   display: "flex",
                      //   justifyContent: "center",
                      //   alignItems: "center",
                      // }}
                >
                   <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-basic"
                        disabled
                        InputLabelProps={{ shrink: watch('place') }}
                        label={<FormattedLabel id="place" />}
                        multiline
                        variant="standard"
                        {...register("place")}
                        error={!!errors.place}
                        helperText={
                          errors?.place
                            ? errors.place.message
                            : null
                        }
                      />
                </Grid>
                </Grid>
              </form>
            </FormProvider>
          </Box>
          {appealDoc.length != 0 && (
            <div>
              <Box>
                <Grid container className={commonStyles.title}>
                  <Grid item xs={12}>
                    <h3
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        marginRight: "2rem",
                      }}
                    >
                      <FormattedLabel id="RTIAppealdoc" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>

              <DataGrid
                autoHeight
                sx={{
                  padding: "10px",
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
                density="standard"
                pagination
                paginationMode="server"
                pageSize={10}
                rowsPerPageOptions={[10]}
                rows={appealDoc}
                columns={docColumns}
              />
            </div>
          )}

          <>
            <Box>
              <Grid container className={commonStyles.title}>
                <Grid item xs={12}>
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      marginRight: "2rem",
                    }}
                  >
                    <FormattedLabel id="rtiApplication" />
                  </h3>
                </Grid>
              </Grid>
            </Box>

            <Grid container spacing={3} sx={{ padding: "1rem" }}>
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  id="standard-basic"
                  label={<FormattedLabel id="applicantName" />}
                  multiline
                  variant="standard"
                  {...register("applicantName")}
                />
              </Grid>
              {/* Gender */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-textarea"
                  label={<FormattedLabel id="gender" />}
                  multiline
                  variant="standard"
                  {...register("gender")}
                  error={!!errors.gender}
                  helperText={errors?.gender ? errors.gender.message : null}
                />
              </Grid>
              {/* Pincode */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  id="standard-textarea"
                  label={<FormattedLabel id="pinCode" />}
                  multiline
                  variant="standard"
                  {...register("pinCode")}
                  error={!!errors.pinCode}
                  helperText={errors?.pinCode ? errors.pinCode.message : null}
                />
              </Grid>
              {/* Contact details */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  id="standard-textarea"
                  label={<FormattedLabel id="contactDetails" />}
                  multiline
                  variant="standard"
                  {...register("contactDetails")}
                  error={!!errors.contactDetails}
                  helperText={
                    errors?.contactDetails
                      ? errors.contactDetails.message
                      : null
                  }
                />
              </Grid>
              {/* Email id */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  label={<FormattedLabel id="emailId" />}
                  id="standard-textarea"
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  variant="standard"
                  {...register("emailId")}
                  error={!!errors.emailId}
                  helperText={errors?.emailId ? errors.emailId.message : null}
                />
              </Grid>
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  InputLabelProps={{ shrink: true }}
                  disabled={true}
                  id="standard-textarea"
                  label={<FormattedLabel id="applicationCurrentStatus" />}
                  multiline
                  variant="standard"
                  {...register("applicationCurrentStatus1")}
                  error={!!error2.applicationCurrentStatus1}
                  helperText={
                    error2?.applicationCurrentStatus1
                      ? error2.applicationCurrentStatus1.message
                      : null
                  }
                />
              </Grid>
              {/* Address */}
              <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  id="standard-textarea"
                  label={<FormattedLabel id="address" />}
                  multiline
                  variant="standard"
                  {...register("address")}
                  error={!!errors.address}
                  helperText={errors?.address ? errors.address.message : null}
                />
              </Grid>
              {/* ZOne*/}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  label={<FormattedLabel id="zoneKey" />}
                  id="standard-textarea"
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  variant="standard"
                  {...register("zoneKey")}
                  error={!!errors.zoneKey}
                  helperText={errors?.zoneKey ? errors.zoneKey.message : null}
                />
              </Grid>
              {/* Ward */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <FormControl
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  error={!!errors.officeLocationKey}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="officeLocation" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: "100%" }}
                        disabled
                        fullWidth
                        variant="standard"
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                        label="Complaint Type"
                      >
                        {officeLocationDetails &&
                          officeLocationDetails?.map(
                            (officeLocationDetails, index) => (
                              <MenuItem
                                key={index}
                                value={officeLocationDetails.id}
                              >
                                {language == "en"
                                  ? officeLocationDetails?.officeLocationName
                                  : officeLocationDetails?.officeLocationNameMar}
                              </MenuItem>
                            )
                          )}
                      </Select>
                    )}
                    name="officeLocationKey"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.officeLocationKey
                      ? errors.officeLocationKey.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              {/* Department */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  label={<FormattedLabel id="departmentKey" />}
                  id="standard-textarea"
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  variant="standard"
                  {...register("departmentKey")}
                  error={!!errors.departmentKey}
                  helperText={
                    errors?.departmentKey ? errors.departmentKey.message : null
                  }
                />
              </Grid>
              {/* Sub department */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  label={<FormattedLabel id="subDepartmentKey" />}
                  id="standard-textarea"
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  variant="standard"
                  {...register("subDepartmentKey")}
                  error={!!errors.subDepartmentKey}
                  helperText={
                    errors?.subDepartmentKey
                      ? errors.subDepartmentKey.message
                      : null
                  }
                />
              </Grid>
               {/* required information Purpose */}
               <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  id="standard-textarea"
                  label={<FormattedLabel id="requiredInformationPurpose" />}
                  multiline
                  variant="standard"
                  {...register("requiredInformationPurpose")}
                  error={!!errors.requiredInformationPurpose}
                  helperText={
                    errors?.requiredInformationPurpose
                      ? errors.requiredInformationPurpose.message
                      : null
                  }
                />
              </Grid>
               {/* from Date */}
               <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-textarea"
                  label={<FormattedLabel id="fromDate" />}
                  multiline
                  variant="standard"
                  {...register("fromDate")}
                  error={!!errors.fromDate}
                  helperText={errors?.fromDate ? errors.fromDate.message : null}
                />
              </Grid>
              {/* to date */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-textarea"
                  label={<FormattedLabel id="toDate" />}
                  multiline
                  variant="standard"
                  {...register("toDate")}
                  error={!!errors.toDate}
                  helperText={errors?.toDate ? errors.toDate.message : null}
                />
              </Grid>
                {/* description */}
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  id="standard-textarea"
                  label={<FormattedLabel id="description" />}
                  multiline
                  variant="standard"
                  {...register("description")}
                  error={!!errors.description}
                  helperText={
                    errors?.description ? errors.description.message : null
                  }
                />
              </Grid>
              <Grid
                    item
                    xl={4}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    // style={{
                    //   display: "flex",
                    //   justifyContent: "center",
                    // }}
                  >
                    <FormControl sx={{ marginTop: "0px" }} >
                      <FormLabel id="demo-row-radio-buttons-group-label">
                        {
                          // <FormattedLabel id="isApplicantBelowToPovertyLine" />
                        }
                      </FormLabel>
                      <RadioGroup
                      disabled={true}
                        style={{ marginTop: 5 }}
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        row
                        name="infoSentByPost"
                        control={control}
                        value={infoSentByPost}
                        {...register("infoSentByPost")}
                      >
                        <FormControlLabel
                          value={true}
                          control={<Radio />}
                          label={<FormattedLabel id="infoSentByPost" />}
                          name="RadioButton"
                          {...register("infoSentByPost")}
                          error={!!errors.infoSentByPost}
                          helperText={
                            errors?.infoSentByPost
                              ? errors.infoSentByPost.message
                              : null
                          }
                        />
                        <FormControlLabel
                          value={false}
                          control={<Radio />}
                          label={<FormattedLabel id="infoProvidedByPerson" />}
                          name="RadioButton"
                          {...register("infoSentByPost")}
                          error={!!errors.infoSentByPost}
                          helperText={
                            errors?.infoSentByPost
                              ? errors.infoSentByPost.message
                              : null
                          }
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  {watch("infoSentByPost") === true && (
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <FormControl disabled={true}
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        variant="standard"
                        // error={showPostTypeErr && !watch("postType")}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="postalService" required />
                        </InputLabel>
                        <Controller
                        disabled={true}
                          render={({ field }) => (
                            <Select
                            disbled
                              sx={{ width: "100%" }}
                              fullWidth
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="postalService" />}
                            >
                              {PostData &&
                                PostData?.map((m, index) => (
                                  <MenuItem key={index} value={m.postNm}>
                                    {language == "en" ? m.postNm : m.postNm}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="postType"
                          control={control}
                          defaultValue=""
                        />
                      </FormControl>
                    </Grid>
                  )}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <FormControl
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  variant="standard"
                  error={!!errors.selectedReturnMediaKey}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="requiredInfoDeliveryDetails" required />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled
                        sx={{ width: "100%" }}
                        fullWidth
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label={
                          <FormattedLabel id="selectedReturnMedia" required />
                        }
                      >
                        {mediumMaster &&
                          mediumMaster?.map((m, index) => (
                            <MenuItem key={index} value={m.id}>
                              {language == "en"
                                ? m.nameOfMedium
                                : m.nameOfMediumMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="selectedReturnMediaKey"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.selectedReturnMediaKey
                      ? errors.selectedReturnMediaKey.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
             
              {/* is bpl radio button */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <FormControl flexDirection="row" style={{ marginTop: "0px" }}>
                  <FormLabel
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    id="demo-row-radio-buttons-group-label"
                  >
                    {<FormattedLabel id="isApplicantBelowToPovertyLine" />}
                  </FormLabel>

                  <Controller
                    disabled={true}
                    InputLabelProps={{ shrink: true }}
                    name="isApplicantBelowToPovertyLine"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        value={isBplval}
                        selected={field.value}
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                      >
                        <FormControlLabel
                          value="true"
                          control={<Radio />}
                          label={<FormattedLabel id="yes" />}
                          error={!!errors.isApplicantBelowToPovertyLine}
                          helperText={
                            errors?.isApplicantBelowToPovertyLine
                              ? errors.isApplicantBelowToPovertyLine.message
                              : null
                          }
                        />
                        <FormControlLabel
                          value="false"
                          control={<Radio />}
                          label={<FormattedLabel id="no" />}
                          error={!!errors.isApplicantBelowToPovertyLine}
                          helperText={
                            errors?.isApplicantBelowToPovertyLine
                              ? errors.isApplicantBelowToPovertyLine.message
                              : null
                          }
                        />
                      </RadioGroup>
                    )}
                  />
                </FormControl>
              </Grid>
              {/* bpl card no */}
              {isBplval && (
                <>
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      id="standard-textarea"
                      label={<FormattedLabel id="bplCardNo" />}
                      multiline
                      variant="standard"
                      {...register("bplCardNo")}
                      error={!!errors.bplCardNo}
                      helperText={
                        errors?.bplCardNo ? errors.bplCardNo.message : null
                      }
                    />
                  </Grid>
                  {/* years of issues */}
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      id="standard-textarea"
                      label={<FormattedLabel id="yearOfIssues" />}
                      multiline
                      variant="standard"
                      {...register("yearOfIssues")}
                      error={!!errors.yearOfIssues}
                      helperText={
                        errors?.yearOfIssues
                          ? errors.yearOfIssues.message
                          : null
                      }
                    />
                  </Grid>
                  {/* issuing authority */}
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      id="standard-textarea"
                      label={<FormattedLabel id="issuingAuthority" />}
                      multiline
                      variant="standard"
                      {...register("issuingAuthority")}
                      error={!!errors.issuingAuthority}
                      helperText={
                        errors?.issuingAuthority
                          ? errors.issuingAuthority.message
                          : null
                      }
                    />
                  </Grid>
                </>
              )}
              {isBplval && (
                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={6}
                  sm={6}
                  xs={12}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "15px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FormattedLabel id="bplCardDoc" />
                  </div>
                  <UploadButton1
                    appName="RTI"
                    disabled
                    serviceName="RTI-Application"
                    filePath={setBPLDocument}
                    fileName={bplDocument}
                  />
                </Grid>
              )}

             
            
              {applications.isTransfer && (
                <Grid item spacing={3} xl={12} lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    disabled={true}
                    InputLabelProps={{ shrink: true }}
                    id="standard-textarea"
                    label={<FormattedLabel id="forwardRemark" />}
                    multiline
                    variant="standard"
                    {...register("forwardRemark")}
                    error={!!errors.forwardRemark}
                    helperText={
                      errors?.forwardRemark
                        ? errors.forwardRemark.message
                        : null
                    }
                  />
                </Grid>
              )}
            </Grid>
            {applicationDoc.length != 0 && (
              <div>
                <Box>
                  <Grid
                    container
                    className={commonStyles.title}
                    style={{ marginBottom: "8px" }}
                  >
                    <Grid item xs={12}>
                      <h3
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          marginRight: "2rem",
                        }}
                      >
                        <FormattedLabel id="RTIApplicationdoc" />
                      </h3>
                    </Grid>
                  </Grid>
                </Box>
                <DataGrid
                  autoHeight
                  sx={{
                    padding: "10px",
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
                  density="standard"
                  pagination
                  paginationMode="server"
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  rows={applicationDoc}
                  columns={docColumns}
                />
              </div>
            )}

            {(watch("isRejected") === "false" ||
              applicationCurrentStatus === 15) && (
              <>
                <Box>
                  <Grid container className={commonStyles.title}>
                    <Grid item xs={12}>
                      <h3
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          marginRight: "2rem",
                        }}
                      >
                        <FormattedLabel id="rejectedSection" />
                      </h3>
                    </Grid>
                  </Grid>
                </Box>
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                  <FormControl
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "98%" }}
                    variant="standard"
                    error={!!errors.rejectCategoryKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="rejectCat" required />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          disabled={true}
                          sx={{ width: "100%" }}
                          fullWidth
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label={<FormattedLabel id="rejectCat" required />}
                        >
                          {rejectedCat &&
                            rejectedCat?.map((m, index) => (
                              <MenuItem key={index} value={m.id}>
                                {language == "en" ? m.rejectCat : m.rejectCatMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="rejectCategoryKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.rejectCategoryKey
                        ? errors.rejectCategoryKey.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    disabled={true}
                    label={<FormattedLabel id="rejectedRemark" />}
                    id="standard-textarea"
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "98%" }}
                    variant="standard"
                    multiline
                    inputProps={{ maxLength: 500 }}
                    {...register("rejectRemark")}
                    error={!!errors.rejectRemark}
                    helperText={
                      errors?.rejectRemark ? errors.rejectRemark.message : null
                    }
                  />
                </Grid>
                <DataGrid
                  autoHeight
                  sx={{
                    padding: "10px",
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
                  density="standard"
                  pagination
                  paginationMode="server"
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  rows={rejectedDocument}
                  columns={docColumns}
                />
              </>
            )}

            {loiDetails.length != 0 && (
              <div>
                <Box>
                  <Grid container className={commonStyles.title}>
                    <Grid item xs={12}>
                      <h3
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          marginRight: "2rem",
                        }}
                      >
                        <FormattedLabel id="loiGenerate" />
                      </h3>
                    </Grid>
                  </Grid>
                </Box>
                <Grid container spacing={3} sx={{ padding: "2rem" }}>
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      id="standard-textarea"
                      label={<FormattedLabel id="serviceName" />}
                      multiline
                      variant="standard"
                      {...register("serviceName")}
                      error={!!errors.serviceName}
                      helperText={
                        errors?.serviceName ? errors.serviceName.message : null
                      }
                    />
                  </Grid>
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      label={<FormattedLabel id="departmentKey" />}
                      id="standard-textarea"
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      variant="standard"
                      {...register("departmentKey")}
                      error={!!errors.departmentKey}
                      helperText={
                        errors?.departmentKey
                          ? errors.departmentKey.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      disabled={true}
                      value={totalAmount}
                      InputLabelProps={{ shrink: true }}
                      label={<FormattedLabel id="totalAmount" />}
                      id="standard-textarea"
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      variant="standard"
                      {...register1("totalAmount")}
                      error={!!error2.totalAmount}
                      helperText={
                        error2?.totalAmount ? error2.totalAmount.message : null
                      }
                    />
                  </Grid>
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      disabled={true}
                      label={<FormattedLabel id="remark" />}
                      id="standard-textarea"
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      variant="standard"
                      multiline
                      inputProps={{ maxLength: 500 }}
                      InputLabelProps={{ shrink: true }}
                      {...register1("remarks")}
                      error={!!error2.remarks}
                      helperText={
                        error2?.remarks ? error2.remarks.message : null
                      }
                    />
                  </Grid>
                  <DataGrid
                    autoHeight
                    sx={{
                      padding: "10px",
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
                    density="standard"
                    pagination
                    paginationMode="server"
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    rows={rateChartList}
                    columns={rateColumns}
                  />
                </Grid>
              </div>
            )}
            {childDept.length != 0 && (
              <div>
                <Box>
                  <Grid container className={commonStyles.title}>
                    <Grid item xs={12}>
                      <h3
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          marginRight: "2rem",
                        }}
                      >
                        <FormattedLabel id="childDeptTitle" />
                      </h3>
                    </Grid>
                  </Grid>
                </Box>
                <DataGrid
                  autoHeight
                  sx={{
                    padding: "1rem",
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
                  density="comfortable"
                  pagination
                  paginationMode="server"
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  rows={childDept}
                  columns={childDeptColumns}
                />
              </div>
            )}
            {(applicationCurrentStatus === 11 ||
              applicationCurrentStatus === 14) && (
              <>
                <Box>
                  <Grid container className={commonStyles.title}>
                    <Grid item xs={12}>
                      <h3
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          marginRight: "2rem",
                        }}
                      >
                        <FormattedLabel id="applicationinfoReady" />
                      </h3>
                    </Grid>
                  </Grid>
                </Box>
                <Box>
                  <Box>
                    <Grid container spacing={3} sx={{ padding: "1rem" }}>
                      {" "}
                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          disabled={true}
                          InputLabelProps={{ shrink: true }}
                          id="standard-textarea"
                          label={<FormattedLabel id="informationRemark" />}
                          multiline
                          inputProps={{ maxLength: 500 }}
                          variant="standard"
                          {...register("infoRemark")}
                          error={!!errors.infoRemark}
                          helperText={
                            errors?.infoRemark
                              ? errors.infoRemark.message
                              : null
                          }
                        />
                      </Grid>
                      {applicationCurrentStatus === 11 && (
                        <>
                          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <TextField
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              disabled={true}
                              InputLabelProps={{ shrink: true }}
                              id="standard-textarea"
                              label={<FormattedLabel id="completeRemark" />}
                              multiline
                              inputProps={{ maxLength: 500 }}
                              variant="standard"
                              {...register("remarks")}
                              error={!!errors.remarks}
                              helperText={
                                errors?.remarks ? errors.remarks.message : null
                              }
                            />
                          </Grid>
                        </>
                      )}
                      <>
                        {applications.infoPages && (
                          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <TextField
                              label={<FormattedLabel id="noOfPages" />}
                              id="standard-textarea"
                              disabled={true}
                              type="number"
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              variant="standard"
                              {...register("infoPages")}
                              error={!!errors.infoPages}
                              helperText={
                                errors?.infoPages
                                  ? errors.infoPages.message
                                  : null
                              }
                            />
                          </Grid>
                        )}
                      </>
                      <>
                        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                          <TextField
                            disabled={true}
                            InputLabelProps={{ shrink: true }}
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-textarea"
                            label={
                              applicationCurrentStatus === 14 ? (
                                <FormattedLabel id="infoReadyDate" />
                              ) : (
                                <FormattedLabel id="completeDate" />
                              )
                            }
                            multiline
                            variant="standard"
                            {...register("applicationDate")}
                            error={!!errors.applicationDate}
                            helperText={
                              errors?.applicationDate
                                ? errors.applicationDate.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                          <TextField
                            disabled={true}
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-textarea"
                            label={<FormattedLabel id="outwardNumber" />}
                            multiline
                            variant="standard"
                            {...register("outwardNumberTxt")}
                            error={!!errors.outwardNumberTxt}
                            helperText={
                              errors?.outwardNumberTxt
                                ? errors.outwardNumberTxt.message
                                : null
                            }
                          />
                        </Grid>
                        {applicationCurrentStatus === 11 && (
                          <Grid item xl={12} lg={12} md={12} sm={12}>
                            <FormControl
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              variant="standard"
                              error={!!errors.informationReturnMedia1}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                <FormattedLabel
                                  id="informationReturnMedia"
                                  required
                                />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    disabled
                                    sx={{ width: "100%" }}
                                    fullWidth
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label={
                                      <FormattedLabel
                                        id="informationReturnMedia"
                                        required
                                      />
                                    }
                                  >
                                    {mediumMaster &&
                                      mediumMaster?.map((m, index) => (
                                        <MenuItem key={index} value={m.id}>
                                          {language == "en"
                                            ? m.nameOfMedium
                                            : m.nameOfMediumMr}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name="informationReturnMedia1"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText>
                                {errors?.informationReturnMedia1
                                  ? errors.informationReturnMedia1.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                        )}
                      </>
                    </Grid>
                  </Box>
                </Box>
              </>
            )}
            {completeAttach.length != 0 && (
              <div>
                <DataGrid
                  autoHeight
                  sx={{
                    margin: "10px",
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
                  density="standard"
                  pagination
                  paginationMode="server"
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  rows={completeAttach}
                  columns={docColumns}
                />
              </div>
            )}
          </>

          {/* *******************************Hearing Schedule******************************* */}
          {dataSource.length != 0 && (
            <div>
              <Box>
                <Grid container className={commonStyles.title}>
                  <Grid item xs={12}>
                    <h3
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        marginRight: "2rem",
                      }}
                    >
                      <FormattedLabel id="hearingSchedule" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
              <DataGrid
                sx={{
                  marginTop: 2,
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
                autoHeight
                density="density"
                rowsPerPageOptions={[5]}
                rows={dataSource}
                columns={columns}
              />
            </div>
          )}

          <Box>
            <Box>
              <Grid container sx={{ padding: "10px" }}>
                {(statusVal == 3 || statusVal == 6) && (
                  <>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={4}
                      sm={4}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="error"
                        style={{ borderRadius: "20px" }}
                        size="small"
                        onClick={() => cancellButton()}
                      >
                        <FormattedLabel id="back" />
                      </Button>
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={4}
                      sm={4}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ borderRadius: "20px" }}
                        size="small"
                        onClick={onPrint}
                      >
                        <FormattedLabel id="print" />
                      </Button>
                    </Grid>
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={4}
                      sm={4}
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
                        style={{ borderRadius: "20px" }}
                        size="small"
                        // endIcon={<ExitToAppIcon />}
                        onClick={() => setHearingSchedule(true)}
                      >
                        <FormattedLabel id="hearingSchedule" />
                      </Button>
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>
          </Box>
          {(statusVal === 11 || statusVal == 14) && (
            <>
              <Box>
                <Grid container className={commonStyles.title}>
                  <Grid item xs={12}>
                    <h3
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        marginRight: "2rem",
                      }}
                    >
                      <FormattedLabel id="decisionDetails" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
              <Grid container spacing={3} sx={{ padding: "1rem" }}>
                <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                  <FormControl
                    sx={{
                      m: { xs: 0, md: 1 },
                      backgroundColor: "white",
                      minWidth: "100%",
                    }}
                    error={!!errors.toDate}
                  >
                    <Controller
                      control={control}
                      name="dateOfOfficialorderAgainstAppeal"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            disabled
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 14 }}>
                                {
                                  <FormattedLabel id="dateOfOfficialorderAgainstAppeal" />
                                }
                              </span>
                            }
                            minDate={dateOfappeal}
                            value={field.value}
                            onChange={(date) => field.onChange(date)}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                sx={{ width: "100%" }}
                                {...params}
                                size="small"
                                variant="standard"
                                fullWidth
                                InputLabelProps={{
                                  style: {
                                    fontSize: 12,
                                  },
                                }}
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>
                      {errors?.dateOfOfficialorderAgainstAppeal
                        ? errors.dateOfOfficialorderAgainstAppeal.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid
                  item
                  xl={8}
                  lg={8}
                  md={8}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    disabled={true}
                    InputLabelProps={{ shrink: true }}
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    id="standard-textarea"
                    inputProps={{ maxLength: 500 }}
                    label={<FormattedLabel id="decisiontakenInHearing" />}
                    multiline
                    variant="standard"
                    {...register2("decisionDetails")}
                    error={!!error3.decisionDetails}
                    helperText={
                      error3?.decisionDetails
                        ? error3.decisionDetails.message
                        : null
                    }
                  />
                </Grid>

                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={4}
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
                    disabled={true}
                    InputLabelProps={{ shrink: true }}
                    id="standard-textarea"
                    inputProps={{ maxLength: 100 }}
                    label={<FormattedLabel id="decisionStatus" />}
                    multiline
                    variant="standard"
                    {...register2("decisionStatus")}
                    error={!!error3.decisionStatus}
                    helperText={
                      error3?.decisionStatus
                        ? error3.decisionStatus.message
                        : null
                    }
                  />
                </Grid>
                <Grid
                  item
                  xl={8}
                  lg={8}
                  md={8}
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
                    disabled={true}
                    InputLabelProps={{ shrink: true }}
                    id="standard-textarea"
                    label={<FormattedLabel id="remark" />}
                    multiline
                    inputProps={{ maxLength: 500 }}
                    variant="standard"
                    {...register2("remarks")}
                    error={!!error3.remarks}
                    helperText={error3?.remarks ? error3.remarks.message : null}
                  />
                </Grid>
              </Grid>

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
                  marginBottom: 5,
                }}
              >
                <DataGrid
                  autoHeight
                  sx={{
                    padding: "10px",
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
                  density="standard"
                  rowsPerPageOptions={[5]}
                  rows={decisionDetailsrow}
                  columns={docColumns}
                />
              </Grid>
            </>
          )}
          {(statusVal === 11 ||
            statusVal === 2 ||
            statusVal === 7 ||
            statusVal === 8) && (
            <>
              <Grid container spacing={3} sx={{ padding: "1rem" }}>
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
                    color="error"
                    style={{ borderRadius: "20px" }}
                    size="small"
                    onClick={() => cancellButton()}
                  >
                    <FormattedLabel id="back" />
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
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ borderRadius: "20px" }}
                    size="small"
                    onClick={onPrint}
                  >
                    <FormattedLabel id="print" />
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
        </Paper>
      </ThemeProvider>

      {/* modal for Hearing Schedule */}
      <Modal
        scrollable={true}
        title="Modal For Hearing Schedule"
        open={isHearingSchedule}
        onClose={handleCancel4}
        footer=""
        sx={{
          padding: 5,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            overflowY: "scroll",
            // width: "80%",
            height: "90%",
            backgroundColor: "white",
          }}
        >
          <>
            {isHearingScheduleLoading && <CommonLoader />}
            <Box>
              <Grid
                container
                className={commonStyles.title}
                style={{ marginTop: "1rem" }}
              >
                <Grid item xs={12}>
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      marginRight: "2rem",
                    }}
                  >
                    <FormattedLabel id="hearingSchedule" />
                  </h3>
                </Grid>
              </Grid>
            </Box>
            <FormProvider {...methods2}>
              <form onSubmit={handleSubmit2(onSubmitHearing)}>
                <Grid container spacing={3} sx={{ padding: "2rem" }}>
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      id="standard-textarea"
                      label={<FormattedLabel id="rtiApplicationNO" />}
                      multiline
                      variant="standard"
                      {...register1("rtiapplicationNo")}
                      error={!!error2.rtiapplicationNo}
                      helperText={
                        error2?.rtiapplicationNo
                          ? error2.rtiapplicationNo.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      id="standard-textarea"
                      label={<FormattedLabel id="appealApplicationNo" />}
                      multiline
                      variant="standard"
                      {...register("appealApplicationNo")}
                      error={!!error2.appealApplicationNo}
                      helperText={
                        error2?.appealApplicationNo
                          ? error2.appealApplicationNo.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      id="standard-textarea"
                      label={<FormattedLabel id="applicantName" />}
                      multiline
                      variant="standard"
                      {...register1("applicantName")}
                      error={!!error2.applicantName}
                      helperText={
                        error2?.applicantName
                          ? error2.applicantName.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      id="standard-textarea"
                      label={<FormattedLabel id="description" />}
                      multiline
                      variant="standard"
                      {...register1("description")}
                      error={!!error2.description}
                      helperText={
                        error2?.description ? error2.description.message : null
                      }
                    />
                  </Grid>
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <FormControl
                      sx={{
                        m: { xs: 0, md: 1 },
                        minWidth: "100%",
                        backgroundColor: "white",
                      }}
                      error={!!error2.hearingDate}
                    >
                      <Controller
                        InputLabelProps={{ shrink: true }}
                        control={control}
                        defaultValue={currDate}
                        name="hearingDate"
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              minDate={currDate}
                              inputFormat="DD-MM-YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  {
                                    <FormattedLabel
                                      id="scheduleDate"
                                      required
                                    />
                                  }
                                </span>
                              }
                              {...register1("hearingDate")}
                              disabled={
                                hearingDetails.status != 11 &&
                                hearingDetails.status != 9
                                  ? false
                                  : true
                              }
                              value={selectedDate}
                              onChange={handleDateChange}
                              selected={field.value}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  fullWidth
                                  {...register1("hearingDate")}
                                  variant="standard"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {error2?.hearingDate
                          ? error2.hearingDate.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <FormControl
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      error={!!error2.hearingTime}
                    >
                      <Controller
                        InputLabelProps={{ shrink: true }}
                        name="hearingTime"
                        control={control}
                        {...register1("hearingTime")}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <TimePicker
                              id="standard-textarea"
                              disabled={
                                hearingDetails.status != 11 &&
                                hearingDetails.status != 9
                                  ? false
                                  : true
                              }
                              value={selectedTime}
                              {...register1("hearingTime")}
                              label={
                                <span style={{ fontSize: 16 }}>
                                  {
                                    <FormattedLabel
                                      id="scheduleTime"
                                      required
                                    />
                                  }
                                </span>
                              }
                              onChange={handleTimeChange}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  fullWidth
                                  {...register1("hearingTime")}
                                  variant="standard"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {error2?.hearingTime
                          ? error2.hearingTime.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      label={<FormattedLabel id="venueForHearing" required />}
                      id="standard-textarea"
                      disabled={
                        hearingDetails.status != 11 &&
                        hearingDetails.status != 9
                          ? false
                          : true
                      }
                      multiline
                      inputProps={{ maxLength: 50 }}
                      InputLabelProps={{ shrink: true }}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      variant="standard"
                      {...register1("venue")}
                      error={!!error2.venue}
                      helperText={error2?.venue ? error2.venue.message : null}
                    />
                  </Grid>
                  {dataSource.length != 0 && (
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                      <TextField
                        label={<FormattedLabel id="remark" />}
                        id="standard-textarea"
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        variant="standard"
                        disabled={
                          hearingDetails.status != 11 &&
                          hearingDetails.status != 9
                            ? false
                            : true
                        }
                        multiline
                        inputProps={{ maxLength: 500 }}
                        InputLabelProps={{ shrink: true }}
                        {...register1("hearingRemark")}
                        error={!!error2.hearingRemark}
                        helperText={
                          error2?.hearingRemark
                            ? error2.hearingRemark.message
                            : null
                        }
                      />
                    </Grid>
                  )}

                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xl={
                        hearingDetails.status == 11 ||
                        hearingDetails.status == 9
                          ? 12
                          : dataSource.length === 0
                          ? 6
                          : 4
                      }
                      lg={
                        hearingDetails.status == 11 ||
                        hearingDetails.status == 9
                          ? 12
                          : dataSource.length === 0
                          ? 6
                          : 4
                      }
                      md={
                        hearingDetails.status == 11 ||
                        hearingDetails.status == 9
                          ? 12
                          : dataSource.length === 0
                          ? 6
                          : 4
                      }
                      sm={12}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 2,
                      }}
                    >
                      <Button
                        // sx={{ marginRight: 8 }}
                        variant="contained"
                        color="error"
                        size="small"
                        endIcon={<ClearIcon />}
                        onClick={() => handleCancel4()}
                      >
                        <FormattedLabel id="closeModal" />
                      </Button>
                    </Grid>
                    {showDisabled === false && (
                      <Grid
                        item
                        xl={6}
                        lg={6}
                        md={6}
                        sm={12}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 2,
                        }}
                      >
                        <Button
                          // sx={{ marginRight: 8 }}
                          type="submit"
                          size="small"
                          variant="contained"
                          color="success"
                          endIcon={<SaveIcon />}
                        >
                          <FormattedLabel id="hearingSchedule" />
                        </Button>
                      </Grid>
                    )}

                    {dataSource.length != 0 &&
                      dataSource.length != 3 &&
                      hearingDetails.status != 11 &&
                      hearingDetails.status !== 9 && (
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={4}
                          sm={12}
                          xs={12}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 2,
                          }}
                        >
                          <Button
                            // sx={{ marginRight: 8 }}
                            type="submit"
                            size="small"
                            variant="contained"
                            color="primary"
                            disabled={
                              watch2("hearingRemark") &&
                              watch2("venue") &&
                              watch2("hearingTime") &&
                              watch2("hearingDate")
                                ? false
                                : true
                            }
                            // endIcon={<ExitToAppIcon />}
                            onClick={() => {
                              setHearingSchedule(true);
                            }}
                          >
                            <FormattedLabel id="hearingReschedule" />
                          </Button>
                        </Grid>
                      )}

                    {hearingDetails.status !== 11 &&
                      hearingDetails.status !== 9 &&
                      dataSource.length != 0 && (
                        <Grid
                          item
                          xl={dataSource.length == 3 ? 6 : 4}
                          lg={dataSource.length == 3 ? 6 : 4}
                          md={dataSource.length == 3 ? 6 : 4}
                          sm={12}
                          xs={12}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 2,
                          }}
                        >
                          <Button
                            // sx={{ marginRight: 8 }}
                            variant="contained"
                            size="small"
                            color="success"
                            // endIcon={<ExitToAppIcon />}
                            onClick={() => {
                              setHearingSchedule(false);
                              setDecisionEntry(true);
                            }}
                          >
                            <FormattedLabel id="decisionEntry" />
                          </Button>
                        </Grid>
                      )}
                  </Grid>
                </Grid>
              </form>
            </FormProvider>
          </>
        </Box>
      </Modal>

      {/*modal for decision */}
      <Modal
        title="Modal For Desicion Entry"
        open={isDecisionEntry}
        onClose={handleCancel5} // ISKI WAJHASE KAHI BHI CLICK KRNE PER MODAL CLOSE HOTA HAI
        footer=""
        style={{
          maxheight: "70%",
          margin: "50px",
        }}
      >
        <Box
          sx={{
            overflowY: "scroll",
            backgroundColor: "white",
            height: "80vh",
          }}
        >
          <Box>
            <>
              {isDecisionLoading && <CommonLoader />}

              <Box>
                <Grid
                  container
                  className={commonStyles.title}
                  style={{ marginTop: "1rem" }}
                >
                  <Grid item xs={12}>
                    <h3
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        marginRight: "2rem",
                      }}
                    >
                      <FormattedLabel id="decisionEntry" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
              <FormProvider {...methods2}>
                <form onSubmit={handleSubmit3(onSubmitDecision)}>
                  <Grid container spacing={2} sx={{ padding: "1rem" }}>
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        disabled={true}
                        InputLabelProps={{ shrink: true }}
                        id="standard-textarea"
                        label={<FormattedLabel id="rtiApplicationNO" />}
                        multiline
                        variant="standard"
                        {...register1("rtiapplicationNo")}
                        error={!!error2.rtiapplicationNo}
                        helperText={
                          error2?.rtiapplicationNo
                            ? error2.rtiapplicationNo.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        disabled={true}
                        InputLabelProps={{ shrink: true }}
                        id="standard-textarea"
                        label={<FormattedLabel id="applicationNo" />}
                        multiline
                        variant="standard"
                        {...register("appealApplicationNo")}
                        error={!!error2.applicationNo}
                        helperText={
                          error2?.applicationNo
                            ? error2.applicationNo.message
                            : null
                        }
                      />
                    </Grid>

                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <FormControl
                        sx={{
                          m: { xs: 0, md: 1 },
                          backgroundColor: "white",
                          minWidth: "100%",
                        }}
                        error={!!errors.toDate}
                      >
                        <Controller
                          control={control}
                          name="dateOfOfficialorderAgainstAppeal"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 14 }}>
                                    {
                                      <FormattedLabel id="dateOfOfficialorderAgainstAppeal" />
                                    }
                                  </span>
                                }
                                minDate={dateOfappeal}
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    sx={{ width: "100%" }}
                                    {...params}
                                    size="small"
                                    variant="standard"
                                    fullWidth
                                    InputLabelProps={{
                                      style: {
                                        fontSize: 12,
                                      },
                                    }}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.dateOfOfficialorderAgainstAppeal
                            ? errors.dateOfOfficialorderAgainstAppeal.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-textarea"
                        label={
                          <FormattedLabel
                            id="decisiontakenInHearing"
                            required
                          />
                        }
                        multiline
                        variant="standard"
                        inputProps={{ maxLength: 500 }}
                        {...register2("decisionDetails")}
                        error={!!error3.decisionDetails}
                        helperText={
                          error3?.decisionDetails
                            ? error3.decisionDetails.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-textarea"
                        label={<FormattedLabel id="decisionStatus" required />}
                        variant="standard"
                        inputProps={{ maxLength: 100 }}
                        multiline
                        {...register2("decisionStatus")}
                        error={!!error3.decisionStatus}
                        helperText={
                          error3?.decisionStatus
                            ? error3.decisionStatus.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-textarea"
                        label={<FormattedLabel id="remark" required />}
                        multiline
                        inputProps={{ maxLength: 500 }}
                        variant="standard"
                        {...register2("decisionRemarks")}
                        error={!!error3.decisionRemarks}
                        helperText={
                          error3?.decisionRemarks
                            ? error3.decisionRemarks.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                      <div style={{ display: "block" }}>
                        <FormattedLabel id="decisionOrderAttach" required />
                        <br />

                        <UploadButton
                          sx={{ width: 20 }}
                          appName="RTI"
                          serviceName="RTI-Appeal"
                          filePath={setDocument}
                          fileName={document}
                        />
                      </div>
                    </Grid>
                    <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                      <div style={{ display: "block" }}>
                        <FormattedLabel
                          id="updloadScanInfoDelivered"
                          required
                        />
                        <br />
                        <UploadButton
                          sx={{ width: 20 }}
                          appName="RTI"
                          serviceName="RTI-Appeal"
                          filePath={setDocument1}
                          fileName={document1}
                        />
                      </div>
                    </Grid>
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xl={6}
                        lg={6}
                        md={6}
                        sm={12}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 2,
                        }}
                      >
                        <Button
                          // sx={{ marginRight: 8 }}
                          variant="contained"
                          color="error"
                          size="small"
                          endIcon={<ClearIcon />}
                          onClick={() => handleCancel5()}
                        >
                          <FormattedLabel id="closeModal" />
                        </Button>
                      </Grid>
                      <Grid
                        item
                        xl={6}
                        lg={6}
                        md={6}
                        sm={12}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 2,
                        }}
                      >
                        <Button
                          // sx={{ marginRight: 8 }}
                          type="submit"
                          size="small"
                          variant="contained"
                          color="success"
                          disabled={
                            document === null || document1 === null
                              ? true
                              : false
                          }
                          endIcon={<SaveIcon />}
                        >
                          <FormattedLabel id="save" />
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </form>
              </FormProvider>
            </>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default EntryForm;
