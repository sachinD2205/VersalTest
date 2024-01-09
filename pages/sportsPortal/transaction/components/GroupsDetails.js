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
  Grid,
  FormControlLabel,
  Checkbox,
  Typography,
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
import URLS from "../../../../URLS/urls";
import styles from "../../../../styles/sportsPortalStyles/facilityCheck.module.css";
import schema from "../../../../containers/schema/sportsPortalSchema/bookingTimeSchema";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

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
  const [fields, setFields] = useState([]);

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getAllDetails();
  }, [zoneNames, wardNames, departments, subDepartments, fetchData]);

  useEffect(() => {
    getAllTypes();
    getWardNames();
    getDepartments();
    getSubDepartments();
  }, []);

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

  // Titles
  const [titles, setTitles] = useState([]);

  // getTitles
  const getTitles = () => {
    axios.get(`${URLS.CFCURL}/master/title/getAll`).then((r) => {
      setTitles(
        r.data.map((row) => ({
          id: row.id,
          title: row.title,
        }))
      );
    });
  };

  // Religions
  const [genders, setGenders] = useState([]);

  // getGenders
  const getGenders = () => {
    axios.get(`${URLS.CFCURL}/master/gender/getAll`).then((r) => {
      setGenders(
        r.data.map((row) => ({
          id: row.id,
          gender: row.gender,
        }))
      );
    });
  };

  // crPincodes
  const [crPincodes, setCrPinCodes] = useState([]);

  // getCrPinCodes
  const getCrPinCodes = () => {
    axios.get(`${URLS.CFCURL}/master/pinCode/getAll`).then((r) => {
      setCrPinCodes(
        r.data.map((row) => ({
          id: row.id,
          crPincode: row.pinCode,
        }))
      );
    });
  };

  const addressChange = (e) => {
    if (e.target.checked) {
      //   setValue("prCityName", getValues("prCityName"));
      //   setValue("prState", getValues("crState"));
      //   setValue("prPincode", getValues("crPincode"));
    } else {
      setValue("prCityName", "");
      setValue("prState", "");
      setValue("prPincode", "");
    }
  };

  // useEffect
  useEffect(() => {
    getTitles();
    getGenders();
    getCrPinCodes();
  }, []);

  // Departments Select
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

  // Delete
  const deleteById = (value) => {
    swal({
      title: "Delete?",
      text: "Are you sure you want to delete this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`${urls.BaseURL}/facilityType/discardFacilityType/${value}`)
          .then((res) => {
            if (res.status == 226) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              setButtonInputState(false);
              getAllDetails();
            }
          });
      } else {
        swal("Record is Safe");
      }
    });
  };

  // OnSubmit Form
  const onSubmitForm = (data) => {
    e.preventDefault();
    console.log("data", data);
    const data1 = [];
    data.push(data1);

    console.log("data", data1);
    // if (btnSaveText === "Save") {
    //   console.log("Post -----");
    //   const tempData = axios
    //     //   /api/sportsBookingGroupDetails
    //     .post(
    //       `${urls.BaseURL}/sportsBookingGroupDetails/saveSportsBookingGroupDetails`,
    //       formData
    //     )
    //     .then((res) => {
    //       console.log("response", res);
    //       if (res.status == 200) {
    //         // message.success("Data Saved !!!");
    //         sweetAlert("Saved!", "Record Saved successfully !", "success");
    //         setButtonInputState(false);
    //         setIsOpenCollapse(false);
    //         setFetchData(tempData);
    //         setEditButtonInputState(false);
    //         setDeleteButtonState(false);
    //       }
    //     });
    // }
    // // Update Data Based On ID
    // else if (btnSaveText === "Edit") {
    //   console.log("Put -----");
    //   const tempData = axios
    //     .post(
    //       `${urls.BaseURL}/facilityType/saveFacilityType/?id=${id}`,
    //       fromData
    //     )
    //     .then((res) => {
    //       if (res.status == 200) {
    //         // message.success("Data Updated !!!");
    //         sweetAlert("Updated!", "Record Updated successfully !", "success");
    //         setButtonInputState(false);
    //         setIsOpenCollapse(false);
    //         setFetchData(tempData);
    //       }
    //     });
    // }
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
    remark: "",
    geoCode: "",
    department: "",
    subDepartment: "",
    facilityType: "",
    wardName: "",
    zoneName: "",
    facilityTypeId: "",
    id: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    remark: "",
    geoCode: "",
    department: "",
    subDepartment: "",
    facilityType: "",
    wardName: "",
    zoneName: "",
    facilityTypeId: "",
    id: "",
  };

  // Get Table - Data
  const getAllDetails = () => {
    axios
      .get(`${urls.BaseURL}/facilityType/getFacilityTypeData`)
      .then((res) => {
        setDataSource(
          res.data.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            facilityTypeId: r.facilityTypeId,
            geoCode: r.geoCode,
            zoneName: zoneNames?.find((obj) => obj?.id === r.zoneName)
              ?.zoneName,
            wardName: wardNames?.find((obj) => obj?.id === r.wardName)
              ?.wardName,
            department: departments?.find((obj) => obj?.id === r.department)
              ?.department,
            subDepartment: subDepartments?.find(
              (obj) => obj?.id === r.subDepartment
            )?.subDepartment,

            facilityType: r.facilityType,
            facilityPrefix: r.facilityPrefix,
            facilityId: r.facilityId,
            remark: r.remark,
          }))
        );
      });
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "SR NO",
      flex: 1,
    },
    {
      field: "facilityTypeId",
      headerName: <FormattedLabel id=" Facility Type Id" />,
      //type: "number",
      flex: 1,
    },

    {
      field: "zoneName",
      headerName: <FormattedLabel id="zone" />,
      //type: "number",
      flex: 1,
    },

    {
      field: "wardName",
      headerName: <FormattedLabel id="ward" />,
      //type: "number",
      flex: 1,
    },

    {
      field: "department",
      headerName: <FormattedLabel id="department" />,
      //type: "number",
      flex: 1,
    },
    {
      field: "facilityType",
      headerName: <FormattedLabel id="facilityType" />,
      //type: "number",
      flex: 1,
    },

    {
      field: "geoCode",
      headerName: <FormattedLabel id="gisCode" />,
      //type: "number",
      flex: 1,
    },

    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      flex: 1,
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
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
                  // console.log(
                  //   "Hey ward name la pathvtiye: ",
                  //   params.row.wardName
                  // );

                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);

                const wardId = wardNames.find(
                  (obj) => obj?.wardName === params.row.wardName
                )?.id;

                const zoneId = zoneNames.find(
                  (obj) => obj?.zoneName === params.row.zoneName
                )?.id;

                const departmentId = departments.find(
                  (obj) => obj?.department === params.row.department
                )?.id;

                const subDepartmentId = subDepartments.find(
                  (obj) => obj?.subDepartment === params.row.subDepartment
                )?.id;

                reset({
                  ...params.row,
                  wardName: wardId,
                  zoneName: zoneId,
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
      <Paper
        sx={{
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5,
          marginBottom: 5,
          paddingBottom: 3,
          paddingTop: 3,
        }}
      >
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <div
                    style={{
                      backgroundColor: "#0084ff",
                      color: "white",
                      fontSize: 19,
                      marginTop: 30,
                      marginBottom: 30,
                      padding: 8,
                      paddingLeft: 30,
                      marginLeft: "40px",
                      marginRight: "65px",
                      borderRadius: 100,
                    }}
                  >
                    <strong>
                      <FormattedLabel id="groupDetails" />
                    </strong>
                  </div>
                  <Grid
                    container
                    sx={{
                      marginLeft: 5,
                      marginTop: 1,
                      marginBottom: 5,
                      align: "center",
                    }}
                  >
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <FormControl error={!!errors.title} sx={{ marginTop: 2 }}>
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="title" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              autoFocus
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="Title *"
                              id="demo-simple-select-standard"
                              labelId="id='demo-simple-select-standard-label'"
                            >
                              {titles &&
                                titles.map((title, index) => (
                                  <MenuItem key={index} value={title.id}>
                                    {title.title}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="title"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.title ? errors.title.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="firstName" />}
                        {...register("firstName")}
                        error={!!errors.firstName}
                        helperText={
                          errors?.firstName ? errors.firstName.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="middleName" />}
                        {...register("middleName")}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="lastName" />}
                        {...register("lastName")}
                        error={!!errors.lastName}
                        helperText={
                          errors?.lastName ? errors.lastName.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <FormControl
                        sx={{ marginTop: 2 }}
                        error={!!errors.gender}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="gender" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="Gender *"
                            >
                              {genders &&
                                genders.map((gender, index) => (
                                  <MenuItem key={index} value={gender.id}>
                                    {gender.gender}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="gender"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.gender ? errors.gender.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <FormControl
                        error={!!errors.dateOfBirth}
                        sx={{ marginTop: 0 }}
                      >
                        <Controller
                          control={control}
                          name="dateOfBirth"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel id="dateOfBirth" />
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) => {
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
                                  );
                                  let date1 = moment(date).format("YYYYMMDD");
                                  setValue(
                                    "age",
                                    moment(date1, "YYYYMMDD")
                                      .fromNow()
                                      .slice(1, 2)
                                  );
                                }}
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
                          {errors?.dateOfBirth
                            ? errors.dateOfBirth.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <TextField
                        // disabled
                        InputLabelProps={{ shrink: true }}
                        id="standard-basic"
                        label={<FormattedLabel id="age" />}
                        {...register("age")}
                        error={!!errors.age}
                        helperText={errors?.age ? errors.age.message : null}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="mobileNo" />}
                        {...register("mobile")}
                        error={!!errors.mobile}
                        helperText={
                          errors?.mobile ? errors.mobile.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="aadharNo" />}
                        {...register("aadharNo")}
                        error={!!errors.aadharNo}
                        helperText={
                          errors?.aadharNo ? errors.aadharNo.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="emailAddress" />}
                        {...register("emailAddress")}
                        error={!!errors.emailAddress}
                        helperText={
                          errors?.emailAddress
                            ? errors.emailAddress.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="currentAddress" />}
                        {...register("currentAddress")}
                        error={!!errors.currentAddress}
                        helperText={
                          errors?.currentAddress
                            ? errors.currentAddress.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <TextField
                        id="standard-basic"
                        disabled
                        defaultValue={"Pimpri Chinchwad"}
                        label={<FormattedLabel id="cityName" />}
                        {...register("crCityName")}
                        error={!!errors.crCityName}
                        helperText={
                          errors?.crCityName ? errors.crCityName.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <TextField
                        id="standard-basic"
                        disabled
                        defaultValue={"Maharashtra"}
                        label={<FormattedLabel id="state" />}
                        {...register("crState")}
                        error={!!errors.crState}
                        helperText={
                          errors?.crState ? errors.crState.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <FormControl
                        sx={{ marginTop: 2 }}
                        error={!!errors.crPincode}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {<FormattedLabel id="pinCode" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="Pin Code *"
                            >
                              {crPincodes &&
                                crPincodes.map((crPincode, index) => (
                                  <MenuItem key={index} value={crPincode.id}>
                                    {crPincode.crPincode}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="crPincode"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.crPincode ? errors.crPincode.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <FormControlLabel
                        control={<Checkbox />}
                        label={
                          <Typography>
                            <b>{<FormattedLabel id="checkBox" />}</b>
                          </Typography>
                        }
                        {...register("addressCheckBox")}
                        onChange={(e) => {
                          addressChange(e);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="permanentAddress" />}
                        {...register("permanentAddress")}
                        error={!!errors.permanentAddress}
                        helperText={
                          errors?.permanentAddress
                            ? errors.permanentAddress.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="cityName" />}
                        {...register("prCityName")}
                        error={!!errors.prCityName}
                        helperText={
                          errors?.prCityName ? errors.prCityName.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="state" />}
                        {...register("prState")}
                        error={!!errors.prState}
                        helperText={
                          errors?.prState ? errors.prState.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="pinCode" />}
                        {...register("prPinCode")}
                        error={!!errors.prPinCode}
                        helperText={
                          errors?.prPinCode ? errors.prPinCode.message : null
                        }
                      />
                    </Grid>
                    {/* <table>
         
         

        </table> */}
                  </Grid>

                  <div className={styles.btn}>
                    <Button
                      sx={{ marginRight: 8 }}
                      type="submit"
                      // onClick={(formData) => {
                      //   onSubmitForm(formData);
                      // }}
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
