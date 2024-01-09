import React, { useEffect, useState } from "react";
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
  Grid,
  Paper,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { Controller, FormProvider, useForm } from "react-hook-form";
import urls from "../../../URLS/urls";
import styles from "../../../styles/[calender].module.css";
import schema from "../../../containers/schema/common/Calender";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import sweetAlert from "sweetalert";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import BasicLayout from "../../../containers/Layout/BasicLayout";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../../util/util";
// func
const Calender = () => {
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
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
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

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getCalendarDetails();
  }, []);
  // Get Data By ID
  const getDataById = (value) => {
    setIsOpenCollapse(false);
    setID(value);
    axios
      .get(`${urls.CFCURL}/master/calendarMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        reset(res.data);
        setButtonInputState(true);
        setIsOpenCollapse(true);
        setBtnSaveText("Update");
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // Get Table - Data
  const getCalendarDetails = () => {
    console.log("getLIC ----");
    axios
      .get(`${urls.CFCURL}/master/calendarMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDataSource(
          res.data.calendar.map((r, i) => ({
            id: r.id,
            srNo: i + 1,

            // toDate: moment(r.toDate, 'YYYY-MM-DD').format('YYYY-MM-DD'),
            // fromDate: moment(r.fromDate, 'YYYY-MM-DD').format('YYYY-MM-DD'),
            nameOfYear: r.nameOfYear,
            duration: r.duration,
            calenderPrefix: r.calenderPrefix,
            activeFlag: r.activeFlag,
            remark: r.remark,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // Delete By ID
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
          .delete(`${urls.CFCURL}/master/calendarMaster/save/${value}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            if (res.status == 226) {
              getCalendarDetails();
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              setButtonInputState(false);
              //getcast();
            }
          })
          ?.catch((err) => {
            console.log("err", err);
            callCatchMethod(err, language);
          });
      } else {
        swal("Record is Safe");
      }
    });
  };

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    // Update Form Data
    const finalBodyForApi = {
      ...fromData,
      Duration: fromData.duration,
      NameOfYear: fromData.nameOfYear,
    };

    console.log("232", fromData, finalBodyForApi);

    // Save - DB
    // if (btnSaveText === 'Save') {
    //   console.log('Post -----')
    //   axios
    //     .post(
    //       `${urls.CFCURL}/master/calendarMaster/save`,
    //       finalBodyForApi
    //     )
    //     .then((res) => {
    //       if (res.status == 200) {
    //         sweetAlert('Saved!', 'Record Saved successfully !', 'success')
    //         getCalendarDetails()
    //         setButtonInputState(false)
    //         setEditButtonInputState(false)
    //         setDeleteButtonState(false)
    //         setIsOpenCollapse(false)
    //       }
    //     })
    // }
    // // Update Data Based On ID
    // else if (btnSaveText === 'Update') {
    //   console.log('Put -----')
    //   axios
    //     .put(
    //       `${urls.CFCURL}/master/calendarMaster/editCalendar/?id=${id}`,
    //       finalBodyForApi
    //     )
    //     .then((res) => {
    //       if (res.status == 200) {
    //         sweetAlert('Updated!', 'Record Updated successfully !', 'success')
    //         getCalendarDetails()
    //         setButtonInputState(false)
    //         setIsOpenCollapse(false)
    //       }
    //     })
    // }

    axios
      .post(`${urls.CFCURL}/master/calendarMaster/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          fromData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getCalendarDetails();
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

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setIsOpenCollapse(false);
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
    // fromDate: null,
    // toDate: null,
    nameOfYear: "",

    duration: "",
    calenderPrefix: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    // fromDate: null,
    // toDate: null,
    nameOfYear: "",

    duration: "",
    calenderPrefix: "",
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      flex: 1,
    },
    {
      field: "nameOfYear",
      headerName: "Name Of Year",
      flex: 1,
    },
    // { field: 'fromDate', headerName: 'From Date' },
    // {
    //   field: 'toDate',
    //   headerName: 'To Date',
    //   //type: "number",
    //   flex: 1,
    // },

    {
      field: "calenderPrefix",
      headerName: "Calender Prefix",
      flex: 1,
    },

    {
      field: "duration",
      headerName: "duration",
      flex: 1,
    },
    {
      field: "remark",
      headerName: "remark",
      flex: 1,
    },
    // {
    //   field: 'actions',
    //   headerName: 'Actions',
    //   width: 120,
    //   sortable: false,
    //   disableColumnMenu: true,
    //   renderCell: (params) => {
    //     return (
    //       <Box
    //         sx={{
    //           backgroundColor: 'whitesmoke',
    //           width: '100%',
    //           height: '100%',
    //           display: 'flex',
    //           justifyContent: 'center',
    //           alignItems: 'center',
    //         }}
    //       >
    //         <IconButton onClick={() => getDataById(params.id)}>
    //           <EditIcon />
    //         </IconButton>
    //         <IconButton onClick={() => deleteById(params.id)}>
    //           <DeleteIcon />
    //         </IconButton>
    //       </Box>
    //     )
    //   },
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
      <>
        <BreadcrumbComponent />
      </>
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
        Calender
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
          <div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Grid
                  container
                  spacing={2}
                  sx={{ marginLeft: "10vh", marginTop: "2vh" }}
                >
                  <Grid item xs={4}>
                    <div>
                      <TextField
                        id="standard-basic"
                        label="Name Of Year*"
                        variant="standard"
                        {...register("nameOfYear")}
                        error={!!errors.nameOfYear}
                        helperText={
                          errors?.nameOfYear ? errors.nameOfYear.message : null
                        }
                      />
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    <div>
                      <TextField
                        id="standard-basic"
                        label="Calender Prefix*"
                        variant="standard"
                        {...register("calenderPrefix")}
                        error={!!errors.calenderPrefix}
                        helperText={
                          errors?.calenderPrefix
                            ? errors.calenderPrefix.message
                            : null
                        }
                      />
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    <div>
                      <TextField
                        id="standard-basic"
                        label="duration*"
                        variant="standard"
                        {...register("duration")}
                        error={!!errors.duration}
                        helperText={
                          errors?.duration ? errors.duration.message : null
                        }
                      />
                    </div>
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={2}
                  sx={{ marginLeft: "10vh", marginTop: "2vh" }}
                >
                  <Grid item xs={6}>
                    <div>
                      <TextField
                        id="standard-basic"
                        label="remark*"
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

                <div className={styles.btn}>
                  <Button
                    sx={{ marginRight: 8 }}
                    type="submit"
                    variant="contained"
                    color="success"
                    endIcon={<SaveIcon />}
                  >
                    {btnSaveText}
                  </Button>{" "}
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
              setBtnSaveText("Save");
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

export default Calender;

// export default index
