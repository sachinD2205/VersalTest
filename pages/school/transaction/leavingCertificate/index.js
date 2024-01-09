import { EyeFilled } from "@ant-design/icons";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import { GridToolbar } from "@mui/x-data-grid";

import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PrintIcon from "@mui/icons-material/Print";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import { useReactToPrint } from "react-to-print";
import LeavingCertificateToPrint from "../../../../components/school/LeavingCertificateToPrint";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Divider } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css";

import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { Controller, FormProvider, useForm } from "react-hook-form";
import urls from "../../../../URLS/urls";
import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
import studentLeavingCertificateSchema from "../../../../containers/schema/school/transactions/studentLeavingCertificateSchema";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import Loader from "../../../../containers/Layout/components/Loader";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(studentLeavingCertificateSchema),
    mode: "onChange",
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = methods;
  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   methods,
  //   reset,
  //   watch,
  //   setValue,
  //   formState: { errors },
  // } = useForm({
  //   criteriaMode: "all",
  //   resolver: yupResolver(studentLeavingCertificateSchema),
  //   mode: "onChange",
  // });

  const [loading, setLoading] = useState(false);

  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [buttonInputState, setButtonInputState] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [id, setID] = useState();
  const [studentRollNo, setStudentRollNo] = useState();

  const [schoolList, setSchoolList] = useState([]);
  const [academicYearList, setAcademicYearList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [fetchData, setFetchData] = useState(null);

  const [castNames, setCastNames] = useState([]);
  const [subCastNames, setSubCastNames] = useState([]);

  const [showFile, setShowFile] = useState(true);
  const [printData, setPrintData] = useState();
  const [isReady, setIsReady] = useState("none");

  const schoolId = watch("schoolKey");
  const classId = watch("classKey");
  const academicYearId = watch("academicYearKey");
  const divisionId = watch("divisionKey");
  const studentID = watch("studentKey");

  const [duplicateBtnText, setDuplicateBtnText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

  const [error, setError] = useState("");
  const router = useRouter();

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const [readonlyFields, setReadonlyFields] = useState(false);
  const [rejectApplViewBtn, setRejectApplViewBtn] = useState(false);

  // --------------------Getting logged in authority roles -----------------------

  const [authority, setAuthority] = useState([]);
  let user = useSelector((state) => state.user.user);
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
  const userToken = useGetToken();

  useEffect(() => {
    let auth = user?.menus?.find((r) => {
      if (r.id == selectedMenuFromDrawer) {
        console.log("r.roles", r.roles);
        return r;
      }
    })?.roles;
    console.log("auth0000", auth);
    setAuthority(auth);
  }, []);
  console.log("authority", authority);
  // -------------------------------------------------------------------

  const language = useSelector((state) => state?.labels?.language);

  const [labels, setLabels] = useState(schoolLabels[language ?? "en"]);
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    setLabels(schoolLabels[language ?? "en"]);
  }, [setLabels, language]);

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

  const getSchoolList = () => {
    // axios.get(`${urls.SCHOOL}/mstSchool/getAll`).then((r) => {
    axios
      .get(`${urls.SCHOOL}/mstSchool/getSchoolByUserId?userId=${user?.id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setSchoolList(
          r?.data?.map((row) => ({
            id: row?.id,
            schoolName: row?.schoolName,
            schoolNameMr: row?.schoolNameMr,
            udiceCode: row?.udiceCode,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  const getAcademicYearList = () => {
    axios
      .get(`${urls.SCHOOL}/mstAcademicYear/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setAcademicYearList(
          r.data.mstAcademicYearList.map((row) => ({
            id: row.id,
            academicYear: row.academicYear,
          }))
        );
      })
      .catch((e) => {
        callCatchMethod(e, language);
      });
  };
  useEffect(() => {
    getSchoolList();
    getAcademicYearList();
    getCastNames();
  }, []);

  const getClassList = () => {
    if (schoolId === "" || schoolId === null) {
      setClassList([]);
    } else if (schoolId) {
      axios
        .get(
          `${urls.SCHOOL}/mstClass/getAllClassBySchool?schoolKey=${schoolId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          setClassList(
            r.data.mstClassList.map((row) => ({
              id: row.id,
              className: row.className,
            }))
          );
        })
        .catch((e) => {
          callCatchMethod(e, language);
        });
    }
  };
  useEffect(() => {
    getClassList();
  }, [schoolId]);

  const getDivisionList = () => {
    if (
      schoolId === "" ||
      schoolId === null ||
      classId === "" ||
      classId === null
    ) {
      setDivisionList([]);
    } else if (schoolId && classId) {
      axios
        .get(
          `${urls.SCHOOL}/mstDivision/getAllDivisionByClass?schoolKey=${schoolId}&classKey=${classId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          setDivisionList(
            r.data.mstDivisionList.map((row) => ({
              id: row.id,
              divisionName: row.divisionName,
            }))
          );
        })
        .catch((e) => {
          callCatchMethod(e, language);
        });
    }
  };

  useEffect(() => {
    getDivisionList();
  }, [classId]);

  const getStudentList = () => {
    if (
      schoolId === "" ||
      schoolId === null ||
      academicYearId === "" ||
      academicYearId === null ||
      classId === "" ||
      classId === null ||
      divisionId === "" ||
      divisionId === null
    ) {
      setStudentList([]);
    } else if (schoolId && academicYearId && classId && divisionId) {
      axios
        .get(
          `${urls.SCHOOL}/mstStudent/getAllStudentByDiv?schoolKey=${schoolId}&acYearKey=${academicYearId}&classKey=${classId}&divKey=${divisionId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          setStudentList(
            r.data.mstStudentList.map((row) => ({
              id: row.id,
              studentName: `${row.firstName} ${row.middleName} ${row.lastName}`,
              studentNameMr: `${row.firstNameMr} ${row.middleNameMr} ${row.lastNameMr}`,
            }))
          );
        })
        .catch((e) => {
          callCatchMethod(e, language);
        });
    }
  };
  useEffect(() => {
    getStudentList();
  }, [divisionId]);

  const getStudent = () => {
    if (studentID) {
      axios
        .get(`${urls.SCHOOL}/mstStudent/getById?id=${studentID}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          let _r = r?.data;
          let _res = {
            ..._r,
            udiceCode: schoolList?.find((i) => i?.id == _r?.schoolKey)
              ?.udiceCode,
          };
          setStudentData(_res);
        })
        .catch((e) => {
          callCatchMethod(e, language);
        });
    }
  };
  useEffect(() => {
    getStudent();
  }, [studentID]);
  console.log("studentData", studentData);

  useEffect(() => {
    getStudentInfo();
  }, [studentData]);

  // -------------------------------------------------------------------------------------------------------------
  // getCastNames
  const getCastNames = () => {
    // axios.get(`${urls.BaseURL}/cast/getAll`).then((r) => {
    axios
      .get(`${urls.CFCURL}/castCategory/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setCastNames(
          r?.data?.castCategory?.map((row) => ({
            id: row.id,
            cast: row.castCategory,
            castMr: row.castCategoryMr,
          }))
          // r.data.mCast.map((row) => ({
          //   id: row.id,
          //   cast: row.cast,
          //   castMr: row.castMr,
          // }))
        );
      })
      .catch((e) => {
        callCatchMethod(e, language);
      });
  };

  // get subCastNames
  const getSubCastNames = () => {
    if (watch("casteKey")) {
      // axios.get(`${urls.BaseURL}/subCast/getAll`).then((r) => {
      axios
        .get(
          `${urls.BaseURL}/cast/getCastByCastCategory?casteCategoryId=${watch(
            "casteKey"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          setSubCastNames(
            r.data.mCast.map((row) => ({
              id: row.id,
              subCast: row.cast,
              subCastMr: row.castMr,
            }))
            // r.data.subCast
            // .map((row) => ({
            //   id: row.id,
            //   subCast: row.subCast,
            //   subCastMr: row.subCastMr,

            // }))
          );
        })
        .catch((e) => {
          callCatchMethod(e, language);
        });
    }
  };
  useEffect(() => {
    getSubCastNames();
  }, [watch("casteKey")]);
  // -------------------------------------------------------------------------------------------------------------

  const getStudentInfo = () => {
    console.log("Student", studentData);
    let cast = castNames?.find((i) => i.id == studentData?.casteKey)?.id;
    let subCast = subCastNames?.find(
      (i) => i.id == studentData?.subCastKey
    )?.id;
    setValue("studentFirstName", studentData?.firstName);
    setValue("studentMiddleName", studentData?.middleName);
    setValue("studentLastName", studentData?.lastName);
    setValue("studentAdmissionDate", studentData?.addmissionDate);
    setValue("studentGeneralRegisterNumber", studentData?.grNumber);
    setValue("casteKey", cast);
    setValue("subCastKey", subCast);
    setValue("studentRollNo", studentRollNo);
    setValue("studentAddress", studentData?.parentAddress);
    setValue("studentMobileNumber", studentData?.contactDetails);
    setValue("studentDateOfBirth", studentData?.dateOfBirth);
    setValue("studentEmailId", studentData?.studentEmailId);
  };
  useEffect(() => {
    getLeavingCertificateMaster();
  }, [fetchData]);

  // useEffect(() => {
  //   if (printData?.isDuplicate == true && studentData && rejectApplViewBtn == false) {
  //     handlePrint();
  //   }
  // }, [printData, studentData]);

  // Get Table - Data
  const getLeavingCertificateMaster = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setLoading(true);
    axios
      // .get(`${urls.SCHOOL}/trnLeavingCertificate/getAll`, {
      .get(
        `${urls.SCHOOL}/trnLeavingCertificate/getAllUserId?userId=${user?.id}`,
        {
          params: {
            pageSize: _pageSize,
            pageNo: _pageNo,
            sortBy: _sortBy,
            sortDir: _sortDir,
          },
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((r) => {
        let result = r?.data?.trnLeavingCertificateList;
        let page = r?.data?.pageSize * r?.data?.pageNo;
        console.log("trnLeavingCertificateList", result);

        let _res = result?.map((r, i) => {
          return {
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1 + page,
            isDuplicate: r.isDuplicate,
            isFirstDuplicate: r.isFirstDuplicate,

            schoolName: r.schoolName,
            schoolNameMr: r.schoolNameMr,
            // schoolNameMr: schoolList?.find((item) => item?.id === r?.schoolKey)?.schoolNameMr,
            schoolKey: r.schoolKey,

            academicYear: r.academicYearName,
            academicYearKey: r.academicYearKey,

            classKey: r.classKey,
            className: r.className,

            divisionKey: r.divisionKey,
            divisionName: r.divisionName,

            studentKey: r.studentId,
            casteKey: r.casteKey,
            // casteName:  castNames?.find((i) => i.id == r?.casteKey)?.cast,
            subCastKey: r.subCastKey,
            // studentName: r.studentFirstName,

            Status:
              r.applicationStatus == "REJECTED_BY_PRINCIPAL"
                ? "reject"
                : "approve",
            principalRemarksEn: r.principalRemarksEn,
            principalRemarksMr: r.principalRemarksMr,

            studentGeneralRegisterNumber: r.studentGeneralRegisterNumber,
            studentName: `${r.studentFirstName} ${r.studentMiddleName} ${r.studentLastName}`,
            studentMotherName: r.studentMotherName,
            studentDateOfBirth: r.studentDateOfBirth,
            studentPlaceOfBirth: r.studentPlaceOfBirth,
            lastSchoolName: r.lastSchoolName,
            dateOfAdmission: r.dateOfAdmission,
            studentBehaviour: r.studentBehaviour,
            schoolLeavingDate: r.schoolLeavingDate,
            lastClassAndFrom: r.lastClassAndFrom,
            remark: r.remark,
            applicationStatus: r.applicationStatus,

            studentMobileNumber: r.studentMobileNumber,
            emailID: r.studentEmailId,
            rollNumber: r.studentRollNo,
            reasonForLeavingSchoolMr: r.reasonForLeavingSchoolMr,
            leavingReason: r.leavingReason,

            studentNameMr: `${r.firstNameMr} ${r.middleNameMr} ${r.lastNameMr}`,
          };
        });
        console.log("Result", _res);
        setDataSource([..._res]);
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        callCatchMethod(e, language);
        // sweetAlert(
        //   "Error",
        //   e?.message ? e?.message : "Something Went Wrong",
        //   "error"
        // );
        console.log("Eroor", e);
      });
  };

  const handleDuplicate = (data) => {
    // console.log("data", data);
    // console.log("id", id);
    if (duplicateBtnText == "original") {
      let _res = {
        id: id,
        isDuplicate: data,
      };
      setLoading(true);
      // console.log("duplicateBtnTextO", duplicateBtnText);
      // console.log("_resO", _res);
      axios
        .post(`${urls.SCHOOL}/trnLeavingCertificate/updateStatus`, _res, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setLoading(false);
          console.log("res", res);
          if (res.status == 201 || res.status == 200) {
            sweetAlert({
              title: language === "en" ? "Saved !" : "जतन केले !",
              text:
                language === "en"
                  ? "Recorded successfully !"
                  : "यशस्वीरित्या रेकॉर्ड केले!",
              icon: "success",
            });
            // sweetAlert("Success!", "Recorded successfully !", "success");
            getLeavingCertificateMaster();
            // setButtonInputState(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
            setShowFile(true);
            handlePrint();
          }
        })
        .catch((e) => {
          setLoading(false);
          callCatchMethod(e, language);
          // sweetAlert(
          //   "Error",
          //   e?.message ? e?.message : "Something Went Wrong",
          //   "error"
          // );
          // console.log("Eroor", e);
        });

      setIsOpen(false);
      setDuplicateBtnText("");
    } else if (duplicateBtnText == "duplicate") {
      let _res = {
        id: id,
        isFirstDuplicate: data,
      };
      // console.log("duplicateBtnTextD", duplicateBtnText);
      // console.log("_resD", _res);
      setLoading(true);
      axios
        .post(`${urls.SCHOOL}/trnLeavingCertificate/updateStatus`, _res, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setLoading(false);
          console.log("res", res);
          if (res.status == 201 || res.status == 200) {
            sweetAlert({
              title: language === "en" ? "Saved !" : "जतन केले !",
              text:
                language === "en"
                  ? "Recorded successfully !"
                  : "यशस्वीरित्या रेकॉर्ड केले!",
              icon: "success",
            });
            // sweetAlert("Success!", "Recorded successfully !", "success");
            getLeavingCertificateMaster();
            // setButtonInputState(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
            setShowFile(true);
            handlePrint();
          }
        })
        .catch((e) => {
          setLoading(false);
          callCatchMethod(e, language);
          // sweetAlert(
          //   "Error",
          //   e?.message ? e?.message : "Something Went Wrong",
          //   "error"
          // );
          // console.log("Eroor", e);
        });

      setIsOpen(false);
      setDuplicateBtnText("");
    }
  };

  const onSubmitForm = (formData) => {
    console.log("formData", formData);
    // Save - DB
    let _body = {
      activeFlag: formData.activeFlag,
      // ...formData,
      academicYearKey: academicYearId,
      academicYearName: academicYearList?.find(
        (item) => item?.id === academicYearId
      )?.academicYear,
      schoolKey: schoolId,
      schoolName: schoolList?.find((item) => item?.id === schoolId)?.schoolName,
      schoolNameMr: schoolList?.find((item) => item?.id === schoolId)
        ?.schoolNameMr,
      classKey: classId,
      className: classList?.find((item) => item?.id === classId)?.className,
      divisionKey: divisionId,
      divisionName: divisionList?.find((item) => item?.id === divisionId)
        ?.divisionName,
      studentId: studentID,
      studentFirstName: formData.studentFirstName,
      firstNameMr: studentData?.firstNameMr,
      middleNameMr: studentData?.middleNameMr,
      lastNameMr: studentData?.lastNameMr,
      studentMiddleName: formData.studentMiddleName,
      studentLastName: formData.studentLastName,
      studentGeneralRegisterNumber: formData.studentGeneralRegisterNumber,
      studentAddress: formData.studentAddress,
      studentMobileNumber: formData.studentMobileNumber,
      studentEmailId: formData.studentEmailId,
      studentDateOfBirth: formData.studentDateOfBirth,
      studentRollNo: formData.studentRollNo,
      casteKey: formData.casteKey,
      subCastKey: formData.subCastKey,
      remark: formData.remark,
      studentAdmissionDate: formData.studentAdmissionDate,
      leavingReason: formData.leavingReason,
      reasonForLeavingSchoolMr: formData.reasonForLeavingSchoolMr,
    };
    if (btnSaveText === "Save") {
      console.log("Bodyy", _body);
      setLoading(true);
      const tempData = axios
        .post(`${urls.SCHOOL}/trnLeavingCertificate/save`, _body, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setLoading(false);
          if (res.status == 201 || res.status == 200) {
            sweetAlert({
              title: language === "en" ? "Saved !" : "जतन केले !",
              text:
                language === "en"
                  ? "Record Saved successfully !"
                  : "रेकॉर्ड यशस्वीरित्या जतन केले !",
              icon: "success",
            });
            // sweetAlert("Saved!", "Record Saved successfully !", "success");
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setShowFile(true);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        })
        .catch((e) => {
          setLoading(false);
          callCatchMethod(e, language);
          // sweetAlert(
          //   "Error",
          //   e?.message ? e?.message : "Something Went Wrong",
          //   "error"
          // );
          console.log("Eroor", e);
        });
    }
    // StatusByPrincipal
    else if (btnSaveText === "StatusByPrincipal") {
      let _isApproved = watch("Status");
      // console.log("_body", _body);
      let _res = {
        // ..._body,
        id,
        isApproved:
          _isApproved == "approve"
            ? true
            : _isApproved == "reject"
            ? false
            : "",
        principalRemarksEn: formData?.principalRemarksEn,
        principalRemarksMr: formData?.principalRemarksMr,
      };
      // console.log("_isApproved", _isApproved);
      // console.log("_res", _res);
      setLoading(true);
      axios
        .post(`${urls.SCHOOL}/trnLeavingCertificate/updateStatus`, _res, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setLoading(false);
          console.log("res", res);
          if (res.status == 201 || res.status == 200) {
            _isApproved == "approve"
              ? sweetAlert({
                  title: language === "en" ? "Approved ! " : "मंजूर !",
                  text:
                    language === "en"
                      ? "Application Approved successfully !"
                      : "अर्ज यशस्वीरित्या मंजूर झाला !",
                  icon: "success",
                })
              : sweetAlert({
                  title: language === "en" ? "Rejected ! " : "नाकारले !",
                  text:
                    language === "en"
                      ? "Application Sent Back to the Clerk successfully !"
                      : "अर्ज यशस्वीरित्या लिपिकाकडे परत पाठवला! !",
                  icon: "success",
                });
            getLeavingCertificateMaster();
            // setButtonInputState(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
            setShowFile(true);
          }
        })
        .catch((e) => {
          setLoading(false);
          callCatchMethod(e, language);
          // sweetAlert(
          //   "Error",
          //   e?.message ? e?.message : "Something Went Wrong",
          //   "error"
          // );
          console.log("Eroor", e);
        });
    }
  };

  // Delete By ID
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
            .post(`${urls.SCHOOL}/trnLeavingCertificate/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getLeavingCertificateMaster();
                // setButtonInputState(false);
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
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
            .post(`${urls.SCHOOL}/trnLeavingCertificate/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Activated!", {
                  icon: "success",
                });
                // getPaymentRate();
                getLeavingCertificateMaster();
                // setButtonInputState(false);
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setShowFile(true);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
    setStudentRollNo();
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
    setStudentRollNo();
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    schoolName: "",
    schoolKey: "",
    className: "",
    divisionName: "",
    studentName: "",
    studentPlaceOfBirth: "",
    remark: "",
    reasonForLeavingSchoolMr: "",
    leavingReason: "",
    studentAddress: "",
    studentAdmissionDate: null,
    studentDateOfBirth: null,
    studentEmailId: "",
    studentFirstName: "",
    studentGeneralRegisterNumber: "",
    studentLastName: "",
    studentMiddleName: "",
    studentMobileNumber: "",
    studentRollNo: "",
    casteName: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    id: null,
    schoolName: "",
    schoolKey: "",
    className: "",
    divisionName: "",
    studentPlaceOfBirth: "",
    remark: "",
    leavingReason: "",
    reasonForLeavingSchoolMr: "",
    studentAddress: "",
    studentAdmissionDate: "",
    studentDateOfBirth: "",
    studentEmailId: "",
    studentFirstName: "",
    studentGeneralRegisterNumber: "",
    studentLastName: "",
    studentMiddleName: "",
    studentMobileNumber: "",
    studentRollNo: "",
    casteName: "",
  };

  const componentRef = useRef(null);

  console.log("componentRef", componentRef);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });

  const columns = [
    {
      field: "srNo",
      headerName: labels.srNo,
      flex: 1,
    },
    {
      field: language == "en" ? "schoolName" : "schoolNameMr",
      headerName: labels.schoolName,
      flex: 1,
    },
    {
      field: language == "en" ? "studentName" : "studentNameMr",
      headerName: labels.studentName,
      flex: 1,
    },
    {
      field: "studentMobileNumber",
      headerName: labels.mobileNumber,
      flex: 1,
    },
    {
      field: "emailID",
      headerName: labels.emailId,
      flex: 1,
    },
    {
      field: "rollNumber",
      headerName: labels.rollNumber,
      flex: 1,
    },
    {
      field: "applicationStatus",
      headerName: labels.status,
      flex: 1,
    },

    {
      field: "Actions",
      headerName: labels.actions,
      width: 250,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        let status = params.row.applicationStatus;
        return (
          <Box>
            {/* print */}
            {authority?.includes("ENTRY") &&
              status == "APPROVED_BY_PRINCIPAL" && (
                <>
                  {/* {params?.row?.isDuplicate === false && ( */}
                  <Button
                    variant="contained"
                    size="small"
                    disabled={params?.row?.isDuplicate}
                    onClick={() => {
                      setDuplicateBtnText("original");
                      setPrintData(params.row);
                      setValue("studentKey", params.row?.studentKey);
                      setIsReady("none");
                      setID(params.row.id);
                      handleOpen();
                      console.log("printData", printData);
                      console.log("paramsRow", params.row);
                    }}
                    color="primary"
                    // name="Approve"
                    endIcon={<PrintIcon />}
                  >
                    Original
                  </Button>
                  {/* )} */}
                  {/* {params?.row?.isDuplicate === true && ( */}
                  <Button
                    variant="contained"
                    size="small"
                    disabled={
                      params?.row?.isDuplicate === false
                        ? true
                        : params?.row?.isFirstDuplicate === true
                        ? true
                        : false
                    }
                    onClick={() => {
                      setDuplicateBtnText("duplicate");
                      setPrintData(params.row);
                      setValue("studentKey", params.row?.studentKey);
                      setIsReady("none");
                      handleOpen();
                      setID(params.row.id);
                    }}
                    color="primary"
                    // name="Approve"
                    endIcon={<PrintIcon />}
                  >
                    Duplicate
                  </Button>
                  {/* )} */}
                </>
              )}
            {/* approve button */}
            {authority?.includes("APPROVAL") && status == "REQUEST_CREATED" && (
              <IconButton>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  endIcon={<CheckIcon />}
                  onClick={() => {
                    setBtnSaveText("StatusByPrincipal"),
                      setID(params.row.id),
                      setStudentRollNo(params.row.rollNumber),
                      setIsOpenCollapse(true),
                      setShowFile(false);
                    setSlideChecked(true);
                    setButtonInputState(true);
                    console.log("params.row: ", params.row);
                    reset(params.row);
                    setReadonlyFields(true);
                  }}
                >
                  {labels.approve}
                </Button>
              </IconButton>
            )}
            {(authority?.includes("ADMIN_OFFICER") ||
              authority?.includes("ENTRY")) &&
              status == "REJECTED_BY_PRINCIPAL" && (
                <IconButton>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    startIcon={<EyeFilled />}
                    onClick={() => {
                      setRejectApplViewBtn(true),
                        setStudentRollNo(params.row.rollNumber),
                        setID(params.row.id),
                        setIsOpenCollapse(true),
                        setSlideChecked(true);
                      setShowFile(false);
                      setButtonInputState(true);
                      console.log("params.row: ", params.row);
                      reset(params.row);
                      setReadonlyFields(true);
                    }}
                  >
                    {labels.view}
                  </Button>
                </IconButton>
              )}
          </Box>
        );
      },
    },
  ];

  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginLeft: "10px",
          marginRight: "10px",
          padding: 1,
          paddingBottom: "30px",
        }}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            // backgroundColor:'#0E4C92'
            // backgroundColor:'		#0F52BA'
            // backgroundColor:'		#0F52BA'
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>{labels.schoolLeavingCert}</h2>
        </Box>
        <Paper style={{ display: isReady }}>
          {printData && (
            <LeavingCertificateToPrint
              ref={componentRef}
              data={printData}
              studentData={studentData}
              language={language}
            />
          )}
        </Paper>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginLeft: 5,
            marginRight: 5,
            // marginTop: 2,
            // marginBottom: 3,
            padding: 2,
            // border:1,
            // borderColor:'grey.500'
          }}
        >
          <Box p={1}>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                {isOpenCollapse && (
                  <Slide
                    direction="down"
                    in={slideChecked}
                    mountOnEnter
                    unmountOnExit
                  >
                    <Grid container sx={{ padding: "10px" }}>
                      {/* Select School */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl sx={{ width: 230 }}>
                          <InputLabel required error={!!errors.schoolKey}>
                            {labels.selectSchool}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="schoolKey"
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                disabled={readonlyFields}
                                // readOnly={readonlyFields}
                                variant="standard"
                                {...field}
                                error={!!errors.schoolKey}
                              >
                                {schoolList &&
                                  schoolList.map((school) => (
                                    <MenuItem key={school.id} value={school.id}>
                                      {language == "en"
                                        ? school?.schoolName
                                        : school?.schoolNameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText error={!!errors.schoolKey}>
                            {errors?.schoolKey ? labels.schoolRequired : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/* Select AY */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl sx={{ width: 230 }}>
                          <InputLabel required error={!!errors.academicYearKey}>
                            {labels.selectAcademicYear}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="academicYearKey"
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                // readOnly={readonlyFields}
                                disabled={readonlyFields}
                                variant="standard"
                                {...field}
                                error={!!errors.academicYearKey}
                              >
                                {academicYearList &&
                                  academicYearList.map((AY, index) => (
                                    <MenuItem key={index} value={AY.id}>
                                      {AY.academicYear}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText error={!!errors.academicYearKey}>
                            {errors?.academicYearKey
                              ? labels.academicYearRequired
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* Select Class */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl sx={{ width: 230 }}>
                          <InputLabel required error={!!errors.classKey}>
                            {labels.selectClass}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="classKey"
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                // readOnly={readonlyFields}
                                disabled={readonlyFields}
                                variant="standard"
                                {...field}
                                error={!!errors.classKey}
                              >
                                {classList &&
                                  classList.map((school, index) => (
                                    <MenuItem key={index} value={school.id}>
                                      {school.className}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText error={!!errors.classKey}>
                            {errors?.classKey ? labels.classRequired : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* Select Div */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl sx={{ width: 230 }}>
                          <InputLabel required error={!!errors.divisionKey}>
                            {labels.selectDivision}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="divisionKey"
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                // readOnly={readonlyFields}
                                disabled={readonlyFields}
                                variant="standard"
                                {...field}
                                error={!!errors.divisionKey}
                              >
                                {divisionList &&
                                  divisionList.map((div, index) => (
                                    <MenuItem key={index} value={div.id}>
                                      {div.divisionName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText error={!!errors.divisionKey}>
                            {errors?.divisionKey
                              ? labels.divisionRequired
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* Select Student */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl sx={{ width: 230 }}>
                          <InputLabel required error={!!errors.studentKey}>
                            {labels.selectStudent}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="studentKey"
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                // readOnly={readonlyFields}
                                disabled={readonlyFields}
                                variant="standard"
                                {...field}
                                error={!!errors.studentKey}
                              >
                                {studentList &&
                                  studentList.map((student) => (
                                    <MenuItem
                                      key={student.id}
                                      value={student.id}
                                    >
                                      {/* {student.studentName} */}
                                      {language == "en"
                                        ? student?.studentName
                                        : student?.studentNameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText error={!!errors.studentKey}>
                            {errors?.studentKey ? labels.studentReq : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Divider />

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={labels.firstName}
                          disabled={readonlyFields}
                          {...register("studentFirstName")}
                          error={!!errors.studentFirstName}
                          sx={{ width: 230 }}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink: watch("studentFirstName") ? true : false,
                          }}
                          helperText={
                            errors?.studentFirstName
                              ? errors.studentFirstName.message
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
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={labels.middleName}
                          disabled={readonlyFields}
                          {...register("studentMiddleName")}
                          error={!!errors.studentMiddleName}
                          sx={{ width: 230 }}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink: watch("studentMiddleName") ? true : false,
                          }}
                          helperText={
                            errors?.studentMiddleName
                              ? errors.studentMiddleName.message
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
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={labels.surnameName}
                          disabled={readonlyFields}
                          {...register("studentLastName")}
                          error={!!errors.studentLastName}
                          sx={{ width: 230 }}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink: watch("studentLastName") ? true : false,
                          }}
                          helperText={
                            errors?.studentLastName
                              ? errors.studentLastName.message
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
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Controller
                          control={control}
                          name="studentAdmissionDate"
                          defaultValue=""
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                disabled={readonlyFields}
                                renderInput={(props) => (
                                  <TextField
                                    {...props}
                                    // disabled= {readonlyFields}
                                    variant="standard"
                                    fullWidth
                                    sx={{ width: 230 }}
                                    size="small"
                                    error={errors.studentAdmissionDate}
                                    helperText={
                                      errors.studentAdmissionDate
                                        ? errors.studentAdmissionDate.message
                                        : null
                                    }
                                  />
                                )}
                                label={labels.admissionDate}
                                value={field.value}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("DD/MM/YYYY")
                                  )
                                }
                              />
                            </LocalizationProvider>
                          )}
                        />
                      </Grid>
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={labels.studentGeneralRegisterNumber}
                          // value={StudRegNo}
                          disabled={readonlyFields}
                          {...register("studentGeneralRegisterNumber")}
                          error={!!errors.studentGeneralRegisterNumber}
                          sx={{ width: 230 }}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink: watch("studentGeneralRegisterNumber")
                              ? true
                              : false,
                          }}
                          helperText={
                            errors?.studentGeneralRegisterNumber
                              ? errors.studentGeneralRegisterNumber.message
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
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={`${labels.rollNumber} *`}
                          disabled={readonlyFields}
                          {...register("studentRollNo")}
                          error={!!errors.studentRollNo}
                          sx={{ width: 230 }}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink: watch("studentRollNo") ? true : false,
                          }}
                          helperText={
                            errors?.studentRollNo
                              ? labels.studentRollNoReq
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
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={labels.address}
                          disabled={readonlyFields}
                          {...register("studentAddress")}
                          error={!!errors.studentAddress}
                          sx={{ width: 230 }}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink: watch("studentAddress") ? true : false,
                          }}
                          helperText={
                            errors?.studentAddress
                              ? errors.studentAddress.message
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
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={labels.mobileNumber}
                          disabled={readonlyFields}
                          {...register("studentMobileNumber")}
                          error={!!errors.studentMobileNumber}
                          sx={{ width: 230 }}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink: watch("studentMobileNumber") ? true : false,
                          }}
                          helperText={
                            errors?.studentMobileNumber
                              ? errors.studentMobileNumber.message
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
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={labels.emailId}
                          disabled={readonlyFields}
                          {...register("studentEmailId")}
                          error={!!errors.studentEmailId}
                          sx={{ width: 230 }}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink: watch("studentEmailId") ? true : false,
                          }}
                          helperText={
                            errors?.studentEmailId
                              ? errors.studentEmailId.message
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
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Controller
                          control={control}
                          name="studentDateOfBirth"
                          defaultValue=""
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                disabled={readonlyFields}
                                renderInput={(props) => (
                                  <TextField
                                    {...props}
                                    variant="standard"
                                    fullWidth
                                    sx={{ width: 230 }}
                                    size="small"
                                    error={errors.studentDateOfBirth}
                                    helperText={
                                      errors.studentDateOfBirth
                                        ? errors.studentDateOfBirth.message
                                        : null
                                    }
                                  />
                                )}
                                label={labels.dateOfbirth}
                                value={field.value}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("DD/MM/YYYY")
                                  )
                                }
                              />
                            </LocalizationProvider>
                          )}
                        />
                      </Grid>
                      {/* Cast Name */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl sx={{ width: 230 }}>
                          <InputLabel required error={!!errors.casteKey}>
                            {labels.casteName}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="casteKey"
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                // readOnly={readonlyFields}
                                disabled={readonlyFields}
                                variant="standard"
                                {...field}
                                error={!!errors.casteKey}
                              >
                                {castNames &&
                                  castNames.map((cast, index) => (
                                    <MenuItem key={index} value={cast.id}>
                                      {/* {language == "en" ? cast?.cast : cast?.castMr} */}
                                      {cast?.cast}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText>
                            {errors?.casteKey ? errors.casteKey.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/* subCast Name */}
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl sx={{ width: 230 }}>
                          <InputLabel required error={!!errors.subCastKey}>
                            {labels.subCastName}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="subCastKey"
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                // readOnly={readonlyFields}
                                disabled={readonlyFields}
                                variant="standard"
                                {...field}
                                // error={!!errors.subCastKey}
                              >
                                {subCastNames &&
                                  subCastNames.map((subCast, index) => (
                                    <MenuItem key={index} value={subCast.id}>
                                      {subCast?.subCast}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          {/* <FormHelperText>
                          {errors?.subCastKey ? errors.subCastKey.message : null}
                        </FormHelperText> */}
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={`${labels.reasonForLeavingSchoolEn} *`}
                          // value={birthPlace}
                          disabled={readonlyFields}
                          {...register("leavingReason")}
                          error={!!errors.leavingReason}
                          sx={{ width: 230 }}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink: watch("leavingReason") ? true : false,
                          }}
                          helperText={
                            errors?.leavingReason
                              ? labels.reasonForLeavingSchoolEnReq
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
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={`${labels.reasonForLeavingSchoolMr} *`}
                          // value={birthPlace}
                          disabled={readonlyFields}
                          {...register("reasonForLeavingSchoolMr")}
                          error={!!errors.reasonForLeavingSchoolMr}
                          sx={{ width: 230 }}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink: watch("reasonForLeavingSchoolMr")
                              ? true
                              : false,
                          }}
                          helperText={
                            errors?.reasonForLeavingSchoolMr
                              ? labels.reasonForLeavingSchoolMrReq
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
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          label={labels.remark}
                          // value={birthPlace}
                          disabled={readonlyFields}
                          {...register("remark")}
                          error={!!errors.remark}
                          sx={{ width: 230 }}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink:
                              (watch("remark") ? true : false) ||
                              (router.query.remark ? true : false),
                          }}
                          // helperText={
                          //     errors?.remark ? errors.remark.message : null
                          // }
                        />
                      </Grid>
                      <Divider />
                      {/* buttons */}
                      {authority?.includes("APPROVAL") || rejectApplViewBtn ? (
                        <>
                          <Grid
                            item
                            xl={12}
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                            p={1}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Controller
                              control={control}
                              name="approveLCDate"
                              defaultValue={new Date().toISOString()}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    disabled={rejectApplViewBtn}
                                    renderInput={(props) => (
                                      <TextField
                                        {...props}
                                        variant="standard"
                                        fullWidth
                                        required
                                        sx={{ width: 230 }}
                                        size="small"
                                        error={errors.approveLCDate}
                                        helperText={
                                          errors.approveLCDate
                                            ? errors.approveLCDate.message
                                            : null
                                        }
                                      />
                                    )}
                                    label={labels.approveLCDate}
                                    value={field.value}
                                    onChange={(date) =>
                                      field.onChange(
                                        moment(date).format("DD/MM/YYYY")
                                      )
                                    }
                                  />
                                </LocalizationProvider>
                              )}
                            />
                          </Grid>
                          <Divider />
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
                              variant="outlined"
                              // variant="standard"
                              size="small"
                              // sx={{ m: 1, minWidth: 120 }}
                            >
                              <InputLabel
                                id="demo-simple-select-standard-label"
                                required
                              >
                                {labels.status}
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    // required
                                    disabled={rejectApplViewBtn}
                                    label={labels.status}
                                    sx={{ width: 300 }}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                  >
                                    <MenuItem value="approve">
                                      {labels.approve}
                                    </MenuItem>
                                    <MenuItem value="reject">
                                      {labels.reject}
                                    </MenuItem>
                                  </Select>
                                )}
                                name="Status"
                                control={control}
                                defaultValue=""
                              />
                            </FormControl>
                          </Grid>

                          {/* principalRemarksEn */}
                          <Grid
                            item
                            xl={6}
                            lg={6}
                            md={6}
                            sm={6}
                            xs={12}
                            p={1}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Grid sx={{ width: 230 }}>
                              <Transliteration
                                _key={"principalRemarksEn"}
                                label={labels.principalRemarksEn}
                                fieldName={"principalRemarksEn"}
                                updateFieldName={"principalRemarksMr"}
                                sourceLang={"eng"}
                                targetLang={"mar"}
                                disabled={rejectApplViewBtn}
                                // error={!!errors.studentFirstName}
                                InputLabelProps={{
                                  style: { fontSize: 15 },
                                  shrink: watch("principalRemarksEn")
                                    ? true
                                    : false,
                                }}
                                // targetError={"firstNameMr"}
                                // helperText={
                                //   errors?.studentFirstName
                                //     ? labels.studentFirstNameReq
                                //     : null
                                // }
                              />
                            </Grid>

                            {/* <TextField
                            id="standard-basic"
                            variant="standard"
                            required
                            label={labels.principalRemarksEn}
                            {...register("principalRemarksEn")}
                            // error={!!errors.principalRemarksEn}
                            sx={{ width: 230 }}
                            disabled={rejectApplViewBtn}
                            InputProps={{
                              style: { fontSize: 18 },
                              // readOnly: readonlyFields
                            }}
                            InputLabelProps={{ style: { fontSize: 15 } }}
                          // helperText={errors?.bankAdderess ? errors.bankAdderess.message : null}
                          /> */}
                          </Grid>
                          {/* principalRemarksMr */}
                          <Grid
                            item
                            xl={6}
                            lg={6}
                            md={6}
                            sm={6}
                            xs={12}
                            p={1}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Grid sx={{ width: 230 }}>
                              <Transliteration
                                _key={"principalRemarksMr"}
                                label={labels.principalRemarksMr}
                                fieldName={"principalRemarksMr"}
                                updateFieldName={"principalRemarksEn"}
                                sourceLang={"mar"}
                                targetLang={"eng"}
                                disabled={rejectApplViewBtn}
                                // error={!!errors.studentFirstName}
                                InputLabelProps={{
                                  style: { fontSize: 15 },
                                  shrink: watch("principalRemarksMr")
                                    ? true
                                    : false,
                                }}
                                // targetError={"firstNameMr"}
                                // helperText={
                                //   errors?.studentFirstName
                                //     ? labels.studentFirstNameReq
                                //     : null
                                // }
                              />
                            </Grid>

                            {/* <TextField
                            id="standard-basic"
                            variant="standard"
                            required
                            label={labels.principalRemarksMr}
                            {...register("principalRemarksMr")}
                            // error={!!errors.principalRemarksEn}
                            sx={{ width: 230 }}
                            disabled={rejectApplViewBtn}
                            InputProps={{
                              style: { fontSize: 18 },
                              // readOnly: readonlyFields
                            }}
                            InputLabelProps={{ style: { fontSize: 15 } }}
                          // helperText={errors?.bankAdderess ? errors.bankAdderess.message : null}
                          /> */}
                          </Grid>

                          <Grid
                            container
                            spacing={5}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              paddingTop: "10px",
                              marginTop: "20px",
                            }}
                          >
                            <Grid item>
                              <Button
                                type="submit"
                                disabled={rejectApplViewBtn}
                                sx={{ marginRight: 8 }}
                                variant="contained"
                                color="primary"
                                endIcon={<SaveIcon />}
                                // onClick={() => alert("Hello")}
                              >
                                {labels.save}
                              </Button>
                            </Grid>
                            <Grid item>
                              <Button
                                variant="contained"
                                color="primary"
                                endIcon={<ExitToAppIcon />}
                                onClick={() => {
                                  exitButton();
                                  setRejectApplViewBtn(false);
                                }}
                              >
                                {labels.exit}
                              </Button>
                            </Grid>
                          </Grid>
                        </>
                      ) : (
                        <Grid
                          container
                          spacing={5}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            paddingTop: "10px",
                            marginTop: "20px",
                          }}
                        >
                          <Grid item>
                            <Button
                              sx={{ marginRight: 8 }}
                              disabled={rejectApplViewBtn}
                              type="submit"
                              variant="contained"
                              color="primary"
                              endIcon={<SaveIcon />}
                            >
                              {labels.save}
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              sx={{ marginRight: 8 }}
                              disabled={rejectApplViewBtn}
                              variant="contained"
                              color="primary"
                              endIcon={<ClearIcon />}
                              onClick={() => cancellButton()}
                            >
                              {labels.clear}
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              variant="contained"
                              color="primary"
                              endIcon={<ExitToAppIcon />}
                              onClick={() => {
                                exitButton();
                                setRejectApplViewBtn(false);
                              }}
                            >
                              {labels.exit}
                            </Button>
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                  </Slide>
                )}
              </form>
            </FormProvider>
            {/** Modal */}
            <Modal
              open={isOpen}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <form>
                <Box sx={modalStyle}>
                  <Box sx={{ padding: "10px" }}>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      {/* Do you want to Print{" "}
                      {duplicateBtnText == "original"
                        ? "Original"
                        : "Duplicate"}{" "}
                      Leaving Certificate */}
                      {language === "en"
                        ? `Are you sure to print ${
                            duplicateBtnText == "original"
                              ? "original"
                              : "duplicate"
                          } school leaving certificate ?`
                        : `तुम्हाला ${
                            duplicateBtnText == "original" ? "मूळ" : "नक्कल"
                          } शाळा सोडल्याचा दाखला नक्की छापायचा आहे का?`}
                    </Typography>
                  </Box>
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      padding: "10px",
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleDuplicate("true")}
                    >
                      Yes
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleClose}
                    >
                      No
                    </Button>
                  </Box>
                </Box>
              </form>
            </Modal>
          </Box>
        </Box>
        {(authority?.includes("ENTRY") ||
          authority?.includes("ADMIN_OFFICER")) && (
          <div className={styles.addbtn}>
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
                setShowFile(false);
                setReadonlyFields(false);
                setPrintData("");
              }}
            >
              {labels.add}
            </Button>
          </div>
        )}
        <Box>
          {loading ? (
            <Loader />
          ) : (
            <>
              {showFile && (
                <DataGrid
                  components={{ Toolbar: GridToolbar }}
                  componentsProps={{
                    toolbar: {
                      showQuickFilter: true,
                      quickFilterProps: { debounceMs: 500 },
                      // printOptions: { disableToolbarButton: true },
                      // disableExport: true,
                      // disableToolbarButton: true,
                      // csvOptions: { disableToolbarButton: true },
                    },
                  }}
                  headerName="Water"
                  getRowId={(row) => row.srNo}
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
                  }}
                  density="compact"
                  // rows={studentList}
                  // columns={columns}
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
                    getLeavingCertificateMaster(data.pageSize, _data);
                  }}
                  onPageSizeChange={(_data) => {
                    console.log("222", _data);
                    // updateData("page", 1);
                    getLeavingCertificateMaster(_data, data.page);
                  }}
                />
              )}
            </>
          )}
        </Box>
      </Paper>
    </>
  );
};

export default Index;
