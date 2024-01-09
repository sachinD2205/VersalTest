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
import ItemCategorySchema from "../../../../components/streetVendorManagementSystem/schema/ItemCategorySchema";
import ItemCategoryCSS from "../../../../components/streetVendorManagementSystem/styles/ItemCategory.module.css";
import Loader from "../../../../containers/Layout/components/Loader";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// Fun
const Index = () => {
  const language = useSelector((state) => state?.labels.language);
  const [dataValidation, setDataValidation] = useState(
    ItemCategorySchema(language)
  );
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(dataValidation),
    mode: "onChange",
  });
  const userToken = useGetToken();
  const {
    register,
    control,
    handleSubmit,
    // methods,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = methods;
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [applicationNames, setApplicationNames] = useState([]);
  const [itemCategoryData, setItemCategoryData] = useState({
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


  // Module Name
  const getModuleName = () => {
    const url = `${urls.CFCURL}/master/application/getAll`;

    axios
      .get(url,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
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
        console.log("applicationGetAllApi", error);
      });
  };

  // Get Table - Data
  const getItemCategoryMaster = (_pageSize = 10, _pageNo = 0) => {
    setValue("loadderState", true);
    axios
      .get(`${urls.HMSURL}/MstItemCategory/getAll`, {
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
          let response = res?.data?.itemCategory;
          let _res = response?.map((r, i) => {
            return {
              id: r?.id,
              srNo: i + 1,
              toDate: r?.toDate,
              toDate1:
                moment(r?.toDate, "YYYY-MM-DD").format("DD-MM-YYYY") !=
                  "Invalid date"
                  ? moment(r?.toDate, "YYYY-MM-DD").format("DD-MM-YYYY")
                  : "-",
              fromDate: r?.fromDate,
              fromDate1:
                moment(r?.fromDate, "YYYY-MM-DD").format("DD-MM-YYYY") !=
                  "Invalid date"
                  ? moment(r?.fromDate, "YYYY-MM-DD").format("DD-MM-YYYY")
                  : "-",
              applicationName: r?.applicationName,
              applicationNameMr: applicationNames?.find(
                (data) => data?.id == r?.applicationName
              )?.applictionNameMr,
              applicationNameEn: applicationNames?.find(
                (data) => data?.id == r?.applicationName
              )?.applicationNameEn,
              itemCategory: r?.itemCategory,
              itemCategoryMr: r?.itemCategoryMr,
              remarks: r?.remarks,
              activeFlag: r?.activeFlag,
              status: r?.activeFlag === "Y" ? "Active" : "Inactive",
            };
          });
          console.log("ItemCategoryApiData", response, _res);

          setItemCategoryData({
            rows: _res,
            totalRows: res?.data?.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res?.data?.pageSize,
            page: res?.data?.pageNo,
          });
          setValue("loadderState", false);
        } else {
          setValue("loadderState", false);
        }
      })
      .catch((error) => {
        setValue("loadderState", false);
        callCatchMethod(error, language);
      });
  };

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    setValue("loadderState", true);
    // Save - DB
    const finalBodyForApi = {
      ...fromData,
      // activeFlag: btnSaveText === "Update" ? null : null,
      activeFlag: "Y",
    };

    const url = `${urls.HMSURL}/MstItemCategory/save`;

    axios
      .post(url, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setValue("loadderState", false);
        if (res?.status == 201 || res?.status == 200) {
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
          getItemCategoryMaster();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
        }
      })
      .catch((error) => {
        setValue("loadderState", false);
        callCatchMethod(error, language);
      });
  };

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };

    const url = `${urls.HMSURL}/MstItemCategory/save`;

    if (_activeFlag == "N") {
      sweetAlert({
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
              if (res.status == 200 || res?.status == 201) {
                sweetAlert(
                  language == "en"
                    ? "record successfully inactive"
                    : "रेकॉर्ड यशस्वीरित्या निष्क्रिय",
                  {
                    icon: "success",
                  }
                );
                getItemCategoryMaster();
                setButtonInputState(false);
              }
            })
            .catch((error) => {
              setValue("loadderState", false);
              callCatchMethod(error, language);
            });
        } else if (willDelete == null) {
          sweetAlert(
            language == "en" ? "record is safe" : "रेकॉर्ड सुरक्षित आहे"
          );
        }
      });
    } else {
      sweetAlert({
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
            .post(url, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              setValue("loadderState", false);
              if (res.status == 200 || res?.status == 201) {
                sweetAlert(
                  language == "en"
                    ? "record is successfully activated !"
                    : "रेकॉर्ड यशस्वीरित्या सक्रिय केले आहे!",
                  {
                    icon: "success",
                  }
                );
                getItemCategoryMaster();
                setButtonInputState(false);
              }
            })
            .catch((error) => {
              setValue("loadderState", false);
              callCatchMethod(error, language);
            });
        } else if (willDelete == null) {
          sweetAlert(
            language == "en" ? "record is safe" : "रेकॉर्ड सुरक्षित आहे"
          );
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

  // Reset Values Cancell
  const resetValuesCancell = {
    fromDate: null,
    toDate: null,
    applicationName: null,
    itemCategory: "",
    itemCategoryMr: "",
    remarks: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    applicationName: null,
    itemCategory: "",
    itemCategoryMr: "",
    remarks: "",
    id: null,
  };

  // define colums table
  const itemCategoryColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
      width: 100,
    },
    {
      field: language == "en" ? "applicationNameEn" : "applicationNameMr",
      headerName: <FormattedLabel id="applicationName" />,
      description: <FormattedLabel id="applicationName" />,
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "itemCategory",
      headerName: <FormattedLabel id="itemCategory" />,
      description: <FormattedLabel id="itemCategory" />,
      width: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "itemCategoryMr",
      headerName: <FormattedLabel id="itemCategoryMr" />,
      description: <FormattedLabel id="itemCategoryMr" />,
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
      headerAlign: "center",
      align: "center",
      width: 200,
    },

    {
      field: "remarks",
      headerName: <FormattedLabel id="remark" />,
      description: <FormattedLabel id="remark" />,
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="action" />,
      description: <FormattedLabel id="action" />,
      headerAlign: "center",
      align: "center",
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton>
              {params.row.activeFlag == "Y" ? (
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
                  <ToggleOnIcon
                    style={{ color: "green", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "N")}
                  />
                </>
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


  //! ===================== useEffects <============

  useEffect(() => {
    getModuleName();
  }, []);

  useEffect(() => {
    getItemCategoryMaster();
  }, [applicationNames]);

  // View
  return (
    <div>
      {watch("loadderState") ? (
        <Loader />
      ) : (
        <div>
          <Paper className={ItemCategoryCSS.Paper} elevation={5}>
            <ThemeProvider theme={theme}>
              <div className={ItemCategoryCSS.MainHeader}>
                {<FormattedLabel id="itemCategoryT" />}
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
                          className={ItemCategoryCSS.GridContainer}
                        >
                          {/** Module Name */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={ItemCategoryCSS.GridItem}
                          >
                            <FormControl
                              variant="standard"
                              error={!!errors?.applicationName}
                            >
                              <InputLabel
                                id="demo-simple-select-standard-label"
                                shrink={
                                  watch("applicationName") !== null &&
                                    watch("applicationName") !== "" &&
                                    watch("applicationName") !== undefined
                                    ? true
                                    : false
                                }
                              >
                                <FormattedLabel id="applicationName" required />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    className={ItemCategoryCSS.FiledWidth}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label=<FormattedLabel
                                      id="applicationName"
                                      required
                                    />
                                  >
                                    {applicationNames &&
                                      applicationNames.map(
                                        (applicationName, index) => (
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
                            className={ItemCategoryCSS.GridItem}
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
                                      className={ItemCategoryCSS.FiledWidth}
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
                          {/** to Date  */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={ItemCategoryCSS.GridItem}
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
                                      className={ItemCategoryCSS.FiledWidth}
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
                          {/** item Category En */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={ItemCategoryCSS.GridItem}
                          >
                            {/* <TextField
                              className={ItemCategoryCSS.FiledWidth}
                              id='standard-basic'
                              label=<FormattedLabel
                                id='itemCategory'
                                required
                              />
                              variant='standard'
                              {...register("itemCategory")}
                              error={!!errors?.itemCategory}
                              helperText={
                                errors?.itemCategory
                                  ? errors?.itemCategory?.message
                                  : null
                              }
                            /> */}

                            <Translation
                              labelName={
                                <FormattedLabel id="itemCategory" required />
                              }
                              label={
                                <FormattedLabel id="itemCategory" required />
                              }
                              width={270}
                              disabled={watch("disabledFieldInputState")}
                              error={!!errors?.itemCategory}
                              helperText={
                                errors?.itemCategory
                                  ? errors?.itemCategory?.message
                                  : null
                              }
                              key={"itemCategory"}
                              fieldName={"itemCategory"}
                              updateFieldName={"itemCategoryMr"}
                              sourceLang={"en-US"}
                              targetLang={"mr-IN"}
                            />
                          </Grid>

                          {/* item category Mr */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={ItemCategoryCSS.GridItem}
                          >
                            {/* <TextField
                              className={ItemCategoryCSS.FiledWidth}
                              id='standard-basic'
                              label=<FormattedLabel
                                id='itemCategoryMr'
                                required
                              />
                              variant='standard'
                              {...register("itemCategoryMr")}
                              error={!!errors?.itemCategoryMr}
                              helperText={
                                errors?.itemCategoryMr
                                  ? errors?.itemCategoryMr?.message
                                  : null
                              }
                            /> */}

                            <Translation
                              labelName={
                                <FormattedLabel id="itemCategoryMr" required />
                              }
                              label={
                                <FormattedLabel id="itemCategoryMr" required />
                              }
                              width={270}
                              disabled={watch("disabledFieldInputState")}
                              error={!!errors?.itemCategoryMr}
                              helperText={
                                errors?.itemCategoryMr
                                  ? errors?.itemCategoryMr?.message
                                  : null
                              }
                              key={"itemCategoryMr"}
                              fieldName={"itemCategoryMr"}
                              updateFieldName={"itemCategory"}
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
                            className={ItemCategoryCSS.GridItem}
                          >
                            <TextField
                              InputLabelProps={{
                                shrink:
                                  watch("remarks") !== null &&
                                    watch("remarks") !== "" &&
                                    watch("remarks") !== undefined
                                    ? true
                                    : false,
                              }}
                              className={ItemCategoryCSS.FiledWidth}
                              label=<FormattedLabel id="remark" />
                              variant="standard"
                              {...register("remarks")}
                              error={!!errors?.remarks}
                              helperText={
                                errors?.remarks
                                  ? errors?.remarks?.message
                                  : null
                              }
                            />
                          </Grid>
                        </Grid>
                        {/** buttons  */}
                        <Stack
                          direction={{
                            xs: "column",
                            sm: "row",
                            md: "row",
                            lg: "row",
                            xl: "row",
                          }}
                          spacing={{ xs: 2, sm: 2, md: 5, lg: 5, xl: 5 }}
                          className={ItemCategoryCSS.ButtonStack}
                        >
                          <Button
                            className={ItemCategoryCSS.ButtonForMobileWidth}
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
                            className={ItemCategoryCSS.ButtonForMobileWidth}
                            variant="contained"
                            color="primary"
                            size="small"
                            endIcon={<ClearIcon />}
                            onClick={() => cancellButton()}
                          >
                            <FormattedLabel id="clear" />
                          </Button>
                          <Button
                            className={ItemCategoryCSS.ButtonForMobileWidth}
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

              {/** add Button */}
              <div className={ItemCategoryCSS.AddButton}>
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
            {/* tables */}
            <div className={ItemCategoryCSS.DataGridDiv}>
              <DataGrid
                componentsProps={{
                  toolbar: {
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
                columns={itemCategoryColumns}
                pagination
                paginationMode="server"
                page={itemCategoryData?.page}
                rowCount={itemCategoryData?.totalRows}
                rowsPerPageOptions={itemCategoryData?.rowsPerPageOptions}
                pageSize={itemCategoryData?.pageSize}
                rows={itemCategoryData?.rows}
                onPageChange={(_data) => {
                  getItemCategoryMaster(itemCategoryData?.pageSize, _data);
                }}
                onPageSizeChange={(_data) => {
                  getItemCategoryMaster(_data, itemCategoryData?.page);
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
