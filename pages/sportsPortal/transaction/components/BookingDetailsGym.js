import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Drawer,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/sportsPortalSchema/bookingTimeSchema";
import { sortByAsc } from "../../../../containers/reuseableComponents/Sorter";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import styles from "../../../../styles/sportsPortalStyles/view.module.css";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const BookingDetailsGym = ({ readOnly = false }) => {
  const {
    control,
    register,
    reset,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useFormContext({ resolver: yupResolver(schema) });
  // useFormContext();
  // const [bookingType, setBookingType] = useState();
  const today = moment();
  const firstDayOfMonth = today.startOf("month");
  const isDisabledDate = (date) => !date.isSame(firstDayOfMonth, "day");
  const [group, setGroup] = useState("Group");
  const router = useRouter();
  const [temp1, setTemp1] = useState();
  const [mapDrawerOpen, setMapDrawerOpen] = useState(false);
  const [zoneNames, setZoneNames] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [facilityTypess, setFacilityTypess] = useState([]);
  const [facilityNames, setFacilityNames] = useState([]);
  const [venues, setVenues] = useState([]);
  const [selectedFacilityType, setSelectedFacilityType] = useState();
  const [selectedFacilityName, setSelectedFacilityName] = useState();
  const [facilityNameField, setFacilityNameField] = useState(true);
  const [kayAheNaav, setKayAheNaav] = useState("");
  const language = useSelector((state) => state?.labels.language);
  const [slots, setSlots] = useState([]);
  const [sectionId, setSectionId] = useState([]);
  const [venueField, setVenueField] = useState(true);
  // const [checkVenue, setCheckVenue] = useState(true);
  const token = useSelector((state) => state.user.user.token);
  const [durationTypess, setDurationTypess] = useState([]);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  const [bookingType, setBookingType] = useState([
    { id: 1, bookingTypeEn: "Concession", bookingTypeMr: "सवलत" },
    { id: 2, bookingTypeEn: "No Concession", bookingTypeMr: "सवलत नाही" },
  ]);
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
  const getDurationTypes = () => {
    axios
      .get(`${urls.SPURL}/master/durationType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("ssssssssss", r);
        setValue(
          "durationType",
          r.data.durationType?.find((gg) => gg.id === 9).id
        );
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

  const getAllTypes = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
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

  // getWard
  const [getward, setWard] = useState([]);

  const getWardNames = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
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

  const getZoneWardID = () => {
    let venue = watch("venue");

    if (venue != null && venue != undefined && venue != "") {
      axios
        .get(
          `${urls.SPURL}/venueMasterSection/getZoneAndWardById?id=${venue}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          let tempp = res.data.venueSection.map((row) => ({
            id: row.id,
            // zoneName : row.zoneName,
            zoneName: sectionId?.find((obj) => obj?.id === row.zoneName)?.id,
            wardName: getward?.find((obj) => obj?.id === row.wardName)?.id,
          }));

          if (router.query.pageMode != "View") {
            setValue("wardName", tempp[0].wardName);
            setValue("zoneName", tempp[0].zoneName);
          }
          console.log("2222", tempp, tempp[0].zoneName);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };
  useEffect(() => {
    console.log("hjjh21", watch("type"));
  }, []);

  useEffect(() => {
    // if (
    //   (!watch("verification") &&
    //     !watch(router.query.pageMode === "MyApplication")) ||
    //   watch(router.query.pageMode === "Add")
    // )
    if (router.query.pageMode === "Add") {
      // if (!watch("verification")) {
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
        let endDate = moment(watch("fromDate"))
          .add(watch("newData"), "M")
          .format("YYYY-MM-DD");

        let finEndDate = moment(endDate)
          .subtract(1, "days")
          .format("YYYY-MM-DD");
        console.log("finEndDate", finEndDate);
        setValue("toDate", finEndDate);
        getSlots();
      }
    }
  }, [watch("durationType"), watch("fromDate"), router.query.pageMode]);

  const getAllGymData = () => {
    axios
      .get(`${urls.SPURL}/gymBooking/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("all gym data:" + res.data);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  const handleOnChange = (value) => {
    // setBookingType(value);
    console.log("props.bookingType", value);
    // props.bookingType(value);
  };

  const getSubDepartments = () => {
    axios
      .get(`${urls.CFCURL}/master/subDepartment/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("SD: ", r.data);
        setSubDepartments(
          r.data.subDepartment.map((row) => ({
            id: row.id,
            subDepartmentName: row.subDepartment,
            subDepartmentNameMr: row.subDepartmentMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  const getDepartments = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setDepartments(
          r.data.department.map((row) => ({
            id: row.id,
            department: row.department,
            departmentMr: row.departmentMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const [datetime, setDatetime] = useState([]);

  const getDateTime = () => {
    axios
      .get(`${urls.SPURL}/bookingTime/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setDatetime(
          r.data.bookingTime.map((row) => ({
            id: row.id,
            fromBookingTime: row.fromBookingTime,
            toBookingTime: row.toBookingTime,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getVenue = () => {
    axios
      .get(`${urls.SPURL}/venueMasterSection/getAll`, {
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
            // facilityName: row.facilityName,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getFacilityName = () => {
    axios
      .get(`${urls.SPURL}/facilityName/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {

        console.log('kayAhe1: ', r.data.facilityName)
        setFacilityNames(
          r.data?.facilityName?.map((row) => ({
            id: row?.id,
            facilityName: row?.facilityName,
            facilityNameMr: row?.facilityNameMr,
            facilityType: row?.facilityType,
          }))
        );
        setValue(
          "facilityName",
          // r.data.facilityName?.find((ff) => ff.id === 1).id    bhagyashree chi maati
          r.data.facilityName?.find((ff) => ff?.facilityType == 4)?.id
        );

      })
      .catch((error) => {

        callCatchMethod(error, language);
      });
  };


  // Get Venue List
  const getVenueList = (value) => {
    console.log("Venue List", value);
    // let venueId = getValues("venue");
    let id = watch("facilityName");

    if (id != null && id != undefined && id != "") {
      axios
        .get(
          `${urls.SPURL}/venueMasterSection/getVenueByFacilityName?facilityName=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          // let venueSectionID = setValue(res.data.id);
          // console.log("66", res.data);
          console.log("66", res.data.venueSection);
          let temp = res.data.venueSection.map((row) => ({
            id: row.id,
            venue: row.venue,
            venueMr: row.venueMr,
            // venueID: row.id,
            // venue: row.venue,
            // venue: venues?.find((obj) => obj?.id === row.venue)?.venue,
            // sectionId: row.sectionId,
          }));
          // setVenueList(temp);
          setVenues(temp);
          // setSectionId(temp.sectionId);
          // console.log("111111111111", sectionId);

          console.log("90", venues);
          console.log("900", temp);
          // console.log("901", row.venueID);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
    // setBookingType(value);
    // console.log("props.bookingType", value);
    // props.bookingType(value);
  };
  // const getVenueList = (value) => {
  //   // let venueId = getValues("venue");
  //   let id = getValues("facilityName");

  //   // console.log("DATA77", body);
  //   if(id !=null && id != undefined && id != ""){

  //   axios
  //     .get(
  //       `${urls.SPURL}/venueMasterSection/getVenueByFacilityName?facilityName=${id}`
  //     )
  //     .then((res) => {
  //       // let venueSectionID = setValue(res.data.id);
  //       // console.log("66", res.data);
  //       console.log("66", res.data.venueSection);

  //       let temp = res.data.venueSection.map((row) => ({
  //         id: row.id,
  //         venue: row.venue,
  //         venueMr: row.venueMr,
  //         // venueID: row.id,
  //         // venue: row.venue,
  //         // venue: venues?.find((obj) => obj?.id === row.venue)?.venue,
  //         // sectionId: row.sectionId,
  //       }));
  //       // setVenueList(temp);
  //       setVenues(temp);
  //       // setSectionId(temp.sectionId);
  //       // console.log("111111111111", sectionId);

  //       console.log("90", venues);
  //       console.log("900", temp);
  //       // console.log("901", row.venueID);
  //     });
  //   }

  //   // setBookingType(value);
  //   // console.log("props.bookingType", value);
  //   // props.bookingType(value);
  // };

  const getSlots = (value) => {
    let facilityName = getValues("facilityName");
    let facilityType = getValues("facilityType");
    let venue = getValues("venue");
    let fromDate = getValues("fromDate");
    let toDate = getValues("toDate");
    if (toDate && fromDate && venue && facilityType && facilityName) {
      axios
        .get(
          `${urls.SPURL}/master/venueDetails/getTimesByParameters?fromDate=${fromDate}&toDate=${toDate}&venue=${venue}&facilityName=${facilityName}&facilityType=${facilityType}`,
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
    }
  };

  // const getSlots = (value) => {
  //   let body = {
  //     facilityType: getValues("facilityType"),
  //     facilityName: getValues("facilityName"),
  //     venue: getValues("venue"),
  //     toDate: getValues("toDate"),
  //     fromDate: getValues("fromDate"),
  //     // zone: getValues("zone"),
  //     // month: getValues("month"),
  //   };
  //   console.log("DATA77", body);

  //   axios
  //     .post(`${urls.SPURL}/gymBooking/getSlotsByMonth`, body, {})
  //     .then((res) => {
  //       let temp = res.data.map((row) => ({
  //         id: row.id,
  //         slot: row.fromBookingTime + "-" + row.toBookingTime,
  //       }));
  //       setSlots(temp);
  //       console.log("res.message", temp);
  //     });

  //   // setBookingType(value);
  //   // console.log("props.bookingType", value);
  //   // props.bookingType(value);
  // };

  const getFacilityTypes = () => {
    axios
      .get(`${urls.SPURL}/facilityType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setValue(
          "facilityType",
          r.data.facilityType?.find((ff) => ff.id === 4).id
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

  const [applicantTypess, setApplicantTypess] = useState([]);

  // getApplicant Type
  const getApplicantTypes = () => {
    axios
      .get(`${urls.SPURL}/applicantType/getAll`, {
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

  // useEffect
  useEffect(() => {
    getWardNames();
    getFacilityTypes();
    getFacilityName();
    getVenue();
    getDateTime();
    getSubDepartments();
    getAllTypes();
    getAllGymData();
    getApplicantTypes();
    getDurationTypes();
  }, []);

  useEffect(() => {
    getSlots();
  }, [
    watch("toDate"),
    watch("fromDate"),
    watch("venue"),
    watch("facilityName"),
  ]);

  useEffect(() => {
    getVenueList();
    // console.log("facility Name", watch("facilityName"));
  }, [watch("facilityName")]);
  useEffect(() => {
    // getVenueList();
    console.log("facility Name", watch("facilityName"), watch("facilityType"));
    console.log("facility Type", watch("facilityType"));
  }, [watch("facilityName"), watch("facilityType")]);

  return (
    <>
      {/* <div className={styles.row}>
          <Typography variant="h6" sx={{ marginTop: 4 }}>
            Booking Details
          </Typography>
        </div> */}

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
        {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="bookingRegistrationId" />}
            disabled
          
            {...register("bookingRegistrationId")}
            error={!!errors.bookingRegistrationId}
            helperText={errors?.bookingRegistrationId ? errors.bookingRegistrationId.message : null}
          />
        </Grid> */}
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
            // disabled={readOnly}
            variant="standard"
            // sx={{ m: 1, minWidth: 120 }}
            error={!!errors.facilityType}
          >
            <InputLabel id="demo-simple-select-standard-label">
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
                    // setFacilityNameField(false);
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
              defaultValue=""
            />
            <FormHelperText>
              {errors?.facilityType ? errors.facilityType.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            disabled
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
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={field.value}
                  // onChange={(value) => field.onChange(value)}
                  // onChange={(value) => {
                  //   field.onChange(value);
                  //   console.log("facilityName: ", value.target.value);
                  //   setSelectedFacilityName(value.target.value);
                  //   setVenueField(false);
                  // }}
                  onChange={(value) => {
                    field.onChange(value);
                    getVenueList();
                    // setCheckVenue(false);
                    // getVenueList();
                    // console.log("facilityName: ", value.target.value);
                    // setSelectedFacilityName(value.target.value);
                    // setVenueField(false);
                  }}
                  label="facilityName"
                // disabled={facilityNameField}
                >
                  {facilityNames &&
                    facilityNames
                      .filter((facility) => {
                        // return facility.facilityType === selectedFacilityType;
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
            disabled={readOnly}
            variant="standard"
            error={!!errors.venue}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="venue" required />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ minWidth: 195 }}
                  labelId="demo-simple-select-standard-label"
                  Fdate
                  id="demo-simple-select-standard"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    console.log("897898", value);
                    getZoneWardID();
                  }}
                  label="venue"
                >
                  {venues &&
                    venues
                      // .filter((facility) => {
                      //   // return facility.facilityName === selectedFacilityName;
                      //   return facility.facilityName === watch("facilityName");
                      // })
                      .map((venue, index) => (
                        <MenuItem key={index} value={venue.id}>
                          {language == "en" ? venue?.venue : venue?.venueMr}
                        </MenuItem>
                      ))}
                </Select>
              )}
              name="venue"
              control={control}
              defaultValue=""
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
                  // onChange={(value) => field.onChange(value)}
                  onChange={(value) => {
                    field.onChange(value);
                    console.log("Zone Key: ", value.target.value);
                    setTemp1(value.target.value);
                  }}
                  label="zone"
                >
                  {sectionId &&
                    sectionId.map((zoneName, index) => {
                      return (
                        <MenuItem key={index} value={zoneName.id}>
                          {language == "en"
                            ? zoneName?.zoneName
                            : zoneName?.zoneNameMr}
                        </MenuItem>
                      );
                    })}
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

        {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            disabled={readOnly}
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
                    console.log("value: ", value.target.value);
                    setSelectedFacilityType(value.target.value);
                  }}
                  label="type"
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
              name="type"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.applicantType ? errors.applicantType.message : null}
            </FormHelperText>
          </FormControl>
        </Grid> */}

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            // disabled={editable}
            error={!!errors.type}
            sx={{ marginTop: 2 }}
          >
            <InputLabel id="demo-simple-select-standard-label">
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
              defaultValue=""
            />

            <FormHelperText>
              {errors?.type ? errors.type.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl error={!!errors.applicationDate} sx={{ marginTop: 2 }}>
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="bookingType" />}
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
                  SPURL
                  label="bookingType"
                >
                  <MenuItem value="Government_School">Government School</MenuItem>
                  <MenuItem value="Private_School">Private School</MenuItem>
                  <MenuItem value="High_School">High School</MenuItem>
                  <MenuItem value="Sports_Club">Sports Club</MenuItem>
                </Select>
              )}
              name="bookingType"
              control={control}
              defaultValue=""
            />
          </FormControl>
        </Grid> */}

        {/* {watch("type" == 1) && ( */}
        {kayAheNaav === "Concession" && (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl
              disabled={readOnly}
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
                      console.log("value: ", value.target.value);
                      setSelectedFacilityType(value.target.value);
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
            disabled={readOnly}
            variant="standard"
            error={!!errors.durationType}
          >
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="durationType" required />
              {/* Duration Type */}
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
              defaultValue=""
            />
            <FormHelperText>
              {errors?.durationType ? errors.durationType.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            variant="standard"
            // sx={{ m: 1, minWidth: 120 }}
            error={!!errors.department}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="department" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ minWidth: 220 }}
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="department"
                >
                  {departments &&
                    departments.map((department, index) => (
                      <MenuItem key={index} value={department.id}>
                        {department.department}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="department"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.department ? errors.department.message : null}
            </FormHelperText>
          </FormControl>
        </Grid> */}

        {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            label="Facility Type"
            value="Ground Booking"
            {...register("groundBooking")}
          />
        </Grid> */}
        {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl
              variant="standard"
              // sx={{ m: 1, minWidth: 120 }}
              error={!!errors.subDepartment}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="subDepartment" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ minWidth: 220 }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="subDepartment"
                  >
                    {subDepartments &&
                      subDepartments.map((subDepartmentName, index) => (
                        <MenuItem key={index} value={subDepartmentName.id}>
                          {subDepartmentName.subDepartmentName}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="subDepartment"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.subDepartment ? errors.subDepartment.message : null}
              </FormHelperText>
            </FormControl>
          </Grid> */}

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl disabled={readOnly} error={!!errors.fromDate}>
            <Controller
              control={control}
              name="fromDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    disabled={readOnly}
                    shouldDisableDate={isDisabledDate}
                    minDate={moment().startOf("month").toDate()}
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id="fromDate" required />
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
              {errors?.fromDate ? errors.fromDate.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl disabled={readOnly} error={!!errors.toDate}>
            <Controller
              control={control}
              name="toDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    disabled
                    minDate={new Date()}
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id="toDate" />
                      </span>
                    }
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(moment(date).format("YYYY-MM-DD"));
                      // getSlots();
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
            disabled={readOnly}
            variant="standard"
            sx={{ marginTop: 4 }}
            error={!!errors.bookingTimeId}
          >
            <InputLabel id="demo-simple-select-standard-label">
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
              defaultValue=""
            />
            <FormHelperText>
              {errors?.bookingTimeId ? errors.bookingTimeId.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2} sx={{ marginTop: 2 }}>
          <Button
            variant="contained"
            onClick={() => {
              setMapDrawerOpen(true);
            }}
          >
            View Image
          </Button>
          <Drawer
            anchor={"right"}
            open={mapDrawerOpen}
            onClose={() => setMapDrawerOpen(false)}
            // onClose={setMapDrawerOpen(false)}
            onOpen={() => setMapDrawerOpen(true)}
          >
            <Paper>
              <img
                src="/images.png"
                //hegiht='300px'
                paddingTop="5vh"
                width="500px"
                alt="Image Not Found"
              />
            </Paper>
          </Drawer>
        </Grid> */}
      </Grid>
    </>
  );
};

export default BookingDetailsGym;
