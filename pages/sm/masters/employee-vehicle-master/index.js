import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import sweetAlert from "sweetalert";
import schema from "../../../../containers/schema/securityManagementSystemSchema/masters/employeeVehicle";

import { yupResolver } from "@hookform/resolvers/yup";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { toast } from "react-toastify";

function EmployeeVehicle() {
  // const {
  //   control,
  //   handleSubmit,
  //   register,
  //   watch,
  //   setValue,
  //   reset,
  //   formState: { errors },
  // } = useForm({
  //   resolver: yupResolver(schema),
  // });

  const language = useSelector((state) => state?.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema(language)),
    mode: "onChange",
    defaultValues: {},
  });
  const {
    control,
    register,
    reset,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isDirty },
  } = methods;

  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [fetchData, setFetchData] = useState(null);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [rowId, setRowId] = useState("");
  const [id, setID] = useState();
  const [slideChecked, setSlideChecked] = useState(false);
  const [nextEntryNumber, setNextEntryNumber] = useState();
  const textFieldRef = useRef(null);
  const clickOutsideHandlerRef = useRef(null);

  const handleTextFieldBlur = () => {
    if (isDirty && !clickOutsideHandlerRef.current) {
      getEmployeeDetails();
      // Bind the event listener for the first time only
      document.addEventListener("mousedown", clickOutsideHandlerRef.current);
    }
  };

  const getEmployeeDetails = () => {
    let selectedEmployee = users?.filter((item) => {
      return item.empCode === watch("employeeKey");
    });

    if (selectedEmployee?.length > 0) {
      setValue(
        "employeeName",
        selectedEmployee[0]?.firstNameEn + " " + selectedEmployee[0]?.lastNameEn
      );
      setValue("employeeMobileNumber", selectedEmployee[0]?.phoneNo);
    } else {
      toast(
        language === "en"
          ? "Wrong employee Id/Code or user not found !!!"
          : "चुकीचा कर्मचारी आयडी/कोड किंवा वापरकर्ता सापडला नाही !!!",
        {
          type: "error",
        }
      );
    }
  };

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );

  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

  let user = useSelector((state) => state.user.user);

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  console.log("authority", authority);

  useEffect(() => {
    // getUserName();
    getBasicUserDetails();
    getDepartment();
    getVehicleTypes();
  }, []);

  useEffect(() => {
    getNextEntryNumber();
  }, []);

  const getNextEntryNumber = () => {
    axios
      .get(`${urls.SMURL}/mstEmployeeVehicleMaster/getAutoGenVehicleId`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("Nex Entry Number", r);
        setNextEntryNumber(r.data);
      })
      ?.catch((err) => {
        setLoading(false);
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  useEffect(() => {
    getVehicleMaster();
    setValue("departmentKey", 27);
  }, [users]);

  const getDepartment = () => {
    axios
      .get(`${urls.CfcURLMaster}/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDepartments(
          res.data.department.map((r, i) => ({
            id: r.id,
            department: r.department,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const resetValuesCancell = {
    departmentKey: "",
    vehicleNumber: "",
    vehicleId: "",
    vehicleType: "",
    employeeKey: "",
    employeeName: "",
    employeeMobileNumber: "",
    vehicleAllotedAt: null,
    licenseNo: "",
    remark: "",
    officerName: "",
    officeMobileNumber: "",
    officeAddress: "",
  };

  const getUserName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/user/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          console.log("res user", r);
          setUsers(r.data.user);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getBasicUserDetails = () => {
    axios
      .get(`${urls.CFCURL}/master/user/getUserBasicDetails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("getBasicUserDetails", res);
        let _res = res.data.userList;
        setUsers(_res);
      })
      ?.catch((err) => {
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const [vehicleTypes, setVehicleTypes] = useState([]);

  const getVehicleTypes = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    axios
      .get(`${urls.SMURL}/mstVehicleType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("building master", r);
        let result = r?.data?.mstVehicleTypeList;
        setVehicleTypes(result);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getVehicleMaster = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);

    axios
      .get(`${urls.SMURL}/mstEmployeeVehicleMaster/getAll`, {
        params: {
          sortKey: "id",
          sortDir: "dsc",
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("vehicle master", r);
        let result = r.data.mstEmployeeVehicleMasterList;
        let _res = result?.map((r, i) => {
          return {
            id: r.id,
            srNo: _pageSize * _pageNo + i + 1,
            departmentKey: departments?.find(
              (obj) => obj?.id == r.departmentKey
            )?.department
              ? departments?.find((obj) => obj?.id == r.departmentKey)
                  ?.department
              : "-",
            employeeKey: users?.find((obj) => obj?.id == r.employeeKey)
              ?.firstNameEn
              ? users?.find((obj) => obj?.id == r.employeeKey)?.firstNameEn
              : "-",
            // employeeKey: r.employeeKey,
            employeeMobileNumber: r.employeeMobileNumber,
            employeeName: r.employeeName,
            vehicleAllotedAt: r.vehicleAllotedAt
              ? moment(r.vehicleAllotedAt, "YYYY-MM-DD").format("DD-MM-YYYY")
              : "-",
            vehicleNumber: r.vehicleNumber,
            licenseNo: r.licenseNo,
            vehicleType: r.vehicleType,
            remark: r.remark,
            val: r?.vehicleAllotedAt,
            dept: r?.departmentKey,
            emp: r?.employeeKey,
            officerName: r?.officerName,
            officeMobileNumber: r?.officeMobileNumber,
            officeAddress: r?.officeAddress,
            fromDateAllocated: r?.fromDateAllocated,
            toDateAllocated: r?.toDateAllocated,
            activeFlag: r.activeFlag,
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const onSubmit = (formData, btnType) => {
    console.log("formData", formData, btnSaveText);
    let _body;
    if (btnSaveText === "Save" && btnType !== "Checkout") {
      _body = {
        ...formData,
        departmentKey: Number(formData.departmentKey),
        employeeKey: Number(formData.employeeKey),
        vehicle_id: Number(formData.vehicle_id),
        vehicleAllotedAt: moment(formData?.vehicleAllotedAt).format(
          "YYYY-MM-DDThh:mm:ss"
        ),
        toDateAllocated: moment(formData?.toDateAllocated).format(
          "YYYY-MM-DDThh:mm:ss"
        ),
        fromDateAllocated: moment(formData?.fromDateAllocated).format(
          "YYYY-MM-DDThh:mm:ss"
        ),
      };
      console.log("1", _body);
    } else {
      _body = {
        ...formData,
        id: formData.id,
        departmentKey: Number(formData.departmentKey),
        employeeKey: Number(formData.employeeKey),
        vehicle_id: Number(formData.vehicle_id),
        vehicleAllotedAt: moment(formData?.vehicleAllotedAt).format(
          "YYYY-MM-DDThh:mm:ss"
        ),
      };
      console.log("2", _body);
    }
    if (btnSaveText === "Save" && btnType !== "Checkout") {
      const tempData = axios
        .post(
          `${urls.SMURL}/mstEmployeeVehicleMaster/save`,
          {
            ..._body,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res.status == 201) {
            sweetAlert(
              language === "en" ? "Saved!" : "जतन केले!",
              language === "en"
                ? "Record Saved successfully !"
                : "रेकॉर्ड यशस्वीरित्या जतन केले!",
              "success"
            );
            getVehicleMaster();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            reset({
              ...resetValuesCancell,
            });
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          setLoading(false);
          callCatchMethod(err, language);
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update" || btnType === "Checkout") {
      console.log("current ", formData);
      // var d = new Date(); // for now
      // const currentTime = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
      const tempData = axios
        .post(
          `${urls.SMURL}/mstEmployeeVehicleMaster/save`,
          {
            ..._body,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res.status == 201) {
            formData.id
              ? sweetAlert(
                  language === "en" ? "Updated!" : "अद्यायावत केलेली",
                  language === "en"
                    ? "Record Updated successfully !"
                    : "रेकॉर्ड यशस्वीरित्या अद्यायावत केले!",
                  "success"
                )
              : sweetAlert(
                  language === "en" ? "Saved!" : "जतन केले!",
                  language === "en"
                    ? "Record Saved successfully !"
                    : "रेकॉर्ड यशस्वीरित्या जतन केले!",
                  "success"
                );
            setFetchData(tempData);
            setIsOpenCollapse(false);
            getVehicleMaster();
            setButtonInputState(false);
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
  };

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: language === "en" ? "Inactivate?" : "निष्क्रिय करायचे?",
        text:
          language === "en"
            ? "Are you sure you want to inactivate this Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.SMURL}/mstEmployeeVehicleMaster/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal(
                  language === "en"
                    ? "Record is Successfully Inactivated!"
                    : "रेकॉर्ड यशस्वीरित्या निष्क्रिय केले आहे!",
                  {
                    icon: "success",
                  }
                );
                getVehicleMaster();
                // setButtonInputState(false);
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              setLoading(false);
              callCatchMethod(err, language);
            });
        } else if (willDelete == null) {
          swal(language === "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे");
        }
      });
    } else {
      swal({
        title: language === "en" ? "Activate?" : "सक्रिय करायचे?",
        text:
          language === "en"
            ? "Are you sure you want to activate this Record ?"
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.SMURL}/mstEmployeeVehicleMaster/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal(
                  language === "en"
                    ? "Record is Successfully Activated!"
                    : "रेकॉर्ड यशस्वीरित्या सक्रिय केले आहे!",
                  {
                    icon: "success",
                  }
                );
                // getPaymentRate();
                getVehicleMaster();
                // setButtonInputState(false);
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              setLoading(false);
              callCatchMethod(err, language);
            });
        } else if (willDelete == null) {
          swal(language === "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे");
        }
      });
    }
  };

  const exitButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
      maxWidth: 60,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "vehicleType",
      headerName: <FormattedLabel id="vehicleType" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "vehicleNumber",
      headerName: <FormattedLabel id="vehicleNumber" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "vehicleAllotedAt",
      headerName: <FormattedLabel id="vehicleAllotedAt" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "employeeName",
      headerName: <FormattedLabel id="employeeName" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "departmentKey",
      headerName: <FormattedLabel id="departmentName" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "employeeMobileNumber",
      headerName: <FormattedLabel id="employeeMobileNumber" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: true,
      field: "employeeKey",
      headerName: <FormattedLabel id="employeeKey" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            {authority?.includes("HOD") && (
              <>
                <IconButton
                  onClick={() => {
                    setBtnSaveText("Update"),
                      setID(params.row.id),
                      setIsOpenCollapse(true),
                      setSlideChecked(true);
                    setButtonInputState(true);
                    console.log("params.row: ", params.row);
                    reset(params.row);
                    setValue("vehicleAllotedAt", params.row.val);
                    setValue("departmentKey", params.row.dept);
                    setValue("employeeKey", params.row.emp);
                    setValue("vehicleType", params.row.vehicleType);
                    setValue("remark", params.row.remark);
                  }}
                >
                  <EditIcon style={{ color: "#556CD6" }} />
                </IconButton>

                <IconButton
                  onClick={() => {
                    setBtnSaveText("Update"),
                      setID(params.row.id),
                      //   setIsOpenCollapse(true),
                      setSlideChecked(true);
                    // setButtonInputState(true);
                    console.log("params.row: ", params.row);
                    reset(params.row);
                    setValue("vehicleAllotedAt", params.row.val);
                    setValue("departmentKey", params.row.dept);
                    setValue("employeeKey", params.row.emp);
                    setValue("vehicleType", params.row.vehicleType);
                    setValue("remark", params.row.remark);
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
              </>
            )}
          </Box>
        );
      },
    },
  ];

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

  return (
    <>
      <Head>
        <title>PCMC Vehicle</title>
      </Head>
      <Box>
        <BreadcrumbComponent />
      </Box>
      <Box
        sx={{
          backgroundColor: "#556CD6",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 30,
          padding: "5px",
          // background:
          //   "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <Typography
          style={{
            color: "white",
            fontSize: "19px",
          }}
        >
          <strong>
            {" "}
            <FormattedLabel id="employeeVehicle" />
          </strong>
        </Typography>
      </Box>
      <Box>
        {loading ? (
          <Loader />
        ) : (
          <>
            {isOpenCollapse ? (
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="vehicleId" />}
                        size="small"
                        value={nextEntryNumber}
                        fullWidth
                        disabled
                        InputLabelProps={{
                          shrink: true,
                        }}
                        {...register("vehicle_id")}
                        sx={{ width: "90%" }}
                        error={!!errors.vehicle_id}
                        helperText={
                          errors?.vehicle_id ? errors.vehicle_id.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="vehicleNumber" required />}
                        size="small"
                        fullWidth
                        {...register("vehicleNumber")}
                        sx={{ width: "90%" }}
                        InputLabelProps={{
                          shrink: watch("vehicleNumber") ? true : false,
                        }}
                        error={!!errors.vehicleNumber}
                        helperText={
                          errors?.vehicleNumber
                            ? errors.vehicleNumber.message
                            : null
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={6}>
                      <FormControl
                        error={errors.employeeKey}
                        variant="outlined"
                        size="small"
                        sx={{ width: "90%" }}
                      >
                        <Controller
                          name="employeeKey"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              {...field}
                              size="small"
                              ref={textFieldRef}
                              onBlur={handleTextFieldBlur}
                              label={<FormattedLabel id="employeeId" />}
                              variant="outlined"
                            />
                          )}
                        />
                        <FormHelperText>
                          {errors?.employeeKey
                            ? errors.employeeKey.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                      {/* <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="employeeId" required />}
                        size="small"
                        fullWidth
                        {...register("employeeKey")}
                        sx={{ width: "90%" }}
                        InputLabelProps={{
                          shrink: watch("employeeKey") ? true : false,
                        }}
                        error={!!errors.employeeKey}
                        helperText={
                          errors?.employeeKey
                            ? errors.employeeKey.message
                            : null
                        }
                      /> */}
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={
                          <FormattedLabel id="employeeMobileNumber" required />
                        }
                        size="small"
                        fullWidth
                        {...register("employeeMobileNumber")}
                        sx={{ width: "90%" }}
                        InputLabelProps={{
                          shrink: watch("employeeMobileNumber") ? true : false,
                        }}
                        error={!!errors.employeeMobileNumber}
                        helperText={
                          errors?.employeeMobileNumber
                            ? errors.employeeMobileNumber.message
                            : null
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={6}>
                      <FormControl
                        fullWidth
                        sx={{ width: "90%" }}
                        error={!!errors.vehicleAllotedAt}
                      >
                        <Controller
                          control={control}
                          name="vehicleAllotedAt"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                disablePast
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel
                                      id="vehicleAllotedDate"
                                      required
                                    />
                                  </span>
                                }
                                value={field.value || null}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
                                  )
                                }
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    error={!!errors.vehicleAllotedAt}
                                    size="small"
                                    fullWidth
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.vehicleAllotedAt
                            ? errors.vehicleAllotedAt.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl
                        fullWidth
                        sx={{ width: "90%" }}
                        error={!!errors.vehicleType}
                        size="small"
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="vehicleType" required />
                        </InputLabel>
                        <Controller
                          name="vehicleType"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              // {...field}
                              onChange={(value) => field.onChange(value)}
                              value={field.value}
                              size="small"
                              label={
                                <FormattedLabel id="vehicleType" required />
                              }
                            >
                              {vehicleTypes?.map((item, i) => {
                                return (
                                  <MenuItem key={i} value={item?.vehicleType}>
                                    {language == "en"
                                      ? item?.vehicleType
                                      : item?.vehicleTypeMr}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          )}
                        />
                        <FormHelperText>
                          {errors?.vehicleType
                            ? errors.vehicleType.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={6}>
                      <FormControl
                        fullWidth
                        size="small"
                        sx={{ width: "90%" }}
                        error={errors.departmentKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="deptName" required />
                        </InputLabel>
                        <Controller
                          name="departmentKey"
                          // defaultValue={27}
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              value={field.value}
                              fullWidth
                              label={<FormattedLabel id="deptName" />}
                            >
                              {departments?.map((item, i) => {
                                return (
                                  <MenuItem key={i} value={item.id}>
                                    {item.department}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          )}
                        />
                        <FormHelperText style={{ color: "red" }}>
                          {errors?.departmentKey
                            ? errors.departmentKey.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="employeeName" required />}
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          shrink: watch("employeeName") ? true : false,
                        }}
                        {...register("employeeName")}
                        sx={{ width: "90%" }}
                        error={!!errors.employeeName}
                        helperText={
                          errors?.employeeName
                            ? errors.employeeName.message
                            : null
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="licenseNo" />}
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          shrink: watch("licenseNo") ? true : false,
                        }}
                        {...register("licenseNo")}
                        sx={{ width: "90%" }}
                        error={!!errors.licenseNo}
                        helperText={
                          errors?.licenseNo ? errors.licenseNo.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="remark" />}
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          shrink: watch("remark") ? true : false,
                        }}
                        {...register("remark")}
                        sx={{ width: "90%" }}
                        error={!!errors.remark}
                        helperText={
                          errors?.remark ? errors.remark.message : null
                        }
                      />
                    </Grid>
                  </Grid>
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      paddingTop: "10px",
                      background:
                        "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                    }}
                  >
                    <h2>
                      <FormattedLabel id="vehicleAssign" />
                    </h2>
                  </Box>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="officerName" required />}
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          shrink: watch("officerName") ? true : false,
                        }}
                        {...register("officerName")}
                        sx={{ width: "90%" }}
                        error={!!errors.officerName}
                        helperText={
                          errors?.officerName
                            ? errors.officerName.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={
                          <FormattedLabel id="officeMobileNumber" required />
                        }
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          shrink: watch("officeMobileNumber") ? true : false,
                        }}
                        {...register("officeMobileNumber")}
                        sx={{ width: "90%" }}
                        error={!!errors.officeMobileNumber}
                        helperText={
                          errors?.officeMobileNumber
                            ? errors.officeMobileNumber.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={6} sx={{ paddingTop: "2vh" }}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="officeAddress" />}
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          shrink: watch("officeAddress") ? true : false,
                        }}
                        {...register("officeAddress")}
                        sx={{ width: "90%" }}
                        error={!!errors.officeAddress}
                        helperText={
                          errors?.officeAddress
                            ? errors.officeAddress.message
                            : null
                        }
                      />
                    </Grid>
                  </Grid>

                  {/* fromDateAllocated toDateAllocated */}
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={6}>
                      <FormControl
                        fullWidth
                        sx={{ width: "90%" }}
                        error={!!errors.fromDateAllocated}
                      >
                        <Controller
                          control={control}
                          name="fromDateAllocated"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                disablePast
                                minDate={watch("vehicleAllotedAt")}
                                disabled={!watch("vehicleAllotedAt")}
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel
                                      id="fromDateAllocated"
                                      required
                                    />
                                  </span>
                                }
                                value={field.value || null}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
                                  )
                                }
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    error={!!errors.fromDateAllocated}
                                    size="small"
                                    fullWidth
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.fromDateAllocated
                            ? errors.fromDateAllocated.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl
                        fullWidth
                        sx={{ width: "90%" }}
                        error={!!errors.toDateAllocated}
                      >
                        <Controller
                          control={control}
                          name="toDateAllocated"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                // inputFormat="MM/DD/YYYY"
                                inputFormat="DD/MM/YYYY"
                                disablePast
                                minDate={watch("fromDateAllocated")}
                                disabled={!watch("fromDateAllocated")}
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel
                                      id="toDateAllocated"
                                      required
                                    />
                                  </span>
                                }
                                value={field.value || null}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
                                  )
                                }
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    error={!!errors.toDateAllocated}
                                    size="small"
                                    fullWidth
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.toDateAllocated
                            ? errors.toDateAllocated.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={4}
                      sx={{ display: "flex", justifyContent: "end" }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        type="submit"
                        color="success"
                        endIcon={<SaveIcon />}
                      >
                        <FormattedLabel id={btnSaveText} />
                      </Button>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        endIcon={<ClearIcon />}
                        onClick={() =>
                          reset({
                            ...resetValuesCancell,
                          })
                        }
                      >
                        <FormattedLabel id="clear" />
                      </Button>
                    </Grid>
                    <Grid item xs={4}>
                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => {
                          setIsOpenCollapse(!isOpenCollapse);
                          exitButton();
                        }}
                      >
                        <FormattedLabel id="exit" />
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </FormProvider>
            ) : (
              <>
                {authority?.includes("HOD") && (
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid xs={11}></Grid>
                    <Grid xs={1}>
                      <Button
                        variant="contained"
                        endIcon={<AddIcon />}
                        onClick={() => {
                          setEditButtonInputState(true);
                          setDeleteButtonState(true);
                          setBtnSaveText("Save");
                          // setButtonInputState(true);
                          // setSlideChecked(true);
                          setIsOpenCollapse(!isOpenCollapse);
                        }}
                      >
                        <FormattedLabel id="add" />
                      </Button>
                    </Grid>
                  </Grid>
                )}
                <Grid container xs={{ padding: "10px" }}>
                  <DataGrid
                    // disableColumnFilter
                    // disableColumnSelector
                    // disableToolbarButton
                    // disableDensitySelector
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
                    autoHeight
                    sx={{
                      // marginLeft: 5,
                      // marginRight: 5,
                      // marginTop: 5,
                      // marginBottom: 5,
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
                    // rows={dataSource}
                    // pageSize={5}
                    // rowsPerPageOptions={[5]}
                    //checkboxSelection

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
                      getVehicleMaster(data.pageSize, _data);
                    }}
                    onPageSizeChange={(_data) => {
                      getVehicleMaster(_data, data.page);
                    }}
                  />
                </Grid>
              </>
            )}
          </>
        )}
      </Box>
    </>
  );
}
export default EmployeeVehicle;
