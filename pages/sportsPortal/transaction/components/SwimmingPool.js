import { yupResolver } from "@hookform/resolvers/yup";
import { Refresh } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import SaveIcon from "@mui/icons-material/Save";
import sweetAlert from "sweetalert";

// import AdapterDayjs
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  Slide,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { message } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import styles from "../../../../styles/sportsPortalStyles/facilityCheck.module.css";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import URLS from "../../../../URLS/urls";

// func
const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [disableKadhnariState, setDisableKadhnariState] = useState(true);
  const [disable, setDisable] = useState(true);
  const [value, setValuee] = useState(null);
  const [valuee, setValueTwo] = useState(null);

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [slideChecked, setSlideChecked] = useState(false);
  const [zoneNames, setZoneNames] = useState([]);

  const [venueNames, setVenueNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [departments, setDepartments] = useState([]);
  // const [subDepartments, setSubDepartments] = useState([]);
  const [facilityTypess, setFacilityTypess] = useState([]);
  const [facilityNames, setFacilityNames] = useState([]);
  const [selectedFacilityType, setSelectedFacilityType] = useState();
  const [venues, setVenues] = useState([]);
  const [selectedFacilityName, setSelectedFacilityName] = useState();

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getAllDetails();
  }, [
    zoneNames,
    wardNames,
    departments,
    // subDepartments,
    facilityNames,
    fetchData,
    facilityTypess,
  ]);

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    // const date = moment(fromData.Date.d, "YYYY-MM-DD").format("YYYY-MM-DD");
    let fromBookingTime;
    let toBookingTime;
    if (moment(value).format("HH") >= 12) {
      fromBookingTime = moment(value).format("HH:mm:SS");
    } else {
      fromBookingTime = moment(value).format("HH:mm:SS");
    }

    if (moment(valuee).format("HH") >= 12) {
      toBookingTime = moment(valuee).format("HH:mm:SS");
    } else {
      toBookingTime = moment(valuee).format("HH:mm:SS");
    }

    // const fromBookingTime = moment(value).format("HH:mm") + ":00";
    // const toBookingTime = moment(valuee).format("HH:mm") + ":00";

    console.log("From", fromBookingTime);
    console.log("To", toBookingTime);

    // const toBookingTime = moment(fromData.toBookingTime).format(
    //   "YYYY-MM-DD hh:mm:ss"
    // );

    // console.log("To", valuee.getTime());
    // console.log("date kuthli ahe re: ", date);

    const finalBodyForApi = {
      ...fromData,
      fromBookingTime,
      toBookingTime,
    };

    console.log("DATA: ", finalBodyForApi);

    if (btnSaveText === "Save") {
      console.log("Post -----");
      const tempData = axios
        .post(`${URLS.SPURL}/bookingMaster/saveBookingMaster`, finalBodyForApi)
        .then((res) => {
          if (res.status == 200) {
            // message.success("Data Saved !!!");
            sweetAlert("Saved!", "Record Saved successfully !", "success");

            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Edit") {
      console.log("Put -----");
      const tempData = axios
        .post(
          `${URLS.SPURL}/bookingMaster/saveBookingMaster/?id=${id}`,

          fromData
        )
        .then((res) => {
          if (res.status == 200) {
            // message.success("Data Updated !!!");
            sweetAlert("Updated!", "Record Updated successfully !", "success");

            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
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
    setIsOpenCollapse(false);
    setDeleteButtonState(false);
    setEditButtonInputState(false);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    zoneName: "",
    wardName: "",
    department: "",
    facilityType: "",
    facilityName: "",
    venue: "",
    date: null,
    fromBookingTime: null,
    toBookingTime: null,
    capacity: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    zoneName: "",
    wardName: "",
    department: "",
    facilityType: "",
    facilityName: "",
    venue: "",
    date: null,
    fromBookingTime: null,
    toBookingTime: null,
    capacity: "",
  };

  // View
  return (
    <>
      <Paper
        sx={{ marginLeft: 5, marginRight: 5, marginTop: 5, marginBottom: 5 }}
      >
        <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
          <div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <div className={styles.main}>
                  <div className={styles.row}>
                    <div>
                      <FormControl
                        variant="standard"
                        // sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.zoneName}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="zone" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 220 }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="zoneName"
                            >
                              {zoneNames &&
                                zoneNames.map((zoneName, index) => (
                                  <MenuItem key={index} value={zoneName.id}>
                                    {zoneName.zoneName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="zoneName"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.zoneName ? errors.zoneName.message : null}
                        </FormHelperText>
                      </FormControl>
                    </div>
                    <div>
                      <FormControl
                        variant="standard"
                        // sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.wardName}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="ward" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 220 }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="wardName"
                            >
                              {wardNames &&
                                wardNames.map((wardName, index) => (
                                  <MenuItem key={index} value={wardName.id}>
                                    {wardName.wardName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="wardName"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.wardName ? errors.wardName.message : null}
                        </FormHelperText>
                      </FormControl>
                    </div>
                    {/* <div>
                          <TextField
                            id="standard-basic"
                            // label={<FormattedLabel id="department" />}
                            label="Department"
                            variant="standard"
                            value="Sports Department"
                            {...register("department")}
                            error={!!errors.department}
                            helperText={
                              errors?.department
                                ? "Department  is Required !!!"
                                : null
                            }
                          />
                        </div> */}
                    <div>
                      <FormControl
                        variant="standard"
                        // sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.department}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="department" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 220 }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="department"
                            >
                              {departments &&
                                departments.map((department, index) => (
                                  <MenuItem key={index} value={department.id}>
                                    {department.department}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="department"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.department
                            ? errors.department.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </div>
                  <div className={styles.row}>
                    {/* <div>
                          <FormControl
                            variant="standard"
                            // sx={{ m: 1, minWidth: 120 }}
                            error={!!errors.subDepartment}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Sub-Department
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ minWidth: 220 }}
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="subDepartment"
                                >
                                  {subDepartments &&
                                    subDepartments.map(
                                      (subDepartmentName, index) => (
                                        <MenuItem
                                          key={index}
                                          value={subDepartmentName.id}
                                        >
                                          {subDepartmentName.subDepartmentName}
                                        </MenuItem>
                                      )
                                    )}
                                </Select>
                              )}
                              name="subDepartment"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.subDepartment
                                ? errors.subDepartment.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </div> */}
                    <div>
                      <FormControl
                        variant="standard"
                        // sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.facilityType}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="facilityType" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 220 }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value);
                                console.log("value: ", value.target.value);
                                setSelectedFacilityType(value.target.value);
                                setDisableKadhnariState(false);
                              }}
                              label="facilityType"
                            >
                              {facilityTypess &&
                                facilityTypess.map((facilityType, index) => (
                                  <MenuItem key={index} value={facilityType.id}>
                                    {facilityType.facilityType}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="facilityType"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.facilityType
                            ? errors.facilityType.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </div>
                    <div>
                      <FormControl
                        variant="standard"
                        // sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.facilityName}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="facilityName" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 220 }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={field.value}
                              //onChange={(value) => field.onChange(value)}
                              label="facilityName"
                              onChange={(value) => {
                                field.onChange(value);
                                console.log("value: ", value.target.value);
                                setSelectedFacilityName(value.target.value);
                                setDisable(false);
                              }}
                              disabled={disableKadhnariState}
                            >
                              {facilityNames &&
                                facilityNames
                                  .filter((facility) => {
                                    return (
                                      facility.facilityType ===
                                      selectedFacilityType
                                    );
                                  })
                                  .map((facilityName, index) => (
                                    <MenuItem
                                      key={index}
                                      value={facilityName.id}
                                    >
                                      {facilityName.facilityName}
                                    </MenuItem>
                                  ))}
                            </Select>
                          )}
                          name="facilityName"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.facilityName
                            ? errors.facilityName.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </div>
                    <div>
                      <FormControl
                        variant="standard"
                        // sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.venue}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="venue" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 220 }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="venue"
                              disabled={disable}
                            >
                              {venues &&
                                venues
                                  .filter((facility) => {
                                    return (
                                      facility.facilityName ===
                                      selectedFacilityName
                                    );
                                  })
                                  .map((venue, index) => (
                                    <MenuItem key={index} value={venue.id}>
                                      {venue.venue}
                                    </MenuItem>
                                  ))}
                            </Select>
                          )}
                          name="venue"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.venue ? errors.venue.message : null}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </div>

                  <div className={styles.row}>
                    <div className={styles.fieldss}>
                      <FormControl
                        style={{ marginTop: 10 }}
                        error={!!errors.date}
                      >
                        <Controller
                          control={control}
                          name="date"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel id="date" />
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
                                    // moment(date).format("DD-MM-YYYY")
                                  )
                                }
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
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
                          {errors?.date ? errors.date.message : null}
                        </FormHelperText>
                      </FormControl>
                    </div>

                    <div className={styles.fieldss}>
                      <FormControl
                        style={{ marginTop: 10 }}
                        error={!!errors.fromBookingTime}
                      >
                        <Controller
                          control={control}
                          name="fromBookingTime"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <TimePicker
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel id="fromBookingTime" />
                                  </span>
                                }
                                value={value}
                                onChange={(newValue) => {
                                  setValuee(newValue);
                                  console.log("Ha Time Aahe: ", newValue);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
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
                          {errors?.fromBookingTime
                            ? errors.fromBookingTime.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </div>
                    <div className={styles.fieldss}>
                      <FormControl
                        style={{ marginTop: 10 }}
                        error={!!errors.toBookingTime}
                      >
                        <Controller
                          control={control}
                          name="toBookingTime"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <TimePicker
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    {<FormattedLabel id="toBookingTime" />}
                                  </span>
                                }
                                value={valuee}
                                onChange={(newValue) => {
                                  setValueTwo(newValue);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
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
                          {errors?.toBookingTime
                            ? errors.toBookingTime.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </div>
                </div>
                <div>
                  <div className={styles.capacity}>
                    <TextField
                      id="standard-basic"
                      label={<FormattedLabel id="capacity" />}
                      variant="standard"
                      {...register("capacity")}
                      error={!!errors.capacity}
                      helperText={
                        errors?.capacity ? "Capacity is Required !!!" : null
                      }
                    />
                  </div>
                </div>
                <div className={styles.btn}>
                  <Button
                    sx={{ marginRight: 8 }}
                    type="submit"
                    variant="contained"
                    color="success"
                    endIcon={<SaveIcon />}
                  >
                    {btnSaveText}
                  </Button>
                  <Button
                    sx={{ marginRight: 8 }}
                    variant="contained"
                    color="primary"
                    endIcon={<ClearIcon />}
                    onClick={() => cancellButton()}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    endIcon={<ExitToAppIcon />}
                    onClick={() => exitButton()}
                  >
                    Exit
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </Slide>

        <div className={styles.addbtn}>
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
            Add
          </Button>
        </div>
        <DataGrid
          autoHeight
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginTop: 5,
            marginBottom: 5,
          }}
          rows={dataSource}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          //checkboxSelection
        />
      </Paper>
    </>
  );
};

export default Index;
