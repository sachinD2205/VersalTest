import {
  Autocomplete,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Checkbox,
  Select,
  TextField,
  ThemeProvider,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme.js";
import urls from "../../../../URLS/urls";
import { Delete, Watch } from "@mui/icons-material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import Loader from "../../../../containers/Layout/components/Loader";
import GoogleTranslationComponent from "../../../../components/common/linguosol/googleTranslation";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// AdvocateDetails
const AdvocateDetails = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useFormContext();
  const router = useRouter();
  const [disabledButtonInputState, setDisabledButtonInputState] =
    useState(false);
  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const [courtNames, setCourtNames] = useState([]);
  const [departmentNames, setDepartmentNames] = useState([]);
  const [selectedDepartmentIds, setSelectedDepartmentIds] = useState([]);
  const [selectedDepartmentNames, setSelectedDepartmentNames] = useState([]);
  const [selectedLocationsNames, setSelectedLocationsNames] = useState([]);
  const [advocateNames, setAdvocateNames] = useState([]);
  const [userNames, setUserNames] = useState([]);
  const [allUserNames, setAllUserNames] = useState([]);
  const [officeLocationList, setOfficeLocationList] = useState([]);
  const [officeLocationList1, setOfficeLocationList1] = useState([]);
  const [rowsData, setRowsData] = useState([]);
  const [locationDptButton, setLocationDptButton] = useState("Add");
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const [loading, setLoading] = useState(false);

  const [selectedDepartment, setSelectedDepartment] = useState(null);

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

  const caseDetailsApi = (currentFieldInput, updateFieldName, languagetype) => {
    //---------------------------------- old-----------------------------------------
    // let stringToSend = currentFieldInput;
    // const url = `https://noncoredev.pcmcindia.gov.in/backend/lc/lc/api/translator/translate`;
    // axios.post(url, { body: stringToSend }).then((res) => {
    //   if (res?.status == 200 || res?.status == 201) {
    //     let bodyResponse = JSON.parse(res?.data.text);
    //     console.log("titlepanelRemark", bodyResponse.body);
    //     setValue("caseDetailsMr", bodyResponse?.body);
    //   }
    // });

    // --------------------------------new by vishal--------------------------------------------------------

    if (currentFieldInput) {
      let _payL = {
        apiKey: "Alpesh",
        textToTranslate: currentFieldInput,
        languagetype: languagetype,
      };
      setLoading(true);
      axios
        // .post(`${urls.TRANSLATIONAPI}`, _payL)
        .post(`${urls.GOOGLETRANSLATIONAPI}`, _payL)
        .then((r) => {
          setLoading(false);
          if (r.status === 200 || r.status === 201) {
            console.log("_res", currentFieldInput, r);
            if (updateFieldName) {
              setValue(updateFieldName, r?.data);
              clearErrors(updateFieldName);
            }
          }
        })
        .catch((e) => {
          setLoading(false);
          catchExceptionHandlingMethod(e, language);
        });
    } else {
      sweetAlert({
        title: language === "en" ? "Not Found !!" : "सापडले नाही !!",
        text:
          language === "en"
            ? "We do not received any input to translate !!"
            : "आम्हाला भाषांतर करण्यासाठी कोणतेही इनपुट मिळाले नाही !!",
        icon: "warning",
      });
    }
  };

  // const department = watch("department");

  // const handleSelectedLocations = (evt, value) => {
  //   console.log("__handleSelectedLocations", value, evt);
  //   let uniqueArrayOfLocations = Object?.values(
  //     value?.reduce((acc, obj) => {
  //       acc[obj?.id] = obj;
  //       return acc;
  //     }, {})
  //   );

  //   let selectedIds = uniqueArrayOfLocations?.map((val) => val?.id);
  //   let __selectedIds = selectedIds?.join(",");
  //   console.log(
  //     "valuevalueLocations",
  //     value,
  //     uniqueArrayOfLocations,
  //     __selectedIds
  //   );

  //   setSelectedLocationsNames(uniqueArrayOfLocations);
  //   setValue("location", __selectedIds);
  // };

  // const handleSelectedDepartments = (evt, value) => {
  //   let uniqueArrayOfObjects = Object?.values(
  //     value?.reduce((acc, obj) => {
  //       acc[obj?.id] = obj;
  //       return acc;
  //     }, {})
  //   );

  //   let selectedIds = uniqueArrayOfObjects?.map((val) => val?.id);
  //   let __selectedIds = selectedIds?.join(",");
  //   console.log("valuevalue", value, evt, uniqueArrayOfObjects, __selectedIds);

  //   setSelectedDepartmentNames(uniqueArrayOfObjects);
  //   setValue("department", __selectedIds);
  // };

  // advocateNames
  const getAdvocateName = () => {
    axios
      .get(`${urls.LCMSURL}/master/advocate/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAdvocateNames(
          res.data.advocate.map((r, i) => ({
            id: r.id,
            // advocateName: r.firstName + " " + r.middleName + " " + r.lastName,
            // advocateNameMr:
            //   r.firstNameMr + " " + r.middleNameMr + " " + r.lastNameMr,

            advocateName: `${r.firstName ?? ""} ${r.middleName ?? ""} ${
              r.lastName ?? ""
            }`.trim(),
            advocateNameMr: `${r.firstNameMr ?? ""} ${r.middleNameMr ?? ""} ${
              r.lastNameMr ?? ""
            }`.trim(),
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // departmentNames
  const getDepartmentName = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDepartmentNames(
          res.data.department.map((r, i) => ({
            id: r.id,
            department: r.department,
            deptNameMr: r.departmentMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // addMore - loc and dept
  const addDeptLocationList = () => {
    // add new loc and dept
    let newLocDept = {
      dptId: watch("departmentName"),
      locationId: watch("locationName"),
      concernPersonId: watch("concernPerson"),
    };

    let tempTableData;

    let updatedTableData = [];
    if (locationDptButton == "Add") {
      if (rowsData?.length > 0) {
        tempTableData = [...rowsData, newLocDept];
      } else {
        tempTableData = [newLocDept];
      }

      console.log("tempTableData", tempTableData);
      updatedTableData =
        tempTableData?.length > 0 &&
        tempTableData?.map((val, i) => {
          return {
            srNo: i + 1,
            id: val?.id === undefined ? null : val?.id,
            activeFlag: val?.activeFlag,
            locationNameEn: officeLocationList?.find(
              (obj) => obj?.id === val.locationId
            )?.officeLocationName,
            locationNameMr: officeLocationList?.find(
              (obj) => obj?.id === val.locationId
            )?.officeLocationNameMar,

            departmentNameEn: departmentNames?.find(
              (obj) => obj?.id === val.dptId
            )?.department,
            departmentNameMr: departmentNames?.find(
              (obj) => obj?.id === val.dptId
            )?.departmentMr,

            userName: allUserNames?.find(
              (obj) => obj?.id === val?.concernPersonId
            )?.userName,
            userNameMr: allUserNames?.find(
              (obj) => obj?.id === val?.concernPersonId
            )?.userNameMr,

            locationId: val?.locationId,
            dptId: val?.dptId,
            concernPersonId: val?.concernPersonId,
          };
        });
    } else if (locationDptButton == "Edit") {
      updatedTableData = rowsData?.map((val, i) => {
        if (watch("idForupdate") === val?.srNo) {
          return {
            srNo: watch("idForupdate"),
            id: val?.id === undefined ? null : val?.id,
            activeFlag: val?.activeFlag,
            locationNameEn: officeLocationList?.find(
              (obj) => obj?.id === watch("locationName")
            )?.officeLocationName,
            locationNameMr: officeLocationList?.find(
              (obj) => obj?.id === watch("locationName")
            )?.officeLocationNameMar,
            departmentNameEn: departmentNames?.find(
              (obj) => obj?.id === watch("departmentName")
            )?.department,
            departmentNameMr: departmentNames?.find(
              (obj) => obj?.id === watch("departmentName")
            )?.deptNameMr,

            userName: allUserNames?.find(
              (obj) => obj?.id === watch("concernPerson")
            )?.userName,
            userNameMr: allUserNames?.find(
              (obj) => obj?.id === watch("concernPerson")
            )?.userNameMr,
            locationId: watch("locationName"),
            dptId: watch("departmentName"),
            concernPersonId: watch("concernPerson"),
          };
        } else
          return {
            ...val,
          };
      });
    }
    setRowsData(updatedTableData ? updatedTableData : []);

    let _updatedTableData = updatedTableData?.map((obj) => {
      return {
        id: obj?.id,
        srNo: obj?.srNo,
        dptId: obj?.dptId,
        locationId: obj?.locationId,
        concernPersonId: obj?.concernPersonId,
        activeFlag: obj?.activeFlag,
      };
    });

    localStorage.setItem(
      "trnDptLocationDao",
      JSON.stringify(_updatedTableData)
    );
    setLocationDptButton("Add");
    setValue("departmentName", null);
    setValue("locationName", null);
    setValue("concernPerson", null);
    setValue("idForupdate", null);
  };

  const handleDptLocationDelete = (srNo) => {
    let updatedTableData = rowsData?.map((val) => {
      return srNo === val?.srNo ? { ...val, activeFlag: "N" } : { ...val };
    });
    console.log("___activeFlag", updatedTableData);
    localStorage.setItem("trnDptLocationDao", JSON.stringify(updatedTableData));
    setRowsData(updatedTableData ? updatedTableData : []);
    setLocationDptButton("Add");
  };
  const _col = [
    {
      field: "mySrNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language === "en" ? "locationNameEn" : "locationNameMr",
      headerName: language === "en" ? "Location Name" : "स्थानाचे नाव",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language === "en" ? "departmentNameEn" : "departmentNameMr",
      headerName: language === "en" ? "Department Name" : "विभागाचे नाव",
      flex: 1,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
    ,
    // {
    //   // field: "userName",
    //   field: language === "en" ? "userName" : "userNameMr",
    //   headerName:
    //     language === "en" ? "Concern Person Name" : "संबंधित व्यक्तीचे नाव",
    //   flex: 1,
    //   minWidth: 250,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      align: "center",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              sx={{
                color: "green",
              }}
              disabled={disabledButtonInputState}
              onClick={(index) => {
                setLocationDptButton("Edit");
                console.log("check__", params?.row);
                setValue("idForupdate", params?.row?.srNo);
                setValue("departmentName", params?.row?.dptId);
                setValue("locationName", params?.row?.locationId);
                setValue("concernPerson", params?.row?.concernPersonId);

                // handleOpen();
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              sx={{ color: "red" }}
              disabled={disabledButtonInputState}
              onClick={() => {
                handleDptLocationDelete(params?.row?.srNo);
              }}
            >
              <Delete />
            </IconButton>
          </>
        );
      },
    },
  ];
  // get User List based on department

  // const getUserList = async (value) => {
  //   // if (value == null || value === "") {
  //   //   setUserNames([])
  //   //   return;
  //   // }

  //   if (value != null && value !== undefined) {
  //     try {
  //       const { data } = await axios.get(
  //         `${urls.LCMSURL}/master/user/getUserByDpt?dptId=${value}`
  //       );
  //       console.log("dataaaaaa", data);
  //       setUserNames(
  //         data?.map((r, i) => ({
  //           id: r.id,
  //           userName: r.firstNameEn + " " + r.middleNameEn + " " + r.lastNameEn,
  //           userNameMr:
  //             r.firstNameMr + " " + r.middleNameMr + " " + r.lastNameMr,
  //         }))
  //       );
  //     } catch (e) {
  //       console.log("Error", e.message);
  //     }
  //   } else {
  //     try {
  //       const { data } = await axios.get(`${urls.LCMSURL}/master/user/getAll`);
  //       console.log("daQWQWaa", data);
  //       setUserNames(
  //         data?.user?.map((r, i) => ({
  //           id: r.id,
  //           userName: r.firstNameEn + " " + r.middleNameEn + " " + r.lastNameEn,
  //           userNameMr:
  //             r.firstNameMr + " " + r.middleNameMr + " " + r.lastNameMr,
  //         }))
  //       );
  //     } catch (e) {
  //       console.log("Error", e.message);
  //     }
  //   }
  // };
  const getAllConcernPerson = () => {
    axios
      .get(`${urls.CFCURL}/master/user/getUserBasicDetails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAllUserNames(
          res?.data?.user?.map((r, i) => ({
            id: r.id,
            userName:
              r?.firstNameEn + " " + r?.middleNameEn + " " + r?.lastNameEn,
            userNameMr:
              r?.firstNameMr + " " + r?.middleNameMr + " " + r?.lastNameMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };
  const getConcernPersonBydpt = () => {
    // alert("dfsd");
    if (watch("departmentName")) {
      axios
        .get(
          // localhost:8090/cfc/api/master/user/getUserByApplication
          `${urls.LCMSURL}/master/user/getUserByDpt?dptId=${watch(
            "departmentName"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log("resDataUserName", res?.data);
          setUserNames(
            res?.data?.map((r, i) => ({
              id: r.id,
              userName:
                r?.firstNameEn + " " + r?.middleNameEn + " " + r?.lastNameEn,
              userNameMr:
                r?.firstNameMr + " " + r?.middleNameMr + " " + r?.lastNameMr,
            }))
          );
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    }
  };

  // courtNames
  const getCourtName = () => {
    axios
      .get(`${urls.LCMSURL}/master/court/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCourtNames(
          res.data.court.map((r, i) => ({
            id: r.id,
            courtName: r.courtName,
            courtMr: r.courtMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // officeLocation
  const getOfficeLocation = () => {
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          console.log("__officeLocation", r?.data?.officeLocation);
          setOfficeLocationList(r?.data?.officeLocation);
        } else {
          //
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getOfficeLocationByDepartment = (id) => {
    const url = `${urls.CFCURL}/master/departmentAndOfficeLocationMapping/getByDepartmentId?deptId=${id}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          console.log(
            "34324234234OK",
            r?.data?.departmentAndOfficeLocationMapping
          );

          let data = r?.data?.departmentAndOfficeLocationMapping?.map(
            (data, index) => {
              console.log(
                "officeLocationList",
                officeLocationList,
                data?.id,
                officeLocationList?.find((newData) => newData?.id == data?.id)
                  ?.officeLocationName
              );
              return {
                ...data,

                officeLocationNameMar: officeLocationList?.find(
                  (newData) => newData?.id == data?.officeLocation
                )?.officeLocationNameMar,

                officeLocationName: officeLocationList?.find(
                  (newData) => newData?.id == data?.officeLocation
                )?.officeLocationName,
              };
            }
          );

          console.log("dat323232323", data);

          setOfficeLocationList1(data);
        } else {
          //
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // ------------------ useEffect -----------

  // useEffect(() => {
  //   if (selectedDepartment) {
  //     // Fetch the "Concern Person Names" based on the selected department
  //     getUserList(selectedDepartment.id);
  //   } else {
  //     // If no department is selected, fetch all "Concern Person Names"
  //     getUserList();
  //   }
  // }, [selectedDepartment]);

  useEffect(() => {
    // getUserList();
    getAllConcernPerson();
    if (
      localStorage.getItem("disabledButtonInputState") == "true" ||
      localStorage.getItem("pageMode") == "View"
    ) {
      setDisabledButtonInputState(true);
    } else if (localStorage.getItem("disabledButtonInputState") == "false") {
      setDisabledButtonInputState(false);
    }
    getDepartmentName();
  }, []);

  useEffect(() => {
    console.log("disabledButtonInputState", disabledButtonInputState);
  }, [disabledButtonInputState]);
  useEffect(() => {
    getConcernPersonBydpt();
  }, [watch("departmentName")]);

  // useEffect(() => {
  //   if (
  //     officeLocationList?.length > 0 &&
  //     localStorage.getItem("newCourtCaseEntry")
  //   ) {
  //     let _locations = JSON.parse(localStorage.getItem("newCourtCaseEntry"))
  //       ?.location?.split(",")
  //       ?.map((numberString) => parseInt(numberString));

  //     let _locNames = _locations
  //       ?.map((dpt) => {
  //         return officeLocationList?.find((i) => i?.id == dpt);
  //       })
  //       ?.filter((obj) => obj !== undefined);
  //     let evt = "event";
  //     handleSelectedLocations(evt, _locNames ? _locNames : []);
  //     console.log("_locNames", _locNames);
  //   }
  //   if (
  //     departmentNames?.length > 0 &&
  //     localStorage.getItem("newCourtCaseEntry")
  //   ) {
  //     let _dpt = JSON.parse(localStorage.getItem("newCourtCaseEntry"))
  //       ?.department?.split(",")
  //       ?.map((numberString) => parseInt(numberString));

  //     let _dptNames = _dpt
  //       ?.map((dpt) => {
  //         return departmentNames?.find((i) => i?.id == dpt);
  //       })
  //       ?.filter((obj) => obj !== undefined);
  //     let evt = "event";
  //     handleSelectedDepartments(evt, _dptNames ? _dptNames : []);
  //   }
  // }, [
  //   officeLocationList,
  //   departmentNames,
  //   localStorage.getItem("newCourtCaseEntry"),
  // ]);

  useEffect(() => {
    getCourtName();
  }, [departmentNames, userNames]);

  // useEffect(() => {
  //   // if(watch("advocateName")!=null)
  //   getUserList(watch("advocateName"));
  // }, [watch("advocateName")]);

  useEffect(() => {
    getAdvocateName();
  }, [courtNames]);

  useEffect(() => {
    console.log("__rowsData", rowsData);
  }, [rowsData]);

  useEffect(() => {
    if (localStorage.getItem("trnDptLocationDao")) {
      let localRowsData = JSON.parse(localStorage.getItem("trnDptLocationDao"));
      // console?.log(
      //   "PPPPPPPPPPPPPPPPPPPPPPPPP",
      //   JSON.parse(localStorage.getItem("trnDptLocationDao"))
      // );
      if (
        localRowsData?.length > 0 &&
        departmentNames?.length > 0 &&
        officeLocationList?.length > 0
      ) {
        console.log("__officeLocationList", officeLocationList);
        let _data = localRowsData?.map((val, i) => {
          return {
            ...val,
            locationNameEn: officeLocationList?.find(
              (obj) => obj?.id === val?.locationId
            )?.officeLocationName,
            locationNameMr: officeLocationList?.find(
              (obj) => obj?.id === val?.locationId
            )?.officeLocationNameMar,
            departmentNameEn: departmentNames?.find(
              (obj) => obj?.id === val?.dptId
            )?.department,
            departmentNameMr: departmentNames?.find(
              (obj) => obj?.id === val?.dptId
            )?.deptNameMr,
            userName: allUserNames?.find(
              (obj) => obj?.id === val?.concernPersonId
            )?.userName,
            userNameMr: allUserNames?.find(
              (obj) => obj?.id === val.concernPersonId
            )?.userNameMr,
          };
        });
        setRowsData(_data);
      }
    }
  }, [
    localStorage.getItem("trnDptLocationDao"),
    officeLocationList,
    departmentNames,
  ]);
  useEffect(() => {
    console.log("rowsData__", rowsData);
  }, rowsData);

  useEffect(() => {
    getOfficeLocation();
  }, []);

  // dept
  useEffect(() => {
    if (watch("departmentName")) {
      getOfficeLocationByDepartment(watch("departmentName"));
    }
  }, [watch("departmentName")]);

  // View
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {/** Title */}
          <div
            // style={{
            //   backgroundColor: "#0084ff",
            //   color: "white",
            //   fontSize: 19,
            //   marginTop: 30,
            //   marginBottom: 20,
            //   padding: 8,
            //   paddingLeft: 30,
            //   marginLeft: "50px",
            //   marginRight: "75px",
            //   borderRadius: 100,
            // }}

            style={{
              // backgroundColor: "#0084ff",
              backgroundColor: "#556CD6",
              // backgroundColor: "#1C39BB",
              height: "7vh",

              // #00308F
              // color: "white",

              fontSize: 19,
              marginTop: 30,
              marginBottom: 20,
              // marginBottom: "50px",
              // marginTop: ,
              // padding: 8,
              // paddingLeft: 30,
              // marginLeft: "50px",
              marginRight: "75px",
              borderRadius: 100,
            }}
          >
            <Typography
              style={{
                color: "white",
                lineHeight: "45px",
                textAlign: "center",
              }}
            >
              <strong>
                <FormattedLabel id="advocateDetails" />
              </strong>
            </Typography>
            {/* <strong style={{ display: "flex", justifyContent: "center",}}>
          <FormattedLabel id="advocateDetails" />
        </strong> */}
          </div>
          <ThemeProvider theme={theme}>
            <Grid container style={{ marginLeft: 30, padding: "10px" }}>
              {/** AdvocateName */}
              {/* <Grid item xl={4} lg={4} md={6} sm={6} xs={12}> */}
              <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
                {/* <FormControl
              variant="standard"
              sx={{ minWidth: 190 }}
              error={!!errors?.advocateName}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="advocateName" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field.value}
                    disabled={disabledButtonInputState}
                    onChange={(value) => field.onChange(value)}
                    label="Advocate Name"
                  >
                    {advocateNames &&
                      advocateNames
                        .slice()
                        .sort((a, b) =>
                          a.advocateName.localeCompare(b.advocateName)
                        )

                        .map((advocateName, index) => (
                          <MenuItem key={index} value={advocateName?.id}>
                            {language == "en"
                              ? advocateName?.advocateName
                              : advocateName?.advocateNameMr}
                          </MenuItem>
                        ))}
                  </Select>
                )}
                name="advocateName"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.advocateName ? errors?.advocateName?.message : null}
              </FormHelperText>
            </FormControl> */}

                {/* New Autocomplete  */}

                <FormControl
                  // variant="outlined"
                  error={!!errors?.advocateName}
                  sx={{ marginTop: 2 }}
                >
                  <Controller
                    name="advocateName"
                    control={control}
                    defaultValue={null}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        variant="standard"
                        id="controllable-states-demo"
                        // sx={{ width: 300 }}
                        onChange={(event, newValue) => {
                          onChange(newValue ? newValue.id : null); //! store Selected id -- dont change here
                        }}
                        value={
                          advocateNames?.find((data) => data?.id === value) ||
                          null
                        }
                        options={advocateNames.sort((a, b) =>
                          language === "en"
                            ? a.advocateName.localeCompare(b.advocateName)
                            : a.advocateNameMr.localeCompare(b.advocateNameMr)
                        )} //! api Data
                        getOptionLabel={(advocateName) =>
                          language == "en"
                            ? advocateName?.advocateName
                            : advocateName?.advocateNameMr
                        } //! Display name the Autocomplete
                        renderInput={(params) => (
                          //! display lable list
                          <TextField
                            fullWidth
                            {...params}
                            label={
                              language == "en" ? "Advocate Name" : "वकिलाचे नाव"
                            }
                            // variant="outlined"
                            variant="standard"
                          />
                        )}
                        disabled={disabledButtonInputState}
                      />
                    )}
                  />
                  <FormHelperText>
                    {errors?.advocateName
                      ? errors?.advocateName?.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              {/** OppenentAdvocateName */}
              <Grid
                item
                style={{
                  marginTop: "20px",
                }}
                xl={3}
                lg={3}
                md={6}
                sm={6}
                xs={12}
              >
                {/* <GoogleTranslationComponent
                  disabled={disabledButtonInputState}
                  // _key={"filedBy"}
                  // labelName={"filedBy"}
                  width="240px"
                  fieldName={"opponentAdvocate"}
                  updateFieldName={"opponentAdvocateMr"}
                  sourceLang={"en"}
                  targetLang={"mr"}
                  targetError={"opponentAdvocateMr"}
                  defaultValue={"Adv."}
                  // disabled={disabled}
                  label={<FormattedLabel id="opponentAdvocateEn" />}
                  error={!!errors.opponentAdvocate}
                  helperText={
                    errors?.opponentAdvocate
                      ? errors.opponentAdvocate.message
                      : null
                  }
                /> */}
                <TextField
                  autoFocus
                  disabled={disabledButtonInputState}
                  id="standard-basic"
                  // label={<FormattedLabel id="opponentAdvocateEn" />}
                  label={
                    language == "en"
                      ? "Opponent Advocate (In English)"
                      : "विरोधक वकील (इंग्रजी मध्ये) "
                  }
                  variant="standard"
                  {...register("opponentAdvocate")}
                  error={!!errors?.opponentAdvocate}
                  helperText={
                    errors?.opponentAdvocate
                      ? errors?.opponentAdvocate?.message
                      : null
                  }
                  defaultValue="Adv."
                />

                {/* New Transliteration  */}
                {/** 
            <Transliteration
              disabled={disabledButtonInputState}
              _key={"opponentAdvocate"}
              labelName={"opponentAdvocate"}
              fieldName={"opponentAdvocate"}
              updateFieldName={"opponentAdvocateMr"}
              sourceLang={"eng"}
              targetLang={"mar"}
              // disabled={disabled}
              label={<FormattedLabel id="opponentAdvocateEn" />}
              // error={!!errors.opponentAdvocate}
              // helperText={
              //   errors?.opponentAdvocate
              //     ? errors.opponentAdvocate.message
              //     : null
              // }

              error={!!errors.opponentAdvocate}
              helperText={
                errors?.opponentAdvocate
                  ? errors.opponentAdvocate.message
                  : null
              }
            />
          */}
              </Grid>
              {/* <Grid item xl={1} lg={1}></Grid> */}

              {/* <Grid
                item
                style={{
                  marginTop: "20px",
                }}
                xl={3}
                lg={3}
                md={6}
                sm={6}
                xs={12}
              >
                <Button
                  sx={{
                    marginTop: "6vh",
                    marginLeft: "1vw",
                    height: "4vh",
                    width: "9vw",
                  }}
                  onClick={() =>
                    caseDetailsApi(
                      watch("opponentAdvocate"),
                      "opponentAdvocateMr"
                    )
                  }
                >
                  <FormattedLabel id="translate" />
                </Button>
              </Grid> */}
              <Grid item xl={0.2} lg={0.2}></Grid>
              <Grid item xl={2.1} lg={2.1} md={6} sm={6} xs={12}>
                <Button
                  sx={{
                    marginTop: "40px",

                    height: "4vh",
                    width: "9vw",
                  }}
                  onClick={() =>
                    caseDetailsApi(
                      watch("opponentAdvocate"),
                      "opponentAdvocateMr",
                      "en"
                    )
                  }
                >
                  <FormattedLabel id="mar" />
                </Button>
                <Button
                  // style={{ flexDirection: "column" }}
                  sx={{
                    marginTop: "10px",
                    // marginLeft: "1vw",
                    height: "4vh",
                    width: "9vw",
                  }}
                  onClick={() =>
                    caseDetailsApi(
                      watch("opponentAdvocateMr"),
                      "opponentAdvocate",
                      "mr"
                    )
                  }
                >
                  <FormattedLabel id="eng" />
                </Button>
              </Grid>
              {/** OppenentAdovovateMr */}
              <Grid
                item
                style={{
                  marginTop: "20px",
                }}
                xl={3}
                lg={3}
                md={6}
                sm={6}
                xs={12}
              >
                {/* <GoogleTranslationComponent
                  disabled={disabledButtonInputState}
                  // _key={"filedBy"}
                  // labelName={"filedBy"}
                  width="240px"
                  fieldName={"opponentAdvocateMr"}
                  updateFieldName={"opponentAdvocate"}
                  sourceLang={"mr"}
                  targetLang={"en"}
                  targetError={"opponentAdvocate"}
                  label={
                    language == "en"
                      ? "Opponent Advocate (In Marathi)"
                      : "विरोधक वकील (मराठी मध्ये) "
                  }
                  error={!!errors.opponentAdvocateMr}
                  helperText={
                    errors?.opponentAdvocateMr
                      ? errors.opponentAdvocateMr.message
                      : null
                  }
                /> */}
                <TextField
                  disabled={disabledButtonInputState}
                  id="standard-basic"
                  // label={<FormattedLabel id="opponentAdvocateMr" />}
                  label={
                    language == "en"
                      ? "Opponent Advocate (In Marathi)"
                      : "विरोधक वकील (मराठी मध्ये) "
                  }
                  variant="standard"
                  {...register("opponentAdvocateMr")}
                  error={!!errors?.opponentAdvocateMr}
                  helperText={
                    errors?.opponentAdvocateMr
                      ? errors?.opponentAdvocateMr?.message
                      : null
                  }
                />

                {/** 
            <Transliteration
              disabled={disabledButtonInputState}
              _key={"opponentAdvocateMr"}
              labelName={"opponentAdvocateMr"}
              fieldName={"opponentAdvocateMr"}
              updateFieldName={"opponentAdvocate"}
              sourceLang={"mar"}
              targetLang={"eng"}
              // disabled={disabled}
              label={<FormattedLabel id="opponentAdvocateMr" />}
              error={!!errors.opponentAdvocateMr}
              helperText={
                errors?.opponentAdvocateMr
                  ? errors.opponentAdvocateMr.message
                  : null
              }
            />
          */}
              </Grid>
              {/* Location Name */}
              {/* <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <FormControl
              // variant="outlined"
              error={!!errors?.priviouseCourtName}
              sx={{ marginTop: 2 }}
            >
              <Controller
                name="locationName"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    variant="standard"
                    id="controllable-states-demo"
                    sx={{ width: 300 }}
                    onChange={(event, newValue) => {
                      onChange(newValue ? newValue.id : null);
                    }}
                    value={
                      officeLocationList?.find((data) => data?.id === value) ||
                      null
                    }
                    options={officeLocationList.sort((a, b) =>
                      language === "en"
                        ? a.officeLocationName.localeCompare(
                            b.officeLocationName
                          )
                        : a.officeLocationNameMar.localeCompare(
                            b.officeLocationNameMar
                          )
                    )} //! api Data
                    getOptionLabel={(officeLocation) =>
                      language == "en"
                        ? officeLocation?.officeLocationName
                        : officeLocation?.officeLocationNameMar
                    } //! Display name the Autocomplete
                    renderInput={(params) => (
                      //! display lable list
                      <TextField
                        fullWidth
                        {...params}
                        label={
                          language == "en" ? "Location Name" : "स्थानाचे नाव"
                        }
                        // variant="outlined"
                        variant="standard"
                      />
                    )}
                  />
                )}
              />
              <FormHelperText>
                {errors?.locationName ? errors?.locationName?.message : null}
              </FormHelperText>
            </FormControl>
          </Grid> */}

              {/* <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <FormControl
              // variant="outlined"
              error={!!errors?.locationName}
              sx={{ marginTop: 2 }}
            >
              <Controller
                name="locationName"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    value={selectedLocationsNames}
                    options={officeLocationList?.sort((a, b) =>
                      language === "en"
                        ? a.officeLocationName.localeCompare(
                            b.officeLocationName
                          )
                        : a.officeLocationNameMar.localeCompare(
                            b.officeLocationNameMar
                          )
                    )}
                    disabled={disabledButtonInputState}
                    disableCloseOnSelect
                    onChange={handleSelectedLocations}
                    getOptionLabel={(officeLocation) =>
                      language == "en"
                        ? officeLocation?.officeLocationName
                        : officeLocation?.officeLocationNameMar
                    }
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          // checked={selected}
                          checked={
                            // selected ||
                            selectedLocationsNames
                              ?.map((val) => val?.id)
                              ?.includes(option?.id)
                          }
                        />
                        {language == "en"
                          ? option?.officeLocationName
                          : option?.officeLocationNameMar}
                      </li>
                    )}
                    style={{ width: 500 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Location Name"
                        placeholder="Location Name"
                      />
                    )}
                  />
                )}
              />
              <FormHelperText>
                {errors?.locationName ? errors?.locationName?.message : null}
              </FormHelperText>
            </FormControl>
          </Grid> */}

              {/** depet name */}
              {/* <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <FormControl
              variant="standard"
              sx={{ minWidth: 190 }}
              error={!!errors?.department}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="deptName" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabledButtonInputState}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value), getUserList(value.target.value);
                    }}
                    label={<FormattedLabel id="deptName" />}
                  >
                    {departmentNames &&
                      departmentNames.map((deptName, index) => (
                        <MenuItem key={index} value={deptName?.id}>
                          {language == "en"
                            ? deptName?.department
                            : deptNameMr?.departmentMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="department"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.department ? errors?.department?.message : null}
              </FormHelperText>
            </FormControl> 
            </Grid>
            */}

              {/* New Autocomplete  */}
              {/* <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <FormControl
              // variant="outlined"
              error={!!errors?.department}
              sx={{ marginTop: 2 }}
            >
              <Controller
                name="department"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    variant="standard"
                    id="controllable-states-demo"
                    sx={{ width: 300 }}
                    onChange={(event, newValue) => {
                      //! store Selected id -- dont change here
                      console.log("NewVAlue", newValue);
                      setSelectedDepartment(newValue); // Store the selected department in state
                      // Also, clear the previously selected "Concern Person Name" as it is associated with the previous department.
                      onChange(null, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });

                      onChange(newValue ? newValue.id : null);
                    }}
                    value={
                      departmentNames?.find((data) => data?.id === value) ||
                      null
                    }
                    options={departmentNames.sort((a, b) =>
                      language === "en"
                        ? a.department?.localeCompare(b.department)
                        : a.deptNameMr?.localeCompare(b.deptNameMr)
                    )} //! api Data
                    getOptionLabel={(department) =>
                      language == "en"
                        ? department?.department
                        : department?.deptNameMr
                    } //! Display name the Autocomplete
                    renderInput={(params) => (
                      //! display lable list
                      <TextField
                        fullWidth
                        {...params}
                        label={
                          language == "en" ? " Department Name" : "विभागाचे नाव"
                        }
                        // variant="outlined"
                        variant="standard"
                      />
                    )}
                    disabled={disabledButtonInputState}
                  />
                )}
              />
              <FormHelperText>
                {errors?.department ? errors?.department?.message : null}
              </FormHelperText>
            </FormControl> 
            </Grid> */}

              {/* <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <FormControl
              // variant="outlined"
              error={!!errors?.department}
              sx={{ marginTop: 2 }}
            >
              <Controller
                name="department"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    value={selectedDepartmentNames}
                    options={departmentNames?.sort((a, b) =>
                      language === "en"
                        ? a.department?.localeCompare(b.department)
                        : a.deptNameMr?.localeCompare(b.deptNameMr)
                    )}
                    disableCloseOnSelect
                    disabled={disabledButtonInputState}
                    onChange={handleSelectedDepartments}
                    getOptionLabel={(option) => option?.department}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          // checked={selected}
                          checked={
                            // selected ||
                            selectedDepartmentNames
                              ?.map((val) => val?.id)
                              ?.includes(option?.id)
                          }
                        />
                        {option.department}
                      </li>
                    )}
                    style={{ width: 500 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Department Name"
                        placeholder="Advocate Name"
                      />
                    )}
                  />
                )}
              />
              <FormHelperText>
                {errors?.department ? errors?.department?.message : null}
              </FormHelperText>
            </FormControl>
          </Grid> */}
              {/**concerPersonEn */}
              {/* <Grid
            item
            style={{
              marginTop: "20px",
            }}
            xl={4}
            lg={4}
            md={6}
            sm={6}
            xs={12}
          >
            <FormControl
              disabled={disabledButtonInputState}
              sx={{ marginTop: 2 }}
              error={!!errors?.concernPerson}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="concernPerson" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Concern Person Name"
                  >
                    {userNames &&
                      userNames.map((userName, index) => (
                        <MenuItem key={index} value={userName.id}>
                          {language == "en"
                            ? userName?.userName
                            : userName?.userNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="concernPerson"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.concernPerson ? errors?.concernPerson?.message : null}
              </FormHelperText>
            </FormControl>
          </Grid> */}
              {/**concernPersonMr */}
              {/* <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
            <TextField
              disabled={disabledButtonInputState}
              id="standard-basic"
              label={<FormattedLabel id="concernPersonMr" />}
              variant="standard"
              {...register("concernPersonMr")}
              error={!!errors?.concernPersonMr}
              helperText={errors?.concernPersonMr ? errors?.concernPersonMr?.message : null}
            />
          </Grid> */}
              {/**applicationDate */}
              <Grid
                item
                xl={4}
                lg={4}
                md={6}
                sm={6}
                xs={12}
                // style={{ paddingLeft: "95px" }}
              >
                {/* <FormControl
              style={{ marginTop: 10 }}
              error={!!errors?.appearanceDate}
              disabled={disabledButtonInputState}
            >
              <Controller
                control={control}
                name="appearanceDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      disabled={disabledButtonInputState}
                      // minDate={Watch("fillingDate")}
                      // minDate={watch("fillingDate")}
                      inputFormat="DD/MM/YYYY"
                      label={
                        <span style={{ fontSize: 16 }}>
                          <FormattedLabel id="appearanceDate" />
                        </span>
                      }
                      value={field.value}
                      // onChange={(date) =>
                      //   field.onChange(moment(date).format("YYYY-MM-DD"))
                      // }
                      onChange={(date) => field.onChange(date)}
                      selected={field.value}
                      center
                      renderInput={(params) => (
                        <TextField {...params} size="small" />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>
                {errors?.appearanceDate
                  ? errors?.appearanceDate?.message
                  : null}
              </FormHelperText>
            </FormControl> */}

                <FormControl
                  style={{ backgroundColor: "white" }}
                  error={errors.appearanceDate}
                >
                  <Controller
                    control={control}
                    name="appearanceDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          disabled={disabledButtonInputState}
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 16 }}>
                              <FormattedLabel id="appearanceDate" />
                            </span>
                          }
                          value={field.value || null}
                          // onChange={(date) => field.onChange(date)}
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
                    {errors?.appearanceDate
                      ? errors.appearanceDate.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container style={{ marginLeft: 70, padding: "10px" }}>
              {/* Department Name */}
              <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
                <FormControl
                  // variant="outlined"
                  error={!!errors?.departmentName}
                  sx={{ marginTop: 2 }}
                >
                  <Controller
                    name="departmentName"
                    control={control}
                    defaultValue={null}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        variant="standard"
                        id="controllable-states-demo"
                        disabled={disabledButtonInputState}
                        sx={{ width: 300 }}
                        onChange={(event, newValue) => {
                          onChange(newValue ? newValue.id : null);
                        }}
                        value={
                          departmentNames?.find((data) => data?.id === value) ||
                          null
                        }
                        options={departmentNames?.sort((a, b) =>
                          language === "en"
                            ? a.department?.localeCompare(b?.department)
                            : a.deptNameMr?.localeCompare(b?.deptNameMr)
                        )} //! api Data
                        getOptionLabel={(filteredDepartment) =>
                          language == "en"
                            ? filteredDepartment?.department
                            : filteredDepartment?.deptNameMr
                        } //! Display name the Autocomplete
                        renderInput={(params) => (
                          //! display lable list
                          <TextField
                            fullWidth
                            {...params}
                            label={
                              language == "en"
                                ? "Department Name"
                                : "विभागाचे नाव"
                            }
                            // variant="outlined"
                            variant="standard"
                          />
                        )}
                      />
                    )}
                  />
                  <FormHelperText>
                    {errors?.departmentName
                      ? errors?.departmentName?.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              {/* Location Name */}
              <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
                <FormControl
                  // variant="outlined"
                  error={!!errors?.locationName}
                  sx={{ marginTop: 2 }}
                >
                  <Controller
                    name="locationName"
                    control={control}
                    defaultValue={null}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        variant="standard"
                        id="controllable-states-demo"
                        disabled={disabledButtonInputState}
                        sx={{ width: 300 }}
                        onChange={(event, newValue) => {
                          onChange(newValue ? newValue.officeLocation : null);
                        }}
                        value={
                          officeLocationList1?.find(
                            (data) => data?.officeLocation === value
                          ) || null
                        }
                        options={
                          officeLocationList1
                          //   ?.sort((a, b) =>
                          //   language === "en"
                          //     ? a.officeLocationName.localeCompare(
                          //         b.officeLocationName
                          //       )
                          //     : a.officeLocationNameMar.localeCompare(
                          //         b.officeLocationNameMar
                          //       )
                          // )
                        } //! api Data
                        getOptionLabel={(officeLocation) =>
                          language == "en"
                            ? officeLocation?.officeLocationName
                            : officeLocation?.officeLocationNameMar
                        } //! Display name the Autocomplete
                        renderInput={(params) => (
                          //! display lable list
                          <TextField
                            fullWidth
                            {...params}
                            label={
                              language == "en"
                                ? "Location Name *"
                                : "स्थानाचे नाव "
                            }
                            // variant="outlined"
                            variant="standard"
                          />
                        )}
                      />
                    )}
                  />
                  <FormHelperText>
                    {errors?.locationName
                      ? errors?.locationName?.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid
                item
                style={{
                  marginTop: "20px",
                }}
                xl={4}
                lg={4}
                md={6}
                sm={6}
                xs={12}
              >
                <FormControl
                  disabled={disabledButtonInputState}
                  sx={{ marginTop: 2 }}
                  error={!!errors?.concernPerson}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {/* Concern Person */}
                    <FormattedLabel id="concernPerson" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        // disabled={watch("departmentName")!=null&&watch("departmentName")!=undefined&&watch("departmentName")!=""?true:false}
                        onChange={(value) => field.onChange(value)}
                        label="Concern Person Name"
                      >
                        {userNames &&
                          userNames.map((userName, index) => (
                            <MenuItem key={index} value={userName.id}>
                              {/* {userName.userName} */}
                              {language == "en"
                                ? userName?.userName
                                : userName?.userNameMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="concernPerson"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.concernPerson
                      ? errors?.concernPerson?.message
                      : null}
                  </FormHelperText>
                </FormControl>
                <Button
                  style={{
                    marginLeft: "16px",
                  }}
                  sx={{
                    marginTop: "30px",
                  }}
                  type="Button"
                  disabled={
                    watch("departmentName") &&
                    watch("locationName") &&
                    watch("concernPerson")
                      ? false
                      : true
                  }
                  variant="contained"
                  size="small"
                  onClick={() => {
                    addDeptLocationList();
                  }}
                >
                  {locationDptButton === "Edit" ? (
                    <>{language === "en" ? "Edit" : "एडिट करा"}</>
                  ) : (
                    <FormattedLabel id="add" />
                  )}
                </Button>
              </Grid>

              {/* <Grid
            item
            xs={1}
            sx={{
              marginTop: "55px",
            }}
            // style={{
            //   display: "flex",
            //   justifyContent: "center",
            //   alignItems: "center",
            // }}
          >
            <Button
              type="Button"
              disabled={
                watch("departmentName") && watch("locationName") ? false : true
              }
              variant="contained"
              size="small"
              onClick={() => {
                addDeptLocationList();
              }}
            >
              {locationDptButton === "Edit" ? (
                <>{language === "en" ? "Edit" : "एडिट करा"}</>
              ) : (
                <FormattedLabel id="addMore" />
              )}
            </Button>
          </Grid> */}
            </Grid>
            <Grid container sx={{ padding: "10px" }}>
              <DataGrid
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
                autoHeight={true}
                pagination
                getRowId={(row) => row.mySrNo}
                paginationMode="server"
                rows={
                  rowsData == [] || rowsData == undefined || rowsData == ""
                    ? []
                    : rowsData
                        ?.filter((obj) => obj?.activeFlag !== "N")
                        ?.map((obj, i) => {
                          return {
                            ...obj,
                            mySrNo: i + 1,
                          };
                        })
                }
                columns={_col}
                onPageChange={(_data) => {}}
                onPageSizeChange={(_data) => {}}
              />
            </Grid>
          </ThemeProvider>
        </>
      )}
    </>
  );
};

export default AdvocateDetails;
