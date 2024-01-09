import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
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
import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import urls from "../../../../URLS/urls";
// import styles from "../caseMainType/view.module.css";
import styles from "../../../../styles/LegalCase_Styles/caseStages.module.css";
import schema from "../../../../containers/schema/LegalCaseSchema/caseStagesSchema";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { GridToolbar } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import * as yup from "yup";
import BreadcrumbComponent from "../../../../pages/LegalCase/FileUpload/BreadcrumbComponent";
import Loader from "../../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// func
const Index = () => {
  const [loadderState, setLoadderState] = useState(true);

  // schema
  const generateSchema = (language) => {
    const baseSchema = yup.object({
      // other
      caseMainType: yup
        .string()
        .required(<FormattedLabel id="selectCaseType" />),
      caseStatus: yup
        .string()
        .required(<FormattedLabel id="selectCaseStatus" />),
    });

    if (language === "en") {
      return baseSchema.shape({
        caseStages: yup
          .string()
          .required("case Stages is required.")
          .matches(
            /^[A-Za-z0-9][A-Za-z0-9\s\/\+\-\:\:\>\<\.\,\_\"\'\;\.\&]*$/,

            "Must be only english characters / फक्त इंग्लिश शब्द "
          ),
      });
    } else if (language === "mr") {
      return baseSchema.shape({
        caseStagesMr: yup
          .string()
          .required("case Stages is required.")
          .matches(
            /^[ऀ-ॿ][ऀ-ॿ0-9\s\&\)\\-\_\=\+\=\''\"\:\;\.\,\\अॅ\~\`]*$/,
            "Must be only marathi characters/ फक्त मराठी शब्द"
          ),
      });
    } else {
      return baseSchema;
    }
  };
  const language = useSelector((state) => state?.labels?.language);
  const schema = generateSchema(language);

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const token = useSelector((state) => state.user.user.token);

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

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [categorys, setCategorys] = useState([]);
  const [caseMainTypes, setCaseMainTypes] = useState([]);
  const router = useRouter();
  // const language = useSelector((state) => state.labels.language);
  const [tempCaseMainType, setTempCaseMainType] = useState();
  const [tempCaseStatus, setTempCaseStatus] = useState();

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

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getcaseMainTypes();
  }, []);

  useEffect(() => {
    console.log("tempCaseMainType", tempCaseMainType);
  }, [tempCaseMainType, tempCaseStatus]);

  const getcaseMainTypes = () => {
    axios
      .get(`${urls.LCMSURL}/master/caseMainType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCaseMainTypes(
          res.data.caseMainType.map((r, i) => ({
            id: r.id,
            // caseMainType: r.caseMainType,
            caseMainType: r.caseMainType,
            caseMainTypeMr: r.caseMainTypeMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  useEffect(() => {
    getStages();
  }, [caseMainTypes]);

  useEffect(() => {
    console.log("language", language);
  }, [language]);
  // New get
  const getStages = () => {
    setLoadderState(true);

    // console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.LCMSURL}/master/caseStages/getAllForMaster`, {
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
        let result = r.data.caseStages;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log("caseStatus", r.caseStatus);

          return {
            activeFlag: r.activeFlag,

            id: r.id,
            // srNo: i + 1,
            srNo: i + 1,

            caseMainType: r.caseMainType,

            caseMainTypeEn: caseMainTypes?.find(
              (obj) => obj?.id === r.caseMainType
            )?.caseMainType,

            caseMainTypeMr: caseMainTypes?.find(
              (obj) => obj?.id === r.caseMainType
            )?.caseMainTypeMr,

            caseStages: r.caseStages,
            caseStagesMr: r.caseStagesMr,
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
            caseStatus: r.caseStatus,
            caseStatusMrName:
              r.caseStatus == "1" ? "ऑर्डर/निर्णय/चालण्यासाठी" : "अंतिम ऑर्डर",
            caseStatusEnName:
              r.caseStatus == "1"
                ? "For Order/Judgement/Running"
                : "Final Order",
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

  const onSubmitForm = (fromData) => {
    // Save - DB
    let _body = {
      ...fromData,
      // caseMainType: tempCaseMainType,
      // caseStatus: tempCaseStatus,

      activeFlag: fromData.activeFlag,
      // caseStatusMr:null
    };
    if (btnSaveText === "Save") {
      setLoadderState(true);

      const tempData = axios
        .post(`${urls.LCMSURL}/master/caseStages/save`, _body, {
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
            getStages();
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
        .post(`${urls.LCMSURL}/master/caseStages/save`, _body, {
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
            // getCaseType();
            getStages();

            // setButtonInputState(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
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
            .post(`${urls.LCMSURL}/master/caseStages/save`, body, {
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
                // getCaseType();
                getStages();
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
            .post(`${urls.LCMSURL}/master/caseStages/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Safe!", {
                  icon: "success",
                });
                // getCaseType();
                getStages();
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
    caseCategory: "",
    caseStages: "",
    caseStatus: "",
    caseStagesMr: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    caseMainType: "",
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: language === "en" ? "caseMainTypeEn" : "caseMainTypeMr",

      headerName: <FormattedLabel id="caseType" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      // field:"caseStatus",
      field: language === "en" ? "caseStatusEnName" : "caseStatusMrName",
      headerName: <FormattedLabel id="caseStatus" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "caseStages",
      field: language === "en" ? "caseStages" : "caseStagesMr",

      headerName: <FormattedLabel id="caseStages" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      // headerName: "Actions",
      headerName: <FormattedLabel id="action" />,

      width: 120,
      align: "center",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            {console.log(
              "22",
              language === "en" ? "caseStages" : "caseStagesMr"
            )}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                // alert("gfgg")

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
            {/* <IconButton onClick={() => deleteById(params.id)}>
              <DeleteIcon />
            </IconButton> */}

            {/* For View */}

            {/* For Delete */}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
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
          </Box>
        );
      },
    },
  ];

  // create casestatus array
  const caseStatuss = [
    // {
    //   id: 1,
    //   caseStatus: language === "en" ? "All" : "सर्व",
    // },
    {
      id: 1,
      caseStatus:
        language === "en"
          ? "For Order/Judgement/Running"
          : "ऑर्डर/निर्णय/चालण्यासाठी",
    },

    {
      id: 2,
      caseStatus: language === "en" ? "Final Order" : "अंतिम ऑर्डर",
    },
  ];

  // View
  return (
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
              // border: 1,
              // borderColor: "grey.500",
              border: "1px solid",
              borderColor: "blue",
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
                display: "flex",
                justifyContent: "center",

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
              }}
            >
              <h2
                style={{
                  color: "white",
                  marginTop: "1vh",
                }}
              >
                {<FormattedLabel id="caseStages" />}
              </h2>
            </Box>

            {isOpenCollapse && (
              <Slide
                direction="down"
                in={slideChecked}
                mountOnEnter
                unmountOnExit
              >
                <div>
                  <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmitForm)}>
                      <div className={styles.small}>
                        <div className={styles.row}>
                          <div>
                            {/* <FormControl
                          variant="standard"
                          sx={{ m: 1, minWidth: 90 }}
                          error={!!errors.caseMainType}
                        >
                          <InputLabel id="demo-simple-select-standard-label"></InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Autocomplete
                                variant="standard"
                                {...field}
                                sx={{
                                  width: 250,
                                }}
                                id="free-solo-2-demo"
                                disableClearable
                                options={caseMainTypes

                                  .sort((a, b) =>
                                    a.caseMainType.localeCompare(b.caseMainType)
                                  )

                                  .map((option) =>
                                    language == "en"
                                      ? option.caseMainType
                                      : option.caseMainTypeMr
                                  )}
                                renderInput={(params) => (
                                  <TextField
                                    variant="standard"
                                    {...params}
                                    label={<FormattedLabel id="caseType" />}
                                    InputProps={{
                                      ...params.InputProps,
                                      type: "search",
                                    }}
                                  />
                                )}
                                onChange={(event, value) => {
                                  field.onChange(value);

                                  let temp = 0;
                                  caseMainTypes.filter((item) => {
                                    if (item.caseMainType == value) {
                                      temp = item.id;
                                    }
                                  });

                                  setTempCaseMainType(temp);
                                }}
                              />
                            )}
                            name="caseMainType"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.caseMainType
                              ? errors.caseMainType.message
                              : null}
                          </FormHelperText>
                        </FormControl> */}

                            {/* New Autocomplete  */}
                            <FormControl
                              // variant="outlined"
                              error={!!errors?.caseMainType}
                              // sx={{ marginTop: 2 }}
                            >
                              <Controller
                                name="caseMainType"
                                control={control}
                                defaultValue={null}
                                render={({ field: { onChange, value } }) => (
                                  <Autocomplete
                                    variant="standard"
                                    id="controllable-states-demo"
                                    sx={{ width: 220 }}
                                    onChange={(event, newValue) => {
                                      onChange(newValue ? newValue.id : null); //! store Selected id -- dont change here
                                    }}
                                    value={
                                      caseMainTypes?.find(
                                        (data) => data?.id === value
                                      ) || null
                                    }
                                    options={caseMainTypes.sort((a, b) =>
                                      language === "en"
                                        ? a.caseMainType.localeCompare(
                                            b.caseMainType
                                          )
                                        : a.caseMainTypeMr.localeCompare(
                                            b.caseMainTypeMr
                                          )
                                    )} //! api Data
                                    getOptionLabel={(caseMainType) =>
                                      language == "en"
                                        ? caseMainType?.caseMainType
                                        : caseMainType?.caseMainTypeMr
                                    } //! Display name the Autocomplete
                                    renderInput={(params) => (
                                      //! display lable list
                                      <TextField
                                        fullWidth
                                        {...params}
                                        label={
                                          language == "en"
                                            ? "Case Type"
                                            : "प्रकरणाचा प्रकार"
                                        }
                                        // variant="outlined"
                                        variant="standard"
                                      />
                                    )}
                                  />
                                )}
                              />
                              <FormHelperText>
                                {errors?.caseMainType
                                  ? errors?.caseMainType?.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </div>

                          {/* Case Status */}
                          <div>
                            {/* <FormControl
                          sx={{ m: 1, minWidth: 200 }}
                          error={!!errors.caseStatus}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                         
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Autocomplete
                                variant="standard"
                                {...field}
                                sx={{
                                  width: 250,
                                  
                                }}
                                id="free-solo-2-demo"
                                disableClearable
                                options={caseStatuss.map(
                                  (option) => option.caseStatus
                                )}
                                renderInput={(params) => (
                                  <TextField
                                    variant="standard"
                                    {...params}
                                    label={<FormattedLabel id="caseStatus" />}
                                    InputProps={{
                                      ...params.InputProps,
                                      type: "search",
                                    }}
                                  />
                                )}
                                onChange={(event, value) => {
                                  field.onChange(value);

                                  let temp = 0;
                                  caseStatuss.filter((item) => {
                                    if (item.caseStatus == value) {
                                      temp = item.id;
                                    }
                                  });

                                 
                                  setTempCaseStatus(temp);
                                }}
                              />
                            )}
                            name="caseStatus"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.caseStatus
                              ? errors.caseStatus.message
                              : null}
                          </FormHelperText>
                        </FormControl> */}

                            {/* New Autocomplete  */}

                            <FormControl
                              // variant="outlined"
                              error={!!errors?.caseStatus}
                              // sx={{ marginTop: 2 }}
                            >
                              <Controller
                                name="caseStatus"
                                control={control}
                                defaultValue={null}
                                render={({ field: { onChange, value } }) => (
                                  <Autocomplete
                                    variant="standard"
                                    id="controllable-states-demo"
                                    sx={{ width: 220 }}
                                    onChange={(event, newValue) => {
                                      onChange(newValue ? newValue.id : null); //! store Selected id -- dont change here
                                    }}
                                    value={
                                      caseStatuss?.find(
                                        (data) => data?.id === value
                                      ) || null
                                    }
                                    options={caseStatuss} //! api Data
                                    getOptionLabel={(caseStatus) =>
                                      language == "en"
                                        ? caseStatus?.caseStatus
                                        : caseStatus?.caseStatus
                                    } //! Display name the Autocomplete
                                    renderInput={(params) => (
                                      //! display lable list
                                      <TextField
                                        fullWidth
                                        {...params}
                                        label={
                                          language == "en"
                                            ? "Case Status"
                                            : "प्रकरणाचा प्रकार"
                                        }
                                        // variant="outlined"
                                        variant="standard"
                                      />
                                    )}
                                  />
                                )}
                              />
                              <FormHelperText>
                                {errors?.caseMainType
                                  ? errors?.caseMainType?.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </div>

                          {/* case stages */}
                          <div>
                            {/* <TextField
                          autoFocus
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label={<FormattedLabel id="caseStagesEn" />}
                          InputLabelProps={{
                            //true
                            shrink:
                              (watch("caseStages") ? true : false) ||
                              (router.query.caseStages ? true : false),
                          }}
                          variant="standard"
                          {...register("caseStages")}
                          error={!!errors.caseStages}
                          helperText={
                            errors?.caseStages
                              ? errors.caseStages.message
                              : null
                          }
                        /> */}

                            <Transliteration
                              _key={"caseStages"}
                              labelName={"caseStages"}
                              fieldName={"caseStages"}
                              updateFieldName={"caseStagesMr"}
                              sourceLang={"eng"}
                              targetLang={"mar"}
                              // disabled={disabled}
                              label={
                                <FormattedLabel id="caseStagesEn" required />
                              }
                              error={!!errors.caseStages}
                              helperText={
                                errors?.caseStages
                                  ? errors.caseStages.message
                                  : null
                              }
                            />
                          </div>

                          <div>
                            {/* <TextField
                          autoFocus
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label={<FormattedLabel id="caseStagesMr" />}
                          InputLabelProps={{
                            //true
                            shrink:
                              (watch("caseStagesMr") ? true : false) ||
                              (router.query.caseStagesMr ? true : false),
                          }}
                          variant="standard"
                          {...register("caseStagesMr")}
                          error={!!errors.caseStagesMr}
                          helperText={
                            errors?.caseStagesMr
                              ? errors.caseStagesMr.message
                              : null
                          }
                        /> */}

                            <Transliteration
                              _key={"caseStagesMr"}
                              labelName={"caseStagesMr"}
                              fieldName={"caseStagesMr"}
                              updateFieldName={"caseStages"}
                              sourceLang={"mar"}
                              targetLang={"eng"}
                              // disabled={disabled}
                              label={
                                <FormattedLabel id="caseStagesMr" required />
                              }
                              error={!!errors.caseStagesMr}
                              helperText={
                                errors?.caseStagesMr
                                  ? errors.caseStagesMr.message
                                  : null
                              }
                            />
                          </div>
                        </div>

                        <div className={styles.btn}>
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
                          <Button
                            sx={{ marginRight: 8 }}
                            variant="contained"
                            color="primary"
                            endIcon={<ClearIcon />}
                            onClick={() => cancellButton()}
                            x
                          >
                            <FormattedLabel id="clear" />
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            endIcon={<ExitToAppIcon />}
                            onClick={() => exitButton()}
                          >
                            <FormattedLabel id="exit" />
                          </Button>
                        </div>
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
                  // printOptions: { disableToolbarButton: true },
                  // disableExport: true,
                  // disableToolbarButton: true,
                  // csvOptions: { disableToolbarButton: true },
                },
              }}
              autoHeight
              sx={{
                // marginLeft: 5,
                // marginRight: 5,
                // marginTop: 5,
                // marginBottom: 5,
                border: "1px solid",
                borderColor: "blue",

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
              // onPageChange={(_data) => {
              //   // getCaseType(data.pageSize, _data);
              //   getStages(data.pageSize, _data);
              // }}
              // onPageSizeChange={(_data) => {
              //   console.log("222", _data);
              //   // updateData("page", 1);
              //   getStages(_data, data.page);
              // }}
            />
          </Paper>
          {/* </ThemeProvider> */}
        </>
      )}

      {/*  */}
    </>
  );
};

export default Index;
