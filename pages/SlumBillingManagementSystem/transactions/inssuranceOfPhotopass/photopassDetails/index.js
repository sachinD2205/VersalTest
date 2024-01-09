import React, { useEffect, useState } from "react";
import router from "next/router";
import styles from "../../sbms.module.css";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DownloadIcon from "@mui/icons-material/Download";

import {
  Paper,
  Button,
  IconButton,
  Box,
  Tooltip,
  Grid,
} from "@mui/material";
import sweetAlert from "sweetalert";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Add} from "@mui/icons-material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import DraftsIcon from "@mui/icons-material/Drafts";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import PaymentIcon from "@mui/icons-material/Payment";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "../../../../../containers/schema/slumManagementSchema/photopassDetailsSchema";
import { manageStatus } from "../../../../../components/ElectricBillingComponent/commonStatus/manageEnMr";
import commonRoleId from "../../../../../components/SlumBillingManagementSystem/FileUpload/RoleId/commonRole";
import BreadcrumbComponent from "../../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";
import commonStyles from "../../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../../util/commonErrorUtil";
const Index = () => {
  const {
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const [dataSource, setDataSource] = useState([]);
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const [loading, setLoading] = useState(false);
  const [dataOnUI, setDataOnUi] = useState([]);
  const language = useSelector((state) => state.labels.language);
  const [pageSize, setPageSize] = useState(null);
  const [pageNo, setPageNo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusAll, setStatus] = useState([]);

  //get logged in user
  const user = useSelector((state) => state.user.user);
  let loggedInUser = localStorage.getItem("loggedInUser");
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );
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
    getAllPhotopassData();
    getAllStatus();
  }, []);


  // get all photopass data
  const getAllPhotopassData = (_pageSize = 10, _pageNo = 0) => {
    setIsLoading(true);
    setPageSize(_pageSize);
    setPageNo(_pageNo);

    axios
      .get(`${urls.SLUMURL}/trnIssuePhotopass/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: headers,
      })
      .then((r) => {
        setIsLoading(false);
        setDataOnUi(r.data);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };


  useEffect(() => {
    if (dataOnUI != []) {
      fetchOnUi();
    }
  }, [dataOnUI, language, statusAll]);

  const fetchOnUi = () => {
    let dummyData = dataOnUI;
    let result = dummyData?.trnIssuePhotopassList;
    let _res = result?.map((r, i) => {
      return {
        activeFlag: r.activeFlag,
        id: r.id,
        srNo: i + 1 + pageNo * pageSize,
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

    if (_res != undefined) {
      setDataSource([..._res]);
      setData({
        rows: _res,
        totalRows: dummyData.totalElements,
        rowsPerPageOptions: [10, 20, 50, 100],
        pageSize: dummyData.pageSize,
        page: dummyData.pageNo,
      });
    }
  };

  const getAllStatus = () => {
    axios
      .get(`${urls.SLUMURL}/mstStatus/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setLoading(false);
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
          "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/editApplicantDetails",
        query: {
          id: paramsRow.id,
        },
      });
    } else if (paramsRow.statusVal === 11) {
      router.push({
        pathname:
          "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/viewAddApplicantDetails",
        query: {
          id: paramsRow.id,
        },
      });
    } else if (paramsRow.statusVal === 15 || paramsRow.statusVal === 28) {
      if (
        authority &&
        authority.find((val) => val === commonRoleId.ROLE_CLERK)
      ) {
        router.push({
          pathname:
            "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/viewAddApplicantDetails",
          query: {
            id: paramsRow.id,
          },
        });
      } else {
        router.push({
          pathname:
            "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/viewAddApplicantDetails",
          query: {
            id: paramsRow.id,
          },
        });
      }
    } else if (
      paramsRow.statusVal === 16 ||
      paramsRow.statusVal === 4 ||
      paramsRow.statusVal === 5 ||
      paramsRow.statusVal === 9 ||
      paramsRow.statusVal === 7 ||
      paramsRow.statusVal === 14 ||
      paramsRow.statusVal === 13 ||
      paramsRow.statusVal === 10 ||
      paramsRow.statusVal === 9 ||
      paramsRow.statusVal === 6 ||
      paramsRow.statusVal === 3 ||
      paramsRow.statusVal === 25 ||
      paramsRow.statusVal === 26
    ) {
      router.push({
        pathname:
          "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/viewAddApplicantDetails",
        query: {
          id: paramsRow.id,
        },
      });
    } else if (
      loggedInUser == "citizenUser" &&
      (paramsRow.statusVal === 20 || paramsRow.statusVal === 24)
    ) {
      router.push({
        pathname:
          "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/editApplicantDetails",
        query: {
          id: paramsRow.id,
        },
      });
    } else {
      router.push({
        pathname:
          "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/viewAddApplicantDetails",
        query: {
          id: paramsRow.id,
        },
      });
    }
  };

  const handleAddButton = () => {
    router.push(
      "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/addApplicantDetails"
    );
  };

  const columns = [
    {
      headerClassName: "cellColor",
      field: "srNo",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
      minWidth: 100,
    },
    {
      headerClassName: "cellColor",
      field: "applicationNo",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="applicationNo" />,
      flex: 1,
      minWidth: 300,
    },
    {
      headerClassName: "cellColor",
      align: "left",
      field: language == "en" ? "fullName" : "fullNameMr",
      headerAlign: "center",
      headerName: <FormattedLabel id="fullName" />,
      flex: 1,
      minWidth: 300,
    },
    {
      headerClassName: "cellColor",
      align: "center",
      field: "mobileNo",
      headerAlign: "center",
      headerName: <FormattedLabel id="mobileNo" />,
      flex: 1,
      minWidth: 250,
    },
    {
      headerClassName: "cellColor",
      field: "aadharNo",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="aadharNo" />,
      flex: 1,
      minWidth: 250,
    },
    {
      flex: 1,
      minWidth: 300,
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="status" />,
      renderCell: (params) => {
        return (
          <Box>
            {params.row.statusVal === 17 ? (
              <p style={{ color: "#4BB543" }}>{params.row.status}</p>
            ) : params.row.statusVal === 20 ||
              params.row.statusVal === 24 ||
              params.row.statusVal === 1 ||
              params.row.statusVal === 3 ||
              params.row.statusVal === 6 ||
              params.row.statusVal === 7 ||
              params.row.statusVal === 8 ||
              params.row.statusVal === 10 ? (
              <p style={{ color: "red" }}>{params.row.status}</p>
            ) : (params.row.statusVal === 2 ||
                params.row.statusVal === 4 ||
                params.row.statusVal === 15 ||
                params.row.statusVal === 16 ||
                params.row.statusVal === 25 ||
                params.row.statusVal === 26 ||
                params.row.statusVal === 14) &&
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
            ) : params.row.statusVal === 11 &&
              authority &&
              authority.find(
                (val) => val === commonRoleId.ROLE_ASSISTANT_COMMISHIONER
              ) ? (
              <p style={{ color: "blue" }}>{params.row.status}</p>
            ) : params.row.statusVal === 13 &&
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
      headerClassName: "cellColor",
      align: "center",
      field: "action",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="action" />,
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        return (
          <Grid container>
            <Grid item>
              <Tooltip title="View">
                <IconButton
                  onClick={() => {
                    handleViewActions(params.row);
                  }}
                >
                  <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
                </IconButton>
              </Tooltip>
            </Grid>
            {loggedInUser === "citizenUser" && params.row.statusVal != 0 && (
              <Grid item>
                <IconButton
                  onClick={() => {
                    router.push({
                      pathname:
                        "/SlumBillingManagementSystem/transactions/acknowledgement/issuanceOfPhotopass",
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
              </Grid>
            )}

            {loggedInUser == "citizenUser" && params.row.statusVal === 13 ? (
              <Grid item>
                <IconButton
                  onClick={() => {
                    router.push({
                      pathname:
                        "/SlumBillingManagementSystem/transactions/acknowledgement/LoiReciptForPhotopass",
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
              </Grid>
            ) : (
              <></>
            )}

            {(params.row.statusVal == 14 || params.row.statusVal == 17) && (
              <>
                <IconButton
                  onClick={() => {
                    router.push({
                      pathname:
                        "/SlumBillingManagementSystem/transactions/acknowledgement/LoiReciptForPhotopass",
                      query: { id: params.row.id, trnType: "pp" },
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

           

            {params?.row?.statusVal === 0 &&
              (loggedInUser == "citizenUser" || loggedInUser === "cfcUser") && (
                <>
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname:
                          "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/addApplicantDetails",
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
        {loading ? (
          <CommonLoader />
        ) : (
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
                    }}
                  >
                    <FormattedLabel id="insuranceOfPhotopass" />
                  </h3>
                </Grid>
              </Grid>
            </Box>

            {loggedInUser === "citizenUser" ? (
              <div className={styles.addbtn}>
                <Button
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
                getAllPhotopassData(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                getAllPhotopassData(_data, data.page);
              }}
            />
          </>
        )}
      </Paper>
    </>
  );
};

export default Index;
