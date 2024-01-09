import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import { GridToolbar } from "@mui/x-data-grid";
import { EyeFilled } from "@ant-design/icons";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PrintIcon from "@mui/icons-material/Print";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import { useReactToPrint } from "react-to-print";
import BonafideToPrint from "../../../../components/school/BonafideToPrint";

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
import studentBonafideSchema from "../../../../containers/schema/school/transactions/studentBonafideSchema";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import Loader from "../../../../containers/Layout/components/Loader";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
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
  //   resolver: yupResolver(studentBonafideSchema),
  //   mode: "onChange",
  // });
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(studentBonafideSchema),
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

  const [showTable, setShowTable] = useState(true);
  const [printData, setPrintData] = useState();
  const [isReady, setIsReady] = useState("none");

  const schoolId = watch("schoolKey");
  const classId = watch("classKey");
  const academicYearId = watch("academicYearKey");
  const divisionId = watch("divisionKey");
  const studentID = watch("studentKey");

  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [readonlyFields, setReadonlyFields] = useState(false);
  const [rejectApplViewBtn, setRejectApplViewBtn] = useState(false);

  // --------------------Getting logged in authority roles -----------------------

  const [authority, setAuthority] = useState([]);
  let user = useSelector((state) => state.user.user);
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");

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

  const userToken = useGetToken();
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
          r.data?.map((row) => ({
            id: row.id,
            schoolName: row.schoolName,
            schoolNameMr: row.schoolNameMr,
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
        console.log("AY", r.data.mstAcademicYearList);
        setAcademicYearList(
          r.data.mstAcademicYearList.map((row) => ({
            id: row.id,
            academicYear: row.academicYear,
          }))
        );
      })
      .catch((err) => {
        callCatchMethod(err, language);
      });
  };
  useEffect(() => {
    getSchoolList();
    getAcademicYearList();
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
        .catch((err) => {
          callCatchMethod(err, language);
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
        .catch((err) => {
          callCatchMethod(err, language);
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
          // console.log("rr",r);
          setStudentList(
            r.data.mstStudentList.map((row) => ({
              id: row.id,
              studentName: `${row.firstName} ${row.middleName} ${row.lastName}`,
              studentNameMr: `${row.firstNameMr} ${row.middleNameMr} ${row.lastNameMr}`,
            }))
          );
        })
        .catch((err) => {
          callCatchMethod(err, language);
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
          setStudentData(r.data);
        })
        .catch((err) => {
          callCatchMethod(err, language);
        });
    }
  };

  useEffect(() => {
    getStudent();
  }, [studentID]);
  console.log("printData", printData);

  useEffect(() => {
    // console.log("Student", studentData)
    getStudentInfo();
  }, [studentData]);

  useEffect(() => {
    if (printData && studentData && showTable === true) {
      handlePrint();
    }
  }, [printData, studentData]);

  const getStudentInfo = () => {
    console.log("studentData", studentData);
    setValue("studentFirstName", studentData?.firstName);
    setValue("studentMiddleName", studentData?.middleName);
    setValue("studentLastName", studentData?.lastName);
    setValue("studentRollNo", studentRollNo);
    setValue("studentAdmissionDate", studentData?.addmissionDate);
    setValue("studentGeneralRegisterNumber", studentData?.grNumber);
    setValue("casteName", studentData?.casteName);
    setValue("studentAddress", studentData?.parentAddress);
    setValue("studentMobileNumber", studentData?.contactDetails);
    setValue("studentDateOfBirth", studentData?.dateOfBirth);
    setValue("studentEmailId", studentData?.studentEmailId);
    setValue("photograph", studentData?.photograph);
  };
  useEffect(() => {
    getBonafideCertificateMaster();
  }, [fetchData]);

  // Get Table - Data
  const getBonafideCertificateMaster = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    // console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    setLoading(true);
    axios
      .get(
        `${urls.SCHOOL}/trnBonafiedCertificate/getAllUserId?userId=${user?.id}`,
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
        let result = r.data.trnBonafiedCertificateList;
        let page = r?.data?.pageSize * r?.data?.pageNo;
        console.log("trnBonafiedCertificateList", result);

        let _res = result.map((r, i) => {
          return {
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1 + page,

            schoolName: r.schoolName,
            schoolNameMr: r.schoolNameMr,
            schoolKey: r.schoolKey,

            academicYear: r.academicYearName,
            academicYearKey: r.academicYearKey,

            classKey: r.classKey,
            className: r.className,

            divisionKey: r.divisionKey,
            divisionName: r.divisionName,

            studentKey: r.studentId,
            // studentName: r.studentFirstName,

            Status:
              r.applicationStatus == "REJECTED_BY_PRINCIPAL"
                ? "reject"
                : "approve",
            principalRemarksEn: r.principalRemarksEn,
            principalRemarksMr: r.principalRemarksMr,
            photograph: r.photograph,
            // approveBonafiedDate: r.approveBonafiedDate,

            studentGeneralRegisterNumber: r.studentGeneralRegisterNumber,
            studentName: `${r.studentFirstName} ${r.studentMiddleName} ${r.studentLastName}`,
            studentMotherName: r.studentMotherName,
            studentDateOfBirth: r.studentDateOfBirth,
            studentPlaceOfBirth: r.studentPlaceOfBirth,
            lastSchoolName: r.lastSchoolName,
            studentAdmissionDate: r.studentAdmissionDate,
            studentBehaviour: r.studentBehaviour,
            schoolLeavingDate: r.schoolLeavingDate,
            lastClassAndFrom: r.lastClassAndFrom,
            leavingReason: r.leavingReason,
            bonafiedPurpose: r.bonafiedPurpose,
            bonafiedPurposeMr: r.bonafiedPurposeMr,
            bonafiedRemark: r.bonafiedRemark,
            applicationStatus: r.applicationStatus,

            studentMobileNumber: r.studentMobileNumber,
            emailID: r.studentEmailId,
            rollNumber: r.studentRollNo,
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
        // catchExceptionHandlingMethod(e, language);
        callCatchMethod(e, language);
        console.log("Eroor", e);
      });
  };

  const onSubmitForm = (formData) => {
    console.log("formData", formData);
    // Save - DB
    let _body = {
      // activeFlag: formData.activeFlag,
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
      studentMiddleName: formData.studentMiddleName,
      studentLastName: formData.studentLastName,
      studentGeneralRegisterNumber: formData.studentGeneralRegisterNumber,
      studentAddress: formData.studentAddress,
      studentMobileNumber: formData.studentMobileNumber,
      studentEmailId: formData.studentEmailId,
      studentDateOfBirth: formData.studentDateOfBirth,
      studentRollNo: formData.studentRollNo,
      bonafiedPurpose: formData.bonafiedPurpose,
      bonafiedPurposeMr: formData.bonafiedPurposeMr,
      bonafiedRemark: formData.bonafiedRemark,
      studentAdmissionDate: formData.studentAdmissionDate,
    };
    if (btnSaveText === "Save") {
      console.log("Body", _body);
      setLoading(true);
      const tempData = axios
        .post(`${urls.SCHOOL}/trnBonafiedCertificate/save`, _body, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setLoading(false);
          if (res.status == 201 || res.status == 200) {
            // sweetAlert("Saved!", "Record Saved successfully !", "success");
            sweetAlert({
              title: language === "en" ? "Saved " : "जतन केले",
              text:
                language === "en"
                  ? "Record saved successfully"
                  : "रेकॉर्ड यशस्वीरित्या जतन केले",
              icon: "success",
              button: language === "en" ? "Ok" : "ठीक आहे",
            });
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setShowTable(true);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        })
        .catch((e) => {
          setLoading(false);
          // catchExceptionHandlingMethod(e, language);
          callCatchMethod(e, language);
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
        mstStudentDao: {},
      };
      console.log("_isApproved", _isApproved);
      console.log("_ress", _res);
      setLoading(true);
      axios
        .post(`${urls.SCHOOL}/trnBonafiedCertificate/updateStatus`, _res, {
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
            getBonafideCertificateMaster();
            // setButtonInputState(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
            setShowTable(true);
          }
        })
        .catch((e) => {
          setLoading(false);
          // catchExceptionHandlingMethod(e, language);
          callCatchMethod(e, language);
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
            .post(`${urls.SCHOOL}/trnBonafiedCertificate/save`, body, {
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
                getBonafideCertificateMaster();
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
            .post(`${urls.SCHOOL}/trnBonafiedCertificate/save`, body, {
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
                getBonafideCertificateMaster();
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
    setShowTable(true);
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
    bonafiedRemark: "",
    bonafiedPurpose: "",
    bonafiedPurposeMr: "",
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
    bonafiedRemark: "",
    bonafiedPurpose: "",
    bonafiedPurposeMr: "",
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
    // pageStyle: "A4",
    // onAfterPrint: () => {
    //   console.log("print", id);
    // },
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
      field: "studentName",
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
      width: 180,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        let status = params.row.applicationStatus;
        // console.log("params.row", params.row);
        return (
          <Box>
            {/* print */}
            {(authority?.includes("ADMIN_OFFICER") ||
              authority?.includes("ENTRY")) &&
              status == "APPROVED_BY_PRINCIPAL" && (
                <IconButton
                  onClick={() => {
                    setPrintData(params.row);
                    setIsReady("none");
                    setValue("studentKey", params.row.studentKey);
                    setReadonlyFields(false);
                    console.log("params.row", params.row);
                  }}
                >
                  <PrintIcon style={{ color: "#556CD6" }} />
                </IconButton>
              )}
            {/* approve button */}
            {(authority?.includes("ADMIN_OFFICER") ||
              authority?.includes("APPROVAL")) &&
              status == "REQUEST_CREATED" && (
                <IconButton>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    endIcon={<CheckIcon />}
                    onClick={() => {
                      setBtnSaveText("StatusByPrincipal"),
                        setID(params.row.id),
                        setIsOpenCollapse(true),
                        setShowTable(false);
                      setSlideChecked(true);
                      setButtonInputState(true);
                      setStudentRollNo(params.row.rollNumber);
                      console.log("params.row: ", params.row.rollNumber);
                      reset(params.row);
                      setReadonlyFields(true);
                    }}
                  >
                    {labels.view}
                  </Button>
                </IconButton>
              )}
            {(authority?.includes("ADMIN_OFFICER") ||
              authority?.includes("ENTRY")) &&
              status == "REJECTED_BY_PRINCIPAL" && (
                <IconButton>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<EyeFilled />}
                    onClick={() => {
                      setRejectApplViewBtn(true),
                        setStudentRollNo(params.row.rollNumber);
                      setID(params.row.id),
                        setIsOpenCollapse(true),
                        setSlideChecked(true);
                      setShowTable(false), setButtonInputState(true);
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
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>{labels.studentBonafideCert}</h2>
        </Box>
        <Paper style={{ display: isReady }}>
          {printData && (
            <BonafideToPrint
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

            padding: 2,
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
                                        ? school.schoolName
                                        : school.schoolNameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText error={!!errors.schoolKey}>
                            {errors?.schoolKey ? labels.schoolReq : null}
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
                                disabled={readonlyFields}
                                // readOnly={readonlyFields}
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
                            {errors?.academicYearKey ? labels.ayReq : null}
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
                                disabled={readonlyFields}
                                // readOnly={readonlyFields}
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
                            {errors?.classKey ? labels.classReq : null}
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
                                disabled={readonlyFields}
                                // readOnly={readonlyFields}
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
                            {errors?.divisionKey ? labels.divReq : null}
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
                                disabled={readonlyFields}
                                // readOnly={readonlyFields}
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
                          // value={firstName}
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
                            shrink:
                              (watch("studentFirstName") ? true : false) ||
                              (router.query.studentFirstName ? true : false),
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
                          // value={middleName}

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
                          // value={lastName}
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
                                    moment(date).format("DD-MM-YYYY")
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
                          {...register("studentRollNo")}
                          disabled={readonlyFields}
                          error={!!errors.studentRollNo}
                          sx={{ width: 230 }}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
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
                          {...register("studentAddress")}
                          disabled={readonlyFields}
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
                          {...register("studentMobileNumber")}
                          disabled={readonlyFields}
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
                          {...register("studentEmailId")}
                          disabled={readonlyFields}
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
                          required
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
                                    moment(date).format("DD-MM-YYYY")
                                  )
                                }
                              />
                            </LocalizationProvider>
                          )}
                        />
                      </Grid>
                      {/* casteName */}
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
                          label={labels.casteName}
                          {...register("casteName")}
                          disabled={readonlyFields}
                          error={!!errors.casteName}
                          sx={{ width: 230 }}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink: watch("casteName") ? true : false,
                          }}
                          helperText={
                            errors?.casteName ? errors.casteName.message : null
                          }
                        />
                      </Grid>
                      {/* Bonafied Purpose */}
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
                        {/* <TextField
                        id="standard-basic"
                        variant="standard"
                        label={labels.bonafiedPurpose}
                        disabled={readonlyFields}
                        required
                        {...register("bonafiedPurpose")}
                        error={!!errors.bonafiedPurpose}
                        sx={{ width: 230 }}
                        InputProps={{
                          style: { fontSize: 18 },
                          //  readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          //true
                          shrink: watch("bonafiedPurpose") ? true : false,
                        }}
                        helperText={
                          errors?.bonafiedPurpose
                            ? errors.bonafiedPurpose.message
                            : null
                        }
                      /> */}
                        <Grid sx={{ width: 230 }}>
                          <Transliteration
                            _key={"bonafiedPurpose"}
                            label={`${labels.bonafiedPurpose} *`}
                            fieldName={"bonafiedPurpose"}
                            updateFieldName={"bonafiedPurposeMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            disabled={readonlyFields}
                            InputLabelProps={{
                              style: { fontSize: 15 },
                              shrink: watch("bonafiedPurpose") ? true : false,
                            }}
                            error={!!errors.bonafiedPurpose}
                            targetError={"bonafiedPurposeMr"}
                            helperText={
                              errors?.bonafiedPurpose
                                ? labels.bonafiedPurposeReq
                                : null
                            }
                          />
                        </Grid>
                      </Grid>
                      {/* Bonafied Purpose Mr*/}
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
                        {/* <TextField
                        id="standard-basic"
                        variant="standard"
                        required
                        label={labels.bonafiedPurposeMr}
                        {...register("bonafiedPurposeMr")}
                        disabled={readonlyFields}
                        error={!!errors.bonafiedPurposeMr}
                        sx={{ width: 230 }}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          //true
                          shrink: watch("bonafiedPurposeMr") ? true : false,
                        }}
                        helperText={
                          errors?.bonafiedPurposeMr
                            ? errors.bonafiedPurposeMr.message
                            : null
                        }
                      /> */}
                        <Grid sx={{ width: 230 }}>
                          <Transliteration
                            _key={"bonafiedPurposeMr"}
                            label={`${labels.bonafiedPurposeMr} *`}
                            fieldName={"bonafiedPurposeMr"}
                            updateFieldName={"bonafiedPurpose"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            disabled={readonlyFields}
                            InputLabelProps={{
                              style: { fontSize: 15 },
                              shrink: watch("bonafiedPurposeMr") ? true : false,
                            }}
                            error={!!errors.bonafiedPurposeMr}
                            targetError={"bonafiedPurpose"}
                            helperText={
                              errors?.bonafiedPurposeMr
                                ? labels.bonafiedPurposeMrReq
                                : null
                            }
                          />
                        </Grid>
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
                          {...register("bonafiedRemark")}
                          disabled={readonlyFields}
                          error={!!errors.bonafiedRemark}
                          sx={{ width: 230 }}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink: watch("bonafiedRemark") ? true : false,
                          }}
                          // helperText={
                          //     errors?.bonafiedRemark ? errors.bonafiedRemark.message : null
                          // }
                        />
                      </Grid>
                      {/* {readonlyFields === true && (
                      
                    )} */}

                      {/* buttons */}
                      <Divider />
                      {/* {readonlyFields === true ? ( */}
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
                              name="approveBonafiedDate"
                              defaultValue={new Date().toISOString()}
                              // defaultValue={rejectApplViewBtn ? setValue("")}
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
                                        sx={{ width: 230 }}
                                        size="small"
                                        error={errors.approveBonafiedDate}
                                        required
                                        helperText={
                                          errors.approveBonafiedDate
                                            ? errors.approveBonafiedDate.message
                                            : null
                                        }
                                      />
                                    )}
                                    label={labels.approveBonafiedDate}
                                    value={field.value}
                                    onChange={(date) =>
                                      field.onChange(
                                        moment(date).format("DD-MM-YYYY")
                                      )
                                    }
                                  />
                                </LocalizationProvider>
                              )}
                            />
                          </Grid>
                          <Divider />
                          {/* Status */}
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
                              required
                              // variant="standard"
                              size="small"
                              // sx={{ m: 1, minWidth: 120 }}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
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
                            label={labels.principalRemarksEn}
                            {...register("principalRemarksEn")}
                            required
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
                            label={labels.principalRemarksMr}
                            required
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
                                disabled={rejectApplViewBtn}
                                type="submit"
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
                              disabled={rejectApplViewBtn}
                              sx={{ marginRight: 8 }}
                              type="submit"
                              variant="contained"
                              color="primary"
                              endIcon={<SaveIcon />}
                            >
                              {labels.submit}
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              disabled={rejectApplViewBtn}
                              sx={{ marginRight: 8 }}
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
                setShowTable(false);
                setReadonlyFields(false);
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
              {showTable && (
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
                    getBonafideCertificateMaster(data.pageSize, _data);
                  }}
                  onPageSizeChange={(_data) => {
                    console.log("222", _data);
                    // updateData("page", 1);
                    getBonafideCertificateMaster(_data, data.page);
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
