import React, { useEffect, useState } from "react";
import router from "next/router";
import styles from "../../sbms.module.css";
import { Paper, Button, IconButton, Box, Tooltip, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Add } from "@mui/icons-material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import DownloadIcon from "@mui/icons-material/Download";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import PaymentIcon from "@mui/icons-material/Payment";
import DraftsIcon from "@mui/icons-material/Drafts";
import { manageStatus } from "../../../../../components/rtiOnlineSystem/commonStatus/manageEnMr";
import Loader from "../../../../../containers/Layout/components/Loader";
import commonRoleId from "../../../../../components/SlumBillingManagementSystem/FileUpload/RoleId/commonRole";
import ReceiptIcon from "@mui/icons-material/Receipt";
import BreadcrumbComponent from "../../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";
import commonStyles from "../../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../../util/commonErrorUtil";
const Index = () => {
  const [statusAll, setStatus] = useState([]);
  const [nocDetails, setNOCDetails] = useState(null);
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const language = useSelector((state) => state.labels.language);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user.user);
  let loggedInUser = localStorage.getItem("loggedInUser");
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );
  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roleIds;
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
    getAllIssuanceOfNocData();
    getAllStatus();
  }, []);

  const headers = { Authorization: `Bearer ${user?.token}` };

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

  // get all Noc data

  const getAllIssuanceOfNocData = (_pageSize = 10, _pageNo = 0) => {
    setIsLoading(true);
    axios
      .get(`${urls.SLUMURL}/trnIssueNoc/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: headers,
      })
      .then((r) => {
        setIsLoading(false);
        setNOCDetails(r.data);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };


  useEffect(() => {
    if (nocDetails != null) {
      setDataToTable();
    }
  }, [nocDetails, language, statusAll]);

  const setDataToTable = () => {
    let data = nocDetails;
    let result = data.trnIssueNocList;
    let _res = result.map((r, i) => {
      return {
        activeFlag: r.activeFlag,
        id: r.id,
        srNo: i + 1 + data.pageNo * data.pageSize,
        applicationNo: r.applicationNo,
        mobileNo: r.applicantMobileNo,
        fullName: `${r.applicantFirstName} ${r.applicantMiddleName} ${r.applicantLastName}`,
        fullNameMr: `${r.applicantFirstNameMr} ${r.applicantMiddleNameMr} ${r.applicantLastNameMr}`,
        emailId: r.applicantEmailId,
        aadharNo: r.applicantAadharNo,
        statusVal: r.status,
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

  const handleViewActions = (paramsRow) => {
    if (
      loggedInUser === "citizenUser" &&
      (paramsRow.statusVal === 1 || paramsRow.statusVal === 23)
    ) {
      router.push({
        pathname:
          "/SlumBillingManagementSystem/transactions/issuanceOfNoc/editAddApplicantNoc",
        query: {
          id: paramsRow.id,
        },
      });
    } else if (paramsRow.statusVal === 16) {
      router.push({
        pathname:
          "/SlumBillingManagementSystem/transactions/issuanceOfNoc/viewAddApplicantDetails",
        query: {
          id: paramsRow.id,
        },
      });
    } else if (paramsRow.statusVal === 17) {
      router.push({
        pathname:
          // "/SlumBillingManagementSystem/transactions/issuanceOfNoc/downloadNoc",
          "/SlumBillingManagementSystem/transactions/issuanceOfNoc/viewAddApplicantDetails",
        query: {
          id: paramsRow.id,
        },
      });
    } else if (
      paramsRow.statusVal === 11 ||
      paramsRow.statusVal === 21 ||
      paramsRow.statusVal === 3 ||
      paramsRow.statusVal === 13 ||
      paramsRow.statusVal === 10 ||
      paramsRow.statusVal === 8 ||
      paramsRow.statusVal === 6 ||
      paramsRow.statusVal === 26
    ) {
      router.push({
        pathname:
          "/SlumBillingManagementSystem/transactions/issuanceOfNoc/viewAddApplicantDetails",
        query: {
          id: paramsRow.id,
        },
      });
    } else if (
      paramsRow.statusVal === 14 ||
      paramsRow.statusVal === 5 ||
      paramsRow.statusVal === 9 ||
      paramsRow.statusVal === 7 ||
      paramsRow.statusVal === 14 ||
      paramsRow.statusVal === 29
    ) {
      router.push({
        pathname:
          "/SlumBillingManagementSystem/transactions/issuanceOfNoc/viewAddApplicantDetails",
        query: {
          id: paramsRow.id,
        },
      });
    } else {
      router.push({
        pathname:
          "/SlumBillingManagementSystem/transactions/issuanceOfNoc/viewAddApplicantDetails",
        query: {
          id: paramsRow.id,
        },
      });
    }
  };

  const handleAddButton = () => {
    router.push(
      "/SlumBillingManagementSystem/transactions/issuanceOfNoc/addApplicantDetails"
    );
  };

  const columns = [
    {
      field: "srNo",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
      minWidth: 80,
    },
    {
      field: "applicationNo",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="applicationNo" />,
      flex: 1,
      minWidth: 300,
    },
    {
      align: "left",
      field: language == "en" ? "fullName" : "fullNameMr",
      headerAlign: "center",
      headerName: <FormattedLabel id="fullName" />,
      flex: 1,
      minWidth: 200,
    },
    {
      align: "center",
      field: "mobileNo",
      headerAlign: "center",
      headerName: <FormattedLabel id="mobileNo" />,
      width: 150,
    },
    {
      field: "aadharNo",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="aadharNo" />,
      flex: 1,
      minWidth: 150,
    },
    {
      field: language === "en" ? "status" : "statusMr",
      flex: 1,
      minWidth: 250,
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
                params.row.statusVal === 26 ||
                params.row.statusVal === 27 ||
                params.row.statusVal === 29) &&
              authority &&
              authority.find((val) => val === commonRoleId.ROLE_CLERK) ? (
              <p style={{ color: "blue" }}>{params.row.status}</p>
            ) : params.row.statusVal === 5 &&
              authority &&
              authority.find((val) => val === commonRoleId.ROLE_HEAD_CLERK) ? (
              <p style={{ color: "blue" }}>{params.row.status}</p>
            ) : // ) : params.row.statusVal === 7 &&
            //   authority &&
            //   authority.find((val) => val === commonRoleId.ROLE_OFFICE_SUPERINTENDANT) ? (
            //   <p style={{ color: "blue" }}>{params.row.status}</p>
            params.row.statusVal === 9 &&
              authority &&
              authority.find(
                (val) => val === commonRoleId.ROLE_ADMINISTRATIVE_OFFICER
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
    //Actions
    {
      align: "center",
      field: "action",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="action" />,
      flex: 1,
      minWidth: 150,
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
                      "/SlumBillingManagementSystem/transactions/acknowledgement/issuanceOfNoc",
                    query: { id: params.row.applicationNo },
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
              <>
                <IconButton
                  onClick={() => {
                    router.push({
                      pathname:
                        "/SlumBillingManagementSystem/transactions/acknowledgement/LoiReciptForNoc",
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
              </>
            ) : (
              <></>
            )}

            {/* Download LOI Payment Receipt */}

            {/* {(params.row.statusVal != 1 && params.row.statusVal != 2 && params.row.statusVal != 13 && params.row.statusVal != 28 && params.row.statusVal != 0) &&
              <>
                <IconButton
                  onClick={() => {
                    router.push({
                      pathname:
                        "/SlumBillingManagementSystem/transactions/receipt/serviceReceipt",
                      query: { id: params.row.id, trnType: 'ht' },
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
            } */}

            {params?.row?.statusVal === 0 &&
              (loggedInUser == "citizenUser" || loggedInUser === "cfcUser") && (
                <>
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname:
                          "/SlumBillingManagementSystem/transactions/issuanceOfNoc/addApplicantDetails",
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
                <FormattedLabel id="issuanceOfNoc" />
              </h3>
            </Grid>
          </Grid>
        </Box>

        {loggedInUser === "citizenUser" ? (
          <div className={styles.addbtn}>
            <Button
              variant="contained"
              size="small"
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
          loading={data.loading}
          rowCount={data.totalRows}
          rowsPerPageOptions={data.rowsPerPageOptions}
          page={data.page}
          pageSize={data.pageSize}
          rows={data.rows}
          columns={columns}
          onPageChange={(_data) => {
            getAllIssuanceOfNocData(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            getAllIssuanceOfNocData(_data, data.page);
          }}
        />
      </Paper>
    </>
  );
};

export default Index;
