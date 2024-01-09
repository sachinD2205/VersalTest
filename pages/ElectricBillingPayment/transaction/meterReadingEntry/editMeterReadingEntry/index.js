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
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
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
  const [wardDropDown, setWardDropDown] = useState([]);
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

  // selected menu from drawer

  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );

  // get authority of selected user
  const headers = {
    Authorization: `Bearer ${user.token}`,
  };

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  useEffect(() => {
    getWard();
    getMsedclCategory();
    getSubDivision();
    getDepartmentCategory();
  }, [language]);

  useEffect(() => {
    setValue(
      "consummedUnit",
      Math.abs(watch("currReading") - watch("prevReading"))
        ? Math.abs(watch("currReading") - watch("prevReading"))
        : "0"
    );
  }, [watch("currReading"), watch("prevReading")]);

  useEffect(() => {
    getZone();
  }, [router.query.selectionModel]);

  useEffect(() => {
    handleSearchConnections();
  }, [zoneDropDown]);

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

  // get Ward Name
  const getWard = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let temp = res.data.ward;
        setWardDropDown(temp);
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
    setLoading(true);
    axios
      .get(`${urls.EBPSURL}/trnMeterReadingAndBillGenerate/getAll`, {
        headers: headers,
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        setLoading(false);
        let result = r.data.trnMeterReadingAndBillGenerateList;
        if (result.length > 0 && zoneDropDown.length != 0) {
          let temp =
            typeof router?.query?.selectionModel == "string"
              ? [router?.query?.selectionModel]
              : router?.query?.selectionModel;
          let selectedObj =
            temp &&
            temp?.map((each, i) => {
              let _res = result.find((res, i) => {
                return res.id == each;
              });
              return {
                ..._res,
                srNo: i + 1,
                vanNo: _res?.newConnectionEntryDao?.vanNo,
                zone: zoneDropDown?.find((obj) => obj.id == _res?.zoneKey)
                  ?.zoneName,
                zoneMr: zoneDropDown?.find((obj) => obj.id == _res?.zoneKey)
                  ?.zoneNameMr,
              };
            });

          setSearchedConnections({
            rows: selectedObj ? selectedObj : [],
            totalRows: r.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: r.data.pageSize,
            page: r.data.pageNo,
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const onSubmitForm = (formdata) => {
    setLoading(true);

    // if amountToBePaid is not edited (changed)

    let temp = searchedConnections?.rows;

    temp &&
      temp.map((each) => {
        if (each.amountToBePaid != null) {
          return each;
        } else {
          return (each.amountToBePaid = each.billedAmount);
        }
      });

    let selectedObjects = temp;

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
            language === "en" ? "Success!" : "यशस्वी!",
            language === "en"
              ? "Meter Reading Entries Updated Successfully !"
              : "मीटर रीडिंग नोंदी यशस्वीरित्या अपडेट केल्या !",
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

  const handleOnChange = (id, value, name) => {
    let temp = [...searchedConnections.rows];

    if (name === "currReading") {
      setSearchedConnections({
        ...searchedConnections,
        rows:
          temp &&
          temp.map((each, i) => {
            return {
              ...each,
              id: each.id,
              [name]: id == each.id ? value : each[name],
              consumedUnit:
                id == each.id && each.prevReading >= 0 && value
                  ? Math.abs(value - each.prevReading)
                  : each.consumedUnit,
              srNo: i + 1,
              monthAndYear: each?.monthAndYear,
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
              id: each.id,
              [name]: id == each.id ? value : each[name],
              consumedUnit:
                id == each.id && each.currReading >= 0 && value
                  ? Math.abs(each.currReading - value)
                  : each.consumedUnit,
              srNo: i + 1,
              monthAndYear: each?.monthAndYear,
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
              id: each.id,
              [name]: id == each.id ? value : each[name],
              srNo: i + 1,
              monthAndYear: each?.monthAndYear,
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
    wardKey: "",
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
              onChange={(e) => {
                handleOnChange(params.row.id, e.target.value, "prevReading");
              }}
              error={!!errors.prevReading}
              helperText={
                errors?.prevReading ? errors.prevReading.message : null
              }
            />
          </Box>
        );
      },
    },

    // currReadingDate
    {
      field: "currReadingDate",
      headerName: <FormattedLabel id="currReadingDate" />,
      width: 150,
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
                          params.row.id,
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
                {errors?.currReadingDate
                  ? errors.currReadingDate.message
                  : null}
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
                handleOnChange(params.row.id, e.target.value, "currReading");
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
                          params.row.id,
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
                handleOnChange(params.row.id, e.target.value, "fromDiscount");
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
                          params.row.id,
                          moment(date, "YYYY-MM-DD").format("YYYY-MM-DD"),
                          "fromDiscountDate"
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
                handleOnChange(params.row.id, e.target.value, "billedAmount");
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
                handleOnChange(params.row.id, e.target.value, "amountToBePaid");
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

    // remarks

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
                handleOnChange(params.row.id, e.target.value, "remarks");
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
                handleOnChange(params.row.id, path, "attachedDoc1");
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
                <FormattedLabel id="update" />
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
