import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import sweetAlert from "sweetalert";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import schema from "../../../../containers/schema/publicAuditorium/masters/Auditorium";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
// import styles from "../../../../styles/publicAuditorium/masters/[auditorium].module.css";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import CheckIcon from "@mui/icons-material/Check";
import { yupResolver } from "@hookform/resolvers/yup";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import Loader from "../../../../containers/Layout/components/Loader";
import { toast } from "react-toastify";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import PabbmHeader from "../../../../components/publicAuditorium/pabbmHeader";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";

const Auditorium = () => {
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
  const language = useSelector((state) => state.labels.language);

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();
  const [loading, setLoading] = useState(false);

  const [auditoriums, setAuditoriums] = useState([]);
  const [events, setEvents] = useState([]);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  let abc = [];

  useEffect(() => {
    getAuditorium();
    getEvents();
  }, []);

  useEffect(() => {
    getAuditoriumMappingData();
  }, [auditoriums, events]);

  const getAuditorium = () => {
    axios.get(`${urls.PABBMURL}/mstAuditorium/getAll`).then((r) => {
      console.log("respe", r);
      setAuditoriums(
        r.data.mstAuditoriumList.map((row, index) => ({
          id: row.id,
          auditoriumNameEn: row.auditoriumNameEn,
          auditoriumNameMr: row.auditoriumNameMr,
        }))
      );
    });
  };

  const getEvents = () => {
    axios.get(`${urls.PABBMURL}/trnAuditoriumEvents/getAll`).then((r) => {
      console.log("respe 9", r);
      setEvents(
        r.data.trnAuditoriumEventsList.map((row, index) => ({
          ...row,
        }))
      );
    });
  };

  const getAuditoriumMappingData = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    axios
      .get(`${urls.PABBMURL}/mstAuditorium/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        setLoading(false);
        console.log("res aud", res);

        let result = res.data.mstAuditoriumList;
        let _res = result.map((val, i) => {
          console.log("44", val);
          return {
            srNo: i + 1,
            id: val.id,
            // auditoriumNameEn: val.auditoriumNameEn ? val.auditoriumNameEn : "-",
            // auditoriumNameMr: val.auditoriumNameMr ? val.auditoriumNameMr : "-",
            // addressEn: val.addressEn ? val.addressEn : "-",
            // addressMr: val.addressMr ? val.addressMr : "-",
            // gsiIdGeocode: val.gsiIdGeocode ? val.gsiIdGeocode : "-",
            // seatingCapacity: val.seatingCapacity ? val.seatingCapacity : "-",
            // status: val.activeFlag === "Y" ? "Active" : "Inactive",
            // activeFlag: val.activeFlag,
            // zoneId: val.zoneId,
            // wardId: val.wardId,
            // startTime: moment(val.startTime).format("hh:mm A"),
            // endTime: moment(val.endTime).format("hh:mm A"),
            // _startTime: val.startTime,
            // _endTime: val.endTime,
          };
        });

        console.log("result", _res);

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      })
      .catch((err) => {
        console.log("err", err);
        setLoading(false);
        toast("Something went wrong", {
          type: "error",
        });
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
          console.log("aaaafffee");
          axios
            .post(`${urls.PABBMURL}/mstAuditorium/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                console.log("response", res);
                swal("Record is Successfully Deactivated!", {
                  icon: "success",
                });
                getAuditorium();
                setButtonInputState(false);
              }
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
            .post(`${urls.PABBMURL}/mstAuditorium/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Activated!", {
                  icon: "success",
                });
                getAuditorium();
                setButtonInputState(false);
              }
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

  const getFilterWards = (value) => {
    axios
      .get(
        `${urls.CFCURL}/master/zoneAndWardLevelMapping/getWardByDepartmentId`,
        {
          params: { departmentId: 30, zoneId: value.target.value },
        }
      )
      .then((r) => {
        console.log("Filtered Wards", r);
        setWardNames(r.data);
      });
  };

  const resetValuesCancell = {
    zone: null,
    wardName: null,
    auditoriumName: "",
    address: "",
    gsiIdGeocode: "",
    seatingCapacity: "",
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
    const finalBodyForApi = {
      ...formData,
      zoneId: Number(formData.zone),
      wardId: Number(formData.wardName),
      seatingCapacity: Number(formData.seatingCapacity),
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
      startTime: moment(formData.startTime).format("YYYY-MM-DDTHH:mm:ss"),
      endTime: moment(formData.endTime).format("YYYY-MM-DDTHH:mm:ss"),
      // startTime: moment(formData.startTime).format("HH:mm"),
      // endTime: moment(formData.endTime).format("HH:mm"),
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(`${urls.PABBMURL}/mstAuditorium/save`, finalBodyForApi)
      .then((res) => {
        console.log("save data", res);
        if (res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getAuditorium();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      });
  };

  const resetValuesExit = {
    billPrefix: "",
    fromDate: "",
    toDate: "",
    billType: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      maxWidth: 60,
      headerAlign: "center",
    },
    {
      field: "zone",
      headerName: <FormattedLabel id="auditorium" />,
      flex: 0.6,
      headerAlign: "center",
    },
    {
      field: "ward",
      headerName: <FormattedLabel id="eventName" />,
      flex: 0.5,
      headerAlign: "center",
    },
    {
      field: "startTime",
      headerName: <FormattedLabel id="startTime" />,
      flex: 0.4,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "endTime",
      headerName: <FormattedLabel id="endTime" />,
      flex: 0.4,
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
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
                setValue("zone", params.row.zoneId);
                setValue("wardName", params.row.wardId);
                setValue("startTime", params.row._startTime);
                setValue("endTime", params.row._endTime);
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

  return (
    <div>
      <Paper>
        <Box>
          <BreadcrumbComponent />
        </Box>
        <PabbmHeader
          language={language}
          enName="Auditorium, Event & Event Hours Mapping"
          mrName="प्रेक्षागृह / नाट्यगृह, कार्यक्रम आणि कार्यक्रमाचे तास मॅपिंग"
        />
        {loading ? (
          <Loader />
        ) : (
          <>
            {isOpenCollapse && (
              <FormProvider {...methods}>
                {/* <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit> */}
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <Grid container style={{ padding: "10px" }}>
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
                      <FormControl
                        variant="standard"
                        error={!!errors.auditoriumKey}
                        sx={{ width: "90%" }}
                      >
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
                              // onChange={(value) => field.onChange(value)}
                              onChange={(value) => {
                                field.onChange(value);
                                // getFilterWards(value);
                              }}
                              label={<FormattedLabel id="auditorium" />}
                            >
                              {auditoriums &&
                                auditoriums.map((zoneName, index) => (
                                  <MenuItem key={index} value={zoneName.id}>
                                    {zoneName.auditoriumNameEn}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="auditoriumKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.auditoriumKey
                            ? errors.auditoriumKey.message
                            : null}
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
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl
                        variant="standard"
                        sx={{ width: "90%" }}
                        error={!!errors.eventKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="eventName" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 220 }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="eventName" />}
                            >
                              {events &&
                                events.map((wardName, index) => (
                                  <MenuItem key={index} value={wardName.id}>
                                    {wardName.eventNameEn}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="eventKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.eventKey ? errors.eventKey.message : null}
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
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "end",
                      }}
                    >
                      <FormControl
                        sx={{ width: "90%" }}
                        error={!!errors.startTime}
                      >
                        <Controller
                          name="startTime"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <TimePicker
                                value={field.value}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DDTHH:mm")
                                  )
                                }
                                selected={field.value}
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    Start Time
                                    {/* <FormattedLabel id="eventTimeFrom" /> */}
                                  </span>
                                }
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    error={!!errors.startTime}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.startTime ? errors.startTime.message : null}
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
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "end",
                      }}
                    >
                      <FormControl
                        sx={{ width: "90%" }}
                        error={!!errors.endTime}
                      >
                        <Controller
                          name="endTime"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <TimePicker
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    End Time
                                    {/* <FormattedLabel id="eventTimeFrom" /> */}
                                  </span>
                                }
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    error={!!errors.endTime}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.endTime ? errors.endTime.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container style={{ padding: "10px" }}>
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
                        justifyContent: "center",
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
                  <Divider />
                </form>
                {/* </Slide> */}
              </FormProvider>
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
                      size="small"
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
                      getAuditorium(data.pageSize, _data);
                    }}
                    onPageSizeChange={(_data) => {
                      console.log("222", _data);
                      // updateData("page", 1);
                      getAuditorium(_data, data.page);
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

export default Auditorium;
