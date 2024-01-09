import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../URLS/urls";
import Loader from "../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

const Index = () => {
  const {
    register,
    control,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useFormContext({});
  const language = useSelector((state) => state?.labels?.language);
  const [villages, setVillages] = useState([]);
  const [areaId, setAreaId] = useState([]);
  const [areaDetails, setAreaDetails] = useState([]);
  const [allZones, setAllZones] = useState([]);
  const [allWards, setAllWards] = useState([]);
  const [OfficeLocationName, setOfficeLocationName] = useState([]);
  const [OfficeLocationName1, setOfficeLocationName1] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [areaname, setArea] = useState("");
  const [selectedAreaNm, setSelectedAreaNm] = useState("");

  // useEffect(()=>{
  //   getAreas()
  // },[selectedAreaNm])

  // getAreas
  const getAreas = (area) => {
    if (area != null && area != "") {
      setAreaId([]);
      setAreaDetails([]);
      setIsLoading(true);
      axios
        .get(
          `${urls.CFCURL}/master/zoneWardAreaMapping/getAreaName?moduleId=9&areaName=${area}`,
        )
        .then((res) => {
          setIsLoading(false);
          if (res?.status === 200 || res?.status === 201) {
            if (res?.data.length !== 0) {
              let data = res?.data?.map((r, i) => ({
                id: r.id,
                srNo: i + 1,
                areaId: r.areaId,
                zoneId: r.zoneId,
                wardId: r.wardId,
                zoneName: r.zoneName,
                zoneNameMr: r.zoneNameMr,
                wardName: r.wardName,
                wardNameMr: r.wardNameMr,
                areaName: r.areaName,
                areaNameMr: r.areaNameMr,
              }));

              const areaNm = data.map((hut) => hut.areaName);
              setAreaId(areaNm);
              setAreaDetails(data);
            } else {
              setValue("wardKey", null);
              setValue("zoneKey", null);
              clearErrors("zoneKey");
              clearErrors("wardKey");
              setValue("officeLocation", "");
              setOfficeLocationName1([]);
              sweetAlert({
                title: language === "en" ? "OOPS!" : "अरेरे!",
                text:
                  language === "en"
                    ? "Ward, Zone mapping not available for this area"
                    : "या क्षेत्रासाठी प्रभाग, झोन मॅपिंग उपलब्ध नाही",
                icon: "warning",
                dangerMode: true,
                closeOnClickOutside: false,
                button: language === "en" ? "Ok" : "ठीक आहे",
              });
            }
          } else {
            sweetAlert({
              title: language === "en" ? "OOPS!" : "अरेरे!",
              text:
                language === "en"
                  ? "Something went wrong!"
                  : "काहीतरी चूक झाली!",
              icon: "error",
              dangerMode: true,
              closeOnClickOutside: false,
              button: language === "en" ? "Ok" : "ठीक आहे",
            });
          }
        })
        .catch((err) => {
          setIsLoading(false);
          //  catchMethod(err)
        });
    } else {
      setAreaId([]);
      setAreaDetails([]);
      setOfficeLocationName1([]);
    }
  };

  useEffect(() => {
    console.log("areaname ", areaname);
  }, [areaname]);

  const sortByProperty = (property) => {
    return (a, b) => {
      if (a[property] < b[property]) {
        return -1;
      } else if (a[property] > b[property]) {
        return 1;
      }
      return 0;
    };
  };

  // getAllZones
  const getAllZones = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`)
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          setAllZones(
            res?.data?.zone?.map((r, i) => ({
              id: r.id,
              zoneName: r.zoneName,
              zoneNameMr: r.zoneNameMr,
            })),
          );
        } else {
          sweetAlert({
            title: language === "en" ? "OOPS!" : "अरेरे!",
            text:
              language === "en" ? "Something went wrong!" : "काहीतरी चूक झाली!",
            icon: "error",
            dangerMode: true,
            closeOnClickOutside: false,
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        }
      })
      .catch((error2) => {
        sweetAlert({
          title: "OOPS!",
          text: `${error2}`,
          icon: "error",
          dangerMode: true,
          closeOnClickOutside: false,
        });
      });
  };

  // getAllWards
  const getAllWards = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`)
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          setAllWards(
            res?.data?.ward?.map((r, i) => ({
              id: r.id,
              wardName: r.wardName,
              wardNameMr: r.wardNameMr,
            })),
          );
        } else {
          sweetAlert({
            title: language === "en" ? "OOPS!" : "अरेरे!",
            text:
              language === "en" ? "Something went wrong!" : "काहीतरी चूक झाली!",
            icon: "error",
            dangerMode: true,
            closeOnClickOutside: false,
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        }
      })
      .catch((error3) => {
        sweetAlert({
          title: "OOPS!",
          text: `${error3}`,
          icon: "error",
          dangerMode: true,
          button: language === "en" ? "Ok" : "ठीक आहे",
          closeOnClickOutside: false,
        });
      });
  };

  // getVillages
  const getVillages = () => {
    axios.get(`${urls.CFCURL}/master/village/getAll`).then((res) => {
      let data = res?.data?.village?.map((r, i) => ({
        id: r.id,
        srNo: i + 1,
        villageNameEn: r.villageName,
        villageNameMr: r.villageNameMr,
      }));
      setVillages(data.sort(sortByProperty("villageNameEn")));
    });
  };

  // get Office Name
  const gettOfficeLocation = () => {
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`)
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          if (
            res?.data?.officeLocation != null &&
            res?.data?.officeLocation != undefined &&
            res?.data?.officeLocation.length != 0
          ) {
            setOfficeLocationName(
              res?.data?.officeLocation?.map((r, i) => ({
                id: r?.id,
                officeLocationName: r?.officeLocationName,
                officeLocationNameMar: r?.officeLocationNameMar,
              })),
            );
            let data = res?.data?.officeLocation?.map((r, i) => ({
              id: r?.id,
              officeLocationName: r?.officeLocationName,
              officeLocationNameMar: r?.officeLocationNameMar,
            }));
            setOfficeLocationName(
              data.sort(sortByProperty("officeLocationName")),
            );
          } else {
          }
        } else {
        }
      })
      .catch((error) => {});
  };

  // getOfficeLocationByZoneWard
  const getOfficeLocationByZoneWard = () => {
    let moduleId = 9;
    let departmentId = watch("departmentName");
    let zoneId = watch("zoneKey");
    let wardId = watch("wardKey");

    // url
    setIsLoading(true);
    let url = `${urls.CFCURL}/master/zoneWardOfficeLoactionMapping/getBySearchFilter?moduleId=${moduleId}&departmentId=${departmentId}&zoneId=${zoneId}&wardId=${wardId}`;
    axios
      .get(url)
      .then((res) => {
        setIsLoading(false);
        if (res?.status == 200 || res?.status == 201) {
          if (
            res?.data?.zoneWardOfficeLoactionMapping != null &&
            res?.data?.zoneWardOfficeLoactionMapping != undefined
          ) {
            let officeLocationKeys =
              res?.data?.zoneWardOfficeLoactionMapping?.map(
                (data) => data?.officeLocation,
              );
            let filteredArrayOfOfficeLocation = [];

            OfficeLocationName?.map((data) => {
              officeLocationKeys?.map((innerData) => {
                if (innerData == data?.id) {
                  if (!filteredArrayOfOfficeLocation.includes(data)) {
                    filteredArrayOfOfficeLocation.push(data);
                  }
                }
              });
            });
            setOfficeLocationName1(
              filteredArrayOfOfficeLocation.sort(
                sortByProperty("officeLocationName"),
              ),
            );
          } else {
          }
        } else {
        }
      })
      .catch((error) => {
        setIsLoading(false);
        catchMethod(error);
      });
  };

  //! useEffect
  useEffect(() => {
    // getAreaName()
    getAllWards();
    getAllZones();
    getVillages();
    gettOfficeLocation();

    // if (watch("areaKey") !== null && watch("areaKey") !== undefined && watch("areaKey") !== "") {
    //   getAreas();
    // }
  }, []);

  useEffect(() => {
    console.log("ttt ", watch("areaname"));
    if (
      watch("areaname") != null &&
      watch("areaname") != undefined &&
      watch("areaname") != ""
    ) {
      console.log(watch("areaname"));
      // let findAreaIdFromName = areaname.find((obj) => obj.areaName === watch('areaname'))?.areaId
      // let filteredArrayZone = areaname?.filter(
      //   (obj) => obj?.areaId === findAreaIdFromName
      // );
      // setValue('areaKey', areaname?.areaId)
      // console.log('filteredArrayZone ',filteredArrayZone);
      let flArray1 = allZones?.filter((obj) => {
        // return areaname?.some((item) => {
        return areaname?.zoneId === obj?.id;
        // });
      });

      let flArray2 = allWards?.filter((obj) => {
        // return filteredArrayZone?.some((item) => {
        return areaname?.wardId === obj?.id;
        // });
      });

      if (
        flArray1[0]?.id != undefined &&
        flArray1[0]?.id != null &&
        flArray1[0]?.id != ""
      ) {
        setValue("zoneKey", flArray1[0]?.id);
        setValue("wardKey", flArray2[0]?.id);
        clearErrors("zoneKey");
        clearErrors("wardKey");
      }
    } else {
      setValue("zoneKey", null);
      setValue("wardKey", null);
      clearErrors("zoneKey");
      clearErrors("wardKey");
      setValue("officeLocation", "");
    }
  }, [areaname]);

  useEffect(() => {
    if (
      watch("wardKey") != null &&
      watch("zoneKey") != null &&
      watch("departmentName") != null
    )
      getOfficeLocationByZoneWard();
  }, [watch("wardKey"), watch("zoneKey"), watch("departmentName")]);

  // useEffect(()=>{
  //   if(watch('areaName')){
  //     getAreas()
  //   }
  // },[watch('areaName')])

  // view
  return (
    <>
      {isLoading && <Loader />}
      <Grid
        container
        spacing={2}
        style={{
          padding: "1rem",
        }}
      >
        <Grid
          item
          xs={12}
          md={12}
          lg={12}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "baseline",
            gap: 15,
          }}
        >
          <Autocomplete
            style={{
              backgroundColor: "white",
              width: "300px",
            }}
            // value={areaname}
            fullWidth
            onInputChange={(event, newValue) => {
              // setSelectedAreaNm(newValue)
              console.log("onInputChange", newValue);
              getAreas(newValue);
            }}
            onChange={(event, newValue) => {
              console.log("onChange: ", newValue);
              setArea(newValue);
              setValue("areaKey", newValue?.areaId);
              newValue != null
                ? setValue("areaname", newValue.areaName)
                : setValue("areaname", null);
            }}
            options={areaDetails}
            getOptionLabel={(j) => j.areaName}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{
                  m: { xs: 0, md: 1 },
                  minWidth: "100%",
                }}
                variant="standard"
                InputLabelProps={{
                  shrink: watch("areaname") || !!params.inputProps?.value,
                }}
                {...register("areaname")}
                onChange={(e) => console.log("onChange2: ", e.target.value)}
                label={<FormattedLabel id="area" />}
              />
            )}
          />
        </Grid>

        {/**zone */}
        <Grid
          item
          xs={6}
          md={6}
          lg={6}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "baseline",
            gap: 15,
          }}
        >
          <FormControl
            sx={{
              m: { xs: 0, md: 1 },
              // minWidth: "100%"
              width: "260px",
            }}
            error={!!errors.zoneKey}
          >
            <InputLabel
              shrink={watch("zoneKey") == null ? false : true}
              id="demo-simple-select-standard-label"
            >
              <FormattedLabel id="zone" required />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  disabled
                  variant="standard"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  label="Complaint Type"
                >
                  {allZones &&
                    allZones?.map((allZones, index) => (
                      <MenuItem key={index} value={allZones.id}>
                        {language == "en"
                          ? allZones?.zoneName
                          : allZones?.zoneNameMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="zoneKey"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.zoneKey
                ? language == "en"
                  ? "zone name selection is required !!!"
                  : "झोन नाव निवड आवश्यक आहे !!!"
                : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        {/**ward */}
        <Grid
          item
          xs={6}
          md={6}
          lg={6}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "baseline",
            gap: 15,
          }}
        >
          <FormControl
            sx={{
              m: { xs: 0, md: 1 },
              // minWidth: "100%"
              width: "260px",
            }}
            error={!!errors.wardKey}
          >
            <InputLabel
              shrink={watch("wardKey") == null ? false : true}
              id="demo-simple-select-standard-label"
            >
              <FormattedLabel id="ward" required />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  variant="standard"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  label="Complaint Type"
                >
                  {allWards &&
                    allWards?.map((allWards, index) => (
                      <MenuItem key={index} value={allWards.id}>
                        {language == "en"
                          ? allWards?.wardName
                          : allWards?.wardNameMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="wardKey"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.wardKey
                ? language == "en"
                  ? "ward name selection is required !!!"
                  : "वॉर्ड नावाची निवड आवश्यक!!!"
                : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        {/** officeLocation */}
        {/* <Grid item xs={12} sm={6} md={4}>
          <FormControl
            variant="standard"
            error={!!errors.officeLocation}
            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
          >
            <InputLabel
              shrink={watch("officeLocation") == null ? false : true}
              id="demo-simple-select-standard-label"
            >
             
              <FormattedLabel id="officeLocation" required />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                 
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="officeLocation" required />}
                >
                  {OfficeLocationName1 &&
                    OfficeLocationName1?.map((officeLocationName, index) => (
                      <MenuItem key={index} value={officeLocationName.id}>
                        {language == "en"
                          ? officeLocationName?.officeLocationName
                          : officeLocationName?.officeLocationNameMar}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="officeLocation"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.officeLocation
                ? language == "en"
                  ? "office location name selection is required !!!"
                  : "कार्यालय स्थान नाव निवड आवश्यक आहे !!!"
                : null}
            </FormHelperText>
          </FormControl>
        </Grid> */}

        {/** villageName */}
        {/* <Grid item xs={12} sm={6} md={4}>
          <FormControl
            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
            error={!!errors.villageKey}
          >
            <InputLabel
              shrink={watch("villageKey") == null ? false : true}
              id="demo-simple-select-standard-label"
            >
              <FormattedLabel id="villages" required />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="Villages"
                >
                  {villages &&
                    villages.map((village, index) => (
                      <MenuItem key={index} value={village.id}>
                        {language == "en"
                          ? village.villageNameEn
                          : village?.villageNameMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="villageKey"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.villageKey ? errors.villageKey.message : null}
            </FormHelperText>
          </FormControl>
        </Grid> */}
      </Grid>
    </>
    // </Paper>
  );
};

export default Index;
