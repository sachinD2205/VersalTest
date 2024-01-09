// import { yupResolver } from "@hookforpostm/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
// import styles from "../court/view.module.css
import sweetAlert from "sweetalert";
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { yupResolver } from "@hookform/resolvers/yup";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { GridToolbar } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
// import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import urls from "../../../../URLS/urls";
import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
import schoolMasterSchema from "../../../../containers/schema/school/masters/schoolMasterSchema";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import Loader from "../../../../containers/Layout/components/Loader";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
const Index = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schoolMasterSchema),
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
  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   methods,
  //   reset,
  //   watch,
  //   formState: { errors },
  // } = useForm({
  //   criteriaMode: "all",
  //   resolver: yupResolver(schoolMasterSchema),
  //   mode: "onChange",
  // });
  const [loading, setLoading] = useState(false);

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const router = useRouter();
  const [wardKeys, setWardKeys] = useState([]);
  const [zoneKeys, setZoneKeys] = useState([]);
  const [mediumState, setmediumState] = useState([]);

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

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getSchoolMaster();
  }, [fetchData]);

  // getZoneKeys
  const getZoneKeys = () => {
    //setValues("setBackDrop", true);
    axios
      .get(`${urls.BaseURL}/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
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
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  //filter wards based on zonekey
  const zonekey = watch("zonekey");
  const getWardKeys = () => {
    if (zonekey) {
      axios
        .get(
          `${
            urls.CFCURL
          }/master/zoneAndWardLevelMapping/getWardByDepartmentId?departmentId=${2}&zoneId=${zonekey}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          setWardKeys(
            r.data.map((row) => ({
              id: row.id,
              wardName: row.wardName,
              wardNameMr: row.wardNameMr,
            }))
          );
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };
  useEffect(() => {
    getWardKeys();
  }, [zonekey]);

  useEffect(() => {
    getZoneKeys();
  }, []);

  // schoolMedium
  const handleChangeMedium = (event) => {
    const {
      target: { value },
    } = event;
    setmediumState(typeof value === "string" ? value.split(",") : value);
  };
  // console.log("mediumState",mediumState);
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 220,
      },
    },
  };
  let medium = ["Marathi", "Hindi", "English", "Semi English", "Urdu"];

  // Get Table - Data
  const getSchoolMaster = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    // console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    setLoading(true);
    axios
      .get(`${urls.SCHOOL}/mstSchool/getAll`, {
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
        console.log(";r", r);
        let page = r?.data?.pageSize * r?.data?.pageNo;
        let result = r.data.mstSchoolList;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log("44");
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,

            id: r.id,
            srNo: i + 1 + page,
            schoolName: r.schoolName,
            schoolNameMr: r.schoolNameMr,
            pincode: r.pincode,
            schoolPrefix: r.schoolPrefix,
            schoolAddress: r.schoolAddress,
            contactPersonName: r.contactPersonName,
            contactPersonNumber: r.contactPersonNumber,
            gisCode: r.gisCode,
            udiceCode: r.udiceCode,
            wardkey: r.wardkey,
            zonekey: r.zonekey,
            emailId: r.emailId,
            schoolMedium: r.schoolMedium,

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
    console.log("fromData", fromData);
    // Save - DB
    let _body = {
      ...fromData,
      activeFlag: fromData.activeFlag,
      schoolMedium: mediumState.toString(),
      // wardKey: Number(fromData.wardKey) ,
    };
    if (btnSaveText === "Save") {
      setLoading(true);
      const tempData = axios
        .post(`${urls.SCHOOL}/mstSchool/save`, _body, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setLoading(false);
          if (res.status == 201) {
            sweetAlert("Saved!", "Record Saved successfully !", "success");

            setButtonInputState(false);
            setIsOpenCollapse(false);
            setShowTable(true);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setmediumState([]);
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
        .post(`${urls.SCHOOL}/mstSchool/save`, _body, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
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
            getSchoolMaster();
            setButtonInputState(false);
            setShowTable(true);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
            setmediumState([]);
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
            .post(`${urls.SCHOOL}/mstSchool/save`, body, {
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
                getSchoolMaster();
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
            .post(`${urls.SCHOOL}/mstSchool/save`, body, {
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
                getSchoolMaster();
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
    setDeleteButtonState(false);
    setmediumState([]);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
    setmediumState([]);
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    schoolName: "",
    schoolNameMr: "",
    schoolPrefix: "",
    schoolAddress: "",
    pincode: "",
    gisCode: "",
    udiceCode: "",
    contactPersonName: "",
    contactPersonNumber: "",
    emailId: "",
    wardkey: "",
    zonekey: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    schoolName: "",
    schoolNameMr: "",
    schoolPrefix: "",
    schoolAddress: "",
    pincode: "",
    udiceCode: "",
    gisCode: "",
    contactPersonName: "",
    contactPersonNumber: "",
    emailId: "",
    zonekey: "",
    wardkey: "",

    id: null,
  };

  const columns = [
    {
      field: "srNo",
      headerName: labels.srNo,
      flex: 1,
    },
    {
      // field: "schoolName",
      field: language == "en" ? "schoolName" : "schoolNameMr",
      headerName: labels.schoolName,
      flex: 1,
    },

    {
      field: "pincode",
      headerName: labels.pincode,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "contactPersonName",
      headerName: labels.contactPersonName,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "contactPersonNumber",
      headerName: labels.contactPersonNumber,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "actions",
      headerName: labels.actions,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                let _medium = params?.row?.schoolMedium
                  ? params?.row?.schoolMedium.split(",")
                  : [];
                // console.log("_med", _med);
                setmediumState(_medium);
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
            {/* <IconButton onClick={() => deleteById(params.id)}>
              <DeleteIcon />
            </IconButton> */}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true);
                // setButtonInputState(true);
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
          <h2>{labels.schoolMaster}</h2>
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
                      {/* Zone Name */}
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
                          variant="standard"
                          sx={{ marginTop: 2 }}
                          error={!!errors.zonekey}
                        >
                          <InputLabel
                            required
                            id="demo-simple-select-standard-label"
                          >
                            {labels.zoneName}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 220 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={`${labels.zoneName} *`}
                                InputProps={{ style: { fontSize: 18 } }}
                                InputLabelProps={{
                                  style: { fontSize: 15 },
                                  //true
                                  shrink: watch("zonekey") ? true : false,
                                }}
                              >
                                {zoneKeys &&
                                  zoneKeys.map((zonekey, index) => (
                                    <MenuItem key={index} value={zonekey.id}>
                                      {zonekey.zoneName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="zonekey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.zonekey ? labels.zoneReq : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* Ward Name */}
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
                        {" "}
                        <FormControl
                          variant="standard"
                          sx={{ marginTop: 2 }}
                          // error={!!errors.wardkey}
                          InputProps={{ style: { fontSize: 18 } }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink: watch("wardkey") ? true : false,
                          }}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {labels.wardName}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={labels.wardName}
                                sx={{ width: 220 }}
                              >
                                {wardKeys &&
                                  wardKeys.map((wardkey, index) => (
                                    <MenuItem key={index} value={wardkey.id}>
                                      {wardkey.wardName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="wardkey"
                            control={control}
                            defaultValue=""
                          />
                          {/* <FormHelperText>{errors?.wardkey ? errors.wardkey.message : null}</FormHelperText> */}
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
                        <div style={{ width: "220px" }}>
                          <Transliteration
                            style={{
                              backgroundColor: "white",
                              margin: "250px",
                            }}
                            _key={"schoolName"}
                            required
                            labelName={labels.schoolName}
                            fieldName={"schoolName"}
                            updateFieldName={"schoolNameMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            label={`${labels.schoolName} *`}
                            error={!!errors.schoolName}
                            targetError={"schoolNameMr"}
                            InputLabelProps={{
                              style: { fontSize: 15 },
                              //true
                              shrink: watch("schoolName") ? true : false,
                            }}
                            helperText={
                              errors?.schoolName ? labels.schoolReq : null
                            }
                          />
                        </div>
                        {/* <TextField
                        id="standard-basic"
                        variant="standard"
                        sx={{ width: 220 }}
                        label={labels.schoolName}
                        {...register("schoolName")}
                        error={!!errors.schoolName}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("schoolName") ? true : false,
                        }}
                        helperText={
                          errors?.schoolName ? labels.schoolReq : null
                        }
                      /> */}
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
                        <div style={{ width: "220px" }}>
                          <Transliteration
                            style={{
                              backgroundColor: "white",
                              margin: "250px",
                            }}
                            _key={"schoolNameMr"}
                            labelName={labels.schoolNameMr}
                            fieldName={"schoolNameMr"}
                            updateFieldName={"schoolName"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            label={`${labels.schoolNameMr} *`}
                            error={!!errors.schoolNameMr}
                            targetError={"schoolName"}
                            InputLabelProps={{
                              style: { fontSize: 15 },
                              //true
                              shrink: watch("schoolNameMr") ? true : false,
                            }}
                            helperText={
                              errors?.schoolNameMr
                                ? labels.schoolNameMrReq
                                : null
                            }
                          />
                        </div>
                        {/* <TextField
                        id="standard-basic"
                        variant="standard"
                        sx={{ width: 220 }}
                        label={labels.schoolNameMr}
                        {...register("schoolNameMr")}
                        error={!!errors.schoolNameMr}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("schoolNameMr") ? true : false,
                        }}
                        helperText={
                          errors?.schoolNameMr ? labels.schoolNameMrReq : null
                        }
                      /> */}
                      </Grid>

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
                        label={labels.schoolPrefix}
                        {...register("schoolPrefix")}
                        error={!!errors.schoolPrefix}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("schoolPrefix") ? true : false,
                        }}
                        helperText={errors?.schoolPrefix ? errors.schoolPrefix.message : null}
                      />
                    </Grid> */}

                      {/* UDISE code */}
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
                          label={`${labels.udiceCode} *`}
                          {...register("udiceCode")}
                          error={!!errors.udiceCode}
                          InputProps={{ style: { fontSize: 18 } }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            shrink: watch("udiceCode") ? true : false,
                          }}
                          helperText={
                            errors?.udiceCode ? labels.udiceCodeReq : null
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
                          // label={<FormattedLabel id="bookClassification" />}
                          id="standard-basic"
                          variant="standard"
                          sx={{ width: 220 }}
                          label={`${labels.schoolAddress} *`}
                          {...register("schoolAddress")}
                          error={!!errors.schoolAddress}
                          InputProps={{ style: { fontSize: 18 } }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            shrink: watch("schoolAddress") ? true : false,
                          }}
                          helperText={
                            errors?.schoolAddress
                              ? labels.schoolAddressReq
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
                          label={`${labels.pincode} *`}
                          sx={{ width: 220 }}
                          {...register("pincode")}
                          error={!!errors.pincode}
                          InputProps={{ style: { fontSize: 18 } }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            shrink: watch("pincode") ? true : false,
                          }}
                          helperText={
                            errors?.pincode ? labels.pincodeReq : null
                          }
                        />
                      </Grid>

                      {/* GIS code */}
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
                          label={`${labels.gisCode} *`}
                          {...register("gisCode")}
                          error={!!errors.gisCode}
                          InputProps={{ style: { fontSize: 18 } }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            shrink: watch("gisCode") ? true : false,
                          }}
                          helperText={
                            errors?.gisCode ? labels.gisCodeReq : null
                          }
                        />
                      </Grid>
                      {/* pincode */}
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
                          // label={<FormattedLabel id="bookClassification" />}
                          id="standard-basic"
                          variant="standard"
                          sx={{ width: 220 }}
                          label={`${labels.contactPersonName} *`}
                          {...register("contactPersonName")}
                          error={!!errors.contactPersonName}
                          InputProps={{ style: { fontSize: 18 } }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            shrink: watch("contactPersonName") ? true : false,
                          }}
                          helperText={
                            errors?.contactPersonName
                              ? labels.contactPersonNameReq
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
                          // label={<FormattedLabel id="bookClassification" />}
                          id="standard-basic"
                          variant="standard"
                          sx={{ width: 220 }}
                          label={`${labels.contactPersonNumber} *`}
                          {...register("contactPersonNumber")}
                          error={!!errors.contactPersonNumber}
                          InputProps={{ style: { fontSize: 18 } }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            shrink: watch("contactPersonNumber") ? true : false,
                          }}
                          helperText={
                            errors?.contactPersonNumber
                              ? labels.contactPersonNumberReq
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
                          // label={<FormattedLabel id="bookClassification" />}
                          id="standard-basic"
                          variant="standard"
                          sx={{ width: 220 }}
                          label={`${labels.emailId} *`}
                          {...register("emailId")}
                          error={!!errors.emailId}
                          InputProps={{ style: { fontSize: 18 } }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink: watch("emailId") ? true : false,
                          }}
                          helperText={
                            errors?.emailId ? labels.schoolEmailIdReq : null
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
                        <FormControl
                          variant="standard"
                          // fullWidth
                          sx={{ backgroundColor: "white" }}
                        >
                          <InputLabel id="demo-multiple-chip-label">
                            <Typography> {labels.medium} </Typography>
                            {/* {<FormattedLabel id="otherExternalEmp" />} */}
                          </InputLabel>
                          <Select
                            sx={{ width: 220 }}
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            multiple
                            rows={2}
                            value={mediumState}
                            onChange={handleChangeMedium}
                            // input={
                            //   <OutlinedInput
                            //   id="select-multiple-chip"
                            //     label="Other External Employee Who is Not on duty but
                            //     present at the time of Vardi"
                            //   />
                            // }
                            renderValue={(selected) => (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                }}
                              >
                                {selected.map((value) => (
                                  <Chip
                                    sx={{ backgroundColor: "#AFDBEE" }}
                                    key={value}
                                    label={value}
                                  />
                                ))}
                              </Box>
                            )}
                            MenuProps={MenuProps}
                          >
                            {medium?.map((med, index) => (
                              <MenuItem
                                // key={name}
                                // value={name}
                                key={index}
                                value={med}
                                // style={getStyles(user, personName5, theme)}
                              >
                                <Checkbox
                                  checked={mediumState.indexOf(med) > -1}
                                />
                                <ListItemText
                                  primary={typeof med === "string" && med}
                                />
                              </MenuItem>
                            ))}
                          </Select>
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
              setDeleteButtonState(true);
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
                    getSchoolMaster(data.pageSize, _data);
                  }}
                  onPageSizeChange={(_data) => {
                    console.log("222", _data);
                    // updateData("page", 1);
                    getSchoolMaster(_data, data.page);
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
