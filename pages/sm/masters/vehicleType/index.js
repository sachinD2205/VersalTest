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
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/securityManagementSystemSchema/masters/vehicleType";
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
    getVehicleTypes();
  }, []);

  const getVehicleTypes = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    axios
      .get(`${urls.SMURL}/mstVehicleType/getAll`, {
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
        let result = r?.data?.mstVehicleTypeList;
        let _res = result?.map((r, i) => {
          return {
            id: r.id,
            srNo: _pageSize * _pageNo + i + 1,
            vehicleTypePrefix: r.vehicleTypePrefix,
            vehicleType: r.vehicleType,
            vehicleTypeMr: r.vehicleTypeMr,
            remark: r.remark,
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
        vehicleTypePrefix: formData.vehicleTypePrefix
          ? formData.vehicleTypePrefix
          : null,
        remark: formData.remark ? formData.remark : null,
      };
      console.log("1", _body);
    } else {
      _body = {
        ...formData,
        vehicleTypePrefix: formData.vehicleTypePrefix
          ? formData.vehicleTypePrefix
          : null,
        remark: formData.remark ? formData.remark : null,
        id: formData.id,
      };
      console.log("2", _body);
    }
    if (btnSaveText === "Save" && btnType !== "Checkout") {
      const tempData = axios
        .post(
          `${urls.SMURL}/mstVehicleType/save`,
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
            language == "en"
              ? sweetAlert({
                  title: "Saved!",
                  text: "Record Saved successfully!",
                  icon: "success",
                  button: "Ok",
                })
              : sweetAlert({
                  title: "जतन केले!",
                  text: "रेकॉर्ड यशस्वीरित्या जतन केले!",
                  icon: "success",
                  button: "ओके",
                });
            getVehicleTypes();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
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
    // Update Data Based On ID
    else if (btnSaveText === "Update" || btnType === "Checkout") {
      console.log("current ", formData);
      // var d = new Date(); // for now
      // const currentTime = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
      const tempData = axios
        .post(
          `${urls.SMURL}/mstVehicleType/save`,
          {
            ...formData,
            vehicleTypePrefix: formData.vehicleTypePrefix
              ? formData.vehicleTypePrefix
              : null,
            remark: formData.remark ? formData.remark : null,
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
              ? language == "en"
                ? sweetAlert({
                    title: "Updated!",
                    text: "Record Updated successfully!",
                    icon: "success",
                    button: "Ok",
                  })
                : sweetAlert({
                    title: "अपडेट केले!",
                    text: "रेकॉर्ड यशस्वीरित्या अपडेट केले!",
                    icon: "success",
                    button: "ओके",
                  })
              : language == "en"
              ? sweetAlert({
                  title: "Saved!",
                  text: "Record Saved successfully!",
                  icon: "success",
                  button: "Ok",
                })
              : sweetAlert({
                  title: "जतन केले!",
                  text: "रेकॉर्ड यशस्वीरित्या जतन केले!",
                  icon: "success",
                  button: "ओके",
                });
            setFetchData(tempData);
            setIsOpenCollapse(false);
            getVehicleTypes();
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
            .post(`${urls.SMURL}/mstVehicleType/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                language == "en"
                  ? sweetAlert({
                      title: "Inactivated!",
                      text: "Record is Successfully Inactivated!",
                      icon: "success",
                      button: "Ok",
                    })
                  : sweetAlert({
                      title: "निष्क्रिय केले!",
                      text: "रेकॉर्ड यशस्वीरित्या निष्क्रिय केले आहे!",
                      icon: "success",
                      button: "Ok",
                    });
                getVehicleTypes();
                // setButtonInputState(false);
                exitButton();
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              setLoading(false);
              callCatchMethod(err, language);
            });
        } else if (willDelete == null) {
          language == "en"
            ? sweetAlert({
                title: "Cancel!",
                text: "Record is Successfully Cancel!!",
                icon: "success",
                button: "Ok",
              })
            : sweetAlert({
                title: "रद्द केले!",
                text: "रेकॉर्ड यशस्वीरित्या रद्द केले!",
                icon: "success",
                button: "ओके",
              });
        }
      });
    } else {
      const textAlert =
        language == "en"
          ? "Are you sure you want to activate this Record ? "
          : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता?";
      const title = language == "en" ? "Activate?" : "सक्रिय करायचे?";

      sweetAlert({
        title: title,
        text: textAlert,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.SMURL}/mstVehicleType/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                language == "en"
                  ? sweetAlert({
                      title: "Activate!",
                      text: "The record is Successfully Activated!",
                      icon: "success",
                      button: "Ok",
                    })
                  : sweetAlert({
                      title: "हटवले!",
                      text: "रेकॉर्ड यशस्वीरित्या सक्रिय केला गेला आहे!",
                      icon: "success",
                      button: "Ok",
                    });
                // getPaymentRate();
                getVehicleTypes();
                // setButtonInputState(false);
                exitButton();
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              setLoading(false);
              callCatchMethod(err, language);
            });
        } else if (willDelete == null) {
          language == "en"
            ? sweetAlert({
                title: "Cancel!",
                text: "Record is Successfully Cancel!!",
                icon: "success",
                button: "Ok",
              })
            : sweetAlert({
                title: "रद्द केले!",
                text: "रेकॉर्ड यशस्वीरित्या रद्द केले!",
                icon: "success",
                button: "ओके",
              });
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
    vehicleTypePrefix: "",
    vehicleType: "",
    vehicleTypeMr: "",
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
      field: "vehicleTypePrefix",
      headerName: <FormattedLabel id="vehicleTypePrefix" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "vehicleType",
      headerName: <FormattedLabel id="_vehicleType" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "vehicleTypeMr",
      headerName: <FormattedLabel id="_vehicleTypeMr" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      hide: false,
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
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
                    setValue(
                      "vehicleTypePrefix",
                      params.row.vehicleTypePrefix
                        ? params.row.vehicleTypePrefix
                        : null
                    );
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
        <title>Vehicle Type</title>
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
            <FormattedLabel id="_vehicleTypeMaster" />
          </strong>
        </Typography>
      </Box>

      <Box>
        {loading ? (
          <Loader />
        ) : (
          <>
            {isOpenCollapse ? (
              <>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Paper>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={6}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            id="outlined-basic"
                            variant="outlined"
                            label={<FormattedLabel id="vehicleTypePrefix" />}
                            size="small"
                            fullWidth
                            {...register("vehicleTypePrefix")}
                            sx={{ width: "90%" }}
                            InputLabelProps={{
                              shrink: watch("vehicleTypePrefix") ? true : false,
                            }}
                            error={!!errors.vehicleTypePrefix}
                            helperText={
                              errors?.vehicleTypePrefix
                                ? errors.vehicleTypePrefix.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Box sx={{ width: "90%" }}>
                            <Transliteration
                              variant={"outlined"}
                              _key={"vehicleType"}
                              labelName={"vehicleType"}
                              fieldName={"vehicleType"}
                              updateFieldName={"vehicleTypeMr"}
                              sourceLang={"eng"}
                              targetLang={"mar"}
                              label={
                                <FormattedLabel id="_vehicleType" required />
                              }
                              error={!!errors.vehicleType}
                              helperText={
                                errors?.vehicleType
                                  ? errors.vehicleType.message
                                  : null
                              }
                            />
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={6}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Box sx={{ width: "90%" }}>
                            <Transliteration
                              variant={"outlined"}
                              _key={"vehicleTypeMr"}
                              labelName={"vehicleTypeMr"}
                              fieldName={"vehicleTypeMr"}
                              updateFieldName={"vehicleType"}
                              sourceLang={"mar"}
                              targetLang={"eng"}
                              label={
                                <FormattedLabel id="_vehicleTypeMr" required />
                              }
                              error={!!errors.vehicleTypeMr}
                              helperText={
                                errors?.vehicleTypeMr
                                  ? errors.vehicleTypeMr.message
                                  : null
                              }
                            />
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
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
                </FormProvider>
              </>
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
                      getVehicleTypes(data.pageSize, _data);
                    }}
                    onPageSizeChange={(_data) => {
                      getVehicleTypes(_data, data.page);
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
