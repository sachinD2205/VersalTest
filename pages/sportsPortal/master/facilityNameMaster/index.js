import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { GridToolbar } from "@mui/x-data-grid";
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
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import schema from "../../../../containers/schema/sportsPortalSchema/facilityNameSchema";
import styles from "../../../../styles/sportsPortalStyles/facilityCheck.module.css";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import URLS from "../../../../URLS/urls";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// function
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

  const [btnSaveText, setBtnSaveText] = useState("Save");
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

  const [facilityTypess, setFacilityTypess] = useState([]);
  const language = useSelector((state) => state?.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const [temp1, setTemp1] = useState();
  const [selectedFacilityType, setSelectedFacilityType] = useState();

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

  // useEffect(() => {
  //   getAllDetails();
  // }, [
  //   zoneNames,
  //   wardNames,
  //   departments,
  //   subDepartments,
  //   facilityTypess,
  //   fetchData,
  // ]);

  useEffect(() => {
    getAllTypes();
    getWardNames();
    // getDepartments();
    // getSubDepartments();
    getFacilityTypes();
  }, []);

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
  //           `${URLS.SPURL}/facilityName/discardFacilityName/${value}`
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

  // // OnSubmit Form
  // const onSubmitForm = (fromData) => {
  //   console.log("DATA:", fromData);

  //   if (btnSaveText === "Save") {
  //     console.log("Post -----");
  //     const tempData = axios
  //       .post(
  //         `${URLS.SPURL}/facilityName/getAll/saveFacilityName `,
  //         fromData
  //       )
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
  //         `${URLS.SPURL}/facilityName/getAll/saveFacilityName/?id=${id}`,

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
            .post(`${URLS.SPURL}/facilityName/saveFacilityName`, body, {
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
            .post(`${URLS.SPURL}/facilityName/saveFacilityName`, body, {
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
        `${URLS.SPURL}/facilityName/getAll`,
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
        let result = r.data.facilityName;
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

            // facilityNameMr: facilityNames?.find((obj) => obj?.id === r.facilityName)?.facilityNameMr,
            facilityTypeMr: facilityTypess?.find(
              (obj) => obj?.id === r.facilityType,
            )?.facilityTypeMr,

            facilityType: facilityTypess?.find(
              (obj) => obj?.id === r.facilityType,
            )?.facilityType,

            // facilityType: r.facilityType,
            facilityPrefix: r.facilityPrefix,
            facilityId: r.facilityId,
            facilityNameId: i + 1,
            facilityName: r.facilityName,
            facilityNameMr: r.facilityNameMr,
            remark: r.remark,
            remarkMr: r.remarkMr,
            typeOfSports: r.typeOfSports,

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
    console.log("submitted form data", fromData);
    // Save - DB
    let _body = {
      ...fromData,
      // activeFlag: btnSaveText === 'update' ? null : fromData.activeFlag,
    };
    if (btnSaveText === "Save") {
      const tempData = axios
        .post(`${URLS.SPURL}/facilityName/saveFacilityName`, _body, {
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
      // <FormattedLabel id="update" />) {
      const tempData = axios
        .post(`${URLS.SPURL}/facilityName/saveFacilityName`, _body, {
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
    remarkMr: "",
    typeOfSports: "",
    facilityType: "",
    facilityName: "",
    facilityNameMr: "",
    wardName: "",
    zoneName: "",
    facilityNameId: "",
    id: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    remark: "",
    geoCode: "",
    department: "",
    subDepartment: "",
    facilityType: "",
    facilityName: "",
    wardName: "",
    zoneName: "",
    facilityNameId: "",
  };

  // Get Table - Data
  // const getAllDetails = () => {
  //   axios.get(`${URLS.SPURL}/facilityName/getAll`).then((res) => {
  //     console.log("Table Sathi: ", res.data);
  //     setDataSource(
  //       res.data.facilityName.map((r, i) => ({
  //         id: r.id,
  //         srNo: i + 1,
  //         geoCode: r.geoCode,
  //         capacity: r.capacity,
  //         facilityName: r.facilityName,
  //         facilityNameId: r.id,
  //         zoneName: zoneNames?.find((obj) => obj?.id === r.zoneName)?.zoneName,
  //         wardName: wardNames?.find((obj) => obj?.id === r.wardName)?.wardName,
  //         department: departments?.find((obj) => obj?.id === r.department)?.department,
  //         subDepartment: subDepartments?.find((obj) => obj?.id === r.subDepartment)?.subDepartment,
  //         facilityType: facilityTypess?.find((obj) => obj?.id === r.facilityType)?.facilityType,
  //         remark: r.remark,
  //       })),
  //     );
  //   });
  // };

  // useEffect - Reload On update , delete ,Saved on refresh

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 50,
    },
    // {
    //   field: "facilityNameId",
    //   headerName: <FormattedLabel id="facilityNameId" />,
    //   //type: "number",
    //   // flex: 1,
    //   width: 120,
    // },

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
      // field: "facilityType",
      field: language === "en" ? "facilityType" : "facilityTypeMr",
      headerName: <FormattedLabel id="facilityType" />,
      //type: "number",
      flex: 1,
    },
    {
      field: "facilityName",
      headerName: <FormattedLabel id="facilityNameEn" />,
      //type: "number",
      flex: 1,
    },
    {
      field: "facilityNameMr",
      headerName: <FormattedLabel id="facilityNameMr" />,
      //type: "number",
      flex: 1,
    },
    {
      field: "typeOfSports",
      // field: language === "en" ? "wardName" : "wardNameMr",
      headerName: <FormattedLabel id="typeOfSport" />,
      //type: "number",
      flex: 1,
    },
    // {
    //   field: "geoCode",
    //   headerName: <FormattedLabel id="gisCode" />,
    //   flex: 1,
    // },

    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
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

    //             const facilityTypeId = facilityTypess.find(
    //               (obj) => obj?.facilityType === params.row.facilityType
    //             )?.id;

    //             reset({
    //               ...params.row,
    //               wardName: wardId,
    //               zoneName: zoneId,
    //               department: departmentId,
    //               subDepartment: subDepartmentId,
    //               facilityType: facilityTypeId,
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

                console.log("param", params);
                const facilityNameIdd = params.row.id;
                // const faciltyName = params.row.facilityName;
                const zoneId = zoneNames.find(
                  (obj) => obj?.zoneName === params.row.zoneName,
                )?.id;
                const facilityTypeId = facilityTypess.find(
                  (obj) => obj?.facilityTypes === params.row.facilityTypes,
                )?.id;
                const wardId = wardNames.find(
                  (obj) => obj?.wardName === params.row.wardName,
                )?.id;
                reset({
                  ...params.row,
                  wardName: wardId,
                  zoneName: zoneId,
                  // facilityNameId: facilityNameIdd,
                  // faciltyName: faciltyName,
                  // facilityName: facilityNameId,
                  facilityType: facilityTypeId,
                });
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
          <strong>{<FormattedLabel id="facilityNameMaster" />}</strong>
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
                              onChange={(value) => field.onChange(value)}
                              label="facilityType"
                            >
                              {facilityTypess &&
                                facilityTypess.map((facilityType, index) => (
                                  <MenuItem key={index} value={facilityType.id}>
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
                    </Grid>

                    {/* Facility Name */}
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <FormControl
                        variant="standard"
                        error={!!errors.facilityName}
                      >
                        {/* <TextField
                          sx={{ width: 220 }}
                          id="standard-basic"
                          label={<FormattedLabel id="facilityName" />}
                          variant="standard"
                          {...register("facilityName")}
                        /> */}
                        <Transliteration
                          _key={"facilityName"}
                          labelName={"facilityName"}
                          fieldName={"facilityName"}
                          updateFieldName={"facilityNameMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          variant="standard"
                          sx={{ width: 220 }}
                          label={<FormattedLabel id="facilityName" required />}
                          InputLabelProps={{
                            shrink: watch("facilityName") ? true : false,
                          }}
                          error={!!errors.facilityName}
                          // helperText={
                          //   errors?.facilityName
                          //     ? errors.facilityName.message
                          //     : null
                          // }
                        />

                        <FormHelperText>
                          {errors?.facilityName
                            ? errors.facilityName.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    {/* Facility Name (Marathi) */}
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <FormControl
                        variant="standard"
                        error={!!errors.facilityNameMr}
                      >
                        <TextField
                          sx={{ width: 220 }}
                          id="standard-basic"
                          label={
                            <FormattedLabel id="facilityNameMr" required />
                          }
                          variant="standard"
                          {...register("facilityNameMr")}
                          InputLabelProps={{
                            shrink: watch("facilityNameMr") ? true : false,
                          }}
                        />
                        <FormHelperText>
                          {errors?.facilityNameMr
                            ? errors.facilityNameMr.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    {/* Type of Sports */}
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <FormControl
                        variant="standard"
                        error={!!errors.typeOfSports}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="typeOfSports" required />
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
                              }}
                              label="typeOfSports"
                            >
                              <MenuItem value="Indoor">Indoor</MenuItem>
                              <MenuItem value="Outdoor">Outdoor</MenuItem>
                            </Select>
                          )}
                          name="typeOfSports"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.typeOfSports
                            ? errors.typeOfSports.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    {/* Remark */}
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <FormControl variant="standard" error={!!errors.remark}>
                        {/* <TextField
                          sx={{ width: 220 }}
                          id="standard-basic"
                          label={<FormattedLabel id="remark" />}
                          variant="standard"
                          {...register("remark")}
                          error={!!errors.remark}
                        /> */}

                        <Transliteration
                          _key={"remark"}
                          labelName={"remark"}
                          fieldName={"remark"}
                          updateFieldName={"remarkMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          variant="standard"
                          sx={{ width: 220 }}
                          label={<FormattedLabel id="remark" required />}
                          InputLabelProps={{
                            shrink: watch("remark") ? true : false,
                          }}
                          error={!!errors.remark}
                          // helperText={
                          //   errors?.remark ? errors.remark.message : null
                          // }
                        />
                        <FormHelperText>
                          {errors?.remark ? errors.remark.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    {/* Remark (Marathi) */}
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <FormControl variant="standard" error={!!errors.remarkMr}>
                        <TextField
                          sx={{ width: 220 }}
                          id="standard-basic"
                          label={<FormattedLabel id="remarkMr" required />}
                          variant="standard"
                          {...register("remarkMr")}
                          InputLabelProps={{
                            shrink: watch("remarkMr") ? true : false,
                          }}
                        />
                        <FormHelperText>
                          {errors?.remarkMr ? errors.remarkMr.message : null}
                        </FormHelperText>
                      </FormControl>
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
          </Button>
        </div>

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
      </Paper>
    </>
  );
};

export default Index;

// import React from "react";
// import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import { Controller, FormProvider, useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import SaveIcon from "@mui/icons-material/Save";
// import styles from "../bookingTime/view.module.css";
// import ExitToAppIcon from "@mui/icons-material/ExitToApp";
// import ClearIcon from "@mui/icons-material/Clear";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import {
//   Button,
//   Checkbox,
//   FormControl,
//   FormControlLabel,
//   FormHelperText,
//   FormLabel,
//   Grid,
//   InputLabel,
//   MenuItem,
//   Radio,
//   RadioGroup,
//   Select,
//   TextField,
//   Card,
//   Paper,
//   Box,
// } from "@mui/material";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { TimePicker } from "@mui/x-date-pickers";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import moment from "moment";
// import { height } from "@mui/system";
// import AddIcon from "@mui/icons-material/Add";
// import { DataGrid } from "@mui/x-data-grid";

// // schema - validation
// let schema = yup.object().shape({
//   areaId: yup.string().required("Area Id is Required !!!"),
//   areaName: yup.string().required("Course Selection is Required !!!"),
//   // terms: yup.bool().oneOf([true], "Accept Ts & Cs is Required !!!"),
//   wardName: yup.string().required(" Ward Name is Required !!"),
//   zoneName: yup.string().required(" Zone Name is Required !!"),
//   remark: yup.string().required(" Remark is Required !!"),
// });

// const index = () => {
//   // import from use Form
//   const {
//     register,
//     control,
//     handleSubmit,
//     methods,
//     reset,
//     watch,
//     formState: { errors },
//   } = useForm({
//     criteriaMode: "all",
//     resolver: yupResolver(schema),
//   });

//   const columns = [
//     {
//       field: "id",
//       headerName: "ID",
//       width: 50,
//     },
//     // {
//     //   field: "areaId",
//     //   headerName: "ID",
//     //   width: 50,
//     // },
//     {
//       field: "areaName",
//       headerName: "Area Name",
//       width: 200,
//     },

//     {
//       field: "zoneName",
//       headerName: "Zone Name",
//       type: "number",
//       flex: 1,
//     },
//     {
//       field: "wardName",
//       headerName: "Ward Name",
//       type: "number",
//       flex: 1,
//     },
//     {
//       field: "remark",
//       headerName: "Remark",
//       type: "number",
//       flex: 1,
//     },
//     {
//       field: "Action",
//       headerName: "action",
//       flex: 1,
//       renderCell: (record) => {
//         return (
//           <>
//             <VisibilityIcon />
//             <EditIcon />
//             <DeleteIcon />
//           </>
//         );
//       },
//     },
//   ];

//   const rows = [
//     {
//       id: 1,
//       areaName: "abc",
//       zoneName: "Zone-A",
//       wardName: "Ward-A",
//       remark: "Ok",
//     },
//     {
//       id: 2,
//       areaName: "xyz",
//       zoneName: "Zone-B",
//       wardName: "Ward-C",
//       remark: "Ok",
//     },
//   ];

//   const onSubmitForm = (fromData) => {
//     console.log("From Data ", fromData);
//   };

//   // view
//   return (
//     <>
//       <BasicLayout titleProp={"Facility Master"}>
//         <div className={styles.main}>
//           <div>
//             <div
//               style={{ display: "flex", justifyContent: "center" }}
//               className={styles.fpaper}
//             >
//               <Paper sx={{ height: 360, width: 1200 }} component={Box}>
//                 <FormProvider {...methods}>
//                   <from onSubmit={handleSubmit(onSubmitForm)}>
//                     <div className={styles.main}>
//                       <div className={styles.row}>
//                         <div>
//                           <TextField
//                             id="standard-basic"
//                             label="Facility Id"
//                             variant="standard"
//                             {...register("facilityId")}
//                             error={!!errors.facilityId}
//                             helperText={
//                               // errors?.studentName ? errors.studentName.message : null
//                               errors?.facilityId
//                                 ? "Facility Id  is Required !!!"
//                                 : null
//                             }
//                           />
//                         </div>
//                         <div>
//                           <TextField
//                             id="standard-basic"
//                             label="Facility Prefix"
//                             variant="standard"
//                             {...register("facilityPrefix")}
//                             error={!!errors.facilityPrefix}
//                             helperText={
//                               // errors?.studentName ? errors.studentName.message : null
//                               errors?.facilityPrefix
//                                 ? "Facility Prefix is Required !!!"
//                                 : null
//                             }
//                           />
//                         </div>
//                         <div>
//                           <FormControl
//                             variant="standard"
//                             // sx={{ m: 1, minWidth: 120 }}
//                             error={!!errors.zoneName}
//                           >
//                             <InputLabel id="demo-simple-select-standard-label">
//                               Zone Name
//                             </InputLabel>
//                             <Controller
//                               render={({ field }) => (
//                                 <Select
//                                   sx={{ minWidth: 220 }}
//                                   labelId="demo-simple-select-standard-label"
//                                   id="demo-simple-select-standard"
//                                   value={field.value}
//                                   onChange={(value) => field.onChange(value)}
//                                   label="zoneName"
//                                 >
//                                   <MenuItem value=" ">
//                                     <em>None</em>
//                                   </MenuItem>
//                                   <MenuItem value={"Zone A"}>Zone A</MenuItem>
//                                   <MenuItem value={"Zone B"}>Zone B</MenuItem>
//                                   <MenuItem value={"Zone C"}>Zone C</MenuItem>
//                                 </Select>
//                               )}
//                               name="zoneName"
//                               control={control}
//                               defaultValue=""
//                             />
//                             <FormHelperText>
//                               {errors?.zoneName
//                                 ? errors.zoneName.message
//                                 : null}
//                             </FormHelperText>
//                           </FormControl>
//                         </div>
//                       </div>
//                       <div className={styles.row}>
//                         <div>
//                           <FormControl
//                             variant="standard"
//                             // sx={{ m: 1, minWidth: 120 }}
//                             error={!!errors.wardName}
//                           >
//                             <InputLabel id="demo-simple-select-standard-label">
//                               Ward Name
//                             </InputLabel>
//                             <Controller
//                               render={({ field }) => (
//                                 <Select
//                                   sx={{ minWidth: 220 }}
//                                   labelId="demo-simple-select-standard-label"
//                                   id="demo-simple-select-standard"
//                                   value={field.value}
//                                   onChange={(value) => field.onChange(value)}
//                                   label="wardName"
//                                 >
//                                   <MenuItem value=" ">
//                                     <em>None</em>
//                                   </MenuItem>
//                                   <MenuItem value={"Ward A"}>Ward A</MenuItem>
//                                   <MenuItem value={"Ward B"}>Ward B</MenuItem>
//                                   <MenuItem value={"Ward C"}>Ward C</MenuItem>
//                                 </Select>
//                               )}
//                               name="wardName"
//                               control={control}
//                               defaultValue=""
//                             />
//                             <FormHelperText>
//                               {errors?.wardName
//                                 ? errors.wardName.message
//                                 : null}
//                             </FormHelperText>
//                           </FormControl>
//                         </div>
//                         <div>
//                           <TextField
//                             id="standard-basic"
//                             label="Facility Type"
//                             variant="standard"
//                             {...register("facilityType")}
//                             error={!!errors.facilityType}
//                             helperText={
//                               // errors?.studentName ? errors.studentName.message : null
//                               errors?.facilityType
//                                 ? "Facility Type  is Required !!!"
//                                 : null
//                             }
//                           />
//                         </div>
//                         <div>
//                           <TextField
//                             id="standard-basic"
//                             label="Facility Name"
//                             variant="standard"
//                             {...register("faciltyName")}
//                             error={!!errors.faciltyName}
//                             helperText={
//                               // errors?.studentName ? errors.studentName.message : null
//                               errors?.faciltyName
//                                 ? "Facility Name is Required !!!"
//                                 : null
//                             }
//                           />
//                         </div>
//                       </div>

//                       <div className={styles.row}>
//                         <div>
//                           <TextField
//                             id="standard-basic"
//                             label="Capacity"
//                             variant="standard"
//                             {...register("capacity")}
//                             error={!!errors.capacity}
//                             helperText={
//                               // errors?.studentName ? errors.studentName.message : null
//                               errors?.capacity
//                                 ? "Capacity  is Required !!!"
//                                 : null
//                             }
//                           />
//                         </div>
//                         <div>
//                           <TextField
//                             id="standard-basic"
//                             label="GIS ID/geoCode"
//                             variant="standard"
//                             {...register("geoCode")}
//                             error={!!errors.geoCode}
//                             helperText={
//                               // errors?.studentName ? errors.studentName.message : null
//                               errors?.geoCode
//                                 ? "GIS ID/geoCode is Required !!!"
//                                 : null
//                             }
//                           />
//                         </div>
//                         <div>
//                           <TextField
//                             id="standard-basic"
//                             label="Remark"
//                             variant="standard"
//                             {...register("remark")}
//                             error={!!errors.remark}
//                             helperText={
//                               // errors?.studentName ? errors.studentName.message : null
//                               errors?.remark
//                                 ? "Capacity  is Required !!!"
//                                 : null
//                             }
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     <div className={styles.btn}>
//                       <Button
//                         variant="contained"
//                         type="submit"
//                         endIcon={<SaveIcon />}
//                       >
//                         Save
//                       </Button>
//                       <Button
//                         variant="contained"
//                         color="secondary"
//                         endIcon={<ClearIcon />}
//                       >
//                         Clear
//                       </Button>
//                       <Button
//                         variant="contained"
//                         color="error"
//                         endIcon={<ExitToAppIcon />}
//                       >
//                         Exit
//                       </Button>
//                     </div>
//                   </from>
//                 </FormProvider>
//               </Paper>
//             </div>
//           </div>
//           <div style={{ display: "flex", justifyContent: "center" }}>
//             <div className={styles.spaper}>
//               <div className={styles.addbtn}>
//                 <Button
//                   variant="contained"
//                   endIcon={<AddIcon />}
//                   onClick={() => {
//                     console.log("Add Button Clicked !!!");
//                   }}
//                 >
//                   Add
//                 </Button>
//               </div>

//               <div className={styles.tpaper}>
//                 <Paper component={Box} sx={{ height: 500, width: 1200 }}>
//                   <DataGrid
//                     //autoPageSize
//                     // autoHeight
//                     mt={5}
//                     rows={rows}
//                     columns={columns}
//                     pageSize={10}
//                     rowsPerPageOptions={[5]}
//                     //checkboxSelection
//                   />
//                 </Paper>
//               </div>
//             </div>
//           </div>
//         </div>
//       </BasicLayout>
//     </>
//   );
// };

// export default index;
