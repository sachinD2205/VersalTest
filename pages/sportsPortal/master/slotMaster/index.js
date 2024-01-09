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
  Grid,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
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
import { width } from "@mui/system";
import { catchExceptionHandlingMethod } from "../../../../util/util";

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
    // resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [disableKadhnariState, setDisableKadhnariState] = useState(true);
  const [disable, setDisable] = useState(true);
  const [sectionId, setSectionId] = useState([]);
  const [temp1, setTemp1] = useState();
  const router = useRouter();
  const [value, setValuee] = useState(null);
  const [valuee, setValueTwo] = useState(null);
  const [type, setType] = useState();
  const [btnSaveText, setBtnSaveText] = useState("save");
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
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
  const [selectedFacilityName, setSelectedFacilityName] = useState();
  const [venueField, setVenueField] = useState(true);
  const [typeName, setTypeName] = useState([]);

  // EditSelectedRow
  const [editSelectedRow, setEditSelectedRow] = useState({});

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const [selectedTime, setSelectedTime] = useState(null);

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

  // getFacility Type
  const getFacilityTypes = () => {
    axios
      .get(`${URLS.SPURL}/facilityType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("facility types are:", r.data.facilityType);
        // setFacilityTypess(r.data.facilityType);
        setFacilityTypess(
          r.data.facilityType.map((row) => ({
            id: row.id,
            facilityType: row.facilityType,
            facilityTypeMr: row.facilityTypeMr,
          })),
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
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  //   Get Unit
  const getUnit = () => {
    // axios.get(`${URLS.CFCURL}/master/zone/getAll`)
    axios
      .get(`${URLS.SPURL}/unit/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        //   console.log(r.data.unit);
        setUnit(
          r.data.unit.map((row) => ({
            id: row.id,
            unit: row.unit,
            unitMr: row.unitMr,
          })),
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
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
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
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const capacity = (value) => {
    setValue("capacity", newSection.find((obj) => obj.id == value)?.capacity);
    // setValue("unitId", newSection.find((obj) => obj.id == value)?.unit);
    // setValue("unit", newSection.find((obj) => obj.id == value)?.unit);
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
          },
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

  const getTypeNameKeys = () => {
    let venueSectionId = getValues("venueSectionId");
    console.log("11", venueSectionId);
    axios
      .get(
        `${URLS.SPURL}/facilityType/getFacilityTypeByVenueId?venueId=${venueSectionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((r) => {
        console.log("From Venue Id :", r);

        setFacilityType(
          r.data.map((row) => ({
            index: row.index,
            id: row.id,
            facilityType: row.facilityType,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    // }
  };

  const getFacilityNameAll = () => {
    axios
      .get(`${URLS.SPURL}/facilityName/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("99", r);
        setFacilityNameAll(r?.data?.facilityName);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    // }
  };

  // wardKeys
  const [wardNames, setWardNames] = useState([]);

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
    getData();
  }, [sectionId, fetchData]);

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
        `${URLS.SPURL}/facilityName/getFacilityNamesByVenueAndFacilityType?venue=${venue}&facilityType=${facilityType}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((r) => {
        console.log("from facility type : ", r);
        setFacilityName(
          r.data.map((row) => ({
            index: row.index,
            id: row.id,
            facilityName: row.facilityName,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    // }
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
        },
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
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    // }
  };

  // Get Data By ID
  // const getDataById = (value) => {
  //   console.log("clicked");
  //   setIsOpenCollapse(false);
  //   setID(value);
  //   const tempData = axios
  //     .get(`${urls.BaseURL}/facilityMaster/getFacilityMasterData/?id=${value}`)
  //     .then((res) => {
  //       console.log(res.data);
  //       reset(res.data);
  //       setButtonInputState(true);
  //       setIsOpenCollapse(true);
  //       setBtnSaveText("Edit");
  //     });
  // };

  // Delete By ID
  // const deleteById = async (value) => {
  //   await axios

  //     .delete(`${urls.BaseURL}/bookingMaster/discardBookingMaster/${value}`)
  //     .then((res) => {
  //       if (res.status == 226) {
  //         message.success("Record Deleted !!!");
  //         getAllDetails();
  //         setButtonInputState(false);
  //       }
  //     });
  // };

  //Delete By ID(SweetAlert)

  // const deleteById = (value) => {
  //   swal({
  //     title: "Delete?",
  //     text: "Are you sure you want to delete this Record ? ",
  //     icon: "warning",
  //     buttons: true,
  //     dangerMode: true,
  //   }).then((willDelete) => {
  //     if (willDelete) {
  //       axios
  //         .delete(
  //           `${URLS.SPURL}/bookingMaster/getAll/discardBookingMaster/${value}`
  //         )
  //         .then((res) => {
  //           if (res.status == 226) {
  //             swal("Record is Successfully Deleted!", {
  //               icon: "success",
  //             });
  //             setButtonInputState(false);
  //             getAllDetails();
  //           }
  //         });
  //     } else {
  //       swal("Record is Safe");
  //     }
  //   });
  // };

  // OnSubmit Form
  // const onSubmitForm = (fromData) => {
  //   // const date = moment(fromData.Date.d, "YYYY-MM-DD").format("YYYY-MM-DD");
  //   let fromBookingTime;
  //   let toBookingTime;
  //   if (moment(value).format("HH") >= 12) {
  //     fromBookingTime = moment(value).format("HH:mm:SS");
  //   } else {
  //     fromBookingTime = moment(value).format("HH:mm:SS");
  //   }

  //   if (moment(valuee).format("HH") >= 12) {
  //     toBookingTime = moment(valuee).format("HH:mm:SS");
  //   } else {
  //     toBookingTime = moment(valuee).format("HH:mm:SS");
  //   }

  //   // const fromBookingTime = moment(value).format("HH:mm") + ":00";
  //   // const toBookingTime = moment(valuee).format("HH:mm") + ":00";

  //   console.log("From", fromBookingTime);
  //   console.log("To", toBookingTime);

  //   // const toBookingTime = moment(fromData.toBookingTime).format(
  //   //   "YYYY-MM-DD HH:mm:ss"
  //   // );

  //   // console.log("To", valuee.getTime());
  //   // console.log("date kuthli ahe re: ", date);

  //   const finalBodyForApi = {
  //     ...fromData,
  //     fromBookingTime,
  //     toBookingTime,
  //   };

  //   console.log("DATA: ", finalBodyForApi);

  //   if (btnSaveText === "Save") {
  //     console.log("Post -----");
  //     const tempData = axios
  //       .post(
  //         `${urls.BaseURL}/bookingMaster/getAll/saveBookingMaster`,
  //         finalBodyForApi
  //       )
  //       .then((res) => {
  //         if (res.status == 200) {
  //           // message.success("Data Saved !!!");
  //           sweetAlert("Saved!", "Record Saved successfully !", "success");

  //           setButtonInputState(false);
  //           setIsOpenCollapse(false);
  //           setFetchData(tempData);
  //           setEditButtonInputState(false);
  //           setDeleteButtonState(false);
  //         }
  //       });
  //   }
  //   // Update Data Based On ID
  //   else if (btnSaveText === "Edit") {
  //     console.log("Put -----");
  //     const tempData = axios
  //       .post(
  //         `${urls.BaseURL}/bookingMaster/getAll/saveBookingMaster/?id=${id}`,

  //         fromData
  //       )
  //       .then((res) => {
  //         if (res.status == 200) {
  //           // message.success("Data Updated !!!");
  //           sweetAlert("Updated!", "Record Updated successfully !", "success");

  //           setButtonInputState(false);
  //           setIsOpenCollapse(false);
  //           setFetchData(tempData);
  //         }
  //       });
  //   }
  // };

  //Delete by ID(SweetAlert)
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      // swal({
      //   title: "Inactivate?",
      //   text: "Are you sure you want to inactivate this Record ? ",
      //   icon: "warning",
      //   buttons: true,
      //   dangerMode: true,
      // })

      swal({
        title: language == "en" ? "Inactivate?" : "निष्क्रिय करायचे?",
        text:
          language == "en"
            ? "Are you sure you want to inactivate this Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता ?",
        icon: "warning",
        buttons: {
          cancel: language === "en" ? "No, Cancel" : "नको, कॅन्सेल",
          confirm: language === "en" ? "Yes, Inactivate" : "होय, निष्क्रिय करा",
        },
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${URLS.SPURL}/bookingTime/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                // swal("Record is Successfully Deleted!", {
                //   icon: "success",
                // });
                language == "en"
                  ? swal("Record is Successfully Deleted!")
                  : swal("रेकॉर्ड यशस्वीरित्या हटवले आहे!");
                getData();
                // setButtonInputState(false);
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            });
        } else if (willDelete == null) {
          // swal("Record is Safe");
          language == "en"
            ? swal("Record is Safe")
            : swal("रेकॉर्ड सुरक्षित आहे");
        }
      });
    } else {
      // swal({
      //   title: "Activate?",
      //   text: "Are you sure you want to activate this Record ? ",
      //   icon: "warning",
      //   buttons: true,
      //   dangerMode: true,
      // })

      swal({
        title: language == "en" ? "Activate?" : "सक्रिय करा",
        text:
          language == "en"
            ? "Are you sure you want to activate this Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता ?",
        icon: "warning",
        buttons: {
          cancel: language === "en" ? "No, Cancel" : "नको, कॅन्सेल",
          confirm: language === "en" ? "Yes, Activate" : "होय, सक्रिय करा",
        },
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${URLS.SPURL}/bookingTime/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                // swal("Record is Successfully Deleted!", {
                //   icon: "success",
                // });

                language == "en"
                  ? swal("Record is Successfully Deleted!")
                  : swal("रेकॉर्ड यशस्वीरित्या हटवले आहे!");
                getData();
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            });
        } else if (willDelete == null) {
          // swal("Record is Safe");

          language == "en"
            ? swal("Record is Safe")
            : swal("रेकॉर्ड सुरक्षित आहे");
        }
      });
    }
  };
  // Get Table - Data
  const getData = (_pageSize = 10, _pageNo = 0, _sortDir = "desc") => {
    axios
      .get(
        `${URLS.SPURL}/bookingTime/getAll`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        {
          params: {
            pageSize: _pageSize,
            pageNo: _pageNo,
            sortDir: _sortDir,
          },
        },
      )
      .then((r) => {
        console.log("get response", r);
        // console.log(r.fromDate, r.toDate);
        let result = r.data.bookingTime;

        let _res = result.map((r, i) => {
          console.log("44");
          return {
            ...r,
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1,

            toDate: r.toDate,
            date: r.date,
            fromDate: r.fromDate,
            capacity: r.capacity,
            zoneNameTxt: sectionId?.find((obj) => obj?.id === r.zoneName)
              ?.zoneName,
            zoneNameMr: sectionId?.find((obj) => obj?.id === r.zoneNameMr)
              ?.zoneNameMr,

            wardNameTxt: getward?.find((obj) => obj?.id === r.wardName)
              ?.wardName,
            wardNameMr: getward?.find((obj) => obj?.id === r.wardNameMr)
              ?.wardNameMr,

            unitTxt: unit?.find((obj) => obj?.id === r.unit)?.unit,
            unitMr: unit?.find((obj) => obj?.id === r.unitMr)?.unitMr,

            facilityTypeTxt: facilityTypess?.find(
              (obj) => obj?.id === r.facilityType,
            )?.facilityType,

            facilityNameTxt: facilityNameAll?.find(
              (obj) => obj?.id === r.facilityName,
            )?.facilityName,

            venueTxt: venues?.find((obj) => obj?.id === r.venueSectionId)
              ?.venue,
            venueMr: venues?.find((obj) => obj?.id === r.venueSectionId)
              ?.venueMr,

            fromBookingTime: moment(r.fromBookingTime, "HH:mm:ss ").format(
              "HH:mm:ss",
            ),

            toBookingTime: moment(r.toBookingTime, "HH:mm:ss ").format(
              "HH:mm:ss",
            ),
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
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
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    console.log("submitted form:", fromData);
    // Save - DB
    let _body = {
      ...fromData,

      fromBookingTime: moment(getValues("fromBookingTime"), "HH:mm:ss").format(
        "HH:mm:ss",
      ),

      toBookingTime: moment(getValues("toBookingTime"), "HH:mm:ss").format(
        "HH:mm:ss",
      ),
    };
    console.log("body", _body);
    if (btnSaveText === "Save") {
      const tempData = axios
        .post(`${URLS.SPURL}/bookingTime/save`, _body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            sweetAlert("Saved!", "Record Saved successfully !", "success");

            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "update") {
      // delete _body.venue;
      console.log("update body:", _body);
      // const tempData = axios
      axios
        .post(
          `${URLS.SPURL}/bookingTime/save`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          _body,
        )
        .then((res) => {
          console.log("res", res);
          // if (res.status == 200) {
          //   fromData.id
          //     ? sweetAlert("Updated!", "Record Updated successfully !", "success")
          //     : sweetAlert("Saved!", "Record Saved successfully !", "success");
          //   getData();
          //   setEditButtonInputState(false);
          //   setDeleteButtonState(false);
          //   setIsOpenCollapse(false);
          // }

          if (fromData?.id) {
            language == "en"
              ? sweetAlert({
                  title: "Updated!",
                  text: "Record Updated successfully!",
                  icon: "success",
                  button: "Ok",
                })
              : sweetAlert({
                  title: "अपडेट केले!",
                  text: "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
                  icon: "success",
                  button: "ओके",
                });
            getData();
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
          } else {
            language == "en"
              ? sweetAlert({
                  title: "Saved!",
                  text: "Record Saved successfully!",
                  icon: "success",
                  button: "Ok",
                })
              : sweetAlert({
                  title: "जतन केले!",
                  text: "रेकॉर्ड यशस्वीरित्या जतन केले!",
                  icon: "success",
                  button: "ओके",
                });

            getData();
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
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

  // Get Table - Data
  // const getAllDetails = () => {
  //   axios
  //     .get(`${URLS.SPURL}/bookingMaster/getAll`)
  //     .then((res) => {
  //       setDataSource(
  //         res.data.bookingMaster.map((r, i) => ({
  // id: r.id,
  // srNo: i + 1,
  // date: r.toDate,
  // capacity: r.capacity,
  // zoneName: zoneNames?.find((obj) => obj?.id === r.zoneName)
  //   ?.zoneName,
  // venue: venueNames?.find((obj) => obj?.id === r.venue)?.venue,
  // wardName: wardNames?.find((obj) => obj?.id === r.wardName)
  //   ?.wardName,
  // department: departments?.find((obj) => obj?.id === r.department)
  //   ?.department,
  // // subDepartment: subDepartments?.find(
  // //   (obj) => obj?.id === r.subDepartment
  // // )?.subDepartment,
  // fromBookingTime: moment(r.fromBookingTime, "HH:mm A").format(
  //   "HH:mm A"
  // ),
  // toBookingTime: moment(r.toBookingTime, "HH:mm A").format("HH:mm A"),
  // facilityName: facilityNames?.find(
  //   (obj) => obj?.id === r.facilityName
  // )?.facilityName,
  // facilityType: facilityTypess?.find(
  //   (obj) => obj?.id === r.facilityType
  // )?.facilityType,
  //         }))
  //       );
  //     });
  // };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
      padding: "2%",
    },

    {
      field: "zoneNameTxt",
      // field: language === "en" ? "zoneNameTxt" : "zoneNameMr",
      headerName: <FormattedLabel id="zone" />,
      //type: "number",
      flex: 1,
    },
    {
      field: "wardNameTxt",
      // field: language === "en" ? "wardNameTxt" : "wardNameMr",
      headerName: <FormattedLabel id="ward" />,
      //type: "number",
      flex: 1,
    },
    {
      // field: "venueNameTxt",
      field: language === "en" ? "venueTxt" : "venueMr",
      headerName: <FormattedLabel id="venue" />,
      //type: "number",
      flex: 1,
    },

    {
      field: "facilityTypeTxt",
      // field: language === "en" ? "wardNameTxt" : "wardNameMr",
      headerName: <FormattedLabel id="facilityType" />,
      //type: "number",
      flex: 1,
    },
    {
      field: "facilityNameTxt",
      // field: language === "en" ? "wardNameTxt" : "wardNameMr",
      headerName: <FormattedLabel id="facilityName" />,
      //type: "number",
      flex: 1,
    },

    // {
    //   field: "unitTxt",
    //   headerName: "Unit",
    //   flex: 1,
    // },

    {
      field: "date",
      headerName: <FormattedLabel id="date" />,
      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),

      //type: "number",
      flex: 1,
    },
    {
      field: "fromDate",
      headerName: <FormattedLabel id="fromDate" />,
      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),

      //type: "number",
      flex: 1,
    },

    {
      field: "toDate",
      // width: 500,

      headerName: <FormattedLabel id="toDate" />,
      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),

      //type: "number",
      flex: 1,
    },

    {
      field: "fromBookingTime",
      headerName: <FormattedLabel id="fromBookingTime" />,
      //type: "number",
      flex: 1,
    },

    {
      field: "toBookingTime",
      headerName: <FormattedLabel id="toBookingTime" />,
      //type: "number",
      flex: 1,
    },
    {
      field: "capacity",
      headerName: <FormattedLabel id="capacity" />,
      //type: "number",
      flex: 1,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          // <Box>
          <>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                console.log("Slot param :", params);
                // setBtnSaveText(<FormattedLabel id="update" />),
                setBtnSaveText("update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                // const wardId = wardNames.find(
                //   (obj) => obj?.wardName === params.row.wardName
                // )?.id;

                // const zoneId = zoneNames.find(
                //   (obj) => obj?.zoneName === params.row.zoneName
                // )?.id;

                // const facilityTypeId = facilityType.find(
                //   (obj) => obj?.facilityType === params.row.facilityType
                // )?.id;
                // const unitId = unit.find(
                //   (obj) => obj?.unit === params.row.unit
                // )?.id;

                // const facilityNameId = facilityName.find(
                //   (obj) => obj?.facilityName === params.row.facilityName
                // )?.id;

                // const venueId = venues.find(
                //   (obj) => obj?.venue === params.row.venue
                // )?.id;
                // const unitId = unit.find(
                //   (obj) => obj?.unit === params.row.unit
                // )?.id;

                // setValue(
                //   "fromBookingTime",
                //   params.row.fromBookingTime
                //   // moment(params.row.fromBookingTime).format("HH:mm:ss")
                // );

                let data = {
                  ...params.row,
                  toBookingTime: moment(
                    params?.row?.toBookingTime,
                    "HH:mm:ss",
                  ).format("YYYY-MM-DDTHH:mm:ss"),
                  fromBookingTime: moment(
                    params?.row?.fromBookingTime,
                    "HH:mm:ss",
                  ).format("YYYY-MM-DDTHH:mm:ss"),
                };

                reset(data);
                console.log(
                  "f232432",
                  params?.row?.toBookingTime,
                  params?.row?.toBookingTime,
                );

                // reset({
                //   // onChange={(time) => {
                //   //   field.onChange(
                //   //     moment(time).format("YYYY-MM-DDTHH:mm:ss")
                //   //   );
                //   // }}
                //   // wardName: wardId,
                //   // zoneName: zoneId,
                //   // sectionId: sectionId,
                //   // facilityType: facilityTypeId,
                //   // unit: unitId,
                //   // sectionId: sectionId,
                //   // facilityName: facilityNameId,
                //   // venueSectionId: venueId,
                //   // fromBookingTime: moment(params.row.fromBookingTime).format(
                //   //   "HH:mm:ss"
                //   // ),
                //   // params.row.fromBookingTime,
                //   // toBookingTime,
                //   //   durationType: durationId,
                //   // bookingType: durationId,
                //   // fromBookingTime: fromBookingTimeId,
                //   // toBookingTime: toBookingTimee,
                // });
                getFacilityName();
                getSectionByFacilityName();
                capacity(params.row.sectionId);
                // setValue("fromBookingTime", moment(params.row.fromBookingTime));

                console.log("params.row:232", {
                  ...params.row,
                  // wardName: wardId,
                  // zoneName: zoneId,NameId
                  // venue: venueId,
                  // facilityName: facility,
                  // facilityType: facilityTypeId,
                  // bookingType:bookingId,
                });

                // console.log(
                //   "123456",
                //   moment(params.row.fromBookingTime).format(
                //     "YYYY-MM-DDTHH:mm:ss"
                //   )

                // );
                // reset({ ...params.row });
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            {/* <IconButton onClick={() => deleteById(params.id)}>
              <DeleteIcon />
            </IconButton> */}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true);
                // setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "Y")}
                />
              )}
            </IconButton>
          </>
        );
      },
    },
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
          marginTop: 5,
          marginBottom: 5,
          padding: 1,
        }}
      >
        <div
          style={{
            backgroundColor: "#556CD6",
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
          <strong>{<FormattedLabel id="bookingTimeMaster" />}</strong>
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
                      {/* venue */}
                      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
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
                      </Grid>

                      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <FormControl
                          // disabled={readOnly}
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

                      {/* zone */}
                      {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <FormControl
                          variant="standard"
                          error={!!errors.zoneName}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="zone" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                // {...register("zoneName")}
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
                                label="zoneName"
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
                            {errors?.zoneName ? errors.zoneName.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid> */}

                      {/* ward */}
                      {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <FormControl
                          variant="standard"
                          // sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.wardName}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="ward" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: 220 }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="wardName"
                              >
                                {getward &&
                                  getward.map((wardName, index) => {
                                    return (
                                      <MenuItem key={index} value={wardName.id}>
                                        {language == "en"
                                          ? wardName?.wardName
                                          : wardName?.wardNameMr}
                                      </MenuItem>
                                    );
                                  })}
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
                      </Grid> */}

                      {/* facilityType */}
                      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <FormControl
                          variant="standard"
                          // sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.facilityType}
                        >
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
                                {facilityType &&
                                  facilityType.map((facilityType, index) => {
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
                                // onChange={(value) => field.onChange(value)
                                // }
                                onChange={(value) => {
                                  field.onChange(value),
                                    getSectionByFacilityName();
                                  console.log(
                                    "facilityName: ",
                                    value.target.value,
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

                      {/* department */}
                      {/* <div>
                        <FormControl
                          variant="standard"
                          // sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.department}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="department" />
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
                      </div> */}

                      {/* <div>
                        <FormControl
                          variant="standard"
                          error={!!errors.subDepartment}
                        >
                          <InputLabel id="demo-simple-select-standard-label">Sub-Department</InputLabel>
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
                      </div> */}

                      {/* bookingType */}
                      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
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
                                // onChange={(value) => field.onChange(value) , capacity(value)}
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
                                          ? "Section : " + `${index + 1} `
                                          : // ? "Section : " + section.capacity
                                            "Section : " + section.capacity}
                                      </MenuItem>
                                    );
                                  })}
                                {/* {typeName?.value?.map(
                                        (facilityName, index) => (
                                          <MenuItem
                                          key={index}
                                          value={facilityName?.id}
                                        >
                                            
                                           {language == "en"
                                                      ? facilityName?.facilityName
                                                      : facilityName?.facilityNameMr}
                                          </MenuItem>
                                        )
                                      )} */}
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
                      </Grid>

                      {/* Unit */}
                      {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <FormControl
                          variant="standard"
                          sx={{ marginTop: 3, minWidth: 120 }}
                          error={!!errors.unit}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="unit" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: 220 }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="unitId"
                              >
                                {newSection &&
                                  newSection.map((newSection, index) => {
                                    return (
                                      <MenuItem
                                        key={index}
                                        value={newSection.unit}
                                      >
                                        {language == "en"
                                          ? newSection?.unit
                                          : newSection?.unitMr}
                                      </MenuItem>
                                    );
                                  })}
                              </Select>
                            )}
                            name="unitId"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.unit ? errors.unit.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid> */}

                      {/* Unit */}

                      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <FormControl
                          variant="standard"
                          sx={{ marginTop: 3, minWidth: 120 }}
                          error={!!errors.unit}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {/* Unit */}
                            <FormattedLabel id="unit" />
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
                                    console.log("unit: ", value.target.value);
                                }}
                                label="unit"
                              >
                                {unit?.map((unit, index) => {
                                  return (
                                    <MenuItem key={index} value={unit?.id}>
                                      {language == "en"
                                        ? unit.unit
                                        : unit.unitMr}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            )}
                            name="unitId"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.unit ? errors.unit.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/* capacity */}
                      {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <FormControl
                          style={{ marginTop: 10 }}
                          error={!!errors.unit}
                        >
                          <TextField
                            disabled
                            id="standard-basic"
                            label={<FormattedLabel id="unit" />}
                            variant="standard"
                            {...register("unit")}
                            error={!!errors.unit}
                            InputLabelProps={{
                              shrink: watch("unit") ? true : false,
                            }}
                          />
                          <FormHelperText>
                            {errors?.unit ? errors.unit.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid> */}

                      {/* capacity */}
                      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <FormControl
                          style={{ marginTop: 10 }}
                          error={!!errors.capacity}
                        >
                          <TextField
                            disabled
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
                      </Grid>

                      {/* <div>
                        <FormControl variant="standard" error={!!errors.bookingType}>
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="bookingType" />}
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
                                  setType(value.target.value);
                                }}
                               
                                label="bookingType"
                              >
                                <MenuItem value="Daily">Daily</MenuItem>
                                <MenuItem value="Monthly">Monthly</MenuItem>
                                <MenuItem value="threeM">3 Month</MenuItem>
                                <MenuItem value="sixM">6 Month</MenuItem>
                                <MenuItem value="oneY">1 Year</MenuItem>
                              </Select>
                            )}
                            name="bookingType"
                            control={control}
                            defaultValue=""
                          />
                        </FormControl>
                      </div> */}

                      {/* Date */}
                      {type === "Daily" && (
                        <>
                          <div>
                            <FormControl
                              style={{ marginTop: 40, width: 220 }}
                              error={!!errors.fromDate}
                            >
                              <Controller
                                control={control}
                                name="date"
                                defaultValue={null}
                                render={({ field }) => (
                                  <LocalizationProvider
                                    dateAdapter={AdapterMoment}
                                  >
                                    <DatePicker
                                      minDate={new Date()}
                                      inputFormat="DD/MM/YYYY"
                                      label={
                                        <span style={{ fontSize: 16 }}>
                                          {/* Date */}
                                          <FormattedLabel id="date" />
                                        </span>
                                      }
                                      value={field.value}
                                      onChange={(date) =>
                                        field.onChange(
                                          moment(date).format("YYYY-MM-DD"),
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
                        </>
                      )}

                      {/* fromDate */}
                      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <FormControl
                          style={{ marginTop: 30, width: 220 }}
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
                                      <FormattedLabel id="dailyDate" />
                                      {/* Date (Daily Slot) */}
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(date) =>
                                    field.onChange(
                                      moment(date).format("YYYY-MM-DD"),
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
                      </Grid>

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
                                      <FormattedLabel id="fromDate" />
                                      {/* Date(To) */}
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(date) =>
                                    field.onChange(
                                      moment(date).format("YYYY-MM-DD"),
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
                                      moment(date).format("YYYY-MM-DD"),
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

                      {/* fromBookingTime */}
                      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <FormControl
                          style={{ marginTop: 40, width: 220 }}
                          error={!!errors.fromBookingTime}
                        >
                          {/* <Controller
                            control={control}
                            name="fromBookingTime"
                            defaultValue={null}
                            render={({ field }) => (
                               <LocalizationProvider dateAdapter={AdapterMoment}>
                                 <TimePicker
                                   label={
                                     <span style={{ fontSize: 16 }}>
                                       <FormattedLabel id="fromBookingTime" />
                                     </span>
                                   }
                                   value={field.value}
                                   onChange={(newValue) => {
                                     setValue("fromBookingTime", newValue);
                                     console.log("Ha Time Aahe: ", newValue);
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
                          /> */}

                          <Controller
                            control={control}
                            defaultValue={null}
                            name="fromBookingTime"
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <TimePicker
                                  ampm={false}
                                  openTo="hours"
                                  views={["hours", "minutes", "seconds"]}
                                  inputFormat="HH:mm:ss"
                                  mask="__:__:__"
                                  label={
                                    <FormattedLabel id="fromBookingTime" />
                                  }
                                  value={field.value}
                                  // onChange={(newValue) => {
                                  //   setValue(
                                  //     "fromBookingTime",
                                  //     field.onChange(
                                  //       moment(newValue).format(
                                  //         "YYYY-MM-DDTHH:mm:ss"
                                  //       )
                                  //     )
                                  //   );
                                  // }}
                                  // onChange={(time) => {
                                  //   field.onChange(
                                  //     moment(time).format("YYYY-MM-DDTHH:mm:ss")
                                  //   );
                                  // }}
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
                            {errors?.fromBookingTime
                              ? errors.fromBookingTime.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* toBookingTime */}
                      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <FormControl
                          style={{ marginTop: 40, width: 220 }}
                          error={!!errors.toBookingTime}
                        >
                          <Controller
                            control={control}
                            defaultValue={null}
                            name="toBookingTime"
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <TimePicker
                                  ampm={false}
                                  openTo="hours"
                                  views={["hours", "minutes", "seconds"]}
                                  inputFormat="HH:mm:ss"
                                  mask="__:__:__"
                                  label={<FormattedLabel id="toBookingTime" />}
                                  value={field.value}
                                  // onChange={(time) => {
                                  //   field.onChange(
                                  //     moment(time).format("YYYY-MM-DDTHH:mm:ss")
                                  //   );
                                  // }}
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
                            {errors?.toBookingTime
                              ? errors.toBookingTime.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <FormControl
                          style={{ marginTop: 40, width: 220 }}
                          error={!!errors.toBookingTime}
                        >
                          <Controller
                            control={control}
                            name="toBookingTime"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <TimePicker
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      {<FormattedLabel id="toBookingTime" />}
                                    </span>
                                  }
                                  // value={valuee}
                                  value={field.value}
                                  onChange={(newValue) => {
                                    setValue(
                                      "toBookingTime",
                                      // moment(newValue).format('HH:mm a')
                                      newValue
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
                            {errors?.toBookingTime
                              ? errors.toBookingTime.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid> */}
                    </Grid>
                    {/* )} */}
                    {/* {type === "Monthly" ||
                        "threeM" ||
                        "sixM" ||
                        ("oneY" && (
                          <div>
                            <div  >
                              <FormControl style={{ marginTop: 10 }} error={!!errors.fromDate}>
                                <Controller
                                  control={control}
                                  name="fromDate"
                                  defaultValue={null}
                                  render={({ field }) => (
                                    <LocalizationProvider dateAdapter={AdapterMoment}>
                                      <DatePicker
                                        inputFormat="DD/MM/YYYY"
                                        label={
                                          <span style={{ fontSize: 16 }}>
                                            <FormattedLabel id="fromDate" />
                                          </span>
                                        }
                                        value={field.value}
                                        onChange={(date) =>
                                          field.onChange(
                                            moment(date).format("YYYY-MM-DD"),
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
                            </div>
                            <div  >
                              <FormControl style={{ marginTop: 10 }} error={!!errors.toDate}>
                                <Controller
                                  control={control}
                                  name="toDate"
                                  defaultValue={null}
                                  render={({ field }) => (
                                    <LocalizationProvider dateAdapter={AdapterMoment}>
                                      <DatePicker
                                        inputFormat="DD/MM/YYYY"
                                        label={
                                          <span style={{ fontSize: 16 }}>
                                            <FormattedLabel id="toDate" />
                                          </span>
                                        }
                                        value={field.value}
                                        onChange={(date) =>
                                          field.onChange(
                                            moment(date).format("YYYY-MM-DD"),
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
                          </div>
                        ))} */}
                  </>

                  {/* {type === "Daily" && ( */}
                  {/* )} */}

                  <div className={styles.btn}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="success"
                      endIcon={<SaveIcon />}
                    >
                      {btnSaveText == "Save" ? (
                        <FormattedLabel id="save" />
                      ) : (
                        <FormattedLabel id="update" />
                      )}
                    </Button>
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
            endIcon={<AddIcon />}
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
            <FormattedLabel id="add" />
          </Button>
        </div>
        {/* <DataGrid
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
              printOptions: { disableToolbarButton: true },
              
              csvOptions: { disableToolbarButton: true },
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
            getData(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            console.log("222", _data);
            getData(_data, data.page);
          }}
        /> */}
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
