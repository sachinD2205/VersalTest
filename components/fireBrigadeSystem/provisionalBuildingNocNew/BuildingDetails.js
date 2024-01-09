import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { Button, Paper, Slide, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useFormContext } from "react-hook-form";
// import BasicLayout from "../../../../containers/Layout/BasicLayout";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { GridToolbar } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../styles/fireBrigadeSystem/view.module.css";
import urls from "../../../URLS/urls";
import { SignalCellularNull, Visibility } from "@mui/icons-material";
import swal from "sweetalert";
import { useSelector } from "react-redux";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";

/** Sachin Durge */
/** ANWAR A. ANSARI */

const Index = ({ view = false }) => {
  const router = useRouter();
  const {
    control,
    register,
    getValues,
    setValue,
    watch,
    reset,
    resetValue,
    formState: { errors },
  } = useFormContext();
  const userToken = useGetToken();

  const [floorHeight, setFloorHeight] = useState("");
  const [isFirestairCaseGiven, setIsFirestairCaseGiven] = useState(false);
  const [isFireLiftGiven, setIsFireLiftGiven] = useState(false);
  const [isBasementexits, setIsBasementexits] = useState(false);
  const [isPodiumRampExits, setIsPodiumRampExits] = useState(false);
  const [noOfVentilation, setNoOfVentilation] = useState("");
  const [grossBuiltUpArea, setGrossBuiltUpArea] = useState("");
  const [netBuiltUpArea, setNetBuiltUpArea] = useState("");
  const [occupancyTypes, setOccupancyTypes] = useState("");
  const [buildingClassification, setBuildingClassification] = useState("");
  const [noOfRefArea, setNoOfRefArea] = useState("");
  const [refusedAreaInSqMtr, setRefusedAreaInSqMtr] = useState("");
  const [plotAreaSquareMeter, setPlotAreaSquareMeter] = useState("");
  const [constructionAreSqMeter, setConstructionAreSqMeter] = useState("");
  const [noOfApprochedRoad, setNoOfApprochedRoad] = useState("");
  //buildingValidation useState
  const [buildingName, setBuildingName] = useState("");
  const [types, setTypes] = useState([]);

  const [
    buildingHeightFromGroundFloorInMeter,
    setBuildingHeightFromGroundFloorInMeter,
  ] = useState("");
  const [noOfBasement, setNoOfBasement] = useState("");
  const [volumeLBHIn, setVolumeLBHIn] = useState("");
  const [noOfFloor, setNoOfFloor] = useState("");
  const [buildingHeightH1, setBuildingHeightH1] = useState("");
  const [buildingHeightH2, setBuildingHeightH2] = useState("");
  const [typeOfBuilding, setTypeOfBuilding] = useState("");
  const [buildingIsSpecial, setBuildingIsSpecial] = useState("");
  const [front, setFront] = useState("");
  const [rear, setRear] = useState("");
  const [leftSide, setLeftSide] = useState("");
  const [rightSide, setRightSide] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  //////////////////////////

  const [plinthHeightInMeter, setPlinthHeightInMeter] = useState("");
  const [l, setL] = useState("");
  const [b, setB] = useState("");

  const [buildingHeightUptoParafeet, setBuildingHeightUptoParafeet] =
    useState("");
  const [buildingHeightUptoTeres, setBuildingHeightUptoTeres] = useState("");

  //////////////////////////////////

  const [parafeetWallHeight, setParafeetWallHeight] = useState("");
  const [btnSaveText, setBtnSaveText] = useState("Save");

  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);

  const [viewButtonInputState, setViewButtonInputState] = useState(false);
  const [viewButtonInputStateB, setViewButtonInputStateB] = useState(false);
  const [buildingTypes, setBuildingTypes] = useState([]);
  const [roadWidth, setRoadWidth] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [buildingDataSource, setBuildingDataSource] = useState([]);
  const [floorDataSource, setFloorDataSource] = useState([]);

  const [isOpenCollapses, setIsOpenCollapses] = useState(false);
  const [buttonInputState, setButtonInputState] = useState();
  const [selectedBuildingIndex, setSelectedBuildingIndex] = useState(0);
  const [selectedFloorIndex, setSelectedFloorIndex] = useState(0);
  const [area, setArea] = useState();

  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [buttonInputStates, setButtonInputStates] = useState();
  const [slideCheckedF, setSlideCheckedF] = useState(false);

  const [isOpenCollapsesType, setIsOpenCollapsesType] = useState(false);
  const [buttonInputStatesType, setButtonInputStatesType] = useState();
  const [slideCheckedType, setSlideCheckedType] = useState(false);

  const language = useSelector((state) => state.labels.language);

  // getBuildingTypes
  const getBuildingTypes = () => {
    axios
      .get(`${urls.FbsURL}/typeOfBuildingMaster/getTypeOfBuildingMaster`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setBuildingTypes(res?.data);
      })
      .catch((err) => console.log(err));
  };

  // gettypes
  const getTypes = () => {
    axios
      .get(`${urls.FbsURL}/usageTypeMaster/getUsageTypeMasterData`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        console.log("11Types", r?.data);
        setTypes(
          r.data.map((row) => ({
            id: row.id,
            nameOfUsage: row.nameOfUsage,
            nameOfUsageMr: row.nameOfUsageMr,
            ...r,
          }))
        );
      });
  };

  const handleCheckboxChange = (event) => {
    setIsFirestairCaseGiven(event.target.checked ? true : false);
    if (event.target.checked == false) {
      setValue("noOfFireStairCase", "");
      setValue("widthOfFireStairCase", "");
    }
  };
  const handleCheckboxChangeLift = (event) => {
    setIsFireLiftGiven(event.target.checked ? true : false);
    if (event.target.checked == false) {
      setValue("noOfFireLift", "");
      setValue("capacityOfFireLift", "");
    }
  };

  const handleCheckboxChangeBasement = (event) => {
    setIsBasementexits(event.target.checked ? true : false);
    if (event.target.checked == false) {
      setValue("noOfBasement", "");
      setValue("distanceFromBuildingToOpenSpace", "");
    }
  };

  const handleCheckboxChangeRamp = (event) => {
    setIsPodiumRampExits(event.target.checked ? true : false);
    if (event.target.checked == false) {
      setValue("noOfPodiumRamp", "");
      setValue("podiumRampWidth", "");
    }
  };

  // area
  const getArea = () => {
    axios
      .get(`${urls.CFCURL}/master/area/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => setArea(res?.data?.area))
      .catch((err) => console.log(err));
  };

  // saveBuildingDetails
  const saveBuildingDetails = () => {
    const buildingDTLDao = {
      buildingName: getValues("buildingName"),
      typeOfBuilding: +getValues("typeOfBuilding"),
      buildingIsSpecial: getValues("buildingIsSpecial"),
      front: +getValues("front"),
      rear: +getValues("rear"),
      leftSide: +getValues("leftSide"),
      rightSide: +getValues("rightSide"),
      parafeetWallHeight: +getValues("parafeetWallHeight"),
      noOfBasement: +getValues("noOfBasement"),
      noOfFloor: +getValues("noOfFloor"),
      plinthHeightInMeter: +getValues("plinthHeightInMeter"),
      plotAreaSquareMeter: +getValues("plotAreaSquareMeter"),
      constructionAreSqMeter: +getValues("constructionAreSqMeter"),
      noOfApprochedRoad: +getValues("noOfApprochedRoad"),
      l: +getValues("l"),
      b: +getValues("b"),
      buildingHeightH1: +getValues("buildingHeightH1"),
      buildingHeightH2: +getValues("buildingHeightH2"),
      buildingHeightFromGroundFloorInMeter: +getValues(
        "buildingHeightFromGroundFloorInMeter"
      ),
      buildingHeightUptoParafeet: +getValues("buildingHeightUptoParafeet"),
      buildingHeightUptoTeres: +getValues("buildingHeightUptoTeres"),

      // RADIO BUTTON CHECKED START
      isBasementexits: isBasementexits,
      isFireLiftGiven: isFireLiftGiven,
      isFirestairCaseGiven: isFirestairCaseGiven,
      isPodiumRampExist: isPodiumRampExits,
      // RADIO BUTTON CHECKED END

      noOfFireStairCase: +getValues("noOfFireStairCase"),
      widthOfFireStairCase: +getValues("widthOfFireStairCase"),
      ////////////////////////////////////////////
      noOfFireLift: +getValues("noOfFireLift"),
      capacityOfFireLift: +getValues("capacityOfFireLift"),
      ////////////////////////////////////////////
      noOfBasement: +getValues("noOfBasement"),
      distanceFromBuildingToOpenSpace: +getValues(
        "distanceFromBuildingToOpenSpace"
      ),
      ///////////////////////////////////////////
      noOfPodiumRamp: +getValues("noOfPodiumRamp"),
      podiumRampWidth: +getValues("podiumRampWidth"),

      floorDTLDao: watch("FinalFloorDetailsTable"),
    };

    const updateBuldingDTLDao =
      watch("buildingDTLDao") != undefined &&
      watch("buildingDTLDao") != null &&
      watch("buildingDTLDao").length != 0
        ? [...watch("buildingDTLDao")]
        : [buildingDTLDao];
    setValue("buildingDTLDao", updateBuldingDTLDao);

    console.log("bodyOfBuilding", watch());
    const body = {
      ...watch(),
    };

    axios
      .post(
        `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/save`,
        body,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          console.log("2323", res);
          let appId = res?.data?.status?.split("$")[1];
          console.log("provisionalBuildingNocId", appId);

          setValue(
            "provisionalBuildingNocId",
            res?.data?.status?.split("$")[1]
          );
          sweetAlert("Saved", "Building Details saved!", "success");
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
          errorCleared();
        }
      });
  };

  // saveBuildingDetails
  const saveFloorDetails = () => {
    const floorDTLDao = [
      ...(getValues("floorDTLDao") ? getValues("floorDTLDao") : []),
      {
        floorHeight: getValues("floorHeight"),
        noOfVentilation: getValues("noOfVentilation"),
        grossBuiltUpArea: getValues("grossBuiltUpArea"),
        netBuiltUpArea: getValues("netBuiltUpArea"),
        occupancyTypes: getValues("occupancyTypes"),
        buildingClassification: getValues("buildingClassification"),
        noOfRefArea: getValues("noOfRefArea"),
        refusedAreaInSqMtr: getValues("refusedAreaInSqMtr"),
      },
    ];

    const body = {
      ...getValues(),
      floorDTLDao,
      id: getValues("provisionalBuildingNocId"),
    };

    axios
      .post(
        `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/save`,
        body,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          console.log("2323", res);
          let appId = res?.data?.status?.split("$")[1];
          console.log("provisionalBuildingNocId", appId);
          setValue(
            "provisionalBuildingNocId",
            res?.data?.status?.split("$")[1]
          );
          setValue("provisionalBuildingNocId", appId);
          sweetAlert("Saved!", "Record Saved successfully !", "success");

          setButtonInputStates(false);
          setIsOpenCollapses(false);
        }
      });
  };

  const handleClickForFloor = () => {
    const floorHeight = watch("floorHeight");
    const noOfVentilation = watch("noOfVentilation");
    const grossBuiltUpArea = watch("grossBuiltUpArea");
    const netBuiltUpArea = watch("netBuiltUpArea");
    const occupancyTypes = watch("occupancyTypes");
    const buildingClassification = watch("buildingClassification");
    const noOfRefArea = watch("noOfRefArea");
    const refusedAreaInSqMtr = watch("refusedAreaInSqMtr");

    if (floorHeight === "") {
      setFloorHeight("Please enter floorHeight");
    }
    if (noOfVentilation === "") {
      setNoOfVentilation("Please enter no Of Ventilation");
    }
    if (grossBuiltUpArea === "") {
      setGrossBuiltUpArea("Please enter grossBuilt Up Area");
    }
    if (netBuiltUpArea === "") {
      setNetBuiltUpArea("Please enter netBuiltUp Area");
    }
    if (occupancyTypes === "") {
      setOccupancyTypes("Please enter occupancy Types");
    }
    if (buildingClassification === "") {
      setBuildingClassification("Please enter building Classification ");
    }
    if (noOfRefArea === "") {
      setNoOfRefArea("Please enter no OfRef Area");
    }
    if (refusedAreaInSqMtr === "") {
      setRefusedAreaInSqMtr("Please enter refused Area InSqMtr");
    } else {
      handleFloorAddOrEdit();
    }
  };

  //BuildingValidation

  const handleClickForBuilding = () => {
    setFirstRender(false);
    if (watch("buildingName") == "") {
      setBuildingName("Please enter floorHeight");
    } else if (watch("buildingName") !== "") {
      setBuildingName("");
    }

    if (watch("buildingHeightFromGroundFloorInMeter") == "") {
      setBuildingHeightFromGroundFloorInMeter(
        "Please enter building height from ground floor"
      );
    } else if (watch("buildingHeightFromGroundFloorInMeter") !== "") {
      setBuildingHeightFromGroundFloorInMeter("");
    }

    if (watch("volumeLBHIn") == "") {
      setVolumeLBHIn("Please enter netBuiltUp area");
    } else if (watch("volumeLBHIn") !== "") {
      setVolumeLBHIn("");
    }

    if (watch("noOfFloor") == "") {
      setNoOfFloor("Please enter no of floor");
    } else if (watch("noOfFloor") !== "") {
      setNoOfFloor("");
    }

    if (watch("buildingHeightH1") == "") {
      setBuildingHeightH1("Please enter building height");
    } else if (watch("buildingHeightH1") !== "") {
      setBuildingHeightH1("");
    }

    if (watch("buildingHeightH2") == "") {
      setBuildingHeightH2("Please enter building height");
    } else if (watch("buildingHeightH2") !== "") {
      setBuildingHeightH2("");
    }

    if (watch("buildingIsSpecial") == "") {
      setBuildingIsSpecial("Please select something");
    } else if (watch("buildingIsSpecial") !== "") {
      setBuildingIsSpecial("");
    }

    if (watch("front") == "") {
      setFront("Please enter margin");
    } else if (watch("front") !== "") {
      setFront("");
    }

    if (watch("rear") == "") {
      setRear("Please enter margin");
    } else if (watch("rear") !== "") {
      setRear("");
    }

    if (watch("leftSide") == "") {
      setLeftSide("Please enter margin");
    } else if (watch("leftSide") !== "") {
      setLeftSide("");
    }

    if (watch("rightSide") == "") {
      setRightSide("Please enter margin");
    } else if (watch("rightSide") !== "") {
      setRightSide("");
    }

    if (watch("parafeetWallHeight") == "") {
      setParafeetWallHeight("Please enter parafeet Wall Height");
    } else if (watch("parafeetWallHeight") !== "") {
      setParafeetWallHeight("");
    }

    if (watch("typeOfBuilding") == "") {
      setTypeOfBuilding("Please select something");
    } else if (watch("typeOfBuilding") !== "") {
      setTypeOfBuilding("");
    }

    if (watch("plinthHeightInMeter") == "") {
      setPlinthHeightInMeter("Please enter plinth height in meter");
    } else if (watch("plinthHeightInMeter") !== "") {
      setPlinthHeightInMeter("");
    }

    if (watch("buildingHeightUptoParafeet") == "") {
      setBuildingHeightUptoParafeet(
        "Please enter building Height Upto Parafeet"
      );
    } else if (watch("buildingHeightUptoParafeet") !== "") {
      setBuildingHeightUptoParafeet("");
    }

    if (watch("buildingHeightUptoTeres") == "") {
      setBuildingHeightUptoTeres("Please enter building Height Upto Teres");
    } else if (watch("buildingHeightUptoTeres") !== "") {
      setBuildingHeightUptoTeres("");
    }

    if (watch("l") == "") {
      setL("Please enter length");
    } else if (watch("l") !== "") {
      setL("");
    }

    if (watch("b") == "") {
      setB("Please enter breadth");
    } else if (watch("b") !== "") {
      setB("");
    }

    // Continue this pattern for all fields...
    if (
      watch("buildingName") !== "" &&
      watch("typeOfBuilding") !== "" &&
      watch("buildingIsSpecial") !== "" &&
      !/^\d+$/.test(watch("front")) !== "" &&
      !/^\d+$/.test(watch("rear")) !== "" &&
      !/^\d+$/.test(watch("leftSide")) !== "" &&
      !/^\d+$/.test(watch("rightSide")) !== "" &&
      !/^\d+$/.test(watch("parafeetWallHeight")) !== "" &&
      !/^\d+$/.test(watch("noOfFloor")) !== "" &&
      !/^\d+$/.test(watch("plinthHeightInMeter")) !== "" &&
      !/^\d+$/.test(watch("plotAreaSquareMeter")) !== "" &&
      !/^\d+$/.test(watch("constructionAreSqMeter")) !== "" &&
      /////////////////////
      !/^\d+$/.test(watch("l")) !== "" &&
      !/^\d+$/.test(watch("b")) !== "" &&
      !/^\d+$/.test(watch("buildingHeightH1")) !== "" &&
      !/^\d+$/.test(watch("buildingHeightH2")) !== "" &&
      !/^\d+$/.test(watch("buildingHeightFromGroundFloorInMeter")) !== "" &&
      !/^\d+$/.test(watch("buildingHeightUptoParafeet")) !== "" &&
      !/^\d+$/.test(watch("buildingHeightUptoTeres")) !== ""
    ) {
      saveBuildingDetails();
    }
  };

  // exitFunction
  const exitFunction = () => {
    errorCleared();
    clearingTheValuesOnEditView();
    setButtonInputState(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
    setSlideChecked(true);
  };

  // exitFunctionForFloor
  const exitFunctionForFloor = () => {
    setButtonInputStates(false);
    setIsOpenCollapses(false);
    setSlideCheckedF(true);
  };

  // exitFunctionForTypes
  const exitFunctionForTypes = () => {
    setButtonInputStatesType(false);
    setIsOpenCollapsesType(false);
    setSlideCheckedType(true);
  };

  // deleteById
  const deleteById = async (value) => {
    swal({
      title: "Delete ?",
      text: "Are you sure you want to delete this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `${urls.BaseURL}/typsetSelectedBuildingIndexeOfNOCMaster/discardTypeOfNOCMaster/${value}`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          .then((res) => {
            if (res.status == 226) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getData();
              setButtonInputState(false);
            } else {
              swal("Record is Safe");
            }
          });
      }
    });
  };

  const resetFloorFields = () => {
    setValue("floorHeight", "");
    setValue("noOfVentilation", "");
    setValue("grossBuiltUpArea", "");
    setValue("netBuiltUpArea", "");
    setValue("occupancyTypes", "");
    setValue("buildingClassification", "");
    setValue("noOfRefArea", "");
    setValue("refusedAreaInSqMtr", "");
    errorCleared();
  };

  const resetTypesFields = () => {
    setValue("nameOfUsage", null);
    setValue("grossBuildUpAreaO", "");
    setValue("netBuildUpAreaO", "");
  };

  // handleFloorAdd
  const handleFloorAdd = () => {
    // floorTempBody
    let floorTempBody = {
      floorHeight: watch("floorHeight"),
      noOfVentilation: watch("noOfVentilation"),
      grossBuiltUpArea: watch("grossBuiltUpArea"),
      netBuiltUpArea: watch("netBuiltUpArea"),
      occupancyTypes: watch("occupancyTypes"),
      buildingClassification: watch("buildingClassification"),
      noOfRefArea: watch("noOfRefArea"),
      refusedAreaInSqMtr: watch("refusedAreaInSqMtr"),
      floorWiseUsageTypeDao: watch("FinalTypeDetails"),
    };
    // conditionally
    if (
      watch("FinalFloorDetails") != null &&
      watch("FinalFloorDetails") != undefined &&
      watch("FinalFloorDetails").length != "0"
    ) {
      let adicheFloor = watch("FinalFloorDetails");
      setValue("FinalFloorDetails", [...adicheFloor, floorTempBody]);
    } else {
      setValue("FinalFloorDetails", [floorTempBody]);
    }
    setButtonInputStates(false);
    setIsOpenCollapses(false);
    setValue("FinalTypeDetailsTable", []);
    alert("aaaya");
    console.log("2209", watch("FinalFloorDetails"));
  };

  useEffect(() => {
    getTypes();
  }, []);

  useEffect(() => {
    let FinalFloorDetails = watch("FinalFloorDetails");

    let FinalFloorDetailsTable = FinalFloorDetails?.map((data, index) => {
      return {
        ...data,
        srNo: index + 1,
      };
    });
    resetFloorFields();
    // table
    setValue("FinalFloorDetailsTable", FinalFloorDetailsTable);
  }, [watch("FinalFloorDetails")]);

  useEffect(() => {
    console.log("FinalFloorDetailsTable", watch("FinalFloorDetailsTable"));
  }, [watch("FinalFloorDetailsTable")]);

  const handleTypesAdd = () => {
    let typeTempBody = {
      occupancyType: watch("nameOfUsage"),
      grossBuiltUpArea: watch("grossBuildUpAreaO"),
      netBuiltUpArea: watch("netBuildUpAreaO"),
    };
    if (
      watch("FinalTypeDetails") != null &&
      watch("FinalTypeDetails") != undefined &&
      watch("FinalTypeDetails")?.length != "0"
    ) {
      let adicheType = watch("FinalTypeDetails");

      setValue("FinalTypeDetails", [...adicheType, typeTempBody]);
    } else {
      setValue("FinalTypeDetails", [typeTempBody]);
    }
    setButtonInputStatesType(false);
    setIsOpenCollapsesType(false);
    setSlideCheckedType(true);
  };

  useEffect(() => {
    let FinalTypeDetails = watch("FinalTypeDetails");
    console.log("FinalTypeDetails", FinalTypeDetails);
    let FinalTypeDetailsTable = FinalTypeDetails?.map((data, index) => {
      console.log("data123", data);
      return {
        ...data,
        srNo: index + 1,
        grossBuildUpAreaCol: data?.grossBuiltUpArea,
        netBuildUpAreaCol: data?.netBuiltUpArea,
        nameOfUsageCol: types.find((type) => type.id == data?.occupancyType)
          ?.nameOfUsage,
        nameOfUsageColMr: types.find((type) => type.id == data?.occupancyType)
          ?.nameOfUsageMr,
      };
    });
    resetTypesFields();
    // table
    setValue("FinalTypeDetailsTable", FinalTypeDetailsTable);
  }, [watch("FinalTypeDetails")]);

  useEffect(() => {
    console.log("FinalTypeDetailsTable", watch("FinalTypeDetailsTable"));
  }, [watch("FinalTypeDetailsTable")]);

  // handleTypeAdd End

  const handleFloorAddOrEdit = (_buildingIndex = 0) => {
    console.log("_buildingIndex", _buildingIndex);

    setValue("selectedBuilding", _buildingIndex);
    setSelectedBuildingIndex(getValues("buildingDTLDao")?.length);
    console.log("11", selectedBuildingIndex);
    setValue(
      "floorDTLDao",
      getValues("buildingDTLDao")?.[_buildingIndex]?.floorDTLDao
        ? getValues("buildingDTLDao")?.[_buildingIndex]?.floorDTLDao
        : []
    );
    setDataSource(
      getValues("buildingDTLDao")?.[_buildingIndex]?.floorDTLDao
        ? getValues("buildingDTLDao")?.[_buildingIndex]?.floorDTLDao
        : []
    );
  };

  useEffect(() => {
    console.log("shree22", watch("buildingDTLDao"));
    // getArea();
    // getBuildingTypes();
    if (getValues("floorDTLDao")?.length > 0) {
      setFloorDataSource(
        getValues("floorDTLDao")?.map((r, i) => {
          return { ...r, srNo: i + 1 };
        })
      );
      setSelectedFloorIndex(getValues("floorDTLDao")?.length);
    }
  }, [watch("floorDTLDao")]);

  useEffect(() => {
    console.log("shree", watch("floorDTLDao"));
    getArea();
    getBuildingTypes();
    if (getValues("buildingDTLDao")?.length > 0) {
      setBuildingDataSource(
        getValues("buildingDTLDao")?.map((r, i) => {
          return { ...r, srNo: i + 1 };
        })
      );
      setSelectedBuildingIndex(getValues("buildingDTLDao")?.length);
    }
  }, [watch("buildingDTLDao")]);

  const resetFloorTableValues = (x) => {
    setValue("floorHeight", x?.floorHeight);
    setValue("noOfVentilation", x?.noOfVentilation);
    setValue("grossBuiltUpArea", x?.grossBuiltUpArea);
    setValue("netBuiltUpArea", x?.netBuiltUpArea);
    setValue("occupancyTypes", x?.occupancyTypes);
    setValue("buildingClassification", x?.buildingClassification);
    setValue("noOfRefArea", x?.noOfRefArea);
    setValue("refusedAreaInSqMtr", x?.refusedAreaInSqMtr);
  };

  // columnsF
  const columnsF = [
    {
      field: "srNo",
      headerName: "Sr No.",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "floorHeight",
      headerName: "Floor Height",
      flex: 1,
    },
    {
      field: "netBuiltUpArea",
      headerName: "Net BuiltUp Area",
      flex: 1,
    },
    {
      field: "grossBuiltUpArea",
      headerName: "Gross BuiltUp Area",
      flex: 1,
    },

    {
      field: "noOfVentilation",
      headerName: "No. Of Ventilation",
      flex: 1,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 0.8,
      align: "center",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        console.log(":floorDetailsParams1", params.row);
        return (
          <>
            <IconButton
              className={styles.view}
              // disabled={viewButtonInputState}
              onClick={() => {
                setID(params.row.id),
                  setIsOpenCollapse(true),
                  setIsOpenCollapses(true),
                  resetFloorTableValues(params.row);
                setSlideChecked(true);
                setButtonInputState(true);
                setViewButtonInputState(true);
                setDeleteButtonState(true);
              }}
            >
              <Visibility />
            </IconButton>
            {!view && (
              <IconButton
                className={styles.edit}
                // disabled={editButtonInputState}
                onClick={() => {
                  setBtnSaveText("Update"),
                    setID(params.row.id),
                    setIsOpenCollapse(true),
                    setIsOpenCollapses(true),
                    resetFloorTableValues(params.row);
                  setSlideChecked(true);
                  setButtonInputState(true);
                  setEditButtonInputState(true);
                  setDeleteButtonState(true);
                }}
              >
                <EditIcon />
              </IconButton>
            )}
            {!view && (
              <IconButton
                className={styles.delete}
                // disabled={deleteButtonInputState}
                onClick={() => deleteById(params.id)}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </>
        );
      },
    },
  ];

  // columnsT
  const columnsT = [
    {
      field: "srNo",
      headerName: "Sr No.",
      flex: 0.4,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language == "en" ? "nameOfUsageCol" : "nameOfUsageColMr",
      headerName: "Occupancy Type",
      flex: 1,
    },
    {
      field: "netBuildUpAreaCol",
      headerName: "Net Built Up Area",
      flex: 1,
    },
    {
      field: "grossBuildUpAreaCol",
      headerName: "Gross BuiltUp Area",
      flex: 1,
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        console.log("params", params.row);
        return (
          <>
            <IconButton
              // disabled={viewButtonInputState}
              onClick={() => {
                setIsOpenCollapse(false),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                setViewButtonInputState(true);
                setDeleteButtonState(true);
                // reset(params.row);
              }}
            >
              <Visibility />
            </IconButton>
            {!view && (
              <IconButton
                className={styles.edit}
                // disabled={editButtonInputState}
                onClick={() => {
                  setIsOpenCollapse(false),
                    setBtnSaveText("Update"),
                    setID(params.row.id),
                    setIsOpenCollapse(true),
                    setSlideChecked(true);
                  setButtonInputState(true);
                  setEditButtonInputState(true);
                  setDeleteButtonState(true);
                  // reset(params.row);
                }}
              >
                <EditIcon />
              </IconButton>
            )}
            {!view && (
              <IconButton
                className={styles.delete}
                // disabled={deleteButtonInputState}
                onClick={() => deleteById(params.id)}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </>
        );
      },
    },
  ];

  // FIELDS KEY OBJECTS
  const fieldMappings = {
    buildingName: "buildingName",
    typeOfBuilding: "typeOfBuilding",
    buildingIsSpecial: "buildingIsSpecial",
    front: "front",
    rear: "rear",
    leftSide: "leftSide",
    rightSide: "rightSide",
    parafeetWallHeight: "parafeetWallHeight",
    noOfBasement: "noOfBasement",
    noOfFloor: "noOfFloor",
    plinthHeightInMeter: "plinthHeightInMeter",
    plotAreaSquareMeter: "plotAreaSquareMeter",
    constructionAreSqMeter: "constructionAreSqMeter",
    noOfApprochedRoad: "noOfApprochedRoad",
    l: "l",
    b: "b",
    buildingHeightH1: "buildingHeightH1",
    buildingHeightH2: "buildingHeightH2",
    buildingHeightFromGroundFloorInMeter:
      "buildingHeightFromGroundFloorInMeter",
    buildingHeightUptoParafeet: "buildingHeightUptoParafeet",
    buildingHeightUptoTeres: "buildingHeightUptoTeres",
    noOfFireStairCase: "noOfFireStairCase",
    widthOfFireStairCase: "widthOfFireStairCase",
    noOfFireLift: "noOfFireLift",
    capacityOfFireLift: "capacityOfFireLift",
    distanceFromBuildingToOpenSpace: "distanceFromBuildingToOpenSpace",
    noOfPodiumRamp: "noOfPodiumRamp",
    podiumRampWidth: "podiumRampWidth",
  };

  const resettingTheValuesOnEditView = (props) => {
    setTimeout(() => {
      for (const key in fieldMappings) {
        if (props[key] !== undefined) {
          setValue(fieldMappings[key], props[key]);
        }
      }

      setIsFirestairCaseGiven(props.isFirestairCaseGiven);
      setIsFireLiftGiven(props.isFireLiftGiven);
      setIsBasementexits(props.isBasementexits);
      setIsPodiumRampExits(props.isPodiumRampExist);
    }, 100);
  };

  const clearingTheValuesOnEditView = () => {
    setTimeout(() => {
      for (const key in fieldMappings) {
        setValue(fieldMappings[key], "");
      }

      setIsFirestairCaseGiven(false);
      setIsFireLiftGiven(false);
      setIsBasementexits(false);
      setIsPodiumRampExits(false);
    }, 100);
  };

  const columns = [
    {
      field: "srNo",
      headerName: "Sr No.",
      flex: 0.3,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "buildingName",
      headerName: "Building Name",
      // headerName: <FormattedLabel id="nOCNameMr" />,
      flex: 1,
    },
    {
      field: "buildingHeightH1",
      headerName: "Building Height H1",
      // headerName: <FormattedLabel id="nOCNameMr" />,
      flex: 1,
    },
    {
      field: "buildingHeightH2",
      headerName: "Building Height H2",
      // headerName: <FormattedLabel id="nOCNameMr" />,
      flex: 1,
    },
    {
      field: "noOfFloor",
      headerName: "No. Of Floor",
      // headerName: <FormattedLabel id="nOCNameMr" />,
      flex: 1,
    },
    {
      field: "noOfBasement",
      headerName: "No. Of Basement",
      // headerName: <FormattedLabel id="nOCNameMr" />,
      flex: 1,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 0.7,
      align: "center",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        console.log("params:1", params.row);
        return (
          <>
            <IconButton
              disabled={viewButtonInputStateB}
              onClick={() => {
                resettingTheValuesOnEditView(params?.row);
                setIsOpenCollapse(false),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                setViewButtonInputStateB(true);
                setDeleteButtonState(true);
              }}
            >
              <Visibility />
            </IconButton>
            {!view && (
              <IconButton
                className={styles.edit}
                disabled={editButtonInputState}
                onClick={() => {
                  resettingTheValuesOnEditView(params?.row);
                  setIsOpenCollapse(false),
                    setBtnSaveText("Update"),
                    setID(params.row.id),
                    setIsOpenCollapse(true),
                    setSlideChecked(true);
                  setButtonInputState(true);
                  setEditButtonInputState(true);
                  setDeleteButtonState(true);
                  // reset(params.row);
                }}
              >
                <EditIcon />
              </IconButton>
            )}
            {!view && (
              <IconButton
                className={styles.delete}
                disabled={deleteButtonInputState}
                onClick={() => deleteById(params.id)}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </>
        );
      },
    },
  ];

  /////////

  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (!firstRender) {
      if (watch("buildingName") === "") {
        setBuildingName("Please enter floorHeight");
      } else if (watch("buildingName") !== "") {
        setBuildingName("");
      }

      if (watch("typeOfBuilding") == "") {
        setTypeOfBuilding("Please select something");
      } else if (watch("typeOfBuilding") !== "") {
        setTypeOfBuilding("");
      }

      if (watch("buildingIsSpecial") == "") {
        setBuildingIsSpecial("Please select something");
      } else if (watch("buildingIsSpecial") !== "") {
        setBuildingIsSpecial("");
      }

      if (watch("front") == "") {
        setFront("Please enter margin");
      } else if (!/^\d+$/.test(watch("front"))) {
        setFront("Margin always be a no");
      } else if (watch("front") !== "") {
        setFront("");
      }

      if (watch("rear") == "") {
        setRear("Please enter margin");
      } else if (!/^\d+$/.test(watch("front"))) {
        setRear("Margin always be a no");
      } else if (watch("rear") !== "") {
        setRear("");
      }

      if (watch("leftSide") == "") {
        setLeftSide("Please enter margin");
      } else if (!/^\d+$/.test(watch("front"))) {
        setLeftSide("Margin always be a no");
      } else if (watch("leftSide") !== "") {
        setLeftSide("");
      }

      if (watch("rightSide") == "") {
        setRightSide("Please enter margin");
      } else if (!/^\d+$/.test(watch("rightSide"))) {
        setRightSide("Margin always be a no");
      } else if (watch("rightSide") !== "") {
        setRightSide("");
      }

      if (watch("parafeetWallHeight") == "") {
        setParafeetWallHeight("Please enter parafeet Wall Height");
      } else if (!/^\d+$/.test(watch("parafeetWallHeight"))) {
        setParafeetWallHeight("Margin always be a no");
      } else if (watch("parafeetWallHeight") !== "") {
        setParafeetWallHeight("");
      }

      if (watch("noOfBasement") == "") {
        setNoOfBasement("Please enter no of basement");
      } else if (!/^\d+$/.test(watch("noOfBasement"))) {
        setNoOfBasement("No of basement always be a no");
      } else if (watch("noOfBasement") !== "") {
        setNoOfBasement("");
      }

      if (watch("noOfFloor") == "") {
        setNoOfFloor("Please enter occupancy Types");
      } else if (!/^\d+$/.test(watch("noOfBasement"))) {
        setNoOfBasement("No of basement always be a no");
      } else if (watch("noOfFloor") !== "") {
        setNoOfFloor("");
      }

      if (watch("noOfApprochedRoad") == "") {
        setNoOfApprochedRoad("Please enter no of approched road");
      } else if (!/^\d+$/.test(watch("noOfApprochedRoad"))) {
        setNoOfApprochedRoad("No of approched road always be a no");
      } else if (watch("noOfApprochedRoad") !== "") {
        setNoOfApprochedRoad("");
      }

      if (watch("plinthHeightInMeter") == "") {
        setPlinthHeightInMeter("Please enter plinth height in meter");
      } else if (!/^\d+$/.test(watch("plinthHeightInMeter"))) {
        setPlinthHeightInMeter("plinth height always be a no");
      } else if (watch("plinthHeightInMeter") !== "") {
        setPlinthHeightInMeter("");
      }

      if (watch("plotAreaSquareMeter") == "") {
        setPlotAreaSquareMeter("Please enter plot area square in meter");
      } else if (!/^\d+$/.test(watch("plotAreaSquareMeter"))) {
        setPlotAreaSquareMeter("No of basement always be a no");
      } else if (watch("plotAreaSquareMeter") !== "") {
        setPlotAreaSquareMeter("");
      }

      if (watch("constructionAreSqMeter") == "") {
        setConstructionAreSqMeter(
          "Please enter construction area square in meter"
        );
      } else if (!/^\d+$/.test(watch("constructionAreSqMeter"))) {
        setConstructionAreSqMeter("Construction area always be a no");
      } else if (watch("constructionAreSqMeter") !== "") {
        setConstructionAreSqMeter("");
      }

      if (watch("buildingHeightFromGroundFloorInMeter") == "") {
        setBuildingHeightFromGroundFloorInMeter(
          "Please enter no Of Ventilation"
        );
      } else if (!/^\d+$/.test(watch("buildingHeightFromGroundFloorInMeter"))) {
        setBuildingHeightFromGroundFloorInMeter(
          "buildingHeight always be a no"
        );
      } else if (watch("buildingHeightFromGroundFloorInMeter") !== "") {
        setBuildingHeightFromGroundFloorInMeter("");
      }

      if (watch("volumeLBHIn") == "") {
        setVolumeLBHIn("Please enter netBuiltUp Area");
      } else if (!/^\d+$/.test(watch("noOfBasement"))) {
        setVolumeLBHIn("NetBuiltUp Area always be a no");
      } else if (watch("volumeLBHIn") !== "") {
        setVolumeLBHIn("");
      }

      if (watch("buildingHeightH1") == "") {
        setBuildingHeightH1("Please enter building height");
      } else if (!/^\d+$/.test(watch("buildingHeightH1"))) {
        setBuildingHeightH1("building height always be a no");
      } else if (watch("buildingHeightH1") !== "") {
        setBuildingHeightH1("");
      }

      if (watch("buildingHeightH2") == "") {
        setBuildingHeightH2("Please enter building height");
      } else if (!/^\d+$/.test(watch("buildingHeightH2"))) {
        setBuildingHeightH2("building height always be a no");
      } else if (watch("buildingHeightH2") !== "") {
        setBuildingHeightH2("");
      }

      if (watch("buildingHeightUptoParafeet") == "") {
        setBuildingHeightUptoParafeet(
          "Please enter building Height Upto Parafeet"
        );
      } else if (!/^\d+$/.test(watch("buildingHeightUptoParafeet"))) {
        setBuildingHeightUptoParafeet(
          "Building height upto parafeet always be a no"
        );
      } else if (watch("buildingHeightUptoParafeet") !== "") {
        setBuildingHeightUptoParafeet("");
      }

      if (watch("buildingHeightUptoTeres") == "") {
        setBuildingHeightUptoTeres("Please enter building Height Upto Teres");
      } else if (!/^\d+$/.test(watch("noOfBasement"))) {
        setBuildingHeightUptoTeres("Building height upto teres always be a no");
      } else if (watch("buildingHeightUptoTeres") !== "") {
        setBuildingHeightUptoTeres("");
      }

      if (watch("l") == "") {
        setL("Please enter length");
      } else if (!/^\d+$/.test(watch("l"))) {
        setL("Length always be a no");
      } else if (watch("l") !== "") {
        setL("");
      }

      if (watch("b") == "") {
        setB("Please enter breadth");
      } else if (!/^\d+$/.test(watch("b"))) {
        setB("Breadth always be a no");
      } else if (watch("b") !== "") {
        setB("");
      }
    }
  }, [
    firstRender,
    watch("buildingName"),
    watch("typeOfBuilding"),
    watch("buildingIsSpecial"),
    watch("front"),
    watch("rear"),
    watch("leftSide"),
    watch("rightSide"),
    watch("parafeetWallHeight"),
    watch("noOfFloor"),
    watch("plinthHeightInMeter"),
    watch("plotAreaSquareMeter"),
    watch("constructionAreSqMeter"),
    /////////////////////
    watch("l"),
    watch("b"),
    watch("buildingHeightH1"),
    watch("buildingHeightH2"),
    watch("buildingHeightFromGroundFloorInMeter"),
    watch("buildingHeightUptoParafeet"),
    watch("buildingHeightUptoTeres"),
  ]);

  /////////////////////////////////////////////////////////
  const errorCleared = () => {
    setBuildingName("");
    setTypeOfBuilding("");
    setBuildingIsSpecial("");
    setFront("");
    setRear("");
    setLeftSide("");
    setRightSide("");
    setParafeetWallHeight("");
    setNoOfBasement("");
    setNoOfFloor("");
    setNoOfApprochedRoad("");
    setPlinthHeightInMeter("");
    setPlotAreaSquareMeter("");
    setConstructionAreSqMeter("");
    setBuildingHeightFromGroundFloorInMeter("");
    setVolumeLBHIn("");
    setBuildingHeightH1("");
    setBuildingHeightH2("");
    setBuildingHeightUptoParafeet("");
    setBuildingHeightUptoTeres("");
    setL("");
    setB("");
  };

  // view
  return (
    <>
      <Box>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <Grid>
              <FormProvider>
                <form>
                  <Box
                    style={{
                      margin: "2%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    {/* Building Fields */}
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                    >
                      {/* building name */}
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label="Building Name"
                          variant="standard"
                          {...register("buildingName")}
                          helperText={
                            <p className={styles.error}>{buildingName}</p>
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl variant="standard" sx={{ width: "80%" }}>
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="typeOfBuilding" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                                label="List"
                              >
                                {buildingTypes &&
                                  buildingTypes.map((type, index) => (
                                    <MenuItem key={index} value={type.id}>
                                      {type.typeOfBuilding}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="typeOfBuilding"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {<p className={styles.error}>{typeOfBuilding}</p>}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl sx={{ width: "80%" }}>
                          <InputLabel
                            variant="standard"
                            htmlFor="uncontrolled-native"
                          >
                            Building is Special or Not
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                                fullWidth
                                size="small"
                                variant="standard"
                              >
                                <MenuItem value={"Y"}>Yes</MenuItem>
                                <MenuItem value={"N"}>No</MenuItem>
                              </Select>
                            )}
                            name="buildingIsSpecial"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {
                              <p className={styles.error}>
                                {buildingIsSpecial}
                              </p>
                            }
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label="Margin(Front)"
                          variant="standard"
                          {...register("front")}
                          helperText={<p className={styles.error}>{front}</p>}
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label="Margin(Rear)"
                          variant="standard"
                          {...register("rear")}
                          helperText={<p className={styles.error}>{rear}</p>}
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label="Margin(Left Side)"
                          variant="standard"
                          {...register("leftSide")}
                          onChange={(event) => {
                            if (leftSide !== "") {
                              setLeftSide("");
                            }
                          }}
                          helperText={
                            <p className={styles.error}>{leftSide}</p>
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label="Margin(Right Side)"
                          variant="standard"
                          {...register("rightSide")}
                          helperText={
                            <p className={styles.error}>{rightSide}</p>
                          }
                        />
                      </Grid>

                      {/* parafeet wall height  */}

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="parafeetWallHeight" />}
                          variant="standard"
                          {...register("parafeetWallHeight")}
                          helperText={
                            <p className={styles.error}>{parafeetWallHeight}</p>
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="noOfBasement" />}
                          variant="standard"
                          {...register("noOfBasement")}
                          helperText={
                            <p className={styles.error}>{noOfBasement}</p>
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="totalBuildingFloor" />}
                          variant="standard"
                          {...register("noOfFloor")}
                          helperText={
                            <p className={styles.error}>{noOfFloor}</p>
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="plinthHeightInMeter" />}
                          variant="standard"
                          {...register("plinthHeightInMeter")}
                          helperText={
                            <p className={styles.error}>
                              {plinthHeightInMeter}
                            </p>
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="plotAreaSquareMeter" />}
                          variant="standard"
                          {...register("plotAreaSquareMeter")}
                          helperText={
                            <p className={styles.error}>
                              {plotAreaSquareMeter}
                            </p>
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="constructionAreSqMeter" />}
                          variant="standard"
                          {...register("constructionAreSqMeter")}
                          helperText={
                            <p className={styles.error}>
                              {constructionAreSqMeter}
                            </p>
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="noOfApprochedRoad" />}
                          variant="standard"
                          {...register("noOfApprochedRoad")}
                          helperText={
                            <p className={styles.error}>{noOfApprochedRoad}</p>
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="length" />}
                          variant="standard"
                          {...register("l")}
                          helperText={<p className={styles.error}>{l}</p>}
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="breadth" />}
                          variant="standard"
                          {...register("b")}
                          helperText={<p className={styles.error}>{b}</p>}
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          // label="h1"
                          label={<FormattedLabel id="buildingHeight" />}
                          variant="standard"
                          {...register("buildingHeightH1")}
                          helperText={
                            <p className={styles.error}>{buildingHeightH1}</p>
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          // label="h2"
                          label={<FormattedLabel id="lowerGroundHeight" />}
                          variant="standard"
                          {...register("buildingHeightH2")}
                          helperText={
                            <p className={styles.error}>{buildingHeightH2}</p>
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="totalBuildingHeight" />}
                          variant="standard"
                          {...register("buildingHeightFromGroundFloorInMeter")}
                          helperText={
                            <p className={styles.error}>
                              {buildingHeightFromGroundFloorInMeter}
                            </p>
                          }
                        />
                      </Grid>

                      {/* Building Height upto parafeet  */}
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          // label="parafeet wall height "
                          label={
                            <FormattedLabel id="buildingHeightUptoParafeet" />
                          }
                          variant="standard"
                          {...register("buildingHeightUptoParafeet")}
                          helperText={
                            <p className={styles.error}>
                              {buildingHeightUptoParafeet}
                            </p>
                          }
                        />
                      </Grid>

                      {/* Building Height upto teres */}
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          // label="parafeet wall height "
                          label={
                            <FormattedLabel id="buildingHeightUptoTeres" />
                          }
                          variant="standard"
                          {...register("buildingHeightUptoTeres")}
                          helperText={
                            <p className={styles.error}>
                              {buildingHeightUptoTeres}
                            </p>
                          }
                        />
                      </Grid>

                      {/* fire stair case */}
                      <Grid item xs={4} className={styles.feildres}>
                        <FormGroup>
                          <FormControlLabel
                            sx={{ marginRight: "10vw" }}
                            label={<FormattedLabel id="isFireStairCaseGiven" />}
                            control={
                              <Checkbox
                                checked={isFirestairCaseGiven}
                                onChange={handleCheckboxChange}
                              />
                            }
                          />
                        </FormGroup>
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={!isFirestairCaseGiven}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="noOfFireStairCase" />}
                          variant="standard"
                          {...register("noOfFireStairCase")}
                          InputLabelProps={{
                            shrink: watch("noOfFireStairCase") ? true : false,
                          }}
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={!isFirestairCaseGiven}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="widthOfFireStairCase" />}
                          variant="standard"
                          {...register("widthOfFireStairCase")}
                          InputLabelProps={{
                            shrink: watch("widthOfFireStairCase")
                              ? true
                              : false,
                          }}
                          helperText={
                            <p className={styles.error}>
                              {/* {widthOfFireStairCase} */}
                            </p>
                          }
                        />
                      </Grid>

                      {/* fire lift */}
                      <Grid item xs={4} className={styles.feildres}>
                        <FormGroup>
                          <FormControlLabel
                            sx={{ marginRight: "13.5vw" }}
                            label={<FormattedLabel id="isFireLiftGiven" />}
                            control={
                              <Checkbox
                                checked={isFireLiftGiven}
                                onChange={handleCheckboxChangeLift}
                              />
                            }
                          />
                        </FormGroup>
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          disabled={!isFireLiftGiven}
                          label={<FormattedLabel id="noOfFireLift" />}
                          variant="standard"
                          {...register("noOfFireLift")}
                          InputLabelProps={{
                            shrink: watch("noOfFireLift") ? true : false,
                          }}
                          // helperText={
                          //   <p className={styles.error}>{noOfFireLift}</p>
                          // }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          disabled={!isFireLiftGiven}
                          label={<FormattedLabel id="capacityOfFireLift" />}
                          variant="standard"
                          {...register("capacityOfFireLift")}
                          InputLabelProps={{
                            shrink: watch("capacityOfFireLift") ? true : false,
                          }}
                        />
                      </Grid>

                      {/* basement exists */}
                      <Grid item xs={4} className={styles.feildres}>
                        <FormGroup>
                          <FormControlLabel
                            sx={{ marginRight: "12vw" }}
                            label={<FormattedLabel id="isBasementExists" />}
                            control={
                              <Checkbox
                                checked={isBasementexits}
                                onChange={handleCheckboxChangeBasement}
                              />
                            }
                          />
                        </FormGroup>
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          disabled={!isBasementexits}
                          label={<FormattedLabel id="noOfBasement" />}
                          variant="standard"
                          {...register("noOfBasement")}
                          InputLabelProps={{
                            shrink: watch("noOfBasement") ? true : false,
                          }}
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={!isBasementexits}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label={
                            <FormattedLabel id="distanceFromBuildingToOpenSpace" />
                          }
                          variant="standard"
                          {...register("distanceFromBuildingToOpenSpace")}
                          InputLabelProps={{
                            shrink: watch("distanceFromBuildingToOpenSpace")
                              ? true
                              : false,
                          }}
                        />
                      </Grid>

                      {/* podium */}
                      <Grid item xs={4} className={styles.feildres}>
                        <FormGroup>
                          <FormControlLabel
                            sx={{ marginRight: "10vw" }}
                            label={<FormattedLabel id="isPodiumRampExists" />}
                            control={
                              <Checkbox
                                checked={isPodiumRampExits}
                                onChange={handleCheckboxChangeRamp}
                              />
                            }
                          />
                        </FormGroup>
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={!isPodiumRampExits}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          // label="parafeet wall height "
                          label={<FormattedLabel id="noOfPodiumRamp" />}
                          variant="standard"
                          {...register("noOfPodiumRamp")}
                          InputLabelProps={{
                            shrink: watch("noOfPodiumRamp") ? true : false,
                          }}
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={!isPodiumRampExits}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          // label="parafeet wall height "
                          label={<FormattedLabel id="podiumRampWidth" />}
                          variant="standard"
                          {...register("podiumRampWidth")}
                          InputLabelProps={{
                            shrink: watch("podiumRampWidth") ? true : false,
                          }}
                        />
                      </Grid>
                    </Grid>
                    {/* floor form */}
                    <Grid>
                      <Box>
                        {isOpenCollapses && (
                          <Slide
                            direction="down"
                            in={slideCheckedF}
                            mountOnEnter
                            unmountOnExit
                          >
                            <Grid>
                              <>
                                <form>
                                  <Box
                                    style={{
                                      margin: "4%",
                                      display: "flex",
                                      flexDirection: "column",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Paper
                                      sx={{
                                        margin: 1,
                                        padding: 2,
                                        backgroundColor: "#F5F5F5",
                                      }}
                                      elevation={5}
                                    >
                                      <Box sx={{ backgroundColor: "white" }}>
                                        <h2 style={{ paddingLeft: "10px" }}>
                                          {" "}
                                          Add Floor Details{" "}
                                        </h2>
                                      </Box>

                                      {/* <br /> */}

                                      <Grid
                                        container
                                        columns={{ xs: 4, sm: 8, md: 12 }}
                                        className={styles.feildres}
                                      >
                                        <Grid
                                          item
                                          xs={4}
                                          className={styles.feildres}
                                        >
                                          <TextField
                                            sx={{ width: "80%" }}
                                            id="standard-basic"
                                            label="floor Height"
                                            variant="standard"
                                            {...register("floorHeight")}
                                            onChange={(event) => {
                                              if (floorHeight !== "") {
                                                setFloorHeight("");
                                              }
                                            }}
                                            helperText={
                                              <p className={styles.error}>
                                                {floorHeight}
                                              </p>
                                            }
                                          />
                                        </Grid>

                                        <Grid
                                          item
                                          xs={4}
                                          className={styles.feildres}
                                        >
                                          <TextField
                                            sx={{ width: "80%" }}
                                            id="standard-basic"
                                            label="Gross Built Up Area"
                                            variant="standard"
                                            {...register("grossBuiltUpArea")}
                                            onChange={(event) => {
                                              if (grossBuiltUpArea !== "") {
                                                setGrossBuiltUpArea("");
                                              }
                                            }}
                                            helperText={
                                              <p className={styles.error}>
                                                {grossBuiltUpArea}
                                              </p>
                                            }
                                          />
                                        </Grid>

                                        <Grid
                                          item
                                          xs={4}
                                          className={styles.feildres}
                                        >
                                          <TextField
                                            // disabled
                                            sx={{ width: "80%" }}
                                            id="standard-basic"
                                            label="Net Build Up Area"
                                            variant="standard"
                                            {...register("netBuiltUpArea")}
                                            onChange={(event) => {
                                              if (netBuiltUpArea !== "") {
                                                setNetBuiltUpArea("");
                                              }
                                            }}
                                            helperText={
                                              <p className={styles.error}>
                                                {netBuiltUpArea}
                                              </p>
                                            }
                                          />
                                        </Grid>

                                        <Grid
                                          item
                                          xs={4}
                                          className={styles.feildres}
                                        >
                                          <TextField
                                            sx={{ width: "80%" }}
                                            id="standard-basic"
                                            label="No. Of Ventilation"
                                            variant="standard"
                                            {...register("noOfVentilation")}
                                            onChange={(event) => {
                                              if (noOfVentilation !== "") {
                                                setNoOfVentilation("");
                                              }
                                            }}
                                            helperText={
                                              <p className={styles.error}>
                                                {noOfVentilation}
                                              </p>
                                            }
                                          />
                                        </Grid>

                                        {/* Occupancy Types */}

                                        {/* no of ref area */}
                                        <Grid
                                          item
                                          xs={4}
                                          className={styles.feildres}
                                        >
                                          <TextField
                                            sx={{ width: "80%" }}
                                            id="standard-basic"
                                            label={
                                              <FormattedLabel id="noOfRefusedArea" />
                                            }
                                            variant="standard"
                                            {...register("noOfRefArea")}
                                            onChange={(event) => {
                                              if (noOfRefArea !== "") {
                                                setNoOfRefArea("");
                                              }
                                            }}
                                            helperText={
                                              <p className={styles.error}>
                                                {noOfRefArea}
                                              </p>
                                            }
                                          />
                                        </Grid>

                                        {/* refused area in sq.mtr */}
                                        <Grid
                                          item
                                          xs={4}
                                          className={styles.feildres}
                                        >
                                          <TextField
                                            sx={{ width: "80%" }}
                                            id="standard-basic"
                                            // label="Building Classif'ication"
                                            label={
                                              <FormattedLabel id="refusedArea" />
                                            }
                                            variant="standard"
                                            {...register("refusedAreaInSqMtr")}
                                            onChange={(event) => {
                                              if (refusedAreaInSqMtr !== "") {
                                                setRefusedAreaInSqMtr("");
                                              }
                                            }}
                                            helperText={
                                              <p className={styles.error}>
                                                {refusedAreaInSqMtr}
                                              </p>
                                            }
                                          />
                                        </Grid>
                                      </Grid>

                                      {/* Types form */}
                                      <Grid>
                                        <Box>
                                          {isOpenCollapsesType && (
                                            <Slide
                                              direction="down"
                                              in={slideCheckedType}
                                              mountOnEnter
                                              unmountOnExit
                                            >
                                              <Grid>
                                                <>
                                                  <form>
                                                    <Box
                                                      style={{
                                                        margin: "4%",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        justifyContent:
                                                          "center",
                                                      }}
                                                    >
                                                      <Paper
                                                        sx={{
                                                          margin: 1,
                                                          padding: 2,
                                                          backgroundColor:
                                                            "white",
                                                        }}
                                                        elevation={5}
                                                      >
                                                        <Box
                                                          sx={{
                                                            backgroundColor:
                                                              "#F5F5F5",
                                                            padding: 0.2,
                                                          }}
                                                        >
                                                          <h3
                                                            style={{
                                                              paddingLeft:
                                                                "5px",
                                                            }}
                                                          >
                                                            Add Types
                                                          </h3>
                                                        </Box>

                                                        <br />
                                                        <Grid
                                                          container
                                                          columns={{
                                                            xs: 4,
                                                            sm: 8,
                                                            md: 12,
                                                          }}
                                                          className={
                                                            styles.feildres
                                                          }
                                                          spacing={5}
                                                        >
                                                          {/* Tank location  */}
                                                          <Grid
                                                            item
                                                            xs={4}
                                                            className={
                                                              styles.feildres
                                                            }
                                                          >
                                                            <FormControl
                                                              variant="standard"
                                                              error={
                                                                !!errors.venue
                                                              }
                                                              sx={{
                                                                width: "100%",
                                                                marginTop:
                                                                  "-12px",
                                                              }}
                                                            >
                                                              <InputLabel id="demo-simple-select-standard-label">
                                                                {/* <FormattedLabel id="nameOfUsage" /> */}
                                                                Types
                                                              </InputLabel>
                                                              <Controller
                                                                render={({
                                                                  field,
                                                                }) => (
                                                                  <Select
                                                                    labelId="demo-simple-select-standard-label"
                                                                    id="demo-simple-select-standard"
                                                                    value={
                                                                      field.value
                                                                    }
                                                                    onChange={(
                                                                      value
                                                                    ) => {
                                                                      field.onChange(
                                                                        value
                                                                      );
                                                                    }}
                                                                    label="nameOfUsage"
                                                                  >
                                                                    {types &&
                                                                      types.map(
                                                                        (
                                                                          nameOfUsage,
                                                                          index
                                                                        ) => (
                                                                          <MenuItem
                                                                            key={
                                                                              index
                                                                            }
                                                                            value={
                                                                              nameOfUsage.id
                                                                            }
                                                                          >
                                                                            {language ==
                                                                            "en"
                                                                              ? nameOfUsage?.nameOfUsage
                                                                              : nameOfUsage?.nameOfUsageMr}
                                                                          </MenuItem>
                                                                        )
                                                                      )}
                                                                  </Select>
                                                                )}
                                                                name="nameOfUsage"
                                                                control={
                                                                  control
                                                                }
                                                                defaultValue=""
                                                              />
                                                              <FormHelperText>
                                                                {errors?.venue
                                                                  ? errors.venue
                                                                      .message
                                                                  : null}
                                                              </FormHelperText>
                                                            </FormControl>
                                                          </Grid>
                                                          <Grid
                                                            item
                                                            xs={4}
                                                            className={
                                                              styles.feildres
                                                            }
                                                          >
                                                            <TextField
                                                              sx={{
                                                                width: "100%",
                                                              }}
                                                              id="standard-basic"
                                                              label="Gross Build up area"
                                                              variant="standard"
                                                              {...register(
                                                                "grossBuildUpAreaO"
                                                              )}
                                                              onChange={(
                                                                event
                                                              ) => {
                                                                if (
                                                                  floorHeight !==
                                                                  ""
                                                                ) {
                                                                  setFloorHeight(
                                                                    ""
                                                                  );
                                                                }
                                                              }}
                                                              helperText={
                                                                <p
                                                                  className={
                                                                    styles.error
                                                                  }
                                                                >
                                                                  {floorHeight}
                                                                </p>
                                                              }
                                                            />
                                                          </Grid>
                                                          <Grid
                                                            item
                                                            xs={4}
                                                            className={
                                                              styles.feildres
                                                            }
                                                          >
                                                            <TextField
                                                              sx={{
                                                                width: "100%",
                                                              }}
                                                              id="standard-basic"
                                                              label="Net Build up area"
                                                              variant="standard"
                                                              {...register(
                                                                "netBuildUpAreaO"
                                                              )}
                                                              onChange={(
                                                                event
                                                              ) => {
                                                                if (
                                                                  floorHeight !==
                                                                  ""
                                                                ) {
                                                                  setFloorHeight(
                                                                    ""
                                                                  );
                                                                }
                                                              }}
                                                              helperText={
                                                                <p
                                                                  className={
                                                                    styles.error
                                                                  }
                                                                >
                                                                  {floorHeight}
                                                                </p>
                                                              }
                                                            />
                                                          </Grid>
                                                        </Grid>

                                                        <br />
                                                        <Grid
                                                          container
                                                          className={
                                                            styles.feildres
                                                          }
                                                          spacing={2}
                                                        >
                                                          <Grid item>
                                                            <Button
                                                              size="small"
                                                              variant="outlined"
                                                              className={
                                                                styles.button
                                                              }
                                                              endIcon={
                                                                <SaveIcon />
                                                              }
                                                              onClick={() => {
                                                                handleTypesAdd();
                                                              }}
                                                            >
                                                              {btnSaveText ==
                                                              "Update" ? (
                                                                <FormattedLabel id="update" />
                                                              ) : (
                                                                "Save Multiple Types"
                                                              )}
                                                            </Button>
                                                          </Grid>

                                                          {/* <Grid item>
                                                            <Button
                                                              size="small"
                                                              variant="outlined"
                                                              className={
                                                                styles.button
                                                              }
                                                              endIcon={
                                                                <ClearIcon />
                                                              }
                                                              onClick={() =>
                                                                cancellButton()
                                                              }
                                                            >
                                                              {
                                                                <FormattedLabel id="clear" />
                                                              }
                                                            </Button>
                                                          </Grid> */}

                                                          <Grid item>
                                                            <Button
                                                              size="small"
                                                              variant="outlined"
                                                              className={
                                                                styles.button
                                                              }
                                                              endIcon={
                                                                <ExitToAppIcon />
                                                              }
                                                              onClick={() =>
                                                                exitFunctionForTypes()
                                                              }
                                                            >
                                                              {
                                                                <FormattedLabel id="exit" />
                                                              }
                                                            </Button>
                                                          </Grid>
                                                        </Grid>
                                                      </Paper>
                                                    </Box>
                                                  </form>
                                                </>
                                              </Grid>
                                            </Slide>
                                          )}
                                          {/* floor dtls */}
                                          <Box
                                            style={{
                                              display: "flex",
                                              marginTop: "5%",
                                            }}
                                          >
                                            <Box
                                              className={styles.subtableHead}
                                            >
                                              <Box className={styles.subh1Tag}>
                                                Types
                                              </Box>
                                            </Box>

                                            <Box>
                                              <Button
                                                variant="contained"
                                                type="primary"
                                                disabled={buttonInputStatesType}
                                                onClick={() => {
                                                  setEditButtonInputState(true);
                                                  setDeleteButtonState(true);
                                                  setBtnSaveText("Save");
                                                  setButtonInputStatesType(
                                                    true
                                                  );
                                                  setSlideCheckedType(true);
                                                  console.log(
                                                    "floor tab colab",
                                                    isOpenCollapse
                                                  );
                                                  setIsOpenCollapsesType(
                                                    !isOpenCollapsesType
                                                  );
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
                                          </Box>
                                          <Box>
                                            <DataGrid
                                              getRowId={(row) => row.srNo}
                                              disableColumnFilter
                                              disableColumnSelector
                                              disableExport
                                              autoHeight
                                              density="compact"
                                              sx={{
                                                width: "100%",
                                                backgroundColor: "white",
                                                boxShadow: 2,
                                                // border: 1,
                                                borderColor: "primary.light",
                                                "& .MuiDataGrid-cell:hover": {},
                                                "& .MuiDataGrid-row:hover": {
                                                  backgroundColor: "#E1FDFF",
                                                },
                                                "& .MuiDataGrid-columnHeadersInner":
                                                  {
                                                    backgroundColor:
                                                      "#92bdeee8",
                                                  },
                                              }}
                                              rows={
                                                watch("FinalTypeDetailsTable")
                                                  ? watch(
                                                      "FinalTypeDetailsTable"
                                                    )
                                                  : []
                                              }
                                              columns={columnsT}
                                              pageSize={7}
                                              rowsPerPageOptions={[7]}
                                            />
                                          </Box>
                                        </Box>
                                      </Grid>

                                      <br />
                                      <br />

                                      {/* <div></div> */}

                                      <Grid
                                        container
                                        className={styles.feildres}
                                        spacing={2}
                                      >
                                        <Grid item>
                                          <Button
                                            size="small"
                                            variant="outlined"
                                            className={styles.button}
                                            endIcon={<SaveIcon />}
                                            onClick={() => {
                                              handleFloorAdd();
                                            }}
                                          >
                                            {btnSaveText == "Update" ? (
                                              <FormattedLabel id="update" />
                                            ) : (
                                              "Save Floor Details"
                                            )}
                                          </Button>
                                        </Grid>

                                        <Grid item>
                                          <Button
                                            size="small"
                                            variant="outlined"
                                            className={styles.button}
                                            endIcon={<ExitToAppIcon />}
                                            onClick={() =>
                                              exitFunctionForFloor()
                                            }
                                          >
                                            {<FormattedLabel id="exit" />}
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Paper>
                                  </Box>
                                </form>
                              </>
                            </Grid>
                          </Slide>
                        )}
                        {/* floor dtls */}
                        <Box style={{ display: "flex", marginTop: "5%" }}>
                          <Box className={styles.subtableHead}>
                            <Box className={styles.subh1Tag}>Floor Details</Box>
                          </Box>

                          <Box>
                            <Button
                              variant="contained"
                              type="primary"
                              disabled={buttonInputStates}
                              onClick={() => {
                                // reset({
                                //   ...resetValuesExit,
                                // });
                                setEditButtonInputState(true);
                                setDeleteButtonState(true);
                                setBtnSaveText("Save");
                                setButtonInputStates(true);
                                setSlideCheckedF(true);
                                console.log("floor tab colab", isOpenCollapse);
                                setIsOpenCollapses(!isOpenCollapses);
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
                        </Box>
                        <Box>
                          <DataGrid
                            getRowId={(row) => row.srNo}
                            disableColumnFilter
                            disableColumnSelector
                            disableExport
                            autoHeight
                            density="compact"
                            sx={{
                              backgroundColor: "white",
                              width: "100%",
                              boxShadow: 2,
                              // border: 1,
                              // borderColor: "red",
                              "& .MuiDataGrid-cell:hover": {},
                              "& .MuiDataGrid-row:hover": {
                                backgroundColor: "#E1FDFF",
                              },
                              "& .MuiDataGrid-columnHeadersInner": {
                                backgroundColor: "#92bdeee8",
                              },
                            }}
                            rows={
                              watch("FinalFloorDetailsTable")
                                ? watch("FinalFloorDetailsTable")
                                : []
                            }
                            columns={columnsF}
                            pageSize={7}
                            rowsPerPageOptions={[7]}
                          />
                        </Box>
                      </Box>
                    </Grid>

                    <br />

                    <Grid container className={styles.feildres} spacing={2}>
                      <Grid item>
                        <Button
                          onClick={() => {
                            handleClickForBuilding();
                            // saveBuildingDetails();
                            // setIsOpenCollapse(isOpenCollapse);
                          }}
                          size="small"
                          variant="outlined"
                          className={styles.button}
                          endIcon={<SaveIcon />}
                        >
                          {btnSaveText == "Update" ? (
                            <FormattedLabel id="update" />
                          ) : (
                            "Save Building Details"
                          )}
                        </Button>
                      </Grid>

                      <Grid item>
                        <Button
                          size="small"
                          variant="outlined"
                          className={styles.button}
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitFunction()}
                        >
                          {<FormattedLabel id="exit" />}
                        </Button>
                      </Grid>
                    </Grid>
                    <br />
                    <br />

                    {/* </Paper> */}
                  </Box>
                </form>
              </FormProvider>
            </Grid>
          </Slide>
        )}

        <Box style={{ display: "flex", margin: "2%" }}>
          <Box className={styles.tableHead}>
            <Box className={styles.h1Tag}>Building Details</Box>
          </Box>

          {!view && (
            <Box>
              <Button
                variant="contained"
                type="primary"
                disabled={buttonInputState}
                onClick={() => {
                  handleFloorAddOrEdit(getValues("bulidingDTLDao")?.length);
                  setEditButtonInputState(true);
                  setDeleteButtonState(true);
                  setBtnSaveText("Save");
                  setButtonInputState(true);
                  setSlideChecked(true);
                  setIsOpenCollapse(!isOpenCollapse);
                }}
                className={styles.adbtn}
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

        <Box style={{ display: "flex", margin: "2%" }}>
          <DataGrid
            getRowId={(row) => row.srNo}
            disableColumnFilter
            disableColumnSelector
            disableExport
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
                printOptions: { disableToolbarButton: true },
                csvOptions: { disableToolbarButton: true },
              },
            }}
            components={{ Toolbar: GridToolbar }}
            autoHeight
            density="compact"
            sx={{
              backgroundColor: "white",

              boxShadow: 2,
              border: 1,
              borderColor: "primary.light",
              "& .MuiDataGrid-cell:hover": {},
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#E1FDFF",
              },
              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#87E9F7",
              },
            }}
            rows={
              getValues("buildingDTLDao")
                ? getValues("buildingDTLDao")?.map((rec, ind) => {
                    return { ...rec, srNo: ind + 1 };
                  })
                : []
            }
            columns={columns}
            pageSize={7}
            rowsPerPageOptions={[7]}
          />
        </Box>
      </Box>
    </>
  );
};

export default Index;
