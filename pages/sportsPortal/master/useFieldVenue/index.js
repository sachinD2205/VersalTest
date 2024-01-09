import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { GridToolbar } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/router";
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
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import URLS from "../../../../URLS/urls";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import styles from "../../../../styles/sportsPortalStyles/facilityCheck.module.css";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/sportsPortalSchema/venueSchema";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// func
const Index = () => {
  const methods = useForm({
    defaultValues: {},
    mode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });

  const {
    watch,
    setValue,
    getValues,
    register,
    handleSubmit,
    control,
    unregister,
    reset,
    formState: { errors },
  } = methods;

  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   methods,
  //   watch,
  //   reset,
  //   setValue,
  //   getValues,
  //   formState: { errors },
  // } = useForm({
  //   criteriaMode: "all",
  //   mode: "onChange",
  // });

  const [temp1, setTemp1] = useState();
  const router = useRouter();
  const [disableKadhnariState, setDisableKadhnariState] = useState(true);
  const [btnSaveText, setBtnSaveText] = useState("save");
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [numberSection, setNumberSection] = useState();
  const [numberCourt, setNumberCourt] = useState();
  const [numberCourtt, setNumberCourtt] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [slideChecked, setSlideChecked] = useState(false);
  const [zoneNames, setZoneNames] = useState([]);
  const [unit, setUnit] = useState([]);
  // const [departments, setDepartments] = useState([]);
  // const [subDepartments, setSubDepartments] = useState([]);
  const [facilityTypess, setFacilityTypess] = useState([]);
  const [facilityNames, setFacilityNames] = useState([]);
  const [selectedFacilityType, setSelectedFacilityType] = useState();
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [typeName, setTypeName] = useState([]);
  const [facilitySubType, setFacilitySubType] = useState([]);
  // const [btnValue, setButtonValue] = useState(false);

  const language = useSelector((state) => state.labels.language);

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      name: "sectionLst",
      control,
    },
  );

  // const { fields: sectionFields } = useFieldArray({
  //   control,
  //   name: "sectionLst",
  // });

  useEffect(() => {
    console.log("typeName:-", typeName);

    // fields?.forEach((dhingana, index) =>
    //   reset(setValue(`sectionLst.${index}.facilityType`, dhingana.facilityName))
    // );

    // `sectionLst.${index}.facilityType`
  }, [typeName]);

  useEffect(() => {
    setValue("sectionLst", []);
    fields.leng;
  }, [editButtonInputState]);

  const appendUI = () => {
    append({
      facilityType: "",
      facilityName: "",
      unit: "",
      capacity: "",
    });
  };

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  // useEffect - Reload On update , delete ,Saved on refresh

  useEffect(() => {
    getData();
  }, [zoneNames, wardNames, fetchData]);

  // useEffect(() => {
  //   if (router.query.pageMode != "Add") setTemp1(getValues("zoneName"));
  // }, [getValues("zoneName")]);

  useEffect(() => {
    console.log("shree");
    if (temp1) getWardNames();
  }, [temp1]);

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

  // wardKeys
  const [wardNames, setWardNames] = useState([]);

  // getWardKeys
  const getWardNames = () => {
    axios
      .get(
        `${
          URLS.CFCURL
        }/master/zoneAndWardLevelMapping/getWardByDepartmentId?departmentId=${2}&zoneId=${temp1}`,
      )
      .then((r) => {
        setWardNames(
          r.data.map((row) => ({
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

  // useEffect - Reload On update , delete ,Saved on refresh
  // useEffect(() => {
  //   getAllDetails();
  // }, [
  //   zoneNames,
  //   wardNames,
  //   departments,
  //   subDepartments,
  //   facilityNames,
  //   fetchData,
  //   facilityTypess,
  // ]);

  useEffect(() => {
    getAllTypes();
    getUnit();
    getFacilityTypes();
    getFacilityName();
  }, []);

  const [btnValue, setButtonValue] = useState(false);

  // Write a function to load facility subtypes from facility type
  const loadSubTypes = (facilityId) => {
    // call api and get the result
    // set the result in state

    axios
      .get(
        `${URLS.SPURL}/facilityName/getSubTypeByFacility?&facilityType=${facilityId}`,
      )
      .then((r) => {
        console.log("sagar-r.data", r.data);

        // Append r.data in facilitySubType | if empty add directly else append to the existing list
        if (facilitySubType.length == 0) {
          console.log("sagar-r.data.length", facilitySubType.length);
          setFacilitySubType(r.data);
        } else {
          console.log("sagar-r.data.length", facilitySubType.length);
          setFacilitySubType([...facilitySubType, ...r.data]);
        }

        console.log("sagar-facilitySubType", facilitySubType);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // Disable Add Button After Three Wintess Add
  const buttonValueSetFun = () => {
    if (getValues(`sectionLst.length`) >= 4) {
      setButtonValue(true);
    } else {
      appendUI();
      // reset();
      setButtonValue(false);
    }
  };
  // const buttonValueSetFun = (numberSection) => {
  //   console.log("91", numberSection);
  //   // if (getValues(`section.length`) >= 4) {
  //   // if (numberSection== 1) {
  //   if (numberSection === undefined) {
  //     appendUI();
  //   }
  //   if (numberSection == 1) {
  //     appendUI();
  //     appendUI();
  //   }
  //   if (numberSection == 2) {
  //     appendUI();
  //     appendUI();
  //     appendUI();
  //   }
  //   if (numberSection == 3) {
  //     appendUI();
  //     appendUI();
  //     appendUI();
  //     appendUI();
  //   }
  //   if (numberSection == 4) {
  //     appendUI();
  //     appendUI();
  //     appendUI();
  //     appendUI();
  //     appendUI();
  //   }
  // };

  const getTypeNameKeys = (value, index) => {
    console.log("sagar-valueforfacilitytype", value);
    loadSubTypes(value);
    alert("onclick dropdown 1");
    // if (getValues(`excavationData.${index}.zoneId`)) {
    // console.log(
    //   "66",
    //   getValues(`sectionLst.${index}.facilityType`),
    //   "index",
    //   index
    // );
    // let facilityTypeId = getValues(`sectionLst.${index}.facilityType`);
    axios
      .get(
        `${URLS.SPURL}/facilityName/getSubTypeByFacility?&facilityType=${value}`,
      )
      .then((r) => {
        console.log(" ", r.data);

        setTypeName(r.data);

        // let ttttt = typeName?.filter((t) => t?.index !== index);
        // console.log("typeName:::", typeName);
        // console.log("ttttt:", ttttt);
        // let final = [
        //   ...ttttt,
        //   {
        //     index: index,
        //     value: r?.data?.map((row) => ({
        //       // ...row,
        //       id: row?.id,
        //       facilityName: row.facilityName,
        //       facilityNameMr: row.facilityNameMr,
        //       facilityType: value,
        //     })),
        //   },
        // ];
        // let final = {
        //   index: index,
        //   value: r?.data?.map((row) => ({
        //     // ...row,
        //     id: row?.id,
        //     facilityName: row.facilityName,
        //     facilityNameMr: row.facilityNameMr,
        //     facilityType: value,
        //   })),
        // };
        // console.log("final:", final);
        // // setTypeName((prev) => [...prev, final]);
        // setTypeName((prev) =>
        //   editButtonInputState // false for new entry
        //     ? prev[index]
        //       ? prev.map((j, i) => (i == index ? final : j))
        //       : [...prev, final]
        //     : [...prev, final]
        // );
        // setTypeName(final);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    // let facilityNameId = getValues(`sectionLst.${index}.facilityName`);
    // console.log("12313123", facilityNameId);
    // console.log("77", getValues(`sectionLst.${index}.facilityName`));

    // }
  };

  // useEffect(() => {
  //   console.log("facilityType",facilityType);
  //   getTypeNameKeys(getValues("facilityType"));
  // }, [watch("facilityType")]);

  const getFacilityName = () => {
    axios
      .get(`${URLS.SPURL}/facilityName/getAll`)
      .then((r) => {
        setFacilityNames(
          r.data.facilityName.map((row) => ({
            id: row.id,
            facilityName: row.facilityName,
            facilityNameMr: row.facilityNameMr,
            facilityType: row.facilityType,
          })),
        );

        console.log("sagar:facilityNamesNew", facilityNames);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getFacilityTypes = () => {
    axios
      .get(`${URLS.SPURL}/facilityType/getAll`)
      .then((r) => {
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

  useEffect(() => {
    console.log("DataArray: ", fields);
  }, [fields]);

  const getUnit = () => {
    // axios.get(`${URLS.CFCURL}/master/zone/getAll`).
    axios
      .get(`${URLS.SPURL}/unit/getAll`)
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
    // axios.get(`${URLS.CFCURL}/master/zone/getAll`).
    axios
      .get(`${URLS.SPURL}/master/zone/getAll`)
      .then((r) => {
        console.log(r.data.zone);
        setZoneNames(
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

  // const getDepartments = () => {
  //   axios.get(`${URLS.CFCURL}/master/department/getAll`).then((r) => {
  //     setDepartments(
  //       r.data.department.map((row) => ({
  //         id: row.id,
  //         department: row.department,
  //       })),
  //     );
  //   });
  // };

  // const getSubDepartments = () => {
  //   axios.get(`${URLS.CFCURL}/master/subDepartment/getAll`).then((r) => {
  //     setSubDepartments(
  //       r.data.subDepartment.map((row) => ({
  //         id: row.id,
  //         subDepartmentName: row.subDepartment,
  //         department: row.department,
  //       })),
  //     );
  //   });
  // };

  //Delete By ID (SweetAlert)

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
  //           `${URLS.SPURL}/venueMaster/discardVenueMaster/${value}`
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
  //   console.log("DATA:", fromData);

  //   if (btnSaveText === "Save") {
  //     console.log("Post -----");
  //     const tempData = axios
  //       .post(`${URLS.SPURL}/venueMaster/getAll`, fromData)
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
  //         `${urls.BaseURL}/venueMaster/saveVenueMaster/?id=${id}`,

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
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(
              `${URLS.SPURL}/venueMasterSection/saveVenueMasterSection`,
              body,
            )

            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });

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
      swal({
        title: "Activate?",
        text: "Are you sure you want to activate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(
              `${URLS.SPURL}/venueMasterSection/saveVenueMasterSection`,
              body,
            )
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                // getPaymentRate();
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
    }
  };
  // Get Table - Data
  const getData = (_pageSize = 10, _pageNo = 0, _sortDir = "desc") => {
    axios
      .get(`${URLS.SPURL}/venueMasterSection/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortDir: _sortDir,
        },
      })
      .then((r) => {
        console.log(";r", r);
        let result = r.data.venueSection;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log("44");
          return {
            // r.data.map((r, i) => ({
            ...r,
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1,
            venueId: i + 1,
            capacity: r.capacity,
            facilityTypeId: r.facilityTypeId,
            geoCode: r.geoCode,
            zoneNameTxt: zoneNames?.find((obj) => obj?.id === r.zoneName)
              ?.zoneName,
            zoneNameMr: zoneNames?.find((obj) => obj?.id === r.zoneName)
              ?.zoneNameMr,
            wardNameTxt: wardNames?.find((obj) => obj?.id === r.wardName)
              ?.wardName,
            wardNameMr: wardNames?.find((obj) => obj?.id === r.wardName)
              ?.wardNameMr,
            unitTxt: unit?.find((obj) => obj?.id === r.unit)?.unit,
            unitMr: unit?.find((obj) => obj?.id === r.unitMr)?.unitMr,

            facilityTypeTxt: facilityTypess?.find(
              (obj) => obj?.id === r.facilityType,
            )?.facilityType,
            facilityNameTxt: facilityNames?.find(
              (obj) => obj?.id === r.facilityName,
            )?.facilityName,
            facilityNameMr: facilityNames?.find(
              (obj) => obj?.id === r.facilityName,
            )?.facilityNameMr,
            facilityTypeMr: facilityTypess?.find(
              (obj) => obj?.id === r.facilityType,
            )?.facilityTypeMr,

            // facilityType: r.facilityType,
            facilityPrefix: r.facilityPrefix,
            venue: r.venue,
            venueMr: r.venueMr,
            contactPersonName: r.contactPersonName,
            contactPersonNameMr: r.contactPersonNameMr,
            contactPersonMobileNo: r.contactPersonMobileNo,
            address: r.address,
            addressMr: r.addressMr,

            facilityId: r.facilityId,
            remark: r.remark,
            remarkMr: r.remarkMr,
            sectionLst: r.sectionLst,
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });
        setDataSource([..._res]);
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
    // Save - DB
    let _body = {
      ...fromData,
      // activeFlag: btnSaveText === 'update' ? null : fromData.activeFlag,
    };
    if (btnSaveText === "Save") {
      const tempData = axios
        .post(`${URLS.SPURL}/venueMasterSection/saveVenueMasterSection`, _body)
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
      // const tempData = axios
      axios
        .post(`${URLS.SPURL}/venueMasterSection/saveVenueMasterSection`, _body)
        .then((res) => {
          console.log("res", res);
          if (res.status == 200) {
            fromData.id
              ? sweetAlert(
                  "Updated!",
                  "Record Updated successfully !",
                  "success",
                )
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            getData();
            // setButtonInputState(false);
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
    setTypeName([]);
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
    setTypeName([]);
    reset({
      ...resetValuesCancell,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    venue: "",
    geoCode: "",
    department: "",
    subDepartment: "",
    facilityType: "",
    facilityName: "",
    wardName: "",
    zoneName: "",
    venueId: "",
    remark: "",
    capacity: "",
    sectionLst: [],
  };

  // Reset Values Exit
  const resetValuesExit = {
    venue: "",
    geoCode: "",
    department: "",
    subDepartment: "",
    facilityType: "",
    facilityName: "",
    wardName: "",
    zoneName: "",
    venueId: "",
    remark: "",
    capacity: "",
    sectionLst: [],
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
    },

    {
      // field: "zoneName",
      field: language === "en" ? "zoneNameTxt" : "zoneNameMr",
      headerName: <FormattedLabel id="zone" />,
      //type: "number",
      flex: 1,
    },

    {
      field: "venue",
      // field: language === "en" ? "venue" : "venueMr",
      headerName: <FormattedLabel id="venue" />,

      flex: 1,
    },
    {
      field: "venueMr",
      // field: language === "en" ? "venue" : "venueMr",
      headerName: <FormattedLabel id="venueMr" />,
      // headerName: "Venue Name",
      //type: "number",
      flex: 1,
    },

    {
      field: "contactPersonName",
      headerName: <FormattedLabel id="contactPersonName" />,
      //type: "number",
      flex: 1,
    },

    {
      field: "contactPersonMobileNo",
      headerName: <FormattedLabel id="contactPersonMobileNo" />,
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
          <Box>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                console.log("sagar:facilityNamesbeforeedit", facilityNames);

                console.log("JatayKa: ", params.row);
                setBtnSaveText("update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);

                // reset({
                //   ...params.row,
                // });
                setTemp1(params?.row?.zoneName);
                // watch("sectionLst").forEach((x, i) =>
                //   getTypeNameKeys(x.facilityType, i)
                // );
                params?.row?.sectionLst?.forEach((x, i) =>
                  getTypeNameKeys(x.facilityType, i),
                );
                reset({
                  ...params.row,
                });

                setValue(
                  "sectionLst",
                  watch("sectionLst").map((x, i) => {
                    return {
                      ...x,
                      facilityName: typeName?.find(
                        (t) => x.facilityName == t.id,
                      )?.id,
                    };
                  }),
                );

                //Old code
                // setValue(
                //   "sectionLst",
                //   params?.row?.sectionLst?.map((x, i) => {
                //     console.log("obj:", i, "::-", x);
                //     getTypeNameKeys(x.facilityType, i);
                //     return {
                //       ...x,
                //     };
                //   })
                // );
                console.log("sectionLst::", watch("sectionLst"));

                // getTypeNameKeys(params.row.facilityType, index);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>

            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("update"),
                  setID(params.row.id),
                  setSlideChecked(true);
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
          </Box>
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
        sx={{ marginLeft: 5, marginRight: 5, marginTop: 5, marginBottom: 5 }}
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
          <strong>{<FormattedLabel id="venueMaster" />}</strong>
        </div>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
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
                    }}
                  >
                    <strong>
                      <FormattedLabel id="venueDetails" />
                    </strong>
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
                    {/* zone */}
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <FormControl variant="standard" error={!!errors.zoneName}>
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="zone" required />
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
                                console.log("Zone Key: ", value.target.value);
                                setTemp1(value.target.value);
                              }}
                              label="zoneName"
                            >
                              {zoneNames &&
                                zoneNames.map((zoneName, index) => {
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
                    </Grid>

                    {/* ward */}
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <FormControl variant="standard" error={!!errors.wardName}>
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="ward" required />
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
                              {wardNames &&
                                wardNames.map((wardName, index) => {
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
                    </Grid>

                    {/* Venue (English) */}
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      {/* <TextField
                        sx={{ width: 220 }}
                        id="standard-basic"
                        label={<FormattedLabel id="venue" />}
                        variant="standard"
                        {...register("venue")}
                        error={!!errors.venue}
                        helperText={
                          errors?.venue ? "Venue Name is Required !!!" : null
                        }
                      /> */}
                      <Transliteration
                        _key={"venue"}
                        labelName={"venue"}
                        fieldName={"venue"}
                        updateFieldName={"venueMr"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        variant="standard"
                        label={<FormattedLabel id="venue" required />}
                        InputLabelProps={{
                          shrink: watch("venue") ? true : false,
                        }}
                        width={220}
                        error={!!errors.venue}
                        helperText={errors?.venue ? errors.venue.message : null}
                      />
                    </Grid>

                    {/* Venue (Marathi) */}
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <TextField
                        sx={{ width: 220 }}
                        id="standard-basic"
                        label={<FormattedLabel id="venueMr" required />}
                        variant="standard"
                        {...register("venueMr")}
                        InputLabelProps={{
                          shrink: watch("venueMr") ? true : false,
                        }}
                        error={!!errors.venueMr}
                        helperText={
                          errors?.venueMr
                            ? "Must be only characters / फक्त शब्दात!!"
                            : null
                        }
                      />
                    </Grid>

                    {/* Venue Address (English) */}
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      {/* <TextField
                        sx={{ width: 220 }}
                        id="standard-basic"
                        label={<FormattedLabel id="venueAddressEn" />}
                        variant="standard"
                        {...register("address")}
                        error={!!errors.venue}
                        helperText={
                          errors?.venue ? "Venue Name is Required !!!" : null
                        }
                      /> */}

                      <Transliteration
                        _key={"address"}
                        labelName={"address"}
                        fieldName={"address"}
                        updateFieldName={"addressMr"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        variant="standard"
                        label={<FormattedLabel id="venueAddressEn" required />}
                        InputLabelProps={{
                          shrink: watch("venue") ? true : false,
                        }}
                        width={220}
                        error={!!errors.address}
                        helperText={
                          errors?.address ? errors.address.message : null
                        }
                      />
                    </Grid>

                    {/* Venue Address (Marathi) */}
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <TextField
                        sx={{ width: 220 }}
                        id="standard-basic"
                        label={<FormattedLabel id="venueAddressMr" required />}
                        variant="standard"
                        {...register("addressMr")}
                        InputLabelProps={{
                          shrink: watch("addressMr") ? true : false,
                        }}
                        error={!!errors.addressMr}
                        helperText={
                          errors?.addressMr
                            ? "Must be only characters / फक्त शब्दात!!"
                            : null
                        }
                      />
                    </Grid>
                    {/* Contact Person Name (English) */}
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      {/* <TextField
                        sx={{ width: 220 }}
                        id="standard-basic"
                        label={<FormattedLabel id="contactPersonName" />}
                        variant="standard"
                        {...register("contactPersonName")}
                        error={!!errors.venue}
                        helperText={
                          errors?.venue ? "Venue Name is Required !!!" : null
                        }
                      /> */}

                      <Transliteration
                        _key={"contactPersonName"}
                        labelName={"contactPersonName"}
                        fieldName={"contactPersonName"}
                        updateFieldName={"contactPersonNameMr"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        variant="standard"
                        label={
                          <FormattedLabel id="contactPersonName" required />
                        }
                        InputLabelProps={{
                          shrink: watch("contactPersonName") ? true : false,
                        }}
                        width={220}
                        error={!!errors.contactPersonName}
                        helperText={
                          errors?.contactPersonName
                            ? errors.contactPersonName.message
                            : null
                        }
                      />
                    </Grid>

                    {/* Contact Person Name (Marathi) */}
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <TextField
                        sx={{ width: 220 }}
                        id="standard-basic"
                        label={
                          <FormattedLabel id="contactPersonNameMr" required />
                        }
                        variant="standard"
                        {...register("contactPersonNameMr")}
                        InputLabelProps={{
                          shrink: watch("contactPersonNameMr") ? true : false,
                        }}
                        error={!!errors.contactPersonNameMr}
                        helperText={
                          errors?.contactPersonNameMr
                            ? "Must be only characters / फक्त शब्दात!!"
                            : null
                        }
                      />
                    </Grid>

                    {/* Contact Person Mobile Number */}
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <TextField
                        sx={{ width: 220 }}
                        id="standard-basic"
                        label={
                          <FormattedLabel id="contactPersonMobileNo" required />
                        }
                        variant="standard"
                        {...register("contactPersonMobileNo")}
                        error={!!errors.contactPersonMobileNo}
                        helperText={
                          errors?.contactPersonMobileNo
                            ? "Contact Person mobile number is Required !!!"
                            : null
                        }
                      />
                    </Grid>
                    {/* Remark (English) */}
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      {/* <TextField
                        sx={{ width: 220 }}
                        id="standard-basic"
                        label={<FormattedLabel id="remark" />}
                        variant="standard"
                        {...register("remark")}
                        error={!!errors.venue}
                        helperText={
                          errors?.venue ? "Remark is Required !!!" : null
                        }
                      /> */}
                      <Transliteration
                        _key={"remark"}
                        labelName={"remark"}
                        fieldName={"remark"}
                        updateFieldName={"remarkMr"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        variant="standard"
                        label={<FormattedLabel id="remark" required />}
                        InputLabelProps={{
                          shrink: watch("remark") ? true : false,
                        }}
                        width={220}
                        error={!!errors.remark}
                        helperText={
                          errors?.remark ? errors.remark.message : null
                        }
                      />
                    </Grid>

                    {/* Remark (Marathi) */}
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <TextField
                        sx={{ width: 220 }}
                        id="standard-basic"
                        label={<FormattedLabel id="remarkMr" required />}
                        variant="standard"
                        {...register("remarkMr")}
                        InputLabelProps={{
                          shrink: watch("remarkMr") ? true : false,
                        }}
                        error={!!errors.remarkMr}
                        helperText={
                          errors?.remarkMr
                            ? "Must be only characters / फक्त शब्दात!!"
                            : null
                        }
                      />
                    </Grid>
                  </Grid>
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
                    }}
                  >
                    <strong>
                      <FormattedLabel id="sectionDetails" />
                    </strong>
                  </div>
                  <div className={styles.addMultipleMember}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<AddIcon />}
                      onClick={() => buttonValueSetFun()}
                    >
                      {<FormattedLabel id="addSection" />}
                    </Button>
                  </div>
                  <div className={styles.addSection}>
                    <div>
                      {fields.map((sectionLst, index) => {
                        return (
                          <>
                            {/* <div className={styles.addSection}> */}
                            <div className={styles.addMultiple}>
                              <div className={styles.sectionNumber}>
                                <h3>
                                  Section
                                  {`: ${index + 1}`}
                                </h3>
                              </div>

                              <div>
                                {/* Facility Type */}
                                <FormControl
                                  variant="standard"
                                  error={!!errors.facilityType}
                                >
                                  <InputLabel id="demo-simple-select-standard-label">
                                    <FormattedLabel id="facilityType" />
                                  </InputLabel>
                                  <Controller
                                    render={({ field }) => (
                                      <Select
                                        sx={{ minWidth: 200 }}
                                        labelId="demo-simple-select-standard-label"
                                        id="demo-simple-select-standard"
                                        value={field.value}
                                        onChange={(value) => {
                                          field.onChange(value);
                                          getTypeNameKeys(
                                            value.target.value,
                                            index,
                                          );
                                        }}
                                        label="facilityType"
                                      >
                                        {facilityTypess &&
                                          facilityTypess.map(
                                            (facilityType, index) => (
                                              <MenuItem
                                                key={index}
                                                value={facilityType.id}
                                              >
                                                {language == "en"
                                                  ? facilityType?.facilityType
                                                  : facilityType?.facilityTypeMr}
                                              </MenuItem>
                                            ),
                                          )}
                                      </Select>
                                    )}
                                    name={`sectionLst.${index}.facilityType`}
                                    control={control}
                                    defaultValue={""}
                                  />
                                  <FormHelperText>
                                    {errors?.facilityType
                                      ? errors.facilityType.message
                                      : null}
                                  </FormHelperText>
                                </FormControl>
                              </div>

                              <div>
                                {/* Facility Name - to be checked Drop Down*/}
                                <FormControl
                                  variant="standard"
                                  error={!!errors.facilityName}
                                >
                                  <InputLabel id="demo-simple-select-standard-label">
                                    <FormattedLabel id="facilityName" />
                                  </InputLabel>
                                  <Controller
                                    render={({ field }) => (
                                      // Select not showing the default value, analyse code below this

                                      <Select
                                        onChange={(value) => {
                                          field.onChange(value);
                                        }}
                                        value={field.value}
                                        sx={{ width: 200 }}
                                        variant="standard"
                                      >
                                        {
                                          // load menu items from facilityNames matching the facilityType to 3
                                          fields[index].facilityType
                                            ? facilityNames
                                                .filter(
                                                  (facilityName) =>
                                                    facilityName.facilityType ==
                                                    fields[index].facilityType,
                                                )
                                                .map((facilityName, index) => (
                                                  <MenuItem
                                                    key={index}
                                                    value={facilityName.id}
                                                  >
                                                    {language == "en"
                                                      ? facilityName?.facilityName
                                                      : facilityName?.facilityNameMr}
                                                  </MenuItem>
                                                ))
                                            : // load from typename
                                              typeName?.map(
                                                (typeName, index) => (
                                                  <MenuItem
                                                    key={index}
                                                    value={typeName.id}
                                                  >
                                                    {language == "en"
                                                      ? typeName?.facilityName
                                                      : typeName?.facilityNameMr}
                                                  </MenuItem>
                                                ),
                                              )
                                        }
                                      </Select>
                                    )}
                                    name={`sectionLst.${index}.facilityName`}
                                    control={control}
                                  />
                                  <FormHelperText>
                                    {errors?.facilityName
                                      ? errors.facilityName.message
                                      : null}
                                  </FormHelperText>
                                </FormControl>
                              </div>

                              <div>
                                {/* Unit */}
                                <FormControl
                                  variant="standard"
                                  error={!!errors.unit}
                                >
                                  <InputLabel id="demo-simple-select-standard-label">
                                    <FormattedLabel id="unit" />
                                  </InputLabel>
                                  <Controller
                                    render={({ field }) => (
                                      <Select
                                        sx={{ minWidth: 200 }}
                                        labelId="demo-simple-select-standard-label"
                                        id="demo-simple-select-standard"
                                        value={field.value}
                                        onChange={(value) =>
                                          field.onChange(value)
                                        }
                                        label="unit"
                                      >
                                        {unit &&
                                          unit.map((unit, index) => {
                                            return (
                                              <MenuItem
                                                key={index}
                                                value={unit.id}
                                              >
                                                {language == "en"
                                                  ? unit?.unit
                                                  : unit?.unitMr}
                                              </MenuItem>
                                            );
                                          })}
                                      </Select>
                                    )}
                                    name={`sectionLst.${index}.unit`}
                                    control={control}
                                    defaultValue=""
                                  />
                                  <FormHelperText>
                                    {errors?.unit ? errors.unit.message : null}
                                  </FormHelperText>
                                </FormControl>
                              </div>

                              <div>
                                {/* Capacity */}
                                <TextField
                                  sx={{ width: 200 }}
                                  id="standard-basic"
                                  label={<FormattedLabel id="capacity" />}
                                  variant="standard"
                                  {...register(`sectionLst.${index}.capacity`)}
                                  error={!!errors.capacity}
                                  helperText={
                                    errors?.capacity
                                      ? "Capacity is Required !!!"
                                      : null
                                  }
                                />
                              </div>

                              <div className={styles.sectionNumber}>
                                <Button
                                  variant="contained"
                                  startIcon={<DeleteIcon />}
                                  style={{
                                    color: "white",
                                    width: "10px",
                                    backgroundColor: "red",
                                  }}
                                  onClick={() => {
                                    remove(index);
                                  }}
                                >
                                  {<FormattedLabel id="delete" />}
                                </Button>
                              </div>
                            </div>
                            {/* </div> */}
                          </>
                        );
                      })}
                    </div>
                  </div>

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
              setTypeName([]);
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
