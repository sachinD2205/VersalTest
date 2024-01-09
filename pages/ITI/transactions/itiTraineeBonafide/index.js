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
import ItiBonafideToPrint from "../../../../components/school/ItiBonafideToPrint";

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
// import studentBonafideSchema from "../../../../containers/schema/school/transactions/studentBonafideSchema";
// import {itistudentBonafideSchema} from "../../../../containers/schema/iti/transactions/itistudentBonafideSchema";
import {
  itistudentBonafideSchema,
  itistudentBonafideSchemaGroupInstructor,
  itistudentBonafideSchemaPrincipal,
} from "../../../../containers/schema/iti/transactions/itistudentBonafideSchema";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import Loader from "../../../../containers/Layout/components/Loader";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  const [dataValidation, setDataValidation] = useState(
    itistudentBonafideSchema
  );
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(dataValidation),
    mode: "onChange",
  });
  const {
    register,
    control,
    handleSubmit,

    reset,
    watch,
    setValue,
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

  const [academicYearList, setAcademicYearList] = useState([]);

  const [itiKeys, setItiKeys] = useState([]);
  const [tradeKeys, setTradeKeys] = useState([]);
  const [tradeDivisionKeys, setTradeDivisionKeys] = useState([]);
  const [allTrainees, setAllTrainees] = useState([]);
  const [traineeKeys, setTraineeKeys] = useState([]);

  const [studentData, setStudentData] = useState([]);
  const [fetchData, setFetchData] = useState(null);

  const [showTable, setShowTable] = useState(true);
  const [printData, setPrintData] = useState();
  const [isReady, setIsReady] = useState("none");

  const router = useRouter();

  const [readonlyFields, setReadonlyFields] = useState(false);
  const [rejectApplViewBtn, setRejectApplViewBtn] = useState(false);
  const [isPrincipleRej, setIsPrincipleRej] = useState(false);
  const [isGrpInstructorApproved, setIsGrpInstructorApproved] = useState(false);

  // --------------------Getting logged in authority roles -----------------------

  const [authority, setAuthority] = useState([]);
  let user = useSelector((state) => state.user.user);
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");

  //----------------state for purpose of bonafide---------------------
  // const [purposeOfBonafideMr, setPurposeOfBonafideMr] = useState("");
  // const [purposeOfBonafideEn, setPurposeOfBonafideEn] = useState("");

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

  useEffect(() => {
    console.log("authority", authority);
  }, [authority]);
  useEffect(() => {
    console.log("studentDatastudentData", studentData);
  }, [studentData]);

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

  useEffect(() => {
    setLabels(schoolLabels[language ?? "en"]);
  }, [setLabels, language]);

  // getAll trainee
  const getAllTrainee = () => {
    axios.get(`${urls.SCHOOL}/mstItIStudent/getAll`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      setAllTrainees(
        r?.data?.mstITIStudentDao?.map((i) => ({
          id: i?.id,
          traineePhotograph: i?.traineePhotograph,
          ...i,
        }))
      );
    })
    .catch((error) => {
      callCatchMethod(error, language);
    })
  };

  useEffect(() => {
    console.log("allTrainees", allTrainees);
  }, [allTrainees]);

  //   get ITI Names
  const getItiKeys = () => {
    // axios.get(`${urls.SCHOOL}/mstIti/getAll`).then((r) => {
    axios
      .get(`${urls.SCHOOL}/mstIti/getItiOnUserId?userId=${user?.id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setItiKeys(
          r?.data?.map((data) => ({
            id: data?.id,
            itiName: data?.itiName,
            itiAddress: data?.address,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })

  };
  const getAcademicYearList = () => {
    axios.get(`${urls.SCHOOL}/mstAcademicYear/getAll`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      console.log("AY", r.data.mstAcademicYearList);
      setAcademicYearList(
        r.data.mstAcademicYearList.map((row) => ({
          id: row.id,
          academicYear: row.academicYear,
        }))
      );
    })
    .catch((error) => {
      callCatchMethod(error, language);
    })
  };

  useEffect(() => {
    getItiKeys();
    getAcademicYearList();
    getAllTrainee();
  }, []);

  const itiId = watch("itiKey");
  const tradeId = watch("tradeKey");
  const academicYearId = watch("academicYearKey");

  //   get  trades
  const getAllTradeKeys = () => {
    if (itiId) {
      axios
        .get(`${urls.SCHOOL}/mstItiTrade/getDataOnItiKey?itiKey=${itiId}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          setTradeKeys(
            r?.data?.map((data) => ({
              id: data?.id,
              tradeName: data?.tradeName,
            }))
          );
        })
        .catch((error) => {
          callCatchMethod(error, language);
        })
    }
  };
  useEffect(() => {
    getAllTradeKeys();
  }, [itiId]);

  const getTradeDivisionKeys = () => {
    if (itiId === "" || itiId === null || tradeId === "" || tradeId === null) {
      setTradeDivisionKeys([]);
    } else if (itiId && tradeId) {
      axios
        .get(
          `${urls.SCHOOL}/mstItiTradeDivision/getFilterByIttAndTradeKey?itiKey=${itiId}&tradeKey=${tradeId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          setTradeDivisionKeys(
            r?.data?.map((row) => ({
              id: row?.id,
              tradeDivisionName: row?.divisionName,
            }))
          );
        })
        .catch((error) => {
          callCatchMethod(error, language);
        })
    }
  };
  useEffect(() => {
    getTradeDivisionKeys();
  }, [itiId, tradeId]);

  const getTraineeKeys = () => {
    if (
      itiId === "" ||
      itiId === null ||
      academicYearId === "" ||
      academicYearId === null ||
      tradeId === "" ||
      tradeId === null
    ) {
      setTraineeKeys([]);
    } else if (itiId && academicYearId && tradeId) {
      axios
        .get(
          `${urls.SCHOOL}/mstItIStudent/getFilterApi?itiAllocatedKey=${itiId}&academicYearKey=${academicYearId}&itiTradeKey=${tradeId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          setTraineeKeys(
            r?.data?.map((row) => ({
              id: row.id,
              traineeName: `${row.traineeFirstName} ${row.traineeMiddleName} ${row.traineeLastName}`,
            }))
          );
        })
        .catch((error) => {
          callCatchMethod(error, language);
        })
    }
  };
  useEffect(() => {
    getTraineeKeys();
  }, [itiId, academicYearId, tradeId]);

  const getStudent = () => {
    if (watch("traineeKey")) {
      axios
        .get(`${urls.SCHOOL}/mstItIStudent/getData/${watch("traineeKey")}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          setStudentData(r.data);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        })
    }
  };
  useEffect(() => {
    getStudent();
  }, [watch("traineeKey")]);

  useEffect(() => {
    // console.log("Student", studentData)
    getStudentInfo();
  }, [studentData]);

  useEffect(() => {
    if (printData && studentData && rejectApplViewBtn === false) {
      handlePrint();
    }
  }, [printData]);

  const getStudentInfo = () => {
    let AYkey = studentData?.academicYearKey;
    let Ay = academicYearList?.find((i) => i?.id === AYkey)?.academicYear;
    console.log("studentData", studentData);
    setValue("traineeFirstName", studentData?.traineeFirstName);
    setValue("traineeMiddleName", studentData?.traineeMiddleName);
    setValue("traineeLastName", studentData?.traineeLastName);
    setValue("address", studentData?.address);
    // setValue("studentRollNo", studentRollNo);
    setValue("traineeMobileNumber", studentData?.traineeMobileNumber);
    setValue("traineeEmailId", studentData?.traineeEmailId);
    setValue("itiTradeName", studentData?.itiTradeName);
    setValue("registrationNo", studentData?.admissionRegistrationNo);
    setValue("divisionName", studentData?.divisionName);
    setValue("academicYear", Ay);
    setValue("fatherFirstName", studentData?.fatherFirstName);
    setValue("fatherMiddleName", studentData?.fatherMiddleName);
    setValue("fatherLastName", studentData?.fatherLastName);
    setValue("motherFirstName", studentData?.motherFirstName);
  };
  // console.log("llllllllll",dataValidation);
  // Get Table - Data
  const getItiTraineeBonafide = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    // console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    setLoading(true);
    axios
      .get(
        `${urls.SCHOOL}/trnItiBonafiedCertificate/getAllUserId?userId=${user?.id}`,
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
        let result = r?.data?.trnItiBonafiedCertificateDao;
        let page = r?.data?.pageSize * r?.data?.pageNo;
        let _res = result.map((r, i) => {
          return {
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1 + page,

            itiKey: r?.itiKey,
            itiName: itiKeys?.find((i) => i?.id === r?.itiKey)?.itiName,
            itiAddress: itiKeys?.find((i) => i?.id === r?.itiKey)?.itiAddress,

            academicYearKey: r?.academicYearKey,
            academicYear: academicYearList?.find(
              (i) => i?.id === r?.academicYearKey
            )?.academicYear,

            tradeKey: r?.tradeKey,
            itiTradeName: r?.itiTradeName,

            tradeDivisionKey: r?.tradeDivisionKey,
            divisionName: r?.divisionName,

            traineeKey: r?.traineeKey,
            traineeFirstName: r?.traineeFirstName,
            traineeMiddleName: r?.traineeMiddleName,
            traineeLastName: r?.traineeLastName,

            traineePhotograph: allTrainees?.find((i) => i?.id == r?.traineeKey)
              ?.traineePhotograph,

            traineeName: `${r?.traineeFirstName} ${r?.traineeMiddleName} ${r?.traineeLastName}`,

            traineeEmailId: r?.traineeEmailId,
            traineeMobileNumber: r?.traineeMobileNumber,
            address: r?.address,
            bonafiedRemark: r?.bonafiedRemark,
            applicationStatus: r?.applicationStatus,
            registrationNo: r?.registrationNo,
            purposeOfBonafideEn: r?.purposeOfBonafideEn,
            purposeOfBonafideMr: r?.purposeOfBonafideMr,

            groupInstructorStatus:
              r.applicationStatus === "REJECTED_BY_GROUP_INSTRUCTOR"
                ? "reject"
                : "approve",
            principalStatus:
              r.applicationStatus === "REJECTED_BY_PRINCIPAL"
                ? "reject"
                : "approve",

            groupInstructorRemarksEn: r.groupInstructorRemarksEn,
            groupInstructorRemarksMr: r.groupInstructorRemarksMr,
            principalRemarksEn: r.principalRemarksEn,
            principalRemarksMr: r.principalRemarksMr,
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
      .catch((error) => {
        setLoading(false);
        callCatchMethod(error, language);
      });
  };

  // console.log("studentDataForPrint", purposeOfBonafideEn,purposeOfBonafideMr);
  const onSubmitForm = (formData) => {
    console.log("formData", formData);
    // Save - DB
    let _body = {
      // activeFlag: formData.activeFlag,
      ...formData,
    };
    if (btnSaveText === "Save") {
      setLoading(true);
      const tempData = axios
        .post(`${urls.SCHOOL}/trnItiBonafiedCertificate/save`, _body, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setLoading(false);
          if (res.status == 201 || res.status == 200) {
            sweetAlert("Saved!", "Record Saved successfully !", "success");
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setShowTable(true);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    }
    //  else if (btnSaveText === "StatusByGroupInstructor"){
    //   let _isApproved = watch("Status");
    //   let _res = {
    //     id,
    //     role: "GROUP_INSTRUCTOR",
    //     isApproved:
    //       _isApproved == "approve"
    //         ? true
    //         : _isApproved == "reject"
    //         ? false
    //         : "",
    //         groupInstructorRemarksEn: formData?.groupInstructorRemarksEn,
    //         groupInstructorRemarksMr: formData?.groupInstructorRemarksMr,
    //     // mstStudentDao: {},
    //   };
    //   axios
    //     .post(`${urls.SCHOOL}/trnItiBonafiedCertificate/updateStatus`, _res)
    //     .then((res) => {
    //       console.log("res", res);
    //       if (res.status == 201 || res.status == 200) {
    //         _isApproved == "approve"
    //           ? sweetAlert(
    //               "Approved!",
    //               "Application Approved successfully !",
    //               "success"
    //             )
    //           : sweetAlert(
    //               "Rejected!",
    //               "Application Sent to the Clerk successfully !",
    //               "success"
    //             );
    //         getItiTraineeBonafide();
    //         // setButtonInputState(false);
    //         setEditButtonInputState(false);
    //         setDeleteButtonState(false);
    //         setIsOpenCollapse(false);
    //         setShowTable(true);
    //       }
    //     });
    // }
    // StatusByPrincipal
    else {
      let _res;
      let _isApproved;
      if (btnSaveText === "StatusByGroupInstructor") {
        _isApproved = watch("groupInstructorStatus");
        _res = {
          id,
          role: "GROUP_INSTRUCTOR",
          isApproved:
            _isApproved == "approve"
              ? true
              : _isApproved == "reject"
              ? false
              : "",
          groupInstructorRemarksEn: formData?.groupInstructorRemarksEn,
          groupInstructorRemarksMr: formData?.groupInstructorRemarksMr,
        };
      } else if (btnSaveText === "StatusByPrincipal") {
        _isApproved = watch("principalStatus");
        _res = {
          id,
          role: "PRINCIPAL",
          isApproved:
            _isApproved == "approve"
              ? true
              : _isApproved == "reject"
              ? false
              : "",
          principalRemarksEn: formData?.principalRemarksEn,
          principalRemarksMr: formData?.principalRemarksMr,
        };
      }
      console.log("post_res", _res);
      setLoading(true);
      axios
        .post(`${urls.SCHOOL}/trnItiBonafiedCertificate/updateStatus`, _res, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setLoading(false);
          console.log("res", res);
          if (res.status == 201 || res.status == 200) {
            _isApproved == "approve"
              ? sweetAlert(
                  "Approved!",
                  "Application Approved successfully !",
                  "success"
                )
              : sweetAlert(
                  "Rejected!",
                  "Application Sent to the Clerk successfully !",
                  "success"
                );
            getItiTraineeBonafide();
            // setButtonInputState(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
            setShowTable(true);
          }
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
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
          setLoading(true);
          axios
            .post(`${urls.SCHOOL}/trnItiBonafiedCertificate/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              setLoading(false);
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getItiTraineeBonafide();
                // setButtonInputState(false);
              }
            })
            .catch((error) => {
              setLoading(false);
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
          setLoading(true);
          axios
            .post(`${urls.SCHOOL}/trnItiBonafiedCertificate/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              setLoading(false);
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Activated!", {
                  icon: "success",
                });
                // getPaymentRate();
                getItiTraineeBonafide();
                // setButtonInputState(false);
              }
            })
            .catch((error) => {
              setLoading(false);
              callCatchMethod(error, language);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  useEffect(() => {
    getItiTraineeBonafide();
  }, [fetchData, itiKeys, allTrainees]);

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
    itiKey: "",
    academicYearKey: "",
    tradeKey: "",
    tradeDivisionKey: "",
    traineeKey: "",

    traineeFirstName: "",
    traineeMiddleName: "",
    traineeLastName: "",
    address: "",
    traineeMobileNumber: "",
    traineeEmailId: "",
    itiTradeName: "",
    registrationNo: "",
    bonafiedRemark: "",

    fatherFirstName: "",
    fatherMiddleName: "",
    fatherLastName: "",
    motherFirstName: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    id: null,

    itiKey: "",
    academicYearKey: "",
    tradeKey: "",
    tradeDivisionKey: "",
    traineeKey: "",

    traineeFirstName: "",
    traineeMiddleName: "",
    traineeLastName: "",
    address: "",
    traineeMobileNumber: "",
    traineeEmailId: "",
    itiTradeName: "",
    registrationNo: "",
    bonafiedRemark: "",

    fatherFirstName: "",
    fatherMiddleName: "",
    fatherLastName: "",
    motherFirstName: "",
  };

  const componentRef = useRef(null);

  // console.log("componentRef", componentRef);

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
      // flex: 1,
      width: 120,
      headerAlign: "center",
    },
    {
      field: "itiName",
      headerName: labels.itiName,
      // flex: 1,
      width: 250,
      headerAlign: "center",
    },
    {
      field: "traineeName",
      headerName: labels.traineeName,
      flex: 1,
      // width: 100,
      headerAlign: "center",
    },
    {
      field: "traineeMobileNumber",
      headerName: labels.traineeMoNo,
      flex: 1,
      // width: 100,
      headerAlign: "center",
    },
    {
      field: "traineeEmailId",
      headerName: labels.traineeEmailId,
      flex: 1,
      // width: 100,
      headerAlign: "center",
    },
    {
      field: "applicationStatus",
      headerName: labels.status,
      // flex: 1,
      width: 300,
      headerAlign: "center",
    },

    {
      field: "Actions",
      headerName: labels.actions,
      width: 180,
      headerAlign: "center",
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
              status === "APPROVED_BY_PRINCIPAL" && (
                <IconButton>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<PrintIcon />}
                    onClick={() => {
                      setPrintData(params.row);
                      setIsReady("none");
                      setValue("traineeKey", params?.row?.traineeKey);
                      setReadonlyFields(false);
                      console.log("printData123", params.row);
                    }}
                  >
                    {labels.preview}
                  </Button>
                </IconButton>
              )}
            {/* approve button of group instructor*/}
            {(authority?.includes("ADMIN_OFFICER") ||
              authority?.includes("HOD")) &&
              status === "APPLICATION_CREATED" && (
                <IconButton>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    endIcon={<CheckIcon />}
                    onClick={() => {
                      setBtnSaveText("StatusByGroupInstructor"),
                        setID(params.row.id),
                        setIsOpenCollapse(true),
                        setShowTable(false);
                      setDataValidation(
                        itistudentBonafideSchemaGroupInstructor
                      );
                      setSlideChecked(true);
                      setButtonInputState(true);
                      setStudentRollNo(params.row.rollNumber);
                      console.log("params.row: ", params.row.rollNumber);
                      reset(params.row);
                      setReadonlyFields(true);
                    }}
                  >
                    {labels.action}
                  </Button>
                </IconButton>
              )}
            {/* approve button of principal*/}
            {(authority?.includes("ADMIN_OFFICER") ||
              authority?.includes("APPROVAL")) &&
              status === "APPROVED_BY_GROUP_INSTRUCTOR" && (
                <IconButton>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    endIcon={<CheckIcon />}
                    onClick={() => {
                      setDataValidation(itistudentBonafideSchemaPrincipal);
                      setBtnSaveText("StatusByPrincipal"),
                        setID(params.row.id),
                        setIsOpenCollapse(true),
                        setIsGrpInstructorApproved(true),
                        setShowTable(false);
                      setSlideChecked(true);
                      setButtonInputState(true);
                      setStudentRollNo(params.row.rollNumber);
                      console.log("params.row: ", params.row.rollNumber);
                      reset(params.row);
                      setReadonlyFields(true);
                    }}
                  >
                    {labels.action}
                  </Button>
                </IconButton>
              )}
            {(authority?.includes("ADMIN_OFFICER") ||
              authority?.includes("ENTRY")) &&
              (status === "REJECTED_BY_PRINCIPAL" ||
                status === "REJECTED_BY_GROUP_INSTRUCTOR") && (
                <IconButton>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<EyeFilled />}
                    onClick={() => {
                      let _isPrincipleRej =
                        status === "REJECTED_BY_PRINCIPAL" ? true : false;
                      // console.log("isPrincipleRej", isPrincipleRej);
                      setRejectApplViewBtn(true),
                        setIsPrincipleRej(_isPrincipleRej);
                      setStudentRollNo(params.row.rollNumber);
                      setID(params.row.id),
                        setIsOpenCollapse(true),
                        setSlideChecked(true);
                      setShowTable(false), setButtonInputState(true);
                      // console.log("params.row: ", params.row);
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
  useEffect(() => {
    console.log("setIsPrincipleRej", isPrincipleRej);
  }, [isPrincipleRej]);

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
          <h2>{labels.itiTraineeBonafideCert}</h2>
        </Box>
        <Paper style={{ display: isReady }}>
          {printData && (
            <ItiBonafideToPrint
              ref={componentRef}
              data={printData}
              // studentData={studentData}
              // filePath={studentData?.traineePhotograph}
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
                      {/* Select ITI */}
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
                          <InputLabel required error={!!errors.itiKey}>
                            {labels.selectIti}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="itiKey"
                            rules={{ required: true }}
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                disabled={readonlyFields}
                                // readOnly={readonlyFields}
                                variant="standard"
                                {...field}
                                error={!!errors.itiKey}
                              >
                                {itiKeys &&
                                  itiKeys.map((iti) => (
                                    <MenuItem key={iti.id} value={iti.id}>
                                      {iti?.itiName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText style={{ color: "red" }}>
                            {errors?.itiKey ? labels.itiNameReq : null}
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
                            rules={{ required: true }}
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
                          <FormHelperText style={{ color: "red" }}>
                            {errors?.academicYearKey
                              ? labels.academicYearRequired
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* Select Trade */}
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
                          <InputLabel required error={!!errors.tradeKey}>
                            {labels.selectTrade}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="tradeKey"
                            rules={{ required: true }}
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                disabled={readonlyFields}
                                // readOnly={readonlyFields}
                                variant="standard"
                                {...field}
                                error={!!errors.tradeKey}
                              >
                                {tradeKeys &&
                                  tradeKeys.map((trd) => (
                                    <MenuItem key={trd?.id} value={trd?.id}>
                                      {trd?.tradeName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText style={{ color: "red" }}>
                            {errors?.tradeKey ? labels.itiTradeReq : null}
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
                          <InputLabel
                            required
                            error={!!errors.tradeDivisionKey}
                          >
                            {labels.selectDivision}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="tradeDivisionKey"
                            rules={{ required: true }}
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                disabled={readonlyFields}
                                // readOnly={readonlyFields}
                                variant="standard"
                                {...field}
                                error={!!errors.tradeDivisionKey}
                              >
                                {tradeDivisionKeys &&
                                  tradeDivisionKeys.map((trd) => (
                                    <MenuItem key={trd?.id} value={trd?.id}>
                                      {trd?.tradeDivisionName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText style={{ color: "red" }}>
                            {errors?.tradeDivisionKey
                              ? labels.divisionRequired
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* Select Trainee */}
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
                          <InputLabel required error={!!errors.traineeKey}>
                            {labels.selectTrainee}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="traineeKey"
                            rules={{ required: true }}
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                disabled={readonlyFields}
                                // readOnly={readonlyFields}
                                variant="standard"
                                {...field}
                                error={!!errors.traineeKey}
                              >
                                {traineeKeys &&
                                  traineeKeys.map((trainee, index) => (
                                    <MenuItem key={index} value={trainee?.id}>
                                      {trainee?.traineeName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText style={{ color: "red" }}>
                            {errors?.traineeKey ? labels.traineeNameReq : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Divider />
                      {/* personal details */}
                      <Grid
                        container
                        display="flex"
                        justifyContent="center"
                        justifyItems="center"
                        padding={2}
                        marginBottom={2}
                        sx={{
                          background:
                            "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                          borderRadius: "6% / 100%",
                        }}
                      >
                        <Grid item>
                          <h2 style={{ marginBottom: 0 }}>
                            {labels.studentPersonalInfo}
                          </h2>
                        </Grid>
                      </Grid>
                      {/* trainee first name */}
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
                          {...register("traineeFirstName")}
                          error={!!errors.traineeFirstName}
                          sx={{ width: 230 }}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink: watch("traineeFirstName") ? true : false,
                          }}
                          helperText={
                            errors?.traineeFirstName
                              ? errors.traineeFirstName.message
                              : null
                          }
                        />
                      </Grid>
                      {/* trainee middle name */}
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
                          {...register("traineeMiddleName")}
                          error={!!errors.traineeMiddleName}
                          sx={{ width: 230 }}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink: watch("traineeMiddleName") ? true : false,
                          }}
                          helperText={
                            errors?.traineeMiddleName
                              ? errors.traineeMiddleName.message
                              : null
                          }
                        />
                      </Grid>
                      {/* trainee last name */}
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
                          {...register("traineeLastName")}
                          error={!!errors.traineeLastName}
                          sx={{ width: 230 }}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink: watch("traineeLastName") ? true : false,
                          }}
                          helperText={
                            errors?.traineeLastName
                              ? errors.traineeLastName.message
                              : null
                          }
                        />
                      </Grid>
                      {/* address */}
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
                          {...register("address")}
                          disabled={readonlyFields}
                          error={!!errors.address}
                          sx={{ width: 230 }}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink: watch("address") ? true : false,
                          }}
                          helperText={
                            errors?.address ? errors.address.message : null
                          }
                        />
                      </Grid>
                      {/* trainee mobile number */}
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
                          {...register("traineeMobileNumber")}
                          disabled={readonlyFields}
                          error={!!errors.traineeMobileNumber}
                          sx={{ width: 230 }}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink: watch("traineeMobileNumber") ? true : false,
                          }}
                          helperText={
                            errors?.traineeMobileNumber
                              ? errors.traineeMobileNumber.message
                              : null
                          }
                        />
                      </Grid>
                      {/* email */}
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
                          {...register("traineeEmailId")}
                          disabled={readonlyFields}
                          error={!!errors.traineeEmailId}
                          sx={{ width: 230 }}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink: watch("traineeEmailId") ? true : false,
                          }}
                          helperText={
                            errors?.traineeEmailId
                              ? errors.traineeEmailId.message
                              : null
                          }
                        />
                      </Grid>
                      {/* itiTradeName */}
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
                          label={labels.tradeName}
                          // value={StudRegNo}
                          disabled={readonlyFields}
                          {...register("itiTradeName")}
                          error={!!errors.itiTradeName}
                          sx={{ width: 230 }}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink: watch("itiTradeName") ? true : false,
                          }}
                          helperText={
                            errors?.itiTradeName
                              ? errors.itiTradeName.message
                              : null
                          }
                        />
                      </Grid>
                      {/* registrationNo */}
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
                          label={labels.registrationNo}
                          // value={StudRegNo}
                          disabled={readonlyFields}
                          {...register("registrationNo")}
                          error={!!errors.registrationNo}
                          sx={{ width: 230 }}
                          InputProps={{
                            style: { fontSize: 18 },
                            // readOnly: readonlyFields
                          }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink: watch("registrationNo") ? true : false,
                          }}
                          helperText={
                            errors?.registrationNo
                              ? errors.registrationNo.message
                              : null
                          }
                        />
                      </Grid>
                      <Divider />
                      {/* parent/guardian details */}
                      <Grid
                        container
                        display="flex"
                        justifyContent="center"
                        justifyItems="center"
                        padding={2}
                        marginBottom={2}
                        sx={{
                          background:
                            "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                          borderRadius: "6% / 100%",
                        }}
                      >
                        <Grid item>
                          <h2 style={{ marginBottom: 0 }}>
                            {labels.studentParentInfo}
                          </h2>
                        </Grid>
                      </Grid>
                      {/* father 1st Name */}
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
                          label={labels.fatherFirstName}
                          disabled={readonlyFields}
                          {...register("fatherFirstName")}
                          error={!!errors.fatherFirstName}
                          sx={{ width: 230 }}
                          InputProps={{
                            style: { fontSize: 18 },
                          }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            shrink: watch("fatherFirstName") ? true : false,
                          }}
                          helperText={
                            errors?.fatherFirstName
                              ? errors.fatherFirstName.message
                              : null
                          }
                        />
                      </Grid>
                      {/* father middle Name */}
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
                          label={labels.fatherMiddleName}
                          disabled={readonlyFields}
                          {...register("fatherMiddleName")}
                          error={!!errors.fatherMiddleName}
                          sx={{ width: 230 }}
                          InputProps={{
                            style: { fontSize: 18 },
                          }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            shrink: watch("fatherMiddleName") ? true : false,
                          }}
                          helperText={
                            errors?.fatherMiddleName
                              ? errors.fatherMiddleName.message
                              : null
                          }
                        />
                      </Grid>
                      {/* father last Name */}
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
                          label={labels.fatherLastName}
                          disabled={readonlyFields}
                          {...register("fatherLastName")}
                          error={!!errors.fatherLastName}
                          sx={{ width: 230 }}
                          InputProps={{
                            style: { fontSize: 18 },
                          }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            shrink: watch("fatherLastName") ? true : false,
                          }}
                          helperText={
                            errors?.fatherLastName
                              ? errors.fatherLastName.message
                              : null
                          }
                        />
                      </Grid>
                      {/* Mother 1st Name */}
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
                          label={labels.motherName}
                          disabled={readonlyFields}
                          {...register("motherFirstName")}
                          error={!!errors.motherFirstName}
                          sx={{ width: 230 }}
                          InputProps={{
                            style: { fontSize: 18 },
                          }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            shrink: watch("motherFirstName") ? true : false,
                          }}
                          helperText={
                            errors?.motherFirstName
                              ? errors.motherFirstName.message
                              : null
                          }
                        />
                      </Grid>
                      <Divider />

                      {/*purposeOfBonafideEn */}
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
                        // value={birthPlace}
                        {...register("purposeOfBonafideEn")}
                        disabled={readonlyFields}
                        error={!!errors.purposeOfBonafideEn}
                        sx={{ width: 230 }}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          //true
                          shrink: watch("purposeOfBonafideEn") ? true : false,
                        }}
                        helperText={
                          errors?.purposeOfBonafideEn
                            ? errors.purposeOfBonafideEn.message
                            : null
                        }
                       
                      /> */}
                        <div style={{ width: "250px" }}>
                          <Transliteration
                            style={{
                              backgroundColor: "white",
                              margin: "250px",
                            }}
                            _key={"purposeOfBonafideEn"}
                            labelName={"purposeOfBonafideEn"}
                            fieldName={"purposeOfBonafideEn"}
                            updateFieldName={"purposeOfBonafideMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            disabled={readonlyFields}
                            label={`${labels.bonafiedPurpose} *`}
                            error={!!errors.purposeOfBonafideEn}
                            helperText={
                              errors?.purposeOfBonafideEn
                                ? labels.purposeOfBonafideEnReq
                                : null
                            }
                          />
                        </div>
                      </Grid>
                      {/*purposeOfBonafideMr */}
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
                        label={labels.bonafiedPurposeMr}
                        // value={birthPlace}
                        {...register("purposeOfBonafideMr")}
                        disabled={readonlyFields}
                        error={!!errors.purposeOfBonafideMr}
                        sx={{ width: 230 }}
                        InputProps={{
                          style: { fontSize: 18 },
                          // readOnly: readonlyFields
                        }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          //true
                          shrink: watch("purposeOfBonafideMr") ? true : false,
                        }}
                        helperText={
                            errors?.purposeOfBonafideMr ? errors.purposeOfBonafideMr.message : null
                        }
                      /> */}
                        <div style={{ width: "250px" }}>
                          <Transliteration
                            style={{
                              backgroundColor: "white",
                              margin: "250px",
                            }}
                            _key={"purposeOfBonafideMr"}
                            labelName={"purposeOfBonafideMr"}
                            fieldName={"purposeOfBonafideMr"}
                            updateFieldName={"purposeOfBonafideEn"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            disabled={readonlyFields}
                            label={`${labels.bonafiedPurposeMr} *`}
                            error={!!errors.purposeOfBonafideMr}
                            helperText={
                              errors?.purposeOfBonafideMr
                                ? labels.purposeOfBonafideMrReq
                                : null
                            }
                          />
                        </div>
                      </Grid>
                      {/* bonafide remark */}
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
                      {/* buttons */}

                      {/* {readonlyFields === true ? ( */}
                      {(authority?.includes("HOD") ||
                        rejectApplViewBtn ||
                        isGrpInstructorApproved === true) && (
                        <>
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
                                    // disabled={rejectApplViewBtn}
                                    error={!!errors.groupInstructorStatus}
                                    disabled={
                                      authority?.includes("HOD") ? false : true
                                    }
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
                                name="groupInstructorStatus"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText style={{ color: "red" }}>
                                {errors?.groupInstructorStatus
                                  ? labels.actionReq
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          {/* groupInstructorRemarksEn */}
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
                            <div style={{ width: "250px" }}>
                              <Transliteration
                                style={{
                                  backgroundColor: "white",
                                  margin: "250px",
                                }}
                                _key={"groupInstructorRemarksEn"}
                                labelName={"groupInstructorRemarksEn"}
                                fieldName={"groupInstructorRemarksEn"}
                                updateFieldName={"groupInstructorRemarksMr"}
                                sourceLang={"eng"}
                                targetLang={"mar"}
                                disabled={
                                  authority?.includes("HOD") ? false : true
                                }
                                label={labels.grpInstructorRemarksEn}
                                error={!!errors.groupInstructorRemarksEn}
                                targetError={"groupInstructorRemarksMr"}
                                InputLabelProps={{
                                  style: { fontSize: 15 },
                                  //true
                                  shrink: watch("groupInstructorRemarksEn")
                                    ? true
                                    : false,
                                }}
                                helperText={
                                  errors?.groupInstructorRemarksEn
                                    ? labels.groupInstructorRemarksEnReq
                                    : null
                                }
                              />
                            </div>
                          </Grid>
                          {/* groupInstructorRemarksMr */}
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
                            <div style={{ width: "250px" }}>
                              <Transliteration
                                style={{
                                  backgroundColor: "white",
                                  margin: "250px",
                                }}
                                _key={"groupInstructorRemarksMr"}
                                labelName={"groupInstructorRemarksMr"}
                                fieldName={"groupInstructorRemarksMr"}
                                updateFieldName={"groupInstructorRemarksEn"}
                                sourceLang={"mar"}
                                targetLang={"eng"}
                                disabled={
                                  authority?.includes("HOD") ? false : true
                                }
                                label={labels.grpInstructorRemarksMr}
                                error={!!errors.groupInstructorRemarksMr}
                                targetError={"groupInstructorRemarksEn"}
                                InputLabelProps={{
                                  style: { fontSize: 15 },
                                  //true
                                  shrink: watch("groupInstructorRemarksMr")
                                    ? true
                                    : false,
                                }}
                                helperText={
                                  errors?.groupInstructorRemarksMr
                                    ? labels.groupInstructorRemarksMrReq
                                    : null
                                }
                              />
                            </div>
                          </Grid>
                        </>
                      )}
                      {(authority?.includes("APPROVAL") ||
                        isPrincipleRej === true) && (
                        <>
                          <Divider />
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
                                    error={!!errors.principalStatus}
                                  >
                                    <MenuItem value="approve">
                                      {labels.approve}
                                    </MenuItem>
                                    <MenuItem value="reject">
                                      {labels.reject}
                                    </MenuItem>
                                  </Select>
                                )}
                                name="principalStatus"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText style={{ color: "red" }}>
                                {errors?.principalStatus
                                  ? labels.actionReq
                                  : null}
                              </FormHelperText>
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
                            <TextField
                              id="standard-basic"
                              variant="standard"
                              label={labels.principalRemarksEn}
                              {...register("principalRemarksEn")}
                              error={!!errors.principalRemarksEn}
                              sx={{ width: 230 }}
                              disabled={rejectApplViewBtn}
                              InputProps={{
                                style: { fontSize: 18 },
                                // readOnly: readonlyFields
                              }}
                              InputLabelProps={{ style: { fontSize: 15 } }}
                              helperText={
                                errors?.principalRemarksEn
                                  ? labels.principalRemarksRequiredEn
                                  : null
                              }
                            />
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
                            <TextField
                              id="standard-basic"
                              variant="standard"
                              label={labels.principalRemarksMr}
                              {...register("principalRemarksMr")}
                              error={!!errors.principalRemarksMr}
                              sx={{ width: 230 }}
                              disabled={rejectApplViewBtn}
                              InputProps={{
                                style: { fontSize: 18 },
                                // readOnly: readonlyFields
                              }}
                              InputLabelProps={{ style: { fontSize: 15 } }}
                              helperText={
                                errors?.principalRemarksMr
                                  ? labels.principalRemarksRequiredMr
                                  : null
                              }
                            />
                          </Grid>
                        </>
                      )}
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
                            // disabled={rejectApplViewBtn}
                            disabled={
                              authority.includes("CLERK") &&
                              rejectApplViewBtn === false
                                ? false
                                : true
                            }
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
                              setIsPrincipleRej(false);
                            }}
                          >
                            {labels.exit}
                          </Button>
                        </Grid>
                      </Grid>
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
                    getItiTraineeBonafide(data.pageSize, _data);
                  }}
                  onPageSizeChange={(_data) => {
                    console.log("222", _data);
                    // updateData("page", 1);
                    getItiTraineeBonafide(_data, data.page);
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
