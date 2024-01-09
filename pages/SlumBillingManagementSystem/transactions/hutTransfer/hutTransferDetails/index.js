import React, { useEffect, useState } from "react";
import router from "next/router";
import styles from "../../sbms.module.css";
import DownloadIcon from "@mui/icons-material/Download";
import { Paper, Button, IconButton, Box, Tooltip, Grid } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Add } from "@mui/icons-material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import DraftsIcon from "@mui/icons-material/Drafts";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import PaymentIcon from "@mui/icons-material/Payment";
import moment from "moment";
import sweetAlert from "sweetalert";
import { manageStatus } from "../../../../../components/rtiOnlineSystem/commonStatus/manageEnMr";
import Loader from "../../../../../containers/Layout/components/Loader";
import commonRoleId from "../../../../../components/SlumBillingManagementSystem/FileUpload/RoleId/commonRole";
import ReceiptIcon from "@mui/icons-material/Receipt";
import BreadcrumbComponent from "../../../../../components/common/BreadcrumbComponent";
import commonStyles from "../../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../../util/commonErrorUtil";
const Index = () => {
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const language = useSelector((state) => state.labels.language);
  //get logged in user
  const user = useSelector((state) => state.user.user);
  const [hutTransferDetails, setHutTransferDetails] = useState(null);
  const [statusAll, setStatus] = useState([]);
  let loggedInUser = localStorage.getItem("loggedInUser");
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );
  const [isLoading, setIsLoading] = useState(false);
  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roleIds;
  const headers ={ Authorization: `Bearer ${user?.token}` };
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
  useEffect(() => {
    getAllStatus();
    getAllHutTransferData();
  }, []);

  // get all photopass data

  const getAllHutTransferData = (_pageSize = 10, _pageNo = 0) => {
    setIsLoading(true);
    axios
      .get(`${urls.SLUMURL}/trnTransferHut/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: headers,
      })
      .then((r) => {
        setIsLoading(false);
        setHutTransferDetails(r.data);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  useEffect(() => {
    if (hutTransferDetails != null) {
      setDataToTable();
    }
  }, [hutTransferDetails, language, statusAll]);

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

  const setDataToTable = () => {
    let data = hutTransferDetails;
    let result = data.trnTransferHutList;
    let _res = result.map((r, i) => {
      return {
        activeFlag: r.activeFlag,
        id: r.id,
        srNo: i + 1 + data.pageNo * data.pageSize,
        applicationNo: r.applicationNo,
        proposedOwner:
          r.proposedOwnerFirstName &&
          r.proposedOwnerMiddleName &&
          r.proposedOwnerLastName
            ? `${r.proposedOwnerFirstName} ${r.proposedOwnerMiddleName} ${r.proposedOwnerLastName}`
            : "",
        proposedOwnerMr:
          r.proposedOwnerFirstNameMr &&
          r.proposedOwnerMiddleNameMr &&
          r.proposedOwnerLastNameMr
            ? `${r.proposedOwnerFirstNameMr} ${r.proposedOwnerMiddleNameMr} ${r.proposedOwnerLastNameMr}`
            : "",
        currentOwner:
          r.currentOwnerFirstName &&
          r.currentOwnerFirstName &&
          r.currentOwnerFirstName
            ? `${r.currentOwnerFirstName} ${r.currentOwnerMiddleName} ${r.currentOwnerLastName}`
            : "",
        currentOwnerMr:
          r.currentOwnerFirstNameMr &&
          r.currentOwnerFirstNameMr &&
          r.currentOwnerFirstNameMr
            ? `${r.currentOwnerFirstNameMr} ${r.currentOwnerMiddleNameMr} ${r.currentOwnerLastNameMr}`
            : "",
        hutNo: r.hutNo,
        transferDate: moment(r?.transferDate)?.format("DD-MM-YYYY"),
        transferType:
          r?.transferTypeKey === 1
            ? language === "en"
              ? "Sale Deed"
              : "विक्री करार"
            : language === "en"
            ? "Transfer by heredity"
            : "आनुवंशिकतेनुसार हस्तांतरण",
        marketValue: r.marketValue,
        statusVal: r.status,
        saleValue: r.saleValue,
        status: manageStatus(r.status, language, statusAll),
      };
    });
    setData({
      rows: _res,
      totalRows: data.totalElements,
      rowsPerPageOptions: [10, 20, 50, 100],
      pageSize: data.pageSize,
      page: data.pageNo,
    });
  };

  const getAllStatus = () => {
    axios
      .get(`${urls.SLUMURL}/mstStatus/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setStatus(
          res.data.mstStatusDaoList.map((r, i) => ({
            id: r.id,
            statusTxt: r.statusTxt,
            statusTxtMr: r.statusTxtMr,
            status: r.status,
          }))
        );
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  const handleViewActions = (paramsRow) => {
    if (
      loggedInUser === "citizenUser" &&
      (paramsRow.statusVal === 1 || paramsRow.statusVal === 23)
    ) {
      router.push({
        pathname:
          "/SlumBillingManagementSystem/transactions/hutTransfer/addHutDetails",
        query: {
          id: paramsRow.id,
          isDraft: "f",
        },
      });
    } else {
      router.push({
        pathname:
          "/SlumBillingManagementSystem/transactions/hutTransfer/viewAddHutDetails",
        query: {
          id: paramsRow.id,
        },
      });
    }
  };

  const handleAddButton = () => {
    router.push(
      "/SlumBillingManagementSystem/transactions/hutTransfer/addHutDetails"
    );
  };

  const columns = [
    {
      headerClassName: "cellColor",
      field: "srNo",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
    },
    {
      headerClassName: "cellColor",
      field: "applicationNo",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="applicationNo" />,
      width: 300,
    },
    {
      headerClassName: "cellColor",
      field: language == "en" ? "proposedOwner" : "proposedOwnerMr",
      headerName: <FormattedLabel id="proposedOwner" />,
      width: 300,
      headerAlign: "center",
      align: "left",
    },
    {
      headerClassName: "cellColor",
      field: language == "en" ? "currentOwner" : "currentOwnerMr",
      headerName: <FormattedLabel id="currentOwner" />,
      width: 300,
      headerAlign: "center",
      align: "left",
    },
    {
      headerClassName: "cellColor",
      align: "center",
      field: "hutNo",
      headerAlign: "center",
      headerName: <FormattedLabel id="hutNo" />,
      width: 200,
    },
    // {
    //   headerClassName: "cellColor",
    //   align: "center",
    //   field: "transferDate",
    //   headerAlign: "center",
    //   headerName: <FormattedLabel id="transferDate" />,
    //   width: 200,
    // },
    {
      headerClassName: "cellColor",
      align: "left",
      field: "transferType",
      headerAlign: "center",
      headerName: <FormattedLabel id="transferType" />,
      width: 200,
    },
    // {
    //   headerClassName: "cellColor",
    //   align: "center",
    //   field: "marketValue",
    //   headerAlign: "center",
    //   headerName: <FormattedLabel id="marketValue" />,
    //   width: 200,
    // },
    // {
    //   headerClassName: "cellColor",
    //   align: "center",
    //   field: "saleValue",
    //   headerAlign: "center",
    //   headerName: <FormattedLabel id="saleValue" />,
    //   width: 200,
    // },
    {
      field: language === "en" ? "status" : "statusMr",
      width: 250, 
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="status" />,
      renderCell: (params) => {
        return (
          <Box>
            {params.row.statusVal === 17 ? (
              <p style={{ color: "#4BB543" }}>{params.row.status}</p>
            ) : params.row.statusVal === 20 ||
              params.row.statusVal === 1 ||
              params.row.statusVal === 3 ||
              params.row.statusVal === 6 ||
              params.row.statusVal === 8 ||
              params.row.statusVal === 10 ||
              params.row.statusVal === 22 ||
              params.row.statusVal === 23 ? (
              <p style={{ color: "red" }}>{params.row.status}</p>
            ) : (params.row.statusVal === 2 ||
                params.row.statusVal === 14 ||
                params.row.statusVal === 15 ||
                params.row.statusVal === 16 ||
                params.row.statusVal === 21 ||
                params.row.statusVal === 26) &&
              authority &&
              authority.find((val) => val === commonRoleId.ROLE_CLERK) ? (
              <p style={{ color: "blue" }}>{params.row.status}</p>
            ) : params.row.statusVal === 5 &&
              authority &&
              authority.find((val) => val === commonRoleId.ROLE_HEAD_CLERK) ? (
              <p style={{ color: "blue" }}>{params.row.status}</p>
            ) : params.row.statusVal === 7 &&
              authority &&
              authority.find(
                (val) => val === commonRoleId.ROLE_OFFICE_SUPERINTENDANT
              ) ? (
              <p style={{ color: "blue" }}>{params.row.status}</p>
            ) : params.row.statusVal === 9 &&
              authority &&
              authority.find(
                (val) => val === commonRoleId.ROLE_ADMIN_OFFICER
              ) ? (
              <p style={{ color: "blue" }}>{params.row.status}</p>
            ) : (params.row.statusVal == 11 || params.row.statusVal === 14) &&
              authority &&
              authority.find(
                (val) => val === commonRoleId.ROLE_ASSISTANT_COMMISHIONER
              ) ? (
              <p style={{ color: "blue" }}>{params.row.status}</p>
            ) : (params.row.statusVal === 13 || params.row.statusVal === 23) &&
              loggedInUser === "citizenUser" ? (
              <p style={{ color: "blue" }}>{params.row.status}</p>
            ) : (
              <p style={{ color: "orange" }}>{params.row.status}</p>
            )}
          </Box>
        );
      },
    },
    {
      headerClassName: "cellColor",
      align: "center",
      field: "action",
      headerAlign: "center",
      headerName: <FormattedLabel id="action" />,
      width: 200,
      renderCell: (params) => {
        return (
          <Grid container>
            <Tooltip title="View">
              <IconButton
                onClick={() => {
                  handleViewActions(params.row);
                }}
              >
                <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
              </IconButton>
            </Tooltip>

            {loggedInUser === "citizenUser" && params.row.statusVal != 0 && (
              <IconButton
                onClick={() => {
                  router.push({
                    pathname:
                      "/SlumBillingManagementSystem/transactions/acknowledgement/hutTransfer",
                    query: {
                      id: params.row.applicationNo,
                    },
                  });
                }}
              >
                <Tooltip
                  title={
                    language === "en"
                      ? "DOWNLOAD ACKNOWLEDGEMENT"
                      : "पोचपावती डाउनलोड करा"
                  }
                >
                  <DownloadIcon style={{ color: "blue" }} />
                </Tooltip>
              </IconButton>
            )}

            {loggedInUser == "citizenUser" && params.row.statusVal === 13 ? (
              <IconButton
                onClick={() => {
                  router.push({
                    pathname:
                      "/SlumBillingManagementSystem/transactions/acknowledgement/LoiReciptForHutTransfer",
                    query: {
                      id: params.row.applicationNo,
                    },
                  });
                }}
              >
                <Tooltip title={`VIEW LOI RECEIPT`}>
                  <PaymentIcon style={{ color: "orange" }} />
                </Tooltip>
              </IconButton>
            ) : (
              <></>
            )}

            {/* */}
            {(loggedInUser == "citizenUser" || loggedInUser === "cfcUser") &&
              params.row.statusVal != 1 &&
              params.row.statusVal != 2 &&
              params.row.statusVal != 13 &&
              params.row.statusVal != 28 &&
              params.row.statusVal != 0 && (
                <>
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname:
                          "/SlumBillingManagementSystem/transactions/receipt/serviceReceipt",
                        query: { id: params.row.id, trnType: "ht" },
                      });
                    }}
                  >
                    <Tooltip
                      title={
                        language == "en"
                          ? `Download LOI Payment Receipt`
                          : "LOI पेमेंट पावती डाउनलोड करा "
                      }
                    >
                      <ReceiptIcon style={{ color: "orange" }} />
                    </Tooltip>
                  </IconButton>
                </>
              )}
            {/* {params.row.statusVal === 15 &&
              loggedInUser === "departmentUser" &&
              authority &&
              authority.find((val) => val === commonRoleId.ROLE_CLERK) && (
                <Tooltip title="Reschedule Site Visit">
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname:
                          "/SlumBillingManagementSystem/transactions/hutTransfer/viewAddHutDetails",
                        query: {
                          id: params.row.id,
                        },
                      });
                    }}
                  >
                    <EventRepeatIcon style={{ color: "#556CD6" }} />
                  </IconButton>
                </Tooltip>
              )} */}

            {params?.row?.statusVal === 0 &&
              (loggedInUser == "citizenUser" || loggedInUser === "cfcUser") && (
                <>
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname:
                          "/SlumBillingManagementSystem/transactions/hutTransfer/addHutDetails",
                        query: { id: params.row.id },
                      });
                    }}
                  >
                    <DraftsIcon style={{ color: "#556CD6" }} />
                  </IconButton>
                </>
              )}
          </Grid>
        );
      },
    },
  ];

  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      {isLoading && <CommonLoader />}

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
                }}
              >
                <FormattedLabel id="hutTransfer" />
              </h3>
            </Grid>
          </Grid>
        </Box>

        {loggedInUser === "citizenUser" ? (
          <div className={styles.addbtn}>
            <Button
              size="small"
              variant="contained"
              endIcon={<Add />}
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
              printOptions: {
                copyStyles: true,
                hideToolbar: true,
                hideFooter: true,
              },
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
          pagination
          paginationMode="server"
          rowCount={data.totalRows}
          rowsPerPageOptions={data.rowsPerPageOptions}
          page={data.page}
          pageSize={data.pageSize}
          rows={data.rows}
          columns={columns}
          onPageChange={(_data) => {
            getAllHutTransferData(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            getAllHutTransferData(_data, data.page);
          }}
        />
      </Paper>
    </>
  );
};

export default Index;
