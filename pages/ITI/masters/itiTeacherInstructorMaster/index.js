import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Checkbox,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css";
import { yupResolver } from "@hookform/resolvers/yup";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { GridToolbar } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import urls from "../../../../URLS/urls";
import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
import itiTeacherOrInstructorMasterSchema from "../../../../containers/schema/iti/masters/itiTeacherOrInstructorMasterSchema";
import Loader from "../../../../containers/Layout/components/Loader";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(itiTeacherOrInstructorMasterSchema),
    mode: "onChange",
  });

  const [loading, setLoading] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const router = useRouter();

  const options = [
    { id: 1, label: "isInstructor", value: true },
    { id: 2, label: "isTeacher", value: true },
  ];

  const [tradeKeys, setTradeKeys] = useState([]);
  const [itiKeys, setItiKeys] = useState([]);
  const [allTradeKeys, setAllTradeKeys] = useState([]);
  const [teacherTypes, setTeacherTypes] = useState([]);

  const language = useSelector((state) => state.labels.language);
  const [labels, setLabels] = useState(schoolLabels[language ?? "en"]);

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

  useEffect(() => {
    if (teacherTypes?.length > 0) {
      setValue("teacherType", true);
    }
  }, [teacherTypes]);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const itiId = watch("itiKey");

  //   get all itiKeys
  const getAllItiKeys = () => {
    axios
      .get(`${urls.SCHOOL}/mstIti/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setItiKeys(
          r?.data?.mstItiList?.map((data) => ({
            id: data?.id,
            itiName: data?.itiName,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  //   get All tradeKeys Names
  const getAllTradeKeys = () => {
    axios
      .get(`${urls.SCHOOL}/mstItiTrade/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setAllTradeKeys(
          r?.data?.mstItiTradeList?.map((data) => ({
            id: data?.id,
            tradeName: data?.tradeName,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    getAllItiKeys();
    getAllTradeKeys();
  }, []);

  //   get  trades
  const getTradeKeysByIti = () => {
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
        });
    }
  };
  useEffect(() => {
    getTradeKeysByIti();
  }, [itiId]);

  const handleTeacherTypes = (event, typeId) => {
    if (typeId === "all") {
      if (event.target.checked) {
        setTeacherTypes(options.map((opt) => opt.id));
      } else {
        setTeacherTypes([]);
      }
    } else {
      if (event.target.checked) {
        setTeacherTypes([...teacherTypes, typeId]);
      } else {
        setTeacherTypes(teacherTypes?.filter((id) => id !== typeId));
      }
    }
  };

  useEffect(() => {
    getTeacherInstructorMaster();
  }, [allTradeKeys, itiKeys, fetchData]);

  // Get Table - Data
  const getTeacherInstructorMaster = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    setLoading(true);
    axios
      .get(`${urls.SCHOOL}/mstItiTeacherAndInstructorController/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        console.log("r", r);
        let result = r?.data?.mstItiTeacherAndInstructorDao;
        let page = r?.data?.pageSize * r?.data?.pageNo;
        console.log("result", result);

        let _res = result?.map((r, i) => {
          console.log("44");
          return {
            activeFlag: r.activeFlag,
            id: r?.id,
            srNo: i + 1 + page,

            itiKey: r?.itiKey,
            itiName: itiKeys?.find((i) => i?.id === r?.itiKey)?.itiName,
            tradeKey: r?.tradeKey,
            tradeName: allTradeKeys?.find((i) => i?.id === r?.tradeKey)
              ?.tradeName,
            firstName: r?.firstName,
            middleName: r?.middleName,
            lastName: r?.lastName,
            fullName: `${r?.firstName} ${r?.middleName} ${r?.lastName}`,
            ...r,
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
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

  const onSubmitForm = (fromData) => {
    if (teacherTypes.length == 0) {
      setError("teacherType", "test");
      return;
    }
    console.log("fromData", fromData);
    // Save - DB
    let isInstructor = teacherTypes?.includes(1) ? true : false;
    let isTeacher = teacherTypes?.includes(2) ? true : false;
    let _body = {
      ...fromData,
      isInstructor: isInstructor,
      isTeacher: isTeacher,
      activeFlag: fromData.activeFlag,
    };
    if (btnSaveText === "Save") {
      setLoading(true);
      const tempData = axios
        .post(
          `${urls.SCHOOL}/mstItiTeacherAndInstructorController/save`,
          _body,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          setLoading(false);
          if (res.status == 201) {
            sweetAlert("Saved!", "Record Saved successfully !", "success");
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setShowTable(true);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setTeacherTypes([]);
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
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      setLoading(true);
      axios
        .post(
          `${urls.SCHOOL}/mstItiTeacherAndInstructorController/save`,
          _body,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          setLoading(false);
          console.log("res", res);
          if (res.status == 201) {
            fromData.id
              ? sweetAlert(
                  "Updated!",
                  "Record Updated successfully !",
                  "success"
                )
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            getTeacherInstructorMaster();
            setButtonInputState(false);
            setShowTable(true);
            setEditButtonInputState(false);
            setIsOpenCollapse(false);
            setTeacherTypes([]);
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
          setLoading(true);
          axios
            .post(
              `${urls.SCHOOL}/mstItiTeacherAndInstructorController/save`,
              body,
              {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              }
            )
            .then((res) => {
              setLoading(false);
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getTeacherInstructorMaster();
                // setButtonInputState(false);
              }
            })
            .catch((e) => {
              setLoading(false);
              // sweetAlert(
              //   "Error",
              //   e?.message ? e?.message : "Something Went Wrong",
              //   "error"
              // );
              callCatchMethod(e, language);
              console.log("Eroor", e);
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
            .post(
              `${urls.SCHOOL}/mstItiTeacherAndInstructorController/save`,
              body,
              {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              }
            )
            .then((res) => {
              setLoading(false);
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Activated!", {
                  icon: "success",
                });
                // getPaymentRate();
                getTeacherInstructorMaster();
                // setButtonInputState(false);
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
    setTeacherTypes([]);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
    setTeacherTypes([]);
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    itiKey: "",
    tradeKey: "",
    firstName: "",
    middleName: "",
    lastName: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    itiKey: "",
    tradeKey: "",
    firstName: "",
    middleName: "",
    lastName: "",

    id: null,
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
      field: "itiName",
      headerName: labels.itiName,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tradeName",
      headerName: labels.tradeName,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "fullName",
      headerName: labels.teacherOrInstructorName,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: labels.actions,
      align: "center",
      headerAlign: "center",
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                let _teacherTypes = [
                  // console.log("params.row: ", params.row);
                  params?.row?.isInstructor === true ? 1 : null,
                  params?.row?.isTeacher === true ? 2 : null,
                ].filter((i) => i !== null);
                setTeacherTypes(_teacherTypes);
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setShowTable(false),
                  setSlideChecked(true);
                setButtonInputState(true);
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
                  onClick={() => deleteById(params.row.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.row.id, "Y")}
                />
              )}
            </IconButton>
          </Box>
        );
      },
    },
  ];

  // Row

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
          <h2>{labels.itiTeacherOrInstructorMaster}</h2>
        </Box>
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
                        <FormControl
                          sx={{ width: 230 }}
                          error={!!errors.itiKey}
                        >
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
                            {errors?.itiKey ? labels.itiNameReq : null}
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
                        <FormControl
                          sx={{ width: 230 }}
                          error={!!errors.tradeKey}
                        >
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
                            {errors?.tradeKey ? labels.itiTradeReq : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
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
                          variant="standard"
                          sx={{ width: 220 }}
                          label={`${labels.firstName} *`}
                          {...register("firstName")}
                          error={!!errors.firstName}
                          InputProps={{ style: { fontSize: 18 } }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            shrink: watch("firstName") ? true : false,
                          }}
                          helperText={
                            errors?.firstName ? labels.firstNameReq : null
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
                          sx={{ width: 220 }}
                          label={`${labels.middleName} *`}
                          {...register("middleName")}
                          error={!!errors.middleName}
                          InputProps={{ style: { fontSize: 18 } }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            shrink: watch("middleName") ? true : false,
                          }}
                          helperText={
                            errors?.middleName ? labels.middleNameReq : null
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
                          sx={{ width: 220 }}
                          label={`${labels.surnameName} *`}
                          {...register("lastName")}
                          error={!!errors.lastName}
                          InputProps={{ style: { fontSize: 18 } }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            shrink: watch("lastName") ? true : false,
                          }}
                          helperText={
                            errors?.lastName ? labels.lastNameReq : null
                          }
                        />
                      </Grid>

                      {/* isInstructor or isTeacher */}

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
                        <FormControl
                          error={Boolean(errors.teacherType)}
                          variant="standard"
                          // sx={{ m: 1, minWidth: "50%", maxWidth: "50%" }}
                          sx={{ width: 220 }}
                        >
                          <InputLabel required id="teacherType-label">
                            {labels.isInstructorOrTeacher}
                          </InputLabel>
                          <Controller
                            name="teacherType"
                            control={control}
                            // rules={{ required: true }}
                            render={({ field: { onChange, value } }) => (
                              <Select
                                labelId="teacherTypes-label"
                                id="teacherType"
                                multiple
                                value={teacherTypes}
                                onChange={(e) => {
                                  onChange(
                                    handleTeacherTypes(e, e.target.value)
                                  );
                                }}
                                renderValue={(selected) =>
                                  selected.includes("all")
                                    ? "Select All"
                                    : selected
                                        .map(
                                          (id) =>
                                            options.find((opt) => opt.id === id)
                                              ?.label
                                        )
                                        .join(", ")
                                }
                              >
                                {options?.length > 0 && (
                                  <MenuItem key="all" value="all">
                                    <Checkbox
                                      checked={
                                        teacherTypes.length === options.length
                                      }
                                      indeterminate={
                                        teacherTypes.length > 0 &&
                                        teacherTypes.length < options.length
                                      }
                                      onChange={(e) =>
                                        handleTeacherTypes(e, "all")
                                      }
                                    />
                                    {labels.selectAll}
                                  </MenuItem>
                                )}

                                {options.map((opt) => (
                                  <MenuItem key={opt.id} value={opt.id}>
                                    <Checkbox
                                      checked={teacherTypes.includes(opt.id)}
                                      onChange={(e) =>
                                        handleTeacherTypes(e, opt.id)
                                      }
                                    />
                                    {opt?.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                          />
                          {errors.teacherType && (
                            <FormHelperText>
                              {labels.teacherTypeReq}
                            </FormHelperText>
                          )}
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
                            // sx={{ marginRight: 8 }}
                            type="submit"
                            variant="contained"
                            color="primary"
                            endIcon={<SaveIcon />}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {labels.save}
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            // sx={{ marginRight: 8 }}
                            variant="contained"
                            color="primary"
                            endIcon={<ClearIcon />}
                            onClick={() => cancellButton()}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
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
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
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
              setButtonInputState(true);
              setBtnSaveText("Save");
              setSlideChecked(true);
              setIsOpenCollapse(!isOpenCollapse);
              setShowTable(false);
            }}
          >
            {labels.add}
          </Button>
        </div>

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
                    getTeacherInstructorMaster(data.pageSize, _data);
                  }}
                  onPageSizeChange={(_data) => {
                    getTeacherInstructorMaster(_data, data.page);
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
