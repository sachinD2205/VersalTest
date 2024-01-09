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

/** Sachin Durge */
// BuildingDetails

const Index = ({ view = false }) => {
  const router = useRouter();
  const {
    control,
    register,
    getValues,
    setValue,
    watch,
    reset,
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
                    <Paper
                      sx={{
                        padding: 2,
                        backgroundColor: "#F5F5F5",
                      }}
                      elevation={5}
                    >
                      <Box className={styles.tableHead}>
                        <Box className={styles.feildHead}>
                          {btnSaveText == "Update"
                            ? "Update Buliding Details"
                            : "Buliding Details"}
                        </Box>
                      </Box>

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
                                        <Box className={styles.tableHead}>
                                          <Box className={styles.feildHead}>
                                            {btnSaveText == "Update"
                                              ? "Update Floor Details"
                                              : "Floor Details"}
                                          </Box>
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
                                        </Grid>

                                        {/* floor form */}
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
                                                          flexDirection:
                                                            "column",
                                                          justifyContent:
                                                            "center",
                                                        }}
                                                      >
                                                        <Paper
                                                          sx={{
                                                            margin: 1,
                                                            padding: 2,
                                                            backgroundColor:
                                                              "#F5F5F5",
                                                          }}
                                                          elevation={5}
                                                        >
                                                          <Box
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
                                                          </Box>

                                                          {/* <br /> */}

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
                                                          >
                                                            <Grid
                                                              item
                                                              xs={4}
                                                              className={
                                                                styles.feildres
                                                              }
                                                            >
                                                              <TextField
                                                                sx={{
                                                                  width: "80%",
                                                                }}
                                                                id="standard-basic"
                                                                label="Types"
                                                                variant="standard"
                                                                {...register(
                                                                  "types"
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
                                                                    {
                                                                      floorHeight
                                                                    }
                                                                  </p>
                                                                }
                                                              />
                                                            </Grid>
                                                          </Grid>

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
                                                                  saveMultipleType();
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
                                              <Box className={styles.tableHead}>
                                                <Box className={styles.h1Tag}>
                                                  Types
                                                </Box>
                                              </Box>

                                              <Box>
                                                <Button
                                                  variant="contained"
                                                  type="primary"
                                                  disabled={
                                                    buttonInputStatesType
                                                  }
                                                  onClick={() => {
                                                    // reset({
                                                    //   ...resetValuesExit,
                                                    // });
                                                    setEditButtonInputState(
                                                      true
                                                    );
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
                                            </Box>
                                            <Box>
                                              <DataGrid
                                                getRowId={(row) => row.srNo}
                                                disableColumnFilter
                                                disableColumnSelector
                                                disableExport
                                                componentsProps={{
                                                  toolbar: {
                                                    showQuickFilter: true,
                                                    quickFilterProps: {
                                                      debounceMs: 500,
                                                    },
                                                    printOptions: {
                                                      disableToolbarButton: true,
                                                    },
                                                    csvOptions: {
                                                      disableToolbarButton: true,
                                                    },
                                                  },
                                                }}
                                                components={{
                                                  Toolbar: GridToolbar,
                                                }}
                                                autoHeight
                                                density="compact"
                                                sx={{
                                                  backgroundColor: "white",
                                                  paddingLeft: "2%",
                                                  paddingRight: "2%",
                                                  boxShadow: 2,
                                                  border: 1,
                                                  borderColor: "primary.light",
                                                  "& .MuiDataGrid-cell:hover":
                                                    {},
                                                  "& .MuiDataGrid-row:hover": {
                                                    backgroundColor: "#E1FDFF",
                                                  },
                                                  "& .MuiDataGrid-columnHeadersInner":
                                                    {
                                                      backgroundColor:
                                                        "#87E9F7",
                                                    },
                                                }}
                                                rows={
                                                  getValues(
                                                    `buildingDTLDao?.${getValues(
                                                      "selectedBuilding"
                                                    )}?.floorDTLDao`
                                                  )
                                                    ? getValues(
                                                        `buildingDTLDao?.${getValues(
                                                          "selectedBuilding"
                                                        )}?.floorDTLDao`
                                                      )?.map((rec, ind) => {
                                                        return {
                                                          ...rec,
                                                          srNo: ind + 1,
                                                        };
                                                      })
                                                    : []
                                                }
                                                columns={columnsF}
                                                pageSize={7}
                                                rowsPerPageOptions={[7]}
                                              />
                                            </Box>
                                          </Box>
                                        </Grid>

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
                                              onClick={handleClickForFloor}
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
                            <Box className={styles.tableHead}>
                              <Box className={styles.h1Tag}>Floor Details</Box>
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
                                  console.log(
                                    "floor tab colab",
                                    isOpenCollapse
                                  );
                                  setIsOpenCollapses(!isOpenCollapses);
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
                          </Box>
                          <Box>
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
                                paddingLeft: "2%",
                                paddingRight: "2%",
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
                                getValues(
                                  `buildingDTLDao?.${getValues(
                                    "selectedBuilding"
                                  )}?.floorDTLDao`
                                )
                                  ? getValues(
                                      `buildingDTLDao?.${getValues(
                                        "selectedBuilding"
                                      )}?.floorDTLDao`
                                    )?.map((rec, ind) => {
                                      return { ...rec, srNo: ind + 1 };
                                    })
                                  : []
                              }
                              columns={columnsT}
                              pageSize={7}
                              rowsPerPageOptions={[7]}
                            />
                          </Box>
                        </Box>
                      </Grid>

                      {/* <br /> */}

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
                            onClick={() => exitFunction()}
                          >
                            {<FormattedLabel id="exit" />}
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
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
              paddingLeft: "2%",
              paddingRight: "2%",
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
