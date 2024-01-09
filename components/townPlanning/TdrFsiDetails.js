import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../URLS/urls";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import Transliteration from "../common/linguosol/transliteration";
import { catchExceptionHandlingMethod } from "../../util/util";
// Component
const TsrFsiDetails = () => {
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
  let user = useSelector((state) => state.user.user);
  const router = useRouter();

  const language = useSelector((state) => state?.labels.language);

  // React Hook Form
  const {
    control,
    register,
    reset,
    watch,
    setValue,
    handleSubmit,
    getValues,
    getFieldValue,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "landOwnershipDetails",
  });

  useEffect(() => {
    if (router.query.pageMode === "Add" || router.query.pageMode === "Edit") {
    } else {
      console.log("disabled");
    }
  }, []);

  const [gender, setGender] = useState();
  const [title, setTitle] = useState();
  const [zoneNames, setZoneNames] = useState([]);
  const [village, setVillage] = useState();
  const [gat, setGat] = useState();
  const [reservationName, setReservationName] = useState();
  const [documents, setDocuments] = useState();
  const [disabled, setDisabled] = useState(false);
  // Titles
  const [selectedZone, setSelectedZone] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState([]);
  const [selectedGat, setSelectedGat] = useState([]);
  const [allVillageName, setAllVillageName] = useState([]);
  const [reservationNameKey, setReservationNameKey] = useState([]);

  const [gTitleMars, setgTitleMars] = useState([]);
  const [villageDropDown, setVillageNameDropDown] = useState([]);
  const [allGatName, setAllGatName] = useState([]);
  const [resevationDetails, setresevationDetails] = useState([]);
  const [dRCTypeDropDown, setdRCTypeDropDown] = useState([]);
  const [reservationTypeDropDown, setReservationTypeDropDown] = useState([]);
  const [gatDropDown, setGatDropDown] = useState([
    {
      id: 1,
      gatNameEn: "",
      gatNameMr: "",
    },
  ]);

  // getTitles
  const getgTitleMars = () => {
    axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setgTitleMars(
          r.data.title.map((row) => ({
            id: row.id,
            gtitleMar: row.titleMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  useEffect(() => {
    if (router.query.pageMode === "View") {
      setDisabled(true);
    }
  }, []);

  useEffect(() => {
    // Date
    let appDate = new Date();
    // setNewDate(moment(appDate, "YYYY-MM-DD").format("YYYY-MM-DD"));

    //Gender
    axios
      .get(`${urls.CFCURL}/master/gender/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setGender(
          res.data.gender.map((j) => ({
            id: j.id,
            genderEn: j.gender,
            genderMr: j.genderMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    //Title
    axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setTitle(
          res.data.title.map((j) => ({
            id: j.id,
            titleEn: j.title,
            titleMr: j.titleMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
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

    //Zone
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        console.log("ZoneNames", res?.data?.zone);
        setZoneNames(
          res?.data?.zone?.map((j) => ({
            id: j?.id,
            zoneName: j?.zoneName,
            zoneNameMr: j?.zoneNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    //Gat
    axios
      .get(`${urls.CFCURL}/master/gatMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setGat(
          r.data.gatMaster.map((j, i) => ({
            id: j.id,
            gatEn: j.gatNameEn,
            gatMr: j.gatNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    //DocumentsList
    axios
      .get(`${urls.CFCURL}/master/documentMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setDocuments(
          res.data.documentMaster.map((j, i) => ({
            id: j.id,
            documentNameEn: j.documentChecklistEn,
            documentNameMr: j.documentChecklistMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    getgTitleMars();
  }, []);

  const getFilteredVillage = () => {
    axios
      .post(
        `${urls.TPURL}/zoneVillageGatMapping/getAllByZoneId`,
        watch("zoneId"),
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((r) => {
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
        watch("villageName"),
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
            gatNameMr: gatDropDown?.find((i) => i.id == j.gatId)?.gatNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  const getFilteredReservationName = () => {
    console.log("sdsdf", watch("gatNo"));
    
    axios
      .post(`${urls.TPURL}/reservationDetail/getByGatId`, watch("gatNo"), {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        console.log("fgsdzfsd", r.data);
        setresevationDetails(
          r?.data.map((j) => ({
            id: j.id,
            landReservationNo: j.landReservationNo,
            reservationNameEn: j.reservationNameEn,
            reservationNameMr: j.reservationNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    
  };
  // console.log("lllllllllll",getValues("zoneId"));
  useEffect(() => {
    if( watch("gatNo")){
    getFilteredReservationName();
    }
  }, [watch("gatNo")]);
  useEffect(() => {
    if( watch("zoneId")){
    getFilteredVillage();
    }
  }, [watch("zoneId")]);
  useEffect(() => {
    if( watch("villageName")){
    getFilteredGat();
    }
  }, [watch("villageName"), router.query]);

  const tableStyle = {
    border: "1px solid black",
    width: "100%",
    marginLeft: "1vw",
  };

  const thStyle = {
    border: "1px solid black",
  };
  const thStyleMain = {
    border: "1px solid black",
    backgroundColor: "lightgray",
  };

  const getDRCType = () => {
    axios
      .get(`${urls.TPURL}/master/drcTypeMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        let _res = res.data.drcTypeMasterDaoList.map((r, i) => ({
          id: r.id,

          drcTypeEn: r.drcTypeEn,
          drcTypeMr: r.drcTypeMr,
        }));
        setdRCTypeDropDown(_res);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getReservationType = () => {
    axios
      .get(`${urls.TPURL}/reservationTypeMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setReservationTypeDropDown(
          res.data.reservationType.map((j, i) => ({
            ...j,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  useEffect(() => {
    getDRCType();
    getReservationType();
  }, []);
  const handleSave = () => {
    console.log("Rows:", rows);
    // Perform any save operation here (e.g., sending data to the server)
  };
  const handleSelectedVillage = (event, villageId) => {
    if (event.target.checked) {
      setSelectedVillage([...selectedVillage, villageId]);
    }
  };
  const handleSelectedGat = (event, gatNo) => {
    if (event.target.checked) {
      setSelectedGat([...selectedGat, gatNo]);
    }
  };

  useEffect(() => {
    if (watch("reservationNo") != null && resevationDetails.length != 0) {
      let test = resevationDetails.find((obj) => {
        return obj?.id === watch("reservationNo");
      })?.reservationNameEn;
      console.log(
        "12chyaGavat",
        watch("reservationNo"),
        resevationDetails,
        test,
      );

      setValue("reservationName", test);
    }
  }, [watch("reservationNo")]);

  console.log("sdzfsdf", watch("copyOfLayout"));
  return (
    <>
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
        {router?.query?.pageMode != "View" && (
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "10px",
              background:
                "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <h2>{language == "en" ? "Application Details" : "अर्ज तपशील"}</h2>
          </Box>
        )}

        <Box
          sx={{
            marginTop: 2,
          }}
        >
          <Grid container sx={{ padding: "10px" }}>
            <Grid
              item
              xl={4}
              lg={4}
              md={4}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // marginLeft:"2vw"
              }}
            >
              <FormControl
                sx={{
                  width: "230px",
                }}
                variant="standard"
                error={!!errors.drcType}
              >
                <InputLabel
                  id="demo-simple-select-standard-label"
                  disabled={disabled}
                >
                  <FormattedLabel id="selectDRCType" required />
                  {/* Select DRC Type */}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      disabled={disabled}
                      value={
                        router.query.drcType
                          ? router.query.drcType
                          : field.value
                      }
                      onChange={(value) => field.onChange(value)}
                      label="drcType"
                    >
                      {dRCTypeDropDown &&
                        dRCTypeDropDown.map((value, index) => (
                          <MenuItem key={index} value={value?.id}>
                            {
                              // @ts-ignore
                              language === "en"
                                ? value?.drcTypeEn
                                : value?.drcTypeMr
                            }
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="drcType"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.drcType ? errors.drcType.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid
              item
              xl={4}
              lg={4}
              md={4}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // marginLeft:"3vw"
              }}
            >
              <FormControl
                sx={{
                  width: "230px",
                }}
                variant="standard"
                error={!!errors.reservationType}
              >
                <InputLabel
                  id="demo-simple-select-standard-label"
                  disabled={disabled}
                >
                  <FormattedLabel id="reservationType" required />
                  {/* Reservation Type */}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      disabled={disabled}
                      value={
                        router.query.reservationType
                          ? router.query.reservationType
                          : field.value
                      }
                      onChange={(value) => field.onChange(value)}
                      label="reservationType"
                    >
                      {reservationTypeDropDown &&
                        reservationTypeDropDown.map((value, index) => (
                          <MenuItem key={index} value={value?.id}>
                            {
                              // @ts-ignore
                              language === "en"
                                ? value?.reservationNameEn
                                : value?.reservationNameMr
                            }
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="reservationType"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.reservationType
                    ? errors.reservationType.message
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid
              item
              xl={4}
              lg={4}
              md={4}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl variant="standard" error={!!errors.zoneId}>
                <InputLabel id="demo-simple-select-standard-label">
                  {language == "en" ? "Zone Name" : "झोनचे नाव"}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      // disabled={
                      //   watch("lstDepartment") == null
                      //     ? true
                      //     : !watch("searchButtonInputState")
                      // }
                      // label={<FormattedLabel id="subDepartmentName" />}
                      label="Zone Name"
                      multiple
                      value={field?.value}
                      onChange={(value) => field?.onChange(value)}
                      renderValue={(val) =>
                        watch("zoneId")
                          ?.map((j) => {
                            if (language == "en") {
                              return zoneNames?.find((obj) => obj?.id == j)
                                ?.zoneName;
                            } else {
                              return zoneNames?.find((obj) => obj?.id == j)
                                ?.zoneNameMr;
                            }
                          })
                          .join(",")
                      }
                    >
                      {zoneNames?.map((obj) => (
                        <MenuItem key={obj?.id} value={obj?.id}>
                          <Checkbox
                            checked={watch("zoneId")?.includes(obj?.id)}
                          />
                          <ListItemText
                            primary={
                              language == "en" ? obj?.zoneName : obj?.zoneNameMr
                            }
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                  name="zoneId"
                  control={control}
                  defaultValue={[]}
                />
                <FormHelperText>
                  {errors?.zoneId ? errors?.zoneId?.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid
              item
              xl={4}
              lg={4}
              md={4}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl variant="standard" error={!!errors.villageName}>
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="villageName" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      // disabled={
                      //   watch("lstDepartment") == null
                      //     ? true
                      //     : !watch("searchButtonInputState")
                      // }
                      label={<FormattedLabel id="villageName" />}
                      // label="Zone Name"
                      multiple
                      value={field?.value}
                      onChange={(value) => field?.onChange(value)}
                      renderValue={(val) =>
                        watch("villageName")
                          ?.map((j) => {
                            if (language == "en") {
                              return allVillageName?.find((obj) => obj?.id == j)
                                ?.villageNameEn;
                            } else {
                              return allVillageName?.find((obj) => obj?.id == j)
                                ?.villageNameMr;
                            }
                          })
                          .join(",")
                      }
                    >
                      {allVillageName?.map((obj) => (
                        <MenuItem key={obj?.id} value={obj?.id}>
                          <Checkbox
                            checked={watch("villageName")?.includes(obj?.id)}
                          />
                          <ListItemText
                            primary={
                              language == "en"
                                ? obj?.villageNameEn
                                : obj?.villageNameMr
                            }
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                  name="villageName"
                  control={control}
                  defaultValue={[]}
                />
                <FormHelperText>
                  {errors?.villageName ? errors?.villageName?.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid
              item
              xl={4}
              lg={4}
              md={4}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl variant="standard" error={!!errors.gatNo}>
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="gatNo" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      // disabled={
                      //   watch("lstDepartment") == null
                      //     ? true
                      //     : !watch("searchButtonInputState")
                      // }
                      label={<FormattedLabel id="gatNo" />}
                      // label="Zone Name"
                      multiple
                      value={field?.value}
                      onChange={(value) => field?.onChange(value)}
                      renderValue={(val) =>
                        watch("gatNo")
                          ?.map((j) => {
                            if (language == "en") {
                              return allGatName?.find((obj) => obj?.id == j)
                                ?.gatNameEn;
                            } else {
                              return allGatName?.find((obj) => obj?.id == j)
                                ?.gatNameEn;
                            }
                          })
                          .join(",")
                      }
                    >
                      {allGatName?.map((obj) => (
                        <MenuItem key={obj?.id} value={obj?.id}>
                          <Checkbox
                            checked={watch("gatNo")?.includes(obj?.id)}
                          />
                          <ListItemText
                            primary={
                              language == "en" ? obj?.gatNameEn : obj?.gatNameEn
                            }
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                  name="gatNo"
                  control={control}
                  defaultValue={[]}
                />
                <FormHelperText>
                  {errors?.gatNo ? errors?.gatNo?.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid
              item
              xl={4}
              lg={4}
              md={4}
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
                  width: "230px",
                }}
                variant="standard"
                error={!!errors.reservationNo}
              >
                <InputLabel
                  id="demo-simple-select-standard-label"
                  disabled={router.query.reservationNo ? true : false}
                >
                  <FormattedLabel id="reservationNo" required />
                  {/* Reservation No */}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      InputLabelProps={{ shrink: true }}
                      // InputLabelProps={{ shrink:watch("reservationNo") ? true : false }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      // disabled={router.query.reservationNo ? true : false}
                      value={
                        router.query.reservationNo
                          ? router.query.reservationNo
                          : field.value
                      }
                      onChange={(value) => {
                        field.onChange(value);
                        setReservationNameKey(value.target.value);
                      }}
                      label="reservationNo"
                    >
                      {resevationDetails &&
                        resevationDetails.map((value, index) => (
                          <MenuItem key={index} value={value?.id}>
                            {value?.landReservationNo}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="reservationNo"
                  control={control}
                  defaultValue={null}
                />
                <FormHelperText>
                  {errors?.reservationNo ? errors.reservationNo.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid
              item
              xl={4}
              lg={4}
              md={4}
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
                disabled={disabled}
                InputLabelProps={{
                  shrink: watch("reservationNo") ? true : false,
                }}
                id="standard-basic"
                label={<FormattedLabel id="reservationName" required />}
                variant="standard"
                name="reservationName"
                // name="reservationName"
                {...register("reservationName")}
                error={!!errors.reservationName}
                helperText={
                  errors?.reservationName
                    ? errors.reservationName.message
                    : null
                }
              />
            </Grid>
            {/* priority */}
            <Grid
              item
              xl={4}
              lg={4}
              md={4}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingLeft: "5vw",
              }}
            >
              <Transliteration
                _key={"applicantNameEn"}
                labelName={"applicantNameEn"}
                fieldName={"applicantNameEn"}
                updateFieldName={"applicantNameMr"}
                sourceLang={"eng"}
                targetLang={"mar"}
                width={230}
                disabled={disabled}
                label={<FormattedLabel id="appliName" required />}
                // label={"Applicant Name"}
                error={!!errors.applicantNameEn}
                helperText={
                  errors?.applicantNameEn
                    ? errors.applicantNameEn.message
                    : null
                }
              />
            </Grid>

            <Grid
              item
              xl={4}
              lg={4}
              md={4}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingLeft: "5vw",
              }}
            >
              <Transliteration
                _key={"applicantAddressEn"}
                labelName={"applicantAddressEn"}
                fieldName={"applicantAddressEn"}
                updateFieldName={"applicantAddressMr"}
                sourceLang={"eng"}
                targetLang={"mar"}
                width={230}
                disabled={disabled}
                label={<FormattedLabel id="applicantAddress" required />}
                // label={"Applicant Address"}
                error={!!errors.applicantAddressEn}
                helperText={
                  errors?.applicantAddressEn
                    ? errors.applicantAddressEn.message
                    : null
                }
              />
            </Grid>

            {/* marathi */}

            <Grid
              item
              xl={4}
              lg={4}
              md={4}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingLeft: "5vw",
              }}
            >
              <Transliteration
                _key={"applicantNameMr"}
                labelName={"applicantNameMr"}
                fieldName={"applicantNameMr"}
                updateFieldName={"applicantNameEn"}
                sourceLang={"mar"}
                targetLang={"eng"}
                disabled={disabled}
                width={230}
                label={<FormattedLabel id="appliNameMr" required />}
                // label={"Applicant Name (Marathi)"}
                error={!!errors.applicantNameMr}
                helperText={
                  errors?.applicantNameMr
                    ? errors.applicantNameMr.message
                    : null
                }
              />
            </Grid>

            <Grid
              item
              xl={4}
              lg={4}
              md={4}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingLeft: "5vw",
              }}
            >
              <Transliteration
                _key={"applicantAddressMr"}
                labelName={"applicantAddressMr"}
                fieldName={"applicantAddressMr"}
                updateFieldName={"applicantAddressEn"}
                sourceLang={"mar"}
                targetLang={"eng"}
                width={230}
                disabled={disabled}
                label={<FormattedLabel id="applicantAddressMr" required />}
                // label={"Applicant Address (Marathi)"}
                error={!!errors.applicantAddressMr}
                helperText={
                  errors?.applicantAddressMr
                    ? errors.applicantAddressMr.message
                    : null
                }
              />
            </Grid>
            <Grid
              item
              xl={4}
              lg={4}
              md={4}
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
                disabled={disabled}
                InputLabelProps={{ shrink: watch("mobileNo") ? true : false }}
                id="standard-basic"
                label={<FormattedLabel id="mobile" required />}
                variant="standard"
                name="mobileNo"
                // name="mobileNo"
                {...register("mobileNo")}
                error={!!errors.mobileNo}
                helperText={errors?.mobileNo ? errors.mobileNo.message : null}
              />
            </Grid>
            <Grid
              item
              xl={4}
              lg={4}
              md={4}
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
                disabled={disabled}
                InputLabelProps={{
                  shrink: watch("emailAddress") ? true : false,
                }}
                id="standard-basic"
                label={<FormattedLabel id="email" required />}
                variant="standard"
                name="emailAddress"
                // name="emailAddress"
                {...register("emailAddress")}
                error={!!errors.emailAddress}
                helperText={
                  errors?.emailAddress ? errors.emailAddress.message : null
                }
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid
              item
              xl={6}
              lg={6}
              md={4}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <b>
                {language == "en"
                  ? "In case, the land under reference from a part of layout/sub-division. Whether copy of layout with terms and conditions is submitted?"
                  : "बाबतीत, लेआउट/उप-विभागाच्या एका भागाच्या संदर्भातील जमीन. अटी व शर्तींसह लेआउटची प्रत सादर केली आहे का?"}
              </b>
            </Grid>
            <Grid
              item
              xl={6}
              lg={6}
              md={4}
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
                  width: "230px",
                }}
                variant="standard"
                error={!!errors.copyOfLayout}
              >
                {/* <FormControl> */}
                <InputLabel>
                  {language == "en" ? "Select an Option" : "एक पर्याय निवडा"}
                </InputLabel>
                <Controller
                  name="copyOfLayout"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select {...field} disabled={disabled}>
                      <MenuItem value={true}>
                        {language == "en" ? "Yes" : "होय"}
                      </MenuItem>
                      <MenuItem value={false}>
                        {language == "en" ? "No" : "नाही"}
                      </MenuItem>
                      {/* <MenuItem value="option3">Option 4</MenuItem> */}
                    </Select>
                  )}
                />
                <FormHelperText>
                  {errors?.copyOfLayout ? errors.copyOfLayout.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>

          <div style={{ overflow: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  {/* <th style={thStyle}>Sr.No</th> */}
                  <th style={thStyle}>
                    {language == "en" ? "7/12, P R card" : "7/12, P R कार्ड"}
                  </th>
                  <th style={thStyle}>
                    {language == "en" ? "Village" : "गाव"}
                  </th>
                  <th style={thStyle}>
                    {language == "en"
                      ? "Holder as per 7/12, P R card"
                      : "7/12 नुसार धारक, पी आर कार्ड"}
                  </th>
                  <th style={thStyle}>
                    {language == "en" ? "Pherphar Number" : "फेरफार क्रमांक"}
                  </th>
                  <th style={thStyle}>
                    {language == "en" ? "Tenure" : "कार्यकाळ"}
                  </th>
                  <th style={thStyle}>
                    {language == "en" ? "Easement rights" : "सुखसोयी हक्क"}
                  </th>
                  <th style={thStyle}>
                    {language == "en"
                      ? "Applicant status"
                      : "अर्जदाराची स्थिती"}
                  </th>
                  <th style={thStyle}>
                    {language == "en" ? "Area Of Plot" : "प्लॉटचे क्षेत्रफळ"}
                  </th>
                  <th style={thStyle}>
                    {language == "en"
                      ? "Area under reservation/road"
                      : "आरक्षण/रस्ता अंतर्गत क्षेत्र"}
                  </th>
                  <th style={thStyle}>
                    {language == "en"
                      ? "ASR rate of land of current year"
                      : "चालू वर्षाचा जमिनीचा ASR दर"}
                  </th>
                  {router.query.pageMode != "View" && (
                    <th style={thStyle}>
                      {language == "en" ? "Actions" : "क्रिया"}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {fields.map((row, index) => (
                  <tr key={row.id}>
                    {/* <td style={tdStyle}>{row.srNo}</td> */}
                    <td style={thStyle}>
                      <TextField
                        disabled={disabled}
                        variant="outlined"
                        {...register(
                          `landOwnershipDetails.${index}.sevenTwelvePRCard`,
                        )}
                      />
                    </td>
                    <td style={thStyle}>
                      <TextField
                        disabled={disabled}
                        variant="outlined"
                        {...register(`landOwnershipDetails.${index}.village`)}
                      />
                    </td>
                    <td style={thStyle}>
                      <TextField
                        disabled={disabled}
                        variant="outlined"
                        {...register(`landOwnershipDetails.${index}.holder`)}
                      />
                    </td>
                    <td style={thStyle}>
                      <TextField
                        disabled={disabled}
                        variant="outlined"
                        {...register(
                          `landOwnershipDetails.${index}.pherpharNumber`,
                        )}
                      />
                    </td>
                    <td style={thStyle}>
                      <Controller
                        name={`landOwnershipDetails.${index}.tenure`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            label="Tenure"
                            variant="outlined"
                            disabled={disabled}
                          >
                            <MenuItem value="Class1">Class 1</MenuItem>
                            <MenuItem value="Class2">Class 2</MenuItem>
                            {/* <MenuItem value="Class3">Class 3</MenuItem> */}
                          </Select>
                        )}
                      />
                    </td>
                    <td style={thStyle}>
                      <TextField
                        disabled={disabled}
                        variant="outlined"
                        {...register(
                          `landOwnershipDetails.${index}.easementRights`,
                        )}
                      />
                    </td>
                    <td style={thStyle}>
                      <Controller
                        name={`landOwnershipDetails.${index}.applicantStatus`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            label="Tenure"
                            variant="outlined"
                            disabled={disabled}
                          >
                            <MenuItem value="POA">POA</MenuItem>
                            <MenuItem value="Self">Self</MenuItem>
                          </Select>
                        )}
                      />
                    </td>
                    <td style={thStyle}>
                      <TextField
                        disabled={disabled}
                        variant="outlined"
                        {...register(
                          `landOwnershipDetails.${index}.areaOfPlot`,
                        )}
                      />
                    </td>
                    <td style={thStyle}>
                      <TextField
                        disabled={disabled}
                        variant="outlined"
                        {...register(
                          `landOwnershipDetails.${index}.areaUnderReservationRoad`,
                        )}
                      />
                    </td>
                    <td style={thStyle}>
                      <TextField
                        disabled={disabled}
                        variant="outlined"
                        {...register(`landOwnershipDetails.${index}.asrRate`)}
                      />
                    </td>
                    {router.query.pageMode != "View" && (
                      <td style={thStyle}>
                        <Button
                          onClick={() => remove(index)}
                          variant="contained"
                          color="primary"
                        >
                          {language == "en" ? "Remove Row" : "पंक्ती काढा"}
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {router?.query?.pageMode != "View" && (
            <Button
              onClick={() => append({ srNo: (fields.length + 1).toString() })}
              variant="contained"
              color="primary"
            >
              {language == "en" ? " Add Row" : "पंक्ती जोडा"}
            </Button>
          )}
          {/* <Button type="submit" variant="contained" color="primary">
        Save
      </Button>          */}
        </Box>
      </Paper>
    </>
  );
};

export default TsrFsiDetails;
