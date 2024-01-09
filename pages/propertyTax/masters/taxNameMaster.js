import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
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
  Grid,
  Box,
  InputLabel,
  Select,
  MenuItem,
  ThemeProvider,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import swal from "sweetalert";
import Schema from "../../../containers/schema/propertyTax/masters/taxNameMaster";
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
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(Schema),
    mode: "onSubmit",
  });

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [btnSaveTextMr, setBtnSaveTextMr] = useState("जतन करा");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [typeOfTaxes, setTypeOfTaxes] = useState([]);
  const userToken = useGetToken();

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const language = useSelector((store) => store.labels.language);

  useEffect(() => {
    getTypeOfTax();
  }, []);

  useEffect(() => {
    getAllTaxName();
  }, [typeOfTaxes]);

  // Get Table - Data
  const getAllTaxName = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.PTAXURL}/master/taxName/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log(";res", res);

        let result = res.data?.taxName;
        let _res = result?.map((val, i) => {
          console.log("44");
          return {
            activeFlag: val.activeFlag,
            id: val.id,
            srNo: i + 1,
            taxName: val.taxName,
            taxNameMr: val.taxNameMr,
            typeOfTax: val.typeOfTax,
            taxTypeName: typeOfTaxes.find((obj) => obj.id == val.typeOfTax)
              ?.taxType,
            applicabilityOn: val.applicabilityOn,
            propertyArea: val.propertyArea,
            priorityOfCollectionOrder: val.priorityOfCollectionOrder,
            priorityOfBillDisplay: val.priorityOfBillDisplay,
            fromDate: moment(val.fromDate).format("YYYY-MM-DD"),
            toDate: val.toDate,
            remark: val.remark,
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

  // Tax Type
  const getTypeOfTax = () => {
    axios
      .get(`${urls.PTAXURL}/master/taxTypeMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setTypeOfTaxes(
          res.data?.taxType.map((r, i) => ({
            id: r.id,
            taxType: r.taxType,
          }))
        );
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));
  };

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    // Save - DB
    // alert("Clicked...");
    console.log("form Data", formData);

    const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
    const toDate = moment(formData.toDate).format("YYYY-MM-DD");

    const finalBodyForApi = {
      ...formData,
      fromDate,
      toDate,
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    };

    console.log("420", finalBodyForApi);

    axios
      .post(`${urls.PTAXURL}/master/taxName/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getAllTaxName();
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
          getAllTaxName();
          setButtonInputState(false);
        } else {
          catchExceptionHandlingMethod(error, language);
          getAllTaxName();
          setButtonInputState(false);
        }
        // console.log("error", error);
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));
  };

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };

    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("520", body);
        if (willDelete === true) {
          axios
            .post(`${urls.PTAXURL}/master/taxName/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200 || res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getAllTaxName();
                setButtonInputState(false);
              }
            })
            .catch((error) => {
              if (error.request.status === 500) {
                swal(error.response.data.message, {
                  icon: "error",
                });
                getAllTaxName();
                setButtonInputState(false);
              } else {
                catchExceptionHandlingMethod(error, language);
                getAllTaxName();
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
        // console.log("inn", willDelete);
        console.log("620", body);

        if (willDelete) {
          axios
            .post(`${urls.PTAXURL}/master/taxName/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200 || res.status == 201) {
                swal("Record is Successfully Recovered!", {
                  icon: "success",
                });
                getAllTaxName();
                setButtonInputState(false);
              }
            })
            .catch((error) => {
              if (error.request.status === 500) {
                swal(error.response.data.message, {
                  icon: "error",
                });
                getAllTaxName();
                setButtonInputState(false);
              } else {
                swal("Something went wrong!", {
                  icon: "error",
                });
                getAllTaxName();
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
    taxName: "",
    taxNameMr: "",
    typeOfTax: "",
    applicabilityOn: "",
    propertyArea: "",
    priorityOfCollectionOrder: "",
    priorityOfBillDisplay: "",
    remark: "",
    fromDate: null,
    toDate: null,
  };

  // Reset Values Exit
  const resetValuesExit = {
    taxName: "",
    taxNameMr: "",
    typeOfTax: "",
    applicabilityOn: "",
    propertyArea: "",
    priorityOfCollectionOrder: "",
    priorityOfBillDisplay: "",
    remark: "",
    fromDate: null,
    toDate: null,
    id: null,
  };

  const columns = [
    { field: "srNo", headerName: <FormattedLabel id="srNo" /> },
    {
      field: "taxName",
      headerName: <FormattedLabel id="taxName" />,
      flex: 1,
    },
    {
      field: "taxNameMr",
      headerName: "Tax Name Mr",
      flex: 1,
    },
    {
      // field: "typeOfTax",
      field: "taxTypeName",
      headerName: <FormattedLabel id="typeOfTax" />,
      flex: 1,
    },
    {
      field: "propertyArea",
      headerName: <FormattedLabel id="propertyArea" />,
      flex: 1,
    },
    {
      field: "fromDate",
      headerName: <FormattedLabel id="fromDate" />,
      flex: 1,
    },
    { field: "toDate", headerName: <FormattedLabel id="toDate" /> },
    { field: "status", headerName: <FormattedLabel id="status" /> },
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
                setBtnSaveText("Update");
                setBtnSaveTextMr("अद्यतन");
                setID(params.row.id);
                setIsOpenCollapse(true);
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
                setBtnSaveText("Update");
                setBtnSaveTextMr("अद्यतन");
                setID(params.row.id);
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
                <FormattedLabel id="taxNameMaster" />
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
                  {/* ////////////////////////////////////////First Line//////////////////////////////////////////// */}
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
                      <FormControl
                        error={!!errors.typeOfTax}
                        style={{ width: "230px" }}
                      >
                        <InputLabel>
                          {<FormattedLabel id="typeOfTax" />}
                        </InputLabel>
                        <Controller
                          control={control}
                          render={({ field }) => (
                            <Select
                              fullWidth
                              value={field.value}
                              label={<FormattedLabel id="typeOfTax" />}
                              onChange={(value) => field.onChange(value)}
                              // style={{ height: 40, padding: "14px 14px" }}
                              variant="standard"
                            >
                              {typeOfTaxes &&
                                typeOfTaxes.map((T_type, i) => (
                                  <MenuItem key={i} value={T_type.id}>
                                    {T_type.taxType}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="typeOfTax"
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.typeOfTax ? errors.typeOfTax.message : null}
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
                        label={<FormattedLabel id="taxName" />}
                        variant="standard"
                        {...register("taxName")}
                        error={!!errors.taxName}
                        helperText={
                          errors?.taxName ? errors.taxName.message : null
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
                        label="Tax Name Mr"
                        variant="standard"
                        {...register("taxNameMr")}
                        error={!!errors.taxNameMr}
                        helperText={
                          errors?.taxNameMr ? errors.taxNameMr.message : null
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
                        label={<FormattedLabel id="propertyArea" />}
                        variant="standard"
                        {...register("applicabilityOn")}
                        error={!!errors.applicabilityOn}
                        helperText={
                          errors?.applicabilityOn
                            ? errors.applicabilityOn.message
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
                      <TextField
                        size="small"
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="propertyArea" />}
                        variant="standard"
                        {...register("propertyArea")}
                        error={!!errors.propertyArea}
                        helperText={
                          errors?.propertyArea
                            ? errors.propertyArea.message
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
                      <TextField
                        size="small"
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        label={
                          <FormattedLabel id="priorityOfCollectionOrder" />
                        }
                        variant="standard"
                        {...register("priorityOfCollectionOrder")}
                        error={!!errors.priorityOfCollectionOrder}
                        helperText={
                          errors?.priorityOfCollectionOrder
                            ? errors.priorityOfCollectionOrder.message
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
                      <TextField
                        size="small"
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="priorityOfBillDisplay" />}
                        variant="standard"
                        {...register("priorityOfBillDisplay")}
                        error={!!errors.priorityOfBillDisplay}
                        helperText={
                          errors?.priorityOfBillDisplay
                            ? errors.priorityOfBillDisplay.message
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

                  {/* ////////////////////////////////////////Second Line//////////////////////////////////////////// */}

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
                </form>
              </div>
            </Slide>
          )}

          <Grid
            container
            style={{ padding: "10px" }}
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
                <FormattedLabel id="add" />
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
              rows={data?.rows || []}
              columns={columns}
              onPageChange={(_data) => {
                getAllTaxName(data?.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                // updateData("page", 1);
                getAllTaxName(_data, data?.page);
              }}
            />
          </Box>
        </Paper>
      </div>
    </ThemeProvider>
  );
};

export default Index;
