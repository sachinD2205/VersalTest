import { yupResolver } from "@hookform/resolvers/yup";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  // Table,
  TextField,
} from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Col, Row, Table } from "antd";
import axios from "axios";
import moment from "moment";
import router from "next/router";
import SaveIcon from "@mui/icons-material/Save";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/sportsPortalSchema/facilityCheckSchema";
import styles from "../../../../styles/sportsPortalStyles/facilityCheck.module.css";
import URLS from "../../../../URLS/urls";
import ClearIcon from "@mui/icons-material/Clear";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Loader from "../../../../containers/Layout/components/Loader";
// import { sortByAsc } from "../../../../containers/reuseableComponents/Sorter";
import { useSelector } from "react-redux";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    watch,
    getValues,
    reset,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const today = moment();
  const firstDayOfMonth = today.startOf("month");
  const [tableData, setTableData] = useState([]);
  const [fromAndToTime, setFromAndToTime] = useState([]);
  const isDisabledDate = (date) => !date.isSame(firstDayOfMonth, "day");
  const [zoneNames, setZoneNames] = useState([]);
  const [facilityTypess, setFacilityTypess] = useState([]);
  const [facilityNames, setFacilityNames] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [sectionId, setSectionId] = useState([]);
  const [disabeldDuration, setDisabeldDuration] = useState(false);
  const [tempVal, setTempVal] = useState(0);
  const [slots, setSlots] = useState([]);
  const [temp1, setTemp1] = useState();
  const language = useSelector((state) => state?.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const [selectedFacilityType, setSelectedFacilityType] = useState();
  const [facilityNameField, setFacilityNameField] = useState(true);
  const [availableSlot, setAvailableSlot] = useState(false);
  const [fNDisabeld, setFNDisabeld] = useState(true);
  const [vDisabeld, setVDisabeld] = useState(true);
  const [venues, setVenues] = useState([]);
  const [loadderState, setLoadderState] = useState(false);

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: "Serial Number",
      width: 90,
      renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
    },
    {
      field: language == "en" ? "facilityType" : "facilityTypeMr",
      headerName: <FormattedLabel id="facilityType" />,
      description: "Facility Type",
      width: 200,
      // flex: 1,
    },
    {
      field: language == "en" ? "facilityName" : "facilityNameMr",
      headerName: <FormattedLabel id="facilityName" />,
      description: "Facility Name",
      width: 200,
      // valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
      // flex: 1,
    },

    {
      field: language == "en" ? "venue" : "venueMr",
      headerName: <FormattedLabel id="venue" />,
      width: 220,
      // valueFormatter: (params) => moment(params.value).format("hh:mm:ss A"),
      // flex: 1,
    },

    {
      field: language == "en" ? "zoneName" : "zoneNameMr",
      headerName: <FormattedLabel id="zone" />,
      description: "Zone Name",
      width: 150,
      // flex: 1,
    },

    // {
    //   field: language == "en" ? "serviceName" : "serviceNameMr",
    //   headerName: <FormattedLabel id="serviceName" />,
    //   description: "Service Name",
    //   width: 150,
    //   // flex: 1,
    // },

    {
      field: language == "en" ? "wardName" : "wardNameMr",
      headerName: <FormattedLabel id="ward" />,
      width: 150,
      // flex: 1,
    },

    {
      field: "slotDetailsDao",
      headerName: <FormattedLabel id="availableSlots" />,
      height: 700,
      width: 300,
      renderCell: (params) => {
        return (
          <>
            {params.row.slotDetailsDao?.map((slots) => (
              <>
                {slots?.fromTime + " - " + slots?.toTime}
                <br />
              </>
            ))}
          </>
        );
      },
    },
  ];

  useEffect(() => {
    getZoneWardID();
  }, [watch("venue")]);

  useEffect(() => {
    getVenueList();
  }, [watch("facilityName")]);

  useEffect(() => {
    if (watch("facilityType") === 1 || watch("facilityType") === 4) {
      setDisabeldDuration(true);
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
        });
      clearErrors("durationType");
    } else {
      setDisabeldDuration(false);
      setValue("durationType");
    }
  }, [watch("facilityType")]);

  useEffect(() => {
    getAllTypes();
    getWardNames();
    getFacilityTypes();
    getFacilityName();
    getDurationTypes();
    getVenue();
  }, []);

  useEffect(() => {
    if (watch("durationType") == 13) {
      if (
        watch("fromDate") != "Invalid date" &&
        watch("fromDate") != null &&
        watch("fromDate") != undefined
      ) {
        setValue("toDate", moment(watch("fromDate")).format("YYYY-MM-DD"));
        getSlots();
      }
      console.log("durationTypess<", durationTypess, watch("durationType"));
    } else {
      durationTypess.map((data) => {
        if (watch("durationType") == data?.id) {
          setValue("newData", data?.durationNo);
        }
      });

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
        // getSlots();
      }

      console.log("durationTypess", durationTypess, watch("durationType"));
    }
  }, [watch("durationType"), watch("fromDate")]);

  const getSlots = (value) => {
    let facilityName = getValues("facilityName");
    let facilityType = getValues("facilityType");
    let venue = getValues("venue");
    let fromDate = getValues("fromDate");
    let toDate = getValues("toDate");

    // setLoadderState(true);
    axios
      .get(
        `${URLS.SPURL}/master/venueDetails/getTimesByParameters?fromDate=${fromDate}&toDate=${toDate}&venue=${venue}&facilityName=${facilityName}&facilityType=${facilityType}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          setLoadderState(false);
          console.log("responce ksa yetoy", res?.data[0]?.slotDetailsDao);
          if (res?.data[0]?.slotDetailsDao?.length == 0) {
            alert("Slots are not available");
            setAvailableSlot(false);
          } else {
            // setTableData(res.data);

            setAvailableSlot(true);
            // let temp = res.data.map((row) => ({
            let temp = res?.data?.map((row) => ({
              id: row.id,
              slotDetailsDao: row?.slotDetailsDao,
              // slot: row.fromBookingTime + "-" + row.toBookingTime,
              // fromBookingTime: row.fromTime,
              // toBookingTime: row.toTime,
              // venue: row.venueSectionId,
              venue: venues?.find((obj) => obj?.id === row.venueSectionId)
                ?.venue,
              venueMr: venues?.find((obj) => obj?.id === row.venueSectionId)
                ?.venueMr,

              zoneName: sectionId?.find((obj) => obj?.id === row.zoneName)
                ?.zoneName,

              wardName: getward?.find((obj) => obj?.id === row.wardName)
                ?.wardName,

              zoneNameMr: sectionId?.find((obj) => obj?.id === row.zoneName)
                ?.zoneNameMr,

              wardNameMr: getward?.find((obj) => obj?.id === row.wardName)
                ?.wardNameMr,

              facilityType: facilityTypess?.find(
                (obj) => obj?.id === row.facilityType
              )?.facilityType,
              facilityTypeMr: facilityTypess?.find(
                (obj) => obj?.id === row.facilityType
              )?.facilityTypeMr,
              facilityName: facilityNames?.find(
                (obj) => obj?.id === row.facilityName
              )?.facilityName,
              facilityNameMr: facilityNames?.find(
                (obj) => obj?.id === row.facilityName
              )?.facilityNameMr,
            }));

            setTableData(temp);
            // setFromAndToTime(temp1);
            // setSlots(temp);
            console.log("resmessage", temp, temp1);
          }
        } else {
          console.log("error");
        }
      });

    // setBookingType(value);
    // console.log("props.bookingType", value);
    // props.bookingType(value);
  };

  // const getSlots = (value) => {
  //   let body = {
  //     facilityType: getValues("facilityType"),
  //     facilityName: getValues("facilityName"),
  //     venue: getValues("venue"),
  //     fromDate: getValues("fromDate"),
  //     toDate: getValues("toDate"),
  //     // toDate: moment(getValues("fromDate")).add(4, 'M').format('DD-MM-YYYY'),
  //   };
  //   console.log("DATA77", body);

  //   axios
  //     .post(`${URLS.SPURL}/sportsBooking/getSlotsByMonth`, body, {})
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
          let tempp = res.data.venueSection.map((row) => ({
            id: row.id,
            // zoneName : row.zoneName,

            zoneName: sectionId?.find((obj) => obj?.id === row.zoneName)?.id,
            wardName: getward?.find((obj) => obj?.id === row.wardName)?.id,
          }));
          setValue("zoneName", tempp[0].zoneName);
          setValue("wardName", tempp[0].wardName);
          // setSectionId(tempp);
          // setWard(tempp);
          // console.log("1111", sectionId);
          console.log("2222", tempp, tempp[0].zoneName);
        });
    }

    // setBookingType(value);
    // console.log("props.bookingType", value);
    // props.bookingType(value);
  };

  const getVenueList = (value) => {
    // let venueId = getValues("venue");
    let id = watch("facilityName");

    if (id != null && id != undefined && id != "") {
      // console.log("DATA77", body);

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
        });
    }
    // setBookingType(value);
    // console.log("props.bookingType", value);
    // props.bookingType(value);
  };

  const getVenue = () => {
    axios
      .get(`${URLS.SPURL}/venueMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        sortByAsc(r.data.venue, "venue");
        setVenues(
          r.data.venue.map((row) => ({
            id: row.id,
            venue: row.venue,
            venueMr: row.venueMr,
            facilityName: row.facilityName,
          }))
        );
      });
  };

  const [durationTypess, setDurationTypess] = useState([]);

  const getDurationTypes = () => {
    axios
      .get(`${URLS.SPURL}/master/durationType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setDurationTypess(
          r.data.durationType.map((row) => ({
            id: row.id,
            typeName: row.typeName,
            durationNo: row.durationNo,
            typeNameMr: row.typeNameMr,
          }))
        );
      });
  };

  const [applicantTypess, setApplicantTypess] = useState([]);

  // getApplicant Type
  const getApplicantTypes = () => {
    axios
      .get(`${URLS.SPURL}/applicantType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log(" types :", r.data.applicantType);
        setApplicantTypess(r.data.applicantType);
        setApplicantTypess(
          r.data.applicantType.map((row) => ({
            id: row.id,
            typeName: row.typeName,
            typeNameMr: row.typeNameMr,
          }))
        );
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
        setFacilityNames(
          r.data.facilityName.map((row) => ({
            id: row.id,
            facilityName: row.facilityName,
            facilityNameMr: row.facilityNameMr,
            facilityType: row.facilityType,
            facilityTypeMr: row.facilityTypeMr,
          }))
        );
      });
  };

  useEffect(() => {
    if (router.query.pageMode != "Add") setTemp1(getValues("zoneKey"));
  }, [getValues("zoneName")]);

  // useEffect(() => {
  //   if (temp1) getWardNames();
  // }, [temp1]);

  // getWardKeys
  // const getWardNames = () => {
  //   axios
  //     .get(
  //       `${
  //         URLS.CFCURL
  //       }/master/zoneAndWardLevelMapping/getWardByDepartmentId?departmentId=${2}&zoneId=${temp1}`
  //     )
  //     .then((r) => {
  //       setWardNames(
  //         r.data.map((row) => ({
  //           id: row.id,
  //           wardName: row.wardName,
  //           wardNameMr: row.wardNameMr,
  //         }))
  //       );
  //     });
  // };

  // ${URLS.SPURL}
  const getFacilityTypes = () => {
    axios
      .get(`${URLS.SPURL}/facilityType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setFacilityTypess(
          r.data.facilityType.map((row) => ({
            id: row.id,
            facilityType: row.facilityType,
            facilityTypeMr: row.facilityTypeMr,
          }))
        );
      });
  };
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
      });
  };

  // getWard
  const [getward, setWard] = useState([]);

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
      });
  };
  // const getWardNames = () => {
  //   axios.get(`${URLS.CFCURL}/master/ward/getAll`).then((r) => {
  //     setWardNames(
  //       r.data.ward.map((row) => ({
  //         id: row.id,
  //         wardName: row.wardName,
  //         wardNameMr: row.wardNameMr,
  //       }))
  //     );
  //   });
  // };
  const getDepartments = () => {
    axios
      .get(`${URLS.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setDepartments(
          r.data.department.map((row) => ({
            id: row.id,
            department: row.department,
          }))
        );
      });
  };

  // cancell Button
  const cancellButton = () => {
    setAvailableSlot(false);
    reset({
      ...resetValuesCancell,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    Ward: "",
    zone: "",
    subDepartment: "",
    department: "",
    facilityType: "",
    facilityName: "",
    venue: "",
    formDateTime: "",
    toDateTime: "",
    formDateTime: null,
    toDateTime: null,
    id: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    facilityType: "",
    facilityName: "",
    venue: "",
    zone: "",
    Ward: "",
    durationType: "",
    fromDate: null,
    toDate: null,
    bookingTimeId: "",
    id: "",
    // formDateTime: null,
    // toDateTime: null,
  };

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    // router.push("/transaction");
    router.push("/dashboard");
  };

  // const searchButton = (data) => {
  //   // alert("Clicked");
  //   console.log("Check data: ", data);
  //   const tempData = axios
  //     .post(`${URLS.SPURL}/facilityAvailabilityStatus/checkStatus`, data)
  //     .then((res) => {
  //       console.log("data", res.data);
  //       if (res?.data?.length != 0) {
  //         console.log("Temp Data", res.data);
  //         setDataSource(
  //           res.data.map((row) => ({
  //             id: row.id,
  //             capacity: row.capacity,

  //             // zoneName: row.zoneName,
  //             zoneName: zoneNames?.find((obj) => obj?.id === row.zoneName)
  //               ?.zoneName,
  //             wardName: wardNames?.find((obj) => obj?.id === row.wardName)
  //               ?.wardName,
  //             facilityType: facilityTypess?.find(
  //               (obj) => obj?.id === row.facilityType
  //             )?.facilityType,
  //             facilityName: facilityNames?.find(
  //               (obj) => obj?.id === row.facilityName
  //             )?.facilityName,
  //             venue: venues?.find((obj) => obj?.id === row.venue)?.venue,

  //             fromBookingTime: moment(row.fromBookingTime, "hh:mm A").format(
  //               "hh:mm A"
  //             ),
  //             toBookingTime: moment(row.toBookingTime, "hh:mm A").format(
  //               "hh:mm A"
  //             ),
  //             date: row.date,
  //           }))
  //         );
  //       } else {
  //         alert("Not Available");
  //       }
  //     });
  // };

  useEffect(() => {
    if (watch("facilityType")) {
      console.log("abc123", watch("facilityType"));
      if (watch("facilityType") == 12) {
        setTempVal(1);
      } else if (watch("facilityType") == 13) {
        setTempVal(2);
      } else if (watch("facilityType") == 14) {
        setTempVal(3);
      } else if (watch("facilityType") == 15) {
        setTempVal(4);
      }
    }
  }, [watch("facilityType")]);

  const cols = [
    {
      title: "Date",
      dataIndex: "date",
      flex: 1,
      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
    },
    {
      title: "From Time",
      dataIndex: "fromBookingTime",
      flex: 1,
    },
    {
      title: "Zone",
      dataIndex: "zoneName",
      flex: 1,
    },
    {
      title: "WardName",
      dataIndex: "wardName",
      flex: 1,
    },
    {
      title: "Facility Type",
      dataIndex: "facilityType",
      flex: 1,
    },
    {
      title: "Facility Name",
      dataIndex: "facilityName",
      flex: 1,
    },

    {
      title: "Venue",
      dataIndex: "venue",
      flex: 1,
    },
    {
      title: "To Time",
      dataIndex: "toBookingTime",
      // dataIndex: moment("toBookingTime").format("LT"),
      flex: 1,
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      flex: 1,
    },

    {
      title: "Actions",
      width: "56px",
      render: (record) => {
        return (
          <>
            <Row>
              <Col>
                {tempVal == 2 ? (
                  <Button
                    color="success"
                    variant="outlined"
                    onClick={() => {
                      router.push({
                        pathname: `/sportsPortal/transaction/groundBookingNew/citizen/citizenForm`,
                      });
                    }}
                  >
                    Book Now /groundBookingNew
                  </Button>
                ) : (
                  ""
                )}
                {tempVal == 1 ? (
                  <Button
                    color="success"
                    variant="outlined"
                    onClick={() => {
                      console.log("Booking Data for Sports ", record);
                      router.push({
                        pathname: `/sportsPortal/transaction/sportBooking`,
                        query: {
                          fromBookingTime: record.fromBookingTime,
                        },
                      });
                    }}
                  >
                    Book Now / sportBooking
                  </Button>
                ) : (
                  ""
                )}
                {tempVal == 3 ? (
                  <Button
                    color="success"
                    variant="outlined"
                    onClick={() => {
                      router.push({
                        pathname: `/sportsPortal/transaction/swimmingPoolM/citizen/citizenForm`,
                      });
                    }}
                  >
                    Book Now / swimmingPoolM
                  </Button>
                ) : (
                  ""
                )}
              </Col>
            </Row>
          </>
        );
      },
    },
  ];

  return (
    <>
      {loadderState ? (
        <Loader />
      ) : (
        <Paper
          sx={{
            marginLeft: 2,
            marginRight: 2,
            marginTop: 2,
            marginBottom: 2,
            border: 1,
            borderColor: "grey.500",
          }}
        >
          <FormProvider {...methods}>
            {/* <form onSubmit={handleSubmit(onSubmitForm)}> */}
            {/* <form onSubmit={handleSubmit(searchButton)}> */}
            <form onSubmit={handleSubmit(getSlots)}>
              <div className={styles.facilityDetails}>
                <div className={styles.h1Tag}>
                  <h3
                    style={{
                      color: "white",
                      marginTop: "2vh",
                    }}
                  >
                    {/* Facility Availability */}
                    <FormattedLabel id="facilityAvl" />
                  </h3>
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
                {/* Facility Type */}
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <FormControl
                    variant="standard"
                    // sx={{ marginTop: 2 }}
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
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                            console.log("value: ", value.target.value);
                            setSelectedFacilityType(value.target.value);
                            setFNDisabeld(false);
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
                      {errors?.facilityType
                        ? errors.facilityType.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={6} lg={3} xl={2}>
                  <FormControl
                    variant="standard"
                    // sx={{ m: 1, minWidth: 120 }}
                    error={!!errors.facilityName}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      {<FormattedLabel id="facilityName" required />}
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          disabled={fNDisabeld}
                          sx={{ minWidth: 220 }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          // onChange={(value) => field.onChange(value)}
                          onChange={(value) => {
                            field.onChange(value);
                            setVDisabeld(false);
                            setAvailableSlot(false);
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
                                return (
                                  facility.facilityType ===
                                  watch("facilityType")
                                );
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
                      {errors?.facilityName
                        ? errors.facilityName.message
                        : null}
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
                      {<FormattedLabel id="venue" />}
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          disabled={vDisabeld}
                          sx={{ minWidth: 220 }}
                          labelId="demo-simple-select-standard-label"
                          Fdate
                          id="demo-simple-select-standard"
                          value={field.value}
                          // onChange={(value) => field.onChange(value)}
                          onChange={(value) => {
                            field.onChange(value);
                            console.log("897898", value);
                            // setValue("durationType", "");
                            setValue("fromDate", null);
                            setValue("toDate", null);
                            setValue("bookingTimeId", "");

                            // getZoneWardID();
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
                                  {language == "en"
                                    ? venue?.venue
                                    : venue?.venueMr}
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
                            // console.log("Zone Key: ", value.target.value);
                            // setTemp1(value.target.value);
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
                    sx={{ marginTop: 2 }}
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
                    variant="standard"
                    sx={{ marginTop: 2 }}
                    error={!!errors.durationType}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="durationType" required />
                      {/* Duration Type */}
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          disabled={disabeldDuration}
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
                      {errors?.durationType
                        ? errors.durationType.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <FormControl
                    style={{ marginTop: 27, width: 220 }}
                    error={!!errors.fromDate}
                  >
                    <Controller
                      control={control}
                      name="fromDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            // shouldDisableDate={isDisabledDate}
                            minDate={moment().startOf("month").toDate()}
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                <FormattedLabel id="fromDate" required />
                              </span>
                            }
                            value={field.value}
                            // onChange={(date) => field.onChange(moment(date).format("YYYY-MM-DD"))}
                            onChange={(date) => {
                              field.onChange(moment(date).format("YYYY-MM-DD"));
                              // let endDate= moment(date).add(1,'M').format('YYYY-MM-DD');
                              // let endDate= moment(date).add(newData,'M').format('YYYY-MM-DD');
                              // setValue("toDate", endDate);
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
                    style={{ marginTop: 27, width: 220 }}
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
                              getSlots();
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

                {/* {availableSlot && (
                <div className={styles.availableSlots}>
                  <FormControl
                    variant="standard"
                    sx={{ marginTop: 4 }}
                    error={!!errors.bookingId}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="availableSlot" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: 250 }}
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
                      // name="bookingId"
                      name="bookingTimeId"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.bookingId ? errors.bookingId.message : null}
                    </FormHelperText>
                  </FormControl>
                </div>
              )} */}

                {/* Table */}

                {availableSlot && (
                  <div style={{ width: "94%", marginTop: "2.5%" }}>
                    <DataGrid
                      // components={{ Toolbar: GridToolbar }}
                      // componentsProps={{
                      //   toolbar: {
                      //     showQuickFilter: true,
                      //     quickFilterProps: { debounceMs: 500 },
                      //   },
                      // }}
                      autoHeight
                      sx={{
                        overflowY: "scroll",

                        "& .MuiDataGrid-virtualScrollerContent": {},
                        "& .MuiDataGrid-columnHeadersInner": {
                          backgroundColor: "#556CD6",
                          color: "white",
                        },

                        "& .MuiDataGrid-cell:hover": {
                          color: "primary.main",
                        },
                      }}
                      density="density"
                      rows={tableData}
                      columns={columns}
                      pageSize={10}
                      rowsPerPageOptions={[10]}
                    />
                  </div>
                )}
              </Grid>

              <div className={styles.btn}>
                <Button
                  sx={{ marginRight: 8, marginTop: 2, marginBottom: 4 }}
                  type="submit"
                  variant="contained"
                  color="success"
                  endIcon={<SaveIcon />}
                  onClick={() => getSlots()}
                >
                  <FormattedLabel id="search" />
                </Button>
                <Button
                  sx={{ marginRight: 8, marginTop: 2, marginBottom: 4 }}
                  variant="contained"
                  color="primary"
                  endIcon={<ClearIcon />}
                  onClick={() => cancellButton()}
                >
                  <FormattedLabel id="clear" />
                </Button>
                <Button
                  sx={{ marginTop: 2, marginBottom: 4 }}
                  variant="contained"
                  color="error"
                  endIcon={<ExitToAppIcon />}
                  onClick={() => exitButton()}
                >
                  <FormattedLabel id="exit" />
                </Button>
              </div>
            </form>
          </FormProvider>
        </Paper>
      )}
    </>
  );
};

export default Index;
