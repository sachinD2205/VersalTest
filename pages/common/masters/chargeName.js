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
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Paper,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../containers/schema/common/chargeNameSchema";
import Transliteration from "../../../components/common/linguosol/transliteration";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import Loader from "../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../util/util";

const ChargeName = () => {
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

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();

  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState(0);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

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

  let abc = [];

  useEffect(() => {
    getBillType();
  }, []);

  // useEffect(() => {
  //   getBillType();
  // },[rowCount])

  const getBillType = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setLoading(true);
    axios
      .get(`${urls.CFCURL}/master/chargeName/getAll`, {
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
        setLoading(false);
        let result = res.data.chargeName;
        let _res = result.map((val, i) => {
          console.log("44");
          return {
            activeFlag: val.activeFlag,
            // srNo: val.id,
            srNo: Number(_pageNo + "0") + i + 1,

            // chargePrefix:val.chargePrefix,
            // chargeNamePrefixMr: val.chargeNamePrefixMr ? val.chargeNamePrefixMr : "-",
            // chargeNamePrefix: val.chargeNamePrefix ? val.chargeNamePrefix : "-",
            chargeNamePrefix: val.chargeNamePrefix ? val.chargeNamePrefix : "-",
            chargeNamePrefixMr: val.chargeNamePrefixMr
              ? val.chargeNamePrefixMr
              : "-",

            charge: val.charge ? val.charge : "-",
            chargeMr: val.chargeMr ? val.chargeMr : "-",
            // chargePrefix: val.chargePrefix ? val.chargePrefix : "-",

            // chargeName: val. charge ? val.charge : "-",
            // chargeNameMr: val. chargeNameMr ? val. chargeNameMr : "-",

            id: val.id,
            // fromDate: moment(val.fromDate).format("llll"),
            fromDate: val.fromDate
              ? moment(val.fromDate, "YYYY-MM-DD").format("DD/MM/YYYY")
              : "-",
            toDate: val.toDate
              ? moment(val.toDate, "YYYY-MM-DD").format("DD/MM/YYYY")
              : "-",
            _fromDate: val.fromDate,
            _toDate: val.toDate,
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
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

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
            .post(`${urls.CFCURL}/master/chargeName/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getBillType();
                setButtonInputState(false);
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              setLoading(false);
              callCatchMethod(err, language);
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
          axios
            .post(`${urls.CFCURL}/master/chargeName/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getBillType();
                setButtonInputState(false);
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              setLoading(false);
              callCatchMethod(err, language);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    charge: "",
    chargeMr: "",
    chargeNamePrefix: "",
    chargeNamePrefixMr: "",
    fromDate: null,
    toDate: null,
  };

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

  const onSubmitForm = (formData) => {
    console.log("formData", formData);
    const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
    const toDate = moment(formData.toDate).format("YYYY-MM-DD");
    const finalBodyForApi = {
      ...formData,
      fromDate,
      toDate,
      // activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    };

    console.log("finalBodyForApi", finalBodyForApi);
    // const data = {
    //     "fromDate": "2022-11-23T16:00:00",
    //     "toDate":"2022-11-23T16:00:00",
    //     "billPrefix":"Test",
    //     "billType":"Tust"
    // };

    axios
      .post(`${urls.CFCURL}/master/chargeName/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("save data", res);
        if (res.status == 200) {
          if (res?.data?.errors?.length > 0) {
            res?.data?.errors?.map((x) => {
              if (x.field == "charge") {
                setError("charge", {
                  message: x.code,
                });
              } else if (x.field == "chargeMr") {
                setError("chargeMr", {
                  message:
                    x.code == "Field Charge Is Already Exist" &&
                    "Field Charge (In marathi) Is Already Exist",
                });
              } else if (x.field == "chargeNamePrefix") {
                setError("chargeNamePrefix", {
                  message: x.code,
                });
              }
            });
          } else {
            formData.id
              ? sweetAlert(
                  "Updated!",
                  "Record Updated successfully !",
                  "success"
                )
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            getBillType();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const resetValuesExit = {
    chargeNamePrefix: "",
    chargeNamePrefixMr: "",
    chargeMr: "",
    charge: "",
    fromDate: "",
    toDate: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.4,
      headerAlign: "center",
    },

    {
      field: "fromDate",
      headerName: <FormattedLabel id="fromDate" />,
      // type: "number",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "toDate",
      headerName: <FormattedLabel id="toDate" />,
      // type: "number",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "charge",
      headerName: <FormattedLabel id="charge" />,
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "chargeMr",
      headerName: <FormattedLabel id="chargeMr" />,
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "chargeNamePrefix",
      headerName: <FormattedLabel id="chargeNamePrefix" />,
      flex: 0.5,
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      // type: "number",
      flex: 0.5,
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 0.5,
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
                  setValue("fromDate", params.row._fromDate);
                  setValue("toDate", params.row._toDate);
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
                // setIsOpenCollapse(true),
                // // console.log('params.row: ', params.row)
                // reset(params.row)
                // setLoiGeneration(params.row.loiGeneration)
                // setScrutinyProcess(params.row.scrutinyProcess)
                // setImmediateAtCounter(params.row.immediateAtCounter)
                // setRtsSelection(params.row.rtsSelection)
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

  return (
    <>
      <Box>
        <BreadcrumbComponent />
      </Box>
      <div
        style={{
          // backgroundColor: "#0084ff",
          backgroundColor: "#757ce8",
          color: "white",
          fontSize: 19,
          padding: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 100,
        }}
      >
        <FormattedLabel id="chargeName" />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <Box>
          {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <div>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmitForm)}>
                    <Grid
                      container
                      style={{
                        padding: "10px",
                      }}
                    >
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          sx={{ width: "90%", backgroundColor: "white" }}
                          error={!!errors.fromDate}
                          size="small"
                          required
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
                                      error={!!errors.fromDate}
                                      fullWidth
                                      InputLabelProps={{
                                        style: {
                                          fontSize: 12,
                                        },
                                      }}
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
                        sm={4}
                        md={4}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          size="small"
                          sx={{ width: "90%", backgroundColor: "white" }}
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
                                      error={!!errors.toDate}
                                      fullWidth
                                      InputLabelProps={{
                                        style: {
                                          fontSize: 12,
                                        },
                                      }}
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
                    </Grid>
                    <Grid
                      container
                      style={{
                        padding: "10px",
                      }}
                    >
                      {/* <Grid
                  item
                  xs={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "75%" }}
                    size="small"
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label="Bill prefix"
                    label={<FormattedLabel id="chargeNamePrefixMr" />}
                    variant="outlined"
                    {...register("chargeNamePrefixMr")}
                    error={!!errors.chargeNamePrefixMr}
                    helperText={errors?.chargeNamePrefixMr ? errors.chargeNamePrefixMr.message : null}
                  />
                </Grid> */}
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {" "}
                        <Box sx={{ width: "90%" }}>
                          <Transliteration
                            variant={"outlined"}
                            _key={"charge"}
                            labelName={"charge"}
                            fieldName={"charge"}
                            updateFieldName={"chargeMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            label={<FormattedLabel id="charge" required />}
                            error={!!errors.charge}
                            helperText={
                              errors?.charge ? errors.charge.message : null
                            }
                          />
                        </Box>
                        {/* <TextField
                    sx={{ width: "90%" }}
                    size="small"
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="charge" />}
                    variant="outlined"
                    {...register("charge")}
                    error={!!errors.charge}
                    helperText={errors?.charge ? errors.charge.message : null}
                  /> */}
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {" "}
                        <Box sx={{ width: "90%" }}>
                          <Transliteration
                            variant={"outlined"}
                            _key={"chargeMr"}
                            labelName={"chargeMr"}
                            fieldName={"chargeMr"}
                            updateFieldName={"charge"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            label={<FormattedLabel id="chargeMr" required />}
                            error={!!errors.chargeMr}
                            helperText={
                              errors?.chargeMr ? errors.chargeMr.message : null
                            }
                          />
                        </Box>
                        {/* <TextField
                    sx={{ width: "90%" }}
                    size="small"
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="chargeMr" />}
                    variant="outlined"
                    {...register("chargeMr")}
                    error={!!errors.chargeMr}
                    helperText={
                      errors?.chargeMr ? errors.chargeMr.message : null
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
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: "90%" }}
                          size="small"
                          style={{ backgroundColor: "white" }}
                          id="outlined-basic"
                          // label="Bill prefix"
                          label={<FormattedLabel id="chargeNamePrefix" />}
                          variant="outlined"
                          {...register("chargeNamePrefix")}
                          error={!!errors.chargeNamePrefix}
                          helperText={
                            errors?.chargeNamePrefix
                              ? errors.chargeNamePrefix.message
                              : null
                          }
                          InputLabelProps={{
                            shrink: watch("chargeNamePrefix") ? true : false,
                          }}
                        />
                      </Grid>
                      {/* <Grid
                    item
                    xs={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                     <TextField
sx={{ width: "75%" }}
                      size="small"
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      // label="Remark"
                      label={<FormattedLabel id="remark" />}
                      variant="outlined"
                      {...register("remark")}
                    />
                  </Grid> */}
                    </Grid>
                    <Grid
                      container
                      style={{ padding: "10px", paddingBottom: "40px" }}
                    >
                      <Grid
                        item
                        xs={4}
                        style={{
                          display: "flex",
                          justifyContent: "end",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          type="submit"
                          size="small"
                          variant="contained"
                          color="success"
                          endIcon={<SaveIcon />}
                        >
                          <FormattedLabel id={btnSaveText} />
                        </Button>
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                        >
                          <FormattedLabel id="clear" />
                        </Button>
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          variant="contained"
                          size="small"
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
                </FormProvider>
              </div>
            </Slide>
          )}

          <Grid container style={{ padding: "10px" }}>
            <Grid item xs={11}></Grid>
            <Grid
              item
              xs={1}
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
                  setButtonInputState(true);
                  setSlideChecked(true);
                  setIsOpenCollapse(!isOpenCollapse);
                }}
              >
                <FormattedLabel id="add" />
              </Button>
            </Grid>
          </Grid>

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
              autoHeight
              density="compact"
              sx={{
                "& .super-app-theme--cell": {
                  backgroundColor: "#87E9F7",
                  border: "1px solid white",
                },
                backgroundColor: "white",
                boxShadow: 2,
                border: 1,
                borderColor: "primary.light",
                "& .MuiDataGrid-cell:hover": {
                  transform: "scale(1.1)",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#EDEDED",
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
              // loading={data.loading}
              rowCount={data.totalRows}
              rowsPerPageOptions={data.rowsPerPageOptions}
              page={data.page}
              pageSize={data.pageSize}
              rows={data.rows}
              columns={columns}
              onPageChange={(_data) => {
                getBillType(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                // updateData("page", 1);
                getBillType(_data, data.page);
              }}
            />
          </Box>

          {/* <DataGrid
            autoHeight
            sx={{
              margin: 5,
            }}
            rows={dataSource}
            columns={columns}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => {
              getBillType(newPageSize);
              setPageSize(newPageSize);
            }}
            onPageChange={(e) => {
              console.log("event", e);
              setPageNo(e);
              setTotalElements(res.data.totalElements);
              console.log("dataSource->", dataSource);
            }}
            rowsPerPageOptions={[10, 20, 50, 100]}
            pagination
            rowCount={totalElements}
          /> */}
        </Box>
      )}
    </>
  );
};

export default ChargeName;
