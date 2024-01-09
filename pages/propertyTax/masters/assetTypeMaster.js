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
  Slide,
  TextField,
  FormControl,
  FormHelperText,
  Box,
  Grid,
  Divider,
  ThemeProvider,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm, Controller } from "react-hook-form";
// import styles from "../../../styles/view.module.css"
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import router from "next/router";
import schema from "../../../containers/schema/propertyTax/masters/assetTypeMaster";
import moment from "moment";
import swal from "sweetalert";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
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
    methods,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onSubmit",
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
  const [isDisabled, setIsDisabled] = useState(true);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const language = useSelector((store) => store.labels.language);

  useEffect(() => {
    getAllAssetType();
  }, []);

  // Get Table - Data

  const getAllAssetType = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.PTAXURL}/master/assetType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        // console.log("response", res);
        let result = res.data?.assetType;
        let _res = result.map((val, i) => {
          return {
            id: val.id,
            srNo: i + 1,
            assetType: val.assetType,
            assetName: val.assetName,
            assetNameMr: val.assetNameMr,
            fromDate: moment(val.fromDate).format("llll"),
            toDate: val.toDate,
            remark: val.remark,
            activeFlag: val.activeFlag,
            status: val.activeFlag === "Y" ? "Active" : "Inactive",
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
      .catch((error) => catchExceptionHandlingMethod(error, language));
  };

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    // alert("Clickeddd....");
    console.log("formData", formData);

    const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
    const toDate = moment(formData.toDate).format("YYYY-MM-DD");

    const finalBodyForApi = {
      ...formData,
      fromDate,
      toDate,
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    };

    axios
      .post(`${urls.PTAXURL}/master/assetType/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("save data", res);
        if (res.status === 200 || res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getAllAssetType();
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
          getAllAssetType();
          setButtonInputState(false);
        } else {
          catchExceptionHandlingMethod(error, language);
          getAllAssetType();
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
            .post(`${urls.PTAXURL}/master/assetType/save`, body, {
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
                getAllAssetType();
                setButtonInputState(false);
              }
            })
            .catch((error) => {
              if (error.request.status === 500) {
                swal(error.response.data.message, {
                  icon: "error",
                });
                getAllAssetType();
                setButtonInputState(false);
              } else {
                catchExceptionHandlingMethod(error, language);
                getAllAssetType();
                setButtonInputState(false);
              }
              // console.log("error", error);
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
            .post(`${urls.PTAXURL}/master/assetType/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status === 200 || res.status == 201) {
                swal("Record is Successfully Recovered!", {
                  icon: "success",
                });
                getAllAssetType();
                setButtonInputState(false);
              }
            })
            .catch((error) => {
              if (error.request.status === 500) {
                swal(error.response.data.message, {
                  icon: "error",
                });
                getAllAssetType();
                setButtonInputState(false);
              } else {
                catchExceptionHandlingMethod(error, language);
                getAllAssetType();
                setButtonInputState(false);
              }
              // console.log("error", error);
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
    assetType: "",
    assetName: "",
    assetNameMr: "",
    remark: "",
    fromDate: null,
    toDate: null,
  };

  // Reset Values Exit
  const resetValuesExit = {
    assetType: "",
    assetName: "",
    assetNameMr: "",
    remark: "",
    fromDate: null,
    toDate: null,
    id: null,
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "assetType",
      headerName: <FormattedLabel id="assetType" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "assetName",
      headerName: <FormattedLabel id="assetName" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "assetNameMr",
      headerName: "Asset Name Mr",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
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
                window.scrollTo(300, 0);
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
                <FormattedLabel id="assetTypeMaster" />
              </strong>
            </Grid>
          </Box>
          {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <form onSubmit={handleSubmit(onSubmitForm)}>
                {/* //////////////////////////FIRST LINE////////////////////////// */}

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
                                <TextField {...params} size="small" fullWidth />
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
                                <TextField {...params} size="small" fullWidth />
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
                      label={<FormattedLabel id="assetType" />}
                      variant="standard"
                      {...register("assetType")}
                      error={!!errors.assetType}
                      helperText={
                        errors?.assetType ? errors.assetType.message : null
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
                      label={<FormattedLabel id="assetName" />}
                      variant="standard"
                      {...register("assetName")}
                      error={!!errors.assetName}
                      helperText={
                        errors?.assetName ? errors.assetName.message : null
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
                      label={<FormattedLabel id="assetNameMr" />}
                      variant="standard"
                      {...register("assetNameMr")}
                      error={!!errors.assetNameMr}
                      helperText={
                        errors?.assetNameMr ? errors.assetNameMr.message : null
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
                      label={<FormattedLabel id="remark" />}
                      variant="standard"
                      {...register("remark")}
                    />
                  </Grid>
                </Grid>
                {/* //////////////////////////SECOND LINE////////////////////////// */}

                {/* //////////////////////////THIRD LINE////////////////////////// */}
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
                      {/* <FormattedLabel id={btnSaveText} /> */}
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
                      <FormattedLabel id="clear" />
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
                      <FormattedLabel id="exit" />
                    </Button>
                  </Grid>
                </Grid>
                <Divider />
              </form>
            </Slide>
          )}
          <Grid container style={{ padding: "10px" }}>
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
                <FormattedLabel id="add" />
              </Button>
            </Grid>
          </Grid>

          <Box style={{ height: "auto", overflow: "auto", padding: "10px" }}>
            <DataGrid
              sx={{
                // fontSize: 16,
                // fontFamily: 'Montserrat',
                // font: 'center',
                // backgroundColor:'yellow',
                // // height:'auto',
                // border: 2,
                // borderColor: "primary.light",
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
              density="standard"
              autoHeight={true}
              // rowHeight={50}
              pagination
              paginationMode="server"
              // loading={data.loading}
              rowCount={data?.totalRows}
              rowsPerPageOptions={data.rowsPerPageOptions}
              page={data?.page}
              pageSize={data?.pageSize}
              rows={data?.rows || []}
              columns={columns}
              onPageChange={(_data) => {
                getAllAssetType(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                // updateData("page", 1);
                getAllAssetType(_data, data.page);
              }}
            />
          </Box>
        </Paper>
      </div>
    </ThemeProvider>
  );
};

export default Index;
