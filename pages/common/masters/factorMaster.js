import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import BasicLayout from "../../../containers/Layout/BasicLayout";
import urls from "../../../URLS/urls";
import styles from "../../../styles/[castMaster].module.css";
import schema from "../../../containers/schema/common/factorMasterSchema";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../../util/util";

const FactorMaster = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
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
  const lang = useSelector((state) => state.user.lang);
  const token = useSelector((state) => state.user.user.token);
  // state for name
  const [application, setApplication] = useState([]);
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
    getApplication();
  }, []);

  const getApplication = () => {
    axios
      .get(`${urls.CFCURL}/master/application/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((r) => {
        setApplication(
          // r.data.map((row) => ({
          //   id: row.id,
          //   // applicationId: row.applicationNameEng,
          //   applicationNameEng: row.applicationNameEng,
          // })),
          r.data.application
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // Get Table - Data
  const getcast = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    axios
      .get(`${urls.CFCURL}/master/factorMaster/getAll`, {
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
      .then((res) => {
        let result = res.data.factor;
        let _res = result.map((r, i) => {
          console.log("44");
          return {
            id: r.id,
            srNo: i + 1,
            factorPrefix: r.factorPrefix,
            // factorPrefixMr:r.factorPrefixMr,
            factorName: r.factorName,
            factorNameMr: r.factorNameMr,
            toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            application: r.application,
            // applicationId: application?.find((obj) => obj?.id == r.applicationId)?.applicationNameEng,
            applicationId: r.applicationId,
            applicationNameEng: application?.find(
              (obj) => obj?.id == r.applicationId
            )?.applicationNameEng,
            // applicationId: application[r.applicationId] && application[r.applicationId].applicationId,
            // cast: r.cast,
            remark: r.remark,
            activeFlag: r.activeFlag,
            status: res.activeFlag === "Y" ? "Active" : "InActive",
          };
          // setLoading(false);
        });
        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getcast();
  }, [application]);

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    // const fromDate = new Date(fromData.fromDate).toISOString();
    const fromDate = moment(fromData.fromDate, "YYYY-MM-DD").format(
      "YYYY-MM-DD"
    );
    const toDate = moment(fromData.toDate, "YYYY-MM-DD").format("YYYY-MM-DD");
    // Update Form Data
    const finalBodyForApi = {
      ...fromData,
      fromDate,
      toDate,
    };

    // Save - DB
    if (btnSaveText === "Save") {
      axios
        .post(`${urls.CFCURL}/master/factorMaster/save`, finalBodyForApi, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        .then((res) => {
          if (res.status == 200) {
            sweetAlert("Saved!", "Record Saved successfully !", "success");
            getcast();
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
    }

    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      axios
        .post(`${urls.CFCURL}/master/factorMaster/save`, finalBodyForApi, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            sweetAlert("Updated!", "Record Updated successfully !", "success");
            getcast();
            setButtonInputState(false);
            setIsOpenCollapse(false);
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    }
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
  //     if (willDelete) {
  //       axios
  //         .delete(`${urls.CFCURL}/master/factorMaster/save/${value}`)
  //         .then((res) => {
  //           if (res.status == 226) {
  //             swal("Record is Successfully Deleted!", {
  //               icon: "success",
  //             });
  //             setButtonInputState(false);
  //             getcast();
  //           }
  //         });
  //     } else {
  //       swal("Record is Safe");
  //     }
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
            .post(`${urls.CFCURL}/master/factorMaster/save`, body, {
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

                getcast();
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
            .post(`${urls.CFCURL}/master/factorMaster/save`, body, {
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
                getcast();
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
    fromDate: null,
    toDate: null,
    applicationId: "",
    factorName: "",
    factorNameMr: "",
    factorPrefix: "",
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    applicationId: "",
    factorName: "",
    factorNameMr: "",
    factorPrefix: "",
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

    { field: "fromDate", headerName: "FromDate" },
    {
      field: "toDate",
      headerName: "To Date",
      //type: "number",
      flex: 1,
    },
    {
      field: "factorName",
      headerName: "Factor Name",
      // type: "number",
      flex: 1,
    },
    {
      field: "factorNameMr",
      headerName: "Factor Name (In Marathi)",
      // type: "number",
      flex: 1,
    },
    {
      field: "factorPrefix",
      headerName: "factor Prefix ",
      flex: 1,
    },
    {
      field: "applicationNameEng",
      headerName: " application",
      // type: "number",
      flex: 1,
    },

    // {
    //   field: "remark",
    //   headerName: "Remark",
    //   //type: "number",
    //   flex: 1,
    // },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            {params.row.activeFlag == "Y" ? (
              <IconButton
                //   disabled={editButtonInputState && params.row.activeFlag === "N" ? false : true}
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
                <Tooltip title="Edit">
                  <EditIcon style={{ color: "#556CD6" }} />
                </Tooltip>
              </IconButton>
            ) : (
              <Tooltip sx={{ margin: "8px" }}>
                <EditIcon style={{ color: "gray" }} disabled={true} />
              </Tooltip>
            )}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setSlideChecked(true);
                setButtonInputState(true);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.row.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.row.id, "Y")}
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
        Factor Master
        {/* <FormattedLabel id='aadharAuthentication' /> */}
      </div>
      <Paper
        sx={{ marginLeft: 5, marginRight: 5, marginTop: 5, marginBottom: 5 }}
      >
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <div className={styles.small}>
                    <div className={styles.row}>
                      <div>
                        <FormControl
                          style={{ marginTop: 10 }}
                          // error={!!errors.fromDate}
                          required
                        >
                          <Controller
                            control={control}
                            autoFocus
                            name="fromDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      From Date{" "}
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(date) => field.onChange(date)}
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
                          {/* <FormHelperText>
                              {errors?.fromDate
                                ? errors.fromDate.message
                                : null}
                            </FormHelperText> */}
                        </FormControl>
                      </div>
                      <div>
                        <FormControl
                          style={{ marginTop: 10 }}
                          // error={!!errors.toDate}
                          required
                        >
                          <Controller
                            control={control}
                            name="toDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      To Date
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(date) => field.onChange(date)}
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
                          {/* <FormHelperText>
                              {errors?.toDate ? errors.toDate.message : null}
                            </FormHelperText> */}
                        </FormControl>
                      </div>
                      <div>
                        <FormControl
                          variant="standard"
                          sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.religion}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Application On
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="application"
                              >
                                {application &&
                                  application.map((appId, index) => (
                                    <MenuItem key={index} value={appId.id}>
                                      {appId.applicationNameEng}
                                      {/* {lang === "en"
                                        ? applicationId.applicationId
                                        : applicationId.applicationNameEng} */}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="applicationId"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.applicationId
                              ? errors.applicationId.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </div>
                    </div>
                    <div className={styles.row}>
                      <div>
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="factor Name*"
                          variant="standard"
                          {...register("factorName")}
                          error={!!errors.factorName}
                          helperText={
                            errors?.factorName
                              ? errors.factorName.message
                              : null
                          }
                        />
                      </div>
                      <div>
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="factor Name (In marathi)*"
                          variant="standard"
                          {...register("factorNameMr")}
                          error={!!errors.factorNameMr}
                          helperText={
                            errors?.factorNameMr
                              ? errors.factorNameMr.message
                              : null
                          }
                        />
                      </div>
                      <div>
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="factor prefix *"
                          variant="standard"
                          {...register("factorPrefix")}
                          error={!!errors.factorPrefix}
                          helperText={
                            errors?.factorPrefix
                              ? errors.factorPrefix.message
                              : null
                          }
                        />
                      </div>

                      {/* <div>
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="Remark"
                          variant="standard"
                          {...register("remark")}
                          error={!!errors.remark}
                          helperText={errors?.remark ? errors.remark.message : null}
                        />
                      </div> */}
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
            Add{" "}
          </Button>
        </div>
        {/* <DataGrid
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
        /> */}

        <Box style={{ height: "auto", overflow: "auto" }}>
          <DataGrid
            sx={{
              // fontSize: 16,
              // fontFamily: 'Montserrat',
              // font: 'center',
              // backgroundColor:'yellow',
              // // height:'auto',
              // border: 2,
              // borderColor: "primary.light",
              overflowY: "scroll",

              "& .MuiDataGrid-virtualScrollerContent": {
                // backgroundColor:'red',
                // height: '800px !important',
                // display: "flex",
                // flexDirection: "column-reverse",
                // overflow:'auto !important'
              },
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
            loading={data.loading}
            rowCount={data.totalRows}
            rowsPerPageOptions={data.rowsPerPageOptions}
            page={data.page}
            pageSize={data.pageSize}
            rows={data.rows}
            columns={columns}
            onPageChange={(_data) => {
              getcast(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getcast(_data, data.page);
            }}
          />
        </Box>
      </Paper>
    </>
  );
};

export default FactorMaster;
