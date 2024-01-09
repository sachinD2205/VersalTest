/* eslint-disable react-hooks/rules-of-hooks */
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  Modal,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  ThemeProvider,
  Tooltip,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Loader from "../../../../containers/Layout/components/Loader";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import moment from "moment";
import DownloadIcon from "@mui/icons-material/Download";
import DraftsIcon from "@mui/icons-material/Drafts";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import { manageStatus } from "../../../../components/rtiOnlineSystem/commonStatus/manageEnMr";
import bsupUserRoles from "../../../../components/bsupNagarVasthi/userRolesBSUP";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import theme from "../../../../theme";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";

const newApplicationSchemes = () => {
  const router = useRouter();
  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const language = useSelector((state) => state.labels.language);
  const [totalElements, setTotalElements] = useState();
  const [dataPageNo, setDataPage] = useState();
  const [pageNo, setPageNo] = useState();
  const [pageSize, setPageSize] = useState();
  const [crAreaNames, setCRAreaName] = useState([]);
  const [regDetails, setRegDetails] = useState(null);
  const [statusAll, setStatus] = useState(null);

  const [samuhaSanghatakRemark, setSamuhaSanghatakRemark] = useState("");
  const [deptClerkRemark, setDeptClerkRemark] = useState("");
  const [asstCommissionerRemark, setAsstCommissionerRemark] = useState("");
  const [deptyCommissionerRemark, setDeptyCommissionerRemark] = useState("");

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedCheckbox, setSelectedCheckbox] = useState("");

  const [open, setOpen] = useState(false);
  const [isRemarksFilled, setIsRemarksFilled] = useState(false);

  const [bachatgatrejectionCategories, setBachatgatrejectionCategories] =
    useState([]);
  const [bachatgatApprovalCategories, setBachatgatApprovalCategories] =
    useState([]);
  const [bachatgatRevertCategories, setBachatgatRevertCategories] = useState(
    []
  );
  const [serviceId, setServiceId] = useState([]);

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

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const {
    register,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm({});

  //get logged in user
  const user = useSelector((state) => state.user.user);
  const loggedUser = localStorage.getItem("loggedInUser");
  const [mainNames, setMainNames] = useState([]);
  const [subSchemeNames, setSubSchemeNames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hanadleStudent, setHanadleStudent] = useState([]);
  // const headers =
  //   loggedUser === "citizenUser"
  //     ? { Userid: user?.id, Authorization: `Bearer ${user?.token}` }
  //     : { Authorization: `Bearer ${user?.token}` };

  const headers = { Authorization: `Bearer ${user?.token}` };
  useEffect(() => {
    getAllStatus();
    getZoneName();
    getWardNames();
    getCRAreaName();
    getMainScheme();
    getAllSubSchemes();
    getRejectCategories();
  }, []);

  useEffect(() => {
    setIsRemarksFilled(
      watch("deptClerkRemark") ||
        watch("asstCommissionerRemark") ||
        watch("deptyCommissionerRemark")
    );
  }, [
    watch("deptClerkRemark"),
    watch("asstCommissionerRemark"),
    watch("deptyCommissionerRemark"),
  ]);

  useEffect(() => {
    getBachatGatCategoryNewScheme();
  }, [zoneNames, wardNames, crAreaNames, mainNames, subSchemeNames]);

  const handleSelectionChange = (params) => {
    setSelectedRows(params);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (selectedCheckbox === "approve") {
      setBachatgatRevertCategories(
        bachatgatApprovalCategories.filter((obj) => obj.categoryType === "1")
      );
      setValue("saSanghatakRemark", "");
      setValue("deptClerkRemark", "");
      setValue("asstCommissionerRemark", "");
      setValue("deptyCommissionerRemark", "");
      setServiceId([]);
      setHanadleStudent([]);
    } else if (selectedCheckbox === "revert") {
      setBachatgatRevertCategories(
        bachatgatApprovalCategories.filter((obj) => obj.categoryType === "2")
      );
      setValue("saSanghatakRemark", "");
      setValue("deptClerkRemark", "");
      setValue("asstCommissionerRemark", "");
      setValue("deptyCommissionerRemark", "");
      setServiceId([]);
      setHanadleStudent([]);
    } else if (selectedCheckbox === "reject") {
      setBachatgatRevertCategories(
        bachatgatApprovalCategories.filter((obj) => obj.categoryType === "3")
      );
      setValue("saSanghatakRemark", "");
      setValue("deptClerkRemark", "");
      setValue("asstCommissionerRemark", "");
      setValue("deptyCommissionerRemark", "");
      setServiceId([]);
      setHanadleStudent([]);
    }
  }, [selectedCheckbox]);

  const handleChange = (event, studentId, fieldName) => {
    switch (fieldName) {
      case "saSanghatakRemark":
        if (studentId === "all") {
          if (event.target.checked) {
            setServiceId(
              bachatgatRevertCategories.map((student) => student.id)
            );
            setHanadleStudent(
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
            setSamuhaSanghatakRemark(
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
            let string = bachatgatRevertCategories.map(
              (student) => student.rejectCat
            );
            setValue(
              "saSanghatakRemark",
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
          } else {
            setServiceId([]);
            setHanadleStudent([]);
            setSamuhaSanghatakRemark("");
            setValue("saSanghatakRemark", "");
          }
        } else {
          let dummy = bachatgatRevertCategories.find(
            (obj) => obj.id === studentId
          )?.rejectCat;
          if (event.target.checked) {
            setServiceId([...serviceId, studentId]);
            setHanadleStudent([...hanadleStudent, dummy]);
            setSamuhaSanghatakRemark(...hanadleStudent, dummy);
            setValue("saSanghatakRemark", [...hanadleStudent, dummy]);
          } else {
            setServiceId(serviceId?.filter((obj) => obj !== studentId));
            setHanadleStudent(hanadleStudent?.filter((obj) => obj !== dummy));
            setSamuhaSanghatakRemark(
              hanadleStudent?.filter((obj) => obj !== dummy)
            );
            setValue(
              "saSanghatakRemark",
              hanadleStudent?.filter((obj) => obj !== dummy)
            );
          }
        }
        break;
      case "deptClerkRemark":
        // setDeptClerkRemark(studentId);
        if (studentId === "all") {
          if (event.target.checked) {
            setServiceId(
              bachatgatRevertCategories.map((student) => student.id)
            );
            setHanadleStudent(
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
            setDeptClerkRemark(
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
            setValue(
              "deptClerkRemark",
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
          } else {
            setServiceId([]);
            setHanadleStudent([]);
            setDeptClerkRemark("");
            setValue("deptClerkRemark", "");
          }
        } else {
          let dummy = bachatgatRevertCategories.find(
            (obj) => obj.id === studentId
          )?.rejectCat;
          if (event.target.checked) {
            setServiceId([...serviceId, studentId]);
            setHanadleStudent([...hanadleStudent, dummy]);
            setDeptClerkRemark([...hanadleStudent, dummy]);
            setValue("deptClerkRemark", [...hanadleStudent, dummy]);
          } else {
            setServiceId(serviceId?.filter((obj) => obj !== studentId));
            setHanadleStudent(hanadleStudent?.filter((obj) => obj !== dummy));
            setDeptClerkRemark(hanadleStudent?.filter((obj) => obj !== dummy));
            setValue(
              "deptClerkRemark",
              hanadleStudent?.filter((obj) => obj !== dummy)
            );
          }
        }
        break;
      case "asstCommissionerRemark":
        // setAsstCommissionerRemark(studentId);
        if (studentId === "all") {
          if (event.target.checked) {
            setServiceId(
              bachatgatRevertCategories.map((student) => student.id)
            );
            setHanadleStudent(
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
            setAsstCommissionerRemark(
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
            setValue(
              "asstCommissionerRemark",
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
          } else {
            setServiceId([]);
            setHanadleStudent([]);
            setAsstCommissionerRemark("");
            setValue("asstCommissionerRemark", "");
          }
        } else {
          let dummy = bachatgatRevertCategories.find(
            (obj) => obj.id === studentId
          )?.rejectCat;
          if (event.target.checked) {
            setServiceId([...serviceId, studentId]);
            setHanadleStudent([...hanadleStudent, dummy]);
            setAsstCommissionerRemark([...hanadleStudent, dummy]);
            setValue("asstCommissionerRemark", [...hanadleStudent, dummy]);
          } else {
            setServiceId(serviceId?.filter((obj) => obj !== studentId));
            setHanadleStudent(hanadleStudent?.filter((obj) => obj !== dummy));
            setAsstCommissionerRemark(
              hanadleStudent?.filter((obj) => obj !== dummy)
            );
            setValue(
              "asstCommissionerRemark",
              hanadleStudent?.filter((obj) => obj !== dummy)
            );
          }
        }
        break;
      case "deptyCommissionerRemark":
        // setDeptyCommissionerRemark(studentId);
        if (studentId === "all") {
          if (event.target.checked) {
            setServiceId(
              bachatgatRevertCategories.map((student) => student.id)
            );
            setHanadleStudent(
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
            setDeptyCommissionerRemark(
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
            setValue(
              "deptyCommissionerRemark",
              bachatgatRevertCategories.map((student) => student.rejectCat)
            );
          } else {
            setServiceId([]);
            setHanadleStudent([]);
            setDeptyCommissionerRemark("");
            setValue("deptyCommissionerRemark", "");
          }
        } else {
          let dummy = bachatgatRevertCategories.find(
            (obj) => obj.id === studentId
          )?.rejectCat;
          if (event.target.checked) {
            setServiceId([...serviceId, studentId]);
            setHanadleStudent([...hanadleStudent, dummy]);
            setDeptyCommissionerRemark([...hanadleStudent, dummy]);
            setValue("deptyCommissionerRemark", [...hanadleStudent, dummy]);
          } else {
            setServiceId(serviceId?.filter((obj) => obj !== studentId));
            setHanadleStudent(hanadleStudent?.filter((obj) => obj !== dummy));
            setDeptyCommissionerRemark(
              hanadleStudent?.filter((obj) => obj !== dummy)
            );
            setValue(
              "deptyCommissionerRemark",
              hanadleStudent?.filter((obj) => obj !== dummy)
            );
          }
        }
        break;
      default:
        break;
    }

    // if (studentId === "all") {
    //   if (event.target.checked) {
    //     setServiceId(bachatgatRevertCategories.map((student) => student.id));
    //     setHanadleStudent(
    //       bachatgatRevertCategories.map((student) => student.rejectCat)
    //     );
    //   } else {
    //     setServiceId([]);
    //     setHanadleStudent([]);
    //   }
    // } else {
    //   if (event.target.checked) {
    //     let dummy = bachatgatRevertCategories.find(
    //       (obj) => obj.id === studentId
    //     )?.rejectCat;
    //     setServiceId([...serviceId, studentId]);
    //     setHanadleStudent([...hanadleStudent, dummy]);
    //   } else {
    //     setServiceId(serviceId?.filter((obj) => obj !== studentId));
    //     setHanadleStudent(hanadleStudent?.filter((obj) => obj !== studentId));
    //   }
    // }
  };

  const handleRemarkChange = (event) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    switch (fieldName) {
      case "saSanghatakRemark":
        setSamuhaSanghatakRemark(fieldValue);
        break;
      case "deptClerkRemark":
        setDeptClerkRemark(fieldValue);
        break;
      case "asstCommissionerRemark":
        setAsstCommissionerRemark(fieldValue);
        break;
      case "deptyCommissionerRemark":
        setDeptyCommissionerRemark(fieldValue);
        break;
      default:
        break;
    }
  };

  const isRowSelectable = (params) => {
    // if (authority && authority.find((val) => val === "PROPOSAL APPROVAL")) {
    if (
      authority &&
      authority.find((val) => val === bsupUserRoles.roleZonalClerk)
    ) {
      return params.row.statusVal === 3 || params.row.statusVal === 4;
      // } else if (authority && authority.find((val) => val === "APPROVAL")) {
    } else if (
      authority &&
      authority.find((val) => val === bsupUserRoles.roleZonalOfficer)
    ) {
      return params.row.statusVal === 5 || params.row.statusVal === 6;
      // } else if (authority && authority.find((val) => val === "FINAL_APPROVAL")) {
    } else if (
      authority &&
      authority.find((val) => val === bsupUserRoles.roleHOClerk)
    ) {
      return params.row.statusVal === 7;
    }
  };
  const handleCheckboxChange = (event) => {
    setSelectedCheckbox(event.target.value);
  };

  const handleApprove = () => {
    setRemark("approve");
    setOpen(false);
  };
  const handleRevert = () => {
    setRemark("revert");
    setOpen(false);
  };
  // const handleReject = () => {
  //   setRemark("reject");
  //   setOpen(false);
  // };

  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );
  // const authority = user?.menus?.find((r) => {
  //   return r.id == selectedMenuFromDrawer;
  // })?.roles;
  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roleIds;

  const catchMethod = (err) => {
    if (err.message === "Network Error") {
      sweetAlert(
        language == "en" ? "Network Error" : "नेटवर्क त्रुटी !",
        language == "en"
          ? "Server is unreachable or may be a network issue, please try after sometime"
          : "सर्व्हर पोहोचण्यायोग्य नाही किंवा नेटवर्क समस्या असू शकते, कृपया काही वेळानंतर प्रयत्न करा",
        "error",
        {
          button: language === "en" ? "Ok" : "ठीक आहे",
          allowOutsideClick: false, // Prevent closing on outside click
          allowEscapeKey: false, // Prevent closing on Esc key
          closeOnClickOutside: false,
        }
      );
    } else if (err.message === "Request failed with status code 404") {
      sweetAlert(
        language == "en" ? "Bad Request" : "वाईट विनंती !",
        language == "en" ? "Unauthorized access !" : "अनधिकृत पोहोच !!",
        "error",
        {
          button: language === "en" ? "Ok" : "ठीक आहे",
          allowOutsideClick: false, // Prevent closing on outside click
          allowEscapeKey: false, // Prevent closing on Esc key
          closeOnClickOutside: false,
        }
      );
    } else {
      sweetAlert(
        language == "en" ? "Error" : "त्रुटी !",
        language == "en" ? "Something went to wrong !" : "काहीतरी चूक झाली!",
        "error",
        {
          button: language === "en" ? "Ok" : "ठीक आहे",
          allowOutsideClick: false, // Prevent closing on outside click
          allowEscapeKey: false, // Prevent closing on Esc key
          closeOnClickOutside: false,
        }
      );
    }
  };

  const getRejectCategories = () => {
    axios
      .get(
        `${urls.BSUPURL}/mstRejectCategory/getAllSchemeRejectionCategories`,
        {
          headers: headers,
        }
      )
      .then((r) => {
        setBachatgatApprovalCategories(
          r.data.mstRejectCategoryDao.map((row) => ({
            id: row.id,
            rejectCat: row.rejectCat,
            rejectCatMr: row.rejectCatMr,
            forBachatGatorScheme: row.forBachatGatorScheme,
            categoryType: row.categoryType,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getAllStatus = () => {
    axios
      .get(`${urls.BSUPURL}/mstStatus/getAll`, {
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

  // Load zone
  const getZoneName = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setZoneNames(
          r.data.zone.map((row) => ({
            id: row.id,
            zoneName: row.zoneName,
            zoneNameMr: row.zoneNameMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // load wards
  const getWardNames = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setWardNames(
          r.data.ward.map((row) => ({
            id: row.id,
            wardName: row.wardName,
            wardNameMr: row.wardNameMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // getAreaName
  const getCRAreaName = () => {
    axios
      .get(`${urls.CfcURLMaster}/area/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setCRAreaName(
          r.data.area.map((row) => ({
            id: row.id,
            crAreaName: row.areaName,
            crAreaNameMr: row.areaNameMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // load scheme details
  const getBachatGatCategoryNewScheme = (_pageSize = 10, _pageNo = 0) => {
    {
      setIsLoading(true);
      axios
        .get(`${urls.BSUPURL}/trnSchemeApplicationNew/getAll`, {
          headers: headers,
          params: {
            pageSize: _pageSize,
            pageNo: _pageNo,
          },
        })
        .then((r) => {
          setIsLoading(false);
          setRegDetails(r);
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  useEffect(() => {
    if (regDetails != null && statusAll != null) {
      setBachatGatCategoryNewSchemes();
    }
  }, [regDetails, language]);

  // load main scheme
  const getMainScheme = () => {
    axios
      .get(`${urls.BSUPURL}/mstMainSchemes/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setMainNames(
          r.data.mstMainSchemesList.map((row) => ({
            id: row.id,
            schemeName: row.schemeName,
            schemePrefix: row.schemePrefix,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getAllSubSchemes = (_pageSize = 10, _pageNo = 0) => {
    setIsLoading(true);
    axios
      .get(`${urls.BSUPURL}/mstSubSchemes/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: null,
        },
        headers: headers,
      })
      .then(async (r) => {
        setIsLoading(false);
        let result = r.data.mstSubSchemesList;
        let _res =
          result &&
          result.map((r, i) => {
            return {
              id: r.id,
              subSchemeName: r.subSchemeName ? r.subSchemeName : "-",
            };
          });
        // subschemeList = _res;
        await setSubSchemeNames(_res);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  // set details to list
  const setBachatGatCategoryNewSchemes = () => {
    let result = regDetails.data.trnSchemeApplicationNewList;
    if (result.length != 0 && result != null) {
      if (wardNames && zoneNames && crAreaNames) {
        let _res = result?.map((r, i) => {
          return {
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1 + regDetails.data.pageNo * regDetails.data.pageSize,
            zoneKey: zoneNames?.find((obj) => obj.id == r.zoneKey)?.zoneName
              ? zoneNames?.find((obj) => obj.id == r.zoneKey)?.zoneName
              : "-",
            zoneKeyMr: zoneNames?.find((obj) => obj.id == r.zoneKey)?.zoneNameMr
              ? zoneNames?.find((obj) => obj.id == r.zoneKey)?.zoneNameMr
              : "-",
            wardKey: wardNames?.find((obj) => obj.id == r.wardKey)?.wardName
              ? wardNames?.find((obj) => obj.id == r.wardKey)?.wardName
              : "-",
            wardKeyMr: wardNames?.find((obj) => obj.id == r.wardKey)?.wardNameMr
              ? wardNames?.find((obj) => obj.id == r.wardKey)?.wardNameMr
              : "-",
            areaKey: crAreaNames?.find((obj) => {
              return obj.id == r.areaKey;
            })?.crAreaName
              ? crAreaNames?.find((obj) => obj.id == r.areaKey)?.crAreaName
              : "-",
            areaKeyMr: crAreaNames?.find((obj) => {
              return obj.id == r.areaKey;
            })?.crAreaNameMr
              ? crAreaNames?.find((obj) => obj.id == r.areaKey)?.crAreaNameMr
              : "-",
            applicantAadharNo: r.applicantAadharNo,
            applicationNo: r.applicationNo,
            buildingName: r.buildingName,
            roadName: r.roadName,
            mobileNo: r.mobileNo,
            emailId: r.emailId,
            isBenifitedPreviously: r.isBenifitedPreviously,
            pincode: r.pincode,
            statusVal: r.status,
            applicantName:
              r.applicantFirstName +
              " " +
              r.applicantMiddleName +
              " " +
              r.applicantLastName,
            applicantFirstName: r.applicantFirstName,
            applicantMiddleName: r.applicantMiddleName,
            applicantLastName: r.applicantLastName,
            trnSchemeApplicationDocumentsList:
              r.trnSchemeApplicationDocumentsList,
            createdDate: moment(r?.createDtTm).format("DD/MM/YYYY"),
            applicationDate: moment(r.createDtTm).format("DD/MM/YYYY"),
            schemeName: mainNames?.find((obj) => obj.id == r.mainSchemeKey)
              ?.schemeName
              ? mainNames?.find((obj) => obj.id == r.mainSchemeKey)?.schemeName
              : "-",
            subSchemeName: subSchemeNames?.find(
              (obj) => obj.id == r.subSchemeKey
            )?.subSchemeName
              ? subSchemeNames?.find((obj) => obj.id == r.subSchemeKey)
                  ?.subSchemeName
              : "-",
            amountPaid: r.amountPaid,
            benefitAmount: r.benefitAmount,
            currStatus: manageStatus(r.status, language, statusAll),
          };
        });
        setData({
          rows: _res,
          totalRows: regDetails.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: regDetails.data.pageSize,
          page: regDetails.data.pageNo,
        });

        setPageSize(regDetails.data.pageSize);
        setPageNo(regDetails.data.pageNo);
        setTotalElements(regDetails.data.totalElements);
      }
    }
  };

  // columns
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "applicationNo",
      headerName: <FormattedLabel id="applicationNo" />,
      width: 250,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "applicationDate",
      headerName: <FormattedLabel id="schemeApplicationDate" />,
      width: 250,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "applicantName",
      headerName: <FormattedLabel id="applicantName" />,
      width: 250,
      align: "left",
      headerAlign: "center",
    },
    // {
    //   field: language === "en" ? "areaKey" : "areaKeyMr",
    //   headerName: <FormattedLabel id="areaNm" />,
    //   width: 250,
    //   align: "left",
    //   headerAlign: "center",
    // },
    // {
    //   field: language === "en" ? "zoneKey" : "zoneKeyMr",
    //   headerName: <FormattedLabel id="zoneNames" />,
    //   width: 200,
    //   align: "left",
    //   headerAlign: "center",
    // },
    // {
    //   field: language === "en" ? "wardKey" : "wardKeyMr",
    //   headerName: <FormattedLabel id="wardname" />,
    //   width: 200,
    //   align: "left",
    //   headerAlign: "center",
    // },

    {
      field: "applicantAadharNo",
      headerName: <FormattedLabel id="applicantAdharNo" />,
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: "createdDate",
    //   headerName: <FormattedLabel id="schemeApplicationDate" />,
    //   width: 200,
    //   align: "left",
    //   headerAlign: "center",
    // },
    {
      field: "schemeName",
      headerName: <FormattedLabel id="mainSchemeNameT" />,
      width: 250,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "subSchemeName",
      headerName: <FormattedLabel id="subSchemeNameT" />,
      width: 250,
      align: "left",
      headerAlign: "center",
    },
    // {
    //   field: "amountPaid",
    //   headerName: <FormattedLabel id="benefitAmount" />,
    //   width: 250,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "benefitAmount",
      headerName: <FormattedLabel id="benefitAmount" />,
      width: 150,
      align: "right",
      headerAlign: "center",
      valueFormatter: (params) => {
        if (params.value !== null && typeof params.value !== "undefined") {
          return params.value.toFixed(2);
        } else {
          return "-";
        }
      },
    },
    {
      field: "currStatus",
      headerName: <FormattedLabel id="currentStatus" />,
      width: 250,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              onClick={() => {
                (loggedUser == "citizenUser" || loggedUser === "cfcUser") &&
                params.row.statusVal == 1
                  ? router.push({
                      pathname:
                        "/BsupNagarvasthi/transaction/newApplicationScheme/edit",
                      query: {
                        id: params.row.id,
                      },
                    })
                  : router.push({
                      pathname:
                        "/BsupNagarvasthi/transaction/newApplicationScheme/view",
                      query: {
                        id: params.row.id,
                      },
                    });
              }}
            >
              <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
            </IconButton>

            {params?.row?.statusVal === 0 && loggedUser == "citizenUser" && (
              <>
                <IconButton
                  onClick={() => {
                    router.push({
                      pathname:
                        "/BsupNagarvasthi/transaction/newApplicationScheme",
                      query: { id: params.row.id },
                    });
                  }}
                >
                  <DraftsIcon style={{ color: "#556CD6" }} />
                </IconButton>
              </>
            )}

            {(loggedUser == "citizenUser" || loggedUser === "cfcUser") &&
              params.row.statusVal === 2 && (
                <IconButton
                  onClick={() => {
                    router.push({
                      pathname: "/BsupNagarvasthi/transaction/acknowledgement",
                      query: { id: params.row.applicationNo, trn: "N" },
                    });
                  }}
                >
                  <Tooltip title={`DOWNLOAD ACKNOWLEDGEMENT`}>
                    <DownloadIcon style={{ color: "blue" }} />
                  </Tooltip>
                </IconButton>
              )}

            {(loggedUser == "citizenUser" || loggedUser === "cfcUser") &&
            params.row.statusVal === 10 ? (
              <IconButton
                onClick={() => {
                  router.push({
                    pathname:
                      "/BsupNagarvasthi/transaction/schemeApplicationRenewal/form",
                    query: {
                      id: params.row.id,
                    },
                  });
                }}
              >
                <Tooltip title={`Renewation`}>
                  <AssignmentRoundedIcon style={{ color: "#556CD6" }} />
                </Tooltip>
              </IconButton>
            ) : (
              <></>
            )}
          </Box>
        );
      },
    },
  ];

  const setRemark = (isApprovedCheck) => {
    let remarkData = [];
    for (
      var i = 0;
      i < regDetails.data.trnSchemeApplicationNewList?.length;
      i++
    ) {
      if (
        regDetails.data.trnSchemeApplicationNewList.find(
          (obj) => obj.id === selectedRows[i]
        )
      ) {
        let abc = regDetails.data.trnSchemeApplicationNewList.find(
          (obj) => obj.id === selectedRows[i]
        );
        const abcd = { ...abc };
        (abcd.isApproved =
          isApprovedCheck === "approve"
            ? true
            : isApprovedCheck === "revert"
            ? false
            : false),
          (abcd.isComplete = false),
          (abcd.isDraft = false),
          abcd.installmentPaid == null ? false : true,
          (abcd.deptClerkRemark =
            // authority && authority.find((val) => val === "PROPOSAL APPROVAL")
            authority &&
            authority.find((val) => val === bsupUserRoles.roleZonalClerk)
              ? watch("deptClerkRemark").toString()
              : abcd.deptClerkRemark),
          (abcd.asstCommissionerRemark =
            // authority && authority.find((val) => val === "APPROVAL")
            authority &&
            authority.find((val) => val === bsupUserRoles.roleZonalOfficer)
              ? watch("asstCommissionerRemark").toString()
              : abcd.asstCommissionerRemark),
          (abcd.deptyCommissionerRemark =
            // authority && authority.find((val) => val === "FINAL_APPROVAL")
            authority &&
            authority.find((val) => val === bsupUserRoles.roleHOClerk)
              ? watch("deptyCommissionerRemark").toString()
              : abcd.deptyCommissionerRemark),
          remarkData.push(abcd);
      }
    }
    setIsLoading(true);
    const tempData = axios
      .post(`${urls.BSUPURL}/trnSchemeApplicationNew/save`, remarkData, {
        headers: headers,
      })
      .then((res) => {
        setOpen(false);
        setIsLoading(false);
        sweetAlert({
          title: language === "en" ? "Saved!" : "जतन केले!",
          text:
            isApprovedCheck === "approve"
              ? language === "en"
                ? res.data.message.split("[")[1].split("]")[0] === "{0}"
                  ? `Application Approved successfully !`
                  : `Application no ${
                      res.data.message.split("[")[1].split("]")[0]
                    } Approved successfully !`
                : res.data.message.split("[")[1].split("]")[0] === "{0}"
                ? `अर्ज यशस्वीरित्या मंजूर केले!`
                : `
                अर्ज क्र ${
                  res.data.message.split("[")[1].split("]")[0]
                } यशस्वीरित्या मंजूर केेला!`
              : isApprovedCheck === "revert"
              ? language === "en"
                ? res.data.message.split("[")[1].split("]")[0] === "{0}"
                  ? `Application Reverted successfully !`
                  : `Application no ${
                      res.data.message.split("[")[1].split("]")[0]
                    } Reverted successfully !`
                : res.data.message.split("[")[1].split("]")[0] === "{0}"
                ? `अर्ज यशस्वीरित्या परत केले!`
                : `अर्ज क्र ${res.data.message.split("[")[1].split("]")[0]} 
                यशस्वीरित्या परत केेला!`
              : language === "en"
              ? res.data.message.split("[")[1].split("]")[0] === "{0}"
                ? `Application Rejected successfully !`
                : `Application no ${
                    res.data.message.split("[")[1].split("]")[0]
                  } Rejected successfully !`
              : res.data.message.split("[")[1].split("]")[0] === "{0}"
              ? `अर्ज यशस्वीरित्या नाकारले!`
              : `अर्ज क्र ${
                  res.data.message.split("[")[1].split("]")[0]
                } यशस्वीरित्या नाकारले!`,
          icon: "success",
        }).then((will) => {
          if (will) {
            router.push(
              "/BsupNagarvasthi/transaction/newApplicationScheme/list"
            );
          }
        });
        // }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  // UI
  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      {isLoading && <CommonLoader />}
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          // marginLeft: "10px",
          // marginRight: "10px",
          marginTop: "10px",
          marginBottom: "60px",
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
                <FormattedLabel id="titleNewApplicationSchemes" />
              </h3>
            </Grid>
          </Grid>
        </Box>

        <Grid container style={{ padding: "10px" }}>
          {loggedUser !== "departmentUser" ? (
            <Grid
              item
              xs={12}
              style={{ display: "flex", justifyContent: "end" }}
            >
              <Button
                variant="contained"
                size="small"
                endIcon={<AddIcon />}
                type="primary"
                onClick={() => {
                  router.push({
                    pathname:
                      "/BsupNagarvasthi/transaction/newApplicationScheme",
                  });
                }}
              >
                <FormattedLabel id="add" />
              </Button>
            </Grid>
          ) : (
            <>
              {selectedRows.length != 0 && (
                <Grid
                  item
                  xs={12}
                  style={{ display: "flex", justifyContent: "end" }}
                >
                  <Button
                    variant="contained"
                    className={commonStyles.buttonSave}
                    endIcon={<AddIcon />}
                    type="primary"
                    size="small"
                    onClick={() => {
                      // setRemark()
                      setOpen(true);
                    }}
                  >
                    <FormattedLabel id="remark" />
                  </Button>
                </Grid>
              )}
            </>
          )}
        </Grid>

        <DataGrid
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          autoHeight
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
            // "& .MuiDataGrid-toolbarContainer .MuiButton-root[aria-label='Export']":
            //   {
            //     display: "none",
            //   },
          }}
          density="compact"
          // disableColumnFilter
          // disableDensitySelector
          // disableColumnSelector
          pagination
          paginationMode="server"
          loading={data.loading}
          rowCount={totalElements}
          rowsPerPageOptions={[10, 20, 50, 100]}
          page={pageNo}
          pageSize={pageSize}
          rows={data.rows}
          columns={columns}
          checkboxSelection={
            loggedUser === "citizenUser" ||
            (loggedUser === "departmentUser" &&
              authority &&
              // authority.find((val) => val === "SAMUHA SANGHATAK"))
              authority.find(
                (val) => val === bsupUserRoles.roleSamuhaSanghatak
              )) ||
            (authority &&
              // authority.find((val) => val === "SAMUHA SANGHATAK"))
              authority.find((val) => val === bsupUserRoles.roleAccountant))
              ? false
              : true
          }
          onSelectionModelChange={handleSelectionChange}
          selectionModel={selectedRows}
          getRowId={(row) => row.id}
          isRowSelectable={isRowSelectable}
          onPageChange={(_data) => {
            setDataPage(_data);
            getBachatGatCategoryNewScheme(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            setDataPage(_data);
            getBachatGatCategoryNewScheme(_data, data.page);
          }}
        />
      </Paper>
      <Modal
        open={open}
        onClose={handleClose}
        title="Modal For LOI"
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
          <ThemeProvider theme={theme}>
            <Grid item xs={12}>
              <Box>
                <Grid
                  container
                  className={commonStyles.title}
                  style={{ marginTop: "20px" }}
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
                      <FormattedLabel id="approvalSection" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid container spacing={2} sx={{ padding: "2rem" }}>
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
                <FormControlLabel
                  control={
                    <Checkbox
                      value="approve"
                      checked={selectedCheckbox === "approve"}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label={<FormattedLabel id="approvebtn" />}
                />
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
                <FormControlLabel
                  control={
                    <Checkbox
                      value="revert"
                      checked={selectedCheckbox === "revert"}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label={<FormattedLabel id="revertbtn" />}
                />
              </Grid>

              {/* deparment clerk remark */}
              {selectedCheckbox != "" &&
                authority &&
                // authority.find((val) => val === "PROPOSAL APPROVAL") && (
                authority.find(
                  (val) => val === bsupUserRoles.roleZonalClerk
                ) && (
                  <>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "20px",
                      }}
                    >
                      <FormControl
                        variant="standard"
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      >
                        <InputLabel id="selectedStudents-label">
                          {selectedCheckbox === "approve" ? (
                            <FormattedLabel id="rejectCat" />
                          ) : (
                            <FormattedLabel id="rejectCat" />
                          )}
                        </InputLabel>
                        <Controller
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          name="bachatgatRevertCategories"
                          control={control}
                          multiline
                          render={({ field: { onChange, value } }) => (
                            <Select
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              labelId="selectedStudents-label"
                              id="selectedStudents"
                              multiple
                              multiline
                              value={serviceId}
                              onChange={(e) => {
                                handleChange(
                                  e,
                                  e.target.value,
                                  "deptClerkRemark"
                                );
                              }}
                              renderValue={(selected) =>
                                selected.includes("all")
                                  ? "Select All"
                                  : selected
                                      .map((id) =>
                                        language == "en"
                                          ? bachatgatRevertCategories.find(
                                              (student) => student.id === id
                                            )?.rejectCat
                                          : bachatgatRevertCategories.find(
                                              (student) => student.id === id
                                            )?.rejectCatMr
                                      )
                                      .join(", ")
                              }
                            >
                              {bachatgatRevertCategories?.length > 0 && (
                                <MenuItem key="all" value="all">
                                  <Checkbox
                                    checked={
                                      serviceId.length ===
                                      bachatgatRevertCategories.length
                                    }
                                    indeterminate={
                                      serviceId.length > 0 &&
                                      serviceId.length <
                                        bachatgatRevertCategories.length
                                    }
                                    onChange={(e) =>
                                      handleChange(e, "all", "deptClerkRemark")
                                    }
                                  />
                                  {language == "en"
                                    ? "Select All"
                                    : "सर्व निवडा"}
                                </MenuItem>
                              )}

                              {bachatgatRevertCategories?.map((dept) => (
                                <MenuItem key={dept.id} value={dept.id}>
                                  <Checkbox
                                    checked={serviceId.includes(dept.id)}
                                    onChange={(e) =>
                                      handleChange(
                                        e,
                                        dept.id,
                                        "deptClerkRemark"
                                      )
                                    }
                                  />
                                  {language === "en"
                                    ? dept?.rejectCat
                                    : dept?.rejectCatMr}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="deptClerkRemark" />}
                        variant="standard"
                        inputProps={{ maxLength: 1000 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        multiline
                        disabled={true}
                        {...register("deptClerkRemark")}
                        onChange={(e) =>
                          handleRemarkChange(e, "deptClerkRemark")
                        }
                        error={!!errors.deptClerkRemark}
                        helperText={
                          errors?.deptClerkRemark
                            ? errors.deptClerkRemark.message
                            : null
                        }
                      />
                    </Grid>
                    {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <TextField
                    required
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    id="standard-basic"
                    label={<FormattedLabel id="deptClerkRemark" />}
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register("deptClerkRemark")}
                    // onChange={(e) => handleRemarkChange(e, "deptClerkRemark")}
                    error={!!errors.deptClerkRemark}
                    helperText={
                      errors?.deptClerkRemark
                        ? errors.deptClerkRemark.message
                        : null
                    }
                  />
                </Grid> */}
                  </>
                )}

              {/* assistant commisssioner remark */}
              {selectedCheckbox != "" &&
                authority &&
                // authority.find((val) => val === "APPROVAL") && (
                authority.find(
                  (val) => val === bsupUserRoles.roleZonalOfficer
                ) && (
                  <>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "20px",
                      }}
                    >
                      <FormControl
                        variant="standard"
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      >
                        <InputLabel id="selectedStudents-label">
                          {selectedCheckbox === "approve" ? (
                            <FormattedLabel id="rejectCat" />
                          ) : (
                            <FormattedLabel id="rejectCat" />
                          )}
                        </InputLabel>
                        <Controller
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          name="bachatgatRevertCategories"
                          control={control}
                          multiline
                          render={({ field: { onChange, value } }) => (
                            <Select
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              labelId="selectedStudents-label"
                              id="selectedStudents"
                              multiple
                              multiline
                              value={serviceId}
                              onChange={(e) => {
                                handleChange(
                                  e,
                                  e.target.value,
                                  "asstCommissionerRemark"
                                );
                              }}
                              renderValue={(selected) =>
                                selected.includes("all")
                                  ? "Select All"
                                  : selected
                                      .map((id) =>
                                        language == "en"
                                          ? bachatgatRevertCategories.find(
                                              (student) => student.id === id
                                            )?.rejectCat
                                          : bachatgatRevertCategories.find(
                                              (student) => student.id === id
                                            )?.rejectCatMr
                                      )
                                      .join(", ")
                              }
                            >
                              {bachatgatRevertCategories?.length > 0 && (
                                <MenuItem key="all" value="all">
                                  <Checkbox
                                    checked={
                                      serviceId.length ===
                                      bachatgatRevertCategories.length
                                    }
                                    indeterminate={
                                      serviceId.length > 0 &&
                                      serviceId.length <
                                        bachatgatRevertCategories.length
                                    }
                                    onChange={(e) =>
                                      handleChange(
                                        e,
                                        "all",
                                        "asstCommissionerRemark"
                                      )
                                    }
                                  />
                                  {language == "en"
                                    ? "Select All"
                                    : "सर्व निवडा"}
                                </MenuItem>
                              )}

                              {bachatgatRevertCategories?.map((dept) => (
                                <MenuItem key={dept.id} value={dept.id}>
                                  <Checkbox
                                    checked={serviceId.includes(dept.id)}
                                    onChange={(e) =>
                                      handleChange(
                                        e,
                                        dept.id,
                                        "asstCommissionerRemark"
                                      )
                                    }
                                  />
                                  {language === "en"
                                    ? dept?.rejectCat
                                    : dept?.rejectCatMr}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="asstCommissionerRemark" />}
                        variant="standard"
                        disabled={true}
                        multiline
                        inputProps={{ maxLength: 1000 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        {...register("asstCommissionerRemark")}
                        onChange={(e) =>
                          handleRemarkChange(e, "asstCommissionerRemark")
                        }
                        error={!!errors.asstCommissionerRemark}
                        helperText={
                          errors?.asstCommissionerRemark
                            ? errors.asstCommissionerRemark.message
                            : null
                        }
                      />
                    </Grid>

                    {/* // <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              //   <TextField
              //     required
              //     sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              //     id="standard-basic"
              //     inputProps={{ maxLength: 1000 }}
              //     multiline
              //     label={<FormattedLabel id="asstCommissionerRemark" />}
              //     variant="standard"
              //     InputLabelProps={{
              //       shrink: true,
              //     }}
              //     {...register("asstCommissionerRemark")}
              //     error={!!errors.asstCommissionerRemark}
              //     helperText={
              //       errors?.asstCommissionerRemark
              //         ? errors.asstCommissionerRemark.message
              //         : null
              //     }
              //   />
              // </Grid> */}
                  </>
                )}

              {/* deputy commissioner remark */}
              {selectedCheckbox != "" &&
                authority &&
                // authority.find((val) => val === "FINAL_APPROVAL") && (
                authority.find((val) => val === bsupUserRoles.roleHOClerk) && (
                  <>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "20px",
                      }}
                    >
                      <FormControl
                        variant="standard"
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      >
                        <InputLabel id="selectedStudents-label">
                          {selectedCheckbox === "approve" ? (
                            <FormattedLabel id="rejectCat" />
                          ) : (
                            <FormattedLabel id="rejectCat" />
                          )}
                        </InputLabel>
                        <Controller
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          name="bachatgatRevertCategories"
                          control={control}
                          multiline
                          render={({ field: { onChange, value } }) => (
                            <Select
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              labelId="selectedStudents-label"
                              id="selectedStudents"
                              multiple
                              multiline
                              value={serviceId}
                              onChange={(e) => {
                                handleChange(
                                  e,
                                  e.target.value,
                                  "deptyCommissionerRemark"
                                );
                              }}
                              renderValue={(selected) =>
                                selected.includes("all")
                                  ? "Select All"
                                  : selected
                                      .map((id) =>
                                        language == "en"
                                          ? bachatgatRevertCategories.find(
                                              (student) => student.id === id
                                            )?.rejectCat
                                          : bachatgatRevertCategories.find(
                                              (student) => student.id === id
                                            )?.rejectCatMr
                                      )
                                      .join(", ")
                              }
                            >
                              {bachatgatRevertCategories?.length > 0 && (
                                <MenuItem key="all" value="all">
                                  <Checkbox
                                    checked={
                                      serviceId.length ===
                                      bachatgatRevertCategories.length
                                    }
                                    indeterminate={
                                      serviceId.length > 0 &&
                                      serviceId.length <
                                        bachatgatRevertCategories.length
                                    }
                                    onChange={(e) =>
                                      handleChange(
                                        e,
                                        "all",
                                        "deptyCommissionerRemark"
                                      )
                                    }
                                  />
                                  {language == "en"
                                    ? "Select All"
                                    : "सर्व निवडा"}
                                </MenuItem>
                              )}

                              {bachatgatRevertCategories?.map((dept) => (
                                <MenuItem key={dept.id} value={dept.id}>
                                  <Checkbox
                                    checked={serviceId.includes(dept.id)}
                                    onChange={(e) =>
                                      handleChange(
                                        e,
                                        dept.id,
                                        "deptyCommissionerRemark"
                                      )
                                    }
                                  />
                                  {language === "en"
                                    ? dept?.rejectCat
                                    : dept?.rejectCatMr}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <TextField
                        sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        id="standard-basic"
                        label={<FormattedLabel id="deptyCommissionerRemark" />}
                        multiline
                        variant="standard"
                        // disabled={statusVal != 7 ? true : false}
                        disabled={true}
                        inputProps={{ maxLength: 1000 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        {...register("deptyCommissionerRemark")}
                        onChange={(e) =>
                          handleRemarkChange(e, "deptyCommissionerRemark")
                        }
                        error={!!errors.deptyCommissionerRemark}
                        helperText={
                          errors?.deptyCommissionerRemark
                            ? errors.deptyCommissionerRemark.message
                            : null
                        }
                      />
                    </Grid>
                  </>
                )}
            </Grid>
            <Grid container spacing={2} sx={{ padding: "10px" }}>
              <Grid
                item
                xl={selectedCheckbox === "" ? 12 : 6}
                lg={selectedCheckbox === "" ? 12 : 6}
                md={selectedCheckbox === "" ? 12 : 6}
                sm={selectedCheckbox === "" ? 12 : 6}
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
                  onClick={handleClose}
                >
                  <FormattedLabel id="cancel" />
                </Button>
              </Grid>
              {selectedCheckbox == "approve" && (
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
                    onClick={handleApprove}
                    // className={commonStyles.buttonApprove}
                    disabled={!isRemarksFilled}
                    variant="contained"
                    color="success"
                    size="small"
                  >
                    <FormattedLabel id="approvebtn" />
                  </Button>
                </Grid>
              )}
              {selectedCheckbox == "revert" && (
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
                    onClick={handleRevert}
                    // className={commonStyles.buttonRevert}
                    disabled={!isRemarksFilled}
                    variant="contained"
                    color="secondary"
                    size="small"
                  >
                    <FormattedLabel id="revertbtn" />
                  </Button>
                </Grid>
              )}
            </Grid>
          </ThemeProvider>
        </Box>
      </Modal>
    </>
  );
};
export default newApplicationSchemes;
