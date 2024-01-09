import React, { useEffect, useState } from "react";
import Head from "next/head";
import router from "next/router";
import styles from "../master.module.css";
import moment from "moment";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import Title from "../../../../containers/VMS_ReusableComponents/Title";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { Controller, FormProvider, useForm } from "react-hook-form";
import axios from "axios";
import URLS from "../../../../URLS/urls";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import { DataGrid } from "@mui/x-data-grid";
import {
  Add,
  Clear,
  Delete,
  Edit,
  ExitToApp,
  Save,
  ToggleOff,
  ToggleOn,
} from "@mui/icons-material";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import Loader from "../../../../containers/Layout/components/Loader";

const VenueDetails = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const today = moment();
  const firstDayOfMonth = today.startOf("month");
  const isDisabledDate = (date) => !date.isSame(firstDayOfMonth, "day");
  const [duration1, setDuration1] = useState();
  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [facilityTypess, setFacilityTypess] = useState([]);
  const [facilitySubTypes, setFacilitySubTypes] = useState([]);
  const [allSubTypes, setAllSubTypes] = useState([]);
  const [unit, setUnit] = useState([]);
  const [table, setTable] = useState([]);
  const [venues, setVenues] = useState([]);
  const [sections, setSections] = useState([]);
  const [runAgain, setRunAgain] = useState(false);
  const [open, setOpen] = useState(false);
  const [sectionId, setSectionId] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [getward, setWard] = useState([]);
  const [facilityType, setFacilityType] = useState([]);
  const [facilityName, setFacilityName] = useState([]);
  const [venueField, setVenueField] = useState(true);
  const [newSection, setNewSection] = useState([]);
  const [disableKadhnariState, setDisableKadhnariState] = useState(true);
  const [selectedFacilityName, setSelectedFacilityName] = useState();
  const [selectedFacilityType, setSelectedFacilityType] = useState();
  const [loadderState, setLoadderState] = useState(false);

  const [data, setData] = useState({
    totalRows: 0,
    rowsPerPageOptions: [5, 10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const [durationTime, setDurationTime] = useState([
    { id: 1, time: "1 hr", timeMr: "1 तास" },
    // { id: 2, time: "1.5 hr", timeMr: "1.5 तास" },
    { id: 2, time: "2 hr", timeMr: "2 तास" },
    // { id: 4, time: "2.5 hr", timeMr: "2.5 तास" },
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
  const capacity = (value) => {
    setValue("capacity", newSection.find((obj) => obj.id == value)?.capacity);
  };
  const getSectionByFacilityName = () => {
    let venue = getValues("venueSectionId");
    let facilityType = getValues("facilityType");
    let facilityName = getValues("facilityName");

    axios
      .get(
        `${URLS.SPURL}/facilityName/getFacilityNamesByVenueAndFacilityTypeAndFacilityName?venue=${venue}&facilityType=${facilityType}&facilityName=${facilityName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((r) => {
        console.log("111111: ", r);

        setNewSection(
          r.data.map((row) => ({
            index: row.index,
            id: row.id,
            section: row.section,
            // unit:row.unit,
            capacity: row.capacity,
            unit: unit?.find((obj) => obj?.id === row.unit)?.unit,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    // }
  };

  const getFacilityName = () => {
    let venue = getValues("venueSectionId");
    let facilityType = getValues("facilityType");
    console.log("11", venue);
    axios
      .get(
        `${URLS.SPURL}/facilityName/getFacilityNamesByVenueAndFacilityType?venue=${venue}&facilityType=${facilityType}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((r) => {
        console.log("from facility type : ", r);
        setFacilityName(
          r.data.map((row) => ({
            index: row.index,
            id: row.id,
            facilityName: row.facilityName,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    // }
  };

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
      })
      .catch((error) => {
        callCatchMethod(error, language);
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
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  const getTypeNameKeys = () => {
    let venueSectionId = getValues("venueSectionId");
    console.log("11", venueSectionId);

    //Ha solve
    axios
      .get(
        `${URLS.SPURL}/facilityType/getFacilityTypeByVenueId?venueId=${venueSectionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((r) => {
        console.log("From Venue Id :", r);

        setFacilityType(
          r.data.map((row) => ({
            index: row.index,
            id: row.id,
            facilityType: row.facilityType,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    // }
  };

  const getZoneWardID = () => {
    let venue = watch("venueSectionId");

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

          console.log("2222", tempp, tempp[0].zoneName);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  // getVenue -- Facility Type -- Facility Type
  const getVenue = () => {
    axios
      .get(`${URLS.SPURL}/venueMasterSection/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("11", r);
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

  let applicationFormSchema = yup.object().shape({
    zoneName: yup
      .number()
      .required()
      .typeError(
        language === "en" ? "Please select a zone" : "कृपया एक IPD निवडा"
      ),
  });
  let sectionDetailsSchema = yup.object().shape({});

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(applicationFormSchema),
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    getValues,
    setValue,
    formState: { errors: errors },
  } = methods;

  //Section Details
  const {
    register: register1,
    handleSubmit: handleSubmit1,
    setValue: setValue1,
    watch: watch1,
    reset: reset1,
    control: control1,
    formState: { errors: errors1 },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(sectionDetailsSchema),
  });

  useEffect(() => {
    getVenue();
    getAllTypes();
    getWardNames();
    getDurationTypes();
  }, []);

  useEffect(() => {
    setDuration1(watch("duration"));
  }, [watch("duration")]);

  useEffect(() => {
    console.log("slots: ", sections, !!watch1("id"));
  }, [sections]);
  useEffect(() => {
    console.log("24234234234", table);
  }, [table]);

  useEffect(() => {
    getZoneWardID();
    // getTypeNameKeys();
  }, [watch("venueSectionId")]);

  useEffect(()=> {
console.log("datat3423423",data)
  },[data])

  useEffect(() => {
    axios
      .get(`${URLS.CFCURL}/master/zoneWardAreaMapping/getZoneByApplicationId`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) =>
        setZoneNames(
          res.data?.map((zones) => ({
            id: zones.zoneId,
            zoneName: zones.zoneName,
            zoneNameMr: zones.zoneNameMr,
          }))
        )
      )
      .catch((error) => {
        callCatchMethod(error, language);
      });

    //Get Facility Type
    axios
      .get(`${URLS.SPURL}/facilityType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setFacilityTypess(
          r.data?.facilityType.map((row) => ({
            id: row.id,
            facilityType: row.facilityType,
            facilityTypeMr: row.facilityTypeMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    //Get Facility Sub-Type
    axios
      .get(`${URLS.SPURL}/facilityName/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setAllSubTypes(
          r.data?.facilityName.map((row) => ({
            id: row.id,
            facilityName: row.facilityName,
            facilityNameMr: row.facilityNameMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    //Get Units
    axios
      .get(`${URLS.SPURL}/unit/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setUnit(
          r.data?.unit.map((row) => ({
            id: row.id,
            unitEn: row.unit,
            unitMr: row.unitMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  }, []);

  useEffect(() => {
    setRunAgain(false);

    console.log("durationTypess",durationTypess,"allSubTypes",allSubTypes,"facilityTypess",facilityTypess,"venues",venues,"zoneNames",zoneNames, "wardNames",wardNames)

    if( durationTypess.length>0 && allSubTypes.length>0 && facilityTypess.length>0 && venues.length>0 ){
console.log("caleddddddddd");
      getTableData();
    }

  }, [durationTypess,allSubTypes,facilityTypess,venues]);

  useEffect(() => {
    // if (
    //   (!watch("verification") &&
    //     !watch(router.query.pageMode === "MyApplication")) ||
    //   watch(router.query.pageMode === "Add")
    // )
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

      let finEndDate = moment(endDate).subtract(1, "days").format("YYYY-MM-DD");
      console.log("finEndDate", finEndDate);
      setValue("toDate", finEndDate);
    }
  }, [watch("durationType"), watch("fromDate")]);

  // useEffect(() => {
  //   // if (!watch("verification")) {
  //   if (watch("duration") == 1) {
  //     alert("1hr Selected");

  //     // console.log("Shree22", watch("duration"));
  //     // alert("Day Selected");
  //     // setValue("toDate", getValues("fromDate"));
  //     // getSlots();
  //   }
  // }, [watch("fromTime"), watch("duration")]);

  useEffect(() => {
    console.log("duration1", duration1);
    console.log("fromTime1", watch1("fromTime"));
    if (
      watch1("fromTime") != "Invalid date" &&
      watch1("fromTime") != null &&
      watch1("fromTime") != undefined &&
      duration1 != undefined &&
      duration1 != ""
    ) {
      let temp1 = durationTime
        .find((data) => data?.id == duration1)
        ?.time.split(" ")[0];
      console.log("temp1", temp1);
      let endTime = moment(watch1("fromTime")).add(duration1, "hours");
      console.log("endTime", endTime);
      setValue1("toTime", endTime);
    }
    console.log("FROM TIME", watch1("toTime"));
  }, [watch1("fromTime")]);

  // useEffect(() => {
  //   getSlots();
  // }, [watch("fromDate")]);
  useEffect(() => {
    console.log("21", table);
  }, [table]);

  const getTableData = (pageSize = 10, pageNo = 0) => {
    setLoadderState(true)
    axios
      .get(`${URLS.SPURL}/master/venueDetails/getAllYN`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { pageNo, pageSize, sortBy: "id", sortDir: "desc" },
      })
      .then((res) => {

        setLoadderState(false)
     console.log("data234234234",res?.data)

        setTable(
          res.data?.venueDetails?.map((obj, i) => ({
            ...obj,
            srNo: i + 1,
            venueSectionId: venues?.find((j) => j.id == obj.venueSectionId)
              ?.venue,
            venueSectionIdMr: venues?.find((j) => j.id == obj.venueSectionId)
              ?.venueMr,
            facilityType: facilityTypess?.find((j) => j.id == obj.facilityType)
              ?.facilityType,
            facilityTypeMr: facilityTypess?.find(
              (j) => j.id == obj.facilityType
            )?.facilityTypeMr,
            facilityName: allSubTypes?.find((j) => j.id == obj.facilityName)
              ?.facilityName,
            facilityNameMr: allSubTypes?.find((j) => j.id == obj.facilityName)
              ?.facilityNameMr,
            duration: durationTypess?.find((j) => j.id == obj.typeName)
              ?.typeName,

            // noOfSections: obj?.sectionLst?.length || 0,
          }))
        );

        setData({
          ...data,
          totalRows: res.data.totalElements,
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      })
      .catch((error) => {
        setLoadderState(false)
        callCatchMethod(error, language);
      });
  };

  const clearData = (dataStatus) => {
    if (dataStatus == "new") {
      reset({
        id: null,
        zoneName: "",
        wardName: "",
        venue: "",
        venueMr: "",
        address: "",
        addressMr: "",
        contactPersonName: "",
        contactPersonNameMr: "",
        contactPersonMobileNo: "",
        remark: "",
        remarkMr: "",
      });
      setSections([]);
    } else {
      reset({
        id: watch("id"),
        zoneName: "",
        wardName: "",
        venue: "",
        venueMr: "",
        address: "",
        addressMr: "",
        contactPersonName: "",
        contactPersonNameMr: "",
        contactPersonMobileNo: "",
        remark: "",
        remarkMr: "",
      });
    }
  };

  const columns = [
    {
      headerClassName: "cellColor",
      field: "srNo",
      headerAlign: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 60,
    },

    {
      // headerClassName: "cellColor",
      field: "fromTime",
      headerAlign: "center",
      headerName: <FormattedLabel id="fromBookingTime" />,
      minWidth: 125,
      // flex: 0.7,
    },
    {
      // headerClassName: "cellColor",
      field: "toTime",
      headerAlign: "center",
      headerName: <FormattedLabel id="toBookingTime" />,
      minWidth: 125,
    },
    {
      // headerClassName: "cellColor",
      field: "capacitySub",
      headerAlign: "center",
      headerName: <FormattedLabel id="capacity" />,
      minWidth: 125,
    },
    {
      // headerClassName: "cellColor",
      field: "zoneName",
      headerAlign: "center",
      headerName: <FormattedLabel id="zoneName" />,
      minWidth: 125,
    },
    {
      headerClassName: "cellColor",
      field: "action",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="actions" />,
      width: 125,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              style={{
                color: "#1976d2",
              }}
              onClick={() => {
                getFacilitySubTypes(params.row.facilityType);
                reset1(params.row);
                setOpen(true);
              }}
            >
              <Edit />
            </IconButton>
            {!watch("id") ? (
              <IconButton
                style={{
                  color: "red",
                }}
                onClick={() => {
                  setSections((prev) =>
                    prev
                      .filter((j) => j.id != params.row.id)
                      .map((j, i) => ({ ...j, srNo: i + 1 }))
                  );
                }}
              >
                <Delete />
              </IconButton>
            ) : (
              <IconButton
                sx={{ color: params.row.activeFlag == "Y" ? "green" : "red" }}
                onClick={() => {
                  // @ts-ignore
                  setSections((prev) =>
                    prev?.map((j, i) => ({
                      ...j,
                      srNo: i + 1,
                      activeFlag:
                        params.row.id == j?.id
                          ? params.row.activeFlag == "Y"
                            ? "N"
                            : "Y"
                          : j?.activeFlag,
                    }))
                  );
                }}
              >
                {params.row.activeFlag == "Y" ? (
                  <ToggleOn
                    sx={{
                      fontSize: 30,
                    }}
                  />
                ) : (
                  <ToggleOff
                    sx={{
                      fontSize: 30,
                    }}
                  />
                )}
              </IconButton>
            )}
          </>
        );
      },
    },
  ];

  const masterColumns = [
    {
      headerClassName: "cellColor",
      field: "srNo",
      headerAlign: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 75,
    },
    {
      headerClassName: "cellColor",
      field: language == "en" ? "venueSectionId" : "venueSectionIdMr",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="venue" />,
      width: 250,
    },

    {
      headerClassName: "cellColor",
      field: language == "en" ? "facilityType" : "facilityTypeMr",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="facilityType" />,
      minWidth: 300,
      // flex: 1,
    },
    {
      headerClassName: "cellColor",
      field: language == "en" ? "facilityName" : "facilityNameMr",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="facilityName" />,
      width: 300,
    },
    // {
    //   headerClassName: "cellColor",
    //   field: language == "en" ? "duration" : "duration",
    //   headerAlign: "center",
    //   headerName: <FormattedLabel id="duration" />,
    //   width: 175,
    // },
    {
      headerClassName: "cellColor",
      field: "action",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="actions" />,
      width: 300,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              style={{
                color: params.row.activeFlag == "Y" ? "#1976d2" : "lightgray",
              }}
              disabled={params.row.activeFlag == "N"}
              onClick={() => {
                getWards(params.row.zoneName);
                reset({ ...params.row });
                console.log("sections11:", params.row);
                setSections(
                  params.row?.slotDetailsDao?.map((section, i) => ({
                    srNo: i + 1,
                    ...section,
                    fromTime: moment(section.fromTime, "HH:mm:ss").format(
                      "HH:mm:ss"
                    ),

                    toTime: moment(section.toTime, "HH:mm:ss ").format(
                      "HH:mm:ss"
                    ),
                    // fromTime: section.fromTime,
                    // toTime: section.toTime,
                    // unitMr: unit?.find((obj) => obj.id == section?.unit)
                    //   ?.unitMr,
                    new: false,
                  })) ?? []
                );
              }}
            >
              <Edit />
            </IconButton>

            <IconButton
              sx={{ color: params.row.activeFlag == "Y" ? "green" : "red" }}
              onClick={() => {
                // @ts-ignore
                deleteById(params.row, params.row.activeFlag);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOn
                  sx={{
                    fontSize: 30,
                  }}
                />
              ) : (
                <ToggleOff
                  sx={{
                    fontSize: 30,
                  }}
                />
              )}
            </IconButton>
          </>
        );
      },
    },
  ];

  const deleteById = (rowData, flag) => {
    sweetAlert({
      title: language === "en" ? "Confirmation" : "पुष्टीकरण",
      text:
        language === "en"
          ? "Do you really want to change the status of this record ?"
          : "तुम्हाला खरोखर या रेकॉर्डची स्थिती बदलायची आहे का?",
      icon: "warning",
      buttons: [
        language === "en" ? "No" : "नाही",
        language === "en" ? "Yes" : "होय",
      ],
    }).then((ok) => {
      if (ok) {
        axios
          .post(`${URLS.SPURL}/venueMasterSection/saveVenueMasterSection `, {
            ...rowData,
            activeFlag: flag == "Y" ? "N" : "Y",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            sweetAlert(
              language === "en" ? "Success" : "यशस्वी झाले",
              flag == "Y"
                ? language === "en"
                  ? "Record successfully deactivated"
                  : "रेकॉर्ड यशस्वीरित्या निष्क्रिय केले"
                : language === "en"
                ? "Record successfully activated"
                : "रेकॉर्ड यशस्वीरित्या सक्रिय केले",
              "success",
              { button: language === "en" ? "Ok" : "ठीक आहे" }
            );
            setRunAgain(true);
          })
          .catch((error) => {
            sweetAlert(
              language === "en" ? "Error!" : "त्रुटी!",
              language === "en" ? "Something went wrong" : "काहीतरी चूक झाली",
              "error",
              { button: language === "en" ? "Ok" : "ठीक आहे" }
            );
          });
      }
    });
  };

  const getWards = (zoneId) => {
    //Get Wards
    axios
      .get(
        `${URLS.CFCURL}/master/zoneAndWardLevelMapping/getWardByDepartmentId`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        { params: { departmentId: 2, zoneId } }
      )
      .then((r) => {
        setWardNames(
          r.data.map((row) => ({
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

  const getFacilitySubTypes = (facilityType) => {
    axios
      .get(`${URLS.SPURL}/facilityName/getSubTypeByFacility`, {
        params: { facilityType },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setFacilitySubTypes(
          res.data?.map((j) => ({
            id: j.id,
            facilityType: j.facilityType,
            facilityName: j.facilityName,
            facilityNameMr: j.facilityNameMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const addSectionDetails = (sectionDetailsData) => {
    console.log("formData21", sectionDetailsData);

    if (!!watch1("id") || watch1("id") == 0) {
      // @ts-ignore
      setSections((prev) =>
        prev?.map((obj) => {
          console.log(
            "13454: ",
            obj.id,
            obj.id == sectionDetailsData?.id,
            sectionDetailsData?.id
          );
          return obj.id == sectionDetailsData?.id
            ? {
                ...sectionDetailsData,
                // id: prev?.find((j) => j.id == prev.length)
                //   ? prev.length + 1
                //   : prev.length,
                fromTime: moment(
                  sectionDetailsData.fromTime,
                  "HH:mm:ss"
                ).format("HH:mm:ss"),

                toTime: moment(sectionDetailsData.toTime, "HH:mm:ss ").format(
                  "HH:mm:ss "
                ),

                new: false,
                activeFlag: "Y",
              }
            : obj;
        })
      );
    } else {
      // @ts-ignore
      setSections((prev) =>
        [
          ...prev,
          {
            ...sectionDetailsData,
            id: prev?.find((obj) => obj.id == prev.length)
              ? prev.length + 1
              : prev.length,
            fromTime: moment(sectionDetailsData.fromTime, "HH:mm:ss").format(
              "HH:mm:ss"
            ),

            toTime: moment(sectionDetailsData.toTime, "HH:mm:ss ").format(
              "HH:mm:ss"
            ),
            // fromDate: sectionDetailsData.fromDate,
            // toDate: sectionDetailsData.toDate,
            // fromTime: sectionDetailsData.fromTime,
            // toTime: sectionDetailsData.toTime,
            new: true,
            activeFlag: "Y",
          },
        ].map((j, i) => ({ ...j, srNo: i + 1 }))
      );
    }

    reset1({
      id: null,
      toTime: "",
      fromTime: "",
    });
    setOpen(false);
  };

  const finalSubmit = (finalFormData) => {
    const bodyForAPI = {
      ...finalFormData,
      slotDetailsDao: sections?.map((j) => ({ ...j, id: j.new ? null : j.id })),
      activeFlag: watch("activeFlag"),
    };

    //   axios
    //     .post(`${URLS.SPURL}/master/venueDetails/save`, bodyForAPI, {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     })
    //     .then((res) => sweetAlert("Saved!", "Data Successfully Saved", "success"))
    //     .catch((error) => {
    //       callCatchMethod(error, language);
    //     });
    // };

    sweetAlert({
      title: language === "en" ? "Confirmation" : "पुष्टीकरण",
      text:
        language === "en"
          ? "Do you really want to change the status of this record ?"
          : "तुम्हाला खरोखर या रेकॉर्डची स्थिती बदलायची आहे का?",
      icon: "warning",
      buttons: [
        language === "en" ? "No" : "नाही",
        language === "en" ? "Yes" : "होय",
      ],
    }).then((ok) => {
      if (ok) {
        axios
          .post(`${URLS.SPURL}/master/venueDetails/save`, bodyForAPI, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            sweetAlert("Saved!", "Data Successfully Saved", "success");

            setRunAgain(true);
            setCollapse(false);
            clearData("new");
          })
          .catch((error) => {
            callCatchMethod(error, language);
          });
      }
    });
  };

  return (
    <>
    {loadderState ? (
      <Loader />
    ) : (<>
      <Head>
        <title>
          <FormattedLabel id="slotMaster" />
        </title>
      </Head>
      <Paper className={styles.main}>
        <Title titleLabel="Slot Master" />
        <div className={styles.leftBttn}>
          <Button
            variant="contained"
            endIcon={<Add />}
            disabled={collapse}
            onClick={() => {
              setCollapse(true);
            }}
          >
            <FormattedLabel id="add" />
          </Button>
        </div>

        {collapse && (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(finalSubmit)}>
              {/* <Slide
                direction='down'
                in={slideChecked}
                mountOnEnter
                unmountOnExit
              >
              </Slide> */}
              <>
                <div className={styles.subTitle}>
                  <FormattedLabel id="venueDetails" />
                </div>
                <div className={styles.fieldsWrapper}>
                  <FormControl variant="standard" error={!!errors.venue}>
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="venue" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: 220 }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value), getZoneWardID();
                            getTypeNameKeys();
                          }}
                          label="venue"
                        >
                          {venues &&
                            venues.map((venue, index) => (
                              <MenuItem key={index} value={venue.id}>
                                {language == "en"
                                  ? venue?.venue
                                  : venue?.venueMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="venueSectionId"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.venue ? errors.venue.message : null}
                    </FormHelperText>
                  </FormControl>
                  <FormControl variant="standard" error={!!errors.zone}>
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

                  <div style={{ width: 250 }}>
                    <FormControl variant="standard" error={!!errors.wardName}>
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
                  </div>
                  <FormControl variant="standard" error={!!errors.facilityType}>
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="facilityType" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: 220 }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value), getFacilityName();
                            console.log("66", value.target.value);
                            setSelectedFacilityType(value.target.value);
                            setDisableKadhnariState(false);
                          }}
                          label="facilityType"
                        >
                          {facilityType &&
                            facilityType.map((facilityType, index) => {
                              return (
                                <MenuItem key={index} value={facilityType?.id}>
                                  {language == "en"
                                    ? facilityType.facilityType
                                    : facilityType.facilityTypeMr}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      )}
                      name="facilityType"
                      // name={`section.facilityType`}
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.facilityType
                        ? errors.facilityType.message
                        : null}
                    </FormHelperText>
                  </FormControl>

                  <div style={{ width: 250 }}>
                    <FormControl
                      variant="standard"
                      sx={{ marginTop: 3, minWidth: 120 }}
                      error={!!errors.facilityName}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="facilityName" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ minWidth: 220 }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value), getSectionByFacilityName();
                              console.log("facilityName: ", value.target.value);
                              setSelectedFacilityName(value.target.value);
                              setVenueField(false);
                            }}
                            label="facilityName"
                            // disabled={disableKadhnariState}
                          >
                            {facilityName &&
                              facilityName.map((facilityName, index) => {
                                return (
                                  <MenuItem
                                    key={index}
                                    value={facilityName?.id}
                                  >
                                    {language == "en"
                                      ? facilityName.facilityName
                                      : facilityName.facilityNameMr}
                                  </MenuItem>
                                );
                              })}
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
                  </div>

                  <div style={{ width: 250 }}>
                    <FormControl
                      variant="standard"
                      sx={{ marginTop: 3, minWidth: 120 }}
                      error={!!errors.durationType}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="Sections" />
                        {/* Sections */}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ minWidth: 220 }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value),
                                capacity(value.target.value);
                            }}
                            label="sectionId"
                          >
                            {newSection &&
                              newSection.map((newSection, index) => {
                                return (
                                  <MenuItem key={index} value={newSection?.id}>
                                    {language == "en"
                                      ? "Section : " + `${index + 1}`
                                      : "Section : " + `${index + 1}`}
                                  </MenuItem>
                                );
                              })}
                          </Select>
                        )}
                        name="sectionId"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.durationType
                          ? errors.durationType.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </div>

                  <div style={{ width: 250 }}>
                    <FormControl
                      style={{ marginTop: 11 }}
                      error={!!errors.capacity}
                    >
                      <TextField
                        disabled
                        sx={{ minWidth: 220 }}
                        id="standard-basic"
                        label={<FormattedLabel id="capacity" />}
                        variant="standard"
                        {...register("capacity")}
                        error={!!errors.capacity}
                        InputLabelProps={{
                          shrink: watch("capacity") ? true : false,
                        }}
                      />
                      <FormHelperText>
                        {errors?.capacity ? errors.capacity.message : null}
                      </FormHelperText>
                    </FormControl>
                  </div>

                  <FormControl
                    // disabled={readOnly}
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
                </div>

                {watch("durationType") != 13 && (
                  <div className={styles.fromDateToDate}>
                    {/* fromDate */}
                    <FormControl
                      style={{ marginLeft: 20, marginTop: 68, width: 220 }}
                      error={!!errors.fromDate}
                    >
                      <Controller
                        control={control}
                        name="fromDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              shouldDisableDate={isDisabledDate}
                              minDate={moment().startOf("month").toDate()}
                              // minDate={new Date()}
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  <FormattedLabel id="fromDate" />
                                  {/* Date(To) */}
                                </span>
                              }
                              value={field.value}
                              onChange={(date) =>
                                field.onChange(
                                  moment(date).format("YYYY-MM-DD")
                                  // moment(date).format("DD-MM-YYYY")
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

                    {/* toDate */}
                    <FormControl
                      style={{ marginLeft: 94, marginTop: 68, width: 220 }}
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
                                  {/* Date(From) */}
                                </span>
                              }
                              value={field.value}
                              onChange={(date) =>
                                field.onChange(
                                  moment(date).format("YYYY-MM-DD")
                                  // moment(date).format("DD-MM-YYYY")
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
                  </div>
                )}
                {watch("durationType") == 13 && (
                  <div className={styles.fromDateToDate}>
                    {/* fromDate */}
                    <FormControl
                      style={{ marginLeft: 20, marginTop: 68, width: 220 }}
                      error={!!errors.date}
                    >
                      <Controller
                        control={control}
                        name="date"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              minDate={new Date()}
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  <FormattedLabel id="date" />
                                  {/* Date(To) */}
                                </span>
                              }
                              value={field.value}
                              onChange={(date) =>
                                field.onChange(
                                  moment(date).format("YYYY-MM-DD")
                                  // moment(date).format("DD-MM-YYYY")
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
                  </div>
                )}

                <FormControl
                  variant="standard"
                  sx={{ marginLeft: 3.8, marginTop: 2, minWidth: 220 }}
                  error={!!errors.duration}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {/* Slot Duration */}
                    {<FormattedLabel id="slotDuration" />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ minWidth: 220 }}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="Gender *"
                      >
                        {durationTime.map((menu, index) => {
                          return (
                            <MenuItem key={index} value={menu.id}>
                              {language == "en" ? menu.time : menu.timeMr}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    )}
                    name="duration"
                    control={control}
                    defaultValue={null}
                  />
                  <FormHelperText>
                    {errors?.duration ? errors.duration.message : null}
                  </FormHelperText>
                </FormControl>

                <div className={styles.row}>
                  <div className={styles.subTitle} style={{ marginTop: 0 }}>
                    <FormattedLabel id="sectionDetails" />
                  </div>

                  <Button
                    variant="contained"
                    endIcon={<Add />}
                    onClick={() => setOpen(true)}
                  >
                    <FormattedLabel id="addSlot" />
                  </Button>
                </div>
                {sections?.length > 0 ? (
                  <div style={{ display: "grid", placeItems: "center" }}>
                    <DataGrid
                      autoHeight
                      sx={{
                        marginTop: "20px",
                        minWidth: "75%",

                        "& .cellColor": {
                          backgroundColor: "#1976d2",
                          color: "white",
                        },
                      }}
                      rows={sections}
                      //@ts-ignore
                      columns={columns}
                      disableSelectionOnClick
                      hideFooter
                    />
                  </div>
                ) : (
                  <h3
                    style={{
                      margin: "20px 0px",
                      textAlign: "center",
                      textTransform: "uppercase",
                      fontWeight: "bold",
                    }}
                  >
                    {/* No Slot added */}
                    <FormattedLabel id="noSlotAdded" />
                  </h3>
                )}

                <div className={styles.bttnGrp}>
                  <Button
                    color="success"
                    variant="contained"
                    endIcon={<Save />}
                    type="submit"
                  >
                    <FormattedLabel id="save" />
                  </Button>
                  <Button
                    color="error"
                    variant="outlined"
                    endIcon={<Clear />}
                    onClick={() => clearData("new")}
                  >
                    <FormattedLabel id="clear" />
                  </Button>
                  <Button
                    color="error"
                    variant="contained"
                    endIcon={<ExitToApp />}
                    onClick={() => {
                      clearData("update");
                      setCollapse(false);
                    }}
                  >
                    <FormattedLabel id="exit" />
                  </Button>
                </div>
              </>
            </form>
          </FormProvider>
        )}

        <Modal open={open}>
          <>
            <h2 className={styles.modalHeader}>Slot Details</h2>
            <form onSubmit={handleSubmit1(addSectionDetails)}>
              <div className={styles.fieldsWrapper}>
                {/* fromTime */}
                <FormControl
                  style={{ marginTop: 40, width: 220 }}
                  error={!!errors1.fromTime}
                >
                  <Controller
                    control={control1}
                    defaultValue={null}
                    name="fromTime"
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <TimePicker
                          ampm={false}
                          openTo="hours"
                          views={["hours", "minutes", "seconds"]}
                          inputFormat="HH:mm:ss"
                          mask="__:__:__"
                          label={<FormattedLabel id="fromBookingTime" />}
                          value={field.value}
                          onChange={(time) => {
                            field.onChange(time);
                          }}
                          renderInput={(params) => (
                            <TextField
                              variant="outlined"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{ width: "100%" }}
                              size="small"
                              {...params}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {errors1?.fromTime ? errors1.fromTime.message : null}
                  </FormHelperText>
                </FormControl>

                {/* toTime */}
                <FormControl
                  style={{ marginTop: 40, width: 220 }}
                  error={!!errors1.toTime}
                >
                  <Controller
                    control={control1}
                    defaultValue={null}
                    name="toTime"
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <TimePicker
                          // disabled
                          ampm={false}
                          openTo="hours"
                          views={["hours", "minutes", "seconds"]}
                          inputFormat="HH:mm:ss"
                          mask="__:__:__"
                          label={<FormattedLabel id="toBookingTime" />}
                          value={field.value}
                          onChange={(time) => {
                            field.onChange(time);
                          }}
                          renderInput={(params) => (
                            <TextField
                              variant="outlined"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{ width: "100%" }}
                              size="small"
                              {...params}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {errors1?.toTime ? errors1.toTime.message : null}
                  </FormHelperText>
                </FormControl>

                {/* <FormControl
                  style={{ marginTop: 11 }}
                  error={!!errors.capacity}
                >
                  <TextField
                    disabled
                    sx={{ minWidth: 220 }}
                    id="standard-basic"
                    label={<FormattedLabel id="capacity" />}
                    variant="standard"
                    {...register("capacitySub")}
                    error={!!errors.capacity}
                    InputLabelProps={{
                      shrink: watch("capacity") ? true : false,
                    }}
                  />
                  <FormHelperText>
                    {errors?.capacity ? errors.capacity.message : null}
                  </FormHelperText>
                </FormControl> */}
              </div>

              <div className={styles.bttnGrp} style={{ marginTop: "25px" }}>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{ height: "max-content" }}
                >
                  {!!watch1("id") ? (
                    <FormattedLabel id="update" />
                  ) : (
                    <FormattedLabel id="add" />
                  )}
                </Button>
                <Button
                  color="error"
                  variant="outlined"
                  onClick={() => {
                    setOpen(false);
                    reset1({
                      capacity: "",
                      facilityName: "",
                      facilityType: "",
                      unit: "",
                    });
                  }}
                >
                  <FormattedLabel id="cancel" />
                </Button>
              </div>
            </form>
          </>
        </Modal>
        <DataGrid
          autoHeight
          sx={{
            marginTop: "20px",
            width: "100%",

            "& .cellColor": {
              backgroundColor: "#1976d2",
              color: "white",
            },
          }}
          rows={table}
          //@ts-ignore
          columns={masterColumns}
          disableSelectionOnClick
          paginationMode="server"
          rowCount={data?.totalRows}
          rowsPerPageOptions={data?.rowsPerPageOptions}
          page={data?.page}
          pageSize={data?.pageSize}
          onPageChange={(pageNo) => {
            getTableData(data?.pageSize, pageNo);
          }}
          onPageSizeChange={(pageSize) => {
            setData({ ...data, pageSize });
            getTableData(pageSize, data?.page);
          }}
        />
      </Paper>
      </>)
}
    </>
  );
};

export default VenueDetails;

const Modal = ({ open, children }) => {
  useEffect(() => {
    document.body.setAttribute(
      "style",
      `overflow: ${open ? "hidden" : "auto"}`
    );
  }, [open]);

  return (
    <div>
      {open && (
        <div className={styles.modalWrapper} style={{ opacity: open ? 1 : 0 }}>
          <div className={styles.modal}>{children}</div>
        </div>
      )}
    </div>
  );
};
