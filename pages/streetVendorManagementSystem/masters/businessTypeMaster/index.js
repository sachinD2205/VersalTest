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
  ThemeProvider,
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
import { BusinessTypeSchema } from "../../../../components/streetVendorManagementSystem/schema/BusinessTypeSchema";
import ItemMasterCSS from "../../../../components/streetVendorManagementSystem/styles/Item.module.css";
import Loader from "../../../../containers/Layout/components/Loader";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import { catchExceptionHandlingMethod } from "../../../../util/util";
const Index = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(BusinessTypeSchema(language)),
    mode: "onChange",
    defaultValues: {
      id: null,
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
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const language = useSelector((state) => state?.labels?.language);
  const [businessTypes, setBusinessTypes] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const [loadderState, setLoadderState] = useState(false);
  const [applicationNames, setApplicationNames] = useState([]);
  const userToken = useGetToken();
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


  const getModuleName = () => {
    const url = `${urls.CFCURL}/master/application/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          console.log("applicationApiData", res?.data);
          let temp = [res?.data?.application?.find((data) => data?.id == "4")];
          console.log("tem123", temp);
          setApplicationNames(
            temp?.map((row) => ({
              id: row?.id,
              applicationNameEn: row?.applicationNameEng,
              applictionNameMr: row?.applicationNameMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getBusinessTypes = (_pageSize = 10, _pageNo = 0) => {
    setLoadderState(true);

    axios
      .get(`${urls.HMSURL}/master/businessType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          setLoadderState(false);

          let response = res?.data?.businessType;
          console.log("businessTypeGet", response);
          let _res = response.map((r, i) => {
            return {
              id: r.id,
              srNo: i + 1,
              applicationName: r?.applicationName,
              applicationNameEn: applicationNames?.find(
                (data) => data?.id == r?.applicationName
              )?.applicationNameEn,
              applicationNameMr: applicationNames?.find(
                (data) => data?.id == r?.applicationName
              )?.applictionNameMr,

              toDate: r.toDate,
              fromDate: r.fromDate,
              toDate1:
                moment(r.toDate, "DD-MM-YYYY").format("DD-MM-YYYY") !=
                  "Invalid date"
                  ? moment(r.toDate, "DD-MM-YYYY").format("DD-MM-YYYY")
                  : "-",
              fromDate1:
                moment(r.fromDate, "DD-MM-YYYY").format("DD-MM-YYYY") !=
                  "Invalid date"
                  ? moment(r.fromDate, "DD-MM-YYYY").format("DD-MM-YYYY")
                  : "-",
              businessType: r.businessType,
              businessTypeMr: r.businessTypeMr,
              remark: r.remark,
              activeFlag: r?.activeFlag,
              status: r?.activeFlag === "Y" ? "Active" : "Inactive",
            };
          });

          console.log("object", _res);
          setBusinessTypes({
            rows: _res,
            totalRows: res.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res.data.pageSize,
            page: res.data.pageNo,
          });
        }
      })
      .catch((error) => {
        setLoadderState(false);
        callCatchMethod(error, language);
      });
  };

  const onSubmitForm = (fromData) => {
    const finalBodyForApi = {
      ...fromData,
      activeFlag: "Y",
    };

    axios
      .post(`${urls.HMSURL}/master/businessType/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
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
          getBusinessTypes();
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
        title: language == "en" ? "Inactivate?" : "निष्क्रिय करणे",
        text:
          language == "en"
            ? "Are you sure you want to inactivate this Record ?"
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता?",
        icon: "warning",
        buttons: {
          cancel: language === "en" ? "No, Cancel" : "नको, कॅन्सेल",
          confirm: language === "en" ? "Yes, Inactivate" : "होय, निष्क्रिय करा",
        },
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          axios
            .post(`${urls.HMSURL}/master/businessType/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              if (res.status == 200) {
                swal({
                  text:
                    language == "en"
                      ? "Record is Successfully Deleted!"
                      : "रेकॉर्ड यशस्वीरित्या हटवले आहे!",
                  icon: "success",
                  button: "ओके",
                });
                getBusinessTypes();
                setButtonInputState(false);
              }
            }).catch((error) => {
              callCatchMethod(error, language);
            });
        } else if (willDelete == null) {
          swal({
            text: language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे",
            buttons: {
              confirm: language === "en" ? "OK" : "ओके",
            },
          });
        }
      });
    } else {
      swal({
        title: language == "en" ? "Activate?" : "सक्रिय करायचे?",
        text:
          language == "en"
            ? "Are you sure you want to activate this Record ?"
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता?",
        icon: "warning",
        buttons: {
          cancel: language === "en" ? "No, Cancel" : "नको, कॅन्सेल",
          confirm: language === "en" ? "Yes, Activate" : "होय, सक्रिय करा",
        },
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          axios
            .post(`${urls.HMSURL}/master/businessType/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
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
                      : "रेकॉर्ड यशस्वीरित्या सक्रिय केले गेले आहे!",
                  icon: "success",
                  button: "ओके",
                });

                getBusinessTypes();
                setButtonInputState(false);
              }
            }).catch((error) => {
              callCatchMethod(error, language);
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
    clearErrors();
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
    clearErrors()
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    remark: "",
    applicationName: null,
    fromDate: null,
    toDate: null,
    businessType: "",
    businessTypeMr: ""
  };

  // Reset Values Exit
  const resetValuesExit = {
    remark: "",
    applicationName: null,
    fromDate: null,
    toDate: null,
    businessType: "",
    businessTypeMr: "",
    id: null,
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: <FormattedLabel id="srNo" />,
      width: 20,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language == "en" ? "applicationNameEn" : "applicationNameMr",
      headerName: <FormattedLabel id="applicationName" />,
      description: <FormattedLabel id="applicationName" />,
      width: 250,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "fromDate1",
      headerName: <FormattedLabel id="fromDate" />,
      description: <FormattedLabel id="fromDate" />,
      headerAlign: "center",
      align: "center",
      width: 200,
    },
    {
      field: "toDate1",
      headerName: <FormattedLabel id="toDate" />,
      description: <FormattedLabel id="toDate" />,
      width: 200,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "businessType",
      headerName: <FormattedLabel id="businessTypeEn" />,
      description: <FormattedLabel id="businessTypeEn" />,
      width: 300,
    },

    {
      field: "businessTypeMr",
      headerName: <FormattedLabel id="businessTypeMr" />,
      description: <FormattedLabel id="businessTypeMr" />,
      width: 300,
    },

    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      description: <FormattedLabel id="remark" />,
      width: 200,
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
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        console.log("params", params);
        return (
          <>
            <IconButton
              disabled={params.row.activeFlag == "N" || editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params?.row?.id),
                  setSlideChecked(true);
                setIsOpenCollapse(!isOpenCollapse);
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
    getBusinessTypes();
    getModuleName();
  }, []);

  return (
    <>
      {loadderState ? (
        <Loader />
      ) : (
        <div>
          <Paper className={ItemMasterCSS.Paper} elevation={5}>
            <ThemeProvider theme={theme}>
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
                  textAlign: "center",
                }}
              >
                <strong>{<FormattedLabel id="businessType" />}</strong>
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
                            className={ItemMasterCSS.GridItem}
                          >
                            <FormControl
                              variant="standard"
                              error={!!errors?.applicationName}
                            >
                              <InputLabel
                                shrink={
                                  watch("applicationName") !== null &&
                                    watch("applicationName") !== "" &&
                                    watch("applicationName") !== undefined
                                    ? true
                                    : false
                                }
                                id="demo-simple-select-standard-label"
                              >
                                <FormattedLabel id="applicationName" required />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    className={ItemMasterCSS.FiledWidth}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label={
                                      <FormattedLabel
                                        id="applicationName"
                                        required
                                      />
                                    }
                                  >
                                    {applicationNames &&
                                      applicationNames.map(
                                        (applicationName) => (
                                          <MenuItem
                                            key={applicationName?.id + 1}
                                            value={applicationName?.id}
                                          >
                                            {language == "en"
                                              ? applicationName?.applicationNameEn
                                              : applicationName?.applictionNameMr}
                                          </MenuItem>
                                        )
                                      )}
                                  </Select>
                                )}
                                name="applicationName"
                                control={control}
                                defaultValue={null}
                              />
                              <FormHelperText>
                                {errors?.applicationName
                                  ? errors?.applicationName?.message
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
                            className={ItemMasterCSS.GridItem}
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
                                      // minDate={moment.now()}
                                      className={ItemMasterCSS.FiledWidth}
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
                            className={ItemMasterCSS.GridItem}
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
                            className={ItemMasterCSS.GridItem}
                          >
                            {/* <TextField
                            id='standard-basic'
                            label=<FormattedLabel id='businessTypeEn' />
                            variant='standard'
                            {...register("businessType")}
                            error={!!errors?.businessType}
                            helperText={
                              errors?.businessType
                                ? errors?.businessType?.message
                                : null
                            }
                          /> */}

                            <Translation
                              labelName={
                                <FormattedLabel id="businessTypeEn" required />
                              }
                              label={
                                <FormattedLabel id="businessTypeEn" required />
                              }
                              width={270}
                              // disabled={watch("businessType")}
                              error={!!errors?.businessType}
                              helperText={
                                errors?.businessType
                                  ? errors?.businessType?.message
                                  : null
                              }
                              key={"businessType"}
                              fieldName={"businessType"}
                              updateFieldName={"businessTypeMr"}
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
                            className={ItemMasterCSS.GridItem}
                          >
                            {/* <TextField
                            id='standard-basic'
                            label=<FormattedLabel id='businessTypeMr' />
                            variant='standard'
                            {...register("businessTypeMr")}
                            error={!!errors?.businessTypeMr}
                            helperText={
                              errors?.businessTypeMr
                                ? errors?.businessTypeMr?.message
                                : null
                            }
                          /> */}
                            <Translation
                              labelName={
                                <FormattedLabel id="businessTypeMr" required />
                              }
                              label={
                                <FormattedLabel id="businessTypeMr" required />
                              }
                              width={270}
                              // disabled={watch("businessTypeMr")}
                              error={!!errors?.businessTypeMr}
                              helperText={
                                errors?.businessTypeMr
                                  ? errors?.businessTypeMr?.message
                                  : null
                              }
                              key={"businessTypeMr"}
                              fieldName={"businessTypeMr"}
                              updateFieldName={"businessType"}
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
                            className={ItemMasterCSS.GridItem}
                          >
                            <TextField
                              sx={{ width: 270 }}
                              id="standard-basic"

                              InputLabelProps={{ shrink: watch("remark") != null && watch("remark") != "" && watch("remark") != undefined ? true : false }}
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
                    // disableExport: true,
                    // disableToolbarButton: true,
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
                page={businessTypes?.page}
                rowCount={businessTypes?.totalRows}
                rowsPerPageOptions={businessTypes?.rowsPerPageOptions}
                pageSize={businessTypes?.pageSize}
                rows={businessTypes?.rows}
                onPageChange={(_data) => {
                  getBusinessTypes(businessTypes?.pageSize, _data);
                }}
                onPageSizeChange={(_data) => {
                  getBusinessTypes(_data, businessTypes?.page);
                }}
              />
            </div>
          </Paper>
        </div>
      )}
    </>
  );
};

export default Index;
