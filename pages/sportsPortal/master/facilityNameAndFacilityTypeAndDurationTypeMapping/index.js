import { yupResolver } from "@hookform/resolvers/yup";
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
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
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
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import schema from "../../../../containers/schema/sportsPortalSchema/mappingSchema";
import styles from "../../../../styles/sportsPortalStyles/facilityCheck.module.css";
import URLS from "../../../../URLS/urls";
import { catchExceptionHandlingMethod } from "../../../../util/util";

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
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  useLayoutEffect(() => {
    console.log("btnSaveText", btnSaveText);
  }, [btnSaveText]);

  const [btnSaveText, setBtnSaveText] = useState("save");
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [slideChecked, setSlideChecked] = useState(false);
  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);

  const [facilityTypess, setFacilityTypess] = useState([]);
  const [durationTypess, setDurationTypess] = useState([]);
  const [facilityNames, setFacilityNames] = useState([]);

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const getFacilityName = () => {
    axios
      .get(`${URLS.SPURL}/facilityName/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
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
      .get(`${URLS.SPURL}/facilityType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
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

  const getDurationTypes = () => {
    axios
      .get(`${URLS.SPURL}/master/durationType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setDurationTypess(
          r.data.durationType.map((row) => ({
            id: row.id,
            typeName: row.typeName,
            typeNameMr: row.typeNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getType();
  }, [facilityNames, durationTypess, facilityTypess, fetchData]);

  useEffect(() => {
    getFacilityTypes();
    getFacilityName();
    getDurationTypes();
  }, []);

  const onSubmitForm = (fromData) => {
    // alert("hi");

    console.log("clicked");
    // console.log('submitted form:', fromData);
    // Save - DB
    let _body = {
      ...fromData,
      // activeFlag: btnSaveText === 'update' ? null : fromData.activeFlag,
    };
    if (btnSaveText === "Save") {
      const tempData = axios
        .post(
          `${URLS.SPURL}/master/facilityNameAndFacilityTypeAndDurationTypeMapping/save`,
          _body,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
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
      console.log("update data", _body);
      // const tempData = axios
      axios
        .post(
          `${URLS.SPURL}/master/facilityNameAndFacilityTypeAndDurationTypeMapping/save`,
          _body,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
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
            getType();

            setIsOpenCollapse(false);
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  const getAllTypes = () => {
    axios
      .get(`${URLS.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
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

  // const getDepartments = () => {
  //   axios.get(`${URLS.CFCURL}/master/department/getAll`,{headers: {
  // Authorization: `Bearer ${token}`,
  // }}).then((r) => {
  //     setDepartments(
  //       r.data.department.map((row) => ({
  //         id: row.id,
  //         department: row.department,
  //       })),
  //     );
  //   });
  // };
  //git
  //test

  // const getSubDepartments = () => {
  //   axios.get(`${URLS.CFCURL}/master/subDepartment/getAll`).then((r) => {
  //     setSubDepartments(
  //       r.data.subDepartment.map((row) => ({
  //         id: row.id,
  //         subDepartmentName: row.subDepartment,
  //       })),
  //     );
  //   });
  // };

  // Get Data By ID
  // const getDataById = (value) => {
  //   console.log("clicked");
  //   setIsOpenCollapse(false);
  //   setID(value);
  //   const tempData = axios
  //     .get(`${urls.BaseURL}/facilityMaster/getFacilityMasterData/?id=${value}`)
  //     .then((res) => {
  //       console.log(res.data);
  //       reset(res.data);
  //       setButtonInputState(true);
  //       setIsOpenCollapse(true);
  //       setBtnSaveText("Edit");
  //     });
  // };

  // Delete By ID
  // const deleteById = async (value) => {
  //   await axios

  //     .delete(`${urls.BaseURL}/facilityType/discardFacilityType/${value}`)
  //     .then((res) => {
  //       if (res.status == 226) {
  //         message.success("Record Deleted !!!");
  //         getAllDetails();
  //         setButtonInputState(false);
  //       }
  //     });
  // };

  //Delete by ID(SweetAlert)
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      // swal({
      //   title: "Inactivate?",
      //   text: "Are you sure you want to inactivate this Record ? ",
      //   icon: "warning",
      //   buttons: true,
      //   dangerMode: true,
      // })

      swal({
        title: language == "en" ? "Inactivate?" : "निष्क्रिय करायचे?",
        text:
          language == "en"
            ? "Are you sure you want to inactivate this Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता ?",
        icon: "warning",
        buttons: {
          cancel: language === "en" ? "No, Cancel" : "नको, कॅन्सेल",
          confirm: language === "en" ? "Yes, Inactivate" : "होय, निष्क्रिय करा",
        },
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(
              `${URLS.SPURL}/master/facilityNameAndFacilityTypeAndDurationTypeMapping/save`,
              body,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            )
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getType();
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
      // swal({
      //   title: "Activate?",
      //   text: "Are you sure you want to activate this Record ? ",
      //   icon: "warning",
      //   buttons: true,
      //   dangerMode: true,
      // })

      swal({
        title: language == "en" ? "Activate?" : "सक्रिय करा",
        text:
          language == "en"
            ? "Are you sure you want to activate this Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता ?",
        icon: "warning",
        buttons: {
          cancel: language === "en" ? "No, Cancel" : "नको, कॅन्सेल",
          confirm: language === "en" ? "Yes, Activate" : "होय, सक्रिय करा",
        },
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(
              `${URLS.SPURL}/master/facilityNameAndFacilityTypeAndDurationTypeMapping/save`,
              body,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            )
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                // getPaymentRate();
                getType();
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
  const getType = (_pageSize = 10, _pageNo = 0, _sortDir = "desc") => {
    axios
      .get(
        `${URLS.SPURL}/master/facilityNameAndFacilityTypeAndDurationTypeMapping/getAll`,
        {
          params: {
            pageSize: _pageSize,
            pageNo: _pageNo,
            sortDir: _sortDir,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((r) => {
        console.log(";r", r);
        let result = r.data.facilityNameAndFacilityTypeAndDurationTypeMapping;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log("44");
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,

            id: r.id,
            srNo: i + 1,
            // facilityType: r.facilityType,
            // facilityName: r.facilityName,
            // durationType: r.durationType,
            facilityType: facilityTypess?.find(
              (obj) => obj?.id === r.facilityType,
            )?.facilityType,
            durationType: durationTypess?.find(
              (obj) => obj?.id === r.durationType,
            )?.typeName,
            facilityName: facilityNames?.find(
              (obj) => obj?.id === r.facilityName,
            )?.facilityName,
            facilityNameMr: facilityNames?.find(
              (obj) => obj?.id === r.facilityName,
            )?.facilityNameMr,
            facilityTypeMr: facilityTypess?.find(
              (obj) => obj?.id === r.facilityType,
            )?.facilityTypeMr,
            durationTypeMr: durationTypess?.find(
              (obj) => obj?.id === r.durationType,
            )?.typeNameMr,

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

  // add like department onSubmit form
  // const onSubmitForm = (formData) => {
  //   console.log('submitted formData', formData);
  //   // const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
  //   // const toDate = moment(formData.toDate).format("YYYY-MM-DD");
  //   const finalBodyForApi = {
  //     ...formData,
  //     // fromDate,
  //     // toDate,
  //   };

  //   console.log('finalBodyForApi', finalBodyForApi);

  //   axios
  //     .post(
  //       `${URLS.SPURL}/facilityType/saveFacilityType`,
  //       finalBodyForApi
  //     )
  //     .then((res) => {
  //       console.log('save data', res);
  //       if (res.status == 200) {
  //         formData.id
  //           ? sweetAlert('Updated!', 'Record Updated successfully !', 'success')
  //           : sweetAlert('Saved!', 'Record Saved successfully !', 'success');
  //         // getDepartment();
  //         getType();
  //         // setButtonInputState(false);
  //         setIsOpenCollapse(false);
  //         setEditButtonInputState(false);
  //         setDeleteButtonState(false);
  //       }
  //     });
  // };
  // OnSubmit Form

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
    typeNameMr: "",
    typeName: "",
    id: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    typeNameMr: "",
    typeName: "",
    id: "",
  };

  // Get Table - Data
  // const getAllDetails = () => {
  //   axios
  //     .get(`${URLS.SPURL}/facilityType/getAll`)
  //     .then((res) => {
  //       setDataSource(
  //         res.data.facilityType.map((r, i) => ({
  //           id: r.id,
  //           srNo: i + 1,
  //           facilityTypeId: r.facilityTypeId,
  //           geoCode: r.geoCode,
  //           zoneName: zoneNames?.find((obj) => obj?.id === r.zoneName)
  //             ?.zoneName,
  //           wardName: wardNames?.find((obj) => obj?.id === r.wardName)
  //             ?.wardName,
  //           department: departments?.find((obj) => obj?.id === r.department)
  //             ?.department,
  //           subDepartment: subDepartments?.find(
  //             (obj) => obj?.id === r.subDepartment
  //           )?.subDepartment,

  //           facilityType: r.facilityType,
  //           facilityPrefix: r.facilityPrefix,
  //           facilityId: r.facilityId,
  //           remark: r.remark,
  //         }))
  //       );
  //     });
  // };

  // define colums table
  // const columns = [
  //   {
  //     field: "srNo",
  //     headerName: <FormattedLabel id="srNo" />,
  //     flex: 1,
  //   },
  //   // {
  //   //   field: "facilityTypeId",
  //   //   headerName: <FormattedLabel id=" Facility Type Id" />,
  //   //   //type: "number",
  //   //   flex: 1,
  //   // },

  //   {
  //     field: "zoneName",
  //     headerName: <FormattedLabel id="zone" />,
  //     //type: "number",
  //     flex: 1,
  //   },

  //   {
  //     field: "wardName",
  //     headerName: <FormattedLabel id="ward" />,
  //     //type: "number",
  //     flex: 1,
  //   },

  //   {
  //     field: "department",
  //     headerName: <FormattedLabel id="department" />,
  //     //type: "number",
  //     flex: 1,
  //   },
  //   {
  //     field: "facilityType",
  //     headerName: <FormattedLabel id="facilityType" />,
  //     //type: "number",
  //     flex: 1,
  //   },

  //   {
  //     field: "geoCode",
  //     headerName: <FormattedLabel id="gisCode" />,
  //     //type: "number",
  //     flex: 1,
  //   },

  //   {
  //     field: "remark",
  //     headerName: <FormattedLabel id="remark" />,
  //     flex: 1,
  //   },

  //   {
  //     field: "actions",
  //     headerName: <FormattedLabel id="actions" />,
  //     width: 120,
  //     sortable: false,
  //     disableColumnMenu: true,
  //     renderCell: (params) => {
  //       return (
  //         <Box
  //           sx={{
  //             // backgroundColor: "whitesmoke",
  //             width: "100%",
  //             height: "100%",
  //             display: "flex",
  //             justifyContent: "center",
  //             alignItems: "center",
  //           }}
  //         >
  //           <IconButton
  //             disabled={editButtonInputState}
  //             onClick={() => {
  //               setBtnSaveText("Edit"),
  //                 // console.log(
  //                 //   "Hey ward name la pathvtiye: ",
  //                 //   params.row.wardName
  //                 // );

  //                 setID(params.row.id),
  //                 setIsOpenCollapse(true),
  //                 setSlideChecked(true);

  //               const wardId = wardNames.find(
  //                 (obj) => obj?.wardName === params.row.wardName
  //               )?.id;

  //               const zoneId = zoneNames.find(
  //                 (obj) => obj?.zoneName === params.row.zoneName
  //               )?.id;

  //               const departmentId = departments.find(
  //                 (obj) => obj?.department === params.row.department
  //               )?.id;

  //               const subDepartmentId = subDepartments.find(
  //                 (obj) => obj?.subDepartment === params.row.subDepartment
  //               )?.id;

  //               reset({
  //                 ...params.row,
  //                 wardName: wardId,
  //                 zoneName: zoneId,
  //                 department: departmentId,
  //                 subDepartment: subDepartmentId,
  //               });
  //             }}
  //           >
  //             <EditIcon />
  //           </IconButton>
  //           <IconButton
  //             disabled={deleteButtonInputState}
  //             onClick={() => deleteById(params.id)}
  //           >
  //             <DeleteIcon />
  //           </IconButton>
  //         </Box>
  //       );
  //     },
  //   },
  // ];

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
    },
    // {
    //   field: "facilityTypeId",
    //   headerName: <FormattedLabel id=" Facility Type Id" />,
    //   //type: "number",
    //   flex: 1,
    // },

    {
      // field: "facilityType",
      field: language === "en" ? "facilityType" : "facilityTypeMr",
      headerName: "Facility Type",
      //type: "number",
      flex: 1,
    },

    {
      // field: "facilityName",
      field: language === "en" ? "facilityName" : "facilityNameMr",
      headerName: "Facility Name ",
      //type: "number",
      flex: 1,
    },
    {
      // field: "durationType",
      field: language === "en" ? "durationType" : "durationTypeMr",
      headerName: "Duration Type ",
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
          <Box>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                const facilityNameId = facilityNames.find(
                  (obj) => obj?.facilityName === params.row.facilityName,
                )?.id;

                const durationId = durationTypess.find(
                  (obj) => obj?.typeName === params.row.durationType,
                )?.id;
                const facilityTypeId = facilityTypess.find(
                  (obj) => obj?.facilityType === params.row.facilityType,
                )?.id;
                reset({
                  ...params.row,
                  facilityName: facilityNameId,
                  durationType: durationId,
                  facilityType: facilityTypeId,
                });

                // console.log('params.row: ', params.row);
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
                setBtnSaveText("Update"),
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
      <Box>
        <BreadcrumbComponent />
      </Box>
      <Paper
        sx={{
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5,
          marginBottom: 5,
          padding: 1,
        }}
      >
        <div
          style={{
            backgroundColor: `#556CD6`,
            color: "white",
            fontSize: 19,
            marginTop: 30,
            marginBottom: 30,
            padding: 8,
            paddingLeft: 30,
            marginLeft: "40px",
            marginRight: "65px",
            borderRadius: 100,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <strong>
            {
              <FormattedLabel id="facilityNameAndFacilityTypeAndDurationTypeMappingMaster" />
            }
          </strong>
        </div>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <div className={styles.main}>
                    <div className={styles.row}>
                      <div>
                        <FormControl
                          variant="standard"
                          error={!!errors.facilityType}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="facilityType" required />
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
                                  // setSelectedFacilityType(value.target.value);
                                  // setDisableKadhnariState(false);
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
                      <div>
                        <FormControl
                          variant="standard"
                          error={!!errors.facilityName}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="facilityName" required />
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
                        <FormControl
                          variant="standard"
                          error={!!errors.durationType}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="durationType" required />
                            {/* Duration Type */}
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
                                  // setSelectedFacilityType(value.target.value);
                                  // setDisableKadhnariState(false);
                                }}
                                label="durationType"
                              >
                                {durationTypess &&
                                  durationTypess.map((durationType, index) => (
                                    // <MenuItem key={index} value={durationType.id}>
                                    //   {durationType.typeName}
                                    // </MenuItem>
                                    <MenuItem
                                      key={index}
                                      value={durationType.id}
                                    >
                                      {language == "en"
                                        ? durationType?.typeName
                                        : durationType?.typeNameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="durationType"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.durationType
                              ? errors.durationType.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </div>
                    </div>
                  </div>

                  <div className={styles.btn}>
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
            {/* Add */}
          </Button>
        </div>
        {/* <DataGrid
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
              printOptions: { disableToolbarButton: true },
             
              csvOptions: { disableToolbarButton: true },
            },
          }}
          autoHeight
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
          pagination
          paginationMode="server"
          rowCount={data.totalRows}
          rowsPerPageOptions={data.rowsPerPageOptions}
          page={data.page}
          pageSize={data.pageSize}
          rows={data.rows}
          columns={columns}
          onPageChange={(_data) => {
            getType(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            console.log("222", _data);
            getType(_data, data.page);
          }}
        /> */}
        <DataGrid
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          autoHeight
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
          pagination
          paginationMode="server"
          rowCount={data.totalRows}
          rowsPerPageOptions={data.rowsPerPageOptions}
          page={data.page}
          pageSize={data.pageSize}
          rows={data.rows}
          columns={columns}
          onPageChange={(_data) => {
            console.log("222", data.pageSize, _data);
            getType(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            getType(data.pageSize, _data);
          }}
        />
      </Paper>
    </>
  );
};

export default Index;
