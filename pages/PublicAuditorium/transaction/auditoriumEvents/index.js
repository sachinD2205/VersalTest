import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import urls from "../../../../URLS/urls";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import schema from "../../../../containers/schema/publicAuditorium/transactions/auditoriumEvents";
import sweetAlert from "sweetalert";
import moment from "moment";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../../../containers/Layout/components/Loader";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import PabbmHeader from "../../../../components/publicAuditorium/pabbmHeader";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import Transliteration from "../../../../components/common/linguosol/transliteration";

const AuditoriumEvents = () => {
  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   reset,
  //   setValue,
  //   formState: { errors },
  // } = useForm({ resolver: yupResolver(schema) });

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const {
    control,
    register,
    reset,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = methods;

  const [auditoriums, setAuditoriums] = useState([]);
  const [loading, setLoading] = useState(false);

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

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

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.2,
      headerAlign: "center",
    },
    {
      field: "eventNameEn",
      headerName: <FormattedLabel id="eventNameEn" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "eventNameMr",
      headerName: <FormattedLabel id="eventNameMr" />,
      flex: 1,
      headerAlign: "center",
    },

    // {
    //   field: "auditoriumName",
    //   headerName: <FormattedLabel id="auditorium" />,
    //   flex: 0.6,
    //   headerAlign: "center",
    // },
    // {
    //   field: "eventDate",
    //   headerName: <FormattedLabel id="eventDate" />,
    //   flex: 0.4,
    //   align: "center",
    //   headerAlign: "center",
    // },
    // {
    //   field: "eventTime",
    //   headerName: <FormattedLabel id="eventTime" />,
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "programEventDescription",
      headerName: <FormattedLabel id="programEventDescription" />,
      flex: 1,
      headerAlign: "center",
    },
    // {
    //   field: "noOfDays",
    //   headerName: <FormattedLabel id="noOfDays" />,
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    // {
    //   field: "eventHours",
    //   headerName: <FormattedLabel id="eventHours" />,
    //   flex: 0.3,
    //   headerAlign: "center",
    // },
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
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
                setValue("auditoriumId", params.row._auditoriumName);
                // setValue(
                //   "eventDate",
                //   params.row._eventDate
                //     ? moment(params.row._eventDate).format(
                //         "YYYY-MM-DDThh:mm:ss"
                //       )
                //     : null
                // );
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

  const resetValuesExit = {};

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

  useEffect(() => {
    getAuditorium();
  }, []);

  useEffect(() => {
    getAuditoriumEvents();
  }, [auditoriums]);

  const getAuditoriumEvents = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setLoading(true);
    axios
      .get(`${urls.PABBMURL}/trnAuditoriumEvents/getAll`, {
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
      .then((r) => {
        let result = r.data.trnAuditoriumEventsList;
        let _res = result.map((val, i) => {
          setLoading(false);
          console.log("res", val);
          return {
            srNo: _pageSize * _pageNo + i + 1,
            id: val.id,
            auditoriumName: val.auditoriumName
              ? auditoriums?.find((obj) => {
                  return obj?.id == Number(val.auditoriumName);
                })?.auditoriumName
              : "-",
            eventNameEn: val.eventNameEn ? val.eventNameEn : "-",
            eventNameMr: val.eventNameMr ? val.eventNameMr : "-",
            // eventDate: val.eventDate
            //   ? moment(val.eventDate).format("DD-MM-YYYY")
            //   : null,
            eventHours: val.eventHours ? val.eventHours : "-",
            noOfDays: val.noOfDays ? val.noOfDays : "-",
            programEventDescription: val.programEventDescription
              ? val.programEventDescription
              : "-",
            status: val.activeFlag === "Y" ? "Active" : "Inactive",
            activeFlag: val.activeFlag,
            _auditoriumName: val?.auditoriumName,
            // _eventDate: val?.eventDate,
          };
        });

        console.log("result", _res);

        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getAuditorium = () => {
    axios
      .get(`${urls.PABBMURL}/mstAuditorium/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("respe", r);
        setAuditoriums(
          r.data.mstAuditoriumList.map((row, index) => ({
            id: row.id,
            auditoriumName: row.auditoriumName,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const onSubmitForm = (formData) => {
    console.log(
      "formData",
      formData
      // formData?.eventDate
      //   ? moment(formData?.eventDate).format("YYYY-MM-DDThh:mm:ss")
      //   : null
    );
    const finalBodyForApi = {
      ...formData,
      auditoriumName: Number(formData.auditoriumId),
      auditoriumId: Number(formData.auditoriumId),
      eventHours: Number(formData.eventHours),
      // eventDate: formData?.eventDate
      //   ? moment(formData?.eventDate).format("YYYY-MM-DDThh:mm:ss")
      //   : null,
      noOfDays: Number(formData.days),
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(`${urls.PABBMURL}/trnAuditoriumEvents/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("save data", res);
        if (res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getAuditoriumEvents();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    auditoriumId: "",
    programEventDescription: "",
    days: null,
    remark: "",
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
            .post(`${urls.PABBMURL}/trnAuditoriumEvents/save`, body, {
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
                getAuditoriumEvents();
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
            .post(`${urls.PABBMURL}/trnAuditoriumEvents/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Activated!", {
                  icon: "success",
                });
                getAuditoriumEvents();
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

  return (
    <div>
      <Paper style={{}}>
        <Box>
          <BreadcrumbComponent />
        </Box>
        <PabbmHeader labelName="auditoriumEvents" />
        {loading ? (
          <Loader />
        ) : (
          <>
            {isOpenCollapse && (
              // <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <Grid container style={{ padding: "10px" }}>
                    {/* <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={6}
                  xl={6}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <FormControl error={errors.auditoriumId} variant="standard" sx={{ width: "90%" }}>
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="auditorium" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: 220 }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label={<FormattedLabel id="auditorium" />}
                        >
                          {auditoriums &&
                            auditoriums.map((auditorium, index) => {
                              return (
                                <MenuItem key={index} value={auditorium.id}>
                                  {auditorium.auditoriumName}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      )}
                      name="auditoriumId"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.auditoriumId ? errors.auditoriumId.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid> */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      xl={6}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Box sx={{ width: "90%" }}>
                        <Transliteration
                          fieldName={"eventNameEn"}
                          updateFieldName={"eventNameMr"}
                          variant="outlined"
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={<FormattedLabel id="eventNameEn" required />}
                          error={!!errors.eventNameEn}
                          targetError={"eventNameEn"}
                          InputLabelProps={{
                            shrink: !!watch("eventNameEn"),
                          }}
                          helperText={
                            errors?.eventNameEn
                              ? errors.eventNameEn.message
                              : null
                          }
                        />
                      </Box>
                      {/* <TextField
                        sx={{ width: "90%" }}
                        size="small"
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="eventNameEn" required />}
                        variant="outlined"
                        {...register("eventNameEn")}
                        error={!!errors.eventNameEn}
                        helperText={
                          errors?.eventNameEn
                            ? errors.eventNameEn.message
                            : null
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
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Box sx={{ width: "90%" }}>
                        <Transliteration
                          fieldName={"eventNameMr"}
                          updateFieldName={"eventNameEn"}
                          sourceLang={"mar"}
                          variant="outlined"
                          targetLang={"eng"}
                          label={<FormattedLabel id="eventNameMr" required />}
                          error={!!errors.eventNameMr}
                          targetError={"eventNameMr"}
                          InputLabelProps={{
                            shrink: !!watch("eventNameMr"),
                          }}
                          helperText={
                            errors?.eventNameMr
                              ? errors.eventNameMr.message
                              : null
                          }
                        />
                      </Box>
                      {/* <TextField
                        sx={{ width: "90%" }}
                        size="small"
                        style={{ backgroundColor: "white" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="eventNameMr" required />}
                        variant="outlined"
                        {...register("eventNameMr")}
                        error={!!errors.eventNameMr}
                        helperText={
                          errors?.eventNameMr
                            ? errors.eventNameMr.message
                            : null
                        }
                      /> */}
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    {/* <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      xl={6}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl
                        style={{
                          backgroundColor: "white",
                          width: "90%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "end",
                        }}
                        error={errors.eventDate}
                        fullWidth
                      >
                        <Controller
                          control={control}
                          name="eventDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                disablePast
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel id="eventDate" />
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
                          {errors?.eventDate ? errors.eventDate.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid> */}
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <TextField
                        id="outlined-basic"
                        label={<FormattedLabel id="programEventDescription" />}
                        variant="outlined"
                        size="small"
                        sx={{ width: "95%" }}
                        InputLabelProps={{
                          shrink: watch("programEventDescription")
                            ? true
                            : false,
                        }}
                        {...register("programEventDescription")}
                        error={!!errors.programEventDescription}
                        helperText={
                          errors?.programEventDescription
                            ? errors.programEventDescription.message
                            : null
                        }
                      />
                    </Grid>
                  </Grid>
                  {/* <Grid container style={{ padding: "10px" }}>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={6}
                  xl={6}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "end",
                  }}
                >
                  <FormControl error={errors.eventHours} variant="standard" sx={{ width: "90%" }}>
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="eventHours" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: 220 }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label={<FormattedLabel id="eventHours" />}
                        >
                          {[
                            { id: 1, eventHour: 3 },
                            { id: 2, eventHour: 5 },
                            { id: 3, eventHour: 8 },
                            { id: 4, eventHour: 12 },
                            { id: 5, eventHour: 15 },
                          ].map((val, index) => {
                            return (
                              <MenuItem key={index} value={val.eventHour}>
                                {val.eventHour}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      )}
                      name="eventHours"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>{errors?.eventHours ? errors.eventHours.message : null}</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid> */}
                  <Grid container style={{ padding: "10px" }}>
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
                        size="small"
                        type="submit"
                        variant="contained"
                        color="success"
                        endIcon={<SaveIcon />}
                      >
                        {btnSaveText}
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
                        size="small"
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
                      xs={4}
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        size="small"
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
              </FormProvider>
              // </Slide>
            )}

            {!isOpenCollapse && (
              <>
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
                      size="small"
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

                <Box style={{ height: "auto", overflow: "auto" }}>
                  <DataGrid
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
                    autoHeight={true}
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
                      getAuditoriumEvents(data.pageSize, _data);
                    }}
                    onPageSizeChange={(_data) => {
                      console.log("222", _data);
                      // updateData("page", 1);
                      getAuditoriumEvents(_data, data.page);
                    }}
                  />
                </Box>
              </>
            )}
          </>
        )}
      </Paper>
    </div>
  );
};

export default AuditoriumEvents;
