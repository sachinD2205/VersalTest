import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../util/util";

import * as yup from "yup";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  Paper,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../containers/Layout/BasicLayout";
import urls from "../../../URLS/urls";
import styles from "../../../styles/view.module.css";
import sweetAlert from "sweetalert";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment/moment";
import { useSelector } from "react-redux";

const Index = () => {
  let schema = yup.object().shape({});

  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [runAgain, setRunAgain] = useState(false);
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

  useEffect(() => {
    setRunAgain(false);
    getGender();
  }, [runAgain]);

  // Get Table - Data
  const getGender = () => {
    axios
      .get(`${urls.CFCURL}/master/gender/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(` ----- ${res.data}`);
        setDataSource(
          res.data.gender.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            //   Current Password: moment(r.Current Password, "YYYY-MM-DD").format("YYYY-MM-DD"),
            //   Username: moment(r.Username, "YYYY-MM-DD").format("YYYY-MM-DD"),
            //   genderPrefix: r.genderPrefix,
            gender: r.gender,

            remark: r.remark,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const editRecord = (rows) => {
    console.log("Edit cha data:", rows);
    setBtnSaveText("Update"),
      setID(rows.id),
      setIsOpenCollapse(true),
      setSlideChecked(true);
    reset(rows);
  };

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    const finalBodyForApi = {
      ...formData,
    };

    axios
      .post(`${urls.CFCURL}/master/gender/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getGender();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // Delete By ID
  // const deleteById = (value) => {
  //   swal({
  //     title: "Delete?",
  //     text: "Are you sure you want to delete this Record ? ",
  //     icon: "warning",
  //     buttons: true,
  //     dangerMode: true,
  //   }).then((willDelete) => {
  //     axios.delete(`${urls.CFCURL}/master/gender/save/${value}`).then((res) => {
  //       if (res.status == 226) {
  //         if (willDelete) {
  //           swal("Record is Successfully Deleted!", {
  //             icon: "success",
  //           });
  //         } else {
  //           swal("Record is Safe");
  //         }
  //         setButtonInputState(false);
  //         setRunAgain(true);
  //       }
  //     });
  //   });
  // };
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Deactivate?",
        text: "Are you sure you want to deactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.CFCURL}/master/department/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deactivated!", {
                  icon: "success",
                });
                getDepartment();
                // getZone();
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
            .post(`${urls.CFCURL}/master/department/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully activated!", {
                  icon: "success",
                });
                getDepartment();
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
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    remark: "",

    id: null,
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.NO",
      flex: 1,
    },

    {
      field: "Username",
      headerName: "User Name",
    },

    {
      field: "CurrentPassword",
      headerName: "Current Password",
      //type: "number",
      flex: 1,
    },

    {
      field: "NewPassword",
      headerName: "New Password",
      // type: "number",
      flex: 1,
    },

    {
      field: "ConfirmPassword",
      headerName: "Confirm Password",
      // type: "number",
      flex: 1,
    },

    {
      field: "remark",
      headerName: "Remarks",
      // type: "number",
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

  // View
  return (
    <>
      <div
        style={{
          // backgroundColor: "#0084ff",
          backgroundColor: "#757ce8",
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
        Change Reset Forget Password
        {/* <FormattedLabel id='aadharAuthentication' /> */}
      </div>
      <Paper
        sx={{
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5,
          marginBottom: 5,
          padding: 1,
        }}
      >
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <FormControl
                        style={{ marginTop: 10 }}
                        error={!!errors.Username}
                      >
                        <div>
                          <TextField
                            id="standard-basic"
                            label="UserName"
                            variant="standard"
                            {...register("UserName")}
                            error={!!errors.UserName}
                            helperText={
                              errors?.UserName ? errors.UserName.message : null
                            }
                          />
                        </div>

                        <FormHelperText>
                          {errors?.Username ? errors.Username.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                      <FormControl
                        style={{ marginTop: 10 }}
                        error={!!errors.newPassword}
                      >
                        <Box
                          style={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Typography sx={{ color: "#000" }}>
                            New Password
                          </Typography>
                          <TextField
                            variant="outlined"
                            // required
                            // label={name}
                            error={false}
                            fullWidth
                            size="small"
                            sx={{
                              backgroundColor: "#FFFFFF",
                              borderRadius: "5px",
                            }}
                            InputProps={{
                              style: { fontSize: "15px" },
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    //   onClick={handleClickShowNewPassword}
                                  >
                                    {/* {showNewPassword ? (
                                        <VisibilityIcon />
                                      ) : (
                                        <VisibilityOffIcon />
                                      )} */}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            //   type={showNewPassword ? "" : "password"}
                            //   onChange={(e) => setUser(e.target.value)}
                            {...register("newPassword")}
                            helperText={errors.newPassword?.message}
                          />
                        </Box>
                        {/* 
                        <FormHelperText>
                          {errors?.CurrentPassword ? errors.CurrentPassword.message : null}
                        </FormHelperText> */}
                      </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                      <FormControl
                        style={{ marginTop: 10 }}
                        error={!!errors.CurrentPassword}
                      >
                        <Box
                          style={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Typography sx={{ color: "#000" }}>
                            Current Password
                          </Typography>
                          <TextField
                            variant="outlined"
                            // required
                            // label={name}
                            error={false}
                            fullWidth
                            size="small"
                            sx={{
                              backgroundColor: "#FFFFFF",
                              borderRadius: "5px",
                            }}
                            InputProps={{
                              style: { fontSize: "15px" },
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    //   onClick={handleClickShowNewPassword}
                                  >
                                    {/* {showNewPassword ? (
                                        <VisibilityIcon />
                                      ) : (
                                        <VisibilityOffIcon />
                                      )} */}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            //   type={showNewPassword ? "" : "password"}
                            //   onChange={(e) => setUser(e.target.value)}
                            {...register("CurrentPassword")}
                            helperText={errors.CurrentPassword?.message}
                          />
                        </Box>

                        {/* <FormHelperText>
                          {errors?.CurrentPassword ? errors.CurrentPassword.message : null}
                        </FormHelperText> */}
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <FormControl
                        style={{ marginTop: 10 }}
                        error={!!errors.ConfirmPassword}
                      >
                        <Box
                          style={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Typography sx={{ color: "#000" }}>
                            Confirm Password
                          </Typography>
                          <TextField
                            variant="outlined"
                            // required
                            // label={name}
                            error={false}
                            fullWidth
                            size="small"
                            sx={{
                              backgroundColor: "#FFFFFF",
                              borderRadius: "5px",
                            }}
                            InputProps={{
                              style: { fontSize: "15px" },
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    //   onClick={handleClickShowNewPassword}
                                  >
                                    {/* {showNewPassword ? (
                                        <VisibilityIcon />
                                      ) : (
                                        <VisibilityOffIcon />
                                      )} */}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            //   type={showNewPassword ? "" : "password"}
                            //   onChange={(e) => setUser(e.target.value)}
                            {...register("ConfirmPassword")}
                            helperText={errors.ConfirmPassword?.message}
                          />
                        </Box>

                        {/* <FormHelperText>
                          {errors?.ConfirmPassword ? errors.ConfirmPassword.message : null}
                        </FormHelperText> */}
                      </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                      <div>
                        <TextField
                          id="standard-basic"
                          label="Remarks"
                          variant="standard"
                          {...register("remark")}
                          error={!!errors.remark}
                          helperText={
                            errors?.remark ? errors.remark.message : null
                          }
                        />
                      </div>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} style={{ marginTop: "10px" }}>
                    <Grid item xs={4}>
                      <Button
                        sx={{ marginRight: 8 }}
                        type="submit"
                        variant="contained"
                        color="success"
                        endIcon={<SaveIcon />}
                      >
                        {btnSaveText}
                      </Button>{" "}
                    </Grid>

                    <Grid item xs={4}>
                      <Button
                        sx={{ marginRight: 8 }}
                        variant="contained"
                        color="primary"
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                      >
                        Clear
                      </Button>
                    </Grid>

                    <Grid item xs={4}>
                      <Button
                        variant="contained"
                        color="error"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitButton()}
                      >
                        Exit
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </FormProvider>
            </div>
          </Slide>
        )}
        <div>
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
            Add{" "}
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
