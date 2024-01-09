import {
  Box,
  Button,
  Divider,
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
  Tooltip,
} from "@mui/material";
import sweetAlert from "sweetalert";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import schema from "../../../containers/schema/common/ApplicationStatusSchema";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import styles from "../../../styles/applicationStatus.module.css";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import CheckIcon from "@mui/icons-material/Check";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
// import { useDemoData } from '@mui/x-data-grid-generator';
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import urls from "../../../URLS/urls";
import BasicLayout from "../../../containers/Layout/BasicLayout";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../../util/util";

const ApplicationStatus = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();
  const token = useSelector((state) => state.user.user.token);
  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState(0);
  const [services, setServices] = useState([]);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
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
    getServices();
  }, []);
  useEffect(() => {
    getApplicationStatus();
  }, [services]);

  const getServices = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((res) => {
        console.log("service res", res);
        setServices(res.data.service);
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getApplicationStatus = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.CFCURL}/master/applicationStatus/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: "id",
          sortDir: "desc",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("resss", res);
        let result = res.data.applicationStatus;
        let _res = result.map((val, i) => {
          return {
            activeFlag: val.activeFlag,
            srNo: i + 1 + _pageNo * _pageSize,
            // serviceStatusEng: val.serviceStatus ? val.serviceStatus : "-",
            serviceStatus: val.serviceStatus ? val.serviceStatus : "-",
            // serviceStatusMr: val.serviceStatusMr,
            id: val.id,
            service: val.service ? val.service : "-",
            serviceColName: services.find((f) => f.id === val.service)
              ?.serviceName
              ? services.find((f) => f.id === val.service)?.serviceName
              : "-",
            // serviceColName: services[val.service] ? services[val.service].serviceName : val.service,
            status: val.activeFlag === "Y" ? "Active" : "Inactive",
            //   documentChecklistEn: val.documentChecklistEn
            //     ? val.documentChecklistEn
            //     : "-",
            //   documentChecklistMr: val.documentChecklistMr
            //     ? val.documentChecklistMr
            //     : "-",
            //   typeOfDocumentEn: val.typeOfDocumentEn ? val.typeOfDocumentEn : "-",
            //   typeOfDocumentMr: val.typeOfDocumentMr ? val.typeOfDocumentMr : "-",
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
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const deleteById = (value, _activeFlag) => {
    console.log("value, _activeFlag", value, _activeFlag);
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
            .post(`${urls.CFCURL}/master/applicationStatus/save`, body, {
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
                getApplicationStatus();
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
            .post(`${urls.CFCURL}/master/applicationStatus/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("act res", res);
              if (res.status == 200) {
                swal("Record is Successfully activated!", {
                  icon: "success",
                });
                getApplicationStatus();
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

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    serviceStatus: "",
    // serviceStatusMr: "",
    service: "",
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
      service: Number(formData.service),
      // activeFlag: btnSaveText === "Update" ? formData.activeFlag :null ,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(`${urls.CFCURL}/master/applicationStatus/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("save data", res);
        if (res.status == 200) {
          if (res?.data?.errors?.length > 0) {
            res?.data?.errors?.map((x) => {
              if (x.field == "serviceStatus") {
                setError("serviceStatus", {
                  message: x.code,
                });
              }
            });
          } else {
            formData.id
              ? sweetAlert(
                  "Updated!",
                  "Record Updated successfully !",
                  "success"
                )
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            getApplicationStatus();
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
  };

  const resetValuesExit = {
    serviceStatus: "",
    // serviceStatusMr: "",
    service: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.4,
      align: "center",
      headerAlign: "center",
      maxWidth: 100,
    },
    {
      field: "serviceColName",
      headerName: <FormattedLabel id="service" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "serviceStatus",
      headerName: <FormattedLabel id="serviceStatus" />,
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      // type: "number",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "actions",
      headerAlign: "center",
      headerName: "Actions",
      flex: 0.4,
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

  return (
    <>
      <Paper style={{ margin: "50px" }}>
        <div
          style={{
            // backgroundColor: "#0084ff",
            backgroundColor: "#757ce8",
            color: "white",
            fontSize: 19,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px",
            borderRadius: 100,
          }}
        >
          <FormattedLabel id="applicationStatus" />
        </div>
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
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ width: "90%" }}
                    error={!!errors.service}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="serviceName" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="Service Name"
                        >
                          {services &&
                            services.map((service, index) => {
                              return (
                                <MenuItem key={index} value={service.id}>
                                  {service.serviceName}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      )}
                      name="service"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.service ? errors.service.message : null}
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
                    alignItems: "center",
                  }}
                >
                  <TextField
                    sx={{ width: "90%" }}
                    id="standard-basic"
                    label={<FormattedLabel id="serviceStatus" />}
                    variant="outlined"
                    size="small"
                    {...register("serviceStatus")}
                    error={!!errors.serviceStatus}
                    helperText={
                      errors?.serviceStatus
                        ? errors.serviceStatus.message
                        : null
                    }
                  />
                </Grid>
                {/* <Grid
                    item
                    xs={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      id="standard-basic"
                      label="Document checklist(In English)*"
                      variant="outlined"
                      size="small"
                      {...register("documentChecklistEn")}
                      error={!!errors.documentChecklistEn}
                      helperText={
                        errors?.documentChecklistEn
                          ? errors.documentChecklistEn.message
                          : null
                      }
                    />
                  </Grid> */}
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
                    type="submit"
                    variant="contained"
                    color="success"
                    size="small"
                    endIcon={<SaveIcon />}
                  >
                    <FormattedLabel id={btnSaveText} />
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
                    variant="contained"
                    color="primary"
                    size="small"
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
                    variant="contained"
                    color="error"
                    size="small"
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
              getApplicationStatus(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getApplicationStatus(_data, data.page);
            }}
          />
        </Box>
      </Paper>
    </>
  );
};

export default ApplicationStatus;
