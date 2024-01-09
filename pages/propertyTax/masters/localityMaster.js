import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Button,
  Paper,
  Select,
  MenuItem,
  Slide,
  TextField,
  FormControl,
  InputLabel,
  FormHelperText,
  Grid,
  Box,
  ThemeProvider,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import swal from "sweetalert";
import { useSelector } from "react-redux";
import Schema from "../../../containers/schema/propertyTax/masters/localityMaster";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../URLS/urls";

import theme from "../../../theme";
import styles from "../../../components/propertyTax/propertyRegistration/view.module.css";
import { catchExceptionHandlingMethod } from "../../../util/util";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(Schema),
    mode: "onChange",
  });

  const userToken = useGetToken();

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [btnSaveTextMr, setBtnSaveTextMr] = useState("जतन करा");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [zones, setZone] = useState([]);
  const [circleName, setCircleName] = useState([]);
  const [gatNames, setGatNames] = useState([
    { id: 1, gatNo: 1, gatName: "Gat 1", gatNameMr: "Gat 1" },
  ]);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const language = useSelector((store) => store.labels.language);

  useEffect(() => {
    getAllLocality();
  }, [zones, circleName, gatNames]);
  console.log("222", zones);
  // Get Table - Data
  const getAllLocality = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.PTAXURL}/master/locality/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },

        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        let result = res.data.locality;
        let _res = result?.map((val, i) => {
          console.log("44");
          return {
            activeFlag: val.activeFlag,
            id: val.id,
            srNo: i + 1,
            localityPrefix: val.localityPrefix,
            zone: val.zone,
            administrativeZoneEn: zones?.find((obj) => obj.id == val.zone)
              ?.adZoneName,
            circle: val.circle,
            circle1: circleName.find((obj) => obj.id == val.circle)?.circleName,
            gat: val.gat,
            landmark: val.landmark,
            landmarkMr: val.landmarkMr,
            fromDate: val.fromDate,
            toDate: val.toDate,
            remark: val.remark,
            status: val.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });
        console.log("send", _res);
        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));
  };

  //get All Administrative Zone
  const getZone = () => {
    axios
      .get(`${urls.PTAXURL}/master/administrativeZone/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setZone(
          res.data?.administrativeZone.map((r, i) => ({
            id: r.id,
            adZoneName: r.adZoneName,
          }))
        );
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));
  };

  //CircleName
  const gettingCircleName = () => {
    axios
      .get(`${urls.PTAXURL}/master/circle/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("res", res);
        setCircleName(
          res.data?.circle.map((r, i) => ({
            id: r.id,
            circleName: r.circleName,
          }))
        );
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));
  };

  // Gat NAME
  const gettingGatName = () => {
    // axios.get(`${urls.PTAXURL}/master/gatMapping/getAll`).then((res) => {
    //   console.log("res", res)
    //   setGatNames(
    //     res.data?.gat.map((r, i) => ({
    //       id: r.id,
    //       gatName: r.gatName,
    //     }))
    //   )
    // })
  };

  useEffect(() => {
    getZone();
    gettingCircleName();
    gettingGatName();
  }, []);

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    // Save - DB
    // alert("Clicked...");

    const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
    const toDate = moment(formData.toDate).format("YYYY-MM-DD");

    const finalBodyForApi = {
      ...formData,
      fromDate,
      toDate,
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    };
    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(`${urls.PTAXURL}/master/locality/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getAllLocality();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      })
      .catch((error) => {
        if (error.request.status === 500) {
          swal(error.response.data.message, {
            icon: "error",
          });
          getAllLocality();
          setButtonInputState(false);
        } else {
          catchExceptionHandlingMethod(error, language);
          getAllLocality();
          setButtonInputState(false);
        }
        // console.log("error", error);
      });
  };

  // // Delete By ID
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
            .post(`${urls.PTAXURL}/master/locality/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status === 200 || res.status === 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getAllLocality();
                setButtonInputState(false);
              }
            })
            .catch((error) => {
              if (error.request.status === 500) {
                swal(error.response.data.message, {
                  icon: "error",
                });
                getAllLocality();
                setButtonInputState(false);
              } else {
                catchExceptionHandlingMethod(error, language);
                getAllLocality();
                setButtonInputState(false);
              }
              console.log("error", error);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
          setButtonInputState(false);
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
            .post(`${urls.PTAXURL}/master/locality/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status === 200 || res.status === 201) {
                swal("Record is Successfully Recovered!", {
                  icon: "success",
                });
                getAllLocality();
                setButtonInputState(false);
              }
            })
            .catch((error) => {
              if (error.request.status === 500) {
                swal(error.response.data.message, {
                  icon: "error",
                });
                getAllLocality();
                setButtonInputState(false);
              } else {
                catchExceptionHandlingMethod(error, language);
                getAllLocality();
                setButtonInputState(false);
              }
              console.log("error", error);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
          setButtonInputState(false);
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
    localityPrefix: "",
    administrativeZone: "",
    gat: "",
    circle: "",
    remark: "",
    landmark: "",
    landmarkMr: "",
    fromDate: null,
    toDate: null,
  };

  // Reset Values Exit
  const resetValuesExit = {
    localityPrefix: "",
    administrativeZone: "",
    gat: "",
    circle: "",
    remark: "",
    landmark: "",
    landmarkMr: "",
    fromDate: null,
    toDate: null,
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
    },
    {
      field: "landmark",
      headerName: <FormattedLabel id="landmark" />,
      flex: 1,
    },
    {
      field: "landmarkMr",
      headerName: "Landmark in marathi",
      flex: 1,
    },
    {
      field: "administrativeZoneEn",
      headerName: <FormattedLabel id="administrativeZone" />,
      flex: 1,
    },
    {
      field: "circle1",
      headerName: <FormattedLabel id="circleName" />,
      flex: 1,
    },
    { field: "fromDate", headerName: "fromDate" },
    { field: "toDate", headerName: "toDate" },
    { field: "status", headerName: "Status" },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setBtnSaveTextMr("अद्यतन"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
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
                  setBtnSaveTextMr("अद्यतन"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
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
          </>
        );
      },
    },
  ];

  // Row

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Paper style={{ margin: "30px" }}>
          <Box
            style={{
              height: "auto",
              overflow: "auto",
              padding: "10px 80px",
            }}
          >
            <Grid
              className={styles.details}
              item
              xs={12}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // backgroundColor: linearGradient(
                //   "90deg,rgb(72 115 218 / 91%) 2%,rgb(142 122 231) 100%"
                // ),
                color: "black",
                padding: "8px",
                fontSize: 19,
                borderRadius: "20px",
              }}
            >
              <strong>
                <FormattedLabel id="localityMaster" />
              </strong>
            </Grid>
          </Box>

          {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

          {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <div>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <Grid
                    container
                    spacing={2}
                    style={{
                      padding: "10px",
                      display: "flex",
                      alignItems: "baseline",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        size="small"
                        id="standard-basic"
                        label="Locality Prefix"
                        variant="standard"
                        {...register("localityPrefix")}
                        error={!!errors.localityPrefix}
                        helperText={
                          errors?.localityPrefix
                            ? errors.localityPrefix.message
                            : null
                        }
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        error={!!errors.zone}
                        style={{ width: "230px" }}
                      >
                        <InputLabel>
                          {<FormattedLabel id="administrativeZone" />}
                        </InputLabel>
                        <Controller
                          control={control}
                          render={({ field }) => (
                            <Select
                              fullWidth
                              value={field.value}
                              label={<FormattedLabel id="administrativeZone" />}
                              onChange={(value) => field.onChange(value)}
                              // style={{ height: 40, padding: "14px 14px" }}
                              variant="standard"
                            >
                              {zones &&
                                zones.map((zone, i) => (
                                  <MenuItem key={i} value={zone.id}>
                                    {zone.adZoneName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="zone"
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.zone ? errors.zone.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        error={!!errors.circle}
                        style={{ width: "230px" }}
                      >
                        <InputLabel>
                          {<FormattedLabel id="circleName" />}
                        </InputLabel>
                        <Controller
                          control={control}
                          render={({ field }) => (
                            <Select
                              fullWidth
                              value={field.value}
                              label={<FormattedLabel id="circleName" />}
                              onChange={(value) => field.onChange(value)}
                              // style={{ height: 40, padding: "14px 14px" }}
                              variant="standard"
                            >
                              {circleName &&
                                circleName.map((circleName, i) => (
                                  <MenuItem key={i} value={circleName.id}>
                                    {circleName.circleName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="circle"
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.circle ? errors.circle.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        error={!!errors.gat}
                        style={{ width: "230px" }}
                      >
                        <InputLabel>
                          {<FormattedLabel id="gatName" />}
                        </InputLabel>
                        <Controller
                          control={control}
                          render={({ field }) => (
                            <Select
                              fullWidth
                              value={field.value}
                              label={<FormattedLabel id="gatName" />}
                              onChange={(value) => field.onChange(value)}
                              // style={{ height: 40, padding: "14px 14px" }}
                              variant="standard"
                            >
                              {gatNames &&
                                gatNames.map((gatName, i) => (
                                  <MenuItem key={i} value={gatName.id}>
                                    {gatName.gatName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="gat"
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.gat ? errors.gat.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        size="small"
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="landmark" />}
                        variant="standard"
                        {...register("landmark")}
                        error={!!errors.landmark}
                        helperText={
                          errors?.landmark ? errors.landmark.message : null
                        }
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        size="small"
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        label="Landmark Mr"
                        variant="standard"
                        {...register("landmarkMr")}
                        error={!!errors.landmarkMr}
                        helperText={
                          errors?.landmarkMr ? errors.landmarkMr.message : null
                        }
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        style={{ backgroundColor: "white" }}
                        error={!!errors.fromDate}
                      >
                        <Controller
                          control={control}
                          name="fromDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel id="fromDate" />
                                  </span>
                                }
                                value={field.value || null}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    fullWidth
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.fromDate ? errors.fromDate.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        style={{ backgroundColor: "white" }}
                        error={!!errors.toDate}
                      >
                        <Controller
                          control={control}
                          name="toDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel id="toDate" />
                                  </span>
                                }
                                value={field.value || null}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    fullWidth
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.toDate ? errors.toDate.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        size="small"
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="remark" />}
                        variant="standard"
                        {...register("remark")}
                      />
                    </Grid>
                  </Grid>

                  <Grid container style={{ padding: "10px" }} spacing={2}>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        endIcon={<SaveIcon />}
                      >
                        {language === "en" ? btnSaveText : btnSaveTextMr}
                      </Button>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                      >
                        {<FormattedLabel id="clear" />}
                      </Button>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="error"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitButton()}
                      >
                        {<FormattedLabel id="exit" />}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </div>
            </Slide>
          )}

          <Grid
            style={{ padding: "10px" }}
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={9}></Grid>
            <Grid
              item
              xs={2}
              style={{ display: "flex", justifyContent: "center" }}
            >
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
                  setBtnSaveTextMr("जतन करा");
                  setButtonInputState(true);
                  setSlideChecked(true);
                  setIsOpenCollapse(!isOpenCollapse);
                }}
              >
                {<FormattedLabel id="add" />}
              </Button>
            </Grid>
          </Grid>

          <Box style={{ height: "auto", overflow: "auto", padding: "10px" }}>
            <DataGrid
              sx={{
                overflowY: "scroll",

                "& .MuiDataGrid-virtualScrollerContent": {
                  // backgroundColor:'red',
                  // height: '800px !important',
                  // display: "flex",
                  // flexDirection: "column-reverse",
                  // overflow:'auto !important'
                },
                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#556CD6",
                  color: "white",
                },

                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
              }}
              disableColumnFilter
              disableColumnSelector
              disableDensitySelector
              components={{ Toolbar: GridToolbar }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                  disableExport: true,
                  disableToolbarButton: true,
                  csvOptions: { disableToolbarButton: true },
                  printOptions: { disableToolbarButton: true },
                },
              }}
              density="compact"
              autoHeight={true}
              // rowHeight={50}
              pagination
              paginationMode="server"
              // loading={data.loading}
              rowCount={data?.totalRows}
              rowsPerPageOptions={data?.rowsPerPageOptions}
              page={data?.page}
              pageSize={data?.pageSize}
              rows={data?.rows}
              columns={columns}
              onPageChange={(_data) => {
                getAllLocality(data?.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                // updateData("page", 1);
                getAllLocality(_data, data?.page);
              }}
            />
          </Box>
        </Paper>
      </div>
    </ThemeProvider>
  );
};

export default Index;
