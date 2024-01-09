import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
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
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../containers/schema/common/BillType";
import styles from "../../../styles/cfc/cfc.module.css";
import Transliteration from "../../../components/common/linguosol/transliteration";
import Loader from "../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../util/util";

const BillType = () => {
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
  //  = [{activeFlag: 'val.activeFlag',
  //   srNo:   1,
  //   billPrefix: 'val.billPrefix',
  //   billType: 'val.billType',
  //   id: 1,
  //   fromDate: "2022-11-23T04:00:00",
  //   toDate: "2022-11-23T04:00:00",
  //   status: 'val.activeFlag' === "Y" ? "Active" : "Inactive",}];

  // const { data } = useDemoData({
  //   dataSource
  // });

  useEffect(() => {
    getBillType();
  }, []);

  const router = useRouter();

  // Exit Button
  const exitBack = () => {
    router.back();
  };

  const [load, setLoad] = useState();

  const handleLoad = () => {
    setLoad(false);
  };

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const getBillType = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setLoad(true);

    axios
      .get(`${urls.CFCURL}/master/billType/getAll`, {
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

        let result = res.data.billType;
        let _res = result.map((val, i) => {
          console.log("44");
          return {
            activeFlag: val.activeFlag,
            srNo: i + 1 + _pageNo * _pageSize,
            billType: val.billType ? val.billType : "-",
            billTypeMr: val.billTypeMr ? val.billTypeMr : "-",
            id: val.id,
            _fromDate: val.fromDate,
            _toDate: val.toDate,
            fromDate: moment(val.fromDate).format("DD-MM-YYYY"),
            toDate: moment(val.toDate).format("DD-MM-YYYY"),
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
        setLoad(false);
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
            .post(`${urls.CFCURL}/master/billType/save`, body, {
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
              setLoad(false);
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
            .post(`${urls.CFCURL}/master/billType/save`, body, {
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
              setLoad(false);
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
    billType: "",
    billTypeMr: "",
    toDate: null,
    fromDate: null,
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
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    };

    console.log("finalBodyForApi", finalBodyForApi);
    // const data = {
    //     "fromDate": "2022-11-23T16:00:00",
    //     "toDate":"2022-11-23T16:00:00",
    //     "billPrefix":"Test",
    //     "billType":"Tust"
    // };

    axios
      .post(`${urls.CFCURL}/master/billType/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("save data", res);
        if (res.status == 200) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getBillType();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        } else res.status == 500;
        {
          if (res.data?.errors?.length > 0) {
            res.data?.errors?.map((x) => {
              if (x.field == "billType") {
                setError("billType", { message: x.code });
              } else if (x.field == "billTypeMr") {
                setError("billTypeMr", { message: x.code });
              }
            });
          }
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoad(false);
        callCatchMethod(err, language);
      });
  };

  const resetValuesExit = {
    billPrefix: "",
    fromDate: "",
    toDate: "",
    fromDate: "",
    billType: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
      flex: 0.6,

      cellClassName: "super-app-theme--cell",
    },
    {
      field: "fromDate",
      headerName: <FormattedLabel id="fromDate" />,
      flex: 0.6,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "toDate",
      headerName: <FormattedLabel id="toDate" />,
      flex: 0.6,

      align: "center",
      headerAlign: "center",
    },
    {
      field: "billType",
      headerName: <FormattedLabel id="billType" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "billTypeMr",
      headerName: <FormattedLabel id="billTypeMr" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
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
          <Box className={styles.h1Tag} sx={{ paddingLeft: "43%" }}>
            <FormattedLabel id="billType" />
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
                  padding: "10px",
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
                        sm={6}
                        md={6}
                        lg={6}
                        xl={6}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl sx={{ width: "90%" }}>
                          <Controller
                            control={control}
                            name="fromDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                              >
                                <DatePicker
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      {<FormattedLabel id="fromDate" />}
                                    </span>
                                  }
                                  inputFormat="dd/MM/yyyy"
                                  value={field.value}
                                  onChange={(date) =>
                                    field.onChange(
                                      moment(date, "YYYY-MM-DD").format(
                                        "YYYY-MM-DD"
                                      )
                                    )
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      sx={{
                                        backgroundColor: "white",
                                      }}
                                      {...params}
                                      size="small"
                                      error={errors?.fromDate ? true : false}
                                      fullWidth
                                      variant="outlined"
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.fromDate ? (
                              <span style={{ color: "red" }}>
                                {errors.fromDate.message}
                              </span>
                            ) : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={6}
                        xl={6}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl sx={{ width: "90%" }}>
                          <Controller
                            control={control}
                            name="toDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                              >
                                <DatePicker
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      {<FormattedLabel id="toDate" />}
                                    </span>
                                  }
                                  inputFormat="dd/MM/yyyy"
                                  value={field.value}
                                  onChange={(date) =>
                                    field.onChange(
                                      moment(date, "YYYY-MM-DD").format(
                                        "YYYY-MM-DD"
                                      )
                                    )
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      sx={{
                                        backgroundColor: "white",
                                      }}
                                      {...params}
                                      size="small"
                                      error={errors?.toDate ? true : false}
                                      fullWidth
                                      variant="outlined"
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.toDate ? (
                              <span style={{ color: "red" }}>
                                {errors.toDate.message}
                              </span>
                            ) : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={6}
                        xl={6}
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
                            _key={"billType"}
                            labelName={"billType"}
                            fieldName={"billType"}
                            updateFieldName={"billTypeMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            label={<FormattedLabel id="billType" required />}
                            error={!!errors.billType}
                            helperText={
                              errors?.billType ? errors.billType.message : null
                            }
                          />
                        </Box>
                        {/* <TextField
                      sx={{ width: "90%" }}
                      size="small"
                      style={{ backgroundColor: "white" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="billType" />}
                      variant="outlined"
                      {...register("billType")}
                      error={!!errors.billType}
                      helperText={
                        errors?.billType ? errors.billType.message : null
                      }
                    /> */}
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={6}
                        xl={6}
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
                            _key={"billTypeMr"}
                            labelName={"billTypeMr"}
                            fieldName={"billTypeMr"}
                            updateFieldName={"billType"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            label={<FormattedLabel id="billTypeMr" required />}
                            error={!!errors.billTypeMr}
                            helperText={
                              errors?.billTypeMr
                                ? errors.billTypeMr.message
                                : null
                            }
                          />
                        </Box>
                        {/* <TextField
                        sx={{ width: "90%" }}
                        size="small"
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="billTypeMr" />}
                        variant="outlined"
                        {...register("billTypeMr")}
                        error={!!errors.billTypeMr}
                        helperText={
                          errors?.billTypeMr ? errors.billTypeMr.message : null
                        }
                      /> */}
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
                          color="success"
                          type="submit"
                          size="small"
                          variant="outlined"
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
                          color="primary"
                          variant="outlined"
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
                          color="error"
                          variant="outlined"
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
                getBillType(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                getBillType(_data, data.page);
              }}
            />
          </Box>
        </Paper>
      )}
    </>
  );
};

export default BillType;
