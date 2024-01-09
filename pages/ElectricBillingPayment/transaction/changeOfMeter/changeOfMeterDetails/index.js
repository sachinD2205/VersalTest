import { Box, Button, Paper, Tooltip, Grid } from "@mui/material";
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
import UploadButton from "../../../../../components/fileUpload/UploadButton";
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
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [department, setDepartment] = useState([]);
  const [consumptionType, setConsumptionType] = useState([]);
  const [billingDivisionAndUnit, setBillingDivisionAndUnit] = useState([]);
  const [subDivision, setSubDivision] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch();
  const [fetchData, setFetchData] = useState(null);
  const [entryConnectionId, setEntryConnectionId] = useState();

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
    getDepartment();
    getConsumptionType();
    getBillingDivisionAndUnit();

    if (department && billingDivisionAndUnit && consumptionType) {
      getNewConnectionsData();
    }
  }, []);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

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

  //handle view actions as per role
  const handleViewActions = (paramsRow) => {
    if (paramsRow.status === "DG Waiting for Dy Eng") {
      router.push({
        pathname:
          "/ElectricBillingPayment/transaction/changeOfMeter/viewNewMeterDetails",
        query: {
          id: paramsRow.id,
        },
      });
    } else {
      router.push({
        pathname:
          "/ElectricBillingPayment/transaction/changeOfMeter/viewNewMeterDetails",
        query: {
          id: paramsRow.id,
        },
      });
    }
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
  useEffect(() => {
    setLoading(false);
  }, [language]);

  // useEffect(() => {
  //   if (department && billingDivisionAndUnit && consumptionType) {
  //     getNewConnectionsData();
  //   }
  // }, [fetchData]);
  //  department, billingDivisionAndUnit, consumptionType

  // Get Table - Data
  const getNewConnectionsData = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    axios
      .get(`${urls.EBPSURL}/trnNewConnectionEntry/getAll`, {
        headers: headers,
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        setLoading(false);
        let result = r.data.trnNewConnectionEntryList;

        // if (!r.data && r.data.length == 0) {

        //   return;
        // }

        if (authority && authority?.find((val) => val === "JUNIOR_ENGINEER")) {
          tableData1 = result?.filter((data, index) => {
            return data;
          });
        }

        if (authority && authority?.find((val) => val === "DEPUTY_ENGINEER")) {
          tableData2 = result?.filter((data, index) => {
            return data;
          });
        }

        if (
          authority &&
          authority?.find((val) => val === "EXECUTIVE_ENGINEER")
        ) {
          tableData3 = result?.filter((data, index) => {
            return data;
          });
        }

        if (authority && authority?.find((val) => val === "ACCOUNTANT")) {
          tableData4 = result?.filter((data, index) => {
            return data;
          });
        }

        tableData = [
          ...tableData1,
          ...tableData2,
          ...tableData3,
          ...tableData4,
        ];
        if (
          department &&
          consumptionType &&
          billingDivisionAndUnit &&
          subDivision
        ) {
          let _res = tableData.map((r, i) => {
            return {
              activeFlag: r.activeFlag,
              id: r.id,
              srNo: i + 1 + _pageNo * _pageSize,

              consumerName: r.consumerName,
              consumerNameMr: r.consumerNameMr,

              consumerAddress: r.consumerAddress,
              consumerAddressMr: r.consumerAddressMr,

              deptName: department?.find((obj) => {
                // show dept name in english in table
                return obj.id == r?.departmentKey;
              })
                ? department.find((obj) => {
                    return obj.id == r.departmentKey;
                  }).department
                : "-",

              deptNameMr: department?.find((obj) => {
                // show dept name in marathi in table
                return obj.id == r?.departmentKey;
              })
                ? department.find((obj) => {
                    return obj.id == r.departmentKey;
                  }).departmentMr
                : "-",

              consumptionType: consumptionType.find((obj) => {
                return obj.id == r.consumptionTypeKey;
              })
                ? consumptionType.find((obj) => {
                    return obj.id == r.consumptionTypeKey;
                  }).consumptionType
                : "-",

              consumptionTypeMr: consumptionType.find((obj) => {
                return obj.id == r.consumptionTypeKey;
              })
                ? consumptionType.find((obj) => {
                    return obj.id == r.consumptionTypeKey;
                  }).consumptionTypeMr
                : "-",

              billingUnitAndDivision: billingDivisionAndUnit.find((obj) => {
                return obj.id == r.billingUnitKey;
              })
                ? billingDivisionAndUnit.find((obj) => {
                    return obj.id == r.billingUnitKey;
                  }).billingDivisionAndUnit
                : "-",

              billingUnitAndDivisionMr: billingDivisionAndUnit.find((obj) => {
                return obj.id == r.billingUnitKey;
              })
                ? billingDivisionAndUnit.find((obj) => {
                    return obj.id == r.billingUnitKey;
                  }).billingDivisionAndUnitMr
                : "-",

              status:
                r.status === null
                  ? "Pending"
                  : r.status == 0
                  ? "Save As Draft"
                  : r.status == 2
                  ? "Waiting For MSECDL Quotation"
                  : r.status == 11
                  ? "Send To Site Visit"
                  : r.status == 13
                  ? "DG Waiting For Jr Eng"
                  : r.status == 14
                  ? "DG Revert Back to Jr Eng"
                  : r.status == 16
                  ? "Bill Revert Back to Jr Eng"
                  : r.status == 17
                  ? "DG Waiting for Dy Eng"
                  : r.status == 18
                  ? "DG Revert Back to Dy Eng"
                  : r.status == 19
                  ? "Bill Waiting for Dy. Eng"
                  : r.status == 20
                  ? "Bill Revert Back to Dy Eng"
                  : r.status == 21
                  ? "DG Waiting for Exe Eng"
                  : r.status == 23
                  ? "Bill Waiting for Exe.Eng"
                  : r.status == 7
                  ? "Waiting for Accountant Approval"
                  : r.status == 15
                  ? "Waiting For Jr.Eng after bill"
                  : r.status == 8
                  ? "Completed"
                  : r.status == 9
                  ? "Closed"
                  : r.status == 10
                  ? "Duplicate"
                  : "Invalid",
            };
          });

          setDataSource(_res);
          setData({
            rows: _res,
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

  const columns = [
    //Sr No
    { field: "srNo", width: 70, headerName: <FormattedLabel id="srNo" /> },

    // departmentName
    {
      field: language === "en" ? "deptName" : "deptNameMr",
      headerName: <FormattedLabel id="deptName" />,
      flex: 1,
    },

    // consumerName
    {
      field: language === "en" ? "consumerName" : "consumerNameMr",
      headerName: <FormattedLabel id="consumerName" />,
      flex: 1,
    },

    // consumerAddress
    {
      field: language === "en" ? "consumerAddress" : "consumerAddressMr",
      headerName: <FormattedLabel id="consumerAddress" />,
      flex: 1,
    },

    // consumptionType
    {
      field: language === "en" ? "consumptionType" : "consumptionTypeMr",
      headerName: <FormattedLabel id="consumptionType" />,
      flex: 1,
    },

    // Billing Unit/Division
    {
      field:
        language === "en"
          ? "billingUnitAndDivision"
          : "billingUnitAndDivisionMr",
      headerName: <FormattedLabel id="billingUnitAndDivision" />,
      flex: 1,
    },

    // // subDivision
    // {
    //   field: language === "en" ? "subDivision" : "subDivisionMr",
    //   headerName: <FormattedLabel id="subDivision" />,
    //   flex: 1,
    // },

    // status
    // {
    //   field: language === "en" ? "status" : "statusMr",
    //   width: 200,
    //   headerName: <FormattedLabel id="status" />,
    //   flex: 1,
    //   renderCell: (params) => {
    //     return (
    //       <Box>
    //         {params.row.status === "Completed" ? (
    //           <p style={{ color: "#4BB543" }}>{params.row.status}</p>
    //         ) : params.row.status.includes("Revert Back") ? (
    //           <p style={{ color: "red" }}>{params.row.status}</p>
    //         ) : params.row.status.includes("Waiting For Jr") &&
    //           authority &&
    //           authority.find((val) => val === "JUNIOR_ENGINEER") ? (
    //           <p style={{ color: "blue" }}>{params.row.status}</p>
    //         ) : params.row.status.includes("Waiting for Dy") &&
    //           authority &&
    //           authority.find((val) => val === "DEPUTY_ENGINEER") ? (
    //           <p style={{ color: "blue" }}>{params.row.status}</p>
    //         ) : params.row.status.includes("Waiting for Exe") &&
    //           authority &&
    //           authority.find((val) => val === "EXECUTIVE_ENGINEER") ? (
    //           <p style={{ color: "blue" }}>{params.row.status}</p>
    //         ) : params.row.status.includes("Accountant") &&
    //           authority &&
    //           authority.find((val) => val === "ACCOUNTANT") ? (
    //           <p style={{ color: "blue" }}>{params.row.status}</p>
    //         ) : (
    //           <p style={{ color: "orange" }}>{params.row.status}</p>
    //         )}
    //       </Box>
    //     );
    //   },
    // },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 130,
      headerAlign: "center",
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <Tooltip title="View">
              <IconButton
                onClick={() => {
                  handleViewActions(params.row);
                }}
              >
                <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Edit">
              <IconButton
                onClick={() => {
                  router.push({
                    pathname:
                      "/ElectricBillingPayment/transaction/changeOfMeter/addNewMeter",
                    query: {
                      id: params.row.id,
                    },
                  });
                }}
              >
                <EditIcon style={{ color: "#556CD6" }} />
              </IconButton>
            </Tooltip>

            {/* {authority &&
            authority.find((val) => val === "JUNIOR_ENGINEER") &&
            params.row.status === "Waiting For MSECDL Quotation" ? (
              <>
                <Tooltip title="Quotation Entry">
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname: "/ElectricBillingPayment/transaction/newConnectionEntry/quotationEntry",
                        query: {
                          id: params.row.id,
                        },
                      });
                    }}
                  >
                    <ArrowForwardIcon style={{ color: "#556CD6" }} />
                  </IconButton>
                </Tooltip>

              </>
            ) : authority &&
              authority.find((val) => val === "ACCOUNTANT") &&
              params.row.status === "Waiting for Accountant Approval" ? (
              <Tooltip title="Payment Entry">
                <IconButton
                  onClick={() => {
                    router.push({
                      pathname: "/ElectricBillingPayment/transaction/newConnectionEntry/paymentEntry",
                      query: {
                        id: params.row.id,
                      },
                    });
                  }}
                >
                  <ArrowForwardIcon style={{ color: "#556CD6" }} />
                </IconButton>
              </Tooltip>
            ) : (
              <>
                {authority &&
                authority.find((val) => val === "ACCOUNTANT") &&
                params.row.status === "Waiting For Jr.Eng after bill" ? (
                  <Tooltip title="Edit">
                    <IconButton
                      disabled={editButtonInputState}
                      onClick={() => {
                        router.push({
                          pathname: "/ElectricBillingPayment/transaction/newConnectionEntry/editPaymentEntry",
                          query: {
                            id: params.row.id,
                          },
                        }),
                          reset(params.row);
                      }}
                    >
                      <EditIcon style={{ color: "#556CD6" }} />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <></>
                )}
              </>
            )} */}
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
                      <FormattedLabel id="changeOfMeter" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>

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
                // rows={dataSource}
                // columns={columns}
                // pageSize={5}
                // rowsPerPageOptions={[5]}
                // checkboxSelection

                density="compact"
                // autoHeight={200}
                // rowHeight={50}
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
                  getNewConnectionsData(data.pageSize, _data);
                }}
                onPageSizeChange={(_data) => {
                  getNewConnectionsData(_data, data.page);
                }}
              />
            </>
          </Paper>
        </>
      )}
    </>
  );
};

export default Index;

//msedclCateogryKey
