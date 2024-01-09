import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import sweetAlert from "sweetalert";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import schema from "../../../../containers/schema/publicAuditorium/transactions/auditoriumBooking";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import styles from "../../../../styles/publicAuditorium/masters/[auditorium].module.css";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Loader from "../../../../containers/Layout/components/Loader";

const AuditoriumBook = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
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
  const [services, setServices] = useState([]);

  const [bookingFor, setBookingFor] = useState("Booking For PCMC");
  const [loading, setLoading] = useState(false);

  const handleChangeRadio = (event) => {
    setBookingFor(event.target.value);
  };

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  let abc = [];

  useEffect(() => {
    // getZoneName();
    // getWardNames();
    getAuditorium();
    getNexAuditoriumBookingNumber();
    getServices();
  }, []);

  useEffect(() => {
    getAuditoriumBooking();
  }, [auditoriums]);

  const getNexAuditoriumBookingNumber = () => {
    // setLoading(true);
    axios
      .get(
        // "http://192.168.68.123:9003/pabbm/api/trnAuditoriumBookingOnlineProcess/getNextKey"
        `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getNextKey`
      )
      .then((r) => {
        let val = r?.data;
        setValue("auditoriumBookingNo", r?.data);
        setLoading(false);
      });
  };

  const getAuditorium = () => {
    axios
      .get("http://192.168.68.123:9003/pabbm/api/mstAuditorium/getAll")
      .then((r) => {
        console.log("respe", r);
        setAuditoriums(
          r.data.mstAuditoriumList.map((row, index) => ({
            id: row.id,
            auditoriumName: row.auditoriumName,
          }))
        );
      });
  };

  const getServices = () => {
    axios
      .get(`http://15.206.219.76:8090/cfc/api/master/service/getAll`)
      .then((r) => {
        console.log("respe ser", r);
        setServices(
          r.data.service.map((row, index) => ({
            id: row.id,
            serviceName: row.serviceName,
            serviceNameMr: row.serviceNameMr,
          }))
        );
      });
  };

  const getZoneName = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((r) => {
      setZoneNames(
        r.data.zone.map((row, index) => ({
          id: row.id,
          zoneName: row.zoneName,
        }))
      );
    });
  };

  const getWardNames = () => {
    axios.get(`${urls.CFCURL}/master/ward/getAll`).then((r) => {
      setWardNames(
        r.data.ward.map((row) => ({
          id: row.id,
          wardName: row.wardName,
        }))
      );
    });
  };

  const getAuditoriumBooking = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    // setLoading(true);
    axios
      .get(
        "http://192.168.68.123:9003/pabbm/api/trnAuditoriumBookingOnlineProcess/getAll",
        {
          params: {
            pageSize: _pageSize,
            pageNo: _pageNo,
          },
        }
      )
      .then((res) => {
        console.log("res aud", res);

        setLoading(false);
        let result = res.data.trnAuditoriumBookingOnlineProcessList;
        let _res = result.map((val, i) => {
          console.log("44", val);
          return {
            srNo: val.id,
            id: val.id,
            auditoriumName: val.auditoriumName ? val.auditoriumName : "-",
            toDate: val.toDate ? val.toDate : "-",
            fromDate: val.fromDate ? val.fromDate : "-",
            holidaySchedule: val.holidaySchedule ? val.holidaySchedule : "-",
            status: val.activeFlag === "Y" ? "Active" : "Inactive",
            activeFlag: val.activeFlag,

            auditoriumId: val.auditoriumId
              ? auditoriums.find((obj) => obj?.id == val.auditoriumId)
                  ?.auditoriumName
              : "Not Available",
            eventDate: val.eventDate ? val.eventDate : "-",
            mobile: val.mobile ? val.mobile : "-",
            organizationName: val.organizationName ? val.organizationName : "-",
            organizationOwnerFirstName: val.organizationOwnerFirstName
              ? val.organizationOwnerFirstName +
                " " +
                val.organizationOwnerLastName
              : "-",
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
    const eventDate = moment(formData.eventDate).format("YYYY-MM-DD");
    const finalBodyForApi = {
      ...formData,
      eventDate,
      auditoriumBookingNo: Number(formData.auditoriumBookingNo),
      auditoriumId: Number(formData.auditoriumId),
      aadhaarNo: Number(formData.aadhaarNo),
      landlineNo: Number(formData.landlineNo),
      mobile: Number(formData.mobile),
      depositAmount: Number(formData.depositAmount),
      payRentAmount: Number(formData.payRentAmount),
      pincode: Number(formData.pincode),
      rentAmount: Number(formData.rentAmount),
      extendedRentAmount: Number(formData.extendedRentAmount),
      bankaAccountNo: Number(formData.bankaAccountNo),
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(
        `http://192.168.68.123:9003/pabbm/api/trnAuditoriumBookingOnlineProcess/save`,
        finalBodyForApi
      )
      .then((res) => {
        console.log("save data", res);
        if (res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getAuditoriumBooking();
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
      headerName: "Sr No",
      maxWidth: 70,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "auditoriumId",
      headerName: "Auditorium Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "organizationOwnerFirstName",
      headerName: "Organization Owner Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "eventDate",
      headerName: "Event Date",
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "mobile",
      headerName: "Mobile",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "organizationName",
      headerName: "Organization Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    ,
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <Paper style={{ margin: "50px" }}>
          {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Grid container style={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <FormControl
                      error={errors.auditoriumId}
                      variant="standard"
                      sx={{ width: "90%" }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Select Auditorium
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ minWidth: 220 }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Select Auditorium"
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
                        {errors?.auditoriumId
                          ? errors.auditoriumId.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <FormControl
                      variant="standard"
                      sx={{ width: "90%" }}
                      error={!!errors.serviceId}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Select Service
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ minWidth: 220 }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Select Service"
                          >
                            {services &&
                              services.map((service, index) => (
                                <MenuItem
                                  key={index}
                                  sx={{
                                    display: service.serviceName
                                      ? "flex"
                                      : "none",
                                  }}
                                  value={service.id}
                                >
                                  {service.serviceName}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="serviceId"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.serviceId ? errors.serviceId.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      id="standard-basic"
                      label="Auditorium Booking Number"
                      variant="standard"
                      sx={{ width: "90%" }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled
                      {...register("auditoriumBookingNo")}
                      error={!!errors.auditoriumBookingNo}
                      helperText={
                        errors?.auditoriumBookingNo
                          ? errors.auditoriumBookingNo.message
                          : null
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <FormControl sx={{ width: "100%" }}>
                    <RadioGroup
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                      }}
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={bookingFor}
                      onChange={handleChangeRadio}
                    >
                      <FormControlLabel
                        value="Booking For PCMC"
                        control={<Radio />}
                        label="Booking For PCMC"
                      />
                      <FormControlLabel
                        value="Booking For Other Vendor"
                        control={<Radio />}
                        label="Booking For Other Vendor"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Organization Name"
                      variant="standard"
                      {...register("organizationName")}
                      error={!!errors.organizationName}
                      helperText={
                        errors?.organizationName
                          ? errors.organizationName.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Title"
                      variant="standard"
                      {...register("title")}
                      error={!!errors.title}
                      helperText={errors?.title ? errors.title.message : null}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      id="standard-basic"
                      label="Flat/Building No."
                      sx={{
                        width: "90%",
                        "& .MuiInput-input": {
                          "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                            {
                              "-webkit-appearance": "none",
                            },
                        },
                      }}
                      variant="standard"
                      type="number"
                      {...register("flatBuildingNo")}
                      error={!!errors.flatBuildingNo}
                      helperText={
                        errors?.flatBuildingNo
                          ? errors.flatBuildingNo.message
                          : null
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Organization Owner First Name"
                      variant="standard"
                      {...register("organizationOwnerFirstName")}
                      error={!!errors.organizationOwnerFirstName}
                      helperText={
                        errors?.organizationOwnerFirstName
                          ? errors.organizationOwnerFirstName.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Organization Owner Middle Name"
                      variant="standard"
                      {...register("organizationOwnerMiddleName")}
                      error={!!errors.organizationOwnerMiddleName}
                      helperText={
                        errors?.organizationOwnerMiddleName
                          ? errors.organizationOwnerMiddleName.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Organization Owner Last Name"
                      variant="standard"
                      {...register("organizationOwnerLastName")}
                      error={!!errors.organizationOwnerLastName}
                      helperText={
                        errors?.organizationOwnerLastName
                          ? errors.organizationOwnerLastName.message
                          : null
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Building Name"
                      variant="standard"
                      {...register("buildingName")}
                      error={!!errors.buildingName}
                      helperText={
                        errors?.buildingName
                          ? errors.buildingName.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Road Name"
                      variant="standard"
                      {...register("roadName")}
                      error={!!errors.roadName}
                      helperText={
                        errors?.roadName ? errors.roadName.message : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Landmark"
                      variant="standard"
                      {...register("landmark")}
                      error={!!errors.landmark}
                      helperText={
                        errors?.landmark ? errors.landmark.message : null
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      id="standard-basic"
                      label="Pin Code"
                      variant="standard"
                      type="number"
                      sx={{
                        width: "90%",
                        "& .MuiInput-input": {
                          "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                            {
                              "-webkit-appearance": "none",
                            },
                        },
                      }}
                      onInput={(e) => {
                        e.target.value = Math.max(0, parseInt(e.target.value))
                          .toString()
                          .slice(0, 6);
                      }}
                      {...register("pincode")}
                      error={!!errors.pincode}
                      helperText={
                        errors?.pincode ? errors.pincode.message : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      id="standard-basic"
                      label="Aadhaar Number"
                      // inputProps={{ maxLength: 12 }}
                      onInput={(e) => {
                        e.target.value = Math.max(0, parseInt(e.target.value))
                          .toString()
                          .slice(0, 12);
                      }}
                      sx={{
                        width: "90%",
                        "& .MuiInput-input": {
                          "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                            {
                              "-webkit-appearance": "none",
                            },
                        },
                      }}
                      type="number"
                      variant="standard"
                      {...register("aadhaarNo")}
                      error={!!errors.aadhaarNo}
                      helperText={
                        errors?.aadhaarNo ? errors.aadhaarNo.message : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      id="standard-basic"
                      label="Landline Number"
                      variant="standard"
                      type="number"
                      onInput={(e) => {
                        e.target.value = Math.max(0, parseInt(e.target.value))
                          .toString()
                          .slice(0, 10);
                      }}
                      sx={{
                        width: "90%",
                        "& .MuiInput-input": {
                          "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                            {
                              "-webkit-appearance": "none",
                            },
                        },
                      }}
                      {...register("landlineNo")}
                      error={!!errors.landlineNo}
                      helperText={
                        errors?.landlineNo ? errors.landlineNo.message : null
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      id="standard-basic"
                      label="Mobile"
                      type="number"
                      sx={{
                        width: "90%",
                        "& .MuiInput-input": {
                          "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                            {
                              "-webkit-appearance": "none",
                            },
                        },
                      }}
                      onInput={(e) => {
                        e.target.value = Math.max(0, parseInt(e.target.value))
                          .toString()
                          .slice(0, 10);
                      }}
                      variant="standard"
                      {...register("mobile")}
                      error={!!errors.mobile}
                      helperText={errors?.mobile ? errors.mobile.message : null}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Email Address"
                      variant="standard"
                      {...register("emailAddress")}
                      error={!!errors.emailAddress}
                      helperText={
                        errors?.emailAddress
                          ? errors.emailAddress.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <FormControl
                      error={errors.messageDisplay}
                      variant="standard"
                      sx={{ width: "90%" }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Message Display
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ minWidth: 220 }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Message Display"
                          >
                            {[
                              { id: 1, auditoriumName: "YES" },
                              { id: 2, auditoriumName: "NO" },
                            ].map((auditorium, index) => (
                              <MenuItem key={index} value={auditorium.id}>
                                {auditorium.auditoriumName}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                        name="messageDisplay"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.messageDisplay
                          ? errors.messageDisplay.message
                          : null}
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
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Event Details"
                      variant="standard"
                      {...register("eventDetails")}
                      error={!!errors.eventDetails}
                      helperText={
                        errors?.eventDetails
                          ? errors.eventDetails.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "end",
                    }}
                  >
                    <FormControl sx={{ width: "90%" }} error={errors.eventDate}>
                      <Controller
                        name="eventDate"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>Event Date</span>
                              }
                              value={field.value}
                              onChange={(date) => {
                                field.onChange(date);
                                setValue(
                                  "eventDay",
                                  moment(date).format("dddd")
                                );
                              }}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  fullWidth
                                  error={errors.eventDate}
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
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Event Day"
                      disabled
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="standard"
                      {...register("eventDay")}
                      error={!!errors.eventDay}
                      helperText={
                        errors?.eventDay ? errors.eventDay.message : null
                      }
                    />
                  </Grid>
                </Grid>

                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "end",
                    }}
                  >
                    <FormControl
                      sx={{ width: "90%" }}
                      error={!!errors.eventDate}
                    >
                      <Controller
                        name="eventTimeFrom"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                              value={field.value}
                              onChange={(date) => field.onChange(date)}
                              selected={field.value}
                              label={
                                <span style={{ fontSize: 16 }}>
                                  Event Time From
                                </span>
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  error={!!errors.eventTimeFrom}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.eventTimeFrom
                          ? errors.eventTimeFrom.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "end",
                    }}
                  >
                    <FormControl
                      sx={{ width: "90%" }}
                      error={!!errors.eventDate}
                    >
                      <Controller
                        name="eventTimeTo"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                              value={field.value}
                              onChange={(date) => field.onChange(date)}
                              selected={field.value}
                              label={
                                <span style={{ fontSize: 16 }}>
                                  Event Time To
                                </span>
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  error={!!errors.eventTimeTo}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.eventTimeTo
                          ? errors.eventTimeTo.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      id="standard-basic"
                      label="Deposit Amount"
                      variant="standard"
                      type="number"
                      sx={{
                        width: "90%",
                        "& .MuiInput-input": {
                          "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                            {
                              "-webkit-appearance": "none",
                            },
                        },
                      }}
                      {...register("depositAmount")}
                      error={!!errors.depositAmount}
                      helperText={
                        errors?.depositAmount
                          ? errors.depositAmount.message
                          : null
                      }
                    />
                  </Grid>
                </Grid>

                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "end",
                    }}
                  >
                    <Typography>Pay Deposit Amount</Typography>
                    <Link href="#">Link</Link>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      id="standard-basic"
                      label="Rent amount"
                      variant="standard"
                      type="number"
                      sx={{
                        width: "90%",
                        "& .MuiInput-input": {
                          "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                            {
                              "-webkit-appearance": "none",
                            },
                        },
                      }}
                      onInput={(e) => {
                        e.target.value = Math.max(0, parseInt(e.target.value))
                          .toString()
                          .slice(0, 10);
                      }}
                      {...register("rentAmount")}
                      error={!!errors.rentAmount}
                      helperText={
                        errors?.rentAmount ? errors.rentAmount.message : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      id="standard-basic"
                      label="Pay Rent Amount"
                      variant="standard"
                      type="number"
                      sx={{
                        width: "90%",
                        "& .MuiInput-input": {
                          "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                            {
                              "-webkit-appearance": "none",
                            },
                        },
                      }}
                      onInput={(e) => {
                        e.target.value = Math.max(0, parseInt(e.target.value))
                          .toString()
                          .slice(0, 10);
                      }}
                      {...register("payRentAmount")}
                      error={!!errors.payRentAmount}
                      helperText={
                        errors?.payRentAmount
                          ? errors.payRentAmount.message
                          : null
                      }
                    />
                  </Grid>
                </Grid>

                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "end",
                    }}
                  >
                    <Typography>Deposit Receipt</Typography>
                    <Link href="#">Print</Link>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      id="standard-basic"
                      label="Extended Rent amount"
                      variant="standard"
                      type="number"
                      sx={{
                        width: "90%",
                        "& .MuiInput-input": {
                          "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                            {
                              "-webkit-appearance": "none",
                            },
                        },
                      }}
                      onInput={(e) => {
                        e.target.value = Math.max(0, parseInt(e.target.value))
                          .toString()
                          .slice(0, 10);
                      }}
                      {...register("extendedRentAmount")}
                      error={!!errors.extendedRentAmount}
                      helperText={
                        errors?.extendedRentAmount
                          ? errors.extendedRentAmount.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "end",
                    }}
                  >
                    <Typography>Rent Receipt</Typography>
                    <Link href="#">Print</Link>
                  </Grid>
                </Grid>

                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Manager's Digital Signature"
                      variant="standard"
                      {...register("managersDigitalSignature")}
                      error={!!errors.managersDigitalSignature}
                      helperText={
                        errors?.managersDigitalSignature
                          ? errors.managersDigitalSignature.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Terms And Conditions"
                      variant="standard"
                      {...register("termsAndCondition")}
                      error={!!errors.termsAndCondition}
                      helperText={
                        errors?.termsAndCondition
                          ? errors.termsAndCondition.message
                          : null
                      }
                    />
                  </Grid>
                </Grid>

                <Grid
                  container
                  sx={{
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h5">ECS Form Details</Typography>
                </Grid>

                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Bank account holder name"
                      variant="standard"
                      {...register("bankAccountHolderName")}
                      error={!!errors.bankAccountHolderName}
                      helperText={
                        errors?.bankAccountHolderName
                          ? errors.bankAccountHolderName.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      id="standard-basic"
                      label="Bank account number"
                      variant="standard"
                      type="number"
                      sx={{
                        width: "90%",
                        "& .MuiInput-input": {
                          "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                            {
                              "-webkit-appearance": "none",
                            },
                        },
                      }}
                      {...register("bankaAccountNo")}
                      error={!!errors.bankaAccountNo}
                      helperText={
                        errors?.bankaAccountNo
                          ? errors.bankaAccountNo.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <FormControl
                      variant="standard"
                      error={!!errors.typeOfBankAccountId}
                      sx={{ width: "90%" }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Type of bank account
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ minWidth: 220 }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Type of bank account"
                          >
                            {[
                              { id: 1, bankAcc: "Current" },
                              { id: 2, bankAcc: "Saving" },
                            ].map((bank, index) => (
                              <MenuItem key={index} value={bank.id}>
                                {bank.bankAcc}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                        name="typeOfBankAccountId"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.typeOfBankAccountId
                          ? errors.typeOfBankAccountId.message
                          : null}
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
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <FormControl
                      variant="standard"
                      error={!!errors.bankNameId}
                      sx={{ width: "90%" }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Bank name
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ minWidth: 220 }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Bank name"
                          >
                            {[
                              { id: 1, name: "BOI" },
                              { id: 2, name: "SBI" },
                              { id: 3, name: "BOM" },
                              { id: 4, name: "HDFC" },
                              { id: 5, name: "Axis" },
                              { id: 6, name: "IDFC" },
                              { id: 7, name: "KOTAK" },
                              { id: 8, name: "ICICI" },
                              { id: 9, name: "UBI" },
                            ].map((bank, index) => (
                              <MenuItem key={index} value={bank.id}>
                                {bank.name}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                        name="bankNameId"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.bankNameId ? errors.bankNameId.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Bank address"
                      variant="standard"
                      {...register("bankAddress")}
                      error={!!errors.bankAddress}
                      helperText={
                        errors?.bankAddress ? errors.bankAddress.message : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="IFSC Code"
                      variant="standard"
                      {...register("ifscCode")}
                      error={!!errors.ifscCode}
                      helperText={
                        errors?.ifscCode ? errors.ifscCode.message : null
                      }
                    />
                  </Grid>
                </Grid>

                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      id="standard-basic"
                      type="number"
                      sx={{
                        width: "90%",
                        "& .MuiInput-input": {
                          "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                            {
                              "-webkit-appearance": "none",
                            },
                        },
                      }}
                      label="MICR Code"
                      variant="standard"
                      {...register("micrCode")}
                      error={!!errors.micrCode}
                      helperText={
                        errors?.micrCode ? errors.micrCode.message : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="standard-basic"
                      label="Remark"
                      variant="standard"
                      {...register("remarks")}
                      error={!!errors.remarks}
                      helperText={
                        errors?.remarks ? errors.remarks.message : null
                      }
                    />
                  </Grid>
                </Grid>

                <Grid container style={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
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
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
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
                      Clear
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
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
                      Exit
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
                add
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
      )}
    </div>
  );
};

export default AuditoriumBook;
