import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
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
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../containers/schema/common/ZoneAndWardMappingMaster";
import styles from "../../../styles/cfc/cfc.module.css";
import { toast } from "react-toastify";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../util/util";
import Loader from "../../../containers/Layout/components/Loader";

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
    setError,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
  });

  let DataBharaychaKiNahi = false; //Used to decide page type (edit/viewable/new)
  // let id = router.query.id;

  let isDisabled = false;
  let isAcknowledgement = false;
  const [runAgain, setRunAgain] = useState(false);
  const [fieldValues, setFieldValues] = useState({});
  const [collapse, setCollapse] = useState(false);
//   const [departmentList, setDepartmentList] = useState([]);
//   const [_departmentList, _setDepartmentList] = useState([]);
  const [zoneList, setZoneList] = useState([]);
  const [_zoneList, _setZoneList] = useState([]);
  const [villageList, setVillageList] = useState([]);
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
  // const [opening, setopening] = useState(false);
  const [id, setID] = useState();
  const [officeLocationList, setOfficeLocationList] = useState([]);
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

  const router = useRouter();

  // Exit Button
  const exitBack = () => {
    router.back();
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

  const [open, setOpen] = useState();

  const handleOpen = () => {
    setOpen(false);
  };

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

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
    getVillage();
    setRunAgain(false);

    
  }, []);

  useEffect(() => {
    getZoneAndWard();
  }, [ zoneList, villageList, officeLocationList]);  

  const getZoneAndWard = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setOpen(true);
    axios
      .get(`${urls.CFCURL}/master/zoneAndVillageMapping/getAll`, {
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
          setOpen(false);
          let result = res.data.zoneAndVillageMapping;
          console.log("tttttttt",result);
          let _res = result.map((val, i) => {
            return {
              activeFlag: val.activeFlag,
              srNo: i + 1 + _pageNo * _pageSize,
              // applicationNameEng: _applicationList[val.application]
              //   ? _applicationList[val.application]
              //   : "-",
              // officeLocation: val.officeLocation ? val.officeLocation : "-",
              // officeLocationCol: officeLocationList.find(
              //   (f) => f.id == val.officeLocation
              // )?.officeLocationName,
            //   departmentName: _departmentList[val.department]
            //     ? _departmentList[val.department]
            //     : "-",
              id: val.id,

              zoneNumber: val.zoneKey ? val.zoneKey : "-",
              villageNumber: val.villageKey ? val.villageKey : "-",
              // zoneName: _zoneList[val.zone] ? _zoneList[val.zone] : "-",
              // wardName: _wardList[val.village] ? _wardList[val.village] : "-",

              zoneName: zoneList.find((f) => f.id == val.zoneKey)?.zoneName,

              // wardName: val.wardName,
              zoneNameCol: zoneList.find((f) => f.id == val.zoneKey)?.zoneName,
              villageName: villageList.find((f) => f.id == val.villageKey)?.villageName,

       

              status: val.activeFlag === "Y" ? "Active" : "Inactive",
              application: val.application ? val.application : "-",
            };
          });
          setData({
            rows: _res,
            totalRows: res.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res.data.pageSize,
            page: res.data.pageNo,
          });
          setDataSource(res.data);
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
          console.log("ttttttttttttttttttttttttt", res.data.zone);
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

  const getVillage = () => {
    setOpen(true);
    axios
      .get(`${urls.CFCURL}/master/village/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          setVillageList(res.data.village);
          console.log("res getVillage", res.data.village);
          let villages = {};
          res.data.village.map((r) => (villages[r.id] = r.villageName));
          console.log("villageList", villageList);
        //   _setWardList(villages);
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
    console.log("ssssssssssssssssss",data);
    setOpen(true);
    const bodyForAPI = {
      ...data,
      activeFlag: btnSaveText === "Update" ? data.activeFlag : null,
      zone: Number(data.zoneNumber),
      village: Number(data.villageNumber),
      //   department: Number(data.department),
      officeLocation: Number(data.officeLocation),
    };
    console.log("ppppppppppppppp",bodyForAPI);

    let body = data?.villageNumber?.map((areaObj, index) => {
      return {
        zoneKey: Number(data.zoneNumber),
        zoneName: zoneList?.find((area) => area.id === data.zoneNumber).zoneName,
        // department: Number(data.department),
        villageKey: areaObj?.id,
        villageName: areaObj?.villageName,
        activeFlag: btnSaveText === "Update" ? data?.activeFlag : null,
        id: index === 0 ? (btnSaveText === "Update" ? data.id : null) : null,
      };
    });

    console.log("bodyForAPI", bodyForAPI, "body", body);

    await axios
      .post(`${urls.CFCURL}/master/zoneAndVillageMapping/saveAll`, body, {
      // .post(`${urls.CFCURL}/master/MstZoneAndVillageMapping/saveAll`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // setOpen(false)
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
        setOpen(false)
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

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
  //         axios.post(`${urls.CFCURL}/master/MstZoneAndVillageMapping/save`, body).then((res) => {
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
  //         axios.post(`${urls.CFCURL}/master/MstZoneAndVillageMapping/save`, body).then((res) => {
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
            .post(`${urls.CFCURL}/master/zoneAndVillageMapping/save`, body, {
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
            .post(`${urls.CFCURL}/master/zoneAndVillageMapping/save`, body, {
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
    // departmentName: null,
    officeLocation: null,
    zoneNumber: null,
    villageNumber: null,
    zoneName: null,
    wardName: null,
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
   
    {
      field: "zoneName",
      headerName: <FormattedLabel id="zoneName" />,
      //   width: 160,
      flex: 0.6,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "zoneNumber",
      headerName: <FormattedLabel id="zoneNumber" />,
      flex: 0.4,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "villageName",
      headerName: <FormattedLabel id="villageName" />,
      //   width: 160,
      flex: 0.6,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "villageNumber",
      headerName:language == "en"?"Village Number":"गाव क्रमांक",
      // headerName: <FormattedLabel id="villageNumber" />,
      flex: 0.4,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="actions" />,
      flex: 0.6,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              disabled={
                editButtonInputState || params.row.activeFlag === "Y"
                  ? false
                  : true
              }
              // disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update");
                setID(params.row.id);
                setIsOpenCollapse(true);
                setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
                setValue("villageNumber", [
                  villageList?.find((area) => area.id === params.row.villageNumber),
                ]);
                setSelectedZone(params?.row?.zoneNumber);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <Tooltip title="Edit">
                  <EditIcon style={{ color: "#556CD6" }} />
                </Tooltip>
              ) : (
                <Tooltip title="Edit">
                  <EditIcon disabled />
                </Tooltip>
              )}
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
    // departmentName: null,
    officeLocation: null,
    zoneNumber: "",
    villageNumber: "",
    zoneName: null,
    wardName: null,
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
            {/* <FormattedLabel id="zoneAndWardMapping" /> */}
            {language == "en" ? "Zone And Village Mapping":"झोन आणि गाव मॅपिंग"}
          </Box>
        </Box>
        <Box>
          <Button
            className={styles.adbtn}
            variant="contained"
            disabled={buttonInputState}
            onClick={() => {
              reset({
                ...resetValuesExit,
              });
              setSelectedWard("");
              setSelectedZone("");
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
        onClick={handleOpen}
      >
        {/* Loading.... */}
        <Loader/>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Paper>
        <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
          <Paper
            sx={{
              backgroundColor: "#F5F5F5",
            }}
            elevation={5}
          >
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
                                  id="demo-simple-select-outlined-label"
                                  // label="Zone Number"
                                  label={<FormattedLabel id="zoneNumber" />}
                                  value={field.value || ""}
                                  onChange={(value) => {
                                    field.onChange(value),
                                      setSelectedZone(value.target.value);
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
                            InputLabelProps={{
                              shrink: zoneList?.find((r) => {
                                return r.id === selectedZone;
                              })?.zoneName
                                ? true
                                : false,
                            }}
                            {...register("zoneNameStr")}
                            size="small"
                            variant="outlined"
                            value={
                              zoneList?.find((r) => {
                                return r.id === selectedZone;
                              })?.zoneName
                            }
                            disabled={true}
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
                                  options={villageList}
                                  size="small"
                                  disableCloseOnSelect
                                  
                                  getOptionLabel={(option) => {

                                    {console.log("fdggggggdds",option);}
                                    return<>
                                    {language =="en"? option.villageName: option.villageNameMr}
                                    </>
                                  }}
                                  value={field.value || []}
                                  onChange={(_, newValue) =>
                                    field.onChange(newValue)
                                  }
                                  isOptionEqualToValue={(option, value) =>
                                    option.id === value.id
                                  }
                                  renderOption={(
                                    props,
                                    option,
                                    { selected }
                                  ) => (
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
                                      {language == "en"?option.villageName:option.villageNameMr}
                                      {/* {option.villageName} */}
                                    </li>
                                  )}
                                  renderInput={(params) => (
                                    <TextField
                                      size="small"
                                      {...params}
                                      variant="outlined"
                                    //   label={<FormattedLabel id="villageNumber" />}
                                    label={language == "en"?"Village Name":"गावाचे नाव"}
                                      error={errors?.area ? true : false}
                                      style={{ backgroundColor: "white" }}
                                    />
                                  )}
                                />
                              )}
                              name="villageNumber"
                              control={control}
                              defaultValue={[]}
                            />
                            <FormHelperText style={{ color: "red" }}>
                              {errors?.villageNumber
                                ? errors.villageNumber.message
                                : null}
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
                            alignItems: "center",
                          }}
                        >
                          <FormControl size="small" sx={{ width: "90%" }}>
                            <InputLabel
                              id="demo-simple-select"
                              shrink={watch("villageNumber") ? true : false}
                            >
                              <FormattedLabel id="villageNumber" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  error={errors?.villageNumber ? true : false}
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  label={<FormattedLabel id="villageNumber" />}
                                  value={field.value || ""}
                                  onChange={(value) => {
                                    field.onChange(value),
                                      setSelectedWard(value.target.value);
                                  }}
                                  style={{ backgroundColor: "white" }}
                                >
                                  {villageList.length > 0
                                    ? villageList.map((ward, index) => {
                                        return (
                                          <MenuItem key={index} value={ward.id}>
                                            {ward.villageNumber}
                                          </MenuItem>
                                        );
                                      })
                                    : "NA"}
                                </Select>
                              )}
                              name="villageNumber"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText style={{ color: "red" }}>
                              {errors?.villageNumber
                                ? errors.villageNumber.message
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
                            size="small"
                            variant="outlined"
                            value={
                              villageList?.find((r) => {
                                return r.id === selectedWard;
                              })?.wardName
                            }
                            {...register("wardNameStr")}
                            InputLabelProps={{
                              shrink: villageList?.find((r) => {
                                return r.id === selectedWard;
                              })?.wardName
                                ? true
                                : false,
                            }}
                            disabled={true}
                          />
                        </Grid> */}
                      </Grid>

                      <br />
                      <br />
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
                            color="primary"
                            variant="outlined"
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
                  </Slide>
                )}
              </form>
            </FormProvider>
          </Paper>
        </Slide>

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
      </Paper>
    </>
  );
};

export default Index;
