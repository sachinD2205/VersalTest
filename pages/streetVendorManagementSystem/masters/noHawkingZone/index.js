import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import { NoHawkingZoneSchema } from "../../../../components/streetVendorManagementSystem/schema/NoHawkingZoneSchema";
import NoHawkingZoneCSS from "../../../../components/streetVendorManagementSystem/styles/NoHawkingZoneNew.module.css";
import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import UploadButtonHawkerWithoutAdd from "../../../../components/streetVendorManagementSystem/fileUpload/UploadButtonHawkerWithoutAdd";
import styles from "../../../../components/streetVendorManagementSystem/styles/documentUpload.module.css";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import Translation from "../../../../components/streetVendorManagementSystem/components/Translation";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

// func
const Index = () => {
  const language = useSelector((state) => state?.labels.language);
  const [dataValidation, setDataValidation] = useState(
    NoHawkingZoneSchema(language)
  );
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(dataValidation),
    mode: "onChange",
    defaultValues: {
      fromDate: null,
      toDate: null,
      gisId: "",
      noHawkingZonePrefix: "",
      citySurveyNo: "",
      noHawkingZoneName: "",
      noHawkingZoneNameMr: "",
      areaName: "",
      declarationDate: null,
      declarationOrderNo: "",
      declarationOrder: "",
      capacityOfHawkingZone: "",
      noOfHawkersPresent: "",
      item: null,
      noHawkingZoneInfo: "",
      remarks: "",
      zone: null,
      ward: null,
      applicationName: null,
    },
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    trigger,
    clearErrors,
    getFieldState,
    formState: { errors, dirtyFields },
  } = methods;
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [wardNames1, setWardNames1] = useState([]);
  const [areaNames, setAreaNames] = useState([]);
  const [areaNames1, setAreaNames1] = useState([]);
  const [itemNames, setItemNames] = useState([]);
  const [applicationNames, setApplicationNames] = useState([]);
  const [declarationPhoto, setDeclarationPhoto] = useState(null);
  const userToken = useGetToken();
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

  const [noHawkingZoneData, setNoHawkingZoneData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // Module Name
  const getModuleName = () => {
    const url = `${urls.CFCURL}/master/application/getAll`;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
      )
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          console.log("applicationApiData", res?.data);
          let temp = [res?.data?.application?.find((data) => data?.id == "4")];
          console.log("tem123", temp);
          setApplicationNames(
            temp?.map((row) => ({
              id: row?.id,
              applicationNameEn: row?.applicationNameEng,
              applictionNameMr: row?.applicationNameMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        console.log("applicationGetAllApi", error);
      });
  };

  // Zoner
  const getZone = () => {
    const url = `${urls.CFCURL}/master/zone/getAll`;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          setZoneNames(
            res?.data?.zone?.map((row) => ({
              id: row?.id,
              zoneName: row?.zoneName,
              zoneNameMr: row?.zoneNameMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // ward
  const getWard = () => {
    if (watch("zone") != null) {
      let url = `${urls.CFCURL
        }/master/zoneWardAreaMapping/getWardByZoneAndModuleId?zoneId=${watch(
          "zone"
        )}`;

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          if (r?.status == 200 || res?.status == 201) {
            console.log("wardNames", r?.data);
            setWardNames(
              r?.data?.map((row) => ({
                id: row?.wardId,
                wardNameEn: row?.wardName,
                wardNameMr: row?.wardNameMr,
              }))
            );
          }
        })
        .catch((error) => {
          console.log("WardNamegetAll", errors);
          callCatchMethod(error, language);
        });
    }
  };

  // ward name 2
  const getWardNames = () => {
    const url = `${urls.CFCURL}/master/ward/getAll`;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          setWardNames1(
            res?.data?.ward?.map((row) => ({
              id: row?.id,
              wardNameEn: row?.wardName,
              wardNameMr: row?.wardNameMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // Area
  const getArea = () => {
    console.log("2323", watch("zone"), watch("ward"));

    if (watch("zone") != null && watch("ward") != null) {
      let url = `${urls.CFCURL
        }/master/zoneWardAreaMapping/getAreaByZoneAndWardAndModuleId?zoneId=${watch(
          "zone"
        )}&wardId=${watch("ward")}`;

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          if (r?.status == 200 || res?.status == 201) {
            setAreaNames(
              r?.data?.map((row) => ({
                id: row?.areaId,
                areaNameEn: row?.areaName,
                areaNameMr: row?.areaNameMr,
              }))
            );
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
          console.log("areaError", errors);
        });
    }
  };

  // area names
  const getAreaNames = () => {
    const url = `${urls.CFCURL}/master/area/getAll`;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          console.log("areaNames", res?.data?.area);
          setAreaNames1(
            res?.data?.area?.map((row) => ({
              id: row?.id,
              areaNameEn: row?.areaName,
              areaNameMr: row?.areaNameMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // Item
  const getItem = () => {
    const url = `${urls.HMSURL}/item/getAll`;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setItemNames(
            r?.data?.item?.map((row) => ({
              id: row?.id,
              item: row?.item,
              itemMr: row?.itemMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // getNoHawkingZone
  const getNoHawkingZone = (_pageSize = 10, _pageNo = 0) => {
    setValue("loadderState", true);
    axios
      .get(`${urls.HMSURL}/noHawkingZone/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          console.log(res?.data, "324234234");
          let response = res?.data?.noHawkingZone;
          console.log("hawkingZone232", response);
          let _res = response?.map((r, i) => {
            return {
              id: r?.id,
              srNo: i + 1,
              // toDate
              toDate: r?.toDate,
              toDate1: moment(r?.toDate, "YYYY-MM-DD")?.format("DD-MM-YYYY"),
              // fromDate
              fromDate: r?.fromDate,
              fromDate1: moment(r?.fromDate, "YYYY-MM-DD")?.format(
                "DD-MM-YYYY"
              ),
              gisId: r?.gisId,
              noHawkingZoneNameMr: r?.noHawkingZoneNameMr,
              // application name
              applicationName: r?.applicationName,
              applicationNameEn: applicationNames?.find(
                (data) => data?.id == r?.applicationName
              )?.applicationNameEn,
              applicationNameMr: applicationNames?.find(
                (data) => data?.id == r?.applicationName
              )?.applictionNameMr,
              // applicationName
              //zone
              zone: r?.zone,
              zoneNameEn: zoneNames?.find((obj) => obj?.id === r?.zone)
                ?.zoneName,
              zoneNameMr: zoneNames?.find((obj) => obj?.id === r?.zone)
                ?.zoneNameMr,
              // ward
              ward: r?.ward,
              wardNameEn: wardNames1?.find((data) => data?.id == r?.ward)
                ?.wardNameEn,
              wardNameMr: wardNames1?.find((data) => data?.id == r?.ward)
                ?.wardNameMr,
              //area
              areaName: r?.areaName,
              areaNameEn: areaNames1?.find((obj) => obj?.id === r?.areaName)
                ?.areaNameEn,
              areaNameMr: areaNames1?.find((obj) => obj?.id === r?.areaName)
                ?.areaNameMr,
              // item
              item: r?.item,
              itemNameEn: itemNames?.find((obj) => obj?.id === r?.item)?.item,
              itemNameMr: itemNames?.find((obj) => obj?.id === r?.item)?.itemMr,
              // remarks
              remarks: r?.remarks,
              // citySurveyNo
              citySurveyNo: r?.citySurveyNo,
              // noHawkingZoneName
              noHawkingZoneName: r?.noHawkingZoneName,
              // declarationDate
              declarationDate: r?.declarationDate,
              declarationDate1: moment(
                r?.declarationDate,
                "YYYY-MM-DD"
              )?.format("DD-MM-YYYY"),
              // declaration Order no
              declarationOrderNo: r?.declarationOrderNo,
              declarationOrder: r?.declarationOrder,
              capacityOfHawkingZone: r?.capacityOfHawkingZone,
              noOfHawkersPresent: r?.noOfHawkersPresent,
              noHawkingZoneInfo: r?.noHawkingZoneInfo,
              // declarationPhoto
              declarationPhoto: r?.declarationPhoto,
              // activeFlag
              activeFlag: r?.activeFlag,
              status: r?.activeFlag === "Y" ? "Active" : "Inactive",
            };
          });

          setNoHawkingZoneData({
            rows: _res,
            totalRows: res.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res.data.pageSize,
            page: res.data.pageNo,
          });
          setValue("loadderState", false);
        } else {
          setValue("loadderState", false);
        }
      })
      .catch((error) => {
        setValue("loadderState", false);
        callCatchMethod(error, language);
      });
  };

  // OnSubmit
  const onSubmitForm = (fromData) => {
    setValue("loadderState", true);
    // finalBodyForApi
    const finalBodyForApi = {
      ...fromData,
      activeFlag: "Y",
    };

    // url
    const url = `${urls.HMSURL}/noHawkingZone/save`;

    axios
      .post(url, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setValue("loadderState", false);
        if (res?.status == 201 || res?.status == 200) {
          if (fromData?.id) {
            language == "en"
              ? sweetAlert(
                "Updated!",
                "Record Updated successfully!",
                "success"
              )
              : sweetAlert(
                "अपडेट केले!",
                "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
                "success"
              );
          } else {
            language == "en"
              ? sweetAlert("Saved!", "Record Saved successfully!", "success")
              : sweetAlert(
                "जतन केले!",
                "रेकॉर्ड यशस्वीरित्या जतन केले!",
                "success"
              );
          }
          getNoHawkingZone();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
        }
      })
      .catch((error) => {
        setValue("loadderState", false);
        callCatchMethod(error, language);
      });
  };

  // Delete
  const deleteById = (value, _activeFlag) => {
    // body
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };

    // url
    const url = `${urls.HMSURL}/noHawkingZone/save`;
    if (_activeFlag == "N") {
      sweetAlert({
        title: language == "en" ? "Inactivate ?" : "निष्क्रिय ?",
        text:
          language == "en"
            ? "are you sure you want to inactivate this record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          setValue("loadderState", true);
          axios
            .post(url, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              setValue("loadderState", false);
              if (res.status == 200 || res?.status == 201) {
                sweetAlert(
                  language == "en"
                    ? "record successfully inactive"
                    : "रेकॉर्ड यशस्वीरित्या निष्क्रिय",
                  {
                    icon: "success",
                  }
                );
                getNoHawkingZone();
                setButtonInputState(false);
              }
            })
            .catch((error) => {
              setValue("loadderState", false);
              callCatchMethod(error, language);
              console.log("errors", erros);
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
      sweetAlert({
        title: language == "en" ? "Activate" : "सक्रिय",
        text:
          language == "en"
            ? "are you sure you want to activate this record? "
            : "तुम्हाला खात्री आहे की तुम्ही हा रेकॉर्ड सक्रिय करू इच्छिता?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete == true) {
          setValue("loadderState", true);
          axios
            .post(url, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              setValue("loadderState", false);
              if (res.status == 200 || res?.status == 201) {
                sweetAlert(
                  language == "en"
                    ? "record is successfully activated !"
                    : "रेकॉर्ड यशस्वीरित्या सक्रिय केले आहे!",
                  {
                    icon: "success",
                  }
                );
                getNoHawkingZone();
                setButtonInputState(false);
              }
            })
            .catch((error) => {
              setValue("loadderState", false);
              callCatchMethod(error, language);
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

  // Reset
  const resetValuesCancell = {
    fromDate: null,
    toDate: null,
    gisId: "",
    noHawkingZonePrefix: "",
    citySurveyNo: "",
    noHawkingZoneName: "",
    noHawkingZoneNameMr: "",
    areaName: null,
    declarationDate: null,
    declarationOrderNo: "",
    declarationOrder: "",
    capacityOfHawkingZone: "",
    noOfHawkersPresent: "",
    item: null,
    noHawkingZoneInfo: "",
    remarks: "",
    zone: null,
    ward: null,
    applicationName: null,
    declarationPhoto: null,
  };

  // Reset
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    gisId: "",
    noHawkingZonePrefix: "",
    citySurveyNo: "",
    noHawkingZoneName: "",
    noHawkingZoneNameMr: "",
    areaName: null,
    declarationDate: null,
    declarationOrderNo: "",
    declarationOrder: "",
    capacityOfHawkingZone: "",
    noOfHawkersPresent: "",
    item: null,
    noHawkingZoneInfo: "",
    zone: null,
    remarks: "",
    ward: null,
    applicationName: null,
    declarationPhoto: null,
    id: null,
  };

  // Exit
  const exitButton = () => {
    clearErrors();
    setDeclarationPhoto(null);
    if (document.getElementById("uploadButtonHawkerWithoutAdd")) {
      document.getElementById("uploadButtonHawkerWithoutAdd").value = null;
    }

    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
  };

  // cancell
  const cancellButton = () => {
    clearErrors();
    setDeclarationPhoto(null);
    if (document.getElementById("uploadButtonHawkerWithoutAdd")) {
      document.getElementById("uploadButtonHawkerWithoutAdd").value = null;
    }
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // define colums table
  const noHawkingZoneColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: <FormattedLabel id="srNo" />,
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "applicationNameEn" : "applicationNameMr",
      headerName: <FormattedLabel id="applicationName" />,
      description: <FormattedLabel id="applicationName" />,
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "noHawkingZoneName",
      headerName: <FormattedLabel id="noHawkingZoneNameEn" />,
      description: <FormattedLabel id="noHawkingZoneNameEn" />,
      width: 240,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "noHawkingZoneNameMr",
      headerName: <FormattedLabel id="noHawkingZoneNameMr" />,
      description: <FormattedLabel id="noHawkingZoneNameMr" />,
      width: 240,
      headerAlign: "center",
      align: "center",
    },

    {
      field: language == "en" ? "zoneNameEn" : "zoneNameMr",
      headerName: <FormattedLabel id="zoneName" />,
      description: <FormattedLabel id="zoneName" />,
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "wardNameEn" : "wardNameMr",
      headerName: <FormattedLabel id="wardName" />,
      description: <FormattedLabel id="wardName" />,
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "areaNameEn" : "areaNameMr",
      headerName: <FormattedLabel id="areaName" />,
      description: <FormattedLabel id="areaName" />,
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "citySurveyNo",
      headerName: <FormattedLabel id="citySurveyNo" />,
      description: <FormattedLabel id="citySurveyNo" />,
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "gisId",
      headerName: <FormattedLabel id="gisId" />,
      description: <FormattedLabel id="gisId" />,
      width: 200,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "declarationDate1",
      headerName: <FormattedLabel id="declarationDate" />,
      description: <FormattedLabel id="declarationDate" />,
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "declarationOrder",
      headerName: <FormattedLabel id="declarationOrder" />,
      description: <FormattedLabel id="declarationOrder" />,
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "declarationOrderNo",
      headerName: <FormattedLabel id="declarationOrderNo" />,
      description: <FormattedLabel id="declarationOrderNo" />,
      width: 200,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "noHawkingZoneInfo",
      headerName: <FormattedLabel id="noHawkingZoneInfo" />,
      description: <FormattedLabel id="noHawkingZoneInfo" />,
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "fromDate1",
      headerName: <FormattedLabel id="fromDate" />,
      description: <FormattedLabel id="fromDate" />,
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "toDate1",
      headerName: <FormattedLabel id="toDate" />,
      description: <FormattedLabel id="toDate" />,
      width: 150,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "remarks",
      headerName: <FormattedLabel id="remark" />,
      description: <FormattedLabel id="remark" />,
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="action" />,
      description: <FormattedLabel id="action" />,
      headerAlign: "center",
      align: "center",
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update");
                setID(params?.row?.id);
                setIsOpenCollapse(true);
                setSlideChecked(true);
                setButtonInputState(true);
                reset(params?.row);
                setDeclarationPhoto(params?.row?.declarationPhoto);
              }}
            >
              <EditIcon sx={{ color: "#556CD6" }} />
            </IconButton>

            <IconButton>
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

  // loadderSetTimeOutFunction
  const loadderSetTimeOutFunction = () => {
    setTimeout(() => {
      console.log("bhvaa", watch("loadderState"));
      setValue("loadderState", false);
      console.log("bhvaa2", watch("loadderState"));
    }, 0);
  };


  //!  ===========> useEffects <===============

  useEffect(() => {
    setValue("loadderState", true);
    if (document.getElementById("uploadButtonHawkerWithoutAdd")) {
      document.getElementById("uploadButtonHawkerWithoutAdd").value = null;
    }
    setDeclarationPhoto(null);
    clearErrors();
    setDataValidation(NoHawkingZoneSchema(language));
    loadderSetTimeOutFunction();
    getZone();
    getItem();
    getModuleName();
    // for table only
    getWardNames();
    getAreaNames();
  }, []);

  useEffect(() => {
    getNoHawkingZone();
    console.log("useEffect");
  }, [zoneNames, itemNames, areaNames, applicationNames]);

  // get ward
  useEffect(() => {
    getWard();
  }, [watch("zone")]);

  // get Area
  useEffect(() => {
    getArea();
  }, [watch("ward"), watch("zone")]);

  // Errors
  useEffect(() => {
    console.log("ErorrsHawkingZone", errors);
  }, [errors]);

  useEffect(() => {
    trigger("capacityOfHawkingZone");
    trigger("noOfHawkersPresent");
  }, [watch("capacityOfHawkingZone")]);

  useEffect(() => {
    if (
      // watch("declarationPhoto") != null ||
      watch("declarationPhoto") != undefined
    ) {
      setDeclarationPhoto(watch("declarationPhoto"));
      clearErrors("declarationPhoto");
    }
  }, []);

  useEffect(() => {
    setValue("declarationPhoto", declarationPhoto);
  }, [declarationPhoto]);

  useEffect(() => {
    setValue("declarationPhoto", declarationPhoto);
    trigger("declarationPhoto");
  }, [declarationPhoto]);


  // View
  return (
    <div>
      {watch("loadderState") ? (
        <Loader />
      ) : (
        <div>
          <Paper className={NoHawkingZoneCSS.Paper} elevation={5}>
            <ThemeProvider theme={theme}>
              {/** header */}
              <div className={NoHawkingZoneCSS.MainHeader}>
                {<FormattedLabel id="noHawkingZone" />}
              </div>
              {/** content */}
              {isOpenCollapse && (
                <Slide
                  direction="down"
                  in={slideChecked}
                  mountOnEnter
                  unmountOnExit
                >
                  <div>
                    <FormProvider {...methods}>
                      <form onSubmit={handleSubmit(onSubmitForm)}>
                        <Grid
                          container
                          className={NoHawkingZoneCSS.GridContainer}
                        >
                          {/** Module Name */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={NoHawkingZoneCSS.GridItem}
                          >
                            <FormControl
                              variant="standard"
                              error={!!errors?.applicationName}
                            >
                              <InputLabel
                                shrink={
                                  watch("applicationName") !== null &&
                                    watch("applicationName") !== "" &&
                                    watch("applicationName") !== undefined
                                    ? true
                                    : false
                                }
                                id="demo-simple-select-standard-label"
                              >
                                <FormattedLabel id="applicationName" required />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    className={NoHawkingZoneCSS.FiledWidth}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label=<FormattedLabel
                                      id="applicationName"
                                      required
                                    />
                                  >
                                    {applicationNames &&
                                      applicationNames.map(
                                        (applicationName, index) => (
                                          <MenuItem
                                            key={index}
                                            value={applicationName?.id}
                                          >
                                            {language == "en"
                                              ? applicationName?.applicationNameEn
                                              : applicationName?.applictionNameMr}
                                          </MenuItem>
                                        )
                                      )}
                                  </Select>
                                )}
                                name="applicationName"
                                control={control}
                                defaultValue={null}
                              />
                              <FormHelperText>
                                {errors?.applicationName
                                  ? errors?.applicationName?.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          {/** fromDate */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={NoHawkingZoneCSS.GridItem}
                          >
                            <FormControl
                              style={{ marginTop: 0 }}
                              error={!!errors?.fromDate}
                            >
                              <Controller
                                name="fromDate"
                                control={control}
                                defaultValue={null}
                                render={({ field }) => (
                                  <LocalizationProvider
                                    dateAdapter={AdapterMoment}
                                  >
                                    <DatePicker
                                      // minDate={moment.now()}
                                      className={NoHawkingZoneCSS.FiledWidth}
                                      inputFormat="DD/MM/YYYY"
                                      label={
                                        <span style={{ fontSize: 16 }}>
                                          <FormattedLabel
                                            id="fromDate"
                                            required
                                          />
                                        </span>
                                      }
                                      value={field.value}
                                      onChange={(date) =>
                                        field.onChange(
                                          moment(date).format("YYYY-MM-DD")
                                        )
                                      }
                                      selected={field.value}
                                      center
                                      renderInput={(params) => (
                                        <TextField
                                          error={!!errors?.fromDate}
                                          {...params}
                                          size="small"
                                          fullWidth
                                          InputLabelProps={{
                                            style: {
                                              fontSize: 12,
                                              marginTop: 3,
                                            },
                                          }}
                                        />
                                      )}
                                    />
                                  </LocalizationProvider>
                                )}
                              />
                              <FormHelperText>
                                {errors?.fromDate
                                  ? errors?.fromDate?.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          {/** toDate */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={NoHawkingZoneCSS.GridItem}
                          >
                            <FormControl
                              style={{ marginTop: 0 }}
                              error={!!errors?.toDate}
                            >
                              <Controller
                                control={control}
                                name="toDate"
                                defaultValue={null}
                                render={({ field }) => (
                                  <LocalizationProvider
                                    dateAdapter={AdapterMoment}
                                  >
                                    <DatePicker
                                      error={!!errors?.toDate}
                                      minDate={watch("fromDate")}
                                      disabled={
                                        watch("fromDate") == null ? true : false
                                      }
                                      className={NoHawkingZoneCSS.FiledWidth}
                                      inputFormat="DD/MM/YYYY"
                                      label={
                                        <span style={{ fontSize: 16 }}>
                                          <FormattedLabel id="toDate" />
                                        </span>
                                      }
                                      value={field.value}
                                      onChange={(date) =>
                                        field.onChange(
                                          moment(date).format("YYYY-MM-DD")
                                        )
                                      }
                                      selected={field.value}
                                      center
                                      renderInput={(params) => (
                                        <TextField
                                          error={!!errors?.toDate}
                                          {...params}
                                          size="small"
                                          fullWidth
                                          InputLabelProps={{
                                            style: {
                                              fontSize: 12,
                                              marginTop: 3,
                                            },
                                          }}
                                        />
                                      )}
                                    />
                                  </LocalizationProvider>
                                )}
                              />
                              <FormHelperText>
                                {errors?.toDate
                                  ? errors?.toDate?.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>

                          {/** hawking zone name en */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={NoHawkingZoneCSS.GridItem}
                          >
                            {/* <TextField
                              className={NoHawkingZoneCSS.FiledWidth}
                              id='standard-basic'
                              label=<FormattedLabel
                                id='noHawkingZoneNameEn'
                                required
                              />
                              variant='standard'
                              {...register("noHawkingZoneName")}
                              error={!!errors?.noHawkingZoneName}
                              helperText={
                                errors?.noHawkingZoneName
                                  ? errors?.noHawkingZoneName.message
                                  : null
                              }
                            /> */}

                            <Translation
                              labelName={
                                <FormattedLabel
                                  id="noHawkingZoneNameEn"
                                  required
                                />
                              }
                              label={
                                <FormattedLabel
                                  id="noHawkingZoneNameEn"
                                  required
                                />
                              }
                              width={270}
                              disabled={watch("disabledFieldInputState")}
                              error={!!errors?.noHawkingZoneName}
                              helperText={
                                errors?.noHawkingZoneName
                                  ? errors?.noHawkingZoneName?.message
                                  : null
                              }
                              key={"noHawkingZoneName"}
                              fieldName={"noHawkingZoneName"}
                              updateFieldName={"noHawkingZoneNameMr"}
                              sourceLang={"en-US"}
                              targetLang={"mr-IN"}
                            />
                          </Grid>
                          {/** hawking zone name mr */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={NoHawkingZoneCSS.GridItem}
                          >
                            {/* <TextField
                              className={NoHawkingZoneCSS.FiledWidth}
                              id='standard-basic'
                              label=<FormattedLabel
                                id='noHawkingZoneNameMr'
                                required
                              />
                              variant='standard'
                              {...register("noHawkingZoneNameMr")}
                              error={!!errors?.noHawkingZoneNameMr}
                              helperText={
                                errors?.noHawkingZoneNameMr
                                  ? errors?.noHawkingZoneNameMr.message
                                  : null
                              }
                            /> */}

                            <Translation
                              labelName={
                                <FormattedLabel
                                  id="noHawkingZoneNameMr"
                                  required
                                />
                              }
                              label={
                                <FormattedLabel
                                  id="noHawkingZoneNameMr"
                                  required
                                />
                              }
                              width={270}
                              disabled={watch("disabledFieldInputState")}
                              error={!!errors?.noHawkingZoneNameMr}
                              helperText={
                                errors?.noHawkingZoneNameMr
                                  ? errors?.noHawkingZoneNameMr?.message
                                  : null
                              }
                              key={"noHawkingZoneNameMr"}
                              fieldName={"noHawkingZoneNameMr"}
                              updateFieldName={"noHawkingZoneName"}
                              sourceLang={"en-US"}
                              targetLang={"mr-IN"}
                            />
                          </Grid>

                          {/** hawking zone info */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={NoHawkingZoneCSS.GridItem}
                          >
                            <TextField
                              InputLabelProps={{
                                shrink:
                                  watch("noHawkingZoneInfo") !== null &&
                                    watch("noHawkingZoneInfo") !== "" &&
                                    watch("noHawkingZoneInfo") !== undefined
                                    ? true
                                    : false,
                              }}
                              className={NoHawkingZoneCSS.FiledWidth}
                              id="standard-basic"
                              label=<FormattedLabel
                                id="noHawkingZoneInfo"
                                required
                              />
                              variant="standard"
                              {...register("noHawkingZoneInfo")}
                              error={!!errors.noHawkingZoneInfo}
                              helperText={
                                errors?.noHawkingZoneInfo
                                  ? errors.noHawkingZoneInfo.message
                                  : null
                              }
                            />
                          </Grid>
                          {/** zone Name */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={NoHawkingZoneCSS.GridItem}
                          >
                            <FormControl
                              variant="standard"
                              error={!!errors?.zone}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                <FormattedLabel id="zoneName" required />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    className={NoHawkingZoneCSS.FiledWidth}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label=<FormattedLabel
                                      id="zoneName"
                                      required
                                    />
                                  >
                                    {zoneNames &&
                                      zoneNames.map((zoneName, index) => (
                                        <MenuItem
                                          key={index}
                                          value={zoneName?.id}
                                        >
                                          {language == "en"
                                            ? zoneName?.zoneName
                                            : zoneName?.zoneNameMr}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name="zone"
                                control={control}
                                defaultValue={null}
                              />
                              <FormHelperText>
                                {errors?.zone ? errors?.zone?.message : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          {/** ward Name */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={NoHawkingZoneCSS.GridItem}
                          >
                            <FormControl
                              variant="standard"
                              error={!!errors?.ward}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                <FormattedLabel id="wardName" required />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    disabled={
                                      watch("zone") != null ? false : true
                                    }
                                    className={NoHawkingZoneCSS.FiledWidth}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label=<FormattedLabel
                                      id="wardName"
                                      required
                                    />
                                  >
                                    {wardNames &&
                                      wardNames.map((ward, index) => (
                                        <MenuItem key={index} value={ward?.id}>
                                          {language == "en"
                                            ? ward?.wardNameEn
                                            : ward?.wardNameMr}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name="ward"
                                control={control}
                                defaultValue={null}
                              />
                              <FormHelperText>
                                {errors?.ward ? errors?.ward?.message : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          {/** area  */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={NoHawkingZoneCSS.GridItem}
                          >
                            <FormControl
                              sx={{ marginTop: 2 }}
                              error={!!errors.areaName}
                            >
                              <InputLabel
                                shrink={
                                  watch("areaName") !== null &&
                                    watch("areaName") !== "" &&
                                    watch("areaName") !== undefined
                                    ? true
                                    : false
                                }
                                id="demo-simple-select-standard-label"
                              >
                                {<FormattedLabel id="areaName" required />}
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    disabled={
                                      watch("ward") != null ? false : true
                                    }
                                    className={NoHawkingZoneCSS.FiledWidth}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label={
                                      <FormattedLabel id="areaName" required />
                                    }
                                  >
                                    {areaNames &&
                                      areaNames.map((areaName, index) => (
                                        <MenuItem
                                          key={index}
                                          value={areaName.id}
                                        >
                                          {language == "en"
                                            ? areaName?.areaNameEn
                                            : areaName?.areaNameMr}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name="areaName"
                                control={control}
                                defaultValue={null}
                              />
                              <FormHelperText>
                                {errors?.areaName
                                  ? errors?.areaName?.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          {/** city Survey No */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={NoHawkingZoneCSS.GridItem}
                          >
                            <TextField
                              className={NoHawkingZoneCSS.FiledWidth}
                              id="standard-basic"
                              label=<FormattedLabel
                                id="citySurveyNumber"
                                required
                              />
                              variant="standard"
                              {...register("citySurveyNo")}
                              error={!!errors.citySurveyNo}
                              helperText={
                                errors?.citySurveyNo
                                  ? errors.citySurveyNo.message
                                  : null
                              }
                              InputLabelProps={{
                                shrink:
                                  watch("citySurveyNo") !== null &&
                                    watch("citySurveyNo") !== "" &&
                                    watch("citySurveyNo") !== undefined
                                    ? true
                                    : false,
                              }}
                            />
                          </Grid>
                          {/** gis id  */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={NoHawkingZoneCSS.GridItem}
                          >
                            <TextField
                              InputLabelProps={{
                                shrink:
                                  watch("gisId") !== null &&
                                    watch("gisId") !== "" &&
                                    watch("gisId") !== undefined
                                    ? true
                                    : false,
                              }}
                              className={NoHawkingZoneCSS.FiledWidth}
                              id="standard-basic"
                              label=<FormattedLabel id="gisId" required />
                              variant="standard"
                              {...register("gisId")}
                              error={!!errors?.gisId}
                              helperText={
                                errors?.gisId ? errors?.gisId?.message : null
                              }
                            />
                          </Grid>

                          {/** declaration order no */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={NoHawkingZoneCSS.GridItem}
                          >
                            <TextField
                              InputLabelProps={{
                                shrink:
                                  watch("declarationOrderNo") !== null &&
                                    watch("declarationOrderNo") !== "" &&
                                    watch("declarationOrderNo") !== undefined
                                    ? true
                                    : false,
                              }}
                              className={NoHawkingZoneCSS.FiledWidth}
                              id="standard-basic"
                              label=<FormattedLabel
                                id="declarationOrderNumber"
                                required
                              />
                              variant="standard"
                              {...register("declarationOrderNo")}
                              error={!!errors?.declarationOrderNo}
                              helperText={
                                errors?.declarationOrderNo
                                  ? errors?.declarationOrderNo?.message
                                  : null
                              }
                            />
                          </Grid>
                          {/** declaration date */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={NoHawkingZoneCSS.GridItem}
                          >
                            <FormControl
                              error={!!errors.declarationDate}
                              style={{ marginTop: 0 }}
                            >
                              <Controller
                                error={!!errors.declarationDate}
                                control={control}
                                name="declarationDate"
                                defaultValue={null}
                                render={({ field }) => (
                                  <LocalizationProvider
                                    dateAdapter={AdapterMoment}
                                  >
                                    <DatePicker
                                      error={errors.declarationDate}
                                      className={NoHawkingZoneCSS.FiledWidth}
                                      inputFormat="DD/MM/YYYY"
                                      label={
                                        <span style={{ fontSize: 16 }}>
                                          <FormattedLabel
                                            id="declarationDate"
                                            required
                                          />
                                        </span>
                                      }
                                      value={field.value}
                                      onChange={(date) =>
                                        field.onChange(
                                          moment(date).format("YYYY-MM-DD")
                                        )
                                      }
                                      selected={field.value}
                                      center
                                      renderInput={(params) => (
                                        <TextField
                                          error={errors?.declarationDate}
                                          {...params}
                                          size="small"
                                          fullWidth
                                          InputLabelProps={{
                                            style: {
                                              fontSize: 12,
                                              marginTop: 3,
                                            },
                                          }}
                                        />
                                      )}
                                    />
                                  </LocalizationProvider>
                                )}
                              />
                              <FormHelperText>
                                {errors?.declarationDate
                                  ? errors.declarationDate.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          {/** declaration order */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={NoHawkingZoneCSS.GridItem}
                          >
                            <TextField
                              InputLabelProps={{
                                shrink:
                                  watch("declarationOrder") !== null &&
                                    watch("declarationOrder") !== "" &&
                                    watch("declarationOrder") !== undefined
                                    ? true
                                    : false,
                              }}
                              className={NoHawkingZoneCSS.FiledWidth}
                              id="standard-basic"
                              label=<FormattedLabel
                                id="declarationOrder"
                                required
                              />
                              variant="standard"
                              {...register("declarationOrder")}
                              error={!!errors?.declarationOrder}
                              helperText={
                                errors?.declarationOrder
                                  ? errors?.declarationOrder?.message
                                  : null
                              }
                            />
                          </Grid>

                          {/** remarks */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={NoHawkingZoneCSS.GridItem}
                          >
                            <TextField
                              InputLabelProps={{
                                shrink:
                                  watch("remarks") !== null &&
                                    watch("remarks") !== "" &&
                                    watch("remarks") !== undefined
                                    ? true
                                    : false,
                              }}
                              className={NoHawkingZoneCSS.FiledWidth}
                              id="standard-basic"
                              label=<FormattedLabel id="remark" />
                              variant="standard"
                              {...register("remarks")}
                              error={!!errors.remarks}
                              helperText={
                                errors?.remarks ? errors.remarks.message : null
                              }
                            />
                          </Grid>
                          {/** file upload */}

                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={
                              NoHawkingZoneCSS.GridItemCenterFileUplaod
                            }
                          // className={NoHawkingZoneCSS.GridItem}
                          >
                            <div className={NoHawkingZoneCSS.UploadButtonTitle}>
                              {<FormattedLabel id="hawkerPhoto" required />}
                            </div>

                            <div className={styles.attachFile}>
                              <UploadButtonHawkerWithoutAdd
                                appName="HMS"
                                serviceName="H-IssuanceofHawkerLicense"
                                filePath={setDeclarationPhoto}
                                fileName={declarationPhoto}
                              // fileData={declarationPhoto}
                              />
                              <FormHelperText
                                error={!!errors?.declarationPhoto}
                              >  <div className={NoHawkingZoneCSS.UploadButtonTitle1}>
                                  {errors?.declarationPhoto
                                    ? errors?.declarationPhoto?.message
                                    : null}
                                </div>
                              </FormHelperText>
                            </div>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={
                              NoHawkingZoneCSS.GridItemCenterFileUplaod
                            }
                          ></Grid>
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={
                              NoHawkingZoneCSS.GridItemCenterFileUplaod
                            }
                          ></Grid>
                        </Grid>

                        {/** Buttons */}
                        <Stack
                          direction={{
                            xs: "column",
                            sm: "row",
                            md: "row",
                            lg: "row",
                            xl: "row",
                          }}
                          spacing={{ xs: 2, sm: 2, md: 5, lg: 5, xl: 5 }}
                          className={NoHawkingZoneCSS.ButtonStack}
                        >
                          <Button
                            size="small"
                            className={NoHawkingZoneCSS.ButtonForMobileWidth}
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
                            size="small"
                            className={NoHawkingZoneCSS.ButtonForMobileWidth}
                            variant="contained"
                            color="primary"
                            endIcon={<ClearIcon />}
                            onClick={() => cancellButton()}
                          >
                            <FormattedLabel id="clear" />
                          </Button>
                          <Button
                            size="small"
                            className={NoHawkingZoneCSS.ButtonForMobileWidth}
                            variant="contained"
                            color="error"
                            endIcon={<ExitToAppIcon />}
                            onClick={() => exitButton()}
                          >
                            <FormattedLabel id="exit" />
                          </Button>
                        </Stack>
                      </form>
                    </FormProvider>
                  </div>
                </Slide>
              )}

              {/** buttons */}
              <div className={NoHawkingZoneCSS.AddButton}>
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
            <div className={NoHawkingZoneCSS.DataGridDiv}>
              <DataGrid
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
                components={{ Toolbar: GridToolbar }}
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
                columns={noHawkingZoneColumns}
                density="standard"
                autoHeight={true}
                pagination
                paginationMode="server"
                page={noHawkingZoneData?.page}
                rowCount={noHawkingZoneData?.totalRows}
                rowsPerPageOptions={noHawkingZoneData?.rowsPerPageOptions}
                pageSize={noHawkingZoneData?.pageSize}
                rows={
                  noHawkingZoneData?.rows != null &&
                    noHawkingZoneData?.rows != undefined
                    ? noHawkingZoneData?.rows
                    : []
                }
                onPageChange={(_data) => {
                  getNoHawkingZone(noHawkingZoneData?.pageSize, _data);
                }}
                onPageSizeChange={(_data) => {
                  getNoHawkingZone(_data, noHawkingZoneData?.page);
                }}
              />
            </div>
          </Paper>
        </div>
      )}
    </div>
  );
};

export default Index;
