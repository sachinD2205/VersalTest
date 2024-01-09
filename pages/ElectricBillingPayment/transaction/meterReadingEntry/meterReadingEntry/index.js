import {
  Box,
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Card,
  FormControl,
  Tooltip,
  IconButton,
} from "@mui/material";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "../../../../../containers/schema/ElelctricBillingPaymentSchema/meterReadingSchema";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import moment from "moment";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../../URLS/urls";
import { useSelector } from "react-redux";
import {
  DataGrid,
  GridToolbar,
  GridCellRendererParams,
  useGridApiContext,
} from "@mui/x-data-grid";
import UploadButton from "../../../../../components/ElectricBillingComponent/billUpload/uploadDocument/uploadButton";
import Loader from "../../../../../containers/Layout/components/Loader";
import commonStyles from "../../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../../util/commonErrorUtil";
const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    height: "50%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    overflow: "scroll",
  };

  const [searchedConnections, setSearchedConnections] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const [zoneDropDown, setZoneDropDown] = useState([]);
  const [subDivisionDropDown, setSubDivisionDown] = useState([]);
  const [msedclCategoryDropDown, setMsedclCategoryDropDown] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [loading, setLoading] = useState(false);
  const [departmentCategoryDropDown, setDepartmentCategoryDropDown] = useState(
    []
  );

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

  const router = useRouter();

  const language = useSelector((state) => state.labels.language);

  //get logged in user
  const user = useSelector((state) => state.user.user);

  const headers = {
    Authorization: `Bearer ${user.token}`,
  };

  // selected menu from drawer

  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );

  // get authority of selected user

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  useEffect(() => {
    getZone();
    getMsedclCategory();
    getSubDivision();
    getDepartmentCategory();
  }, []);

  useEffect(() => {
    setValue(
      "consummedUnit",
      Math.abs(watch("currReading") - watch("prevReading"))
        ? Math.abs(watch("currReading") - watch("prevReading"))
        : "0"
    );
  }, [watch("currReading"), watch("prevReading")]);

  const handleSelectionModelChange = (newSelectionModel) => {
    setSelectionModel(newSelectionModel);
  };

  const catchMethod = (err) => {
    if (err.message === "Network Error") {
      sweetAlert(
        language == "en" ? "Network Error" : "नेटवर्क त्रुटी !",
        language == "en"
          ? "Server is unreachable or may be a network issue, please try after sometime"
          : "सर्व्हर पोहोचण्यायोग्य नाही किंवा नेटवर्क समस्या असू शकते, कृपया काही वेळानंतर प्रयत्न करा",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else if (err.message === "Request failed with status code 404") {
      sweetAlert(
        language == "en" ? "Bad Request" : "वाईट विनंती !",
        language == "en" ? "Unauthorized access !" : "अनधिकृत पोहोच !!",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else {
      sweetAlert(
        language == "en" ? "Error" : "त्रुटी !",
        language == "en" ? "Something went to wrong !" : "काहीतरी चूक झाली!",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    }
  };

  // get Zone Name
  const getZone = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let temp = res.data.zone;
        setZoneDropDown(temp);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // get Msedcl Category
  const getMsedclCategory = () => {
    axios
      .get(`${urls.EBPSURL}/mstMsedclCategory/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let temp = res.data.mstMsedclCategoryList;
        setMsedclCategoryDropDown(temp);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get SubDivision
  const getSubDivision = () => {
    axios
      .get(`${urls.EBPSURL}/mstSubDivision/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let temp = res.data.mstSubDivisionList;
        setSubDivisionDown(temp);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get Department Category
  const getDepartmentCategory = () => {
    axios
      .get(`${urls.EBPSURL}/mstDepartmentCategory/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let temp = res.data.mstDepartmentCategoryList;
        setDepartmentCategoryDropDown(temp);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const handleSearchConnections = (_pageSize = 10, _pageNo = 0) => {
    // handleOpenEntryConnections();
    setLoading(true);
    if (watch("monthAndYear")) {
      let data = {
        consumerNumber: watch("consumerNo") ? watch("consumerNo") : null,
        zone: watch("zoneKey") ? watch("zoneKey") : null,
        subDivision: watch("subDivisionKey") ? watch("subDivisionKey") : null,
        category: watch("departmentCategory")
          ? watch("departmentCategory")
          : null,
        MsdclDivision: watch("msedclCategory") ? watch("msedclCategory") : null,
        monthAndYear: watch("monthAndYear") ? watch("monthAndYear") : null,
      };
      axios
        .post(
          `${urls.EBPSURL}/trnNewConnectionEntry/getForMeterReading`,
          data,
          {
            headers: headers,
            // params: {
            //   pageSize: _pageSize,
            //   pageNo: _pageNo,
            // },
          }
        )
        .then((r) => {
          setLoading(false);
          let result = r.data;
          if (result.length > 0 && zoneDropDown.length != 0) {
            let _res = result.map((r, i) => {
              return {
                srNo: i + 1,
                activeFlag: r.activeFlag,
                consumerNo: r.consumerNo,
                vanNo: r.vanNo,
                zone: zoneDropDown?.find((obj) => obj.id == r?.zoneKey)
                  ?.zoneName,
                zoneMr: zoneDropDown?.find((obj) => obj.id == r?.zoneKey)
                  ?.zoneNameMr,
                prevReading: r?.previousReading,
                subDivisionKey: r?.subDivisionKey,
                msedclCategory: r?.msedclCategoryKey,
                departmentCategory: r?.departmentCategoryKey,
                newConnectionKey: r?.id,
                zoneKey: r?.zoneKey,
                monthAndYear: watch("monthAndYear"),
              };
            });

            setSearchedConnections({
              rows: _res,
              totalRows: _res.length,
              rowsPerPageOptions: [10, 20, 50, 100],
              pageSize: _pageSize,
              pageNo: _pageNo,
            });
          } else {
            setLoading(false);
            sweetAlert(
              language === "en" ? "Oops!" : "अरेरे!",
              language === "en"
                ? "No Records Found"
                : "कोणतेही रेकॉर्ड आढळले नाही",
              "warning",
              { button: language === "en" ? "Ok" : "ठीक आहे" }
            );
          }
        })
        .catch((err) => {
          setLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    } else {
      setLoading(false);
      sweetAlert(
        language === "en" ? "Oops!" : "अरेरे!",
        language === "en"
          ? "Please Select 'Month And Year'"
          : "कृपया 'महिना आणि वर्ष' निवडा",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    }
  };

  const onSubmitForm = (formdata) => {
    setLoading(true);

    let selectedObjects =
      selectionModel &&
      selectionModel.map((i) => {
        let res = searchedConnections.rows?.find((j) => {
          return i == j?.srNo;
        });
        return res;
      });

    // if amountToBePaid is not edited (changed)

    let temp = selectedObjects;

    temp &&
      temp.map((each) => {
        if (each.amountToBePaid != undefined) {
          return each;
        } else {
          return (each.amountToBePaid = each.billedAmount);
        }
      });

    selectedObjects = temp;

    let payload = {
      meterReadingLst: selectedObjects,
    };

    const tempData = axios
      .post(
        `${urls.EBPSURL}/trnMeterReadingAndBillGenerate/bulk/generate`,
        payload,
        {
          headers: headers,
        }
      )
      .then((res) => {
        if (res.status == 201) {
          setLoading(false);
          sweetAlert(
            language === "en" ? "Success!" : "यशस्वी",
            language === "en"
              ? "Meter Reading Entries Saved Successfully !"
              : "मीटर रीडिंग नोंदी यशस्वीरित्या जतन केल्या !",
            "success",
            { button: language === "en" ? "Ok" : "ठीक आहे" }
          );
          reset({
            ...resetValuesForClear,
          });
          router.push(
            "/ElectricBillingPayment/transaction/meterReadingEntry/meterReadingDetails"
          );
        }
      })
      .catch((err) => {
        setLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const handleOnChange = (newConnectionKey, value, name) => {
    let temp = [...searchedConnections.rows];

    if (name === "currReading") {
      setSearchedConnections({
        ...searchedConnections,
        rows:
          temp &&
          temp.map((each, i) => {
            return {
              ...each,
              newConnectionKey: each.newConnectionKey,
              [name]:
                newConnectionKey == each.newConnectionKey ? value : each[name],
              consumedUnit:
                newConnectionKey == each.newConnectionKey &&
                each.prevReading >= 0 &&
                value
                  ? Math.abs(value - each.prevReading)
                  : each.consumedUnit,
              srNo: i + 1,
              monthAndYear: watch("monthAndYear"),
            };
          }),
      });
    } else if (name === "prevReading") {
      setSearchedConnections({
        ...searchedConnections,
        rows:
          temp &&
          temp.map((each, i) => {
            return {
              ...each,
              newConnectionKey: each.newConnectionKey,
              [name]:
                newConnectionKey == each.newConnectionKey ? value : each[name],
              consumedUnit:
                newConnectionKey == each.newConnectionKey &&
                each.currReading &&
                value
                  ? Math.abs(each.currReading - value)
                  : each.consumedUnit,
              srNo: i + 1,
              monthAndYear: watch("monthAndYear"),
            };
          }),
      });
    } else {
      setSearchedConnections({
        ...searchedConnections,
        rows:
          temp &&
          temp.map((each, i) => {
            return {
              ...each,
              newConnectionKey: each.newConnectionKey,
              [name]:
                newConnectionKey == each.newConnectionKey ? value : each[name],
              srNo: i + 1,
              monthAndYear: watch("monthAndYear"),
            };
          }),
      });
    }
  };

  // cancell Button
  const handleClearButton = () => {
    reset({
      ...resetValuesForClear,
    });
  };

  const handleExitButton = () => {
    router.push(
      "/ElectricBillingPayment/transaction/meterReadingEntry/meterReadingDetails"
    );
  };

  // Reset Values Cancell
  const resetValuesForClear = {
    consumerNo: "",
    zoneKey: "",
    msedclCategory: "",
    subDivisionKey: "",
    departmentCategory: "",
    monthAndYear: null,
  };

  // column for multiple entries table

  const columns = [
    //Sr No
    {
      field: "srNo",
      minWidth: 0.1,
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
    },

    // zone
    {
      field: language == "en" ? "zone" : "zoneMr",
      headerName: <FormattedLabel id="zone" />,
      width: 150,
      headerAlign: "center",
      align: "center",
    },

    // consumerNo
    {
      field: "consumerNo",
      headerName: <FormattedLabel id="consumerNo" />,
      width: 150,
      headerAlign: "center",
      align: "center",
    },

    // vanNo
    {
      field: "vanNo",
      headerName: <FormattedLabel id="vanNo" />,
      width: 150,
      headerAlign: "center",
      align: "center",
    },

    // prevReading
    {
      field: "prevReading",
      headerName: <FormattedLabel id="prevReading" />,
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <Box>
            <TextField
              disabled
              id="standard-textarea"
              sx={{ m: 1, minWidth: "50%", backgroundColor: "#FFF" }}
              variant="standard"
              name="prevReading"
              value={params?.row?.prevReading}
              // onChange={(e)=>{handleOnChange(params.row.newConnectionKey, e.target.value, "prevReading")}}
              error={!!errors.prevReading}
              helperText={
                errors?.prevReading ? errors.prevReading.message : null
              }
            />
          </Box>
        );
      },
    },

    // current reading date
    {
      field: "currReadingDate",
      headerName: <FormattedLabel id="currReadingDate" />,
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <Box>
            <FormControl error={!!errors.currReadingDate}>
              <Controller
                control={control}
                sx={{ m: 1, minWidth: "75%" }}
                name="currReadingDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      inputFormat="DD/MM/YYYY"
                      // @ts-ignore
                      disableFuture
                      value={
                        params.row.currReadingDate
                          ? params.row.currReadingDate
                          : null
                      }
                      onChange={(date) => {
                        field.onChange(
                          moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")
                        );
                        handleOnChange(
                          params.row.newConnectionKey,
                          moment(date, "YYYY-MM-DD").format("YYYY-MM-DD"),
                          "currReadingDate"
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          variant="standard"
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>
                {errors?.billDueDate ? errors.billDueDate.message : null}
              </FormHelperText>
            </FormControl>
          </Box>
        );
      },
    },

    // currReading
    {
      field: "currReading",
      headerName: <FormattedLabel id="currReading" />,
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <Box>
            <TextField
              id="standard-textarea"
              sx={{ m: 1, minWidth: "50%", backgroundColor: "#FFF" }}
              variant="standard"
              name="currReading"
              value={params?.row?.currReading}
              onChange={(e) => {
                handleOnChange(
                  params.row.newConnectionKey,
                  e.target.value,
                  "currReading"
                );
              }}
              error={!!errors.currReading}
              helperText={
                errors?.currReading ? errors.currReading.message : null
              }
            />
          </Box>
        );
      },
    },

    // consumedUnit
    {
      field: "consumedUnit",
      headerName: <FormattedLabel id="consumedUnit" />,
      width: 150,
      headerAlign: "center",
      align: "center",
    },

    // date
    {
      field: "billDueDate",
      headerName: <FormattedLabel id="billDueDate" />,
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <Box>
            <FormControl error={!!errors.billDueDate}>
              <Controller
                control={control}
                sx={{ m: 1, minWidth: "75%" }}
                name="billDueDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      inputFormat="DD/MM/YYYY"
                      // @ts-ignore
                      value={
                        params.row.billDueDate ? params.row.billDueDate : null
                      }
                      onChange={(date) => {
                        field.onChange(
                          moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")
                        );
                        handleOnChange(
                          params.row.newConnectionKey,
                          moment(date, "YYYY-MM-DD").format("YYYY-MM-DD"),
                          "billDueDate"
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          variant="standard"
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>
                {errors?.billDueDate ? errors.billDueDate.message : null}
              </FormHelperText>
            </FormControl>
          </Box>
        );
      },
    },

    // from Discount
    {
      field: "fromDiscount",
      headerName: <FormattedLabel id="fromDiscount" />,
      width: 150,
      renderCell: (params) => {
        return (
          <Box>
            <TextField
              id="standard-textarea"
              sx={{ m: 1, minWidth: "50%", backgroundColor: "#FFF" }}
              variant="standard"
              name="fromDiscount"
              value={params?.row?.fromDiscount}
              onChange={(e) => {
                handleOnChange(
                  params.row.newConnectionKey,
                  e.target.value,
                  "fromDiscount"
                );
              }}
              error={!!errors.fromDiscount}
              helperText={
                errors?.fromDiscount ? errors.fromDiscount.message : null
              }
            />
          </Box>
        );
      },
    },

    // from Discount Date
    {
      field: "fromDiscountDate",
      headerName: <FormattedLabel id="fromDiscountDate" />,
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <Box>
            <FormControl error={!!errors.fromDiscountDate}>
              <Controller
                control={control}
                sx={{ m: 1, minWidth: "75%" }}
                name="fromDiscountDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      inputFormat="DD/MM/YYYY"
                      // @ts-ignore
                      value={
                        params.row.fromDiscountDate
                          ? params.row.fromDiscountDate
                          : null
                      }
                      onChange={(date) => {
                        field.onChange(
                          moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")
                        );
                        handleOnChange(
                          params.row.newConnectionKey,
                          moment(date, "YYYY-MM-DD").format("YYYY-MM-DD"),
                          "fromDiscountDate"
                        );
                      }}
                      // maxDate={watch("params.row.billDueDate")}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          variant="standard"
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>
                {errors?.fromDiscountDate
                  ? errors.fromDiscountDate.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Box>
        );
      },
    },

    // billedAmount
    {
      field: "billedAmount",
      headerName: <FormattedLabel id="billedAmount" />,
      width: 150,
      renderCell: (params) => {
        return (
          <Box>
            <TextField
              id="standard-textarea"
              sx={{ m: 1, minWidth: "50%", backgroundColor: "#FFF" }}
              variant="standard"
              name="billedAmount"
              value={params?.row?.billedAmount}
              onChange={(e) => {
                handleOnChange(
                  params.row.newConnectionKey,
                  e.target.value,
                  "billedAmount"
                );
              }}
              error={!!errors.billedAmount}
              helperText={
                errors?.billedAmount ? errors.billedAmount.message : null
              }
            />
          </Box>
        );
      },
    },

    // amountToBePaid
    {
      field: "amountToBePaid",
      headerName: <FormattedLabel id="amountToBePaid" />,
      width: 150,
      renderCell: (params) => {
        return (
          <Box>
            <TextField
              id="standard-textarea"
              sx={{ m: 1, minWidth: "50%", backgroundColor: "#FFF" }}
              variant="standard"
              name="amountToBePaid"
              value={
                params?.row?.amountToBePaid
                  ? params?.row?.amountToBePaid
                  : params?.row?.billedAmount
              }
              onChange={(e) => {
                handleOnChange(
                  params.row.newConnectionKey,
                  e.target.value,
                  "amountToBePaid"
                );
              }}
              error={!!errors.amountToBePaid}
              helperText={
                errors?.amountToBePaid ? errors.amountToBePaid.message : null
              }
            />
          </Box>
        );
      },
    },

    {
      field: "remarks",
      headerName: <FormattedLabel id="remark" />,
      type: "string",
      width: 400,
      editable: true,
      renderEditCell: (params) => {
        return (
          <Box>
            <TextField
              id="standard-textarea"
              sx={{
                m: 1,
                minWidth: 380,
                width: "90%",
                backgroundColor: "#FFF",
              }}
              variant="standard"
              name="remarks"
              value={params?.row?.remarks}
              onChange={(e) => {
                handleOnChange(
                  params.row.newConnectionKey,
                  e.target.value,
                  "remarks"
                );
              }}
              error={!!errors.remarks}
              helperText={errors?.remarks ? errors.remarks.message : null}
            />
          </Box>
        );
      },
    },

    // attchement
    {
      field: "attachedDoc1",
      headerName: <FormattedLabel id="attachment" />,
      width: 200,
      renderCell: (params) => {
        return (
          <Box>
            <UploadButton
              appName="EBP"
              serviceName="EBP-NewConnection"
              filePath={(path) => {
                handleOnChange(
                  params.row.newConnectionKey,
                  path,
                  "attachedDoc1"
                );
              }}
              fileName={params?.row?.attachedDoc1}
            />
          </Box>
        );
      },
    },
  ];

  return loading ? (
    <CommonLoader />
  ) : (
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
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          {/* Firts Row */}

          <Box>
            <Grid
              container
              className={commonStyles.title}
              style={{ marginBottom: "8px" }}
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
                  <FormattedLabel id="meterReadingEntry" />
                </h3>
              </Grid>
            </Grid>
          </Box>

          <Grid
            container
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "10px",
            }}
          >
            {/* month And Year */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Current reading date in English */}
              <FormControl
                error={!!errors.monthAndYear}
                fullWidth
                sx={{ width: "75%" }}
              >
                <Controller
                  control={control}
                  name="monthAndYear"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        views={["month", "year"]}
                        //  sx={{ m: 1, minWidth: "75%" }}
                        inputFormat="MMM/yyyy"
                        label={
                          <span style={{ fontSize: 16 }}>
                            <FormattedLabel id="monthAndYear" required />
                          </span>
                        }
                        value={field.value}
                        onChange={(date) => {
                          // field.onChange(date)
                          field.onChange(moment(date).format("YYYY-MM"));
                        }}
                        // selected={field.value}
                        // center
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            error={!!errors.monthAndYear}
                            helperText={
                              errors.monthAndYear
                                ? errors.monthAndYear?.message
                                : null
                            }
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
              </FormControl>
            </Grid>

            {/* Zone Name */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl
                // variant="outlined"
                variant="standard"
                size="small"
                sx={{ m: 1, minWidth: "75%" }}
                error={!!errors.zoneKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="zone" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      // sx={{ width: 200 }}
                      value={field.value}
                      {...register("zoneKey")}
                      label={<FormattedLabel id="zone" />}
                      // InputLabelProps={{
                      //   //true
                      //   shrink:
                      //     (watch("officeLocation") ? true : false) ||
                      //     (router.query.officeLocation ? true : false),
                      // }}
                    >
                      {zoneDropDown &&
                        zoneDropDown.map((wa, index) => (
                          <MenuItem key={index} value={wa.id}>
                            {language == "en" ? wa.zoneName : wa.zoneNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="zoneKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.zoneKey ? errors.zoneKey.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Subdivision */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl
                // variant="outlined"
                variant="standard"
                size="small"
                sx={{ m: 1, minWidth: "75%" }}
                error={!!errors.subDivisionKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="subDivision" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      // sx={{ width: 200 }}
                      value={field.value}
                      {...register("subDivisionKey")}
                      label={<FormattedLabel id="subDivision" />}
                    >
                      {subDivisionDropDown &&
                        subDivisionDropDown.map((each, index) => (
                          <MenuItem key={index} value={each.id}>
                            {language == "en"
                              ? each.subDivision
                              : each.subDivisionMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="subDivisionKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.subDivisionKey
                    ? errors.subDivisionKey.message
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Consumer No  */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                id="standard-textarea"
                label={<FormattedLabel id="consumerNo" />}
                sx={{ m: 1, minWidth: "75%" }}
                variant="standard"
                {...register("consumerNo")}
                error={!!errors.consumerNo}
                helperText={
                  errors?.consumerNo ? errors.consumerNo.message : null
                }
                InputLabelProps={{
                  //true
                  shrink: watch("consumerNo") ? true : false,
                }}
              />
            </Grid>

            {/* MSEDCL Category */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl
                // variant="outlined"
                variant="standard"
                size="small"
                sx={{ m: 1, minWidth: "75%" }}
                error={!!errors.msedclCategory}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="msedclCategory" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      // sx={{ width: 200 }}
                      value={field.value}
                      {...register("msedclCategory")}
                      label={<FormattedLabel id="msedclCategory" />}
                    >
                      {msedclCategoryDropDown &&
                        msedclCategoryDropDown.map((each, index) => (
                          <MenuItem key={index} value={each.id}>
                            {language == "en"
                              ? each.msedclCategory
                              : each.msedclCategoryMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="msedclCategory"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.msedclCategory
                    ? errors.msedclCategory.message
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>

          <Grid
            container
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                size="small"
                variant="contained"
                onClick={() => {
                  handleSearchConnections();
                }}
              >
                <FormattedLabel id="search" />
              </Button>
            </Grid>

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                size="small"
                onClick={handleClearButton}
              >
                <FormattedLabel id="clear" />
              </Button>
            </Grid>

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                size="small"
                color="error"
                onClick={handleExitButton}
              >
                <FormattedLabel id="exit" />
              </Button>
            </Grid>
          </Grid>

          {/* Modal to select multiple Entry Connections */}

          <Card>
            <DataGrid
              getRowId={(row) => row.srNo}
              components={{ Toolbar: GridToolbar }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              autoHeight
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
              density="compact"
              rows={
                searchedConnections != undefined || searchedConnections != null
                  ? searchedConnections.rows
                  : []
              }
              columns={columns}
              checkboxSelection
              selectionModel={selectionModel}
              onSelectionModelChange={handleSelectionModelChange}
              disableSelectionOnClick // to prevent selection or dis-selection when click on row out side the checkbox
              pagination
              // paginationMode="server"
              loading={searchedConnections.loading}
              rowCount={searchedConnections.totalRows}
              rowsPerPageOptions={searchedConnections.rowsPerPageOptions}
              page={searchedConnections.page}
              pageSize={searchedConnections.pageSize}
              // onPageChange={(_data) => {
              //   handleSearchConnections(searchedConnections.pageSize, _data);
              // }}
              onPageSizeChange={(_data) => {
                handleSearchConnections(_data, searchedConnections.page);
              }}
            />
          </Card>

          <Grid
            container
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "30px",
            }}
          >
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                size="small"
                type="submit"
                color="success"
              >
                <FormattedLabel id="save" />
              </Button>
            </Grid>

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                size="small"
                onClick={handleExitButton}
              >
                <FormattedLabel id="back" />
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </Paper>
  );
};

export default Index;
