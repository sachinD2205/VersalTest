import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Paper,
  Slide,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { message } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../containers/Layout/BasicLayout";
import urls from "../../../URLS/urls";
import styles from "../../../styles/[title].module.css";
import schema from "../../../containers/schema/common/Title";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import Transliteration from "../../../components/common/linguosol/transliteration";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../../util/util";

const Title = () => {
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
  const [dataSource, setDataSource] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const token = useSelector((state) => state.user.user.token);
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

  // Get Table - Data
  const getTitle = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    axios
      .get(`${urls.BaseURL}/title/getAll`, {
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
        let _res = res.data.title.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          titleID: r.titleID,
          // toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
          // fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
          title: r.title ? r.title : "-",
          titleMr: r.titleMr ? r.titleMr : "-",
          remarks: r.remarks ? r.remarks : "-",
          activeFlag: r.activeFlag,
          status: r.activeFlag === "Y" ? "Active" : "InActive",
        }));
        setDataSource({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getTitle();
  }, [fetchData]);

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    // const fromDate = new Date(fromData.fromDate).toISOString();
    // const toDate = moment(fromData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD");
    // Update Form Data
    const finalBodyForApi = {
      ...fromData,
      // fromDate,
      // toDate,
    };

    // Save - DB
    if (btnSaveText === "Save") {
      console.log("save", finalBodyForApi);
      const tempData = axios
        .post(`${urls.BaseURL}/title/save`, finalBodyForApi, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          // console.log(res,'...,,,..');

          if (res.status == 201) {
            if (res.data?.errors?.length > 0) {
              res.data?.errors?.map((x) => {
                if (x.field == "title") {
                  setError("title", { message: x.code });
                } else if (x.field == "titleMr") {
                  setError("titleMr", { message: x.code });
                }
              });
            } else {
              sweetAlert("Saved!", "Record Saved successfully !", "success");
              setButtonInputState(false);
              setIsOpenCollapse(false);
              setFetchData(tempData);
              setEditButtonInputState(false);
              setButtonInputState(true);
              setDeleteButtonState(false);
            }
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      console.log("Put -----");
      const tempData = axios
        .post(`${urls.BaseURL}/title/save`, finalBodyForApi, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Updated!", "Record Updated successfully !", "success");
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    }
  };

  // Delete By ID
  // const deleteById = async (value) => {
  //   await axios
  //     .delete(`${urls.BaseURL}/title/save/${value}`)
  //     .then((res) => {
  //       if (res.status == 226) {
  //         message.success("Record Deleted !!!");
  //         getTitle();
  //         setButtonInputState(false);
  //       }
  //     });
  // };

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag == "N") {
      swal({
        title: "Deactivate?",
        text: "Are you sure you want to deactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("innds", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.CFCURL}/master/title/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Deactivated!", {
                  icon: "success",
                });
                getTitle();
                setButtonInputState(false);
              }
            })
            ?.catch((err) => {
              console.log("err", err);
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
            .post(`${urls.CFCURL}/master/title/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully activated!", {
                  icon: "success",
                });
                getTitle();
                setButtonInputState(false);
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              callCatchMethod(err, language);
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
    fromDate: null,
    toDate: null,
    title: "",
    titleID: "",
    remarks: "",
    titleMr: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    title: "",
    titleID: "",
    remarks: "",
    titleMr: "",
    id: null,
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.4,
      headerAlign: "center",
    },
    // {
    //   field: "titleID",
    //   headerName: "Tittle ID ",
    //   flex: 1,
    // },
    // { field: "fromDate", headerName: "FromDate" },
    // {
    //   field: "toDate",
    //   headerName: "To Date",
    //   //type: "number",
    //   flex: 1,
    // },

    {
      field: "title",
      headerName: <FormattedLabel id="titleName" />,
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "titleMr",
      headerName: <FormattedLabel id="titleNameMr" />,
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "remarks",
      headerName: <FormattedLabel id="remark" />,
      //type: "number",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 0.6,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
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
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
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
                  onClick={() => {
                    deleteById(params.row.id, "N");
                  }}
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
      <>
        <BreadcrumbComponent />
      </>
      <div
        style={{
          // backgroundColor: "#0084ff",
          backgroundColor: "#757ce8",
          color: "white",
          fontSize: 19,
          display: "flex",
          justifyContent: "center",
          padding: "10px",
          borderRadius: 100,
        }}
      >
        <FormattedLabel id="titleMaster" />
      </div>
      <Paper>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
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
                      }}
                    >
                      {" "}
                      <Box sx={{ width: "90%" }}>
                        <Transliteration
                          variant={"outlined"}
                          _key={"title"}
                          labelName={"title"}
                          fieldName={"title"}
                          updateFieldName={"titleMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={<FormattedLabel id="titleName" required />}
                          error={!!errors.title}
                          helperText={
                            errors?.title ? errors.title.message : null
                          }
                        />
                      </Box>
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
                      }}
                    >
                      {" "}
                      <Box sx={{ width: "90%" }}>
                        <Transliteration
                          variant={"outlined"}
                          _key={"titleMr"}
                          labelName={"titleMr"}
                          fieldName={"titleMr"}
                          updateFieldName={"title"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          label={<FormattedLabel id="titleNameMr" required />}
                          error={!!errors.titleMr}
                          helperText={
                            errors?.titleMr ? errors.titleMr.message : null
                          }
                        />
                      </Box>
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
                      }}
                    >
                      <TextField
                        sx={{ width: "90%" }}
                        id="outlined-basic"
                        size="small"
                        label={<FormattedLabel id="remark" />}
                        variant="outlined"
                        {...register("remarks")}
                        error={!!errors.remarks}
                        helperText={
                          errors?.remarks ? errors.remarks.message : null
                        }
                      />
                    </Grid>
                  </Grid>
                  <div className={styles.small}>
                    <div className={styles.row}>
                      {/* <div>
                          <TextField
                            autoFocus
                            sx={{ width: 250 }}
                            id='standard-basic'
                            label='Tittle ID *'
                            variant='standard'
                            {...register("titleID")}
                            error={!!errors.titleID}
                            helperText={
                              errors?.titleID ? errors.titleID.message : null
                            }
                          />
                        </div> */}
                      {/* <div>
                          <FormControl
                            style={{ marginTop: 10 }}
                            error={!!errors.fromDate}
                          >
                            <Controller
                              control={control}
                              name='fromDate'
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    inputFormat='DD/MM/YYYY'
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        From Date *
                                      </span>
                                    }
                                    value={field.value}
                                    onChange={(date) => field.onChange(date)}
                                    selected={field.value}
                                    center
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        size='small'
                                        fullWidth
                                        InputLabelProps={{
                                          style: {
                                            fontSize: 12,
                                            marginTop: 3,
                                          },
                                        }}
                                      />
                                    )}
                                  />
                                </LocalizationProvider>
                              )}
                            />
                            <FormHelperText>
                              {errors?.fromDate
                                ? errors.fromDate.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </div> */}
                      {/* <div>
                          <FormControl
                            style={{ marginTop: 10 }}
                            error={!!errors.toDate}
                          >
                            <Controller
                              control={control}
                              name='toDate'
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    inputFormat='DD/MM/YYYY'
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        To Date
                                      </span>
                                    }
                                    value={field.value}
                                    onChange={(date) => field.onChange(date)}
                                    selected={field.value}
                                    center
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        size='small'
                                        fullWidth
                                        InputLabelProps={{
                                          style: {
                                            fontSize: 12,
                                            marginTop: 3,
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
                        </div> */}
                    </div>

                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={4}
                        sx={{ display: "flex", justifyContent: "end" }}
                      >
                        <Button
                          size="small"
                          type="submit"
                          variant="contained"
                          color="success"
                          endIcon={<SaveIcon />}
                        >
                          {<FormattedLabel id={btnSaveText} />}
                        </Button>
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
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
                          onClick={() => exitButton()}
                        >
                          <FormattedLabel id="exit" />
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                </form>
              </FormProvider>
            </div>
          </Slide>
        )}

        <Box sx={{ display: "flex", justifyContent: "end", padding: "10px" }}>
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            type="primary"
            size="small"
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
        </Box>
        <DataGrid
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          getRowId={(row) => row.srNo}
          components={{ Toolbar: GridToolbar }}
          // autoHeight={true}
          autoHeight={dataSource.pageSize}
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
              backgroundColor: "#E1FDFF",
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
          rowCount={dataSource.totalRows}
          rowsPerPageOptions={dataSource.rowsPerPageOptions}
          page={dataSource.page}
          pageSize={dataSource.pageSize}
          rows={dataSource.rows}
          columns={columns}
          onPageChange={(_data) => {
            getTitle(dataSource.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            console.log("222", _data);
            getTitle(_data, dataSource.page);
          }}
          //checkboxSelection
        />
      </Paper>
    </>
  );
};

export default Title;
