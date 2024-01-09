import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
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
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import router from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../containers/schema/common/zoneWardAreaMappingMasterSchema";
import styles from "../../../styles/cfc/cfc.module.css";
import { toast } from "react-toastify";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { catchExceptionHandlingMethod } from "../../../util/util";

const Index = () => {
  // import from use Form

  const {
    register,
    handleSubmit,
    control,
    // @ts-ignore
    methods,
    setError,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });

  let DataBharaychaKiNahi = false; //Used to decide page type (edit/viewable/new)
  // let id = router.query.id;

  const language = useSelector((state) => state?.labels?.language);
  const token = useSelector((state) => state.user.user.token);

  let isDisabled = false;
  let isAcknowledgement = false;
  const [runAgain, setRunAgain] = useState(false);
  const [fieldValues, setFieldValues] = useState({});
  const [collapse, setCollapse] = useState(false);
  const [applicationList, setApplicationList] = useState([]);
  const [_applicationList, _setApplicationList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [_departmentList, _setDepartmentList] = useState([]);
  const [zoneList, setZoneList] = useState([]);
  const [_zoneList, _setZoneList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [_wardList, _setWardList] = useState([]);

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  // const [loading, setLoading] = useState(false);
  const [id, setID] = useState();
  const [areaList, setareaList] = useState([]);
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
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  let isSave = true;

  useEffect(() => {
    getZone();
    getWard();
    setRunAgain(false);
    getApplicationName();

    getDepartments();
    getarea();
  }, []);

  useEffect(() => {
    getZoneAndWard();
  }, [departmentList, zoneList, areaList]);

  const getDepartments = () => {
    setOpen(true);
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          setDepartmentList(r.data.department);
          let departments = {};
          r.data.department.map((r) => (departments[r.id] = r.department));
          console.log("depts", departments);
          _setDepartmentList(departments);

          setOpen(false);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setOpen(false);
        callCatchMethod(err, language);
      });
  };

  const exitButton = () => {
    setSelectedWard("");
    setSelectedZone("");
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

  const getarea = () => {
    axios
      .get(`${urls.CFCURL}/master/area/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          console.log("res office location", r.data.area);
          setareaList(r.data.area);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getApplicationName = () => {
    setOpen(true);
    axios
      .get(`${urls.CFCURL}/master/application/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        // if (r.status == 200) {
        //   console.log("res Application", r);
        //   let applications = {};
        //   r.data.map((r) => (applications[r.id] = r.applicationNameEng));
        //   _setApplicationList(applications);
        //   setApplicationList(r.data.application);
        //   setOpen(false);
        // }
        _setApplicationList(r.data.applications);
        setApplicationList(r.data.application);
      })
      ?.catch((err) => {
        console.log("err", err);
        setOpen(false);
        callCatchMethod(err, language);
      });
  };

  const getZoneAndWard = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setOpen(true);
    axios
      .get(`${urls.CFCURL}/master/zoneWardAreaMapping/getAll`, {
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
        console.log("res mst", res.data.zoneWardAreaMapping, _wardList);
        if (res.status == 200) {
          setOpen(false);
          let result = res.data.zoneWardAreaMapping;
          let _res = result.map((val, i) => {
            return {
              activeFlag: val.activeFlag,
              srNo: i + 1 + _pageNo * _pageSize,
              // applicationNameEng: _applicationList[val.application]
              //   ? _applicationList[val.application]
              //   : "-",
              area: val.area,
              areaCol: areaList.find((f) => f.id == val.area)?.areaName,
              departmentName: _departmentList[val.deptId]
                ? _departmentList[val.deptId]
                : "-",
              id: val.id,

              // zoneName: _zoneList[val.zone] ? _zoneList[val.zone] : "-",
              // wardName: _wardList[val.ward] ? _wardList[val.ward] : "-",

              zoneName: zoneList?.find((f) => f.id == val.zone)?.zoneName,
              wardName: _wardList?.find((f) => f.wardId == val.ward)?.wardName,

              department: val.deptId,
              deptId: val.deptId,
              departmentCol: departmentList.find((f) => f.id == val.department)
                ?.department,
              wardNumber: val.ward,
              zoneNumber: val.zone,
              status: val.activeFlag === "Y" ? "Active" : "Inactive",
              application: val.application,
              applicationCol: applicationList.find(
                (f) => f.id == val.application
              )?.applicationNameEng,
            };
          });
          setData({
            rows: _res,
            totalRows: res.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res.data.pageSize,
            page: res.data.pageNo,
          });
          setDataSource(res?.data);
          setOpen(false);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setOpen(false);
        callCatchMethod(err, language);
      });
  };

  const getZone = () => {
    setOpen(true);
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          setZoneList(res.data.zone);
          console.log("res getZone", res);
          // let result = res.data.zone;
          let zones = {};
          res.data.zone.map((r) => (zones[r.id] = r.zoneName));
          console.log("zones", zones);
          _setZoneList(zones);
          setOpen(false);
        }
      })
      ?.catch((err) => {
        setOpen(false);
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getWard = () => {
    setOpen(true);
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          setWardList(res.data.ward);
          console.log("res getWard", res);
          let wards = {};
          res.data.ward.map((r) => (wards[r.id] = r.wardName));
          console.log("wards", wards);
          const customizedArray = res?.data?.ward?.map((item) => {
            const { id: wardId, ...rest } = item;
            return { wardId, ...rest };
          });
          _setWardList(customizedArray);
          setOpen(false);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setOpen(false);
        callCatchMethod(err, language);
      });
  };

  const getWardsByZoneId = (zoneId) => {
    setOpen(true);
    axios
      .get(
        `${urls.CFCURL}/master/zoneWardAreaMapping/getWardByZoneAndModuleId?zoneId=${zoneId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          console.log("res", res);
          _setWardList(res?.data);
          setOpen(false);
        } else {
          setOpen(false);
        }
      })
      .catch((error) => {
        console.log("err", err);
        setOpen(false);
      });
  };

  if (router.query.pageMode === "view") {
    DataBharaychaKiNahi = true;
    isDisabled = true;
    isAcknowledgement = true;
    isSave = false;
  }

  if (router.query.pageMode === "edit") {
    DataBharaychaKiNahi = true;
  }

  const onSubmit = async (data) => {
    console.log("Form Data ", data);
    setOpen(true);

    const bodyForAPI = {
      ...data,
      activeFlag: btnSaveText === "Update" ? data?.activeFlag : null,
      id: btnSaveText === "Update" ? data?.id : null,
      zone: Number(data?.zoneNumber),
      ward: Number(data?.wardNumber),
      deptId: Number(data?.department),
      area: Number(data?.area),
    };

    let body = data.area.map((areaObj, index) => {
      return {
        wardNumber: data?.wardNumber,
        zoneNumber: data?.zoneNumber,
        area: areaObj?.id,
        departmentName: data?.departmentName,
        zoneNameStr: data?.zoneNameStr,
        wardNameStr: data?.wardNameStr,
        application: data?.application,
        activeFlag: btnSaveText === "Update" ? data?.activeFlag : null,
        zone: Number(data?.zoneNumber),
        ward: Number(data?.wardNumber),
        deptId: Number(data?.department),
        id: index === 0 ? (btnSaveText === "Update" ? data.id : null) : null,
        // id: btnSaveText === "Update" ? data.id : null,
        // area: Number(data?.area),
      };
    });

    console.log("bodyForAPI", bodyForAPI, "body", body);

    await axios
      .post(`${urls.CFCURL}/master/zoneWardAreaMapping/save`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("save data", response);
        if (response.status == 200) {
          if (response.data?.errors?.length > 0) {
            response.data?.errors?.map((x) => {
              toast(x?.code, {
                type: "error",
              });
              setOpen(false);
            });
          } else {
            data.id
              ? sweetAlert(
                  "Updated!",
                  "Record Updated successfully !",
                  "success"
                )
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            getWard();
            getZoneAndWard();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setOpen(false);
          }
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // const onSubmit = (formData) => {
  //   alert("hi");
  //   console.log("formData", formData);
  //   // const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
  //   // const toDate = moment(formData.toDate).format("YYYY-MM-DD");
  //   const finalBodyForApi = {
  //     ...formData,
  //     // fromDate,
  //     // toDate,
  //   };

  //   console.log("finalBodyForApi", finalBodyForApi);

  //   axios.post(`${urls.CFCURL}/master/zoneWardAreaMapping/save`, finalBodyForApi).then((res) => {
  //     console.log("save data", res);
  //     if (res.status == 200) {
  //       formData.id
  //         ? sweetAlert("Updated!", "Record Updated successfully !", "success")
  //         : sweetAlert("Saved!", "Record Saved successfully !", "success");
  //       getZoneAndWard();
  //       setButtonInputState(false);
  //       setIsOpenCollapse(false);
  //       setEditButtonInputState(false);
  //       setDeleteButtonState(false);
  //     }
  //   });
  // };

  // const deleteById = (value, _activeFlag) => {
  //   setOpen(true);
  //   let body = {
  //     activeFlag: _activeFlag,
  //     id: value,
  //   };
  //   console.log("body", body);
  //   if (_activeFlag === "N") {
  //     swal({
  //       title: "Inactivate?",
  //       text: "Are you sure you want to inactivate this Record ? ",
  //       icon: "warning",
  //       buttons: true,
  //       dangerMode: true,
  //     }).then((willDelete) => {
  //       console.log("inn", willDelete);
  //       if (willDelete === true) {
  //         axios.post(`${urls.CFCURL}/master/zoneAndWardLevelMapping/save`, body).then((res) => {
  //           console.log("delet res", res);
  //           if (res.status == 200) {
  //             setOpen(false);
  //             swal("Record is Successfully Deactivated!", {
  //               icon: "success",
  //             });
  //             getZoneAndWard();
  //             setButtonInputState(false);
  //           }
  //         });
  //       } else if (willDelete == null) {
  //         swal("Record is Safe");
  //         setOpen(false);
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
  //         axios.post(`${urls.CFCURL}/master/zoneAndWardLevelMapping/save`, body).then((res) => {
  //           console.log("delet res", res);
  //           if (res.status == 200) {
  //             setOpen(false);
  //             swal("Record is Successfully Activated!", {
  //               icon: "success",
  //             });
  //             getZoneAndWard();
  //             setButtonInputState(false);
  //           }
  //         });
  //       } else if (willDelete == null) {
  //         swal("Record is Safe");
  //         setOpen(false);
  //       }
  //     });
  //   }
  // };

  // const deleteById = (value, _activeFlag) => {
  //   let body = {
  //     activeFlag: _activeFlag,
  //     id: value,
  //   };
  //   console.log("body", body);
  //   if (_activeFlag === "N") {
  //     swal({
  //       title: "Inactivate?",
  //       text: "Are you sure you want to inactivate this Record ? ",
  //       icon: "warning",
  //       buttons: true,
  //       dangerMode: true,
  //     }).then((willDelete) => {
  //       console.log("inn", willDelete);
  //       if (willDelete === true) {
  //         axios
  //           .post(`${urls.CFCURL}/master/zoneWardAreaMapping/save`, body)

  //           .then((res) => {
  //             console.log("delet res", res);
  //             if (res.status == 200) {
  //               swal("Record is Successfully Inactivated!", {
  //                 icon: "success",
  //               });
  //               getZoneAndWard();
  //               setButtonInputState(false);
  //             }
  //           });
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
  //         axios.post(`${urls.CFCURL}/master/zoneAndWardLevelMapping/save`, body).then((res) => {
  //           console.log("delet res", res);
  //           if (res.status == 200) {
  //             swal("Record is Successfully activated!", {
  //               icon: "success",
  //             });
  //             getZoneAndWard();
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
    let body = [
      {
        activeFlag: _activeFlag,
        id: value,
      },
    ];
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
            .post(`${urls.CFCURL}/master/zoneWardAreaMapping/save`, body, {
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
                getZoneAndWard();
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
            .post(`${urls.CFCURL}/master/zoneWardAreaMapping/save`, body, {
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
                getZoneAndWard();
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
  const resetValuesExit = {
    departmentName: null,
    area: null,
    zoneNumber: null,
    wardNumber: null,
    zoneNameStr: null,
    wardNameStr: null,
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.4,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: "applicationCol",
    //   headerName: <FormattedLabel id="applicationName" />,
    //   flex: 1,
    //   headerAlign: "center",
    // },
    {
      field: "departmentName",
      headerName: <FormattedLabel id="departmentName" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "areaCol",
      headerName: <FormattedLabel id="areaName" />,
      flex: 1,
      headerAlign: "center",
    },
    // {
    //   field: "zoneNumber",
    //   headerName: <FormattedLabel id="zoneNumber" />,
    //   width: 100,
    //   //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "zoneName",
      headerName: <FormattedLabel id="zoneName" />,
      //   width: 160,
      flex: 1,
      headerAlign: "center",
    },
    // {
    //   field: "wardNumber",
    //   headerName: <FormattedLabel id="wardNumber" />,
    //   width: 100,
    //   //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "wardName",
      headerName: <FormattedLabel id="wardName" />,
      //   width: 160,
      flex: 1,
      headerAlign: "center",
    },
    // {
    //   field: "status",
    //   headerName: <FormattedLabel id="status" />,
    //   //   width: 160,
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "actions",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="actions" />,
      flex: 0.6,
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
                  console.log("params.row", params.row);
                  getWardsByZoneId(params?.row?.zoneNumber);
                  setBtnSaveText("Update"),
                    setID(params.row.id),
                    setIsOpenCollapse(true),
                    setSlideChecked(true);
                  setButtonInputState(true);

                  reset(params.row);
                  setValue("area", [
                    areaList.find((area) => area.id === params.row.area),
                  ]);

                  setSelectedZone(params?.row?.zoneNumber);
                  setSelectedWard(params?.row?.wardNumber);
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
                // setIsOpenCollapse(true),
                // // console.log('params.row: ', params.row)
                // reset(params.row)
                // setLoiGeneration(params.row.loiGeneration)
                // setScrutinyProcess(params.row.scrutinyProcess)
                // setImmediateAtCounter(params.row.immediateAtCounter)
                // setRtsSelection(params.row.rtsSelection)
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

  const temp = (e) => {
    console.log("File name baherna: ", e.target.files[0]);
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    departmentName: null,
    area: null,
    zoneNumber: "",
    wardNumber: "",
  };

  const editById = (values) => {
    console.log("Kasla data edit hotoy: ", values);
    reset({ ...values });
    setCollapse(true);
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  // const onBack = () => {
  // const urlLength = router.asPath.split("/").length;
  // const urlArray = router.asPath.split("/");
  // let backUrl = "";
  // if (urlLength > 2) {
  //   for (let i = 0; i < urlLength - 1; i++) {
  //     backUrl += urlArray[i] + "/";
  //   }
  //   console.log("Final URL: ", backUrl);
  //   router.push(`${backUrl}`);
  // } else {
  //   router.push("/dashboard");
  // }
  // };

  const onBack = () => {
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

  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      <Box style={{ display: "flex" }}>
        <Box className={styles.tableHead} sx={{ display: "flex" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{
              mr: 2,
              paddingLeft: "30px",
              color: "white",
            }}
            onClick={() => exitBack()}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box className={styles.h1Tag} sx={{ paddingLeft: "34%" }}>
            <FormattedLabel id="zoneWardAreaMapping" />
          </Box>
        </Box>
        <Box>
          <Button
            className={styles.adbtn}
            variant="contained"
            disabled={buttonInputState}
            onClick={() => {
              setSelectedWard("");
              setSelectedZone("");
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
            <AddIcon size="70" />
          </Button>
        </Box>
      </Box>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        Loading....
        <CircularProgress color="inherit" />
      </Backdrop>

      <Paper style={{ paddingTop: isOpenCollapse ? "20px" : "0px" }}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {isOpenCollapse && (
              <Slide
                direction="down"
                in={slideChecked}
                mountOnEnter
                unmountOnExit
              >
                <Paper
                  sx={{
                    backgroundColor: "#F5F5F5",
                  }}
                  elevation={5}
                >
                  <div className={styles.fields}>
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
                          alignItems: "center",
                        }}
                      >
                        <FormControl size="small" sx={{ width: "90%" }}>
                          <InputLabel id="demo-simple-select-standard-label">
                            Department Name
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label={<FormattedLabel id="departmentName" />}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                style={{ backgroundColor: "white" }}
                              >
                                {departmentList.length > 0
                                  ? departmentList.map((department, index) => {
                                      return (
                                        <MenuItem
                                          key={index}
                                          value={department.id}
                                        >
                                          {department.department}
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
                            {errors?.department
                              ? errors.department.message
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
                        lg={6}
                        xl={6}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl size="small" sx={{ width: "90%" }}>
                          <InputLabel
                            id="demo-simple-select-outlined-label"
                            shrink={watch("zoneNumber") ? true : false}
                          >
                            <FormattedLabel id="zoneNumber" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                error={errors?.zoneNumber ? true : false}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                // label="Zone Number"
                                label={<FormattedLabel id="zoneNumber" />}
                                value={field.value || ""}
                                onChange={(value) => {
                                  field.onChange(value),
                                    setSelectedZone(value.target.value);
                                  getWardsByZoneId(value.target.value);
                                }}
                                style={{ backgroundColor: "white" }}
                              >
                                {zoneList.length > 0
                                  ? zoneList.map((zone, index) => {
                                      return (
                                        <MenuItem key={index} value={zone.id}>
                                          {zone.zoneNo}
                                        </MenuItem>
                                      );
                                    })
                                  : "NA"}
                              </Select>
                            )}
                            name="zoneNumber"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText style={{ color: "red" }}>
                            {errors?.zoneNumber
                              ? errors.zoneNumber.message
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
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{
                            width: "90%",
                            backgroundColor: "white",
                          }}
                          id="outlined-basic"
                          label={<FormattedLabel id="zoneName" />}
                          size="small"
                          variant="outlined"
                          value={
                            zoneList?.find((r) => {
                              return r.id === selectedZone;
                            })?.zoneName
                          }
                          disabled={true}
                          InputLabelProps={{
                            shrink: zoneList?.find((r) => {
                              return r.id === selectedZone;
                            })?.zoneName
                              ? true
                              : false,
                          }}
                          {...register("zoneNameStr")}
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
                          alignItems: "center",
                        }}
                      >
                        <FormControl size="small" sx={{ width: "90%" }}>
                          <InputLabel
                            id="demo-simple-select-outlined-label"
                            shrink={watch("wardNumber") ? true : false}
                          >
                            <FormattedLabel id="wardNumber" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                error={errors?.wardNumber ? true : false}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                // label="Ward Number"
                                label={<FormattedLabel id="wardNumber" />}
                                value={field.value || ""}
                                onChange={(value) => {
                                  field.onChange(value),
                                    setSelectedWard(value.target.value);
                                }}
                                style={{ backgroundColor: "white" }}
                              >
                                {/* {wardList.length > 0
                                  ? wardList.map((ward, index) => { */}
                                {_wardList.length > 0
                                  ? _wardList.map((ward, index) => {
                                      return (
                                        <MenuItem
                                          key={index}
                                          value={ward.wardId}
                                        >
                                          {ward.wardName}
                                        </MenuItem>
                                      );
                                    })
                                  : "NA"}
                              </Select>
                            )}
                            name="wardNumber"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText style={{ color: "red" }}>
                            {errors?.wardNumber
                              ? errors.wardNumber.message
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
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{
                            width: "90%",
                            backgroundColor: "white",
                          }}
                          id="outlined-basic"
                          label={<FormattedLabel id="wardName" />}
                          {...register("wardNameStr")}
                          InputLabelProps={{
                            shrink: wardList?.find((r) => {
                              return r.id === selectedWard;
                            })?.wardName
                              ? true
                              : false,
                          }}
                          size="small"
                          variant="outlined"
                          value={
                            wardList?.find((r) => {
                              return r.id === selectedWard;
                            })?.wardName
                          }
                          disabled={true}
                        />
                      </Grid>
                    </Grid>
                    <Grid container sx={{ padding: "10px" }}>
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
                          alignItems: "center",
                        }}
                      > */}
                      {/* <FormControl size="small" sx={{ width: "90%" }}>
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="applicationName" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label={<FormattedLabel id="applicationName" />}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                style={{ backgroundColor: "white" }}
                              >
                                {applicationList.length > 0
                                  ? applicationList.map((department, index) => {
                                      return (
                                        <MenuItem
                                          key={index}
                                          value={department.id}
                                        >
                                          {department.applicationNameEng}
                                        </MenuItem>
                                      );
                                    })
                                  : "NA"}
                              </Select>
                            )}
                            name="application"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText style={{ color: "red" }}>
                            {errors?.application
                              ? errors.application.message
                              : null}
                          </FormHelperText>
                        </FormControl> */}
                      {/* <FormControl size="small" sx={{ m: 1, width: "50%" }}>
                            <InputLabel id="demo-simple-select-standard-label">Department Name</InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  label={<FormattedLabel id="departmentName" />}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  style={{ backgroundColor: "white" }}
                                >
                                  {departmentList.length > 0
                                    ? departmentList.map((department, index) => {
                                        return (
                                          <MenuItem key={index} value={department.id}>
                                            {department.department}
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
                          </FormControl> */}
                      {/* <FormControl size="small" sx={{ m: 1, width: "50%" }}>
                            <InputLabel id="demo-simple-select-standard-label">
                              application Name
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  label={
                                    <FormattedLabel id="applicationNameEng" />
                                  }
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  style={{ backgroundColor: "white" }}
                                >
                                  {applicationList.length > 0
                                    ? applicationList.map(
                                        (application, index) => {
                                          return (
                                            <MenuItem
                                              key={index}
                                              value={application.id}
                                            >
                                              {application.applicationNameEng}
                                            </MenuItem>
                                          );
                                        }
                                      )
                                    : "NA"}
                                </Select>
                              )}
                              name="applicationNameEng"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText style={{ color: "red" }}>
                              {errors?.applicationNameEng
                                ? errors.applicationNameEng.message
                                : null}
                            </FormHelperText>
                          </FormControl> */}
                      {/* </Grid> */}
                      {/* <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={6}
                        xl={6}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <FormControl style={{ width: "90%" }} size="small">
                          <InputLabel
                            id="demo-simple-select-label"
                            shrink={watch("area") ? true : false}
                          >
                            <FormattedLabel id="areaName" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                error={errors?.area ? true : false}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label={<FormattedLabel id="areaName" />}
                                value={field.value || ""}
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                                style={{ backgroundColor: "white" }}
                              >
                                {areaList.length > 0
                                  ? areaList.map((val, id) => {
                                      return (
                                        <MenuItem key={id} value={val.id}>
                                          {language === "en"
                                            ? val.areaName
                                            : val.areaNameMr}
                                        </MenuItem>
                                      );
                                    })
                                  : "Not Available"}
                              </Select>
                            )}
                            name="area"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText style={{ color: "red" }}>
                            {errors?.area ? errors.area.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid> */}
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={6}
                        xl={6}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <FormControl style={{ width: "90%" }} size="small">
                          {/* <InputLabel
                            id="demo-simple-select-label"
                            shrink={watch("area") ? true : false}
                          >
                            <FormattedLabel id="areaName" />
                          </InputLabel> */}
                          <Controller
                            render={({ field }) => (
                              <Autocomplete
                                multiple
                                id="area-multiselect"
                                options={areaList}
                                size="small"
                                disableCloseOnSelect
                                getOptionLabel={(option) => {
                                  return language === "en"
                                    ? option.areaName
                                    : option.areaNameMr;
                                }}
                                value={field.value || []}
                                onChange={(_, newValue) =>
                                  field.onChange(newValue)
                                }
                                isOptionEqualToValue={(option, value) =>
                                  option.id === value.id
                                }
                                renderOption={(props, option, { selected }) => (
                                  <li {...props}>
                                    <Checkbox
                                      icon={
                                        <CheckBoxOutlineBlankIcon fontSize="small" />
                                      }
                                      checkedIcon={
                                        <CheckBoxIcon fontSize="small" />
                                      }
                                      style={{ marginRight: 8 }}
                                      checked={selected}
                                      size="small"
                                    />
                                    {language === "en"
                                      ? option.areaName
                                      : option.areaNameMr}
                                  </li>
                                )}
                                renderInput={(params) => (
                                  <TextField
                                    size="small"
                                    {...params}
                                    variant="outlined"
                                    label={<FormattedLabel id="areaName" />}
                                    error={errors?.area ? true : false}
                                    style={{ backgroundColor: "white" }}
                                  />
                                )}
                              />
                            )}
                            name="area"
                            control={control}
                            defaultValue={[]}
                          />
                          <FormHelperText style={{ color: "red" }}>
                            {errors?.area ? errors.area.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>

                    {/* <Grid container sx={{ padding: "10px" }}>
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
                        <FormControl size="small" sx={{ width: "90%" }}>
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
                                onChange={(value) => field.onChange(value)}
                                style={{ backgroundColor: "white" }}
                              >
                                {departmentList.length > 0
                                  ? departmentList.map((department, index) => {
                                      return (
                                        <MenuItem
                                          key={index}
                                          value={department.id}
                                        >
                                          {department.department}
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
                            {errors?.department
                              ? errors.department.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid> */}
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={4}
                        sx={{ display: "flex", justifyContent: "end" }}
                      >
                        <Button
                          type="submit"
                          size="small"
                          color="success"
                          variant="outlined"
                          className={styles.button}
                          endIcon={<SaveIcon />}
                        >
                          <FormattedLabel id="Save" />
                        </Button>
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          className={styles.button}
                          endIcon={<ClearIcon />}
                          onClick={() => {
                            setSelectedWard("");
                            setSelectedZone("");
                            reset({
                              ...resetValuesExit,
                            });
                          }}
                        >
                          {<FormattedLabel id="clear" />}
                        </Button>
                      </Grid>
                      <Grid item xs={4}>
                        <Button
                          size="small"
                          variant="outlined"
                          className={styles.button}
                          color="error"
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitButton()}
                        >
                          {<FormattedLabel id="exit" />}
                        </Button>
                      </Grid>
                    </Grid>
                    <br />
                  </div>
                </Paper>
              </Slide>
            )}

            <Box
              style={{
                height: "auto",
                overflow: "auto",
                width: "100%",
              }}
            >
              <DataGrid
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                  },
                }}
                getRowId={(row) => row.srNo}
                components={{ Toolbar: GridToolbar }}
                // autoHeight={true}
                autoHeight={data.pageSize}
                density="compact"
                sx={{
                  "& .super-app-theme--cell": {
                    backgroundColor: "#E3EAEA",
                    borderLeft: "10px solid white",
                    borderRight: "10px solid white",
                    borderTop: "4px solid white",
                  },
                  backgroundColor: "white",
                  boxShadow: 2,
                  border: 1,
                  borderColor: "primary.light",
                  "& .MuiDataGrid-cell:hover": {},
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "#E3EAEA",
                  },
                  "& .MuiDataGrid-columnHeadersInner": {
                    backgroundColor: "#556CD6",
                    color: "white",
                  },

                  "& .MuiDataGrid-column": {
                    backgroundColor: "red",
                  },
                }}
                pagination
                paginationMode="server"
                rowCount={data.totalRows}
                rowsPerPageOptions={data.rowsPerPageOptions}
                page={data.page}
                pageSize={data.pageSize}
                rows={data.rows}
                columns={columns}
                onPageChange={(_data) => {
                  getZoneAndWard(data.pageSize, _data);
                }}
                onPageSizeChange={(_data) => {
                  console.log("222", _data);
                  getZoneAndWard(_data, data.page);
                }}
              />
            </Box>
          </form>
        </FormProvider>
      </Paper>
    </>
  );
};

export default Index;
