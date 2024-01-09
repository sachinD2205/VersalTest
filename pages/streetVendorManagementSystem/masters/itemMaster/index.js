import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
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
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import ItemMasterSchema from "../../../../components/streetVendorManagementSystem/schema/ItemSchema";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ItemMasterCSS from "../../../../components/streetVendorManagementSystem/styles/Item.module.css";
import { useSelector } from "react-redux";
import Loader from "../../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import Translation from "../../../../components/streetVendorManagementSystem/components/Translation";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const language = useSelector((state) => state?.labels.language);
  const [dataValidation, setDataValidation] = useState(
    ItemMasterSchema(language)
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
    reset,
    watch,
    setValue,
    formState: { errors },
  } = methods;
  const [applicationNames, setApplicationNames] = useState([]);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [itemCategorys, setItemCategorys] = useState([]);
  const userToken = useGetToken();
  const [itemData, setItemData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

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

  // getCategorys
  const getCategorys = () => {
    const url = `${urls.HMSURL}/MstItemCategory/getAll`;
    axios
      .get(url,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          console.log("ItemCategory", r?.data?.itemCategory);
          setItemCategorys(
            r?.data?.itemCategory?.map((row) => ({
              id: row?.id,
              itemCategoryEn: row?.itemCategory,
              itemCategoryMr: row?.itemCategoryMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // Get Table - Data
  const getItem = (_pageSize = 10, _pageNo = 0) => {
    setValue("loadderState", true);

    const url = `${urls.HMSURL}/item/getAll`;

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
          let response = res?.data?.item;
          console.log("res324236", response);
          let _res = response?.map((r, i) => {
            return {
              id: r?.id,
              srNo: i + 1,
              toDate: r?.toDate,
              fromDate: r?.fromDate,
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

              // application name
              applicationName: r?.applicationName,
              applicationNameEn: applicationNames?.find(
                (data) => data?.id == r?.applicationName
              )?.applicationNameEn,
              applicationNameMr: applicationNames?.find(
                (data) => data?.id == r?.applicationName
              )?.applictionNameMr,
              // applicationName

              itemCategory: r?.itemCategory,
              itemCategoryMr: itemCategorys?.find(
                (data) => data?.id == r?.itemCategory
              )?.itemCategoryMr,
              itemCategoryEn: itemCategorys?.find(
                (data) => data?.id == r?.itemCategory
              )?.itemCategoryEn,
              item: r?.item,
              itemMr: r?.itemMr,
              remarks: r?.remarks,
              activeFlag: r?.activeFlag,
              status: r?.activeFlag === "Y" ? "Active" : "Inactive",
            };
          });

          console.log("_res21312", _res, applicationNames, response);

          setItemData({
            rows: _res,
            totalRows: res.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res.data.pageSize,
            page: res.data.pageNo,
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

  // Module Name
  const getModuleName = () => {
    const url = `${urls.CFCURL}/master/application/getAll`;

    axios
      .get(url,
        {
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

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    setValue("loadderState", true);
    const url = `${urls.HMSURL}/item/save`;

    // finalBodyForApi
    const finalBodyForApi = {
      ...fromData,
      activeFlag: "Y",
    };

    axios
      .post(url, finalBodyForApi,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
      .then((res) => {
        setValue("loadderState", false);
        if (res?.status == 201 || res?.status == 200) {
          if (fromData?.id) {
            language == "en"
              ? sweetAlert(
                "Updated!",
                "Record Updated successfully!",
                "success"
              )
              : sweetAlert(
                "अपडेट केले!",
                "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
                "success"
              );
          } else {
            language == "en"
              ? sweetAlert("Saved!", "Record Saved successfully!", "success")
              : sweetAlert(
                "जतन केले!",
                "रेकॉर्ड यशस्वीरित्या जतन केले!",
                "success"
              );
          }
          getItem();
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

  // Delete
  const deleteById = (value, _activeFlag) => {
    const url = `${urls.HMSURL}/item/save`;

    // body
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };

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
            .post(url, body,
              {
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
                getItem();
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
            .post(url, body,
              {
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
                getItem();
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

  // Reset Values Cancell
  const resetValuesCancell = {
    fromDate: null,
    toDate: null,
    itemCategory: null,
    applicationName: null,
    item: "",
    itemMr: "",
    remarks: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    itemCategory: null,
    item: "",
    itemMr: "",
    remarks: "",
    applicationName: null,
    id: null,
  };

  // define colums table
  const itemTableColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: <FormattedLabel id="srNo" />,
      width: 100,
      headerAlign: "center",
      align: "center",
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
      field: language == "en" ? "itemCategoryEn" : "itemCategoryMr",
      headerName: <FormattedLabel id="itemCategoryT" />,
      description: <FormattedLabel id="itemCategoryT" />,
      width: 250,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "itemMr",
      headerName: <FormattedLabel id="itemMr" />,
      description: <FormattedLabel id="itemMr" />,
      width: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "item",
      headerName: <FormattedLabel id="itemEn" />,
      description: <FormattedLabel id="itemEn" />,
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
        );
      },
    },
  ];

  // loadderSetTimeOutFunction
  const loadderSetTimeOutFunction = () => {
    setTimeout(() => {
      console.log("bhvaa", watch("loadderState"));
      setValue("loadderState", false);
      console.log("bhvaa2", watch("loadderState"));
    }, 0);
  };


  //! ==============> useEffect ============>

  useEffect(() => {
    setValue("loadderState", true);
    loadderSetTimeOutFunction();
    getModuleName();
    getCategorys();
  }, []);

  // useEffect
  useEffect(() => {
    getItem();
  }, [itemCategorys, applicationNames]);

  useEffect(() => {
    console.log("language3324", language);
  }, [language]);

  // View
  return (
    <>
      {watch("loadderState") ? (
        <Loader />
      ) : (
        <div>
          <Paper className={ItemMasterCSS.Paper} elevation={5}>
            <ThemeProvider theme={theme}>
              <div className={ItemMasterCSS.MainHeader}>
                {<FormattedLabel id="itemMaster" />}
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
                        <Grid container className={ItemMasterCSS.GridContainer}>
                          {/** Module Name */}
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
                          {/** to Date  */}
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
                                      minDate={watch("fromDate")}
                                      disabled={
                                        watch("fromDate") == null ? true : false
                                      }
                                      className={ItemMasterCSS.FiledWidth}
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
                          {/** item Category */}
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
                              error={!!errors?.itemCategory}
                            >
                              <InputLabel
                                shrink={
                                  watch("itemCategory") !== null &&
                                    watch("itemCategory") !== "" &&
                                    watch("itemCategory") !== undefined
                                    ? true
                                    : false
                                }
                                id="demo-simple-select-standard-label"
                              >
                                <FormattedLabel id="itemCategoryT" required />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    className={ItemMasterCSS.FiledWidth}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label=<FormattedLabel
                                      id="itemCategoryT"
                                      required
                                    />
                                  >
                                    {itemCategorys &&
                                      itemCategorys.map(
                                        (itemCategory, index) => (
                                          <MenuItem
                                            key={index}
                                            value={itemCategory?.id}
                                          >
                                            {language == "en"
                                              ? itemCategory?.itemCategoryEn
                                              : itemCategory?.itemCategoryMr}
                                          </MenuItem>
                                        )
                                      )}
                                  </Select>
                                )}
                                name="itemCategory"
                                control={control}
                                defaultValue={null}
                              />
                              <FormHelperText>
                                {errors?.itemCategory
                                  ? errors?.itemCategory?.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          {/** item En */}
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
                              className={ItemMasterCSS.FiledWidth}
                              id='standard-basic'
                              label=<FormattedLabel id='itemEn' required />
                              variant='standard'
                              {...register("item")}
                              error={!!errors.item}
                              helperText={
                                errors?.item ? errors?.item?.message : null
                              }
                            /> */}

                            <Translation
                              labelName={
                                <FormattedLabel id="itemEn" required />
                              }
                              label={<FormattedLabel id="itemEn" required />}
                              width={270}
                              disabled={watch("disabledFieldInputState")}
                              error={!!errors?.item}
                              helperText={
                                errors?.item ? errors?.item?.message : null
                              }
                              key={"item"}
                              fieldName={"item"}
                              updateFieldName={"itemMr"}
                              sourceLang={"en-US"}
                              targetLang={"mr-IN"}
                            />
                          </Grid>
                          {/** item Mr */}
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={4}
                            xl={4}
                            className={ItemMasterCSS.GridItem}
                          >
                            <Translation
                              labelName={
                                <FormattedLabel id="itemMr" required />
                              }
                              label={<FormattedLabel id="itemMr" required />}
                              width={270}
                              disabled={watch("disabledFieldInputState")}
                              error={!!errors?.itemMr}
                              helperText={
                                errors?.itemMr ? errors?.itemMr?.message : null
                              }
                              key={"itemMr"}
                              fieldName={"itemMr"}
                              updateFieldName={"item"}
                              sourceLang={"en-US"}
                              targetLang={"mr-IN"}
                            />
                            {/* <TextField
                              className={ItemMasterCSS.FiledWidth}
                              id='standard-basic'
                              label=<FormattedLabel id='itemMr' required />
                              variant='standard'
                              {...register("itemMr")}
                              error={!!errors?.itemMr}
                              helperText={
                                errors?.itemMr ? errors?.itemMr?.message : null
                              }
                            /> */}
                          </Grid>
                          {/** Remark */}
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
                              InputLabelProps={{
                                shrink:
                                  watch("remarks") !== null &&
                                    watch("remarks") !== undefined &&
                                    watch("remarks") !== ""
                                    ? true
                                    : false,
                              }}
                              className={ItemMasterCSS.FiledWidth}
                              id="standard-basic"
                              label=<FormattedLabel id="remark" />
                              variant="standard"
                              {...register("remarks")}
                              error={!!errors.remarks}
                              helperText={
                                errors?.remarks ? errors.remarks.message : null
                              }
                            />
                          </Grid>
                        </Grid>

                        {/** Buttons  */}
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
                            type="submit"
                            variant="contained"
                            color="success"
                            size="small"
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
                            variant="contained"
                            color="primary"
                            size="small"
                            endIcon={<ClearIcon />}
                            onClick={() => cancellButton()}
                          >
                            <FormattedLabel id="clear" />
                          </Button>
                          <Button
                            className={ItemMasterCSS.ButtonForMobileWidth}
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
              {/** Add Button */}
              <div className={ItemMasterCSS.AddButton}>
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
                  <FormattedLabel id="add" />
                </Button>
              </div>
            </ThemeProvider>
            {/** Table */}
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
                density="standard"
                autoHeight={true}
                columns={itemTableColumns}
                pagination
                paginationMode="server"
                page={itemData?.page}
                rowCount={itemData?.totalRows}
                rowsPerPageOptions={itemData?.rowsPerPageOptions}
                pageSize={itemData?.pageSize}
                rows={itemData?.rows}
                onPageChange={(_data) => {
                  getItem(itemData?.pageSize, _data);
                }}
                onPageSizeChange={(_data) => {
                  getItem(_data, itemData?.page);
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
