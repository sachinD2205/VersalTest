import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  ThemeProvider,
  Checkbox,
  Select,
  MenuItem,
  FormControlLabel,
  Paper,
  InputLabel,
  TextField,
} from "@mui/material";
import sweetAlert from "sweetalert";
import theme from "../../../../theme";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Visibility } from "@mui/icons-material";
import { manageStatus } from "../../../../components/rtiOnlineSystem/commonStatus/manageEnMr";
// import Loader from "../../../../containers/Layout/components/Loader";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import bsupUserRoles from "../../../../components/bsupNagarVasthi/userRolesBSUP";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
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
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({});

  const router = useRouter();
  const loggedUser = localStorage.getItem("loggedInUser");
  const [statusVal, setStatusVal] = useState(null);
  const [zone, setZone] = useState([]);
  const [ward, setWard] = useState([]);
  const [area, setArea] = useState([]);
  const [gatCategory, setGatCategory] = useState([]);
  const [valueData, setValuesData] = useState([]);
  const [userLst, setUserLst] = useState([]);
  const language = useSelector((state) => state.labels.language);
  const [regDetails, setRegDetails] = useState(null);
  const [appliNo, setApplicationNo] = useState();
  const [statusAll, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStatus1, setCurrentStatus] = useState();
  const user = useSelector((state) => state.user.user);
  const [bankMaster, setBankMasters] = useState([]);
  const [memberList, setMemberData] = useState([]);
  const [fetchDocument, setFetchDocuments] = useState([]);
  const [bgRegId, setId] = useState(null);
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );
  const [bachatgatrejectionCategories, setBachatgatrejectionCategories] =
    useState([]);
  const [hanadleStudent, setHanadleStudent] = useState([]);
  const [serviceId, setServiceId] = useState([]);
  const [rejectReason, setRejectReason] = useState();
  const [remarkTableData, setRemarkData] = useState([]);
  const [samuhaSanghatakRemark, setSamuhaSanghatakRemark] = useState("");
  const [deptClerkRemark, setDeptClerkRemark] = useState("");
  const [asstCommissionerRemark, setAsstCommissionerRemark] = useState("");
  const [deptyCommissionerRemark, setDeptyCommissionerRemark] = useState("");
  const [isRemarksFilled, setIsRemarksFilled] = useState(false);
  const [isApproveChecked, setIsApproveChecked] = useState(false);
  const [isRevertChecked, setIsRevertChecked] = useState(false);
  const [isRejectChecked, setIsRejectChecked] = useState(false);
  const [approveRemark, setApproveRemark] = useState("");
  const [bachatgatApprovalCategories, setBachatgatApprovalCategories] =
    useState([]);
  const [bachatgatRevertCategories, setBachatgatRevertCategories] = useState(
    []
  );

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
        cfcErrorCatchMethod(err, false);
      });
  };

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
        // setIsRemarksFilled(true);
        break;
      case "deptClerkRemark":
        setDeptClerkRemark(fieldValue);
        // setIsRemarksFilled(true);
        break;
      case "asstCommissionerRemark":
        setAsstCommissionerRemark(fieldValue);
        // setIsRemarksFilled(true);
        break;
      case "deptyCommissionerRemark":
        setDeptyCommissionerRemark(fieldValue);
        // setIsRemarksFilled(true);
        break;
      default:
        break;
    }
  };

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roleIds;
  // const headers =
  //   loggedUser === "citizenUser"
  //     ? { Userid: user?.id, Authorization: `Bearer ${user?.token}` }
  //     : { Authorization: `Bearer ${user?.token}` };
  const headers = { Authorization: `Bearer ${user.token}` };

  useEffect(() => {
    getCRAreaName();
    getZoneName();
    getAllStatus();
    getWardNames();
    getBachatGatCategory();
    getBankMasters();
    getRejectCategories();
    getUser();
  }, []);
  const backButton = () => {
    if (loggedUser === "citizenUser") {
      router.push({
        pathname: "/dashboard",
      });
    } else {
      router.push({
        pathname: "/BsupNagarvasthi/transaction/bachatGatCancellation",
      });
    }
  };

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
        // console.log("response data ====> ", r);
        // setBachatgatrejectionCategories(
        //   r.data.mstRejectCategoryDao.map((row) => ({
        //     id: row.id,
        //     rejectCat: row.rejectCat,
        //     rejectCatMr: row.rejectCatMr,
        //   }))
        // );

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

  useEffect(() => {
    if (isRejectChecked) {
      setRejectReason(hanadleStudent.toString());
    }
  }, [hanadleStudent]);

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
      .get(`${urls.CFCURL}/master/user/getAll`, { headers: headers })
      .then((res) => {
        setUserLst(res?.data?.user);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  useEffect(() => {
    if (valueData.length != 0) {
      setDataOnForm();
    }
  }, [valueData, language, ward, zone, area, userLst]);

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

  // set data on form
  const setDataOnForm = () => {
    if (valueData != undefined && ward) {
      const data = valueData;
      setId(data.bgRegistrationKey);
      setValue("areaKey", data.areaKey);
      setValue("zoneKey", data.zoneKey);
      setValue("wardKey", data.wardKey);
      setValue(
        "areaName",
        language == "en"
          ? area?.find((obj) => obj.id == data.areaKey)?.areaName
            ? area?.find((obj) => obj.id == data.areaKey)?.areaName
            : "-"
          : area?.find((obj) => obj.id == data.areaKey)?.areaNameMr
          ? area?.find((obj) => obj.id == data.areaKey)?.areaNameMr
          : "-"
      );
      setValue(
        "zoneName",
        language == "en"
          ? zone?.find((obj) => obj.id == data.zoneKey)?.zoneName
            ? zone?.find((obj) => obj.id == data.zoneKey)?.zoneName
            : "-"
          : zone?.find((obj) => obj.id == data.zoneKey)?.zoneNameMr
          ? zone?.find((obj) => obj.id == data.zoneKey)?.zoneNameMr
          : "-"
      );
      setValue(
        "wardname",
        language == "en"
          ? ward?.find((obj) => obj.id == data.wardKey)?.wardName
            ? ward?.find((obj) => obj.id == data.wardKey)?.wardName
            : "-"
          : ward?.find((obj) => obj.id == data.wardKey)?.wardNameMr
          ? ward?.find((obj) => obj.id == data.wardKey)?.wardNameMr
          : "-"
      );
      setValue("rejectReason", data?.rejectReason);
      setValue("geoCode", data.geoCode);
      setValue("bachatgatName", data.bachatgatName);
      setValue(
        "categoryKey",
        language == "en"
          ? gatCategory?.find((obj) => obj.id == data.categoryKey)
              ?.bgCategoryName
            ? gatCategory?.find((obj) => obj.id == data.categoryKey)
                ?.bgCategoryName
            : "-"
          : gatCategory?.find((obj) => obj.id == data.categoryKey)?.bgCategoryMr
          ? gatCategory?.find((obj) => obj.id == data.categoryKey)?.bgCategoryMr
          : "-"
      );
      setValue("presidentFirstName", data.presidentFirstName);
      setValue("presidentLastName", data.presidentLastName);
      setValue("presidentMiddleName", data.presidentMiddleName);
      setValue("totalMembersCount", data.totalMembersCount);
      setValue("flatBuldingNo", data.flatBuldingNo);
      setValue("buildingName", data.buildingName);
      setValue("roadName", data.roadName);
      setValue("landmark", data.landmark);
      setValue("pinCode", data.pinCode);
      setValue("landlineNo", data.landlineNo);
      setValue("applicantFirstName", data?.applicantFirstName);
      setValue("applicantMiddleName", data?.applicantMiddleName);
      setValue("applicantLastName", data?.applicantLastName);
      setValue("emailId", data?.emailId);
      setValue("mobileNo", data?.mobileNo);
      setStatusVal(data.status);
      setValue(
        "bankName",
        language == "en"
          ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankName
            ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankName
            : "-"
          : bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankNameMr
          ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.bankNameMr
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
      setValue(
        "bankMICR",
        bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.micrCode
          ? bankMaster?.find((obj) => obj.id == data.bankBranchKey)?.micrCode
          : "-"
      );
      setValue("startDate", data.startDate);
      setValue("saSanghatakRemark", data.saSanghatakRemark);
      setValue("deptClerkRemark", data.deptClerkRemark);
      setValue("deptyCommissionerRemark", data.deptyCommissionerRemark);
      setValue("asstCommissionerRemark", data.asstCommissionerRemark);
      setCurrentStatus(manageStatus(data.status, language, statusAll));
      let _res =
        data.trnBachatgatRegistrationDocumentsList &&
        data.trnBachatgatRegistrationDocumentsList.map((r, i) => {
          return {
            id: i + 1,
            filenm:
              r.documentPath &&
              r.documentPath.split("/").pop().split("_").pop(),
            documentType: r.documentType,
            documentPath: r.documentPath,
            fileType: r.documentPath && r.documentPath.split(".").pop(),
          };
        });
      _res && setFetchDocuments([..._res]);
      setApplicationNo(data.applicationNo);

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
                userLst.find((obj) => obj.id == data.saSanghatakUserId)
                  ?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.saSanghatakUserId)
                    ?.firstNameEn
                : "-"
              : i == 1
              ? userLst &&
                userLst.find((obj) => obj.id == data.deptClerkUserId)
                  ?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.deptClerkUserId)
                    ?.firstNameEn
                : "-"
              : i == 2
              ? userLst &&
                userLst.find((obj) => obj.id == data.asstCommissionerUserId)
                  ?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.asstCommissionerUserId)
                    ?.firstNameEn
                : "-"
              : userLst &&
                userLst.find((obj) => obj.id == data.deptyCommissionerUserId)
                  ?.firstNameEn
              ? userLst?.find((obj) => obj.id == data.deptyCommissionerUserId)
                  ?.firstNameEn
              : "-";

          const lastNameEn =
            i == 0
              ? userLst &&
                userLst.find((obj) => obj.id == data.saSanghatakUserId)
                  ?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.saSanghatakUserId)
                    ?.lastNameEn
                : "-"
              : i == 1
              ? userLst &&
                userLst.find((obj) => obj.id == data.deptClerkUserId)
                  ?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.deptClerkUserId)
                    ?.lastNameEn
                : "-"
              : i == 2
              ? userLst &&
                userLst.find((obj) => obj.id == data.asstCommissionerUserId)
                  ?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.asstCommissionerUserId)
                    ?.lastNameEn
                : "-"
              : userLst &&
                userLst.find((obj) => obj.id == data.deptyCommissionerUserId)
                  ?.lastNameEn
              ? userLst?.find((obj) => obj.id == data.deptyCommissionerUserId)
                  ?.lastNameEn
              : "-";
          a.push({
            id: i + 1,
            remark:
              i == 0
                ? data.saSanghatakRemark
                : i == 1
                ? data.deptClerkRemark
                : i == 2
                ? data.asstCommissionerRemark
                : data.deptyCommissionerRemark,
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
                ? moment(data.saSanghatakDate).format("DD/MM/YYYY HH:mm")
                : i == 1
                ? moment(data.deptClerkDate).format("DD/MM/YYYY HH:mm")
                : i == 2
                ? moment(data.asstCommissionerDate).format("DD/MM/YYYY HH:mm")
                : moment(data.deptyCommissionerDate).format("DD/MM/YYYY HH:mm"),
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
                userLst.find((obj) => obj.id == data.saSanghatakUserId)
                  ?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.saSanghatakUserId)
                    ?.firstNameEn
                : "-"
              : i == 1
              ? userLst &&
                userLst.find((obj) => obj.id == data.deptClerkUserId)
                  ?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.deptClerkUserId)
                    ?.firstNameEn
                : "-"
              : i == 2
              ? userLst &&
                userLst.find((obj) => obj.id == data.asstCommissionerUserId)
                  ?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.asstCommissionerUserId)
                    ?.firstNameEn
                : "-"
              : "";
          const lastNameEn =
            i == 0
              ? userLst &&
                userLst.find((obj) => obj.id == data.saSanghatakUserId)
                  ?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.saSanghatakUserId)
                    ?.lastNameEn
                : "-"
              : i == 1
              ? userLst &&
                userLst.find((obj) => obj.id == data.deptClerkUserId)
                  ?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.deptClerkUserId)
                    ?.lastNameEn
                : "-"
              : i == 2
              ? userLst &&
                userLst.find((obj) => obj.id == data.asstCommissionerUserId)
                  ?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.asstCommissionerUserId)
                    ?.lastNameEn
                : "-"
              : "";

          a.push({
            id: i + 1,
            remark:
              i == 0
                ? data.saSanghatakRemark
                : i == 1
                ? data.deptClerkRemark
                : i == 2
                ? data.asstCommissionerRemark
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
                ? moment(data.saSanghatakDate).format("DD/MM/YYYY HH:mm")
                : i == 1
                ? moment(data.deptClerkDate).format("DD/MM/YYYY HH:mm")
                : i == 2
                ? moment(data.asstCommissionerDate).format("DD/MM/YYYY HH:mm")
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
                userLst.find((obj) => obj.id == data.saSanghatakUserId)
                  ?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.saSanghatakUserId)
                    ?.firstNameEn
                : "-"
              : i == 1
              ? userLst &&
                userLst.find((obj) => obj.id == data.deptClerkUserId)
                  ?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.deptClerkUserId)
                    ?.firstNameEn
                : "-"
              : i == 2
              ? userLst &&
                userLst.find((obj) => obj.id == data.deptyCommissionerUserId)
                  ?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.deptyCommissionerUserId)
                    ?.firstNameEn
                : "-"
              : "";
          const lastNameEn =
            i == 0
              ? userLst &&
                userLst.find((obj) => obj.id == data.saSanghatakUserId)
                  ?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.saSanghatakUserId)
                    ?.lastNameEn
                : "-"
              : i == 1
              ? userLst &&
                userLst.find((obj) => obj.id == data.deptClerkUserId)
                  ?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.deptClerkUserId)
                    ?.lastNameEn
                : "-"
              : i == 2
              ? userLst &&
                userLst.find((obj) => obj.id == data.deptyCommissionerUserId)
                  ?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.deptyCommissionerUserId)
                    ?.lastNameEn
                : "-"
              : "";

          a.push({
            id: i + 1,
            remark:
              i == 0
                ? data.saSanghatakRemark
                : i == 1
                ? data.deptClerkRemark
                : i == 2
                ? data.deptyCommissionerRemark
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
                ? moment(data.saSanghatakDate).format("DD/MM/YYYY HH:mm")
                : i == 1
                ? moment(data.deptClerkDate).format("DD/MM/YYYY HH:mm")
                : i == 2
                ? moment(data.deptyCommissionerDate).format("DD/MM/YYYY HH:mm")
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
                userLst.find((obj) => obj.id == data.saSanghatakUserId)
                  ?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.saSanghatakUserId)
                    ?.firstNameEn
                : "-"
              : i == 1
              ? userLst &&
                userLst.find((obj) => obj.id == data.deptClerkUserId)
                  ?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.deptClerkUserId)
                    ?.firstNameEn
                : "-"
              : "";

          const lastNameEn =
            i == 0
              ? userLst &&
                userLst.find((obj) => obj.id == data.saSanghatakUserId)
                  ?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.saSanghatakUserId)
                    ?.lastNameEn
                : "-"
              : i == 1
              ? userLst &&
                userLst.find((obj) => obj.id == data.deptClerkUserId)
                  ?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.deptClerkUserId)
                    ?.lastNameEn
                : "-"
              : "";
          a.push({
            id: i + 1,
            remark:
              i == 0
                ? data.saSanghatakRemark
                : i == 1
                ? data.deptClerkRemark
                : "",
            designation:
              i == 0 ? "Samuh Sanghtak" : i == 1 ? "Zonal Clerk" : "",
            remarkDate:
              i == 0
                ? moment(data.saSanghatakDate).format("DD/MM/YYYY HH:mm")
                : i == 1
                ? moment(data.deptClerkDate).format("DD/MM/YYYY HH:mm")
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
                userLst.find((obj) => obj.id == data.saSanghatakUserId)
                  ?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.saSanghatakUserId)
                    ?.firstNameEn
                : "-"
              : i == 1
              ? userLst &&
                userLst.find((obj) => obj.id == data.deptyCommissionerUserId)
                  ?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.deptyCommissionerUserId)
                    ?.firstNameEn
                : "-"
              : "";

          const lastNameEn =
            i == 0
              ? userLst &&
                userLst.find((obj) => obj.id == data.saSanghatakUserId)
                  ?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.saSanghatakUserId)
                    ?.lastNameEn
                : "-"
              : i == 1
              ? userLst &&
                userLst.find((obj) => obj.id == data.deptyCommissionerUserId)
                  ?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.deptyCommissionerUserId)
                    ?.lastNameEn
                : "-"
              : "";
          a.push({
            id: i + 1,
            remark:
              i == 0
                ? data.saSanghatakRemark
                : i == 1
                ? data.deptyCommissionerRemark
                : "",
            designation: i == 0 ? "Samuh Sanghtak" : i == 1 ? "HO Clerk" : "",
            remarkDate:
              i == 0
                ? moment(data.saSanghatakDate).format("DD/MM/YYYY HH:mm")
                : i == 1
                ? moment(data.deptyCommissionerDate).format("DD/MM/YYYY HH:mm")
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
                userLst.find((obj) => obj.id == data.saSanghatakUserId)
                  ?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.saSanghatakUserId)
                    ?.firstNameEn
                : "-"
              : "";

          const lastNameEn =
            i == 0
              ? userLst &&
                userLst.find((obj) => obj.id == data.saSanghatakUserId)
                  ?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.saSanghatakUserId)
                    ?.lastNameEn
                : "-"
              : "";
          a.push({
            id: i + 1,
            remark: i == 0 ? data.saSanghatakRemark : "",
            designation: i == 0 ? "Samuh Sanghtak" : "",
            remarkDate:
              i == 0
                ? moment(data.saSanghatakDate).format("DD/MM/YYYY HH:mm")
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
                userLst.find((obj) => obj.id == data.deptClerkUserId)
                  ?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.deptClerkUserId)
                    ?.firstNameEn
                : "-"
              : i == 1
              ? userLst &&
                userLst.find((obj) => obj.id == data.asstCommissionerUserId)
                  ?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.asstCommissionerUserId)
                    ?.firstNameEn
                : "-"
              : userLst &&
                userLst.find((obj) => obj.id == data.deptyCommissionerUserId)
                  ?.firstNameEn
              ? userLst?.find((obj) => obj.id == data.deptyCommissionerUserId)
                  ?.firstNameEn
              : "-";

          const lastNameEn =
            i == 0
              ? userLst &&
                userLst.find((obj) => obj.id == data.deptClerkUserId)
                  ?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.deptClerkUserId)
                    ?.lastNameEn
                : "-"
              : i == 1
              ? userLst &&
                userLst.find((obj) => obj.id == data.asstCommissionerUserId)
                  ?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.asstCommissionerUserId)
                    ?.lastNameEn
                : "-"
              : userLst &&
                userLst.find((obj) => obj.id == data.deptyCommissionerUserId)
                  ?.lastNameEn
              ? userLst?.find((obj) => obj.id == data.deptyCommissionerUserId)
                  ?.lastNameEn
              : "-";
          a.push({
            id: i + 1,
            remark:
              i == 0
                ? data.deptClerkRemark
                : i == 1
                ? data.asstCommissionerRemark
                : i == 2
                ? data.deptyCommissionerRemark
                : "",
            designation:
              i == 0 ? "Zonal Clerk" : i == 1 ? "Zonal Officer" : "HO Clerk",
            remarkDate:
              i == 0
                ? moment(data.deptClerkDate).format("DD/MM/YYYY HH:mm")
                : i == 1
                ? moment(data.asstCommissionerDate).format("DD/MM/YYYY HH:mm")
                : moment(data.deptyCommissionerDate).format("DD/MM/YYYY HH:mm"),
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
                userLst.find((obj) => obj.id == data.deptClerkUserId)
                  ?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.deptClerkUserId)
                    ?.firstNameEn
                : "-"
              : i == 1
              ? userLst &&
                userLst.find((obj) => obj.id == data.asstCommissionerUserId)
                  ?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.asstCommissionerUserId)
                    ?.firstNameEn
                : "-"
              : "";

          const lastNameEn =
            i == 0
              ? userLst &&
                userLst.find((obj) => obj.id == data.deptClerkUserId)
                  ?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.deptClerkUserId)
                    ?.lastNameEn
                : "-"
              : i == 1
              ? userLst &&
                userLst.find((obj) => obj.id == data.asstCommissionerUserId)
                  ?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.asstCommissionerUserId)
                    ?.lastNameEn
                : "-"
              : "";
          a.push({
            id: i + 1,
            remark:
              i == 0
                ? data.deptClerkRemark
                : i == 1
                ? data.asstCommissionerRemark
                : "",
            designation: i == 0 ? "Zonal Clerk" : i == 1 ? "Zonal Officer" : "",
            remarkDate:
              i == 0
                ? moment(data.deptClerkDate).format("DD/MM/YYYY HH:mm")
                : i == 1
                ? moment(data.asstCommissionerDate).format("DD/MM/YYYY HH:mm")
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
                userLst.find((obj) => obj.id == data.deptClerkUserId)
                  ?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.deptClerkUserId)
                    ?.firstNameEn
                : "-"
              : i == 1
              ? userLst &&
                userLst.find((obj) => obj.id == data.deptyCommissionerUserId)
                  ?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.deptyCommissionerUserId)
                    ?.firstNameEn
                : "-"
              : "";
          const lastNameEn =
            i == 0
              ? userLst &&
                userLst.find((obj) => obj.id == data.deptClerkUserId)
                  ?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.deptClerkUserId)
                    ?.lastNameEn
                : "-"
              : i == 1
              ? userLst &&
                userLst.find((obj) => obj.id == data.deptyCommissionerUserId)
                  ?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.deptyCommissionerUserId)
                    ?.lastNameEn
                : "-"
              : "";
          a.push({
            id: i + 1,
            remark:
              i == 0
                ? data.deptClerkRemark
                : i == 1
                ? data.deptyCommissionerRemark
                : "",
            designation: i == 0 ? "Zonal Clerk" : i == 1 ? "HO Clerk" : "",
            remarkDate:
              i == 0
                ? moment(data.deptClerkDate).format("DD/MM/YYYY HH:mm")
                : i == 1
                ? moment(data.deptyCommissionerDate).format("DD/MM/YYYY HH:mm")
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
                userLst.find((obj) => obj.id == data.deptClerkUserId)
                  ?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.deptClerkUserId)
                    ?.firstNameEn
                : "-"
              : "";

          const lastNameEn =
            i == 0
              ? userLst &&
                userLst.find((obj) => obj.id == data.deptClerkUserId)
                  ?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.deptClerkUserId)
                    ?.lastNameEn
                : "-"
              : "";
          a.push({
            id: i + 1,
            remark: i == 0 ? data.deptClerkRemark : "",
            designation: i == 0 ? "Zonal Clerk" : "",
            remarkDate:
              i == 0
                ? moment(data.deptClerkDate).format("DD/MM/YYYY HH:mm")
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
                userLst.find((obj) => obj.id == data.asstCommissionerUserId)
                  ?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.asstCommissionerUserId)
                    ?.firstNameEn
                : "-"
              : userLst &&
                userLst.find((obj) => obj.id == data.deptyCommissionerUserId)
                  ?.firstNameEn
              ? userLst?.find((obj) => obj.id == data.deptyCommissionerUserId)
                  ?.firstNameEn
              : "-";

          const lastNameEn =
            i == 0
              ? userLst &&
                userLst.find((obj) => obj.id == data.asstCommissionerUserId)
                  ?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.asstCommissionerUserId)
                    ?.lastNameEn
                : "-"
              : userLst &&
                userLst.find((obj) => obj.id == data.deptyCommissionerUserId)
                  ?.lastNameEn
              ? userLst?.find((obj) => obj.id == data.deptyCommissionerUserId)
                  ?.lastNameEn
              : "-";
          a.push({
            id: i + 1,
            remark:
              i == 0
                ? data.asstCommissionerRemark
                : i == 1
                ? data.deptyCommissionerRemark
                : "",
            designation: i == 0 ? "Zonal Officer" : "HO Clerk",
            remarkDate:
              i == 0
                ? moment(data.asstCommissionerDate).format("DD/MM/YYYY HH:mm")
                : moment(data.deptyCommissionerDate).format("DD/MM/YYYY HH:mm"),
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
                userLst.find((obj) => obj.id == data.asstCommissionerUserId)
                  ?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.asstCommissionerUserId)
                    ?.firstNameEn
                : "-"
              : "";
          const lastNameEn =
            i == 0
              ? userLst &&
                userLst.find((obj) => obj.id == data.asstCommissionerUserId)
                  ?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.asstCommissionerUserId)
                    ?.lastNameEn
                : "-"
              : "";
          a.push({
            id: i + 1,
            remark: i == 0 ? data.asstCommissionerRemark : "",
            designation: i == 0 ? "Zonal Officer" : "",
            remarkDate:
              i == 0
                ? moment(data.asstCommissionerDate).format("DD/MM/YYYY HH:mm")
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
                userLst.find((obj) => obj.id == data.deptyCommissionerUserId)
                  ?.firstNameEn
                ? userLst?.find((obj) => obj.id == data.deptyCommissionerUserId)
                    ?.firstNameEn
                : "-"
              : "";

          const lastNameEn =
            i == 0
              ? userLst &&
                userLst.find((obj) => obj.id == data.deptyCommissionerUserId)
                  ?.lastNameEn
                ? userLst?.find((obj) => obj.id == data.deptyCommissionerUserId)
                    ?.lastNameEn
                : "-"
              : "";
          a.push({
            id: i + 1,
            remark: i == 0 ? data.deptyCommissionerRemark : "",
            designation: i == 0 ? "HO Clerk" : "",
            remarkDate:
              i == 0
                ? moment(data.deptyCommissionerDate).format("DD/MM/YYYY HH:mm")
                : "",
            userName: firstNameEn + " " + lastNameEn,
          });
        }
      }
      setRemarkData([...a]);
      setValue("cancelReason", data.cancelReason);
      setValue("cancelDate", data.cancelDate);
      setValue("branchName", data.branchName);
      setValue("accountNo", data.accountNo);
      setValue("ifscCode", data.ifscCode);
      setValue("micrCode", data.micrCode);
      setValue("pan_no", data.pan_no);
      setValue("bankAccountFullName", data.bankAccountFullName);
      let res = [];
      if (data.trnBachatgatRegistrationMembersList != []) {
        res =
          data.trnBachatgatRegistrationMembersList &&
          data.trnBachatgatRegistrationMembersList.map((r, i) => {
            return {
              id: i + 1,
              fullName: r.fullName,
              address: r.address,
              designation: r.designation,
              aadharNumber: r.aadharNumber,
            };
          });
      }
      res && setMemberData([...res]);
    }
  };

  // get reg details by id
  // const loadRegistrationDetails = () => {
  //   setIsLoading(true);
  //   axios
  //     .get(`${urls.BSUPURL}/trnBachatgatRegistration/getById?id=${bgRegId}`, {
  //       headers: headers,
  //     })
  //     .then((r) => {
  //       setIsLoading(false);
  //       setRegDetails(r.data);
  //     })
  //     .catch((err) => {
  //       setIsLoading(false);
  //       catchMethod(err);
  //     });
  // };

  // set reg details on ui
  // const setRegistrationDetails = () => {
  //   const data = regDetails;
  //   setValue("branchName", data.branchName);
  //   setValue("accountNo", data.accountNo);
  //   setValue("ifscCode", data.ifscCode);
  //   setValue("micrCode", data.micrCode);
  //   setValue("bankAccountFullName", data.bankAccountFullName);
  //   let res = [];
  //   if (data.trnBachatgatRegistrationMembersList != []) {
  //     res =
  //       data.trnBachatgatRegistrationMembersList &&
  //       data.trnBachatgatRegistrationMembersList.map((r, i) => {
  //         return {
  //           id: i + 1,
  //           fullName: r.fullName,
  //           address: r.address,
  //           designation: r.designation,
  //           aadharNumber: r.aadharNumber,
  //         };
  //       });
  //   }
  //   res && setMemberData([...res]);
  // };

  // set reg no on ui
  useEffect(() => {
    if (router.query.id != null && router.query.id != undefined) {
      loadCancellationById();
    }
  }, [router.query.id]);

  // handle search connections
  const loadCancellationById = () => {
    setIsLoading(true);
    axios
      .get(
        `${urls.BSUPURL}/trnBachatgatCancellation/getById?id=${router.query.id}`,
        {
          headers: headers,
        }
      )
      .then((r) => {
        setIsLoading(false);
        setValuesData(r.data);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  // load zone
  const getZoneName = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, { headers: headers })
      .then((res) => {
        let temp = res.data.zone;
        setZone(temp);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // load ward
  const getWardNames = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, { headers: headers })
      .then((res) => {
        let temp = res.data.ward;
        setWard(temp);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // getAreaName
  const getCRAreaName = () => {
    axios
      .get(`${urls.CfcURLMaster}/area/getAll`, { headers: headers })
      .then((res) => {
        let temp = res.data.area;
        setArea(temp);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // load category
  const getBachatGatCategory = () => {
    axios
      .get(`${urls.BSUPURL}/mstBachatGatCategory/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let temp = res.data.mstBachatGatCategoryList;
        setGatCategory(temp);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // load bank details
  const getBankMasters = () => {
    axios
      .get(`${urls.CFCURL}/master/bank/getAll`, { headers: headers })
      .then((r) => {
        setBankMasters(r.data.bank);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

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
    },
    {
      field: "address",
      headerName: <FormattedLabel id="memFullAdd" />,
      flex: 1,
      align: "center",
      minWidth: 100,
      headerAlign: "center",
    },
    {
      field: "designation",
      headerName: <FormattedLabel id="memDesign" />,
      flex: 1,
      align: "center",
      minWidth: 100,
      headerAlign: "center",
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

  const onSubmitCitizen = () => {
    setIsLoading(true);
    let body = [
      {
        ...valueData,
        cancelReason: watch("cancelReason"),
        cancelDate: watch("cancelDate"),
        isApproved: false,
        isComplete: false,
        isDraft: false,
      },
    ];

    const tempData = axios
      .post(`${urls.BSUPURL}/trnBachatgatCancellation/save`, body, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          sweetAlert(
            language === "en" ? "Saved!" : "जतन केले",
            language === "en"
              ? `Your Application no ${
                  res.data.message.split("[")[1].split("]")[0]
                } Updated succesfully !`
              : `तुमचा अर्ज क्रमांक ${
                  res.data.message.split("[")[1].split("]")[0]
                } यशस्वीरित्या अद्यतनित केले !`,
            "success",
            {
              button: language === "en" ? "Ok" : "ठीक आहे",
              allowOutsideClick: false, // Prevent closing on outside click
              allowEscapeKey: false, // Prevent closing on Esc key
              closeOnClickOutside: false,
            }
          ).then((will) => {
            if (will) {
              router.push({
                pathname: "/BsupNagarvasthi/transaction/bachatGatCancellation",
              });
            }
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  // save cancellation
  const onSubmitForm = (formData) => {
    let body = [
      {
        ...valueData,
        saSanghatakRemark:
          watch("saSanghatakRemark") != null && watch("saSanghatakRemark") != ""
            ? watch("saSanghatakRemark").toString()
            : valueData.saSanghatakRemark == null
            ? watch("saSanghatakRemark")
            : valueData.saSanghatakRemark,
        deptClerkRemark:
          watch("deptClerkRemark") != null && watch("deptClerkRemark") != ""
            ? watch("deptClerkRemark").toString()
            : valueData.deptClerkRemark == null
            ? watch("deptClerkRemark")
            : valueData.deptClerkRemark,
        asstCommissionerRemark:
          watch("asstCommissionerRemark") != null &&
          watch("asstCommissionerRemark") != ""
            ? watch("asstCommissionerRemark").toString()
            : valueData.asstCommissionerRemark == null
            ? watch("asstCommissionerRemark")
            : valueData.asstCommissionerRemark,
        deptyCommissionerRemark:
          watch("deptyCommissionerRemark") != null &&
          watch("deptyCommissionerRemark") != ""
            ? watch("deptyCommissionerRemark").toString()
            : valueData.deptyCommissionerRemark == null
            ? watch("deptyCommissionerRemark")
            : valueData.deptyCommissionerRemark,
        isApproved:
          formData === "Save" ? true : formData === "Revert" ? false : "false",
        isBenifitedPreviously: false,
        isComplete: statusVal == 16 ? true : false,
        isDraft: false,
        rejectReason: rejectReason,
        status: formData === "Reject" ? 22 : statusVal,
      },
    ];
    setIsLoading(true);
    const tempData = axios
      .post(`${urls.BSUPURL}/trnBachatgatCancellation/save`, body, {
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
                  "/BsupNagarvasthi/transaction/bachatGatCancellation"
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

  const columns2 = [
    {
      field: "documentPath",
      headerName: <FormattedLabel id="fileNm" />,
      headerAlign: "center",
      align: "center",
      minWidth: 150,
      renderCell: (record) => {
        let naming = record.value
          ?.substring(record.value.lastIndexOf("__") + 2, record.value.length)
          .split(".")[0];
        return <div>{naming}</div>;
      },
    },
    {
      field: "fileType",
      headerName: <FormattedLabel id="fileType" />,
      headerAlign: "center",
      align: "center",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "Action",
      headerName: <FormattedLabel id="view" />,
      headerAlign: "center",
      align: "center",
      minWidth: 100,
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
              <Visibility />
            </IconButton>
          </div>
        );
      },
    },
  ];

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
          // marginLeft: "10px",
          // marginRight: "10px",
          marginTop: "10px",
          marginBottom: "60px",
          padding: 1,
          "@media (max-width: 770px)": {
            marginTop: "2rem",
          },
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
                <FormattedLabel id="bachatgatCancellation" />
              </h3>
            </Grid>
          </Grid>
        </Box>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          {/* Search registration application no */}
          <Grid container spacing={2} sx={{ padding: "1rem" }}>
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={6}
              xl={6}
              style={{
                // display: "flex",
                // justifyContent: "left",
                // alignItems: "left",
                "@media (max-width: 390px)": {
                  display: "grid",
                },
              }}
            >
              <label
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  // marginLeft: 30,
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
              style={{
                // display: "flex",
                // justifyContent: "left",
                // alignItems: "left",
                "@media (max-width: 390px)": {
                  display: "grid",
                },
              }}
            >
              <label
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  // marginLeft: 30,
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
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="area" />}
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                variant="standard"
                disabled={true}
                {...register("areaName")}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* Zone Name */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <TextField
                id="standard-basic"
                {...register("zoneName")}
                label={<FormattedLabel id="zoneNames" />}
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                variant="standard"
                disabled={true}
                control={control}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* Ward name */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="wardname" />}
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                variant="standard"
                disabled={true}
                {...register("wardname")}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* gisgeo code */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="gisgioCode" />}
                {...register("geoCode")}
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                variant="standard"
                disabled={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* BachatGat FullName */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="bachatgatFullName" />}
                {...register("bachatgatName")}
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                variant="standard"
                disabled={true}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* Bachat Gat category */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <TextField
                id="standard-basic"
                label={<FormattedLabel id="bachatgatCat" />}
                variant="standard"
                // sx={{ width: "90%" }}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                disabled={true}
                {...register("categoryKey")}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* Bachat Gat start date */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={3}
              xl={3}
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              // }}
            >
              <FormControl
                variant="standard"
                // style={{ marginTop: 2 }}
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
                            // sx={{ width: 280 }}
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

            {/* Main gap  Bachat Gat Address*/}
            {/* <Grid container  sx={{ padding: "10px" }}> */}
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
                      <FormattedLabel id="bachatgatAddress" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            {/* </Grid> */}
            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              {/* BachatGat President first Name */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                // style={{
                //   display: "flex",
                //   justifyContent: "center",
                // }}
              >
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="presidentFirstName" />}
                  // sx={{ width: "90%" }}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  variant="standard"
                  disabled={true}
                  {...register("presidentFirstName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* BachatGat President Middle Name */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                // style={{
                //   display: "flex",
                //   justifyContent: "center",
                // }}
              >
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="presidentFatherName" />}
                  // sx={{ width: "90%" }}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  variant="standard"
                  disabled={true}
                  {...register("presidentMiddleName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/*  BachatGat President Surname */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                // style={{
                //   display: "flex",
                //   justifyContent: "center",
                // }}
              >
                <TextField
                  id="standard-basic"
                  // sx={{ width: "90%" }}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="presidentLastName" />}
                  variant="standard"
                  disabled={true}
                  {...register("presidentLastName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Online ApBachat Gat Total Members Count Application No*/}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                // style={{
                //   display: "flex",
                //   justifyContent: "center",
                // }}
              >
                <TextField
                  id="standard-basic"
                  // sx={{ width: "90%" }}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  variant="standard"
                  disabled={true}
                  {...register("totalMembersCount")}
                  label={<FormattedLabel id="totalCount" />}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Flat/BuildingNo */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                // style={{
                //   display: "flex",
                //   justifyContent: "center",
                // }}
              >
                <TextField
                  id="standard-basic"
                  // sx={{ width: "90%" }}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  variant="standard"
                  disabled={true}
                  {...register("flatBuldingNo")}
                  label={<FormattedLabel id="flatBuildNo" />}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Building Name */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                // style={{
                //   display: "flex",
                //   justifyContent: "center",
                // }}
              >
                <TextField
                  id="standard-basic"
                  // sx={{ width: "90%" }}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  disabled={true}
                  {...register("buildingName")}
                  label={<FormattedLabel id="buildingNm" />}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Road Name */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                // style={{
                //   display: "flex",
                //   justifyContent: "center",
                // }}
              >
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="roadName" />}
                  // sx={{ width: "90%" }}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  variant="standard"
                  disabled={true}
                  {...register("roadName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Landmarks */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                // style={{
                //   display: "flex",
                //   justifyContent: "center",
                // }}
              >
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="landmark" />}
                  // sx={{ width: "90%" }}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  variant="standard"
                  {...register("landmark")}
                  disabled={true}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Pin Code */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                // style={{
                //   display: "flex",
                //   justifyContent: "center",
                // }}
              >
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="pincode" />}
                  // sx={{ width: "90%" }}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  variant="standard"
                  disabled={true}
                  {...register("pinCode")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>

            {/* Main gap  Applicant Name Details*/}
            {/* <Grid container spacing={2} sx={{ padding: "1rem" }}> */}
            {/* <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={4}
                xl={4}
                style={{ display: "flex", justifyContent: "center" }}
              ></Grid> */}

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
                      <FormattedLabel id="applicantDetails" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            {/* </Grid> */}

            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              {/* Applicant first name */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                // style={{
                //   display: "flex",
                //   justifyContent: "center",
                // }}
              >
                <TextField
                  // sx={{ width: "90%" }}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="applicantFirstName" />}
                  variant="standard"
                  disabled={true}
                  {...register("applicantFirstName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Middle Name */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                // style={{
                //   display: "flex",
                //   justifyContent: "center",
                // }}
              >
                <TextField
                  // sx={{ width: "90%" }}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="applicantMiddleName" />}
                  variant="standard"
                  disabled={true}
                  {...register("applicantMiddleName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Last Name */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                // style={{
                //   display: "flex",
                //   justifyContent: "center",
                // }}
              >
                <TextField
                  // sx={{ width: "90%" }}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="applicantLastName" />}
                  variant="standard"
                  disabled={true}
                  {...register("applicantLastName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* landline */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                // style={{
                //   display: "flex",
                //   justifyContent: "center",
                // }}
              >
                <TextField
                  // sx={{ width: "90%" }}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="landlineNo" />}
                  variant="standard"
                  disabled={true}
                  {...register("landlineNo")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              {/* Mobile No. */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                // style={{
                //   display: "flex",
                //   justifyContent: "center",
                // }}
              >
                <TextField
                  id="standard-basic"
                  // sx={{ width: "90%" }}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="mobileNo" />}
                  variant="standard"
                  disabled={true}
                  {...register("mobileNo")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Email Id */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                // style={{
                //   display: "flex",
                //   justifyContent: "center",
                // }}
              >
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="emailId" />}
                  variant="standard"
                  // sx={{ width: "90%" }}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  disabled={true}
                  {...register("emailId")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>

            {/* Main gap  Bank Details*/}
            {/* <Grid container sx={{ padding: "10px" }}>
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={4}
                xl={4}
                style={{ display: "flex", justifyContent: "center" }}
              ></Grid> */}

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
                      <FormattedLabel id="bankDetails" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            {/* </Grid> */}
            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              {/* Bank Name */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                // style={{
                //   display: "flex",
                //   justifyContent: "center",
                // }}
              >
                <TextField
                  id="standard-basic"
                  // sx={{ width: "90%" }}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="bankName" />}
                  variant="standard"
                  disabled={true}
                  {...register("bankName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Branch Name */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                // style={{
                //   display: "flex",
                //   justifyContent: "center",
                // }}
              >
                <TextField
                  id="standard-basic"
                  // sx={{ width: "90%" }}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="branchName" />}
                  variant="standard"
                  disabled={true}
                  {...register("branchName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Saving Account No */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                // style={{
                //   display: "flex",
                //   justifyContent: "center",
                // }}
              >
                <TextField
                  id="standard-basic"
                  // sx={{ width: "90%" }}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="accountNo" />}
                  variant="standard"
                  disabled={true}
                  {...register("accountNo")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Saving Account Name */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                // style={{
                //   display: "flex",
                //   justifyContent: "center",
                // }}
              >
                <TextField
                  id="standard-basic"
                  // sx={{ width: "90%" }}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="accountHolderName" />}
                  variant="standard"
                  disabled={true}
                  {...register("bankAccountFullName")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              {/* Bank IFSC Code */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                // style={{
                //   display: "flex",
                //   justifyContent: "center",
                // }}
              >
                <TextField
                  id="standard-basic"
                  // sx={{ width: "90%" }}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="bankIFSC" />}
                  variant="standard"
                  disabled={true}
                  {...register("ifscCode")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Bank MICR Code */}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                // style={{
                //   display: "flex",
                //   justifyContent: "center",
                // }}
              >
                <TextField
                  id="standard-basic"
                  // sx={{ width: "90%" }}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="bankMICR" />}
                  variant="standard"
                  disabled={true}
                  {...register("micrCode")}
                  InputLabelProps={{
                    shrink: true,
                  }}
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
            </Grid>

            {/* Main gap  Member Information*/}
            {/* <Grid container sx={{ padding: "10px" }}>
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={4}
                xl={4}
                style={{ display: "flex", justifyContent: "center" }}
              ></Grid> */}

            <Grid item xs={12}>
              <Box>
                <Grid
                  container
                  className={commonStyles.title}
                  style={{ marginBottom: "1rem" }}
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
                      <FormattedLabel id="memberInfo" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            {/* </Grid> */}
            {/* members show in table */}
            <DataGrid
              // getRowHeight={() => "auto"}
              // autoHeight={true}
              autoHeight
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
                flexDirection: "column",
                overflowX: "scroll",
              }}
              autoWidth
              density="standard"
              rowsPerPageOptions={[5]}
              rows={memberList}
              columns={columns}
            />
            {/* Main gap  Required Documents*/}
            {/* <Grid container sx={{ padding: "10px" }}> */}

            <Grid item xs={12}>
              <Box>
                <Grid
                  container
                  className={commonStyles.title}
                  style={{ marginBottom: "1rem" }}
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
                      <FormattedLabel id="requiredDoc" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            {/* </Grid> */}
            {/* <Grid container sx={{ padding: "10px" }}> */}
            {/* Documents */}
            {/* <Grid
                item
                xs={12}
                sm={12}
                md={12}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              > */}
            <>
              <DataGrid
                getRowHeight={() => "auto"}
                autoHeight={true}
                sx={{
                  overflowY: "scroll",
                  backgroundColor: "white",
                  "& .MuiDataGrid-virtualScrollerContent": {},
                  "& .MuiDataGrid-columnHeadersInner": {
                    backgroundColor: "#556CD6",
                    color: "white",
                  },

                  "& .MuiDataGrid-cell:hover": {
                    color: "primary.main",
                  },
                  "& .mui-style-levciy-MuiTablePagination-displayedRows": {
                    marginTop: "17px",
                  },
                }}
                rows={fetchDocument}
                columns={columns2}
              />
            </>
            {/* </Grid>
            </Grid> */}

            {/* Main gap  Approval*/}
            {/* <Grid container sx={{ padding: "10px" }}> */}

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
                      <FormattedLabel id="cancellationSection" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            {/* </Grid> */}
            <Grid container spacing={2} style={{ padding: "1rem" }}>
              {/* cancel reason */}
              <Grid
                item
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                // sx={{
                //   display: "flex",
                //   justifyContent: "center",
                //   alignItems: "center",
                // }}
              >
                <TextField
                  // style={{ width: "90%" }}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="cancelReason" />}
                  id="standard-basic"
                  variant="standard"
                  disabled={router.query.isEdit == "true" ? false : true}
                  inputProps={{ maxLength: 1000 }}
                  multiline
                  InputLabelProps={{
                    shrink: true,
                  }}
                  {...register("cancelReason")}
                  error={!!errors.reason}
                  helperText={
                    errors?.cancelReason
                      ? "Cancel Reason is Required !!!"
                      : null
                  }
                />
              </Grid>

              {/* cancel date */}
              <Grid
                item
                xl={6}
                lg={6}
                md={6}
                sm={12}
                xs={12}
                // sx={{
                //   display: "flex",
                //   justifyContent: "center",
                //   alignItems: "center",
                // }}
              >
                <FormControl
                  variant="standard"
                  // style={{ marginTop: 10, width: "90%" }}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  error={!!errors.cancelDate}
                >
                  <Controller
                    control={control}
                    // sx={{ width: "90%" }}
                    name="cancelDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          disabled={true}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          variant="standard"
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 16 }}>
                              <FormattedLabel id="cancelDate"></FormattedLabel>
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
                              // sx={{ width: "90%" }}
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {errors?.cancelDate ? errors?.cancelDate.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          {/* Approval section */}
          <Grid container sx={{ padding: "10px" }}></Grid>
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
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "98%" }}
                    id="standard-basic"
                    label={
                      statusVal === 1 ? (
                        <FormattedLabel id="revertedReason" />
                      ) : (
                        <FormattedLabel id="rejectedReason" />
                      )
                    }
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    multiline
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
                {statusVal === 22 && loggedUser === "citizenUser" && (
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
                rowHeight={50}
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

                                  {bachatgatRevertCategories?.map((dept) => (
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
                          InputLabelProps={{
                            shrink: true,
                          }}
                          {...register("deptClerkRemark")}
                          onChange={(e) =>
                            handleRemarkChange(e, "deptClerkRemark")
                          }
                          multiline
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
                          InputLabelProps={{
                            shrink: true,
                          }}
                          multiline
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
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        // style={{
                        //   display: "flex",
                        //   justifyContent: "center",
                        //   padding: 4,
                        // }}
                      >
                        <TextField
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          id="standard-basic"
                          label={
                            <FormattedLabel id="deptyCommissionerRemark" />
                          }
                          variant="standard"
                          disabled={statusVal != 7 ? true : false}
                          inputProps={{ maxLength: 1000 }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          multiline
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
                            label={
                              <FormattedLabel id="deptyCommissionerRemark" />
                            }
                            multiline
                            variant="standard"
                            disabled={true}
                            // disabled={statusVal != 7 ? true : false}
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

            {statusVal == 16 &&
              authority &&
              authority.find((val) => val === bsupUserRoles.roleZonalClerk) && (
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
                    margin: 2,
                  }}
                >
                  <Button
                    onClick={() => {
                      onSubmitForm("Save");
                    }}
                    // disabled={!isRemarksFilled}
                    disabled={serviceId.length > 0 ? false : true}
                    variant="contained"
                    // className={commonStyles.buttonSave}
                    color="success"
                    size="small"
                  >
                    <FormattedLabel id="complete" />
                  </Button>
                </Grid>
              )}

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
                    // className={commonStyles.buttonBack}
                    color="primary"
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
                      // disabled={!isRemarksFilled}
                      disabled={serviceId.length > 0 ? false : true}
                      // className={commonStyles.buttonApprove}
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
                      // disabled={!isRemarksFilled}
                      disabled={serviceId.length > 0 ? false : true}
                      variant="contained"
                      // className={commonStyles.buttonRevert}
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
                            // disabled={!isRemarksFilled}
                            disabled={serviceId.length > 0 ? false : true}
                            // className={commonStyles.buttonReject}
                            variant="contained"
                            color="error"
                            size="small"
                          >
                            <FormattedLabel id="rejectBtn" />
                            {/* Reject */}
                          </Button>
                        </Grid>
                      )}
                    </>
                  )}
              </Grid>
            )}
          </>

          <Divider />
        </form>

        {/* save cancel button button */}
        {router.query.isEdit == "true" && (
          <Grid container sx={{ margin: "10px" }}>
            <Grid
              item
              xs={6}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                sx={{}}
                // type="submit"
                size="small"
                // className={commonStyles.buttonSave}
                variant="contained"
                color="success"
                endIcon={<SaveIcon />}
                onClick={() => onSubmitCitizen()}
              >
                <FormattedLabel id="update" />
              </Button>
            </Grid>
            <Grid
              item
              xs={6}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                size="small"
                variant="contained"
                color="error"
                endIcon={<ClearIcon />}
                // className={commonStyles.buttonExit}
                onClick={() => {
                  router.push(
                    "/BsupNagarvasthi/transaction/bachatGatCancellation"
                  );
                }}
              >
                <FormattedLabel id="exit" />
              </Button>
            </Grid>
          </Grid>
        )}
        {((loggedUser === "citizenUser" && router.query.isEdit != "true") ||
          (statusVal != 2 &&
            statusVal != 23 &&
            authority &&
            authority.find(
              (val) => val === bsupUserRoles.roleSamuhaSanghatak
            )) ||
          (statusVal != 5 &&
            statusVal != 6 &&
            authority &&
            authority.find((val) => val === bsupUserRoles.roleZonalOfficer)) ||
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
              // className={commonStyles.buttonBack}
              size="small"
              onClick={() => backButton()}
            >
              <FormattedLabel id="back" />
            </Button>
          </Grid>
        )}
      </Paper>
    </ThemeProvider>
  );
};

export default BachatGatCategory;
