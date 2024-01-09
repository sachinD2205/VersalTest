import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  RadioGroup,
  IconButton,
  InputLabel,
  FormControlLabel,
  Radio,
  Box,
  MenuItem,
  Paper,
  Select,
  FormLabel,
  Checkbox,
  Slide,
  TextField,
  Tooltip,
  ListItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { GridToolbar } from "@mui/x-data-grid";
import sweetAlert from "sweetalert";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import hutMasterSchema from "../../../../containers/schema/slumManagementSchema/hutMasterSchema";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HutMember from "../hutMember";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";

const Index = () => {
  const {
    register,
    control,
    getValues,
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(hutMasterSchema), mode: "onChange" });

  const language = useSelector((state) => state.labels.language);

  //get logged in user
  const user = useSelector((state) => state.user.user);

  let config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const router1 = useRouter();
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();
  const [zoneDetails, setZoneDetails] = useState([]);
  const [slumDetails, setSlumDetails] = useState([]);
  const [clusterDetails, setClusterDetails] = useState([]);
  const [owershipDetails, setOwnershipDetails] = useState([]);
  const [constrctionDetails, setConstructionDetails] = useState([]);
  const [usageDetails, setUsageTypeDetails] = useState([]);
  const [rehabilitation, setIsCheckedrehabilitation] = useState(false);
  const [eligibility, setIsCheckedeligibility] = useState(false);
  const [waterConnection, setIsCheckedwaterConnection] = useState(false);
  const [areaDetails, setAreaDetails] = useState();
  const [villageDetails, setVillageDetails] = useState();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [dataPageNo, setDataPage] = useState();
  const [hutMasterId, setHutMasterId] = useState();

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const [wardData, setWardData] = useState([]);
  const [hutMember, setHutMember] = useState(false);

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
    getVillageDetails();
    getHutMaster();
    getAreaDetails();
    getUsageType();
    getConstructionType();
    getOwnershipType();
    getSlumDetails();
    getClusterDetails();
    getZone();
    getAllWardName();
  }, []);

  useEffect(() => {
    if (!rehabilitation) {
      setValue("flatNo", "");
      setValue("location", "");
      setValue("scheme", "");
    }
  }, [rehabilitation]);

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
            language == "en"
              ? "Something Went To Wrong !"
              : "काहीतरी चूक झाली!",
            { button: language === "en" ? "Ok" : "ठीक आहे" }
          );
        }
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const [dataSource, setDataSource] = useState([]);
  const getHutMaster = (_pageSize = 10, _pageNo = 0) => {
    setIsLoading(true);
    axios
      .get(`${urls.SLUMURL}/mstHut/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res, i) => {
        setIsLoading(false);
        setDataSource(res.data);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  useEffect(() => {
    if (dataSource.length != 0) {
      let res1 = dataSource;
      let result = res1.mstHutList;
      const _res = result.map((res, i) => {
        return {
          srNo: i + 1 + res1.pageNo * res1.pageSize,
          id: res.id,
          hutPrefix: res.hutPrefix,
          zoneKey: res.zoneKey,
          hutNo: res.hutNo,

          ownershipKey: res.ownershipKey,
          slumKey: res.slumKey,
          areaOfHut: res.areaOfHut,
          gisId: res.gisId,
          length: res.length,
          breadth: res.breadth,
          height: res.height,
          constructionTypeKey: res.constructionTypeKey,
          usageTypeKey: res.usageTypeKey,
          usageSubTypeKey: res.usageSubTypeKey,
          rehabilitation: res.rehabilitation === "Yes" ? true : false,
          eligibility: res.eligibility === "eligible" ? true : false,
          waterConnection: res.waterConnection === "Yes" ? true : false,
          noOfFloors: res.noOfFloors,
          maleCount: res.maleCount,
          femaleCount: res.femaleCount,
          totalFamilyMembers: res.totalFamilyMembers,
          areaKey: res.areaKey,
          villageKey: res.villageKey,
          cityKey: res.cityKey,
          pincode: res.pincode,
          lattitude: res.lattitude,
          longitude: res.longitude,
          assemblyConstituency: res.assemblyConstituency,
          partNoInList: res.partNoInList,
          correction: res.correction,
          remarks: res.remarks,
          flatNo: res.flatNo,
          location: res.location,
          scheme: res.scheme,
          eligibility: res.eligibility,
          zoneName: zoneDetails?.find((obj) => {
            return obj.id == res.zoneKey;
          })
            ? zoneDetails.find((obj) => {
                return obj.id == res.zoneKey;
              }).zoneName
            : "-",
          zoneNameMr: zoneDetails?.find((obj) => {
            return obj.id == res.zoneKey;
          })
            ? zoneDetails.find((obj) => {
                return obj.id == res.zoneKey;
              }).zoneNameMr
            : "-",
          slumName: slumDetails?.find((obj) => {
            return obj.id == res.slumKey;
          })
            ? slumDetails.find((obj) => {
                return obj.id == res.slumKey;
              }).slumName
            : "-",
          slumNameMr: slumDetails?.find((obj) => {
            return obj.id == res.slumKey;
          })
            ? slumDetails.find((obj) => {
                return obj.id == res.slumKey;
              }).slumNameMr
            : "-",
          ownershipName: owershipDetails.find((obj) => {
            return obj.id == res.ownershipKey;
          })
            ? owershipDetails.find((obj) => {
                return obj.id == res.ownershipKey;
              }).ownershipType
            : "-",
          ownershipNameMr: owershipDetails.find((obj) => {
            return obj.id == res.ownershipKey;
          })
            ? owershipDetails.find((obj) => {
                return obj.id == res.ownershipKey;
              }).ownershipTypeMr
            : "-",
          constructionTypeName: constrctionDetails.find((obj) => {
            return obj.id == res.constructionTypeKey;
          })
            ? constrctionDetails.find((obj) => {
                return obj.id == res.constructionTypeKey;
              }).constructionType
            : "-",
          constructionTypeNameMr: constrctionDetails.find((obj) => {
            return obj.id == res.constructionTypeKey;
          })
            ? constrctionDetails.find((obj) => {
                return obj.id == res.constructionTypeKey;
              }).constructionTypeMr
            : "-",
          clusterKey: res.clusterKey,
          wardKey: res.wardKey,
          wardName: wardData.find((obj) => {
            return obj.id == res.wardKey;
          })
            ? wardData.find((obj) => {
                return obj.id == res.wardKey;
              }).wardNameEn
            : "-",
          wardNameMr: wardData.find((obj) => {
            return obj.id == res.wardKey;
          })
            ? wardData.find((obj) => {
                return obj.id == res.wardKey;
              }).wardNameMr
            : "-",
          clusterName: clusterDetails.find((obj) => {
            return obj.id == res.clusterKey;
          })
            ? clusterDetails.find((obj) => {
                return obj.id == res.clusterKey;
              }).clusterNameEng
            : "-",
          clusterNameMr: clusterDetails.find((obj) => {
            return obj.id == res.clusterKey;
          })
            ? clusterDetails.find((obj) => {
                return obj.id == res.clusterKey;
              }).clusterNameMr
            : "-",
          activeFlag: res.activeFlag,
          status: res.activeFlag === "Y" ? "Active" : "InActive",
        };
      });

      setIsCheckedrehabilitation(res1.rehabilitation === "Yes" ? true : false);
      setData({
        rows: _res,
        totalRows: res1.totalElements,
        rowsPerPageOptions: [10, 20, 50, 100],
        pageSize: res1.pageSize,
        page: res1.pageNo,
      });
    }
  }, [
    dataSource,
    zoneDetails,
    slumDetails,
    owershipDetails,
    constrctionDetails,
  ]);

  const getAreaDetails = () => {
    axios
      .get(`${urls.CFCURL}/master/area/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setAreaDetails(
          res.data.area.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            areaName: r.areaName,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };
  const getVillageDetails = () => {
    axios
      .get(`${urls.SLUMURL}/master/village/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setVillageDetails(
          res.data.village.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            villageName: r.villageName,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getZone = () => {
    axios
      .get(`${urls.SLUMURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setZoneDetails(
          res.data.zone.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            zoneName: r.zoneName,
            zoneNameMr: r.zoneNameMr,
            zone: r.zone,
            ward: r.ward,
            area: r.area,
            zooAddress: r.zooAddress,
            zooAddressAreaInAcres: r.zooAddressAreaInAcres,
            zooApproved: r.zooApproved,
            zooFamousFor: r.zooFamousFor,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getSlumDetails = () => {
    axios
      .get(`${urls.SLUMURL}/mstSlum/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setSlumDetails(
          res.data.mstSlumList.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            slumName: r.slumName,
            slumNameMr: r.slumNameMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };
  const getClusterDetails = () => {
    axios
      .get(`${urls.SLUMURL}/mstCluster/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setClusterDetails(
          res.data.mstClusterDaoList.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            clusterNameEng: r.clusterNameEng,
            clusterNameMr: r.clusterNameMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getOwnershipType = () => {
    axios
      .get(`${urls.SLUMURL}/mstSbOwnershipType/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setOwnershipDetails(
          res.data.mstSbOwnershipTypeList.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            ownershipType: r.ownershipType,
            ownershipTypeMr: r.ownershipTypeMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getConstructionType = () => {
    axios
      .get(`${urls.SLUMURL}/mstConstructionType/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setConstructionDetails(
          res.data.mstConstructionTypeList.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            constructionType: r.constructionType,
            constructionTypeMr: r.constructionTypeMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getUsageType = () => {
    axios
      .get(`${urls.SLUMURL}/mstSbUsageType/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setUsageTypeDetails(
          res.data.mstSbUsageTypeList.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            usageType: r.usageType,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    if (_activeFlag === "N") {
      swal({
        title: language === "en" ? "Deactivate?" : "निष्क्रिय?",
        text:
          language === "en"
            ? "Are you sure you want to deactivate this Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता?",
        icon: "warning",
        buttons: [
          language == "en" ? "No" : "नाही",
          language === "en" ? "Yes" : "होय",
        ],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          axios
            .post(`${urls.SLUMURL}/mstHut/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              if (res.status == 201) {
                swal(
                  language === "en"
                    ? "Record is Successfully Deactivated!"
                    : "रेकॉर्ड यशस्वीरित्या निष्क्रिय केले आहे!",
                  {
                    icon: "success",
                    button: language === "en" ? "Ok" : "ठीक आहे",
                  }
                ).then((will) => {
                  if (will) {
                    getHutMaster();
                    setButtonInputState(false);
                  }
                });
              }
            })
            .catch((err) => {
              cfcErrorCatchMethod(err, false);
            });
        } else if (willDelete == null) {
          swal(language === "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे", {
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        }
      });
    } else {
      swal({
        title: language === "en" ? "Activate?" : "सक्रिय?",
        text:
          language === "en"
            ? "Are you sure you want to activate this Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता?",
        icon: "warning",
        buttons: [
          language == "en" ? "No" : "नाही",
          language === "en" ? "Yes" : "होय",
        ],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          axios
            .post(`${urls.SLUMURL}/mstHut/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              if (res.status == 201) {
                swal(
                  language === "en"
                    ? "Record is Successfully activated!"
                    : "रेकॉर्ड यशस्वीरित्या सक्रिय झाले आहे!",
                  {
                    icon: "success",
                    button: language === "en" ? "Ok" : "ठीक आहे",
                  }
                ).then((will) => {
                  if (will) {
                    getHutMaster();
                    setButtonInputState(false);
                  }
                });
              }
            })
            .catch((err) => {
              cfcErrorCatchMethod(err, false);
            });
        } else if (willDelete == null) {
          swal(language === "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे", {
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        }
      });
    }
  };

  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setIsCheckedeligibility(false);
    setIsCheckedrehabilitation(false);
    setIsCheckedwaterConnection(false);
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
  };

  const onSubmitForm = (formData) => {
    setIsLoading(true);
    const finalBodyForApi = {
      ...formData,
      rehabilitation: rehabilitation == true ? "Yes" : "No",
      // eligibility: eligibility == true ? "eligible" : "not_eligible",
      waterConnection: waterConnection == true ? "Yes" : "No",
    };

    axios
      .post(`${urls.SLUMURL}/mstHut/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          formData.id
            ? sweetAlert(
                language === "en" ? "Updated!" : "अद्ययावत केले!",
                language === "en"
                  ? "Record Updated Successfully !"
                  : "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
                "success",
                { button: language === "en" ? "Ok" : "ठीक आहे" }
              ).then((will) => {
                if (will) {
                  getHutMaster();
                  setButtonInputState(false);
                  setIsOpenCollapse(false);
                  setEditButtonInputState(false);
                }
              })
            : sweetAlert(
                language === "en" ? "Saved!" : "जतन केले!",
                language === "en"
                  ? "Record Saved Successfully !"
                  : "रेकॉर्ड यशस्वीरित्या जतन केले!",
                "success",
                { button: language === "en" ? "Ok" : "ठीक आहे" }
              ).then((will) => {
                if (will) {
                  getHutMaster();
                  setButtonInputState(false);
                  setIsOpenCollapse(false);
                  setEditButtonInputState(false);
                }
              });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const resetValuesExit = {
    areaKey: "",
    areaOfHut: "",
    gisId: "",
    assemblyConstituency: "",
    breadth: "",
    cityKey: "",
    constructionTypeKey: "",
    correction: "",
    eligibility: false,
    femaleCount: "",
    height: "",
    hutNo: "",
    hutPrefix: "",
    lattitude: "",
    length: "",
    longitude: "",
    maleCount: "",
    noOfFloors: "",
    ownershipKey: "",
    ownershipType: "",
    ownershipTypeMr: "",
    ownershipTypePrefix: "",
    partNoInList: "",
    pincode: "",
    rehabilitation: false,
    remarks: "",
    totalFamilyMembers: "",
    usageSubTypeKey: "",
    usageTypeKey: "",
    villageKey: "",
    waterConnection: false,
    zoneKey: "",
  };

  const cancellButton = () => {
    setIsCheckedeligibility(false);
    setIsCheckedrehabilitation(false);
    setIsCheckedwaterConnection(false);
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    areaKey: "",
    areaOfHut: "",
    gisId: "",
    assemblyConstituency: "",
    breadth: "",
    cityKey: "",
    constructionTypeKey: "",
    correction: "",
    eligibility: false,
    femaleCount: "",
    height: "",
    hutNo: "",
    hutPrefix: "",
    lattitude: "",
    length: "",
    longitude: "",
    maleCount: "",
    noOfFloors: "",
    ownershipKey: "",
    ownershipType: "",
    ownershipTypeMr: "",
    ownershipTypePrefix: "",
    partNoInList: "",
    pincode: "",
    rehabilitation: false,
    remarks: "",
    totalFamilyMembers: "",
    usageSubTypeKey: "",
    usageTypeKey: "",
    villageKey: "",
    waterConnection: false,
    zoneKey: "",
    slumKey: "",
    clusterKey: "",
    wardKey: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language == "en" ? "clusterName" : "clusterNameMr",
      headerName: <FormattedLabel id="clusterName" />,
      flex: 1,
      headerAlign: "center",
      minWidth: 150,
    },
    {
      field: language == "en" ? "slumName" : "slumNameMr",
      headerName: <FormattedLabel id="slumKey" />,
      flex: 1,
      headerAlign: "center",
      minWidth: 150,
    },
    {
      field: language == "en" ? "zoneName" : "zoneNameMr",
      headerName: <FormattedLabel id="zoneKey" />,
      flex: 1,
      headerAlign: "center",
      minWidth: 150,
    },
    {
      field: language == "en" ? "wardName" : "wardNameMr",
      headerName: <FormattedLabel id="ward" />,
      flex: 1,
      headerAlign: "center",
      minWidth: 150,
    },
    {
      field: "hutNo",
      headerName: <FormattedLabel id="hutNo" />,
      flex: 1,
      headerAlign: "center",
      minWidth: 150,
    },
    {
      field: "gisId",
      headerName: <FormattedLabel id="gisId" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 150,
    },
    {
      field: "areaOfHut",
      headerName: <FormattedLabel id="areaOfHut" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 150,
    },
    {
      field: language == "en" ? "ownershipName" : "ownershipNameMr",
      headerName: <FormattedLabel id="ownershipKey" />,
      flex: 1,
      headerAlign: "center",
      minWidth: 150,
    },
    {
      field:
        language == "en" ? "constructionTypeName" : "constructionTypeNameMr",
      headerName: <FormattedLabel id="constructionTypeKey" />,
      flex: 1,
      headerAlign: "center",
      minWidth: 150,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 150,
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                reset(params.row);
                setValue("eligibility", params.row.eligibility);
                setIsCheckedrehabilitation(params.row.rehabilitation);
                setIsCheckedeligibility(params.row.eligibility);
                setIsCheckedwaterConnection(params.row.waterConnection);
              }}
            >
              <Tooltip title="Edit">
                <EditIcon style={{ color: "#556CD6" }} />
              </Tooltip>
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setSlideChecked(true);
                setButtonInputState(true);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <Tooltip title="Deactivate">
                  <ToggleOnIcon
                    style={{ color: "green", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "N")}
                  />
                </Tooltip>
              ) : (
                <Tooltip title="Activate">
                  <ToggleOffIcon
                    style={{ color: "red", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "Y")}
                  />
                </Tooltip>
              )}
            </IconButton>

            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                router1.push({
                  pathname: "/SlumBillingManagementSystem/masters/hutMember",
                  query: { id: params.row.id },
                });
                // setHutMasterId(params.row.id);
                // handleClickHut();
              }}
            >
              <Tooltip title="Hut Member">
                <MenuIcon style={{ color: "#556CD6" }} />
              </Tooltip>
            </IconButton>
          </>
        );
      },
    },
  ];

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
                <FormattedLabel id="hutMaster" />
              </h3>
            </Grid>
          </Grid>
        </Box>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <Grid
                container
                spacing={2}
                style={{
                  padding: "1rem",
                }}
              >
                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                  <TextField
                    size="small"
                    sx={{ minWidth: "90%" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="hutPrefix" required />}
                    variant="standard"
                    {...register("hutPrefix")}
                    error={!!errors.hutPrefix}
                    helperText={
                      errors?.hutPrefix ? errors.hutPrefix.message : null
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                  <FormControl
                    sx={{ minWidth: "90%" }}
                    variant="standard"
                    error={!!errors.slumKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="slumKey" required />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                        >
                          {slumDetails &&
                            slumDetails.map((value, index) => (
                              <MenuItem key={index} value={value?.id}>
                                {value?.slumName}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="slumKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.slumKey ? errors.slumKey.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                  <FormControl
                    sx={{ minWidth: "90%" }}
                    variant="standard"
                    error={!!errors.clusterKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="clusterName" required />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                        >
                          {clusterDetails &&
                            clusterDetails.map((value, index) => (
                              <MenuItem key={index} value={value?.id}>
                                {language === "en"
                                  ? value?.clusterNameEng
                                  : value.clusterNameMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="clusterKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.clusterKey ? errors.clusterKey.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                  <FormControl
                    sx={{ minWidth: "90%" }}
                    variant="standard"
                    error={!!errors.zoneKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="zoneKey" required />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                        >
                          {zoneDetails &&
                            zoneDetails.map((value, index) => (
                              <MenuItem key={index} value={value?.id}>
                                {value?.zoneName}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="zoneKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.zoneKey ? errors.zoneKey.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                  <FormControl
                    sx={{ minWidth: "90%" }}
                    variant="standard"
                    error={!!errors.wardKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="wardName" required />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                        >
                          {wardData &&
                            wardData.map((value, index) => (
                              <MenuItem key={index} value={value?.id}>
                                {language === "en"
                                  ? value?.wardNameEn
                                  : value.wardNameMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="wardKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.wardKey ? errors.wardKey.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                  <TextField
                    size="small"
                    sx={{ minWidth: "90%" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="hutNo" required />}
                    variant="standard"
                    {...register("hutNo")}
                    error={!!errors.hutNo}
                    helperText={errors?.hutNo ? errors.hutNo.message : null}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                  <TextField
                    sx={{ minWidth: "90%" }}
                    size="small"
                    id="outlined-basic"
                    label={<FormattedLabel id="areaOfHut" required />}
                    variant="standard"
                    {...register("areaOfHut")}
                    error={!!errors.areaOfHut}
                    helperText={
                      errors?.areaOfHut ? errors.areaOfHut.message : null
                    }
                  />
                </Grid>
                {/* GIS ID */}

                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                  <TextField
                    sx={{ minWidth: "90%" }}
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
                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                  <FormControl
                    sx={{ minWidth: "90%" }}
                    variant="standard"
                    error={!!errors.ownershipKey}
                  >
                    <InputLabel
                      id="demo-simple-select-standard-label"
                      // disabled={isDisabled}
                    >
                      <FormattedLabel id="ownershipKey" required />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                        >
                          {owershipDetails &&
                            owershipDetails.map((value, index) => (
                              <MenuItem key={index} value={value?.id}>
                                {value?.ownershipType}
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

                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                  <FormControl
                    sx={{ minWidth: "90%" }}
                    variant="standard"
                    error={!!errors.constructionTypeKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="constructionTypeKey" required />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                        >
                          {constrctionDetails &&
                            constrctionDetails.map((value, index) => (
                              <MenuItem key={index} value={value?.id}>
                                {value?.constructionType}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="constructionTypeKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.constructionTypeKey
                        ? errors.constructionTypeKey.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                  <FormControl
                    sx={{ minWidth: "90%" }}
                    variant="standard"
                    error={!!errors.usageTypeKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="usageTypeKey" required />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                        >
                          {usageDetails &&
                            usageDetails.map((value, index) => (
                              <MenuItem key={index} value={value?.id}>
                                {value?.usageType}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="usageTypeKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.usageTypeKey
                        ? errors.usageTypeKey.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                {/* <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                  <FormControl
                    sx={{ minWidth: "90%" }}
                    variant="standard"
                    error={!!errors.usageSubTypeKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="usageSubTypeKey" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                        >
                          {usageSubTypeDetails &&
                            usageSubTypeDetails.map((value, index) => (
                              <MenuItem key={index} value={value?.id}>
                                {value?.subUsageType}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="usageSubTypeKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.usageSubTypeKey
                        ? errors.usageSubTypeKey.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid> */}

                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                  <TextField
                    sx={{ minWidth: "90%" }}
                    size="small"
                    id="outlined-basic"
                    label={<FormattedLabel id="length" required />}
                    variant="standard"
                    {...register("length")}
                    error={!!errors.length}
                    helperText={errors?.length ? errors.length.message : null}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                  <TextField
                    size="small"
                    sx={{ minWidth: "90%" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="breadth" required />}
                    variant="standard"
                    {...register("breadth")}
                    error={!!errors.breadth}
                    helperText={errors?.breadth ? errors.breadth.message : null}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                  <TextField
                    sx={{ minWidth: "90%" }}
                    size="small"
                    id="outlined-basic"
                    label={<FormattedLabel id="height" required />}
                    variant="standard"
                    {...register("height")}
                    error={!!errors.height}
                    helperText={errors?.height ? errors.height.message : null}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                  <TextField
                    size="small"
                    sx={{ minWidth: "90%" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="noOfFloors" required />}
                    variant="standard"
                    {...register("noOfFloors")}
                    error={!!errors.noOfFloors}
                    helperText={
                      errors?.noOfFloors ? errors.noOfFloors.message : null
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                  <TextField
                    sx={{ minWidth: "90%" }}
                    size="small"
                    id="outlined-basic"
                    label={<FormattedLabel id="totalFamilyMembers" required />}
                    variant="standard"
                    {...register("totalFamilyMembers")}
                    error={!!errors.totalFamilyMembers}
                    helperText={
                      errors?.totalFamilyMembers
                        ? errors.totalFamilyMembers.message
                        : null
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                  <TextField
                    sx={{ minWidth: "90%" }}
                    size="small"
                    id="outlined-basic"
                    label={<FormattedLabel id="maleCount" required />}
                    variant="standard"
                    {...register("maleCount")}
                    error={!!errors.maleCount}
                    helperText={
                      errors?.maleCount ? errors.maleCount.message : null
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                  <TextField
                    sx={{ minWidth: "90%" }}
                    size="small"
                    id="outlined-basic"
                    label={<FormattedLabel id="femaleCount" required />}
                    variant="standard"
                    {...register("femaleCount")}
                    error={!!errors.femaleCount}
                    helperText={
                      errors?.femaleCount ? errors.femaleCount.message : null
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                  <TextField
                    sx={{ minWidth: "90%" }}
                    size="small"
                    id="outlined-basic"
                    label={
                      <FormattedLabel id="assemblyConstituency" required />
                    }
                    variant="standard"
                    {...register("assemblyConstituency")}
                    error={!!errors.assemblyConstituency}
                    helperText={
                      errors?.assemblyConstituency
                        ? errors.assemblyConstituency.message
                        : null
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                  <TextField
                    size="small"
                    sx={{ minWidth: "90%" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="partNoInList" required />}
                    variant="standard"
                    {...register("partNoInList")}
                    error={!!errors.partNoInList}
                    helperText={
                      errors?.partNoInList ? errors.partNoInList.message : null
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                  <FormControl
                    sx={{ minWidth: "90%" }}
                    variant="standard"
                    error={!!errors.areaKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="areaKey" required />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                        >
                          {areaDetails &&
                            areaDetails.map((value, index) => (
                              <MenuItem key={index} value={value?.id}>
                                {value?.areaName}
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

                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                  <FormControl
                    sx={{ minWidth: "90%" }}
                    variant="standard"
                    error={!!errors.villageKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="villageKey" required />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                        >
                          {villageDetails &&
                            villageDetails.map((value, index) => (
                              <MenuItem key={index} value={value?.id}>
                                {value?.villageName}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="villageKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.villageKey ? errors.villageKey.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                  <TextField
                    size="small"
                    sx={{ minWidth: "90%" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="pincode" required />}
                    variant="standard"
                    {...register("pincode")}
                    error={!!errors.pincode}
                    helperText={errors?.pincode ? errors.pincode.message : null}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                  <TextField
                    sx={{ minWidth: "90%" }}
                    size="small"
                    id="outlined-basic"
                    label={<FormattedLabel id="lattitude" required />}
                    variant="standard"
                    {...register("lattitude")}
                    error={!!errors.lattitude}
                    helperText={
                      errors?.lattitude ? errors.lattitude.message : null
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                  <TextField
                    size="small"
                    sx={{ minWidth: "90%" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="longitude" required />}
                    variant="standard"
                    {...register("longitude")}
                    error={!!errors.longitude}
                    helperText={
                      errors?.longitude ? errors.longitude.message : null
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                  <TextField
                    size="small"
                    sx={{ minWidth: "90%" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="correction" required />}
                    variant="standard"
                    {...register("correction")}
                    error={!!errors.correction}
                    helperText={
                      errors?.correction ? errors.correction.message : null
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                  <FormLabel id="demo-controlled-radio-buttons-group">
                    <Checkbox
                      value={rehabilitation}
                      checked={rehabilitation ? true : false}
                      onChange={() => {
                        setIsCheckedrehabilitation(!rehabilitation);
                      }}
                    />
                    <FormattedLabel id="rehabilitation" />
                  </FormLabel>
                </Grid>

                {rehabilitation && (
                  <>
                    {" "}
                    <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                      <TextField
                        sx={{ minWidth: "90%" }}
                        size="small"
                        id="outlined-basic"
                        label={<FormattedLabel id="nameOfScheme" required />}
                        variant="standard"
                        {...register("scheme")}
                        error={!!errors.scheme}
                        helperText={
                          errors?.scheme ? errors.scheme.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                      <TextField
                        size="small"
                        sx={{ minWidth: "90%" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="location" required />}
                        variant="standard"
                        {...register("location")}
                        error={!!errors.location}
                        helperText={
                          errors?.location ? errors.location.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                      <TextField
                        size="small"
                        sx={{ minWidth: "90%" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="flatNo" required />}
                        variant="standard"
                        {...register("flatNo")}
                        error={!!errors.flatNo}
                        helperText={
                          errors?.flatNo ? errors.flatNo.message : null
                        }
                      />
                    </Grid>
                  </>
                )}
                {/* <Grid item xs={12} sm={12} md={6} lg={4} xl={4}> */}
                {/* <FormLabel id="demo-controlled-radio-buttons-group">
                    <Checkbox
                      value={eligibility}
                      checked={eligibility ? true : false}
                      onChange={() => {
                        setIsCheckedeligibility(!eligibility);
                      }}
                    />
                    <FormattedLabel id="eligibility" />
                  </FormLabel> */}
                <Grid item md={4} sm={6} xs={12} style={{ display: "flex" }}>
                  <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      {<FormattedLabel id="eligibility" />}
                    </FormLabel>
                    <RadioGroup
                      style={{ marginTop: 5 }}
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      row
                      name="eligibility"
                      control={control}
                      value={watch("eligibility")}
                      {...register("eligibility")}
                    >
                      <FormControlLabel
                        value="true"
                        control={<Radio />}
                        label={<FormattedLabel id="eligible" />}
                        name="RadioButton"
                        {...register("eligibility")}
                        error={!!errors.eligibility}
                        helperText={
                          errors?.eligibility
                            ? errors.eligibility.message
                            : null
                        }
                      />
                      <FormControlLabel
                        value="false"
                        control={<Radio />}
                        label={<FormattedLabel id="noteligible" />}
                        name="RadioButton"
                        {...register("eligibility")}
                        error={!!errors.eligibility}
                        helperText={
                          errors?.eligibility
                            ? errors.eligibility.message
                            : null
                        }
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                {/* </Grid> */}

                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                  <FormLabel id="demo-controlled-radio-buttons-group">
                    <Checkbox
                      value={waterConnection}
                      checked={waterConnection ? true : false}
                      onChange={() => {
                        setIsCheckedwaterConnection(!waterConnection);
                      }}
                    />
                    <FormattedLabel id="waterConnection" />
                  </FormLabel>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}></Grid>
                {/* <>{hutMember && <HutMember hutMasterId={hutMasterId} />}</> */}
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
              </Grid>
              <Divider />
            </form>
          </Slide>
        )}

        <Grid container style={{ padding: "10px" }}>
          <Grid item xs={12} style={{ display: "flex", justifyContent: "end" }}>
            <Button
              variant="contained"
              size="small"
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
              <FormattedLabel id="add" />{" "}
            </Button>
          </Grid>
        </Grid>
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
            // "& .MuiDataGrid-toolbarContainer .MuiButton-root[aria-label='Export']":
            //   {
            //     display: "none",
            //   },
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
            getHutMaster(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            setDataPage(_data);
            getHutMaster(_data, data.page);
          }}
        />
      </Paper>
    </>
  );
};

export default Index;
