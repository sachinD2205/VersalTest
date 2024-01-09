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
// BuildingDetails
// const [fetchData, setFetchData] = useState(null);
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

  const [floorHeight, setFloorHeight] = useState(" ");
  const [isChecked, setIsChecked] = useState(false);
  const [isCheckedLift, setIsCheckedLift] = useState(false);
  const [isCheckedBasement, setIsCheckedBasement] = useState(false);
  const [isCheckedRamp, setIsCheckedRamp] = useState(false);
  const [noOfVentilation, setNoOfVentilation] = useState(" ");
  const [grossBuiltUpArea, setGrossBuiltUpArea] = useState(" ");
  const [netBuiltUpArea, setNetBuiltUpArea] = useState(" ");
  const [occupancyTypes, setOccupancyTypes] = useState(" ");
  const [buildingClassification, setBuildingClassification] = useState(" ");
  const [noOfRefArea, setNoOfRefArea] = useState(" ");
  const [refusedAreaInSqMtr, setRefusedAreaInSqMtr] = useState(" ");
  //buildingValidation useState
  const [buildingName, setBuildingName] = useState(" ");
  const [types, setTypes] = useState([]);

  const [
    buildingHeightFromGroundFloorInMeter,
    setBuildingHeightFromGroundFloorInMeter,
  ] = useState(" ");
  const [noOfBasement, setNoOfBasement] = useState(" ");
  const [volumeLBHIn, setVolumeLBHIn] = useState(" ");
  const [noOfFloor, setNoOfFloor] = useState(" ");
  const [buildingHeightH1, setBuildingHeightH1] = useState(" ");
  const [buildingHeightH2, setBuildingHeightH2] = useState(" ");
  const [typeOfBuilding, setTypeOfBuilding] = useState(" ");
  const [buildingIsSpecial, setBuildingIsSpecial] = useState(" ");
  const [front, setFront] = useState(" ");
  const [rear, setRear] = useState(" ");
  const [leftSide, setLeftSide] = useState(" ");
  const [rightSide, setRightSide] = useState(" ");
  const [siteAddress, setSiteAddress] = useState(" ");
  //////////////////////////

  const [plinthHeightInMeter, setPlinthHeightInMeter] = useState(" ");
  const [l, setL] = useState(" ");
  const [b, setB] = useState(" ");

  const [buildingHeightUptoParafeet, setBuildingHeightUptoParafeet] =
    useState(" ");
  const [buildingHeightUptoTeres, setBuildingHeightUptoTeres] = useState(" ");

  //////////////////////////////////

  const [parafeetWallHeight, setParafeetWallHeight] = useState(" ");
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

  // const clearBuildingDetails = () => {
  //   reset({
  //     ...resetValuesCancell,
  //   });
  // };

  // const resetValuesCancell = {
  //   b: "",
  //   buildingHeightFromGroundFloorInMeter: "",
  //   buildingHeightH1: "",
  //   buildingHeightH2: "",
  //   buildingIsSpecial: "",
  //   buildingName: "",
  //   leftSide: "",
  //   noOfBasement: "",
  //   noOfFloor: "",
  //   rear: "",
  //   rightSide: "",
  //   typeOfBuilding: "",
  //   buildingHeightFromGroundFloorInMeter: "",
  //   buildingHeightH1: "",
  //   buildingHeightH2: "",
  //   buildingHeightUptoParafeet: "",
  //   buildingHeightUptoTeres: "",
  //   buildingIsSpecial: "",
  //   buildingName: "",
  //   constructionAreSqMeter: "",
  //   floorHeight: "",
  //   front: "",
  //   grossBuildUpAreaO: "",
  //   grossBuiltUpAreaF: "",
  //   l: "",
  //   leftSide: "",
  //   nameOfUsage: "",
  //   netBuildUpAreaO: "",
  //   netBuiltUpAreaF: "",
  //   noOfApprochedRoad: "",
  //   noOfBasement: "",
  //   noOfFireStairCase: "",
  //   noOfFloor: "",
  //   noOfRefArea: "",
  //   noOfVentilation: "",
  //   occupancyTypes: "",
  //   parafeetWallHeight: "",
  //   plinthHeightInMeter: "",
  //   plotAreaSquareMeter: "",
  //   rear: "",
  //   refusedAreaInSqMtr: "",
  //   rightSide: "",
  //   typeOfBuilding: "",
  //   widthOfFireStairCase: "",
  // };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked ? true : false);
    if ((event.target.checked = true)) {
      // reset({
      //   noOfFireStairCase: "",
      //   widthOfFireStairCase: "",
      // });
    }
  };
  const handleCheckboxChangeLift = (event) => {
    setIsCheckedLift(event.target.checked ? true : false);
    if ((event.target.checked = true)) {
      // reset({
      //   noOfFireLift: "",
      //   capacityOfFireLift: "",
      // });
    }
  };

  const handleCheckboxChangeBasement = (event) => {
    setIsCheckedBasement(event.target.checked ? true : false);
    if ((event.target.checked = true)) {
      // reset({
      //   noOfBasement: "",
      //   distanceFromBuildingToOpenSpace: "",
      // });
    }
  };

  const handleCheckboxChangeRamp = (event) => {
    setIsCheckedRamp(event.target.checked ? true : false);
    if ((event.target.checked = true)) {
      // reset({
      //   noOfPodiumRamp: "",
      //   podiumRampWidth: "",
      // });
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
      buildingHeightFromGroundFloorInMeter: getValues(
        "buildingHeightFromGroundFloorInMeter"
      ),
      noOfBasement: getValues("noOfBasement"),
      volumeLBHIn: getValues("volumeLBHIn"),
      noOfFloor: getValues("noOfFloor"),
      mstZones: getValues("mstZones"),
      l: getValues("l"),
      b: getValues("b"),
      buildingHeightH1: getValues("buildingHeightH1"),
      buildingHeightH2: getValues("buildingHeightH2"),
      typeOfBuilding: getValues("typeOfBuilding"),
      buildingIsSpecial: getValues("buildingIsSpecial"),
      front: getValues("front"),
      rear: getValues("rear"),
      leftSide: getValues("leftSide"),
      rightSide: getValues("rightSide"),
      siteAddress: getValues("siteAddress"),
      floorDTLDao: watch("FinalFloorDetails"),
    };
    // console.log("daoooo", ...watch("buildingDTLDao"));

    const updateBuldingDTLDao =
      watch("buildingDTLDao") != undefined &&
      watch("buildingDTLDao") != null &&
      watch("buildingDTLDao").length != 0
        ? [...watch("buildingDTLDao")]
        : [buildingDTLDao];
    setValue("buildingDTLDao", updateBuldingDTLDao);

    console.log("bodyOfBuilding", watch());
    const body = {
      // buildingDTLDao,
      ...watch(),
      // ...getValues(),
      // buildingDTLDao,
      // id: getValues("provisionalBuildingNocId"),
      // // floorDetails : getValues(""),

      // // setSelectedBuildingIndex(getValues("buildingDTLDao")?.length);
      // // setSelectedBuildingIndex(watch("buildingDTLDao")?.length),
      // index: getValues("buildingDTLDao")?.length,
      // // setSelectedBuildingIndex(index)
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
          sweetAlert("Saved", "Building Details saved!", "success");
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
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
          // setButtonInputState(false);
          // setIsOpenCollapse(false);
          // setEditButtonInputState(false);
          // setDeleteButtonState(false);
          setButtonInputStates(false);
          setIsOpenCollapses(false);
        }
      });
  };

  // saveFloorDetails
  // const saveFloorDetails = () => {
  //   const floorDTLDao = {
  //     floorHeight: getValues("floorHeight"),
  //     noOfVentilation: getValues("noOfVentilation"),
  //     grossBuiltUpArea: getValues("grossBuiltUpArea"),
  //     netBuiltUpArea: getValues("netBuiltUpArea"),
  //     occupancyTypes: getValues("occupancyTypes"),
  //     buildingClassification: getValues("buildingClassification"),
  //     noOfRefArea: getValues("noOfRefArea"),
  //     refusedAreaInSqMtr: getValues("refusedAreaInSqMtr"),
  //   };

  //   const buildingDTLDao = {
  //     buildingName: getValues("buildingName"),
  //     buildingHeightFromGroundFloorInMeter: getValues(
  //       "buildingHeightFromGroundFloorInMeter"
  //     ),
  //     noOfBasement: getValues("noOfBasement"),
  //     volumeLBHIn: getValues("volumeLBHIn"),
  //     noOfFloor: getValues("noOfFloor"),
  //     //   plotAreaSquareMeter: getValues("plotAreaSquareMeter"),
  //     //   constructionAreSqMeter: getValues("constructionAreSqMeter"),
  //     //   noOfApprochedRoad: getValues("noOfApprochedRoad"),
  //     mstZones: getValues("mstZones"),
  //     l: getValues("l"),
  //     b: getValues("b"),
  //     buildingHeightH1: getValues("buildingHeightH1"),
  //     buildingHeightH2: getValues("buildingHeightH2"),
  //     typeOfBuilding: getValues("typeOfBuilding"),
  //     buildingIsSpecial: getValues("buildingIsSpecial"),
  //     front: getValues("front"),
  //     rear: getValues("rear"),
  //     leftSide: getValues("leftSide"),
  //     rightSide: getValues("rightSide"),
  //     siteAddress: getValues("siteAddress"),
  //     floorDTLDao: [
  //       ...(getValues("floorDTLDao") ? getValues("floorDTLDao") : []),
  //       { ...floorDTLDao },
  //     ],
  //   };

  //   const body = {
  //     ...getValues(),
  //     buildingDTLDao: [
  //       ...(getValues("buildingDTLDao") ? getValues("buildingDTLDao") : []),
  //       buildingDTLDao,
  //     ],
  //     id: getValues("provisionalBuildingNocId"),
  //   };

  //   axios
  //     .post(`${urls.FbsURL}/transaction/provisionalBuildingFireNOC/save`, body)
  //     .then((res) => {
  //       if (res.status == 200) {
  //         console.log("2323", res);
  //         let appId = res?.data?.status?.split("$")[1];
  //         console.log("provisionalBuildingNocId", appId);
  //         setValue("provisionalBuildingNocId", appId);
  //         sweetAlert("Saved!", "Record Saved successfully !", "success");
  //         setButtonInputStates(false);
  //         setIsOpenCollapses(false);
  //       }
  //     });
  //   setIsOpenCollapse(isOpenCollapse);
  // };

  //Floorvalidation
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
      // saveFloorDetails();
      handleFloorAddOrEdit();
      // saveOwner();
      // setIsOpenCollapse(isOpenCollapse);
      // setError("");
      // animalKeyFunction();
      // setCollapse(true);
    }
  };

  //BuildingValidation

  const handleClickForBuilding = () => {
    const buildingName = watch("buildingName");
    const buildingHeightFromGroundFloorInMeter = watch(
      "buildingHeightFromGroundFloorInMeter"
    );
    const noOfFireStairCase = watch("noOfFireStairCase");
    const noOfBasement = watch("noOfBasement");
    const volumeLBHIn = watch("volumeLBHIn");
    const noOfFloor = watch("noOfFloor");
    const buildingHeightH1 = watch("buildingHeightH1");
    const buildingHeightH2 = watch("buildingHeightH2");
    const typeOfBuilding = watch("typeOfBuilding");
    const buildingIsSpecial = watch("buildingIsSpecial");
    const front = watch("front");
    const rear = watch("rear");
    const leftSide = watch("leftSide");
    const l = watch("l");
    const b = watch("b");
    const rightSide = watch("rightSide");
    const buildingHeightUptoTeres = watch("buildingHeightUptoTeres");
    const parafeetWallHeight = watch("parafeetWallHeight");

    const siteAddress = watch("siteAddress");
    const plinthHeightInMeter = watch("plinthHeightInMeter");
    const buildingHeightUptoParafeet = watch("buildingHeightUptoParafeet");

    // const floorDTLDao = watch("floorDTLDao");
    // let floorData = watch("formDTLDao");

    if (buildingName === "") {
      setBuildingName("Please enter floorHeight");
    }
    if (buildingHeightFromGroundFloorInMeter === "") {
      setBuildingHeightFromGroundFloorInMeter("Please enter no Of Ventilation");
    }
    // if (noOfBasement === "") {
    //   setNoOfBasement("Please enter grossBuilt Up Area");
    // }
    if (volumeLBHIn === "") {
      setVolumeLBHIn("Please enter netBuiltUp Area");
    }
    if (noOfFloor === "") {
      setNoOfFloor("Please enter occupancy Types");
    }
    if (buildingHeightH1 === "") {
      setBuildingHeightH1("Please enter building Classification ");
    }
    // if (buildingHeightH2 === "") {
    //   setBuildingHeightH2("Please enter no OfRef Area");
    // }
    if (buildingIsSpecial === "") {
      setBuildingIsSpecial("Please enter no OfRef Area");
    }
    if (front === "") {
      setFront("Please enter no OfRef Area");
    }
    if (rear === "") {
      setRear("Please enter no OfRef Area");
    }
    if (leftSide === "") {
      setLeftSide("Please enter no OfRef Area");
    }
    if (rightSide === "") {
      setRightSide("Please enter no OfRef Area");
    }
    if (siteAddress === "") {
      setSiteAddress("Please enter no OfRef Area");
    }
    if (parafeetWallHeight === "") {
      setParafeetWallHeight("Please enter parafeet Wall Height");
    }
    if (typeOfBuilding === "") {
      setTypeOfBuilding("Please enter refused Area InSqMtr");
    }
    if (plinthHeightInMeter === "") {
      setPlinthHeightInMeter("Please enter Plinth Height In Meter");
    }
    if (buildingHeightUptoParafeet === "") {
      setBuildingHeightUptoParafeet(
        "Please enter building Height Upto Parafeet"
      );
    }
    if (buildingHeightUptoTeres === "") {
      setBuildingHeightUptoTeres("Please enter building Height Upto Teres");
    }
    if (l === "") {
      setL("Please enter length");
    }
    if (b === "") {
      setB("Please enter breadth ");
    }

    // if (floorData <= 1) {
    //   swal("Please enter at least one floor details");
    // }
    else {
      saveBuildingDetails();
      // saveFloorDetails();
      // saveOwner();
      // setIsOpenCollapse(isOpenCollapse);
    }
  };

  // exitFunction
  const exitFunction = () => {
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
    setValue("grossBuiltUpAreaF", "");
    setValue("netBuiltUpAreaF", "");
    setValue("occupancyTypes", "");
    setValue("buildingClassification", "");
    setValue("noOfRefArea", "");
    setValue("refusedAreaInSqMtr", "");
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
      grossBuiltUpArea: watch("grossBuiltUpAreaF"),
      netBuiltUpArea: watch("netBuiltUpAreaF"),
      occupancyTypes: watch("occupancyTypes"),
      buildingClassification: watch("buildingClassification"),
      noOfRefArea: watch("noOfRefArea"),
      refusedAreaInSqMtr: watch("refusedAreaInSqMtr"),
      floorWiseUsageTypeDao: watch("FinalTypeDetails"),
    };
    console.log("2209", floorTempBody);
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
  };

  useEffect(() => {
    getTypes();
  }, []);

  useEffect(() => {
    let FinalFloorDetails = watch("FinalFloorDetails");

    let FinalFloorDetailsTable = FinalFloorDetails?.map((data, index) => {
      console.log();
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

  // handleFloorAdd End
  // handleFloorAdd
  const handleTypesAdd = () => {
    // floorTempBody
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

  // resetValuesCancell
  // const resetValuesCancell = {
  //   nOCName: "",
  //   nOCNameMr: "",
  // };

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
    // {
    //   field: "occupancyTypes",
    //   headerName: "Occupancy Types",
    //   flex: 1,
    // },
    // {
    //   field: "buildingClassification",
    //   headerName: "Building Classification",
    //   flex: 1,
    // },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 0.8,
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
        console.log("params", params.row);
        return (
          <>
            <IconButton
              disabled={viewButtonInputStateB}
              onClick={() => {
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
                    {/* <Paper
                      sx={{
                        padding: 2,
                        backgroundColor: "#F5F5F5",
                      }}
                      elevation={5}
                    > */}
                    {/* <Box className={styles.tableHead}>
                      <Box className={styles.feildHead}>
                        {btnSaveText == "Update"
                          ? "Update Buliding Details"
                          : "Buliding Details"}
                      </Box>
                    </Box> */}

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
                          //   label={<FormattedLabel id="b" />}
                          label="Building Name"
                          variant="standard"
                          {...register("buildingName")}
                          onChange={(event) => {
                            if (buildingName !== "") {
                              setBuildingName("");
                            }
                          }}
                          helperText={
                            <p className={styles.error}>{buildingName}</p>
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          variant="standard"
                          sx={{ width: "80%" }}
                          error={!!errors.businessType}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="typeOfBuilding" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                // onChange={(value) => field.onChange(value)}
                                onChange={(value) => {
                                  field.onChange(value);
                                  if (typeOfBuilding !== "") {
                                    setTypeOfBuilding("");
                                  }
                                }}
                                label="List"
                                error={!!errors.typeOfBuilding}
                                helperText={
                                  errors?.typeOfBuilding
                                    ? errors.typeOfBuilding.message
                                    : null
                                }
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
                                // onChange={(value) => field.onChange(value)}
                                onChange={(value) => {
                                  field.onChange(value);
                                  if (buildingIsSpecial !== "") {
                                    setBuildingIsSpecial("");
                                  }
                                }}
                                fullWidth
                                size="small"
                                variant="standard"
                              >
                                <MenuItem value={10}>Yes</MenuItem>
                                <MenuItem value={20}>No</MenuItem>
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
                          onChange={(event) => {
                            if (front !== "") {
                              setFront("");
                            }
                          }}
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
                          onChange={(event) => {
                            if (rear !== "") {
                              setRear("");
                            }
                          }}
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
                          onChange={(event) => {
                            if (rightSide !== "") {
                              setRightSide("");
                            }
                          }}
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
                          // label="parafeet wall height "
                          label={<FormattedLabel id="parafeetWallHeight" />}
                          variant="standard"
                          {...register("parafeetWallHeight")}
                          onChange={(event) => {
                            if (parafeetWallHeight !== "") {
                              setParafeetWallHeight("");
                            }
                          }}
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
                          onChange={(event) => {
                            if (noOfBasement !== "") {
                              setNoOfBasement("");
                            }
                          }}
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
                          onChange={(event) => {
                            if (noOfFloor !== "") {
                              setNoOfFloor("");
                            }
                          }}
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
                          onChange={(event) => {
                            if (plinthHeightInMeter !== "") {
                              setPlinthHeightInMeter("");
                            }
                          }}
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
                          error={!!errors.plotAreaSquareMeter}
                          helperText={
                            errors?.plotAreaSquareMeter
                              ? errors.plotAreaSquareMeter.message
                              : null
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
                          error={!!errors.constructionAreSqMeter}
                          helperText={
                            errors?.constructionAreSqMeter
                              ? errors.constructionAreSqMeter.message
                              : null
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
                          error={!!errors.noOfApprochedRoad}
                          helperText={
                            errors?.noOfApprochedRoad
                              ? errors.noOfApprochedRoad.message
                              : null
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
                          onChange={(event) => {
                            if (l !== "") {
                              setL("");
                            }
                          }}
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
                          onChange={(event) => {
                            if (b !== "") {
                              setB("");
                            }
                          }}
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
                          onChange={(event) => {
                            if (buildingHeightH1 !== "") {
                              setBuildingHeightH1("");
                            }
                          }}
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
                          onChange={(event) => {
                            if (buildingHeightH2 !== "") {
                              setBuildingHeightH2("");
                            }
                          }}
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
                          onChange={(event) => {
                            if (buildingHeightFromGroundFloorInMeter !== "") {
                              setBuildingHeightFromGroundFloorInMeter("");
                            }
                          }}
                          helperText={
                            <p className={styles.error}>
                              {buildingHeightFromGroundFloorInMeter}
                            </p>
                          }
                        />
                      </Grid>

                      {/* <Grid item xs={4} className={styles.feildres}></Grid> */}

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
                          onChange={(event) => {
                            if (buildingHeightUptoParafeet !== "") {
                              setBuildingHeightUptoParafeet("");
                            }
                          }}
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
                          onChange={(event) => {
                            if (buildingHeightUptoTeres !== "") {
                              setBuildingHeightUptoTeres("");
                            }
                          }}
                          helperText={
                            <p className={styles.error}>
                              {buildingHeightUptoTeres}
                            </p>
                          }
                        />
                      </Grid>

                      {/* <Grid item xs={4} className={styles.feildres}>
                          <TextField
                            sx={{ width: "80%" }}
                            id="standard-basic"
                            // label="parafeet wall height "
                            label={
                              <FormattedLabel id="buildingHeightUptoTeres" />
                            }
                            variant="standard"
                            {...register("buildingHeightUptoTeres")}
                            error={!!errors.buildingHeightUptoTeres}
                            helperText={
                              errors?.buildingHeightUptoTeres
                                ? errors.buildingHeightUptoTeres.message
                                : null
                            }
                          />
                        </Grid> */}

                      {/* new fields start */}

                      {/* fire stair case */}
                      <Grid item xs={4} className={styles.feildres}>
                        <FormGroup>
                          <FormControlLabel
                            sx={{ marginRight: "10vw" }}
                            label={<FormattedLabel id="isFireStairCaseGiven" />}
                            control={
                              <Checkbox
                                checked={isChecked}
                                onChange={handleCheckboxChange}
                              />
                            }
                          />
                        </FormGroup>
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={!isChecked}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="noOfFireStairCase" />}
                          variant="standard"
                          {...register("noOfFireStairCase")}
                          onChange={(event) => {
                            // if ((isChecked = false)) {
                            //   reset("noOfFireStairCase");
                            // }
                          }}
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={!isChecked}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="widthOfFireStairCase" />}
                          variant="standard"
                          {...register("widthOfFireStairCase")}
                          onChange={(event) => {
                            // if ((isChecked = false)) {
                            //   reset("widthOfFireStairCase");
                            // }
                          }}
                          error={!!errors.widthOfFireStairCase}
                          helperText={
                            errors?.widthOfFireStairCase
                              ? errors.widthOfFireStairCase.message
                              : null
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
                                checked={isCheckedLift}
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
                          disabled={!isCheckedLift}
                          onChange={(event) => {
                            // if ((isCheckedLift = false)) {
                            //   reset("noOfFireLift");
                            // }
                          }}
                          // label="parafeet wall height "
                          label={<FormattedLabel id="noOfFireLift" />}
                          variant="standard"
                          {...register("noOfFireLift")}
                          error={!!errors.noOfFireLift}
                          helperText={
                            errors?.noOfFireLift
                              ? errors.noOfFireLift.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          disabled={!isCheckedLift}
                          onChange={(event) => {
                            // if ((isCheckedLift = false)) {
                            //   reset("capacityOfFireLift");
                            // }
                          }}
                          label={<FormattedLabel id="capacityOfFireLift" />}
                          variant="standard"
                          {...register("capacityOfFireLift")}
                          error={!!errors.capacityOfFireLift}
                          helperText={
                            errors?.capacityOfFireLift
                              ? errors.capacityOfFireLift.message
                              : null
                          }
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
                                checked={isCheckedBasement}
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
                          disabled={!isCheckedBasement}
                          onChange={(event) => {
                            // if ((isCheckedBasement = false)) {
                            //   reset("noOfBasement");
                            // }
                          }}
                          label={<FormattedLabel id="noOfBasement" />}
                          variant="standard"
                          {...register("noOfBasement")}
                          InputLabelProps={{
                            shrink: watch("noOfBasement") ? true : false,
                          }}
                          error={!!errors.noOfBasement}
                          helperText={
                            errors?.noOfBasement
                              ? errors.noOfBasement.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={!isCheckedBasement}
                          onChange={(event) => {
                            // if ((isCheckedBasement = false)) {
                            //   reset("distanceFromBuildingToOpenSpace");
                            // }
                          }}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label={
                            <FormattedLabel id="distanceFromBuildingToOpenSpace" />
                          }
                          variant="standard"
                          {...register("distanceFromBuildingToOpenSpace")}
                          error={!!errors.distanceFromBuildingToOpenSpace}
                          helperText={
                            errors?.distanceFromBuildingToOpenSpace
                              ? errors.distanceFromBuildingToOpenSpace.message
                              : null
                          }
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
                                checked={isCheckedRamp}
                                onChange={handleCheckboxChangeRamp}
                              />
                            }
                          />
                        </FormGroup>
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={!isCheckedRamp}
                          onChange={(event) => {
                            // if ((isCheckedRamp = false)) {
                            //   reset("noOfPodiumRamp");
                            // }
                          }}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          // label="parafeet wall height "
                          label={<FormattedLabel id="noOfPodiumRamp" />}
                          variant="standard"
                          {...register("noOfPodiumRamp")}
                          error={!!errors.noOfPodiumRamp}
                          helperText={
                            errors?.noOfPodiumRamp
                              ? errors.noOfPodiumRamp.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={!isCheckedRamp}
                          onChange={(event) => {
                            // if ((isCheckedRamp = false)) {
                            //   reset("noOfPodiumRamp");
                            // }
                          }}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          // label="parafeet wall height "
                          label={<FormattedLabel id="podiumRampWidth" />}
                          variant="standard"
                          {...register("podiumRampWidth")}
                          error={!!errors.podiumRampWidth}
                          helperText={
                            errors?.podiumRampWidth
                              ? errors.podiumRampWidth.message
                              : null
                          }
                        />
                      </Grid>

                      {/* new fields end */}

                      {/* <Grid item xs={4} className={styles.feildres}></Grid> */}

                      {/* <Grid item xs={4} className={styles.feildres}>
                          <TextField
                            sx={{ width: "80%" }}
                            id="standard-basic"
                            label="Site Address"
                            variant="standard"
                            {...register("siteAddress")}
                            error={!!errors.noOfApprochedRoad}
                            helperText={
                              errors?.noOfApprochedRoad
                                ? errors.noOfApprochedRoad.message
                                : null
                            }
                          />
                        </Grid> */}

                      {/* <Grid
                          item
                          xs={4}
                          className={styles.feildres}
                          // sx={{ margin: "2%", marginRight: 95 }}
                        >
                          <FormGroup>
                            <FormControlLabel
                              sx={{ marginRight: "75vw" }}
                              label={
                                <FormattedLabel id="buildingIsConnectedOrNot" />
                              }
                              control={<Checkbox />}
                            />
                          </FormGroup>
                        </Grid> */}
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
                                        {/* <Box className={styles.feildHead}>
                                            {btnSaveText == "Update"
                                              ? "Update Floor Details"
                                              : "Floor Details"}
                                          </Box> */}
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
                                            {...register("grossBuiltUpAreaF")}
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
                                            {...register("netBuiltUpAreaF")}
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
                                                        {/* <Box
                                                          className={
                                                            styles.tableHead
                                                          }
                                                        >
                                                          <Box
                                                            className={
                                                              styles.feildHead
                                                            }
                                                          >
                                                            {btnSaveText ==
                                                            "Update"
                                                              ? "Update Types "
                                                              : "Types"}
                                                          </Box>
                                                        </Box> */}
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
                                                                    // onChange={(
                                                                    //   value
                                                                    // ) => {
                                                                    //   field.onChange(
                                                                    //     value
                                                                    //   ),
                                                                    //     // getZoneWardID();
                                                                    //   // getTypeNameKeys();
                                                                    // }}
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

                                                        {/* //////////////// */}

                                                        {/* <Grid
                                            item
                                            xs={4}
                                            className={styles.feildres}
                                          >
                                            <TextField
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
                                          </Grid> */}

                                                        {/* <Grid
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
                                          </Grid> */}

                                                        {/* <Grid
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
                                          </Grid> */}

                                                        {/* <Grid
                                            item
                                            xs={4}
                                            className={styles.feildres}
                                          >
                                            <TextField
                                              sx={{ width: "80%" }}
                                              id="standard-basic"
                                              label="Occupancy Type"
                                              variant="standard"
                                              {...register("occupancyTypes")}
                                              onChange={(event) => {
                                                if (occupancyTypes !== "") {
                                                  setOccupancyTypes("");
                                                }
                                              }}
                                              helperText={
                                                <p className={styles.error}>
                                                  {occupancyTypes}
                                                </p>
                                              }
                                            />
                                          </Grid> */}

                                                        {/* <Grid
                                            item
                                            xs={4}
                                            className={styles.feildres}
                                          >
                                            <TextField
                                              sx={{ width: "80%" }}
                                              id="standard-basic"
                                              label="Building Classification"
                                              variant="standard"
                                              {...register(
                                                "buildingClassification"
                                              )}
                                              onChange={(event) => {
                                                if (
                                                  buildingClassification !== ""
                                                ) {
                                                  setBuildingClassification("");
                                                }
                                              }}
                                              helperText={
                                                <p className={styles.error}>
                                                  {buildingClassification}
                                                </p>
                                              }
                                            />
                                          </Grid> */}

                                                        {/* no of ref area */}
                                                        {/* <Grid
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
                                          </Grid> */}

                                                        {/* refused area in sq.mtr */}
                                                        {/* <Grid
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
                                              {...register(
                                                "refusedAreaInSqMtr"
                                              )}
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
                                          </Grid> */}

                                                        {/* <br />
                                        <br /> */}

                                                        {/* <div></div> */}
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
                                                                // saveMultipleType();
                                                                // handleFloorAddOrEdit();
                                                                // handleClickForFloor();
                                                                // saveFloorDetails();
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

                                                          <Grid item>
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
                                                          </Grid>

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
                                                  // reset({
                                                  //   ...resetValuesExit,
                                                  // });
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
                                              // componentsProps={{
                                              //   toolbar: {
                                              //     showQuickFilter: true,
                                              //     quickFilterProps: {
                                              //       debounceMs: 500,
                                              //     },
                                              //     printOptions: {
                                              //       disableToolbarButton: true,
                                              //     },
                                              //     csvOptions: {
                                              //       disableToolbarButton: true,
                                              //     },
                                              //   },
                                              // }}
                                              // components={{
                                              //   Toolbar: GridToolbar,
                                              // }}
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
                                              // rows={
                                              //   getValues(
                                              //     `buildingDTLDao?.${getValues(
                                              //       "selectedBuilding"
                                              //     )}?.floorDTLDao`
                                              //   )
                                              //     ? getValues(
                                              //         `buildingDTLDao?.${getValues(
                                              //           "selectedBuilding"
                                              //         )}?.floorDTLDao`
                                              //       )?.map((rec, ind) => {
                                              //         return {
                                              //           ...rec,
                                              //           srNo: ind + 1,
                                              //         };
                                              //       })
                                              //     : []
                                              // }
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

                                              // handleFloorAddOrEdit();
                                              // saveFloorDetails();
                                              // handleClickForFloor();
                                              // saveFloorDetails();
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
                                            endIcon={<ClearIcon />}
                                            onClick={() => cancellButton()}
                                          >
                                            {<FormattedLabel id="clear" />}
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
                      {/* <Grid item>
                        <Button
                          size='small'
                          variant='outlined'
                          className={styles.button}
                          endIcon={<ClearIcon />}
                          onClick={() => clearBuildingDetails()}
                        >
                          {<FormattedLabel id='clear' />}
                        </Button>
                      </Grid> */}
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
            // rows={
            //   watch("FinalFloorDetailsTable")
            //     ? watch("FinalFloorDetailsTable")
            //     : []
            // }
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
