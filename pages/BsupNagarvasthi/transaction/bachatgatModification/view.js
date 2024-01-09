import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  ThemeProvider,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import sweetAlert from "sweetalert";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import theme from "../../../../theme";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import bachatgatRegistration from "../../../../containers/schema/BsupNagarvasthiSchema/bachatgatRegistration";
import { yupResolver } from "@hookform/resolvers/yup";
import { manageStatus } from "../../../../components/rtiOnlineSystem/commonStatus/manageEnMr";
import Loader from "../../../../containers/Layout/components/Loader";
import bsupUserRoles from "../../../../components/bsupNagarVasthi/userRolesBSUP";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";

const BachatGatCategory = () => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(bachatgatRegistration),
  });
  const language = useSelector((state) => state.labels.language);
  const [appliNo, setApplicationNo] = useState();
  const [currentStatus1, setCurrentStatus] = useState();
  const [statusAll, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user.user);
  const router = useRouter();
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );
  const [statusVal, setStatusVal] = useState(null);
  const [remarkTableData, setRemarkData] = useState([]);
  const [memberList, setMemberData] = useState([]);
  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roleIds;
  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [crAreaNames, setCRAreaName] = useState([]);
  const [bankMaster, setBankMasters] = useState([]);
  const [bachatGatCategory, setBachatGatCategory] = useState([]);
  const [registrationDetails, setRegistrationDetails] = useState(null);
  const [fetchDocument, setFetchDocuments] = useState([]);
  const [userLst, setUserLst] = useState([]);
  const loggedUser = localStorage.getItem("loggedInUser");
  const [samuhaSanghatakRemark, setSamuhaSanghatakRemark] = useState("");
  const [deptClerkRemark, setDeptClerkRemark] = useState("");
  const [asstCommissionerRemark, setAsstCommissionerRemark] = useState("");
  const [deptyCommissionerRemark, setDeptyCommissionerRemark] = useState("");
  const [isRemarksFilled, setIsRemarksFilled] = useState(false);
  const [isApproveChecked, setIsApproveChecked] = useState(false);
  const [isRevertChecked, setIsRevertChecked] = useState(false);
  const [isRejectChecked, setIsRejectChecked] = useState(false);
  const [bachatgatrejectionCategories, setBachatgatrejectionCategories] =
    useState([]);
  const [hanadleStudent, setHanadleStudent] = useState([]);
  const [serviceId, setServiceId] = useState([]);
  const [rejectReason, setRejectReason] = useState();
  // const headers =
  //   loggedUser === "citizenUser"
  //     ? { Userid: user?.id, Authorization: `Bearer ${user?.token}` }
  //     : { Authorization: `Bearer ${user?.token}` };

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

  const [bachatgatApprovalCategories, setBachatgatApprovalCategories] =
    useState([]);
  const [bachatgatRevertCategories, setBachatgatRevertCategories] = useState(
    []
  );

  useEffect(() => {
    setIsRemarksFilled(
      samuhaSanghatakRemark ||
        deptClerkRemark ||
        asstCommissionerRemark ||
        deptyCommissionerRemark
    );
  }, [
    samuhaSanghatakRemark,
    deptClerkRemark,
    asstCommissionerRemark,
    deptyCommissionerRemark,
  ]);

  // Function to handle checkbox changes
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setIsApproveChecked(name === "approve" && checked);
    setIsRevertChecked(name === "revert" && checked);
    setIsRejectChecked(name === "reject" && checked);
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

  // fetch bachatgat regsitration details by id
  useEffect(() => {
    if (router.query.id != undefined && router.query.id != null)
      fetchRegistrationDetails();
  }, [router.query.id]);

  useEffect(() => {
    getUser();
    getZoneName();
    getWardNames();
    getAllStatus();
    getCRAreaName();
    getBachatGatCategory();
    getBank();
    getRejectCategories();
  }, []);

  // load bachat gat reject categories
  const getRejectCategories = () => {
    axios
      .get(
        `${urls.BSUPURL}/mstRejectCategory/getAllBachatGatRejectionCategories`,
        {
          headers: headers,
        }
      )
      .then((r) => {
        // setBachatgatrejectionCategories(
        //   r.data.mstRejectCategoryDao.map((row) => ({
        //     id: row.id,
        //     rejectCat: row.rejectCat,
        //     rejectCatMr: row.rejectCatMr,
        //   }))
        // );

        setBachatgatApprovalCategories(
          r.data.mstRejectCategoryDao.map((row, index) => ({
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

  useEffect(() => {
    if (isApproveChecked === true) {
      setBachatgatRevertCategories(
        bachatgatApprovalCategories.filter((obj) => obj.categoryType === "1")
      );
      setValue("saSanghatakRemark", "");
      setValue("deptClerkRemark", "");
      setValue("asstCommissionerRemark", "");
      setValue("deptyCommissionerRemark", "");
      setServiceId([]);
      setHanadleStudent([]);
    } else if (isRevertChecked === true) {
      setBachatgatRevertCategories(
        bachatgatApprovalCategories.filter((obj) => obj.categoryType === "2")
      );
      setValue("saSanghatakRemark", "");
      setValue("deptClerkRemark", "");
      setValue("asstCommissionerRemark", "");
      setValue("deptyCommissionerRemark", "");
      setServiceId([]);
      setHanadleStudent([]);
    } else if (isRejectChecked === true) {
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
  }, [isApproveChecked, isRevertChecked, isRejectChecked]);

  // useEffect(() => {
  //   setRejectReason(hanadleStudent.toString());
  // }, [hanadleStudent]);

  useEffect(() => {
    if (isRejectChecked) {
      setRejectReason(hanadleStudent.toString());
    }
  }, [hanadleStudent]);

  const getFilePreview = (filePath) => {
    const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
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

  const handleChange = (event, studentId, fieldName) => {
    console.log("studentId ", studentId);
    switch (fieldName) {
      case "saSanghatakRemark":
        if (studentId === "all") {
          if (event.target.checked) {
            setServiceId(
              bachatgatRevertCategories.map((student, index) => student.id)
            );
            setHanadleStudent(
              bachatgatRevertCategories.map(
                (student, index) => student.rejectCat
              )
            );
            setSamuhaSanghatakRemark(
              bachatgatRevertCategories.map(
                (student, index) => student.rejectCat
              )
            );
            let string = bachatgatRevertCategories.map(
              (student, index) => student.rejectCat
            );
            setValue(
              "saSanghatakRemark",
              bachatgatRevertCategories.map(
                (student, index) => student.rejectCat
              )
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
            console.log("Dummyyyyyyyyy ", [...hanadleStudent, dummy]);
            setServiceId([...serviceId, studentId]);
            setHanadleStudent([...hanadleStudent, dummy]);
            setSamuhaSanghatakRemark(...hanadleStudent, dummy);
            setValue("saSanghatakRemark", [...hanadleStudent, dummy]);
          } else {
            console.log("uncheck ", hanadleStudent);
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
              bachatgatRevertCategories.map((student, index) => student.id)
            );
            setHanadleStudent(
              bachatgatRevertCategories.map(
                (student, index) => student.rejectCat
              )
            );
            setDeptClerkRemark(
              bachatgatRevertCategories.map(
                (student, index) => student.rejectCat
              )
            );
            setValue(
              "deptClerkRemark",
              bachatgatRevertCategories.map(
                (student, index) => student.rejectCat
              )
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
              bachatgatRevertCategories.map((student, index) => student.id)
            );
            setHanadleStudent(
              bachatgatRevertCategories.map(
                (student, index) => student.rejectCat
              )
            );
            setAsstCommissionerRemark(
              bachatgatRevertCategories.map(
                (student, index) => student.rejectCat
              )
            );
            setValue(
              "asstCommissionerRemark",
              bachatgatRevertCategories.map(
                (student, index) => student.rejectCat
              )
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
              bachatgatRevertCategories.map((student, index) => student.id)
            );
            setHanadleStudent(
              bachatgatRevertCategories.map(
                (student, index) => student.rejectCat
              )
            );
            setDeptyCommissionerRemark(
              bachatgatRevertCategories.map(
                (student, index) => student.rejectCat
              )
            );
            setValue(
              "deptyCommissionerRemark",
              bachatgatRevertCategories.map(
                (student, index) => student.rejectCat
              )
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

  // const handleChange = (event, studentId) => {
  //   if (studentId === "all") {
  //     if (event.target.checked) {
  //       setServiceId(bachatgatrejectionCategories.map((student) => student.id));
  //       setHanadleStudent(
  //         bachatgatrejectionCategories.map((student) => student.rejectCat)
  //       );
  //     } else {
  //       setServiceId([]);
  //       setHanadleStudent([]);
  //     }
  //   } else {
  //     if (event.target.checked) {
  //       let dummy = bachatgatrejectionCategories.find(
  //         (obj) => obj.id === studentId
  //       )?.rejectCat;
  //       setServiceId([...serviceId, studentId]);
  //       setHanadleStudent([...hanadleStudent, dummy]);
  //     } else {
  //       setServiceId(serviceId?.filter((obj) => obj !== studentId));
  //       setHanadleStudent(hanadleStudent?.filter((obj) => obj !== studentId));
  //     }
  //   }
  // };

  // load user
  const getUser = () => {
    axios
      .get(`${urls.CFCURL}/master/user/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setUserLst(res?.data?.user);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // load zone
  const getZoneName = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setZoneNames(
          r.data.zone.map((row, index) => ({
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
          r.data.ward.map((row, index) => ({
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
          r.data.area.map((row, index) => ({
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

  const backButton = () => {
    if (loggedUser === "citizenUser") {
      router.push({
        pathname: "/dashboard",
      });
    } else {
      router.push({
        pathname: "/BsupNagarvasthi/transaction/bachatgatModification",
      });
    }
  };

  // load bank
  const getBank = () => {
    axios
      .get(`${urls.CFCURL}/master/bank/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setBankMasters(r.data.bank);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // load bachatgat category
  const getBachatGatCategory = () => {
    axios
      .get(`${urls.BSUPURL}/mstBachatGatCategory/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setBachatGatCategory(
          r.data.mstBachatGatCategoryList.map((row, index) => ({
            id: row.id,
            bachatGatCategoryName: row.bgCategoryName,
            bachatGatCategoryNameMr: row.bgCategoryMr,
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

  // call api by id
  const fetchRegistrationDetails = () => {
    setIsLoading(true);
    axios
      .get(
        `${urls.BSUPURL}/trnBachatgatRegistration/getById?id=${router.query.id}`,
        {
          headers: headers,
        }
      )
      .then((r) => {
        setIsLoading(false);
        setRegistrationDetails(r.data);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  useEffect(() => {
    if (registrationDetails != null) {
      setDataOnForm();
    }
  }, [registrationDetails, language, bankMaster]);

  const setDataOnForm = () => {
    let data = registrationDetails;
    setValue("rejectReason", data?.rejectReason);
    setValue("areaKey", data.areaKey);
    setValue("zoneKey", data.zoneKey);
    setValue("wardKey", data.wardKey);
    setValue("geoCode", data.geoCode);
    setValue("bachatgatName", data.bachatgatName);
    setValue("categoryKey", data.categoryKey);
    setValue("presidentFirstName", data.presidentFirstName);
    setValue("presidentLastName", data.presidentLastName);
    setValue("presidentMiddleName", data.presidentMiddleName);
    setValue("totalMembersCount", data.totalMembersCount);
    setValue("flatBuldingNo", data.flatBuldingNo);
    setValue("buildingName", data.buildingName);
    setValue("roadName", data.roadName);
    setValue("landmark", data.landmark);
    setValue("pinCode", data.pinCode);
    setValue("bachatgatNo", data.bachatgatNo);
    setValue("landlineNo", data.landlineNo);
    setValue("applicantFirstName", data?.applicantFirstName);
    setValue("applicantMiddleName", data?.applicantMiddleName);
    setValue("applicantLastName", data?.applicantLastName);
    setValue("emailId", data?.emailId);
    setValue("mobileNo", data?.mobileNo);
    setStatusVal(data.status);
    setValue(
      "bankNameId",
      bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankName
        ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankName
        : "-"
    );
    setValue(
      "bankBranchKey",
      bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.branchName
        ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.branchName
        : "-"
    );
    setValue(
      "bankIFSC",
      bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.ifscCode
        ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.ifscCode
        : "-"
    );
    setValue("accountNo", data.accountNo);
    setValue("bankAccountFullName", data.bankAccountFullName);
    setValue("startDate", data.startDate);
    setValue("saSanghatakRemark", data.saSanghatakRemark);
    setValue("deptClerkRemark", data.deptClerkRemark);
    setValue("deptyCommissionerRemark", data.deptyCommissionerRemark);
    setValue("asstCommissionerRemark", data.asstCommissionerRemark);
    setValue("branchName", data.branchName);
    setValue("ifscCode", data.ifscCode);
    setValue("bankMICR", data.micrCode);
    setValue("pan_no", data.pan_no);
    let res = data.trnBachatgatRegistrationMembersList?.map((r, i) => {
      return {
        id: i + 1,
        fullName: r.fullName,
        address: r.address,
        designation: r.designation,
        aadharNumber: r.aadharNumber,
      };
    });
    setMemberData([...res]);
    const bankDoc = [];

    let _res = data.trnBachatgatRegistrationDocumentsList?.map((r, i) => {
      bankDoc.push({
        id: i + 1,
        title: language == "en" ? "Other" : "इतर",
        filenm:
          r.documentPath && r.documentPath.split("/").pop().split("_").pop(),
        documentType: r.documentType,
        documentPath: r.documentPath,
      });
    });
    if (data.passbookFrontPage && data.passbookLastPage) {
      bankDoc.push({
        id: data.trnBachatgatRegistrationDocumentsList.length + 1,
        title: language == "en" ? "Passbook Front Page" : "पासबुकचे पहिले पान",
        documentType: "r.documentType",
        documentPath: data.passbookFrontPage,
        filenm:
          data.passbookFrontPage &&
          data.passbookFrontPage.split("/").pop().split("_").pop(),
      });
      bankDoc.push({
        id: data.trnBachatgatRegistrationDocumentsList.length + 2,
        title: language == "en" ? "Passbook Back Page" : "पासबुकचे मागील पान",
        documentType: "r.documentType",
        documentPath: data.passbookLastPage,
        filenm:
          data.passbookLastPage &&
          data.passbookLastPage.split("/").pop().split("_").pop(),
      });
    } else if (data.passbookLastPage) {
      bankDoc.push({
        id: data.trnBachatgatRegistrationDocumentsList.length + 3,
        title: language == "en" ? "Passbook Back Page" : "पासबुकचे मागील पान",
        documentType: "r.documentType",
        documentPath: data.passbookLastPage,
        filenm:
          data.passbookLastPage &&
          data.passbookLastPage.split("/").pop().split("_").pop(),
      });
    } else if (data.passbookFrontPage) {
      bankDoc.push({
        id: data.trnBachatgatRegistrationDocumentsList.length + 4,
        title: language == "en" ? "Passbook Front Page" : "पासबुकचे पहिले पान",
        documentPath: data.passbookFrontPage,
        filenm:
          data.passbookFrontPage &&
          data.passbookFrontPage.split("/").pop().split("_").pop(),
      });
    }
    bankDoc && setFetchDocuments([...bankDoc]);
    setApplicationNo(data.applicationNo);
    setCurrentStatus(manageStatus(data.status, language, statusAll));
  };

  // set remark table details
  useEffect(() => {
    if (registrationDetails != null && registrationDetails != undefined)
      setDataToTable();
  }, [registrationDetails, userLst]);

  const setDataToTable = () => {
    const a = [];
    if (
      watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 4; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.firstNameEn
              : "-"
            : userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.firstNameEn
            ? userLst?.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.firstNameEn
            : "-";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.lastNameEn
              : "-"
            : userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.lastNameEn
            ? userLst?.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.lastNameEn
            : "-";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.saSanghatakRemark
              : i == 1
              ? registrationDetails.deptClerkRemark
              : i == 2
              ? registrationDetails.asstCommissionerRemark
              : registrationDetails.deptyCommissionerRemark,
          designation:
            i == 0
              ? "Samuh Sanghtak"
              : i == 1
              ? "Zonal Clerk"
              : i == 2
              ? "Zonal Officer"
              : "HO Clerk",
          remarkDate:
            i == 0
              ? moment(registrationDetails.saSanghatakDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(registrationDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 2
              ? moment(registrationDetails.asstCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : moment(registrationDetails.deptyCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                ),
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    // 1110
    else if (
      watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      watch("asstCommissionerRemark") &&
      !watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 3; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";
        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";

        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.saSanghatakRemark
              : i == 1
              ? registrationDetails.deptClerkRemark
              : i == 2
              ? registrationDetails.asstCommissionerRemark
              : "",
          designation:
            i == 0
              ? "Samuh Sanghtak"
              : i == 1
              ? "Zonal Clerk"
              : i == 2
              ? "Zonal Officer"
              : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.saSanghatakDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(registrationDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 2
              ? moment(registrationDetails.asstCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    // 1101
    else if (
      watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 3; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptyCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";
        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : i == 2
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptyCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";

        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.saSanghatakRemark
              : i == 1
              ? registrationDetails.deptClerkRemark
              : i == 2
              ? registrationDetails.deptyCommissionerRemark
              : "",
          designation:
            i == 0
              ? "Samuh Sanghtak"
              : i == 1
              ? "Zonal Clerk"
              : i == 2
              ? "HO Clerk"
              : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.saSanghatakDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(registrationDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 2
              ? moment(registrationDetails.deptyCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    // 1100
    else if (
      watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      !watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 2; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.saSanghatakRemark
              : i == 1
              ? registrationDetails.deptClerkRemark
              : "",
          designation: i == 0 ? "Samuh Sanghtak" : i == 1 ? "Zonal Clerk" : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.saSanghatakDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(registrationDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    // 1001
    else if (
      watch("saSanghatakRemark") &&
      !watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 2; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptyCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptyCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.saSanghatakRemark
              : i == 1
              ? registrationDetails.deptyCommissionerRemark
              : "",
          designation: i == 0 ? "Samuh Sanghtak" : i == 1 ? "HO Clerk" : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.saSanghatakDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(registrationDetails.deptyCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    // 1000
    else if (
      watch("saSanghatakRemark") &&
      !watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      !watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 1; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.saSanghatakUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.saSanghatakUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark: i == 0 ? registrationDetails.saSanghatakRemark : "",
          designation: i == 0 ? "Samuh Sanghtak" : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.saSanghatakDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",

          userName: firstNameEn + " " + lastNameEn,
        });
      }
    } //    0111
    else if (
      !watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 3; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.firstNameEn
              : "-"
            : userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.firstNameEn
            ? userLst?.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.firstNameEn
            : "-";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.lastNameEn
              : "-"
            : userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.lastNameEn
            ? userLst?.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.lastNameEn
            : "-";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.deptClerkRemark
              : i == 1
              ? registrationDetails.asstCommissionerRemark
              : i == 2
              ? registrationDetails.deptyCommissionerRemark
              : "",
          designation:
            i == 0 ? "Zonal Clerk" : i == 1 ? "Zonal Officer" : "HO Clerk",
          remarkDate:
            i == 0
              ? moment(registrationDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(registrationDetails.asstCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : moment(registrationDetails.deptyCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                ),
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    } //0110
    else if (
      !watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      watch("asstCommissionerRemark") &&
      !watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 2; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.deptClerkRemark
              : i == 1
              ? registrationDetails.asstCommissionerRemark
              : "",
          designation: i == 0 ? "Zonal Clerk" : i == 1 ? "Zonal Officer" : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(registrationDetails.asstCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    // 0101
    else if (
      !watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 2; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptyCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";
        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : i == 1
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptyCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.deptClerkRemark
              : i == 1
              ? registrationDetails.deptyCommissionerRemark
              : "",
          designation: i == 0 ? "Zonal Clerk" : i == 1 ? "HO Clerk" : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : i == 1
              ? moment(registrationDetails.deptyCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",

          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    //  0100
    else if (
      !watch("saSanghatakRemark") &&
      watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      !watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 1; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptClerkUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptClerkUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark: i == 0 ? registrationDetails.deptClerkRemark : "",
          designation: i == 0 ? "Zonal Clerk" : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.deptClerkDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",

          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    //  0011
    else if (
      !watch("saSanghatakRemark") &&
      !watch("deptClerkRemark") &&
      watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 2; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.firstNameEn
              : "-"
            : userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.firstNameEn
            ? userLst?.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.firstNameEn
            : "-";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.lastNameEn
              : "-"
            : userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.lastNameEn
            ? userLst?.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.lastNameEn
            : "-";
        a.push({
          id: i + 1,
          remark:
            i == 0
              ? registrationDetails.asstCommissionerRemark
              : i == 1
              ? registrationDetails.deptyCommissionerRemark
              : "",
          designation: i == 0 ? "Zonal Officer" : "HO Clerk",
          remarkDate:
            i == 0
              ? moment(registrationDetails.asstCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : moment(registrationDetails.deptyCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                ),
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    //  0010
    else if (
      !watch("saSanghatakRemark") &&
      !watch("deptClerkRemark") &&
      watch("asstCommissionerRemark") &&
      !watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 1; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";
        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.asstCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.asstCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark: i == 0 ? registrationDetails.asstCommissionerRemark : "",
          designation: i == 0 ? "Zonal Officer" : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.asstCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",

          userName: firstNameEn + " " + lastNameEn,
        });
      }
      // 0001
    }
    // 0001
    else if (
      !watch("saSanghatakRemark") &&
      !watch("deptClerkRemark") &&
      !watch("asstCommissionerRemark") &&
      watch("deptyCommissionerRemark")
    ) {
      for (var i = 0; i < 1; i++) {
        const firstNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.firstNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptyCommissionerUserId
                )?.firstNameEn
              : "-"
            : "";

        const lastNameEn =
          i == 0
            ? userLst &&
              userLst.find(
                (obj) => obj.id == registrationDetails.deptyCommissionerUserId
              )?.lastNameEn
              ? userLst?.find(
                  (obj) => obj.id == registrationDetails.deptyCommissionerUserId
                )?.lastNameEn
              : "-"
            : "";
        a.push({
          id: i + 1,
          remark: i == 0 ? registrationDetails.deptyCommissionerRemark : "",
          designation: i == 0 ? "HO Clerk" : "",
          remarkDate:
            i == 0
              ? moment(registrationDetails.deptyCommissionerDate).format(
                  "DD/MM/YYYY HH:mm"
                )
              : "",
          userName: firstNameEn + " " + lastNameEn,
        });
      }
    }
    setRemarkData([...a]);
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
      field: "title",
      headerName: <FormattedLabel id="docName" />,
      headerAlign: "center",
      align: "center",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line", padding: "10px" }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "filenm",
      headerName: <FormattedLabel id="fileNm" />,
      headerAlign: "center",
      align: "center",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line", padding: "10px" }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "Action",
      headerName: <FormattedLabel id="view" />,
      headerAlign: "center",
      minWidth: 100,
      align: "center",
      flex: 1,
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

  // member columns
  const columns = [
    {
      field: "id",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "fullName",
      headerName: <FormattedLabel id="memFullName" />,
      flex: 1,
      align: "center",
      minWidth: 100,
      headerAlign: "center",
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line", padding: "10px" }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "address",
      headerName: <FormattedLabel id="memFullAdd" />,
      flex: 1,
      align: "center",
      minWidth: 100,
      headerAlign: "center",
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line", padding: "10px" }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "designation",
      headerName: <FormattedLabel id="memDesign" />,
      flex: 1,
      align: "center",
      minWidth: 100,
      headerAlign: "center",
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line", padding: "10px" }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "aadharNumber",
      headerName: <FormattedLabel id="memAdharNo" />,
      flex: 1,
      align: "center",
      minWidth: 100,
      headerAlign: "center",
    },
  ];

  // remark columns
  const approveSectionCol = [
    {
      field: "id",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "userName",
      headerName: <FormattedLabel id="userName" />,
      headerAlign: "center",
      align: "left",
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line", padding: "10px" }}>
          {params.value}
        </div>
      ),
      width: 200,
    },
    {
      field: "designation",
      headerName: <FormattedLabel id="design" />,
      headerAlign: "center",
      align: "center",
      // flex: 1,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line", padding: "10px" }}>
          {params.value}
        </div>
      ),
      width: 200,
    },
    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      headerAlign: "center",
      align: "left",
      // flex: 1,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line", padding: "10px" }}>
          {params.value}
        </div>
      ),
      width: 900,
    },
    {
      field: "remarkDate",
      headerName: <FormattedLabel id="remarkDate" />,
      headerAlign: "center",
      align: "center",
      // flex: 1,
      width: 200,
    },
  ];

  // approve or revert caalll
  const onSubmitForm = (formData) => {
    setIsLoading(true);
    const temp = [
      {
        ...registrationDetails,
        saSanghatakRemark:
          watch("saSanghatakRemark") != null && watch("saSanghatakRemark") != ""
            ? watch("saSanghatakRemark").toString()
            : registrationDetails.saSanghatakRemark == null
            ? watch("saSanghatakRemark")
            : registrationDetails.saSanghatakRemark,
        deptClerkRemark:
          watch("deptClerkRemark") != null && watch("deptClerkRemark") != ""
            ? watch("deptClerkRemark").toString()
            : registrationDetails.deptClerkRemark == null
            ? watch("deptClerkRemark")
            : registrationDetails.deptClerkRemark,
        asstCommissionerRemark:
          watch("asstCommissionerRemark") != null &&
          watch("asstCommissionerRemark") != ""
            ? watch("asstCommissionerRemark").toString()
            : registrationDetails.asstCommissionerRemark == null
            ? watch("asstCommissionerRemark")
            : registrationDetails.asstCommissionerRemark,
        deptyCommissionerRemark:
          watch("deptyCommissionerRemark") != null &&
          watch("deptyCommissionerRemark") != ""
            ? watch("deptyCommissionerRemark").toString()
            : registrationDetails.deptyCommissionerRemark == null
            ? watch("deptyCommissionerRemark")
            : registrationDetails.deptyCommissionerRemark,
        isApproved:
          formData === "Save" ? true : formData === "Revert" ? false : "false",
        isBenifitedPreviously: false,
        isComplete: false,
        isDraft: false,
        rejectReason: rejectReason,
        status: formData === "Reject" ? 22 : statusVal,
      },
    ];
    const tempData = axios
      .post(`${urls.BSUPURL}/trnBachatgatRegistration/modifyBachatGat`, temp, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          sweetAlert({
            title: language === "en" ? "Saved!" : "जतन केले",
            text:
              language === "en"
                ? formData === "Save"
                  ? `Application no ${
                      res.data.message.split("[")[1].split("]")[0]
                    } Approved successfully !`
                  : formData === "Revert"
                  ? `Application no ${
                      res.data.message.split("[")[1].split("]")[0]
                    } Reverted successfully !`
                  : `Application No ${
                      res.data.message.split("[")[1].split("]")[0]
                    } Rejected successfully !`
                : formData === "Save"
                ? `अर्ज क्रमांक ${
                    res.data.message.split("[")[1].split("]")[0]
                  } यशस्वीरित्या मंजूर केले!`
                : formData === "Revert"
                ? `अर्ज क्रमांक ${
                    res.data.message.split("[")[1].split("]")[0]
                  } यशस्वीरित्या परत केले!`
                : `अर्ज क्रमांक ${
                    res.data.message.split("[")[1].split("]")[0]
                  } यशस्वीरित्या नाकारले!`,
            icon: "success",
            showCancelButton: false,
            confirmButtonText: language === "en" ? "Ok" : "ठीक आहे",
            allowOutsideClick: false, // Prevent closing on outside click
            allowEscapeKey: false, // Prevent closing on Esc key
            closeOnClickOutside: false, // Prevent closing on click outside
          }).then((will) => {
            if (will) {
              {
                router.push(
                  "/BsupNagarvasthi/transaction/bachatgatModification"
                );
              }
            }
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

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

  // UI
  return (
    <ThemeProvider theme={theme}>
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
          marginTop: "10px",
          marginBottom: "60px",
          padding: 1,
          "@media (max-width: 770px)": {
            marginTop: "2rem",
          },
        }}
      >
        <Grid item xs={12}>
          <Box>
            <Grid
              container
              className={commonStyles.title}
              style={{ marginBottom: "8px" }}
            >
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
                  <FormattedLabel id="bachatGatDetails" />
                </h3>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <Grid container spacing={2} style={{ padding: "1rem" }}>
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={6}
              xl={6}
              sx={{
                "@media (max-width: 390px)": {
                  display: "grid",
                },
              }}
            >
              <label
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                <FormattedLabel id="applicationNo" /> :
              </label>
              <label
                style={{
                  fontSize: "18px",
                }}
              >
                {appliNo}
              </label>
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={6}
              xl={6}
              sx={{
                "@media (max-width: 390px)": {
                  display: "grid",
                },
              }}
            >
              <label
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                <FormattedLabel id="currentStatus" /> :
              </label>
              <label
                style={{
                  fontSize: "18px",
                  gap: 3,
                }}
              >
                {currentStatus1}
              </label>
            </Grid>
            {/* area name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <FormControl
                error={errors.areaKey}
                variant="standard"
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="areaNm" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      disabled={true}
                      onChange={(value) => field.onChange(value)}
                    >
                      {crAreaNames &&
                        crAreaNames.map((auditorium, index) => (
                          <MenuItem key={index} value={auditorium.id}>
                            {language == "en"
                              ? auditorium.crAreaName
                              : auditorium.crAreaNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="areaKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.areaKey ? errors.areaKey.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Zone Name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <FormControl
                error={errors.zoneKey}
                variant="standard"
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="zoneNames" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={true}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    >
                      {zoneNames &&
                        zoneNames.map((auditorium, index) => (
                          <MenuItem key={index} value={auditorium.id}>
                            {language == "en"
                              ? auditorium.zoneName
                              : auditorium.zoneNameMr}
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

            {/* Ward name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <FormControl
                variant="standard"
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                error={!!errors.wardKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="wardname" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={true}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    >
                      {wardNames &&
                        wardNames.map((service, index) => (
                          <MenuItem key={index} value={service.id}>
                            {language == "en"
                              ? service.wardName
                              : service.wardNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="wardKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.wardKey ? errors.wardKey.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* geo code */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                label={<FormattedLabel id="gisgioCode" />}
                variant="standard"
                {...register("geoCode")}
                error={!!errors.geoCode}
                helperText={errors?.geoCode ? errors.geoCode.message : null}
              />
            </Grid>

            {/* Bachat Gat No */}
            {watch("bachatgatNo") !== "" && (
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TextField
                  // sx={{ width: "90%" }}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  disabled={true}
                  label={<FormattedLabel id="bachatgatNo" />}
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                  {...register("bachatgatNo")}
                  // value={
                  //   watch("bachatgatNo")
                  // }

                  error={!!errors.bachatgatNo}
                  helperText={
                    errors?.bachatgatNo ? errors.bachatgatNo.message : null
                  }
                />
              </Grid>
            )}

            {/* bachatgat name */}
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="bachatgatFullName" />}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                disabled={true}
                InputLabelProps={{ shrink: true }}
                variant="standard"
                {...register("bachatgatName")}
                error={!!errors.bachatgatName}
                helperText={
                  errors?.bachatgatName ? errors.bachatgatName.message : null
                }
              />
            </Grid>

            {/* bachatgat category */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <FormControl
                variant="standard"
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                error={!!errors.categoryKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="bachatgatCat" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={true}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    >
                      {bachatGatCategory &&
                        bachatGatCategory.map((service, index) => (
                          <MenuItem key={index} value={service.id}>
                            {language == "en"
                              ? service.bachatGatCategoryName
                              : service.bachatGatCategoryNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="categoryKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.categoryKey ? errors.categoryKey.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            {/* Bachat Gat start date */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <FormControl
                variant="standard"
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                error={!!errors.fromDate}
              >
                <Controller
                  control={control}
                  name="startDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        disabled={true}
                        variant="standard"
                        inputFormat="DD/MM/YYYY"
                        label={
                          <span style={{ fontSize: 16 }}>
                            {<FormattedLabel id="bachatgatStartDate" />}
                          </span>
                        }
                        value={field.value}
                        onChange={(date) =>
                          field.onChange(moment(date).format("YYYY-MM-DD"))
                        }
                        selected={field.value}
                        center
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            variant="standard"
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <FormHelperText>
                  {errors?.startDate ? errors.startDate.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* bachatgat address box */}
            <Grid item xs={12}>
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
                      <FormattedLabel id="bachatgatAddress" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* president first name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="presidentFirstName" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("presidentFirstName")}
                error={!!errors.presidentFirstName}
                helperText={
                  errors?.presidentFirstName
                    ? errors.presidentFirstName.message
                    : null
                }
              />
            </Grid>

            {/* bahcatgat middle name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="presidentFatherName" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("presidentMiddleName")}
                error={!!errors.presidentMiddleName}
                helperText={
                  errors?.presidentMiddleName
                    ? errors.presidentMiddleName.message
                    : null
                }
              />
            </Grid>

            {/* bahcatgat last name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="presidentLastName" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("presidentLastName")}
                error={!!errors.presidentLastName}
                helperText={
                  errors?.presidentLastName
                    ? errors.presidentLastName.message
                    : null
                }
              />
            </Grid>

            {/* total member */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <Tooltip title="Gat Total Members Count">
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="totalCount" />}
                  variant="standard"
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  type="number"
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  {...register("totalMembersCount")}
                  error={!!errors.totalMembersCount}
                  helperText={
                    errors?.totalMembersCount
                      ? errors.totalMembersCount.message
                      : null
                  }
                />
              </Tooltip>
            </Grid>

            {/* building no */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="flatBuildNo" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("flatBuldingNo")}
                error={!!errors.flatBuldingNo}
                helperText={
                  errors?.flatBuldingNo ? errors.flatBuldingNo.message : null
                }
              />
            </Grid>

            {/* building name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="buildingNm" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("buildingName")}
                error={!!errors.buildingName}
                helperText={
                  errors?.buildingName ? errors.buildingName.message : null
                }
              />
            </Grid>

            {/* Road Name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="roadName" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("roadName")}
                error={!!errors.roadName}
                helperText={errors?.roadName ? errors.roadName.message : null}
              />
            </Grid>

            {/* Landmark */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="landmark" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("landmark")}
                error={!!errors.landmark}
                helperText={errors?.landmark ? errors.landmark.message : null}
              />
            </Grid>

            {/* Pin Code */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="pincode" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("pinCode")}
                error={!!errors.pinCode}
                helperText={errors?.pinCode ? errors.pinCode.message : null}
              />
            </Grid>

            {/*   Applicant Name Details*/}
            <Grid item xs={12}>
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
                      <FormattedLabel id="applicantDetails" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* applicant first name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="applicantFirstName" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("applicantFirstName")}
                error={!!errors.applicantFirstName}
                helperText={
                  errors?.applicantFirstName
                    ? errors.applicantFirstName.message
                    : null
                }
              />
            </Grid>

            {/* applicant middle name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                label={<FormattedLabel id="applicantMiddleName" />}
                variant="standard"
                {...register("applicantMiddleName")}
                error={!!errors.applicantMiddleName}
                helperText={
                  errors?.applicantMiddleName
                    ? errors.applicantMiddleName.message
                    : null
                }
              />
            </Grid>

            {/* applicant last name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                label={<FormattedLabel id="applicantLastName" />}
                variant="standard"
                {...register("applicantLastName")}
                error={!!errors.applicantLastName}
                helperText={
                  errors?.applicantLastName
                    ? errors.applicantLastName.message
                    : null
                }
              />
            </Grid>

            {/* Landline No. */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="landlineNo" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("landlineNo")}
                error={!!errors.landlineNo}
                helperText={
                  errors?.landlineNo ? errors.landlineNo.message : null
                }
              />
            </Grid>

            {/* mobile no */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                label={<FormattedLabel id="mobileNo" />}
                variant="standard"
                {...register("mobileNo")}
                error={!!errors.mobileNo}
                helperText={errors?.mobileNo ? errors.mobileNo.message : null}
              />
            </Grid>

            {/* Email Id */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                label={<FormattedLabel id="emailId" />}
                variant="standard"
                {...register("emailId")}
                error={!!errors.emailId}
                helperText={errors?.emailId ? errors.emailId.message : null}
              />
            </Grid>

            {/* bank details box */}
            <Grid item xs={12}>
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
                      <FormattedLabel id="bankDetails" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* bank name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="bankName" />}
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={true}
                {...register("bankNameId")}
                error={!!errors.bankNameId}
                helperText={
                  errors?.bankNameId ? errors.bankNameId.message : null
                }
              />
            </Grid>

            {/* Branch Name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="branchName" />}
                variant="standard"
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={true}
                {...register("branchName")}
                error={!!errors.branchName}
                helperText={
                  errors?.branchName ? errors.branchName.message : null
                }
              />
            </Grid>

            {/* Saving Account No */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="accountNo" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("accountNo")}
                error={!!errors.accountNo}
                helperText={errors?.accountNo ? errors.accountNo.message : null}
              />
            </Grid>

            {/* Saving Account Name */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="accountHolderName" />}
                variant="standard"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("bankAccountFullName")}
                error={!!errors.bankAccountFullName}
                helperText={
                  errors?.bankAccountFullName
                    ? errors.bankAccountFullName.message
                    : null
                }
              />
            </Grid>

            {/* ifsc code */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="bankIFSC" />}
                variant="standard"
                {...register("ifscCode")}
                disabled={true}
                InputLabelProps={{ shrink: true }}
                error={!!errors.ifscCode}
                helperText={errors?.ifscCode ? errors.ifscCode.message : null}
              />
            </Grid>

            {/* Bank MICR Code */}
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="bankMICR" />}
                variant="standard"
                {...register("bankMICR")}
                disabled={true}
                InputLabelProps={{ shrink: true }}
                error={!!errors.bankMICR}
                helperText={errors?.bankMICR ? errors.bankMICR.message : null}
              />
            </Grid>

                {/* PAN Number */}
                <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="panNumber" />}
                  variant="standard"
                  inputProps={{ maxLength: 10, minLength: 10 }}
                  disabled={true}
                  {...register("pan_no")}
                  InputLabelProps={{
                    shrink: watch("pan_no") ? true : false,
                  }}
                  error={!!errors.pan_no}
                  helperText={
                    errors?.pan_no ? errors.pan_no.message : null
                  }
                />
              </Grid>
            {/* member info box */}
            <Grid item xs={12}>
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
                      <FormattedLabel id="memberInfo" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            {/* members show in table */}
            <DataGrid
              getRowHeight={() => "auto"}
              autoHeight={true}
              sx={{
                marginTop: 3,
                overflowY: "scroll",
                overflowX: "scroll",
                "& .MuiDataGrid-virtualScrollerContent": {},
                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#556CD6",
                  color: "white",
                },
                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
                flexDirection: "column",
                overflowX: "scroll",
              }}
              autoWidth
              density="standard"
              pageSize={10}
              rowsPerPageOptions={[10]}
              rows={memberList}
              columns={columns}
            />
            {/* Required documents */}
            <Grid item xs={12}>
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
                      <FormattedLabel id="requiredDoc" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* document columns */}
            <DataGrid
              getRowHeight={() => "auto"}
              autoHeight={true}
              sx={{
                marginTop: 3,
                overflowY: "scroll",
                overflowX: "scroll",
                "& .MuiDataGrid-virtualScrollerContent": {},
                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#556CD6",
                  color: "white",
                },
                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
                flexDirection: "column",
                overflowX: "scroll",
              }}
              autoWidth
              density="standard"
              pageSize={10}
              rowsPerPageOptions={[10]}
              rows={fetchDocument}
              columns={docColumns}
            />
            <Divider />
          </Grid>

          {/* Approval section */}
          {((loggedUser != "citizenUser" && loggedUser != "cfcUser") ||
            ((loggedUser === "citizenUser" || loggedUser === "cfcUser") &&
              (statusVal === 1 ||
                statusVal === 3 ||
                statusVal === 4 ||
                statusVal === 5 ||
                statusVal === 6 ||
                statusVal === 7 ||
                statusVal === 10 ||
                statusVal === 17 ||
                statusVal === 18 ||
                statusVal === 21 ||
                statusVal === 22 ||
                statusVal === 23) &&
              remarkTableData.length != 0)) && (
            <Grid item xs={12}>
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
                      <FormattedLabel id="approvalSection" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          )}

          {/* samuh sanghtak remark show only citizen when status is reverted */}
          {(loggedUser === "citizenUser" || loggedUser === "cfcUser") &&
            (statusVal === 22 || statusVal === 1) && (
              <>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <TextField
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    id="standard-basic"
                    label={
                      statusVal === 1 ? (
                        <FormattedLabel id="revertedReason" />
                      ) : (
                        <FormattedLabel id="rejectedReason" />
                      )
                    }
                    variant="standard"
                    multiline
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled={true}
                    {...register("saSanghatakRemark")}
                    error={!!errors.saSanghatakRemark}
                    helperText={
                      errors?.saSanghatakRemark
                        ? errors.saSanghatakRemark.message
                        : null
                    }
                  />
                </Grid>
                {statusVal === 22 && (
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "98%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="rejectCat" />}
                      multiline
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={true}
                      {...register("rejectReason")}
                      error={!!errors.rejectReason}
                      helperText={
                        errors?.rejectCat ? errors.rejectCat.message : null
                      }
                    />{" "}
                  </Grid>
                )}
              </>
            )}

          {/* remark table */}
          {
            // loggedUser != "citizenUser" &&
            //   loggedUser != "cfcUser" &&
            remarkTableData.length != 0 && (
              <DataGrid
                getRowHeight={() => "auto"}
                autoHeight={true}
                sx={{
                  overflowY: "scroll",
                  overflowX: "scroll",
                  "& .MuiDataGrid-virtualScrollerContent": {},
                  "& .MuiDataGrid-columnHeadersInner": {
                    backgroundColor: "#556CD6",
                    color: "white",
                  },
                  "& .MuiDataGrid-cell:hover": {
                    color: "primary.main",
                  },
                  marginTop: "10px",
                }}
                density="comfortable"
                // rowHeight={50}
                rowCount={remarkTableData.length}
                pageSize={10}
                rows={remarkTableData}
                columns={approveSectionCol}
                onPageChange={(_data) => {}}
                onPageSizeChange={(_data) => {}}
              />
            )
          }
          <>
            {(loggedUser !== "citizenUser" || loggedUser !== "cfcUser") && (
              <Box sx={{ marginTop: "1rem" }}>
                <Grid
                  container
                  spacing={2}
                  sx={{
                    [theme.breakpoints.up("sm")]: {
                      display: "flex",
                      justifyContent: "center",
                    },
                  }}
                >
                  {statusVal !== 15 && (
                    <>
                      {/* Checkbox for approve */}
                      {(((statusVal === 2 || statusVal === 23) &&
                        authority &&
                        authority.find(
                          (val) => val === bsupUserRoles.roleSamuhaSanghatak
                        )) ||
                        ((statusVal == 4 || statusVal == 3) &&
                          authority &&
                          authority.find(
                            (val) => val === bsupUserRoles.roleZonalClerk
                          )) ||
                        ((statusVal == 5 || statusVal == 6) &&
                          authority &&
                          authority.find(
                            (val) => val === bsupUserRoles.roleZonalOfficer
                          )) ||
                        (statusVal == 7 &&
                          authority &&
                          authority.find(
                            (val) => val === bsupUserRoles.roleHOClerk
                          ))) && (
                        <>
                          <Grid item xl={2} lg={2} md={2} sm={12} xs={12}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name="approve"
                                  checked={isApproveChecked}
                                  onChange={handleCheckboxChange}
                                />
                              }
                              label={<FormattedLabel id="approvebtn" />}
                            />
                          </Grid>

                          {/* Checkbox for revert */}
                          <Grid item xl={2} lg={2} md={2} sm={12} xs={12}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name="revert"
                                  checked={isRevertChecked}
                                  onChange={handleCheckboxChange}
                                />
                              }
                              label={<FormattedLabel id="revertbtn" />}
                            />
                          </Grid>

                          {/* Checkbox for reject */}
                          {(statusVal === 2 || statusVal === 23) &&
                            authority &&
                            authority.find(
                              (val) => val === bsupUserRoles.roleSamuhaSanghatak
                            ) && (
                              <Grid item xl={2} lg={2} md={2} sm={12} xs={12}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      name="reject"
                                      checked={isRejectChecked}
                                      onChange={handleCheckboxChange}
                                    />
                                  }
                                  label={<FormattedLabel id="rejectBtn" />}
                                />
                              </Grid>
                            )}
                        </>
                      )}
                    </>
                  )}
                </Grid>
              </Box>
            )}

            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              {/* Samuh sanghtak remark */}
              {(statusVal == 2 || statusVal == 23) &&
                authority &&
                authority.find(
                  (val) => val === bsupUserRoles.roleSamuhaSanghatak
                ) && (
                  <>
                    {/* {isRejectChecked && (
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
                              <FormattedLabel id="rejectCat" />
                            </InputLabel>
                            <Controller
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              name="bachatgatrejectionCategories"
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
                                    handleChange(e, e.target.value);
                                  }}
                                  renderValue={(selected) =>
                                    selected.includes("all")
                                      ? "Select All"
                                      : selected
                                          .map((id) =>
                                            language == "en"
                                              ? bachatgatrejectionCategories.find(
                                                  (student) => student.id === id
                                                )?.rejectCat
                                              : bachatgatrejectionCategories.find(
                                                  (student) => student.id === id
                                                )?.rejectCatMr
                                          )
                                          .join(", ")
                                  }
                                >
                                  {bachatgatrejectionCategories?.length > 0 && (
                                    <MenuItem key="all" value="all">
                                      <Checkbox
                                        checked={
                                          serviceId.length ===
                                          bachatgatrejectionCategories.length
                                        }
                                        indeterminate={
                                          serviceId.length > 0 &&
                                          serviceId.length <
                                            bachatgatrejectionCategories.length
                                        }
                                        onChange={(e) => handleChange(e, "all")}
                                      />
                                      {language == "en"
                                        ? "Select All"
                                        : "सर्व निवडा"}
                                    </MenuItem>
                                  )}

                                  {bachatgatrejectionCategories.map((dept) => (
                                    <MenuItem key={dept.id} value={dept.id}>
                                      <Checkbox
                                        checked={serviceId.includes(dept.id)}
                                        onChange={(e) =>
                                          handleChange(e, dept.id)
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
                      )}
                    </>
                    {(isRejectChecked ||
                      isApproveChecked ||
                      isRevertChecked) && (
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="saSanghatakRemark" />}
                          variant="standard"
                          inputProps={{ maxLength: 1000 }}
                          multiline
                          InputLabelProps={{
                            shrink: true,
                          }}
                          disabled={
                            statusVal != 2 && statusVal != 23
                              ? true
                              : authority &&
                                authority.find(
                                  (val) =>
                                    val === bsupUserRoles.roleSamuhaSanghatak
                                )
                              ? false
                              : true
                          }
                          {...register("saSanghatakRemark")}
                          onChange={(e) =>
                            handleRemarkChange(e, "samuhaSanghatakRemark")
                          }
                          error={!!errors.saSanghatakRemark}
                          helperText={
                            errors?.saSanghatakRemark
                              ? errors.saSanghatakRemark.message
                              : null
                          }
                        />
                      </Grid>
                    )} */}

                    {/* New Fields */}
                    {(isRejectChecked ||
                      isApproveChecked ||
                      isRevertChecked) && (
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
                              <FormattedLabel id="revertCategory" />
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
                                      "saSanghatakRemark"
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
                                            "saSanghatakRemark"
                                          )
                                        }
                                      />
                                      {language == "en"
                                        ? "Select All"
                                        : "सर्व निवडा"}
                                    </MenuItem>
                                  )}

                                  {bachatgatRevertCategories?.map(
                                    (dept, index) => (
                                      <MenuItem key={dept.id} value={dept.id}>
                                        <Checkbox
                                          checked={serviceId.includes(dept.id)}
                                          onChange={(e) =>
                                            handleChange(
                                              e,
                                              dept.id,
                                              "saSanghatakRemark"
                                            )
                                          }
                                        />
                                        {language === "en"
                                          ? dept?.rejectCat
                                          : dept?.rejectCatMr}
                                      </MenuItem>
                                    )
                                  )}
                                </Select>
                              )}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-basic"
                            label={<FormattedLabel id="saSanghatakRemark" />}
                            variant="standard"
                            inputProps={{ maxLength: 1000 }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            multiline
                            disabled={true}
                            // disabled={
                            //   statusVal != 2 && statusVal != 23
                            //     ? true
                            //     : authority &&
                            //       authority.find(
                            //         (val) =>
                            //           val === bsupUserRoles.roleSamuhaSanghatak
                            //       )
                            //     ? false
                            //     : true
                            // }
                            {...register("saSanghatakRemark")}
                            onChange={(e) =>
                              handleRemarkChange(e, "samuhaSanghatakRemark")
                            }
                            error={!!errors.saSanghatakRemark}
                            helperText={
                              errors?.saSanghatakRemark
                                ? errors.saSanghatakRemark.message
                                : null
                            }
                          />
                        </Grid>
                      </>
                    )}
                  </>
                )}

              {/* deparment clerk remark */}
              {(statusVal == 3 || statusVal == 4) &&
                authority &&
                authority.find(
                  (val) => val === bsupUserRoles.roleZonalClerk
                ) && (
                  <>
                    {/* {(isRejectChecked ||
                      isApproveChecked ||
                      isRevertChecked) && (
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="deptClerkRemark" />}
                          variant="standard"
                          inputProps={{ maxLength: 1000 }}
                          multiline
                          InputLabelProps={{
                            shrink: true,
                          }}
                          {...register("deptClerkRemark")}
                          onChange={(e) =>
                            handleRemarkChange(e, "deptClerkRemark")
                          }
                          disabled={
                            statusVal != 3 && statusVal != 4
                              ? true
                              : authority &&
                                authority.find(
                                  (val) => val === bsupUserRoles.roleZonalClerk
                                )
                              ? false
                              : true
                          }
                          error={!!errors.deptClerkRemark}
                          helperText={
                            errors?.deptClerkRemark
                              ? errors.deptClerkRemark.message
                              : null
                          }
                        />
                      </Grid>
                    )} */}

                    {/* New Fields */}
                    {(isRejectChecked ||
                      isApproveChecked ||
                      isRevertChecked) && (
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
                              <FormattedLabel id="revertCategory" />
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
                                          handleChange(
                                            e,
                                            "all",
                                            "deptClerkRemark"
                                          )
                                        }
                                      />
                                      {language == "en"
                                        ? "Select All"
                                        : "सर्व निवडा"}
                                    </MenuItem>
                                  )}

                                  {bachatgatRevertCategories?.map(
                                    (dept, index) => (
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
                                    )
                                  )}
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
                            // disabled={
                            //   statusVal != 3 && statusVal != 4
                            //     ? true
                            //     : authority &&
                            //       authority.find(
                            //         (val) =>
                            //           val === bsupUserRoles.roleZonalClerk
                            //       )
                            //     ? false
                            //     : true
                            // }
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
                      </>
                    )}
                  </>
                )}

              {/* assistant commisssioner remark */}
              {(statusVal == 5 || statusVal == 6) &&
                authority &&
                authority.find(
                  (val) => val === bsupUserRoles.roleZonalOfficer
                ) && (
                  <>
                    {/* {(isRejectChecked ||
                      isApproveChecked ||
                      isRevertChecked) && (
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="asstCommissionerRemark" />}
                          variant="standard"
                          disabled={
                            statusVal != 5 && statusVal != 6
                              ? true
                              : authority &&
                                authority.find(
                                  (val) =>
                                    val === bsupUserRoles.roleZonalOfficer
                                )
                              ? false
                              : true
                          }
                          inputProps={{ maxLength: 1000 }}
                          multiline
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
                    )} */}

                    {/* New Fields */}
                    {(isRejectChecked ||
                      isApproveChecked ||
                      isRevertChecked) && (
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
                              <FormattedLabel id="revertCategory" />
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

                                  {bachatgatRevertCategories?.map(
                                    (dept, index) => (
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
                                    )
                                  )}
                                </Select>
                              )}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="asstCommissionerRemark" />
                            }
                            variant="standard"
                            disabled={true}
                            // disabled={
                            //   statusVal != 5 && statusVal != 6
                            //     ? true
                            //     : authority &&
                            //       authority.find(
                            //         (val) =>
                            //           val === bsupUserRoles.roleZonalOfficer
                            //       )
                            //     ? false
                            //     : true
                            // }
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
                      </>
                    )}
                  </>
                )}

              {/* deputy commissioner remark */}
              {statusVal == 7 &&
                authority &&
                authority.find((val) => val === bsupUserRoles.roleHOClerk) && (
                  <>
                    {/* {(isRejectChecked ||
                      isApproveChecked ||
                      isRevertChecked) && (
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          id="standard-basic"
                          label={
                            <FormattedLabel id="deptyCommissionerRemark" />
                          }
                          variant="standard"
                          disabled={statusVal != 7 ? true : false}
                          inputProps={{ maxLength: 1000 }}
                          multiline
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
                    )} */}

                    {/* New Fields */}
                    {(isRejectChecked ||
                      isApproveChecked ||
                      isRevertChecked) && (
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
                              <FormattedLabel id="revertCategory" />
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

                                  {bachatgatRevertCategories?.map(
                                    (dept, index) => (
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
                                    )
                                  )}
                                </Select>
                              )}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="deptyCommissionerRemark" />
                            }
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
                  </>
                )}
            </Grid>

            {/* Approve  reject revert button */}
            {(((statusVal == 2 || statusVal == 23) &&
              authority &&
              authority.find(
                (val) => val === bsupUserRoles.roleSamuhaSanghatak
              )) ||
              ((statusVal == 5 || statusVal == 6) &&
                authority &&
                authority.find(
                  (val) => val === bsupUserRoles.roleZonalOfficer
                )) ||
              ((statusVal == 3 || statusVal == 4) &&
                authority &&
                authority.find(
                  (val) => val === bsupUserRoles.roleZonalClerk
                )) ||
              (statusVal == 7 &&
                authority &&
                authority.find(
                  (val) => val === bsupUserRoles.roleHOClerk
                ))) && (
              <Grid container sx={{ padding: "10px" }}>
                <Grid
                  item
                  xl={
                    !isApproveChecked && !isRevertChecked && !isRejectChecked
                      ? 12
                      : 6
                  }
                  lg={
                    !isApproveChecked && !isRevertChecked && !isRejectChecked
                      ? 12
                      : 6
                  }
                  md={
                    !isApproveChecked && !isRevertChecked && !isRejectChecked
                      ? 12
                      : 6
                  }
                  sm={
                    !isApproveChecked && !isRevertChecked && !isRejectChecked
                      ? 12
                      : 6
                  }
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    sx={{ margin: 1 }}
                    variant="contained"
                    color="primary"
                    // className={commonStyles.buttonExit}
                    size="small"
                    onClick={() => backButton()}
                  >
                    <FormattedLabel id="back" />
                  </Button>
                </Grid>
                {isApproveChecked && (
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
                      onClick={() => {
                        onSubmitForm("Save");
                      }}
                      // className={commonStyles.buttonApprove}
                      // disabled={!isRemarksFilled}
                      disabled={serviceId.length > 0 ? false : true}
                      variant="contained"
                      color="success"
                      size="small"
                    >
                      <FormattedLabel id="approvebtn" />
                    </Button>
                  </Grid>
                )}
                {isRevertChecked && (
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
                      onClick={() => {
                        onSubmitForm("Revert");
                      }}
                      // className={commonStyles.buttonRevert}
                      // disabled={!isRemarksFilled}
                      disabled={serviceId.length > 0 ? false : true}
                      variant="contained"
                      color="secondary"
                      size="small"
                    >
                      <FormattedLabel id="revertbtn" />
                    </Button>
                  </Grid>
                )}

                {authority &&
                  authority.find(
                    (val) => val === bsupUserRoles.roleSamuhaSanghatak
                  ) && (
                    <>
                      {isRejectChecked && (
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
                            onClick={() => {
                              onSubmitForm("Reject");
                            }}
                            // className={commonStyles.buttonReject}
                            // disabled={!isRemarksFilled}
                            disabled={serviceId.length > 0 ? false : true}
                            variant="contained"
                            color="error"
                            size="small"
                          >
                            <FormattedLabel id="rejectBtn" />
                          </Button>
                        </Grid>
                      )}
                    </>
                  )}
              </Grid>
            )}
          </>

          {(loggedUser === "citizenUser" ||
            (statusVal != 2 &&
              statusVal != 23 &&
              authority &&
              authority.find(
                (val) => val === bsupUserRoles.roleSamuhaSanghatak
              )) ||
            (statusVal != 5 &&
              statusVal != 6 &&
              authority &&
              authority.find(
                (val) => val === bsupUserRoles.roleZonalOfficer
              )) ||
            (statusVal != 3 &&
              statusVal != 4 &&
              authority &&
              authority.find((val) => val === bsupUserRoles.roleZonalClerk)) ||
            (statusVal != 7 &&
              authority &&
              authority.find((val) => val === bsupUserRoles.roleHOClerk))) && (
            <Grid
              item
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                sx={{ margin: 1 }}
                variant="contained"
                color="primary"
                // className={commonStyles.buttonExit}
                size="small"
                onClick={() => backButton()}
              >
                <FormattedLabel id="back" />
              </Button>
            </Grid>
          )}
        </form>
      </Paper>
    </ThemeProvider>
  );
};

export default BachatGatCategory;
