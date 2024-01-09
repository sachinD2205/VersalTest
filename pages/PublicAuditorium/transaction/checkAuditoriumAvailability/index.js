import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import sweetAlert from "sweetalert";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import schema from "../../../../containers/schema/publicAuditorium/transactions/checkAuditoriumAvailability";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
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

const CheckAuditoriumAvailability = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const language = useSelector((state) => state.labels.language);

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();

  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [auditoriums, setAuditoriums] = useState([]);
  const [slots, setSlots] = useState([]);
  const [events, setEvents] = useState([]);
  const [auditoriumsAvailabilty, setAuditoriumsAvailability] = useState([]);

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
    getSlots();
    getCheckAvailabilityOfAuditorium();
  }, []);

  const getCheckAvailabilityOfAuditorium = () => {
    axios
      .get(`${urls.PABBMURL}/trnCheckAvailablityForBooking/getAll`)
      .then((res, index) => {
        console.log("34", res);
        let _res = res.data.trnCheckAvailablityForBookingList.map(
          (row, index) => ({
            id: row.id,
            srNo: index + 1,
            auditoriumName: row.auditoriumName,
            auditoriumKey: row.auditoriumKey,
            bookingDate: row.bookingDate ? row.bookingDate : "-",
            eventKey: row.eventKey,
            eventName: row.eventName,
            slotKey: row.slotKey,
            slotName: row.slotName,
            id: row.id,
            activeFlag: row.activeFlag,
            status: row.activeFlag == "Y" ? "active" : "Inactive",
          })
        );

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
        setAuditoriumsAvailability(_res);
      });
  };

  const getAuditorium = () => {
    axios.get(`${urls.PABBMURL}/mstAuditorium/getAll`).then((r) => {
      console.log("respe", r);
      setAuditoriums(
        r.data.mstAuditoriumList.map((row, index) => ({
          id: row.id,
          auditoriumName: row.auditoriumName,
        }))
      );
    });
  };

  const getEvents = () => {
    axios.get(`${urls.PABBMURL}/trnAuditoriumEvents/getAll`).then((r) => {
      console.log("respe", r);
      setEvents(
        r.data.trnAuditoriumEventsList.map((row, index) => ({
          id: row.id,
          auditoriumName: row.auditoriumName,
          programEventDescription: row.programEventDescription,
        }))
      );
    });
  };

  const getSlots = () => {
    axios.get(`${urls.CFCURL}/master/slot/getAll`).then((r) => {
      console.log("slots res", r);
      setSlots(
        r.data.slots.map((row, index) => ({
          id: row.id,
          fromTime: row.fromTime,
          toTime: row.toTime,
          slotDate: row.slotDate,
        }))
      );
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
            .post(`${urls.CFCURL}/master/billType/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getBillType();
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
            .post(`${urls.CFCURL}/master/billType/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getBillType();
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

  const resetValuesCancell = {
    billPrefix: "",
    billType: "",
    fromDate: null,
    toDate: null,
    remark: "",
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
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(
        `${urls.PABBMURL}/trnCheckAvailablityForBooking/save`,
        finalBodyForApi
      )
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
      maxWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "auditoriumName",
      headerName: <FormattedLabel id="auditorium" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "bookingDate",
      headerName: <FormattedLabel id="eventDate" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "eventName",
      headerName: <FormattedLabel id="selectEvent" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "slotName",
      headerName: <FormattedLabel id="selectSlot" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <div>
      <Paper style={{ paddingTop: "50px" }}>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
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
                    error={errors.auditoriumKey}
                    variant="standard"
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
                    error={!!errors.slotKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="selectSlot" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: 220 }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label={<FormattedLabel id="selectSlot" />}
                        >
                          {slots.map((service, index) => (
                            <MenuItem key={index} value={service.id}>
                              {service.fromTime} - {service.toTime}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                      name="slotKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.slotKey ? errors.slotKey.message : null}
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
                  <FormControl sx={{ width: "90%" }} error={errors.calendar}>
                    <Controller
                      name="Calendar"
                      control={control}
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                <FormattedLabel id="eventDate" />
                              </span>
                            }
                            value={field.value}
                            onChange={(date) => {
                              field.onChange(date);
                            }}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                fullWidth
                                error={errors.calendar}
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>
                      {errors?.calendar ? errors.calendar.message : null}
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
                      <FormattedLabel id="selectEvent" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: 220 }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label={<FormattedLabel id="selectEvent" />}
                        >
                          {events?.map((service, index) => (
                            <MenuItem key={index} value={service.id}>
                              {service.programEventDescription}
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
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            components={{ Toolbar: GridToolbar }}
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
              getBillType(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getBillType(_data, data.page);
            }}
          />
        </Box>
      </Paper>
    </div>
  );
};

export default CheckAuditoriumAvailability;
