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
import { useRouter } from "next/router";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import {
  Box,
  Button,
  Grid,
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
import schema from "../../../../containers/schema/sportsPortalSchema/facilityTypeSchema";
import styles from "../../../../styles/sportsPortalStyles/facilityCheck.module.css";
import Transliteration from "../../../../components/common/linguosol/transliteration";
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
  const methods = useForm({
    defaultValues: {},
    mode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });

  const {
    watch,
    setValue,
    getValues,
    register,
    handleSubmit,
    control,
    unregister,
    reset,
    formState: { errors },
  } = methods;

  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   methods,
  //   watch,
  //   reset,
  //   setValue,
  //   getValues,
  //   formState: { errors },
  // } = useForm({
  //   criteriaMode: "all",
  //   resolver: yupResolver(schema),
  //   mode: "onChange",
  // });
  useLayoutEffect(() => {
    console.log("btnSaveText", btnSaveText);
  }, [btnSaveText]);

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [temp1, setTemp1] = useState();
  const router = useRouter();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [slideChecked, setSlideChecked] = useState(false);
  const [zoneNames, setZoneNames] = useState([]);

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    if (router.query.pageMode != "Add") setTemp1(getValues("zoneKey"));
  }, [getValues("zoneName")]);

  useEffect(() => {
    if (temp1) getWardNames();
  }, [temp1]);

  // wardKeys
  const [wardNames, setWardNames] = useState([]);

  // getWardKeys
  const getWardNames = () => {
    axios
      .get(
        `${
          URLS.CFCURL
        }/master/zoneAndWardLevelMapping/getWardByDepartmentId?departmentId=${2}&zoneId=${temp1}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((r) => {
        setWardNames(
          r.data.map((row) => ({
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

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getType();
  }, [zoneNames, wardNames, fetchData]);

  useEffect(() => {
    getAllTypes();
    getWardNames();
  }, []);

  const onSubmitForm = (fromData) => {
    console.log("clicked");
    // Save - DB
    let _body = {
      ...fromData,
      // activeFlag: btnSaveText === 'update' ? null : fromData.activeFlag,
    };
    if (btnSaveText === "Save") {
      const tempData = axios
        .post(`${URLS.SPURL}/facilityType/saveFacilityType`, _body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
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
        .post(`${URLS.SPURL}/facilityType/saveFacilityType`, _body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("res", res);
          // if (res.status == 200) {
          //   fromData.id
          //     ? sweetAlert(
          //         "Updated!",
          //         "Record Updated successfully !",
          //         "success"
          //       )
          //     : sweetAlert("Saved!", "Record Saved successfully !", "success");
          //   getType();
          //   setIsOpenCollapse(false);
          // }

          if (fromData?.id) {
            language == "en"
              ? sweetAlert({
                  title: "Updated!",
                  text: "Record Updated successfully!",
                  icon: "success",
                  button: "Ok",
                })
              : sweetAlert({
                  title: "अपडेट केले!",
                  text: "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
                  icon: "success",
                  button: "ओके",
                });
            getType();
            setIsOpenCollapse(false);
          } else {
            language == "en"
              ? sweetAlert({
                  title: "Saved!",
                  text: "Record Saved successfully!",
                  icon: "success",
                  button: "Ok",
                })
              : sweetAlert({
                  title: "जतन केले!",
                  text: "रेकॉर्ड यशस्वीरित्या जतन केले!",
                  icon: "success",
                  button: "ओके",
                });

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
            .post(`${URLS.SPURL}/facilityType/saveFacilityType`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                // swal("Record is Successfully Deleted!", {
                //   icon: "success",
                // });
                language == "en"
                  ? swal("Record is Successfully Deleted!")
                  : swal("रेकॉर्ड यशस्वीरित्या हटवले आहे!");
                getType();
                // setButtonInputState(false);
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            });
        } else if (willDelete == null) {
          // swal("Record is Safe");
          language == "en"
            ? swal("Record is Safe")
            : swal("रेकॉर्ड सुरक्षित आहे");
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
            .post(`${URLS.SPURL}/facilityType/saveFacilityType`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                // swal("Record is Successfully Deleted!", {
                //   icon: "success",
                // });
                language == "en"
                  ? swal("Record is Successfully Deleted!")
                  : swal("रेकॉर्ड यशस्वीरित्या हटवले आहे!");
                // getPaymentRate();
                getType();
                // setButtonInputState(false);
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            });
        } else if (willDelete == null) {
          // swal("Record is Safe");
          language == "en"
            ? swal("Record is Safe")
            : swal("रेकॉर्ड सुरक्षित आहे");
        }
      });
    }
  };
  // Get Table - Data
  const getType = (_pageSize = 10, _pageNo = 0, _sortDir = "desc") => {
    axios
      .get(
        `${URLS.SPURL}/facilityType/getAll`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        {
          params: {
            pageSize: _pageSize,
            pageNo: _pageNo,
            sortDir: _sortDir,
          },
        },
      )
      .then((r) => {
        console.log(";r", r);
        let result = r.data.facilityType;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log("44");
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,

            id: r.id,
            srNo: i + 1,
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

            // wardName: wardNames?.find((obj) => obj?.id === r.wardName)?.wardNameMr,
            // department: departments?.find((obj) => obj?.id === r.department)?.department,
            // subDepartment: subDepartments?.find((obj) => obj?.id === r.subDepartment)?.subDepartment,

            facilityType: r.facilityType,
            facilityTypeMr: r.facilityTypeMr,
            facilityPrefix: r.facilityPrefix,
            facilityId: r.facilityId,
            remark: r.remark,

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
    remark: "",
    geoCode: "",
    department: "",
    subDepartment: "",
    facilityType: "",
    wardName: "",
    zoneName: "",
    facilityTypeId: "",
    id: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    remark: "",
    geoCode: "",
    department: "",
    subDepartment: "",
    facilityType: "",
    wardName: "",
    zoneName: "",
    facilityTypeId: "",
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
    //   field: language === "en" ? "zoneName" : "zoneNameMr",
    //   headerName: <FormattedLabel id="zone" />,
    //   flex: 1,
    // },

    // {
    //   field: language === "en" ? "wardName" : "wardNameMr",
    //   headerName: <FormattedLabel id="ward" />,
    //   flex: 1,
    // },

    {
      field: "facilityType",
      headerName: <FormattedLabel id="facilityTypeEnglish" />,
      //type: "number",
      flex: 1,
    },
    {
      field: "facilityTypeMr",
      // headerName: "Facility Type (Marathi)",
      headerName: <FormattedLabel id="facilityTypeMr" />,
      //type: "number",
      flex: 1,
    },

    {
      field: "geoCode",
      headerName: <FormattedLabel id="gisCode" />,
      //type: "number",
      flex: 1,
    },

    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
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
                console.log("param", params);
                setBtnSaveText("update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);

                const zoneId = zoneNames.find(
                  (obj) => obj?.zoneName === params.row.zoneName,
                )?.id;
                const wardId = wardNames.find(
                  (obj) => obj?.wardName === params.row.wardName,
                )?.id;
                const facilityTypeIdd = params.row.id;
                reset({
                  ...params.row,
                  wardName: wardId,
                  zoneName: zoneId,
                  facilityTypeId: facilityTypeIdd,
                });
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>

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
          <strong>{<FormattedLabel id="facilityTypeMaster" />}</strong>
        </div>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <Grid
                    container
                    sx={{
                      marginLeft: 5,
                      marginTop: 1,
                      marginBottom: 5,
                      align: "center",
                    }}
                  >
                    {/* Facility Type */}
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      {/* <TextField
                        sx={{ width: 220 }}
                        id="standard-basic"
                        label={<FormattedLabel id="facilityType" />}
                        variant="standard"
                        {...register("facilityType")}
                        error={!!errors.facilityType}
                        helperText={
                          errors?.facilityType
                            ? "Facility Type is Required !!!"
                            : null
                        }
                      /> */}
                      <Transliteration
                        _key={"facilityType"}
                        labelName={"facilityType"}
                        fieldName={"facilityType"}
                        updateFieldName={"facilityTypeMr"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        variant="standard"
                        label={<FormattedLabel id="facilityType" required />}
                        InputLabelProps={{
                          shrink: watch("facilityType") ? true : false,
                        }}
                        width={220}
                        error={!!errors.facilityType}
                        helperText={
                          errors?.facilityType
                            ? errors.facilityType.message
                            : null
                        }
                      />
                    </Grid>

                    {/* Facility Type (Marathi) */}
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <TextField
                        sx={{ width: 220 }}
                        id="standard-basic"
                        label={<FormattedLabel id="facilityTypeMr" required />}
                        variant="standard"
                        {...register("facilityTypeMr")}
                        InputLabelProps={{
                          shrink: watch("facilityTypeMr") ? true : false,
                        }}
                        error={!!errors.facilityTypeMr}
                        helperText={
                          errors?.facilityTypeMr
                            ? "Must be only characters / फक्त शब्दात"
                            : null
                        }
                      />
                    </Grid>

                    {/* GIS Code */}
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <TextField
                        sx={{ width: 220 }}
                        id="standard-basic"
                        label={<FormattedLabel id="gisCode" />}
                        variant="standard"
                        {...register("geoCode")}
                        error={!!errors.geoCode}
                        helperText={
                          errors?.geoCode ? (
                            <FormattedLabel id="VgisCode" />
                          ) : null
                        }
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <TextField
                        sx={{ width: 220 }}
                        id="standard-basic"
                        label={<FormattedLabel id="remark" />}
                        variant="standard"
                        {...register("remark")}
                        error={!!errors.remark}
                        helperText={
                          errors?.remark ? (
                            <FormattedLabel id="Vcapacity" />
                          ) : null
                        }
                      />
                    </Grid>
                  </Grid>

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
