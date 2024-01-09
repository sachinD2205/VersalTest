import {
  Box,
  FormLabel,
  Radio,
  RadioGroup,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  Button,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Slide,
  Checkbox,
  ThemeProvider,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import DownloadIcon from "@mui/icons-material/Download";
import theme from "../../../../../theme";
import CheckIcon from "@mui/icons-material/Check";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import { useReactToPrint } from "react-to-print";
import {
  DatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import {
  EncryptData,
  DecryptData,
} from "../../../../../components/common/EncryptDecrypt/index.js";
import {
  Controller,
  FormProvider,
  useForm,
  useFieldArray,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel.js";
import { useState } from "react";
import axios from "axios";
import { useEffect, useRef } from "react";
import moment from "moment";
import swal from "sweetalert";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import trnRtiApplicationSchema from "../../../../../containers/schema/rtiOnlineSystemSchema/trnRtiApplicationSchema.js";
import urls from "../../../../../URLS/urls.js";
import loiGeneratedSchema from "../../../../../containers/schema/rtiOnlineSystemSchema/loiGeneratedSchema.js";
import UploadButton from "../../../../../components/fileUpload/UploadButton";
import UploadButton1 from "../../../Document/UploadButton1.js";
import { useSelector } from "react-redux";
import { manageStatus } from "../../../../../components/rtiOnlineSystem/commonStatus/manageEnMr";
import roleId from "../../../../../components/rtiOnlineSystem/commonRoleId";
import BreadcrumbComponent from "../../../../../components/common/BreadcrumbComponent";
import commonStyles from "../../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../../util/commonErrorUtil.js";
import PostData from '../../postJson.json'

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
    resolver: yupResolver(trnRtiApplicationSchema),
    mode: "onChange",
  });
  const [rateChartList, setRateChartList] = useState([]);
  const componentRef = useRef(null);
  const {
    register: register1,
    handleSubmit: handleSubmit2,
    methods: methods2,
    watch: watch1,
    control: control2,
    setValue: setValue1,
    formState: { errors: error2 },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(loiGeneratedSchema),
  });
  const [isMultiDeptLoading, setMultiDeptLoading] = useState(false);
  const [officeLocForChild, setOfficeLocForChild] = useState([]);
  const [depatForChild, setDeptForChild] = useState([]);
  const [rejectedDocument, setRejectedDoc] = useState([]);
  const [pageNo, setPageNo] = useState();
  const [mediumMaster, setMediumMaster] = useState([]);
  const [rejectedCat, setRejectedCategory] = useState([]);
  const [amount, setRatePerPage] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isModalOpenForResolved, setIsModalOpenForResolved] = useState(false);
  const [isMultiDept, setIsMultiDept] = useState(false);
  const [zoneDetails, setZoneDetails] = useState();
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartmentList] = useState([]);
  const router = useRouter();
  const inputState = getValues("inputState");
  const [applications, setApplicationDetails] = useState([]);
  const [document, setDocument] = useState();
  const [bplDocument, setBPLDocument] = useState();

  const [documentThirdParty, setThirdPartyDocument] = useState();
  const [isBplval, setIsBpl] = useState(null);
  const [appReceievedDetails, setApplicationReceivedDetails] = useState(null);
  const [statusVal, setStatusVal] = useState(null);
  const [genderDetails, setGenderDetails] = useState([]);
  const [chargeTypeDetails, setChargeTypeDetails] = useState([]);
  let user = useSelector((state) => state.user.user);
  const [loiDetails, setLoiDetails] = useState([]);
  const [applicationId, setApplicationID] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [childDept, setChildDept] = useState([]);
  const [completeAttach, setCompleteAttach] = useState([]);
  const [applicationNumber, setApplicationNumber] = useState(null);
  const [hasDependant, setHasDependant] = useState(false);
  const logedInUser = localStorage.getItem("loggedInUser");
  const language = useSelector((state) => state?.labels?.language);
  const [dependDept, setDependDepartments] = useState([]);
  const [dependantDept, setDependantDepartments] = useState([]);
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );
  const [statusAll, setStatus] = useState([]);
  const [dependDeptId, setDependantDept] = useState(null);
  const [officeLocationDetails, setOfficeLocationDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roleIds;
  const [chargeTypeList, setChargeTypeList] = useState([]);
  const [serviceChargeTypeList, setServiceChargeTypeList] = useState([]);
  const [isLoiLoading, setIsLoiLoading] = useState(false);
  const [rejectRemarkValue, setRejectRemarkValue] = useState("");
  const [selectedRejectCategory, setSelectedRejectCategory] = useState("");
  const [buttonInputState, setButtonInputState] = useState(false);
  const [showError, setShowError] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [ID, setIDd] = useState(undefined);
  const [amountValue, setAmountValue] = useState([]);
  const [rateData, setRateData] = useState([]);
  const [slideChecked, setSlideChecked] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [serviceId, setServiceId] = useState([]);
  const [hanadleStudent, setHanadleStudent] = useState([]);
  const [dependantData, setDependantData] = useState([]);
  const [infoSentByPost, setInfoSentByPost] = useState(false);
  const headers = { Authorization: `Bearer ${user?.token}` };

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

  const handleCategoryChange = (value) => {
    setSelectedRejectCategory(value);
  };



  const addRateChart = () => {
    if (
      watch("amount") === "" ||
      watch("amount") === undefined ||
      watch("unit") === "" ||
      watch("unit") === undefined ||
      watch("serviceChargeTypeId") === "" ||
      watch("serviceChargeTypeId") === undefined
    ) {
      setShowError(true);
    } else {
      if (btnSaveText === "Save") {
        setRateData((obj) => [
          ...obj,
          {
            amount: Number(watch("amount")),
            unit: Number(watch("unit")),
            serviceChargeTypeId: watch("serviceChargeTypeId"),
            serviceChargeTypeName:
              chargeTypeList &&
              chargeTypeList.find(
                (obj) => obj.id === watch("serviceChargeTypeId")
              )?.serviceChargeType,
            srNo: amountValue?.length + 1,
            id: amountValue?.length + 1,
          },
        ]);
        setAmountValue((obj) => [
          ...obj,
          {
            amount: watch("amount"),
            unit: watch("unit"),
            serviceChargeTypeId: watch("serviceChargeTypeId"),
            serviceChargeTypeName:
              chargeTypeList &&
              chargeTypeList.find(
                (obj) => obj.id === watch("serviceChargeTypeId")
              )?.serviceChargeType,
            activeFlag: "Y",
            srNo: amountValue?.length + 1,
            id: amountValue?.length + 1,
            addUpdate: "Add",
          },
        ]);
        setShowError(false);
        setSlideChecked(false);
        setButtonInputState(false);
        setEditButtonInputState(false);
      } else if (btnSaveText === "Update") {
        amountValue
          ?.filter((temp) => temp.id === ID)
          ?.map((obj, index) => {
            const updatedData = {
              amount: Number(watch("amount")),
              unit: Number(watch("unit")),
              serviceChargeTypeId: watch("serviceChargeTypeId"),
              serviceChargeTypeName:
                chargeTypeList &&
                chargeTypeList.find(
                  (obj) => obj.id === watch("serviceChargeTypeId")
                )?.serviceChargeType,
              activeFlag: "Y",
              id: obj.id,
              srNo: obj.srNo,
            };
            setRateData(update(rateData, ID, updatedData));

            const updatedRecords = update(amountValue, ID, updatedData);
            const updatedRecordsWithSerial = updatedRecords.map(
              (record, index) => {
                return { ...record, srNo: index + 1, id: index + 1 };
              }
            );

            setAmountValue(updatedRecordsWithSerial);
            setShowError(false);
            setSlideChecked(false);
            setEditButtonInputState(false);
            setButtonInputState(false);
            setIDd(undefined);
          });
      }

      setSlideChecked(false);
    }
  };

  const onPrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    const numbers = rateData?.map((obj) => obj.amount);
    const sum = numbers.reduce(
      (accumulator, currentValue) => Number(accumulator) + Number(currentValue),
      0
    );
    setTotalAmount(sum);

    setValue("amount", "");
    setValue("unit", "");
    setValue("serviceChargeTypeId", "");
  }, [rateData]);

  function update(arr, id, updatedData) {
    return arr.map((item, index) =>
      item.id === id ? { ...item, ...updatedData } : item
    );
  }

  const deleteById = (value) => {
    sweetAlert({
      title: language === "en" ? "Delete?" : "हटवा?",
      text:
        language === "en"
          ? "Are you sure you want to delete this charge type ? "
          : "तुमची खात्री आहे की तुम्ही हे शुल्क प्रकार हटवू इच्छिता? ",
      icon: "warning",
      buttons: true,
      buttons: [
        language == "en" ? "No" : "नाही",
        language === "en" ? "Yes" : "होय",
      ],
      allowOutsideClick: false, // Prevent closing on outside click
      allowEscapeKey: false, // Prevent closing on Esc key
      closeOnClickOutside: false,
      dangerMode: true,
    }).then((result) => {
      if (result) {
        const deleteArr = amountValue?.filter((temp) => temp.id != value);
        setRateData(deleteArr);

        const updatedRecordsWithSerial = deleteArr.map((record, index) => {
          return { ...record, srNo: index + 1, id: index + 1 };
        });
        setAmountValue(updatedRecordsWithSerial);
        sweetAlert(
          language === "en"
            ? "Charge type deleted successfully!"
            : "चार्ज प्रकार यशस्वीरित्या हटवला!",
          {
            icon: "success",
            button: language === "en" ? "Ok" : "ठीक आहे",
            allowOutsideClick: false, // Prevent closing on outside click
            allowEscapeKey: false, // Prevent closing on Esc key
            closeOnClickOutside: false,
          }
        ).then((will) => {
          if (will) {
            setValue("amount", "");
            setValue("unit", "");
            setValue("serviceChargeTypeId", "");
          }
        });
      }
    });
  };
  const addRateColumns = [
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

    {
      field: "Action",
      headerName: <FormattedLabel id="actions" />,
      headerAlign: "center",
      align: "center",
      minWidth: 100,
      flex: 1,
      renderCell: (record) => {
        return (
          <>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setIDd(record.id),
                  setButtonInputState(true);
                setSlideChecked(true);
                setValue("serviceChargeTypeId", record.row.serviceChargeTypeId);
                setValue("unit", record.row.unit);
                setValue("amount", record.row.amount);
                setValue(
                  "serviceChargeTypeName",
                  record.row.serviceChargeTypeName
                );
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>

            <IconButton
              disabled={editButtonInputState}
              color="primary"
              onClick={() => deleteById(record.row.id)}
            >
              <DeleteIcon style={{ color: "red", fontSize: 30 }} />
            </IconButton>
          </>
        );
      },
    },
  ];

  let checkAuth = () => {
    return authority?.includes(roleId.RTI_ADHIKARI_ROLE_ID) ? false : true;
  };

  let checkSomeCondition = () => {
    if (
      (logedInUser == "departmentUser" && checkAuth()) ||
      logedInUser === "citizenUser" ||
      logedInUser === "cfcUser"
    ) {
      if (applications.parentId == null) {
        return false;
      } else {
        return true;
      }
    }
  };

  useEffect(() => {
    getAllStatus();
    getRejectedCat();
    getZone();
    getDepartments();
    getSubDepartments();
    getGenders();
    getTransferMedium();
    getServiceChargeTypeOfLoi();
  }, []);

  const getServiceChargeTypeOfLoi = () => {
    axios
      .get(`${urls.CFCURL}/master/serviceChargeType/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setServiceChargeTypeList(r.data.serviceChargeType);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  useEffect(() => {
    if(serviceChargeTypeList.length!=0){
      getChargeTypeOfLoi();
    }
  }, [serviceChargeTypeList]);

  const getChargeTypeOfLoi = () => {
    axios
      .get(
        `${urls.CFCURL}/master/servicecharges/getByServiceId?serviceId=103`,
        {
          headers: headers,
        }
      )
      .then((r) => {
        setChargeTypeList(
          r.data.serviceCharge.map((obj) => {
            return {
              id: obj.id,
              serviceChargeType:
                serviceChargeTypeList &&
                serviceChargeTypeList.find(
                  (temp) => temp.id === obj.serviceChargeType
                )?.serviceChargeType,
              serviceChargeTypeMr:
                serviceChargeTypeList &&
                serviceChargeTypeList.find(
                  (temp) => temp.id === obj.serviceChargeType
                )?.serviceChargeTypeMr,
            };
          })
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  useEffect(() => {
    if (router.query.id != null && router.query.id != undefined)
      getApplicationById();
  }, [router.query.id]);

  useEffect(() => {
    getOfficeLocation();
  }, []);

  useEffect(() => {
    getChargeType();
    getChargeTypes();
  }, []);

  useEffect(() => {
    getSubDepartmentDetails();
  }, [watch("childdepartment")]);

  useEffect(() => {
    if (watch("isLOIGenerated") === "true") {
      setIsModalOpenForResolved(true);
    } else {
      setIsModalOpenForResolved(false);
    }
  }, [watch("isLOIGenerated")]);

  useEffect(() => {
    if (!hasDependant && childDept.length == 0) {
      if (watch("isApplicationMultiDept") === "true") {
        setValue("isLOIGenerated", "");
        setValue("childdepartment", "");
        setValue("childsubDept", "");
        setValue1("childRemark", "");
        setValue("childZoneKey", "");
        setValue("childOfficeLocationKey", "");
        setIsMultiDept(true);
      } else {
        setIsMultiDept(false);
      }
    }
  }, [watch("isApplicationMultiDept")]);

  useEffect(() => {
    let followingIds = childDept.map((group) => group.departmentKey);
    let allGroupsUserSpecific = depatForChild.map((group) => ({
      ...group,
      following: followingIds.includes(group.departmentKey),
    }));
    setDependDepartments(
      allGroupsUserSpecific.filter((obj) => obj.id != followingIds)
    );
  }, [depatForChild]);


  const sortByProperty = (property) => {
    return (a, b) => {
      if (a[property] < b[property]) {
        return -1;
      } else if (a[property] > b[property]) {
        return 1;
      }
      return 0;
    };
  };

  const getAllStatus = () => {
    axios
      .get(`${urls.RTI}/mstStatus/getAll`, {
        headers: headers,
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

  const getOfficeLocation = () => {
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`, {
        headers: headers,
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

  const getRejectedCat = () => {
    axios
      .get(`${urls.RTI}/mstRejectCategory/getAll`, {
        headers: headers,
      })
      .then((res, i) => {
        setRejectedCategory(res?.data?.mstRejectCategoryDao);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getTransferMedium = () => {
    axios
      .get(`${urls.RTI}/mstTransferMedium/getAll`, {
        headers: headers,
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
  let onCancel = () => {
    reset({
      ...resetValuesCancell,
    });
    setValue("department", "");
    setServiceId([]);
  };
  const handleChange = (event, studentId) => {
    if (studentId === "all") {
      if (event.target.checked) {
        setServiceId(dependantDept.map((student) => student.id));
        setHanadleStudent(dependantDept.map((student) => ({ id: student.id })));
      } else {
        setServiceId([]);
        setHanadleStudent([]);
      }
    } else {
      if (event.target.checked) {
        setServiceId([...serviceId, studentId]);
        setHanadleStudent((old) => [...old, { id: studentId }]);
      } else {
        setServiceId(serviceId?.filter((id) => id !== studentId));
        setHanadleStudent(
          dependantDept?.filter((item) => item.studentKey !== studentId)
        );
      }
    }
  };
  const getFilePreview = (filePath) => {
    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);
    const url = ` ${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: headers,
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
  //    child dept columns
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
      headerAlign: "center",
      width: 200,
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

  const cancellButton = () => {
    logedInUser === "citizenUser"
      ? router.push("/dashboard")
      : logedInUser === "cfcUser"
      ? router.push("/CFC_Dashboard")
      : router.push(
          "/RTIOnlineSystem/transactions/rtiApplication/rtiApplicationList"
        );
  };

  // document columns
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

  // get sub dept by dept id
  const getSubDepartmentDetails = () => {
    if (watch("childdepartment")) {
      axios
        .get(
          `${urls.RTI}/master/subDepartment/getAllByDeptWise/${watch(
            "childdepartment"
          )}`,
          {
            headers: headers,
          }
        )
        .then((res) => {
          setSubDepartmentList(
            res.data.subDepartment.map((r, i) => ({
              id: r.id,
              srNo: i + 1,
              departmentId: r.department,
              subDepartment: r.subDepartment,
              subDepartmentMr: r.subDepartmentMr,
            }))
          );
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  // loi modal close
  const handleCancel = () => {
    setIsModalOpenForResolved(false);
    setValue("isLOIGenerated", "false");
  };

  // multi dept modal close
  const handleCancel1 = () => {
    setIsMultiDept(false);
    setValue("isApplicationMultiDept", "false");
    setValue("childdepartment", "");
    setValue("childsubDept", "");
    setValue1("childRemark", "");
    setValue("childZoneKey", "");
    setValue("childOfficeLocationKey", "");
    setServiceId([]);
  };

  // load charge type
  const getChargeType = () => {
    axios
      .get(`${urls.CFCURL}/master/serviceChargeType/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setChargeTypeDetails(
          r.data.serviceChargeType
            .filter((r) => r.id == 10)
            .map((row) => ({
              id: row.id,
              serviceChargeType: row.serviceChargeType,
              serviceChargeTypeMr: row.serviceChargeTypeMr,
            }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // get service charges by service id=103
  const getChargeTypes = () => {
    axios
      .get(
        `${urls.CFCURL}/master/servicecharges/getByServiceId?serviceId=130`,
        {
          headers: headers,
        }
      )
      .then((r) => {
        r.data.serviceCharge.length != 0 &&
          setRatePerPage(r.data.serviceCharge[0].amount);
        r.data.serviceCharge.length != 0 &&
          setValue1("amount", r.data.serviceCharge[0].amount);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // get genders
  const getGenders = () => {
    axios
      .get(`${urls.CFCURL}/master/gender/getAll`, {
        headers: headers,
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

  // get loi
  const getLoi = () => {
    axios
      .get(
        `${urls.RTI}/trnAppealLoi/getAllByApplication?applicationNo=${applicationId}`,
        {
          headers: headers,
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

  // set loi details on ui
  const setLOIDetails = (res) => {
    setLoiDetails(res.data.trnAppealLoiList[0]);
    setValue1("chargeTypeKey", res.data?.trnAppealLoiList[0].chargeTypeKey);
    setValue1("noOfPages", res.data.trnAppealLoiList[0].noOfPages);
    setValue1("amount", res.data?.trnAppealLoiList[0].amount);
    setValue1("totalAmount", res.data?.trnAppealLoiList[0].totalAmount);
    setValue1("remarks", res.data?.trnAppealLoiList[0].remarks);
    setPageNo(res.data.trnAppealLoiList[0].noOfPages);
    setRatePerPage(res.data?.trnAppealLoiList[0].amount);
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
  // get application by id
  const getApplicationById = () => {
    setIsLoading(true);
    axios
      .get(`${urls.RTI}/trnRtiApplication/getById?id=${router.query.id}`, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        setApplicationDetails(res.data);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  useEffect(() => {
    if (applications != []) {
      setRtiApplication();
    }
  }, [applications, language, departments]);

  // set application details on UI
  const setRtiApplication = () => {
    let _res = applications;
    if (zoneDetails && departments && subDepartments) {
      setValue("areaKey", _res?.areaKey);
      setValue("zoneKey", _res?.zoneKey);
      setValue("departmentKey", _res?.departmentKey);
      setValue("subDepartmentKey", _res?.subDepartmentKey);
    }
    setValue("infoSentByPost", _res.infoSentByPost);
    setInfoSentByPost(_res.infoSentByPost);
    setValue("postType", _res.postType);
    setValue("rejected", _res?.rejected);
    setValue("officeLocationKey", _res?.officeLocationKey);
    setValue("rejectRemark", _res?.rejectRemark);
    setRejectRemarkValue(_res?.rejectRemark);
    setValue("rejectCategoryKey", _res.rejectCategoryKey);
    setDependantDept(_res?.departmentKey);
    setApplicationID(_res?.id);
    setValue("isRejected", _res?.rejected ? "false" : "true");
    setValue("applicantFirstName", _res?.applicantFirstName);
    setValue1(
      "applicantFirstName",
      language === "en"
        ? _res?.applicantFirstName +
            " " +
            _res?.applicantMiddleName +
            " " +
            _res?.applicantLastName
        : _res?.applicantFirstNameMr +
            " " +
            _res?.applicantMiddleNameMr +
            " " +
            _res?.applicantLastNameMr
    );
    setValue(
      "applicantName",
      language === "en"
        ? _res?.applicantFirstName +
            " " +
            _res?.applicantMiddleName +
            " " +
            _res?.applicantLastName
        : _res?.applicantFirstNameMr +
            " " +
            _res?.applicantMiddleNameMr +
            " " +
            _res?.applicantLastNameMr
    );
    setValue1("serviceName", "RTI");
    setValue("applicantMiddleName", _res?.applicantMiddleName);
    setValue("applicantLastName", _res?.applicantLastName);
    setValue("address", language === "en" ? _res?.address : _res?.addressMr);
    setValue("gender", _res?.gender);
    setValue("pinCode", _res?.pinCode);
    setValue("contactDetails", _res?.contactDetails);
    setValue1("applicationNo", _res?.applicationNo);
    setApplicationNumber(_res?.applicationNo);
    setValue("emailId", _res?.emailId);
    setIsBpl(_res?.isBpl);
    setValue("bplCardNo", _res?.bplCardNo);
    setValue("yearOfIssues", _res?.bplCardIssueYear);
    setValue("informationSubject", _res?.subject);
    setValue("issuingAuthority", _res?.bplCardIssuingAuthority);
    setValue("remarks", _res?.remarks);
    setValue("completeRemark", _res?.remarks);
    setValue("outwardNumberTxt", _res?.outwardNumberTxt);
    setValue("applicationNo", _res?.applicationNo);
    setBPLDocument(_res.bplCardDoc);
    setValue("applicationType", "Child Application");
    setHasDependant(_res?.hasDependant == null ? false : _res?.hasDependant);
    setValue(
      "fromDate",
      _res?.fromDate == null ? "-" : moment(_res?.fromDate).format("DD-MM-YYYY")
    ),
      setValue(
        "toDate",
        _res?.toDate == null ? "-" : moment(_res?.toDate).format("DD-MM-YYYY")
      );
    setValue(
      "applicationDate",
      _res?.applicationDate == null
        ? "-"
        : moment(_res?.applicationDate).format("DD-MM-YYYY")
    ),
      setValue("selectedReturnMediaKey", _res?.selectedReturnMediaKey);
    setValue("informationReturnMediaKey", _res?.informationReturnMediaKey);
    setValue("description", _res?.description);
    setValue("requiredInformationPurpose", _res?.requiredInformationPurpose);
    setValue("additionalInfo", _res?.additionalInfo);
    setValue("parentRemark", _res?.transferRemark);
    setValue("place",_res?.place);
    setValue('date',_res?.applicationDate)
    setValue("forwardRemark", _res?.forwardRemark);
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
    setStatusVal(_res.status);
    setValue("infoPages", _res?.infoPages),
      setValue("infoRemark", _res?.infoAvailableRemarks),
      setValue("status", manageStatus(_res.status, language, statusAll));
    if (_res.userDao != null) {
      setValue(
        "rtiFullName",
        language == "en"
          ? _res.userDao.firstNameEn +
              " " +
              _res.userDao.middleNameEn +
              " " +
              _res.userDao.lastNameEn
          : _res.userDao.firstNameMr +
              " " +
              _res.userDao.middleNameMr +
              " " +
              _res.userDao.lastNameMr
      );
      setValue("rtiEmailId", _res.userDao.email);
      setValue("rtiContact", _res.userDao.phoneNo);
    
    }
    let rejectDoc = [];
    if (_res.rejectDoc1 != null) {
      const DecryptPhoto = DecryptData(
        "passphraseaaaaaaaaupload",
        _res.rejectDoc1
      );

      rejectDoc.push({
        id: 1,
        filenm: DecryptPhoto.split("/").pop().split("_").pop(),
        documentPath: _res.rejectDoc1,
        documentType: DecryptPhoto.split(".").pop().toUpperCase(),
      });
    }
    if (_res?.thirdPartyDoc1 != null) {
      const DecryptPhoto = DecryptData(
        "passphraseaaaaaaaaupload",
        _res?.thirdPartyDoc1
      );
      rejectDoc.push({
        id: 2,
        filenm: "Third Party document",
        documentPath: _res.thirdPartyDoc1,
        documentType: DecryptPhoto?.split(".").pop().toUpperCase(),
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
    setDataSource(doc);
    const completeDoc = [];
    if (_res.attachedDocumentPath != null) {
      const DecryptPhoto = DecryptData(
        "passphraseaaaaaaaaupload",
        _res.attachedDocumentPath
      );

      completeDoc.push({
        id: 1,
        filenm: DecryptPhoto.split("/").pop().split("_").pop(),
        documentPath: _res.attachedDocumentPath,
        documentType: DecryptPhoto.split(".").pop().toUpperCase(),
      });
      setCompleteAttach(completeDoc);
    }
    const completeDoc1 = [];
    if (!checkAuth()) {
      if (_res.thirdPartyDoc1 != null) {
        const DecryptPhoto = DecryptData(
          "passphraseaaaaaaaaupload",
          _res.thirdPartyDoc1
        );

        completeDoc1.push({
          id: 2,
          filenm: "Third Party document",
          documentPath: _res.thirdPartyDoc1,
          documentType: DecryptPhoto?.split(".").pop().toUpperCase(),
        });
      }
    }

    setCompleteAttach([...completeDoc, ...completeDoc1]);
    setDependantData(_res.dependentRtiApplicationDaoList);
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
          departmentKey: res?.departmentKey,
          departmentName: departments.find((filterData) => {
            return filterData?.id == res?.departmentKey;
          })?.department,
          createdDate: res.createdDate,
          description: res.description,
          requiredInformationPurpose: res.requiredInformationPurpose,
          subject: res.subject,
          applicationDate:
            res.applicationDate == null
              ? "-"
              : moment(res.applicationDate).format("DD-MM-YYYY"),
          completedDate:
            res.completionDate == null
              ? "-"
              : moment(res.completionDate).format("DD-MM-YYYY"),
          statusVal: res.status,
          transferRemark: res.transferRemark,
          status: manageStatus(res.status, language, statusAll),
          activeFlag: res.activeFlag,
          remark:
            res.status === 15
              ? language === "en"
                ? rejectedCat &&
                  rejectedCat.find((obj) => obj.id === res.rejectCategoryKey)
                    .rejectCat
                : rejectedCat &&
                  rejectedCat.find((obj) => obj.id === res.rejectCategoryKey)
                    .rejectCatMr
              : res.remarks,
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
          zonekey: res.zoneKey,
          officeLocationKey: res.officeLocationKey,
        };
      });
      setChildDept([..._res1]);
    }
  };

  useEffect(() => {
    if (watch("isRejected") === "false") {
      setValue("isLOIGenerated", null);
      setValue("isApplicationMultiDept", null);
    }
  }, [watch("isRejected")]);

  useEffect(() => {
    if (applicationId != null) {
      getLoi();
    }
  }, [applicationId]);

  // load zone
  const getZone = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let data = res.data.zone.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          zoneName: r.zoneName,
          zoneNameMr: r.zoneNameMr,
        }));
        setZoneDetails(data.sort(sortByProperty("zoneName")));
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // load sub department
  const getSubDepartments = () => {
    axios
      .get(`${urls.RTI}/master/subDepartment/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let data = res.data.subDepartment.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          departmentId: r.department,
          subDepartment: r.subDepartment,
          subDepartmentMr: r.subDepartmentMr,
        }));
        setSubDepartmentList(data.sort(sortByProperty("subDepartment")));
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get departments
  const getDepartments = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setDepartments(
          r.data.department.map((row) => ({
            id: row.id,
            department: row.department,
            departmentMr: row.departmentMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // RTi Complete status
  const updateCompleteStatus = () => {
    setIsLoading(true);
    if (watch("remarks")) {
      const body = {
        id: applicationId,
        activeFlag: "Y",
        ...applications,
        remarks: watch("remarks"),
        informationReturnMediaKey: Number(watch("informationReturnMediaKey")),
        attachedDocumentPath: document,
        thirdPartyDoc1: documentThirdParty,
        infoPages: watch("infoPages"),
        outwardNumberTxt: watch("outwardNumberTxt"),
        isComplete: "true",
        isApproved: false,
      };

      const tempData = axios
        .post(`${urls.RTI}/trnRtiApplication/save`, body, {
          headers: headers,
        })
        .then((res) => {
          setIsLoading(false);
          if (res.status == 201) {
            getApplicationById();
            swal({
              title: language == "en" ? "Saved!" : "जतन केले!",
              text:
                language == "en"
                  ? `RTI Application No ${
                      res.data.message.split("[")[1].split("]")[0]
                    } is Completed Successfully !`
                  : `आरटीआय अर्ज क्र ${
                      res.data.message.split("[")[1].split("]")[0]
                    } यशस्वीरित्या पूर्ण झाले आहे!`,
              icon: "success",
              button: language === "en" ? "Ok" : "ठीक आहे",
            }).then((will) => {
              if (will) {
                router.push({
                  pathname:
                    "/RTIOnlineSystem/transactions/rtiApplication/rtiApplicationList",
                });
              }
            });
          } else {
            sweetAlert(
              language == "en" ? "Error!" : "त्रुटी",
              language == "en" ? "Something went wrong!" : "काहीतरी चूक झाली!",
              "error",
              { button: language === "en" ? "Ok" : "ठीक आहे" }
            );
          }
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    }
  };
  const onRejectClick = () => {
    const body = {
      id: applicationId,
      activeFlag: "Y",
      ...applications,
      rejectDoc1: document,
      thirdPartyDoc1: documentThirdParty,
      rejectRemark: watch("rejectRemark"),
      rejectCategoryKey: Number(watch("rejectCategoryKey")),
      rejected: true,
    };
    setIsLoading(true);
    const headers =
      logedInUser === "citizenUser"
        ? { Userid: user?.id }
        : { Authorization: `Bearer ${user?.token}` };
    const tempData = axios
      .post(`${urls.RTI}/trnRtiApplication/save`, body, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          sweetAlert({
            title: language == "en" ? "Rejected!" : "नाकारले!",
            text:
              language == "en"
                ? `RTI Applicaction No. ${
                    res.data.message.split("[")[1].split("]")[0]
                  } is Rejected Successfully`
                : `आरटीआय अर्ज क्र. ${
                    res.data.message.split("[")[1].split("]")[0]
                  } यशस्वीरित्या नाकारले`,
            icon: "success",
            button: language === "en" ? "Ok" : "ठीक आहे",
          }).then((will) => {
            if (will) {
              cancellButton();
            }
          });
        } else {
          sweetAlert(
            language == "en" ? "Error!" : "त्रुटी",
            language == "en" ? "Something went wrong!" : "काहीतरी चूक झाली!",
            "error",
            { button: language === "en" ? "Ok" : "ठीक आहे" }
          );
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };
  // update infor ready
  const updateInfoReady = () => {
    setIsLoading(true);
    if (watch("infoRemark")) {
      const body = {
        id: applicationId,
        activeFlag: "Y",
        ...applications,
        infoPages: watch("infoPages"),
        infoAvailableRemarks: watch("infoRemark"),
        isComplete: "true",
        isApproved: false,
      };
      const tempData = axios
        .post(`${urls.RTI}/trnRtiApplication/save`, body, {
          headers: headers,
        })
        .then((res) => {
          setIsLoading(false);
          if (res.status == 201) {
            getApplicationById();
            sweetAlert(
              language == "en" ? "Saved!" : "जतन केले!",
              language == "en"
                ? `RTI Applicaction No. ${
                    res.data.message.split("[")[1].split("]")[0]
                  } is in Information Ready state`
                : `आरटीआय अर्ज क्र. ${
                    res.data.message.split("[")[1].split("]")[0]
                  } माहिती तयार स्थितीत आहे`,
              "success",
              { button: language === "en" ? "Ok" : "ठीक आहे" }
            );
          } else {
            sweetAlert(
              language == "en" ? "Error!" : "त्रुटी",
              language == "en" ? "Something went wrong!" : "काहीतरी चूक झाली!",
              "error",
              { button: language === "en" ? "Ok" : "ठीक आहे" }
            );
          }
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  useEffect(() => {
    if (watch("childZoneKey") != null && watch("childZoneKey") != "") {
      getOfficeLocationByZoneForChild();
    }
    setValue("childOfficeLocationKey", "");
  }, [watch("childZoneKey")]);

  useEffect(() => {
    if (
      watch("childOfficeLocationKey") != null &&
      watch("childOfficeLocationKey") != "" &&
      watch("childZoneKey") != null &&
      watch("childZoneKey") != ""
    ) {
      getDepartmentByOfficeLocationForChild();
    }
    setValue("childdepartment", "");
  }, [watch("childOfficeLocationKey")]);

  const getOfficeLocationByZoneForChild = () => {
    axios
      .get(
        `${
          urls.RTI
        }/mstZoneOfficeLocationDepartmentMapping/getAllLocByZone?zoneKey=${watch(
          "childZoneKey"
        )}`,
        {
          headers: headers,
        }
      )
      .then((r) => {
        let data = r.data.mstZoneOfficeLocationDepartmentMappingDao.map(
          (row) => ({
            id: row.officeLocationkey,
            officeLocationName: officeLocationDetails?.find((obj) => {
              return obj.id == row.officeLocationkey;
            })
              ? officeLocationDetails.find((obj) => {
                  return obj.id == row.officeLocationkey;
                }).officeLocationName
              : "-",

            officeLocationNameMar: officeLocationDetails?.find((obj) => {
              return obj.id == row.officeLocationkey;
            })
              ? officeLocationDetails.find((obj) => {
                  return obj.id == row.officeLocationkey;
                }).officeLocationNameMar
              : "-",
          })
        );
        setOfficeLocForChild(data.sort(sortByProperty("officeLocationName")));
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getDepartmentByOfficeLocationForChild = () => {
    axios
      .get(
        `${
          urls.RTI
        }/mstZoneOfficeLocationDepartmentMapping/getAllDeptByZoneAndLocation?zoneKey=${watch(
          "childZoneKey"
        )}&locationkey=${watch("childOfficeLocationKey")}`,
        {
          headers: headers,
        }
      )
      .then((r) => {
        setDeptForChild(
          r.data.mstZoneOfficeLocationDepartmentMappingDao.map((row) => ({
            id: row.departmentKey,
            department: departments?.find((obj) => {
              return obj.id == row.departmentKey;
            })
              ? departments.find((obj) => {
                  return obj.id == row.departmentKey;
                }).department
              : "-",
            departmentMr: departments?.find((obj) => {
              return obj.id == row.departmentKey;
            })
              ? departments.find((obj) => {
                  return obj.id == row.departmentKey;
                }).departmentMr
              : "-",
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  useEffect(() => {
    if (
      watch("childZoneKey") != null &&
      watch("childZoneKey") != undefined &&
      watch("childZoneKey") != "" &&
      watch("childOfficeLocationKey") != null &&
      watch("childOfficeLocationKey") != undefined &&
      watch("childOfficeLocationKey") != ""
    ) {
      let deptid = childDept.filter(
        (obj) =>
          obj.zonekey === Number(watch("childZoneKey")) &&
          obj.officeLocationKey === Number(watch("childOfficeLocationKey"))
      );
     
      if (deptid.length != 0) {
        let dummyData = deptid.map((temp) => temp.departmentKey);
        const filteredData = dependDept.filter(
          (record) => !dummyData.includes(record.id)
        );
        setDependantDepartments(
          filteredData
            ?.filter((obj) => obj.id != dependDeptId)
            ?.sort(sortByProperty("department"))
        );
      } else {
        setDependantDepartments(
          dependDept
            ?.filter((obj) => obj.id != dependDeptId)
            ?.sort(sortByProperty("department"))
        );
      }
    }
  }, [dependDept]);

  const onSubmitAddChildren = () => {
    setMultiDeptLoading(true);
    const dependentRtiApplicationDaoList = serviceId.map((obj) => {
      return {
        zoneKey: watch("childZoneKey"),
        officeLocationKey: watch("childOfficeLocationKey"),
        departmentKey: obj,
        subDepartmentKey: watch("childsubDept"),
        transferRemark: watch1("childRemark"),
        isBpl: isBplval,
        isTransfer: false,
      };
    });
    const dependDoc = [];
    if (
      applications?.length != 0 &&
      dependantData != null &&
      dependantData?.length != 0
    ) {
      dependDoc = [...dependantData, ...dependentRtiApplicationDaoList];
    } else {
      dependDoc = [...dependentRtiApplicationDaoList];
    }
    const body = {
      ...applications,
      dependentRtiApplicationDaoList: dependDoc,
      dependentStatus: null,
      childCount: childDept.length + 1,
    };
    const tempData = axios
      .post(`${urls.RTI}/trnRtiApplication/save/dependent`, body, {
        headers: headers,
      })
      .then((res) => {
        setMultiDeptLoading(false);
        if (res.status == 201) {
          sweetAlert(
            language == "en"
              ? `Child RTI Application No. ${
                  res.data.message.split("[")[1].split("]")[0]
                } added Successfully !!!`
              : `Child आरटीआय अर्ज क्र. ${
                  res.data.message.split("[")[1].split("]")[0]
                } यशस्वीरित्या जोडले आहे !!!`,
            { button: language === "en" ? "Ok" : "ठीक आहे" }
          ).then((will)=>{
            if(will){
              setIsMultiDept(false);
              setServiceId([]);
              getApplicationById();
            }
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const OnSubmitloiGenerated = (formData) => {
    let trnLoiChargesDaos = amountValue.map((obj) => {
      return {
        ...obj,
        id: null,
      };
    });
    const body = {
      ...formData,
      trnLoiChargesDaos,
      totalAmount: totalAmount,
      applicationKey: applicationId,
    };
    setIsLoiLoading(true);
    const tempData = axios
      .post(`${urls.RTI}/trnAppealLoi/save`, body, {
        headers: headers,
      })
      .then((res) => {
        setIsLoiLoading(false);
        if (res.status == 201) {
          resetLOI();
          getApplicationById();
          sweetAlert({
            title: language == "en" ? "Saved!" : "जतन केले!",
            text:
              language == "en"
                ? "Intimation Letter Generated Successfully!"
                : "सूचना पत्र यशस्वीरित्या उत्पन्न झाले!",
            icon: "success",
            button: language == "en" ? "Ok" : "ठीक आहे",
          }).then((will) => {
            if (will) {
              setIsModalOpenForResolved(false);
              cancellButton();
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
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
    // }
  };

  const resetLOI = () => {
    const resetField = {
      applicationNo: "",
      applicantFirstName: "",
      serviceName: "",
      amount: "",
      noOfPages: "",
      chargeType: "",
      totalAmount: "",
    };
  };

  // View
  return (
    <>
      <ThemeProvider theme={theme}>
        <BreadcrumbComponent />
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
          {/* <Divider /> */}
          <Box>
            <Box>
              <Grid container className={commonStyles.title}>
                <Grid item xs={2}>
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
                    <FormattedLabel id="ViewrtiApplication" />
                  </h3>
                </Grid>
              </Grid>
            </Box>
            <FormProvider {...methods}>
              <form>
                <Grid container spacing={1} sx={{ padding: "5px" }}>
                  {authority &&
                    authority.find(
                      (val) => val === roleId.RTI_ADHIKARI_ROLE_ID
                    ) && (
                      <>
                        <Grid
                          item
                          xl={applications.parentId != null ? 8 : 12}
                          lg={applications.parentId != null ? 8 : 12}
                          md={applications.parentId != null ? 6 : 12}
                          sm={12}
                          xs={12}
                        >
                          <FormControl>
                            <FormLabel
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              id="demo-row-radio-buttons-group-label"
                            >
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
                    )}

                  <Grid
                    item
                    xl={checkSomeCondition() ? 12 : 4}
                    lg={checkSomeCondition() ? 12 : 4}
                    md={checkSomeCondition() ? 12 : 6}
                    sm={12}
                    xs={12}
                  >
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      id="standard-textarea"
                      label={<FormattedLabel id="applicationNo" />}
                      multiline
                      variant="standard"
                      {...register("applicationNo")}
                      error={!!errors.applicationNo}
                      helperText={
                        errors?.applicationNo
                          ? errors.applicationNo.message
                          : null
                      }
                    />
                  </Grid>
                  {applications.parentId != null && (
                    <Grid
                      item
                      xl={4}
                      lg={4}
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
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        disabled={true}
                        InputLabelProps={{ shrink: true }}
                        id="standard-textarea"
                        label={<FormattedLabel id="applicationType" />}
                        multiline
                        variant="standard"
                        {...register("applicationType")}
                        error={!!errors.applicationType}
                        helperText={
                          errors?.applicationType
                            ? errors.applicationType.message
                            : null
                        }
                      />
                    </Grid>
                  )}
                  {/* Applicant first Name */}
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      id="standard-textarea"
                      label={<FormattedLabel id="applicantName" />}
                      multiline
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

                  {/* Gender */}
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <FormControl
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      variant="standard"
                      error={!!errors.gender}
                      disabled={logedInUser === "citizenUser" ? true : false}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="gender" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: "100%" }}
                            disabled
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                          >
                            {genderDetails &&
                              genderDetails.map((value, index) => (
                                <MenuItem key={index} value={value?.id}>
                                  {language == "en"
                                    ? value?.gender
                                    : value?.genderMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="gender"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.gender ? errors.gender.message : null}
                      </FormHelperText>
                    </FormControl>
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
                      helperText={
                        errors?.emailId ? errors.emailId.message : null
                      }
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
                      helperText={
                        errors?.pinCode ? errors.pinCode.message : null
                      }
                    />
                  </Grid>

                  {/* Address */}
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      fullWidth
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      id="standard-textarea"
                      label={<FormattedLabel id="address" />}
                      multiline
                      variant="standard"
                      {...register("address")}
                      error={!!errors.address}
                      helperText={
                        errors?.address ? errors.address.message : null
                      }
                    />
                  </Grid>

                  {/* ZOne*/}
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <FormControl
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      error={!!errors.zoneKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="zoneKey" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            fullWidth
                            sx={{ width: "100%" }}
                            disabled
                            variant="standard"
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                          >
                            {zoneDetails &&
                              zoneDetails?.map((zoneDetails, index) => (
                                <MenuItem key={index} value={zoneDetails.id}>
                                  {language == "en"
                                    ? zoneDetails?.zoneName
                                    : zoneDetails?.zoneNameMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="zoneKey"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.zoneKey ? errors.zoneKey.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
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
                    <FormControl
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      variant="standard"
                      error={!!errors.departmentKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="departmentKey" required />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            autoFocus
                            sx={{ width: "100%" }}
                            disabled
                            fullWidth
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value), getSubDepartmentDetails();
                            }}
                            label={<FormattedLabel id="departmentKey" />}
                          >
                            {departments &&
                              departments.map((department, index) => (
                                <MenuItem key={index} value={department.id}>
                                  {language == "en"
                                    ? department.department
                                    : department.departmentMr}
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

                  {/* Sub department */}
                  {watch("subDepartmentKey") && (
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <FormControl
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        variant="standard"
                        error={!!errors.subDepartmentKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="subDepartmentKey" required />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: "100%" }}
                              disabled
                              fullWidth
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="subDepartmentKey" />}
                            >
                              {subDepartments &&
                                subDepartments?.map((subDepartment, index) => (
                                  <MenuItem
                                    key={index}
                                    value={subDepartment.id}
                                  >
                                    {language == "en"
                                      ? subDepartment.subDepartment
                                      : subDepartment.subDepartmentMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="subDepartmentKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.subDepartmentKey
                            ? errors.subDepartmentKey.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  )}
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

                  {/*  */}
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
                      helperText={
                        errors?.fromDate ? errors.fromDate.message : null
                      }
                    />
                  </Grid>
                  {/*  */}

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
                  {/*  */}

                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <FormControl
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      variant="standard"
                      error={!!errors.selectedReturnMediaKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel
                          id="requiredInfoDeliveryDetails"
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
                                id="requiredInfoDeliveryDetails"
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
                    <FormControl
                      flexDirection="row"
                      style={{ marginTop: "0px", marginLeft: "10px" }}
                    >
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
                            sx={{ justifyContent: "space-evenly" }}
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
                  {isBplval ? (
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
                  ) : (
                    <></>
                  )}

                  {/* years of issues */}
                  {isBplval ? (
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
                  ) : (
                    <></>
                  )}

                  {/* issuing authority */}
                  {isBplval ? (
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
                  ) : (
                    <></>
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

                  {applications.parentId != null &&
                    authority &&
                    authority.find(
                      (val) => val === roleId.RTI_ADHIKARI_ROLE_ID
                    ) && (
                      <Grid
                        item
                        spacing={1}
                        xl={12}
                        lg={12}
                        md={12}
                        sm={12}
                        xs={12}
                      >
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          disabled={true}
                          InputLabelProps={{ shrink: true }}
                          id="standard-textarea"
                          label={<FormattedLabel id="parentRemark" />}
                          multiline
                          inputProps={{ maxLength: 500 }}
                          variant="standard"
                          {...register("parentRemark")}
                          error={!!errors.parentRemark}
                          helperText={
                            errors?.parentRemark
                              ? errors.parentRemark.message
                              : null
                          }
                        />
                      </Grid>
                    )}

                  {applications.isTransfer &&
                    authority &&
                    authority.find(
                      (val) => val === roleId.RTI_ADHIKARI_ROLE_ID
                    ) && (
                      <Grid
                        item
                        spacing={1}
                        xl={12}
                        lg={12}
                        md={12}
                        sm={12}
                        xs={12}
                      >
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          disabled={true}
                          InputLabelProps={{ shrink: true }}
                          id="standard-textarea"
                          label={<FormattedLabel id="forwardRemark" />}
                          multiline
                          inputProps={{ maxLength: 500 }}
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

                  {/* current status */}
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
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
                      // defaultValue={currDate}
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
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft:'10px'
                      }}
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
          {/* </Box> */}

          {dataSource.length != 0 && (
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
                rows={dataSource}
                columns={docColumns}
              />
            </div>
          )}

          {/* accept reject button */}
          {authority &&
            authority.find((val) => val === roleId.RTI_ADHIKARI_ROLE_ID) &&
            (statusVal === 3 ||
              statusVal === 15 ||
              statusVal === 4 ||
              statusVal === 14 ||
              statusVal === 11 ||
              statusVal === 5) && (
              <div>
                {statusVal === 4 ||
                statusVal === 15 ||
                statusVal === 14 ||
                statusVal === 11 ||
                statusVal === 5 ||
                (statusVal === 3 && childDept.length != 0) ? (
                  <>
                    {" "}
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
                      <FormControl flexDirection="row">
                        <Controller
                          disabled={true}
                          name="isRejected"
                          control={control}
                          defaultValue="true"
                          render={({ field }) => (
                            <RadioGroup
                              value={statusVal === 15 ? "false" : field.value}
                              selected={field.value}
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                            >
                              <FormControlLabel
                                value={"true"}
                                control={<Radio />}
                                label={<FormattedLabel id="accept" />}
                                error={!!errors.isRejected}
                                helperText={
                                  errors?.isRejected
                                    ? errors.isRejected.message
                                    : null
                                }
                              />
                              <FormControlLabel
                                value={"false"}
                                control={<Radio />}
                                label={<FormattedLabel id="reject" />}
                                error={!!errors.isRejected}
                                helperText={
                                  errors?.isRejected
                                    ? errors.isRejected.message
                                    : null
                                }
                              />
                            </RadioGroup>
                          )}
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : (
                  <>
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
                      <FormControl flexDirection="row">
                        <Controller
                          name="isRejected"
                          control={control}
                          {...register("isRejected")}
                          defaultValue=""
                          render={({ field }) => (
                            <RadioGroup
                              value={field.value}
                              selected={field.value}
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                            >
                              <FormControlLabel
                                value={"true"}
                                control={<Radio />}
                                {...register("isRejected")}
                                label={<FormattedLabel id="accept" />}
                                error={!!errors.isRejected}
                                helperText={
                                  errors?.isRejected
                                    ? errors.isRejected.message
                                    : null
                                }
                              />
                              <FormControlLabel
                                value={"false"}
                                {...register("isRejected")}
                                control={<Radio />}
                                label={<FormattedLabel id="reject" />}
                                error={!!errors.isRejected}
                                helperText={
                                  errors?.isRejected
                                    ? errors.isRejected.message
                                    : null
                                }
                              />
                            </RadioGroup>
                          )}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
              </div>
            )}

          {/* Rejected Flow */}
          {(watch("isRejected") === "false" || statusVal === 15) && (
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
                        disabled={statusVal === 15 ? true : false}
                        sx={{ width: "100%" }}
                        fullWidth
                        value={field.value}
                        // onChange={(value) => field.onChange(value)}
                        onChange={(e) => {
                          field.onChange(e);
                          handleCategoryChange(e.target.value);
                        }}
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
                  disabled={statusVal == 15 ? true : false}
                  label={<FormattedLabel id="rejectedRemark" />}
                  id="standard-textarea"
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "98%" }}
                  variant="standard"
                  multiline
                  inputProps={{ maxLength: 500 }}
                  {...register("rejectRemark")}
                  value={rejectRemarkValue}
                  onChange={(e) => setRejectRemarkValue(e.target.value)}
                  error={!!errors.rejectRemark}
                  helperText={
                    errors?.rejectRemark ? errors.rejectRemark.message : null
                  }
                />
              </Grid>

              {statusVal != 15 && (
                <Grid container spacing={1} style={{ padding: "1rem" }}>
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
                    }}
                  >
                    <FormattedLabel id="attachDoccument" /> :
                    <UploadButton
                      appName="RTI"
                      serviceName="RTI-Application"
                      filePath={setDocument}
                      fileName={document}
                    />
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
                    }}
                  >
                    <FormattedLabel id="thirdPartyAattachDoccument" /> :
                    <UploadButton
                      appName="RTI"
                      serviceName="RTI-Application"
                      filePath={setThirdPartyDocument}
                      fileName={documentThirdParty}
                    />
                  </Grid>
                </Grid>
              )}

              {statusVal == 15 && (
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
              )}

              {statusVal != 15 && (
                <Grid container spacing={1} style={{ margin: "10px" }}>
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
                      disabled={!rejectRemarkValue || !selectedRejectCategory}
                      variant="contained"
                      color="secondary"
                      style={{ borderRadius: "20px" }}
                      size="small"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => {
                        onRejectClick();
                      }}
                    >
                      <FormattedLabel id="reject" />
                    </Button>
                  </Grid>
                </Grid>
              )}
            </>
          )}

          {/* Accept flow */}
          {/* multi department radio button */}
          {authority &&
            authority.find((val) => val === roleId.RTI_ADHIKARI_ROLE_ID) &&
            ((statusVal === 3 && watch("isRejected") === "true") ||
              statusVal === 4 ||
              statusVal === 14 ||
              statusVal === 11 ||
              statusVal === 5) &&
            applications.parentId == null && (
              <div>
                {statusVal === 4 ||
                statusVal === 14 ||
                statusVal === 11 ||
                statusVal === 5 ||
                (statusVal === 3 &&
                  childDept.length != 0 &&
                  watch("isRejected") === "true") ? (
                  <>
                    {" "}
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
                      <FormControl>
                        <FormLabel
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          id="demo-row-radio-buttons-group-label"
                        >
                          {<FormattedLabel id="isApplicationMultiDept" />}
                        </FormLabel>
                        <Controller
                          disabled={true}
                          InputLabelProps={{ shrink: true }}
                          name="isApplicationMultiDept"
                          control={control}
                          render={({ field }) => (
                            <RadioGroup
                              sx={{ justifyContent: "space-evenly" }}
                              disabled={inputState}
                              value={hasDependant}
                              selected={field.value}
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                            >
                              <FormControlLabel
                                value="true"
                                disabled={inputState}
                                control={<Radio size="small" />}
                                label={<FormattedLabel id="yes" />}
                                error={!!errors.isApplicationMultiDept}
                                helperText={
                                  errors?.isApplicationMultiDept
                                    ? errors.isApplicationMultiDept.message
                                    : null
                                }
                              />
                              <FormControlLabel
                                value="false"
                                disabled={inputState}
                                control={<Radio size="small" />}
                                label={<FormattedLabel id="no" />}
                                error={!!errors.isApplicationMultiDept}
                                helperText={
                                  errors?.isApplicationMultiDept
                                    ? errors.isApplicationMultiDept.message
                                    : null
                                }
                              />
                            </RadioGroup>
                          )}
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : (
                  <>
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
                      <FormControl flexDirection="row">
                        <FormLabel
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          id="demo-row-radio-buttons-group-label"
                        >
                          {<FormattedLabel id="isApplicationMultiDept" />}
                        </FormLabel>

                        <Controller
                          name="isApplicationMultiDept"
                          control={control}
                          disabled={true}
                          defaultValue=""
                          {...register("isApplicationMultiDept")}
                          render={({ field }) => (
                            <RadioGroup
                              sx={{ justifyContent: "space-evenly" }}
                              value={field.value}
                              selected={field.value}
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                            >
                              <FormControlLabel
                                value={"true"}
                                {...register("isApplicationMultiDept")}
                                control={<Radio />}
                                label={<FormattedLabel id="yes" />}
                                error={!!errors.isApplicationMultiDept}
                                helperText={
                                  errors?.isApplicationMultiDept
                                    ? errors.isApplicationMultiDept.message
                                    : null
                                }
                              />
                              <FormControlLabel
                                value={"false"}
                                {...register("isApplicationMultiDept")}
                                control={<Radio />}
                                label={<FormattedLabel id="no" />}
                                error={!!errors.isApplicationMultiDept}
                                helperText={
                                  errors?.isApplicationMultiDept
                                    ? errors.isApplicationMultiDept.message
                                    : null
                                }
                              />
                            </RadioGroup>
                          )}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}

                {childDept.length != 0 && (
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
                            <FormattedLabel id="childDeptTitle" />
                          </h3>
                        </Grid>
                      </Grid>
                    </Box>

                    <Grid container spacing={1} style={{ padding: "10px" }}>
                      {statusVal === 3 && (
                        <Grid
                          item
                          xs={12}
                          style={{ display: "flex", justifyContent: "end" }}
                        >
                          <Button
                            variant="contained"
                            endIcon={<AddIcon />}
                            type="primary"
                            size="small"
                            onClick={() => {
                              setValue("isLOIGenerated", "");
                              setValue("childdepartment", "");
                              setValue("childsubDept", "");
                              setValue1("childRemark", "");
                              setValue("childZoneKey", "");
                              setValue("childOfficeLocationKey", "");
                              setIsMultiDept(true);
                            }}
                          >
                            <FormattedLabel id="add" />{" "}
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                    <DataGrid
                      autoHeight
                      sx={{
                        // padding: "1rem",
                        marginBottom: "10px",
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
              </div>
            )}

          {/* loi generation radio button */}
          {(watch("isApplicationMultiDept") == "false" ||
            (applications.parentId != null &&
              watch("isRejected") === "true")) &&
            childDept.length == 0 &&
            authority &&
            authority.find((val) => val === roleId.RTI_ADHIKARI_ROLE_ID) &&
            statusVal == 3 && (
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
                <FormControl flexDirection="row">
                  <FormLabel
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    id="demo-row-radio-buttons-group-label"
                  >
                    {<FormattedLabel id="isLOIGenerated" />}
                  </FormLabel>
                  <Controller
                    name="isLOIGenerated"
                    control={control}
                    defaultValue=""
                    {...register("isLOIGenerated")}
                    render={({ field }) => (
                      <RadioGroup
                        sx={{ justifyContent: "space-evenly" }}
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                        selected={field.value}
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                      >
                        <FormControlLabel
                          value={"true"}
                          {...register("isLOIGenerated")}
                          control={<Radio />}
                          label={<FormattedLabel id="yes" />}
                          error={!!errors.isLOIGenerated}
                          helperText={
                            errors?.isLOIGenerated
                              ? errors.isLOIGenerated.message
                              : null
                          }
                        />
                        <FormControlLabel
                          value={"false"}
                          {...register("isLOIGenerated")}
                          control={<Radio />}
                          label={<FormattedLabel id="no" />}
                          error={!!errors.isLOIGenerated}
                          helperText={
                            errors?.isLOIGenerated
                              ? errors.isLOIGenerated.message
                              : null
                          }
                        />
                      </RadioGroup>
                    )}
                  />
                </FormControl>
              </Grid>
            )}

          {/* loi generate after completing other department */}
          {authority &&
          authority.find((val) => val === roleId.RTI_ADHIKARI_ROLE_ID) &&
          statusVal == 3 &&
          childDept.length > 0 &&
          applications.parentId == null ? (
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
              <FormControl flexDirection="row">
                <FormLabel
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="demo-row-radio-buttons-group-label"
                >
                  {<FormattedLabel id="isLOIGenerated" />}
                </FormLabel>

                <Controller
                  name="isLOIGenerated"
                  control={control}
                  defaultValue=""
                  {...register("isLOIGenerated")}
                  render={({ field }) => (
                    <RadioGroup
                      sx={{ justifyContent: "space-evenly" }}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      selected={field.value}
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                    >
                      <FormControlLabel
                        value={"true"}
                        {...register("isLOIGenerated")}
                        control={<Radio />}
                        label={<FormattedLabel id="yes" />}
                        error={!!errors.isLOIGenerated}
                        helperText={
                          errors?.isLOIGenerated
                            ? errors.isLOIGenerated.message
                            : null
                        }
                      />
                      <FormControlLabel
                        value={"false"}
                        {...register("isLOIGenerated")}
                        control={<Radio />}
                        label={<FormattedLabel id="no" />}
                        error={!!errors.isLOIGenerated}
                        helperText={
                          errors?.isLOIGenerated
                            ? errors.isLOIGenerated.message
                            : null
                        }
                      />
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </Grid>
          ) : (
            ""
          )}

          {/* loi generate View */}
          {loiDetails.length != 0 &&
            (statusVal === 5 ||
              statusVal === 4 ||
              statusVal === 11 ||
              statusVal == 14) && (
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
                <Grid container spacing={1} sx={{ padding: "2rem" }}>
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
                    <FormControl
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      variant="standard"
                      error={!!errors.departmentKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="departmentKey" required />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            autoFocus
                            sx={{ width: "100%" }}
                            disabled
                            fullWidth
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value), getSubDepartmentDetails();
                            }}
                            label={<FormattedLabel id="departmentKey" />}
                          >
                            {departments &&
                              departments.map((department, index) => (
                                <MenuItem key={index} value={department.id}>
                                  {language == "en"
                                    ? department.department
                                    : department.departmentMr}
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
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      disabled={true}
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
                      disabled={
                        statusVal === 4 ||
                        statusVal == 5 ||
                        statusVal == 11 ||
                        statusVal == 14
                          ? true
                          : false
                      }
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

          {/* Header for RTI Adhikari */}
          {authority &&
            authority.find((val) => val === roleId.RTI_ADHIKARI_ROLE_ID) &&
            (((watch("isLOIGenerated") === "false" ||
              (watch("isApplicationMultiDept") == "false" &&
                watch("isLOIGenerated") === "false")) &&
              statusVal === 3) ||
              statusVal === 11 ||
              statusVal === 14 ||
              statusVal == 5) && (
              <Box>
                <Grid
                  container
                  className={commonStyles.title}
                  style={{ marginTop: "8px" }}
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
                      <FormattedLabel id="infoReady" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
            )}

          {/* header for user */}
          {(logedInUser === "citizenUser" ||
            logedInUser === "cfcUser" ||
            (logedInUser === "departmentUser" && checkAuth())) &&
            (statusVal === 14 || statusVal === 11) && (
              <Box>
                <Grid
                  container
                  className={commonStyles.title}
                  style={{ marginTop: "8px" }}
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
                      <FormattedLabel id="infoReady" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
            )}

          <Box>
            <Box>
              <Grid container spacing={1} padding="10px">
                {/* information remark */}
                {((authority &&
                  authority.find(
                    (val) => val === roleId.RTI_ADHIKARI_ROLE_ID
                  ) &&
                  (((watch("isLOIGenerated") === "false" ||
                    (watch("isApplicationMultiDept") == "false" &&
                      watch("isLOIGenerated") === "false")) &&
                    statusVal === 3) ||
                    statusVal === 5)) ||
                  statusVal == 11 ||
                  statusVal == 14) && (
                  <>
                    {" "}
                    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        disabled={
                          statusVal === 14 || statusVal === 11 ? true : false
                        }
                        inputProps={{ maxLength: 500, minLength: 10 }}
                        InputLabelProps={{ shrink: true }}
                        id="standard-textarea"
                        label={
                          <FormattedLabel id="informationRemark" required />
                        }
                        multiline
                        variant="standard"
                        {...register("infoRemark")}
                        error={!!errors.infoRemark}
                        helperText={
                          errors?.infoRemark ? errors.infoRemark.message : null
                        }
                      />
                    </Grid>
                    {/* information ready date */}
                    {((statusVal == 14 &&
                      ((logedInUser === "departmentUser" && checkAuth()) ||
                        logedInUser === "citizenUser")) ||
                      logedInUser === "cfcUser") && (
                      <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                        <TextField
                          disabled={true}
                          InputLabelProps={{ shrink: true }}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          id="standard-textarea"
                          label={
                            statusVal == 14 ? (
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
                    )}
                  </>
                )}

                {/* information return media */}
                {((authority &&
                  authority.find(
                    (val) => val === roleId.RTI_ADHIKARI_ROLE_ID
                  ) &&
                  statusVal == 14) ||
                  statusVal == 11) && (
                  <>
                    <>
                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          disabled={statusVal === 11 ? true : false}
                          id="standard-textarea"
                          label={
                            <FormattedLabel id="completeRemark" required />
                          }
                          multiline
                          inputProps={{ maxLength: 500, minLength: 10 }}
                          variant="standard"
                          {...register("remarks")}
                          error={!!errors.remarks}
                          helperText={
                            errors?.remarks ? errors.remarks.message : null
                          }
                        />
                      </Grid>
                      {statusVal === 11 && (
                        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                          <TextField
                            disabled={true}
                            InputLabelProps={{ shrink: true }}
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-textarea"
                            label={
                              statusVal == 14 ? (
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
                      )}

                      <Grid
                        item
                        xl={statusVal === 11 ? 6 : 12}
                        lg={statusVal === 11 ? 6 : 12}
                        md={statusVal === 11 ? 6 : 12}
                        sm={12}
                        xs={12}
                      >
                        <TextField
                          disabled={statusVal === 11 ? true : false}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          id="standard-textarea"
                          label={<FormattedLabel id="outwardNumber" />}
                          inputProps={{ maxLength: 50, minLength: 10 }}
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
                    </>

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
                      <FormControl
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        variant="standard"
                        error={!!errors.informationReturnMediaKey}
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
                              disabled={statusVal === 11 ? true : false}
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
                          name="informationReturnMediaKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.informationReturnMediaKey
                            ? errors.informationReturnMediaKey.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    {(statusVal == 11 || statusVal == 14) &&
                      ((logedInUser === "departmentUser" && checkAuth()) ||
                        logedInUser === "citizenUser" ||
                        logedInUser === "cfcUser") && (
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
                            disabled={true}
                            InputLabelProps={{ shrink: true }}
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-textarea"
                            label={"RTI Adhikari Full Name"}
                            multiline
                            variant="standard"
                            {...register("rtiFullName")}
                            error={!!errors.rtiFullName}
                            helperText={
                              errors?.rtiFullName
                                ? errors.rtiFullName.message
                                : null
                            }
                          />
                        </Grid>
                      )}
                    {(statusVal == 11 || statusVal == 14) &&
                      ((logedInUser === "departmentUser" && checkAuth()) ||
                        logedInUser === "citizenUser" ||
                        logedInUser === "cfcUser") && (
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
                            disabled={true}
                            InputLabelProps={{ shrink: true }}
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-textarea"
                            label={<FormattedLabel id="emailId" />}
                            multiline
                            variant="standard"
                            {...register("rtiEmailId")}
                            error={!!errors.rtiEmailId}
                            helperText={
                              errors?.rtiEmailId
                                ? errors.rtiEmailId.message
                                : null
                            }
                          />
                        </Grid>
                      )}
                    {(statusVal == 11 || statusVal == 14) &&
                      ((logedInUser === "departmentUser" && checkAuth()) ||
                        logedInUser === "cfcUser" ||
                        logedInUser === "citizenUser") && (
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
                            disabled={true}
                            InputLabelProps={{
                              shrink: watch("rtiContact") ? true : false,
                            }}
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-textarea"
                            label={<FormattedLabel id="contactDetails" />}
                            multiline
                            variant="standard"
                            {...register("rtiContact")}
                            error={!!errors.rtiContact}
                            helperText={
                              errors?.rtiContact
                                ? errors.rtiContact.message
                                : null
                            }
                          />
                        </Grid>
                      )}
                  </>
                )}
              </Grid>
            </Box>
          </Box>
          {authority &&
            authority.find((val) => val === roleId.RTI_ADHIKARI_ROLE_ID) &&
            statusVal == 11 &&
            completeAttach.length != 0 && (
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

          {statusVal == 11 && (
            <Grid container spacing={1} style={{ padding: "10px" }}>
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
                  color: "red",
                }}
              >
                <FormattedLabel id="completeNote" />
              </Grid>
            </Grid>
          )}
          {authority &&
            authority.find((val) => val === roleId.RTI_ADHIKARI_ROLE_ID) &&
            statusVal === 14 && (
              <Grid container spacing={1} style={{ padding: "10px" }}>
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
                  }}
                >
                  <FormattedLabel id="attachDoccument" /> :
                  <UploadButton
                    appName="RTI"
                    serviceName="RTI-Application"
                    filePath={setDocument}
                    fileName={document}
                  />
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
                  }}
                >
                  <FormattedLabel id="thirdPartyAattachDoccument" /> :
                  <UploadButton
                    appName="RTI"
                    serviceName="RTI-Application"
                    filePath={setThirdPartyDocument}
                    fileName={documentThirdParty}
                  />
                </Grid>
              </Grid>
            )}

          <Grid container spacing={1}>
            {/* Payment getway button */}
            {((logedInUser === "departmentUser" && checkAuth()) ||
              logedInUser === "cfcUser" ||
              logedInUser === "citizenUser") &&
              statusVal === 2 && (
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
                      justifyContent: "space-around",
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
                      // color="primary"
                      style={{
                        borderRadius: "20px",
                        backgroundColor: "darkviolet",
                      }}
                      size="small"
                      // endIcon={<ExitToAppIcon />}
                      onClick={() => {
                        router.push({
                          pathname:
                            "/RTIOnlineSystem/transactions/payment/PaymentCollection",
                          query: { id: applicationNumber, trnType: "ap" },
                        });
                      }}
                    >
                      <FormattedLabel id="makePayment" />
                    </Button>
                  </Grid>
                </>
              )}
            {/* view loi buttonn*/}
            {statusVal === 4 &&
              ((logedInUser === "departmentUser" && checkAuth()) ||
                logedInUser === "cfcUser" ||
                logedInUser === "citizenUser") && (
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
                      justifyContent: "space-around",
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
                      color="primary"
                      style={{ borderRadius: "20px" }}
                      size="small"
                      endIcon={<DownloadIcon />}
                      onClick={() => {
                        router.push({
                          pathname:
                            "/RTIOnlineSystem/transactions/acknowledgement/LoiGenerationRecipt",
                          query: { id: applicationNumber },
                        });
                      }}
                    >
                      <FormattedLabel id="downloadLoiReceipt" />
                    </Button>
                  </Grid>
                </>
              )}

            {statusVal === 14 &&
              authority &&
              authority.find((val) => val === roleId.RTI_ADHIKARI_ROLE_ID) && (
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
                      justifyContent: "space-around",
                      alignItems: "center",
                      marginTop: "2rem",
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
                      marginTop: "2rem",
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
                      marginTop: "2rem",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="success"
                      style={{ borderRadius: "20px" }}
                      size="small"
                      disabled={watch("remarks") ? false : true}
                      endIcon={<CheckIcon />}
                      onClick={() => updateCompleteStatus()}
                    >
                      <FormattedLabel id="completeApplication" />
                    </Button>
                  </Grid>
                </>
              )}

            {/* information ready button */}
            {(((watch("isLOIGenerated") === "false" ||
              (watch("isApplicationMultiDept") == "false" &&
                watch("isLOIGenerated") === "false")) &&
              statusVal === 3) ||
              statusVal === 5) &&
              authority &&
              authority.find((val) => val === roleId.RTI_ADHIKARI_ROLE_ID) && (
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
                      justifyContent: "space-around",
                      alignItems: "center",
                      marginTop: "2rem",
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
                      sx={{ marginRight: 8 }}
                      variant="contained"
                      color="success"
                      style={{ borderRadius: "20px" }}
                      size="small"
                      disabled={watch("infoRemark") ? false : true}
                      endIcon={<CheckIcon />}
                      onClick={() => updateInfoReady()}
                    >
                      <FormattedLabel id="infoReady" />
                    </Button>
                  </Grid>
                </>
              )}

            {/* download Aknowldgement */}
            {(logedInUser === "citizenUser" ||
              logedInUser === "cfcUser" ||
              (logedInUser === "departmentUser" && checkAuth())) &&
              statusVal === 3 && (
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
                      justifyContent: "space-around",
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
                      type="button"
                      variant="contained"
                      color="primary"
                      endIcon={<DownloadIcon />}
                      style={{ borderRadius: "20px" }}
                      size="small"
                      onClick={() => {
                        router.push({
                          pathname:
                            "/RTIOnlineSystem/transactions/acknowledgement/rtiApplication",
                          query: { id: applicationNumber },
                        });
                      }}
                    >
                      <FormattedLabel id="downloadAcknowldgement" />
                    </Button>
                  </Grid>
                </>
              )}

            {/* Back button */}
            {(statusVal === 11 ||
              statusVal == 15 ||
              ((logedInUser === "citizenUser" || logedInUser === "cfcUser") &&
                (statusVal === 5 || statusVal === 14 || statusVal === 0)) ||
              (authority?.includes(roleId.RTI_ADHIKARI_ROLE_ID) &&
                (statusVal === 11 ||
                  statusVal == 15 ||
                  statusVal === 4 ||
                  (statusVal === 3 &&
                    (watch("isApplicationMultiDept") == "false" ||
                      watch("isRejected") === null ||
                      watch("isRejected") === "true" ||
                      childDept.length != 0) &&
                    watch("isLOIGenerated") != "false")))) && (
              <>
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
              </>
            )}
          </Grid>
        </Paper>
      </ThemeProvider>

      {/* Modal for loi */}
      <Modal
        title="Modal For LOI"
        open={isModalOpenForResolved}
        onOk={true}
        onClose={handleCancel} // ISKI WAJHASE KAHI BHI CLICK KRNE PER MODAL CLOSE HOTA HAI
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
          <>
            {isLoiLoading && <CommonLoader />}
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
                    <FormattedLabel id="loiGenerate" />
                  </h3>
                </Grid>
              </Grid>
            </Box>
            <FormProvider {...methods2}>
              <form onSubmit={handleSubmit2(OnSubmitloiGenerated)}>
                <Grid container spacing={1} sx={{ padding: "10px" }}>
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      id="standard-textarea"
                      label={<FormattedLabel id="applicationNo" />}
                      multiline
                      variant="standard"
                      {...register1("applicationNo")}
                      error={!!error2.applicationNo}
                      helperText={
                        error2?.applicationNo
                          ? error2.applicationNo.message
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
                      {...register1("applicantFirstName")}
                      error={!!error2.applicantFirstName}
                      helperText={
                        error2?.applicantFirstName
                          ? error2.applicantFirstName.message
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
                      label={<FormattedLabel id="serviceName" />}
                      multiline
                      variant="standard"
                      {...register1("serviceName")}
                      error={!!error2.serviceName}
                      helperText={
                        error2?.serviceName ? error2.serviceName.message : null
                      }
                    />
                  </Grid>
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <FormControl
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      variant="standard"
                      error={!!errors.departmentKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="departmentKey" required />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            autoFocus
                            sx={{ width: "100%" }}
                            disabled
                            fullWidth
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value), getSubDepartmentDetails();
                            }}
                            label={<FormattedLabel id="departmentKey" />}
                          >
                            {departments &&
                              departments.map((department, index) => (
                                <MenuItem key={index} value={department.id}>
                                  {language == "en"
                                    ? department.department
                                    : department.departmentMr}
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

                  <Grid item xl={8} lg={8} md={12} sm={12} xs={12}>
                    <TextField
                      disabled={
                        statusVal === 4 ||
                        statusVal == 5 ||
                        statusVal == 11 ||
                        statusVal == 14
                          ? true
                          : false
                      }
                      label={<FormattedLabel id="remark" required />}
                      id="standard-textarea"
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      variant="standard"
                      multiline
                      inputProps={{ maxLength: 500 }}
                      {...register1("remarks")}
                      error={!!error2.remarks}
                      helperText={
                        error2?.remarks ? error2.remarks.message : null
                      }
                    />
                  </Grid>
                </Grid>

                {/* <Container> */}
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    marginBottom: "10px",
                    marginRight: "40px",
                  }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    disabled={buttonInputState || amountValue.length >= 7}
                    endIcon={<AddBoxOutlinedIcon />}
                    onClick={() => {
                      setBtnSaveText("Save");
                      setEditButtonInputState(true);
                      setSlideChecked(true);
                    }}
                  >
                    <FormattedLabel id="addMore" />
                  </Button>
                </Box>
                {
                  <Slide
                    direction="down"
                    in={slideChecked}
                    mountOnEnter
                    unmountOnExit
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                        <FormControl
                          sx={{
                            m: { xs: 0, md: 1 },
                            minWidth: "100%",
                            // maxWidth: "200px",
                          }}
                          variant="standard"
                          error={!watch("serviceChargeTypeId") && showError}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="chargeType" required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                {...register(`serviceChargeTypeId`)}
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                                error={
                                  !watch("serviceChargeTypeId") && showError
                                }
                              >
                                {chargeTypeList &&
                                  chargeTypeList.map((value, index) => (
                                    <MenuItem
                                      key={index}
                                      value={value?.id}
                                      disabled={amountValue.find(
                                        (obj) =>
                                          obj.serviceChargeTypeId === value.id
                                      )}
                                    >
                                      {language == "en"
                                        ? value?.serviceChargeType
                                        : value?.serviceChargeTypeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name={`serviceChargeTypeId`}
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {!watch("serviceChargeTypeId") && showError ? (
                              <span style={{ color: "red", fontSize: "14px" }}>
                                {language == "en"
                                  ? "Charge type is required"
                                  : "शुल्काचे नाव आवश्यक आहे"}
                              </span>
                            ) : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                        <TextField
                          label={<FormattedLabel id="quantity" />}
                          id="standard-textarea"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          variant="standard"
                          type="number"
                          inputProps={{ maxLength: 500 }}
                          {...register(`unit`)}
                          error={!watch("unit") && showError}
                          helperText={
                            !watch("unit") && showError ? (
                              <span style={{ color: "red", fontSize: "14px" }}>
                                {language == "en"
                                  ? "Quantity is required"
                                  : "प्रमाण आवश्यक आहे"}
                              </span>
                            ) : null
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                        <TextField
                          label={<FormattedLabel id="amount" />}
                          id="standard-textarea"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          variant="standard"
                          type="number"
                          inputProps={{ maxLength: 500 }}
                          {...register("amount")}
                          error={!watch("amount") && showError}
                          helperText={
                            !watch("amount") && showError ? (
                              <span style={{ color: "red", fontSize: "14px" }}>
                                {language == "en"
                                  ? "Amount is required"
                                  : "रक्कम आवश्यक आहे"}
                              </span>
                            ) : null
                          }
                        />
                      </Grid>

                      <Grid
                        container
                        spacing={1}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          paddingTop: "10px",
                          marginTop: "20px",
                        }}
                      >
                        <Grid item>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            endIcon={<ExitToAppIcon />}
                            onClick={() => {
                              setValue("amount", "");
                              setValue("unit", "");
                              setValue("serviceChargeTypeId", "");
                              setShowError(false);
                              setSlideChecked(false);
                              setButtonInputState(false);
                              setEditButtonInputState(false);
                            }}
                          >
                            <FormattedLabel id="exit" />
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            endIcon={<ClearIcon />}
                            onClick={() => {
                              setValue("amount", "");
                              setValue("unit", "");
                              setValue("serviceChargeTypeId", "");
                            }}
                          >
                            <FormattedLabel id="clear" />
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={addRateChart}
                            endIcon={<SaveIcon />}
                          >
                            {btnSaveText === "Update" ? (
                              <FormattedLabel id="update" />
                            ) : (
                              <FormattedLabel id="save" />
                            )}
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Slide>
                }

                <Grid container spacing={1} sx={{ padding: "5px" }}>
                  <DataGrid
                    autoHeight
                    disabled={editButtonInputState}
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
                    rows={amountValue || []}
                    columns={addRateColumns}
                  />
                </Grid>

                {amountValue.length != 0 && (
                  <Grid container sx={{ paddingLeft: "2rem" }}>
                    <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                      <TextField
                        label={<FormattedLabel id="totalAmount" required />}
                        id="standard-textarea"
                        InputLabelProps={{ shrink: true }}
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        variant="standard"
                        disabled
                        value={totalAmount}
                        {...register1("totalAmount")}
                        error={!!error2.totalAmount}
                        helperText={
                          error2?.totalAmount
                            ? error2.totalAmount.message
                            : null
                        }
                      />
                    </Grid>
                  </Grid>
                )}

                <Grid container spacing={1} sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xl={statusVal == 3 ? 6 : 12}
                    lg={statusVal == 3 ? 6 : 12}
                    md={statusVal == 3 ? 6 : 12}
                    sm={12}
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
                      size="small"
                      endIcon={<ClearIcon />}
                      onClick={() => handleCancel()}
                    >
                      <FormattedLabel id="closeModal" />
                    </Button>
                  </Grid>
                  {statusVal == 3 && (
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
                        type="submit"
                        variant="contained"
                        size="small"
                        disabled={amountValue.length == 0}
                        color="success"
                        endIcon={<SaveIcon />}
                      >
                        <FormattedLabel id="loiGenerateBtn" />
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </form>
            </FormProvider>
          </>
        </Box>
      </Modal>

      {/* modal for multi department */}
      <Modal
        title="Modal For Multi Department"
        open={isMultiDept}
        onOk={true}
        onClose={handleCancel1}
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
            height: "70vh",
          }}
        >
          <>
            {isMultiDeptLoading && <CommonLoader />}

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
                    <FormattedLabel id="addDepartment" />
                  </h3>
                </Grid>
              </Grid>
            </Box>
            <FormProvider {...methods2}>
              <Grid container spacing={1} sx={{ padding: "5px" }}>
                <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                  <FormControl
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    error={!!errors.childZoneKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="zoneKey" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ width: "100%" }}
                          fullWidth
                          variant="standard"
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                          label="Complaint Type"
                        >
                          {zoneDetails &&
                            zoneDetails?.map((zoneDetails, index) => (
                              <MenuItem key={index} value={zoneDetails.id}>
                                {language == "en"
                                  ? zoneDetails?.zoneName
                                  : zoneDetails?.zoneNameMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="childZoneKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.childZoneKey
                        ? errors.childZoneKey.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                  <FormControl
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    error={!!errors.childOfficeLocationKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="officeLocation" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ width: "100%" }}
                          fullWidth
                          variant="standard"
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                          label="Complaint Type"
                        >
                          {officeLocForChild &&
                            officeLocForChild?.map((officeLocation, index) => (
                              <MenuItem key={index} value={officeLocation.id}>
                                {language == "en"
                                  ? officeLocation?.officeLocationName
                                  : officeLocation?.officeLocationNameMar}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="childOfficeLocationKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.childOfficeLocationKey
                        ? errors.childOfficeLocationKey.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                  <FormControl
                    variant="standard"
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  >
                    <InputLabel id="selectedStudents-label">
                      <FormattedLabel id="departmentName" />
                    </InputLabel>
                    <Controller
                      name="selectedDepartments"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          labelId="selectedStudents-label"
                          id="selectedStudents"
                          multiple
                          value={serviceId}
                          onChange={(e) => {
                            handleChange(e, e.target.value);
                          }}
                          renderValue={(selected) =>
                            selected.includes("all")
                              ? "Select All"
                              : selected
                                  .map((id) =>
                                    language == "en"
                                      ? dependantDept.find(
                                          (student) => student.id === id
                                        )?.department
                                      : dependantDept.find(
                                          (student) => student.id === id
                                        )?.departmentMr
                                  )
                                  .join(", ")
                          }
                        >
                          {dependantDept?.length > 0 && (
                            <MenuItem key="all" value="all">
                              <Checkbox
                                checked={
                                  serviceId.length === dependantDept.length
                                }
                                indeterminate={
                                  serviceId.length > 0 &&
                                  serviceId.length < dependantDept.length
                                }
                                onChange={(e) => handleChange(e, "all")}
                              />
                              {language == "en" ? "Select All" : "सर्व निवडा"}
                            </MenuItem>
                          )}

                          {dependantDept.map((dept) => (
                            <MenuItem key={dept.id} value={dept.id}>
                              <Checkbox
                                checked={serviceId.includes(dept.id)}
                                onChange={(e) => handleChange(e, dept.id)}
                              />
                              {language === "en"
                                ? dept?.department
                                : dept?.departmentMr}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>

                {subDepartments.length != 0 && watch("childdepartment") && (
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                    <FormControl
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      variant="standard"
                      error={!!errors.childsubDept}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="subDepartmentKey" required />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            fullWidth
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="subDepartmentKey" />}
                          >
                            {subDepartments &&
                              subDepartments?.map((subDepartment, index) => (
                                <MenuItem key={index} value={subDepartment.id}>
                                  {language == "en"
                                    ? subDepartment.subDepartment
                                    : subDepartment.subDepartmentMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="childsubDept"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.childsubDept
                          ? errors.childsubDept.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                )}
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    label={<FormattedLabel id="remark" />}
                    id="standard-textarea"
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    variant="standard"
                    multiline
                    inputProps={{ maxLength: 500 }}
                    {...register1("childRemark")}
                    error={!!error2.childRemark}
                    helperText={
                      error2?.childRemark ? error2.childRemark.message : null
                    }
                  />
                </Grid>

                <Grid
                  container
                  spacing={1}
                  sx={{ padding: "10px", marginTop: "5px" }}
                  alignItems="center"
                >
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
                      // sx={{ width: "100%" }}
                      variant="contained"
                      color="error"
                      size="small"
                      endIcon={<ClearIcon />}
                      onClick={() => handleCancel1()}
                    >
                      <FormattedLabel id="closeModal" />
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
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      // sx={{ width: "100%" }}
                      type="submit"
                      size="small"
                      variant="contained"
                      color="success"
                      disabled={
                        serviceId.length != 0 &&
                        watch1("childRemark") &&
                        watch("childOfficeLocationKey") &&
                        watch("childZoneKey")
                          ? false
                          : true
                      }
                      onClick={() => onSubmitAddChildren()}
                      endIcon={<SaveIcon />}
                    >
                      <FormattedLabel id="save" />
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </FormProvider>
          </>
        </Box>
      </Modal>
    </>
  );
};

export default EntryForm;
