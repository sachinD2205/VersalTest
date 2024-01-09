import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { useRouter } from "next/router";

import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputBase,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  Toolbar,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {
  DataGrid,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import styles from "../court/view.module.css";
import styles from "../../../../styles/LegalCase_Styles/court.module.css";

// import schema from "../../../../containers/schema/LegalCaseSchema/courtSchema";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { GridToolbar } from "@mui/x-data-grid";
import { border } from "@mui/system";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";

import { ElevatorOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";

import Transliteration from "../../../../components/common/linguosol/transliteration";
import * as yup from "yup";
import BreadcrumbComponent from "../../../../pages/LegalCase/FileUpload/BreadcrumbComponent";
import Loader from "../../../../containers/Layout/components/Loader";

import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  const [loadderState, setLoadderState] = useState(true);

  //
  const generateSchema = (language) => {
    const baseSchema = yup.object({
      // other
      courtTypeId: yup
        .string()
        .nullable()
        .required(<FormattedLabel id="selectCourtType" />),

      pinCode: yup
        .string()
        .matches(/^[1-9][0-9]{5}$/, "Must be only digits")
        .typeError(<FormattedLabel id="enterPinCode" />)
        .min(6, "Pincode Number must be at least 6 number")
        .max(6, "Pincode Number not valid on above 6 number")
        .required(),

      // roadName: yup
      //   .string()
      //   // .required("City Name is required.")
      //   .matches(
      //     /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.]*$/,
      //     "Must be only english characters / फक्त इंग्लिश शब्द "
      //   ),
    });

    if (language === "en") {
      return baseSchema.shape({
        courtName: yup
          .string()
          .required("Court Name is required.")
          .matches(
            /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.]*$/,

            "Must be only english characters / फक्त इंग्लिश शब्द "
          ),

        // area
        area: yup
          .string()
          .required("Area Name is required.")
          .matches(
            /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.]*$/,

            "Must be only english characters / फक्त इंग्लिश शब्द "
          ),
        // landmark
        landmark: yup
          .string()
          .required("Landmark is required.")
          .matches(
            /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.]*$/,

            "Must be only english characters / फक्त इंग्लिश शब्द "
          ),
        // city
        city: yup
          .string()
          .required("City Name is required.")
          .matches(
            /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.]*$/,
            "Must be only english characters / फक्त इंग्लिश शब्द "
          ),

        // roadName
      });
    } else if (language === "mr") {
      return baseSchema.shape({
        courtMr: yup
          .string()
          .required("Court Name is required.")
          .matches(
            /^[ऀ-ॿ][ऀ-ॿ0-9\s\&\)\\-\_\=\+\=\''\"\:\;\.\,\\अॅ\~\`]*$/,
            "Must be only marathi characters/ फक्त मराठी शब्द"
          ),

        // areaMr
        areaMr: yup
          .string()
          .required("Area Name is required.")
          .matches(
            /^[ऀ-ॿ][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`]*$/,
            "Must be only marathi characters/ फक्त मराठी शब्द"
          ),
        // landmarkMr
        landmarkMr: yup
          .string()
          .required("Landmark is required.")
          .matches(
            /^[ऀ-ॿ][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`]*$/,

            "Must be only marathi characters/ फक्त मराठी शब्द"
          ),
        // cityMr
        cityMr: yup
          .string()
          .required("City Name is required.")
          .matches(
            /^[ऀ-ॿ][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`]*$/,

            "Must be only marathi characters/ फक्त मराठी शब्द"
          ),
      });
    } else {
      return baseSchema;
    }
  };
  const language = useSelector((state) => state?.labels?.language);
  const schema = generateSchema(language);

  const token = useSelector((state) => state.user.user.token);

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const {
    register,
    control,
    handleSubmit,
    // methods,
    reset,
    watch,
    formState: { errors },
  } = methods;
  // useForm({
  //   criteriaMode: "all",
  //   resolver: yupResolver(schema),
  //   mode: "onChange",
  // });
  const router = useRouter();

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const [courtTypes, setCourtTypes] = useState([]);

  // const language = useSelector((state) => state.labels.language);

  const [tempCourtName, setTempCourtName] = useState();

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
  useEffect(() => {
    getCourtType();
  }, [tempCourtName]);

  const getCourtType = () => {
    axios
      .get(`${urls.LCMSURL}/master/courtType/getAllForMaster`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCourtTypes(
          res.data.courtType
            .map((r, i) => ({
              id: r.id,

              courtTypeName: r.courtTypeName,
              courtTypeNameMr: r.courtTypeNameMr,
              activeFlag: r?.activeFlag,
            }))
            .filter((r) => r.activeFlag == "Y")
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  useEffect(() => {
    getCourt();
  }, [fetchData]);

  const getCourt = () => {
    setLoadderState(true);

    // console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.LCMSURL}/master/court/getAllForMaster`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // params: {
        //   pageSize: _pageSize,
        //   pageNo: _pageNo,
        // },
      })
      .then((r) => {
        setLoadderState(false);

        console.log(";r", r);
        let result = r.data.court;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log("i", i);

          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,

            id: r.id,
            // srNo: i + 1,
            srNo: i + 1,

            courtNo: r.courtNo,

            courtName: r.courtName,
            courtMr: r.courtMr,

            area: r.area,
            areaMr: r.areaMr,

            roadName: r.roadName,
            roadNameMr: r.roadNameMr,

            landmark: r.landmark,
            landmarkMr: r.landmarkMr,

            city: r.city,
            cityMr: r.cityMr,

            pinCode: r.pinCode,
            courtTypeId: r.courtTypeId,

            courtTypeEn: courtTypes?.find((obj) => obj?.id === r.courtTypeId)
              ?.courtTypeName,

            courtTypeMr: courtTypes?.find((obj) => obj?.id === r.courtTypeId)
              ?.courtTypeNameMr,

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
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // New
  const onSubmitForm = (fromData) => {
    console.log("fromData324", fromData);
    // alert("1");

    // Save - DB
    let _body = {
      ...fromData,
      //courtTypeId: tempCourtName,

      activeFlag: /* btnSaveText === "Update" ? null :  */ fromData.activeFlag,
    };
    if (btnSaveText === "Save") {
      setLoadderState(true);

      const tempData = axios
        .post(`${urls.LCMSURL}/master/court/save`, _body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            sweetAlert(
              // "Saved!",
              language === "en" ? "Saved!" : "जतन केले!",
              //  "Record Saved successfully !",
              language === "en"
                ? "Record Saved successfully !"
                : "रेकॉर्ड यशस्वीरित्या जतन केले!",
              "success"
            );

            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      setLoadderState(true);

      const tempData = axios
        .post(`${urls.LCMSURL}/master/court/save`, _body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("res", res);
          if (res.status == 200) {
            fromData.id
              ? sweetAlert(
                  // "Updated!",
                  language === "en" ? "Updated" : "जतन केले!",
                  // "Record Updated successfully !",
                  language === "en"
                    ? "Record Updated successfully !"
                    : "रेकॉर्ड यशस्वीरित्या जतन केले!",
                  "success"
                )
              : sweetAlert(
                  // "Saved!",
                  language === "en" ? "Saved!" : "जतन केले!",
                  // "Record Saved successfully !",
                  language === "en"
                    ? "Record Saved successfully !"
                    : "रेकॉर्ड यशस्वीरित्या जतन केले!",
                  "success"
                );
            getCourt();
            // setButtonInputState(false);
            // setEditButtonInputState(false);
            // setDeleteButtonState(false);
            // setIsOpenCollapse(false);

            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    }
  };

  // Delete By ID
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
          setLoadderState(true);

          axios
            .post(`${urls.LCMSURL}/master/court/save`, body, {
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
                // getPaymentRate();
                getCourt();
                // setButtonInputState(false);
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              callCatchMethod(err, language);
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
          setLoadderState(true);

          axios
            .post(`${urls.LCMSURL}/master/court/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Safe", {
                  icon: "success",
                });
                // getPaymentRate();
                getCourt();
                // setButtonInputState(false);
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              callCatchMethod(err, language);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    courtNo: "",
    courtName: "",
    courtMr: "",
    area: "",
    areaMr: "",
    roadName: "",
    roadNameMr: "",
    landmark: "",
    landmarkMr: "",

    city: "",
    cityMr: "",
    pinCode: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    courtNo: "",
    courtName: "",
    area: "",
    roadName: "",
    landmark: "",
    city: "",
    pinCode: "",
    id: null,
  };

  const columns = [
    { field: "srNo", headerName: <FormattedLabel id="srNo" />, flex: 1 },
    // courtTypeId
    {
      // field: "courtName",
      field: language === "en" ? "courtTypeEn" : "courtTypeMr",

      headerName: <FormattedLabel id="courtName" />,
      flex: 1,
    },
    // { field: "courtNo", headerName: "Court No", flex: 1 },
    {
      // field: "courtName",
      field: language === "en" ? "courtName" : "courtMr",

      headerName: <FormattedLabel id="courtName" />,
      flex: 1,
    },
    // { field: "courtType", headerName: "Court Type", flex: 1 },

    {
      // field: "area",
      field: language === "en" ? "area" : "areaMr",

      headerName: <FormattedLabel id="area" />,
      flex: 1,
    },
    {
      // field: "roadName",
      field: language === "en" ? "roadName" : "roadNameMr",
      headerName: <FormattedLabel id="roadName" />,
      flex: 1,
    },
    {
      // field: "landmark",
      field: language === "en" ? "landmark" : "landmarkMr",
      headerName: <FormattedLabel id="landmark" />,
      flex: 1,
    },
    {
      // field: "city",
      field: language === "en" ? "city" : "cityMr",
      headerName: <FormattedLabel id="cityOrVillage" />,
      flex: 1,
    },
    {
      field: "pinCode",
      headerName: <FormattedLabel id="pincode" />,
      flex: 1,
    },

    {
      field: "actions",
      // headerName: "Actions",
      headerName: <FormattedLabel id="action" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>

            {/* for View Icon */}
            {/* 
              <IconButton
               disabled={editButtonInputState}
               onClick={() => {
                 setBtnSaveText("View"),
                   setID(params.row.id),
                   setIsOpenCollapse(true),
                   setSlideChecked(true);
                 // setButtonInputState(true);
                 console.log("params.row: ", params.row);
                 reset(params.row);
               }}
            >
              <EyeFilled style={{ color: "#556CD6" }} />
            </IconButton> */}

            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
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

  // Row

  return (
    // <BasicLayout>
    <>
      <Box
        sx={{
          marginLeft: "1vw",
        }}
      >
        <div>
          <BreadcrumbComponent />
        </div>
      </Box>

      {/* Loader */}
      {loadderState ? (
        <Loader />
      ) : (
        // <div
        //   style={{
        //     display: "flex",
        //     justifyContent: "center",
        //     alignItems: "center",
        //     height: "60vh", // Adjust itasper requirement.
        //   }}
        // >
        //   <Paper
        //     style={{
        //       display: "flex",
        //       justifyContent: "center",
        //       alignItems: "center",
        //       background: "white",
        //       borderRadius: "50%",
        //       padding: 8,
        //     }}
        //     elevation={8}
        //   >
        //     <CircularProgress color="success" />
        //   </Paper>
        // </div>
        <>
          {/* <ThemeProvider theme={theme}> */}
          {/*  */}
          <Paper
            elevation={8}
            variant="outlined"
            sx={{
              border: 1,
              borderColor: "grey.500",
              marginLeft: "10px",
              marginRight: "10px",
              marginTop: "10px",
              marginBottom: "60px",
              padding: 1,
            }}
          >
            <Box
              // style={{
              //   display: "flex",
              //   justifyContent: "center",
              //   paddingTop: "10px",
              //   // backgroundColor:'#0E4C92'
              //   // backgroundColor:'		#0F52BA'
              //   // backgroundColor:'		#0F52BA'
              //   background:
              //     "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
              // }}

              style={{
                // backgroundColor: "#0084ff",
                backgroundColor: "#556CD6",
                // backgroundColor: "#1C39BB",

                // #00308F
                color: "white",
                // fontSize: 19,
                // marginTop: 30,
                // marginBottom: "50px",
                // // marginTop: ,
                // padding: 8,
                // paddingLeft: 30,
                // marginLeft: "50px",
                // marginRight: "75px",
                borderRadius: 100,
                height: "8vh",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <h2
                style={{
                  color: "white",
                  marginTop: "1vh",
                }}
              >
                {" "}
                <FormattedLabel id="court" />
              </h2>
            </Box>

            <Divider />

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                {isOpenCollapse && (
                  <Slide
                    direction="down"
                    in={slideChecked}
                    mountOnEnter
                    unmountOnExit
                  >
                    <Grid
                      container
                      sx={{
                        marginLeft: "70px",
                        marginTop: "5px",
                        padding: "30px",
                      }}
                    >
                      {/* Selector for Court Type */}

                      <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                        <FormControl
                          // variant="outlined"
                          error={!!errors?.courtTypeId}
                          sx={{ marginTop: 2 }}
                        >
                          <Controller
                            name="courtTypeId"
                            control={control}
                            defaultValue={null}
                            render={({ field: { onChange, value } }) => (
                              <Autocomplete
                                variant="standard"
                                id="controllable-states-demo"
                                sx={{ width: 300 }}
                                onChange={(event, newValue) => {
                                  onChange(newValue ? newValue.id : null); //! store Selected id -- dont change here
                                }}
                                value={
                                  courtTypes?.find(
                                    (data) => data?.id === value
                                  ) || null
                                }
                                options={courtTypes.sort((a, b) =>
                                  language === "en"
                                    ? a.courtTypeName.localeCompare(
                                        b.courtTypeName
                                      )
                                    : a.courtTypeNameMr.localeCompare(
                                        b.courtTypeNameMr
                                      )
                                )} //! api Data
                                getOptionLabel={(courtTypeName) =>
                                  language == "en"
                                    ? courtTypeName?.courtTypeName
                                    : courtTypeName?.courtTypeNameMr
                                } //! Display name the Autocomplete
                                renderInput={(params) => (
                                  //! display lable list
                                  <TextField
                                    fullWidth
                                    {...params}
                                    label={
                                      language == "en"
                                        ? "Court Type"
                                        : "न्यायालयीन प्रकार"
                                    }
                                    // variant="outlined"
                                    variant="standard"
                                  />
                                )}
                              />
                            )}
                          />
                          <FormHelperText>
                            {errors?.courtTypeId
                              ? errors?.courtTypeId?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid item xl={1} lg={1}></Grid>
                      {/* court Name in English */}
                      <Grid
                        item
                        style={{
                          marginTop: "10px",
                        }}
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        xl={3}
                      >
                        {/* <TextField
                    id="standard-basic"
                    label={<FormattedLabel id="courtNameEn" required />}
                    variant="standard"
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("courtName") ? true : false) ||
                        (router.query.courtName ? true : false),
                    }}
                    {...register("courtName")}
                    error={!!errors.courtName}
                    helperText={
                      errors?.courtName ? errors.courtName.message : " "
                    }
                  /> */}

                        <Transliteration
                          _key={"courtName"}
                          labelName={"courtName"}
                          fieldName={"courtName"}
                          updateFieldName={"courtMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          // disabled={disabled}
                          label={<FormattedLabel id="courtNameEn" required />}
                          error={!!errors.courtName}
                          helperText={
                            errors?.courtName ? errors.courtName.message : null
                          }
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink:
                              (watch("courtName") ? true : false) ||
                              (router.query.courtName ? true : false),
                          }}
                        />
                      </Grid>

                      <Grid item xl={1} lg={1}></Grid>

                      {/* Court Name in Marathi */}
                      <Grid
                        item
                        style={{
                          marginTop: "10px",
                        }}
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        xl={3}
                      >
                        {/* <TextField
                    // required
                    id="standard-basic"
                    label={<FormattedLabel id="courtNameMr" required />}
                    variant="standard"
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },

                      shrink:
                        (watch("courtMr") ? true : false) ||
                        (router.query.courtMr ? true : false),
                    }}
                    {...register("courtMr")}
                    error={!!errors.courtMr}
                    helperText={errors?.courtMr ? errors.courtMr.message : " "}
                  /> */}

                        <Transliteration
                          _key={"courtMr"}
                          labelName={"courtMr"}
                          fieldName={"courtMr"}
                          updateFieldName={"courtName"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          // disabled={disabled}
                          label={<FormattedLabel id="courtNameMr" required />}
                          error={!!errors.courtMr}
                          helperText={
                            errors?.courtMr ? errors.courtMr.message : null
                          }
                          InputLabelProps={{
                            style: { fontSize: 15 },

                            shrink:
                              (watch("courtMr") ? true : false) ||
                              (router.query.courtMr ? true : false),
                          }}
                        />
                      </Grid>

                      {/* Area in English */}

                      <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                        {/* <TextField
                    // required
                    id="standard-basic"
                    label={<FormattedLabel id="areaEn" />}
                    variant="standard"
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("area") ? true : false) ||
                        (router.query.area ? true : false),
                    }}
                    {...register("area")}
                    error={!!errors.area}
                    helperText={errors?.area ? errors.area.message : " "}
                  /> */}

                        <Transliteration
                          _key={"area"}
                          labelName={"area"}
                          fieldName={"area"}
                          updateFieldName={"areaMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          // disabled={disabled}
                          label={<FormattedLabel id="areaEn" required />}
                          error={!!errors.area}
                          helperText={errors?.area ? errors.area.message : null}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink:
                              (watch("area") ? true : false) ||
                              (router.query.area ? true : false),
                          }}
                        />
                      </Grid>

                      <Grid item xl={1} lg={1}></Grid>

                      {/* area in Marathi */}
                      <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                        {/* <TextField
                    // required
                    id="standard-basic"
                    label={<FormattedLabel id="areaMr" />}
                    variant="standard"
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("areaMr") ? true : false) ||
                        (router.query.areaMr ? true : false),
                    }}
                    {...register("areaMr")}
                    error={!!errors.area}
                    helperText={errors?.areaMr ? errors.areaMr.message : " "}
                  /> */}

                        <Transliteration
                          _key={"areaMr"}
                          labelName={"areaMr"}
                          fieldName={"areaMr"}
                          updateFieldName={"area"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          // disabled={disabled}
                          label={<FormattedLabel id="areaMr" required />}
                          error={!!errors.areaMr}
                          helperText={
                            errors?.areaMr ? errors.areaMr.message : null
                          }
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink:
                              (watch("areaMr") ? true : false) ||
                              (router.query.areaMr ? true : false),
                          }}
                        />
                      </Grid>
                      <Grid item xl={1} lg={1}></Grid>

                      {/* 2nd Row */}

                      <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                        {/* <TextField
                    // required
                    id="standard-basic"
                    label={<FormattedLabel id="roadNameEn" />}
                    variant="standard"
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("roadName") ? true : false) ||
                        (router.query.roadName ? true : false),
                    }}
                    {...register("roadName")}
                    error={!!errors.roadName}
                    helperText={
                      errors?.roadName ? errors.roadName.message : " "
                    }
                  /> */}

                        <Transliteration
                          _key={"roadName"}
                          labelName={"roadName"}
                          fieldName={"roadName"}
                          updateFieldName={"roadNameMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          // disabled={disabled}
                          label={<FormattedLabel id="roadNameEn" required />}
                          error={!!errors.roadName}
                          helperText={
                            errors?.roadName ? errors.roadName.message : null
                          }
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink:
                              (watch("roadName") ? true : false) ||
                              (router.query.roadName ? true : false),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                        {/* <TextField
                    //// required
                    id="standard-basic"
                    label={<FormattedLabel id="roadNameMr" />}
                    variant="standard"
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("roadNameMr") ? true : false) ||
                        (router.query.roadNameMr ? true : false),
                    }}
                    {...register("roadNameMr")}
                    error={!!errors.roadNameMr}
                    helperText={
                      errors?.roadNameMr ? errors.roadNameMr.message : " "
                    }
                  /> */}

                        <Transliteration
                          _key={"roadNameMr"}
                          labelName={"roadNameMr"}
                          fieldName={"roadNameMr"}
                          updateFieldName={"roadName"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          // disabled={disabled}
                          label={<FormattedLabel id="roadNameMr" required />}
                          error={!!errors.roadNameMr}
                          helperText={
                            errors?.roadNameMr
                              ? errors.roadNameMr.message
                              : null
                          }
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink:
                              (watch("roadNameMr") ? true : false) ||
                              (router.query.roadNameMr ? true : false),
                          }}
                        />
                      </Grid>

                      <Grid item xl={1} lg={1}></Grid>

                      <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                        {/* <TextField
                    //// required
                    id="standard-basic"
                    label={<FormattedLabel id="landmarkEn" required />}
                    variant="standard"
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("landmark") ? true : false) ||
                        (router.query.landmark ? true : false),
                    }}
                    {...register("landmark")}
                    error={!!errors.landmark}
                    helperText={
                      errors?.landmark ? errors.landmark.message : " "
                    }
                  /> */}

                        <Transliteration
                          _key={"landmark"}
                          labelName={"landmark"}
                          fieldName={"landmark"}
                          updateFieldName={"landmarkMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          // disabled={disabled}
                          label={<FormattedLabel id="landmarkEn" required />}
                          error={!!errors.landmark}
                          helperText={
                            errors?.landmark ? errors.landmark.message : null
                          }
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink:
                              (watch("landmark") ? true : false) ||
                              (router.query.landmark ? true : false),
                          }}
                        />
                      </Grid>

                      <Grid item xl={1} lg={1}></Grid>

                      <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                        {/* <TextField
                    //// required
                    id="standard-basic"
                    label={<FormattedLabel id="landmarkMr" required />}
                    variant="standard"
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("landmarkMr") ? true : false) ||
                        (router.query.landmarkMr ? true : false),
                    }}
                    {...register("landmarkMr")}
                    error={!!errors.landmarkMr}
                    helperText={
                      errors?.landmarkMr ? errors.landmarkMr.message : null
                    }
                  /> */}

                        <Transliteration
                          _key={"landmarkMr"}
                          labelName={"landmarkMr"}
                          fieldName={"landmarkMr"}
                          updateFieldName={"landmark"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          // disabled={disabled}
                          label={<FormattedLabel id="landmarkMr" required />}
                          error={!!errors.landmarkMr}
                          helperText={
                            errors?.landmarkMr
                              ? errors.landmarkMr.message
                              : null
                          }
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink:
                              (watch("landmarkMr") ? true : false) ||
                              (router.query.landmarkMr ? true : false),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                        {/* <TextField
                    // required
                    id="standard-basic"
                    label={<FormattedLabel id="cityOrVillageEn" required />}
                    variant="standard"
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("city") ? true : false) ||
                        (router.query.city ? true : false),
                    }}
                    {...register("city")}
                    error={!!errors.city}
                    helperText={errors?.city ? errors.city.message : null}
                  /> */}

                        <Transliteration
                          _key={"city"}
                          labelName={"city"}
                          fieldName={"city"}
                          updateFieldName={"cityMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          // disabled={disabled}
                          label={
                            <FormattedLabel id="cityOrVillageEn" required />
                          }
                          error={!!errors.city}
                          helperText={errors?.city ? errors.city.message : null}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink:
                              (watch("city") ? true : false) ||
                              (router.query.city ? true : false),
                          }}
                        />
                      </Grid>

                      <Grid item xl={1} lg={1}></Grid>

                      <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                        {/* <TextField
                    // required
                    id="standard-basic"
                    label={<FormattedLabel id="cityOrVillageMr" />}
                    variant="standard"
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("cityMr") ? true : false) ||
                        (router.query.cityMr ? true : false),
                    }}
                    {...register("cityMr")}
                    error={!!errors.cityMr}
                    helperText={errors?.cityMr ? errors.cityMr.message : null}
                  /> */}

                        <Transliteration
                          _key={"cityMr"}
                          labelName={"cityMr"}
                          fieldName={"cityMr"}
                          updateFieldName={"city"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          // disabled={disabled}
                          label={
                            <FormattedLabel id="cityOrVillageMr" required />
                          }
                          error={!!errors.cityMr}
                          helperText={
                            errors?.cityMr ? errors.cityMr.message : null
                          }
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink:
                              (watch("cityMr") ? true : false) ||
                              (router.query.cityMr ? true : false),
                          }}
                        />
                      </Grid>
                      <Grid item xl={1} lg={1}></Grid>

                      <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                        <TextField
                          inputProps={{ maxLength: 6 }}
                          // required
                          // fullWidth
                          id="standard-basic"
                          label={<FormattedLabel id="pincode" required />}
                          variant="standard"
                          InputProps={{
                            style: { fontSize: 18, width: "300px" },
                          }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink:
                              (watch("pinCode") ? true : false) ||
                              (router.query.pinCode ? true : false),
                          }}
                          {...register("pinCode")}
                          error={!!errors.pinCode}
                          helperText={
                            errors?.pinCode ? errors.pinCode.message : null
                          }
                        />
                      </Grid>

                      <Grid
                        container
                        spacing={5}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          paddingTop: "50px",
                        }}
                      >
                        <Grid item>
                          <Button
                            sx={{ marginRight: 8 }}
                            type="submit"
                            variant="contained"
                            color="primary"
                            endIcon={<SaveIcon />}
                          >
                            {btnSaveText === "Update" ? (
                              <FormattedLabel id="update" />
                            ) : (
                              <FormattedLabel id="save" />
                            )}
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            sx={{ marginRight: 8 }}
                            variant="contained"
                            color="primary"
                            endIcon={<ClearIcon />}
                            onClick={() => cancellButton()}
                          >
                            <FormattedLabel id="clear" />
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="contained"
                            color="primary"
                            endIcon={<ExitToAppIcon />}
                            onClick={() => exitButton()}
                          >
                            <FormattedLabel id="exit" />
                          </Button>
                        </Grid>
                      </Grid>
                      {/* </div> */}
                    </Grid>
                  </Slide>
                )}
              </form>
            </FormProvider>

            <div className={styles.addbtn}>
              <Button
                variant="contained"
                endIcon={<AddIcon />}
                // type='primary'
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
              // disableColumnFilter
              // disableColumnSelector
              // disableToolbarButton
              // disableDensitySelector
              components={{ Toolbar: GridToolbar }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                  printOptions: { disableToolbarButton: true },
                  // disableExport: true,
                  // disableToolbarButton: true,
                  // csvOptions: { disableToolbarButton: true },
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
              // density="compact"
              // autoHeight={true}
              // rowHeight={50}
              // pagination
              // paginationMode="server"
              // loading={data.loading}
              // rowCount={data.totalRows}
              // rowsPerPageOptions={data.rowsPerPageOptions}
              // page={data.page}
              // pageSize={data.pageSize}
              pageSize={40}
              rows={data.rows}
              columns={columns}
              rowsPerPageOptions={[40]}
              // onPageChange={(_data) => {
              //   getCourt(data.pageSize, _data);
              // }}
              // onPageSizeChange={(_data) => {
              //   console.log("222", _data);
              //   // updateData("page", 1);
              //   getCourt(_data, data.page);
              // }}
            />
          </Paper>
          {/* </ThemeProvider> */}
        </>
      )}

      {/*  Old*/}
    </>

    // </BasicLayout>
  );
};

export default Index;
