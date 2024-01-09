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
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  Box,
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
import schema from "../../../containers/schema/common/FootNoteSchema";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";

const FootNote = () => {
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
  const token = useSelector((state) => state.user.user.token);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState();
  // state for name
  // const [religions, setReligions] = useState([]);
  const [zones, setzone] = useState([]);
  const [wards, setward] = useState([]);
  const [services, setServices] = useState([]);
  const [chargeName, setchargeName] = useState([]);
  const [hawkerType, sethawkerType] = useState([]);
  const [dependsUpon, setdependsUpon] = useState([]);

  useEffect(() => {
    getZones();
    getward();
    getServices();
  }, []);

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
      });
  };
  const getZones = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((r) => {
        setzone(
          r.data.zone.map((row) => ({
            id: row.id,
            zone: row.zoneName,
          }))
          // r.data.zone,
        );
      });
  };

  const getward = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setward(
          r.data.ward.map((row) => ({
            id: row.id,
            ward: row.wardName,
          }))
        );
      });
  };

  useEffect(() => {
    getFootNote();
  }, [wards, zones, services]);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const getFootNote = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.CFCURL}/master/footNote/getAll`, {
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
      .then((res, i) => {
        let result = res.data.footNote;
        let _res = result.map((val, i) => {
          return {
            activeFlag: val.activeFlag,
            gisId: val.gisId,

            srNo: Number(_pageNo + "0") + i + 1,

            id: val.id,

            serviceId: val.serviceId,
            zoneId: val.zoneId,
            wardId: val.wardId,

            serviceNameCol: services.find((f) => f.id === val.serviceId)
              ?.serviceName,
            zoneCol: zones.find((f) => f.id == val.zoneId)?.zone,
            wardCol: wards.find((f) => f.id === val.wardId)?.ward,

            note: val.note,
            noteMr: val.noteMr,

            // zone: zones[val.zone] ? zones[val.zone].zone : "-",
            // serviceName: services[val.service] ? services[val.service].service : "-",
            // ward: wards[val.ward] ? wards[val.ward].ward : "-",

            status: val.activeFlag === "Y" ? "Active" : "InActive",
          };
        });

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });

        // setDataSource(
        //   res.data.billType.map((val, i) => {
        //     return {};
        //   })
        // );
        // setDataSource(()=>abc);
        // setTotalElements(res.data.totalElements);
        // setPageSize(res.data.pageSize);
        // setPageNo(res.data.pageNo);
      });
  };

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    // Update Form Data
    const finalBodyForApi = {
      ...fromData,
      id: fromData.id,
      // fromDate,
      // toDate,
    };

    // Save - DB
    if (btnSaveText === "Save") {
      axios
        .post(`${urls.CFCURL}/master/footNote/save`, finalBodyForApi, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            sweetAlert("Saved!", "Record Saved successfully !", "success");
            // getcast();
            getFootNote();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        });
    }

    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      axios
        .post(`${urls.CFCURL}/master/footNote/save`, finalBodyForApi, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            sweetAlert("Updated!", "Record Updated successfully !", "success");
            // getcast();
            getFootNote();
            setButtonInputState(false);
            setIsOpenCollapse(false);
          }
        });
    }
  };

  // const deleteById = (value, _activeFlag) => {
  //   let body = {
  //     activeFlag: _activeFlag,
  //     id: value,
  //   };
  //   console.log("body", body);
  //   if (_activeFlag === "N") {
  //     swal({
  //       title: "Deactivate?",
  //       text: "Are you sure you want to deactivate this Record ? ",
  //       icon: "warning",
  //       buttons: true,
  //       dangerMode: true,
  //     }).then((willDelete) => {
  //       console.log("inn", willDelete);
  //       if (willDelete === true) {
  //         axios.post(`${urls.CFCURL}/master/footNote/save`, body).then((res) => {
  //           console.log("delet res", res);
  //           if (res.status == 201) {
  //             swal("Record is Successfully Deactivated!", {
  //               icon: "success",
  //             });
  //             getFootNote();
  //             setButtonInputState(false);
  //           }
  //         });
  //       } else if (willDelete == null) {
  //         swal("Record is Safe");
  //       }
  //     });
  //   } else {
  //     swal({
  //       title: "Activate?",
  //       text: "Are you sure you want to activate this Record ? ",
  //       icon: "warning",
  //       buttons: true,
  //       dangerMode: true,
  //     }).then((willDelete) => {
  //       console.log("inn", willDelete);
  //       if (willDelete === true) {
  //         axios.post(`${urls.CFCURL}/master/footNote/save`, body).then((res) => {
  //           console.log("delet res", res);
  //           if (res.status == 201) {
  //             swal("Record is Successfully activated!", {
  //               icon: "success",
  //             });
  //             getFootNote();
  //             setButtonInputState(false);
  //           }
  //         });
  //       } else if (willDelete == null) {
  //         swal("Record is Safe");
  //       }
  //     });
  //   }
  // };

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
            .post(`${urls.CFCURL}/master/footNote/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })

            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Inactivated!", {
                  icon: "success",
                });
                getFootNote();
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
            .post(`${urls.CFCURL}/master/footNote/save`, body, {
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
                getFootNote();
                setButtonInputState(false);
              }
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
    serviceId: "",
    note: "",
    noteMr: "",
    zoneId: "",
    wardId: "",

    // fromDate: null,
    // toDate: null,

    // serviceWiseRateChartPrefix: "",
    // serviceWiseRateChartPrefixMr: "",
    // serviceName: "",
    // amount: "",
    // remark: "",
    // zone: "",
    // ward: "",
    // chargeName: "",
    // hawkerType: "",
    // remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    serviceId: "",
    note: "",
    noteMr: "",
    zoneId: "",
    wardId: "",
    // fromDate: null,
    // toDate: null,

    // serviceWiseRateChartPrefix: "",
    // serviceWiseRateChartPrefixMr: "",

    // chargeName: "",
    // remark: "",
    // amount: "",
    // hawkerType: "",
    // remark: "",
    // id: null,
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.NO",
      flex: 1,
    },

    {
      field: "zoneCol",
      headerName: "Zone",
      // type: "number",
      flex: 1,
    },

    {
      field: "wardCol",
      headerName: "Ward",
      // type: "number",
      flex: 1,
    },
    {
      field: "serviceNameCol",
      headerName: "serviceName ",
      flex: 1,
    },
    {
      field: "note",
      headerName: "Note",
      // type: "number",
      flex: 1,
    },

    {
      field: "noteMr",
      headerName: "noteMr",
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
        Foot Note
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
                          variant="standard"
                          sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.zoneId}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Zone
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                // autoFocus
                                onChange={(value) => field.onChange(value)}
                                label="Zone"
                              >
                                {zones &&
                                  zones.map((zone, index) => {
                                    return (
                                      <MenuItem key={index} value={zone.id}>
                                        {zone.zone}
                                      </MenuItem>
                                    );
                                  })}
                              </Select>
                            )}
                            name="zoneId"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.zoneId ? errors.zoneId.message : null}
                          </FormHelperText>
                        </FormControl>
                      </div>
                      <div>
                        <FormControl
                          variant="standard"
                          sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.wardId}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Ward
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="ward"
                              >
                                {wards &&
                                  wards.map((ward, index) => (
                                    <MenuItem key={index} value={ward.id}>
                                      {ward.ward}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="wardId"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.wardId ? errors.wardId.message : null}
                          </FormHelperText>
                        </FormControl>
                      </div>
                      <div>
                        <FormControl
                          variant="standard"
                          sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.serviceId}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            serviceName
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="serviceName"
                              >
                                {services &&
                                  services.map((serviceName, index) => {
                                    return (
                                      <MenuItem
                                        key={index}
                                        value={serviceName.id}
                                      >
                                        {serviceName.serviceName}
                                      </MenuItem>
                                    );
                                  })}
                              </Select>
                            )}
                            name="serviceId"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.serviceId
                              ? errors.serviceId.message
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
                          required
                          label="Note"
                          variant="standard"
                          {...register("note")}
                          error={!!errors.note}
                          helperText={errors?.note ? errors.note.message : null}
                        />
                      </div>

                      <div>
                        <TextField
                          sx={{ width: 250 }}
                          required
                          id="standard-basic"
                          label="Note Mr"
                          variant="standard"
                          {...register("noteMr")}
                          error={!!errors.noteMr}
                          helperText={
                            errors?.noteMr ? errors.noteMr.message : null
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

        <Box style={{ overflowX: "scroll", display: "flex" }}>
          <DataGrid
            sx={{
              backgroundColor: "white",
              // overflowY: "scroll",
              "& .MuiDataGrid-virtualScrollerContent": {},
              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#556CD6",
                color: "white",
              },
              "& .MuiDataGrid-cell:hover": {
                color: "primary.main",
              },
            }}
            getRowId={(row) => row.srNo}
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
              getFootNote(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              // updateData("page", 1);
              getFootNote(_data, data.page);
            }}
          />
        </Box>
      </Paper>
    </>
  );
};

export default FootNote;
