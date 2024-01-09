import { Box, Button, Grid, Paper, Tooltip } from "@mui/material";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "../../../../../containers/schema/ElelctricBillingPaymentSchema/connectionEntrySchema";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { height } from "@mui/system";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import moment from "moment";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { language } from "../../../../../features/labelSlice";
import urls from "../../../../../URLS/urls";
import { useDispatch, useSelector } from "react-redux";
import theme from "../../../../../theme.js";
import styles from "./view.module.css";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import UploadButton from "../../../../../components/ElectricBillingComponent/uploadDocument/uploadButton";
import { useLocation } from "react-router-dom";
import Loader from "../../../../../containers/Layout/components/Loader";
import BreadCrumb from "../../../../../components/common/BreadcrumbComponent";
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
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const router = useRouter();
  const [dataSource, setDataSource] = useState([]);
  const [department, setDepartment] = useState([]);
  const [consumptionType, setConsumptionType] = useState([]);
  const [billingDivisionAndUnit, setBillingDivisionAndUnit] = useState([]);
  const [zoneDropDown, setZoneDropDown] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch();
  const [fetchData, setFetchData] = useState(null);
  const [entryConnectionId, setEntryConnectionId] = useState();
  const [selectionModel, setSelectionModel] = useState([]);

  const [loading, setLoading] = useState(false);
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
  let tableData = [];
  let tableData1 = [];
  let tableData2 = [];
  let tableData3 = [];
  let tableData4 = [];

  const language = useSelector((state) => state.labels.language);

  //get logged in user
  const user = useSelector((state) => state.user.user);

  // selected menu from drawer

  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );

  const headers = {
    Authorization: `Bearer ${user.token}`,
  };

  // get authority of selected user

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  useEffect(() => {
    getMeterReadingEntryData();
  }, []);

  // useEffect(() => {
  //   getMeterReadingEntryData();
  // }, [zoneDropDown]);

  useEffect(() => {
    getDepartment();
    getConsumptionType();
    getBillingDivisionAndUnit();
    getZone();
  }, []);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const catchMethod = (err) => {
    console.log("err", err);
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

  //handle Add Button
  const handleAddButton = () => {
    router.push(
      "/ElectricBillingPayment/transaction/meterReadingEntry/meterReadingEntry"
    );
  };

  //handle view actions as per role
  const handleViewActions = (paramsRow) => {
    router.push({
      pathname:
        "/ElectricBillingPayment/transaction/meterReadingEntry/viewMeterReadingEntry",
      query: {
        id: paramsRow.id,
      },
    });
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

  // get Department Name
  const getDepartment = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, { headers: headers })
      .then((r) => {
        setDepartment(
          r.data.department.map((row) => ({
            id: row.id,
            department: row.department,
            departmentMr: row.departmentMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // get Consumption Type
  const getConsumptionType = () => {
    axios
      .get(`${urls.EBPSURL}/mstConsumptionType/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setConsumptionType(res.data.mstConsumptionTypeList);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get Billing Division And Unit
  const getBillingDivisionAndUnit = () => {
    axios
      .get(`${urls.EBPSURL}/mstBillingUnit/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let temp = res.data.mstBillingUnitList;
        setBillingDivisionAndUnit(
          temp.map((each) => {
            return {
              id: each.id,
              billingDivisionAndUnit: `${each.divisionName}/${each.billingUnit}`,
              billingDivisionAndUnitMr: `${each.divisionNameMr}/${each.billingUnit}`,
            };
          })
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const handleSelectionModelChange = (newSelectionModel) => {
    setSelectionModel(newSelectionModel);
  };
  const [tableDataRes, setTableData] = useState([]);
  // Get Table - Data
  const getMeterReadingEntryData = (_pageSize = 10, _pageNo = 0) => {
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
        let result = r.data;
        setTableData(result);
        // if (!r.data && r.data.length == 0) {

        //   return;
        // }

        // if (authority && authority?.find((val) => val === "JUNIOR_ENGINEER")) {
        //   tableData1 = result?.filter((data, index) => {
        //     return data;
        //   });
        // }

        // if (authority && authority?.find((val) => val === "DEPUTY_ENGINEER")) {
        //   tableData2 = result?.filter((data, index) => {
        //     return data;
        //   });
        // }

        // if (
        //   authority &&
        //   authority?.find((val) => val === "EXECUTIVE_ENGINEER")
        // ) {
        //   tableData3 = result?.filter((data, index) => {
        //     return data;
        //   });
        // }

        // if (authority && authority?.find((val) => val === "ACCOUNTANT")) {
        //   tableData4 = result?.filter((data, index) => {
        //     return data;
        //   });
        // }

        // tableData = [
        //   ...tableData1,
        //   ...tableData2,
        //   ...tableData3,
        //   ...tableData4,
        // ];
        // if (zoneDropDown.length != 0) {
        setLoading(false);

        // }
      })
      .catch((err) => {
        setLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };
  useEffect(() => {
    if (tableDataRes.length != 0) {
      let _res = tableDataRes.trnMeterReadingAndBillGenerateList.map((r, i) => {
        return {
          activeFlag: r.activeFlag,
          id: r.id,
          srNo: i + 1 + tableDataRes.pageNo * tableDataRes.pageSize,
          consumerNo: r?.consumerNo,
          vanNo: r?.newConnectionEntryDao?.vanNo,
          monthAndYear: r?.monthAndYear
            ? moment(r?.monthAndYear).format("MMM-YYYY")
            : null,
          fromDiscount: r?.fromDiscount,
          fromDiscountDate: r?.fromDiscountDate
            ? moment(r?.fromDiscountDate).format("DD-MM-YYYY")
            : null,
          prevReading: r?.prevReading,
          currReading: r?.currReading,
          currReadingDate: r?.currReadingDate
            ? moment(r?.currReadingDate).format("DD-MM-YYYY")
            : null,
          zone: zoneDropDown?.find((obj) => obj.id == r?.zoneKey)?.zoneName,
          zoneMr: zoneDropDown?.find((obj) => obj.id == r?.zoneKey)?.zoneNameMr,
          consumedUnit: r?.consumedUnit,
          billedAmount: r?.billedAmount,
          amountToBePaid: r?.amountToBePaid,
          billDueDate: r?.billDueDate
            ? moment(r?.billDueDate).format("DD-MM-YYYY")
            : null,
          remarks: r?.remarks,
          attachedDoc1: r?.attachedDoc1,
        };
      });

      setDataSource(_res);
      console.log("_res", _res);
      setData({
        rows: _res,
        totalRows: tableDataRes.totalElements,
        rowsPerPageOptions: [10, 20, 50, 100],
        pageSize: tableDataRes.pageSize,
        page: tableDataRes.pageNo,
      });
    }
  }, [tableDataRes, zoneDropDown]);

  const columns = [
    //Sr No
    {
      field: "srNo",
      width: 70,
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
    },

    // Zone
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

    // monthAndYear
    {
      field: "monthAndYear",
      headerName: <FormattedLabel id="monthAndYear" />,
      width: 150,
      headerAlign: "center",
      align: "center",
    },

    // prevReading
    {
      field: "prevReading",
      headerName: <FormattedLabel id="prevReading" />,
      width: 150,
      headerAlign: "center",
      align: "center",
    },

    // currReadingDate
    {
      field: "currReadingDate",
      headerName: <FormattedLabel id="currReadingDate" />,
      width: 150,
      headerAlign: "center",
      align: "center",
    },

    // consumedUnit
    {
      field: "consumedUnit",
      headerName: <FormattedLabel id="consumedUnit" />,
      width: 150,
      headerAlign: "center",
      align: "center",
    },

    // billDueDate
    {
      field: "billDueDate",
      headerName: <FormattedLabel id="billDueDate" />,
      width: 150,
      headerAlign: "center",
      align: "center",
    },

    // from Discount
    {
      field: "fromDiscount",
      headerName: <FormattedLabel id="fromDiscount" />,
      width: 150,
      headerAlign: "center",
      align: "center",
    },

    // from Discount Date
    {
      field: "fromDiscountDate",
      headerName: <FormattedLabel id="fromDiscountDate" />,
      width: 150,
      headerAlign: "center",
      align: "center",
    },

    // billedAmount
    {
      field: "billedAmount",
      headerName: <FormattedLabel id="billedAmount" />,
      width: 150,
      headerAlign: "center",
      align: "center",
    },

    // amountToBePaid
    {
      field: "amountToBePaid",
      headerName: <FormattedLabel id="amountToBePaid" />,
      width: 150,
      headerAlign: "center",
      align: "center",
    },

    // remark
    {
      field: "remarks",
      headerName: <FormattedLabel id="remark" />,
      width: 150,
    },

    // attchement
    {
      field: "attachedDoc1",
      headerName: <FormattedLabel id="attachment" />,
      headerAlign: "center",
      align: "center",
      width: 150,
      renderCell: (params) => {
        return (
          <Box>
            {params?.row?.attachedDoc1 ? (
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
                mode="View" // this props is for not show delete icon
              />
            ) : (
              <></>
            )}
          </Box>
        );
      },
    },
  ];

  // Row

  return (
    <>
      {" "}
      {loading ? (
        <CommonLoader />
      ) : (
        <>
          <Box>
            <div>
              <BreadCrumb />
            </div>
          </Box>
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
            <>
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

              {authority &&
              authority.find((val) => val === "JUNIOR_ENGINEER") ? (
                <div className={styles.addbtn}>
                  <Button
                    size="small"
                    variant="contained"
                    endIcon={<AddIcon />}
                    // type='primary'
                    disabled={buttonInputState}
                    onClick={handleAddButton}
                  >
                    <FormattedLabel id="add" />
                  </Button>
                </div>
              ) : (
                <></>
              )}

              <DataGrid
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
                autoHeight={data.pageSize}
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
                pagination
                paginationMode="server"
                loading={data.loading}
                rowCount={data.totalRows}
                rowsPerPageOptions={data.rowsPerPageOptions}
                page={data.page}
                pageSize={data.pageSize}
                rows={data.rows}
                columns={columns}
                onPageChange={(_data) => {
                  getMeterReadingEntryData(data.pageSize, _data);
                }}
                onPageSizeChange={(_data) => {
                  getMeterReadingEntryData(_data, data.page);
                }}
                checkboxSelection
                selectionModel={selectionModel}
                onSelectionModelChange={handleSelectionModelChange}
                disableSelectionOnClick
              />

              <Grid
                container
                sx={{
                  margin: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {selectionModel.length > 0 ? (
                  <Button
                    variant="contained"
                    size="small"
                    color="success"
                    onClick={() => {
                      router.push({
                        pathname:
                          "/ElectricBillingPayment/transaction/meterReadingEntry/editMeterReadingEntry",
                        query: {
                          selectionModel: selectionModel,
                        },
                      });
                    }}
                  >
                    <FormattedLabel id="update" />
                  </Button>
                ) : (
                  <></>
                )}
              </Grid>
            </>
          </Paper>
        </>
      )}
    </>
  );
};

export default Index;
