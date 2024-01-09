import {
  Checkbox,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField
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
import { sortByAsc } from "../../../../containers/reuseableComponents/Sorter";
import { useRouter } from "next/router";
import URLS from "../../../../URLS/urls";
import Loader from "../../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../../util/util"

const BasicApplicationDetails = ({ readOnly = false }, { read = true }) => {
  const {
    control,
    register,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const router = useRouter();
  const token = useSelector((state) => state.user.user.token);
  const language = useSelector((state) => state?.labels.language);
  const [sectionId, setSectionId] = useState([]);
  const [facilityTypess, setFacilityTypess] = useState([]);
  const [facilityNames, setFacilityNames] = useState([]);
  const [venues, setVenues] = useState([]);
  const [slots, setSlots] = useState([]);
  const [checkVenue, setCheckVenue] = useState(true);
  const [getward, setWard] = useState([]);
  const [durationTypess, setDurationTypess] = useState([]);
  const [applicantTypess, setApplicantTypess] = useState([]);
  const [loadderState, setLoadderState] = useState(false)
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

  // getAllTypes
  const getAllTypes = () => {
    axios.get(`${URLS.CFCURL}/master/zone/getAll`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).then((r) => {
      setSectionId(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneName: row.zoneName,
          zoneNameMr: row.zoneNameMr,
        }))
      );
    }).catch((error) => {
      callCatchMethod(error, language);
    });
  };

  // getWard
  const getWardNames = () => {
    axios.get(`${URLS.CFCURL}/master/ward/getAll`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).then((r) => {
      setWard(
        r.data.ward.map((row) => ({
          id: row.id,
          wardName: row.wardName,
          wardNameMr: row.wardNameMr,
        }))
      );
    }).catch((error) => {
      callCatchMethod(error, language);
    });
  };

  // getVenueList
  const getVenueList = (value) => {
    const id = watch("facilityName");
    axios
      .get(
        `${URLS.SPURL}/venueMasterSection/getVenueByFacilityName?facilityName=${watch("facilityName")}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
      )
      .then((res) => {
        let temp = res.data.venueSection.map((row) => ({
          id: row.id,
          venue: row.venue,
          venueMr: row.venueMr,
        }));
        setVenues(temp);
      }).catch((error) => {
        callCatchMethod(error, language);
      });

  };

  // getZoneWardID
  const getZoneWardID = (value) => {
    let venue = watch("venue");
    if (venue != null && venue != undefined && venue != "") {
      axios
        .get(`${URLS.SPURL}/venueMasterSection/getZoneAndWardById?id=${venue}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        .then((res) => {
          let tempp = res.data.venueSection.map((row) => ({
            id: row.id,
            zoneName: sectionId?.find((obj) => obj?.id === row.zoneName)?.id,
            wardName: getward?.find((obj) => obj?.id === row.wardName)?.id,
          }));
          setValue("zoneName", tempp[0].zoneName);
          setValue("wardName", tempp[0].wardName);
        }).catch((error) => {
          callCatchMethod(error, language);
        });
    }

  };

  // getDurationTypes
  const getDurationTypes = () => {
    axios.get(`${URLS.SPURL}/master/durationType/getAll`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).then((r) => {
      setDurationTypess(
        r.data.durationType.map((row) => ({
          id: row.id,
          typeName: row.typeName,
          durationNo: row.durationNo,
          typeNameMr: row.typeNameMr,
        }))
      );
    }).catch((error) => {
      callCatchMethod(error, language);
    });
  };

  // getApplicantTypes
  const getApplicantTypes = () => {
    axios.get(`${URLS.SPURL}/applicantType/getAll`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).then((r) => {
      sortByAsc(r.data.applicantType, "typeName");
      setApplicantTypess(
        r.data.applicantType.map((row) => ({
          id: row.id,
          typeName: row.typeName,
          typeNameMr: row.typeNameMr,
        }))
      );
    }).catch((error) => {
      callCatchMethod(error, language);
    });
  };

  // getVenue
  const getVenue = () => {
    axios.get(`${URLS.SPURL}/venueMasterSection/getAll`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).then((r) => {
      sortByAsc(r.data.venueSection, "venue");
      setVenues(
        r.data.venueSection.map((row) => ({
          id: row.id,
          venue: row.venue,
          venueMr: row.venueMr,
        }))
      );
    }).catch((error) => {
      callCatchMethod(error, language);
    });
  };

  // getFacilityName
  const getFacilityName = () => {
    axios.get(`${URLS.SPURL}/facilityName/getAll`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).then((r) => {

      setFacilityNames(
        r.data.facilityName.map((row) => ({
          id: row.id,
          facilityName: row.facilityName,
          facilityNameMr: row.facilityNameMr,
          facilityType: row.facilityType,
          facilityTypeMr: row.facilityTypeMr,
        }))
      );
    }).catch((error) => {
      callCatchMethod(error, language);
    });
  };

  // getFacilityTypes
  const getFacilityTypes = () => {
    axios.get(`${URLS.SPURL}/facilityType/getAll`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).then((r) => {
      setValue(
        "facilityType",
        r.data.facilityType?.find((ff) => ff.id === 2).id
      );
      setFacilityTypess(
        r.data.facilityType.map((row) => ({
          id: row.id,
          facilityType: row.facilityType,
          facilityTypeMr: row.facilityTypeMr,
        }))
      );
    }).catch((error) => {
      callCatchMethod(error, language);
    });
  };

  const getSlots = (value) => {
    const facilityName = watch("facilityName");
    const facilityType = watch("facilityType");
    const venue = watch("venue");
    const fromDate = watch("fromDate");
    const toDate = watch("toDate");

    if (toDate != null && toDate != undefined && toDate != "" &&
      venue != null && venue != undefined && venue != "" &&
      fromDate != null && fromDate != undefined && fromDate != ""
      &&
      facilityName != null && facilityName != undefined && facilityName != "" &&
      facilityType != null && facilityType != undefined && facilityType != ""
    ) {


      axios

        .get(
          `${URLS.SPURL}/master/venueDetails/getTimesByParameters?fromDate=${fromDate}&toDate=${toDate}&venue=${venue}&facilityName=${facilityName}&facilityType=${facilityType}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        )

        .then((res) => {
          let temp = res?.data[0]?.slotDetailsDao?.map((row) => ({
            id: row?.id,
            fromTime: row?.fromTime,
            toTime: row?.toTime,
            slot: row?.fromTime + "-" + row?.toTime,
            commaSeparatedIds: row?.commaSeparatedIds,
          }));
          setSlots(temp);
          setValue("allSlots", res?.data);
          setValue("slots", temp);
        }).catch((error) => {
          callCatchMethod(error, language);
        });;

    }

  };



  ///!===========================useEffects<============




  useEffect(() => {
    if (watch("durationType") == 13 || watch("durationType") == 8) {
      setValue("toDate", watch("fromDate"));
    } else {
      durationTypess?.map((data) => {
        if (watch("durationType") == data?.id) {
          setValue("newData", data?.durationNo);
        }
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
          console.log("finalDate", finEndDate);
          setValue("toDate", finEndDate);
        }

      });






    }
  }, [watch("durationType"), watch("fromDate")]);


  // getSlot
  useEffect(() => {
    getSlots();
  }, [watch("facilityName"),
  watch("facilityType"),
  watch("venue"),
  watch("fromDate"), watch("toDate")]);



  // useEffect
  useEffect(() => {
    getFacilityTypes();
    getFacilityName();
    getVenue();
    getAllTypes();
    getWardNames();
    getDurationTypes();
    getApplicantTypes();
  }, []);


  useEffect(() => {
    if (watch("facilityName")) {

      getVenueList();
    }
  }, [watch("facilityName")]);




  return (
    <>

      {loadderState ? (
        <Loader />
      ) : (
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
                disabled={readOnly}
                error={!!errors.applicationDate}
                sx={{ marginTop: 0 }}
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
                error={!!errors.facilityType}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="facilityType" />}
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
                variant="standard"
                error={!!errors.facilityName}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="facilityName" required />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={readOnly}
                      sx={{ minWidth: 220 }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        getVenueList();
                        setCheckVenue(false);

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
                disabled={(readOnly, checkVenue)}
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
                        getZoneWardID();
                      }}
                      label="venue"
                    >
                      {venues &&
                        venues

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
                disabled={readOnly}
                variant="standard"
                error={!!errors.zone}
              >
                <InputLabel
                  shrink={watch("zoneName") == null ? false : true}

                  id="demo-simple-select-standard-label">
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
                error={!!errors.wardName}
              >
                <InputLabel
                  shrink={watch("wardName") == null ? false : true}
                  id="demo-simple-select-standard-label">
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
                disabled={readOnly}
                variant="standard"
                error={!!errors.applicantType}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="applicantType" required />}
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
                  defaultValue={null}
                />
                <FormHelperText>
                  {errors?.applicantType ? errors.applicantType.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
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
                  defaultValue={null}
                />
                <FormHelperText>
                  {errors?.durationType ? errors.durationType.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <FormControl style={{ marginTop: 9 }} error={!!errors.fromDate}>
                <Controller
                  control={control}
                  name="fromDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        disabled={readOnly}
                        inputFormat="DD/MM/YYYY"
                        label={
                          <span style={{ fontSize: 16 }}>
                            <FormattedLabel id="fromDate" required />
                          </span>
                        }
                        value={field.value}
                        onChange={(date) =>
                          field.onChange(
                            moment(date).format("YYYY-MM-DD")
                          )
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
              <FormControl style={{ marginTop: 10 }} error={!!errors.toDate}>
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
                            <FormattedLabel id="toDate" required />
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

            {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            disabled={readOnly}
            style={{ marginTop: 2 }}
            error={!!errors.fromBookingTime}
          >
            <Controller
              control={control}
              name="fromBookingTime"
              disabled={readOnly}
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePicker
                    minTime={new Date(0, 0, 0, 10)}
                    maxTime={new Date(0, 0, 0, 17, 45)}
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id="fromBookingTime" required />
                      </span>
                    }
                    value={field.value}
                    onChange={(date) => {
                      setValue(
                        "fromBookingTime",
                        date
                      );
                      return field.onChange(
                        moment(date).format("YYYY-MM-DDTHH:mm")
                      );
                    }}
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
              {errors?.fromBookingTime ? errors.fromBookingTime.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            disabled={readOnly}
            style={{ marginTop: 5 }}
            error={!!errors.toBookingTime}
          >
            <Controller
              control={control}
              name="toBookingTime"
              disabled={readOnly}
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePicker
                    minTime={new Date(0, 0, 0, 10)}
                    maxTime={new Date(0, 0, 0, 17, 45)}
                    label={
                      <span style={{ fontSize: 16 }}>
                        {<FormattedLabel id="toBookingTime" required />}
                      </span>
                    }
                   
                    onChange={(date) => {
                      setValue(
                        "toBookingTime",
                        date
                      );
                      return field.onChange(
                        moment(date).format("YYYY-MM-DDTHH:mm"),
                      );
                      
                    }}
                  
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
              {errors?.toBookingTime ? errors.toBookingTime.message : null}
            </FormHelperText>
          </FormControl>
        </Grid> */}

            {/* Select Multiple Slots */}
            {/** BookingTimes */}
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>


              {/** New */}
              <FormControl
                variant="standard"
                error={!!errors.bookingIds1}
                sx={{ width: "90%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="selectSlots" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select

                      label={<FormattedLabel id="selectSlots" />}
                      multiple
                      disabled={readOnly}
                      value={field?.value}
                      onChange={(value) => field?.onChange(value)}
                      renderValue={(val) =>
                        watch("bookingIds1")
                          .map((j) => {
                            if (language == "en") {
                              return slots?.find(
                                (obj) => obj?.id == j
                              )?.slot;
                            } else {
                              return slots?.find(
                                (obj) => obj?.id == j
                              )?.slot;
                            }
                          })
                          .join(",")
                      }
                    >
                      {slots?.map((obj) => (
                        <MenuItem key={obj?.id} value={obj?.id}>
                          <Checkbox
                            checked={watch("bookingIds1")?.includes(
                              obj?.id
                            )}
                          />
                          <ListItemText
                            primary={
                              language == "en"
                                ? obj?.slot
                                : obj?.slot
                            }
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                  name="bookingIds1"
                  control={control}
                  defaultValue={[]}
                />
                <FormHelperText>
                  {errors?.bookingIds1 ? errors?.bookingIds1?.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>

          </Grid>
        </>
      )}
    </>
  );
};

export default BasicApplicationDetails;
