import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  Stack,
  TextField,
  ThemeProvider
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import Translation from "../../../../components/streetVendorManagementSystem/components/Translation";
import { MeterStatusSchema } from "../../../../components/waterTax/schema/meterStatus";
import ItemMasterCSS from "../../../../components/streetVendorManagementSystem/styles/Item.module.css";
import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  const language = useSelector((state) => state?.labels?.language);

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(MeterStatusSchema(language)),
    mode: "onChange",
    defaultValues: {
      id: null,
      fromDate: null,
      toDate: null,
      meterStatus: "",
      meterStatusMr: "",
      remark: "",
    },
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    clearErrors,
    formState: { errors },
  } = methods;

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [consumerCategoryData, setConsumerCategoryData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const [consumerCategory, setConsumerCategory] = useState([]);
  const [applicationNames, setApplicationNames] = useState([]);

  const [loadderState, setLoadderState] = useState(false);

  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };

  const getConsumerCategory = (_pageSize = 10, _pageNo = 0) => {
    // setLoadderState(true);
    axios
      .get(`${urls.WTURL}/master/meterStatus/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          setLoadderState(false);
          let response = res?.data?.meterStatus;
          console.log("consumerCategoryGet", response);
          let _res = response.map((r, i) => {
            return {
              id: r?.id,
              srNo: i + 1,
              meterStatus: r?.meterStatus,
              meterStatusMr: r?.meterStatusMr,
              toDate: r?.toDate,
              fromDate: r?.fromDate,
              toDate1:
              r?.toDate
                ? moment(r.toDate, "YYYY-MM-DD").isValid()
                  ? moment(r.toDate, "YYYY-MM-DD").format("DD-MM-YYYY")
                  : "-"
                : "-",
              fromDate1:
                r?.fromDate
                  ? moment(r.fromDate, "YYYY-MM-DD").isValid()
                    ? moment(r.fromDate, "YYYY-MM-DD").format("DD-MM-YYYY")
                    : "-"
                  : "-",
              remark: r?.remark,
              activeFlag: r?.activeFlag,
              status: r?.activeFlag === "Y" ? "Active" : "Inactive",
            };
          });

          console.log("object", _res);
          setConsumerCategoryData({
            rows: _res,
            totalRows: res.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res.data.pageSize,
            page: res.data.pageNo,
          });
        }
        setLoadderState(false);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const onSubmitForm = (fromData) => {
    const finalBodyForApi = {
      ...fromData,
      activeFlag: "Y",
    };

    axios
      .post(`${urls.WTURL}/master/meterStatus/save`, finalBodyForApi)
      .then((res) => {
        if (res.status == 200 || res.status == 200) {
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
          }
          getConsumerCategory();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };

    if (_activeFlag === "N") {
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
        if (willDelete === true) {
          axios
            .post(`${urls.WTURL}/master/meterStatus/save`, body)
            .then((res) => {
              if (res.status == 200) {
                swal({
                  title:
                    language == "en"
                      ? "Record is Successfully Deleted!"
                      : "रेकॉर्ड यशस्वीरित्या हटवले आहे!",
                  text: "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
                  icon: "success",
                  button: "ओके",
                });
                getConsumerCategory();
                setButtonInputState(false);
              }
            });
        } else if (willDelete == null) {
          swal({
            title: language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे",
            buttons: {
              confirm: language === "en" ? "OK" : "ओके",
            },
          });
        }
      });
    } else {
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
        if (willDelete === true) {
          axios
            .post(`${urls.WTURL}/master/meterStatus/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (
                res.status == 200 ||
                res.status == 226 ||
                res?.status == 201
              ) {
                swal({
                  title:
                    language == "en"
                      ? "Record is Successfully Activated!"
                      : "रेकॉर्ड यशस्वीरित्या सक्रिय केले आहे!",
                  icon: "success",
                  button: "ओके",
                });
                getConsumerCategory();
                setButtonInputState(false);
              }
            });
        } else if (willDelete == null) {
          swal({
            title: language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे",
            buttons: {
              confirm: language === "en" ? "OK" : "ओके",
            },
          });
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
    fromDate: null,
    toDate: null,
    meterStatus: "",
    meterStatusMr: "",
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    meterStatus: "",
    meterStatusMr: "",
    remark: "",
    id: null,
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: <FormattedLabel id="srNo" />,
      width: 100,
      headerAlign: "center",
      align: "center",
      flex: 1,

    },
    {
      field: "fromDate1",
      headerName: <FormattedLabel id="fromDate" />,
      description: <FormattedLabel id="fromDate" />,
      align: "left",
      headerAlign: "center",
      width: 100,
      flex: 2,

    },
    {
      field: "toDate1",
      headerName: <FormattedLabel id="toDate" />,
      description: <FormattedLabel id="toDate" />,
      width: 100,
      align: "left",
      headerAlign: "center",
      flex: 2,

    },

    {
      field: language == "en" ? "meterStatus" : "meterStatusMr",
      headerName: <FormattedLabel id="meterStatus" />,
      description: <FormattedLabel id="meterStatus" />,
      width: 240,
      flex: 3,

    },

    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      description: <FormattedLabel id="remark" />,
      width: 240,
      flex: 3,
      align: "left",
      headerAlign: "center",
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="action" />,
      description: <FormattedLabel id="action" />,
      align: "left",
      headerAlign: "center",
      width: 120,
      flex: 3,


      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              disabled={params.row.activeFlag == "N" || editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params?.row?.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                reset(params?.row);
              }}
            >
              <EditIcon
                sx={{
                  color: params.row.activeFlag === "N" ? "gray" : "#556CD6",
                }}
              />
            </IconButton>

            <IconButton>
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

  useEffect(() => {
    getConsumerCategory();
  }, [consumerCategory]);

  return (
    <>
      {loadderState ? (
        <Loader />
      ) : (
        <>
          <Paper className={ItemMasterCSS.Paper} elevation={5}>
            <ThemeProvider theme={theme}>
              <div className={ItemMasterCSS.MainHeader}>
                {<FormattedLabel id="meterStatus" />}
              </div>
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
                        <Grid container style={{ marginBottom: "7vh" }}>
                         
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItem: "center",
                            }}
                          >
                            <FormControl
                              style={{ marginTop: 0 }}
                              error={!!errors?.fromDate}
                            >
                              <Controller
                                name="fromDate"
                                control={control}
                                defaultValue={null}
                                render={({ field }) => (
                                  <LocalizationProvider
                                    dateAdapter={AdapterMoment}
                                  >
                                    <DatePicker
                                      className={ItemMasterCSS.FiledWidth}
                                      maxDate={moment.now()}
                                      inputFormat="DD/MM/YYYY"
                                      label={
                                        <span style={{ fontSize: 16 }}>
                                          <FormattedLabel
                                            id="fromDate"
                                            required
                                          />
                                        </span>
                                      }
                                      value={field.value}
                                      onChange={(date) =>
                                        field.onChange(
                                          moment(date).format("YYYY-MM-DD")
                                        )
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
                                {errors?.fromDate
                                  ? errors?.fromDate?.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItem: "center",
                            }}
                          >
                             <FormControl
                              style={{ marginTop: 0 }}
                              error={!!errors?.toDate}
                            >
                              <Controller
                                control={control}
                                name="toDate"
                                defaultValue={null}
                                render={({ field }) => (
                                  <LocalizationProvider
                                    dateAdapter={AdapterMoment}
                                  >
                                    <DatePicker
                                      className={ItemMasterCSS.FiledWidth}
                                      minDate={watch("fromDate")}
                                      // maxDate={moment.now()}
                                      disabled={
                                        watch("fromDate") == null ? true : false
                                      }
                                      inputFormat="DD/MM/YYYY"
                                      label={
                                        <span style={{ fontSize: 16 }}>
                                          <FormattedLabel id="toDate" />
                                        </span>
                                      }
                                      value={field.value}
                                      onChange={(date) =>
                                        field.onChange(
                                          moment(date).format("YYYY-MM-DD")
                                        )
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
                                {errors?.toDate
                                  ? errors?.toDate?.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                       
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItem: "center",
                            }}
                          >
                            <Translation
                              labelName={
                                <FormattedLabel
                                  id="meterStatusEn"
                                  required
                                />
                              }
                              label={
                                <FormattedLabel
                                  id="meterStatusEn"
                                  required
                                />
                              }
                              width={270}
                              error={!!errors?.meterStatus}
                              helperText={
                                errors?.meterStatus
                                  ? errors?.meterStatus?.message
                                  : null
                              }
                              key={"meterStatus"}
                              fieldName={"meterStatus"}
                              updateFieldName={"meterStatusMr"}
                              sourceLang={"en-US"}
                              targetLang={"mr-IN"}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItem: "center",
                            }}
                          >
                            <Translation
                              labelName={
                                <FormattedLabel
                                  id="meterStatusMr"
                                  required
                                />
                              }
                              label={
                                <FormattedLabel
                                  id="meterStatusMr"
                                  required
                                />
                              }
                              width={270}
                              error={!!errors?.meterStatusMr}
                              helperText={
                                errors?.meterStatusMr
                                  ? errors?.meterStatusMr?.message
                                  : null
                              }
                              key={"meterStatusMr"}
                              fieldName={"meterStatusMr"}
                              updateFieldName={"meterStatus"}
                              sourceLang={"mr-IN"}
                              targetLang={"en-US"}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItem: "center",
                            }}
                          >
                            <TextField
                              sx={{
                                width: 270,
                              }}
                              
                              InputLabelProps={{ shrink: watch("remark")!=null && watch("remark")!=""&& watch("remark")!=undefined ? true :false }}
                              id="standard-basic"
                              label={<FormattedLabel id="remark" />}
                              variant="standard"
                              {...register("remark")}
                              error={!!errors?.remark}
                              helperText={
                                errors?.remark ? errors?.remark?.message : null
                              }
                            />
                          </Grid>
                        </Grid>
                        <Stack
                          direction={{
                            xs: "column",
                            sm: "row",
                            md: "row",
                            lg: "row",
                            xl: "row",
                          }}
                          spacing={{ xs: 2, sm: 2, md: 5, lg: 5, xl: 5 }}
                          className={ItemMasterCSS.ButtonStack}
                        >
                          <Button
                            className={ItemMasterCSS.ButtonForMobileWidth}
                            size="small"
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
                            className={ItemMasterCSS.ButtonForMobileWidth}
                            size="small"
                            variant="contained"
                            color="primary"
                            endIcon={<ClearIcon />}
                            onClick={() => cancellButton()}
                          >
                            <FormattedLabel id="clear" />
                          </Button>
                          <Button
                            className={ItemMasterCSS.ButtonForMobileWidth}
                            size="small"
                            variant="contained"
                            color="error"
                            endIcon={<ExitToAppIcon />}
                            onClick={() => exitButton()}
                          >
                            <FormattedLabel id="exit" />
                          </Button>
                        </Stack>
                      </form>
                    </FormProvider>
                  </div>
                </Slide>
              )}
              <div className={ItemMasterCSS.AddButton}>
                <Button
                  size="small"
                  variant="contained"
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
                  <FormattedLabel id="add" />
                </Button>
              </div>
            </ThemeProvider>

            <div className={ItemMasterCSS.DataGridDiv}>
              <DataGrid
                componentsProps={{
                  toolbar: {
                    searchPlaceholder: "शोधा",
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                    printOptions: { disableToolbarButton: true },
                    csvOptions: { disableToolbarButton: true },
                  },
                }}
                components={{ Toolbar: GridToolbar }}
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
                columns={columns}
                density="compact"
                autoHeight={true}
                pagination
                paginationMode="server"
                page={consumerCategoryData?.page}
                rowCount={consumerCategoryData?.totalRows}
                rowsPerPageOptions={consumerCategoryData?.rowsPerPageOptions}
                pageSize={consumerCategoryData?.pageSize}
                rows={consumerCategoryData?.rows}
                onPageChange={(_data) => {
                  getConsumerCategory(consumerCategoryData?.pageSize, _data);
                }}
                onPageSizeChange={(_data) => {
                  getConsumerCategory(_data, consumerCategoryData?.page);
                }}
              />
            </div>
          </Paper>
        </>
      )}
    </>
  );
};

export default Index;
