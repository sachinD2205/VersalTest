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
  Paper,
  Select,
  MenuItem,
  Slide,
  TextField,
  Tooltip,
  Grid,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../containers/Layout/BasicLayout";
import urls from "../../../URLS/urls";
import styles from "../../../styles/[businessSubType].module.css";
import schema from "../../../containers/schema/common/businessSubType";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import Transliteration from "../../../components/common/linguosol/transliteration";
import { catchExceptionHandlingMethod } from "../../../util/util";

const BusinessSubType = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {},
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    getValues,
    formState: { errors },
  } = methods;

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [businessTypes, setBusinessTypes] = useState([]);
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
    getBusinessTypes();
  }, []);

  useEffect(() => {
    getBusinesSubType();
  }, [businessTypes]);

  const getBusinessTypes = () => {
    axios
      .get(`${urls.CFCURL}/master/businessType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((r) => {
        if (r.status == 200) {
          console.log("res department", r);
          setBusinessTypes(r.data.businessType);
        }
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
  const getBusinesSubType = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    axios
      .get(`${urls.CFCURL}/master/businessSubType/getAll`, {
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
        let result = res.data.businessSubType;
        let _res = result.map((r, i) => {
          console.log("44");
          return {
            id: r.id,
            srNo: i + 1,
            businessSubTypePrefix: r.businessSubTypePrefix,
            // toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            // fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            toDate: r.toDate,
            fromDate: r.fromDate,
            // businessType:r. businessType,
            activeFlag: r.activeFlag,
            // businessSubType: r.businessSubType,
            // businessType:
            //   businessTypes[r.businessType] &&
            //  businessTypes[r.businessType].businessType,
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
            businessType: businessTypes?.find(
              (obj) => obj?.id === r.businessType
            )?.businessType,

            businessTypeId: r.businessTypeId,
            businessSubType: r.businessSubType,
            businessSubTypeMr: r.businessSubTypeMr,
            remark: r.remark,
          };
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

  const editRecord = (rows) => {
    setBtnSaveText("Update"),
      setID(rows.id),
      setIsOpenCollapse(true),
      setSlideChecked(true);
    reset(rows);
  };

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
      // businessTypeId: formData.businessTypeId,
    };
    if (btnSaveText === "Save") {
      axios
        .post(`${urls.CFCURL}/master/businessSubType/save`, finalBodyForApi, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            if (res.data?.errors?.length > 0) {
              res.data?.errors?.map((x) => {
                if (x.field == "businessSubType") {
                  setError("businessSubType", { message: x.code });
                } else if (x.field == "businessSubTypeMr") {
                  setError("businessSubTypeMr", { message: x.code });
                }
              });
            } else {
              sweetAlert("Saved!", "Record Saved successfully !", "success");
              getBusinesSubType();
              // getBusinessTypes();
              setButtonInputState(false);
              setIsOpenCollapse(false);
              setEditButtonInputState(false);
              setDeleteButtonState(false);
            }
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    } else if (btnSaveText === "Update") {
      axios
        .post(`${urls.CFCURL}/master/businessSubType/save`, finalBodyForApi, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            sweetAlert("Updated!", "Record Updated successfully !", "success");
            getBusinesSubType();
            // getBusinessTypes();
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
  };

  // const onSubmitForm = (formData) => {
  //   console.log("formData", formData);
  //   const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
  //   const toDate = moment(formData.toDate).format("YYYY-MM-DD");
  //   const finalBodyForApi = {
  //     ...formData,
  //     fromDate,
  //     toDate,
  //     // activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
  //   };

  //   console.log("finalBodyForApi", finalBodyForApi);
  //   // const data = {
  //   //     "fromDate": "2022-11-23T16:00:00",
  //   //     "toDate":"2022-11-23T16:00:00",
  //   //     "billPrefix":"Test",
  //   //     "billType":"Tust"
  //   // };

  //   axios
  //     .post(
  //       `${urls.CFCURL}/master/businessSubType/save`,
  //       finalBodyForApi
  //     )
  //     .then((res) => {
  //       console.log("save data", res);
  //       if (res.status == 200) {
  //         formData.id
  //           ? sweetAlert("Updated!", "Record Updated successfully !", "success")
  //           : sweetAlert("Saved!", "Record Saved successfully !", "success");
  //           getBusinesSubType();
  //         setButtonInputState(false);
  //         setIsOpenCollapse(false);
  //         setEditButtonInputState(false);
  //         setDeleteButtonState(false);
  //       }
  //     });
  // };

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
  //         .delete(
  //           `${urls.CFCURL}/master/businessSubType/save/${value}`
  //         )
  //         .then((res) => {
  //           if (res.status == 226) {
  //             swal("Record is Successfully Deleted!", {
  //               icon: "success",
  //             });
  //             setButtonInputState(false);
  //             //getcast();
  //           }
  //         });
  //     } else {
  //       swal("Record is Safe");
  //     }
  //   });
  // };
  // Delet Button

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
            .post(`${urls.CFCURL}/master/businessSubType/save`, body, {
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
                getBusinesSubType();
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
            .post(`${urls.CFCURL}/master/businessSubType/save`, body, {
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
                getBusinesSubType();
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
    businessType: "",
    businessSubType: "",
    businessSubTypeMr: "",
    businessSubTypePrefix: "",
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    businessType: "",
    businessSubType: "",
    businessSubTypeMr: "",
    businessSubTypePrefix: "",
    remark: "",
    id: null,
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
    },

    { field: "fromDate", headerName: <FormattedLabel id="fromDate" /> },
    {
      field: "toDate",
      headerName: <FormattedLabel id="toDate" />,
      //type: "number",
      flex: 1,
    },
    // {
    //   field: "businessType",
    //   headerName: "Business Type",
    //   // type: "number",
    //   flex: 1,
    // },
    {
      field: "businessSubType",
      headerName: <FormattedLabel id="businessSubType" />,
      // type: "number",
      flex: 1,
    },
    {
      field: "businessSubTypePrefix",
      headerName: <FormattedLabel id="businessSubTypePrefix" />,
      flex: 2,
    },
    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      //type: "number",
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
      <div>
        <BreadcrumbComponent />
      </div>
      <div
        style={{
          // backgroundColor: "#0084ff",
          backgroundColor: "#757ce8",
          color: "white",
          fontSize: 19,
          padding: "10px",
          borderRadius: 100,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FormattedLabel id="businessSubTypeMaster" />
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
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={3}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl error={!!errors.fromDate} required>
                        <Controller
                          control={control}
                          name="fromDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel id="fromDate" />
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    error={!!errors.fromDate}
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{
                                      style: {
                                        fontSize: 12,
                                      },
                                    }}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.fromDate ? errors.fromDate.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl error={!!errors.toDate} required>
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
                                    <FormattedLabel id="toDate" />
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
                                    error={!!errors.toDate}
                                    InputLabelProps={{
                                      style: {
                                        fontSize: 12,
                                      },
                                    }}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.toDate ? errors.toDate.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {" "}
                      <FormControl
                        variant="outlined"
                        size="small"
                        fullWidth
                        error={!!errors.businessType}
                      >
                        <InputLabel id="demo-simple-select-outlined-label">
                          <FormattedLabel id="businessType" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: "90%" }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="businessType" />}
                            >
                              {businessTypes &&
                                businessTypes.map((b, index) => {
                                  return (
                                    <MenuItem key={index} value={b.id}>
                                      {language === "en"
                                        ? b.businessType
                                        : b.businessTypeMr}
                                    </MenuItem>
                                  );
                                })}
                            </Select>
                          )}
                          name="businessTypeId"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.businessType
                            ? errors.businessType.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      sx={{
                        display: "flex",
                        // justifyContent: "center",
                      }}
                    >
                      <Box sx={{ width: "90%" }}>
                        <Transliteration
                          variant={"outlined"}
                          _key={"businessSubType"}
                          labelName={"businessSubType"}
                          fieldName={"businessSubType"}
                          updateFieldName={"businessSubTypeMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={
                            <FormattedLabel id="businessSubType" required />
                          }
                          error={!!errors.businessSubType}
                          helperText={
                            errors?.businessSubType
                              ? errors.businessSubType.message
                              : null
                          }
                        />
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={3}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <Box sx={{ width: "90%" }}>
                        <Transliteration
                          variant={"outlined"}
                          _key={"businessSubTypeMr"}
                          labelName={"businessSubTypeMr"}
                          fieldName={"businessSubTypeMr"}
                          updateFieldName={"businessSubType"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          label={
                            <FormattedLabel id="businessSubTypeMr" required />
                          }
                          error={!!errors.businessSubTypeMr}
                          helperText={
                            errors?.businessSubTypeMr
                              ? errors.businessSubTypeMr.message
                              : null
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <TextField
                        autoFocus
                        sx={{ width: "90%" }}
                        id="outlined-basic"
                        size="small"
                        label={<FormattedLabel id="businessSubTypePrefix" />}
                        variant="outlined"
                        {...register("businessSubTypePrefix")}
                        error={!!errors.businessSubTypePrefix}
                        helperText={
                          errors?.businessSubTypePrefix
                            ? errors.businessSubTypePrefix.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <TextField
                        sx={{ width: "90%" }}
                        id="outlined-basic"
                        size="small"
                        label={<FormattedLabel id="remark" />}
                        variant="outlined"
                        {...register("remark")}
                        error={!!errors.remark}
                        helperText={
                          errors?.remark ? errors.remark.message : null
                        }
                      />
                    </Grid>
                  </Grid>
                  <div className={styles.small}>
                    <div className={styles.btn}>
                      <Button
                        sx={{ marginRight: 8 }}
                        type="submit"
                        variant="contained"
                        color="success"
                        endIcon={<SaveIcon />}
                        size="small"
                      >
                        {btnSaveText}
                      </Button>{" "}
                      <Button
                        sx={{ marginRight: 8 }}
                        variant="contained"
                        color="primary"
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                        size="small"
                      >
                        <FormattedLabel id="clear" />
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitButton()}
                        size="small"
                      >
                        <FormattedLabel id="exit" />
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
            <FormattedLabel id="add" />
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
            // loading={data.loading}
            rowCount={data.totalRows}
            rowsPerPageOptions={data.rowsPerPageOptions}
            page={data.page}
            pageSize={data.pageSize}
            rows={data.rows}
            columns={columns}
            onPageChange={(_data) => {
              getBusinesSubType(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getBusinesSubType(_data, data.page);
            }}
          />
        </Box>
      </Paper>
    </>
  );
};

export default BusinessSubType;
