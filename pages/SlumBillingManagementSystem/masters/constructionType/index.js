import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Box,
  Paper,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import sweetAlert from "sweetalert";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import { Controller, useForm, FormProvider } from "react-hook-form";
import constructionTypeSchema from "../../../../containers/schema/slumManagementSchema/constructionTypeSchema";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import urls from "../../../../URLS/urls";
import { useSelector } from "react-redux";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";

const Index = () => {
  const methods = useForm({
    resolver: yupResolver(constructionTypeSchema),
    mode: "onChange",
  });
  const {
    register,
    control,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const language = useSelector((state) => state.labels.language);

  //get logged in user
  const user = useSelector((state) => state.user.user);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [dataPageNo, setDataPage] = useState();
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error, moduleOrCFC) => {
    if (!catchMethodStatus) {
      if (moduleOrCFC) {
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      } else {
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };

  useEffect(() => {
    getConstructionType();
  }, []);

  const getConstructionType = (_pageSize = 10, _pageNo = 0) => {
    setIsLoading(true);

    axios
      .get(`${urls.SLUMURL}/mstConstructionType/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res, i) => {
        setIsLoading(false);
        let result = res.data.mstConstructionTypeList;
        const _res = result.map((res, i) => {
          return {
            srNo: i + 1 + _pageNo * _pageSize,
            id: res.id,
            fromDate: res.fromDate
              ? moment(res.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD")
              : "-",
            toDate: res.toDate
              ? moment(res.toDate, "YYYY-MM-DD").format("YYYY-MM-DD")
              : "-",
            fromDate1: res.fromDate
              ? moment(res.fromDate, "YYYY-MM-DD").format("DD-MM-YYYY")
              : "-",
            toDate1: res.toDate
              ? moment(res.toDate, "YYYY-MM-DD").format("DD-MM-YYYY")
              : "-",
            constructionTypePrefix: res.constructionTypePrefix,
            constructionType: res.constructionType,
            constructionTypeMr: res.constructionTypeMr,
            remarks: res.remarks,
            activeFlag: res.activeFlag,
            status: res.activeFlag === "Y" ? "Active" : "InActive",
          };
        });
        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    if (_activeFlag === "N") {
      swal({
        title: language === "en" ? "Deactivate?" : "निष्क्रिय?",
        text:
          language === "en"
            ? "Are you sure you want to deactivate this Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता?",
        icon: "warning",
        buttons: [
          language == "en" ? "No" : "नाही",
          language === "en" ? "Yes" : "होय",
        ],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          axios
            .post(`${urls.SLUMURL}/mstConstructionType/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              if (res.status == 201) {
                swal(
                  language === "en"
                    ? "Record is Successfully Deactivated!"
                    : "रेकॉर्ड यशस्वीरित्या निष्क्रिय केले आहे!",
                  {
                    icon: "success",
                    button: language === "en" ? "Ok" : "ठीक आहे",
                  }
                ).then((will) => {
                  if (will) {
                    getConstructionType();
                    setButtonInputState(false);
                  }
                });
              }
            })
            .catch((err) => {
              cfcErrorCatchMethod(err, false);
            });
        } else if (willDelete == null) {
          swal(language === "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे", {
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        }
      });
    } else {
      swal({
        title: language === "en" ? "Activate?" : "सक्रिय?",
        text:
          language === "en"
            ? "Are you sure you want to activate this Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता?",
        icon: "warning",
        buttons: [
          language == "en" ? "No" : "नाही",
          language === "en" ? "Yes" : "होय",
        ],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          axios
            .post(`${urls.SLUMURL}/mstConstructionType/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              if (res.status == 201) {
                swal(
                  language === "en"
                    ? "Record is Successfully activated!"
                    : "रेकॉर्ड यशस्वीरित्या सक्रिय झाले आहे!",
                  {
                    icon: "success",
                    button: language === "en" ? "Ok" : "ठीक आहे",
                  }
                ).then((will) => {
                  if (will) {
                    getConstructionType();
                    setButtonInputState(false);
                  }
                });
              }
            })
            .catch((err) => {
              cfcErrorCatchMethod(err, false);
            });
        } else if (willDelete == null) {
          swal(language === "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे", {
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        }
      });
    }
  };

  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
  };

  const onSubmitForm = (formData) => {
    setIsLoading(true);
    const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
    const toDate = moment(formData.toDate).format("YYYY-MM-DD");
    const finalBodyForApi = {
      ...formData,
      fromDate,
      toDate,
    };

    axios
      .post(`${urls.SLUMURL}/mstConstructionType/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          formData.id
            ? sweetAlert(
                language === "en" ? "Updated!" : "अद्ययावत केले!",
                language === "en"
                  ? "Record Updated Successfully !"
                  : "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
                "success",
                { button: language === "en" ? "Ok" : "ठीक आहे" }
              ).then((will) => {
                if (will) {
                  getConstructionType();
                  setButtonInputState(false);
                  setIsOpenCollapse(false);
                  setEditButtonInputState(false);
                }
              })
            : sweetAlert(
                language === "en" ? "Saved!" : "जतन केले!",
                language === "en"
                  ? "Record Saved Successfully !"
                  : "रेकॉर्ड यशस्वीरित्या जतन केले!",
                "success",
                { button: language === "en" ? "Ok" : "ठीक आहे" }
              ).then((will) => {
                if (will) {
                  getConstructionType();
                  setButtonInputState(false);
                  setIsOpenCollapse(false);
                  setEditButtonInputState(false);
                }
              });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    constructionType: "",
    constructionTypeMr: "",
    remarks: "",
    constructionTypePrefix: "",
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    fromDate: null,
    toDate: null,
    constructionType: "",
    constructionTypeMr: "",
    remarks: "",
    constructionTypePrefix: "",
  };


  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "constructionTypePrefix",
      headerName: <FormattedLabel id="constructionTypePrefix" />,
      flex: 1,
      headerAlign: "center",
      minWidth: 150,
    },
    {
      field: language == "en" ? "constructionType" : "constructionTypeMr",
      headerName: <FormattedLabel id="constructionType" />,
      flex: 1,
      headerAlign: "center",
      minWidth: 150,
    },
    {
      field: "fromDate1",
      headerName: <FormattedLabel id="fromDate" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 250,
    },
    {
      field: "toDate1",
      headerName: <FormattedLabel id="toDate" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
      minWidth: 250,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                reset(params.row);
              }}
            >
              <Tooltip title="Edit">
                <EditIcon style={{ color: "#556CD6" }} />
              </Tooltip>
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setSlideChecked(true);
                setButtonInputState(true);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <Tooltip title="Deactivate">
                  <ToggleOnIcon
                    style={{ color: "green", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "N")}
                  />
                </Tooltip>
              ) : (
                <Tooltip title="Activate">
                  <ToggleOffIcon
                    style={{ color: "red", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "Y")}
                  />
                </Tooltip>
              )}
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      {isLoading && <CommonLoader />}
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
        <Box>
          <Grid container className={commonStyles.title}>
            <Grid item xs={1}>
              <IconButton
                style={{
                  color: "white",
                }}
                onClick={() => {
                  router.back();
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Grid>
            <Grid item xs={10}>
              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  marginRight: "2rem",
                }}
              >
                <FormattedLabel id="constructionType" />
              </h3>
            </Grid>
          </Grid>
        </Box>
        {isOpenCollapse && (
          <FormProvider {...methods}>
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Grid container spacing={2} sx={{ padding: "1rem" }}>
                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <FormControl
                      sx={{ minWidth: "90%" }}
                      error={!!errors.fromDate}
                    >
                      <Controller
                        control={control}
                        name="fromDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              variant="standard"
                              inputFormat="DD/MM/YYYY"
                              disableFuture
                              label={
                                <span style={{ fontSize: 16 }}>
                                  {<FormattedLabel id="fromDate" />}
                                </span>
                              }
                              value={field.value}
                              onChange={(date) => field.onChange(date)}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  variant="standard"
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
                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <FormControl
                      sx={{ minWidth: "90%" }}
                      error={!!errors.toDate}
                    >
                      <Controller
                        control={control}
                        name="toDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              variant="standard"
                              inputFormat="DD/MM/YYYY"
                              minDate={watch("fromDate")}
                              label={
                                <span style={{ fontSize: 16 }}>
                                  {<FormattedLabel id="toDate" />}
                                </span>
                              }
                              value={field.value}
                              onChange={(date) => field.onChange(date)}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  variant="standard"
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

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <TextField
                      size="small"
                      sx={{ minWidth: "90%" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="constructionTypePrefix" />}
                      variant="standard"
                      {...register("constructionTypePrefix")}
                      error={!!errors.constructionTypePrefix}
                      helperText={
                        errors?.constructionTypePrefix
                          ? errors.constructionTypePrefix.message
                          : null
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <Transliteration
                      variant={"standard"}
                      _key={"constructionType"}
                      labelName={"constructionType"}
                      fieldName={"constructionType"}
                      updateFieldName={"constructionTypeMr"}
                      sourceLang={"eng"}
                      width={"90%"}
                      targetLang={"mar"}
                      label={<FormattedLabel id="constructionType" required />}
                      error={!!errors.constructionType}
                      helperText={
                        errors?.constructionType
                          ? errors.constructionType.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <Transliteration
                      variant={"standard"}
                      _key={"constructionTypeMr"}
                      labelName={"constructionTypeMr"}
                      fieldName={"constructionTypeMr"}
                      updateFieldName={"constructionType"}
                      sourceLang={"eng"}
                      width={"90%"}
                      targetLang={"mar"}
                      label={
                        <FormattedLabel id="constructionTypeMr" required />
                      }
                      error={!!errors.constructionTypeMr}
                      helperText={
                        errors?.constructionTypeMr
                          ? errors.constructionTypeMr.message
                          : null
                      }
                    />
                  </Grid>
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
                      variant="contained"
                      size="small"
                      color="error"
                      endIcon={<ExitToAppIcon />}
                      onClick={() => exitButton()}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      endIcon={<ClearIcon />}
                      onClick={() => cancellButton()}
                    >
                      <FormattedLabel id="clear" />
                    </Button>
                  </Grid>

                  <Grid item>
                    <Button
                      type="submit"
                      variant="contained"
                      size="small"
                      color="success"
                      endIcon={<SaveIcon />}
                    >
                      {btnSaveText === "Update" ? (
                        <FormattedLabel id="update" />
                      ) : (
                        <FormattedLabel id="save" />
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Slide>
          </FormProvider>
        )}

        <Grid container style={{ padding: "10px" }}>
          <Grid item xs={12} style={{ display: "flex", justifyContent: "end" }}>
            <Button
              variant="contained"
              size="small"
              endIcon={<AddIcon />}
              type="primary"
              disabled={buttonInputState}
              onClick={() => {
                reset({
                  ...resetValuesExit,
                });
                setEditButtonInputState(true);
                setBtnSaveText("Save");
                setButtonInputState(true);
                setSlideChecked(true);
                setIsOpenCollapse(!isOpenCollapse);
              }}
            >
              <FormattedLabel id="add" />{" "}
            </Button>
          </Grid>
        </Grid>
        <DataGrid
          autoHeight
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          sx={{
            overflowY: "scroll",
            marginTop: "20px",
            "& .MuiDataGrid-virtualScrollerContent": {},
            "& .MuiDataGrid-columnHeadersInner": {
              backgroundColor: "#556CD6",
              color: "white",
            },
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
            // "& .MuiDataGrid-toolbarContainer .MuiButton-root[aria-label='Export']":
            //   {
            //     display: "none",
            //   },
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
            setDataPage(_data);
            getConstructionType(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            setDataPage(_data);
            getConstructionType(_data, data.page);
          }}
        />
      </Paper>
    </>
  );
};

export default Index;
