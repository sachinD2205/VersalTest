import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/securityManagementSystemSchema/masters/building";
import { catchExceptionHandlingMethod } from "../../../../util/util";

function BuildingMaster() {
  // const {
  //   control,
  //   handleSubmit,
  //   reset,
  //   register,
  //   setValue,
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
    formState: { errors },
  } = methods;

  const [loading, setLoading] = useState(false);
  const [zoneKeys, setZoneKeys] = useState([]);
  const [wardKeys, setWardKeys] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [fetchData, setFetchData] = useState(null);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [rowId, setRowId] = useState("");

  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();
  const [nextEntryNumber, setNextEntryNumber] = useState();

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
    getDepartment();
    getZoneKeys();
    getWardKeys();
  }, []);

  useEffect(() => {
    getBuildingMaster();
  }, [zoneKeys, wardKeys]);

  useEffect(() => {
    getNextEntryNumber();
  }, []);

  const getNextEntryNumber = () => {
    axios
      .get(`${urls.SMURL}/mstBuildingMaster/getAutoGenBuildingId`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("Nex Entry Number", r);
        setNextEntryNumber(r.data);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getBuildingMaster = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    axios
      // .get(`${urls.SMURL}/mstBuildingMaster/getAll`, {
      .get(`${urls.SMURL}/mstBuildingMaster/getAll`, {
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
        console.log("building master", r);
        let result = r.data.mstBuildingMasterList;
        let _res = result?.map((r, i) => {
          return {
            id: r.id,
            // srNo: i + 1,
            srNo: _pageSize * _pageNo + i + 1,
            buildingAddress: r.buildingAddress,
            buildingFloor: r.buildingFloor,
            buildingName: r.buildingName,
            buildingNumber: r.buildingNumber,
            departmentKey: departments?.find(
              (obj) => obj?.id == r.departmentKey
            )?.department
              ? departments?.find((obj) => obj?.id == r.departmentKey)
                  ?.department
              : "-",
            remark: r.remark,
            wardKey: wardKeys?.find((obj) => obj?.id == r.wardKey)?.wardName
              ? wardKeys?.find((obj) => {
                  return obj?.id == r.wardKey;
                })?.wardName
              : "-",
            zoneKey: zoneKeys?.find((obj) => obj?.id == r.zoneKey)?.zoneName
              ? zoneKeys?.find((obj) => obj?.id == r.zoneKey)?.zoneName
              : "-",
            dept: r.departmentKey,
            ward: r.wardKey,
            zone: r.zoneKey,
            latitude: r.latitude,
            longitude: r.longitude,
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
        console.log("err", err);
        callCatchMethod(err, language);
        setLoading(false);
      });
  };

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

  const getZoneKeys = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setZoneKeys(
          r.data.zone.map((row) => ({
            id: row.id,
            zoneName: row.zoneName,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getWardKeys = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setWardKeys(
          r.data.ward.map((row) => ({
            id: row.id,
            wardName: row.wardName,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getFilterWards = (value) => {
    axios
      .get(
        `${urls.CFCURL}/master/zoneAndWardLevelMapping/getWardByDepartmentId`,
        {
          params: { departmentId: 21, zoneId: value.target.value },

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((r) => {
        console.log("Filtered Wards", r);
        setWardKeys(r.data);
      })
      ?.catch((err) => {
        setLoading(false);
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const onSubmit = (formData, btnType) => {
    console.log("formData", formData);
    let _body;
    if (btnSaveText === "Save" && btnType !== "Checkout") {
      _body = {
        ...formData,
      };
      console.log("1", _body);
    } else {
      _body = {
        ...formData,
        id: formData.id,
      };
      console.log("2", _body);
    }
    if (btnSaveText === "Save" && btnType !== "Checkout") {
      const tempData = axios
        .post(
          `${urls.SMURL}/mstBuildingMaster/save`,
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
          console.log("res", res);
          if (res.status == 201) {
            sweetAlert(
              language === "en" ? "Saved!" : "जतन केले!",
              language === "en"
                ? "Record Saved successfully !"
                : "रेकॉर्ड यशस्वीरित्या जतन केले!",
              "success"
            );
            getBuildingMaster();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            reset({
              ...resetValuesCancell,
            });
            window.location.reload();
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          setLoading(false);
          // if (
          //   err?.response?.data?.errors[0] ==
          //   "Only alphanumeric characters and spaces are allowed."
          // ) {
          //   sweetAlert(
          //     language === "en" ? "Error" : "त्रुटी",
          //     language === "en"
          //       ? "Only alphanumeric characters and spaces are allowed in building name"
          //       : "इमारतीच्या नावामध्ये फक्त अल्फान्यूमेरिक अक्षर आणि रिक्त स्थानांना अनुमती आहे.",
          //     "error"
          //   );
          // } else {
          callCatchMethod(err, language);
          // }
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update" || btnType === "Checkout") {
      console.log("current ", formData);
      // var d = new Date(); // for now
      // const currentTime = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
      const tempData = axios
        .post(
          `${urls.SMURL}/mstBuildingMaster/save`,
          {
            ...formData,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log("res up", res);
          if (res.status == 201) {
            formData.id
              ? sweetAlert(
                  language === "en" ? "Updated!" : "अद्यायावत केलेली",

                  language === "en"
                    ? "Record Updated successfully !"
                    : "रेकॉर्ड यशस्वीरित्या अद्यायावत केली!",
                  "success"
                )
              : sweetAlert(
                  language == "en" ? "Saved!" : "जतन केले!",

                  language == "en"
                    ? "Record Saved successfully !"
                    : "रेकॉर्ड यशस्वीरित्या जतन केले!",
                  "success"
                );
            setFetchData(tempData);
            setIsOpenCollapse(false);
            getBuildingMaster();
            setButtonInputState(false);
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
  };

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: language == "en" ? "Inactivate?" : "निष्क्रिय करा?",
        text:
          language == "en"
            ? "Are you sure you want to inactivate this Record?"
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.SMURL}/mstBuildingMaster/save`, body, {
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
                getBuildingMaster();
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
            ? "Are you sure you want to activate this Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता?",

        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.SMURL}/mstBuildingMaster/save`, body, {
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
                getBuildingMaster();
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

  const cancellButton = () => {
    console.log("23");
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const exitButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    buildingName: "",
    buildingFloor: "",
    buildingAddress: "",
    buildingNumber: "",
    departmentKey: null,
    zoneKey: null,
    wardKey: null,
    latitude: "",
    longitude: "",
    remark: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
      maxWidth: 60,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "buildingName",
      headerName: <FormattedLabel id="buildingName" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "buildingFloor",
      headerName: <FormattedLabel id="buildingFloor" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "buildingAddress",
      headerName: <FormattedLabel id="buildingAddress" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "buildingNumber",
      headerName: <FormattedLabel id="buildingNumber" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "departmentKey",
      headerName: <FormattedLabel id="departmentName" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "zoneKey",
      headerName: <FormattedLabel id="zone" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "wardKey",
      headerName: <FormattedLabel id="ward" />,
      flex: 1,
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
                    setValue("wardKey", params.row.ward);
                    setValue("zoneKey", params.row.zone);
                    setValue("departmentKey", params.row.dept);
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
                    setValue("wardKey", params.row.ward);
                    setValue("zoneKey", params.row.zone);
                    setValue("departmentKey", params.row.dept);
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
        <title>Building Master</title>
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
            <FormattedLabel id="buildingMaster" />
          </strong>
        </Typography>
      </Box>

      <Box>
        {loading ? (
          <Loader />
        ) : (
          <>
            {isOpenCollapse ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                <Paper>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="buildingId" />}
                        size="small"
                        fullWidth
                        disabled
                        InputLabelProps={{
                          shrink: true,
                        }}
                        {...register("building_id")}
                        value={nextEntryNumber}
                        sx={{ width: "90%" }}
                        error={!!errors.building_id}
                        helperText={
                          errors?.building_id
                            ? errors.building_id.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        // label="Building Number"
                        label={<FormattedLabel id="buildingNumber" required />}
                        size="small"
                        fullWidth
                        {...register("buildingNumber")}
                        sx={{ width: "90%" }}
                        InputLabelProps={{
                          shrink: watch("buildingNumber") ? true : false,
                        }}
                        error={!!errors.buildingNumber}
                        helperText={
                          errors?.buildingNumber
                            ? errors.buildingNumber.message
                            : null
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid xs={6} item>
                      <FormControl
                        fullWidth
                        size="small"
                        sx={{ width: "90%" }}
                        error={errors.zoneKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="zoneName" required />
                        </InputLabel>
                        <Controller
                          name="zoneKey"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              onChange={(value) => {
                                field.onChange(value);
                                getFilterWards(value);
                              }}
                              value={field.value}
                              fullWidth
                              label={<FormattedLabel id="zoneName" required />}
                            >
                              {zoneKeys.map((item, i) => {
                                return (
                                  <MenuItem key={i} value={item.id}>
                                    {item.zoneName}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          )}
                        />
                        <FormHelperText style={{ color: "red" }}>
                          {errors?.zoneKey ? errors.zoneKey.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid xs={6} item>
                      <FormControl
                        fullWidth
                        size="small"
                        sx={{ width: "90%" }}
                        error={errors.wardKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="wardName" required />
                        </InputLabel>
                        <Controller
                          name="wardKey"
                          defaultValue=""
                          control={control}
                          render={({ field }) => (
                            <Select
                              onChange={(value) => field.onChange(value)}
                              value={field.value}
                              fullWidth
                              label={<FormattedLabel id="wardName" required />}
                            >
                              {wardKeys.map((item, i) => {
                                return (
                                  <MenuItem key={i} value={item.id}>
                                    {item.wardName}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          )}
                        />
                        <FormHelperText style={{ color: "red" }}>
                          {errors?.wardKey ? errors.wardKey.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid xs={6} item>
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
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              fullWidth
                              label={<FormattedLabel id="deptName" required />}
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
                        label={<FormattedLabel id="buildingName" required />}
                        size="small"
                        fullWidth
                        {...register("buildingName")}
                        sx={{ width: "90%" }}
                        InputLabelProps={{
                          shrink: watch("buildingName") ? true : false,
                        }}
                        error={!!errors.buildingName}
                        helperText={
                          errors?.buildingName
                            ? errors.buildingName.message
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
                        label={<FormattedLabel id="floor" required />}
                        size="small"
                        fullWidth
                        {...register("buildingFloor")}
                        sx={{ width: "90%" }}
                        InputLabelProps={{
                          shrink: watch("buildingFloor") ? true : false,
                        }}
                        error={!!errors.buildingFloor}
                        helperText={
                          errors?.buildingFloor
                            ? errors.buildingFloor.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="buildingAddress" required />}
                        size="small"
                        fullWidth
                        {...register("buildingAddress")}
                        InputLabelProps={{
                          shrink: watch("buildingAddress") ? true : false,
                        }}
                        sx={{ width: "90%" }}
                        error={!!errors.buildingAddress}
                        helperText={
                          errors?.buildingAddress
                            ? errors.buildingAddress.message
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
                        label={<FormattedLabel id="latitude" required />}
                        size="small"
                        fullWidth
                        {...register("latitude")}
                        sx={{ width: "90%" }}
                        InputLabelProps={{
                          shrink: watch("latitude") ? true : false,
                        }}
                        error={!!errors.latitude}
                        helperText={
                          errors?.latitude ? errors.latitude.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="longitude" required />}
                        size="small"
                        fullWidth
                        {...register("longitude")}
                        sx={{ width: "90%" }}
                        InputLabelProps={{
                          shrink: watch("longitude") ? true : false,
                        }}
                        error={!!errors.longitude}
                        helperText={
                          errors?.longitude ? errors.longitude.message : null
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={6}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        label={<FormattedLabel id="remark" />}
                        size="small"
                        fullWidth
                        {...register("remark")}
                        sx={{ width: "90%" }}
                        InputLabelProps={{
                          shrink: watch("remark") ? true : false,
                        }}
                        error={!!errors.remark}
                        helperText={
                          errors?.remark ? errors.remark.message : null
                        }
                      />
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
                        {/* <FormattedLabel id="save" /> */}
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
                        onClick={() => {
                          cancellButton();
                        }}
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
                </Paper>
              </form>
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
                    autoHeight={data.pageSize}
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
                    // rows={dataSource}
                    // pageSize={5}
                    // rowsPerPageOptions={[5]}
                    //checkboxSelection

                    density="compact"
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
                      getBuildingMaster(data.pageSize, _data);
                    }}
                    onPageSizeChange={(_data) => {
                      getBuildingMaster(_data, data.page);
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
export default BuildingMaster;
