import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Paper,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useForm, FormProvider } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import specialEventMasterSchema from "../../../../containers/schema/grievanceMonitoring/specialEventMasterSchema";
import styles from "./view.module.css";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil";

const Form = () => {
  const language = useSelector((store) => store.labels.language);
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(specialEventMasterSchema),
    mode: "onChange",
  });
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = methods;

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [mediaNames, setMediaNames] = useState([]);
  const router = useRouter();
  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState();
  const [loading, setLoading] = useState(false);

  const userToken = useSelector((state) => {
    return state?.user?.user?.token;
  });
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error,moduleOrCFC) => {
    if (!catchMethodStatus) {
      if(moduleOrCFC){
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }else{
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };

  useEffect(() => {
    getSpecialEvents();
  }, []);

  const getSpecialEvents = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    axios
      .get(`${urls.GM}/eventTypeMaster/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setLoading(false);
        setMediaNames(
          res?.data?.eventTypeMasterList?.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            status: r.status,
            activeFlag: r.activeFlag,
            alert: r.alert,
            alertShow: moment(r.alert).format("DD-MM-YYYY"),
            description: r.description,
            descriptionMr: r.descriptionMr,
            eventDate: r.eventDate,
            eventDateShow: moment(r.eventDate).format("DD-MM-YYYY"),
            eventType: r.eventType,
            eventTypeMr: r.eventTypeMr,
          }))
        );
        setTotalElements(res.data.totalElements);
        setPageSize(res.data.pageSize);
        setPageNo(res.data.pageNo);
      })
      .catch((err) => {
        setLoading(false);
        cfcErrorCatchMethod(err,false);
      });
  };

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    const eventDate = moment(watch("eventDate")).format("YYYY-MM-DD");
    const alertDate = moment(watch("alert")).format("YYYY-MM-DD");

    setLoading(true);
    const finalBodyForApi = {
      eventDate: eventDate,
      alert: alertDate,
      eventType: watch("eventType"),
      eventTypeMr: watch("eventTypeMr"),
    };
    const finalBodyForApiUpdate = {
      ...formData,
      eventDate: eventDate,
      alert: alertDate,
      eventType: watch("eventType"),
      eventTypeMr: watch("eventTypeMr"),
    };
    if (btnSaveText === "Save") {
      axios
        .post(`${urls.GM}/eventTypeMaster/save`, finalBodyForApi, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setLoading(false);
          if (res.status == 201) {
            sweetAlert({
              title: language === "en" ? "Saved!" : "जतन केले!",
              text:
                language === "en"
                  ? "Record Saved Successfully !"
                  : "रेकॉर्ड यशस्वीरित्या जतन केले!",
              icon: "success",
              button: language === "en" ? "Ok" : "ठीक आहे",
            }).then((will)=>{
              if(will){
                getSpecialEvents();
                setButtonInputState(false);
                setIsOpenCollapse(false);
                setEditButtonInputState(false);
              }
            });
          }
        })
        .catch((err) => {
          setLoading(false);
          cfcErrorCatchMethod(err,false);
        });
    } else if (btnSaveText === "Update") {
      axios
        .post(`${urls.GM}/eventTypeMaster/save`, finalBodyForApiUpdate, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setLoading(false);
          if (res.status == 201) {
            sweetAlert({
              title: language === "en" ? "Updated!" : "अद्यतनित!",
              text:
                language === "en"
                  ? "Record Updated Successfully !"
                  : "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
              icon: "success",
              button: language === "en" ? "Ok" : "ठीक आहे",
            }).then((will)=>{
              if(will){
                getSpecialEvents();
                setButtonInputState(false);
                setIsOpenCollapse(false);
                setEditButtonInputState(false);
              }
            });
          }
        })
        .catch((err) => {
          setLoading(false);
          cfcErrorCatchMethod(err,false);
        });
    }
  };
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };

    if (_activeFlag === "N") {
      sweetAlert({
        title: language == "en" ? "Deactivate?" : "निष्क्रिय करा",
        text:
          language == "en"
            ? "Are You Sure You Want To Deactivate This Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता?",
        icon: "warning",
        buttons: true,
        buttons: [
          language === "en" ? "No" : "नाही",
          language === "en" ? "Yes" : "होय",
        ],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          setLoading(true);
          axios
            .post(`${urls.GM}/eventTypeMaster/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              setLoading(false);
              if (res.status == 201) {
                sweetAlert({
                  title:
                    language === "en" ? "Deactivated!" : "निष्क्रिय केले !",
                  text:
                    language === "en"
                      ? "Record Is Successfully Deactivated!"
                      : "रेकॉर्ड यशस्वीरित्या निष्क्रिय केले आहे!",
                  button: language === "en" ? "Ok" : "ठीक आहे",
                  icon: "success",
                }).then((will)=>{
                  if(will){
                    getSpecialEvents();
                    setButtonInputState(false);
                  }
                });
              }
            })
            .catch((err) => {
              setLoading(false);
              cfcErrorCatchMethod(err,false);
            });
        } else if (willDelete == null) {
          setLoading(false);
          sweetAlert({
            text:
              language === "en" ? "Record Is Safe" : "रेकॉर्ड सुरक्षित आहे",
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        }
      });
    } else {
      sweetAlert({
        title: language == "en" ? "Activate?" : "सक्रिय करायचे?",
        text:
          language == "en"
            ? "Are You Sure You Want To Activate This Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता?",
        icon: "warning",
        buttons: [
          language === "en" ? "No" : "नाही",
          language === "en" ? "Yes" : "होय",
        ],
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        setLoading(false);
        if (willDelete === true) {
          setLoading(true);
          axios
            .post(`${urls.GM}/eventTypeMaster/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              setLoading(false);
              if (res.status == 201) {
                sweetAlert({
                  title: language === "en" ? "Activated!" : "सक्रिय झाले!",
                  text:
                    language === "en"
                      ? "Record Is Successfully activated!"
                      : "रेकॉर्ड यशस्वीरित्या सक्रिय झाले!",
                  icon: "success",
                  button: language === "en" ? "Ok" : "ठीक आहे",
                }).then((will)=>{
                  if(will){
                    getSpecialEvents();
                    setButtonInputState(false);
                  }
                });
              }
            })
            .catch((err) => {
              setLoading(false);
              cfcErrorCatchMethod(err,false);
            });
        } else if (willDelete == null) {
          setLoading(false);
          sweetAlert({
            text:
              language === "en" ? "Record Is Safe" : "रेकॉर्ड सुरक्षित आहे",
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        }
      });
    }
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
    alert: null,
    eventDate: null,
    eventType: "",
    eventTypeMr: "",
    id: null,
  };

  // Reset Values Exit
  const resetValuesExit = {
    alert: null,
    eventDate: null,
    eventType: "",
    eventTypeMr: "",
    id: null,
  };
  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align:'center'
    },
    {
      field: language == "en" ? "eventType" : "eventTypeMr",
      headerName: <FormattedLabel id="eventType" />,
      flex: 1,
      headerAlign: "center",
      align:'left'
    },
    {
      field: "eventDateShow",
      headerName: <FormattedLabel id="eventDate" />,
      flex: 1,
      headerAlign: "center",
      align:'left'
    },
    {
      field: "alertShow",
      headerName: <FormattedLabel id="alert" />,
      flex: 1,
      headerAlign: "center",
      align:'left'
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      headerAlign: "center",
      align:'left',
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
              <Tooltip title={language == "en" ? "Edit" : '"सुधारणे"'}>
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
                <Tooltip
                  title={language == "en" ? "Deactivate" : "निष्क्रिय करा"}
                >
                  <ToggleOnIcon
                    style={{ color: "green", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "N")}
                  />
                </Tooltip>
              ) : (
                <Tooltip title={language == "en" ? "Activate" : "सक्रिय करा"}>
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

  useEffect(() => {
    if (
      watch("eventDate") != "Invalid date" &&
      watch("eventDate") != null &&
      watch("eventDate") != undefined
    ) {
      let endDate = moment(watch("eventDate")).format("YYYY-MM-DD");

      let finEndDate = moment(endDate)
        .subtract(14, "days")
        .format("YYYY-MM-DD");
      setValue("alert", finEndDate);
    }
  }, [watch("eventDate")]);


  // View
  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      <>
        {loading && <CommonLoader />}
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
            <Grid
              container
              style={{
                display: "flex",
                alignItems: "center", // Center vertically
                alignItems: "center",
                width: "100%",
                height: "auto",
                overflow: "auto",
                color: "white",
                fontSize: "18.72px",
                borderRadius: 100,
                fontWeight: 500,
                background:
                  "linear-gradient( 90deg, rgb(72 115 218 / 91%) 2%, rgb(142 122 231) 100%)",
              }}
            >
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
                  <FormattedLabel id="specialEventTypeMaster" />
                </h3>
              </Grid>
            </Grid>
          </Box>

          <form onSubmit={handleSubmit(onSubmitForm)}>
            {isOpenCollapse && (
              <FormProvider {...methods}>
                <Slide
                  direction="down"
                  in={slideChecked}
                  mountOnEnter
                  unmountOnExit
                >
                  <Grid
                    container
                    spacing={2}
                    style={{
                      padding: "1rem",
                    }}
                  >
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                      <FormControl
                        sx={{ m: { xs: 0 }, minWidth: "100%" }}
                        error={!!errors.eventDate}
                      >
                        <Controller
                          control={control}
                          name="eventDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel id="eventDate" required />
                                  </span>
                                }
                                value={field.value || null}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    autoFocus
                                    error={!!errors.eventDate}
                                    size="small"
                                    variant="standard"
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.eventDate ? errors.eventDate.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                      <FormControl
                        sx={{ m: { xs: 0 }, minWidth: "100%" }}
                        error={!!errors.alert}
                      >
                        <Controller
                          control={control}
                          name="alert"
                          defaultValue={null}
                          
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                              // disableFuture
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    <FormattedLabel id="alert" required />
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                maxDate={
                                  watch("eventDate") != null
                                    ? watch("eventDate")
                                    : null
                                }
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    fullWidth
                                    variant="standard"
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.alert ? errors.alert.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                      <Transliteration
                        variant={"standard"}
                        _key={"eventType"}
                        labelName={"eventType"}
                        fieldName={"eventType"}
                        updateFieldName={"eventTypeMr"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        label={<FormattedLabel id="events" required />}
                        error={!!errors.eventType}
                        helperText={
                          errors?.eventType ? errors.eventType.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                      <Transliteration
                        variant={"standard"}
                        _key={"eventTypeMr"}
                        labelName={"eventTypeMr"}
                        fieldName={"eventTypeMr"}
                        updateFieldName={"eventType"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        label={<FormattedLabel id="eventsMr" required />}
                        error={!!errors.eventTypeMr}
                        helperText={
                          errors?.eventTypeMr
                            ? errors.eventTypeMr.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid container style={{ marginTop: "30px" }} spacing={2}>
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitButton()}
                        >
                          <FormattedLabel id="exit" />
                        </Button>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                        >
                          <FormattedLabel id="clear" />
                        </Button>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          type="submit"
                          variant="contained"
                          color="success"
                          size="small"
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
                  </Grid>
                </Slide>
              </FormProvider>
            )}
          </form>
          <div className={styles.addbtn}>
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              type="primary"
              size="small"
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
              <FormattedLabel id="add" />
            </Button>
          </div>
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
            }}
            density="compact"
            pagination
            paginationMode="server"
            rowCount={totalElements}
            rowsPerPageOptions={[10, 20, 50, 100]}
            pageSize={pageSize}
            page={pageNo}
            rows={mediaNames}
            columns={columns}
            onPageChange={(_data) => {
              getSpecialEvents(pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              getSpecialEvents(_data, pageNo);
            }}
          />
        </Paper>
      </>
    </>
  );
};

export default Form;
