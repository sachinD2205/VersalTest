import { Visibility } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../styles/fireBrigadeSystem/view.module.css";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";

/** Sachin Durge */
// FormsDetials
const FormsDetails = ({ view = false, readOnly = false }) => {
  const {
    control,
    register,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const userToken = useGetToken();

  const language = useSelector((state) => state?.labels.language);
  const [floorHeight, setFloorHeight] = useState(" ");
  const [error, setError] = useState(" ");
  const [roadWidth, setRoadWidthError] = useState(" ");
  const [approachRoadDirection, setApproachRoadError] = useState(" ");
  const [tankLocation, setTankLocation] = useState(" ");
  const [tankType, setTankType] = useState(" ");
  const [length, setLength] = useState(" ");
  const [breadth, setBreadth] = useState(" ");
  const [height, setHeight] = useState(" ");
  const [capacity, setCapacity] = useState(" ");

  const [roadWidths, setRoadWidth] = useState([]);
  const [tankTypes, setTankTypes] = useState([
    { id: 1, tankType: "DOMESTIC", tankTypeMr: "घरगुती" },
    { id: 2, tankType: "FIRE", tankTypeMr: "अग्निशामक" },
  ]);
  const [tankLocations, setTankLocations] = useState([
    { id: 1, tankLocation: "OVERHEAD", tankLocationMr: "ओव्हरहेड" },
    { id: 2, tankLocation: "UNDERGROUND", tankLocationMr: "भूमिगत" },
  ]);
  const [approachRoadDirections, setApproachRoadDirection] = useState([
    { id: 1, approachRoadDirection: "East", approachRoadDirectionMr: "पूर्व" },
    { id: 2, approachRoadDirection: "West", approachRoadDirectionMr: "पश्चिम" },
    {
      id: 3,
      approachRoadDirection: "South",
      approachRoadDirectionMr: "दक्षिण",
    },
    { id: 4, approachRoadDirection: "North", approachRoadDirectionMr: "उत्तर" },
  ]);

  // const [roadSizes, setRoadSizes] = useState([
  //   { roadSize: "", roadSizeMr: "" },
  // ]);
  // formDTLDao -
  // states - Ptax
  const [propertyDetailsTableData, setPropertyDetailsTableData] = useState([]);
  const [buttonInputStatePtax, setButtonInputStatePtax] = useState(false);
  const [isOpenCollapsePtax, setIsOpenCollapsePtax] = useState(false);
  const [editButtonInputStatePtax, setEditButtonInputStatePtax] =
    useState(false);
  const [deleteButtonInputStatePtax, setDeleteButtonStatePtax] =
    useState(false);
  const [slideCheckedPtax, setSlideCheckedPtax] = useState(false);
  const [btnSaveTextPtax, setBtnSaveTextPtax] = useState("Save");
  const [viewButtonInputStatePtax, setViewButtonInputStatePtax] =
    useState(false);
  const [disabledInputStatePtax, setDisabledInputStatePtax] = useState(false);
  const [visibilityIconStatePtax, setVisibilityIconStatePtax] = useState(false);

  //  statex - WaterTank
  const [buttonInputStateWaterTank, setButtonInputStateWaterTank] =
    useState(false);
  const [isOpenCollapseWaterTank, setIsOpenCollapseWaterTank] = useState(false);

  const [editButtonInputStateWaterTank, setEditButtonInputStateWaterTank] =
    useState(false);
  const [deleteButtonInputStateWaterTank, setDeleteButtonStateWaterTank] =
    useState(false);
  const [slideCheckedWaterTank, setSlideCheckedWaterTank] = useState(false);
  const [btnSaveTextWaterTank, setBtnSaveTextWaterTank] = useState("Save");
  const [viewButtonInputStateWaterTank, setViewButtonInputStateWaterTank] =
    useState(false);
  const [disabledInputStateWaterTank, setDisabledInputStateWaterTank] =
    useState(false);
  const [visibilityIconStateWaterTank, setVisibilityIconStateWaterTank] =
    useState(false);
  const [waterTankDetailsTableData, setWaterTankDetailsTableData] = useState(
    []
  );

  //Direction
  const [buttonInputStateDirection, setButtonInputStateDirection] =
    useState(false);
  const [isOpenCollapseDirection, setIsOpenCollapseDirection] = useState(false);
  const [editButtonInputStateDirection, setEditButtonInputStateDirection] =
    useState(false);
  const [deleteButtonInputStateDirection, setDeleteButtonStateDirection] =
    useState(false);
  const [slideCheckedDirection, setSlideCheckedDirection] = useState(false);
  const [btnSaveTextDirection, setBtnSaveTextDirection] = useState("Save");
  const [viewButtonInputStateDirection, setViewButtonInputStateDirection] =
    useState(false);
  const [disabledInputStateDirection, setDisabledInputStateDirection] =
    useState(false);
  const [visibilityIconStateDirection, setVisibilityIconStateDirection] =
    useState(false);
  const [directionDetailsTableData, setDirectionDetailsTableData] = useState(
    []
  );

  const [isRoadValue, setIsRoadValue] = useState(false);

  // getRoadWidth
  const getRoadWidth = () => {
    axios
      .get(`${urls.FbsURL}/master/accessRoadWidth/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          setRoadWidth(() => {
            return res.data.accessRoadWidth.map((j) => ({
              id: j.id,
              accessWidth: j.accessWidth,
              accessWidthMr: j.accessWidth,
            }));
          });
          // setRoadWidth(res?.data?.accessRoadWidth);
        } else {
          //
        }
      })
      .catch((error) => {
        console.log(error);
        //
      });
  };

  // SetPropertyDetailsValues
  const SetPropertyDetailsValues = (props) => {
    console.log("setOwnerValues", props);
    setValue("propertyId", props?.id);
    setValue("formDtlId", props?.formDtlId);
    setValue("propertyNo", props?.propertyNo);
    setValue("propertyActiveFlag", props?.activeFlag);
  };

  // SetWaterTankDetailsValues
  const SetWaterTankDetailsValues = (props) => {
    console.log("SetWaterTankDetailsValuesProps4545", props);
    setValue("length", props?.length);
    setValue("breadth", props?.breadth);
    setValue("height", props?.height);
    setValue("capacity", props?.capacity);
    setValue("waterTankId", props?.id);
    setValue("waterTankActiveFlag", props?.activeFlag);
    setValue("formDtlId", props?.formDtlId);
    setValue("tankLocation", props?.tankLocation);
    setValue("tankType", props?.tankType);
  };

  // SetDirectionDetailsValues
  const SetDirectionDetailsValues = (props) => {
    console.log("76576", props?.isRoad);
    setValue("approachRoadDirection", props?.approachRoadDirection);
    setValue("roadWidth", props?.roadWidth);
    setValue("directionId", props?.id);
    setValue("directionActiveFlag", props?.activeFlag);
    setValue("formDtlId", props?.formDtlId);
    setValue("roadSizeIfDirectionNot", props?.roadSizeIfDirectionNot);
    setIsRoadValue(props?.isRoad);
  };

  // resetOwnerValuesWithIdPtax
  const resetOwnerValuesIdPtax = () => {
    setValue("propertyId", null);
    setValue("formDtlId", null);
    setValue("propertyNo", "");
    setValue("propertyActiveFlag", null);
  };

  // resetOwnerValuesWithIdWaterTank
  const resetOwnerValuesIdWaterTank = () => {
    setValue("tankType", null);
    setValue("tankLocation", null);
    setValue("length", "");
    setValue("breadth", "");
    setValue("height", "");
    setValue("capacity", "");
    setValue("waterTankId", null);
    setValue("waterTankActiveFlag", null);
  };

  // resetOwnerValuesWithIdWaterTank
  const resetOwnerValuesIdDirection = () => {
    setValue("approachRoadDirection", null);
    setValue("roadWidth", null);
    setValue("directionId", null);
    setValue("directionActiveFlag", null);
    setValue("roadSizeIfDirectionNot", null);

    setIsRoadValue(false);
  };

  // exitFunctionPtax
  const exitFunctionPtax = () => {
    // editButtonState
    setEditButtonInputStatePtax(false);
    // deleteButtonState
    setDeleteButtonStatePtax(false);
    // addButtonState
    setButtonInputStatePtax(false);
    // visibilityIcon
    setVisibilityIconStatePtax(false);
    // viewIconState
    setViewButtonInputStatePtax(false);
    // save/updateButtonText
    setBtnSaveTextPtax("Save");
    // conditionalRendering
    setSlideCheckedPtax(true);
    // collpaseOpen/Close
    setIsOpenCollapsePtax(false);
    // resetValuesWithId
    resetOwnerValuesIdPtax();
    // disabledInputStatePtax
    setDisabledInputStatePtax(false);

    setIsRoadValue(false);
  };

  // exitFunctionPtax
  const exitFunctionWaterTax = () => {
    // editButtonState
    setEditButtonInputStateWaterTank(false);
    // deleteButtonState
    setDeleteButtonStateWaterTank(false);
    // addButtonState
    setButtonInputStateWaterTank(false);
    // visibilityIcon
    setVisibilityIconStateWaterTank(false);
    // viewIconState
    setViewButtonInputStateWaterTank(false);
    // save/updateButtonText
    setBtnSaveTextWaterTank("Save");
    // conditionalRendering
    setSlideCheckedWaterTank(true);
    // collpaseOpen/Close
    setIsOpenCollapseWaterTank(false);
    // resetValuesWithId
    resetOwnerValuesIdWaterTank();
    // disabledInputStateWaterTank
    setDisabledInputStateWaterTank(false);
  };

  // exitFunctionDirection
  const exitFunctionDirection = () => {
    // editButtonState
    setEditButtonInputStateDirection(false);
    // deleteButtonState
    setDeleteButtonStateDirection(false);
    // addButtonState
    setButtonInputStateDirection(false);
    // visibilityIcon
    setVisibilityIconStateDirection(false);
    // viewIconState
    setViewButtonInputStateDirection(false);
    // save/updateButtonText
    setBtnSaveTextDirection("Save");
    // conditionalRendering
    setSlideCheckedDirection(true);
    // collpaseOpen/Close
    setIsOpenCollapseDirection(false);
    // resetValuesWithId
    resetOwnerValuesIdDirection();
    // disabledInputStateWaterTank
    // setDisabledInputStateDirection(false);
  };

  // propertyDetailsTableColumn
  const propertyDetailsTableColumn = [
    {
      field: "srNo",
      headerName: "Sr No.",
      flex: 0.2,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "propertyNo",
      headerName: "Property No.",
      flex: 1,
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      align: "center",
      headerAlign: "center",
      flex: 0.4,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        console.log("params", params.row);
        return (
          <>
            <IconButton
              className={styles.view}
              disabled={visibilityIconStatePtax}
              onClick={() => {
                SetPropertyDetailsValues(params?.row);
                // editButtonState
                setEditButtonInputStatePtax(true);
                // deleteButtonState
                setDeleteButtonStatePtax(true);
                // addButtonState
                setButtonInputStatePtax(true);
                // visibilityIcon
                setVisibilityIconStatePtax(true);
                // viewIconState
                setViewButtonInputStatePtax(true);
                // conditionalRendering
                setSlideCheckedPtax(true);
                // collpaseOpen/Close
                setIsOpenCollapsePtax(true);
                // disabledInputStatePtax
                setDisabledInputStatePtax(true);
              }}
            >
              <Visibility />
            </IconButton>

            {!view && (
              <IconButton
                className={styles.edit}
                disabled={editButtonInputStatePtax}
                onClick={() => {
                  // setValues
                  SetPropertyDetailsValues(params?.row);

                  // editButtonState
                  setEditButtonInputStatePtax(true);
                  // deleteButtonState
                  setDeleteButtonStatePtax(true);
                  // addButtonState
                  setButtonInputStatePtax(true);

                  // visibilityIcon
                  setVisibilityIconStatePtax(true);
                  // viewIconState
                  setViewButtonInputStatePtax(false);
                  // save/updateButtonText
                  setBtnSaveTextPtax("Update");
                  // conditionalRendering
                  setSlideCheckedPtax(true);
                  // collpaseOpen/Close
                  setIsOpenCollapsePtax(true);
                }}
              >
                <EditIcon />
              </IconButton>
            )}

            {!view && (
              <IconButton
                className={styles.delete}
                disabled={deleteButtonInputStatePtax}
                onClick={() => {
                  deleteByIdPtax(params?.row?.id);
                  // editButtonState
                  setEditButtonInputStatePtax(true);
                  // deleteButtonState
                  setDeleteButtonStatePtax(true);
                  // addButtonState
                  setButtonInputStatePtax(true);
                  // visibility
                  setVisibilityIconStatePtax(true);
                }}
              >
                <DeleteIcon />
              </IconButton>
            )}
            {/* {!view && (
              <IconButton>
                <Visibility />
              </IconButton>
            )} */}
          </>
        );
      },
    },
  ];

  const [sum, setSum] = useState(0);

  // tankDetailsTableColumn
  const tankDetailsTableColumn = [
    {
      field: "srNo",
      headerName: "Sr No.",
      flex: 0.6,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tankLocation",
      headerName: <FormattedLabel id="tankLocation" />,
      flex: 1.5,
      renderCell: (params) => {
        return (
          <>
            {language == "en"
              ? tankLocations?.find((f) => f.id == params.row.tankLocation)
                  ?.tankLocation
              : tankLocations?.find((f) => f.id == params.row.tankLocation)
                  ?.tankLocationMr}
          </>
        );
      },
    },
    {
      field: "tankType",
      headerName: <FormattedLabel id="tankType" />,
      flex: 1.2,
      renderCell: (params) => {
        return (
          <>
            {language == "en"
              ? tankTypes?.find((f) => f.id == params.row.tankType)?.tankType
              : tankTypes?.find((f) => f.id == params.row.tankType)?.tankTypeMr}
          </>
        );
      },
    },
    {
      field: "length",
      headerName: "Length",
      flex: 1,
    },
    {
      field: "height",
      headerName: "Height",
      flex: 1,
    },
    {
      field: "breadth",
      headerName: "Breadth",
      flex: 1,
    },
    {
      field: "capacity",
      headerName: "Capacity",
      flex: 1,
      renderCell: (params) => {
        console.log("paramsOfCapacity", params.row.capacity);
      },
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 1.2,
      align: "center",
      headerAlign: "center",

      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        console.log("params", params.row);
        return (
          <>
            <IconButton
              className={styles.view}
              disabled={visibilityIconStateWaterTank}
              onClick={() => {
                SetWaterTankDetailsValues(params?.row);
                // editButtonState
                setEditButtonInputStateWaterTank(true);
                // deleteButtonState
                setDeleteButtonStateWaterTank(true);
                // addButtonState
                setButtonInputStateWaterTank(true);
                // visibilityIcon
                setVisibilityIconStateWaterTank(true);
                // viewIconState
                setViewButtonInputStateWaterTank(true);
                // conditionalRendering
                setSlideCheckedWaterTank(true);
                // collpaseOpen/Close
                setIsOpenCollapseWaterTank(true);
                // disabledInputStateWaterTank
                setDisabledInputStateWaterTank(true);
              }}
            >
              <Visibility />
            </IconButton>

            {!view && (
              <IconButton
                className={styles.edit}
                disabled={editButtonInputStateWaterTank}
                onClick={() => {
                  // setValues
                  SetWaterTankDetailsValues(params?.row);

                  // editButtonState
                  setEditButtonInputStateWaterTank(true);
                  // deleteButtonState
                  setDeleteButtonStateWaterTank(true);
                  // addButtonState
                  setButtonInputStateWaterTank(true);

                  // visibilityIcon
                  setVisibilityIconStateWaterTank(true);
                  // viewIconState
                  setViewButtonInputStateWaterTank(false);
                  // save/updateButtonText
                  setBtnSaveTextWaterTank("Update");
                  // conditionalRendering
                  setSlideCheckedWaterTank(true);
                  // collpaseOpen/Close
                  setIsOpenCollapseWaterTank(true);
                }}
              >
                <EditIcon />
              </IconButton>
            )}

            {!view && (
              <IconButton
                className={styles.delete}
                disabled={deleteButtonInputStateWaterTank}
                onClick={() => {
                  deleteByIdWaterTank(params?.row?.id);
                  // editButtonState
                  setEditButtonInputStateWaterTank(true);
                  // deleteButtonState
                  setDeleteButtonStateWaterTank(true);
                  // addButtonState
                  setButtonInputStateWaterTank(true);
                  // visibilityIcon
                  setVisibilityIconStateWaterTank(true);
                }}
              >
                <DeleteIcon />
              </IconButton>
            )}
            {/* {!view && (
              <IconButton>
                <Visibility />
              </IconButton>
            )} */}
          </>
        );
      },
    },
  ];

  // directionDetailsTableColumn
  const directionDetailsTableColumn = [
    {
      field: "srNo",
      headerName: "Sr No.",
      flex: 0.3,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "approachRoadDirection",
      headerName: <FormattedLabel id="direction" />,
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            {
              approachRoadDirections?.find(
                (f) => f.id == params.row.approachRoadDirection
              )?.approachRoadDirection
            }
          </>
        );
      },
    },
    {
      field: "roadSizeIfDirectionNot",
      headerName: <FormattedLabel id="roadSize" />,
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            {language == "en"
              ? roadWidths?.find((f) => f.id == params?.row?.roadWidth)
                  ?.accessWidth
              : roadWidths?.find((f) => f.id == params?.row?.roadWidth)
                  ?.accessWidthMr}
          </>
        );
      },
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      align: "center",
      flex: 1,
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        console.log(":a3", params.row);
        return (
          <>
            <IconButton
              className={styles.view}
              disabled={visibilityIconStateDirection}
              onClick={() => {
                SetDirectionDetailsValues(params?.row);
                // editButtonState
                setEditButtonInputStateDirection(true);
                // deleteButtonState
                setDeleteButtonStateDirection(true);
                // addButtonState
                setButtonInputStateDirection(true);
                // visibilityIcon
                setVisibilityIconStateDirection(true);
                // viewIconState
                setViewButtonInputStateDirection(true);
                // conditionalRendering
                setSlideCheckedDirection(true);
                // collpaseOpen/Close
                setIsOpenCollapseDirection(true);
                // disabledInputStateDirection
                setDisabledInputStateDirection(true);
              }}
            >
              <Visibility />
            </IconButton>

            {!view && (
              <IconButton
                className={styles.edit}
                disabled={editButtonInputStateDirection}
                onClick={() => {
                  // setValues
                  SetDirectionDetailsValues(params?.row);

                  // editButtonState
                  setEditButtonInputStateDirection(true);
                  // deleteButtonState
                  setDeleteButtonStateDirection(true);
                  // addButtonState
                  setButtonInputStateDirection(true);

                  // visibilityIcon
                  setVisibilityIconStateDirection(true);
                  // viewIconState
                  setViewButtonInputStateDirection(false);
                  // save/updateButtonText
                  setBtnSaveTextDirection("Update");
                  // conditionalRendering
                  setSlideCheckedDirection(true);
                  // collpaseOpen/Close
                  setIsOpenCollapseDirection(true);
                }}
              >
                <EditIcon />
              </IconButton>
            )}

            {!view && (
              <IconButton
                className={styles.delete}
                disabled={deleteButtonInputStateDirection}
                onClick={() => {
                  deleteByIdDirection(params?.row?.id);
                  // editButtonState
                  setEditButtonInputStateDirection(true);
                  // deleteButtonState
                  setDeleteButtonStateDirection(true);
                  // addButtonState
                  setButtonInputStateDirection(true);
                  // visibilityIcon
                  setVisibilityIconStateDirection(true);
                }}
              >
                <DeleteIcon />
              </IconButton>
            )}
            {/* {!view && (
              <IconButton>
                <Visibility />
              </IconButton>
            )} */}
          </>
        );
      },
    },
  ];

  const [disabledDirectionButton, setDisabledDirectionButton] = useState(false);

  const [disabledPropertyNumButton, setDisabledPropertyNumButton] =
    useState(false);

  useEffect(() => {
    setDisabledDirectionButton(false);
  }, [
    watch("approachRoadDirection"),
    watch("roadWidth"),
    isRoadValue,
    watch("roadSizeIfDirectionNot"),
  ]);

  useEffect(() => {
    const isUnderGroundWaterTank = watch(
      "formDTLDao.isPlanhaveUnderGroundWaterTank"
    );

    if (isUnderGroundWaterTank === "N") {
      console.log("876", watch("formDTLDao.isPlanhaveUnderGroundWaterTank"));
      setTankLocation(" ");
      setTankType(" ");
      setLength(" ");
      setBreadth(" ");
      setHeight(" ");
      setCapacity(" ");
      console.log("valuee", tankLocation);
    }
  }, [watch("formDTLDao.isPlanhaveUnderGroundWaterTank")]);

  const [disabledTankDetailsButton, setDisabledTankDetailsButton] =
    useState(false);

  const handleClickForWaterTank = () => {
    const isUnderGroundWaterTank = watch(
      "formDTLDao.isPlanhaveUnderGroundWaterTank"
    );

    const tankLocation = watch("tankLocation");
    const tankType = watch("tankType");
    const length = watch("length");
    const breadth = watch("breadth");
    const height = watch("height");
    const capacity = watch("capacity");

    if (tankLocation === "") {
      setTankLocation("Please select tank Location");
    }
    if (tankType === "") {
      setTankType("Please select a tank type");
    }
    if (length === "") {
      setLength("Please enter length");
    }
    if (breadth === "") {
      setBreadth("Please enter breadth ");
    }
    if (height === "") {
      setHeight("Please enter height");
    }
    if (capacity === "") {
      setCapacity("Please enter capacity");
    } else {
      setDisabledTankDetailsButton(true);
      saveTankDetails();
    }
  };

  const [disabledInputStatePropertyNo, setDisabledInputStatePropertyNo] =
    useState(false);

  // useEffect(() => {
  //   setDisabledInputStatePropertyNo(false);
  //   console.log("123456", watch("propertyNo"));
  // }, [getValues("propertyNo")]);

  //checkValidation
  const handleClick = () => {
    const approachRoadDirection = watch("approachRoadDirection");
    const roadWidth = watch("roadWidth");

    if (approachRoadDirection === "") {
      setApproachRoadError("Please select Approach Road");
    }
    if (roadWidth === "") {
      setRoadWidthError("Please select Road Size");
    } else {
      saveDirectionDetails();
      // saveOwner();
      // setError("");
      // animalKeyFunction();
      // setCollapse(true);
    }
    setDisabledDirectionButton(true);
  };

  //checkValidation

  // useEffect(() => {
  //   setDisabledInputStatePropertyNo(false);
  // }, [watch("propertyNo")]);

  //Floorvalidation
  const handleClickPropertyNo = () => {
    setDisabledInputStatePropertyNo(true);

    const floorHeight = watch("propertyNo");

    if (floorHeight === "") {
      setFloorHeight("Please Enter Property Number");
    } else {
      savePropertyDetails();
    }
  };

  // savePropertyDetails
  const savePropertyDetails = () => {
    // currentOwnerDTLDao
    const currentPropertyDetails = {
      propertyNo: getValues("propertyNo"),
      id: getValues("propertyId"),
      activeFlag: getValues("propertyActiveFlag"),
      formDtlId: getValues("formDtlId"),
    };

    console.log("currentPropertyDetails", currentPropertyDetails?.id);

    // getAlredyData
    let tempPropertyDTLDao = watch("formDTLDao.propertyDTLDao");
    console.log("tempPropertyDTLDao", tempPropertyDTLDao);
    const tempPropertyDTLDaoLegnth = Number(tempPropertyDTLDao.length);

    // OwnerTableList
    if (
      tempPropertyDTLDao != null &&
      tempPropertyDTLDao != undefined &&
      tempPropertyDTLDaoLegnth != 0
    ) {
      // ifArrayIsNotEmpty - secondRecordUpdateInTable
      if (
        currentPropertyDetails?.id == null ||
        currentPropertyDetails?.id == undefined
      ) {
        // ifAlredyRecordNotExit - Save
        setValue("formDTLDao.propertyDTLDao", [
          ...tempPropertyDTLDao,
          currentPropertyDetails,
        ]);
      } else {
        // ifAlredyRecordExit - Update
        const tempDataPtax = tempPropertyDTLDao.filter((data, index) => {
          if (data?.id != currentPropertyDetails?.id) {
            return data;
          }
        });
        setValue("formDTLDao.propertyDTLDao", [
          ...tempDataPtax,
          currentPropertyDetails,
        ]);
      }
    } else {
      // ifArrayIsEmpty - firstRecordInTable
      setValue("formDTLDao.propertyDTLDao", [currentPropertyDetails]);
    }

    // finalBodyForApi
    const finalBodyForApi = {
      ...getValues(),
      id: getValues("provisionalBuildingNocId"),
      // applicantDTLDao
      // applicantDTLDao:
      //   watch("applicantDTLDao") == undefined ? {} : watch("applicantDTLDao"),
      // ownerDTLDao
      // ownerDTLDao:
      //   watch("ownerDTLDao") == undefined ? [] : [...watch("ownerDTLDao")],
      // formDTLDao
      formDTLDao: watch("formDTLDao") == undefined ? {} : watch("formDTLDao"),
      // buildingDTLDao
      // buildingDTLDao:
      //   watch("buildingDTLDao") == undefined
      //     ? []
      //     : [...watch("buildingDTLDao")],
      // attachments
      // attachments:
      //   watch("attachments") == undefined ? [] : [...watch("attachments")],
    };

    console.log("finalBodyForApiPtax", finalBodyForApi);
    setDisabledDirectionButton(true);
    setDisabledInputStatePropertyNo(true);

    // PropertNumber Save Button Disabled
    setDisabledPropertyNumButton(true);

    axios
      .post(
        `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/save`,
        finalBodyForApi,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          setDisabledDirectionButton(false);
          setDisabledInputStatePropertyNo(false);
          setValue(
            "provisionalBuildingNocId",
            res?.data?.status?.split("$")[1]
          );

          console.log("res?.data", res?.data);
          // setId
          console.log(
            "provisionalBuildingNocId",
            res?.data?.status?.split("$")[1]
          );

          // collpaseOpen/Close
          setIsOpenCollapsePtax(false);
          // editButtonState
          setEditButtonInputStatePtax(false);
          // deleteButtonState
          setDeleteButtonStatePtax(false);
          // addButtonState
          setButtonInputStatePtax(false);
          // visibilityIcon
          setVisibilityIconStatePtax(false);
          // viewIconState
          setViewButtonInputStatePtax(false);
          // disabledInputStatePtax
          setDisabledInputStatePtax(false);
          // resetOwnerValuesWithID
          resetOwnerValuesIdPtax();
          // PropertNumber Save Button Disabled
          setDisabledPropertyNumButton(false);
          sweetAlert("Saved!", "Record Saved successfully !", "success");
        } else {
          //
        }
      })
      .catch((error) => {
        console.log("Error", error);
        //
      });
  };

  // saveTankDetails
  const saveTankDetails = () => {
    // currentOwnerDTLDao
    const currentUnderGroundWaterTankDao = {
      tankType: getValues("tankType"),
      tankLocation: getValues("tankLocation"),
      length: Number(getValues("length")),
      breadth: Number(getValues("breadth")),
      height: Number(getValues("height")),
      capacity: Number(getValues("capacity")),
      id: getValues("waterTankId"),
      activeFlag: getValues("waterTankActiveFlag"),
      formDtlId: getValues("formDtlId"),
    };

    console.log(
      "currentUnderGroundWaterTankDaoId",
      currentUnderGroundWaterTankDao?.id
    );

    // getAlredyData
    let tempWaterTankDTLDao = watch("formDTLDao.underGroundWaterTankDao");
    console.log("tempWaterTankDTLDao", tempWaterTankDTLDao);
    const tempWaterTankDTLDaolength = Number(tempWaterTankDTLDao.length);

    // OwnerTableList
    if (
      tempWaterTankDTLDao != null &&
      tempWaterTankDTLDao != undefined &&
      tempWaterTankDTLDaolength != 0
    ) {
      // ifArrayIsNotEmpty - secondRecordUpdateInTable
      if (
        currentUnderGroundWaterTankDao?.id == null ||
        currentUnderGroundWaterTankDao?.id == undefined
      ) {
        // ifAlredyRecordNotExit - Save
        setValue("formDTLDao.underGroundWaterTankDao", [
          ...tempWaterTankDTLDao,
          currentUnderGroundWaterTankDao,
        ]);
      } else {
        // ifAlredyRecordExit - Update
        const tempDataWaterTank = tempWaterTankDTLDao.filter((data, index) => {
          if (data?.id != currentUnderGroundWaterTankDao?.id) {
            return data;
          }
        });
        setValue("formDTLDao.underGroundWaterTankDao", [
          ...tempDataWaterTank,
          currentUnderGroundWaterTankDao,
        ]);
      }
    } else {
      // ifArrayIsEmpty - firstRecordInTable
      setValue("formDTLDao.underGroundWaterTankDao", [
        currentUnderGroundWaterTankDao,
      ]);
    }

    console.log("123getValuesForm", getValues());

    const finalBodyForApi = {
      ...getValues(),
      id: getValues("provisionalBuildingNocId"),
      formDTLDao: watch("formDTLDao") == undefined ? {} : watch("formDTLDao"),
    };

    console.log("finalBodyForApiPtax", finalBodyForApi);

    axios
      .post(
        `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/save`,
        finalBodyForApi,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          setDisabledTankDetailsButton(false);

          console.log("res?.data", res?.data);
          // setId
          console.log(
            "provisionalBuildingNocId",
            res?.data?.status?.split("$")[1]
          );
          setValue(
            "provisionalBuildingNocId",
            res?.data?.status?.split("$")[1]
          );
          // collpaseOpen/Close
          setIsOpenCollapseWaterTank(false);
          // editButtonState
          setEditButtonInputStateWaterTank(false);
          // deleteButtonState
          setDeleteButtonStateWaterTank(false);
          // addButtonState
          setButtonInputStateWaterTank(false);
          // visibilityIcon
          setVisibilityIconStateWaterTank(false);
          // viewIconState
          setViewButtonInputStateWaterTank(false);
          // disabledInputStateWaterTank
          setDisabledInputStateWaterTank(false);
          // resetOwnerValuesWithID
          resetOwnerValuesIdWaterTank();
          sweetAlert("Saved!", "Record Saved successfully !", "success");
        } else {
          //
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  // saveTankDetails
  const saveDirectionDetails = () => {
    console.log(
      "0987654",
      getValues("isRoad"),
      getValues("roadSizeIfDirectionNot")
    );
    // currentOwnerDTLDao
    const currentDirectionDao = {
      approachRoadDirection: getValues("approachRoadDirection"),
      roadWidth: getValues("roadWidth"),
      id: getValues("directionId"),
      activeFlag: getValues("directionActiveFlag"),
      formDtlId: getValues("formDtlId"),
      roadSizeIfDirectionNot: getValues("roadSizeIfDirectionNot"),
      isRoad: isRoadValue,
    };

    // console.log("currentDirectionDaoId", currentDirectionDao?.id);

    // getAlredyData
    let tempDirectionDTLDao = watch("formDTLDao.approachRoadDTLDao");
    console.log("tempDirectionDTLDao", tempDirectionDTLDao);
    const tempDirectionDTLDaolength = Number(tempDirectionDTLDao?.length);

    // OwnerTableList
    if (
      tempDirectionDTLDao != null &&
      tempDirectionDTLDao != undefined &&
      tempDirectionDTLDaolength != 0
    ) {
      // ifArrayIsNotEmpty - secondRecordUpdateInTable
      if (
        currentDirectionDao?.id == null ||
        currentDirectionDao?.id == undefined
      ) {
        // ifAlredyRecordNotExit - Save
        setValue("formDTLDao.approachRoadDTLDao", [
          ...tempDirectionDTLDao,
          currentDirectionDao,
        ]);
      } else {
        // ifAlredyRecordExit - Update
        const tempDataDirection = tempDirectionDTLDao.filter((data, index) => {
          if (data?.id != currentDirectionDao?.id) {
            return data;
          }
        });
        setValue("formDTLDao.approachRoadDTLDao", [
          ...tempDataDirection,
          currentDirectionDao,
        ]);
      }
    } else {
      // ifArrayIsEmpty - firstRecordInTable
      setValue("formDTLDao.approachRoadDTLDao", [currentDirectionDao]);
    }

    const finalBodyForApi = {
      ...getValues(),
      id: getValues("provisionalBuildingNocId"),
      formDTLDao: watch("formDTLDao") == undefined ? {} : watch("formDTLDao"),
    };

    console.log("finalBodyForApiPtax", finalBodyForApi);

    axios
      .post(
        `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/save`,
        finalBodyForApi,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          console.log("res?.data", res?.data);
          // setId
          console.log(
            "provisionalBuildingNocId",
            res?.data?.status?.split("$")[1]
          );
          setValue(
            "provisionalBuildingNocId",
            res?.data?.status?.split("$")[1]
          );
          // collpaseOpen/Close
          setIsOpenCollapseDirection(false);
          // editButtonState
          setEditButtonInputStateDirection(false);
          // deleteButtonState
          setDeleteButtonStateDirection(false);
          // addButtonState
          setButtonInputStateDirection(false);
          // visibilityIcon
          setVisibilityIconStateDirection(false);
          // viewIconState
          setViewButtonInputStateDirection(false);
          // disabledInputStateWaterTank
          setDisabledInputStateDirection(false);
          // resetOwnerValuesWithID
          // resetOwnerValuesIdDirection();
          sweetAlert("Saved!", "Record Saved successfully !", "success");
        } else {
          //
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  ////////////////////////

  // deleteByIDPtax
  const deleteByIdPtax = async (value) => {
    let propertyDetailsId = value;
    console.log("propertyDetailsId", value);

    swal({
      title: "Delete ?",
      text: "Are you sure you want to delete this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        let tempPropertyDTLDaoPtax = watch("formDTLDao.propertyDTLDao");
        let tempPropertyDTLDaoPtaxLength = tempPropertyDTLDaoPtax.length;

        console.log("tempPropertyDTLDaoPtax", tempPropertyDTLDaoPtax);
        console.log(
          "tempPropertyDTLDaoPtaxLength",
          tempPropertyDTLDaoPtaxLength
        );

        if (
          tempPropertyDTLDaoPtax != null &&
          tempPropertyDTLDaoPtax != undefined &&
          tempPropertyDTLDaoPtaxLength != 0
        ) {
          //activeFlagYRecords
          const tempDataYPtax = tempPropertyDTLDaoPtax.filter((data, index) => {
            if (data?.id != propertyDetailsId) {
              return data;
            }
          });

          console.log("tempDataYPtax", tempDataYPtax);

          // wantToDeletRecord
          const tempDataPtax = tempPropertyDTLDaoPtax.filter((data, index) => {
            if (data?.id == propertyDetailsId) {
              return data;
            }
          });

          console.log("tempDataPtax", tempDataPtax);

          // activeFlagNRecord
          const tempDataNPtax = tempDataPtax.map((data) => {
            return {
              ...data,
              activeFlag: "N",
            };
          });

          console.log("tempDataNPtax", tempDataNPtax);

          // updateRecord
          setValue("formDTLDao.propertyDTLDao", [
            ...tempDataYPtax,
            ...tempDataNPtax,
          ]);

          console.log(
            "sdfdskfdsfjdslkfjadsklfjdsklfjskldfjdslkfj",
            watch("formDTLDao.propertyDTLDao")
          );

          // states
          // editButtonState
          setEditButtonInputStatePtax(false);
          // deleteButtonState
          setDeleteButtonStatePtax(false);
          // addButtonState
          setButtonInputStatePtax(false);
          // viewIconState
          setVisibilityIconStatePtax(false);
        }
      } else {
        setEditButtonInputStatePtax(false);
        // deleteButtonState
        setDeleteButtonStatePtax(false);
        // addButtonState
        setButtonInputStatePtax(false);
        // viewIconState
        setVisibilityIconStatePtax(false);
      }
    });
  };

  // deleteByIDPtax
  const deleteByIdWaterTank = async (value) => {
    let waterTankDetailsId = value;
    console.log("waterTankDetailsId", value);

    swal({
      title: "Delete ?",
      text: "Are you sure you want to delete this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        let tempPropertyDTLDaoWaterTank = watch(
          "formDTLDao.underGroundWaterTankDao"
        );
        let tempPropertyDTLDaoWaterTankLength =
          tempPropertyDTLDaoWaterTank.length;

        console.log("tempPropertyDTLDaoWaterTank", tempPropertyDTLDaoWaterTank);
        console.log(
          "tempPropertyDTLDaoWaterTankLength",
          tempPropertyDTLDaoWaterTankLength
        );

        if (
          tempPropertyDTLDaoWaterTank != null &&
          tempPropertyDTLDaoWaterTank != undefined &&
          tempPropertyDTLDaoWaterTankLength != 0
        ) {
          //activeFlagYRecords
          const tempDataYWaterTank = tempPropertyDTLDaoWaterTank.filter(
            (data, index) => {
              if (data?.id != waterTankDetailsId) {
                return data;
              }
            }
          );

          console.log("tempDataYWaterTank", tempDataYWaterTank);

          // wantToDeletRecord
          const tempDataWaterTank = tempPropertyDTLDaoWaterTank.filter(
            (data, index) => {
              if (data?.id == waterTankDetailsId) {
                return data;
              }
            }
          );

          console.log("tempDataWaterTank", tempDataWaterTank);

          // activeFlagNRecord
          const tempDataNWaterTank = tempDataWaterTank.map((data) => {
            return {
              ...data,
              activeFlag: "N",
            };
          });

          console.log("tempDataNWaterTank", tempDataNWaterTank);

          // updateRecord
          setValue("formDTLDao.underGroundWaterTankDao", [
            ...tempDataYWaterTank,
            ...tempDataNWaterTank,
          ]);

          // states
          // editButtonState
          setEditButtonInputStateWaterTank(false);
          // deleteButtonState
          setDeleteButtonStateWaterTank(false);
          // addButtonState
          setButtonInputStateWaterTank(false);
          // viewIconState
          setVisibilityIconStateWaterTank(false);
        }
      } else {
        // editButtonState
        setEditButtonInputStateWaterTank(false);
        // deleteButtonState
        setDeleteButtonStateWaterTank(false);
        // addButtonState
        setButtonInputStateWaterTank(false);
        // viewIconState
        setVisibilityIconStateWaterTank(false);
      }
    });
  };

  ////////////////////

  // deleteByIDDirection
  const deleteByIdDirection = async (value) => {
    let directionDetailsId = value;
    console.log("directionDetailsId", value);

    swal({
      title: "Delete ?",
      text: "Are you sure you want to delete this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        let tempPropertyDTLDaoDirection = watch(
          "formDTLDao.approachRoadDTLDao"
        );
        let tempPropertyDTLDaoDirectionLength =
          tempPropertyDTLDaoDirection.length;

        console.log("tempPropertyDTLDaoDirection", tempPropertyDTLDaoDirection);
        console.log(
          "tempPropertyDTLDaoDirectionLength",
          tempPropertyDTLDaoDirectionLength
        );

        if (
          tempPropertyDTLDaoDirection != null &&
          tempPropertyDTLDaoDirection != undefined &&
          tempPropertyDTLDaoDirectionLength != 0
        ) {
          //activeFlagYRecords
          const tempDataYDirection = tempPropertyDTLDaoDirection.filter(
            (data, index) => {
              if (data?.id != directionDetailsId) {
                return data;
              }
            }
          );

          console.log("tempDataYDirection", tempDataYDirection);

          // wantToDeletRecord
          const tempDataDirection = tempPropertyDTLDaoDirection.filter(
            (data, index) => {
              if (data?.id == directionDetailsId) {
                return data;
              }
            }
          );

          console.log("tempDataDirection", tempDataDirection);

          // activeFlagNRecord
          const tempDataNDirection = tempDataDirection.map((data) => {
            return {
              ...data,
              activeFlag: "N",
            };
          });

          console.log("tempDataNDirection", tempDataNDirection);

          // updateRecord
          setValue("formDTLDao.approachRoadDTLDao", [
            ...tempDataYDirection,
            ...tempDataNDirection,
          ]);

          // states
          // editButtonState
          setEditButtonInputStateDirection(false);
          // deleteButtonState
          setDeleteButtonStateDirection(false);
          // addButtonState
          setButtonInputStateDirection(false);
          // viewIconState
          setVisibilityIconStateDirection(false);
        }
      } else {
        // editButtonState
        setEditButtonInputStateDirection(false);
        // deleteButtonState
        setDeleteButtonStateDirection(false);
        // addButtonState
        setButtonInputStateDirection(false);
        // viewIconState
        setVisibilityIconStateDirection(false);
      }
    });
  };

  // ================================> useEffect ==>
  useEffect(() => {
    getRoadWidth();
  }, []);

  // useEffect(() => {
  //   console.log("Tank", tank);
  // }, [tank]);

  // ptax

  useEffect(() => {
    // ======================> Property

    console.log("propertyDTLDao2329", watch("formDTLDao.propertyDTLDao"));

    // filterTableData-ActiveFlag "Y"
    const tempTableDataWithFlagYPtax = watch(
      "formDTLDao.propertyDTLDao"
    )?.filter((data, index) => {
      if (data?.activeFlag == "Y") {
        return data;
      }
    });

    // mapRecordActiveFlagY
    const tempTableDataPtax = tempTableDataWithFlagYPtax?.map((data, index) => {
      return {
        srNo: index + 1,
        ...data,
      };
    });

    console.log("tempTableDataPtax", tempTableDataPtax);

    // SetTableData
    setPropertyDetailsTableData(tempTableDataPtax);
  }, [watch("formDTLDao.propertyDTLDao")]);

  // Ptax Table
  useEffect(() => {
    console.log("propertyDetailsTableData", propertyDetailsTableData);
  }, [propertyDetailsTableData]);

  // waterTank
  useEffect(() => {
    console.log(
      "underGroundWaterTankDao121",
      watch("formDTLDao.underGroundWaterTankDao")
    );

    // filterTableData-ActiveFlag "Y"
    const tempTableDataWithFlagYWaterTank = watch(
      "formDTLDao.underGroundWaterTankDao"
    )?.filter((data, index) => {
      if (data?.activeFlag == "Y") {
        return data;
      }
    });

    // mapRecordActiveFlagY
    const tempTableDataWaterTank = tempTableDataWithFlagYWaterTank?.map(
      (data, index) => {
        return {
          srNo: index + 1,
          ...data,
        };
      }
    );

    console.log("tempTableDataWaterTank", tempTableDataWaterTank);

    // SetTableData
    setWaterTankDetailsTableData(tempTableDataWaterTank);
  }, [watch("formDTLDao.underGroundWaterTankDao")]);

  // waterTank Table
  useEffect(() => {
    console.log("waterTankDetailsTableData", waterTankDetailsTableData);
  }, [waterTankDetailsTableData]);

  // Direction
  useEffect(() => {
    console.log("directionDao121", watch("formDTLDao.approachRoadDTLDao"));

    // filterTableData-ActiveFlag "Y"
    const tempTableDataWithFlagYDirection = watch(
      "formDTLDao.approachRoadDTLDao"
    )?.filter((data, index) => {
      if (data?.activeFlag == "Y") {
        return data;
      }
    });

    // mapRecordActiveFlagY
    const tempTableDataDirection = tempTableDataWithFlagYDirection?.map(
      (data, index) => {
        return {
          srNo: index + 1,
          ...data,
        };
      }
    );

    console.log("tempTableDataDirection", tempTableDataDirection);

    // SetTableData
    setDirectionDetailsTableData(tempTableDataDirection);
  }, [watch("formDTLDao.approachRoadDTLDao")]);

  // waterTank Table
  useEffect(() => {
    console.log("directionDetailsTableData", directionDetailsTableData);
  }, [directionDetailsTableData]);

  // useEffect(() => {
  //   handleCapacity();
  // }, [watch("capacity")]);

  // View
  return (
    <>
      {/** FormDetailsFirstPart */}
      <Grid
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
        className={styles.feildres}
      >
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="firmName" />}
            variant="standard"
            {...register("formDTLDao.formName")}
            error={!!errors?.formDTLDao?.formName}
            helperText={errors?.formName ? errors.formName.message : null}
          />
        </Grid>

        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label="Final plot no"
            variant="standard"
            {...register("formDTLDao.finalPlotNo")}
            error={!!errors?.formDTLDao?.finalPlotNo}
            helperText={
              errors?.formDTLDao?.finalPlotNo
                ? errors?.formDTLDao?.finalPlotNo.message
                : null
            }
          />
        </Grid>

        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label="Plot Area In Square Meter"
            variant="standard"
            {...register("formDTLDao.plotAreaSquareMeter")}
            error={!!errors?.formDTLDao?.plotAreaSquareMeter}
            helperText={
              errors?.formDTLDao?.plotAreaSquareMeter
                ? errors?.formDTLDao?.plotAreaSquareMeter.message
                : null
            }
          />
        </Grid>

        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label="Construction Area In Square Meter"
            variant="standard"
            {...register("formDTLDao.constructionAreSqMeter")}
            error={!!errors?.formDTLDao?.constructionAreSqMeter}
            helperText={
              errors?.formDTLDao?.constructionAreSqMeter
                ? errors?.formDTLDao?.constructionAreSqMeter.message
                : null
            }
          />
        </Grid>

        {/* <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label="No. of Approched Road"
            variant="standard"
            {...register("formDTLDao.noOfApprochedRoad")}
            error={!!errors.noOfApprochedRoad}
            helperText={
              errors?.noOfApprochedRoad
                ? errors.noOfApprochedRoad.message
                : null
            }
          />
        </Grid> */}

        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="highTensionLine" />}
            variant="standard"
            {...register("formDTLDao.highTensionLine")}
            error={!!errors?.formDTLDao?.highTensionLine}
            helperText={
              errors?.formDTLDao?.highTensionLine
                ? errors?.formDTLDao?.highTensionLine.message
                : null
            }
          />
        </Grid>

        {/* <Grid item xs={4} className={styles.feildres}>
          <FormControl sx={{ width: "80%" }}>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              {<FormattedLabel id="previouslyAnyFireNocTaken" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  name="previouslyAnyFireNocTaken"
                  fullWidth
                  size="small"
                  variant="standard"
                >
                  <MenuItem value={1}>Yes</MenuItem>
                  <MenuItem value={2}>No</MenuItem>
                  <MenuItem value={3}>Revised</MenuItem>
                </Select>
              )}
              name="formDTLDao.previouslyAnyFireNocTaken"
              control={control}
              defaultValue=""
            />
          </FormControl>
        </Grid>
*/}
        {/* <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label={
              <FormattedLabel id="underTheGroundWaterTankCapacityLighter" />
            }
            variant="standard"
            {...register("formDTLDao.underTheGroundWaterTankCapacityLitre")}
            error={!!errors.underTheGroundWaterTankCapacityLitre}
            helperText={
              errors?.underTheGroundWaterTankCapacityLitre
                ? errors.underTheGroundWaterTankCapacityLitre.message
                : null
            }
          />
        </Grid> */}

        {/* <Grid item xs={4} className={styles.feildres}>
          <FormControl
            variant="standard"
            sx={{ width: "80%" }}
            error={!!errors.businessType}
          >
            <InputLabel id="demo-simple-select-standard-label">
              Access road Width
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="List"
                  error={!!errors.typeOfBuilding}
                  helperText={
                    errors?.typeOfBuilding
                      ? errors.typeOfBuilding.message
                      : null
                  }
                >
                  {roadWidth &&
                    roadWidth.map((type, index) => (
                      <MenuItem key={index} value={type.id}>
                        {type.accessWidth}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="formDTLDao.accessRoadWidth"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.typeOfBuilding ? errors.typeOfBuilding.message : null}
            </FormHelperText>
          </FormControl>
        </Grid> */}

        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="revenueSurveyNo" />}
            variant="standard"
            {...register("formDTLDao.revenueSurveyNo")}
            error={!!errors?.formDTLDao?.revenueSurveyNo}
            helperText={
              errors?.formDTLDao?.revenueSurveyNo
                ? errors?.formDTLDao?.revenueSurveyNo.message
                : null
            }
          />
        </Grid>

        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="blockNo" />}
            variant="standard"
            {...register("formDTLDao.blockNo")}
            error={!!errors?.formDTLDao?.blockNo}
            helperText={
              errors?.formDTLDao?.blockNo
                ? errors?.formDTLDao?.blockNo.message
                : null
            }
          />
        </Grid>

        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            // label={<FormattedLabel id="opNo" />}
            label="dp op no"
            variant="standard"
            {...register("formDTLDao.dpOpNo")}
            error={!!errors?.formDTLDao?.dpOpNo}
            helperText={
              errors?.formDTLDao?.dpOpNo
                ? errors?.formDTLDao?.dpOpNo.message
                : null
            }
          />
        </Grid>

        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label="Site Address"
            variant="standard"
            {...register("formDTLDao.siteAddress")}
            error={!!errors?.formDTLDao?.siteAddress}
            helperText={
              errors?.formDTLDao?.siteAddress
                ? errors?.formDTLDao?.siteAddress.message
                : null
            }
          />
        </Grid>
      </Grid>

      {/* Direction Details */}

      <Grid item xs={12} sm={12} md={12} sx={{ margin: "3%" }}>
        <div>
          <br />
          <Box
            style={{
              display: "flex",
              marginTop: "1%",
              justifyContent: "space-between",
            }}
          >
            <Box className={styles.subtableHead}>
              <Box className={styles.subh1Tag}>Direction Details</Box>
            </Box>
            {!view && (
              <Box>
                <Button
                  variant="contained"
                  type="primary"
                  disabled={buttonInputStateDirection}
                  onClick={() => {
                    // editButtonState
                    setEditButtonInputStateDirection(true);
                    // deleteButtonState
                    setDeleteButtonStateDirection(true);
                    // addButtonState
                    setButtonInputStateDirection(true);
                    // visibilityIcon
                    setVisibilityIconStateDirection(true);
                    // save/updateButtonText
                    setBtnSaveTextDirection("Save");
                    // conditionalRendering
                    setSlideCheckedDirection(true);
                    // collpaseOpen/Close
                    setIsOpenCollapseDirection(true);
                  }}
                  className={styles.subadbtn}
                  sx={{
                    borderRadius: 100,

                    padding: 2,
                    marginLeft: 1,
                    textAlign: "center",
                    border: "2px solid #3498DB",
                  }}
                >
                  <AddIcon />
                </Button>
              </Box>
            )}
          </Box>
          {isOpenCollapseDirection && (
            <Slide
              direction="down"
              in={slideCheckedDirection}
              mountOnEnter
              unmountOnExit
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Box
                  style={{
                    width: "67%",
                    margin: "3vh 0vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Paper
                    sx={{
                      // margin: 1,
                      padding: 2,
                      backgroundColor: "#F5F5F5",
                    }}
                    elevation={5}
                  >
                    {/* <Box className={styles.tableHead}>
                      <Box className={styles.feildHead}>
                        {btnSaveTextDirection == "Update"
                          ? "Update Direction Details"
                          : "Direction Details"}
                      </Box>
                    </Box> */}
                    <Box sx={{ backgroundColor: "white" }}>
                      <h3 style={{ paddingLeft: 10 }}>
                        {" "}
                        {btnSaveTextDirection == "Update"
                          ? "Update Direction Details"
                          : "Add Direction Details"}
                      </h3>
                    </Box>
                    <br />
                    <br />
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      {/* Approach Road  */}
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          variant="standard"
                          sx={{ width: "100%" }}
                          error={!!errors.approachRoadDirection}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="direction" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                  if (approachRoadDirection !== "") {
                                    // setRoadWidthError("");
                                    setApproachRoadError("");
                                  }
                                }}
                                disabled={viewButtonInputStateDirection}
                                label="List"
                                error={!!errors.approachRoadDirection}
                                helperText={
                                  errors?.approachRoadDirection
                                    ? errors.approachRoadDirection.message
                                    : null
                                }
                              >
                                {approachRoadDirections.map((menu, index) => {
                                  return (
                                    <MenuItem key={index} value={menu.id}>
                                      {language == "en"
                                        ? menu.approachRoadDirection
                                        : menu.approachRoadDirectionMr}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            )}
                            name="approachRoadDirection"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {
                              <p className={styles.error}>
                                {approachRoadDirection}
                              </p>
                            }
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControlLabel
                          control={<Checkbox />}
                          label={<FormattedLabel id="isRoad"></FormattedLabel>}
                          checked={isRoadValue}
                          disabled={viewButtonInputStateDirection}
                          onChange={(e) => {
                            setIsRoadValue(
                              (prevIsRoadValue) => !prevIsRoadValue
                            );
                            console.log(":a3", isRoadValue);
                          }}
                        />
                      </Grid>

                      {/* Road Size  */}
                      {isRoadValue ? (
                        <>
                          <Grid item xs={4} className={styles.feildres}>
                            <FormControl
                              variant="standard"
                              sx={{ width: "100%" }}
                              error={!!errors.roadWidth}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                <FormattedLabel id="roadSize" />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    value={field.value}
                                    onChange={(value) => {
                                      field.onChange(value);
                                      if (roadWidth !== "") {
                                        // setError("");
                                        setRoadWidthError("");
                                      }
                                    }}
                                    disabled={viewButtonInputStateDirection}
                                    label="List"
                                    error={!!errors.roadWidth}
                                    helperText={
                                      errors?.roadWidth
                                        ? errors.roadWidth.message
                                        : null
                                    }
                                  >
                                    {roadWidths.map((menu, index) => {
                                      return (
                                        <MenuItem key={index} value={menu.id}>
                                          {language == "en"
                                            ? menu.accessWidth
                                            : menu.accessWidth}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                )}
                                name="roadWidth"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText>
                                {<p className={styles.error}>{roadWidth}</p>}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                        </>
                      ) : (
                        <>
                          <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                              id="standard-basic"
                              label={
                                <FormattedLabel id="roadSizeIfDirectionNot" />
                              }
                              variant="standard"
                              inputProps={{ maxLength: 1000 }}
                              {...register("roadSizeIfDirectionNot")}
                              // onChange={(e) => handleRemarkChange(e, "roadSizeIfDirectionNot")}
                              error={!!errors.roadSizeIfDirectionNot}
                              helperText={
                                errors?.roadSizeIfDirectionNot
                                  ? errors.roadSizeIfDirectionNot.message
                                  : null
                              }
                              disabled={viewButtonInputStateDirection}
                            />
                          </Grid>
                        </>
                      )}
                    </Grid>
                    <br />
                    <br />
                    <div></div>
                    <Grid container className={styles.feildres} spacing={2}>
                      {!viewButtonInputStateDirection && (
                        <Grid item>
                          <Button
                            disabled={disabledDirectionButton}
                            size="small"
                            variant="outlined"
                            className={styles.button}
                            endIcon={<SaveIcon />}
                            onClick={() => {
                              handleClick();
                              // saveDirectionDetails();
                            }}
                          >
                            {btnSaveTextDirection == "Update" ? (
                              <FormattedLabel id="update" />
                            ) : (
                              <FormattedLabel id="save" />
                            )}
                          </Button>
                        </Grid>
                      )}

                      <Grid item>
                        <Button
                          size="small"
                          variant="outlined"
                          className={styles.button}
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitFunctionDirection()}
                        >
                          {<FormattedLabel id="exit" />}
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
              </div>
            </Slide>
          )}
          {/** DirectionDetailsTable */}
          {directionDetailsTableData?.length !== 0 && (
            <Box>
              <DataGrid
                getRowId={(row) => row.srNo}
                disableColumnFilter
                disableColumnSelector
                disableExport
                // componentsProps={{
                //   toolbar: {
                //     showQuickFilter: true,
                //     quickFilterProps: { debounceMs: 500 },
                //     printOptions: { disableToolbarButton: true },
                //     csvOptions: { disableToolbarButton: true },
                //   },
                // }}
                // components={{ Toolbar: GridToolbar }}
                autoHeight
                density="compact"
                sx={{
                  backgroundColor: "white",
                  boxShadow: 2,
                  width: "100%",
                  // border: 1,
                  // borderColor: "primary.light",
                  "& .MuiDataGrid-cell:hover": {},
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "#E1FDFF",
                  },
                  "& .MuiDataGrid-columnHeadersInner": {
                    backgroundColor: "#92bdeee8",
                  },
                }}
                rows={
                  directionDetailsTableData == null ||
                  directionDetailsTableData == undefined
                    ? []
                    : directionDetailsTableData
                }
                columns={directionDetailsTableColumn}
                pageSize={7}
                rowsPerPageOptions={[7]}
              />
            </Box>
          )}
        </div>
      </Grid>

      {/** Property Details */}
      <Grid item xs={12} sx={{ margin: "3%" }}>
        <div>
          <Box
            style={{
              display: "flex",
            }}
          >
            <Box className={styles.subtableHead}>
              <Box className={styles.subh1Tag}>Property Details</Box>
            </Box>
            {!view && (
              <Box>
                <Button
                  variant="contained"
                  type="primary"
                  disabled={buttonInputStatePtax}
                  onClick={() => {
                    // editButtonState
                    setEditButtonInputStatePtax(true);
                    // deleteButtonState
                    setDeleteButtonStatePtax(true);
                    // addButtonState
                    setButtonInputStatePtax(true);
                    // visibilityIcon
                    setVisibilityIconStatePtax(true);

                    // save/updateButtonText
                    setBtnSaveTextPtax("Save");
                    // conditionalRendering
                    setSlideCheckedPtax(true);
                    // collpaseOpen/Close
                    setIsOpenCollapsePtax(true);
                  }}
                  className={styles.subadbtn}
                  sx={{
                    borderRadius: 100,

                    padding: 2,
                    marginLeft: 1,
                    textAlign: "center",
                    border: "2px solid #3498DB",
                  }}
                >
                  <AddIcon />
                </Button>
              </Box>
            )}
          </Box>

          {/** Property Details */}
          {isOpenCollapsePtax && (
            <Slide
              direction="down"
              in={slideCheckedPtax}
              mountOnEnter
              unmountOnExit
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Box
                  style={{
                    width: "50%",
                    margin: "3vh 0vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Paper
                    sx={{
                      // margin: 1,
                      padding: 2,
                      backgroundColor: "#F5F5F5",
                    }}
                    elevation={5}
                  >
                    <Box className={styles.tableHead}>
                      <Box className={styles.feildHead}></Box>
                    </Box>
                    <Box sx={{ backgroundColor: "white" }}>
                      <h3 style={{ paddingLeft: 10 }}>
                        {" "}
                        {btnSaveTextPtax == "Update"
                          ? "Update Property Details"
                          : "Add Property Details"}
                      </h3>
                    </Box>
                    <br />
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={6} className={styles.feildres}>
                        <TextField
                          disabled={disabledInputStatePtax}
                          sx={{
                            width: "100%",
                          }}
                          id="standard-basic"
                          label="Property No."
                          variant="standard"
                          {...register("propertyNo")}
                          onChange={(event) => {
                            if (floorHeight !== "") {
                              setFloorHeight("");
                            }
                          }}
                          helperText={
                            <p className={styles.error}>{floorHeight}</p>
                          }
                        />
                      </Grid>
                    </Grid>
                    <br />
                    <br />

                    <div></div>

                    <Grid container className={styles.feildres} spacing={2}>
                      <Grid item>
                        {!viewButtonInputStatePtax && (
                          <Button
                            // disabled={disabledInputStatePropertyNo}
                            disabled={disabledPropertyNumButton}
                            size="small"
                            variant="outlined"
                            className={styles.button}
                            endIcon={<SaveIcon />}
                            onClick={() => {
                              handleClickPropertyNo();

                              // savePropertyDetails();
                              // setIsOpenCollapsePtax();
                            }}
                          >
                            {btnSaveTextPtax == "Update" ? (
                              <FormattedLabel id="update" />
                            ) : (
                              <FormattedLabel id="save" />
                            )}
                          </Button>
                        )}
                      </Grid>

                      <Grid item>
                        <Button
                          size="small"
                          variant="outlined"
                          className={styles.button}
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitFunctionPtax()}
                        >
                          {<FormattedLabel id="exit" />}
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
              </div>
            </Slide>
          )}

          {/** PropertyDetailsTable */}
          {propertyDetailsTableData?.length !== 0 && (
            <Box>
              <DataGrid
                getRowId={(row) => row.srNo}
                disableColumnFilter
                disableColumnSelector
                disableExport
                // componentsProps={{
                //   toolbar: {
                //     showQuickFilter: true,
                //     quickFilterProps: { debounceMs: 500 },
                //     printOptions: { disableToolbarButton: true },
                //     csvOptions: { disableToolbarButton: true },
                //   },
                // }}
                // components={{ Toolbar: GridToolbar }}
                autoHeight
                density="compact"
                sx={{
                  backgroundColor: "white",
                  width: "100%",
                  boxShadow: 2,
                  // border: 1,
                  // borderColor: "primary.light",
                  "& .MuiDataGrid-cell:hover": {},
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "#E1FDFF",
                  },
                  "& .MuiDataGrid-columnHeadersInner": {
                    backgroundColor: "#92bdeee8",
                  },
                }}
                rows={
                  propertyDetailsTableData == null ||
                  propertyDetailsTableData == undefined
                    ? []
                    : propertyDetailsTableData
                }
                columns={propertyDetailsTableColumn}
                pageSize={7}
                rowsPerPageOptions={[7]}
              />
            </Box>
          )}
        </div>
      </Grid>

      {/** WaterTankDetails */}
      <Grid item xs={4} sx={{ margin: "3%" }}>
        <FormControl component="fieldset" sx={{ marginTop: "1%" }}>
          <FormLabel component="legend">
            <FormattedLabel id="isPlanhaveUnderGroundWaterTank" />
          </FormLabel>
          <Controller
            name="formDTLDao.isPlanhaveUnderGroundWaterTank"
            control={control}
            render={({ field }) => (
              <RadioGroup
                // disabled={watch("disabledFieldInputState")}
                value={field.value}
                onChange={(value) => field.onChange(value)}
                selected={field.value}
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
              >
                <FormControlLabel
                  // error={!!errors?.oldLicenseYN}
                  // disabled={watch("disabledFieldInputState")}
                  value="Y"
                  control={<Radio size="small" />}
                  label="Yes"
                />
                <FormControlLabel
                  // error={!!errors?.oldLicenseYN}
                  // disabled={watch("disabledFieldInputState")}
                  value="N"
                  control={<Radio size="small" />}
                  label="No"
                />
              </RadioGroup>
            )}
          />
          <FormHelperText
            error={!!errors?.formDTLDao?.isPlanhaveUnderGroundWaterTank}
          >
            {errors?.formDTLDao?.isPlanhaveUnderGroundWaterTank
              ? errors?.formDTLDao?.isPlanhaveUnderGroundWaterTank?.message
              : null}
          </FormHelperText>
        </FormControl>
        {console.log(
          "checkWaterTank",
          watch("formDTLDao.isPlanhaveUnderGroundWaterTank")
        )}
        {watch("formDTLDao.isPlanhaveUnderGroundWaterTank") === "Y" && (
          <>
            <div>
              <br />
              <br />
              <Box style={{ display: "flex", marginTop: "1%" }}>
                <Box className={styles.subtableHead}>
                  <Box className={styles.subh1Tag}>Tank Details</Box>
                </Box>
                <br />

                {!view && (
                  <Box>
                    <Button
                      variant="contained"
                      type="primary"
                      disabled={buttonInputStateWaterTank}
                      onClick={() => {
                        // editButtonState
                        setEditButtonInputStateWaterTank(true);
                        // deleteButtonState
                        setDeleteButtonStateWaterTank(true);
                        // addButtonState
                        setButtonInputStateWaterTank(true);
                        // visibilityIcon
                        setVisibilityIconStateWaterTank(true);
                        // save/updateButtonText
                        setBtnSaveTextWaterTank("Save");
                        // conditionalRendering
                        setSlideCheckedWaterTank(true);
                        // collpaseOpen/Close
                        setIsOpenCollapseWaterTank(true);
                      }}
                      className={styles.subadbtn}
                      sx={{
                        borderRadius: 100,

                        padding: 2,
                        marginLeft: 1,
                        textAlign: "center",
                        border: "2px solid #3498DB",
                      }}
                    >
                      <AddIcon />
                    </Button>
                  </Box>
                )}
              </Box>
              {isOpenCollapseWaterTank && (
                <Slide
                  direction="down"
                  in={slideCheckedWaterTank}
                  mountOnEnter
                  unmountOnExit
                >
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Box
                      style={{
                        width: "100%",
                        margin: "3vh 0vh",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Paper
                        sx={{
                          // margin: 1,
                          padding: 2,
                          backgroundColor: "#F5F5F5",
                        }}
                        elevation={5}
                      >
                        <Box sx={{ backgroundColor: "white" }}>
                          <h2 style={{ marginLeft: 7 }}>
                            {" "}
                            {btnSaveTextWaterTank == "Update"
                              ? "Update Floor Details"
                              : "Add Tank Details"}
                          </h2>
                        </Box>
                        <br />
                        <Grid
                          container
                          columns={{ xs: 4, sm: 8, md: 12 }}
                          className={styles.feildres}
                        >
                          {/* Tank location  */}
                          <Grid item xs={4} className={styles.feildres}>
                            <FormControl
                              variant="standard"
                              sx={{ width: "80%" }}
                              error={!!errors.tankLocation}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                <FormattedLabel id="tankLocation" />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    value={field.value}
                                    onChange={(value) => {
                                      field.onChange(value);
                                      if (tankLocation !== "") {
                                        setTankLocation("");
                                      }
                                    }}
                                    label="List"
                                    error={!!errors.tankLocation}
                                    helperText={
                                      errors?.tankLocation
                                        ? errors.tankLocation.message
                                        : null
                                    }
                                  >
                                    {tankLocations.map((menu, index) => {
                                      return (
                                        <MenuItem key={index} value={menu.id}>
                                          {language == "en"
                                            ? menu.tankLocation
                                            : menu.tankLocationMr}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                )}
                                name="tankLocation"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText>
                                {<p className={styles.error}>{tankLocation}</p>}
                              </FormHelperText>
                            </FormControl>
                          </Grid>

                          {/* tank Type  */}
                          <Grid item xs={4} className={styles.feildres}>
                            <FormControl
                              variant="standard"
                              sx={{ width: "80%" }}
                              error={!!errors.tankType}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                <FormattedLabel id="tankType" />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    value={field.value}
                                    onChange={(value) => {
                                      field.onChange(value);
                                      if (tankType !== "") {
                                        setTankType("");
                                      }
                                    }}
                                    label="List"
                                    error={!!errors.tankType}
                                    helperText={
                                      errors?.tankType
                                        ? errors.tankType.message
                                        : null
                                    }
                                  >
                                    {tankTypes.map((menu, index) => {
                                      return (
                                        <MenuItem key={index} value={menu.id}>
                                          {language == "en"
                                            ? menu.tankType
                                            : menu.tankTypeMr}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                )}
                                name="tankType"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText>
                                {<p className={styles.error}>{tankType}</p>}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              disabled={disabledInputStateWaterTank}
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              // label="L"
                              label={<FormattedLabel id="length" />}
                              variant="standard"
                              {...register("length")}
                              // error={!!errors.volumeLBHIn}
                              // helperText={
                              //   errors?.volumeLBHIn
                              //     ? errors.volumeLBHIn.message
                              //     : null
                              // }
                              onChange={(event) => {
                                if (length !== "") {
                                  setLength("");
                                }
                              }}
                              helperText={
                                <p className={styles.error}>{length}</p>
                              }
                            />
                          </Grid>

                          <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              disabled={disabledInputStateWaterTank}
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              // label="B"
                              label={<FormattedLabel id="breadth" />}
                              variant="standard"
                              {...register("breadth")}
                              onChange={(event) => {
                                if (breadth !== "") {
                                  setBreadth("");
                                }
                              }}
                              helperText={
                                <p className={styles.error}>{breadth}</p>
                              }
                            />
                          </Grid>
                          <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              disabled={disabledInputStateWaterTank}
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              label="height"
                              variant="standard"
                              {...register("height")}
                              onChange={(event) => {
                                if (height !== "") {
                                  setHeight("");
                                }
                              }}
                              helperText={
                                <p className={styles.error}>{height}</p>
                              }
                            />
                          </Grid>
                          <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              disabled={disabledInputStateWaterTank}
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              label="Capacity"
                              variant="standard"
                              {...register("capacity")}
                              onChange={(event) => {
                                // handleCapacity(
                                //   watch("tankLocation"),
                                //   event.target.value
                                // );
                                if (capacity !== "") {
                                  setCapacity("");
                                }
                              }}
                              helperText={
                                <p className={styles.error}>{capacity}</p>
                              }
                            />
                          </Grid>
                          <Grid item xs={4} className={styles.feildres}></Grid>
                          <Grid item xs={4} className={styles.feildres}></Grid>
                        </Grid>
                        <br />
                        <br />
                        <div></div>
                        <Grid container className={styles.feildres} spacing={2}>
                          {console.log(
                            "76543",
                            watch("formDTLDao.isPlanhaveUnderGroundWaterTank")
                          )}
                          {!viewButtonInputStateWaterTank && (
                            <Grid item>
                              <Button
                                disabled={disabledTankDetailsButton}
                                size="small"
                                variant="outlined"
                                className={styles.button}
                                endIcon={<SaveIcon />}
                                onClick={() => {
                                  handleClickForWaterTank();
                                }}
                              >
                                {btnSaveTextWaterTank == "Update" ? (
                                  <FormattedLabel id="update" />
                                ) : (
                                  <FormattedLabel id="save" />
                                )}
                              </Button>
                            </Grid>
                          )}

                          <Grid item>
                            <Button
                              size="small"
                              variant="outlined"
                              className={styles.button}
                              endIcon={<ExitToAppIcon />}
                              onClick={() => exitFunctionWaterTax()}
                            >
                              {<FormattedLabel id="exit" />}
                            </Button>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Box>
                  </div>
                </Slide>
              )}
              {/** TankDetailsTable */}
              {waterTankDetailsTableData?.length !== 0 && (
                <Box>
                  <DataGrid
                    getRowId={(row) => row.srNo}
                    disableColumnFilter
                    disableColumnSelector
                    disableExport
                    // componentsProps={{
                    //   toolbar: {
                    //     showQuickFilter: true,
                    //     quickFilterProps: { debounceMs: 500 },
                    //     printOptions: { disableToolbarButton: true },
                    //     csvOptions: { disableToolbarButton: true },
                    //   },
                    // }}
                    // components={{ Toolbar: GridToolbar }}
                    autoHeight
                    density="compact"
                    sx={{
                      width: "100%",
                      backgroundColor: "white",
                      boxShadow: 2,
                      // border: 1,
                      // borderColor: "primary.light",
                      "& .MuiDataGrid-cell:hover": {},
                      "& .MuiDataGrid-row:hover": {
                        backgroundColor: "#E1FDFF",
                      },
                      "& .MuiDataGrid-columnHeadersInner": {
                        backgroundColor: "#92bdeee8",
                      },
                    }}
                    rows={
                      waterTankDetailsTableData == null ||
                      waterTankDetailsTableData == undefined
                        ? []
                        : waterTankDetailsTableData
                    }
                    columns={tankDetailsTableColumn}
                    pageSize={7}
                    rowsPerPageOptions={[7]}
                  />
                </Box>
              )}
            </div>
            <br />
            <br />
            <Grid container className={styles.feildres} spacing={2}>
              {/* Total overhead Capacity  */}
              <Grid item xs={4} className={styles.feildres}>
                <TextField
                  // disabled
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ width: "80%" }}
                  id="standard-basic"
                  // label="Site Address"
                  label={<FormattedLabel id="totalOverheadCapacity" />}
                  variant="standard"
                  {...register("formDTLDao.totalOverheadCap")}
                  error={!!errors?.formDTLDao?.totalOverheadCap}
                  helperText={
                    errors?.formDTLDao?.totalOverheadCap
                      ? errors?.formDTLDao?.totalOverheadCap.message
                      : null
                  }
                />
              </Grid>

              {/* Total Underound capacity  */}
              <Grid item xs={4} className={styles.feildres}>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  // disabled
                  sx={{ width: "80%" }}
                  id="standard-basic"
                  // label="Site Address"
                  label={<FormattedLabel id="totalUndergroundCapacity" />}
                  variant="standard"
                  {...register("formDTLDao.totalUndergroundCap")}
                  error={!!errors?.formDTLDao?.totalUndergroundCap}
                  helperText={
                    errors?.formDTLDao?.totalUndergroundCap
                      ? errors?.formDTLDao?.totalUndergroundCap.message
                      : null
                  }
                />
              </Grid>
              <Grid item xs={4} className={styles.feildres}></Grid>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

export default FormsDetails;
