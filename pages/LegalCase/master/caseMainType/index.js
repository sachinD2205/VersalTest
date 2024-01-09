// import { yupResolver } from "@hookforpostm/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputBase,
  InputLabel,
  Paper,
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
import { FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import styles from "../court/view.module.css
import styles from "../../../../styles/LegalCase_Styles/caseMainType.module.css";
// import validationSchema from "../../../../containers/schema/LegalCaseSchema/caseMainTypeSchema";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { GridToolbar } from "@mui/x-data-grid";
import { border } from "@mui/system";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
// import urls from "../../../../URLS/urls";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import * as yup from "yup";
import BreadcrumbComponent from "../../../../pages/LegalCase/FileUpload/BreadcrumbComponent";
import Loader from "../../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  const [loadderState, setLoadderState] = useState(true);

  // const generateSchema = (language) => {
  //   const baseSchema = yup.object({
  //     // other fields
  //   });

  //   if (language === "en") {
  //     return baseSchema.shape({
  //       caseMainType: yup.string().when(["caseMainType", language], {
  //         is: (caseMainType, language) => language === "en" && caseMainType,
  //         then: yup
  //           .string()
  //           .matches(
  //             /^[ऀ-ॿ][ऀ-ॿ0-9\s\&\)\\-\_\=\+\=\''\"\:\;\.\,\\अॅ\~\`]*$/,
  //             "Must be only Marathi characters."
  //           ),
  //       }),
  //     });
  //   } else if (language === "mr") {
  //     return baseSchema.shape({
  //       caseMainTypeMr: yup.string().when(["caseMainTypeMr", language], {
  //         is: (caseMainTypeMr, language) => language === "mr" && caseMainTypeMr,
  //         then: yup
  //           .string()
  //           .matches(
  //             /^[ऀ-ॿ][ऀ-ॿ0-9\s\&\)\\-\_\=\+\=\''\"\:\;\.\,\\अॅ\~\`]*$/,
  //             "Must be only Marathi characters."
  //           ),
  //       }),
  //     });
  //   } else {
  //     return baseSchema;
  //   }
  // };

  // const generateSchema = (language) => {
  //   const baseSchema = yup.object({
  //     // other feilds
  //   });

  // if (language === "en") {
  //   return baseSchema.shape({
  //       caseMainType: yup
  //         .string()
  //         .required("English case type is required.")
  //         // .matches(
  //         //   /^[A-Za-z0-9\s\/\+\-\:\:\>\<\.\,\_\"\'\;\.\&]*$/,
  //         //   "Must be only English characters."
  //         // ),
  //         .matches(
  //           // /^[aA-zZ\s]+$/,
  //           /^[A-Za-z0-9][A-Za-z0-9\s\/\+\-\:\:\>\<\.\,\_\"\'\;\.\&]*$/,

  //           "Must be only english characters / फक्त इंग्लिश शब्द "
  //         ),

  //     });
  //   } else if (language === "mr") {
  //     return baseSchema.shape({
  //       caseMainTypeMr: yup
  //         .string()
  //         .required("Marathi case type is required.")
  //         .matches(
  //           // /^[\u0900-\u097F\s]*$/,
  //           /^[ऀ-ॿ][ऀ-ॿ0-9\s\&\)\\-\_\=\+\=\''\"\:\;\.\,\\अॅ\~\`]*$/,
  //           "Must be only marathi characters/ फक्त मराठी शब्द"
  //         ),
  //     });
  // } else {
  //   return baseSchema;
  // }
  // };

  const generateSchema = (language) => {
    const baseSchema = yup.object({
      // other
    });

    if (language === "en") {
      return baseSchema.shape({
        caseMainType: yup
          .string()
          .required("English case type is required.")
          .matches(
            /^[A-Za-z0-9][A-Za-z0-9\s\/\+\-\:\:\>\<\.\,\_\"\'\;\.\&]*$/,

            "Must be only english characters / फक्त इंग्लिश शब्द "
          ),
      });
    } else if (language === "mr") {
      return baseSchema.shape({
        caseMainTypeMr: yup
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

  // old code without condition
  // let caseTypeSchema = yup.object().shape({
  //   caseMainType: yup
  //     .string()
  //     .required(<FormattedLabel id='caseTypeEn' />)
  // .matches(
  //   // /^[aA-zZ\s]+$/,
  //   /^[A-Za-z0-9][A-Za-z0-9\s\/\+\-\:\:\>\<\.\,\_\"\'\;\.\&]*$/,

  //   "Must be only english characters / फक्त इंग्लिश शब्द "
  // ),

  //   caseMainTypeMr: yup
  //     .string()
  //     .required(<FormattedLabel id='caseTypeMr' />)
  //     .matches(
  //       // /^[\u0900-\u097F\s]*$/,
  //       /^[ऀ-ॿ][ऀ-ॿ0-9\s\&\)\\-\_\=\+\=\''\"\:\;\.\,\\अॅ\~\`]*$/,

  //       "Must be only marathi characters/ फक्त मराठी शब्द"
  //     ),
  // });

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
  const [isDisabled, setIsDisabled] = useState(true);
  const router = useRouter();

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
    getCaseType();
  }, [fetchData]);

  // Get Table - Data
  const getCaseType = (
    // _pageSize = 10,
    // _pageNo = 0,
    _sortBy = "id",
    _sortDir = "Desc"
  ) => {
    setLoadderState(true);

    // console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.LCMSURL}/master/caseMainType/getAllForMaster`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          // pageSize: _pageSize,
          // pageNo: _pageNo,
        },
      })
      .then((r) => {
        setLoadderState(false);

        console.log(";r", r);
        let result = r.data.caseMainType;
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
            caseMainTypeMr: r.caseMainTypeMr,

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

  const onSubmitForm = (fromData) => {
    // Save - DB
    let _body = {
      ...fromData,
      activeFlag: fromData.activeFlag,
    };
    if (btnSaveText === "Save") {
      setLoadderState(true);

      const tempData = axios
        .post(`${urls.LCMSURL}/master/caseMainType/save`, _body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setLoadderState(false);

          if (res.status == 200) {
            sweetAlert(
              // "Saved!",
              language === "en" ? "Saved!" : "जतन केले!",
              // "Record Saved successfully !",
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
        .post(`${urls.LCMSURL}/master/caseMainType/save`, _body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setLoadderState(false);

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
            getCaseType();
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
          axios
            .post(`${urls.LCMSURL}/master/caseMainType/save`, body, {
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
                getCaseType();
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
          axios
            .post(`${urls.LCMSURL}/master/caseMainType/save`, body, {
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
                getCaseType();
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
    caseMainType: "",
    caseMainTypeMr: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    caseMainType: "",
    caseMainTypeMr: "",
    id: null,
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    // { field: "courtNo", headerName: "Court No", flex: 1 },
    {
      // field: "caseMainType",
      field: language === "en" ? "caseMainType" : "caseMainTypeMr",

      headerName: <FormattedLabel id="caseType" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "actions",
      // headerName: "Actions",
      headerName: <FormattedLabel id="action" />,

      width: 120,
      sortable: false,
      align: "center",
      headerAlign: "center",
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

  // Row

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

                // #00308F
                color: "white",
                display: "flex",
                justifyContent: "center",
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
                <FormattedLabel id="caseType" />
              </h2>
            </Box>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                {isOpenCollapse && (
                  <Slide
                    direction="down"
                    in={slideChecked}
                    mountOnEnter
                    unmountOnExit
                  >
                    <Grid container style={{ marginTop: "50px" }}>
                      <Grid item xs={12} sm={6} md={3} lg={1.5} xl={1.5}></Grid>

                      <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                        {/* <TextField
                    label={<FormattedLabel id='caseTypeEn' required />}
                    id='standard-basic'
                    variant='standard'
                    {...register("caseMainType")}
                    error={!!errors.caseMainType}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("caseMainType") ? true : false) ||
                        (router.query.caseMainType ? true : false),
                    }}
                    helperText={
                      errors?.caseMainType ? errors.caseMainType.message : " "
                    }
                  />
                   */}
                        <Transliteration
                          _key={"caseMainType"}
                          labelName={"caseMainType"}
                          fieldName={"caseMainType"}
                          updateFieldName={"caseMainTypeMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          // disabled={disabled}
                          label={<FormattedLabel id="caseTypeEn" />}
                          error={!!errors.caseMainType}
                          helperText={
                            errors?.caseMainType
                              ? errors.caseMainType.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xl={1} lg={1}></Grid>

                      <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                        {/* <TextField
                    label={<FormattedLabel id='caseTypeMr' required />}
                    id='standard-basic'
                    variant='standard'
                    {...register("caseMainTypeMr")}
                    error={!!errors.caseMainTypeMr}
                    InputProps={{ style: { fontSize: 18 } }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      //true
                      shrink:
                        (watch("caseMainTypeMr") ? true : false) ||
                        (router.query.caseMainTypeMr ? true : false),
                    }}
                    helperText={
                      errors?.caseMainTypeMr
                        ? errors.caseMainTypeMr.message
                        : " "
                    }
                  /> */}

                        <Transliteration
                          _key={"caseMainTypeMr"}
                          labelName={"caseMainTypeMr"}
                          fieldName={"caseMainTypeMr"}
                          updateFieldName={"caseMainType"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          // disabled={disabled}
                          label={<FormattedLabel id="caseTypeMr" />}
                          error={!!errors.caseMainTypeMr}
                          helperText={
                            errors?.caseMainTypeMr
                              ? errors.caseMainTypeMr.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid
                        container
                        spacing={5}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          paddingTop: "10px",
                          marginTop: "20px",
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
                  // printOptions: { disableToolbarButton: true },
                  // disableExport: true,
                  // disableToolbarButton: true,
                  // csvOptions: { disableToolbarButton: true },
                },
              }}
              autoHeight
              sx={{
                border: "1px solid",
                borderColor: "blue",
                // marginLeft: 5,
                // marginRight: 5,
                // marginTop: 5,
                // marginBottom: 5,

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
              // rows={dataSource}
              // columns={columns}
              // pageSize={5}
              // rowsPerPageOptions={[5]}
              //checkboxSelection

              // density="compact"
              // autoHeight={true}
              // rowHeight={50}
              // pagination
              // paginationMode="server"
              // // loading={data.loading}
              // rowCount={data.totalRows}
              // rowsPerPageOptions={data.rowsPerPageOptions}
              // page={data.page}
              // pageSize={data.pageSize}
              // rows={data.rows}
              // columns={columns}
              // onPageChange={(_data) => {
              //   getCaseType(data.pageSize, _data);
              // }}
              // onPageSizeChange={(_data) => {
              //   console.log("222", _data);
              //   // updateData("page", 1);
              //   getCaseType(_data, data.page);
              // }}

              pageSize={40}
              // pageSize={data.pageSize}
              rows={data.rows}
              columns={columns}
              rowsPerPageOptions={[40]}
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
