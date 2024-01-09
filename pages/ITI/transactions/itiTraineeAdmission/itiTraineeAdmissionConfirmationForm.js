import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import PrintIcon from "@mui/icons-material/Print";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../URLS/urls";
import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css";
import AdmissionConfirmationSlipToPrint from "../../../../components/school/admissionConfirmationSlipToPrint";
import { Divider } from "antd";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(itiTradeMasterSchema),
    mode: "onChange",
  });

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [readonlyFields, setReadonlyFields] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const [isReady, setIsReady] = useState("none");
  const [showSlip, setShowSlip] = useState(false);
  const [recieptData, setRecieptData] = useState();

  const router = useRouter();

  const [zoneKeys, setZoneKeys] = useState([]);
  const [wardKeys, setWardKeys] = useState([]);
  const [allWards, setAllWards] = useState([]);
  const [departmentKeys, setDepartmentKeys] = useState([]);
  const [subDepartmentKeys, setSubDepartmentKeys] = useState([]);
  const [itiKeys, setItiKeys] = useState([]);
  const [tradeKeys, setTradeKeys] = useState([]);
  const [allTradeKeys, setAllTradeKeys] = useState([]);
  const [studentCategoryKeys, setStudentCategoryKeys] = useState([]);
  const [genders, setGenders] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);

  const language = useSelector((state) => state.labels.language);
  const [labels, setLabels] = useState(schoolLabels[language ?? "en"]);

  useEffect(() => {
    setLabels(schoolLabels[language ?? "en"]);
  }, [setLabels, language]);
  let user = useSelector((state) => state.user.user);
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

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });
  useEffect(() => {
    if (recieptData && showTable === true) {
      handlePrint();
    }
  }, [recieptData]);

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
            itiType: data?.itiType,
            itiCode: data?.itiCode,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  };

  // get all trades
  const getAllTradeKeys = () => {
    axios.get(`${urls.SCHOOL}/mstItiTrade/getAll`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      setAllTradeKeys(
        r?.data?.mstItiTradeList?.map((row) => ({
          id: row.id,
          tradeName: row.tradeName,
        }))
      );
    })
    .catch((error) => {
      callCatchMethod(error, language);
    })
  };

  // getCastCategoryNames
  const getCastCategoryNames = () => {
    axios.get(`${urls.CFCURL}/castCategory/getAll`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      // console.log("castCategory/getAll", r);
      setStudentCategoryKeys(
        r?.data?.castCategory?.map((row) => ({
          id: row.id,
          castCategory: row.castCategory,
          castCategoryMr: row.castCategoryMr,
        }))
      );
    })
    .catch((error) => {
      callCatchMethod(error, language);
    })
  };
  // getCastCategoryNames
  const getGenders = () => {
    axios.get(`${urls.CFCURL}/master/gender/getAll`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      setGenders(
        r?.data?.gender?.map((row) => ({
          id: row.id,
          gender: row.gender,
          genderMr: row.genderMr,
        }))
      );
    })
    .catch((error) => {
      callCatchMethod(error, language);
    })
  };
  // getPaymentType
  const getPaymentType = () => {
    axios.get(`${urls.CFCURL}/master/paymentType/getAll`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      setPaymentTypes(
        r?.data?.paymentType?.map((row) => ({
          id: row.id,
          paymentType: row.paymentType,
          paymentTypeMr: row.paymentTypeMr,
        }))
      );
    })
    .catch((error) => {
      callCatchMethod(error, language);
    })
  };

  useEffect(() => {
    getItiKeys();
    getAllTradeKeys();
    getCastCategoryNames();
    getGenders();
    getPaymentType();
    // getPaymentMode();
  }, []);

  let paymentType = watch("paymentType");
  // getPaymentMode
  const getPaymentMode = () => {
    if (paymentType)
      axios
        .get(
          `${urls.CFCURL}/master/paymentMode/getAllByPaymentType?paymentType=${paymentType}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          setPaymentModes(
            r?.data?.paymentMode?.map((row) => ({
              id: row.id,
              paymentMode: row.paymentMode,
              paymentModeMr: row.paymentModeMr,
            }))
          );
        })
        .catch((error) => {
          callCatchMethod(error, language);
        })
  };
  useEffect(() => {
    getPaymentMode();
  }, [paymentType]);

  //   get  trades basedd on iti
  let allotedItiId = watch("itiKey");
  const getTradeKeys = () => {
    if (allotedItiId) {
      axios
        .get(
          `${urls.SCHOOL}/mstItiTrade/getDataOnItiKey?itiKey=${allotedItiId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
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
    getTradeKeys();
  }, [allotedItiId]);

  useEffect(() => {
    getItiTraineeAdmissionConfirmation();
  }, [allTradeKeys, fetchData, studentCategoryKeys]);

  // Get Table - Data
  const getItiTraineeAdmissionConfirmation = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(
        `${urls.SCHOOL}/TrnItiTraineeAdmissionConfirmation/getAllUserId?userId=${user.id}`,
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
        let result = r.data.trnItiTraineeAdmissionConfirmationDao;
        let _res = result.map((r, i) => {
          return {
            activeFlag: r.activeFlag,
            id: r?.id,
            srNo: i + 1,
            status: r.activeFlag === "Y" ? "Active" : "Inactive",

            firstName: r?.firstName,
            middleName: r?.middleName,
            lastName: r?.lastName,
            motherName: r?.motherName,

            traineeName: `${r?.firstName} ${r?.middleName} ${r?.lastName}`,
            studentCasteCategory: studentCategoryKeys?.find(
              (i) => i.id === r?.studentCategoryKey
            )?.castCategory,

            admissionFeesRs: r?.admissionFeesRs,
            studentCategoryKey: r?.studentCategoryKey,
            registrationNumber: r?.registrationNumber,
            mobileNumber: r?.mobileNumber,
            emailId: r?.emailId,
            uidNumber: r?.uidNumber,

            schoolLcOrTcl: r?.schoolLcOrTcl,
            casteCertficate: r?.casteCertficate,
            aadharCard: r?.aadharCard,
            drawingCertificate: r?.drawingCertificate,
            drawingCertificate: r?.drawingCertificate,
            sportsCertificate: r?.sportsCertificate,
            nonCreamaylayer: r?.nonCreamaylayer,
            otherDocument: r?.otherDocument,

            applicationNo: r?.applicationNo,

            itiKey: r?.itiKey,
            tradeKey: r?.tradeKey,
            gender: r?.gender,
            dateOfBirth: r?.dateOfBirth,
            admissionRound: r?.admissionRound,
            amountOfAdmissionFees: r?.amountOfAdmissionFees,
            admissionConfirmOn: r?.admissionConfirmOn,
            admissionIncharge: r?.admissionIncharge,
            principal: r?.principal,
            remark: r?.remark,

            paymentMode: r?.paymentMode,
            paymentType: r?.paymentType,
            itiCode: itiKeys?.find((i) => i.id === r?.itiKey)?.itiCode,
            nameOfItiAdmitted: itiKeys?.find((i) => i.id === r?.itiKey)
              ?.itiName,
            admittedTrade: allTradeKeys?.find((i) => i.id === r?.tradeKey)
              ?.tradeName,
            genderName: genders?.find((i) => i?.id === r?.gender)?.gender,
            genderNameMr: genders?.find((i) => i?.id === r?.gender)?.genderMr,
          };
        });
        setDataSource([..._res]);
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  };

  const onSubmitForm = (fromData) => {
    let _body = {
      ...fromData,
      activeFlag: fromData.activeFlag,
    };
    console.log("fromData", fromData);

    if (btnSaveText === "Save") {
      const tempData = axios
        .post(`${urls.SCHOOL}/TrnItiTraineeAdmissionConfirmation/save`, _body, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Saved!", "Record Saved successfully !", "success");
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setShowTable(true);
            setFetchData(tempData);
            setEditButtonInputState(false);
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        })
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      axios
        .post(`${urls.SCHOOL}/TrnItiTraineeAdmissionConfirmation/save`, _body, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          console.log("res", res);
          if (res.status == 201) {
            fromData.id
              ? sweetAlert(
                  "Updated!",
                  "Record Updated successfully !",
                  "success"
                )
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            getItiTraineeAdmissionConfirmation();
            setButtonInputState(false);
            setShowTable(true);
            setEditButtonInputState(false);
            setIsOpenCollapse(false);
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        })
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
            .post(
              `${urls.SCHOOL}/TrnItiTraineeAdmissionConfirmation/save`,
              body,
              {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              }
            )
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getItiTraineeAdmissionConfirmation();
                // setButtonInputState(false);
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            })
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
            .post(
              `${urls.SCHOOL}/TrnItiTraineeAdmissionConfirmation/save`,
              body,
              {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              }
            )
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Activated!", {
                  icon: "success",
                });
                // getPaymentRate();
                getItiTraineeAdmissionConfirmation();
                // setButtonInputState(false);
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            })
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
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    firstName: "",
    middleName: "",
    lastName: "",
    motherName: "",
    admissionFeesRs: "",
    registrationNumber: "",
    mobileNumber: "",
    emailId: "",
    gender: "",
    uidNumber: "",
    admissionRound: "",
    amountOfAdmissionFees: "",
    principal: "",
    admissionIncharge: "",
    remark: "",
    studentCategoryKey: "",
    itiKey: "",
    tradeKey: "",
    dateOfBirth: null,
    admissionConfirmOn: null,
    schoolLcOrTcll: false,
    casteCertficate: false,
    aadharCard: false,
    drawingCertificate: false,
    sportsCertificate: false,
    nonCreamaylayer: false,
    otherDocument: false,
    paymentType: "",
    paymentMode: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    id: null,

    firstName: "",
    middleName: "",
    lastName: "",
    motherName: "",
    admissionFeesRs: "",
    registrationNumber: "",
    mobileNumber: "",
    emailId: "",
    gender: "",
    uidNumber: "",
    admissionRound: "",
    amountOfAdmissionFees: "",
    admissionIncharge: "",
    principal: "",
    remark: "",
    itiKey: "",
    tradeKey: "",
    studentCategoryKey: "",
    dateOfBirth: null,
    admissionConfirmOn: null,
    schoolLcOrTcl: false,
    casteCertficate: false,
    aadharCard: false,
    drawingCertificate: false,
    sportsCertificate: false,
    nonCreamaylayer: false,
    otherDocument: false,
    paymentType: "",
    paymentMode: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: labels.srNo,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "traineeName",
      headerName: "Trainee Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "registrationNumber",
      headerName: "Registration Number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "mobileNumber",
      //   headerName: labels.schoolName,
      headerName: "Mobile Number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "emailId",
      //   headerName: labels.schoolName,
      headerName: "Email Id",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "uidNumber",
      //   headerName: labels.schoolName,
      headerName: "UID Number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "studentCasteCategory",
      //   headerName: labels.schoolName,
      headerName: "Cast Category",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "actions",
      headerName: labels.actions,
      width: 120,
      align: "center",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setShowTable(false),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setSlideChecked(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "Y")}
                />
              )}
            </IconButton>
            <IconButton
              onClick={() => {
                setRecieptData(params.row);
                setIsReady("none");
                // setShowSlip(!showSlip);
                // console.log("params", params.row);
              }}
            >
              <PrintIcon style={{ color: "#556CD6" }} />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  // Row

  return (
    <Paper
      elevation={8}
      variant="outlined"
      sx={{
        border: 1,
        borderColor: "grey.500",
        marginLeft: "10px",
        marginRight: "10px",
        // marginTop: "50px",
        // marginBottom: "60px",
        padding: 1,
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
        <h2>ITI Trainee Admission Confirmation Form</h2>
      </Box>
      <Paper style={{ display: isReady }}>
        {recieptData && showTable === true && (
          <AdmissionConfirmationSlipToPrint
            ref={componentRef}
            data={recieptData}
            // studentData={studentData}
            language={language}
          />
        )}
      </Paper>
      <Box
        sx={{
          marginLeft: 10,
          marginRight: 5,
          marginTop: 2,
          marginBottom: 3,
          padding: 1,
          // border: 1,
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
                  <Grid container>
                    {/* firstName */}
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
                        disabled={readonlyFields}
                        variant="standard"
                        label={"First Name"}
                        required
                        {...register("firstName")}
                        error={!!errors.firstName}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("firstName") ? true : false,
                        }}
                        helperText={
                          errors?.firstName ? errors.firstName.message : null
                        }
                      />
                    </Grid>
                    {/* middleName */}
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
                        required
                        label="Middle Name"
                        {...register("middleName")}
                        error={!!errors.middleName}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("middleName") ? true : false,
                        }}
                        helperText={
                          errors?.middleName ? errors.middleName.message : null
                        }
                      />
                    </Grid>
                    {/* lastName */}
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
                        required
                        label="Last Name"
                        {...register("lastName")}
                        error={!!errors.lastName}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("lastName") ? true : false,
                        }}
                        helperText={
                          errors?.lastName ? errors.lastName.message : null
                        }
                      />
                    </Grid>
                    {/* motherName */}
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
                        required
                        label="Mother Name"
                        {...register("motherName")}
                        error={!!errors.motherName}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("motherName") ? true : false,
                        }}
                        helperText={
                          errors?.motherName ? errors.motherName.message : null
                        }
                      />
                    </Grid>
                    {/* mobileNumber */}
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
                        required
                        label="Mobile Number"
                        {...register("mobileNumber")}
                        error={!!errors.mobileNumber}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("mobileNumber") ? true : false,
                        }}
                        helperText={
                          errors?.mobileNumber
                            ? errors.mobileNumber.message
                            : null
                        }
                      />
                    </Grid>
                    {/* emailId */}
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
                        required
                        label="Email"
                        {...register("emailId")}
                        error={!!errors.emailId}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("emailId") ? true : false,
                        }}
                        helperText={
                          errors?.emailId ? errors.emailId.message : null
                        }
                      />
                    </Grid>
                    {/* dateOfBirth */}
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
                        name="dateOfBirth"
                        rules={{ required: true }}
                        defaultValue={null}
                        render={({ field: { onChange, ...props } }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              label={
                                <span className="required">Date of Birth</span>
                              }
                              variant="standard"
                              inputFormat="DD/MM/YYYY"
                              {...props}
                              onChange={(date) =>
                                onChange(moment(date).format("YYYY-MM-DD"))
                              }
                              // selected={fromDate}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="standard"
                                  fullWidth
                                  // fullWidth
                                  sx={{ width: 230 }}
                                  size="small"
                                  error={!!errors.dateOfBirth}
                                  helperText={
                                    errors.dateOfBirth
                                      ? labels.dateOfBirthRequired
                                      : null
                                  }
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                    </Grid>

                    {/* gender */}
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
                        <InputLabel required error={!!errors.gender}>
                          Select Gender
                        </InputLabel>
                        <Controller
                          control={control}
                          name="gender"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              variant="standard"
                              {...field}
                              error={!!errors.gender}
                            >
                              {genders &&
                                genders.map((gender, index) => (
                                  <MenuItem key={index} value={gender.id}>
                                    {gender.gender}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText>
                          {errors?.gender ? errors.gender.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    {/* studentCategoryKey */}
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
                          error={!!errors.studentCategoryKey}
                        >
                          Student Category
                        </InputLabel>
                        <Controller
                          control={control}
                          name="studentCategoryKey"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              variant="standard"
                              {...field}
                              error={!!errors.studentCategoryKey}
                            >
                              {studentCategoryKeys &&
                                studentCategoryKeys.map((cate, index) => (
                                  <MenuItem key={index} value={cate.id}>
                                    {cate.castCategory}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText>
                          {errors?.studentCategoryKey
                            ? errors.studentCategoryKey.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    {/* registrationNumber */}
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
                        required
                        label="Registration Number"
                        {...register("registrationNumber")}
                        error={!!errors.registrationNumber}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("registrationNumber") ? true : false,
                        }}
                        helperText={
                          errors?.registrationNumber
                            ? errors.registrationNumber.message
                            : null
                        }
                      />
                    </Grid>
                    {/* uidNumber */}
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
                        required
                        label="UID Number"
                        {...register("uidNumber")}
                        error={!!errors.uidNumber}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("uidNumber") ? true : false,
                        }}
                        helperText={
                          errors?.uidNumber ? errors.uidNumber.message : null
                        }
                      />
                    </Grid>
                    {/* admissionRound */}
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
                        required
                        label="Admission Round"
                        {...register("admissionRound")}
                        error={!!errors.admissionRound}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("admissionRound") ? true : false,
                        }}
                        helperText={
                          errors?.admissionRound
                            ? errors.admissionRound.message
                            : null
                        }
                      />
                    </Grid>
                    {/* itiKey */}
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
                          {labels.allotedItiName}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="itiKey"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              // readOnly={readonlyFields}
                              disabled={readonlyFields}
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
                        <FormHelperText>
                          {errors?.itiKey ? errors.itiKey.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    {/* tradeKey */}
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
                          {labels.allotedTradeName}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="tradeKey"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              // readOnly={readonlyFields}
                              disabled={readonlyFields}
                              variant="standard"
                              {...field}
                              error={!!errors.tradeKey}
                            >
                              {tradeKeys &&
                                tradeKeys.map((trd) => (
                                  <MenuItem key={trd.id} value={trd.id}>
                                    {trd?.tradeName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText>
                          {errors?.tradeKey ? errors.tradeKey.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    {/* amountOfAdmissionFees */}
                    {/* <Grid
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
                        required
                        label="Amount Of Admission Fees"
                        {...register("amountOfAdmissionFees")}
                        error={!!errors.amountOfAdmissionFees}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("amountOfAdmissionFees") ? true : false,
                        }}
                        helperText={
                          errors?.amountOfAdmissionFees
                            ? errors.amountOfAdmissionFees.message
                            : null
                        }
                      />
                    </Grid> */}
                    {/* admissionConfirmOn */}
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
                        name="admissionConfirmOn"
                        rules={{ required: true }}
                        defaultValue={null}
                        render={({ field: { onChange, ...props } }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              label={
                                <span className="required">
                                  Admission Confirm On
                                </span>
                              }
                              variant="standard"
                              inputFormat="DD/MM/YYYY"
                              {...props}
                              onChange={(date) =>
                                onChange(moment(date).format("YYYY-MM-DD"))
                              }
                              // selected={fromDate}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="standard"
                                  fullWidth
                                  // fullWidth
                                  sx={{ width: 230 }}
                                  size="small"
                                  error={!!errors.admissionConfirmOn}
                                  helperText={
                                    errors.admissionConfirmOn
                                      ? labels.admissionConfirmOnRequired
                                      : null
                                  }
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                    </Grid>
                    {/* admissionIncharge */}
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
                        required
                        label="Admission Incharge"
                        {...register("admissionIncharge")}
                        error={!!errors.admissionIncharge}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("admissionIncharge") ? true : false,
                        }}
                        helperText={
                          errors?.admissionIncharge
                            ? errors.admissionIncharge.message
                            : null
                        }
                      />
                    </Grid>
                    {/* principal */}
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
                        required
                        label="Principal"
                        {...register("principal")}
                        error={!!errors.principal}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("principal") ? true : false,
                        }}
                        helperText={
                          errors?.principal ? errors.principal.message : null
                        }
                      />
                    </Grid>
                    {/* remark */}
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
                        required
                        label="Remark"
                        {...register("remark")}
                        error={!!errors.remark}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("remark") ? true : false,
                        }}
                        helperText={
                          errors?.remark ? errors.remark.message : null
                        }
                      />
                    </Grid>

                    <Divider />
                    {/* header docs submitted */}
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
                        <h2 style={{ marginBottom: 0 }}>Document Submitted</h2>
                      </Grid>
                    </Grid>
                    {/* Documents */}
                    <Grid
                      container
                      spacing={2}
                      //   justifyContent="center"
                      //   alignItems="center"
                      //   flexDirection="column"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                      flexDirection="column"
                      //   flexDirection="row"
                      sx={{ paddingLeft: "100px" }}
                    >
                      {/* schoolLcOrTcl */}
                      <Grid item>
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...register("schoolLcOrTcl")}
                              checked={watch("schoolLcOrTcl")}
                            />
                          }
                          label="1. School Leaving / Transfer Certificate :"
                          labelPlacement="start"
                          // sx={{
                          //   marginLeft: "10px", // Adjust the space between the label and Checkbox as needed
                          //   "& .MuiTypography-root": {
                          //     marginLeft: "50px", // Adjust the space between the label and Checkbox as needed
                          //   },
                          // }}
                        />
                      </Grid>
                      {/* aadharCard */}
                      <Grid item>
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...register("aadharCard")}
                              checked={watch("aadharCard")}
                            />
                          }
                          label="2. Aadhar Card :"
                          labelPlacement="start"
                        />
                      </Grid>
                      {/* casteCertficate */}
                      <Grid item>
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...register("casteCertficate")}
                              checked={watch("casteCertficate")}
                            />
                          }
                          label="3. Caste Certificate :"
                          labelPlacement="start"
                        />
                      </Grid>
                      {/* nonCreamaylayer */}
                      <Grid item>
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...register("nonCreamaylayer")}
                              checked={watch("nonCreamaylayer")}
                            />
                          }
                          label="4. Non Creamayler :"
                          labelPlacement="start"
                        />
                      </Grid>
                      {/* drawingCertificate */}
                      <Grid item>
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...register("drawingCertificate")}
                              checked={watch("drawingCertificate")}
                            />
                          }
                          label="5. Drawing Certificate :"
                          labelPlacement="start"
                        />
                      </Grid>
                      {/* sportsCertificate */}
                      <Grid item>
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...register("sportsCertificate")}
                              checked={watch("sportsCertificate")}
                            />
                          }
                          label="6. Sports Certificate :"
                          labelPlacement="start"
                        />
                      </Grid>
                      {/* otherDocument */}
                      <Grid item>
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...register("otherDocument")}
                              checked={watch("otherDocument")}
                            />
                          }
                          label="7. Other Documents :"
                          labelPlacement="start"
                        />
                      </Grid>
                    </Grid>
                    <Divider />
                    {/* admissionFeeRs */}
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
                        // variant="standard"
                        variant="outlined"
                        required
                        // label="Admission Fees Rs"
                        label={<span>Admission Fees &#x20B9;</span>}
                        {...register("admissionFeesRs")}
                        error={!!errors.admissionFeesRs}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("admissionFeesRs") ? true : false,
                        }}
                        helperText={
                          errors?.admissionFeesRs
                            ? errors.admissionFeesRs.message
                            : null
                        }
                      />
                    </Grid>
                    {/* paymentType */}
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
                        <InputLabel required error={!!errors.paymentType}>
                          Payment Type
                        </InputLabel>
                        <Controller
                          control={control}
                          name="paymentType"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              label="Payment Type"
                              variant="outlined"
                              {...field}
                              error={!!errors.paymentType}
                            >
                              {paymentTypes &&
                                paymentTypes.map((paymentType) => (
                                  <MenuItem
                                    key={paymentType.id}
                                    value={paymentType.id}
                                  >
                                    {language == "en"
                                      ? paymentType?.paymentType
                                      : paymentType?.paymentTypeMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText>
                          {errors?.paymentMode
                            ? errors.paymentMode.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    {/* paymentMode */}
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
                        <InputLabel required error={!!errors.paymentMode}>
                          Payment Mode
                        </InputLabel>
                        <Controller
                          control={control}
                          name="paymentMode"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              label="Payment Mode"
                              variant="outlined"
                              {...field}
                              error={!!errors.paymentMode}
                            >
                              {paymentModes &&
                                paymentModes.map((paymentMode) => (
                                  <MenuItem
                                    key={paymentMode.id}
                                    value={paymentMode.id}
                                  >
                                    {language == "en"
                                      ? paymentMode?.paymentMode
                                      : paymentMode?.paymentModeMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText>
                          {errors?.paymentMode
                            ? errors.paymentMode.message
                            : null}
                        </FormHelperText>
                      </FormControl>
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
                          sx={{ marginRight: 8 }}
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
                          onClick={() => exitButton()}
                        >
                          {labels.exit}
                        </Button>
                      </Grid>
                    </Grid>
                    {/* </div> */}
                  </Grid>
                </Slide>
              )}
            </form>
          </FormProvider>
        </Box>
      </Box>

      <div className={styles.addbtn}>
        <Button
          variant="contained"
          endIcon={<AddIcon />}
          // type='primary'
          disabled={buttonInputState}
          onClick={() => {
            reset({
              ...resetValuesExit,
            });
            setEditButtonInputState(true);
            setBtnSaveText("Save");
            setButtonInputState(true);
            setSlideChecked(true);
            setIsOpenCollapse(!isOpenCollapse);
            setShowTable(false);
          }}
        >
          {labels.add}
        </Button>
      </div>

      {showTable && (
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
          }}
          density="compact"
          // autoHeight={true}
          // rowHeight={50}
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
            getItiTraineeAdmissionConfirmation(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            console.log("222", _data);
            // updateData("page", 1);
            getItiTraineeAdmissionConfirmation(_data, data.page);
          }}
        />
      )}
    </Paper>
  );
};

export default Index;
