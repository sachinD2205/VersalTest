import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
  Backdrop,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Grid,
  Link,
  Paper,
  Slide,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
// import BasicLayout from "../../../containers/Layout/BasicLayout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../containers/schema/common/BankMaster";
import styles from "../../../styles/cfc/cfc.module.css";
import Transliteration from "../../../components/common/linguosol/transliteration";
import Loader from "../../../containers/Layout/components/Loader";
import { toast } from "react-toastify";
import { catchExceptionHandlingMethod } from "../../../util/util";

// func
const BankMaster = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {},
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    getValues,
    formState: { errors },
  } = methods;

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);

  const router = useRouter();

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const [breadCrumbName, setBreadCrumbName] = useState("");

  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );

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

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getMenus();
    getBankMasterDetails();
    console.log("useEffect");
  }, []);

  const getMenus = async () => {
    await axios
      .get(`${urls.CFCURL}/master/menu/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          setBreadCrumbName(
            r?.data?.menu?.reduce((result, person) => {
              if (person?.id === selectedMenuFromDrawer) {
                return person?.breadcrumName;
              }
              return result;
            }, null)
          );
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // Exit Button
  const exitBack = () => {
    router.back();
  };

  const [load, setLoad] = useState();

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // Get Table - Data
  const getBankMasterDetails = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setLoad(true);

    axios
      .get(`${urls.CFCURL}/master/bank/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setLoad(false);

        let result = res.data.bank;
        let _res = result.map((r, i) => {
          console.log("res payment mode", res);
          return {
            id: r.id,
            srNo: i + 1,
            activeFlag: r.activeFlag,
            // bankPrefix: r.bankPrefix,
            bankName: r.bankName,
            bankNameMr: r.bankNameMr,
            branchName: r.branchName,
            branchNameMr: r.branchNameMr,
            // bankAddress: r.bankAddress,
            ifscCode: r.ifscCode,
            micrCode: r.micrCode,
            city: r.city,
            district: r.district,
            state: r.state,
            branchAddress: r.branchAddress,
            contactDetails: r.contactDetails,
            status: r.activeFlag === "Y" ? "Active" : "InActive",
          };
        });

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoad(false);
        callCatchMethod(err, language);
      });
  };

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    // Update Form Data
    const finalBodyForApi = {
      ...formData,
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    // Save - DB
    axios
      .post(`${urls.CFCURL}/master/bank/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          if (res.data?.errors?.length > 0) {
            res.data?.errors?.map((x) => {
              if (x.field == "bankName") {
                setError("bankName", { message: x.code });
              } else if (x.field == "bankNameMr") {
                setError("bankNameMr", { message: x.code });
              }
            });
          } else {
            formData.id
              ? sweetAlert(
                  language == "en" ? "Updated!" : "अपडेट केले!",
                  language == "en"
                    ? "Record Updated successfully!"
                    : "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
                  "success"
                )
              : sweetAlert(
                  language == "en" ? "Saved!" : "जतन केले!",
                  language == "en"
                    ? "Record Saved successfully!"
                    : "रेकॉर्ड यशस्वीरित्या जतन केले!",
                  "success"
                );
            getBankMasterDetails();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const deleteById = (value, _activeFlag) => {
    setLoad(true);
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: language == "en" ? "Deactivate?" : "निष्क्रिय करा?",
        text:
          language == "en"
            ? "Are you sure you want to deactivate this Record?"
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.CFCURL}/master/bank/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                setLoad(false);
                swal(
                  language == "en"
                    ? "Record is Successfully Deactivated!"
                    : "रेकॉर्ड यशस्वीरित्या निष्क्रिय केले आहे!",
                  {
                    icon: "success",
                  }
                );
                getBankMasterDetails();
                setButtonInputState(false);
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              callCatchMethod(err, language);
            });
        } else if (willDelete == null) {
          setLoad(false);
          swal(language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे");
        }
      });
    } else {
      swal({
        title: language == "en" ? "Activate?" : "सक्रिय करा?",
        text:
          language == "en"
            ? "Are you sure you want to activate this Record?"
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
        .then((willDelete) => {
          console.log("inn", willDelete);
          if (willDelete === true) {
            axios
              .post(`${urls.CFCURL}/master/bank/save`, body, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
              .then((res) => {
                console.log("delet res", res);
                if (res.status == 200) {
                  setLoad(false);
                  swal(
                    language == "en"
                      ? "Record is Successfully activated!"
                      : "रेकॉर्ड यशस्वीरित्या सक्रिय झाले!",
                    {
                      icon: "success",
                    }
                  );
                  getBankMasterDetails();
                  setButtonInputState(false);
                }
              })
              ?.catch((err) => {
                console.log("err", err);
                callCatchMethod(err, language);
              });
          } else if (willDelete == null) {
            setLoad(false);
            swal(language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे");
          }
        })
        .catch((err) => {
          toast(
            language == "en" ? "Something Went Wrong!" : "काहीतरी चूक झाली!",
            {
              type: "error",
            }
          );
          setLoad(false);
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
    setEditButtonInputState(false);
    setDeleteButtonState(false);
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
    bankName: "",
    // bankPrefix: "",
    bankNameMr: "",
    branchName: "",
    branchNameMr: "",
    // bankAddress: "",
    ifscCode: "",
    micrCode: "",
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    bankName: "",
    // bankPrefix: "",
    bankNameMr: "",
    branchName: "",
    branchNameMr: "",
    // bankAddress: "",
    ifscCode: "",
    micrCode: "",
    city: "",
    district: "",
    state: "",
    branchAddress: "",
    contactDetails: "",
    remark: "",
    id: null,
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
      width: 90,
      cellClassName: "super-app-theme--cell",
    },

    {
      field: language === "en" ? "bankName" : "bankNameMr",
      headerName: <FormattedLabel id="bankName" />,
      // type: "number",
      flex: 1,
    },
    {
      field: "branchName",
      headerName: <FormattedLabel id="branchName" />,
      // type: "number",
      flex: 0.3,
    },

    {
      field: "ifscCode",
      headerName: <FormattedLabel id="ifscCode" />,
      // type: "number",
      flex: 0.4,
    },
    {
      field: "micrCode",
      headerName: <FormattedLabel id="micrCode" />,
      // type: "number",
      flex: 0.3,
    },
    {
      field: "city",
      headerName: <FormattedLabel id="city" />,
      // type: "number",
      flex: 0.3,
    },
    {
      field: "district",
      headerName: <FormattedLabel id="district" />,
      // type: "number",
      flex: 0.3,
    },
    {
      field: "state",
      headerName: <FormattedLabel id="state" />,
      // type: "number",
      flex: 0.3,
    },
    {
      field: "branchAddress",
      headerName: <FormattedLabel id="branchAddress" />,
      // type: "number",
      flex: 1,
    },

    {
      field: "contactDetails",
      headerName: <FormattedLabel id="contactDetails" />,
      // type: "number",
      flex: 0.3,
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 150,
      headerAlign: "center",
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            {params.row.activeFlag == "Y" ? (
              <IconButton
                //   disabled={editButtonInputState && params.row.activeFlag === "N" ? false : true}
                disabled={editButtonInputState}
                onClick={() => {
                  setBtnSaveText("Update"),
                    setID(params.row.id),
                    setIsOpenCollapse(true),
                    setSlideChecked(true);
                  setButtonInputState(true);
                  console.log("params.row: ", params.row);
                  reset(params.row);
                }}
              >
                <Tooltip title="Edit">
                  <EditIcon style={{ color: "#556CD6" }} />
                </Tooltip>
              </IconButton>
            ) : (
              <Tooltip sx={{ margin: "8px" }}>
                <EditIcon style={{ color: "gray" }} disabled={true} />
              </Tooltip>
            )}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setSlideChecked(true);
                setButtonInputState(true);
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
          </>
        );
      },
    },
  ];

  // View
  return (
    <>
      <Box>
        {/* <Breadcrumbs
          aria-label="breadcrumb"
          sx={{ backgroundColor: "white", padding: "10px" }}
        >
          <Link underline="hover" color="inherit" onClick={() => router.back()}>
            Common
          </Link>
          <Typography color="inherit">Masters</Typography>
          <Typography color="primary" sx={{ textDecoration: "underline" }}>
            Bank Name
          </Typography>
        </Breadcrumbs> */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ padding: "10px" }}>
          <Typography
            color="primary"
            sx={{ textDecoration: "underline", fontSize: "12px" }}
          >
            {breadCrumbName}
          </Typography>
        </Breadcrumbs>
      </Box>
      <Box style={{ display: "flex" }}>
        <Box className={styles.tableHead} sx={{ display: "flex" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{
              mr: 2,
              paddingLeft: "30px",
              color: "white",
            }}
            onClick={() => exitBack()}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box className={styles.h1Tag} sx={{ paddingLeft: "38%" }}>
            <FormattedLabel id="bankNameMaster" />
          </Box>
        </Box>
        <Box>
          <Button
            className={styles.adbtn}
            variant="contained"
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
            }}
          >
            <AddIcon size="70" />
          </Button>
        </Box>
      </Box>

      {load ? (
        <Loader />
      ) : (
        <Paper>
          {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <Paper
                sx={{
                  backgroundColor: "#F5F5F5",
                }}
              >
                <br />
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmitForm)}>
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={4}
                        xl={4}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {" "}
                        <Box sx={{ width: "90%" }}>
                          <Transliteration
                            variant={"outlined"}
                            _key={"bankName"}
                            labelName={"bankName"}
                            fieldName={"bankName"}
                            updateFieldName={"bankNameMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            label={<FormattedLabel id="bankName" required />}
                            error={!!errors.bankName}
                            helperText={
                              errors?.bankName ? errors.bankName.message : null
                            }
                          />
                        </Box>
                        {/* <TextField
                        size="small"
                        sx={{ width: "90%", backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="bankName" />}
                        variant="outlined"
                        // value={dataInForm && dataInForm.religion}
                        {...register("bankName")}
                        error={!!errors.bankName}
                        helperText={
                          errors?.bankName ? errors.bankName.message : null
                        }
                      /> */}
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={4}
                        xl={4}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Box sx={{ width: "90%" }}>
                          <Transliteration
                            variant={"outlined"}
                            _key={"bankNameMr"}
                            labelName={"bankNameMr"}
                            fieldName={"bankNameMr"}
                            updateFieldName={"bankName"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            label={<FormattedLabel id="bankNameMr" required />}
                            error={!!errors.bankNameMr}
                            helperText={
                              errors?.bankNameMr
                                ? errors.bankNameMr.message
                                : null
                            }
                          />
                        </Box>
                        {/* <TextField
                        size="small"
                        sx={{ width: "90%", backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="bankNameMr" />}
                        variant="outlined"
                        {...register("bankNameMr")}
                        error={!!errors.bankNameMr}
                        helperText={
                          errors?.bankNameMr ? errors.bankNameMr.message : null
                        }
                      /> */}
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={4}
                        xl={4}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          size="small"
                          sx={{ width: "90%", backgroundColor: "white" }}
                          id="outlined-basic"
                          label={<FormattedLabel id="branchName" />}
                          variant="outlined"
                          {...register("branchName")}
                          error={!!errors.branchName}
                          helperText={
                            errors?.branchName
                              ? errors.branchName.message
                              : null
                          }
                          InputLabelProps={{
                            shrink: watch("branchName") ? true : false,
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={4}
                        xl={4}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          size="small"
                          sx={{ width: "90%", backgroundColor: "white" }}
                          id="outlined-basic"
                          label={<FormattedLabel id="ifscCode" />}
                          variant="outlined"
                          // value={dataInForm && dataInForm.religion}
                          {...register("ifscCode")}
                          error={!!errors.ifscCode}
                          helperText={
                            errors?.ifscCode ? errors.ifscCode.message : null
                          }
                          InputLabelProps={{
                            shrink: watch("ifscCode") ? true : false,
                          }}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={4}
                        xl={4}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          size="small"
                          sx={{ width: "90%", backgroundColor: "white" }}
                          id="outlined-basic"
                          label={<FormattedLabel id="micrCode" />}
                          variant="outlined"
                          // value={dataInForm && dataInForm.religion}
                          {...register("micrCode")}
                          error={!!errors.micrCode}
                          helperText={
                            errors?.micrCode ? errors.micrCode.message : null
                          }
                          InputLabelProps={{
                            shrink: watch("micrCode") ? true : false,
                          }}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={4}
                        xl={4}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          size="small"
                          sx={{ width: "90%", backgroundColor: "white" }}
                          id="outlined-basic"
                          label={<FormattedLabel id="city" />}
                          variant="outlined"
                          // value={dataInForm && dataInForm.religion}
                          {...register("city")}
                          error={!!errors.city}
                          helperText={errors?.city ? errors.city.message : null}
                          InputLabelProps={{
                            shrink: watch("city") ? true : false,
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={4}
                        xl={4}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          size="small"
                          sx={{ width: "90%", backgroundColor: "white" }}
                          id="outlined-basic"
                          label={<FormattedLabel id="district" />}
                          variant="outlined"
                          // value={dataInForm && dataInForm.remark}
                          {...register("district")}
                          error={!!errors.district}
                          helperText={
                            errors?.district ? errors.district.message : null
                          }
                          InputLabelProps={{
                            shrink: watch("district") ? true : false,
                          }}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={4}
                        xl={4}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          size="small"
                          sx={{ width: "90%", backgroundColor: "white" }}
                          id="outlined-basic"
                          label={<FormattedLabel id="state" />}
                          variant="outlined"
                          // value={dataInForm && dataInForm.remark}
                          {...register("state")}
                          error={!!errors.state}
                          helperText={
                            errors?.state ? errors.state.message : null
                          }
                          InputLabelProps={{
                            shrink: watch("state") ? true : false,
                          }}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={4}
                        xl={4}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          size="small"
                          sx={{ width: "90%", backgroundColor: "white" }}
                          id="outlined-basic"
                          label={<FormattedLabel id="branchAddress" />}
                          variant="outlined"
                          // value={dataInForm && dataInForm.remark}
                          {...register("branchAddress")}
                          error={!!errors.branchAddress}
                          helperText={
                            errors?.branchAddress
                              ? errors.branchAddress.message
                              : null
                          }
                          InputLabelProps={{
                            shrink: watch("branchAddress") ? true : false,
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={4}
                        xl={4}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          size="small"
                          sx={{ width: "90%", backgroundColor: "white" }}
                          id="outlined-basic"
                          label={<FormattedLabel id="contactDetails" />}
                          variant="outlined"
                          // value={dataInForm && dataInForm.remark}
                          {...register("contactDetails")}
                          error={!!errors.contactDetails}
                          helperText={
                            errors?.contactDetails
                              ? errors.contactDetails.message
                              : null
                          }
                          InputLabelProps={{
                            shrink: watch("contactDetails") ? true : false,
                          }}
                        />
                      </Grid>
                    </Grid>
                    <br />
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={4}
                        sx={{ display: "flex", justifyContent: "end" }}
                      >
                        <Button
                          type="submit"
                          size="small"
                          variant="outlined"
                          className={styles.button}
                          endIcon={<SaveIcon />}
                        >
                          <FormattedLabel id="Save" />
                        </Button>
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          className={styles.button}
                          endIcon={<ClearIcon />}
                          onClick={() => {
                            reset({
                              ...resetValuesExit,
                            });
                          }}
                        >
                          {<FormattedLabel id="clear" />}
                        </Button>
                      </Grid>
                      <Grid item xs={4} sx={{ display: "flex" }}>
                        <Button
                          size="small"
                          variant="outlined"
                          className={styles.button}
                          // color="primary"
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitButton()}
                        >
                          {<FormattedLabel id="exit" />}
                        </Button>
                      </Grid>
                    </Grid>
                    <br />
                  </form>
                </FormProvider>
              </Paper>
            </Slide>
          )}

          <Box
            style={{
              height: "auto",
              overflow: "auto",
              width: "100%",
            }}
          >
            <DataGrid
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
              getRowId={(row) => row.srNo}
              components={{ Toolbar: GridToolbar }}
              // autoHeight={true}
              autoHeight={data.pageSize}
              density="compact"
              sx={{
                "& .super-app-theme--cell": {
                  backgroundColor: "#E3EAEA",
                  borderLeft: "10px solid white",
                  borderRight: "10px solid white",
                  borderTop: "4px solid white",
                },
                backgroundColor: "white",
                boxShadow: 2,
                border: 1,
                borderColor: "primary.light",
                "& .MuiDataGrid-cell:hover": {},
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#E3EAEA",
                },
                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#556CD6",
                  color: "white",
                },

                "& .MuiDataGrid-column": {
                  backgroundColor: "red",
                },
              }}
              pagination
              paginationMode="server"
              rowCount={data.totalRows}
              rowsPerPageOptions={data.rowsPerPageOptions}
              page={data.page}
              pageSize={data.pageSize}
              rows={data.rows}
              columns={columns}
              onPageChange={(_data) => {
                getBankMasterDetails(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                getBankMasterDetails(_data, data.page);
              }}
            />
          </Box>
        </Paper>
      )}
    </>
  );
};

export default BankMaster;
