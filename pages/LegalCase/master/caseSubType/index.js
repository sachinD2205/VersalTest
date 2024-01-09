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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import urls from "../../../../URLS/urls";
// import styles from "../caseMainType/view.module.css";
import styles from "../../../../styles/LegalCase_Styles/caseSubType.module.css";
// import schema from "../../../../containers/schema/LegalCaseSchema/caseSubType";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import sweetAlert from "sweetalert";
import { GridToolbar } from "@mui/x-data-grid";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
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

  // Shcehma
  const generateSchema = (language) => {
    const baseSchema = yup.object({
      //Other Fields
      caseMainType: yup
        .string()
        .nullable()
        .required(<FormattedLabel id="selectCaseType" />),
    });
    if (language === "en") {
      return baseSchema.shape({
        //
        subType: yup
          .string()
          .required("case Sub Type is required.")
          .matches(
            // /^[a-zA-Z0-9 ]*$/,
            /^[A-Za-z0-9][A-Za-z0-9\s\/\+\-\:\:\>\<\.\,\_\"\'\;\.\&]*$/,

            "Must be only english characters / फक्त इंग्लिश शब्द "
          ),
        // .required(<FormattedLabel id="subTypeEn" />),
      });
    } else if (language === "mr") {
      return baseSchema.shape({
        caseSubTypeMr: yup
          .string()
          .required("Marathi case type is required.")
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
  const token = useSelector((state) => state.user.user.token);

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const {
    register,
    control,
    setValue,
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
  const router = useRouter();

  const [tempCaseSubtype, setTempCaseSubtype] = useState();

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    // rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 40,
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

  // const language = useSelector((state) => state.labels.language);

  useEffect(() => {
    console.log("tempCaseSubtype", tempCaseSubtype);
  }, [tempCaseSubtype]);

  const [caseMainTypes, setCaseMainTypes] = useState([]);

  const getcaseMainTypes = () => {
    axios
      .get(`${urls.LCMSURL}/master/caseMainType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("datatoPrint", res?.data?.caseMainType);
        setCaseMainTypes(
          res?.data?.caseMainType
            ?.map((r, i) => ({
              id: r.id,
              // caseMainType: r.caseMainType,
              caseMainType: r.caseMainType,
              caseMainTypeMr: r.caseMainTypeMr,
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
    getcaseMainTypes();
  }, []);

  useEffect(() => {
    getSubType();
  }, [caseMainTypes]);

  // useEffect(() => {
  //   getSubType();
  // }, []);

  // New

  const getSubType = () =>
    // _pageSize = 10, _pageNo = 0
    {
      // console.log("_pageSize,_pageNo", _pageSize, _pageNo);

      setLoadderState(true);

      axios
        .get(`${urls.LCMSURL}/master/caseSubType/getAllForMaster`, {
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

          console.log("12345;r", r.data);
          let result = r.data.caseSubType;
          console.log("result", result);

          let _res = result.map((r, i) => {
            console.log("44");
            return {
              // r.data.map((r, i) => ({
              activeFlag: r.activeFlag,

              id: r.id,
              // srNo: i + 1,
              srNo: i + 1,

              // caseMainType: r.caseMainType,
              caseMainType: r.caseMainType,
              // caseMainTypeMr: r.caseMainTypeMr,

              caseMainTypeEn: caseMainTypes?.find(
                (obj) => obj?.id === r.caseMainType
              )?.caseMainType,

              caseMainTypeMr: caseMainTypes?.find(
                (obj) => obj?.id === r.caseMainType
              )?.caseMainTypeMr,

              // subType: r.subType,
              subType: r.subType,
              caseSubTypeMr: r.caseSubTypeMr,

              status: r.activeFlag === "Y" ? "Active" : "Inactive",
            };
          });
          setDataSource([..._res]);
          setData({
            rows: _res,
            totalRows: r.data.totalElements,
            // rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: r.data.pageSize,
            page: r.data.pageNo,
          });
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    };

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    // Save - DB
    let _body = {
      ...fromData,
      // caseSubType: tempCaseSubtype,
      // caseMainType: tempCaseSubtype,

      activeFlag: fromData.activeFlag,
    };

    console.log("fromData", fromData);
    if (btnSaveText === "Save") {
      setLoadderState(true);

      const tempData = axios
        .post(`${urls.LCMSURL}/master/caseSubType/save`, _body, {
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
            getSubType();
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
        .post(`${urls.LCMSURL}/master/caseSubType/save`, _body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
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
                  language === "en" ? "Saved" : "जतन केले!",
                  // "Record Saved successfully !",
                  language === "en"
                    ? "Record Saved successfully !"
                    : "रेकॉर्ड यशस्वीरित्या जतन केले!",
                  "success"
                );
            // getAll();
            getSubType();
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

  // New
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
            .post(`${urls.LCMSURL}/master/caseSubType/save`, body, {
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
                getSubType();
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
            .post(`${urls.LCMSURL}/master/caseSubType/save`, body, {
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
                getSubType();
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
    // caseMainType: "",
    subType: "",
    caseSubTypeMr: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    caseCategory: "",
    caseMainType: "",
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
      flex: 1,
    },

    {
      // field: "caseMainTypeName",
      field: language === "en" ? "caseMainTypeEn" : "caseMainTypeMr",

      headerName: <FormattedLabel id="caseType" />,
      //type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      // field: "subType",
      field: language === "en" ? "subType" : "caseSubTypeMr",
      headerName: <FormattedLabel id="caseSubType" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="action" />,

      flex: 1,

      align: "center",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,

      renderCell: (params) => {
        return (
          <Box>
            {console.log(
              "22",
              language === "en" ? "caseMainType" : "caseMainTypeMr"
            )}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                // setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
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
              {/* <h2>Case Sub Type</h2> */}
              <h2
                style={{
                  color: "white",
                  marginTop: "1vh",
                }}
              >
                {<FormattedLabel id="caseSubType" />}
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
                      <Grid
                        container
                        sx={{ marginLeft: "60px", marginTop: "60px" }}
                      >
                        {/* Case Main Type */}
                        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                          {/* <FormControl
                        sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.caseMainType}
                      >
                        <Controller
                          render={({ field }) => (
                            <Autocomplete
                              variant="standard"
                              {...field}
                              sx={{
                                width: 250,
                                // outline: 'none'
                              }}
                              id="free-solo-2-demo"
                              disableClearable
                              options={caseMainTypes
                                .sort((a, b) => a.caseMainType.localeCompare(b.caseMainType))
                                .map(
                                (option) => option.caseMainType
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
                                setTempCaseSubtype(temp);
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

                          {/* Autocomplete for case type  */}

                          <FormControl
                            // variant="outlined"
                            error={!!errors?.caseMainType}
                            sx={{ marginTop: 1 }}
                          >
                            <Controller
                              name="caseMainType"
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

                          {/* ***** */}
                        </Grid>
                        <Grid item xl={0.5} lg={0.5}></Grid>

                        <Grid
                          item
                          sx={{
                            marginTop: "10px",
                          }}
                          xs={12}
                          sm={6}
                          md={4}
                          lg={3}
                          xl={3}
                        >
                          {/* Case Sub Type in English */}
                          {/* <TextField
                        autoFocus
                        sx={{ width: 250, marginTop: 1 }}
                        id="standard-basic"
                        
                        label={<FormattedLabel id="subTypeEn" />}
                        InputLabelProps={{
                          //true
                          shrink:
                            (watch("subType") ? true : false) ||
                            (router.query.subType ? true : false),
                        }}
                        variant="standard"
                        {...register("subType")}
                        error={!!errors.subType}
                        helperText={
                          errors?.subType ? errors.subType.message : null
                        }
                      /> */}

                          <Transliteration
                            _key={"subType"}
                            labelName={"subType"}
                            fieldName={"subType"}
                            updateFieldName={"caseSubTypeMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            // disabled={disabled}
                            label={<FormattedLabel id="subTypeEn" required />}
                            error={!!errors.subType}
                            helperText={
                              errors?.subType ? errors.subType.message : null
                            }
                          />
                        </Grid>
                        <Grid item xl={1} lg={1}></Grid>

                        <Grid
                          item
                          sx={{
                            marginTop: "10px",
                          }}
                          xs={12}
                          sm={6}
                          md={4}
                          lg={3}
                          xl={3}
                        >
                          {/* Case Type in Marathi */}
                          {/* <TextField
                        autoFocus
                        sx={{ width: 250, marginTop: 1 }}
                        id="standard-basic"
                        // label="Sub-Type*"
                        label={<FormattedLabel id="subTypeMr" />}
                        variant="standard"
                        {...register("caseSubTypeMr")}
                        InputLabelProps={{
                          //true
                          shrink:
                            (watch("caseSubTypeMr") ? true : false) ||
                            (router.query.caseSubTypeMr ? true : false),
                        }}
                        error={!!errors.caseSubTypeMr}
                        helperText={
                          errors?.caseSubTypeMr
                            ? errors.caseSubTypeMr.message
                            : null
                        }
                      /> */}

                          <Transliteration
                            _key={"caseSubTypeMr"}
                            labelName={"caseSubTypeMr"}
                            fieldName={"caseSubTypeMr"}
                            updateFieldName={"subType"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            // disabled={disabled}
                            label={<FormattedLabel id="subTypeMr" required />}
                            error={!!errors.caseSubTypeMr}
                            helperText={
                              errors?.caseSubTypeMr
                                ? errors.caseSubTypeMr.message
                                : null
                            }
                          />
                        </Grid>
                      </Grid>

                      <div className={styles.btn}>
                        <Button
                          sx={{ marginRight: 8 }}
                          type="submit"
                          variant="contained"
                          color="primary"
                          endIcon={<SaveIcon />}
                        >
                          {/* {btnSaveText} */}
                          {btnSaveText === "Update" ? (
                            <FormattedLabel id="update" />
                          ) : (
                            <FormattedLabel id="save" />
                          )}
                        </Button>{" "}
                        <Button
                          sx={{ marginRight: 8 }}
                          variant="contained"
                          color="primary"
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                        >
                          {/* Clear */}
                          <FormattedLabel id="clear" />
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitButton()}
                        >
                          {/* Exit */}
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
                {/* Add{" "} */}
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
              density="compact"
              // autoHeight={true}
              // rowHeight={50}
              // pagination
              // paginationMode="server"
              // loading={data.loading}
              // rowCount={data.totalRows}
              // rowsPerPageOptions={[10]}
              // page={data.page}
              pageSize={40}
              rows={data.rows}
              columns={columns}
              rowsPerPageOptions={[40]}

              // onPageChange={(_data) => {
              //   // F(data.pageSize, _data);
              //   getSubType(data.pageSize, _data);
              // }}
              // onPageSizeChange={(_data) => {
              //   console.log("222", _data);
              //   // updateData("page", 1);
              //   getSubType(_data, data.page);
              // }}
            />
          </Paper>
          {/* </ThemeProvider> */}
        </>
      )}
    </>
  );
};

export default Index;
