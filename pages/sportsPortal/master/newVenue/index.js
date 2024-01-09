import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { GridToolbar } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";

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
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import URLS from "../../../../URLS/urls";

import styles from "../../../../styles/sportsPortalStyles/facilityCheck.module.css";

// import styles from "../../../../styles/sportsPortalStyles/venueMaster.module.css";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../../util/util";
// import schema from "../../../../containers/schema/sportsPortalSchema/venueSchema";

// func
const Index = () => {
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
    // resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [disableKadhnariState, setDisableKadhnariState] = useState(true);
  const [btnSaveText, setBtnSaveText] = useState("save");
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [numberSection, setNumberSection] = useState();
  const [numberCourt, setNumberCourt] = useState();
  const [numberCourtt, setNumberCourtt] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [slideChecked, setSlideChecked] = useState(false);
  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [unit, setUnit] = useState([]);
  // const [departments, setDepartments] = useState([]);
  // const [subDepartments, setSubDepartments] = useState([]);
  const [facilityTypess, setFacilityTypess] = useState([]);
  const [facilityNames, setFacilityNames] = useState([]);
  const [selectedFacilityType, setSelectedFacilityType] = useState();
  const [selectedDepartment, setSelectedDepartment] = useState([]);

  const language = useSelector((state) => state.labels.language);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getCaseType();
  }, [zoneNames, wardNames, fetchData]);

  // useEffect - Reload On update , delete ,Saved on refresh
  // useEffect(() => {
  //   getAllDetails();
  // }, [
  //   zoneNames,
  //   wardNames,
  //   departments,
  //   subDepartments,
  //   facilityNames,
  //   fetchData,
  //   facilityTypess,
  // ]);

  useEffect(() => {
    getAllTypes();
    getWardNames();
    getUnit();
    // getDepartments();
    // getSubDepartments();
    getFacilityTypes();
    getFacilityName();
  }, []);

  const getFacilityName = () => {
    axios
      .get(`${URLS.SPURL}/facilityName/getAll`)
      .then((r) => {
        setFacilityNames(
          r.data.facilityName.map((row) => ({
            id: row.id,
            facilityName: row.facilityName,
            facilityNameMr: row.facilityNameMr,
            facilityType: row.facilityType,
            facilityTypeMr: row.facilityTypeMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getFacilityTypes = () => {
    axios
      .get(`${URLS.SPURL}/facilityType/getAll`)
      .then((r) => {
        setFacilityTypess(
          r.data.facilityType.map((row) => ({
            id: row.id,
            facilityType: row.facilityType,
            facilityTypeMr: row.facilityTypeMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getUnit = () => {
    // axios.get(`${URLS.CFCURL}/master/zone/getAll`).
    axios
      .get(`${URLS.SPURL}//unit/getAll`)
      .then((r) => {
        //   console.log(r.data.unit);
        setUnit(
          r.data.unit.map((row) => ({
            id: row.id,
            unit: row.unit,
            unitMr: row.unitMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  const getAllTypes = () => {
    // axios.get(`${URLS.CFCURL}/master/zone/getAll`).
    axios
      .get(`${URLS.SPURL}/master/zone/getAll`)
      .then((r) => {
        console.log(r.data.zone);
        setZoneNames(
          r.data.zone.map((row) => ({
            id: row.id,
            zoneName: row.zoneName,
            zoneNameMr: row.zoneNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  const getWardNames = () => {
    axios
      .get(`${URLS.CFCURL}/master/ward/getAll`)
      .then((r) => {
        setWardNames(
          r.data.ward.map((row) => ({
            id: row.id,
            wardName: row.wardName,
            wardNameMr: row.wardNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  // const getDepartments = () => {
  //   axios.get(`${URLS.CFCURL}/master/department/getAll`).then((r) => {
  //     setDepartments(
  //       r.data.department.map((row) => ({
  //         id: row.id,
  //         department: row.department,
  //       })),
  //     );
  //   });
  // };

  // const getSubDepartments = () => {
  //   axios.get(`${URLS.CFCURL}/master/subDepartment/getAll`).then((r) => {
  //     setSubDepartments(
  //       r.data.subDepartment.map((row) => ({
  //         id: row.id,
  //         subDepartmentName: row.subDepartment,
  //         department: row.department,
  //       })),
  //     );
  //   });
  // };

  //Delete By ID (SweetAlert)

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
  //           `${URLS.SPURL}/venueMaster/discardVenueMaster/${value}`
  //         )
  //         .then((res) => {
  //           if (res.status == 226) {
  //             swal("Record is Successfully Deleted!", {
  //               icon: "success",
  //             });
  //             setButtonInputState(false);
  //             getAllDetails();
  //           }
  //         });
  //     } else {
  //       swal("Record is Safe");
  //     }
  //   });
  // };

  // OnSubmit Form
  // const onSubmitForm = (fromData) => {
  //   console.log("DATA:", fromData);

  //   if (btnSaveText === "Save") {
  //     console.log("Post -----");
  //     const tempData = axios
  //       .post(`${URLS.SPURL}/venueMaster/getAll`, fromData)
  //       .then((res) => {
  //         if (res.status == 200) {
  //           // message.success("Data Saved !!!");
  //           sweetAlert("Saved!", "Record Saved successfully !", "success");

  //           setButtonInputState(false);
  //           setIsOpenCollapse(false);
  //           setFetchData(tempData);
  //           setEditButtonInputState(false);
  //           setDeleteButtonState(false);
  //         }
  //       });
  //   }
  //   // Update Data Based On ID
  //   else if (btnSaveText === "Edit") {
  //     console.log("Put -----");
  //     const tempData = axios
  //       .post(
  //         `${urls.BaseURL}/venueMaster/saveVenueMaster/?id=${id}`,

  //         fromData
  //       )
  //       .then((res) => {
  //         if (res.status == 200) {
  //           // message.success("Data Updated !!!");
  //           sweetAlert("Updated!", "Record Updated successfully !", "success");

  //           setButtonInputState(false);
  //           setIsOpenCollapse(false);
  //           setFetchData(tempData);
  //         }
  //       });
  //   }
  // };
  //Delete by ID(SweetAlert)
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
            .post(`${URLS.SPURL}/venueMaster/saveVenueMaster`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getCaseType();
                // setButtonInputState(false);
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
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
            .post(`${URLS.SPURL}/venueMaster/saveVenueMaster`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                // getPaymentRate();
                getCaseType();
                // setButtonInputState(false);
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };
  // Get Table - Data
  const getCaseType = (_pageSize = 10, _pageNo = 0, _sortDir = "desc") => {
    axios
      .get(`${URLS.SPURL}/venueMaster/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortDir: _sortDir,
        },
      })
      .then((r) => {
        console.log(";r", r);
        let result = r.data.venue;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log("44");
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,

            id: r.id,
            srNo: i + 1,
            venueId: i + 1,
            capacity: r.capacity,
            facilityTypeId: r.facilityTypeId,
            geoCode: r.geoCode,
            zoneName: zoneNames?.find((obj) => obj?.id === r.zoneName)
              ?.zoneName,
            zoneNameMr: zoneNames?.find((obj) => obj?.id === r.zoneName)
              ?.zoneNameMr,
            wardName: wardNames?.find((obj) => obj?.id === r.wardName)
              ?.wardName,
            wardNameMr: wardNames?.find((obj) => obj?.id === r.wardName)
              ?.wardNameMr,
            unit: unit?.find((obj) => obj?.id === r.unit)?.unit,
            unitMr: unit?.find((obj) => obj?.id === r.unitMr)?.unitMr,
            // department: departments?.find((obj) => obj?.id === r.department)?.department,
            // subDepartment: subDepartments?.find((obj) => obj?.id === r.subDepartment)?.subDepartment,
            facilityType: facilityTypess?.find(
              (obj) => obj?.id === r.facilityType,
            )?.facilityType,
            facilityName: facilityNames?.find(
              (obj) => obj?.id === r.facilityName,
            )?.facilityName,

            // venueNameMr: venues?.find((obj) => obj?.id === r.venue)?.venueNameMr,
            facilityNameMr: facilityNames?.find(
              (obj) => obj?.id === r.facilityName,
            )?.facilityNameMr,
            facilityTypeMr: facilityTypess?.find(
              (obj) => obj?.id === r.facilityType,
            )?.facilityTypeMr,

            // facilityType: r.facilityType,
            facilityPrefix: r.facilityPrefix,
            venue: r.venue,
            venueMr: r.venueMr,
            contactPersonName: r.contactPersonName,
            contactPersonNameMr: r.contactPersonNameMr,
            contactPersonMobileNo: r.contactPersonMobileNo,
            address: r.address,
            addressMr: r.addressMr,

            facilityId: r.facilityId,
            remark: r.remark,
            remarkMr: r.remarkMr,

            status: r.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });
        setDataSource([..._res]);
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    // Save - DB
    let _body = {
      ...fromData,
      // activeFlag: btnSaveText === 'update' ? null : fromData.activeFlag,
    };
    if (btnSaveText === "Save") {
      const tempData = axios
        .post(`${URLS.SPURL}/venueMaster/saveVenueMaster`, _body)
        .then((res) => {
          if (res.status == 200) {
            sweetAlert("Saved!", "Record Saved successfully !", "success");

            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "update") {
      const tempData = axios
        .post(`${URLS.SPURL}/venueMaster/saveVenueMaster`, _body)
        .then((res) => {
          console.log("res", res);
          if (res.status == 200) {
            fromData.id
              ? sweetAlert(
                  "Updated!",
                  "Record Updated successfully !",
                  "success",
                )
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            getCaseType();
            // setButtonInputState(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setIsOpenCollapse(false);
    setDeleteButtonState(false);
    setEditButtonInputState(false);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    venue: "",
    geoCode: "",
    department: "",
    subDepartment: "",
    facilityType: "",
    facilityName: "",
    wardName: "",
    zoneName: "",
    venueId: "",
    remark: "",
    capacity: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    venue: "",
    geoCode: "",
    department: "",
    subDepartment: "",
    facilityType: "",
    facilityName: "",
    wardName: "",
    zoneName: "",
    venueId: "",
    remark: "",
    capacity: "",
  };

  // Get Table - Data
  // const getAllDetails = () => {
  //   axios.get(`${URLS.SPURL}/venueMaster/getAll`).then((res) => {
  //     setDataSource(
  //       res.data.venue.map((r, i) => ({
  //         id: r.id,
  //         srNo: i + 1,
  //         venueId: r.venueId,
  //         geoCode: r.geoCode,
  //         capacity: r.capacity,
  //         zoneName: zoneNames?.find((obj) => obj?.id === r.zoneName)?.zoneName,
  //         wardName: wardNames?.find((obj) => obj?.id === r.wardName)?.wardName,
  //         department: departments?.find((obj) => obj?.id === r.department)
  //           ?.department,
  //         subDepartment: subDepartments?.find(
  //           (obj) => obj?.id === r.subDepartment
  //         )?.subDepartment,

  //         faciltyName: r.faciltyName,
  //         facilityType: facilityTypess?.find(
  //           (obj) => obj?.id === r.facilityType
  //         )?.facilityType,
  //         facilityPrefix: r.facilityPrefix,
  //         facilityId: r.facilityId,
  //         remark: r.remark,
  //       }))
  //     );
  //   });
  // };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
    },

    // {
    //   field: "venueId",
    //   headerName: <FormattedLabel id="venueId" />,
    // },
    {
      // field: "zoneName",
      field: language === "en" ? "zoneName" : "zoneNameMr",
      headerName: <FormattedLabel id="zone" />,
      //type: "number",
      flex: 1,
    },

    {
      // field: "wardName",
      field: language === "en" ? "wardName" : "wardNameMr",
      headerName: <FormattedLabel id="ward" />,
      //type: "number",
      flex: 1,
    },
    {
      // field: "facilityType",
      field: language === "en" ? "facilityType" : "facilityTypeMr",
      headerName: <FormattedLabel id="facilityType" />,
      //type: "number",
      flex: 1,
    },
    // {
    //   // field: "venue",
    //   field: language === "en" ? "venue" : "venueMr",
    //   // headerName: <FormattedLabel id="venueName" />,
    //   headerName: "Venue Name",
    //   //type: "number",
    //   flex: 1,
    // },

    {
      field: "venue",
      // field: language === "en" ? "venue" : "venueMr",
      headerName: <FormattedLabel id="venue" />,
      // headerName: "Venue Name",
      //type: "number",
      flex: 1,
    },
    {
      field: "venueMr",
      // field: language === "en" ? "venue" : "venueMr",
      headerName: <FormattedLabel id="venueMr" />,
      // headerName: "Venue Name",
      //type: "number",
      flex: 1,
    },

    {
      field: "contactPersonName",
      headerName: <FormattedLabel id="contactPersonName" />,
      //type: "number",
      flex: 1,
    },
    {
      field: "contactPersonNameMr",
      headerName: <FormattedLabel id="contactPersonNameMr" />,
      //type: "number",
      flex: 1,
    },
    {
      field: "contactPersonMobileNo",
      headerName: <FormattedLabel id="contactPersonMobileNo" />,
      flex: 1,
    },

    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   width: 120,
    //   sortable: false,
    //   disableColumnMenu: true,
    //   renderCell: (params) => {
    //     return (
    //       <Box
    //         sx={{
    //           backgroundColor: "whitesmoke",
    //           width: "100%",
    //           height: "100%",
    //           display: "flex",
    //           justifyContent: "center",
    //           alignItems: "center",
    //         }}
    //       >
    //         <IconButton
    //           disabled={editButtonInputState}
    //           onClick={() => {
    //             setBtnSaveText("Edit"),
    //               setID(params.row.id),
    //               setIsOpenCollapse(true),
    //               setSlideChecked(true);
    //             const wardId = wardNames.find(
    //               (obj) => obj?.wardName === params.row.wardName
    //             )?.id;

    //             const zoneId = zoneNames.find(
    //               (obj) => obj?.zoneName === params.row.zoneName
    //             )?.id;

    //             const departmentId = departments.find(
    //               (obj) => obj?.department === params.row.department
    //             )?.id;

    //             const subDepartmentId = subDepartments.find(
    //               (obj) => obj?.subDepartment === params.row.subDepartment
    //             )?.id;

    //             reset({
    //               ...params.row,
    //               wardName: wardId,
    //               zoneName: zoneId,
    //               department: departmentId,
    //               subDepartment: subDepartmentId,
    //             });
    //           }}
    //         >
    //           <EditIcon />
    //         </IconButton>
    //         <IconButton
    //           disabled={deleteButtonInputState}
    //           onClick={() => deleteById(params.id)}
    //         >
    //           <DeleteIcon />
    //         </IconButton>
    //       </Box>
    //     );
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
          <Box>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);

                const wardId = wardNames.find(
                  (obj) => obj?.wardName === params.row.wardName,
                )?.id;
                const zoneId = zoneNames.find(
                  (obj) => obj?.zoneName === params.row.zoneName,
                )?.id;
                const unitId = unit.find(
                  (obj) => obj?.unit === params.row.unit,
                )?.id;
                // const departmentId = departments.find((obj) => obj?.department === params.row.department)?.id;

                // const subDepartmentId = subDepartments.find(
                //   (obj) => obj?.subDepartment === params.row.subDepartment,
                // )?.id;
                const facilityTypeId = facilityTypess.find(
                  (obj) => obj?.facilityType === params.row.facilityType,
                )?.id;
                const facilityNameId = facilityNames.find(
                  (obj) => obj?.facilityName === params.row.facilityName,
                )?.id;
                console.log("params.row: ", params.row);
                reset({
                  ...params.row,
                  // venueId: params.row.id,
                  wardName: wardId,
                  zoneName: zoneId,
                  unit: unitId,
                  // venueName: venueId,
                  facilityName: facilityNameId,
                  // department: departmentId,
                  // subDepartment: subDepartmentId,
                  facilityType: facilityTypeId,
                  // venueName: venueName,
                  // fromBookingTime: fromBookingTimee,
                  // toBookingTime: toBookingTimee,
                });
                // reset(params.row);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            {/* <IconButton onClick={() => deleteById(params.id)}>
              <DeleteIcon />
            </IconButton> */}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true);
                // setButtonInputState(true);
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
          </Box>
        );
      },
    },
  ];

  // View
  return (
    <>
      <Paper
        sx={{ marginLeft: 5, marginRight: 5, marginTop: 5, marginBottom: 5 }}
      >
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <div className={styles.main}>
                    <div className={styles.row}>
                      {/* <div>
                        <TextField
                          sx={{ width: 220 }}
                          id="standard-basic"
                          label={<FormattedLabel id="venueId" />}
                          variant="standard"
                          {...register("venueId")}
                          error={!!errors.venueId}
                          helperText={errors?.venueId ? "Venue Id  is Required !!!" : null}
                        />
                      </div> */}
                      {/* zone */}
                      <div>
                        <FormControl
                          variant="standard"
                          error={!!errors.zoneName}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="zone" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: 220 }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="zoneName"
                              >
                                {zoneNames &&
                                  zoneNames.map((zoneName, index) => {
                                    return (
                                      <MenuItem key={index} value={zoneName.id}>
                                        {language == "en"
                                          ? zoneName?.zoneName
                                          : zoneName?.zoneNameMr}
                                      </MenuItem>
                                    );
                                  })}
                              </Select>
                            )}
                            name="zoneName"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.zoneName ? errors.zoneName.message : null}
                          </FormHelperText>
                        </FormControl>
                      </div>
                      {/* ward */}
                      <div>
                        <FormControl
                          variant="standard"
                          error={!!errors.wardName}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="ward" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: 220 }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="wardName"
                              >
                                {wardNames &&
                                  wardNames.map((wardName, index) => {
                                    return (
                                      <MenuItem key={index} value={wardName.id}>
                                        {language == "en"
                                          ? wardName?.wardName
                                          : wardName?.wardNameMr}
                                      </MenuItem>
                                    );
                                  })}
                              </Select>
                            )}
                            name="wardName"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.wardName ? errors.wardName.message : null}
                          </FormHelperText>
                        </FormControl>
                      </div>
                      {/* Facility Type */}
                      <div>
                        <FormControl
                          variant="standard"
                          error={!!errors.facilityType}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="facilityType" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: 220 }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                  console.log("value: ", value.target.value);
                                  setSelectedFacilityType(value.target.value);
                                  setDisableKadhnariState(false);
                                }}
                                label="facilityType"
                              >
                                {facilityTypess &&
                                  facilityTypess.map((facilityType, index) => (
                                    <MenuItem
                                      key={index}
                                      value={facilityType.id}
                                    >
                                      {language == "en"
                                        ? facilityType?.facilityType
                                        : facilityType?.facilityTypeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="facilityType"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.facilityType
                              ? errors.facilityType.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </div>
                    </div>
                    <div className={styles.row}>
                      {/* <div>
                          <TextField
                            id="standard-basic"
                            // label={<FormattedLabel id="department" />}
                            label="Department"
                            variant="standard"
                            // value="Sports Department"
                            {...register("department")}
                            error={!!errors.department}
                            helperText={
                              errors?.department
                                ? "Department  is Required !!!"
                                : null
                            }
                          />
                        </div> */}

                      {/* <div>
                        <FormControl
                          variant="standard"
                          error={!!errors.department}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="department" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: 220 }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="department"
                              >
                                {departments &&
                                  departments.map((department, index) => (
                                    <MenuItem key={index} value={department.id}>
                                      {department.department}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="department"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.department ? errors.department.message : null}
                          </FormHelperText>
                        </FormControl>
                      </div> */}
                      {/* <div>
                        <FormControl
                          variant="standard"
                          error={!!errors.subDepartment}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="subDepartment" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: 220 }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="subDepartment"
                              >
                                {subDepartments &&
                                  subDepartments
                                    // .filter((sub) => {
                                    //   return (
                                    //     sub.department === selectedDepartment
                                    //   );
                                    // })
                                    .map((subDepartmentName, index) => (
                                      <MenuItem key={index} value={subDepartmentName.id}>
                                        {subDepartmentName.subDepartmentName}
                                      </MenuItem>
                                    ))}
                              </Select>
                            )}
                            name="subDepartment"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.subDepartment ? errors.subDepartment.message : null}
                          </FormHelperText>
                        </FormControl>
                      </div> */}

                      <div>
                        <FormControl
                          variant="standard"
                          error={!!errors.facilityName}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="facilityName" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: 220 }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="facilityName"
                                // disabled={disableKadhnariState}
                              >
                                {facilityNames &&
                                  facilityNames
                                    .filter((facility) => {
                                      // return facility.facilityType === selectedFacilityType;
                                      return (
                                        facility.facilityType ===
                                        watch("facilityType")
                                      );
                                    })
                                    .map((facilityName, index) => (
                                      <MenuItem
                                        key={index}
                                        value={facilityName.id}
                                      >
                                        {language == "en"
                                          ? facilityName?.facilityName
                                          : facilityName?.facilityNameMr}
                                      </MenuItem>
                                    ))}
                              </Select>
                            )}
                            name="facilityName"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.facilityName
                              ? errors.facilityName.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </div>
                      <div>
                        <TextField
                          sx={{ width: 220 }}
                          id="standard-basic"
                          label={<FormattedLabel id="venue" />}
                          // label="Venue Name (EN)"
                          variant="standard"
                          {...register("venue")}
                          error={!!errors.venue}
                          helperText={
                            errors?.venue ? "Venue Name is Required !!!" : null
                          }
                        />
                      </div>
                      <div>
                        <TextField
                          sx={{ width: 220 }}
                          id="standard-basic"
                          label={<FormattedLabel id="venueMr" />}
                          // label="Venue Name (MR)"
                          variant="standard"
                          {...register("venueMr")}
                          error={!!errors.venue}
                          helperText={
                            errors?.venue ? "Venue Name is Required !!!" : null
                          }
                        />
                      </div>
                    </div>

                    <div className={styles.row}>
                      <div>
                        <FormControl variant="standard" error={!!errors.unit}>
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="unit" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: 220 }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="unitId"
                              >
                                {unit &&
                                  unit.map((unit, index) => {
                                    return (
                                      <MenuItem key={index} value={unit.id}>
                                        {language == "en"
                                          ? unit?.unit
                                          : unit?.unitMr}
                                      </MenuItem>
                                    );
                                  })}
                              </Select>
                            )}
                            name="unitId"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.unit ? errors.unit.message : null}
                          </FormHelperText>
                        </FormControl>
                      </div>

                      <div>
                        <FormControl
                          variant="standard"
                          error={!!errors.section}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="noOfSections" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: 220 }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                  setNumberSection(value.target.value);
                                }}
                                label="section"
                              >
                                <MenuItem value="1">1</MenuItem>
                                <MenuItem value="2">2</MenuItem>
                                <MenuItem value="3">3</MenuItem>
                                <MenuItem value="4">4</MenuItem>
                                <MenuItem value="5">5</MenuItem>
                              </Select>
                            )}
                            name="section"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.section ? errors.section.message : null}
                          </FormHelperText>
                        </FormControl>
                      </div>
                    </div>

                    <div>
                      <div className={styles.sections}>
                        <div className={styles.sectionOne}>
                          {/* /////////////////////////////////////////////////////////////////////////////// */}
                          {numberSection === "1" && (
                            <>
                              <h2 className={styles.new}>Section 1</h2>

                              <div>
                                <FormControl
                                  variant="standard"
                                  error={!!errors.section}
                                >
                                  <InputLabel id="demo-simple-select-standard-label">
                                    {/* <FormattedLabel id="noOfSections" /> */}
                                    No. of Court
                                  </InputLabel>
                                  <Controller
                                    render={({ field }) => (
                                      <Select
                                        sx={{ minWidth: 220 }}
                                        labelId="demo-simple-select-standard-label"
                                        id="demo-simple-select-standard"
                                        value={field.value}
                                        onChange={(value) => {
                                          field.onChange(value);
                                          setNumberCourt(value.target.value);
                                        }}
                                        label="section"
                                      >
                                        <MenuItem value="6">1</MenuItem>
                                        <MenuItem value="7">2</MenuItem>
                                        <MenuItem value="8">3</MenuItem>
                                        <MenuItem value="9">4</MenuItem>
                                        <MenuItem value="10">5</MenuItem>
                                      </Select>
                                    )}
                                    name="section"
                                    control={control}
                                    defaultValue=""
                                  />
                                  <FormHelperText>
                                    {errors?.section
                                      ? errors.section.message
                                      : null}
                                  </FormHelperText>
                                </FormControl>
                              </div>

                              <div>
                                {numberCourt === "6" && (
                                  <>
                                    <div>
                                      <TextField
                                        sx={{ width: 220 }}
                                        id="standard-basic"
                                        //   label={<FormattedLabel id="venueAddressEn" />}
                                        label=" Court 1 : Capacity"
                                        variant="standard"
                                        {...register("address")}
                                        error={!!errors.venue}
                                        helperText={
                                          errors?.venue
                                            ? "Venue Name is Required !!!"
                                            : null
                                        }
                                      />
                                    </div>
                                  </>
                                )}
                              </div>

                              {numberCourt === "7" && (
                                <>
                                  <div>
                                    <TextField
                                      sx={{ width: 220 }}
                                      id="standard-basic"
                                      //   label={<FormattedLabel id="venueAddressEn" />}
                                      label=" Court 1 : Capacity"
                                      variant="standard"
                                      {...register("address")}
                                      error={!!errors.venue}
                                      helperText={
                                        errors?.venue
                                          ? "Venue Name is Required !!!"
                                          : null
                                      }
                                    />
                                  </div>
                                  <div>
                                    <TextField
                                      sx={{ width: 220 }}
                                      id="standard-basic"
                                      //   label={<FormattedLabel id="venueAddressEn" />}
                                      label=" Court 2 : Capacity"
                                      variant="standard"
                                      {...register("address")}
                                      error={!!errors.venue}
                                      helperText={
                                        errors?.venue
                                          ? "Venue Name is Required !!!"
                                          : null
                                      }
                                    />
                                  </div>
                                </>
                              )}
                            </>
                          )}

                          {/* ///////////////////////////////////////////////////////////////////////////////////////////// */}
                        </div>
                      </div>
                    </div>
                    {/* ////////////////////////////////////////////////////////////////////////////////////// */}

                    <div>
                      <div>
                        <div className={styles.sectionOne}>
                          {/* /////////////////////////////////////////////////////////////////////////////// */}
                          {numberSection === "2" && (
                            <>
                              <div className={styles.forSectionTwo}>
                                <div className={styles.sectionOne}>
                                  <h2 className={styles.new}>Section 1</h2>

                                  <div>
                                    <FormControl
                                      variant="standard"
                                      error={!!errors.section}
                                    >
                                      <InputLabel id="demo-simple-select-standard-label">
                                        {/* <FormattedLabel id="noOfSections" /> */}
                                        No. of Court
                                      </InputLabel>
                                      <Controller
                                        render={({ field }) => (
                                          <Select
                                            sx={{ minWidth: 220 }}
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={field.value}
                                            onChange={(value) => {
                                              field.onChange(value);
                                              setNumberCourt(
                                                value.target.value,
                                              );
                                            }}
                                            label="section"
                                          >
                                            <MenuItem value="66">1</MenuItem>
                                            <MenuItem value="77">2</MenuItem>
                                            <MenuItem value="88">3</MenuItem>
                                            <MenuItem value="99">4</MenuItem>
                                            <MenuItem value="1010">5</MenuItem>
                                          </Select>
                                        )}
                                        name="section"
                                        control={control}
                                        defaultValue=""
                                      />
                                      <FormHelperText>
                                        {errors?.section
                                          ? errors.section.message
                                          : null}
                                      </FormHelperText>
                                    </FormControl>
                                  </div>

                                  <div>
                                    {numberCourt === "66" && (
                                      <>
                                        <div>
                                          <TextField
                                            sx={{ width: 220 }}
                                            id="standard-basic"
                                            //   label={<FormattedLabel id="venueAddressEn" />}
                                            label=" Court 1 : Capacity"
                                            variant="standard"
                                            {...register("address")}
                                            error={!!errors.venue}
                                            helperText={
                                              errors?.venue
                                                ? "Venue Name is Required !!!"
                                                : null
                                            }
                                          />
                                        </div>
                                      </>
                                    )}
                                  </div>

                                  {numberCourt === "77" && (
                                    <>
                                      <div>
                                        <TextField
                                          sx={{ width: 220 }}
                                          id="standard-basic"
                                          //   label={<FormattedLabel id="venueAddressEn" />}
                                          label=" Court 1 : Capacity"
                                          variant="standard"
                                          {...register("address")}
                                          error={!!errors.venue}
                                          helperText={
                                            errors?.venue
                                              ? "Venue Name is Required !!!"
                                              : null
                                          }
                                        />
                                      </div>
                                      <div>
                                        <TextField
                                          sx={{ width: 220 }}
                                          id="standard-basic"
                                          //   label={<FormattedLabel id="venueAddressEn" />}
                                          label=" Court 2 : Capacity"
                                          variant="standard"
                                          {...register("address")}
                                          error={!!errors.venue}
                                          helperText={
                                            errors?.venue
                                              ? "Venue Name is Required !!!"
                                              : null
                                          }
                                        />
                                      </div>
                                    </>
                                  )}
                                </div>

                                {/* ////for section 2 */}
                                <div className={styles.forSectionTwo}>
                                  <div className={styles.sectionOne}>
                                    <h2 className={styles.new}>Section 2</h2>

                                    <div>
                                      <FormControl
                                        variant="standard"
                                        error={!!errors.section}
                                      >
                                        <InputLabel id="demo-simple-select-standard-label">
                                          {/* <FormattedLabel id="noOfSections" /> */}
                                          No. of Court
                                        </InputLabel>
                                        <Controller
                                          render={({ field }) => (
                                            <Select
                                              sx={{ minWidth: 220 }}
                                              labelId="demo-simple-select-standard-label"
                                              id="demo-simple-select-standard"
                                              value={field.value}
                                              onChange={(value) => {
                                                field.onChange(value);
                                                setNumberCourtt(
                                                  value.target.value,
                                                );
                                              }}
                                              label="sectionn"
                                            >
                                              <MenuItem value="666">1</MenuItem>
                                              <MenuItem value="777">2</MenuItem>
                                              <MenuItem value="888">3</MenuItem>
                                              <MenuItem value="999">4</MenuItem>
                                              <MenuItem value="101010">
                                                5
                                              </MenuItem>
                                            </Select>
                                          )}
                                          name="sectionn"
                                          control={control}
                                          defaultValue=""
                                        />
                                        <FormHelperText>
                                          {errors?.section
                                            ? errors.section.message
                                            : null}
                                        </FormHelperText>
                                      </FormControl>
                                    </div>

                                    <div>
                                      {numberCourtt === "666" && (
                                        <>
                                          <div>
                                            <TextField
                                              sx={{ width: 220 }}
                                              id="standard-basic"
                                              //   label={<FormattedLabel id="venueAddressEn" />}
                                              label=" Court 1 : Capacity"
                                              variant="standard"
                                              {...register("address")}
                                              error={!!errors.venue}
                                              helperText={
                                                errors?.venue
                                                  ? "Venue Name is Required !!!"
                                                  : null
                                              }
                                            />
                                          </div>
                                        </>
                                      )}
                                    </div>

                                    {numberCourtt === "777" && (
                                      <>
                                        <div>
                                          <TextField
                                            sx={{ width: 220 }}
                                            id="standard-basic"
                                            //   label={<FormattedLabel id="venueAddressEn" />}
                                            label=" Court 1 : Capacity"
                                            variant="standard"
                                            {...register("address")}
                                            error={!!errors.venue}
                                            helperText={
                                              errors?.venue
                                                ? "Venue Name is Required !!!"
                                                : null
                                            }
                                          />
                                        </div>
                                        <div>
                                          <TextField
                                            sx={{ width: 220 }}
                                            id="standard-basic"
                                            //   label={<FormattedLabel id="venueAddressEn" />}
                                            label=" Court 2 : Capacity"
                                            variant="standard"
                                            {...register("address")}
                                            error={!!errors.venue}
                                            helperText={
                                              errors?.venue
                                                ? "Venue Name is Required !!!"
                                                : null
                                            }
                                          />
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </>
                          )}

                          {/* ///////////////////////////////////////////////////////////////////////////////////////////// */}
                        </div>
                      </div>
                    </div>

                    {/* ///////////////////////////////////////////////////////////////////////// */}

                    <div className={styles.row}>
                      <div>
                        <TextField
                          sx={{ width: 220 }}
                          id="standard-basic"
                          label={<FormattedLabel id="venueAddressEn" />}
                          // label="Venue Address (EN)"
                          variant="standard"
                          {...register("address")}
                          error={!!errors.venue}
                          helperText={
                            errors?.venue ? "Venue Name is Required !!!" : null
                          }
                        />
                      </div>
                      <div>
                        <TextField
                          sx={{ width: 220 }}
                          id="standard-basic"
                          label={<FormattedLabel id="venueAddressMr" />}
                          // label="Venue Address (MR)"
                          variant="standard"
                          {...register("addressMr")}
                          error={!!errors.venue}
                          helperText={
                            errors?.venue ? "Venue Name is Required !!!" : null
                          }
                        />
                      </div>
                      <div>
                        <TextField
                          sx={{ width: 220 }}
                          id="standard-basic"
                          label={<FormattedLabel id="contactPersonName" />}
                          // label="Contact Person Name (EN)"
                          variant="standard"
                          {...register("contactPersonName")}
                          error={!!errors.venue}
                          helperText={
                            errors?.venue ? "Venue Name is Required !!!" : null
                          }
                        />
                      </div>
                    </div>
                    <div className={styles.row}>
                      <div>
                        <TextField
                          sx={{ width: 220 }}
                          id="standard-basic"
                          label={<FormattedLabel id="contactPersonNameMr" />}
                          // label="Contact Person Name (MR)"
                          variant="standard"
                          {...register("contactPersonNameMr")}
                          error={!!errors.venue}
                          helperText={
                            errors?.venue ? "Venue Name is Required !!!" : null
                          }
                        />
                      </div>
                      <div>
                        <TextField
                          sx={{ width: 220 }}
                          id="standard-basic"
                          label={<FormattedLabel id="contactPersonMobileNo" />}
                          // label="Contact Person Mobile No."
                          variant="standard"
                          {...register("contactPersonMobileNo")}
                          error={!!errors.venue}
                          helperText={
                            errors?.venue ? "Venue Name is Required !!!" : null
                          }
                        />
                      </div>
                      <div>
                        <TextField
                          sx={{ width: 220 }}
                          id="standard-basic"
                          label={<FormattedLabel id="remark" />}
                          // label="Remark (EN)"
                          variant="standard"
                          {...register("remark")}
                          error={!!errors.venue}
                          helperText={
                            errors?.venue ? "Venue Name is Required !!!" : null
                          }
                        />
                      </div>
                    </div>
                    <div className={styles.row}>
                      <div>
                        <TextField
                          sx={{ width: 220 }}
                          id="standard-basic"
                          label={<FormattedLabel id="remarkMr" />}
                          // label="Remark (MR)"
                          variant="standard"
                          {...register("remarkMr")}
                          error={!!errors.venue}
                          helperText={
                            errors?.venue ? "Venue Name is Required !!!" : null
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.btn}>
                    {/* <Button
                      sx={{ marginRight: 8 }}
                      type="submit"
                      variant="contained"
                      color="success"
                      endIcon={<SaveIcon />}
                    >
                      {btnSaveText}
                      
                    </Button> */}
                    <Button
                      type="submit"
                      variant="contained"
                      color="success"
                      endIcon={<SaveIcon />}
                    >
                      {btnSaveText == "Save" ? (
                        <FormattedLabel id="save" />
                      ) : (
                        <FormattedLabel id="update" />
                      )}
                    </Button>
                    <Button
                      sx={{ marginRight: 8 }}
                      variant="contained"
                      color="primary"
                      endIcon={<ClearIcon />}
                      onClick={() => cancellButton()}
                    >
                      <FormattedLabel id="clear" />
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => exitButton()}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
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
        <DataGrid
          disableColumnFilter
          disableColumnSelector
          // disableToolbarButton
          disableDensitySelector
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
              printOptions: { disableToolbarButton: true },
              // disableExport: true,
              // disableToolbarButton: true,
              csvOptions: { disableToolbarButton: true },
            },
          }}
          autoHeight
          sx={{
            // marginLeft: 5,
            // marginRight: 5,
            // marginTop: 5,
            // marginBottom: 5,

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
          // rows={dataSource}
          // columns={columns}
          // pageSize={5}
          // rowsPerPageOptions={[5]}
          //checkboxSelection

          density="compact"
          // autoHeight={true}
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
            getCaseType(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            console.log("222", _data);
            // updateData("page", 1);
            getCaseType(_data, data.page);
          }}
        />
      </Paper>
    </>
  );
};

export default Index;
