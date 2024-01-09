import AddIcon from "@mui/icons-material/Add";
import UploadButton from "../../../../components/SlumBillingManagementSystem/FileUpload/UploadButton copy";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Checkbox,
  Grid,
  Autocomplete,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import {
  DataGrid
} from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import schema from "../../../../containers/schema/slumManagementSchema/slumSchema";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { GridToolbar } from "@mui/x-data-grid";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import moment from "moment";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";

const Index = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [editData, setEditData] = useState({});
  const [ownerShipData, setOwnerShipData] = useState([]);
  const [areaDropDown, setAreaDropDown] = useState([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [dataPageNo, setDataPage] = useState();
  const [villageData, setVillageData] = useState([]);
  const [zoneData, setZoneData] = useState([]);
  const [wardData, setWardData] = useState([]);
  const [clusterData, setClusterData] = useState([]);
  const [selectedValuesOfVillageName, setSelectedValuesOfVillageName] =useState([]);
  const [selectedValuesOfZoneName, setSelectedValuesOfZoneName] = useState([]);
  const [selectedValuesOfWardName, setSelectedValuesOfWardName] = useState([]);
  const [selectedValuesOfClusterName, setSelectedValuesOfClusterName] = useState([]);
  const [villageSelectedData, setVillageSelectedData] = useState([]);
  const [zoneSelectedData, setZoneSelectedData] = useState([]);
  const [wardSelectedData, setWardSelectedData] = useState([]);
  const [clusterSelectedData, setClusterSelectedData] = useState([]);
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const [photo, setPhoto] = useState();
  const language = useSelector((state) => state.labels.language);

  //get logged in user
  const user = useSelector((state) => state.user.user);
  const handleSelect = (evt, value) => {
    const selectedIds = value.map((val) => val.id);

    setVillageSelectedData(value);
    setSelectedValuesOfVillageName(selectedIds);
  };
  const handleZoneSelect = (evt, value) => {
    setZoneSelectedData(value);
    const selectedIds = value.map((val) => val.id);

    setSelectedValuesOfZoneName(selectedIds);
  };
  const handleWardSelect = (evt, value) => {
    setWardSelectedData(value);
    const selectedIds = value.map((val) => val.id);

    setSelectedValuesOfWardName(selectedIds);
  };
  const handleClusterSelect = (evt, value) => {
    setClusterSelectedData(value);
    const selectedIds = value.map((val) => val.id);

    setSelectedValuesOfClusterName(selectedIds);
  };

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error, moduleOrCFC) => {
    if (!catchMethodStatus) {
      if (moduleOrCFC) {
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      } else {
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };

  useEffect(() => {
    getOwnerShip();
    getArea();
    getAllVillageName();
    getAllZoneName();
    getAllWardName();
    getCluster();
  }, []);

  useEffect(() => {
    getAllSlumData();
  }, [fetchData, id]);

  useEffect(() => {
    let _res = editData;
    setValue("slumPrefix", _res?.slumPrefix ? _res?.slumPrefix : "");
    setValue("citySurveyNo", _res?.citySurveyNo ? _res?.citySurveyNo : "");
    setValue("surveyOrGatNo", _res?.surveyOrGatNo ? _res?.surveyOrGatNo : "");
    setValue("fromDate", _res?.fromDate ? _res?.fromDate : "");
    setValue("toDate", _res?.toDate ? _res?.toDate : "");
    setValue(
      "declarationDate",
      _res?.declarationDate ? _res?.declarationDate : ""
    );
    setValue(
      "declarationOrderNo",
      _res?.declarationOrderNo ? _res?.declarationOrderNo : ""
    );
    setValue(
      "declarationOrder",
      _res?.declarationOrder ? _res?.declarationOrder : null
    );
    setValue("areaName", _res?.areaName ? _res?.areaName : "");
    setValue("areaKey", _res?.areaKey ? _res?.areaKey : "");
    setValue("areaOfSlum", _res?.areaOfSlum ? _res?.areaOfSlum : "");
    setValue("gisId", _res?.gisId ? _res?.gisId : "");
    setValue("noOfHuts", _res?.noOfHuts ? _res?.noOfHuts : "");
    setValue("ownershipKey", _res?.ownershipKey ? _res?.ownershipKey : "");
    setValue(
      "hutOccupiedArea",
      _res?.hutOccupiedArea ? _res?.hutOccupiedArea : ""
    );
    setValue(
      "totalPopulation",
      _res?.totalPopulation ? _res?.totalPopulation : ""
    );
    setValue(
      "malePopulation",
      _res?.malePopulation ? _res?.malePopulation : ""
    );
    setValue(
      "femalePopulation",
      _res?.femalePopulation ? _res?.femalePopulation : ""
    );
    setValue("scPopulation", _res?.scPopulation ? _res?.scPopulation : "");
    setValue("stPopulation", _res?.stPopulation ? _res?.stPopulation : "");
    setValue(
      "otherPopulation",
      _res?.otherPopulation ? _res?.otherPopulation : ""
    );
    setValue(
      "slumBoundaryInfo",
      _res?.slumBoundaryInfo ? _res?.slumBoundaryInfo : ""
    );
    setValue("slumStatus", _res?.slumStatus ? _res?.slumStatus : "");
    setValue("fromDate", _res?.fromDate ? _res?.fromDate : null);
    setValue("zoneKey", _res?.zoneKey ? _res?.zoneKey : null);
    setValue("wardKey", _res?.wardKey ? _res?.wardKey : null);
    setValue("villageKey", _res?.villageKey ? _res?.villageKey : null);
    setValue("clusterKey", _res?.clusterKey ? _res?.clusterKey : null);
    setValue("toDate", _res?.toDate ? _res?.toDate : null);
    setValue(
      "declarationDate",
      _res?.declarationDate ? _res?.declarationDate : null
    );

    // Set villageName value
    const villageNamesArray = _res?.villageNameArray || [];
    const selectedVillageNames = villageData.filter((option) =>
      villageNamesArray.includes(option.id)
    );
    setValue("villageName", selectedVillageNames);

    // Set zoneName value
    const zoneNamesArray = _res?.zoneNameArray || [];
    const selectedZoneNames = zoneData.filter((option) =>
      zoneNamesArray.includes(option.id)
    );
    setValue("zoneName", selectedZoneNames);

    // Set wardName value
    const wardNamesArray = _res?.wardNameArray || [];
    const selectedWardNames = wardData.filter((option) =>
      wardNamesArray.includes(option.id)
    );
    setValue("wardName", selectedWardNames);

    // Set clusterName value
    const clusterNamesArray = _res?.clusterNameArray || [];
    const selectedClusterNames = clusterData.filter((option) =>
      clusterNamesArray.includes(option.id)
    );
    setValue("clusterName", selectedClusterNames);
  }, [editData]);

  // Get Ownership data

  const getOwnerShip = () => {
    axios
      .get(`${urls.SLUMURL}/mstSbOwnershipType/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setOwnerShipData(res.data.mstSbOwnershipTypeList);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getArea = () => {
    axios
      .get(`${urls.CFCURL}/master/area/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        let result = r.data.area;
        let res =
          result &&
          result.map((r) => {
            return {
              id: r.id,
              areaEn: r.areaName,
              areaMr: r.areaNameMr,
            };
          });
        setAreaDropDown(res);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  const getAllVillageName = () => {
    axios
      .get(`${urls.CFCURL}/master/village/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          let data = res?.data?.village?.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            villageNameEn: r.villageName,
            villageNameMr: r.villageNameMr,
          }));
          setVillageData(data);
        } else {
          sweetAlert(
            language == "en" ? "Something Went To Wrong !" : "काहीतरी चूक झाली!", { button: language === "en" ? "Ok" : "ठीक आहे" }
          );
        }
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  const getAllZoneName = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          let data = res?.data?.zone?.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            zoneNameEn: r.zoneName,
            zoneNameMr: r.zoneNameMr,
          }));
          setZoneData(data);
        } else {
          sweetAlert(
            language == "en" ? "Something Went To Wrong !" : "काहीतरी चूक झाली!", { button: language === "en" ? "Ok" : "ठीक आहे" }
          );
        }
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  const getAllWardName = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          let data = res?.data?.ward?.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            wardNameEn: r.wardName,
            wardNameMr: r.wardNameMr,
          }));
          setWardData(data);
        } else {
          sweetAlert(
            language == "en" ? "Something Went To Wrong !" : "काहीतरी चूक झाली!", { button: language === "en" ? "Ok" : "ठीक आहे" }
          );
        }
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  const getCluster = () => {
    axios
      .get(`${urls.SLUMURL}/mstCluster/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        let result = r.data.mstClusterDaoList;
        let res =
          result &&
          result.map((r) => {
            return {
              id: r.id,
              clusterNameEng: r.clusterNameEng,
              clusterNameMr: r.clusterNameMr,
            };
          });
        setClusterData(res);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };


  // Get Table - Data
  const getAllSlumData = (_pageSize = 10, _pageNo = 0) => {
    setIsLoading(true);
    axios
      .get(`${urls.SLUMURL}/mstSlum/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setIsLoading(false);
        let result = r.data.mstSlumList;
        let _res = result.map((r, i) => {
          return {
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1 + _pageNo * _pageSize,
            slumName: r.slumName,
            slumNameMr: r.slumNameMr,
            declarationDate: r.declarationDate,
            declarationDate1:r.declarationDate?moment(r.declarationDate).format('DD/MM/YYYY'):'-',
            declarationOrderNo: r.declarationOrderNo,
            areaKey: r.areaKey,
            areaName:r.areaKey?
              areaDropDown &&
              areaDropDown.find((obj) => obj.id == r.areaKey)?.areaEn:"-",
            areaNameMr:
              areaDropDown &&
              areaDropDown.find((obj) => obj.id == r.areaKey)?.areaMr,
            ownership:
              ownerShipData &&
              ownerShipData.find((obj) => obj.id == r.ownershipKey)
                ?.ownershipType,
            ownershipMr:
              ownerShipData &&
              ownerShipData.find((obj) => obj.id == r.ownershipKey)
                ?.ownershipTypeMr,
            slumArea: r.areaOfSlum,
            gisId: r.gisId,
            noOfHuts: r.noOfHuts,
            population: r.totalPopulation,
            slumBoundaryInfo: r.slumBoundaryInfo,
            slumStatus: r.slumStatus,
            villageNameArray: r.villageNameArray,
            zoneNameArray: r.zoneNameArray,
            wardNameArray: r.wardNameArray,
            clusterNameArray: r.clusterNameArray,
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
            slumPrefix: r.slumPrefix,
            citySurveyNo: r.citySurveyNo,
            surveyOrGatNo: r.surveyOrGatNo,
            fromDate: r.fromDate,
            toDate: r.toDate,
            declarationOrder: r.declarationOrder,
            ownershipKey: r.ownershipKey,
            hutOccupiedArea: r.hutOccupiedArea,
            totalPopulation: r.totalPopulation,
            malePopulation: r.malePopulation,
            femalePopulation: r.femalePopulation,
            scPopulation: r.scPopulation,
            stPopulation: r.stPopulation,
            otherPopulation: r.otherPopulation,
            otherPopulation: r.otherPopulation,
            areaOfSlum: r.areaOfSlum,
          };
        });
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const onSubmitForm = (fromData) => {
    setIsLoading(true);
    const fromDate = moment(fromData.fromDate).format("YYYY-MM-DD");
    const toDate = moment(fromData.toDate).format("YYYY-MM-DD");
    const declarationDate = moment(fromData.declarationDate).format(
      "YYYY-MM-DD"
    );

    const { clusterKey, villageKey, zoneKey, wardKey, ..._bodyWithoutKeys } =
      fromData;

    // Save - DB
    let _body = {
      ..._bodyWithoutKeys,
      fromDate,
      toDate,
      declarationDate,
      declarationOrder: photo,
      activeFlag: fromData.activeFlag,
      villageName:
        selectedValuesOfVillageName?.length > 0
          ? selectedValuesOfVillageName.join(",")
          : "",
      zoneName:
        selectedValuesOfZoneName?.length > 0
          ? selectedValuesOfZoneName.join(",")
          : "",
      wardName:
        selectedValuesOfWardName?.length > 0
          ? selectedValuesOfWardName.join(",")
          : "",
      clusterName:
        selectedValuesOfClusterName?.length > 0
          ? selectedValuesOfClusterName.join(",")
          : "",
    };
      const tempData = axios
        .post(`${urls.SLUMURL}/mstSlum/save`, _body, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          if (res.status == 201) {
            btnSaveText === "Update"
              ? sweetAlert(
                  language === "en" ? "Updated!" : "अद्ययावत केले!",
                  language === "en"
                    ? "Record Updated Successfully !"
                    : "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
                  "success", { button: language === "en" ? "Ok" : "ठीक आहे" }
                ).then((will)=>{
                  if(will){
                    setButtonInputState(false);
                    setIsOpenCollapse(false);
                    setFetchData(tempData);
                    setEditButtonInputState(false);
                    setPhoto();
                  }
                })
              : sweetAlert(
                  language === "en" ? "Saved!" : "जतन केले!",
                  language === "en"
                    ? "Record Saved Successfully !"
                    : "रेकॉर्ड यशस्वीरित्या जतन केले!",
                  "success", { button: language === "en" ? "Ok" : "ठीक आहे" }
                ).then((will)=>{
                  if(will){
                    setButtonInputState(false);
                    setIsOpenCollapse(false);
                    setFetchData(tempData);
                    setEditButtonInputState(false);
                    setPhoto();
                  }
                });
          }
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err, false);
        });
  };

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    if (_activeFlag === "N") {
      swal({
        title: language === "en" ? "Inactivate?" : "निष्क्रिय करायचे?",
        text:
          language === "en"
            ? "Are you sure you want to inactivate this Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता ? ",
        icon: "warning",
        buttons: [
          language == "en" ? "No" : "नाही",
          language === "en" ? "Yes" : "होय",
        ],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          axios
            .post(`${urls.SLUMURL}/mstSlum/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              if (res.status == 201) {
                swal(
                  language === "en"
                    ? "Record is Successfully Inactivated!"
                    : "रेकॉर्ड यशस्वीरित्या निष्क्रिय आहे!",
                  {
                    icon: "success",button: language === "en" ? "Ok" : "ठीक आहे" 
                  }
                ).then((will)=>{
                  if(will){
                    getAllSlumData();
                  }
                });
              }
            })
            .catch((err) => {
              cfcErrorCatchMethod(err, false);
            });
        } else if (willDelete == null) {
          swal(language === "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे", { button: language === "en" ? "Ok" : "ठीक आहे" });
        }
      });
    } else {
      swal({
        title: language === "en" ? "Activate?" : "सक्रिय करू?",
        text:
          language === "en"
            ? "Are you sure you want to activate this Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता ? ",
        icon: "warning",
        buttons: [
          language == "en" ? "No" : "नाही",
          language === "en" ? "Yes" : "होय",
        ],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          axios
            .post(`${urls.SLUMURL}/mstSlum/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              if (res.status == 201) {
                swal(
                  language === "en"
                    ? "Record is Successfully Activated!"
                    : "रेकॉर्ड यशस्वीरित्या सक्रिय केले आहे!",
                  {
                    icon: "success",button: language === "en" ? "Ok" : "ठीक आहे" 
                  }
                ).then((will)=>{
                  if(will){
                    getAllSlumData()
                  }
                });
              }
            })
            .catch((err) => {
              cfcErrorCatchMethod(err, false);
            });
        } else if (willDelete == null) {
          swal(language === "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे", { button: language === "en" ? "Ok" : "ठीक आहे" });
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
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      areaKey: "",
      ownershipKey: "",
      id,
    });
    setPhoto();
    setClusterSelectedData([]);
    setWardSelectedData([]);
    setZoneSelectedData([]);
    setVillageSelectedData([]);
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    slumName: "",
    slumNameMr: "",
    slumPrefix: "",
    citySurveyNo: "",
    surveyOrGatNo: "",
    fromDate: null,
    toDate: null,
    declarationDate: null,
    declarationOrderNo: "",
    areaName: "",
    ownershipKey: "",
    zoneKey: null,
    wardKey: null,
    villageKey: null,
    clusterKey: null,
    areaKey: "",
    areaOfSlum: "",
    gisId: "",
    declarationOrder: null,
    noOfHuts: "",
    hutOccupiedArea: "",
    totalPopulation: "",
    malePopulation: "",
    femalePopulation: "",
    scPopulation: "",
    stPopulation: "",
    otherPopulation: "",
    areaKey: "",
    slumBoundaryInfo: "",
    slumStatus: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    slumName: "",
    slumNameMr: "",
    slumPrefix: "",
    citySurveyNo: "",
    surveyOrGatNo: "",
    fromDate: null,
    areaKey: "",
    toDate: null,
    declarationDate: null,
    declarationOrderNo: "",
    photo: null,
    zoneKey: null,
    wardKey: null,
    villageKey: null,
    clusterKey: null,
    areaName: "", // Set the default value to an empty string
    ownershipKey: "", // Set the default value to an empty string
    areaOfSlum: "",
    gisId: "",
    declarationOrder: null,
    noOfHuts: "",
    hutOccupiedArea: "",
    totalPopulation: "",
    malePopulation: "",
    femalePopulation: "",
    scPopulation: "",
    stPopulation: "",
    slumBoundaryInfo: "",
    otherPopulation: "",
    slumStatus: "",
    id: null,
  };


  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
      width: 70,
    },

    {
      field: "declarationOrderNo",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="declarationOrderNo" />,
      flex: 1,
      headerAlign: "center",
      minWidth: 150,
    },

    {
      field: "declarationDate1",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="declarationDate" />,
      flex: 1,
      headerAlign: "center",
      minWidth: 150,
    },

    {
      field: language === "en" ? "slumName" : "slumNameMr",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="slumKey" />,
      flex: 1,
      minWidth: 250,
    },

    {
      field: language === "en" ? "areaName" : "areaNameMr",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="areaName" />,
      flex: 1,
      minWidth: 250,
    },

    {
      field: language === "en" ? "ownership" : "ownershipMr",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="ownership" />,
      flex: 1,
      minWidth: 150,
    },

    {
      field: "slumArea",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="slumArea" />,
      flex: 1,
      minWidth: 100,
    },

    {
      field: "noOfHuts",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="noOfHuts" />,
      flex: 1,
      minWidth: 100,
    },

    {
      field: "population",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="population" />,
      flex: 1,
      minWidth: 100,
    },

    {
      field: "slumBoundaryInfo",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="slumBoundaryInfo" />,
      flex: 1,
      minWidth: 200,
    },

    {
      field: "slumStatus",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="slumStatus" />,
      flex: 1,
      minWidth: 200,
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                const selectedVillageNames = villageData.filter((option) =>
                  params.row.villageNameArray?.includes(option.id)
                );
                const selectedZoneNames = zoneData.filter((option) =>
                  params.row.zoneNameArray?.includes(option.id)
                );
                const selectedWardNames = wardData.filter((option) =>
                  params.row.wardNameArray?.includes(option.id)
                );
                const selectedClusterNames = clusterData.filter((option) =>
                  params.row.clusterNameArray?.includes(option.id)
                );
                setValue("villageKey", selectedVillageNames);
                setVillageSelectedData(selectedVillageNames);
                setZoneSelectedData(selectedZoneNames);
                setWardSelectedData(selectedWardNames);
                setClusterSelectedData(selectedClusterNames);
                setPhoto(params?.row?.declarationOrder);
                reset(params.row);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setSlideChecked(true);
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
  useEffect(() => {
    setValue("villageKey", villageSelectedData);
  }, [villageSelectedData]);

  useEffect(() => {
    setValue("clusterKey", clusterSelectedData);
  }, [clusterSelectedData]);

  useEffect(() => {
    setValue("wardKey", wardSelectedData);
  }, [wardSelectedData]);
  useEffect(() => {
    setValue("zoneKey", zoneSelectedData);
  }, [zoneSelectedData]);
  // Row

  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      {isLoading && <CommonLoader />}
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginLeft: "10px",
          marginRight: "10px",
          marginTop: "10px",
          marginBottom: "60px",
          padding: 1,
        }}
      >
        <Box>
          <Grid container className={commonStyles.title}>
            <Grid item xs={1}>
              <IconButton
                style={{
                  color: "white",
                }}
                onClick={() => {
                  router.back();
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Grid>
            <Grid item xs={10}>
              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  marginRight: "2rem",
                }}
              >
                <FormattedLabel id="slumKey" />
              </h3>
            </Grid>
          </Grid>
        </Box>

        <FormProvider {...methods}>
          {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Grid container spacing={2} sx={{ padding: "1rem" }}>
                  {/* slum prefix */}

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <TextField
                      label={<FormattedLabel id="slumPrefixEn" required />}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      id="standard-basic"
                      variant="standard"
                      {...register("slumPrefix")}
                      error={!!errors.slumPrefix}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("slumPrefix") ? true : false) ||
                          (router.query.slumPrefix ? true : false),
                      }}
                      helperText={
                        errors?.slumPrefix ? errors.slumPrefix.message : null
                      }
                    />
                  </Grid>

                  {/* city Survey No */}

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      label={<FormattedLabel id="citySurveyNo" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("citySurveyNo")}
                      error={!!errors.citySurveyNo}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("citySurveyNo") ? true : false) ||
                          (router.query.citySurveyNo ? true : false),
                      }}
                      helperText={
                        errors?.citySurveyNo
                          ? errors.citySurveyNo.message
                          : null
                      }
                    />
                  </Grid>
                  {/* Survey No/ Gat No */}

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      label={<FormattedLabel id="surveyNo" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("surveyOrGatNo")}
                      error={!!errors.surveyOrGatNo}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("surveyOrGatNo") ? true : false) ||
                          (router.query.surveyOrGatNo ? true : false),
                      }}
                      helperText={
                        errors?.surveyOrGatNo
                          ? errors.surveyOrGatNo.message
                          : null
                      }
                    />
                  </Grid>
                

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <FormControl
                      error={!!errors?.villageKey}
                      sx={{ m: { xs: 0 }, minWidth: "100%" }}
                    >
                      <Autocomplete
                        multiple
                        id="checkboxes-tags-demo"
                        options={villageData}
                        disableCloseOnSelect
                        value={villageSelectedData}
                        onChange={(event, newValue) => {
                          handleSelect(event, newValue);
                        }}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                        getOptionLabel={(option) =>
                          language === "en"
                            ? (option.villageNameEn || "")
                                .split(" ")
                                .map((word) => word.charAt(0))
                                .join("")
                                .toUpperCase()
                            : (option.villageNameMr || "")
                                .split(" ")
                                .map((word) => word.charAt(0))
                                .join(" ")
                        }
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              checked={selected}
                            />
                            {language === "en"
                              ? option.villageNameEn
                              : option.villageNameMr}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            variant="standard"
                            {...params}
                            error={!!errors.villageKey}
                            helperText={
                              errors.villageKey ? errors.villageKey.message : ""
                            }
                            label={<FormattedLabel id="villageName" required />}
                          />
                        )}
                      />
                      <FormHelperText>
                      </FormHelperText>
                    </FormControl>
                  </Grid>

             

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <FormControl
                      error={!!errors?.wardKey}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    >
                      <Autocomplete
                        multiple
                        id="checkboxes-tags-demo"
                        options={wardData}
                        disableCloseOnSelect
                        value={wardSelectedData}
                        onChange={(event, newValue) => {
                          handleWardSelect(event, newValue);
                        }}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                        getOptionLabel={(option) =>
                          language === "en"
                            ? (option.wardNameEn || "")
                                .split(" ")
                                .map((word) => word.charAt(0))
                                .join("")
                                .toUpperCase()
                            : (option.wardNameMr || "")
                                .split(" ")
                                .map((word) => word.charAt(0))
                                .join(" ")
                        }
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              checked={selected}
                            />
                            {language === "en"
                              ? option.wardNameEn
                              : option.wardNameMr}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            variant="standard"
                            {...params}
                            error={!!errors.wardKey}
                            helperText={
                              errors.wardKey ? errors.wardKey.message : ""
                            }
                            label={<FormattedLabel id="wardName" required />}
                          />
                        )}
                      />
                      <FormHelperText>
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <FormControl
                      error={!!errors?.zoneKey}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    >
                      <Autocomplete
                        multiple
                        id="checkboxes-tags-demo"
                        options={zoneData}
                        disableCloseOnSelect
                        value={zoneSelectedData}
                        onChange={(event, newValue) => {
                          handleZoneSelect(event, newValue);
                        }}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                        getOptionLabel={(option) =>
                          language === "en"
                            ? (option.zoneNameEn || "")
                                .split(" ")
                                .map((word) => word.charAt(0))
                                .join("")
                                .toUpperCase()
                            : (option.zoneNameMr || "")
                                .split(" ")
                                .map((word) => word.charAt(0))
                                .join(" ")
                        }
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              checked={selected}
                            />
                            {language === "en"
                              ? option.zoneNameEn
                              : option.zoneNameMr}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            variant="standard"
                            {...params}
                            error={!!errors.zoneKey}
                            helperText={
                              errors.zoneKey ? errors.zoneKey.message : ""
                            }
                            label={<FormattedLabel id="zoneName" required />}
                          />
                        )}
                      />
                      <FormHelperText>
                      </FormHelperText>
                    </FormControl>
                  </Grid>


                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <FormControl
                      error={!!errors?.clusterKey}
                      sx={{ m: { xs: 0 }, minWidth: "100%" }}
                    >
                      <Autocomplete
                        multiple
                        id="checkboxes-tags-demo"
                        options={clusterData}
                        disableCloseOnSelect
                        value={clusterSelectedData}
                        onChange={(event, newValue) => {
                          handleClusterSelect(event, newValue);
                        }}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        }
                        getOptionLabel={(option) =>
                          language === "en"
                            ? (option.clusterNameEng || "")
                                .split(" ")
                                .map((word) => word.charAt(0))
                                .join("")
                                .toUpperCase()
                            : (option.clusterNameMr || "")
                                .split(" ")
                                .map((word) => word.charAt(0))
                                .join(" ")
                        }
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              checked={selected}
                            />
                            {language === "en"
                              ? option.clusterNameEng
                              : option.clusterNameMr}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            variant="standard"
                            {...params}
                            error={!!errors.clusterKey}
                            helperText={
                              errors.clusterKey ? errors.clusterKey.message : ""
                            }
                            label={<FormattedLabel id="clusterName" required />}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>

                  {/* from Date */}

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <FormControl
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      error={!!errors.fromDate}
                    >
                      <Controller
                        control={control}
                        name="fromDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              variant="standard"
                              inputFormat="DD/MM/YYYY"
                              disableFuture
                              label={
                                <span style={{ fontSize: 16 }}>
                                  {<FormattedLabel id="fromDate" required />}
                                </span>
                              }
                              value={field.value}
                              onChange={(date) => field.onChange(date)}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  variant="standard"
                                  error={!!errors.fromDate}
                                  helperText={
                                    errors.fromDate
                                      ? errors.fromDate.message
                                      : ""
                                  }
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
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* To Date */}
                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <FormControl
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      error={!!errors.toDate}
                    >
                      <Controller
                        control={control}
                        name="toDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              variant="standard"
                              inputFormat="DD/MM/YYYY"
                              minDate={watch("fromDate")}
                              label={
                                <span style={{ fontSize: 16 }}>
                                  {<FormattedLabel id="toDate" required />}
                                </span>
                              }
                              value={field.value}
                              onChange={(date) => field.onChange(date)}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  variant="standard"
                                  error={!!errors.toDate}
                                  helperText={
                                    errors.toDate ? errors.toDate.message : ""
                                  }
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
                    </FormControl>
                  </Grid>

                  {/* Declaration Date */}

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <FormControl
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      error={!!errors.declarationDate}
                    >
                      <Controller
                        control={control}
                        name="declarationDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              variant="standard"
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  {
                                    <FormattedLabel
                                      id="declarationDate"
                                      required
                                    />
                                  }
                                </span>
                              }
                              value={field.value}
                              onChange={(date) => field.onChange(date)}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  variant="standard"
                                  error={!!errors.declarationDate}
                                  helperText={
                                    errors.declarationDate
                                      ? errors.declarationDate.message
                                      : ""
                                  }
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
                    </FormControl>
                  </Grid>

                  {/* Declaration order No */}

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <TextField
                      label={
                        <FormattedLabel id="declarationOrderNo" required />
                      }
                      id="standard-basic"
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      variant="standard"
                      {...register("declarationOrderNo")}
                      error={!!errors.declarationOrderNo}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("declarationOrderNo") ? true : false) ||
                          (router.query.declarationOrderNo ? true : false),
                      }}
                      helperText={
                        errors?.declarationOrderNo
                          ? errors.declarationOrderNo.message
                          : null
                      }
                    />
                  </Grid>
                  {/* Declaration Order */}

                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    lg={4}
                    xl={4}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <label>
                      {/* <b> */}
                      <FormattedLabel id="declarationOrder" required /> :
                      {/* </b> */}
                    </label>
                    <UploadButton
                      appName="SLUM"
                      serviceName="SLUM-Transfer"
                      uploadDoc={photo}
                      setUploadDoc={setPhoto}
                      filePath={(path) => {
                        setPhoto(path);
                      }}
                      fileName={photo}
                      // filePath={(path) => {
                      //   handleOnChange(params.row.id, path);
                      // }}
                      // fileName={params.row.documentPath}
                    />
                  </Grid>
                  {/* Slum Name En */}

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <Transliteration
                      variant={"standard"}
                      _key={"slumName"}
                      width={"100%"}
                      labelName={"slumName"}
                      fieldName={"slumName"}
                      updateFieldName={"slumNameMr"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      label={<FormattedLabel id="slumName" required />}
                      error={!!errors.slumName}
                      helperText={
                        errors?.slumName ? errors.slumName.message : null
                      }
                    />
                  </Grid>

                  {/* Slum Name Mr */}

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                   <Transliteration
                      variant={"standard"}
                      _key={"slumNameMr"}
                      width={"100%"}
                      labelName={"slumNameMr"}
                      fieldName={"slumNameMr"}
                      updateFieldName={"slumName"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      label={<FormattedLabel id="slumNameMr" required />}
                      error={!!errors.slumNameMr}
                      helperText={
                        errors?.slumNameMr ? errors.slumNameMr.message : null
                      }
                    />
                  </Grid>

                  {/* Area name */}

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <FormControl
                      variant="standard"
                      size="small"
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      error={!!errors.areaKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="areaKey" required />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            {...register("areaKey")}
                            InputLabelProps={{
                              //true
                              shrink:
                                (watch("areaKey") ? true : false) ||
                                (router.query.areaKey ? true : false),
                            }}
                          >
                            {areaDropDown &&
                              areaDropDown.map((value, index) => (
                                <MenuItem key={index} value={value.id}>
                                  {language == "en"
                                    ? value.areaEn
                                    : value.areaMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="areaKey"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.areaKey ? errors.areaKey.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* GIS ID */}

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      // label={<FormattedLabel id="slumArea" />}
                      label={<FormattedLabel id="gisId" required />}
                      id="standard-basic"
                      variant="standard"
                      {...register("gisId")}
                      error={!!errors.gisId}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("gisId") ? true : false) ||
                          (router.query.gisId ? true : false),
                      }}
                      helperText={errors?.gisId ? errors.gisId.message : null}
                    />
                  </Grid>

                  {/* Ownership */}

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <FormControl
                      variant="standard"
                      size="small"
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      error={!!errors.ownershipKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="ownershipKey" required />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            {...register("ownershipKey")}
                            InputLabelProps={{
                              //true
                              shrink:
                                (watch("ownershipKey") ? true : false) ||
                                (router.query.ownershipKey ? true : false),
                            }}
                          >
                            {ownerShipData &&
                              ownerShipData.map((value, index) => (
                                <MenuItem key={index} value={value.id}>
                                  {value.ownershipType}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="ownershipKey"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.ownershipKey
                          ? errors.ownershipKey.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* Area of Slum */}

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      label={<FormattedLabel id="slumArea" required />}
                      id="standard-basic"
                      variant="standard"
                      {...register("areaOfSlum")}
                      error={!!errors.areaOfSlum}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("areaOfSlum") ? true : false) ||
                          (router.query.areaOfSlum ? true : false),
                      }}
                      helperText={
                        errors?.areaOfSlum ? errors.areaOfSlum.message : null
                      }
                    />
                  </Grid>

                  {/* No of Huts */}

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      label={<FormattedLabel id="noOfHuts" required />}
                      id="standard-basic"
                      variant="standard"
                      {...register("noOfHuts")}
                      error={!!errors.noOfHuts}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("noOfHuts") ? true : false) ||
                          (router.query.noOfHuts ? true : false),
                      }}
                      helperText={
                        errors?.noOfHuts ? errors.noOfHuts.message : null
                      }
                    />
                  </Grid>

                  {/* Hut Occupied Area */}

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      label={<FormattedLabel id="hutOccupiedArea" required />}
                      id="standard-basic"
                      variant="standard"
                      {...register("hutOccupiedArea")}
                      error={!!errors.hutOccupiedArea}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("hutOccupiedArea") ? true : false) ||
                          (router.query.hutOccupiedArea ? true : false),
                      }}
                      helperText={
                        errors?.hutOccupiedArea
                          ? errors.hutOccupiedArea.message
                          : null
                      }
                    />
                  </Grid>

                  {/* Population */}

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      label={<FormattedLabel id="population" required />}
                      id="standard-basic"
                      variant="standard"
                      {...register("totalPopulation")}
                      error={!!errors.totalPopulation}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("totalPopulation") ? true : false) ||
                          (router.query.totalPopulation ? true : false),
                      }}
                      helperText={
                        errors?.totalPopulation
                          ? errors.totalPopulation.message
                          : null
                      }
                    />
                  </Grid>

                  {/* Male Population */}

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      label={<FormattedLabel id="malePopulation" required />}
                      id="standard-basic"
                      variant="standard"
                      {...register("malePopulation")}
                      error={!!errors.malePopulation}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("malePopulation") ? true : false) ||
                          (router.query.malePopulation ? true : false),
                      }}
                      helperText={
                        errors?.malePopulation
                          ? errors.malePopulation.message
                          : null
                      }
                    />
                  </Grid>

                  {/* Female Population */}

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      label={<FormattedLabel id="femalePopulation" required />}
                      id="standard-basic"
                      variant="standard"
                      {...register("femalePopulation")}
                      error={!!errors.femalePopulation}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("femalePopulation") ? true : false) ||
                          (router.query.femalePopulation ? true : false),
                      }}
                      helperText={
                        errors?.femalePopulation
                          ? errors.femalePopulation.message
                          : null
                      }
                    />
                  </Grid>

                  {/* SC Population */}

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      label={<FormattedLabel id="scPopulation" required />}
                      id="standard-basic"
                      variant="standard"
                      {...register("scPopulation")}
                      error={!!errors.scPopulation}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("scPopulation") ? true : false) ||
                          (router.query.scPopulation ? true : false),
                      }}
                      helperText={
                        errors?.scPopulation
                          ? errors.scPopulation.message
                          : null
                      }
                    />
                  </Grid>

                  {/* ST Population */}

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      label={<FormattedLabel id="stPopulation" required />}
                      id="standard-basic"
                      variant="standard"
                      {...register("stPopulation")}
                      error={!!errors.stPopulation}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("stPopulation") ? true : false) ||
                          (router.query.stPopulation ? true : false),
                      }}
                      helperText={
                        errors?.stPopulation
                          ? errors.stPopulation.message
                          : null
                      }
                    />
                  </Grid>
                  {/* Other Population */}

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      label={<FormattedLabel id="OtherPopulation" required />}
                      // label="Other Population"
                      id="standard-basic"
                      variant="standard"
                      {...register("otherPopulation")}
                      error={!!errors.otherPopulation}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("otherPopulation") ? true : false) ||
                          (router.query.otherPopulation ? true : false),
                      }}
                      helperText={
                        errors?.otherPopulation
                          ? errors.otherPopulation.message
                          : null
                      }
                    />
                  </Grid>

                  {/* Slum Boundry Info */}

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      label={<FormattedLabel id="slumBoundaryInfo" required />}
                      id="standard-basic"
                      variant="standard"
                      {...register("slumBoundaryInfo")}
                      error={!!errors.slumBoundaryInfo}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("slumBoundaryInfo") ? true : false) ||
                          (router.query.slumBoundaryInfo ? true : false),
                      }}
                      helperText={
                        errors?.slumBoundaryInfo
                          ? errors.slumBoundaryInfo.message
                          : null
                      }
                    />
                  </Grid>

                  {/* Slum Status */}

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      label={<FormattedLabel id="slumStatus" required />}
                      id="standard-basic"
                      variant="standard"
                      {...register("slumStatus")}
                      error={!!errors.slumStatus}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("slumStatus") ? true : false) ||
                          (router.query.slumStatus ? true : false),
                      }}
                      helperText={
                        errors?.slumStatus ? errors.slumStatus.message : null
                      }
                    />
                  </Grid>
                </Grid>

                <Grid
                  container
                  spacing={5}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "10px",
                    marginTop: "20px",
                  }}
                >
                  <Grid item>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => exitButton()}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      // sx={{ marginRight: 8 }}
                      variant="contained"
                      color="primary"
                      size="small"
                      endIcon={<ClearIcon />}
                      onClick={() => cancellButton()}
                    >
                      <FormattedLabel id="clear" />
                    </Button>
                  </Grid>

                  <Grid item>
                    <Button
                      // sx={{ marginRight: 8 }}
                      type="submit"
                      size="small"
                      variant="contained"
                      color="success"
                      disabled={photo ? false : true}
                      endIcon={<SaveIcon />}
                    >
                      {btnSaveText === "Update" ? (
                        <FormattedLabel id="update" />
                      ) : (
                        <FormattedLabel id="save" />
                      )}
                    </Button>
                  </Grid>
                </Grid>
                {/* </div> */}
              </form>
            </Slide>
          )}
        </FormProvider>

        {/* <div className={styles.addbtn}> */}
        <Grid container style={{ padding: "10px" }}>
          <Grid item xs={12} style={{ display: "flex", justifyContent: "end" }}>
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              type="primary"
              disabled={buttonInputState}
              onClick={() => {
                reset({
                  ...resetValuesExit,
                });
                setClusterSelectedData([]);
                setWardSelectedData([]);
                setZoneSelectedData([]);
                setVillageSelectedData([]);
                setPhoto();
                setEditButtonInputState(true);
                setBtnSaveText("Save");
                setButtonInputState(true);
                setSlideChecked(true);
                setIsOpenCollapse(!isOpenCollapse);
              }}
            >
              <FormattedLabel id="add" />{" "}
            </Button>
          </Grid>
        </Grid>
        {/* </div> */}

        <DataGrid
          autoHeight
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          sx={{
            overflowY: "scroll",
            marginTop: "20px",
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
            setDataPage(_data);
            getAllSlumData(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            setDataPage(_data);
            getAllSlumData(_data, data.page);
          }}
        />
      </Paper>
    </>
  );
};

export default Index;
