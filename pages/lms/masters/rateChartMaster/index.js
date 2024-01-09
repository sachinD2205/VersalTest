import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import Loader from "../../../../containers/Layout/components/Loader";
import sweetAlert from "sweetalert";
// import styles from '../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css'
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { GridToolbar } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
// import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import styles from "./view.module.css";
import { ThemeProvider } from "@emotion/react";
import theme from "../../../../theme";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LmsHeader from "../../../../components/lms/lmsHeader";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import * as yup from "yup";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  const language = useSelector((state) => state.labels.language);

  let schema = yup.object().shape({
    serviceId: yup
      .string()
      .nullable()
      .required(
        language == "en"
          ? "Service Name is Required !!!"
          : "सेवेचे नाव आवश्यक आहे !!!"
      ),
    startDate: yup
      .string()
      .nullable()
      .required(
        language == "en"
          ? "From Date is Required !!!"
          : "पासूनची तारीख आवश्यक आहे !!!"
      ),
    endDate: yup
      .string()
      .nullable()
      .required(
        language == "en"
          ? "To Date is Required !!!"
          : "पर्यंतची तारीख आवश्यक आहे !!!"
      ),
    chargePrefixEng: yup
      .string()
      .required(
        language == "en"
          ? "Charge Prefix is Required !!!"
          : "शुल्क उपसर्ग आवश्यक आहे !!!"
      ),
    chargePrefixMr: yup
      .string()
      .required(
        language == "en"
          ? "Charge Prefix in marathi is required !!!"
          : "मराठीत चार्ज उपसर्ग आवश्यक आहे !!!"
      ),
    chargeNameEng: yup
      .string()
      .required(
        language == "en"
          ? "Charge Name is Required !!!"
          : "शुल्काचे नाव आवश्यक आहे !!!"
      ),
    chargeNameMr: yup
      .string()
      .required(
        language == "en"
          ? "Charge Name in marathi is Required !!!"
          : "चार्जचे नाव मराठीत आवश्यक आहे !!!"
      ),
    libraryType: yup
      .string()
      .nullable()
      .required(
        language == "en"
          ? "Library Type is Required !!!"
          : "लायब्ररी प्रकार आवश्यक आहे !!!"
      ),
    amount: yup
      .string()
      .nullable()
      .required(
        language == "en" ? "Amount is Required !!!" : "रक्कम आवश्यक आहे !!!"
      )
      .matches(/^[0-9]+$/, "Only numbers are allowed for this field"),
    chargeType: yup
      .string()
      .required(
        language == "en"
          ? "Charge Type is Required !!!"
          : "चार्ज टाईप आवश्यक आहे !!!"
      ),
  });

  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   methods,
  //   setValue,
  //   reset,
  //   watch,
  //   formState: { errors },
  // } = useForm({
  //   criteriaMode: "all",
  //   // resolver: yupResolver(schema),
  //   mode: "onChange",
  // });

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
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
    formState: { errors },
  } = methods;

  const [btnSaveText, setBtnSaveText] = useState("save");
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
  const token = useSelector((state) => state.user.user.token);

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

  const [libraryTypes, setLibraryTypes] = useState([
    { id: 1, libraryType: "L", libraryTypeName: "Library" },
    { id: 2, libraryType: "C", libraryTypeName: "Competetive Center" },
    ,
    { id: 3, libraryType: "P", libraryTypeName: "Post Graduate Library" },
  ]);
  const [chargeTypes, setChargeTypes] = useState([
    { id: 1, chargeType: "Charge", value: "C" },
    { id: 2, chargeType: "Deposit", value: "D" },
    ,
    { id: 3, chargeType: "Fees", value: "F" },
  ]);

  const applicationId = useSelector(
    (appId) => appId?.user?.selectedApplicationId
  );

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getBookClassifications();
  }, [fetchData, serviceKeys]);

  useEffect(() => {
    getBookClassifications();
    getZoneKeys();
  }, []);

  const [serviceKeys, setServiceKeys] = useState([]);
  // getZoneKeys
  const getZoneKeys = () => {
    //setValues("setBackDrop", true);
    axios
      .get(
        `${urls.CFCURL}/master/service/getAllServiceByApplication?applicationId=${applicationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((r) => {
        setServiceKeys(
          r.data.service.map((row) => ({
            id: row.id,
            serviceName: row.serviceName,
            serviceNameMr: row.serviceNameMr,
          }))
        );
      })
      .catch((error) => {
        // setLoading(false);
        callCatchMethod(error, language);
      });
    // .catch((err) => {
    //   swal(
    //     language == "en" ? "Error!" : "त्रुटी!",
    //     language == "en"
    //       ? "Somethings Wrong Zones not Found!"
    //       : "काहीतरी चुकीचे आहे, झोन सापडले नाहीत!",
    //     "error"
    //   );
    // });
  };
  // Get Table - Data
  const getBookClassifications = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.LMSURL}/libraryRateCharge/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: "id",
          sortDir: "dsc",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setLoading(false);
        console.log(";r", r);
        let result = r.data.mstLibraryRateChargeList;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log("44");
          console.log(
            "kay",
            serviceKeys?.find((item) => item.id == r.serviceId)?.serviceName,
            r.serviceId
          );

          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,

            id: r.id,
            srNo: i + 1,
            // bookType: r.bookType,
            chargeNameEng: r.chargeNameEng,
            chargeNameMr: r.chargeNameMr,
            chargePrefixEng: r.chargePrefixEng,
            chargePrefixMr: r.chargePrefixMr,
            chargeType: r.chargeType,
            endDate: r.endDate,
            startDate: r.startDate,
            libraryType: r.libraryType,
            amount: r.amount,
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
      .catch((error) => {
        setLoading(false);
        callCatchMethod(error, language);
      });
  };

  const onSubmitForm = (fromData) => {
    setLoading(true);
    console.log("fromData", fromData);
    // Save - DB
    let _body = {
      ...fromData,
      activeFlag: fromData.activeFlag,
    };
    if (btnSaveText === "save") {
      const tempData = axios
        .post(`${urls.LMSURL}/libraryRateCharge/save`, _body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert(
              language === "en" ? "Saved!" : "जतन केले!",
              language === "en"
                ? "Record Saved successfully !"
                : "रेकॉर्ड यशस्वीरित्या जतन केले!",
              "success"
            );
            setLoading(false);
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "update") {
      const tempData = axios
        .post(`${urls.LMSURL}/libraryRateCharge/save`, _body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("res", res);
          if (res.status == 201) {
            setLoading(false);
            fromData.id
              ? sweetAlert(
                  language == "en" ? "Updated!" : "अपडेट केले",
                  language == "en"
                    ? "Record Updated successfully !"
                    : "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
                  "success"
                )
              : sweetAlert(
                  language === "en" ? "Saved!" : "जतन केले!",
                  language === "en"
                    ? "Record Saved successfully !"
                    : "रेकॉर्ड यशस्वीरित्या जतन केले!",
                  "success"
                );
            getBookClassifications();
            // setButtonInputState(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    }
  };

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    setLoading(true);
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: language == "en" ? "Inactivate?" : "निष्क्रिय करा?",
        text:
          language == "en"
            ? "Are you sure you want to inactivate this Record?"
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            // .delete(`${urls.NRMS}/newspaperRotationGroupMaster/delete/${body.id}`)
            .post(`${urls.LMSURL}/libraryRateCharge/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                setLoading(false);
                swal(
                  language == "en"
                    ? "Record is Successfully Inactivated!"
                    : "रेकॉर्ड यशस्वीरित्या निष्क्रिय केले आहे!",
                  {
                    icon: "success",
                  }
                );
                getBookClassifications();
                // setButtonInputState(false);
              }
            })
            .catch((error) => {
              setLoading(false);
              callCatchMethod(error, language);
            });
        } else if (willDelete == null) {
          swal(language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे");
          setLoading(false);
        }
      });
    } else {
      swal({
        title: language == "en" ? "Activate?" : "सक्रिय करा?",
        text:
          language == "en"
            ? "Are you sure you want to activate this Record?"
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .delete(`${urls.LMSURL}/libraryRateCharge/save/${body.id}`)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                setLoading(false);
                swal(
                  language == "en"
                    ? "Record is Successfully Activated!"
                    : "रेकॉर्ड यशस्वीरित्या सक्रिय केले आहे!",
                  {
                    icon: "success",
                  }
                );
                // getPaymentRate();
                getBookClassifications();
                // setButtonInputState(false);
              }
            })
            .catch((error) => {
              setLoading(false);
              callCatchMethod(error, language);
            });
        } else if (willDelete == null) {
          swal(language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे");
          setLoading(false);
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
    libraryName: "",
    libraryNameMr: "",
    libraryType: "",
    amount: "",
    chargeType: "",
    zoneKey: null,
  };

  // Reset Values Exit
  const resetValuesExit = {
    libraryName: "",
    libraryNameMr: "",
    libraryType: "",
    amount: "",
    chargeType: "",
    zoneKey: null,
    id: null,
  };

  const columns = [
    {
      field: "srNo",
      // headerName: 'id',
      // headerName: <FormattedLabel id="srNo" />,
      headerName: language === "en" ? "Sr.No" : "अनुक्रमांक",
      flex: 0.5,
    },
    {
      field: "chargePrefixEng",
      // headerName: 'Book Type',
      // headerName: <FormattedLabel id="chargePrefixEng" />,
      headerName:
        language === "en"
          ? "Charge Prefix(In English)"
          : "शुल्क उपसर्ग (इंग्रजी मध्ये)",
      flex: 1,
    },
    {
      field: "chargePrefixMr",
      // headerName: 'Book Type',
      // headerName: <FormattedLabel id="chargePrefixMr" />,
      headerName:
        language === "en"
          ? "Charge Prefix(In Marathi)"
          : "शुल्क उपसर्ग (मराठी मध्ये)",
      flex: 1,
    },
    {
      field: "chargeNameEng",
      // headerName: 'Book Type',
      // headerName: <FormattedLabel id="chargeNameEng" />,
      headerName:
        language === "en"
          ? "Charge Name(In Eng)"
          : "शुल्काचे नाव (इंग्रजी मध्ये)",
      flex: 1,
    },
    {
      field: "chargeNameMr",
      // headerName: 'Book Type',
      // headerName: <FormattedLabel id="chargeNameMr" />,
      headerName:
        language === "en"
          ? "Charge Name(In Mar)"
          : "शुल्काचे नाव (मराठी मध्ये)",
      flex: 1,
    },

    {
      field: "chargeType",
      // headerName: 'Book Type',
      // headerName: <FormattedLabel id="chargeType" />,
      headerName: language === "en" ? "Charge Type " : "चार्ज प्रकार",
      flex: 1,
    },
    {
      field: "libraryType",
      // headerName: 'Book Type',
      // headerName: <FormattedLabel id="libraryType" />,
      headerName: language === "en" ? "Library Type " : "ग्रंथालय प्रकार",
      flex: 2,
    },

    {
      field: "actions",
      // headerName: 'Actions',
      // headerName: <FormattedLabel id="actions" />,
      headerName: language === "en" ? "Actions" : "क्रिया",
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                // setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
                // service: serviceKeys?.find((item) => item.id == r.serviceId)?.serviceName,
                setValue(
                  "serviceId",
                  serviceKeys?.find((item) => item.id == params.row.serviceId)
                    ?.serviceName
                );
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
                setBtnSaveText("update"),
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
    <ThemeProvider theme={theme}>
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
          <BreadcrumbComponent />
        </Box>
        <LmsHeader labelName="rateChartMaster" />

        {loading ? (
          <Loader />
        ) : (
          <>
            <div>
              <Typography
                sx={{
                  fontWeight: 800,
                  color: "red",
                  marginLeft: "7vh",
                  marginTop: "2vh",
                  marginBottom: "2vh",
                }}
              >
                {/* <FormattedLabel id="attachmentSchema" /> */}
                {` *Note - Library Type must be 1) L(for library) 2) C(for
                Competitive center) and Charge Type must be 1) C (for Charge) 2)
                D (for Deposit) 3) (for fees)`}
              </Typography>
            </div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                {isOpenCollapse && (
                  <Slide
                    direction="down"
                    in={slideChecked}
                    mountOnEnter
                    unmountOnExit
                  >
                    <Grid
                      container
                      style={{
                        padding: "10px",
                        display: "flex",
                        alignItems: "baseline",
                      }}
                    >
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        xl={4}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <FormControl
                          variant="standard"
                          error={!!errors.serviceId}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="service" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                //sx={{ width: 230 }}
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                                label="Zone Name  "
                              >
                                {serviceKeys &&
                                  serviceKeys.map((serviceKey, index) => (
                                    <MenuItem key={index} value={serviceKey.id}>
                                      {language == "en"
                                        ? serviceKey?.serviceName
                                        : serviceKey?.serviceNameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="serviceId"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.serviceId
                              ? errors.serviceId.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        xl={4}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <FormControl error={errors.startDate}>
                          <Controller
                            control={control}
                            name="startDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 14 }}>
                                      {
                                        <FormattedLabel
                                          id="fromDate"
                                          required
                                        />
                                      }
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
                                      // disabled={disabled}
                                      {...params}
                                      size="small"
                                      error={errors?.startDate}
                                      variant="standard"
                                      fullWidth
                                      InputLabelProps={{
                                        style: {
                                          fontSize: 12,
                                        },
                                      }}
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.startDate
                              ? errors.startDate.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={4}
                        sm={12}
                        xs={12}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <FormControl
                          sx={{ marginTop: 0 }}
                          error={errors.endDate}
                        >
                          <Controller
                            control={control}
                            name="endDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  // maxDate={new Date()}
                                  // disabled={disable}
                                  disabled={watch("startDate") ? false : true}
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 14 }}>
                                      {" "}
                                      {/* Membership End Date */}
                                      {<FormattedLabel id="toDate" required />}
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
                                      // disabled={disabled}
                                      {...params}
                                      variant="standard"
                                      size="small"
                                      error={errors?.endDate}
                                      fullWidth
                                      InputLabelProps={{
                                        style: {
                                          fontSize: 12,
                                        },
                                      }}
                                    />
                                  )}
                                  minDate={watch("startDate")}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.endDate ? errors.endDate.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        xl={4}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        {/* <TextField
                      // label="Book Type"
                      label={<FormattedLabel id="chargePrefixEng" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("chargePrefixEng")}
                      error={!!errors.chargePrefixEng}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("chargePrefixEng") ? true : false) ||
                          (router.query.chargePrefixEng ? true : false),
                      }}
                      helperText={
                        // errors?.studentName ? errors.studentName.message : null
                        errors?.chargePrefixEng
                          ? "chargePrefixEng is Required !!!"
                          : null
                      }
                    /> */}
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Transliteration
                            _key={"chargePrefixEng"}
                            // labelName={"chargePrefixEng"}
                            fieldName={"chargePrefixEng"}
                            updateFieldName={"chargePrefixMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            label={
                              <FormattedLabel id="chargePrefixEng" required />
                            }
                            error={!!errors.chargePrefixEng}
                            targetError={"chargePrefixMr"}
                            InputLabelProps={{
                              style: { fontSize: 15 },
                              //true
                              shrink:
                                (watch("chargePrefixEng") ? true : false) ||
                                (router.query.chargePrefixEng ? true : false),
                            }}
                            width={230}
                            textFieldMargin={1}
                            helperText={
                              errors?.chargePrefixEng
                                ? errors.chargePrefixEng.message
                                : null
                            }
                          />
                        </Box>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        xl={4}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        {/* <TextField
                      // label="Book Type"
                      label={<FormattedLabel id="chargePrefixMr" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("chargePrefixMr")}
                      error={!!errors.chargePrefixMr}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("chargePrefixMr") ? true : false) ||
                          (router.query.chargePrefixMr ? true : false),
                      }}
                      helperText={
                        // errors?.studentName ? errors.studentName.message : null
                        errors?.chargePrefixMr
                          ? "chargePrefixMr is Required !!!"
                          : null
                      }
                    /> */}
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Transliteration
                            _key={"chargePrefixMr"}
                            // labelName={"chargePrefixMr"}
                            fieldName={"chargePrefixMr"}
                            updateFieldName={"chargePrefixEng"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            label={
                              <FormattedLabel id="chargePrefixMr" required />
                            }
                            error={!!errors.chargePrefixMr}
                            targetError={"chargePrefixEng"}
                            textFieldMargin={1}
                            width={230}
                            InputLabelProps={{
                              style: { fontSize: 15 },
                              //true
                              shrink:
                                (watch("chargePrefixMr") ? true : false) ||
                                (router.query.chargePrefixMr ? true : false),
                            }}
                            helperText={
                              errors?.chargePrefixMr
                                ? errors.chargePrefixMr.message
                                : null
                            }
                          />
                        </Box>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        xl={4}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        {/* <TextField
                      // label="Book Type"
                      label={<FormattedLabel id="chargeNameEng" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("chargeNameEng")}
                      error={!!errors.chargeNameEng}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("chargeNameEng") ? true : false) ||
                          (router.query.chargeNameEng ? true : false),
                      }}
                      helperText={
                        // errors?.studentName ? errors.studentName.message : null
                        errors?.chargeNameEng
                          ? "chargeNameEng is Required !!!"
                          : null
                      }
                    /> */}
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Transliteration
                            _key={"chargeNameEng"}
                            // labelName={"chargeNameEng"}
                            fieldName={"chargeNameEng"}
                            updateFieldName={"chargeNameMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            label={
                              <FormattedLabel id="chargeNameEng" required />
                            }
                            error={!!errors.chargeNameEng}
                            targetError={"chargeNameMr"}
                            InputLabelProps={{
                              style: { fontSize: 15 },
                              //true
                              shrink:
                                (watch("chargeNameEng") ? true : false) ||
                                (router.query.chargeNameEng ? true : false),
                            }}
                            width={230}
                            textFieldMargin={1}
                            helperText={
                              errors?.chargeNameEng
                                ? errors.chargeNameEng.message
                                : null
                            }
                          />
                        </Box>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        xl={4}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        {/* <TextField
                      // label="Book Type"
                      label={<FormattedLabel id="chargeNameMr" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("chargeNameMr")}
                      error={!!errors.chargeNameMr}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("chargeNameMr") ? true : false) ||
                          (router.query.chargeNameMr ? true : false),
                      }}
                      helperText={
                        // errors?.studentName ? errors.studentName.message : null
                        errors?.chargeNameMr
                          ? "chargeNameMr is Required !!!"
                          : null
                      }
                    /> */}
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Transliteration
                            _key={"chargeNameMr"}
                            // labelName={"chargeNameMr"}
                            fieldName={"chargeNameMr"}
                            updateFieldName={"chargeNameEng"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            label={
                              <FormattedLabel id="chargeNameMr" required />
                            }
                            error={!!errors.chargeNameMr}
                            targetError={"chargeNameEng"}
                            textFieldMargin={1}
                            width={230}
                            InputLabelProps={{
                              style: { fontSize: 15 },
                              //true
                              shrink:
                                (watch("chargeNameMr") ? true : false) ||
                                (router.query.chargeNameMr ? true : false),
                            }}
                            helperText={
                              errors?.chargeNameMr
                                ? errors.chargeNameMr.message
                                : null
                            }
                          />
                        </Box>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        xl={4}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <FormControl
                          variant="standard"
                          sx={{ marginTop: 2.9 }}
                          error={!!errors.libraryType}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="libraryType" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="libraryType" />}
                              >
                                {libraryTypes &&
                                  libraryTypes.map((libraryType, index) => (
                                    <MenuItem
                                      key={index}
                                      value={libraryType.libraryType}
                                    >
                                      {libraryType.libraryTypeName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="libraryType"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.libraryType
                              ? errors.libraryType.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/* <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                    <TextField
                      label={<FormattedLabel id="libraryType" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("libraryType")}
                      error={!!errors.libraryType}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("libraryType") ? true : false) ||
                          (router.query.libraryType ? true : false),
                      }}
                      helperText={
                        errors?.libraryType
                          ? "libraryType is Required !!!"
                          : null
                      }
                    />
                  </Grid> */}
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        xl={4}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <TextField
                          // label="Book Type"
                          label={<FormattedLabel id="amount" />}
                          id="standard-basic"
                          variant="standard"
                          {...register("amount")}
                          error={!!errors.amount}
                          // InputProps={{ style: { fontSize: 18 } }}
                          InputLabelProps={{
                            shrink:
                              (watch("amount") ? true : false) ||
                              (router.query.amount ? true : false),
                          }}
                          helperText={
                            errors?.amount ? errors.amount.message : null
                          }
                        />
                      </Grid>
                      {/* <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                        <TextField
                          // label="Book Type"
                          label={<FormattedLabel id="chargeType" />}
                          id="standard-basic"
                          variant="standard"
                          {...register("chargeType")}
                          error={!!errors.chargeType}
                          InputLabelProps={{
                            shrink:
                              (watch("chargeType") ? true : false) ||
                              (router.query.chargeType ? true : false),
                          }}
                          helperText={
                            // errors?.studentName ? errors.studentName.message : null
                            errors?.chargeType
                              ? "chargeType is Required !!!"
                              : null
                          }
                        />
                      </Grid> */}

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        xl={4}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <FormControl
                          variant="standard"
                          sx={{ marginTop: 2.9 }}
                          error={!!errors.chargeType}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="chargeType" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="chargeType" />}
                              >
                                {chargeTypes &&
                                  chargeTypes.map((chargeType, i) => (
                                    <MenuItem
                                      key={chargeType.id}
                                      value={chargeType.value}
                                    >
                                      {chargeType.chargeType}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="chargeType"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.chargeType
                              ? errors.chargeType.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid
                        container
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          padding: "10px",
                        }}
                      >
                        <Grid
                          item
                          xs={4}
                          sx={{ display: "flex", justifyContent: "end" }}
                        >
                          <Button
                            type="submit"
                            size="small"
                            variant="contained"
                            color="success"
                            endIcon={<SaveIcon />}
                          >
                            {/* {btnSaveText === 'Update' ? 'Update' : 'Save'} */}
                            {<FormattedLabel id={btnSaveText} />}
                          </Button>
                        </Grid>
                        <Grid
                          item
                          xs={4}
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            endIcon={<ClearIcon />}
                            onClick={() => cancellButton()}
                          >
                            {/* clear */}
                            {<FormattedLabel id="clear" />}
                          </Button>
                        </Grid>
                        <Grid item xs={4}>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            endIcon={<ExitToAppIcon />}
                            onClick={() => exitButton()}
                          >
                            {/* exit */}
                            {<FormattedLabel id="exit" />}
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
                size="small"
                disabled={buttonInputState}
                onClick={() => {
                  reset({
                    ...resetValuesExit,
                  });
                  setEditButtonInputState(true);
                  setDeleteButtonState(true);
                  setBtnSaveText("save");
                  setButtonInputState(true);
                  setSlideChecked(true);
                  setIsOpenCollapse(!isOpenCollapse);
                }}
              >
                {/* add */}
                {<FormattedLabel id="add" />}
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

              density="compact"
              // autoHeight={true}
              // rowHeight={50}
              pagination
              paginationMode="server"
              // loading={data.loading}
              rowCount={data.totalRows}
              rowsPerPageOptions={data.rowsPerPageOptions}
              page={data.page}
              pageSize={data.pageSize}
              rows={data.rows}
              columns={columns}
              onPageChange={(_data) => {
                getBookClassifications(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                // updateData("page", 1);
                getBookClassifications(_data, data.page);
              }}
            />
          </>
        )}
      </Paper>
    </ThemeProvider>
  );
};

export default Index;
