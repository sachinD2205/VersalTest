import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { Box, Button, Grid, Paper, Slide, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
import itiMasterSchema from "../../../../containers/schema/iti/masters/itiMasterSchema";
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css";
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
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(itiMasterSchema),
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

  const language = useSelector((state) => state.labels.language);
  const [labels, setLabels] = useState(schoolLabels[language ?? "en"]);

  useEffect(() => {
    setLabels(schoolLabels[language ?? "en"]);
  }, [setLabels, language]);

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
    getItiMaster();
  }, [fetchData]);

  // Get Table - Data
  const getItiMaster = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    setLoading(true);
    axios
      .get(`${urls.SCHOOL}/mstIti/getAll`, {
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
        let result = r.data.mstItiList;
        let page = r?.data?.pageSize * r?.data?.pageNo;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log("44");
          return {
            activeFlag: r.activeFlag,
            id: r?.id,
            srNo: i + 1 + page,

            itiName: r?.itiName,
            // itiType: r?.itiType,
            tradeName: r?.tradeName,
            pincode: r?.pincode,
            gisId: r?.gisId,
            contactPerson: r?.contactPerson,
            contactNumber: r?.contactNumber,
            emailId: r?.emailId,
            remark: r?.remark,
            itiPrefix: r?.itiPrefix,
            itiCode: r?.itiCode,
            address: r?.address,
            intake: r?.intake,

            divisionKey: r?.divisionKey,
            stateKey: r?.stateKey,
            districtKey: r?.districtKey,
            colonyKey: r?.colonyKey,

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
    };
    if (btnSaveText === "Save") {
      setLoading(true);
      const tempData = axios
        .post(`${urls.SCHOOL}/mstIti/save`, _body, {
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
        .post(`${urls.SCHOOL}/mstIti/save`, _body, {
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
            getItiMaster();
            setButtonInputState(false);
            setShowTable(true);
            setEditButtonInputState(false);
            setIsOpenCollapse(false);
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
            .post(`${urls.SCHOOL}/mstIti/save`, body, {
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
                getItiMaster();
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
            .post(`${urls.SCHOOL}/mstIti/save`, body, {
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
                getItiMaster();
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
    itiName: "",
    // itiType: "",
    itiPrefix: "",
    itiCode: "",
    intake: "",
    emailId: "",
    contactPerson: "",
    contactNumber: "",
    address: "",
    pincode: "",
    gisId: "",
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    itiName: "",
    // itiType: "",
    itiPrefix: "",
    itiCode: "",
    intake: "",
    emailId: "",
    contactPerson: "",
    contactNumber: "",
    address: "",
    pincode: "",
    gisId: "",
    remark: "",

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
      field: "itiPrefix",
      headerName: labels.itiPrefix,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "intake",
      headerName: labels.intakeCapacity,
      // headerName: "Intake Capacity",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "emailId",
      headerName: labels.emailId,
      flex: 1,
      // width: 150,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "contactPerson",
      headerName: labels.contactPersonName,
      // minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "contactNumber",
      headerName: labels.contactPersonNumber,
      // minWidth: 100,
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
          <h2> {labels.itiMaster} </h2>
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
                      {/* itiName */}
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
                          label={`${labels.itiName} *`}
                          {...register("itiName")}
                          error={!!errors.itiName}
                          InputProps={{ style: { fontSize: 18 } }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            shrink: watch("itiName") ? true : false,
                          }}
                          helperText={
                            errors?.itiName ? labels.itiNameReq : null
                          }
                        />
                      </Grid>
                      {/* itiType */}
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
                        label="ITI Type"
                        {...register("itiType")}
                        error={!!errors.itiType}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          shrink: watch("itiType") ? true : false,
                        }}
                        helperText={
                          errors?.itiType ? errors.itiType.message : null
                        }
                      />
                    </Grid> */}
                      {/* itiPrefix */}
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
                          label={`${labels.itiPrefix} *`}
                          {...register("itiPrefix")}
                          error={!!errors.itiPrefix}
                          InputProps={{ style: { fontSize: 18 } }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            shrink: watch("itiPrefix") ? true : false,
                          }}
                          helperText={
                            errors?.itiPrefix ? labels.itiPrefixReq : null
                          }
                        />
                      </Grid>
                      {/* itiCode */}
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
                          label={`${labels.itiCode} *`}
                          {...register("itiCode")}
                          error={!!errors.itiCode}
                          InputProps={{ style: { fontSize: 18 } }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            shrink: watch("itiCode") ? true : false,
                          }}
                          helperText={
                            errors?.itiCode ? labels.itiCodeReq : null
                          }
                        />
                      </Grid>
                      {/* intake */}
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
                          label={`${labels.intakeCapacity} *`}
                          {...register("intake")}
                          error={!!errors.intake}
                          InputProps={{ style: { fontSize: 18 } }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            shrink: watch("intake") ? true : false,
                          }}
                          helperText={
                            errors?.intake ? labels.intakeCapacityReq : null
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
                          sx={{ width: 220 }}
                          label={`${labels.emailId} *`}
                          {...register("emailId")}
                          error={!!errors.emailId}
                          InputProps={{ style: { fontSize: 18 } }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            shrink: watch("emailId") ? true : false,
                          }}
                          helperText={errors?.emailId ? labels.emailReq : null}
                        />
                      </Grid>
                      {/* contactPerson */}
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
                          label={`${labels.contactPersonName} *`}
                          {...register("contactPerson")}
                          error={!!errors.contactPerson}
                          InputProps={{ style: { fontSize: 18 } }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            shrink: watch("contactPerson") ? true : false,
                          }}
                          helperText={
                            errors?.contactPerson
                              ? labels.itiContactPersonNameReq
                              : null
                          }
                        />
                      </Grid>
                      {/* contactNumber */}
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
                          label={`${labels.contactPersonNumber} *`}
                          {...register("contactNumber")}
                          error={!!errors.contactNumber}
                          InputProps={{ style: { fontSize: 18 } }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            shrink: watch("contactNumber") ? true : false,
                          }}
                          helperText={
                            errors?.contactNumber
                              ? labels.itiContactPersonNumberReq
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
                          sx={{ width: 220 }}
                          label={`${labels.address} *`}
                          {...register("address")}
                          error={!!errors.address}
                          InputProps={{ style: { fontSize: 18 } }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            shrink: watch("address") ? true : false,
                          }}
                          helperText={
                            errors?.address ? labels.itiAddressReq : null
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
                          id="standard-basic"
                          variant="standard"
                          sx={{ width: 220 }}
                          label={`${labels.pincode} *`}
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

                      {/* gisId */}
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
                          {...register("gisId")}
                          error={!!errors.gisId}
                          InputProps={{ style: { fontSize: 18 } }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            shrink: watch("gisId") ? true : false,
                          }}
                          helperText={errors?.gisId ? labels.gisIdReq : null}
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
                          label={labels?.remark}
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
                    getItiMaster(data.pageSize, _data);
                  }}
                  onPageSizeChange={(_data) => {
                    console.log("222", _data);
                    // updateData("page", 1);
                    getItiMaster(_data, data.page);
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
