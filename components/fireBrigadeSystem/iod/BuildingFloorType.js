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
import {
  Controller,
  FormProvider,
  useFieldArray,
  useFormContext,
} from "react-hook-form";

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
  Typography,
} from "@mui/material";
import { GridToolbar } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../styles/fireBrigadeSystem/view.module.css";
import urls from "../../../URLS/urls";
import { SignalCellularNull, Visibility } from "@mui/icons-material";
import swal from "sweetalert";

/** Sachin Durge */
// BuildingDetails

const Index = ({ view = false }) => {
  const router = useRouter();
  const {
    register,
    control,
    getValues,
    setValue,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useFormContext();

  const [floorHeight, setFloorHeight] = useState(" ");
  const [isChecked, setIsChecked] = useState(false);
  const [isCheckedLift, setIsCheckedLift] = useState(false);
  const [isCheckedBasement, setIsCheckedBasement] = useState(false);
  const [isCheckedRamp, setIsCheckedRamp] = useState(false);
  const [noOfVentilation, setNoOfVentilation] = useState();
  const [grossBuiltUpArea, setGrossBuiltUpArea] = useState();
  const [netBuiltUpArea, setNetBuiltUpArea] = useState();
  const [occupancyTypes, setOccupancyTypes] = useState();
  const [buildingClassification, setBuildingClassification] = useState();
  const [noOfRefArea, setNoOfRefArea] = useState();
  const [refusedAreaInSqMtr, setRefusedAreaInSqMtr] = useState();
  //buildingValidation useState
  const [buildingName, setBuildingName] = useState();

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

  // getBuildingTypes
  const getBuildingTypes = () => {
    axios
      .get(`${urls.FbsURL}/typeOfBuildingMaster/getTypeOfBuildingMaster`)
      .then((res) => {
        setBuildingTypes(res?.data);
      })
      .catch((err) => console.log(err));
  };
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked ? true : false);
    if ((event.target.checked = true)) {
      reset({
        noOfFireStairCase: "",
        widthOfFireStairCase: "",
      });
    }
  };

  const onSubmit = (data) => {
    console.log(data);
  };
  const handleCheckboxChangeLift = (event) => {
    setIsCheckedLift(event.target.checked ? true : false);
    if ((event.target.checked = true)) {
      reset({
        noOfFireLift: "",
        capacityOfFireLift: "",
      });
    }
  };

  const handleCheckboxChangeBasement = (event) => {
    setIsCheckedBasement(event.target.checked ? true : false);
    if ((event.target.checked = true)) {
      reset({
        noOfBasement: "",
        distanceFromBuildingToOpenSpace: "",
      });
    }
  };

  const handleCheckboxChangeRamp = (event) => {
    setIsCheckedRamp(event.target.checked ? true : false);
    if ((event.target.checked = true)) {
      reset({
        noOfPodiumRamp: "",
        podiumRampWidth: "",
      });
    }
  };

  // area
  const getArea = () => {
    axios
      .get(`${urls.CFCURL}/master/area/getAll`)
      .then((res) => setArea(res?.data?.area))
      .catch((err) => console.log(err));
  };

  // saveBuildingDetails
  const saveBuildingDetails = () => {
    const buildingDTLDao = [
      ...(getValues("buildingDTLDao") ? getValues("buildingDTLDao") : []),
      {
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
      },
    ];

    const body = {
      ...getValues(),
      buildingDTLDao,
      id: getValues("provisionalBuildingNocId"),

      index: getValues("buildingDTLDao")?.length,
    };

    axios
      .post(`${urls.FbsURL}/transaction/provisionalBuildingFireNOC/save`, body)
      .then((res) => {
        if (res.status == 200) {
          console.log("2323", res);
          let appId = res?.data?.status?.split("$")[1];
          console.log("provisionalBuildingNocId", appId);
          setValue("provisionalBuildingNocId", appId);
          sweetAlert("Saved!", "Record Saved successfully !", "success");
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      });
  };

  const getTotal = (array, key) => {
    return array.reduce((total, item) => total + parseFloat(item[key] || 0), 0);
  };

  const buildingsNetBuiltUpArea = watch("buildings", []).reduce(
    (total, building) => total + getTotal(building.floors, "netBuiltUpArea"),
    0
  );

  const buildingsGrossBuiltUpArea = watch("buildings", []).reduce(
    (total, building) => total + getTotal(building.floors, "grossBuiltUpArea"),
    0
  );

  const floorsNetBuiltUpArea = (floors) => getTotal(floors, "netBuiltUpArea");
  const floorsGrossBuiltUpArea = (floors) =>
    getTotal(floors, "grossBuiltUpArea");

  // const handleFloorAddOrEdit = () => {

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

    if (
      floorHeight === "" &&
      noOfVentilation === "" &&
      grossBuiltUpArea === "" &&
      netBuiltUpArea === "" &&
      occupancyTypes === "" &&
      buildingClassification === "" &&
      noOfRefArea === "" &&
      refusedAreaInSqMtr === ""
    ) {
      setFloorHeight("Please enter floorHeight");
    }
    //   if (floorHeight === "") {
    //     setFloorHeight("Please enter floorHeight");
    //   }
    // if (noOfVentilation === "") {
    //   setNoOfVentilation("Please enter no Of Ventilation");
    // }
    // if (grossBuiltUpArea === "") {
    //   setGrossBuiltUpArea("Please enter grossBuilt Up Area");
    // }
    // if (netBuiltUpArea === "") {
    //   setNetBuiltUpArea("Please enter netBuiltUp Area");
    // }
    // if (occupancyTypes === "") {
    //   setOccupancyTypes("Please enter occupancy Types");
    // }
    // if (buildingClassification === "") {
    //   setBuildingClassification("Please enter building Classification ");
    // }
    // if (noOfRefArea === "") {
    //   setNoOfRefArea("Please enter no OfRef Area");
    // }
    // if (refusedAreaInSqMtr === "") {
    //   setRefusedAreaInSqMtr("Please enter refused Area InSqMtr");
    // }
    else {
      console.log();
      let _buildingIndex = watch("buildingDTLDao")
        ? watch("buildingDTLDao")?.length
        : 0;
      console.log("_buildingIndex", _buildingIndex);

      // setSelectedBuildingIndex(_buildingIndex);
      // setValue(
      //   "floorDTLDao",
      //   getValues("buildingDTLDao")?.[_buildingIndex]?.floorDTLDao
      //     ? getValues("buildingDTLDao")?.[_buildingIndex]?.floorDTLDao
      //     : []
      // );

      // setDataSource(
      //   getValues("buildingDTLDao")?.[_buildingIndex]?.floorDTLDao
      //     ? getValues("buildingDTLDao")?.[_buildingIndex]?.floorDTLDao
      //     : []
      // );

      const floorDTLDao = [
        ...(getValues(`buildingDTLDao.[${_buildingIndex}].floorDTLDao`)
          ? getValues(`buildingDTLDao.[${_buildingIndex}].floorDTLDao`)
          : []),
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

      const buildingDTLDao = [
        ...watch("buildingDTLDao")?.filter((x, ii) => ii != _buildingIndex),
        {
          ...watch("buildingDTLDao")?.filter((x, ii) => ii == _buildingIndex),
          floorDTLDao,
        },
      ];

      const body = {
        ...getValues(),
        buildingDTLDao,
        id: getValues("provisionalBuildingNocId"),
      };

      axios
        .post(
          `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/save`,
          body
        )
        .then((res) => {
          if (res.status == 200) {
            console.log("2323", res);
            let appId = res?.data?.status?.split("$")[1];
            console.log("provisionalBuildingNocId", appId);
            setValue("provisionalBuildingNocId", appId);
            sweetAlert("Saved!", "Record Saved successfully !", "success");
            setButtonInputStates(false);
            setIsOpenCollapses(false);
          }
        });
    }
  };

  //BuildingValidation

  const handleClickForBuilding = () => {
    const buildingName = watch("buildingName");
    const buildingHeightFromGroundFloorInMeter = watch(
      "buildingHeightFromGroundFloorInMeter"
    );
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

    if (buildingName === "") {
      setBuildingName("Please enter floorHeight");
    }
    if (buildingHeightFromGroundFloorInMeter === "") {
      setBuildingHeightFromGroundFloorInMeter("Please enter no Of Ventilation");
    }
    if (noOfBasement === "") {
      setNoOfBasement("Please enter grossBuilt Up Area");
    }
    if (volumeLBHIn === "") {
      setVolumeLBHIn("Please enter netBuiltUp Area");
    }
    if (noOfFloor === "") {
      setNoOfFloor("Please enter occupancy Types");
    }
    if (buildingHeightH1 === "") {
      setBuildingHeightH1("Please enter building Classification ");
    }
    if (buildingHeightH2 === "") {
      setBuildingHeightH2("Please enter no OfRef Area");
    }
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
    } else {
      saveBuildingDetails();
      // saveFloorDetails();
      // saveOwner();
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
            `${urls.BaseURL}/typsetSelectedBuildingIndexeOfNOCMaster/discardTypeOfNOCMaster/${value}`
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

  useEffect(() => {
    console.log("shree22", watch("buildingDTLDao"));

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

  // columnsF
  const columnsT = [
    {
      field: "srNo",
      headerName: "Sr No.",
      flex: 1,
    },
    {
      field: "floorHeight",
      headerName: "Floor Height",
      flex: 1,
    },
    {
      field: "netBuiltUpArea",
      headerName: "net BuiltUp Area",
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
      field: "occupancyTypes",
      headerName: "Occupancy Types",
      flex: 1,
    },
    {
      field: "buildingClassification",
      headerName: "Building Classification",
      flex: 1,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        console.log("params", params.row);
        return (
          <>
            <IconButton
              disabled={viewButtonInputState}
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

  // columnsT
  const columnsF = [
    {
      field: "srNo",
      headerName: "Sr No.",
      flex: 1,
    },
    {
      field: "floorHeight",
      headerName: "Occupancy Type",
      flex: 1,
    },
    {
      field: "netBuiltUpArea",
      headerName: "net BuiltUp Area",
      flex: 1,
    },
    {
      field: "grossBuiltUpArea",
      headerName: "Gross BuiltUp Area",
      flex: 1,
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        console.log("params", params.row);
        return (
          <>
            <IconButton
              disabled={viewButtonInputState}
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

  const columns = [
    {
      field: "srNo",
      headerName: "Sr No.",

      flex: 1,
    },
    {
      field: "buildingName",
      headerName: "Building Name",

      flex: 1,
    },
    {
      field: "siteAddress",
      headerName: "Site Address",

      flex: 1,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
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
                // reset(params.row);
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

  const buttonValueSetFun = () => {
    if (getValues(`sportsBookingGroupDetailsDao.length`) >= 3) {
      //   setButtonValue(true);
    } else {
      appendFun();
      // reset();
      //   setButtonValue(false);
    }
  };

  const appendFun = () => {
    append({
      title: "",
      prState: "",
      prCityName: "",
      permanentAddress: "",
      crState: "",
      crCityName: "",
      currentAddress: "",
      emailAddress: "",
      aadharNo: "",
      mobile: "",
      age: "",
      applicantLastName: "",
      applicantMiddleName: "",
      applicantFirstName: "",
      dateOfBirth: null,
    });
  };

  //key={field.id}
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "sportsBookingGroupDetailsDao", // unique name for your Field Array
    }
  );

  //useEffect
  useEffect(() => {
    if (getValues(`sportsBookingGroupDetailsDao.length`) == 0) {
      appendFun();
    }
  }, []);

  // view
  return (
    <>
      {fields.map((sportsBookingGroupDetailsDao, index) => {
        return (
          <>
            <div
              className={styles.row}
              // style={{
              //   height: '7px',
              //   width: '200px',
              // }}
            >
              <div
                className={styles.details}
                style={{
                  marginRight: "820px",
                }}
              >
                <div
                  className={styles.h1Tag}
                  style={{
                    height: "40px",
                    width: "30px",
                  }}
                >
                  <h3
                    style={{
                      color: "black",
                      marginTop: "7px",
                    }}
                  >
                    Member
                    {`: ${index + 1}`}
                  </h3>
                </div>
              </div>
            </div>
            <Grid
              container
              sx={{
                marginLeft: 5,
                marginTop: 1,
                marginBottom: 5,
                align: "center",
              }}
            >
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="firstName" />}
                  key={sportsBookingGroupDetailsDao.id}
                  {...register(
                    `sportsBookingGroupDetailsDao.${index}.applicantFirstName`
                  )}
                  error={!!errors.applicantFirstName}
                  helperText={
                    errors?.applicantFirstName
                      ? errors.applicantFirstName.message
                      : null
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  id="standard-basic"
                  label={<FormattedLabel id="middleName" />}
                  key={sportsBookingGroupDetailsDao.id}
                  {...register(
                    `sportsBookingGroupDetailsDao.${index}.applicantMiddleName`
                  )}
                  error={!!errors.applicantMiddleName}
                  helperText={
                    errors?.applicantMiddleName
                      ? errors.applicantMiddleName.message
                      : null
                  }
                />
              </Grid>
            </Grid>
          </>
        );
      })}
      <div className={styles.row} style={{ marginTop: 50 }}>
        <Button onClick={() => buttonValueSetFun()} variant="contained">
          Add Building
        </Button>
      </div>
    </>
    // <form onSubmit={handleSubmit(onSubmit)}>
    //   {fields.map((building, index) => (
    //     <div key={building.id}>
    //       <Typography variant="h6" component="h2">
    //         Building {index + 1}
    //       </Typography>
    //       <TextField
    //         {...control.register(`buildings.${index}.buildingName`)}
    //         label="Building Name"
    //       />
    //       <TextField
    //         {...control.register(`buildings.${index}.buildingHeight`)}
    //         label="Building Height"
    //       />
    //       <TextField
    //         {...control.register(`buildings.${index}.netBuiltUpArea`)}
    //         label="Net Built Up Area"
    //       />
    //       <TextField
    //         {...control.register(`buildings.${index}.grossBuiltUpArea`)}
    //         label="Gross Built Up Area"
    //       />

    //       <Typography variant="h6" component="h3">
    //         Floors
    //       </Typography>
    //       {building.floors.map((floor, floorIndex) => (
    //         <div key={floor.id}>
    //           <Typography variant="subtitle1" component="h4">
    //             Floor {floorIndex + 1}
    //           </Typography>
    //           <TextField
    //             {...control.register(
    //               `buildings.${index}.floors.${floorIndex}.floorNo`
    //             )}
    //             label="Floor No"
    //           />
    //           <TextField
    //             {...control.register(
    //               `buildings.${index}.floors.${floorIndex}.floorHeight`
    //             )}
    //             label="Floor Height"
    //           />
    //           <TextField
    //             {...control.register(
    //               `buildings.${index}.floors.${floorIndex}.netBuiltUpArea`
    //             )}
    //             label="Net Built Up Area"
    //           />
    //           <TextField
    //             {...control.register(
    //               `buildings.${index}.floors.${floorIndex}.grossBuiltUpArea`
    //             )}
    //             label="Gross Built Up Area"
    //           />

    //           <Typography variant="h6" component="h5">
    //             Occupancy Types
    //           </Typography>
    //           {floor.occupancyTypes.map((occupancyType, typeIndex) => (
    //             <div key={occupancyType.id}>
    //               <Typography variant="subtitle2" component="h6">
    //                 Occupancy Type {typeIndex + 1}
    //               </Typography>
    //               <FormControl>
    //                 <InputLabel
    //                   id={`buildings[${index}].floors[${floorIndex}].occupancyTypes[${typeIndex}].occupancyType-label`}
    //                 >
    //                   Occupancy Type
    //                 </InputLabel>
    //                 <Controller
    //                   control={control}
    //                   name={`buildings.${index}.floors.${floorIndex}.occupancyTypes.${typeIndex}.occupancyType`}
    //                   defaultValue=""
    //                   render={({ field }) => (
    //                     <Select
    //                       {...field}
    //                       labelId={`buildings[${index}].floors[${floorIndex}].occupancyTypes[${typeIndex}].occupancyType-label`}
    //                       label="Occupancy Type"
    //                     >
    //                       <MenuItem value="residential">Residential</MenuItem>
    //                       <MenuItem value="commercial">Commercial</MenuItem>
    //                       <MenuItem value="industry">Industry</MenuItem>
    //                     </Select>
    //                   )}
    //                 />
    //               </FormControl>
    //               <TextField
    //                 {...control.register(
    //                   `buildings.${index}.floors.${floorIndex}.occupancyTypes.${typeIndex}.netBuiltUpArea`
    //                 )}
    //                 label="Net Built Up Area"
    //               />
    //               <TextField
    //                 {...control.register(
    //                   `buildings.${index}.floors.${floorIndex}.occupancyTypes.${typeIndex}.grossBuiltUpArea`
    //                 )}
    //                 label="Gross Built Up Area"
    //               />
    //             </div>
    //           ))}
    //         </div>
    //       ))}
    //       <Button type="button" onClick={() => append({ floors: [] })}>
    //         Add Floor
    //       </Button>
    //       <Button type="button" onClick={() => remove(index)}>
    //         Remove Building
    //       </Button>
    //     </div>
    //   ))}

    //   <Button type="submit"> Add Building</Button>
    // </form>
  );
};

export default Index;
