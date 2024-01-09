import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  Select,
  Slide,
  Stack,
  TextField,
  ThemeProvider
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../URLS/urls";
import ItemMasterCSS from "../../../components/waterTax/styles/master.module.css";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../theme";
import { catchExceptionHandlingMethod } from "../../../util/util";
import HawkerReusableCSS from "../styles/hawkerReusableForAllComponents.module.css";
import Translation from "./Translation";


/** Sachin Durge */
// OwnerDetails
const OwnerDetails = () => {



  //  master content start

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [consumerCategoryData, setConsumerCategoryData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const [titles, setTitles] = useState([]);
  const [genders, setGenders] = useState([]);
  const [consumerCategory, setConsumerCategory] = useState([]);
  const [applicationNames, setApplicationNames] = useState([]);
  const [loadderState, setLoadderState] = useState(false);

  const getConsumerCategory = (_pageSize = 10, _pageNo = 0) => {
    // setLoadderState(true);
    axios
      .get(`${urls.WTURL}/master/consumerCategory/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          setLoadderState(false);
          let response = res?.data?.consumerCategory;
          console.log("consumerCategoryGet", response);
          let _res = response.map((r, i) => {
            return {
              id: r?.id,
              srNo: i + 1,
              categoryName: r?.categoryName,
              categoryNameMr: r?.categoryNameMr,
              toDate: r?.toDate,
              fromDate: r?.fromDate,
              toDate1:
                moment(r?.toDate, "DD-MM-YYYY").format("DD-MM-YYYY") !=
                  "Invalid date"
                  ? moment(r?.toDate, "DD-MM-YYYY").format("DD-MM-YYYY")
                  : "-",
              fromDate1:
                moment(r?.fromDate, "DD-MM-YYYY").format("DD-MM-YYYY") !=
                  "Invalid date"
                  ? moment(r?.fromDate, "DD-MM-YYYY").format("DD-MM-YYYY")
                  : "-",
              remark: r?.remark,
              activeFlag: r?.activeFlag,
              status: r?.activeFlag === "Y" ? "Active" : "Inactive",
            };
          });

          console.log("object", _res);
          setConsumerCategoryData({
            rows: _res,
            totalRows: res.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res.data.pageSize,
            page: res.data.pageNo,
          });
        }
        setLoadderState(false);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const onSubmitForm = (fromData) => {
    const finalBodyForApi = {
      ...fromData,
      activeFlag: "Y",
    };

    axios
      .post(`${urls.WTURL}/master/consumerCategory/save`, finalBodyForApi)
      .then((res) => {
        if (res.status == 200 || res.status == 200) {
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
          }
          getConsumerCategory();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };

    if (_activeFlag === "N") {
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
        if (willDelete === true) {
          axios
            .post(`${urls.WTURL}/master/consumerCategory/save`, body)
            .then((res) => {
              if (res.status == 200) {
                swal({
                  title:
                    language == "en"
                      ? "Record is Successfully Deleted!"
                      : "रेकॉर्ड यशस्वीरित्या हटवले आहे!",
                  text: "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
                  icon: "success",
                  button: "ओके",
                });
                getConsumerCategory();
                setButtonInputState(false);
              }
            });
        } else if (willDelete == null) {
          swal({
            title: language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे",
            buttons: {
              confirm: language === "en" ? "OK" : "ओके",
            },
          });
        }
      });
    } else {
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
        if (willDelete === true) {
          axios
            .post(`${urls.WTURL}/master/consumerCategory/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (
                res.status == 200 ||
                res.status == 226 ||
                res?.status == 201
              ) {
                swal({
                  title:
                    language == "en"
                      ? "Record is Successfully Activated!"
                      : "रेकॉर्ड यशस्वीरित्या सक्रिय केले आहे!",
                  icon: "success",
                  button: "ओके",
                });
                getConsumerCategory();
                setButtonInputState(false);
              }
            });
        } else if (willDelete == null) {
          swal({
            title: language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे",
            buttons: {
              confirm: language === "en" ? "OK" : "ओके",
            },
          });
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
    fromDate: null,
    toDate: null,
    categoryName: "",
    categoryNameMr: "",
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    categoryName: "",
    categoryNameMr: "",
    remark: "",
    id: null,
  };

  // master content end



  const {
    control,
    register,
    setValue,
    watch,
    clearErrors,
    reset,
    formState: { errors },
  } = useFormContext();

  const language = useSelector((state) => state?.labels.language);
  const [areaNames, setAreaName] = useState([]);
  const [zoneNames, setZoneNames] = useState([]);
  const [wards, setWards] = useState([]);
  const [hawkingDurationDailys, setHawkingDurationDaily] = useState([]);
  const [hawkerTypes, setHawkerType] = useState([]);
  const [items, setItems] = useState([]);
  const [bankMasters, setBankMasters] = useState([]);
  const [landmarkNames, setLandmarkNames] = useState([]);
  const [roadNames, setRoadNames] = useState([]);
  const [hawkingZoneNames, setHawkingZoneName] = useState([]);
  const [educations, setEducations] = useState([]);
  const [streetvendorModeNames, setStreetvendorModeNames] = useState([]);
  const [pincodes, setPinCodes] = useState([]);
  const userToken = useGetToken();
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: <FormattedLabel id="srNo" />,
      width: 100,
      headerAlign: "center",
      align: "center",
      flex: 1,

    },

    {
      field: language == "en" ? "categoryName" : "categoryNameMr",
      headerName: <FormattedLabel id="fullName" />,
      description: <FormattedLabel id="fullName" />,
      width: 240,
      flex: 3,

    },

    {
      field: "gender",
      headerName: <FormattedLabel id="gender" />,
      description: <FormattedLabel id="gender" />,
      width: 240,
      flex: 3,
      align: "left",
      headerAlign: "center",
    },

    {
      field: "aadharNumber",
      headerName: <FormattedLabel id="aadharNumber" />,
      description: <FormattedLabel id="aadharNumber" />,
      width: 240,
      flex: 3,
      align: "left",
      headerAlign: "center",
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="action" />,
      description: <FormattedLabel id="action" />,
      align: "left",
      headerAlign: "center",
      width: 120,
      flex: 3,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
          </>
        );
      },
    },
  ];

  // Drawer
  const [open, setOpen] = React.useState(false);

  // Open Drawer
  const handleDrawerOpen = () => {
    setOpen(!open);
    drawerWidth = "5vw";
  };

  // Close Drawer
  const handleDrawerClose = () => {
    setOpen(false);
    drawerWidth = 0;
  };

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

  // zones
  const getZoneName = () => {
    const url = `${urls.CFCURL}/master/zone/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || res?.status == 201) {
          setZoneNames(
            r?.data?.zone?.map((row) => ({
              id: row?.id,
              zoneName: row?.zoneName,
              zoneNameMr: row?.zoneNameMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        console.log("zoneNameApiCallError", error);
      });
  };

  // wards
  const getWards = () => {
    if (watch("zoneKey") != null) {
      let url = `${urls.CFCURL
        }/master/zoneWardAreaMapping/getWardByZoneAndModuleId?zoneId=${watch(
          "zoneKey"
        )}&moduleId=4`;

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          if (
            r?.status == 200 ||
            res?.status == 201 ||
            res?.status == "SUCCESS"
          ) {
            setWards(
              r?.data?.map((row) => ({
                id: row?.wardId,
                wardName: row?.wardName,
                wardNameMr: row?.wardNameMr,
              }))
            );
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
          console.log("zoneNameApiCallError", error);
        });
    }
  };

  // areas
  const getAreaName = () => {
    if (localStorage.getItem("DepartSideEditApplication") == "true") {
      axios
        .get(`${urls.CFCURL}/master/area/getAll`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          if (
            r?.status == 200 ||
            res?.status == 201 ||
            res?.status == "SUCCESS"
          ) {
            setAreaName(
              r?.data?.area?.map((row) => ({
                id: row?.id,
                areaName: row?.areaName,
                areaNameMr: row?.areaNameMr,
                // id: row?.id,
              }))
            );
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
          console.log("areaNameApiError", error);
        });
    } else {
      if (watch("wardName") != null) {
        let url = `${urls.CFCURL
          }/master/zoneWardAreaMapping/getAreaByZoneAndWardAndModuleId?zoneId=${watch(
            "zoneKey"
          )}&wardId=${watch("wardName")}&moduleId=4`;

        axios
          .get(url, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((r) => {
            if (
              r?.status == 200 ||
              res?.status == 201 ||
              res?.status == "SUCCESS"
            ) {
              setAreaName(
                r?.data?.map((row) => ({
                  id: row?.areaId,
                  areaName: row?.areaName,
                  areaNameMr: row?.areaNameMr,
                  uniqueId: row?.uniqueId,
                }))
              );
            }
          })
          .catch((error) => {
            callCatchMethod(error, language);
            console.log("areaNameApiCallError", error);
          });
      }
    }
  };

  const getLandmark = () => {
    if (localStorage.getItem("DepartSideEditApplication") == "true") {
      console.log("deptEdit");

      // landMark
      axios
        .get(`${urls.CFCURL}/master/locality/getAll`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          if (
            r?.status == 200 ||
            res?.status == 201 ||
            res?.status == "SUCCESS"
          ) {
            setLandmarkNames(
              r?.data?.locality?.map((row) => ({
                id: row?.id,
                landmarkName: row?.landmarkEng,
                landmarkNameMr: row?.landmarkMr,
              }))
            );
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
          console.log("landmarkApiCallError", error);
        });
    } else {
      if (
        watch("addressUniqueId") != null &&
        watch("addressUniqueId") != undefined
      ) {
        let url = `${urls.HMSURL}/mstAreaZoneWardRoadLandMarkMapping/getLandmarks`;

        let body = {
          zoneWardAreaMapping: watch("addressUniqueId"),
        };

        axios
          .post(url, body, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((r) => {
            if (
              r?.status == 200 ||
              res?.status == 201 ||
              res?.status == "SUCCESS"
            ) {
              // landmarks
              setLandmarkNames(
                r?.data?.map((row) => ({
                  id: row?.landMarkId,
                  landmarkName: row?.landMarkEng,
                  landmarkNameMr: row?.landMarkmr,
                }))
              );
            }
          })
          .catch((error) => {
            callCatchMethod(error, language);
            console.log("landmarkApiCallError", error);
          });
      }
    }
  };

  const getRoadname = () => {
    if (localStorage.getItem("DepartSideEditApplication") == "true") {
      console.log("deptEdit");

      // roadname
      axios
        .get(`${urls.CFCURL}/mstRoadName/getAll`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          if (
            r?.status == 200 ||
            res?.status == 201 ||
            res?.status == "SUCCESS"
          ) {
            setRoadNames(
              r?.data?.roadName?.map((row) => ({
                id: row?.id,
                roadName: row?.roadNameEn,
                roadNameMr: row?.roadNameMr,
              }))
            );
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
          console.log("roadNameApiCallError", error);
        });
    } else {
      if (
        watch("addressUniqueId") != null &&
        watch("addressUniqueId") != undefined
      ) {
        let url = `${urls.HMSURL}/mstAreaZoneWardRoadLandMarkMapping/getRoads`;

        let body = {
          zoneWardAreaMapping: watch("addressUniqueId"),
        };

        axios
          .post(url, body, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((r) => {
            if (
              r?.status == 200 ||
              res?.status == 201 ||
              res?.status == "SUCCESS"
            ) {
              // roadNames
              setRoadNames(
                r?.data?.map((row) => ({
                  id: row?.roadId,
                  roadName: row?.roadName,
                  roadNameMr: row?.roadNameMr,
                }))
              );
            }
          })
          .catch((error) => {
            callCatchMethod(error, language);
            console.log("landmarkApiCallError", error);
          });
      }
    }
  };

  // pinCodes
  const getPinCodes = () => {
    axios
      .get(`${urls.CFCURL}/master/pinCode/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || res?.status == 201) {
          setPinCodes(
            r.data.pinCode.map((row) => ({
              id: row.id,
              pincode: row.pinCode,
              pincodeMr: row.pinCodeMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        console.log("pincodeApiCallError", error);
      });
  };

  // hawkingDurationDailys
  const getHawkingDurationDaily = () => {
    axios
      .get(`${urls.HMSURL}/hawkingDurationDaily/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || res?.status == 201) {
          setHawkingDurationDaily(
            r.data.hawkingDurationDaily.map((row) => ({
              id: row.id,
              hawkingDurationDaily:
                moment(row.hawkingDurationDailyFrom, "HH:mm:ss").format(
                  "hh:mm A"
                ) +
                " To " +
                moment(row.hawkingDurationDailyTo, "HH:mm:ss").format(
                  "hh:mm A"
                ),
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        console.log("hawkingDurationCallError", error);
      });
  };

  // hawkerTypes
  const getHawkerType = () => {
    axios
      .get(`${urls.HMSURL}/hawkerType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || res?.status == 201) {
          setHawkerType(
            r.data.hawkerType.map((row) => ({
              id: row.id,
              hawkerType: row.hawkerType,
              hawkerTypeMr: row.hawkerTypeMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        console.log("hawkerTypeApiCallError", error);
      });
  };

  // items
  const getItems = () => {
    axios
      .get(`${urls.HMSURL}/item/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || res?.status == 201) {
          setItems(
            r.data.item.map((row) => ({
              id: row.id,
              item: row.item,
              itemMr: row.itemMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        console.log("zoneNameApiCallError", error);
      });
  };

  // banks
  const getBankMasters = () => {
    axios
      .get(`${urls.CFCURL}/master/bank/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || res?.status == 201) {
          setBankMasters(
            r.data.bank.map((row) => ({
              id: row.id,
              bankMaster: row.bankName,
              bankMasterMr: row.bankNameMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        console.log("bankApiCallError", error);
      });
  };

  // hawkingZoneName
  const getHawkingZoneName = () => {
    axios
      .get(`${urls.HMSURL}/hawingZone/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || res?.status == 201) {
          setHawkingZoneName(
            r.data.hawkingZone.map((row) => ({
              id: row.id,
              hawkingZoneName: row.hawkingZoneName,
              hawkingZoneNameMr: row.hawkingZoneNameMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        console.log("hawkingZoneApiCallError", error);
      });
  };

  // getStreetvendorName
  const getStreetVendorModeName = () => {
    axios
      .get(`${urls.HMSURL}/hawkerMode/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || res?.status == 201) {
          setStreetvendorModeNames(
            r.data.hawkerMode.map((row) => ({
              id: row.id,
              streetvendorModeName: row.hawkerMode,
              streetvendorModeNameMr: row.hawkerModeMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        console.log("streetVendorZoneApiCallError", error);
      });
  };

  // getEducations
  const getEducations = () => {
    axios
      .get(`${urls.HMSURL}/educationCategory/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || res?.status == 201) {
          setEducations(
            r.data.educationCategory.map((row) => ({
              id: row.id,
              education: row.educationCategory,
              educationMr: row.educationCategoryMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        console.log("educationApiCallError", error);
      });
  };

  //!   ===============================> useEffect  <=============================>

  useEffect(() => {
    // setValue("loadderState", false);
    // loadderSetTimeOutFunction();
    getZoneName();
    getPinCodes();
    getHawkingDurationDaily();
    getHawkerType();
    getItems();
    getBankMasters();
    getHawkingZoneName();
    getStreetVendorModeName();
    getEducations();
  }, []);

  // get ward
  useEffect(() => {
    getWards();
  }, [watch("zoneKey")]);

  // get Area
  useEffect(() => {
    getAreaName();
  }, [watch("wardName")]);

  // get Landmark and village Names
  useEffect(() => {
    // getLandmarkAndVillageNames();
    const addressUniqueId = areaNames?.find(
      (data) => data?.id == watch("areaName")
    )?.uniqueId;
    setValue("addressUniqueId", addressUniqueId);
  }, [watch("areaName"), areaNames]);

  useEffect(() => {
    getLandmark();
    getRoadname();
  }, [watch("addressUniqueId")]);

  useEffect(() => {
    console.log("12chaDAta", watch("oldLicenseYN"));

    if (
      watch("oldLicenseYN") != null &&
      watch("oldLicenseYN") != undefined &&
      watch("oldLicenseYN") != ""
    ) {
      if (watch("oldLicenseYN") == "true") {
        setValue("oldLicenseYNA", true);
        localStorage.setItem("oldLicenseYNA", true);
      } else {
        setValue("oldLicenseYNA", false);
        localStorage.setItem("oldLicenseYNA", false);
        setValue("oldLicenseNo", "");
        setValue("oldLicenseDate", null);
        clearErrors("oldLicenseNo");
        clearErrors("oldLicenseDate");
      }
    }
  }, [watch("oldLicenseYN")]);

  useEffect(() => {
    console.log("12chaDAta", watch("voterNameYN"));

    if (
      watch("voterNameYN") != null &&
      watch("voterNameYN") != undefined &&
      watch("voterNameYN") != ""
    ) {
      if (watch("voterNameYN") == "true") {
        setValue("voterNameYNA", true);
        localStorage.setItem("voterNameYNA", true);
      } else {
        setValue("voterNameYNA", false);
        localStorage.setItem("voterNameYNA", false);
        setValue("voterId", "");
        clearErrors("voterId");
      }
    }
  }, [watch("voterNameYN")]);

  // View
  return (
    <>
      <ThemeProvider theme={theme}>

        {/** Header */}
        <div className={HawkerReusableCSS.MainHeader}>
          {<FormattedLabel id="ownerDetails" />}
        </div>

        {isOpenCollapse && (
          <Slide
            direction="down"
            in={slideChecked}
            mountOnEnter
            unmountOnExit
          >
            <div>
              <form >
                <Grid container style={{ marginBottom: "7vh", marginLeft: "35px" }}>

                  {/** titleEn  English*/}
                  <Grid item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={3}
                    className={HawkerReusableCSS.GridItemCenter}
                  >
                    <FormControl error={!!errors?.titleEn} sx={{ marginTop: 2 }}>
                      <InputLabel
                        shrink={watch("titleEn") == null ? false : true}
                        id="demo-simple-select-standard-label"
                      >
                        {<FormattedLabel id="titleEn" reuired />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            disabled={watch("disabledFieldInputState")}
                            autoFocus
                            value={field?.value}
                            onChange={(value) => field?.onChange(value)}
                            label={<FormattedLabel id="titleEn" required />}
                            id="demo-simple-select-standard"
                            labelId="id='demo-simple-select-standard-label'"
                          >
                            {titles &&
                              titles?.map((titleEn) => (
                                <MenuItem key={titleEn?.id + 1} value={titleEn?.id}>
                                  {titleEn?.titleEn}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="titleEn"
                        control={control}
                        defaultValue={null}
                      />
                      <FormHelperText>
                        {errors?.titleEn ? errors?.titleEn?.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/** firstNameEn English */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={3}
                    className={HawkerReusableCSS.GridItemCenter}
                  >
                    <Translation
                      labelName={"firstNameEn"}
                      label={<FormattedLabel id="firstNameEn" required />}
                      width={230}
                      disabled={watch("disabledFieldInputState")}
                      error={!!errors?.firstNameEn}
                      helperText={errors?.firstNameEn ? errors?.firstNameEn?.message : null}
                      key={"firstNameEn"}
                      fieldName={"firstNameEn"}
                      updateFieldName={"firstNameMr"}
                      sourceLang={"en-US"}
                      targetLang={"mr-IN"}
                    />
                  </Grid>

                  {/** middleNameEn English*/}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={3}
                    className={HawkerReusableCSS.GridItemCenter}
                  >
                    <Translation
                      labelName={"middleNameEn"}
                      label={<FormattedLabel id="middleNameEn" required />}
                      width={230}
                      disabled={watch("disabledFieldInputState")}
                      error={!!errors?.middleNameEn}
                      helperText={errors?.middleNameEn ? errors?.middleNameEn?.message : null}
                      key={"middleNameEn"}
                      fieldName={"middleNameEn"}
                      updateFieldName={"middleNameMr"}
                      sourceLang={"en-US"}
                      targetLang={"mr-IN"}
                    />
                  </Grid>

                  {/** last Name  English*/}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={3}
                    className={HawkerReusableCSS.GridItemCenter}
                  >
                    <Translation
                      labelName={"lastNameEn"}
                      label={<FormattedLabel id="lastNameEn" required />}
                      width={230}
                      disabled={watch("disabledFieldInputState")}
                      error={!!errors?.lastNameEn}
                      helperText={errors?.lastNameEn ? errors?.lastNameEn?.message : null}
                      key={"lastNameEn"}
                      fieldName={"lastNameEn"}
                      updateFieldName={"lastNameMr"}
                      sourceLang={"en-US"}
                      targetLang={"mr-IN"}
                    />
                  </Grid>

                  {/** titleMr Marathi */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={3}
                    className={HawkerReusableCSS.GridItemCenter}
                  >
                    <FormControl error={!!errors?.titleMr} sx={{ marginTop: 2 }}>
                      <InputLabel
                        shrink={watch("titleMr") == null ? false : true}
                        id="demo-simple-select-standard-label"
                      >
                        {<FormattedLabel id="titleMr" required />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            disabled={watch("disabledFieldInputState")}
                            autoFocus
                            value={field?.value}
                            onChange={(value) => field?.onChange(value)}
                            label={<FormattedLabel id="titleMr" required />}
                            id="demo-simple-select-standard"
                            labelId="id='demo-simple-select-standard-label'"
                          >
                            {titles &&
                              titles?.map((titleMr) => (
                                <MenuItem key={titleMr?.id + 1} value={titleMr?.id}>
                                  {titleMr?.titleMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="titleMr"
                        control={control}
                        defaultValue={null}
                      />
                      <FormHelperText>
                        {errors?.titleMr ? errors?.titleMr?.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/** firstNameMr Marathi */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={3}
                    className={HawkerReusableCSS.GridItemCenter}
                  >

                    <Translation
                      labelName={"firstNameMr"}
                      label={<FormattedLabel id="firstNameMr" required />}
                      width={230}
                      disabled={watch("disabledFieldInputState")}
                      error={!!errors?.firstNameMr}
                      helperText={
                        errors?.firstNameMr ? errors?.firstNameMr?.message : null
                      }
                      key={"firstNameMr"}
                      fieldName={"firstNameMr"}
                      updateFieldName={"firstNameEn"}
                      sourceLang={"mr-IN"}
                      targetLang={"en-US"}
                    />
                  </Grid>

                  {/** middleNameMr Marathi */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={3}
                    className={HawkerReusableCSS.GridItemCenter}
                  >

                    <Translation
                      labelName={"middleNameMr"}
                      label={<FormattedLabel id="middleNameMr" required />}
                      width={230}
                      disabled={watch("disabledFieldInputState")}
                      error={!!errors?.middleNameMr}
                      helperText={
                        errors?.middleNameMr ? errors?.middleNameMr?.message : null
                      }
                      key={"middleNameMr"}
                      fieldName={"middleNameMr"}
                      updateFieldName={"middleNameEn"}
                      sourceLang={"mr-IN"}
                      targetLang={"en-US"}
                    />
                  </Grid>

                  {/** last Name Marathi */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={3}
                    className={HawkerReusableCSS.GridItemCenter}
                  >
                    <Translation
                      labelName={"lastNameMr"}
                      label={<FormattedLabel id="lastNameMr" required />}
                      width={230}
                      disabled={watch("disabledFieldInputState")}
                      error={!!errors?.lastNameMr}
                      helperText={errors?.lastNameMr ? errors?.lastNameMr?.message : null}
                      key={"lastNameMr"}
                      fieldName={"lastNameMr"}
                      updateFieldName={"lastNameEn"}
                      sourceLang={"mr-IN"}
                      targetLang={"en-US"}
                    />
                  </Grid>

                  {/** gender */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={3}
                    className={HawkerReusableCSS.GridItemCenter}
                  >
                    <FormControl sx={{ marginTop: 2 }} error={!!errors?.gender}>
                      <InputLabel
                        shrink={watch("gender") == null ? false : true}
                        id="demo-simple-select-standard-label"
                      >
                        {<FormattedLabel id="gender" required />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            disabled={watch("disabledFieldInputState")}
                            value={field?.value}
                            onChange={(value) => field?.onChange(value)}
                            label={<FormattedLabel id="gender" required />}
                          >
                            {genders &&
                              genders?.map((gender) => (
                                <MenuItem key={gender?.id} value={gender?.id}>
                                  {language == "en" ? gender?.gender : gender?.genderMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="gender"
                        control={control}
                        defaultValue={null}
                      />
                      <FormHelperText>
                        {errors?.gender ? errors?.gender?.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/** aadharNumber */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={3}
                    className={HawkerReusableCSS.GridItemCenter}
                  >
                    <TextField
                      id="standard-basic"
                      disabled={watch("disabledFieldInputState")}
                      label={<FormattedLabel id="aadharNumber" required />}
                      {...register("aadharNumber")}
                      error={!!errors?.aadharNumber}
                      helperText={
                        errors?.aadharNumber ? errors?.aadharNumber?.message : null
                      }
                    />
                  </Grid>

                  {/** mobileNo */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={3}
                    className={HawkerReusableCSS.GridItemCenter}
                  >
                    <TextField
                      id="standard-basic"
                      inputProps={{ maxLength: 10 }}
                      disabled={watch("disabledFieldInputState")}
                      label={<FormattedLabel id="mobileNo" required />}
                      {...register("mobileNo")}
                      error={!!errors?.mobileNo}
                      helperText={errors?.mobileNo ? errors?.mobileNo?.message : null}
                    />
                  </Grid>

                  {/** email */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={3}
                    className={HawkerReusableCSS.GridItemCenter}
                  >
                    <TextField
                      id="standard-basic"
                      disabled={watch("disabledFieldInputState")}
                      label={<FormattedLabel id="email" required />}
                      {...register("email")}
                      error={!!errors?.email}
                      helperText={
                        errors?.email ? errors?.email?.message : null
                      }
                    />
                  </Grid>

                </Grid>

                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                    md: "row",
                    lg: "row",
                    xl: "row",
                  }}
                  spacing={{ xs: 2, sm: 2, md: 5, lg: 5, xl: 5 }}
                  className={ItemMasterCSS.ButtonStack}
                >

                  <Button
                    className={ItemMasterCSS.ButtonForMobileWidth}
                    size="small"
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
                    className={ItemMasterCSS.ButtonForMobileWidth}
                    size="small"
                    variant="contained"
                    color="primary"
                    endIcon={<ClearIcon />}
                    onClick={() => cancellButton()}
                  >
                    <FormattedLabel id="clear" />
                  </Button>

                  <Button
                    className={ItemMasterCSS.ButtonForMobileWidth}
                    size="small"
                    variant="contained"
                    color="error"
                    endIcon={<ExitToAppIcon />}
                    onClick={() => exitButton()}
                  >
                    <FormattedLabel id="exit" />
                  </Button>

                </Stack>
              </form>
            </div>
          </Slide>
        )}
        <div className={ItemMasterCSS.AddButton}>
          <Button
            size="small"
            variant="contained"
            endIcon={<AddIcon />}
            type="primary"
            disabled={buttonInputState}
            onClick={() => {
              reset({
                ...resetValuesExit,
              });
              setEditButtonInputState(true);
              setBtnSaveText("Save");
              setButtonInputState(true);
              setSlideChecked(true);
              setIsOpenCollapse(!isOpenCollapse);
            }}
          >
            <FormattedLabel id="add" />
          </Button>
        </div>
      </ThemeProvider>

      <div className={ItemMasterCSS.DataGridDiv}>
        <DataGrid
          // componentsProps={{
          //   toolbar: {
          //     searchPlaceholder: "शोधा",
          //     showQuickFilter: true,
          //     quickFilterProps: { debounceMs: 500 },
          //     printOptions: { disableToolbarButton: true },
          //     csvOptions: { disableToolbarButton: true },
          //   },
          // }}
          // components={{ Toolbar: GridToolbar }}
          sx={{
            overflowY: "scroll",
            "& .MuiDataGrid-virtualScrollerContent": {},
            "& .MuiDataGrid-columnHeadersInner": {
              backgroundColor: "#0084ff",
              color: "white",
            },

            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
          }}
          columns={columns}
          density="compact"
          autoHeight={true}
          pagination
          // paginationMode="server"
          // page={consumerCategoryData?.page}
          // rowCount={consumerCategoryData?.totalRows}
          // rowsPerPageOptions={consumerCategoryData?.rowsPerPageOptions}
          // pageSize={consumerCategoryData?.pageSize}
          rows={watch("ownerDetails") ? watch("ownerDetails") : []}
        // onPageChange={(_data) => {
        //   getConsumerCategory(consumerCategoryData?.pageSize, _data);
        // }}
        // onPageSizeChange={(_data) => {
        //   getConsumerCategory(_data, consumerCategoryData?.page);
        // }}
        />
      </div>
      {/* </Paper> */}
    </>
  );
};

export default OwnerDetails;
