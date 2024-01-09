import React, { useEffect, useState } from "react";
import Head from "next/head";
import styles from "./master.module.css";

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
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import Title from "../../../containers/VMS_ReusableComponents/Title";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { Controller, FormProvider, useForm } from "react-hook-form";
import axios from "axios";
import URLS from "../../../URLS/urls";
import Transliteration from "../../../components/common/linguosol/transliteration";
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
import { catchExceptionHandlingMethod } from "../../../util/util";

const Venue = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [facilityTypess, setFacilityTypess] = useState([]);
  const [facilitySubTypes, setFacilitySubTypes] = useState([]);
  const [allSubTypes, setAllSubTypes] = useState([]);
  const [unit, setUnit] = useState([]);
  const [table, setTable] = useState([]);

  const [sections, setSections] = useState([]);
  const [runAgain, setRunAgain] = useState(false);
  const [open, setOpen] = useState(false);

  const [data, setData] = useState({
    totalRows: 0,
    rowsPerPageOptions: [5, 10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const [collapse, setCollapse] = useState(false);

  let applicationFormSchema = yup.object().shape({
    zoneName: yup
      .number()
      .required()
      .typeError(
        language === "en" ? "Please select a zone" : "कृपया एक IPD निवडा"
      ),
  });
  let sectionDetailsSchema = yup.object().shape({
    // facilityName: yup
    //   .number()
    //   .required()
    //   .typeError(
    //     language === 'en' ? 'Please select a facility' : 'कृपया एक IPD निवडा'
    //   ),
    // facilityType: yup
    //   .number()
    //   .required()
    //   .typeError(
    //     language === 'en'
    //       ? 'Please select a facility type'
    //       : 'कृपया एक IPD निवडा'
    //   ),
    // unit: yup
    //   .number()
    //   .required()
    //   .typeError(
    //     language === 'en' ? 'Please select a unit' : 'कृपया एक IPD निवडा'
    //   ),
    // capacity: yup
    //   .string()
    //   .required(
    //     language === 'en' ? 'Please enter capacity' : 'कृपया एक प्राणी निवडा'
    //   )
    //   .typeError(
    //     language === 'en' ? 'Please enter capacity' : 'कृपया एक प्राणी निवडा'
    //   ),
  });

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

  useEffect(() => {
    // //Get Zones
    // axios.get(`${URLS.SPURL}/master/zone/getAll`).then((r) => {
    //   setZoneNames(
    //     r.data.zone.map((row) => ({
    //       id: row.id,
    //       zoneName: row.zoneName,
    //       zoneNameMr: row.zoneNameMr,
    //     }))
    //   )
    // })

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
    // .catch((error) => {
    //   sweetAlert(
    //     language === "en" ? "Error!" : "त्रुटी!",
    //     language === "en" ? "Something went wrong" : "काहीतरी चूक झाली",
    //     "error",
    //     { button: language === "en" ? "Ok" : "ठीक आहे" },
    //   );
    // });

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
            facilityNameEn: row.facilityName,
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

    getTableData();
  }, [zoneNames, wardNames, runAgain]);

  const getTableData = (pageSize = 10, pageNo = 0) => {
    axios
      .get(`${URLS.SPURL}/venueMasterSection/getAllYN`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { pageNo, pageSize, sortBy: "id", sortDir: "desc" },
      })
      .then((res) => {
        setTable(
          res.data?.venueSection?.map((obj, i) => ({
            ...obj,
            srNo: i + 1,
            zoneNameEn: zoneNames?.find((j) => j.id == obj.zoneName)?.zoneName,
            zoneNameMr: zoneNames?.find((j) => j.id == obj.zoneName)
              ?.zoneNameMr,
            noOfSections: obj?.sectionLst?.length || 0,
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
      headerClassName: "cellColor",
      field: language == "en" ? "facilityTypeEn" : "facilityTypeMr",
      headerAlign: "center",
      headerName: <FormattedLabel id="facilityType" />,
      minWidth: 175,
      flex: 1,
    },
    {
      headerClassName: "cellColor",
      field: language == "en" ? "facilityNameEn" : "facilityNameMr",
      headerAlign: "center",
      headerName: <FormattedLabel id="facilityName" />,
      minWidth: 175,
      flex: 1,
    },
    // {
    //   headerClassName: "cellColor",
    //   field: language == "en" ? "unitEn" : "unitMr",

    //   headerAlign: "center",
    //   headerName: <FormattedLabel id="unit" />,
    //   minWidth: 125,
    //   flex: 0.7,
    // },
    {
      headerClassName: "cellColor",
      field: "capacity",
      headerAlign: "center",
      headerName: <FormattedLabel id="capacity" />,
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
      field: language == "en" ? "zoneNameEn" : "zoneNameMr",
      headerAlign: "center",
      headerName: <FormattedLabel id="zone" />,
      width: 150,
    },
    // {
    //   headerClassName: 'cellColor',
    //   field: language == 'en' ? 'wardNameEn' : 'wardNameMr',
    //   headerAlign: 'center',
    //   headerName: <FormattedLabel id='ward' />,
    //   width: 150,
    // },
    {
      headerClassName: "cellColor",
      field: language == "en" ? "venue" : "venueMr",
      headerAlign: "center",
      headerName: <FormattedLabel id="venue" />,
      minWidth: 300,
      flex: 1,
    },
    {
      headerClassName: "cellColor",
      field: language == "en" ? "contactPersonName" : "contactPersonNameMr",
      headerAlign: "center",
      headerName: <FormattedLabel id="contactPerson" />,
      width: 175,
    },
    {
      headerClassName: "cellColor",
      field: "contactPersonMobileNo",
      headerAlign: "center",
      headerName: <FormattedLabel id="contactPersonMobileNo" />,
      width: 200,
    },
    {
      headerClassName: "cellColor",
      field: "noOfSections",
      headerAlign: "center",
      headerName: <FormattedLabel id="noOfSections" />,
      width: 150,
    },
    {
      headerClassName: "cellColor",
      field: "action",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="actions" />,
      width: 100,
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
                setCollapse(true);
                setSections(
                  params.row?.sectionLst?.map((section, i) => ({
                    srNo: i + 1,
                    ...section,
                    facilityTypeEn: facilityTypess?.find(
                      (obj) => obj.id == section?.facilityType
                    )?.facilityType,
                    facilityTypeMr: facilityTypess?.find(
                      (obj) => obj.id == section?.facilityType
                    )?.facilityTypeMr,
                    facilityNameEn: allSubTypes?.find(
                      (obj) => obj.id == section?.facilityName
                    )?.facilityNameEn,
                    facilityNameMr: allSubTypes?.find(
                      (obj) => obj.id == section?.facilityName
                    )?.facilityNameMr,
                    unitEn: unit?.find((obj) => obj.id == section?.unit)
                      ?.unitEn,
                    unitMr: unit?.find((obj) => obj.id == section?.unit)
                      ?.unitMr,
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
          .post(
            `${URLS.SPURL}/venueMasterSection/saveVenueMasterSection `,
            {
              ...rowData,
              activeFlag: flag == "Y" ? "N" : "Y",
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
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
            callCatchMethod(error, language);
          });
        // .catch((error) => {
        //   sweetAlert(
        //     language === "en" ? "Error!" : "त्रुटी!",
        //     language === "en" ? "Something went wrong" : "काहीतरी चूक झाली",
        //     "error",
        //     { button: language === "en" ? "Ok" : "ठीक आहे" },
        //   );
        // });
      }
    });
  };

  const getWards = (zoneId) => {
    //Get Wards
    axios
      .get(
        `${URLS.CFCURL}/master/zoneAndWardLevelMapping/getWardByDepartmentId`,
        {
          params: { departmentId: 2, zoneId },

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
            facilityNameEn: j.facilityName,
            facilityNameMr: j.facilityNameMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    console.log("sectionsssss: ", sections, !!watch1("id"));
  }, [sections]);

  useEffect(() => {
    console.log("activeFlag: ", watch("activeFlag"));
  }, [watch("activeFlag")]);

  const addSectionDetails = (sectionDetailsData) => {
    if (!!watch1("id") || watch1("id") == 0) {
      // @ts-ignore
      setSections((prev) =>
        prev?.map((obj) => {
          console.log(
            "devaaaa: ",
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
                facilityTypeEn: facilityTypess?.find(
                  (obj) => obj.id == sectionDetailsData?.facilityType
                )?.facilityType,
                facilityTypeMr: facilityTypess?.find(
                  (obj) => obj.id == sectionDetailsData?.facilityType
                )?.facilityTypeMr,
                facilityNameEn: facilitySubTypes?.find(
                  (obj) => obj.id == sectionDetailsData?.facilityName
                )?.facilityNameEn,
                facilityNameMr: facilitySubTypes?.find(
                  (obj) => obj.id == sectionDetailsData?.facilityName
                )?.facilityNameMr,
                unitEn: unit?.find((obj) => obj.id == sectionDetailsData?.unit)
                  ?.unitEn,
                unitMr: unit?.find((obj) => obj.id == sectionDetailsData?.unit)
                  ?.unitMr,
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
            facilityTypeEn: facilityTypess?.find(
              (obj) => obj.id == sectionDetailsData?.facilityType
            )?.facilityType,
            facilityTypeMr: facilityTypess?.find(
              (obj) => obj.id == sectionDetailsData?.facilityType
            )?.facilityTypeMr,
            facilityNameEn: facilitySubTypes?.find(
              (obj) => obj.id == sectionDetailsData?.facilityName
            )?.facilityNameEn,
            facilityNameMr: facilitySubTypes?.find(
              (obj) => obj.id == sectionDetailsData?.facilityName
            )?.facilityNameMr,
            unitEn: unit?.find((obj) => obj.id == sectionDetailsData?.unit)
              ?.unitEn,
            unitMr: unit?.find((obj) => obj.id == sectionDetailsData?.unit)
              ?.unitMr,
            new: true,
            activeFlag: "Y",
          },
        ].map((j, i) => ({ ...j, srNo: i + 1 }))
      );
    }

    reset1({
      id: null,
      capacity: "",
      facilityName: "",
      facilityType: "",
      // unit: '',
    });
    setOpen(false);
  };

  const finalSubmit = (finalFormData) => {
    const bodyForAPI = {
      ...finalFormData,
      sectionLst: sections?.map((j) => ({ ...j, id: j.new ? null : j.id })),
      activeFlag: watch("activeFlag"),
    };

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
          .post(
            `${URLS.SPURL}/venueMasterSection/saveVenueMasterSection`,
            bodyForAPI,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
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
      <Head>
        <title>Venue</title>
      </Head>
      <Paper className={styles.main}>
        <Title titleLabel={<FormattedLabel id="venueMaster" />} />
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
                  <FormControl variant="standard" error={!!errors.zoneName}>
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="zone" required />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ width: 250 }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                            getWards(value.target.value);
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

                  <FormControl
                    disabled={wardNames?.length == 0}
                    variant="standard"
                    error={!!errors.wardName}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="ward" required />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ width: 250 }}
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
                  <div style={{ width: 250 }}>
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
                        shrink: !!watch("venue"),
                      }}
                      width={250}
                      error={!!errors.venue}
                      helperText={errors?.venue ? errors.venue.message : null}
                    />
                  </div>
                  <TextField
                    sx={{ width: 250 }}
                    id="standard-basic"
                    label={<FormattedLabel id="venueMr" required />}
                    variant="standard"
                    {...register("venueMr")}
                    InputLabelProps={{
                      shrink: !!watch("venueMr"),
                    }}
                    error={!!errors.venueMr}
                    helperText={
                      errors?.venueMr
                        ? "Must be only characters / फक्त शब्दात!!"
                        : null
                    }
                  />
                  <div style={{ width: 250 }}>
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
                        shrink: !!watch("address"),
                      }}
                      width={250}
                      error={!!errors.address}
                      helperText={
                        errors?.address ? errors.address.message : null
                      }
                    />
                  </div>
                  <TextField
                    sx={{ width: 250 }}
                    id="standard-basic"
                    label={<FormattedLabel id="venueAddressMr" required />}
                    variant="standard"
                    {...register("addressMr")}
                    InputLabelProps={{
                      shrink: !!watch("addressMr"),
                    }}
                    error={!!errors.addressMr}
                    helperText={
                      errors?.addressMr
                        ? "Must be only characters / फक्त शब्दात!!"
                        : null
                    }
                  />

                  <div style={{ width: 250 }}>
                    <Transliteration
                      _key={"contactPersonName"}
                      labelName={"contactPersonName"}
                      fieldName={"contactPersonName"}
                      updateFieldName={"contactPersonNameMr"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      variant="standard"
                      label={<FormattedLabel id="contactPersonName" required />}
                      InputLabelProps={{
                        shrink: !!watch("contactPersonName"),
                      }}
                      width={250}
                      error={!!errors.contactPersonName}
                      helperText={
                        errors?.contactPersonName
                          ? errors.contactPersonName.message
                          : null
                      }
                    />
                  </div>
                  <TextField
                    sx={{ width: 250 }}
                    id="standard-basic"
                    label={<FormattedLabel id="contactPersonNameMr" required />}
                    variant="standard"
                    {...register("contactPersonNameMr")}
                    InputLabelProps={{
                      shrink: !!watch("contactPersonNameMr"),
                    }}
                    error={!!errors.contactPersonNameMr}
                    helperText={
                      errors?.contactPersonNameMr
                        ? "Must be only characters / फक्त शब्दात!!"
                        : null
                    }
                  />
                  <TextField
                    sx={{ width: 250 }}
                    id="standard-basic"
                    label={
                      <FormattedLabel id="contactPersonMobileNo" required />
                    }
                    variant="standard"
                    {...register("contactPersonMobileNo")}
                    InputLabelProps={{
                      shrink: !!watch("contactPersonMobileNo"),
                    }}
                    error={!!errors.contactPersonMobileNo}
                    helperText={
                      errors?.contactPersonMobileNo
                        ? "Contact Person mobile number is Required !!!"
                        : null
                    }
                  />

                  <div style={{ width: 250 }}>
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
                        shrink: !!watch("remark"),
                      }}
                      width={250}
                      error={!!errors.remark}
                      helperText={errors?.remark ? errors.remark.message : null}
                    />
                  </div>
                  <TextField
                    sx={{ width: 250 }}
                    id="standard-basic"
                    label={<FormattedLabel id="remarkMr" required />}
                    variant="standard"
                    {...register("remarkMr")}
                    InputLabelProps={{
                      shrink: !!watch("remarkMr"),
                    }}
                    error={!!errors.remarkMr}
                    helperText={
                      errors?.remarkMr
                        ? "Must be only characters / फक्त शब्दात!!"
                        : null
                    }
                  />
                  <div style={{ width: 250 }} />
                </div>
                <div className={styles.row}>
                  <div className={styles.subTitle} style={{ marginTop: 0 }}>
                    <FormattedLabel id="sectionDetails" />
                  </div>

                  <Button
                    variant="contained"
                    endIcon={<Add />}
                    onClick={() => setOpen(true)}
                  >
                    <FormattedLabel id="addSection" />
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
                    No Sections added
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
                    onClick={() => clearData(!watch("id") ? "new" : "update")}
                  >
                    <FormattedLabel id="clear" />
                  </Button>
                  <Button
                    color="error"
                    variant="contained"
                    endIcon={<ExitToApp />}
                    onClick={() => {
                      clearData("new");
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
            <h2 className={styles.modalHeader}>Section Details</h2>
            <form onSubmit={handleSubmit1(addSectionDetails)}>
              <div className={styles.fieldsWrapper}>
                <FormControl variant="standard" error={!!errors1.facilityType}>
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="facilityType" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: 250 }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          getFacilitySubTypes(value.target.value);
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
                    control={control1}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors1?.facilityType
                      ? errors1.facilityType.message
                      : null}
                  </FormHelperText>
                </FormControl>
                <FormControl variant="standard" error={!!errors1.facilityName}>
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="facilityName" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                        value={field.value}
                        sx={{ width: 200 }}
                        variant="standard"
                      >
                        {facilitySubTypes?.map((obj) => (
                          <MenuItem
                            disabled={
                              !!sections?.find(
                                (j) => j?.facilityName == obj?.id
                              )
                            }
                            key={obj.id}
                            value={obj.id}
                          >
                            {language == "en"
                              ? obj?.facilityNameEn
                              : obj?.facilityNameMr}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                    name="facilityName"
                    control={control1}
                  />
                  <FormHelperText>
                    {errors1?.facilityName
                      ? errors1.facilityName.message
                      : null}
                  </FormHelperText>
                </FormControl>
                {/* <FormControl variant='standard' error={!!errors1.unit}>
                  <InputLabel id='demo-simple-select-standard-label'>
                    <FormattedLabel id='unit' />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ minWidth: 200 }}
                        labelId='demo-simple-select-standard-label'
                        id='demo-simple-select-standard'
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label='unit'
                      >
                        {unit &&
                          unit.map((obj, index) => {
                            return (
                              <MenuItem key={index} value={obj.id}>
                                {language == 'en' ? obj?.unitEn : obj?.unitMr}
                              </MenuItem>
                            )
                          })}
                      </Select>
                    )}
                    name='unit'
                    control={control1}
                    defaultValue=''
                  />
                  <FormHelperText>
                    {errors1?.unit ? errors1.unit.message : null}
                  </FormHelperText>
                </FormControl> */}
                <TextField
                  sx={{ width: 200 }}
                  id="standard-basic"
                  label={<FormattedLabel id="capacity" />}
                  variant="standard"
                  {...register1(`capacity`)}
                  error={!!errors1.capacity}
                  helperText={errors1?.capacity ? errors1.unit.message : null}
                />
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
                      // unit: '',
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
    </>
  );
};

export default Venue;

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
