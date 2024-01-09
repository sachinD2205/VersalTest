import {
  Autocomplete,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../URLS/urls";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import Transliteration from "../marriageRegistration/transliteration";
import styles from "../marriageRegistration/view.module.css";
import { catchExceptionHandlingMethod } from "../../util/util";
// Component
const ApplicantDetails = () => {
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
  const router = useRouter();
  const [zoneKeys, setZoneKeys] = useState([]);
  const [whoAreYous, setWhoAreYous] = useState([
    {
      id: 1,
      value: "Groom",
      valueMr: "वर",
    },
    { id: 2, value: "Bride", valueMr: "वधू" },
  ]);

  const [lawOfMarriage, setLawOfMarriage] = useState([
    {
      id: 1,
      value: "Hindu",
      valueMr: "हिंदु",
    },
    { id: 2, value: "Muslim", valueMr: "मुस्लीम" },
  ]);
  const [wardKeys, setWardKeys] = useState([]);

  const user = useSelector((state) => state?.user.user);
  const language = useSelector((state) => state?.labels.language);
  const [atitles, setatitles] = useState([]);
  const [temp, setTemp] = useState();
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

  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    // if (watch('whoAreYou') == 1) {
    //   setValue("isApplicantGroom", true);
    // } else if (value.target.value == 2) {
    //   setValue("isApplicantBride", true);
    // }

    let flag1 =
      router.query.pageMode === "Add" || router.query.pageMode === "Edit";
    let flag2 =
      router.query.role == "DOCUMENT_VERIFICATION" ||
      router.query.role == "ADMIN";
    if (flag1 || flag2) {
      setDisabled(false);
      console.log("enabled");
      if (watch("zoneKey", "wardKey")) {
        setTemp(watch("zoneKey", "wardKey"));
      }
      setValue("astate", "Maharashtra");
      setValue("astateMr", "महाराष्ट्र");

      setValue("");
    } else {
      setDisabled(true);
      console.log("disabled");
      if (watch("zoneKey", "wardKey")) {
        setTemp(watch("zoneKey", "wardKey"));
      }
    }
  }, [watch("zoneKey", "wardKey")]);

  // const [areaNames, setAreaNames] = useState([]);

  // const getAreas = async () => {
  //   await axios
  //     .get(`${urls.CFCURL}/master/zoneWardAreaMapping/getAlll`)
  //     .then((r) => {
  //       setAreaNames(r.data);
  //     });
  // };

  // const getZoneKeys = async () => {
  //   await axios.get(`${urls.CFCURL}/master/zone/getAll`).then((r) => {
  //     setZoneKeys(
  //       r.data.zone.map((row) => ({
  //         id: row.id,
  //         zoneName: row.zoneName,
  //         zoneNameMr: row.zoneNameMr,
  //       })),
  //     );
  //   });
  // };

  const getWardKeys = async () => {
    await axios
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
  };

  const getTitles = async () => {
    await axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setatitles(
          r.data.title.map((row) => ({
            id: row.id,
            title: row.title,
            titlemr: row.titleMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const validateDetails = () => {
    if (watch("pplaceOfMarriage").length > 10) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    // getAreas();
    // getZoneKeys();
    getTitles();
    getWardKeys();
  }, [temp, watch("zoneKey", "wardKey")]);

  // useEffect(() => {
  //   if (router.query.pageMode != "Add") setTemp(getValues("zoneKey"));
  // }, [getValues("zoneKey")]);

  useEffect(() => {
    if (router.query.pageMode == "Edit" || router.query.pageMode == "Add") {
      console.log("router.query.pageMode", router.query);
      console.log("atitleMr", getValues("atitleMr"));

      setValue("atitle", user.title);
      setValue("afName", user.firstName);
      setValue("amName", user.middleName);
      setValue("alName", user.surname);

      setValue("aflatBuildingNo", user.cflatBuildingNo);
      setValue("abuildingName", user.cbuildingName);
      setValue("aroadName", user.croadName);
      setValue("alandmark", user.clandmark);

      setValue("atitleMr", user.title);
      setValue("afNameMr", user.firstNamemr);
      setValue("amNameMr", user.middleNamemr);
      setValue("alNameMr", user.surnamemr);

      setValue("aflatBuildingNoMr", user.cflatBuildingNoMr);
      setValue("abuildingNameMr", user.cbuildingNameMr);
      setValue("aroadNameMr", user.croadNameMr);
      setValue("alandmarkMr", user.clandmarkMr);

      setValue("apincode", user.cpinCode);
      setValue("aemail", user.emailID);
      setValue("amobileNo", user.mobile);
      setValue("abirthDate", user.dateOfBirth);
      setValue("agender", user.gender);

      setValue("acityName", user.ccity);
      setValue("astate", user.cstate);
      setValue("acityNameMr", user.ccityMr);
      setValue("astateMr", user.cstateMr);
    } else {
      console.log("router.query.pageMode", router.query);
      console.log("atitleMr", getValues("atitleMr"));

      setValue("atitle", "");
      setValue("afName", "");
      setValue("amName", "");
      setValue("alName", "");

      setValue("aflatBuildingNo", "");
      setValue("abuildingName", "");
      setValue("aroadName", "");
      setValue("alandmark", "");

      setValue("atitleMr", "");
      setValue("afNameMr", "");
      setValue("amNameMr", "");
      setValue("alNameMr", "");

      setValue("aflatBuildingNoMr", "");
      setValue("abuildingNameMr", "");
      setValue("aroadNameMr", "");
      setValue("alandmarkMr", "");

      setValue("apincode", "");
      setValue("aemail", "");
      setValue("amobileNo", "");
      setValue("abirthDate", "");
      setValue("agender", "");

      setValue("acityName", "");
      setValue("astate", "");
      setValue("acityNameMr", "");
      setValue("astateMr", "");
    }
  }, [user]);

  // console.log(
  //   "lawOfMarriageMr",
  //   watch("lawOfMarriageMr"),
  //   watch("lawOfMarriageMr"),
  // );

  // const setWardZoneBasedOnArrray = () => {
  //   if (watch("areaKey") != null) {
  //     let anotherFind = areaNames?.find(
  //       (data) => data?.uniqueId == watch("areaKey"),
  //     );
  //     console.log("filteredArrayZone1212", anotherFind);
  //     setValue("zoneKey", anotherFind?.zoneId);
  //     setValue("wardKey", anotherFind?.wardId);
  //   } else {
  //     setValue("zoneKey", null);
  //     setValue("wardKey", null);
  //   }
  // };
  useEffect(() => {
    watch("zoneKey", "wardKey");
  }, [watch("wardKey")]);
  console.log("ssssssss111111 ", watch("wardKey"), watch("zoneKey"));

  // ******************* area Zone ward***************************

  const [areaDropDown, setAreaDropDown] = useState([]);
  const [zoneDropDown, setZoneDropDown] = useState([]);
  const [wardDropDown, setWardDropDown] = useState([]);

  useEffect(() => {
    !router.query.id && getZones();

    axios
      .get(`${urls.CFCURL}/master/zoneWardAreaMapping/getAlll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setAreaDropDown(
          res.data?.map((j) => ({
            id: j?.area,
            zone: j?.zoneId,
            ward: j?.wardId,
            area: j?.areaId,
            areaDisplayNameEn:
              j?.areaName + " - " + j?.zoneName + " - " + j?.wardName,
            areaDisplayNameMr:
              j?.areaNameMr + " - " + j?.zoneNameMr + " - " + j?.wardNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    //Get Zone
    router.query.id &&
      axios
        .get(`${urls.CFCURL}/master/zone/getAll`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          setZoneDropDown(
            res.data.zone.map((j, i) => ({
              srNo: i + 1,
              id: j.id,
              zoneEn: j.zoneName,
              zoneMr: j.zoneNameMr,
            })),
          );
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });

    //Get Ward
    router.query.id &&
      axios
        .get(`${urls.CFCURL}/master/ward/getAll`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          setWardDropDown(
            res.data.ward.map((j, i) => ({
              srNo: i + 1,
              id: j.id,
              wardEn: j.wardName,
              wardMr: j.wardNameMr,
            })),
          );
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
  }, []);

  const getZones = () => {
    axios
      .get(`${urls.CFCURL}/master/zoneWardAreaMapping/getZoneByApplicationId`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) =>
        setZoneDropDown(
          res.data.map((zones) => ({
            id: zones.zoneId,
            zoneEn: zones.zoneName,
            zoneMr: zones.zoneNameMr,
          })),
        ),
      )
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  const getWards = (zoneId) => {
    // setLoader(true)
    axios
      .get(
        `${urls.CFCURL}/master/zoneWardAreaMapping/getWardByZoneAndModuleId`,
        {
          params: { zoneId },
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((res) => {
        setWardDropDown(
          res.data.map((wards) => ({
            id: wards.wardId,
            wardEn: wards.wardName,
            wardMr: wards.wardNameMr,
          })),
        );
        // setLoader(false)
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getAreas = (zoneId, wardId) => {
    // setLoader(true)
    axios
      .get(
        `${urls.CFCURL}/master/zoneWardAreaMapping/getAreaByZoneAndWardAndModuleId`,
        { params: { zoneId, wardId } },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((res) => {
        setAreaDropDown(
          res.data.map((areas) => ({
            zone: areas?.zoneId,
            ward: areas?.wardId,
            area: areas?.areaId,
            id: areas?.areaId,
            areaDisplayNameEn:
              areas?.areaName +
              " - " +
              areas?.zoneName +
              " - " +
              areas?.wardName,
            areaDisplayNameMr:
              areas?.areaNamemr +
              " - " +
              areas?.zoneNameMr +
              " - " +
              areas?.wardNameMr,
          })),
        );
        // setLoader(false)
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // view
  return (
    <>
      <div className={styles.small} style={{ marginTop: 30 }}>
        {/* <h4
          style={{
            marginLeft: "40px",
            color: "red",
            fontStyle: "italic",
          }}
        >
          {<FormattedLabel id="onlyMHR" />}
        </h4> */}

        <h4
          style={{
            marginLeft: "40px",
            color: "red",
            fontStyle: "italic",
          }}
        >
          <p>
            <blink className={styles.blink}>
              {<FormattedLabel id="onlyMHR" />}
            </blink>
          </p>
        </h4>

        <div className={styles.details}>
          <div className={styles.h1Tag}>
            <h3
              style={{
                color: "white",
                marginTop: "7px",
              }}
            >
              {" "}
              {<FormattedLabel id="ApplicatDetails" />}{" "}
            </h3>
          </div>
        </div>

        {/* <Grid
          item
          xs={12}
          sm={12}
          md={12}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AreaWardZoneMapping />
        </Grid> */}

        <Grid
          container
          spacing={2}
          style={{
            paddingLeft: "7vw",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            lg={3}
            xl={3}
            style={{
              // display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FormControl
              //  disabled={disable}
              variant="standard"
              sx={{ marginTop: "0" }}
              // error={!!error.areaKey}
            >
              {/* <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='area' />
              </InputLabel> */}
              {/* <Controller
                render={({ field }) => (
                  <Select
                  disabled={disabled}
                    sx={{ width: '250px' }}
                    labelId='demo-simple-select-standard-label'
                    id='demo-simple-select-standard'
                    // @ts-ignore
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value)
                      let tempObjForZoneAndWard = areaDropDown?.find(
                        (j) => j?.area == value.target.value
                      )
                      getWards(tempObjForZoneAndWard?.zone)
                      setValue('zoneKey', tempObjForZoneAndWard?.zone)
                      setValue('wardKey', tempObjForZoneAndWard?.ward)
                    }}
                    label='areaKey'
                  >
                    {areaDropDown &&
                      areaDropDown.map((value) => (
                        <MenuItem
                          key={value?.id}
                          value={
                            //@ts-ignore
                            value?.area
                          }
                        >
                          {language == 'en'
                            ? //@ts-ignore
                              value?.areaDisplayNameEn
                            : // @ts-ignore
                              value?.areaDisplayNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='areaKey'
                control={control}
                defaultValue=''
              /> */}
              <Controller
                render={({ field }) => (
                  <Autocomplete
                    disabled={disabled}
                    sx={{ width: "250px" }}
                    id="demo-autocomplete-standard"
                    options={areaDropDown || []} // Make sure areaDropDown is an array or provide a default empty array if it can be null/undefined
                    value={
                      areaDropDown.find(
                        (option) => option.area === field.value,
                      ) || null
                    } // Find the corresponding option based on field value
                    onChange={(_, value) => {
                      field.onChange(value ? value.area : ""); // Update field value with the selected option's area
                      let tempObjForZoneAndWard = areaDropDown?.find(
                        (j) => j?.area === value?.area,
                      );
                      getWards(tempObjForZoneAndWard?.zone);
                      setValue("zoneKey", tempObjForZoneAndWard?.zone);
                      setValue("wardKey", tempObjForZoneAndWard?.ward);
                    }}
                    getOptionLabel={(option) =>
                      language === "en"
                        ? option.areaDisplayNameEn
                        : option.areaDisplayNameMr
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={<FormattedLabel id="areaKay" />}
                      />
                    )}
                  />
                )}
                name="areaKey"
                control={control}
                defaultValue=""
              />
            </FormControl>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            lg={3}
            xl={3}
            style={{
              // display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FormControl
              disabled={disabled}
              variant="standard"
              error={!!errors.zoneKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="zone" required />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "250px" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    // @ts-ignore
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      !router.query.id && getWards(value.target.value);
                      !router.query.id && setValue("wardKey", "");
                      !router.query.id && setValue("areaKey", "");
                    }}
                    label="zoneKey"
                  >
                    {zoneDropDown &&
                      zoneDropDown.map((value, index) => (
                        <MenuItem
                          key={index}
                          value={
                            //@ts-ignore
                            value?.id
                          }
                        >
                          {language == "en"
                            ? //@ts-ignore
                              value?.zoneEn
                            : // @ts-ignore
                              value?.zoneMr}
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
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            lg={3}
            xl={3}
            style={{
              // display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FormControl
              disabled={disabled}
              variant="standard"
              error={!!errors.wardKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="ward" required />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "250px" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    // @ts-ignore
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      !router.query.id &&
                        getAreas(watch("zoneKey"), value.target.value);
                    }}
                    label="wardKey"
                  >
                    {wardDropDown &&
                      wardDropDown.map((value, index) => (
                        <MenuItem
                          key={index}
                          value={
                            //@ts-ignore
                            value.id
                          }
                        >
                          {language == "en"
                            ? //@ts-ignore
                              value.wardEn
                            : // @ts-ignore
                              value?.wardMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="wardKey"
                control={control}
                // defaultValue=""
              />
              <FormHelperText>
                {errors?.wardKey ? errors.wardKey.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
            <FormControl
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors.whoAreYou}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="whoAreYou" required />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      // if (value.target.value == 1) {
                      //   setValue("isApplicantGroom", true);
                      //   setValue("isApplicantBride", false);
                      // } else if (value.target.value == 2) {
                      //   setValue("isApplicantBride", true);
                      //   setValue("isApplicantGroom", false);
                      // }
                    }}
                  >
                    {whoAreYous &&
                      whoAreYous.map((way, index) => (
                        <MenuItem key={index} value={way.id}>
                          {language == "en" ? way?.value : way?.valueMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="whoAreYou"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.whoAreYou ? errors.whoAreYou.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>

        {/* <div
          className={styles.row}
          style={{ display: "flex", justifyContent: "space-around" }}
        >
          <div>
            <FormControl
              variant="standard"
              sx={{ width: "60vh" }}
              error={!!errors.areaKey}
            >
              <Controller
                //! Sachin_😴
                name="areaKey"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    disabled={disabled}
                    id="controllable-states-demo"
                    variant="standard"
                    onChange={(event, newValue) => {
                      setValue("uniqueId", newValue?.uniqueId);
                      onChange(newValue ? newValue?.uniqueId : null);
                      setWardZoneBasedOnArrray();
                    }}
                    value={
                      areaNames?.find((data) => data?.uniqueId === value) ||
                      null
                    }
                    options={areaNames} //! api Data
                    getOptionLabel={(areaName) =>
                      language == "en"
                        ? areaName?.areaName +
                          " - " +
                          areaName?.zoneName +
                          " - " +
                          areaName?.wardName
                        : areaName?.areaNameMr +
                          " - " +
                          areaName?.zoneNameMr +
                          " -" +
                          areaName?.wardNameMr
                    }
                    //! Display name the Autocomplete
                    renderInput={(params) => (
                      <TextField
                        disabled={disabled}
                        variant="standard"
                        sx={{
                          m: { xs: 0, md: 1 },
                          minWidth: "100%",
                        }}
                        {...params}
                        label={<FormattedLabel id="areaKay" />}
                      />
                    )}
                  />
                )}
              />
              <FormHelperText>
                {errors?.areaKey ? errors.areaKey.message : null}
              </FormHelperText>
            </FormControl>
          </div>

          <div>
            <FormControl
              variant="standard"
              sx={{ marginTop: 3 }}
              error={!!errors.zoneKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="zone" required />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    // autoFocus
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);

                      setTemp(value.target.value);
                    }}
                    label="Zone Name *"
                  >
                    {zoneKeys &&
                      zoneKeys.map((zoneKey, index) => (
                        <MenuItem key={index} value={zoneKey.id}>
                          {language == "en"
                            ? zoneKey?.zoneName
                            : zoneKey?.zoneNameMr}
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
          </div>
          <div>
            <FormControl
              variant="standard"
              sx={{ marginTop: 3 }}
              error={!!errors.wardKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="ward" required />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Ward Name *"
                  >
                    {wardKeys &&
                      wardKeys.map((wardKey, index) => (
                        <MenuItem key={index} value={wardKey.id}>
                          {language == "en"
                            ? wardKey?.wardName
                            : wardKey?.wardNameMr}
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
          </div>
        </div> */}

        <div className={styles.details}>
          <div className={styles.h1Tag}>
            <h3
              style={{
                color: "white",
                marginTop: "7px",
              }}
            >
              {" "}
              {<FormattedLabel id="personalDetails" />}
            </h3>
          </div>
        </div>

        <div
          className={styles.row}
          style={{ display: "flex", justifyContent: "space-around" }}
        >
          {/* <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            <FormControl
              variant="standard"
              error={!!errors.atitle}
              sx={{ marginTop: "2vh" }}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="title" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    InputLabelProps={{
                      shrink:
                        (watch('atitle') ? true : false) ||
                        (router.query.atitle ? true : false),
                    }}
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      setValue("atitleMr", value.target.value);
                    }}
                    label="Title *"
                  >
                    {atitles &&
                      atitles.map((atitle, index) => (
                        <MenuItem key={index} value={atitle.id}>
                        
                          {atitle?.title}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="atitle"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.atitle ? errors.atitle.message : null}
            
              </FormHelperText>
            </FormControl>
          </Grid> */}

          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            {/* <TextField
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="firstName" required />}
              variant="standard"
              {...register("afName")}
              error={!!errors.afName}
              helperText={errors?.afName ? errors.afName.message : null}
            /> */}

            <Transliteration
              _key={"afName"}
              labelName={"firstName"}
              fieldName={"afName"}
              updateFieldName={"afNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              width={230}
              disabled={disabled}
              label={<FormattedLabel id="firstName" required />}
              error={!!errors.afName}
              helperText={errors?.afName ? errors.afName.message : null}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            <Transliteration
              _key={"amName"}
              labelName={"middleName"}
              fieldName={"amName"}
              updateFieldName={"amNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              width={230}
              disabled={disabled}
              label={<FormattedLabel id="middleName" />}
              error={!!errors.amName}
              helperText={errors?.amName ? errors.amName.message : null}
            />
            {/* <TextField
              InputLabelProps={{
                shrink:
                  (watch("amName") ? true : false) ||
                  (router?.query?.amName ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              //label="Middle Name *"
              label={<FormattedLabel id="middleName" />}
              variant="standard"
              {...register("amName")}
              error={!!errors.amName}
              helperText={errors?.amName ? errors.amName.message : null}
            /> */}
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            <Transliteration
              _key={"alName"}
              labelName={"lastName"}
              fieldName={"alName"}
              updateFieldName={"alNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              width={230}
              disabled={disabled}
              label={<FormattedLabel id="lastName" required />}
              error={!!errors.alName}
              helperText={errors?.alName ? errors.alName.message : null}
            />
            {/* <TextField
              InputLabelProps={{
                shrink:
                  (watch("alName") ? true : false) ||
                  (router.query.alName ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              //label="Last Name *"
              label={<FormattedLabel id="lastName" required />}
              variant="standard"
              {...register("alName")}
              error={!!errors.alName}
              helperText={errors?.alName ? errors.alName.message : null}
            /> */}
          </Grid>
        </div>

        <div className={styles.row}>
          {/* <div>
            <FormControl
              variant="standard"
              error={!!errors.atitleMr}
              sx={{ marginTop: "2vh" }}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="title" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    InputLabelProps={{
                      shrink:
                        (watch("atitleMr") ? true : false) ||
                        (router.query.atitleMr ? true : false),
                    }}
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      setValue("atitle", value.target.value);
                    }}
                    label="Title *"
                    id="demo-simple-select-standard"
                    labelId="id='demo-simple-select-standard-label'"
                  >
                    {atitles &&
                      atitles.map((atitleMr, index) => (
                        <MenuItem key={index} value={atitleMr.id}>
                          {atitleMr?.titlemr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="atitleMr"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.atitleMr ? errors.atitleMr.message : null}
              </FormHelperText>
            </FormControl>
          </div> */}

          <div>
            {/* <TextField
              InputLabelProps={{
                shrink:
                  (watch("afNameMr") ? true : false) ||
                  (router.query.afNameMr ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="firstNamemr" required />}
              // label=" Hello"
              variant="standard"
              {...register("afNameMr")}
              error={!!errors.afNameMr}
              helperText={errors?.afNameMr ? errors.afNameMr.message : null}
            /> */}

            <Transliteration
              _key={"afNameMr"}
              labelName={"firstNamemr"}
              fieldName={"afNameMr"}
              updateFieldName={"afName"}
              sourceLang={"mar"}
              targetLang={"eng"}
              width={230}
              disabled={disabled}
              label={<FormattedLabel id="firstNamemr" required />}
              error={!!errors.afNameMr}
              helperText={errors?.afNameMr ? errors.afNameMr.message : null}
            />
          </div>

          <div>
            <Transliteration
              _key={"amNameMr"}
              labelName={"middleNamemr"}
              fieldName={"amNameMr"}
              updateFieldName={"amName"}
              sourceLang={"mar"}
              targetLang={"eng"}
              width={230}
              disabled={disabled}
              label={<FormattedLabel id="middleNamemr" />}
              error={!!errors.amNameMr}
              helperText={errors?.amNameMr ? errors.amNameMr.message : null}
            />
            {/* <TextField
              InputLabelProps={{
                shrink:
                  (watch("amNameMr") ? true : false) ||
                  (router.query.amNameMr ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              //label="Middle Name *"
              label={<FormattedLabel id="middleNamemr" />}
              variant="standard"
              {...register("amNameMr")}
              error={!!errors.amNameMr}
              helperText={errors?.amNameMr ? errors.amNameMr.message : null}
            /> */}
          </div>
          <div>
            <Transliteration
              _key={"alNameMr"}
              labelName={"lastNamemr"}
              fieldName={"alNameMr"}
              updateFieldName={"alName"}
              sourceLang={"mar"}
              targetLang={"eng"}
              width={230}
              disabled={disabled}
              label={<FormattedLabel id="lastNamemr" required />}
              error={!!errors.alNameMr}
              helperText={errors?.alNameMr ? errors.alNameMr.message : null}
            />
            {/* <TextField
              InputLabelProps={{
                shrink:
                  (watch("alNameMr") ? true : false) ||
                  (router.query.alNameMr ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              //label="Last Name *"
              label={<FormattedLabel id="lastNamemr" required />}
              variant="standard"
              {...register("alNameMr")}
              error={!!errors.alNameMr}
              helperText={errors?.alNameMr ? errors.alNameMr.message : null}
            /> */}
          </div>
        </div>

        <div
          className={styles.row}
          // style={{ marginRight: "50%" }}
        >
          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch("aemail") ? true : false) ||
                  (router.query.aemail ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="email" required />}
              variant="standard"
              {...register("aemail")}
              error={!!errors.aemail}
              helperText={errors?.aemail ? errors.aemail.message : null}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            <TextField
              inputProps={{ maxLength: 10 }}
              InputLabelProps={{
                shrink:
                  (watch("amobileNo") ? true : false) ||
                  (router.query.amobileNo ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              // type="number"

              id="standard-basic"
              label={<FormattedLabel id="mobileNo" required />}
              variant="standard"
              {...register("amobileNo")}
              error={!!errors.amobileNo}
              helperText={errors?.amobileNo ? errors.amobileNo.message : null}
            />
          </Grid>
        </div>

        <div className={styles.details}>
          <div className={styles.h1Tag}>
            <h3
              style={{
                color: "white",
                marginTop: "7px",
              }}
            >
              {" "}
              {<FormattedLabel id="Adress" />}
            </h3>
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch("aflatBuildingNo") ? true : false) ||
                  (router.query.aflatBuildingNo ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="flatBuildingNo" />}
              variant="standard"
              {...register("aflatBuildingNo")}
              error={!!errors.aflatBuildingNo}
              helperText={
                errors?.aflatBuildingNo ? errors.aflatBuildingNo.message : null
              }
            />
            {/* <Transliteration
              _key={"aflatBuildingNo"}
              labelName={"flatBuildingNo"}
              fieldName={"aflatBuildingNo"}
              updateFieldName={"flatBuildingNomr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              disabled={disabled}
              label={<FormattedLabel id="flatBuildingNo" required />}
              error={!!errors.aflatBuildingNo}
              helperText={
                errors?.aflatBuildingNo ? errors.aflatBuildingNo.message : null
              }
            /> */}
          </div>
          <div>
            {/* <TextField
              InputLabelProps={{
                shrink:
                  (watch("abuildingName") ? true : false) ||
                  (router.query.abuildingName ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="buildingName" required />}
              variant="standard"
              {...register("abuildingName")}
              error={!!errors.abuildingName}
              helperText={
                errors?.abuildingName ? errors.abuildingName.message : null
              }
            /> */}

            <Transliteration
              _key={"abuildingName"}
              labelName={"buildingName"}
              fieldName={"abuildingName"}
              updateFieldName={"abuildingNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              width={230}
              disabled={disabled}
              label={<FormattedLabel id="buildingName" />}
              error={!!errors.abuildingName}
              helperText={
                errors?.abuildingName ? errors.abuildingName.message : null
              }
            />
          </div>

          <div>
            {/* <TextField
              InputLabelProps={{
                shrink:
                  (watch("aroadName") ? true : false) ||
                  (router.query.aroadName ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="roadName" required />}
              variant="standard"
              {...register("aroadName")}
              error={!!errors.aroadName}
              helperText={errors?.aroadName ? errors.aroadName.message : null}
            /> */}

            <Transliteration
              _key={"aroadName"}
              labelName={"roadName"}
              fieldName={"aroadName"}
              updateFieldName={"aroadNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              width={230}
              disabled={disabled}
              label={<FormattedLabel id="roadName" required />}
              error={!!errors.aroadName}
              helperText={errors?.aroadName ? errors.aroadName.message : null}
            />
          </div>
          <div>
            {/* <TextField
              InputLabelProps={{
                shrink:
                  (watch("alandmark") ? true : false) ||
                  (router.query.alandmark ? true : false),
              }}
              //disabled
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="Landmark" required />}
              variant="standard"
              {...register("alandmark")}
              error={!!errors.alandmark}
              helperText={errors?.alandmark ? errors.alandmark.message : null}
            /> */}

            <Transliteration
              _key={"alandmark"}
              labelName={"Landmark"}
              fieldName={"alandmark"}
              updateFieldName={"alandmarkMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              width={230}
              disabled={disabled}
              label={<FormattedLabel id="Landmark" required />}
              error={!!errors.alandmark}
              helperText={errors?.alandmark ? errors.alandmark.message : null}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch("aflatBuildingNoMr") ? true : false) ||
                  (router.query.aflatBuildingNoMr ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="flatBuildingNomr" />}
              variant="standard"
              {...register("aflatBuildingNoMr")}
              error={!!errors.aflatBuildingNoMr}
              helperText={
                errors?.aflatBuildingNoMr
                  ? errors.aflatBuildingNoMr.message
                  : null
              }
            />

            {/* <Transliteration
              _key={"aflatBuildingNoMr"}
              labelName={"flatBuildingNomr"}
              fieldName={"aflatBuildingNoMr"}
              updateFieldName={"aflatBuildingNo"}
              sourceLang={"mar"}
              targetLang={"eng"}
              disabled={disabled}
              label={<FormattedLabel id="flatBuildingNomr" required />}
              error={!!errors.aflatBuildingNoMr}
              helperText={
                errors?.aflatBuildingNoMr
                  ? errors.aflatBuildingNoMr.message
                  : null
              }
            /> */}
          </div>
          <div>
            {/* <TextField
              InputLabelProps={{
                shrink:
                  (watch("abuildingNameMr") ? true : false) ||
                  (router.query.abuildingNameMr ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="buildingNamemr" required />}
              variant="standard"
              {...register("abuildingNameMr")}
              error={!!errors.abuildingNameMr}
              helperText={
                errors?.abuildingNameMr ? errors.abuildingNameMr.message : null
              }
            /> */}

            <Transliteration
              _key={"abuildingNameMr"}
              labelName={"buildingNamemr"}
              fieldName={"abuildingNameMr"}
              updateFieldName={"abuildingName"}
              sourceLang={"mar"}
              targetLang={"eng"}
              width={230}
              disabled={disabled}
              label={<FormattedLabel id="buildingNamemr" />}
              error={!!errors.abuildingNameMr}
              helperText={
                errors?.abuildingNameMr ? errors.abuildingNameMr.message : null
              }
            />
          </div>

          <div>
            {/* <TextField
              InputLabelProps={{
                shrink:
                  (watch("aroadNameMr") ? true : false) ||
                  (router.query.aroadNameMr ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="roadNamemr" required />}
              variant="standard"
              {...register("aroadNameMr")}
              error={!!errors.aroadNameMr}
              helperText={
                errors?.aroadNameMr ? errors.aroadNameMr.message : null
              }
            /> */}

            <Transliteration
              _key={"aroadNameMr"}
              labelName={"roadNamemr"}
              fieldName={"aroadNameMr"}
              updateFieldName={"aroadName"}
              sourceLang={"mar"}
              targetLang={"eng"}
              width={230}
              disabled={disabled}
              label={<FormattedLabel id="roadNamemr" required />}
              error={!!errors.aroadNameMr}
              helperText={
                errors?.aroadNameMr ? errors.aroadNameMr.message : null
              }
            />
          </div>
          <div>
            {/* <TextField
              //disabled
              InputLabelProps={{
                shrink:
                  (watch("alandmarkMr") ? true : false) ||
                  (router.query.alandmarkMr ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="Landmarkmr" required />}
              variant="standard"
              {...register("alandmarkMr")}
              error={!!errors.alandmarkMr}
              helperText={
                errors?.alandmarkMr ? errors.alandmarkMr.message : null
              }
            /> */}

            <Transliteration
              _key={"alandmarkMr"}
              labelName={"Landmark"}
              fieldName={"alandmarkMr"}
              updateFieldName={"alandmark"}
              sourceLang={"mar"}
              targetLang={"eng"}
              width={230}
              disabled={disabled}
              label={<FormattedLabel id="Landmarkmr" required />}
              error={!!errors.alandmarkMr}
              helperText={
                errors?.alandmarkMr ? errors.alandmarkMr.message : null
              }
            />
          </div>
        </div>

        <div className={styles.row} /* style={{ marginRight: "25%" }} */>
          <div>
            {/* <TextField
              // disabled
              InputLabelProps={{
                shrink:
                  (watch("acityName") ? true : false) ||
                  (router.query.acityName ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="cityName" required />}
              variant="standard"
              {...register("acityName")}
              error={!!errors.acityName}
              helperText={errors?.acityName ? errors.acityName.message : null}
            /> */}
            <Transliteration
              _key={"acityName"}
              labelName={"cityName"}
              fieldName={"acityName"}
              updateFieldName={"acityNameMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              width={230}
              disabled={disabled}
              label={<FormattedLabel id="cityName" required />}
              error={!!errors.acityName}
              helperText={errors?.acityName ? errors.acityName.message : null}
            />
          </div>

          <div>
            <TextField
              InputLabelProps={{
                shrink:
                  (watch("astate") ? true : false) ||
                  (router.query.astate ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="State" required />}
              variant="standard"
              // defaultValue="Maharashtra"
              {...register("astate")}
              error={!!errors.astate}
              helperText={errors?.astate ? errors.astate.message : null}
            />
          </div>

          <div>
            {/* <TextField
              // disabled
              InputLabelProps={{
                shrink:
                  (watch("acityNameMr") ? true : false) ||
                  (router.query.acityNameMr ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="cityNamemr" required />}
              variant="standard"
              {...register("acityNameMr")}
              error={!!errors.acityNameMr}
              helperText={
                errors?.acityNameMr ? errors.acityNameMr.message : null
              }
            /> */}

            <Transliteration
              _key={"acityNameMr"}
              labelName={"cityNamemr"}
              fieldName={"acityNameMr"}
              updateFieldName={"acityName"}
              sourceLang={"mar"}
              targetLang={"eng"}
              width={230}
              disabled={disabled}
              label={<FormattedLabel id="cityNamemr" required />}
              error={!!errors.acityNameMr}
              helperText={
                errors?.acityNameMr ? errors.acityNameMr.message : null
              }
            />
          </div>

          <div>
            <TextField
              // InputLabelProps={{
              //   shrink:
              //     (watch('astateMr') ? true : false) ||
              //     (router.query.astateMr ? true : false),
              // }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="statemr" required />}
              variant="standard"
              {...register("astateMr")}
              error={!!errors.astateMr}
              helperText={errors?.astateMr ? errors.astateMr.message : null}
            />
          </div>
        </div>

        <div style={{ marginLeft: "6vh" }}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField
              inputProps={{ maxLength: 6 }}
              //disabled
              InputLabelProps={{
                shrink:
                  (watch("apincode") ? true : false) ||
                  (router.query.apincode ? true : false),
              }}
              disabled={disabled}
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="pincode" required />}
              variant="standard"
              {...register("apincode")}
              error={!!errors.apincode}
              helperText={errors?.apincode ? errors.apincode.message : null}
            />
          </Grid>
        </div>

        <div className={styles.details}>
          <div className={styles.h1Tag}>
            <h3
              style={{
                color: "white",
                marginTop: "7px",
              }}
            >
              {" "}
              {<FormattedLabel id="marrigeDetails" />}
            </h3>
          </div>
        </div>

        <div className={styles.row}>
          <div>
            <FormControl
              variant="standard"
              sx={{ marginTop: 0 }}
              error={!!errors.marriageDate}
            >
              <Controller
                control={control}
                name="marriageDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      variant="standard"
                      maxDate={new Date()}
                      disabled={disabled}
                      inputFormat="DD/MM/YYYY"
                      label={
                        <span style={{ fontSize: 14 }}>
                          {" "}
                          {<FormattedLabel id="marrigeDate" required />}
                        </span>
                      }
                      value={field.value}
                      onChange={(date) =>
                        field.onChange(moment(date).format("YYYY-MM-DD"))
                      }
                      selected={field.value}
                      center
                      renderInput={(params) => (
                        <TextField
                          variant="standard"
                          error={!!errors.marriageDate}
                          disabled={disabled}
                          {...params}
                          size="small"
                          fullWidth
                          InputLabelProps={{
                            style: {
                              fontSize: 12,
                              marginTop: 3,
                              padding: 2,
                            },
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>
                {errors?.marriageDate ? errors.marriageDate.message : null}
              </FormHelperText>
            </FormControl>
          </div>

          <div>
            <Transliteration
              _key={"pplaceOfMarriage"}
              labelName={"placeofMarriage"}
              fieldName={"pplaceOfMarriage"}
              updateFieldName={"pplaceOfMarriageMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              targetError={"pplaceOfMarriageMr"}
              width={230}
              disabled={disabled}
              label={<FormattedLabel id="placeofMarriage" required />}
              error={!!errors.pplaceOfMarriage}
              helperText={
                errors?.pplaceOfMarriage
                  ? errors.pplaceOfMarriage.message
                  : null
              }
            />
            {/* <TextField
              disabled={disabled}
              autoFocus
              InputLabelProps={{
                shrink:
                  (watch("pplaceOfMarriage") ? true : false) ||
                  (router.query.pplaceOfMarriage ? true : false),
              }}
              id="standard-basic"
              label={<FormattedLabel id="placeofMarriage" required />}
              variant="standard"
              {...register("pplaceOfMarriage")}
              error={!!errors?.pplaceOfMarriage}
              helperText={
                errors?.pplaceOfMarriage
                  ? errors.pplaceOfMarriage.message
                  : null
              }
            /> */}
          </div>

          <div>
            <Transliteration
              _key={"pplaceOfMarriageMr"}
              labelName={"placeofMarriage1"}
              fieldName={"pplaceOfMarriageMr"}
              updateFieldName={"pplaceOfMarriage"}
              sourceLang={"mar"}
              targetLang={"eng"}
              targetError={"pplaceOfMarriage"}
              width={230}
              disabled={disabled}
              label={<FormattedLabel id="placeofMarriage1" required />}
              error={!!errors.pplaceOfMarriageMr}
              helperText={
                errors?.pplaceOfMarriageMr
                  ? errors.pplaceOfMarriageMr.message
                  : null
              }
            />
            {/* <TextField
              InputLabelProps={{
                shrink:
                  (watch("pplaceOfMarriageMr") ? true : false) ||
                  (router.query.pplaceOfMarriageMr ? true : false),
              }}
              disabled={disabled}
              autoFocus
              id="standard-basic"
              label={<FormattedLabel id="placeofMarriage1" required />}
              variant="standard"
              {...register("pplaceOfMarriageMr")}
              onChange={(e) => console.log("test", e)}
              error={!!errors?.pplaceOfMarriageMr}
              helperText={
                errors?.pplaceOfMarriageMr
                  ? errors.pplaceOfMarriageMr.message
                  : null
              }
            /> */}
          </div>

          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            <FormControl
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors.lawOfMarriage}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="lawOfMarriage" required />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                  >
                    {lawOfMarriage &&
                      lawOfMarriage.map((way, index) => (
                        <MenuItem key={index} value={way.id}>
                          {language == "en" ? way?.value : way?.valueMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="lawOfMarriage"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.lawOfMarriage ? errors.lawOfMarriage.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          {/* <div>
            <Transliteration
              _key={"lawOfMarriage"}
              labelName={"personalLawEn"}
              fieldName={"lawOfMarriage"}
              updateFieldName={"lawOfMarriageMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              targetError={"lawOfMarriageMr"}
              width={230}
              disabled={disabled}
              label={<FormattedLabel id="personalLawEn" />}
              error={!!errors.lawOfMarriage}
              helperText={
                errors?.lawOfMarriage ? errors.lawOfMarriage.message : null
              }
            />
          </div> */}
        </div>
        {/* <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginLeft: "6vh",
          }}
        >
          <div>
            <Transliteration
              _key={"lawOfMarriageMr"}
              labelName={"personalLawMr"}
              fieldName={"lawOfMarriageMr"}
              updateFieldName={"lawOfMarriage"}
              sourceLang={"mar"}
              targetLang={"eng"}
              targetError={"lawOfMarriage"}
              width={230}
              disabled={disabled}
              label={<FormattedLabel id="personalLawMr" />}
              error={!!errors.lawOfMarriageMr}
              helperText={
                errors?.lawOfMarriageMr ? errors.lawOfMarriageMr.message : null
              }
            />
          </div>
        </div> */}
      </div>
    </>
  );
};

export default ApplicantDetails;
