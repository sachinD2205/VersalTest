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
  Slide,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import urls from "../../../../URLS/urls";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import schema from "../../../../containers/schema/publicAuditorium/transactions/auditoriumEventsCharges";
import sweetAlert from "sweetalert";
import moment from "moment";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import PabbmHeader from "../../../../components/publicAuditorium/pabbmHeader";

const AuditoriumEventsCharges = () => {
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
  const [programEventDescription, setProgramEventDescription] = useState([]);
  const [filteredProgramEventDescription, setFilteredProgramEventDescription] =
    useState([]);
  const [filteredEventTimes, setFilteredEventTimes] = useState([]);

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();

  const language = useSelector((state) => state.labels.language);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 60,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "auditorium",
      headerName: <FormattedLabel id="auditorium" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "eventName",
      headerName: <FormattedLabel id="eventNameEn" />,
      flex: 1,
      headerAlign: "center",
    },
    // {
    //   field: "programEventDescription",
    //   headerName: <FormattedLabel id="programEventDescription" />,
    //   flex: 1.5,
    //   headerAlign: "center",
    // },

    {
      field: "depositAmount",
      headerName: <FormattedLabel id="depositAmount" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "rentAmount",
      headerName: <FormattedLabel id="rentAmount" />,
      flex: 0.8,
      headerAlign: "center",
    },

    {
      field: "securityAmount",
      headerName: <FormattedLabel id="securityAmount" />,
      flex: 0.8,
      headerAlign: "center",
    },

    {
      field: "banerBoardCharges",
      headerName: <FormattedLabel id="banner_boardCharges" />,
      flex: 1,
      headerAlign: "center",
    },

    // {
    //   field: "eventTime",
    //   headerName: <FormattedLabel id="eventTime" />,
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "gstAmount",
      headerName: <FormattedLabel id="gstAmount" />,
      flex: 0.8,
      headerAlign: "center",
    },
    // {
    //   field: "eventTime",
    //   headerName: "Event Time",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },

    {
      field: "grandTotal",
      headerName: <FormattedLabel id="grandTotal" />,
      flex: 0.8,
      headerAlign: "center",
    },
    {
      field: "totalAmount",
      headerName: <FormattedLabel id="totalAmount" />,
      flex: 0.8,
      headerAlign: "center",
    },
    // {
    //   field: "noOfDays",
    //   headerName: <FormattedLabel id="noOfDays" />,
    //   flex: 0.8,
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
                setValue(
                  "eventDate",
                  moment(params.row._eventDate).format("YYYY-MM-DDThh:mm:ss")
                );
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

  const resetValuesExit = {
    billPrefix: "",
    fromDate: "",
    toDate: "",
    billType: "",
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

  useEffect(() => {
    getAuditorium();
    getAuditoriumEvents();
  }, []);

  useEffect(() => {
    getAuditoriumEventsCharges();
  }, [programEventDescription]);

  const getAuditoriumEventsCharges = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.PABBMURL}/trnAuditoriumEventsCharges/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        console.log("trnAuditoriumEventsCharges", r);
        let result = r.data.trnAuditoriumEventsChargesList;
        let _res = result.map((val, i) => {
          console.log("44", val);
          return {
            srNo: i + 1,
            id: val.id,
            depositAmount: val.depositAmount ? val.depositAmount : "-",
            eventTime:
              val.eventTime != null || undefined
                ? moment(val.eventTime, "hh:mm A").format("hh:mm A")
                : "-",
            grandTotal: val.grandTotal ? val.grandTotal : "-",
            gstAmount: val.gstAmount ? val.gstAmount : "-",
            auditoriumName: val.auditoriumName ? val.auditoriumName : "-",
            noOfDays: val.noOfDays ? val.noOfDays : "-",
            programEventDescription: val.programEventDescription
              ? programEventDescription.find(
                  (obj) => obj?.id == val.programEventDescription
                )?.programEventDescription
              : "-",
            rentAmount: val.rentAmount ? val.rentAmount : "-",
            securityAmount: val.securityAmount ? val.securityAmount : "-",
            totalAmount: val.totalAmount ? val.totalAmount : "-",
            status: val.activeFlag === "Y" ? "Active" : "Inactive",
            activeFlag: val.activeFlag,
            eventName: val.eventName
              ? programEventDescription.find((obj) => obj?.id == val.eventName)
                  ?.eventNameEn
              : "-",
            auditorium: val.auditoriumKey
              ? auditoriums?.find((obj) => {
                  return obj?.id == Number(val.auditoriumKey);
                })?.auditoriumNameEn
              : "-",
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
      });
  };

  const getAuditoriumEvents = () => {
    axios.get(`${urls.PABBMURL}/trnAuditoriumEvents/getAll`).then((r) => {
      console.log("respe 9", r);
      setProgramEventDescription(
        r.data.trnAuditoriumEventsList.map((row, index) => ({
          ...row,
          id: row.id,
          programEventDescription: row.programEventDescription,
          eventTime: moment(row.eventTime, "hh:mm:ss").format("hh:mm:ss"),
          eventNameEn: row.eventNameEn ? row.eventNameEn : "-",
          eventNameMr: row.eventNameMr ? row.eventNameMr : "-",
        }))
      );
    });
  };

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

  const onSubmitForm = (formData) => {
    console.log("formData", formData);
    const finalBodyForApi = {
      ...formData,
      noOfDays: formData.days,
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
      auditoriumKey: Number(formData?.auditoriumId),
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(`${urls.PABBMURL}/trnAuditoriumEventsCharges/save`, finalBodyForApi)
      .then((res) => {
        console.log("save data", res);
        if (res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getAuditoriumEventsCharges();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
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
    toDate: null,
    endTime: null,
    remark: "",
    depositAmount: "",
    rentAmount: "",
    securityAmount: "",
    gstAmount: "",
    totalAmount: "",
    grandTotal: "",
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
            .post(`${urls.PABBMURL}/trnAuditoriumEventsCharges/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getAuditoriumEventsCharges();
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
            .post(`${urls.PABBMURL}/trnAuditoriumEventsCharges/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getAuditoriumEventsCharges();
                setButtonInputState(false);
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  return (
    <div>
      <Paper style={{ marginTop: "50px" }}>
        <Box>
          <BreadcrumbComponent />
        </Box>
        <PabbmHeader labelName="auditoriumEventCharges" />
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
                    error={errors.auditoriumId}
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
                          onChange={(value) => {
                            field.onChange(value);
                            // setFilteredProgramEventDescription(
                            //   programEventDescription.map((r) => {
                            //     return Number(r.auditoriumName) === value.target.value && r;
                            //   }),
                            // );
                          }}
                          label={<FormattedLabel id="auditorium" />}
                        >
                          {auditoriums &&
                            auditoriums.map((auditorium, index) => {
                              return (
                                <MenuItem key={index} value={auditorium.id}>
                                  {auditorium.auditoriumNameEn}
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
                  lg={6}
                  xl={6}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <FormControl
                    error={errors.eventName}
                    variant="standard"
                    sx={{ width: "90%" }}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="eventNameEn" />
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
                          }}
                          label={<FormattedLabel id="eventNameEn" />}
                        >
                          {programEventDescription &&
                            programEventDescription.map((auditorium, index) => {
                              return (
                                <MenuItem
                                  sx={{
                                    display: auditorium.eventNameEn
                                      ? "flex"
                                      : "none",
                                  }}
                                  key={index}
                                  value={auditorium.id}
                                >
                                  {auditorium.eventNameEn}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      )}
                      name="eventName"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.eventName ? errors.eventName.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
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
                    error={errors.programEventDescription}
                    variant="standard"
                    sx={{ width: "90%" }}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="programEventDescription" />
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

                            setFilteredEventTimes(
                              filteredProgramEventDescription.map((r) => {
                                console.log("2323v", r, value.target.value);
                                return Number(r.id) === value.target.value && r;
                              }),
                            );
                          }}
                          label={<FormattedLabel id="programEventDescription" />}
                        >
                          {filteredProgramEventDescription &&
                            filteredProgramEventDescription.map((auditorium, index) => {
                              return (
                                <MenuItem
                                  sx={{
                                    display: auditorium.programEventDescription ? "flex" : "none",
                                  }}
                                  key={index}
                                  value={auditorium.id}
                                >
                                  {auditorium.programEventDescription}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      )}
                      name="programEventDescription"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.programEventDescription ? errors.programEventDescription.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid> */}
              </Grid>
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
                  <TextField
                    id="standard-basic"
                    label={<FormattedLabel id="depositAmount" />}
                    variant="standard"
                    sx={{ width: "90%" }}
                    InputLabelProps={{
                      shrink: true,
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
                  <TextField
                    id="standard-basic"
                    label={<FormattedLabel id="rentAmount" />}
                    variant="standard"
                    sx={{ width: "90%" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register("rentAmount")}
                    error={!!errors.rentAmount}
                    helperText={
                      errors?.rentAmount ? errors.rentAmount.message : null
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
                  lg={6}
                  xl={6}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    id="standard-basic"
                    label={<FormattedLabel id="securityAmount" />}
                    variant="standard"
                    sx={{ width: "90%" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register("securityAmount")}
                    error={!!errors.securityAmount}
                    helperText={
                      errors?.securityAmount
                        ? errors.securityAmount.message
                        : null
                    }
                  />
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
                  <TextField
                    id="standard-basic"
                    label={<FormattedLabel id="banner_boardCharges" />}
                    variant="standard"
                    sx={{ width: "90%" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register("banerBoardCharges")}
                    error={!!errors.banerBoardCharges}
                    helperText={
                      errors?.banerBoardCharges
                        ? errors.banerBoardCharges.message
                        : null
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
                  lg={6}
                  xl={6}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    id="standard-basic"
                    label={<FormattedLabel id="gstAmount" />}
                    variant="standard"
                    sx={{ width: "90%" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register("gstAmount")}
                    error={!!errors.gstAmount}
                    helperText={
                      errors?.gstAmount ? errors.gstAmount.message : null
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
                  lg={6}
                  xl={6}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TextField
                    id="standard-basic"
                    label={<FormattedLabel id="totalAmount" />}
                    variant="standard"
                    sx={{ width: "90%" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register("totalAmount")}
                    error={!!errors.totalAmount}
                    helperText={
                      errors?.totalAmount ? errors.totalAmount.message : null
                    }
                  />
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
                  <TextField
                    id="standard-basic"
                    label={<FormattedLabel id="grandTotal" />}
                    variant="standard"
                    sx={{ width: "90%" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    {...register("grandTotal")}
                    error={!!errors.grandTotal}
                    helperText={
                      errors?.grandTotal ? errors.grandTotal.message : null
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
                  }}
                >
                  <FormControl error={errors.days} variant="standard" sx={{ width: "90%" }}>
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="noOfDays" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: 220 }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label={<FormattedLabel id="noOfDays" />}
                        >
                          {filteredProgramEventDescription?.map((auditorium, index) => {
                            return (
                              <MenuItem
                                key={index}
                                value={auditorium.id}
                                sx={{
                                  display: auditorium.noOfDays != null || undefined ? "flex" : "none",
                                }}
                              >
                                {auditorium.noOfDays}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      )}
                      name="days"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>{errors?.days ? errors.days.message : null}</FormHelperText>
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
                  <FormControl error={errors.eventTime} variant="standard" sx={{ width: "90%" }}>
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="eventTime" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: 220 }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label={<FormattedLabel id="eventTime" />}
                        >
                          {filteredEventTimes?.map((auditorium, index) => {
                            return (
                              <MenuItem
                                sx={{
                                  display: auditorium.eventTime != null || undefined ? "flex" : "none",
                                }}
                                key={index}
                                value={auditorium.id}
                              >
                                {auditorium.eventTime}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      )}
                      name="eventTime"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>{errors?.eventTime ? errors.eventTime.message : null}</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid> */}
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
            </form>
          </Slide>
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
                  getAuditoriumEventsCharges(data.pageSize, _data);
                }}
                onPageSizeChange={(_data) => {
                  console.log("222", _data);
                  // updateData("page", 1);
                  getAuditoriumEventsCharges(_data, data.page);
                }}
              />
            </Box>
          </>
        )}
      </Paper>
    </div>
  );
};

export default AuditoriumEventsCharges;
