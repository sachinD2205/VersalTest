import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {
  Box,
  Button,
  Checkbox,
  Drawer,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../URLS/urls";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../util/util";
let drawerWidth;

// Main
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
  }),
);

// DrawerHeader
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));
// Component
const PersonalDetails = () => {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const router = useRouter();
  const user = useSelector((state) => state?.user.user);
  const language = useSelector((state) => state?.labels.language);

  // React Hook Form
  const {
    control,
    register,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    if (router.query.pageMode === "Add" || router.query.pageMode === "Edit") {
    } else {
      console.log("disabled");
    }
  }, []);

  const [runAgain, setRunAgain] = useState(false);
  const [legend, setLegend] = useState("");
  const [landReservationTable, setLandReservationTable] = useState([]);
  const [legendDropDown, setLegendDropDown] = useState([]);
  const [villageDropDown, setVillageNameDropDown] = useState([]);
  const [selectedvillageDropDown, setSelectedvillageDropDown] = useState([]);
  const [zoneDropDown, setzoneDropDown] = useState([]);
  const [selectedzoneDropDown, setSelectedzoneDropDown] = useState([]);
  const [appropriateAuthorityDropDown, setAppropriateAuthorityDropDown] =
    useState([]);
  const [selectedVillage, setSelectedVillage] = useState([]);
  const [selectedGat, setSelectedGat] = useState([]);
  const [selectedZone, setSelectedZone] = useState([]);
  // const [hanadleVillage, setHanadleVillage] = useState([]);

  const [gatDropDown, setGatDropDown] = useState([
    {
      id: 1,
      gatNameEn: "",
      gatNameMr: "",
    },
  ]);
  const [wardKeys, setWardKeys] = useState([]);
  const [selectedwardKeys, setSelectedwardKeys] = useState([]);

  const [open, setOpen] = React.useState(false);

  const [roadType, setroadType] = useState([]);
  const [roadTypeConstr, setroadTypeConstr] = useState([]);
  const [allVillageName, setAllVillageName] = useState([]);
  const [allGatName, setAllGatName] = useState([]);
  //catch
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

  let isDisabled = false;
  useEffect(() => {
    //Village
    axios
      .get(`${urls.CFCURL}/master/village/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        console.log("Village data: ", r.data);
        setVillageNameDropDown(
          r.data.village.map((j) => ({
            id: j.id,
            villageNameEn: j.villageName,
            villageNameMr: j.villageNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    //Zone
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        console.log("Zone data:", r.data);
        setzoneDropDown(
          // @ts-ignore
          r.data.zone.map((j, i) => ({
            id: j.id,
            zoneNameEn: j.zoneName,
            zoneNameMr: j.zoneNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    //ward
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setWardKeys(
          r.data.ward.map((row) => ({
            id: row.id,
            wardName: row.wardName,
            wardNameMr: row.wardNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    //Legend
    axios
      .get(`${urls.TPURL}/reservationTypeMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        console.log("Reservation Type Master: ", res.data.reservationType);
        setLegendDropDown(
          res.data.reservationType.map((j, i) => ({
            srNo: i + 1,
            ...j,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    //Appropriate Authority
    axios
      .get(`${urls.TPURL}/appropriateAuthorityMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        console.log("Authority Master: ", res.data.appropriateAuthority);
        setAppropriateAuthorityDropDown(
          res.data.appropriateAuthority.map((j, i) => ({
            srNo: i + 1,
            ...j,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    //Gat
    axios
      .get(`${urls.TPURL}/master/mstGat/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        console.log("Gat data:11", r);
        setGatDropDown(
          r.data.mstGat.map((j, i) => ({
            id: j.id,

            gatNameEn: j.gatNameEn,
            gatNameMr: j.gatNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    //
    //road type
    axios
      .get(`${urls.TPURL}/roadTypeMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setroadType(
          res.data.roadType.map((j, i) => ({
            srNo: i + 1,
            ...j,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    //Road construction type
    axios
      .get(`${urls.TPURL}/mstRoadConstructionType/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setroadTypeConstr(
          res.data.roadConstructionType.map((j, i) => ({
            srNo: i + 1,
            ...j,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  }, []);

  const getFilteredVillage = () => {
    axios
      .post(
        `${urls.TPURL}/zoneVillageGatMapping/getAllByZoneId`,
        selectedZone,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((r) => {
        // console.log("Villageeeee ", r?.data ?.zoneVillageGatMappingDaoList,villageDropDown);
        setAllVillageName(
          r?.data?.zoneVillageGatMappingDaoList.map((j) => ({
            id: j.id,
            villageNameEn: villageDropDown?.find((i) => i.id == j.villageId)
              ?.villageNameEn,
            villageNameMr: villageDropDown?.find((i) => i.id == j.villageId)
              ?.villageNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  const getFilteredGat = () => {
    axios
      .post(
        `${urls.TPURL}/zoneVillageGatMapping/getAllByVillageId`,
        selectedVillage,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((r) => {
        setAllGatName(
          r?.data?.zoneVillageGatMappingDaoList.map((j) => ({
            id: j.id,
            gatNameEn: gatDropDown?.find((i) => i.id == j.gatId)?.gatNameEn,
            // gatNameEn: j.gatNameEn,
            gatNameMr: gatDropDown?.find((i) => i.id == j.gatId)?.gatNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    getFilteredVillage();
  }, [selectedZone]);
  useEffect(() => {
    getFilteredGat();
  }, [selectedVillage]);
  // console.log("watch(landReservationLegend)",watch("landReservationLegend"));

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    console.log("callllll", value);
    setSelectedzoneDropDown(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value,
    );
  };

  // **************multiple village start********************
  const handleSelectedVillage = (event, villageId) => {
    if (event.target.checked) {
      setSelectedVillage([...selectedVillage, villageId]);
    }
  };
  const handleSelectedGat = (event, gatId) => {
    if (event.target.checked) {
      setSelectedGat([...selectedGat, gatId]);
    }
  };
  const handleSelectedZone = (event, zoneId) => {
    if (event.target.checked) {
      setSelectedZone([...selectedZone, zoneId]);
    }
  };

  // **************multiple village end********************

  const handleChange2 = (event) => {
    const {
      target: { value },
    } = event;
    console.log("callllll", value);
    setSelectedvillageDropDown(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value,
    );
  };

  const handleChange3 = (event) => {
    const {
      target: { value },
    } = event;
    console.log("callllll", value);
    setSelectedwardKeys(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value,
    );
  };

  useEffect(() => {
    setRunAgain(false);

    axios
      .get(`${urls.TPURL}/reservationDetail/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        console.log("Table data: ", r.data);
        setLandReservationTable(
          r.data.reservationDetail.map((j, i) => ({
            id: j.id,
            srNo: i + 1,
            ...j,
            legend: legendDropDown?.find((obj) => {
              // @ts-ignore
              return obj.id === j.landReservationLegend;
              // @ts-ignore
            })?.legend,
            reservationNameEn: legendDropDown?.find((obj) => {
              // @ts-ignore
              return obj.id === j.landReservationLegend;
              // @ts-ignore
            })?.reservationNameEn,
            reservationNameMr: legendDropDown?.find((obj) => {
              // @ts-ignore
              return obj.id === j.landReservationLegend;
              // @ts-ignore
            })?.reservationNameMr,
            zoneNameEn: zoneDropDown.find((obj) => {
              // @ts-ignore
              return obj.id === j.zone;
              // @ts-ignore
            })?.zoneNameEn,
            zoneNameMr: zoneDropDown.find((obj) => {
              // @ts-ignore
              return obj.id === j.zone;
              // @ts-ignore
            })?.zoneNameMr,
            villageNameEn: villageDropDown.find((obj) => {
              // @ts-ignore
              return obj.id === j.village;
              // @ts-ignore
            })?.villageNameEn,
            villageNameMr: villageDropDown.find((obj) => {
              // @ts-ignore
              return obj.id === j.village;
              // @ts-ignore
            })?.villageNameMr,
            appropriateAuthorityEn: appropriateAuthorityDropDown.find((obj) => {
              // @ts-ignore
              return obj.id === j.appropriateAuthority;
              // @ts-ignore
            })?.authorityNameEn,
            appropriateAuthorityMr: appropriateAuthorityDropDown.find((obj) => {
              // @ts-ignore
              return obj.id === j.appropriateAuthority;
              // @ts-ignore
            })?.authorityNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  }, [runAgain, legendDropDown]);

  // Open Drawer
  const handleDrawerOpen = () => {
    setOpen(!open);
    drawerWidth = "50%";
  };

  // Close Drawer
  const handleDrawerClose = () => {
    setOpen(false);
    drawerWidth = 0;
  };

  useEffect(() => {
    console.log("aala village", selectedVillage);
    setValue("selectedVillages", selectedVillage.toString());
    setValue("selectedZones", selectedZone.toString());
    setValue("selectedGats", selectedGat.toString());
  }, [selectedVillage, selectedZone, selectedGat]);
  // view
  return (
    <>
      <Main>
        <Paper
          elevation={8}
          variant="outlined"
          sx={{
            border: 1,
            borderColor: "grey.500",
            marginLeft: "10px",
            marginRight: "10px",
            padding: 1,
          }}
        >
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "10px",
              background:
                "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <h2>Reservation Details</h2>
          </Box>

          <Box
            sx={{
              marginTop: 2,
            }}
          >
            <Grid container sx={{ padding: "10px" }}>
              {/* -------------------------zone start--------------------------- */}

              <Grid
                item
                xl={4}
                lg={4}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl
                  error={Boolean(errors.zoneId)}
                  variant="standard"
                  // sx={{ m: 1, minWidth: "50%", maxWidth: "50%" }}
                >
                  <InputLabel id="zoneId">
                    {language == "en" ? "Zone Name" : "झोनचे नाव"}
                    {/* <FormattedLabel id="zone" required /> */}
                  </InputLabel>
                  <Controller
                    name="zoneId"
                    control={control}
                    // rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        labelId="zoneId"
                        id="zoneId"
                        multiple
                        value={selectedZone}
                        onChange={(e) => {
                          onChange(handleSelectedZone(e, e.target.value));
                        }}
                        renderValue={(selected) =>
                          selected
                            .map(
                              (id) =>
                                zoneDropDown.find((zone) => zone.id === id)
                                  ?.zoneNameEn,
                            )
                            .join(", ")
                        }
                      >
                        {zoneDropDown.map((zone) => (
                          <MenuItem key={zone.id} value={zone.id}>
                            <Checkbox
                              checked={selectedZone.includes(zone.id)}
                              onChange={(e) => handleSelectedZone(e, zone.id)}
                            />
                            {language == "en"
                              ? zone.zoneNameEn
                              : zone.zoneNameMr}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.selectedVillage && (
                    <FormHelperText>
                      Please select at least one village
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* -------------------------zone end--------------------------- */}

              {/* -------------------------village start--------------------------- */}

              <Grid
                item
                xl={4}
                lg={4}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl
                  error={Boolean(errors.selectedVillage)}
                  variant="standard"
                  // sx={{ m: 1, minWidth: "50%", maxWidth: "50%" }}
                >
                  <InputLabel id="selectedVillage-label">
                    <FormattedLabel id="villageName" required />
                  </InputLabel>
                  <Controller
                    name="villageId"
                    control={control}
                    // rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        labelId="villageId"
                        id="villageId"
                        multiple
                        value={selectedVillage}
                        onChange={(e) => {
                          onChange(handleSelectedVillage(e, e.target.value));
                        }}
                        renderValue={(selected) =>
                          selected
                            .map(
                              (id) =>
                                allVillageName.find(
                                  (village) => village.id === id,
                                )?.villageNameEn,
                            )
                            .join(", ")
                        }
                      >
                        {allVillageName &&
                          allVillageName.map((village) => (
                            <MenuItem key={village.id} value={village.id}>
                              <Checkbox
                                checked={selectedVillage.includes(village.id)}
                                onChange={(e) =>
                                  handleSelectedVillage(e, village.id)
                                }
                              />
                              {language == "en"
                                ? village.villageNameEn
                                : village.villageNameMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  />
                  {errors.selectedVillage && (
                    <FormHelperText>
                      Please select at least one village
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* -------------------------village end--------------------------- */}

              {/* <Grid
                item
                xl={3}
                lg={3}
                md={6}
                sm={6}
                xs={12}
                p={1}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl
                  sx={{
                    marginTop: "2%",
                  }}
                  variant="standard"
                  error={!!errors.village}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="villageName" required />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: "230px" }}
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        // value={field.value}
                        // disabled={isDisabled}
                        value={selectedvillageDropDown}
                        onChange={handleChange2}
                        renderValue={(selected) => selected.join(", ")}
                        MenuProps={MenuProps}
                        label="village"
                      >
                        {villageDropDown &&
                          villageDropDown.map((name) => (
                            <MenuItem key={name.id} value={name.villageNameEn}>
                              <Checkbox
                                checked={
                                  selectedvillageDropDown.indexOf(
                                    name.villageNameEn,
                                  ) > -1
                                }
                              />
                              <ListItemText primary={name.villageNameEn} />
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="village"
                    control={control}
                    defaultValue={[]}
                  />
                  <FormHelperText>
                    {errors?.village ? errors.village.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid> */}

              <Grid
                item
                xl={3}
                lg={3}
                md={6}
                sm={6}
                xs={12}
                p={1}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl
                  sx={{ marginTop: "2%" }}
                  variant="standard"
                  // error={!!errors.gatName}
                  error={Boolean(errors.gatName)}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="gatNo" />
                  </InputLabel>
                  <Controller
                    render={({ field: { onChange, value } }) => (
                      <Select
                        labelId="gatId"
                        id="gatId"
                        multiple
                        value={selectedGat}
                        onChange={(e) => {
                          onChange(handleSelectedGat(e, e.target.value));
                        }}
                        renderValue={(selected) =>
                          selected
                            .map(
                              (id) =>
                                allGatName.find((gat) => gat.id === id)
                                  ?.gatNameEn,
                            )
                            .join(", ")
                        }
                      >
                        {allGatName &&
                          allGatName.map((gat) => (
                            <MenuItem key={gat.id} value={gat.id}>
                              <Checkbox
                                checked={selectedGat.includes(gat.id)}
                                onChange={(e) => handleSelectedGat(e, gat.id)}
                              />
                              {language == "en" ? gat.gatNameEn : gat.gatNameEn}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="gatId"
                    control={control}
                    // defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.gatName ? errors.gatName.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid
                item
                xl={3}
                lg={3}
                md={6}
                sm={6}
                xs={12}
                p={1}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  sx={{
                    width: "230px",
                    marginTop: "2%",
                  }}
                  id="standard-basic"
                  label={<FormattedLabel id="surveyNo" required />}
                  variant="standard"
                  {...register("surveyNo")}
                  error={!!errors.surveyNo}
                  helperText={errors?.surveyNo ? errors.surveyNo.message : null}
                  disabled={isDisabled}
                  name="surveyNo"
                />
              </Grid>

              <Grid
                item
                xl={3}
                lg={3}
                md={6}
                sm={6}
                xs={12}
                p={1}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  sx={{
                    width: "230px",
                    marginTop: "2%",
                  }}
                  id="standard-basic"
                  label="City survey No"
                  // label={<FormattedLabel id="surveyNo" required />}
                  variant="standard"
                  {...register("citySurveyNo")}
                  error={!!errors.citySurveyNo}
                  helperText={
                    errors?.citySurveyNo ? errors.citySurveyNo.message : null
                  }
                  disabled={isDisabled}
                />
              </Grid>

              <Grid
                item
                xl={3}
                lg={3}
                md={6}
                sm={6}
                xs={12}
                p={1}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  sx={{
                    width: "230px",
                    marginTop: "2%",
                  }}
                  id="standard-basic"
                  label={<FormattedLabel id="landReservationNo" required />}
                  variant="standard"
                  name="landReservationNo"
                  {...register("landReservationNo")}
                  error={!!errors.landReservationNo}
                  helperText={
                    errors?.landReservationNo
                      ? errors.landReservationNo.message
                      : null
                  }
                />
              </Grid>

              <Grid
                item
                xl={3}
                lg={3}
                md={6}
                sm={6}
                xs={12}
                p={1}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl
                  sx={{ width: "230px", marginTop: "2%" }}
                  variant="standard"
                  error={!!errors.landReservationLegend}
                >
                  <InputLabel
                    id="demo-simple-select-standard-label"
                    disabled={isDisabled}
                  >
                    <FormattedLabel id="landReservationLegend" required />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        // value={field.value}
                        disabled={isDisabled}
                        value={
                          router.query.landReservationLegend
                            ? router.query.landReservationLegend
                            : field.value
                        }
                        onChange={(value) => {
                          field.onChange(value);
                          setLegend(value.target.value);
                        }}
                        label="landReservationLegend"
                      >
                        {legendDropDown &&
                          legendDropDown.map((value, index) => (
                            <MenuItem
                              key={index}
                              value={
                                // @ts-ignore
                                value?.id
                              }
                            >
                              {
                                // @ts-ignore
                                value?.legend
                              }
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="landReservationLegend"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.landReservationLegend
                      ? errors.landReservationLegend.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid
                item
                xl={3}
                lg={3}
                md={6}
                sm={6}
                xs={12}
                p={1}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  sx={{
                    width: "230px",
                    marginTop: "2%",
                  }}
                  id="standard-basic"
                  // reservationNameEn="reservationNameEn"
                  label={<FormattedLabel id="reservationNameEn" />}
                  variant="standard"
                  {...register("reservationNameEn")}
                  // name="reservationNameEn"
                  error={!!errors.reservationNameEn}
                  helperText={
                    errors?.reservationNameEn
                      ? errors.reservationNameEn.message
                      : null
                  }
                  // InputLabelProps={{ shrink: legend ? true : false }}

                  value={
                    legend
                      ? legendDropDown.find((obj) => {
                          // @ts-ignore
                          return obj?.id === legend;
                          // @ts-ignore
                        })?.reservationNameEn
                      : ""
                  }
                />
              </Grid>

              <Grid
                item
                xl={3}
                lg={3}
                md={6}
                sm={6}
                xs={12}
                p={1}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  sx={{
                    width: "230px",
                    marginTop: "2%",
                  }}
                  id="standard-basic"
                  label={<FormattedLabel id="reservationNameMr" />}
                  variant="standard"
                  // name="reservationNameMr"
                  // name="reservationNameMr"
                  {...register("reservationNameMr")}
                  error={!!errors.reservationNameMr}
                  helperText={
                    errors?.reservationNameMr
                      ? errors.reservationNameMr.message
                      : null
                  }
                  // InputLabelProps={{ shrink: legend ? true : false }}

                  value={
                    legend
                      ? legendDropDown.find((obj) => {
                          // @ts-ignore
                          return obj?.id === legend;
                          // @ts-ignore
                        })?.reservationNameMr
                      : ""
                  }
                />
              </Grid>

              {/* Land resrvation details start */}
              {watch("landReservationLegend") &&
                watch("landReservationLegend") == 1 && (
                  <>
                    <Grid
                      item
                      xl={3}
                      lg={3}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{
                          width: "230px",
                          marginTop: "2%",
                        }}
                        id="standard-basic"
                        label={<FormattedLabel id="roadLength" required />}
                        variant="standard"
                        {...register("roadLength")}
                        error={!!errors.roadLength}
                        name="roadLength"
                        helperText={
                          errors?.roadLength ? errors.roadLength.message : null
                        }
                        disabled={isDisabled}
                      />
                    </Grid>

                    <Grid
                      item
                      xl={3}
                      lg={3}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{
                          width: "230px",
                          marginTop: "2%",
                        }}
                        id="standard-basic"
                        label={<FormattedLabel id="roadWidth" required />}
                        variant="standard"
                        {...register("roadWidth")}
                        error={!!errors.roadWidth}
                        name="roadWidth"
                        helperText={
                          errors?.roadWidth ? errors.roadWidth.message : null
                        }
                        disabled={isDisabled}
                      />
                    </Grid>

                    <Grid
                      item
                      xl={3}
                      lg={3}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{
                          width: "230px",
                          marginTop: "2%",
                        }}
                        id="standard-basic"
                        label={<FormattedLabel id="roadNumber" required />}
                        variant="standard"
                        {...register("roadNo")}
                        name="roadNo"
                        error={!!errors.roadNo}
                        helperText={
                          errors?.roadNo ? errors.roadNo.message : null
                        }
                        disabled={isDisabled}
                      />
                    </Grid>

                    <Grid
                      item
                      xl={3}
                      lg={3}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {/* <TextField
                        sx={{
                          width: "230px",
                          marginTop: "2%",
                        }}
                        id="standard-basic"
                        label={<FormattedLabel id="RoadType" required />}
                        variant="standard"
                        {...register("roadType")}
                        error={!!errors.roadType}
                        helperText={
                          errors?.roadType ? errors.roadType.message : null
                        }
                        disabled={isDisabled}
                      /> */}

                      <FormControl
                        sx={{ width: "230px", marginTop: "2%" }}
                        variant="standard"
                        error={!!errors.roadType}
                      >
                        <InputLabel
                          id="demo-simple-select-standard-label"
                          disabled={isDisabled}
                        >
                          <FormattedLabel id="RoadType" required />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              // value={field.value}
                              disabled={isDisabled}
                              value={
                                router.query.roadType
                                  ? router.query.roadType
                                  : field.value
                              }
                              onChange={(value) => {
                                field.onChange(value);
                                setLegend(value.target.value);
                              }}
                              label="roadType"
                            >
                              {roadType &&
                                roadType.map((value, index) => (
                                  <MenuItem key={index} value={value?.id}>
                                    {
                                      // @ts-ignore
                                      value?.roadSizeEn
                                    }
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="roadType"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.roadType ? errors.roadType.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    {/* <Grid
                      item
                      xl={3}
                      lg={3}
                      md={6}
                      sm={6}
                      xs={12}
                      p={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        sx={{ width: "230px", marginTop: "2%" }}
                        variant="standard"
                        error={!!errors.roadType}
                      >
                        <InputLabel
                          id="demo-simple-select-standard-label"
                          disabled={isDisabled}
                        >
                          <FormattedLabel id="RoadconstructionType" required />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              // value={field.value}
                              disabled={isDisabled}
                              value={
                                router.query.roadType
                                  ? router.query.roadType
                                  : field.value
                              }
                              onChange={(value) => {
                                field.onChange(value);
                                setLegend(value.target.value);
                              }}
                              label="roadType"
                            >
                              {roadTypeConstr &&
                                roadTypeConstr.map((value, index) => (
                                  <MenuItem key={index} value={value?.id}>
                                    {
                                      // @ts-ignore
                                      value?.roadTypeNameEn
                                    }
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="roadType"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.roadType ? errors.roadType.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid> */}
                  </>
                )}
              {/* Land resrvation end */}

              {/* <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl
                sx={{ width: "230px", marginTop: "2%" }}
                variant="standard"
                error={!!errors.zone}
              >
                <InputLabel
                  id="demo-simple-select-standard-label"
                  disabled={isDisabled}
                >
                  <FormattedLabel id="zoneName" required />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      // value={field.value}
                      disabled={isDisabled}
                      value={
                        router.query.zone ? router.query.zone : field.value
                      }
                      onChange={(value) => field.onChange(value)}
                      label="zone"
                    >
                      {zoneDropDown &&
                        zoneDropDown.map((value, index) => (
                          <MenuItem
                            key={index}
                            value={
                              // @ts-ignore
                              value?.id
                            }
                          >
                            {
                              // @ts-ignore
                              language === "en"
                                ? // @ts-ignore
                                  value?.zoneNameEn
                                : // @ts-ignore
                                  value?.zoneNameMr
                            }
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="zone"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.zone ? errors.zone.message : null}
                </FormHelperText>
              </FormControl>
            </Grid> */}

              {/* <Grid
                item
                xl={3}
                lg={3}
                md={6}
                sm={6}
                xs={12}
                p={1}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl
                  sx={{ width: "230px", marginTop: "2%" }}
                  variant="standard"
                  error={!!errors.zone}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="zoneName" required />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        // value={field.value}
                        // disabled={isDisabled}
                        // value={
                        //   router.query.zone ? router.query.zone : field.value
                        // }
                        value={selectedzoneDropDown}
                        onChange={handleChange}
                        renderValue={(selected) => selected.join(", ")}
                        MenuProps={MenuProps}
                        label="zone"
                      >
                        {zoneDropDown &&
                          zoneDropDown.map((name) => (
                            <MenuItem key={name.id} value={name.zoneNameEn}>
                              <Checkbox
                                checked={
                                  selectedzoneDropDown.indexOf(
                                    name.zoneNameEn,
                                  ) > -1
                                }
                              />
                              <ListItemText primary={name.zoneNameEn} />
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="zone"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.zone ? errors.zone.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid> */}

              <Grid
                item
                xl={3}
                lg={3}
                md={6}
                sm={6}
                xs={12}
                p={1}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  sx={{
                    width: "230px",
                    marginTop: "2%",
                  }}
                  id="standard-basic"
                  label={
                    <FormattedLabel id="reservationAreaInHector" required />
                  }
                  variant="standard"
                  name="reservationAreaInHector"
                  {...register("reservationAreaInHector")}
                  error={!!errors.reservationAreaInHector}
                  helperText={
                    errors?.reservationAreaInHector
                      ? errors.reservationAreaInHector.message
                      : null
                  }
                  disabled={isDisabled}
                />
              </Grid>

              <Grid
                item
                xl={3}
                lg={3}
                md={6}
                sm={6}
                xs={12}
                p={1}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  sx={{
                    width: "230px",
                    marginTop: "2%",
                  }}
                  id="standard-basic"
                  label={<FormattedLabel id="landUnderPossession" required />}
                  variant="standard"
                  name="landUnderPossession"
                  {...register("landUnderPossession")}
                  error={!!errors.landUnderPossession}
                  helperText={
                    errors?.landUnderPossession
                      ? errors.landUnderPossession.message
                      : null
                  }
                  disabled={isDisabled}
                />
              </Grid>

              {/* <Grid
                item
                xl={3}
                lg={3}
                md={6}
                sm={6}
                xs={12}
                p={1}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  sx={{
                    width: "230px",
                    marginTop: "2%",
                  }}
                  id="standard-basic"
                  label={
                    <FormattedLabel id="landNotUnderPossession" required />
                  }
                  variant="standard"
                  {...register("landNotUnderPossession")}
                  error={!!errors.landNotUnderPossession}
                  helperText={
                    errors?.landNotUnderPossession
                      ? errors.landNotUnderPossession.message
                      : null
                  }
                  disabled={isDisabled}
                />
              </Grid> */}

              {/* <Grid
                item
                xl={3}
                lg={3}
                md={6}
                sm={6}
                xs={12}
                p={1}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl
                  sx={{
                    marginTop: "2%",
                  }}
                  variant="standard"
                  error={!!errors.appropriateAuthority}
                >
                  <InputLabel
                    id="demo-simple-select-standard-label"
                    disabled={isDisabled}
                  >
                    <FormattedLabel id="appropriateAuthority" required />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: "230px" }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        disabled={isDisabled}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="appropriateAuthority"
                      >
                        {appropriateAuthorityDropDown &&
                          appropriateAuthorityDropDown.map((value, index) => (
                            <MenuItem
                              key={index}
                              value={
                                //@ts-ignore
                                value.id
                              }
                            >
                              {language == "en"
                                ? //@ts-ignore
                                  value.authorityNameEn
                                : // @ts-ignore
                                  value?.authorityNameMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="appropriateAuthority"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.appropriateAuthority
                      ? errors.appropriateAuthority.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid> */}

              {/* <Grid
                item
                xl={3}
                lg={3}
                md={6}
                sm={6}
                xs={12}
                p={1}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  sx={{
                    width: "230px",
                    marginTop: "2%",
                  }}
                  id="standard-basic"
                  label={<FormattedLabel id="remark" required />}
                  variant="standard"
                  {...register("remark")}
                  error={!!errors.remark}
                  helperText={errors?.remark ? errors.remark.message : null}
                  disabled={isDisabled}
                />
              </Grid> */}
              {watch("disabledFieldInputState") ? (
                <></>
              ) : (
                <>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <Button
                      sx={{
                        marginTop: "5vh",
                        margin: "normal",
                        width: 240,
                        // height: "40px",
                      }}
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => {
                        handleDrawerOpen();
                      }}
                    >
                      {/* <FormattedLabel id="viewLocationOnMap" /> */}
                      view Location On Map
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </Paper>
      </Main>
      {/** Drawer  */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        {/* <DrawerHeader>
          <IconButton onClick={()handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader> */}
        {/* <Divider /> */}

        <Box
          style={{
            left: 0,
            position: "absolute",
            top: "50%",
            backgroundColor: "#bdbdbd",
          }}
        >
          <IconButton
            color="primary"
            aria-label="open drawer"
            // edge="end"
            onClick={() => handleDrawerClose()}
            sx={{ width: "30px", height: "75px", borderRadius: 0 }}
          >
            <ArrowRightIcon />
          </IconButton>
        </Box>
        <img
          src="/map.png"
          //hegiht='300px'
          width="80px"
          alt="Map Not Found"
          style={{ width: "100%", height: "100%" }}
        />
      </Drawer>
      {/** End Drawer  */}
    </>
  );
};

export default PersonalDetails;
