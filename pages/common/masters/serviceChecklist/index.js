import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
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
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import schema from "../../../../containers/schema/common/ServiceChecklist";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import CheckIcon from "@mui/icons-material/Check";
import { yupResolver } from "@hookform/resolvers/yup";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import { toast } from "react-toastify";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const ServiceChecklist = () => {
  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
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
  const [departmentList, setDepartmentList] = useState([]);
  const [_departmentList, _setDepartmentList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [_serviceList, _setServiceList] = useState([]);
  const [usageTypeList, setUsageTypeList] = useState([]);
  const [_usageTypeList, _setUsageTypeList] = useState([]);

  const [documentList, setDocumentList] = useState([]);
  const [_documentList, _setDocumentList] = useState([]);
  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState(0);
  // const lang = useSelector((state) => state.user.lang);
  const lang = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const [load, setLoad] = useState();
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

  const handleLoad = () => {
    setLoad(false);
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
    getDepartmentName();
    getServiceName();
    getUsageType();
    getDocumentName();
  }, []);

  const getUsageType = async () => {
    setLoad(true);
    await axios
      .get(`${urls.BaseURL}/usageType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setLoad(false);
        if (r.status == 200) {
          console.log("res usageType", r);
          let usageType = {};
          r.data.usageType.map((r) => (usageType[r.id] = r.usageType));
          _setUsageTypeList(usageType);
          setUsageTypeList(r.data.usageType);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoad(false);
        callCatchMethod(err, language);
      });
  };

  useEffect(() => {
    getServiceChecklist();
  }, [serviceList, departmentList, documentList, usageTypeList]);

  const [isDocumentMandetoryState, setIsDocumentMandetoryState] = useState();

  const handleDocumentChecked = (e) => {
    console.log("e", e);
    setIsDocumentMandetoryState(e.target.checked);
  };

  console.log("console", isDocumentMandetoryState);

  const getServiceChecklist = async (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setLoad(true);
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    await axios
      .get(`${urls.BaseURL}/serviceWiseChecklist/getAll`, {
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
        setLoad(false);

        console.log("res", res);

        let result = res.data.serviceWiseChecklist;
        let _res = result.map((val, i) => {
          return {
            activeFlag: val.activeFlag,
            // srNo: val.id,
            srNo: i + 1 + _pageNo * _pageSize,
            // documentName: val.documentName,
            // usageType: val.usageType,
            id: val.id,
            // documentChecklistEn:val.documentChecklistEn,
            // documentChecklistMr:val.documentChecklistMr,
            //  service: val.service,

            department: val.department ? val.department : "-",
            // documentChecklistEn: val.documentChecklistEn,
            service: val.service ? val.service : "-",
            serviceCol: val.service
              ? serviceList.find((f) => f.id === val.service)?.serviceName
              : "-",
            usageType: val.usageType ? val.usageType : "-",
            usageTypeCol: val.usageType
              ? usageTypeList.find((f) => f.id === val.usageType)?.usageType
              : "-",
            document: val.document ? val.document : "-",
            documentCol: val.document
              ? documentList.find((f) => f.id === val.document)
                  ?.documentChecklistEn
              : "-",
            documentType: val.documentType ? val.documentType : null,
            // documentChecklistEn: val.documentChecklistEn,
            // documentChecklistMr: val.documentChecklistMr,
            isDocumentMandetoryState:
              val.isDocumentMandetory === true ? "true" : "false",
            // service: _serviceList[val.service] ? _serviceList[val.service] : "-",
            // department: val.department,
            departmentCol: val.department
              ? departmentList.find((f) => f.id === val.department)?.department
              : "-",
            // usageType: _usageTypeList[val.usageType] ? _usageTypeList[val.usageType] : "-",

            // document: documentList[val.document] ? documentList[val.document].documentChecklistMr : "-",

            // // service:val.service ? val.service :"-",
            // department: departmentList[val.department] ? departmentList[val.department] : "-",
            // department: departmentList[val.department] && departmentList[val.department].departmentMr,

            // department: val.department ? val.department :"-",

            status: val.activeFlag === "Y" ? "Active" : "Inactive",
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
        setLoad(false);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoad(false);
        callCatchMethod(err, language);
      });
  };

  const getDepartmentName = async () => {
    await axios
      .get(`${urls.BaseURL}/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((r) => {
        setDepartmentList(r?.data?.department);

        // if (r.status == 200) {
        console.log("res department", r);
        // let department = {};
        // r.data.department.map((r) => (department[r.id] = r.departmentName));
        // _setDepartmentList(department);
        setDepartmentList(r.data.department);
        // }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getServiceName = async () => {
    setLoad(true);
    await axios
      .get(`${urls.BaseURL}/service/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((r) => {
        setLoad(false);

        if (r.status == 200) {
          let services = {};
          r.data.service.map((r) => (services[r.id] = r.serviceName));
          _setServiceList(services);
          // setServices(r.data.service);
          setServiceList(r.data.service);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoad(false);
        callCatchMethod(err, language);
      });
  };

  const getDocumentName = async () => {
    setLoad(true);

    await axios
      .get(`${urls.BaseURL}/documentMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((r) => {
        setLoad(false);

        if (r.status == 200) {
          console.log("res documentMaster", r);
          let documents = {};
          r.data.documentMaster.map(
            (r) => (documents[r.id] = r.documentChecklistMr)
          );
          // _setDocumentList(documents);
          setDocumentList(r.data.documentMaster);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoad(false);
        callCatchMethod(err, language);
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
            .post(`${urls.BaseURL}/serviceWiseChecklist/save`, body, {
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
                getServiceChecklist();
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
            .post(`${urls.BaseURL}/serviceWiseChecklist/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Activated!", {
                  icon: "success",
                });
                getServiceChecklist();
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
    // departmentName: "",
    // serviceName: "",
    documentChecklist: "",
    service: "",
    department: "",
    documentChecklistMr: "",
    usageType: "",
    document: "",
    isDocumentMandetoryState: "",

    // usageType:""
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

  // const onSubmitForm = (formData) => {
  //   console.log("formData", formData);
  //   const finalBodyForApi = {
  //     // ...formData,
  // department: formData.department,
  // document: formData.document,
  // documentChecklist: formData.documentChecklist,
  // documentChecklistMr: formData.documentChecklistMr,
  // isDocumentMandetory: formData.isDocumentMandetoryState,
  // service: formData.service,
  // usageType: formData.usageType,
  //     // activeFlag: btnSaveText === "Update" ? null : null,
  //   };

  //   //   // console.log("finalBodyForApi", finalBodyForApi);

  //   //   axios
  //   //     .post(
  //   //       `${urls.BaseURL}/serviceWiseChecklist/save`,
  //   //       finalBodyForApi
  //   //     )
  //   //     .then((res) => {
  //   //       console.log("save data", res);
  //   //       if (res.status == 200) {
  //   //         formData.id
  //   //           ? sweetAlert("Updated!", "Record Updated successfully !", "success")
  //   //           : sweetAlert("Saved!", "Record Saved successfully !", "success");
  //   //         getServiceChecklist();
  //   //         setButtonInputState(false);
  //   //         setIsOpenCollapse(false);
  //   //         setEditButtonInputState(false);
  //   //         setDeleteButtonState(false);
  //   //       }
  //   //     });
  //   // };

  //   // Save - DB
  //   if (btnSaveText === "Save") {
  //     console.log("Post -----");
  //     axios.post(`${urls.BaseURL}/serviceWiseChecklist/save`, finalBodyForApi).then((res) => {
  //       console.log("save res", res);
  //       if (res.status == 200) {
  //         sweetAlert("Saved!", "Record Saved successfully !", "success");
  //         getServiceChecklist();
  //         setButtonInputState(false);
  //         setEditButtonInputState(false);
  //         setDeleteButtonState(false);
  //         setIsOpenCollapse(false);
  //       }
  //     });
  //   }
  //   // Update Data Based On ID
  //   else if (btnSaveText === "Update") {
  //     console.log("Put -----");
  //     axios.post(`${urls.BaseURL}/serviceWiseChecklist/save`, finalBodyForApi).then((res) => {
  //       if (res.status == 200) {
  //         sweetAlert("Updated!", "Record Updated successfully !", "success");
  //         // getServiceChecklist();
  //         // setButtonInputState(false);
  //         // setIsOpenCollapse(false);
  //         getServiceChecklist();
  //         setButtonInputState(false);
  //         setEditButtonInputState(false);
  //         setDeleteButtonState(false);
  //         setIsOpenCollapse(false);
  //       }
  //     });
  //   }
  // };

  const onSubmitForm = (formData) => {
    // Update Form Data
    console.log("formData", formData);
    const finalBodyForApi = {
      ...formData,
      document: Number(formData.document),
      department: Number(formData.department),
      service: Number(formData.service),
      usageType: Number(formData.usageType),
      isDocumentMandetory: formData.isDocumentMandetoryState,
      // documentChecklist: null,
      // documentChecklistMr: null,
      // id: formData.id,
      // department: formData.department,
      // document: formData.document,
      // documentChecklist: formData.documentChecklist,
      // documentChecklistMr: formData.documentChecklistMr,
      // isDocumentMandetory: formData.isDocumentMandetoryState,
      // service: formData.service,
      // usageType: formData.usageType,
      // activeFlag: btnSaveText === "Update" ? null : null,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(
        `${urls.CFCURL}/master/serviceWiseChecklist/save`,
        finalBodyForApi,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          if (res.data?.errors?.length > 0) {
            res.data?.errors?.map((x) => {
              toast(x.code, {
                type: "error",
              });
            });
          } else {
            id
              ? sweetAlert(
                  "Updated!",
                  "Record Updated successfully !",
                  "success"
                )
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            getServiceChecklist();
            setButtonInputState(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
          }
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const resetValuesExit = {
    // documentChecklist: "",
    service: "",
    department: "",
    // documentChecklistMr: "",
    usageType: "",
    document: "",
    isDocumentMandetoryState: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.4,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "departmentCol",
      headerName: <FormattedLabel id="departmentName" />,
      // type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "serviceCol",
      headerName: <FormattedLabel id="service" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "usageTypeCol",
      headerName: <FormattedLabel id="usageType" />,
      // type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "documentCol",
      headerName: <FormattedLabel id="documentName" />,
      // type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "isDocumentMandetoryState",
      headerName: <FormattedLabel id="isDocumentMandetory" />,
      flex: 0.6,
      align: "center",
      headerAlign: "center",
    },

    // {
    //   field: "documentChecklistEn",
    //   headerName: <FormattedLabel id="documentChecklistEn" />,
    //   // type: "number",
    //   width: 120,
    //   align: "center",
    //   headerAlign: "center",
    // },
    // {
    //   field: "documentChecklistMr",
    //   headerName: <FormattedLabel id="documentChecklistMr" />,
    //   // type: "number",
    //   width: 120,
    //   align: "center",
    //   headerAlign: "center",
    // },

    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      // type: "number",
      flex: 0.6,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      sortable: false,
      flex: 0.6,
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
          borderRadius: 100,
        }}
      >
        <FormattedLabel id="serviceChecklist" />
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={load}
        onClick={handleLoad}
      >
        Loading....
        <CircularProgress color="inherit" />
      </Backdrop>
      <Paper>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <Grid container style={{ padding: "10px" }}>
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={4}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <FormControl
                    size="small"
                    sx={{ width: "90%" }}
                    error={!!errors.department}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="departmentName" />
                    </InputLabel>

                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label={<FormattedLabel id="departmentName" />}
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                          style={{ backgroundColor: "white" }}
                        >
                          {departmentList.length > 0
                            ? departmentList.map((dept, index) => {
                                return (
                                  <MenuItem key={index} value={dept.id}>
                                    {/* {lang === "en" ? dept.department : dept.departmentMr} */}
                                    {dept.department}
                                  </MenuItem>
                                );
                              })
                            : "NA"}
                        </Select>
                      )}
                      name="department"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.department ? errors.department.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={4}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <FormControl
                    size="small"
                    sx={{ width: "90%" }}
                    error={!!errors.service}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="serviceName" />
                    </InputLabel>

                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label={<FormattedLabel id="serviceName" />}
                          value={field.value}
                          // onChange={(value) => field.onChange(value)}
                          onChange={(value) => {
                            field.onChange(value);
                            // handleRoleNameChange(value);
                          }}
                          style={{ backgroundColor: "white" }}
                        >
                          {serviceList.length > 0
                            ? serviceList.map((service, index) => {
                                return (
                                  <MenuItem key={index} value={service.id}>
                                    {service.serviceName}
                                  </MenuItem>
                                );
                              })
                            : "NA"}
                        </Select>
                      )}
                      name="service"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.service ? errors.service.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={4}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <FormControl
                    size="small"
                    sx={{ width: "90%" }}
                    error={!!errors.usageType}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="usageType_documentType" />
                    </InputLabel>

                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label={<FormattedLabel id="usageType_documentType" />}
                          value={field.value}
                          // onChange={(value) => field.onChange(value)}
                          onChange={(value) => {
                            field.onChange(value);
                            // handleRoleNameChange(value);
                          }}
                          style={{ backgroundColor: "white" }}
                        >
                          {usageTypeList.length > 0
                            ? usageTypeList.map((usageType, index) => {
                                return (
                                  <MenuItem key={index} value={usageType.id}>
                                    {usageType.usageType}
                                  </MenuItem>
                                );
                              })
                            : "NA"}
                        </Select>
                      )}
                      name="usageType"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.usageType ? errors.usageType.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container style={{ padding: "10px" }}>
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={4}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <FormControl
                    size="small"
                    sx={{ width: "90%" }}
                    error={!!errors.document}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="documentName" />
                    </InputLabel>

                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label={<FormattedLabel id="documentName" />}
                          value={field.value}
                          // onChange={(value) => field.onChange(value)}
                          onChange={(value) => {
                            field.onChange(value);
                            // handleRoleNameChange(value);
                          }}
                          style={{ backgroundColor: "white" }}
                        >
                          {documentList.length > 0
                            ? documentList.map((document, index) => {
                                console.log("dosc", document);
                                return (
                                  <MenuItem key={index} value={document.id}>
                                    {/* {document.documentChecklistEn} */}

                                    {lang === "en"
                                      ? document.documentChecklistEn
                                      : document.documentChecklistMr}
                                  </MenuItem>
                                );
                              })
                            : "NA"}
                        </Select>
                      )}
                      name="document"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {errors?.document ? errors.document.message : null}
                    </FormHelperText>
                  </FormControl>
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
                    size="small"
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="documentChecklist" />}
                    variant="outlined"
                    {...register("documentChecklist")}
                    error={!!errors.documentChecklist}
                    helperText={
                      errors?.documentChecklist
                        ? errors.documentChecklist.message
                        : null
                    }
                  />
                </Grid> */}

                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={4}
                  lg={4}
                  xl={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <FormControlLabel
                    control={<Checkbox checked={isDocumentMandetoryState} />}
                    {...register("isDocumentMandetoryState")}
                    onChange={handleDocumentChecked}
                    label={<FormattedLabel id="isDocumentMandetory" />}
                  />
                </Grid>
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
                    size="small"
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="documentChecklistMr" />}
                    variant="outlined"
                    {...register("documentChecklistMr")}
                    error={!!errors.documentChecklistMr}
                    helperText={
                      errors?.documentChecklistMr
                        ? errors.documentChecklistMr.message
                        : null
                    }
                  />
                </Grid> */}

              <Grid container style={{ padding: "10px" }}>
                <Grid
                  item
                  xs={4}
                  style={{
                    display: "flex",
                    justifyContent: "end",
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
              <Divider />
            </form>
          </Slide>
        )}

        <Grid
          container
          style={{ padding: "10px", display: "flex", justifyContent: "end" }}
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

        {/* <Box style={{ height: "auto", overflow: "auto" }}>
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
              getServiceChecklist(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getServiceChecklist(_data, data.page);
            }}
          />
        </Box> */}

        <Box style={{ overflowX: "scroll", display: "flex" }}>
          <DataGrid
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={(row) => row.srNo}
            components={{ Toolbar: GridToolbar }}
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
              getServiceChecklist(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              // updateData("page", 1);
              getServiceChecklist(_data, data.page);
            }}
          />
        </Box>

        {/* <DataGrid
            autoHeight
            sx={{
              margin: 5,
            }}
            rows={dataSource}
            columns={columns}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => {
              getBillType(newPageSize);
              setPageSize(newPageSize);
            }}
            onPageChange={(e) => {
              console.log("event", e);
              setPageNo(e);
              setTotalElements(res.data.totalElements);
              console.log("dataSource->", dataSource);
            }}
            rowsPerPageOptions={[10, 20, 50, 100]}
            pagination
            rowCount={totalElements}
          /> */}
      </Paper>
    </>
  );
};

export default ServiceChecklist;
