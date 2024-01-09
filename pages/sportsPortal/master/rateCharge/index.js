import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import URLS from "../../../../URLS/urls";
import styles from "../../../../styles/sportsPortalStyles/facilityCheck.module.css";
//import styles from "../../../../styles/sportsPortalStyles/bookingTimeMaster.module.css";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { GridToolbar } from "@mui/x-data-grid";
import schema from "../../../../containers/schema/sportsPortalSchema/rateChargeSchema";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// func
const Index = () => {
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
  const {
    register,

    control,
    handleSubmit,
    methods,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [disableKadhnariState, setDisableKadhnariState] = useState(true);
  const [disable, setDisable] = useState(true);
  const [value, setValuee] = useState(null);
  const [valuee, setValueTwo] = useState(null);
  const [type, setType] = useState();
  const [btnSaveText, setBtnSaveText] = useState("Save");
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
  const [wardNames, setWardNames] = useState([]);
  const [kayAheNaav, setKayAheNaav] = useState("Individual");

  const [bookingType, setBookingType] = useState([
    { id: 1, bookingTypeEn: "Concession", bookingTypeMr: "सवलत" },
    { id: 2, bookingTypeEn: "No Concession", bookingTypeMr: "सवलत नाही" },
    // { id: 1, bookingTypeEn: "Group", bookingTypeMr: "गट" },
    // { id: 2, bookingTypeEn: "Individual", bookingTypeMr: "वैयक्तिक" },
  ]);
  // const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [facilityTypess, setFacilityTypess] = useState([]);
  const [applicantTypess, setApplicantTypess] = useState([]);
  const [chargeTypess, setChargeTypess] = useState([]);
  const [facilityNames, setFacilityNames] = useState([]);
  const [selectedFacilityType, setSelectedFacilityType] = useState();
  const [venues, setVenues] = useState([]);
  const [selectedFacilityName, setSelectedFacilityName] = useState();
  // EditSelectedRow
  const [editSelectedRow, setEditSelectedRow] = useState({});

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getType();
  }, [zoneNames, wardNames, fetchData]);

  useEffect(() => {
    getAllTypes();
    getWardNames();
    getFacilityTypes();
    getFacilityName();
    getVenue();
    // getVenueNames();
    getApplicantTypes();
    getChargeTypes();
    getDurationTypes();
  }, []);

  // getVenue -- Facility Type -- Facility Type
  const getVenue = () => {
    axios
      .get(`${URLS.SPURL}/venueMasterSection/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setVenues(
          r.data.venueSection.map((row) => ({
            id: row.id,
            venue: row.venue,
            venueMr: row.venueMr,
            // facilityName: row.facilityName,
            // facilityType: row.facilityType,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // getFacilityName --  Facility Type
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
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // Duration Type

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
            typeNameMr: row.typeNameMr,
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
  // getFacility Type
  const getChargeTypes = () => {
    axios
      .get(`${URLS.SPURL}/chargeType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setChargeTypess(
          r.data.chargeType.map((row) => ({
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
  const getAllTypes = () => {
    axios
      .get(`${URLS.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setZoneNames(
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

  // const getVenueNames = () => {
  //   axios.get(`${URLS.SPURL}/venueMaster/getAll`).then((r) => {
  //     setVenueNames(
  //       r.data.venue.map((row) => ({
  //         id: row.id,
  //         venue: row.venue,
  //         venueMr: row.venueMr,
  //         // facilityName: row.facilityName,
  //       })),
  //     );
  //   });
  // };

  const getWardNames = () => {
    axios
      .get(`${URLS.CFCURL}/master/ward/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setWardNames(
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
            .post(`${URLS.SPURL}/master/rateCharge/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getType();
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
            .post(`${URLS.SPURL}/master/rateCharge/save`, body, {
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
                // getPaymentRate();
                getType();
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
    }
  };
  // Get Table - Data
  const getType = (_pageSize = 10, _pageNo = 0, _sortDir = "desc") => {
    axios
      .get(`${URLS.SPURL}/master/rateCharge/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortDir: _sortDir,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("get response", r);
        let result = r.data.rateCharge;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log("44");
          return {
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1,

            ammount: r.ammount,

            // zoneName: zoneNames?.find((obj) => obj?.id === r.zoneName)?.zoneName,
            venue: venues?.find((obj) => obj?.id === r.venue)?.venue,

            // wardName: wardNames?.find((obj) => obj?.id === r.wardName)?.wardName,
            durationType: durationTypess?.find(
              (obj) => obj?.id === r.durationType
            )?.typeName,
            chargeType: chargeTypess?.find((obj) => obj?.id === r.chargeType)
              ?.typeName,

            facilityName: facilityNames?.find(
              (obj) => obj?.id === r.facilityName
            )?.facilityName,
            // facilityNameMr: facilityNames?.find((obj) => obj?.id === r.facilityName)?.facilityNameMr,

            // facilityTypeMr: facilityTypess?.find((obj) => obj?.id === r.facilityType)?.facilityTypeMr,

            facilityType: facilityTypess?.find(
              (obj) => obj?.id === r.facilityType
            )?.facilityType,
            applicantType: applicantTypess?.find(
              (obj) => obj?.id === r.applicantType
            )?.typeName,
            venue: venues?.find((obj) => obj?.id === r.venue)?.venue,

            venueMr: venues?.find((obj) => obj?.id === r.venue)?.venueMr,
            facilityNameMr: facilityNames?.find(
              (obj) => obj?.id === r.facilityName
            )?.facilityNameMr,
            facilityTypeMr: facilityTypess?.find(
              (obj) => obj?.id === r.facilityType
            )?.facilityTypeMr,

            applicantTypeMr: applicantTypess?.find(
              (obj) => obj?.id === r.applicantType
            )?.typeNameMr,
            durationTypeMr: durationTypess?.find(
              (obj) => obj?.id === r.durationType
            )?.typeNameMr,
            chargeTypeMr: chargeTypess?.find((obj) => obj?.id === r.chargeType)
              ?.typeNameMr,

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
      // fromBookingTime: moment(fromData.fromBookingTime).format('LTS'),
      // fromBookingTime: moment(fromData.fromBookingTime).format('LT'),
      //   fromBookingTime: moment(fromData.fromBookingTime, "HH:mm:ss").format("HH:mm:ss"),
      // toBookingTime: moment(fromData.toBookingTime).format('LTS'),
      // toBookingTime: moment(fromData.toBookingTime).format('LT'),
      //   toBookingTime: moment(fromData.toBookingTime, "HH:mm:ss").format("HH:mm:ss"),
      // activeFlag: btnSaveText === 'update' ? null : fromData.activeFlag,
    };
    console.log("body", _body);
    if (btnSaveText === "Save") {
      const tempData = axios
        .post(`${URLS.SPURL}/master/rateCharge/save`, _body, {
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
      console.log("update data", _body);
      // const tempData = axios
      axios
        .post(`${URLS.SPURL}/master/rateCharge/save`, _body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("res", res);
          // if (res.status == 200) {
          //   fromData.id
          //     ? sweetAlert("Updated!", "Record Updated successfully !", "success")
          //     : sweetAlert("Saved!", "Record Saved successfully !", "success");
          //   getType();

          //   setIsOpenCollapse(false);
          //   setButtonInputState(false);
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
            getType();

            setIsOpenCollapse(false);
            setButtonInputState(false);
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

            getType();
            setIsOpenCollapse(false);
            setButtonInputState(false);
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
    // // Update Data Based On ID
    // else if (btnSaveText === "update") {
    //   delete _body.venue;
    //   console.log("update body:", _body);
    //   const tempData = axios.post(`${URLS.SPURL}/master/rateCharge/save`, _body).then((res) => {
    //     console.log("res", res);
    //     if (res.status == 200) {
    //       fromData.id
    //         ? sweetAlert("Updated!", "Record Updated successfully !", "success")
    //         : sweetAlert("Saved!", "Record Saved successfully !", "success");
    //       getType();
    //       // setButtonInputState(false);
    //       setEditButtonInputState(false);
    //       setDeleteButtonState(false);
    //       setIsOpenCollapse(false);
    //     }
    //   });
    // }
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
      flex: 1,
      padding: "2%",
    },

    {
      field: language === "en" ? "venue" : "venueMr",
      headerName: <FormattedLabel id="venue" />,
      flex: 1,
    },
    {
      field: language === "en" ? "facilityName" : "facilityNameMr",
      headerName: <FormattedLabel id="facilityName" />,
      flex: 1,
    },
    {
      field: language === "en" ? "facilityType" : "facilityTypeMr",
      headerName: <FormattedLabel id="facilityType" />,
      flex: 1,
    },
    {
      field: language === "en" ? "chargeType" : "chargeTypeMr",
      headerName: <FormattedLabel id="chargeType" />,
      flex: 1,
    },
    {
      field: language === "en" ? "durationType" : "durationTypeMr",
      headerName: <FormattedLabel id="durationType" />,
      flex: 1,
    },
    {
      field: language === "en" ? "applicantType" : "applicantTypeMr",
      headerName: <FormattedLabel id="applicantType" />,
      flex: 1,
    },
    {
      field: language === "en" ? "type" : "typeMr",
      headerName: <FormattedLabel id="applicantType" />,
      flex: 1,
    },
    {
      field: "ammount",
      headerName: <FormattedLabel id="amount" />,
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
                console.log("id", params.row.id);
                // setBtnSaveText(<FormattedLabel id="update" />),
                setBtnSaveText("update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                const facilityNameId = facilityNames.find(
                  (obj) => obj?.facilityName === params.row.facilityName
                )?.id;
                const venueId = venues.find(
                  (obj) => obj?.venue === params.row.venue
                )?.id;
                const chargeId = chargeTypess.find(
                  (obj) => obj?.typeName === params.row.chargeType
                )?.id;
                const durationId = durationTypess.find(
                  (obj) => obj?.typeName === params.row.durationType
                )?.id;
                const applicantId = applicantTypess.find(
                  (obj) => obj?.typeName === params.row.applicantType
                )?.id;

                const facilityTypeId = facilityTypess.find(
                  (obj) => obj?.facilityType === params.row.facilityType
                )?.id;

                reset({
                  ...params.row,
                  // wardName: wardId,
                  // zoneName: zoneId,
                  venue: venueId,
                  facilityName: facilityNameId,
                  facilityType: facilityTypeId,
                  applicantType: applicantId,
                  durationType: durationId,
                  chargeType: chargeId,
                });
                console.log("params.row: ", {
                  ...params.row,
                  // wardName: wardId,
                  // zoneName: zoneId,
                  venueName: venueId,
                  facilityName: facilityNameId,
                  applicantType: applicantId,
                  durationType: durationId,
                  chargeType: chargeId,
                });
                // reset({ ...params.row });
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>

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
            backgroundColor: `#556CD6`,
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
          <strong>{<FormattedLabel id="rateChargeMaster" />}</strong>
        </div>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
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
                      <FormControl
                        variant="standard"
                        // sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.venue}
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
                              onChange={(value) => field.onChange(value)}
                              label="venue"
                            >
                              {/* )} */}
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
                          name="venue"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.venue ? errors.venue.message : null}
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
                                field.onChange(value);
                                console.log("value: ", value.target.value);
                              }}
                              label="facilityName"
                            >
                              {facilityNames &&
                                facilityNames.map((facilityName, index) => (
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
                                field.onChange(value);
                                console.log("value: ", value.target.value);
                                setSelectedFacilityType(value.target.value);
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

                    {/* chargeType */}
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <FormControl
                        variant="standard"
                        error={!!errors.chargeType}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="chargeType" required />
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
                                setDisableKadhnariState(false);
                              }}
                              label="chargeType"
                            >
                              {chargeTypess &&
                                chargeTypess.map((chargeType, index) => (
                                  <MenuItem key={index} value={chargeType.id}>
                                    {language == "en"
                                      ? chargeType?.typeName
                                      : chargeType?.typeNameMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="chargeType"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.chargeType
                            ? errors.chargeType.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <FormControl
                        variant="standard"
                        error={!!errors.facilityType}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="durationType" required />
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

                    {/* Type */}

                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <FormControl
                        // disabled={editable}
                        error={!!errors.bookingType}
                        sx={{ marginTop: 2 }}
                        variant="standard"
                      >
                        <InputLabel
                          shrink={true}
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
                                field.onChange(value),
                                  setKayAheNaav(value.target.value);
                              }}
                              label="type"
                            >
                              {bookingType.map((menu, index) => {
                                return (
                                  <MenuItem
                                    key={index}
                                    value={menu.bookingTypeEn}
                                  >
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

                    {/* applicantType */}
                    {kayAheNaav === "Concession" && (
                      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <FormControl
                          variant="standard"
                          // sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.applicantType}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="applicantType" required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                multiline
                                sx={{ width: 220 }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                  console.log("value: ", value.target.value);
                                  setSelectedFacilityType(value.target.value);
                                  setDisableKadhnariState(false);
                                }}
                                label="applicantType"
                              >
                                {applicantTypess &&
                                  applicantTypess.map(
                                    (applicantType, index) => (
                                      <MenuItem
                                        key={index}
                                        value={applicantType.id}
                                      >
                                        {language == "en"
                                          ? applicantType?.typeName
                                          : applicantType?.typeNameMr}
                                      </MenuItem>
                                    )
                                  )}
                              </Select>
                            )}
                            name="applicantType"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.applicantType
                              ? errors.applicantType.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    )}
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <FormControl variant="standard" error={!!errors.ammount}>
                        <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="amount" required />}
                          variant="standard"
                          {...register("ammount")}
                          error={!!errors.ammount}
                        />
                        <FormHelperText>
                          {errors?.ammount ? errors.ammount.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
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
            getType(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            getType(data.pageSize, _data);
          }}
        />
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
            getType(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            console.log("222", _data);
            getType(_data, data.page);
          }}
        /> */}
      </Paper>
    </>
  );
};

export default Index;
