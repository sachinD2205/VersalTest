import { Button, Grid, IconButton, Box, Tooltip, Paper } from "@mui/material";
import moment from "moment";
import DownloadIcon from "@mui/icons-material/Download";
import DraftsIcon from "@mui/icons-material/Drafts";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../../URLS/urls";
import { useRouter } from "next/router";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { manageStatus } from "../../../../../components/rtiOnlineSystem/commonStatus/manageEnMr";
import Loader from "../../../../../containers/Layout/components/Loader";
import roleId from "../../../../../components/rtiOnlineSystem/commonRoleId";
import BreadcrumbComponent from "../../../../../components/common/BreadcrumbComponent";
import commonStyles from "../../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../../util/commonErrorUtil";

const Index = () => {
  const router1 = useRouter();
  const [dataSource, setDataSource] = useState([]);
  const router = useRouter();
  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState();
  const language = useSelector((state) => state?.labels?.language);
  const [departments, setDepartments] = useState([]);
  const logedInUser = localStorage.getItem("loggedInUser");
  let user = useSelector((state) => state.user.user);
  const [dataPageNo, setDataPage] = useState();
  const [allAppealDetails, setAppealAllDetails] = useState(null);
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );
  const [statusAll, setStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roleIds;
  const headers = { Authorization: `Bearer ${user?.token}` };
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
    getDepartments();
  }, []);

  useEffect(() => {
    if (
      logedInUser === "departmentUser" &&
      authority &&
      authority.find((val) => val === roleId.RTI_APPEALE_ROLE_ID)
    ) {
      getApplicationListByDept();
    } else {
      getApplicationDetails();
    }
  }, [departments]);

  const getAllStatus = () => {
    axios
      .get(`${urls.RTI}/mstStatus/getAll`, {
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
      }).catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // load department
  const getDepartments = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`, {
      headers: headers,
    }).then((r) => {
      setDepartments(
        r.data.department.map((row) => ({
          id: row.id,
          department: row.department,
        }))
      );
    }).catch((err) => {
      cfcErrorCatchMethod(err, true);
    });
  };

  // load appeal details for citizen or cfc
  const getApplicationDetails = (_pageSize = 10, _pageNo = 0) => {
    if (departments) {
      setIsLoading(true);
      axios
        .get(`${urls.RTI}/trnRtiAppeal/getAll`, {
          params: {
            pageSize: _pageSize,
            pageNo: _pageNo,
          },
          headers: headers,
        })
        .then((res, i) => {
          setIsLoading(false);
          setAppealAllDetails(res.data);
          setTotalElements(res.data.totalElements);
          setPageSize(res.data.pageSize);
          setPageNo(res.data.pageNo);
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  // load appeal details for dept user
  const getApplicationListByDept = (_pageSize = 10, _pageNo = 0) => {
    if (departments) {
      setIsLoading(true);
      axios
        .get(`${urls.RTI}/trnRtiAppeal/getAllByDept`, {
          params: {
            pageSize: _pageSize,
            pageNo: _pageNo,
          },
          headers: headers,
        })
        .then((res, i) => {
          setIsLoading(false);
          setAppealAllDetails(res.data);
          setTotalElements(res.data.totalElements);
          setPageSize(res.data.pageSize);
          setPageNo(res.data.pageNo);
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    }
  };
  useEffect(() => {
    if (allAppealDetails != null) {
      getDatatable();
    }
  }, [allAppealDetails, language]);

  // set data to table
  const getDatatable = () => {
    let res1 = allAppealDetails;
    let result = res1?.trnRtiAppealList;
    const _res = result?.map((res, i) => {
      return {
        srNo: i + 1 + res1.pageNo * res1.pageSize,
        id: res.id,
        appealNo: res.appealNo,
        appealReason: res.appealReason,
        departmentName: departments?.find((obj) => {
          return obj.id == res.departmentKey;
        })
          ? departments.find((obj) => {
              return obj.id == res.departmentKey;
            }).department
          : "-",
        createdDate: res.createdDate,
        informationDescription: res.informationDescription,
        subject: res.subject,
        applicationNo: res.applicationNo,
        applicationDate:
          res.applicationDate == null
            ? "-"
            : moment(res.applicationDate).format("DD-MM-YYYY"),
        activeFlag: res.activeFlag,
        statusVal: res.status,
        applicantName:
          res.applicantFirstName +
          " " +
          res.applicantMiddleName +
          " " +
          res.applicantLastName,
        applicantNameMr:
          res.applicantFirstNameMr +
          " " +
          res.applicantMiddleNameMr +
          " " +
          res.applicantLastNameMr,
        status: manageStatus(res.status, language, statusAll),
      };
    });
    setDataSource([..._res]);
  };

  const columns = [
    {
      field: "srNo",
      headerName: (
        <Tooltip title={<FormattedLabel id="srNo" />}>
          <span>
            <FormattedLabel id="srNo" />
          </span>
        </Tooltip>
      ),
      headerAlign: "center",
    },
    {
      field: "applicationNo",
      headerName: (
        <Tooltip title={<FormattedLabel id="appealApplicationNo" />}>
          <span>
            <FormattedLabel id="appealApplicationNo" />
          </span>
        </Tooltip>
      ),
      flex: 1,
      minWidth: 280,
      headerAlign: "center",
      align:'left'
    },
    {
      field: language == "en" ? "applicantName" : "applicantNameMr",
      headerName: (
        <Tooltip title={<FormattedLabel id="applicantName" />}>
          <span>
            <FormattedLabel id="applicantName" />
          </span>
        </Tooltip>
      ),
      flex: 1,
      minWidth: 200,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "applicationDate",
      headerName: (
        <Tooltip title={<FormattedLabel id="appealFileDate" />}>
          <span>
            <FormattedLabel id="appealFileDate" />
          </span>
        </Tooltip>
      ),
      flex: 1,
      minWidth: 200,
      align:'left',
      headerAlign: "center",
    },
    {
      field: "appealReason",
      headerName: (
        <Tooltip title={<FormattedLabel id="reasonForAppeal" />}>
          <span>
            <FormattedLabel id="reasonForAppeal" />
          </span>
        </Tooltip>
      ),
      flex: 1,
      minWidth: 400,
      headerAlign: "center",
      align:'left'
    },
    {
      field: "status",
      headerName: (
        <Tooltip title={<FormattedLabel id="status" />}>
          <span>
            <FormattedLabel id="status" />
          </span>
        </Tooltip>
      ),
      flex: 1,
      minWidth: 200,
      headerAlign: "center",
      align:'left',
      renderCell: (params) => {
        return (
          <>
            {params?.row?.statusVal === 3 ? (
              <div style={{ color: "blue" }}>{params?.row?.status}</div>
            ) : params?.row?.statusVal === 6 ? (
              <div style={{ color: "blue" }}>{params?.row?.status}</div>
            ) : params?.row?.statusVal === 8 ||
              params?.row?.statusVal === 7 ||
              params?.row?.statusVal === 14 ||
              params?.row?.statusVal === 2 ? (
              <div style={{ color: "orange" }}>{params?.row?.status}</div>
            ) : params?.row?.statusVal === 11 ? (
              <div style={{ color: "green" }}>{params?.row?.status}</div>
            ) : (
              <div style={{ color: "black" }}>{params?.row?.status}</div>
            )}
          </>
        );
      },
    },
    {
      field: "actions",
      width: 200,
      headerName: (
        <Tooltip title={<FormattedLabel id="actions" />}>
          <span>
            <FormattedLabel id="actions" />
          </span>
        </Tooltip>
      ),
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={() => {
                router1.push({
                  pathname:
                    "/RTIOnlineSystem/transactions/rtiAppeal/ViewRTIAppeal",
                  query: { id: params.row.applicationNo },
                });
              }}
            >
              <VisibilityIcon style={{ color: "#556CD6" }} />
            </IconButton>
            {params?.row?.statusVal === 0 && (
              <>
                <IconButton
                  onClick={() => {
                    router1.push({
                      pathname: "/RTIOnlineSystem/transactions/rtiAppeal",
                      query: { id: params.row.id },
                    });
                  }}
                >
                  <DraftsIcon style={{ color: "#556CD6" }} />
                </IconButton>
              </>
            )}
            {params?.row?.statusVal != 0 &&
              params?.row?.statusVal != 1 &&
              params?.row?.statusVal != 2 &&
              (logedInUser == "citizenUser" ||
                logedInUser === "cfcUser" ||
                (logedInUser === "departmentUser" &&
                  authority &&
                  authority?.find(
                    (val) => val != roleId.RTI_APPEALE_ROLE_ID
                  ))) && (
                <>
                  {" "}
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname:
                          "/RTIOnlineSystem/transactions/acknowledgement/rtiAppeal",
                        query: { id: params.row.applicationNo },
                      });
                    }}
                  >
                    <Tooltip
                      title={
                        language == "en"
                          ? `Downoload Acknowldgement`
                          : "पोचपावती डाउनलोड करा"
                      }
                    >
                      <DownloadIcon style={{ color: "blue" }} />
                    </Tooltip>
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname:
                          "/RTIOnlineSystem/transactions/receipt/serviceReceipt",
                        query: { id: params.row.id, trnType: "apl" },
                      });
                    }}
                  >
                    <Tooltip
                      title={
                        language == "en"
                          ? `Download Payment Receipt`
                          : "पेमेंट पावती डाउनलोड करा"
                      }
                    >
                      <ReceiptIcon style={{ color: "blue" }} />
                    </Tooltip>
                  </IconButton>
                </>
              )}

            {/* send for payment */}
            {(logedInUser == "citizenUser" ||
              logedInUser === "cfcUser" ||
              (logedInUser === "departmentUser" &&
                authority &&
                authority?.find(
                  (val) => val !== roleId.RTI_APPEALE_ROLE_ID
                ))) &&
              params.row.statusVal === 2 && (
                <IconButton
                  onClick={() => {
                    router.push({
                      pathname:
                        "/RTIOnlineSystem/transactions/payment/PaymentCollection",
                      query: { id: params.row.applicationNo, trnType: "apl" },
                    });
                  }}
                >
                  <Tooltip
                    title={language == "en" ? `Make Payment` : "पेमेंट करा"}
                  >
                    <PaymentIcon style={{ color: "red" }} />
                  </Tooltip>
                </IconButton>
              )}
          </>
        );
      },
    },
  ];

  let checkAuth = () => {
    return authority?.includes(roleId.RTI_APPEALE_ROLE_ID) ? false : true;
  };


  return (
    <>
      {isLoading && <CommonLoader />}
      <BreadcrumbComponent />
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
          <Grid container className={commonStyles.title}>
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
                <FormattedLabel id="rtiAppealList" />
              </h3>
            </Grid>
          </Grid>
        </Box>
        <Grid container style={{ padding: "10px" }}>
          {(logedInUser === "citizenUser" ||
            logedInUser === "cfcUser" ||
            (logedInUser === "departmentUser" && checkAuth())) && (
            <Grid
              item
              xs={12}
              style={{ display: "flex", justifyContent: "end" }}
            >
              <Button
                variant="contained"
                endIcon={<AddIcon />}
                type="primary"
                size="small"
                onClick={() => {
                  router.push("/RTIOnlineSystem/transactions/rtiAppeal");
                }}
              >
                <FormattedLabel id="newText" />{" "}
              </Button>
            </Grid>
          )}
        </Grid>
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
          rowCount={totalElements}
          pageSize={pageSize}
          rows={dataSource}
          page={pageNo}
          columns={columns}
          rowsPerPageOptions={[10, 20, 50, 100]}
          onPageChange={(_data) => {
            setDataPage(_data);
            if (
              logedInUser === "departmentUser" &&
              authority &&
              authority.find((val) => val === roleId.RTI_APPEALE_ROLE_ID)
            ) {
              getApplicationListByDept(pageSize, _data);
            } else {
              getApplicationDetails(pageSize, _data);
            }
          }}
          onPageSizeChange={(_data) => {
            setDataPage(_data);
            if (
              logedInUser === "departmentUser" &&
              authority &&
              authority.find((val) => val === roleId.RTI_APPEALE_ROLE_ID)
            ) {
              getApplicationListByDept(_data, pageNo);
            } else {
              getApplicationDetails(_data, pageNo);
            }
          }}
        />
      </Paper>
    </>
  );
};

export default Index;
