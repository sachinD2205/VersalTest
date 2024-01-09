import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import URLS from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { sortByAsc } from "../../../../containers/reuseableComponents/Sorter";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import AddMember from "./AddMember";

const Swimming = ({ readOnly = false }) => {
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useFormContext();

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
  const [applicationList, setApplicationList] = useState([]);
  const [slots, setSlots] = useState([]);
  const [checkVenue, setCheckVenue] = useState(true);
  const router = useRouter();
  const [temp1, setTemp1] = useState();
  const [facilityTypess, setFacilityTypess] = useState([]);
  const [facilityNames, setFacilityNames] = useState([]);
  const [venues, setVenues] = useState([]);
  const [facilityNameField, setFacilityNameField] = useState(true);
  const [selectedFacilityType, setSelectedFacilityType] = useState();
  const [selectedFacilityName, setSelectedFacilityName] = useState();
  const [venueField, setVenueField] = useState(true);
  const [sectionId, setSectionId] = useState([]);
  const language = useSelector((state) => state?.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const [btnValue, setButtonValue] = useState(false);
  const [zoneNames, setZoneNames] = useState([]);
  const [getward, setWard] = useState([]);
  const [durationTypess, setDurationTypess] = useState([]);
  const [applicantTypess, setApplicantTypess] = useState([]);
  const [genders, setGenders] = useState([]);
  const [kayAheNaav, setKayAheNaav] = useState("Individual");
  const [bookingType, setBookingType] = useState([
    { id: 1, bookingTypeEn: "Concession", bookingTypeMr: "सवलत" },
    { id: 2, bookingTypeEn: "No Concession", bookingTypeMr: "सवलत नाही" },
    // { id: 1, bookingTypeEn: "Group", bookingTypeMr: "गट" },
    // { id: 2, bookingTypeEn: "Individual", bookingTypeMr: "वैयक्तिक" },
  ]);
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      name: "swimmingPoolDetailsDao",
      control,
    }
  );

  /// getWardNames
  const getWardNames = () => {
    axios
      .get(`${URLS.CFCURL}/master/ward/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setWard(
          r.data.ward.map((row) => ({
            id: row.id,
            wardName: row.wardName,
            wardNameMr: row.wardNameMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  //getAlltypes
  const getAllTypes = () => {
    axios
      .get(`${URLS.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setSectionId(
          r.data.zone.map((row) => ({
            id: row.id,
            zoneName: row.zoneName,
            zoneNameMr: row.zoneNameMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  /// getDurationTypes
  const getDurationTypes = () => {
    const url = `${URLS.SPURL}/master/durationType/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setValue(
          "durationType",
          r?.data?.durationType?.find((ff) => ff?.id === 13).id
        );
        setDurationTypess(
          r?.data?.durationType.map((row) => ({
            id: row?.id,
            typeName: row?.typeName,
            typeNameMr: row?.typeNameMr,
            durationNo: row?.durationNo,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // getApplicant Type
  const getApplicantTypes = () => {
    axios
      .get(`${URLS.SPURL}/applicantType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        sortByAsc(r.data.applicantType, "typeName");
        console.log(" types :", r.data.applicantType);
        setApplicantTypess(r.data.applicantType);
        setApplicantTypess(
          r.data.applicantType.map((row) => ({
            id: row.id,
            typeName: row.typeName,
            typeNameMr: row.typeNameMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // getGenders
  const getGenders = () => {
    axios
      .get(`${URLS.CFCURL}/master/gender/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setGenders(
          r.data.gender.map((row) => ({
            id: row.id,
            gender: row.gender,
            genderMr: row.genderMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  /// getVenue
  const getVenue = () => {
    axios
      .get(`${URLS.SPURL}/venueMasterSection/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        sortByAsc(r.data.venueSection, "venue");
        console.log("00", r);
        setVenues(
          r.data.venueSection.map((row) => ({
            id: row.id,
            venue: row.venue,
            venueMr: row.venueMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getFacilityName = () => {
    axios
      .get(`${URLS.SPURL}/facilityName/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setValue(
          "facilityName",
          r.data.facilityName?.find((ff) => ff.id === 35).id
        );
        setFacilityNames(
          r.data.facilityName.map((row) => ({
            id: row.id,
            facilityName: row.facilityName,
            facilityNameMr: row.facilityNameMr,
            facilityType: row.facilityType,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getFacilityTypes = () => {
    axios
      .get(`${URLS.SPURL}/facilityType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setValue(
          "facilityType",
          r.data.facilityType?.find((ff) => ff.id === 3).id
        );

        setFacilityTypess(
          r.data.facilityType.map((row) => ({
            id: row.id,
            facilityType: row.facilityType,
            facilityTypeMr: row.facilityTypeMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getZoneWardID = () => {
    let venue = watch("venue");

    if (venue != null && venue != undefined && venue != "") {
      axios
        .get(
          `${URLS.SPURL}/venueMasterSection/getZoneAndWardById?id=${venue}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res?.data) {
            let tempp = res.data.venueSection.map((row) => ({
              id: row.id,
              zoneName: sectionId?.find((obj) => obj?.id === row.zoneName)?.id,
              wardName: getward?.find((obj) => obj?.id === row.wardName)?.id,
            }));
            setValue("zoneName", tempp[0].zoneName);
            setValue("wardName", tempp[0].wardName);
          } else {
            setValue("zoneName", null);
            setValue("wardName", null);
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  /// getSlots
  const getSlots = () => {
    const facilityName = watch("facilityName");
    const venue = watch("venue");
    const date = watch("date");

    axios
      // .get(
      //   `${URLS.SPURL}/bookingTime/getFromBookingTimeAndToBookingTimeByVenueAndDateAndFacilityName?facilityName=${facilityName}&venue=${venue}&date=${date}`
      // )
      .get(
        `${URLS.SPURL}/master/venueDetails/getFromBookingTimeAndToBookingTimeByVenueAndDateAndFacilityName?venue=${venue}&facilityName=${facilityName}&date=${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        let temp = res?.data[0]?.slotDetailsDao?.map((row) => ({
          id: row.id,
          slot: row.fromTime + "-" + row.toTime,
        }));
        setSlots(temp);
        console.log("res.message", temp);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    // .then((res) => {
    //   if (res?.status == 200 || res?.status == 201) {
    //     const temp = res.data.map((row) => ({
    //       id: row.id,
    //       slot: row.fromBookingTime + "-" + row.toBookingTime,
    //     }));
    //     setSlots(temp);
    //     console.log("res.message", temp);
    //   }
    // })
    // .catch((error) => {
    //   console.log("slotApiCatch", error);
    // });
  };

  // getVenueList
  const getVenueList = () => {
    const id = watch("facilityName");

    if (id != null && id != undefined && id != "") {
      axios
        .get(
          `${URLS.SPURL}/venueMasterSection/getVenueByFacilityName?facilityName=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log("66", res.data.venueSection);

          let temp = res.data.venueSection.map((row) => ({
            id: row.id,
            venue: row.venue,
            venueMr: row.venueMr,
          }));
          setVenues(temp);

          console.log("90", venues);
          console.log("900", temp);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  //=================================>
  useEffect(() => {
    getGenders();
    getAllTypes();
    getWardNames();
    getVenue();
    getFacilityTypes();
    getFacilityName();
    getDurationTypes();
    getApplicantTypes();
  }, []);

  useEffect(() => {
    if (
      watch("venue") != null &&
      watch("venue") != undefined &&
      watch("venue") != "" &&
      watch("facilityName") != null &&
      watch("facilityName") != undefined &&
      watch("facilityName") != "" &&
      watch("date") != null &&
      watch("date") != undefined &&
      watch("date") != ""
    ) {
      getSlots();
    }
  }, [watch("venue"), watch("facilityName"), watch("date")]);

  useEffect(() => {
    if (
      watch("facilityName") != null &&
      watch("facilityName") != undefined &&
      watch("facilityName") != ""
    ) {
      getVenueList();
    }
  }, [watch("facilityName")]);

  useEffect(() => {
    if (
      watch("venue") != null &&
      watch("venue") != undefined &&
      watch("venue") != ""
    ) {
      getZoneWardID();
    } else {
      setValue("zoneName", null);
      setValue("wardName", null);
    }
  }, [watch("venue")]);

  // view
  return (
    <div>
      <div
        style={{
          backgroundColor: "#0084ff",
          color: "white",
          fontSize: 19,
          marginTop: 30,
          marginBottom: 30,
          padding: 8,
          paddingLeft: 30,
          marginLeft: "40px",
          marginRight: "65px",
          borderRadius: 100,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <strong>
          {/* Booking Details */}
          <FormattedLabel id="bookingDetails" />
        </strong>
      </div>
      <Grid
        container
        sx={{ marginLeft: 5, marginTop: 1, marginBottom: 5, align: "center" }}
      >
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            variant="standard"
            // sx={{ m: 1, minWidth: 120 }}
            error={!!errors.facilityType}
          >
            <InputLabel shrink={true} id="demo-simple-select-standard-label">
              {<FormattedLabel id="facilityType" required />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ minWidth: 220 }}
                  disabled
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    console.log("value: ", value.target.value);
                    setSelectedFacilityType(value.target.value);
                    setFacilityNameField(false);
                  }}
                  label="facilityType"
                >
                  {facilityTypess &&
                    facilityTypess.map((facilityType, index) => (
                      <MenuItem key={index} value={facilityType.id}>
                        {language == "en"
                          ? facilityType?.facilityType
                          : facilityType?.facilityTypeMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="facilityType"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.facilityType ? errors.facilityType.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            variant="standard"
            // sx={{ m: 1, minWidth: 120 }}
            error={!!errors.facilityName}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="facilityName" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ minWidth: 220 }}
                  // disabled={readOnly}
                  disabled
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    setCheckVenue(false);
                  }}
                  label="facilityName"
                  // disabled={facilityNameField}
                >
                  {facilityNames &&
                    facilityNames
                      .filter((facility) => {
                        return facility.facilityType === watch("facilityType");
                      })
                      .map((facilityName, index) => (
                        <MenuItem key={index} value={facilityName.id}>
                          {language == "en"
                            ? facilityName?.facilityName
                            : facilityName?.facilityNameMr}
                        </MenuItem>
                      ))}
                </Select>
              )}
              name="facilityName"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.facilityName ? errors.facilityName.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            variant="standard"
            // sx={{ m: 1, minWidth: 120 }}
            error={!!errors.venue}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {/* <InputLabel shrink={true} id="demo-simple-select-standard-label"> */}
              {<FormattedLabel id="venue" required />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ minWidth: 195 }}
                  disabled={readOnly}
                  labelId="demo-simple-select-standard-label"
                  Fdate
                  id="demo-simple-select-standard"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  label="venue"
                >
                  {venues &&
                    venues
                      .filter((facility) => {
                        return facility.facilityName === selectedFacilityName;
                      })
                      .map((venue, index) => (
                        <MenuItem key={index} value={venue.id}>
                          {language == "en" ? venue?.venue : venue?.venueMr}
                        </MenuItem>
                      ))}
                </Select>
              )}
              name="venue"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.venue ? errors.venue.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            variant="standard"
            // sx={{ m: 1, minWidth: 120 }}
            error={!!errors.zone}
          >
            <InputLabel
              shrink={
                watch("zoneName") != null &&
                watch("zoneName") != undefined &&
                watch("zoneName") != ""
                  ? true
                  : false
              }
              id="demo-simple-select-standard-label"
            >
              {<FormattedLabel id="zone" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ minWidth: 220 }}
                  // disabled={readOnly}
                  disabled
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={field.value}
                  // onChange={(value) => field.onChange(value)}
                  onChange={(value) => {
                    field.onChange(value);
                    console.log("Zone Key: ", value.target.value);
                    setTemp1(value.target.value);
                  }}
                  label="zoneName"
                >
                  {sectionId &&
                    sectionId.map((zoneName, index) => (
                      <MenuItem key={index} value={zoneName.id}>
                        {language == "en"
                          ? zoneName?.zoneName
                          : zoneName?.zoneNameMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="zoneName"
              control={control}
              defaultValue={null}
            />

            <FormHelperText>
              {errors?.zone ? errors.zone.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            variant="standard"
            // sx={{ m: 1, minWidth: 120 }}
            error={!!errors.wardName}
          >
            <InputLabel
              shrink={
                watch("wardName") != null &&
                watch("wardName") != undefined &&
                watch("wardName") != ""
                  ? true
                  : false
              }
              id="demo-simple-select-standard-label"
            >
              {<FormattedLabel id="ward" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled
                  sx={{ minWidth: 220 }}
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="wardName"
                >
                  {getward &&
                    getward.map((wardName, index) => (
                      <MenuItem key={index} value={wardName.id}>
                        {language == "en"
                          ? wardName?.wardName
                          : wardName?.wardNameMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="wardName"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.wardName ? errors.wardName.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            // disabled={editable}
            error={!!errors.type}
            sx={{ marginTop: 2 }}
          >
            <InputLabel
              shrink={
                watch("type") != null &&
                watch("type") != undefined &&
                watch("type") != ""
                  ? true
                  : false
              }
              id="demo-simple-select-standard-label"
            >
              {<FormattedLabel id="bookingType" required />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ minWidth: 195 }}
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value), setKayAheNaav(value.target.value);
                  }}
                  label="type"
                >
                  {bookingType.map((menu, index) => {
                    return (
                      <MenuItem key={index} value={menu.bookingTypeEn}>
                        {language == "en"
                          ? menu.bookingTypeEn
                          : menu.bookingTypeMr}
                      </MenuItem>
                    );
                  })}
                </Select>
              )}
              name="type"
              control={control}
              defaultValue={null}
            />

            <FormHelperText>
              {errors?.type ? errors.type.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        {kayAheNaav === "Concession" && (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl
              disabled={readOnly}
              variant="standard"
              // sx={{ m: 1, minWidth: 120 }}
              error={!!errors.applicantType}
            >
              <InputLabel
                shrink={
                  watch("type") != null &&
                  watch("applicantType") != undefined &&
                  watch("applicantType") != ""
                    ? true
                    : false
                }
                id="demo-simple-select-standard-label"
              >
                <FormattedLabel id="applicantType" required />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ minWidth: 220 }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      console.log("value: ", value.target.value);
                      setSelectedFacilityType(value.target.value);
                      // setDisableKadhnariState(false);
                    }}
                    label="applicantType"
                  >
                    {applicantTypess &&
                      applicantTypess.map((applicantType, index) => (
                        // <MenuItem key={index} value={applicantType.id}>
                        //   {applicantType.typeName}
                        // </MenuItem>
                        <MenuItem key={index} value={applicantType.id}>
                          {language == "en"
                            ? applicantType?.typeName
                            : applicantType?.typeNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="applicantType"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.applicantType ? errors.applicantType.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
        )}
        {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            variant="standard"
            // sx={{ m: 1, minWidth: 120 }}
            error={!!errors.applicantType}
          >
            <InputLabel shrink={watch("applicantType") != null && watch("applicantType") != undefined && watch("applicantType") != "" ? true : false} id="demo-simple-select-standard-label">
              {" "}
              <FormattedLabel id="applicantType" required />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ minWidth: 220 }}
                  disabled={readOnly}
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    console.log("value: ", value.target.value);
                    setSelectedFacilityType(value.target.value);
                    // setDisableKadhnariState(false);
                  }}
                  label="applicantType"
                >
                  {applicantTypess &&
                    applicantTypess.map((applicantType, index) => (
                      <MenuItem key={index} value={applicantType.id}>
                        {language == "en"
                          ? applicantType?.typeName
                          : applicantType?.typeNameMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="applicantType"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.applicantType ? errors.applicantType.message : null}
            </FormHelperText>
          </FormControl>
        </Grid> */}
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl variant="standard" error={!!errors.durationType}>
            <InputLabel
              shrink={
                watch("durationType") != null &&
                watch("durationType") != undefined &&
                watch("durationType") != ""
                  ? true
                  : false
              }
              id="demo-simple-select-standard-label"
            >
              <FormattedLabel id="durationType" />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ minWidth: 220 }}
                  disabled
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    console.log("value: ", value.target.value);
                    // setSelectedFacilityType(value.target.value);
                    // setDisableKadhnariState(false);
                  }}
                  label="durationType"
                >
                  {durationTypess &&
                    durationTypess.map((durationType, index) => (
                      <MenuItem key={index} value={durationType.id}>
                        {language == "en"
                          ? durationType?.typeName
                          : durationType?.typeNameMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="durationType"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.durationType ? errors.durationType.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl style={{ marginTop: 2 }} error={!!errors.date}>
            <Controller
              control={control}
              name="date"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    minDate={new Date()}
                    inputFormat="DD/MM/YYYY"
                    disabled={readOnly}
                    label={
                      <span style={{ fontSize: 16 }}>
                        {<FormattedLabel id="date" required />}
                      </span>
                    }
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(moment(date).format("YYYY-MM-DD"));
                    }}
                    selected={field.value}
                    center
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          style: {
                            fontSize: 12,
                            marginTop: 3,
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
            <FormHelperText>
              {errors?.date ? errors.date.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            variant="standard"
            style={{ marginTop: 20 }}
            error={!!errors.bookingTimeId}
          >
            <InputLabel
              shrink={
                watch("bookingTimeId") != null &&
                watch("bookingTimeId") != undefined &&
                watch("bookingTimeId") != ""
                  ? true
                  : false
              }
              id="demo-simple-select-standard-label"
            >
              {<FormattedLabel id="selectSlot" required />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ minWidth: 220 }}
                  disabled={readOnly}
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="slots"
                >
                  {slots &&
                    slots.map((slot, index) => (
                      <MenuItem key={index} value={slot.id}>
                        {slot.slot}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="bookingTimeId"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.bookingTimeId ? errors.bookingTimeId.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
      <AddMember />
    </div>
  );
};

export default Swimming;
