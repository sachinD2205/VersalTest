import { Clear, ExitToApp, Save } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
  Backdrop,
  Box,
  Button,
  Card,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
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
import styles from "../../../styles/cfc/cfc.module.css";
import { toast } from "react-toastify";
import schema from "../../../containers/schema/common/zoneWardOfficeLocationMappingMasterSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import Loader from "../../../containers/Layout/components/Loader";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../util/util";

const Index = () => {
  // import from use Form

  const {
    register,
    handleSubmit,
    control,
    // @ts-ignore
    methods,
    reset,
    setValue,
    watch,
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
  const [__departmentList, __setDepartmentList] = useState([]);
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
  const [officeLocationList, setofficeLocationList] = useState([]);
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
    getApplications();
    getDepartments();
    getofficeLocation();
  }, []);

  useEffect(() => {
    getZoneAndWard();
  }, [departmentList, zoneList, wardList, officeLocationList]);

  const [applications, setApplications] = useState([]);
  const [applicationsAll, setApplicationsAll] = useState([]);

  // getApplicationName
  const getApplications = () => {
    axios
      .get(`${urls.CFCURL}/master/application/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("res", r);
        setApplications(
          r?.data?.application?.map((row) => ({
            id: row.id,
            application: row.applicationNameEng,
          }))
        );
        setApplicationsAll(
          r?.data?.application?.map((row) => ({
            id: row.id,
            application: row.applicationNameEng,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

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
          console.log("res department", r.data.department);
          let departments = {};
          r.data.department.map((r) => (departments[r.id] = r.department));
          _setDepartmentList(departments);
          __setDepartmentList(r.data.department);
          setOpen(false);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setOpen(false);
        callCatchMethod(err, language);
      });
  };

  const getofficeLocation = () => {
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          console.log("res office location", r.data.officeLocation);
          setofficeLocationList(r.data.officeLocation);
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
        if (r.status == 200) {
          console.log("res Application", r);
          let applications = {};
          r?.data?.applications?.map(
            (r) => (applications[r.id] = r.applicationNameEng)
          );
          _setApplicationList(applications);
          setApplicationList(r.data);
          setOpen(false);
        }
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
      .get(`${urls.CFCURL}/master/zoneWardOfficeLoactionMapping/getAll`, {
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
        console.log("res mst", res);
        if (res.status == 200) {
          if (res.data?.errors?.length > 0) {
            res.data?.errors?.map((x) => {
              if (x.field == "officeLocation") {
                setError("officeLocation", { message: x.code });
              }
            });
          } else {
            setOpen(false);
            let result = res.data.zoneWardOfficeLoactionMapping;
            let _res = result.map((val, i) => {
              return {
                ...val,
                activeFlag: val.activeFlag,
                srNo: i + 1 + _pageNo * _pageSize,
                id: val.id,
                officeLocation: val.officeLocation,
                officeLocationCol: officeLocationList.find(
                  (f) => f.id == val.officeLocation
                )?.officeLocationName,

                zoneName: zoneList?.find((f) => f.id == val.zone)?.zoneName,
                wardName: wardList?.find((f) => f.id == val.ward)?.wardName,

                ward: val.ward,
                zone: val.zone,
                _departmentId: val.departmentId,
                departmentId: __departmentList.find(
                  (f) => f.id == val.departmentId
                )?.department,
                _moduleId: val.moduleId,
                moduleId: applications.find((f) => f.id == val.moduleId)
                  ?.application,

                status: val.activeFlag === "Y" ? "Active" : "Inactive",
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
        console.log("err", err);
        setOpen(false);
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
          _setWardList(wards);
          setOpen(false);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setOpen(false);
        callCatchMethod(err, language);
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
      activeFlag: btnSaveText === "Update" ? data.activeFlag : null,
      zone: Number(data.zone),
      ward: Number(data.ward),
      department: "",
      officeLocation: Number(data.officeLocation),
    };

    console.log("bodyForAPI", bodyForAPI);

    await axios
      .post(
        `${urls.CFCURL}/master/zoneWardOfficeLoactionMapping/save`,
        bodyForAPI,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
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
        setOpen(false);
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

  //   axios.post(`${urls.CFCURL}/master/zoneWardofficeLocationMapping/save`, finalBodyForApi).then((res) => {
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
  //           .post(`${urls.CFCURL}/master/zoneWardofficeLocationMapping/save`, body)

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
            .post(
              `${urls.CFCURL}/master/zoneWardOfficeLoactionMapping/save`,
              body,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
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
            .post(
              `${urls.CFCURL}/master/zoneWardOfficeLoactionMapping/save`,
              body,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
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
    officeLocation: null,
    zone: null,
    ward: null,
    zoneName: null,
    wardName: null,
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
      field: "officeLocationCol",
      headerName: "Office Location",
      flex: 0.6,
      headerAlign: "center",
    },

    {
      field: "zone",
      headerName: <FormattedLabel id="zone" />,
      flex: 0.5,
      headerAlign: "center",
    },
    {
      field: "zoneName",
      headerName: <FormattedLabel id="zoneName" />,
      flex: 0.7,
      headerAlign: "center",
    },
    {
      field: "ward",
      headerName: <FormattedLabel id="ward" />,
      flex: 0.5,
      headerAlign: "center",
    },
    {
      field: "wardName",
      headerName: <FormattedLabel id="wardName" />,
      flex: 0.7,
      headerAlign: "center",
    },
    {
      field: "departmentId",
      headerName: <FormattedLabel id="departmentName" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "moduleId",
      headerName: <FormattedLabel id="module" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 0.6,
      headerAlign: "center",
      align: "center",
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
                  console.log("params.row: ", params.row, __departmentList);
                  getZoneWiseWard(
                    params.row.moduleNameForZoneAndWard,
                    params.row.zone
                  );
                  getOfficeLocationWiseDepartment(params.row.officeLocation);
                  getDepartmentWiseModule(params.row._departmentId);
                  reset(params.row);
                  setValue("departmentId", params.row._departmentId);
                  setValue("moduleId", params.row._moduleId);
                }}
              >
                <Tooltip title="Edit">
                  <EditIcon style={{ color: "#556CD6" }} />
                </Tooltip>
              </IconButton>
            ) : (
              <Tooltip>
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
    officeLocation: null,
    zone: "",
    ward: "",
    zoneName: null,
    wardName: null,
  };

  const editById = (values) => {
    console.log("Kasla data edit hotoy: ", values);
    reset({ ...values });
    setCollapse(true);
  };

  const cancellButton = () => {
    setSelectedWard("");
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
    setSelectedWard("");
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
    setValue(
      "zoneName",
      zoneList?.find((r) => {
        return r.id === watch("zone");
      })?.zoneName
    );
  }, [watch("zone")]);

  const getZoneWiseWard = (deptId, zone_id) => {
    setOpen(true);
    axios
      .get(
        `${urls.CFCURL}/master/zoneAndWardLevelMapping/getWardByDepartmentId`,
        {
          params: {
            departmentId: deptId,
            zoneId: zone_id,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setWardList(res?.data);
        console.log("getZoneWiseWard res", res);
        setOpen(false);
        if (res?.data.length == 0) {
          toast("No Ward Available for this Zone and Module", {
            type: "error",
          });
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setOpen(false);
        callCatchMethod(err, language);
      });
  };

  const getOfficeLocationWiseDepartment = (officeLocationId) => {
    setOpen(true);
    axios
      .get(
        `${urls.CFCURL}/master/departmentAndOfficeLocationMapping/getByLocationIdV1`,
        {
          params: {
            locationId: officeLocationId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setDepartmentList(res?.data);
        console.log("getOfficeLocationWiseDepartment res", res);
        setOpen(false);
      })
      ?.catch((err) => {
        console.log("err", err);
        setOpen(false);
        callCatchMethod(err, language);
      });
  };

  const getDepartmentWiseModule = (__departmentId) => {
    setOpen(true);
    axios
      .get(
        `${urls.CFCURL}/master/departmentAndModuleMapping/getByDepartmentId`,
        {
          params: {
            departmentId: __departmentId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("getDepartmentWiseModule res", res);
        setApplications(res?.data);
        setOpen(false);
      })
      ?.catch((err) => {
        console.log("err", err);
        setOpen(false);
        callCatchMethod(err, language);
      });
  };

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
          padding: "10px",
          borderRadius: 100,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {language === "en"
          ? "Zone, Ward And Office Location Mapping"
          : "झोन, वॉर्ड आणि ऑफीस स्थान मॅपिंग"}
      </div>
      {/* <Head>
        <title>Zone And Ward Mapping</title>
      </Head> */}
      <div className={styles.main}>
        <div className={styles.left}>
          <Card>
            {/* <Button onClick={handleToggle}>Show backdrop</Button> */}
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={open}
              onClick={handleClose}
            >
              <Loader />
            </Backdrop>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                {isOpenCollapse && (
                  <Slide
                    direction="down"
                    in={slideChecked}
                    mountOnEnter
                    unmountOnExit
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
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          <FormControl
                            variant="outlined"
                            size="small"
                            sx={{ width: "90%" }}
                            error={errors.moduleNameForZoneAndWard}
                          >
                            <InputLabel id="demo-simple-select-outlined-label">
                              <FormattedLabel id="moduleNameForZoneAndWard" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  label={
                                    <FormattedLabel id="moduleNameForZoneAndWard" />
                                  }
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                >
                                  {applicationsAll &&
                                    applicationsAll.map(
                                      (ApplicationNameKey, index) => {
                                        return (
                                          <MenuItem
                                            key={index}
                                            value={ApplicationNameKey.id}
                                          >
                                            {ApplicationNameKey.application}
                                          </MenuItem>
                                        );
                                      }
                                    )}
                                </Select>
                              )}
                              name="moduleNameForZoneAndWard"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.moduleNameForZoneAndWard
                                ? errors.moduleNameForZoneAndWard.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <FormControl
                            style={{ width: "90%" }}
                            size="small"
                            error={errors.officeLocation}
                          >
                            <InputLabel
                              id="demo-simple-select-label"
                              shrink={watch("officeLocation") ? true : false}
                            >
                              <FormattedLabel id="officeLocationName" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  label={
                                    <FormattedLabel id="officeLocationName" />
                                  }
                                  value={field.value || ""}
                                  onChange={(value) => {
                                    field.onChange(value);
                                    getOfficeLocationWiseDepartment(
                                      value.target.value
                                    );
                                  }}
                                  style={{ backgroundColor: "white" }}
                                >
                                  {officeLocationList.length > 0
                                    ? officeLocationList.map((val, id) => {
                                        return (
                                          <MenuItem key={id} value={val.id}>
                                            {val.officeLocationName}
                                          </MenuItem>
                                        );
                                      })
                                    : "Not Available"}
                                </Select>
                              )}
                              name="officeLocation"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText style={{ color: "red" }}>
                              {errors?.officeLocation
                                ? errors.officeLocation.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>

                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={6}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <FormControl
                            size="small"
                            sx={{ width: "90%" }}
                            error={errors.zone}
                          >
                            <InputLabel
                              id="demo-simple-select-standard-label"
                              shrink={watch("zone") ? true : false}
                            >
                              <FormattedLabel id="zone" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  // label="Zone Number"
                                  label={<FormattedLabel id="zone" />}
                                  value={field.value || ""}
                                  onChange={(value) => {
                                    field.onChange(value),
                                      setSelectedZone(value.target.value);
                                    getZoneWiseWard(
                                      watch("moduleNameForZoneAndWard"),
                                      value.target.value
                                    );
                                  }}
                                  style={{ backgroundColor: "white" }}
                                >
                                  {zoneList?.length > 0 &&
                                    zoneList?.map((zone, index) => {
                                      return (
                                        <MenuItem key={index} value={zone.id}>
                                          {zone.zoneNo}
                                        </MenuItem>
                                      );
                                    })}
                                </Select>
                              )}
                              name="zone"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText style={{ color: "red" }}>
                              {errors?.zone ? errors.zone.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            size="small"
                            InputLabelProps={{
                              shrink: zoneList?.find((r) => {
                                return r.id === watch("zone");
                              })?.zoneName
                                ? true
                                : false,
                            }}
                            disabled
                            style={{ backgroundColor: "white" }}
                            id="outlined-basic"
                            label={<FormattedLabel id="zoneName" />}
                            variant="outlined"
                            {...register("zoneName")}
                          />
                        </Grid>
                      </Grid>

                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={6}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <FormControl
                            variant="outlined"
                            size="small"
                            sx={{ width: "90%" }}
                            error={errors.ward}
                          >
                            <InputLabel
                              id="demo-simple-select-outlined-label"
                              shrink={watch("ward") ? true : false}
                            >
                              <FormattedLabel id="ward" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  label={<FormattedLabel id="ward" />}
                                  value={field.value || ""}
                                  onChange={(value) => {
                                    field.onChange(value),
                                      setSelectedWard(value.target.value);
                                  }}
                                  style={{ backgroundColor: "white" }}
                                >
                                  {wardList?.length > 0 &&
                                    wardList?.map((ward, index) => {
                                      return (
                                        <MenuItem key={index} value={ward.id}>
                                          {ward?.wardNo}
                                        </MenuItem>
                                      );
                                    })}
                                </Select>
                              )}
                              name="ward"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText style={{ color: "red" }}>
                              {errors?.ward ? errors.ward.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TextField
                            {...register("wardName")}
                            sx={{
                              width: "90%",
                            }}
                            id="outlined-basic"
                            label={<FormattedLabel id="wardName" />}
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
                            readOnly
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
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          <FormControl
                            fullWidth
                            size="small"
                            sx={{ width: "90%" }}
                            error={errors.departmentId}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="department" />
                            </InputLabel>
                            <Controller
                              name="departmentId"
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <Select
                                  onChange={(value) => {
                                    field.onChange(value);
                                    getDepartmentWiseModule(value.target.value);
                                  }}
                                  value={field.value}
                                  label={<FormattedLabel id="department" />}
                                >
                                  {departmentList?.map((item, i) => {
                                    return (
                                      <MenuItem
                                        key={i}
                                        value={item.departmentId}
                                      >
                                        {item.department}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              )}
                            />
                            <FormHelperText style={{ color: "red" }}>
                              {errors?.departmentId
                                ? errors.departmentId.message
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
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          <FormControl
                            variant="outlined"
                            size="small"
                            sx={{ width: "90%" }}
                            error={errors.moduleId}
                          >
                            <InputLabel id="demo-simple-select-outlined-label">
                              <FormattedLabel id="moduleName" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  label={<FormattedLabel id="moduleName" />}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                >
                                  {applications &&
                                    applications.map(
                                      (ApplicationNameKey, index) => (
                                        <MenuItem
                                          key={index}
                                          value={
                                            ApplicationNameKey.applicationId
                                          }
                                        >
                                          {ApplicationNameKey.application}
                                        </MenuItem>
                                      )
                                    )}
                                </Select>
                              )}
                              name="moduleId"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.moduleId
                                ? errors.moduleId.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>

                      <Grid container sx={{ padding: "10px" }}>
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
                            variant="outlined"
                            color="success"
                            type="submit"
                            endIcon={<Save />}
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
                            variant="outlined"
                            color="primary"
                            endIcon={<Clear />}
                            onClick={cancellButton}
                          >
                            <FormattedLabel id="clear" />
                          </Button>
                        </Grid>
                        <Grid
                          xs={4}
                          item
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={onBack}
                            endIcon={<ExitToApp />}
                          >
                            <FormattedLabel id="exit" />
                          </Button>
                        </Grid>
                      </Grid>
                    </div>
                  </Slide>
                )}

                <Grid
                  container
                  style={{
                    padding: "10px",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <Button
                    variant="contained"
                    endIcon={<AddIcon />}
                    type="primary"
                    size="small"
                    disabled={buttonInputState}
                    onClick={() => {
                      setSelectedWard("");
                      reset({
                        ...resetValuesExit,
                        zoneName: null,
                        wardName: null,
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

                <Box style={{ height: "auto", overflow: "auto" }}>
                  <DataGrid
                    componentsProps={{
                      toolbar: {
                        showQuickFilter: true,
                      },
                    }}
                    getRowId={(row) => row.srNo}
                    components={{ Toolbar: GridToolbar }}
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
                      getZoneAndWard(data.pageSize, _data);
                    }}
                    onPageSizeChange={(_data) => {
                      // updateData("page", 1);
                      getZoneAndWard(_data, data.page);
                    }}
                  />
                </Box>

                {/* <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginTop: '5vh',
                  marginLeft: '15vw',
                  marginRight: '15vw',
                }}
              >
                <h3>Zone Address</h3>
                <TextofficeLocation
                  autoSize={{ minRows: 3, maxRows: 15 }}
                  style={{
                    backgroundColor: 'whitesmoke',
                    marginBottom: '3vh',
                  }}
                  //   {...register('zoneAddress')}
                  //   error={!!errors.zoneAddress}
                  //   helperText={errors?.zoneAddress ? errors.zoneAddress.message : null}
                  disabled={isDisabled}
                  defaultValue={
                    router.query.zoneAddress ? router.query.zoneAddress : ''
                  }
                />
              </div> */}
              </form>
            </FormProvider>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Index;
