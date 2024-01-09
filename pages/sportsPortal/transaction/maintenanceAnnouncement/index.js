import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Grid,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  ListItemText,
  Select,
  Slide,
  TextField,
  OutlinedInput,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import styles from "../../../../styles/sportsPortalStyles/facilityCheck.module.css";
import URLS from "../../../../URLS/urls";
//import styles from "../../../../styles/sportsPortalStyles/bookingTimeMaster.module.css";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { GridToolbar } from "@mui/x-data-grid";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
// import schema from "../../../../containers/schema/sportsPortalSchema/bookingTimeSchema";
import schema from "../../../../containers/schema/sportsPortalSchema/maintenanceSchema";
import { width } from "@mui/system";

// func
const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    watch,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [disableKadhnariState, setDisableKadhnariState] = useState(true);
  const [disable, setDisable] = useState(true);
  const [sectionId, setSectionId] = useState([]);
  const [personName3, setPersonName3] = useState([]);
  const [temp1, setTemp1] = useState();
  const router = useRouter();
  const [value, setValuee] = useState(null);
  const [valuee, setValueTwo] = useState(null);
  const [type, setType] = useState();
  const [btnSaveText, setBtnSaveText] = useState("save");
  const [slots, setSlots] = useState([]);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState("");
  const [slideChecked, setSlideChecked] = useState(false);
  const [zoneNames, setZoneNames] = useState([]);
  const [dateValue, setDateValue] = useState(null);
  // const [venueNames, setVenueNames] = useState([]);
  const [section, setSection] = useState([]);
  // const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [facilityTypess, setFacilityTypess] = useState([]);
  const [facilityType, setFacilityType] = useState([]);
  const [unit, setUnit] = useState([]);
  const [facilityName, setFacilityName] = useState([]);
  const [facilityNameAll, setFacilityNameAll] = useState([]);
  const [newSection, setNewSection] = useState([]);

  // const [facilityNames, setFacilityNames] = useState([]);
  const [selectedFacilityType, setSelectedFacilityType] = useState();
  const [venues, setVenues] = useState([]);
  const [filteredVenue, setFilteredVenue] = useState([]);
  const [selectedFacilityName, setSelectedFacilityName] = useState();
  const [venueField, setVenueField] = useState(true);
  const [typeName, setTypeName] = useState([]);

  // EditSelectedRow
  const [editSelectedRow, setEditSelectedRow] = useState({});

  const language = useSelector((state) => state.labels.language);

  const [selectedTime, setSelectedTime] = useState(null);

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

  const handleTimeChange = (newTime) => {
    setSelectedTime(newTime);
  };

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // getFacility Type
  const getFacilityTypes = () => {
    axios.get(`${URLS.SPURL}/facilityType/getAll`).then((r) => {
      console.log("facility types are:", r.data.facilityType);
      // setFacilityTypess(r.data.facilityType);
      setFacilityTypess(
        r.data.facilityType.map((row) => ({
          id: row.id,
          facilityType: row.facilityType,
          facilityTypeMr: row.facilityTypeMr,
        }))
      );
    });
  };

  // getWard
  const [getward, setWard] = useState([]);

  const getWardNames = () => {
    axios.get(`${URLS.CFCURL}/master/ward/getAll`).then((r) => {
      setWard(
        r.data.ward.map((row) => ({
          id: row.id,
          wardName: row.wardName,
          wardNameMr: row.wardNameMr,
        }))
      );
    });
  };

  //   Get Unit
  const getUnit = () => {
    // axios.get(`${URLS.CFCURL}/master/zone/getAll`)
    axios.get(`${URLS.SPURL}/unit/getAll`).then((r) => {
      //   console.log(r.data.unit);
      setUnit(
        r.data.unit.map((row) => ({
          id: row.id,
          unit: row.unit,
          unitMr: row.unitMr,
        }))
      );
    });
  };

  const getAllTypes = () => {
    axios.get(`${URLS.CFCURL}/master/zone/getAll`).then((r) => {
      setSectionId(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneName: row.zoneName,
          zoneNameMr: row.zoneNameMr,
        }))
      );
    });
  };

  // getVenue -- Facility Type -- Facility Type
  const getVenue = () => {
    axios.get(`${URLS.SPURL}/venueMasterSection/getAll`).then((r) => {
      console.log("11", r);
      setVenues(
        r.data.venueSection.map((row) => ({
          id: row.id,
          venue: row.venue,
          venueMr: row.venueMr,
        }))
      );
    });
  };
  const getFilteredVenue = () => {
    let facilityName = getValues("facilityName");
    // axios.get(`${URLS.SPURL}/venueMasterSection/getAll`).then((r) => {
    axios
      .get(
        `${URLS.SPURL}/venueMasterSection/getVenueByFacilityName?facilityName=${facilityName}`
      )
      .then((r) => {
        console.log("filteredVenue", r);
        setFilteredVenue(
          r?.data?.venueSection?.map((row) => ({
            id: row.id,
            venue: row.venue,
            venueMr: row.venueMr,
          }))
        );
      });
  };

  const capacity = (value) => {
    setValue("capacity", newSection.find((obj) => obj.id == value)?.capacity);
    // setValue("unitId", newSection.find((obj) => obj.id == value)?.unit);
    // setValue("unit", newSection.find((obj) => obj.id == value)?.unit);
  };

  const handleChange3 = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName3(typeof value === "string" ? value.split(",") : value);
  };

  const getZoneWardID = () => {
    let venue = watch("venueSectionId");

    if (venue != null && venue != undefined && venue != "") {
      axios
        .get(`${URLS.SPURL}/venueMasterSection/getZoneAndWardById?id=${venue}`)
        .then((res) => {
          let tempp = res.data.venueSection.map((row) => ({
            id: row.id,
            zoneName: sectionId?.find((obj) => obj?.id === row.zoneName)?.id,
            wardName: getward?.find((obj) => obj?.id === row.wardName)?.id,
          }));
          setValue("zoneName", tempp[0].zoneName);
          setValue("wardName", tempp[0].wardName);

          console.log("2222", tempp, tempp[0].zoneName);
        });
    }
  };

  const getTypeNameKeys = () => {
    let venueSectionId = getValues("venueSectionId");
    console.log("11", venueSectionId);
    axios
      .get(
        `${URLS.SPURL}/facilityType/getFacilityTypeByVenueId?venueId=${venueSectionId}`
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
      });
    // }
  };

  const getFacilityNameAll = () => {
    axios.get(`${URLS.SPURL}/facilityName/getAll`).then((r) => {
      console.log("99", r);
      setFacilityNameAll(r?.data?.facilityName);
    });
    // }
  };

  // wardKeys
  const [wardNames, setWardNames] = useState([]);

  const getSlots = (value) => {
    // facilityType: getValues("facilityType"),
    let facilityName = getValues("facilityName");
    let venue = getValues("venue");
    let fromDate = getValues("fromDate");
    let toDate = getValues("toDate");
    // toDate: moment(getValues("fromDate")).add(4, 'M').format('DD-MM-YYYY'),
    // console.log("DATA77", body);

    axios
      .get(
        `${URLS.SPURL}/bookingTime/getFromBookingTimeAndToBookingTimeByVenueAndFromDateAndToDateAndFacilityName?facilityName=${facilityName}&venue=${venue}&fromDate=${fromDate}&toDate=${toDate}`
      )
      .then((res) => {
        console.log("tfgh", res);
        let temp = res.data.map((row) => ({
          id: row?.id,
          // fromBookingTime:row.fromBookingTime,
          slot: row?.fromBookingTime + "-" + row?.toBookingTime,
          transactionIds: row?.transactionIds,
          serviceId: row?.serviceId,
          bookingTimeId: row?.bookingTimeId,
        }));

        setSlots(temp);
        console.log("temp21", temp);
        // setSlotss(res.data)
        // setSlotss(temp)
        // console.log("76",fireStation)
        // console.log("res.message", temp);
      });

    // setBookingType(value);
    // console.log("props.bookingType", value);
    // props.bookingType(value);
  };

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getZoneWardID();
    getTypeNameKeys();
    // getData();
    getAllTypes();
    getWardNames();
    getFacilityTypes();
    getFacilityNameAll();
    getVenue();
    getUnit();
  }, []);
  useEffect(() => {
    getFilteredVenue();
  }, [watch("facilityName")]);

  useEffect(() => {
    // if (!watch("verification")) {
    if (router.query.pageMode === "Add") {
      if (watch("durationType") == 13 || watch("durationType") == 8) {
        // alert("Day Selected");
        setValue("toDate", getValues("fromDate"));
        getSlots();
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
          getSlots();
        }
      }
    }
  }, [watch("durationType"), watch("fromDate")]);

  useEffect(() => {
    getData();
  }, [sectionId, fetchData]);
  useEffect(() => {
    console.log("ghvv", personName3);
  }, [personName3]);
  useEffect(() => {
    getMaintains();
    console.log("calles");
  }, [watch("toDate")]);

  useEffect(() => {
    getZoneWardID();
    getTypeNameKeys();
  }, [watch("venueSectionId")]);

  const getFacilityName = () => {
    let venue = getValues("venueSectionId");
    let facilityType = getValues("facilityType");
    console.log("11", venue);
    axios
      .get(
        // `${URLS.SPURL}/facilityName/getFacilityNamesByVenueAndFacilityType?venue=${venue}&facilityType=${facilityType}`
        `${URLS.SPURL}/facilityName/getSubTypeByFacility?facilityType=${facilityType}`
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
      });
    // }
  };

  const getSectionByFacilityName = () => {
    let venue = getValues("venueSectionId");
    let facilityType = getValues("facilityType");
    let facilityName = getValues("facilityName");

    axios
      .get(
        `${URLS.SPURL}/facilityName/getFacilityNamesByVenueAndFacilityTypeAndFacilityName?venue=${venue}&facilityType=${facilityType}&facilityName=${facilityName}`
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
      });
    // }
  };

  //Delete by ID(SweetAlert)
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios.post(`${URLS.SPURL}/bookingTime/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getData();
              // setButtonInputState(false);
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    } else {
      swal({
        title: "Activate?",
        text: "Are you sure you want to activate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios.post(`${URLS.SPURL}/bookingTime/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getData();
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };
  // Get Table - Data
  const getMaintains = () => {
    let _maintainsBody = {
      // ...fromData,
      venue: watch("venueSectionId"),
      facilityType: watch("facilityType"),
      facilityName: watch("facilityName"),
      fromDate: watch("fromDate"),
      toDate: watch("toDate"),
    };

    console.log("_maintainsBody", _maintainsBody);
    axios
      .post(
        `${URLS.SPURL}/maintenanceAnnouncement/checkMaintainace`,
        _maintainsBody
      )
      .then((r) => {
        console.log("Check Maintainace responce", r);

        let temp = r?.data?.maintenanceCheck?.map((row, i) => ({
          // id: row.id,
          id: i + 1,
          // fromBookingTime:row.fromBookingTime,
          slot: row.fromBookingTime + "-" + row.toBookingTime,
          transactionIds: row?.transactionIdList.join(),
          serviceId: row?.serviceId,
          bookingTimeId: row?.bookingTimeId,
          status: row?.status,
          maintainanceDate: row?.maintainanceDate,
          maintainanceRemark: row?.maintainanceRemark,
        }));

        setSlots(temp);
      });
  };
  // Get Table - Data
  const getData = (_pageSize = 10, _pageNo = 0, _sortDir = "desc") => {
    axios
      .get(`${URLS.SPURL}/maintenanceAnnouncement/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortDir: _sortDir,
        },
      })
      .then((r) => {
        console.log("get response", r);
        let result = r.data.maintenanceAnnouncement;
        let _res = result.map((r, i) => {
          console.log("44", result);
          return {
            ...r,
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1,
            toDate: r.toDate,
            date: r.date,
            fromDate: r.fromDate,
            capacity: r.capacity,
            status: r.status,
            zoneName: sectionId?.find((obj) => obj?.id === r.zoneName)
              ?.zoneName,
            zoneNameMr: sectionId?.find((obj) => obj?.id === r.zoneNameMr)
              ?.zoneNameMr,

            wardName: getward?.find((obj) => obj?.id === r.wardName)?.wardName,
            wardNameMr: getward?.find((obj) => obj?.id === r.wardNameMr)
              ?.wardNameMr,

            facilityType: facilityTypess?.find(
              (obj) => obj?.id === r.facilityTypeId
            )?.facilityType,
            facilityTypeMr: facilityTypess?.find(
              (obj) => obj?.id === r.facilityTypeId
            )?.facilityTypeMr,

            facilityName: facilityNameAll?.find(
              (obj) => obj?.id === r.facilitySubTypeId
            )?.facilityName,
            facilityNameMr: facilityNameAll?.find(
              (obj) => obj?.id === r.facilitySubTypeId
            )?.facilityNameMr,

            venueTxt: venues?.find((obj) => obj?.id === r.venueSectionId)
              ?.venue,
            venueMr: venues?.find((obj) => obj?.id === r.venueSectionId)
              ?.venueMr,

            fromBookingTime: moment(r.fromBookingTime, "HH:mm:ss ").format(
              "HH:mm:ss"
            ),

            toBookingTime: moment(r.toBookingTime, "HH:mm:ss ").format(
              "HH:mm:ss"
            ),
            maintainanceDate: r?.maintainanceDate,
            maintainanceRemark: r?.maintainanceRemark,
            // status: r.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });
        setDataSource([..._res]);
        console.log("formated response", _res);
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      });
  };

  useEffect(() => {
    console.log("JaagaYetaytKa: ", slots);
  }, [slots]);

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    const bodyForAPI = personName3
      .map((j) => slots?.find((obj) => obj.id == j))
      .map((j) => ({
        transactionIds: j?.transactionIds,
        // transactionIds: j?.transactionIdList.join(),
        serviceId: j?.serviceId,
        bookingTimeIdList: [j?.bookingTimeId],
        maintainanceDate: watch("maintainanceDate"),
        maintainanceRemark: watch("maintenanceRemark"),
        // status: "send",
      }));

    console.log("FinalDataBhava:", bodyForAPI);
    console.log("FinalDataBhavaa:", bodyForAPI.bookingTimeIdList);

    const tempData = axios;
    axios

      .post(
        `${URLS.SPURL}/maintenanceAnnouncement/maintenanceMailSaveAsDraft`,
        bodyForAPI
        // {
        //   headers: {
        //     status: "send",
        //   },
        // }
      )
      // .post(
      //   `${URLS.SPURL}/maintenanceAnnouncement/getInfoByInputs`,
      //   bodyForAPI,
      //   {
      //     headers: {
      //       status: "send",
      //     },
      //   }
      // )
      .then((res) => {
        if (res.status == 200) {
          console.log("Zala Mail send", res);
          sweetAlert("Send Mail successfully !", "success");
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setFetchData(tempData);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      });
  };

  //Draft

  // const onSubmitFormDraft = (formData) => {
  //   console.log("Click on Draft :");
  //   const bodyForAPI = personName3
  //     .map((j) => slots?.find((obj) => obj.id == j))
  //     .map((j) => ({
  //       // transactionIds: j?.transactionIds,
  //       transactionIds: j?.transactionIds.join(),
  //       serviceId: j?.serviceId,
  //       bookingTimeIdList: [j?.bookingTimeId],
  //       // bookingTimeIdList: [j?.bookingTimeId],
  //       maintainanceDate: watch("maintainanceDate"),
  //       maintainanceRemark: watch("maintenanceRemark"),
  //       // status: "draft",
  //     }));

  //   console.log("FinalDataBhava:", bodyForAPI);
  //   console.log("FinalDataBhavaa:", bodyForAPI.bookingTimeIdList);

  //   const tempData = axios;
  //   axios
  //     .post(
  //       `${URLS.SPURL}/maintenanceAnnouncement/getInfoByInputs`,
  //       bodyForAPI,
  //       {
  //         headers: {
  //           status: "draft",
  //         },
  //       }
  //     )
  //     .then((res) => {
  //       if (res.status == 200) {
  //         console.log("Zala Mail send", res);
  //         sweetAlert("Draft Mail successfully !", "success");
  //         setButtonInputState(false);
  //         setIsOpenCollapse(false);
  //         setFetchData(tempData);
  //         setEditButtonInputState(false);
  //         setDeleteButtonState(false);
  //       }
  //     });
  // };

  const onSubmitFormDraftNew = (formData) => {
    console.log("Click on Draft :", formData);
    // const bodyForAPI = personName3
    //   .map((j) => slots?.find((obj) => obj.id == j))
    //   .map((j) => ({
    //     // transactionIds: j?.transactionIds,
    //     transactionIds: j?.transactionIds.join(),
    //     serviceId: j?.serviceId,
    //     bookingTimeIdList: [j?.bookingTimeId],
    //     // bookingTimeIdList: [j?.bookingTimeId],
    //     maintainanceDate: watch("maintainanceDate"),
    //     maintainanceRemark: watch("maintenanceRemark"),
    //     // status: "draft",
    //   }));

    let bodyForAPI = [
      {
        // ...formData,
        // maintainanceDate: watch("maintainanceDate"),
        id: formData?.id,
        maintainanceDate: formData?.maintainanceDate,
        maintainanceRemark: formData?.maintainanceRemark,
        transactionIds: formData?.transactionIds,
        serviceId: formData?.serviceId,
        status: "send",
        bookingTimeIdList: JSON.parse(formData?.bookingTimeIdList),
      },
    ];
    console.log("KayBawaal: ", JSON.parse(formData?.bookingTimeIdList));
    console.log("new Data:", bodyForAPI);

    const tempData = axios;
    axios
      .post(`${URLS.SPURL}/maintenanceAnnouncement/draftToSendMail`, bodyForAPI)
      // .post(
      //   `${URLS.SPURL}/maintenanceAnnouncement/getInfoByInputs`,
      //   bodyForAPI,
      //   {
      //     headers: {
      //       status: "send",
      //     },
      //   }
      // )
      .then((res) => {
        if (res.status == 200) {
          console.log("Zala Mail send", res);
          sweetAlert("Send Mail successfully !", "success");
          setButtonInputState(false);
          setIsOpenCollapse(false);
          // setFetchData(tempData);
          setEditButtonInputState(false);

          setDeleteButtonState(false);
          getData();
        }
      });
  };

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setIsOpenCollapse(false);
    setDeleteButtonState(false);
    setEditButtonInputState(false);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    zoneName: "",
    wardName: "",
    department: "",
    facilityType: "",
    facilityName: "",
    venueName: "",
    toDate: null,
    fromDate: null,
    fromBookingTime: null,
    toBookingTime: null,
    capacity: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    zoneName: "",
    wardName: "",
    department: "",
    facilityType: "",
    facilityName: "",
    venueName: "",
    toDate: null,
    fromDate: null,
    fromBookingTime: null,
    toBookingTime: null,
    capacity: "",
    // fromDate: "",
    // toDate: "",
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      // flex: 1,
      width: 100,
      // padding: "2%",
    },

    {
      // field: "venueNameTxt",
      field: language === "en" ? "venueTxt" : "venueMr",
      headerName: <FormattedLabel id="venue" />,
      //type: "number",
      width: 190,

      // flex: 1,
    },

    {
      // field: "facilityType",
      field: language === "en" ? "facilityType" : "facilityTypeMr",
      headerName: <FormattedLabel id="facilityType" />,
      width: 180,
      //type: "number",
      // flex: 1,
    },
    {
      // field: "facilityName",
      field: language === "en" ? "facilityName" : "facilityNameMr",
      headerName: <FormattedLabel id="facilityName" />,
      width: 120,
      //type: "number",
      // flex: 1,
    },

    // {
    //   // field: language === "en" ? "wardName" : "wardNameMr",
    //   headerName: "Date",
    //   flex: 1,
    // },
    {
      field: "fromBookingTime",
      // field: language === "en" ? "wardName" : "wardNameMr",
      headerName: <FormattedLabel id="fromBookingTime" />,
      width: 120,
      //type: "number",
      // flex: 1,
    },

    {
      field: "toBookingTime",
      // width: 500,
      width: 120,

      // field: language === "en" ? "wardName" : "wardNameMr",
      headerName: <FormattedLabel id="toBookingTime" />,
      //type: "number",
      // flex: 1,
    },
    // {
    //   field: "status",
    //   // headerName: <FormattedLabel id="applicationStatus" />,
    //   headerName: "Status",
    //   width: 150,
    //   // flex: 1,
    // },

    {
      field: "maintainanceDate",
      // headerName: <FormattedLabel id="applicationStatus" />,
      headerName: <FormattedLabel id="maintainanceDate" />,
      // headerName: "Maintainance Date",
      width: 150,
      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),

      // flex: 1,
    },
    {
      field: "maintainanceRemark",
      headerName: <FormattedLabel id="maintainanceRemark" />,
      // headerName: "Maintainance Remark",
      width: 250,
      // flex: 1,
    },
    // {
    //   field: "transactionIds",
    //   // headerName: <FormattedLabel id="applicationStatus" />,
    //   headerName: "Users Id's",
    //   width: 150,
    //   // flex: 1,
    // },

    // {
    //   field: "actions",
    //   headerName: <FormattedLabel id="actions" />,
    //   width: 270,
    //   sortable: false,
    //   disableColumnMenu: true,
    //   renderCell: (params) => {
    //     console.log("sdgvgadv", params);
    //     return (
    //       // <Box>
    //       // <>
    //       //   <Button>Draft</Button>
    //       //   <Button>Send</Button>
    //       // </>

    //       <>
    //         {params?.row?.status === "draft" && (
    //           <IconButton>
    //             <Button
    //               variant="contained"
    //               // endIcon={<DoneAllIcon />}  onSubmitFormDraft()
    //               size="small"
    //               onClick={() => {
    //                 console.log("Data ID:", params?.row?.id);
    //                 onSubmitFormDraftNew(params?.row);
    //               }}
    //             >
    //               Send
    //             </Button>
    //           </IconButton>
    //         )}
    //       </>
    //     );
    //   },
    // },
  ];

  // View
  return (
    <>
      <Box>
        <BreadcrumbComponent />
      </Box>
      <Paper
        sx={{
          marginLeft: 5,
          marginRight: 5,
          // marginTop: 1,
          marginBottom: 5,
          padding: 1,
        }}
      >
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
          <strong>{<FormattedLabel id="maintenanceAnnouncement" />}</strong>
        </div>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <>
                    {" "}
                    <Grid
                      container
                      sx={{
                        marginLeft: 5,
                        marginTop: 1,
                        marginBottom: 5,
                        align: "center",
                      }}
                    >
                      {/* facilityType */}
                      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <FormControl
                          variant="standard"
                          // sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.facilityType}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="facilityType" required />
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
                                {/* {section &&
                                  section.map((section, index) => {
                                    return (
                                      <MenuItem key={index} value={section?.id}>
                                        {language == "en"
                                          ? section.facilityType
                                          : // ? "Section : " + section.capacity
                                            "Section : " + section.capacity}
                                      </MenuItem>
                                    );
                                  })} */}
                                {facilityTypess &&
                                  facilityTypess.map((facilityType, index) => {
                                    return (
                                      <MenuItem
                                        key={index}
                                        value={facilityType?.id}
                                      >
                                        {language == "en"
                                          ? facilityType.facilityType
                                          : // ? "Section : " + section.capacity
                                            "Section : " + section.capacity}
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
                      </Grid>

                      {/* facilityName */}
                      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <FormControl
                          variant="standard"
                          sx={{ minWidth: 120 }}
                          error={!!errors.facilityName}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="facilityName" required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: 220 }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                // onChange={(value) => field.onChange(value)
                                // }
                                onChange={(value) => {
                                  field.onChange(value),
                                    getSectionByFacilityName();
                                  console.log(
                                    "facilityName: ",
                                    value.target.value
                                  );
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
                                          : // ? "Section : " + section.capacity
                                            "Section : " + section.capacity}
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
                      </Grid>
                      {/* venue */}
                      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <FormControl
                          variant="standard"
                          error={!!errors.venueSectionId}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="venue" required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: 220 }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                // onChange={(value) => {
                                //   field.onChange(value);
                                //   console.log("897898", value);
                                //   getZoneWardID();
                                // }}
                                onChange={(value) => {
                                  field.onChange(value), getZoneWardID();
                                  getTypeNameKeys();
                                }}
                                label="venue"
                              >
                                {/* {venues &&
                                  venues
                                    .map((venue, index) => (
                                      <MenuItem key={index} value={venue.id}>
                                        {language == "en" ? venue?.venue : venue?.venueMr}
                                      </MenuItem>
                                    ))} */}
                                {filteredVenue &&
                                  filteredVenue.map((venue, index) => (
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
                            {errors?.venueSectionId
                              ? errors.venueSectionId.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <FormControl
                          // disabled={readOnly}
                          variant="standard"
                          // sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.zoneName}
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
                            {errors?.zoneName ? errors.zoneName.message : null}
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

                      {/* Sections */}
                      {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <FormControl
                          variant="standard"
                          sx={{ marginTop: 3, minWidth: 120 }}
                          error={!!errors.durationType}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Sections
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
                                      <MenuItem
                                        key={index}
                                        value={newSection?.id}
                                      >
                                        {language == "en"
                                          ? "Section : " + `${index + 1}`
                                          : "Section : " + section.capacity}
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
                      </Grid> */}

                      {/* fromDate */}
                      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <FormControl
                          style={{ marginTop: 40, width: 220 }}
                          error={!!errors.fromDate}
                        >
                          <Controller
                            control={control}
                            name="fromDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  // minDate={new Date()}
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      <FormattedLabel id="fromDate" required />
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
                      </Grid>

                      {/* toDate */}
                      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <FormControl
                          style={{ marginTop: 40, width: 220 }}
                          error={!!errors.toDate}
                        >
                          <Controller
                            control={control}
                            name="toDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  // minDate={new Date()}
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      <FormattedLabel id="toDate" required />
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
                      </Grid>

                      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        {/* Select Multiple Slots */}
                        {/* <FormControl
                          // disabled={readOnly}
                          // variant="standard"
                          error={!!errors.selectSlots}
                          size="small"
                          sx={{
                            m: 1,
                            width: 250,
                            marginTop: 5,
                            backgroundColor: "white",
                          }}
                        >
                          <InputLabel id="demo-multiple-chip-label">
                            <FormattedLabel id="selectMultipleSlots" required />
                          </InputLabel>
                          <Select
                            label="Slots"
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            multiple
                            value={personName3}
                            name="bookingIds"
                            // onChange={handleChange3}
                            onChange={(value) => {
                              // handleChange3;
                              let debhava = [...value.target.value];
                              setPersonName3(debhava);
                              // let finalValue = debhava.map((o) => o.split(","));
                              // setValue("finalValue", finalValue.toString());
                              console.log("bbb", personName3);
                              console.log("1234", watch("finalValue"));
                            }}
                            input={
                              <OutlinedInput
                                id="select-multiple-chip"
                                label="Slots"
                              />
                            }
                            renderValue={(selected) => (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                }}
                              >
                                {selected.map((value) => (
                                  <Chip
                                    sx={{ backgroundColor: "#AFDBEE" }}
                                    key={value}
                                    // label={value}
                                    label={
                                      slots?.find(
                                        (obj) =>
                                          obj?.commaSeparatedIds === value
                                      )?.slot
                                    }
                                    // label = {slots.find((rr)=>rr== slots.slot)}
                                  />
                                ))}
                              </Box>
                            )}
                            MenuProps={MenuProps}
                          >
                            {slots?.map((slot, index) => (
                              <MenuItem
                                // key={name}
                                // value={name}
                                key={index}
                                value={
                                  // slot.commaSeparatedIds
                                  slot
                                  // user.fireStationName
                                  // language === "en"
                                  //   ? crew.crewName
                                  //   : crew.crewNameMr
                                }
                                // style={getStyles(user, personName3, theme)}
                              >
                                <Checkbox
                                  // checked={personName3.indexOf(slot.slot) > -1}
                                  checked={
                                    personName3?.find(
                                      (obj) => obj == slot.commaSeparatedIds
                                    )
                                      ? true
                                      : false
                                  }
                                />
                                <ListItemText primary={slot.slot} />
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>
                            {errors?.selectSlots
                              ? errors.selectSlots.message
                              : null}
                          </FormHelperText>
                        </FormControl> */}
                        <FormControl
                          variant="standard"
                          sx={{ marginTop: 3.5, minWidth: 120 }}
                          error={!!errors.selectSlots}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel
                              id="selectSlotsForSendMail"
                              required
                            />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: "220px" }}
                                multiple
                                value={personName3 ?? []}
                                renderValue={(val) =>
                                  val
                                    .map(
                                      (j) =>
                                        slots?.find((obj) => obj.id == j)?.slot
                                    )
                                    .join(",")
                                }
                                onChange={(value) =>
                                  setPersonName3(value.target.value)
                                }
                                label="selectSlots"
                              >
                                {slots?.map((obj) => (
                                  <MenuItem key={obj.id} value={obj.id}>
                                    <Checkbox
                                      checked={personName3?.includes(obj.id)}
                                    />
                                    <ListItemText primary={obj.slot} />
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                            name="selectSlots"
                            control={control}
                            defaultValue={[]}
                          />
                          <FormHelperText>
                            {errors?.selectSlots
                              ? errors.selectSlots.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}></Grid> */}

                      {/* fromDate */}
                      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <FormControl
                          style={{ marginTop: 40, width: 220 }}
                          error={!!errors.maintainanceDate}
                        >
                          <Controller
                            control={control}
                            name="maintainanceDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  // minDate={new Date()}
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      <FormattedLabel
                                        id="maintainanceDate"
                                        required
                                      />
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
                            {errors?.maintainanceDate
                              ? errors.maintainanceDate.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <FormControl
                          // variant="standard"
                          sx={{ marginTop: 5, width: 520 }}
                          error={!!errors.maintenanceRemark}
                        >
                          <TextField
                            // disabled={readOnly}
                            InputLabelProps={{ shrink: true }}
                            id="standard-basic"
                            label={<FormattedLabel id="remark" required />}
                            {...register("maintenanceRemark")}
                            error={!!errors.maintenanceRemark}
                            helperText={
                              errors?.maintenanceRemark
                                ? errors.maintenanceRemark.message
                                : null
                            }
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </>

                  <div className={styles.btn}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="success"
                      endIcon={<SaveIcon />}
                    >
                      {btnSaveText == "Save" ? (
                        <FormattedLabel id="send" />
                      ) : (
                        <FormattedLabel id="update" />
                      )}
                    </Button>
                    {/* <Button
                      // type="submit"
                      variant="outlined"
                      color="success"
                      endIcon={<SaveIcon />}
                      // onClick={() => onSubmitFormDraft()}
                      onClick={() => onSubmitForm()}
                    >
                      Draft
                    </Button> */}
                    <Button
                      sx={{ marginRight: 8 }}
                      variant="contained"
                      color="primary"
                      endIcon={<ClearIcon />}
                      onClick={() => cancellButton()}
                    >
                      <FormattedLabel id="clear" />
                    </Button>
                    <Button
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
            </div>
          </Slide>
        )}
        <div className={styles.addbtn}>
          <Button
            variant="contained"
            // endIcon={<AddIcon />}
            type="primary"
            disabled={buttonInputState}
            onClick={() => {
              reset({
                ...resetValuesExit,
              });
              setEditButtonInputState(true);
              setDeleteButtonState(true);
              setBtnSaveText("Save");
              setButtonInputState(true);
              setSlideChecked(true);
              setIsOpenCollapse(!isOpenCollapse);
            }}
          >
            <FormattedLabel id="selectSlots" />
            {/* Select Slot */}
          </Button>
        </div>

        <DataGrid
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
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
          density="compact"
          pagination
          paginationMode="server"
          rowCount={data.totalRows}
          rowsPerPageOptions={data.rowsPerPageOptions}
          page={data.page}
          pageSize={data.pageSize}
          rows={data.rows}
          columns={columns}
          onPageChange={(_data) => {
            console.log("222", data.pageSize, _data);
            getData(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            getData(data.pageSize, _data);
          }}
        />
      </Paper>
    </>
  );
};

export default Index;
