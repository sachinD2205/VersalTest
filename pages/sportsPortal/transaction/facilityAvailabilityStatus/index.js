import { yupResolver } from "@hookform/resolvers/yup";
import { Refresh } from "@mui/icons-material";
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
  Paper,
  Select,
  MenuItem,
  InputLabel,
  Slide,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { message } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import styles from "../facilityAvailabilityStatus/view.module.css";
import styles from "../../../../styles/sportsPortalStyles/facilityCheck.module.css";
import schema from "../../../../containers/schema/sportsPortalSchema/bookingTimeSchema";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DateTimePicker } from "@mui/x-date-pickers";
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
    resolver: yupResolver(schema),
    mode: "onChange",
  });

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
  const [wardNames, setWardNames] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [facilityTypess, setFacilityTypess] = useState([]);
  const [facilityNames, setFacilityNames] = useState([]);
  const [venues, setVenues] = useState([]);
  const [selectedFacilityType, setSelectedFacilityType] = useState();
  const [facilityNameField, setFacilityNameField] = useState(true);

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getAllDetails();
  }, [
    zoneNames,
    wardNames,
    departments,
    subDepartments,
    facilityNames,
    fetchData,
    facilityTypess,
  ]);

  useEffect(() => {
    getAllTypes();
    getWardNames();
    getDepartments();
    getSubDepartments();
    getFacilityTypes();
    getFacilityName();
    getVenue();
  }, []);
  const getVenue = () => {
    axios.get(`${URLS.SPURL}/venueMaster/getVenueMasterData`).then((r) => {
      setVenues(
        r.data.map((row) => ({
          id: row.id,
          venue: row.venue,
        }))
      );
    });
  };

  const getFacilityName = () => {
    axios.get(`${URLS.SPURL}/facilityName/getFacilityNameData`).then((r) => {
      setFacilityNames(
        r.data.map((row) => ({
          id: row.id,
          facilityName: row.facilityName,
          facilityType: row.facilityType,
        }))
      );
    });
  };

  const getFacilityTypes = () => {
    axios.get(`${URLS.SPURL}/facilityType/getFacilityTypeData`).then((r) => {
      setFacilityTypess(
        r.data.map((row) => ({
          id: row.id,
          facilityType: row.facilityType,
        }))
      );
    });
  };
  const getAllTypes = () => {
    axios.get(`${URLS.CFCURL}/master/zone/getAll`).then((r) => {
      setZoneNames(
        r.data.map((row) => ({
          id: row.id,
          zoneName: row.zoneName,
        }))
      );
    });
  };
  const getWardNames = () => {
    axios.get(`${URLS.CFCURL}/master/ward/getAll`).then((r) => {
      setWardNames(
        r.data.map((row) => ({
          id: row.id,
          wardName: row.wardName,
        }))
      );
    });
  };
  const getDepartments = () => {
    axios.get(`${URLS.CFCURL}/master/department/getAll`).then((r) => {
      setDepartments(
        r.data.map((row) => ({
          id: row.id,
          department: row.department,
        }))
      );
    });
  };

  const getSubDepartments = () => {
    axios.get(`${URLS.CFCURL}/master/subDepartment/getAll`).then((r) => {
      setSubDepartments(
        r.data.map((row) => ({
          id: row.id,
          subDepartmentName: row.subDepartment,
        }))
      );
    });
  };

  // Get Data By ID
  const getDataById = (value) => {
    console.log("clicked");
    setIsOpenCollapse(false);
    setID(value);
    const tempData = axios
      .get(
        `${urls.BaseURL}/counterMaster/getCounterMasterData
      /?id=${value}`
      )
      .then((res) => {
        console.log(res.data);
        reset(res.data);
        setButtonInputState(true);
        setIsOpenCollapse(true);
        setBtnSaveText("Edit");
      });
  };

  // Delete By ID
  const deleteById = async (value) => {
    await axios

      .delete(
        `${urls.BaseURL}/facilityAvailabilityStatus/discardFacilityAvailabilityStatus/${value}`
      )
      .then((res) => {
        if (res.status == 226) {
          message.success("Record Deleted !!!");
          getAllDetails();
          setButtonInputState(false);
        }
      });
  };

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    const allData = {
      zone: fromData.zone,
      ward: fromData.ward,
      department: fromData.department,
      subDepartment: fromData.subDepartment,
      facilityType: fromData.facilityType,
      facilityName: fromData.facilityName,
      venue: fromData.venue,
    };

    // const toDate = moment(fromData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD ");
    const toDateAndTime = moment(fromData.toDateAndTime).format(
      "YYYY-MM-DD hh:mm:ss"
    );
    const fromDateAndTime = moment(fromData.fromDateAndTime).format(
      "YYYY-MM-DD hh:mm:ss"
    );

    // Update Form Data
    const finalBodyForApi = {
      ...allData,
      fromDateAndTime,
      toDateAndTime,
    };

    console.log("DATA:", finalBodyForApi);
    if (btnSaveText === "Save") {
      console.log("Post -----");
      const tempData = axios
        .post(
          `${urls.BaseURL}/facilityAvailabilityStatus/saveFacilityAvailabilityStatus`,
          finalBodyForApi
        )
        .then((res) => {
          if (res.status == 200) {
            message.success("Data Saved !!!");
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
          `${urls.BaseURL}/facilityAvailabilityStatus/saveFacilityAvailabilityStatus/?id=${id}`,

          fromData
        )
        .then((res) => {
          if (res.status == 200) {
            message.success("Data Updated !!!");
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
    Ward: "",
    zone: "",
    subDepartment: "",
    department: "",
    facilityType: "",
    facilityName: "",
    venue: "",
    formDateTime: "",
    toDateTime: "",
    formDateTime: null,
    toDateTime: null,
    id: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    Ward: "",
    zone: "",
    subDepartment: "",
    department: "",
    facilityType: "",
    facilityName: "",
    venue: "",
    formDateTime: "",
    toDateTime: "",
    formDateTime: null,
    toDateTime: null,
    id: "",
  };

  // Get Table - Data

  const getAllDetails = () => {
    axios
      .get(`${urls.BaseURL}/facilityAvailabilityStatus/checkStatus`)
      .then((res) => {
        setDataSource(
          res.data.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            ward: wardNames?.find((obj) => obj?.id === r.ward)?.wardName,
            zone: zoneNames?.find((obj) => obj?.id === r.zone)?.zoneName,
            subDepartment: subDepartments?.find(
              (obj) => obj?.id === r.subDepartment
            )?.subDepartment,
            department: departments?.find((obj) => obj?.id === r.department)
              ?.department,
            facilityType: facilityTypess?.find(
              (obj) => obj?.id === r.facilityType
            )?.facilityType,
            facilityName: facilityNames?.find(
              (obj) => obj?.id === r.facilityName
            )?.facilityName,
            venue: venues?.find((obj) => obj?.id === r.venue)?.venue,
            // fromDateAndTime: r.fromDateAndTime,
            // toDateAndTime: r.toDateAndTime,
            fromDateAndTime: moment(r.fromDateAndTime).format(
              "YYYY-MM-DD hh:mm:ss"
            ),
            toDateAndTime: moment(r.toDateAndTime).format(
              "YYYY-MM-DD hh:mm:ss"
            ),
          }))
        );
      });
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      flex: 1,
    },
    {
      field: "ward",
      headerName: "Ward",
    },
    {
      field: "zone",
      headerName: "Zone",
    },
    {
      field: "facilityType",
      headerName: "Facility Type",
    },
    {
      field: "facilityName",
      headerName: "Facility Name",
      //type: "number",
      flex: 1,
    },

    {
      field: "venue",
      headerName: "Venue",
      //type: "number",
      flex: 1,
    },
    {
      field: "fromDateAndTime",
      headerName: "Date & Time (From)",
      //type: "number",
      flex: 1,
    },
    {
      field: "toDateAndTime",
      headerName: "Date & Time(To)",
      //type: "number",
      flex: 1,
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              // backgroundColor: "whitesmoke",
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Edit"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                const wardId = wardNames.find(
                  (obj) => obj?.ward === params.row.wardName
                )?.id;

                const zoneId = zoneNames.find(
                  (obj) => obj?.zone === params.row.zoneName
                )?.id;

                const departmentId = departments.find(
                  (obj) => obj?.department === params.row.department
                )?.id;

                const subDepartmentId = subDepartments.find(
                  (obj) => obj?.subDepartment === params.row.subDepartment
                )?.id;

                const facilityTypeId = facilityTypess.find(
                  (obj) => obj?.facilityType === params.row.facilityType
                )?.id;

                const facilityNameId = facilityNames.find(
                  (obj) => obj?.facilityName === params.row.facilityName
                )?.id;

                const venueId = venues.find(
                  (obj) => obj?.venue === params.row.venue
                )?.id;

                reset({
                  ...params.row,
                  ward: wardId,
                  facilityName: facilityNameId,
                  venue: venueId,
                  facilityType: facilityTypeId,
                  zone: zoneId,
                  department: departmentId,
                  subDepartment: subDepartmentId,
                });
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              disabled={deleteButtonInputState}
              onClick={() => deleteById(params.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  // View
  return (
    <>
      <BasicLayout>
        <Paper
          sx={{ marginLeft: 5, marginRight: 5, marginTop: 5, marginBottom: 5 }}
        >
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
                    <div className={styles.small}>
                      <div className={styles.row}>
                        <div>
                          <FormControl
                            variant="standard"
                            // sx={{ m: 1, minWidth: 120 }}
                            error={!!errors.ward}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Ward
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ minWidth: 195 }}
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="ward"
                                >
                                  {wardNames &&
                                    wardNames.map((wardName, index) => (
                                      <MenuItem key={index} value={wardName.id}>
                                        {wardName.wardName}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="ward"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.ward ? errors.ward.message : null}
                            </FormHelperText>
                          </FormControl>
                        </div>
                        <div>
                          <FormControl
                            variant="standard"
                            // sx={{ m: 1, minWidth: 120 }}
                            error={!!errors.zone}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Zone
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ minWidth: 195 }}
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="zone"
                                >
                                  {zoneNames &&
                                    zoneNames.map((zoneName, index) => (
                                      <MenuItem key={index} value={zoneName.id}>
                                        {zoneName.zoneName}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="zone"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.zone ? errors.zone.message : null}
                            </FormHelperText>
                          </FormControl>
                        </div>
                        <div>
                          <FormControl
                            variant="standard"
                            // sx={{ m: 1, minWidth: 120 }}
                            error={!!errors.department}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Department
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ minWidth: 195 }}
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="department"
                                >
                                  {departments &&
                                    departments.map((department, index) => (
                                      <MenuItem
                                        key={index}
                                        value={department.id}
                                      >
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
                        <div>
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
                                  sx={{ minWidth: 195 }}
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
                        </div>
                        <div>
                          <FormControl
                            variant="standard"
                            // sx={{ m: 1, minWidth: 120 }}
                            error={!!errors.facilityType}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Facility Type
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ minWidth: 195 }}
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={field.value}
                                  onChange={(value) => {
                                    field.onChange(value);
                                    console.log("value: ", value.target.value);
                                    setSelectedFacilityType(value.target.value);
                                    setFacilityNameField(false);
                                  }}
                                  label="facilityType"
                                >
                                  {facilityTypess &&
                                    facilityTypess.map(
                                      (facilityType, index) => (
                                        <MenuItem
                                          key={index}
                                          value={facilityType.id}
                                        >
                                          {facilityType.facilityType}
                                        </MenuItem>
                                      )
                                    )}
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
                              Facility Name
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ minWidth: 195 }}
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="department"
                                  disabled={facilityNameField}
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
                      </div>
                      <div className={styles.row}>
                        <div>
                          <FormControl
                            variant="standard"
                            // sx={{ m: 1, minWidth: 120 }}
                            error={!!errors.venue}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Venue
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ minWidth: 195 }}
                                  labelId="demo-simple-select-standard-label"
                                  Fdate
                                  id="demo-simple-select-standard"
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="venue"
                                >
                                  {venues &&
                                    venues.map((venue, index) => (
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
                        <div>
                          <Controller
                            control={control}
                            name="formDateTime"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                  renderInput={(props) => (
                                    <TextField {...props} />
                                  )}
                                  label="Date & Time (From)"
                                  value={field.value}
                                  onChange={(date) => field.onChange(date)}
                                />
                              </LocalizationProvider>
                            )}
                          />
                        </div>
                        <div>
                          <Controller
                            control={control}
                            name="toDateTime"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                  renderInput={(props) => (
                                    <TextField {...props} />
                                  )}
                                  label="Date & Time(To)"
                                  value={field.value}
                                  onChange={(date) => field.onChange(date)}
                                />
                              </LocalizationProvider>
                            )}
                          />
                        </div>
                      </div>
                      <div>
                        <table className={styles.tbl}>
                          <tr>
                            <th>Dates</th>
                            <th>01-10-2022</th>
                            <th>02-10-2022</th>
                            <th>03-10-2022</th>
                            <th>04-10-2022</th>
                            <th>05-10-2022</th>
                            <th>06-10-2022</th>
                            <th>07-10-2022</th>
                          </tr>
                          <tr>
                            <th>10 pm to 11 pm</th>
                            <th>
                              <button>Book Now</button>
                            </th>
                            <th>
                              <button>Book Now</button>
                            </th>
                            <th>
                              <button>Book Now</button>
                            </th>
                            <th>
                              <button>Book Now</button>
                            </th>
                            <th>
                              <button>Book Now</button>
                            </th>
                            <th>
                              <button>Book Now</button>
                            </th>
                            <th>
                              <button>Book Now</button>
                            </th>
                          </tr>
                          <tr>
                            <th>11:15 pm to 12:15 pm</th>
                            <th>
                              <button>Book Now</button>
                            </th>
                            <th>
                              <button>Book Now</button>
                            </th>
                            <th>
                              <button>Book Now</button>
                            </th>
                            <th>
                              <button>Book Now</button>
                            </th>
                            <th>
                              <button>Book Now</button>
                            </th>
                            <th>
                              <button>Book Now</button>
                            </th>
                            <th>
                              <button>Book Now</button>
                            </th>
                          </tr>
                        </table>
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
                    </div>
                  </form>
                </FormProvider>
              </div>
            </Slide>
          )}
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
                setBtnSaveText("Next");
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
      </BasicLayout>
    </>
  );
};

export default Index;
