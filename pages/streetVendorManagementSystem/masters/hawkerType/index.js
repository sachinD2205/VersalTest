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
import "react-toastify/dist/ReactToastify.css";
import { default as swal, default as sweetAlert } from "sweetalert";
import urls from "../../../../URLS/urls";
import Translation from "../../../../components/streetVendorManagementSystem/components/Translation";
import hawkerTypeSchema from "../../../../components/streetVendorManagementSystem/schema/HawkerTypeSchema";
import HawkerTypesCSS from "../../../../components/streetVendorManagementSystem/styles/HawkerType.module.css";
import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

// Fun
const Index = () => {
  const language = useSelector((state) => state?.labels.language);
  const [dataValidation, setDataValidation] = useState(
    hawkerTypeSchema(language)
  );
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(dataValidation),
    mode: "onChange",
  });
  const {
    register,
    control,
    handleSubmit,
    // methods,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = methods;
  const [hawkerTypeData, setHawkerTypeData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [applicationNames, setApplicationNames] = useState([]);
  const userToken = useGetToken();

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

  // hawkerTypeColumns
  const hawkerTypeColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: <FormattedLabel id="srNo" />,
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    // applcation Name
    {
      field: language == "en" ? "applicationNameEn" : "applicationNameMr",
      headerName: <FormattedLabel id="applicationName" />,
      description: <FormattedLabel id="applicationName" />,
      width: 200,
      headerAlign: "center",
      align: "center",
    },

    // hawker Type
    {
      field: "hawkerType",
      headerName: <FormattedLabel id="hawkerTypeEn" />,
      description: <FormattedLabel id="hawkerTypeEn" />,
      width: 250,
      headerAlign: "center",
      align: "center",
    },
    // hawker Type Mr
    {
      field: "hawkerTypeMr",
      headerName: <FormattedLabel id="hawkerTypeMr" />,
      description: <FormattedLabel id="hawkerTypeMr" />,
      width: 250,
      headerAlign: "center",
      align: "center",
    },
    //  fromDate
    {
      field: "fromDate1",
      headerName: <FormattedLabel id="fromDate" />,
      description: <FormattedLabel id="fromDate" />,
      headerAlign: "center",
      align: "center",
      width: 200,
    },
    // toDate
    {
      field: "toDate1",
      headerName: <FormattedLabel id="toDate" />,
      description: <FormattedLabel id="toDate" />,
      headerAlign: "center",
      align: "center",
      width: 200,
    },
    // Remark
    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      description: <FormattedLabel id="remark" />,
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    // actions
    {
      field: "actions",
      headerName: <FormattedLabel id="action" />,
      description: <FormattedLabel id="action" />,
      align: "left",
      headerAlign: "center",
      align: "center",
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update");
                setID(params?.row?.id);
                setIsOpenCollapse(true);
                setSlideChecked(true);
                setButtonInputState(true);
                reset(params?.row);
              }}
            >
              <EditIcon sx={{ color: "#556CD6" }} />
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

  const getHawkerType = (_pageSize = 10, _pageNo = 0) => {
    setValue("loadderState", true);

    const url = `${urls.HMSURL}/hawkerType/getAll`;
    axios
      .get(url, {
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
          let response = res?.data?.hawkerType;
          let _res = response.map((r, i) => {
            return {
              id: r?.id,
              srNo: i + 1,
              // application name
              applicationName: r?.applicationName,
              applicationNameEn: applicationNames?.find(
                (data) => data?.id == r?.applicationName
              )?.applicationNameEn,
              applicationNameMr: applicationNames?.find(
                (data) => data?.id == r?.applicationName
              )?.applictionNameMr,
              // applicationName
              toDate1:
                moment(r?.toDate, "YYYY-MM-DD").format("DD-MM-YYYY") !=
                  "Invalid date"
                  ? moment(r?.toDate, "YYYY-MM-DD").format("DD-MM-YYYY")
                  : "-",
              fromDate1:
                moment(r?.fromDate, "YYYY-MM-DD").format("DD-MM-YYYY") !=
                  "Invalid date"
                  ? moment(r?.fromDate, "YYYY-MM-DD").format("DD-MM-YYYY")
                  : "-",
              toDate: r?.toDate,
              fromDate: r?.fromDate,
              hawkerType: r.hawkerType,
              hawkerTypeMr: r?.hawkerTypeMr,
              remark: r?.remark,
              activeFlag: r?.activeFlag,
              status: r?.activeFlag === "Y" ? "Active" : "Inactive",
            };
          });
          setHawkerTypeData({
            rows: _res,
            totalRows: res?.data?.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res?.data?.pageSize,
            page: res?.data?.pageNo,
          });
        }
        setValue("loadderState", false);
      })
      .catch((error) => {
        setValue("loadderState", false);
        callCatchMethod(error, language);
      });
  };

  const onSubmitForm = (fromData) => {
    setValue("loadderState", true);

    // finalBody For Api
    const finalBodyForApi = {
      ...fromData,
      activeFlag: "Y",
    };

    //url
    const url = `${urls.HMSURL}/hawkerType/save`;

    axios
      .post(url, finalBodyForApi,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
      .then((res) => {
        setValue("loadderState", false);
        if (res.status == 200 || res.status == 201) {
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
          setButtonInputState(false);
          setIsOpenCollapse(false);
          getHawkerType();
          setEditButtonInputState(false);
        }
      })
      .catch((error) => {
        setValue("loadderState", false);
        callCatchMethod(error, language);
      });
  };

  // Module Name
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

  // delete
  const deleteById = (value, _activeFlag) => {
    //body
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };

    // url
    let url = `${urls.HMSURL}/hawkerType/save`;

    if (_activeFlag === "N") {
      swal({
        title: language == "en" ? "Inactivate ?" : "निष्क्रिय ?",
        text:
          language == "en"
            ? "are you sure you want to inactivate this record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          setValue("loadderState", true);
          axios
            .post(url, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              setValue("loadderState", false);
              if (res?.status == 200 || res?.status == 201) {
                sweetAlert(
                  language == "en"
                    ? "record successfully inactive"
                    : "रेकॉर्ड यशस्वीरित्या निष्क्रिय",
                  {
                    icon: "success",
                  }
                );
                getHawkerType();
                setButtonInputState(false);
              }
            })
            .catch((error) => {
              setValue("loadderState", false);
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
    } else {
      swal({
        title: language == "en" ? "Activate" : "सक्रिय",
        text:
          language == "en"
            ? "are you sure you want to activate this record? "
            : "तुम्हाला खात्री आहे की तुम्ही हा रेकॉर्ड सक्रिय करू इच्छिता?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          setValue("loadderState", true);
          axios
            .post(url, body,
              {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              })
            .then((res) => {
              setValue("loadderState", false);
              if (res?.status == 200 || res?.status == 201) {
                sweetAlert(
                  language == "en"
                    ? "record is successfully activated !"
                    : "रेकॉर्ड यशस्वीरित्या सक्रिय केले आहे!",
                  {
                    icon: "success",
                  }
                );
                getHawkerType();
                setButtonInputState(false);
              }
            })
            .catch((error) => {
              setValue("loadderState", false);
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
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Button
  const resetValuesCancell = {
    fromDate: null,
    toDate: null,
    hawkerType: "",
    hawkerTypeMr: "",
    applicationName: null,
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    hawkerType: "",
    hawkerTypeMr: "",
    remark: "",
    applicationName: null,
    id: null,
  };

  // loadderSetTimeOutFunction
  // const loadderSetTimeOutFunction = () => {
  //   setTimeout(() => {
  //     console.log("bhvaa", watch("loadderState"));
  //     setValue("loadderState", false);
  //     console.log("bhvaa2", watch("loadderState"));
  //   }, 0);
  // };


  // !  ==================> useEffect <============

  useEffect(() => {
    setValue("loadderState", true);
    // loadderSetTimeOutFunction();
    getModuleName();
  }, []);

  useEffect(() => {
    getHawkerType();
  }, [applicationNames]);

  // View
  return (
    <div>
      {watch("loadderState") ? (
        <Loader />
      ) : (
        <div>
          <Paper className={HawkerTypesCSS.Paper} elevation={5}>
            <ThemeProvider theme={theme}>
              <div className={HawkerTypesCSS.MainHeader}>
                {<FormattedLabel id="streetVendorType" />}
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
                        <Grid
                          container
                          className={HawkerTypesCSS.GridContainer}
                        >
                          {/** Module Name */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={HawkerTypesCSS.GridItem}
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
                                    className={HawkerTypesCSS.FiledWidth}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label=<FormattedLabel
                                      id="applicationName"
                                      required
                                    />
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

                          {/** from Date  */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={HawkerTypesCSS.GridItem}
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
                                      className={HawkerTypesCSS.FiledWidth}
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
                                      onChange={(date) => field.onChange(date)}
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
                          {/** to Date */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={HawkerTypesCSS.GridItem}
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
                                      minDate={watch("fromDate")}
                                      disabled={
                                        watch("fromDate") == null ? true : false
                                      }
                                      className={HawkerTypesCSS.FiledWidth}
                                      inputFormat="DD/MM/YYYY"
                                      label={
                                        <span style={{ fontSize: 16 }}>
                                          <FormattedLabel id="toDate" />
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
                          {/** hawker Type */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={HawkerTypesCSS.GridItem}
                          >
                            {/* <TextField
                              className={HawkerTypesCSS.FiledWidth}
                              label=<FormattedLabel
                                id="hawkerTypeEn"
                                required
                              />
                              variant="standard"
                              {...register("hawkerType")}
                              error={!!errors.hawkerType}
                              helperText={
                                errors?.hawkerType
                                  ? errors.hawkerType.message
                                  : null
                              }
                            /> */}

                            <Translation
                              labelName={
                                <FormattedLabel id="hawkerTypeEn" required />
                              }
                              label={
                                <FormattedLabel id="hawkerTypeEn" required />
                              }
                              width={270}
                              disabled={watch("disabledFieldInputState")}
                              error={!!errors?.hawkerType}
                              helperText={
                                errors?.hawkerType
                                  ? errors?.hawkerType?.message
                                  : null
                              }
                              key={"hawkerType"}
                              fieldName={"hawkerType"}
                              updateFieldName={"hawkerTypeMr"}
                              sourceLang={"en-US"}
                              targetLang={"mr-IN"}
                            />
                          </Grid>
                          {/** hawker Type mr  */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={HawkerTypesCSS.GridItem}
                          >
                            {/* <TextField
                              className={HawkerTypesCSS.FiledWidth}
                              label=<FormattedLabel
                                id="hawkerTypeMr"
                                required
                              />
                              variant="standard"
                              {...register("hawkerTypeMr")}
                              error={!!errors?.hawkerTypeMr}
                              helperText={
                                errors?.hawkerTypeMr
                                  ? errors?.hawkerTypeMr?.message
                                  : null
                              }
                            /> */}

                            <Translation
                              labelName={
                                <FormattedLabel id="hawkerTypeMr" required />
                              }
                              label={
                                <FormattedLabel id="hawkerTypeMr" required />
                              }
                              width={270}
                              disabled={watch("disabledFieldInputState")}
                              error={!!errors?.hawkerTypeMr}
                              helperText={
                                errors?.hawkerTypeMr
                                  ? errors?.hawkerTypeMr?.message
                                  : null
                              }
                              key={"hawkerTypeMr"}
                              fieldName={"hawkerTypeMr"}
                              updateFieldName={"hawkerType"}
                              sourceLang={"en-US"}
                              targetLang={"mr-IN"}
                            />
                          </Grid>
                          {/** remark  */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={HawkerTypesCSS.GridItem}
                          >
                            <TextField
                              InputLabelProps={{
                                shrink:
                                  watch("remark") !== null &&
                                    watch("remark") !== "" &&
                                    watch("remark") !== undefined
                                    ? true
                                    : false,
                              }}
                              className={HawkerTypesCSS.FiledWidth}
                              label=<FormattedLabel id="remark" />
                              variant="standard"
                              {...register("remark")}
                              error={!!errors.remark}
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
                          className={HawkerTypesCSS.ButtonStack}
                        >
                          <Button
                            className={HawkerTypesCSS.ButtonForMobileWidth}
                            type="submit"
                            size="small"
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
                            className={HawkerTypesCSS.ButtonForMobileWidth}
                            variant="contained"
                            color="primary"
                            size="small"
                            endIcon={<ClearIcon />}
                            onClick={() => cancellButton()}
                          >
                            <FormattedLabel id="clear" />
                          </Button>
                          <Button
                            className={HawkerTypesCSS.ButtonForMobileWidth}
                            variant="contained"
                            color="error"
                            size="small"
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

              <div className={HawkerTypesCSS.AddButton}>
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
            </ThemeProvider>

            <div className={HawkerTypesCSS.DataGridDiv}>
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
                density="standard"
                autoHeight={true}
                columns={hawkerTypeColumns}
                pagination
                paginationMode="server"
                page={hawkerTypeData?.page}
                rowCount={hawkerTypeData?.totalRows}
                rowsPerPageOptions={hawkerTypeData?.rowsPerPageOptions}
                pageSize={hawkerTypeData?.pageSize}
                rows={hawkerTypeData?.rows}
                onPageChange={(_data) => {
                  getHawkerType(hawkerTypeData?.pageSize, _data);
                }}
                onPageSizeChange={(_data) => {
                  getHawkerType(_data, hawkerTypeData?.page);
                }}
              />
            </div>
          </Paper>
        </div>
      )}
    </div>
  );
};

export default Index;
