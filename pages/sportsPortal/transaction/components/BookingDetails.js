import { yupResolver } from "@hookform/resolvers/yup";
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
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import * as yup from "yup";
import URLS from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { sortByAsc } from "../../../../containers/reuseableComponents/Sorter";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = ({ readOnly = false }) => {
  const {
    control,
    register,
    setValue,
    getValues,
    watch,
    clearErrors,
    formState: { errors },
  } = useFormContext({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // schema - validation
  let schema = yup.object().shape({
    // totalGroupMember: yup
    //   .number()
    //   .required("Total Group Member is Required !!!"),
    // groupDetails: yup.string().required("Group Details is Required !!!"),
  });
  const today = moment();
  const firstDayOfMonth = today.startOf("month");
  const isDisabledDate = (date) => !date.isSame(firstDayOfMonth, "day");
  const [duration, setDuration] = useState();
  const [slots, setSlots] = useState([]);
  const [sectionId, setSectionId] = useState([]);
  const [facilityTypess, setFacilityTypess] = useState([]);
  const [facilityNames, setFacilityNames] = useState([]);
  const [venues, setVenues] = useState([]);
  const [kayAheNaav, setKayAheNaav] = useState("Individual");
  const [kayNaav, setKayNaav] = useState("");
  const language = useSelector((state) => state?.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const [editable, setEditable] = useState(false);
  const [durationTypess, setDurationTypess] = useState([]);
  const [getward, setWard] = useState([]);
  const [applicantTypess, setApplicantTypess] = useState([]);
  const [bookingType, setBookingType] = useState([
    { id: 1, bookingTypeEn: "Group", bookingTypeMr: "गट" },
    { id: 2, bookingTypeEn: "Individual", bookingTypeMr: "वैयक्तिक" },
    // { id: 1, bookingTypeEn: "Group", bookingTypeMr: "गट" },
    // { id: 2, bookingTypeEn: "Individual", bookingTypeMr: "वैयक्तिक" },
  ]);

  const [type, setType] = useState([
    { id: 1, typeEn: "Concession", typeMr: "सवलत" },
    { id: 2, typeEn: "No Concession", typeMr: "सवलत नाही" },
    // { id: 1, bookingTypeEn: "Group", bookingTypeMr: "गट" },
    // { id: 2, bookingTypeEn: "Individual", bookingTypeMr: "वैयक्तिक" },
  ]);
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

  // getAllTypes
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
          r.data.facilityType?.find((ff) => ff.id === 1).id
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

  //getFacilityName
  const getFacilityName = () => {
    axios
      .get(`${URLS.SPURL}/facilityName/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setFacilityNames(
          r.data.facilityName.map((row) => ({
            id: row.id,
            facilityName: row.facilityName,
            facilityNameMr: row.facilityNameMr,
            facilityType: row.facilityType,
            facilityTypeMr: row.facilityTypeMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  //getDurationTypes
  const getDurationTypes = () => {
    axios
      .get(`${URLS.SPURL}/master/durationType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log(77, r);
        setDurationTypess(
          r.data.durationType.map((row) => ({
            id: row.id,
            typeName: row.typeName,
            durationNo: row.durationNo,
            typeNameMr: row.typeNameMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  //getDurationId
  const getDurationId = () => {
    axios
      .get(`${URLS.SPURL}/master/durationType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setValue(
          "durationType",
          r.data.durationType?.find((gg) => gg.id === 9).id
        );

        console.log(78, duration);
        setDuration(
          r.data.durationType.map((row) => ({
            id: row.id,
            durationNo: row.durationNo,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // getWard
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

  // Get Venue List
  const getVenueList = () => {
    const id = watch("facilityName");
    const url = `${URLS.SPURL}/venueMasterSection/getVenueByFacilityName?facilityName=${id}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          sortByAsc(res.data.venueSection, "venue");
          console.log("66", res.data.venueSection);
          const temp = res?.data?.venueSection?.map((row) => ({
            id: row?.id,
            venue: row?.venue,
            venueMr: row?.venueMr,
          }));
          setVenues(temp);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // getZoneWardI1D
  const getZoneWardID = () => {
    const venue = watch("venue");
    const url = `${URLS.SPURL}/venueMasterSection/getZoneAndWardById?id=${venue}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          const tempp = res?.data?.venueSection?.map((row) => ({
            id: row?.id,
            zoneName: sectionId?.find((obj) => obj?.id === row?.zoneName)?.id,
            wardName: getward?.find((obj) => obj?.id === row?.wardName)?.id,
          }));
          setValue("zoneName", tempp[0].zoneName);
          setValue("wardName", tempp[0].wardName);
          console.log("2222", tempp, tempp[0].zoneName);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getSlots = (value) => {
    const facilityName = watch("facilityName");
    const facilityType = watch("facilityType");
    const venue = watch("venue");
    const fromDate = watch("fromDate");
    const toDate = watch("toDate");

    axios
      // .get(
      //   `${URLS.SPURL}/bookingTime/getTimesByParameters?facilityName=${facilityName}&venue=${venue}&fromDate=${fromDate}&toDate=${toDate}`,{headers: {
      //     Authorization: `Bearer ${token}`,
      //   }
      //   })
      .get(
        `${URLS.SPURL}/master/venueDetails/getTimesByParameters?fromDate=${fromDate}&toDate=${toDate}&venue=${venue}&facilityName=${facilityName}&facilityType=${facilityType}`,
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
    //     const temp = res?.data?.map((row) => ({
    //       id: row?.id,
    //       slot: row?.fromBookingTime + "-" + row?.toBookingTime,
    //     }));
    //     setSlots(temp);
    //     console.log("res.message", temp);
    //   }
    // });
  };

  //! +=============> useEffects <===============

  // useEffect
  useEffect(() => {
    getFacilityTypes();
    getFacilityName();
    getAllTypes();
    getWardNames();
    getApplicantTypes();
    getDurationTypes();
    getDurationId();
  }, []);

  useEffect(() => {
    console.log("facilityName", getValues("facilityName"));
    if (
      watch("facilityName") === 4 ||
      watch("facilityName") === 13 ||
      watch("facilityName") === 2 ||
      watch("facilityName") === 6 ||
      watch("facilityName") === 46
    ) {
      setValue("bookingType", "Group");
      clearErrors("bookingType");
      setKayAheNaav("Group");
      setEditable(true);
    } else {
      setValue("bookingType", null);
      setKayAheNaav("Individual");
      setEditable(false);
    }
  }, [watch("facilityName"), facilityNames]);

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
    }
  }, [watch("venue")]);

  useEffect(() => {
    if (
      watch("toDate") != null &&
      watch("toDate") != undefined &&
      watch("toDate") != "" &&
      watch("fromDate") != null &&
      watch("fromDate") != undefined &&
      watch("fromDate") != "" &&
      watch("venue") != null &&
      watch("venue") != undefined &&
      watch("venue") != "" &&
      watch("facilityName") != null &&
      watch("facilityName") != undefined &&
      watch("facilityName") != ""
    ) {
      getSlots();
    }
  }, [
    watch("fromDate"),
    watch("facilityName"),
    watch("venue"),
    watch("toDate"),
  ]);

  useEffect(() => {
    if (router.query.pageMode === "Add") {
      durationTypess.map((data) => {
        if (watch("durationType") == data?.id) {
          setValue("newData", data?.durationNo);
        }
      });

      console.log("kflkdjfsd", watch("fromDate"));
      if (
        watch("fromDate") != "Invalid date" &&
        watch("fromDate") != null &&
        watch("fromDate") != undefined
      ) {
        const endDate = moment(watch("fromDate"))
          .add(watch("newData"), "M")
          .format("YYYY-MM-DD");

        const finEndDate = moment(endDate)
          .subtract(1, "days")
          .format("YYYY-MM-DD");
        console.log("finalDate", finEndDate);
        setValue("toDate", finEndDate);
        // getSlots();
      }

      console.log("durationTypess<", durationTypess, watch("durationType"));
    }
  }, [watch("durationType"), watch("fromDate")]);

  useEffect(() => {}, [slots]);

  // view
  return (
    <>
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
          <FormattedLabel id="bookingDetails" />
        </strong>
      </div>
      <Grid
        container
        sx={{ marginLeft: 5, marginTop: 1, marginBottom: 5, align: "center" }}
      >
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            error={!!errors.applicationDate}
            sx={{ marginTop: 0 }}
            // sx={{ border: "solid 1px yellow" }}
          >
            <Controller
              control={control}
              name="applicationDate"
              defaultValue={Date.now()}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    disabled
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 16 }}>
                        {<FormattedLabel id="applicationDate" />}
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
              {errors?.applicationDate ? errors.applicationDate.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            variant="standard"
            disabled
            // sx={{ m: 1, minWidth: 120 }}
            error={!!errors.facilityType}
          >
            <InputLabel shrink={true} id="demo-simple-select-standard-label">
              {<FormattedLabel id="facilityType" />}
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

        {/* facilityName */}

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            variant="standard"
            // sx={{ m: 1, minWidth: 120 }}
            error={!!errors.facilityName}
          >
            <InputLabel shrink={watch("facilityName")?true:false} id="demo-simple-select-standard-label">
              {<FormattedLabel id="facilityName" required />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={
                    readOnly || router.query.pageMode === "MyApplication"
                  }
                  sx={{ minWidth: 220 }}
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  label="facilityName"
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
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.facilityName ? errors.facilityName.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            // disabled={readOnly}
            variant="standard"
            error={!!errors.venue}
          >
            <InputLabel shrink={watch("venue")?true:false} id="demo-simple-select-standard-label">
              {<FormattedLabel id="venue" required />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={
                    watch("facilityName") != null &&
                    watch("facilityName") != undefined &&
                    watch("facilityName") != ""
                      ? readOnly
                      : true
                  }
                  sx={{ minWidth: 195 }}
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
                    venues.map((venue, index) => (
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
            disabled={readOnly}
            variant="standard"
            // sx={{ m: 1, minWidth: 120 }}
            error={!!errors.zone}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="zone" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled
                  sx={{ minWidth: 220 }}
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
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
              defaultValue=""
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
            <InputLabel id="demo-simple-select-standard-label">
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
              defaultValue=""
            />
            <FormHelperText>
              {errors?.wardName ? errors.wardName.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            disabled={editable}
            error={!!errors.bookingType}
            sx={{ marginTop: 2 }}
          >
            <InputLabel shrink={watch("bookingType")?true:false} id="demo-simple-select-standard-label">
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
                  label="bookingType"
                >
                  {/* <MenuItem
                    value={language == "en" ? "Individual" : "वैयक्तिक"}
                  >
                    {language == "en" ? "Individual" : "वैयक्तिक"}
                  </MenuItem>
                  <MenuItem value={language == "en" ? "Group" : "गट"}>
                    {language == "en" ? "Group" : "गट"}
                  </MenuItem> */}

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
              name="bookingType"
              control={control}
              defaultValue=""
            />

            <FormHelperText>
              {errors?.bookingType ? errors.bookingType.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            // disabled={editable}
            error={!!errors.type}
            sx={{ marginTop: 2 }}
          >
            <InputLabel shrink={watch("type")?true:false} id="demo-simple-select-standard-label">
              {<FormattedLabel id="typee" required />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ minWidth: 195 }}
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value), setKayNaav(value.target.value);
                  }}
                  label="type"
                >
                  {type.map((menu, index) => {
                    return (
                      <MenuItem key={index} value={menu.typeEn}>
                        {language == "en" ? menu.typeEn : menu.typeMr}
                      </MenuItem>
                    );
                  })}
                </Select>
              )}
              name="type"
              control={control}
              defaultValue=""
            />

            <FormHelperText>
              {errors?.type ? errors.type.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        {kayNaav === "Concession" && (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl
              // disabled={readOnly}
              disabled={readOnly || router.query.pageMode === "MyApplication"}
              variant="standard"
              error={!!errors.applicantType}
            >
              <InputLabel id="demo-simple-select-standard-label">
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
                defaultValue=""
              />
              <FormHelperText>
                {errors?.applicantType ? errors.applicantType.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
        )}
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            sx={{ marginTop: 3.5 }}
            disabled
            variant="standard"
            error={!!errors.facilityType}
          >
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="durationType" />
              {/* Duration Type */}
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
              defaultValue=""
            />
            <FormHelperText>
              {errors?.durationType ? errors.durationType.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl style={{ marginTop: 10 }} error={!!errors.fromDate}>
            <Controller
              control={control}
              name="fromDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    disabled={
                      readOnly || router.query.pageMode === "MyApplication"
                    }
                    shouldDisableDate={isDisabledDate}
                    minDate={moment().startOf("month").toDate()}
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id="fromDate" required />
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
              {errors?.fromDate ? errors.fromDate.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            // disabled={readOnly}
            style={{ marginTop: 10 }}
            error={!!errors.toDate}
          >
            <Controller
              control={control}
              name="toDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    disabled
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id="toDate" />
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
              {errors?.toDate ? errors.toDate.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            disabled={readOnly || router.query.pageMode === "MyApplication"}
            variant="standard"
            sx={{ marginTop: 3.5 }}
            error={!!errors.bookingTimeId}
          >
            <InputLabel shrink={watch("bookingTimeId")?true:false} id="demo-simple-select-standard-label">
              <FormattedLabel id="selectSlot" required />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ minWidth: 220 }}
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="selectSlot"
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

        {kayAheNaav === "Group" && (
          <>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <FormControl
                disabled={readOnly || router.query.pageMode === "MyApplication"}
                error={!!errors.totalGroupMember}
                sx={{ marginTop: 2 }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="additionalGroupMember" required />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ minWidth: 195 }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      label="totalGroupMember"
                    >
                      <MenuItem value={language == "en" ? "1" : "1"}>
                        {language == "en" ? "1" : "1"}
                      </MenuItem>
                      <MenuItem value={language == "en" ? "3" : "3"}>
                        {language == "en" ? "3" : "3"}
                      </MenuItem>
                    </Select>
                  )}
                  name="totalGroupMember"
                  control={control}
                  defaultValue={null}
                />

                <FormHelperText>
                  {errors?.totalGroupMember
                    ? errors.totalGroupMember.message
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                disabled={readOnly || router.query.pageMode === "MyApplication"}
                id="standard-basic"
                label={<FormattedLabel id="groupName" />}
                variant="standard"
                {...register("groupName")}
                error={!!errors.groupDetails}
                helperText={
                  errors?.groupDetails ? errors.groupDetails.message : null
                }
              />
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

export default Index;
