import { Box, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import moment from "moment";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { manageStatus } from "../../../../components/rtiOnlineSystem/commonStatus/manageEnMr";
import Loader from "../../../../containers/Layout/components/Loader";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";

const BachatGatCategory = () => {
  const router = useRouter();
  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [crAreaNames, setCRAreaName] = useState([]);
  const [registrationDetails, setRegistrationDetails] = useState(null);
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const language = useSelector((state) => state.labels.language);
  const [statusAll, setStatus] = useState(null);
  const user = useSelector((state) => state.user.user);
  const loggedUser = localStorage.getItem("loggedInUser");
  const [isLoading, setIsLoading] = useState(false);

  // const headers =
  //   loggedUser === "citizenUser"
  //     ? { Userid: user?.id, Authorization: `Bearer ${user?.token}` }
  //     : { Authorization: `Bearer ${user?.token}` };

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
    getZoneName();
    getWardNames();
    getCRAreaName();
  }, []);

  useEffect(() => {
    getBachatgatCategoryTrn();
  }, [zoneNames && wardNames && crAreaNames]);

  const getAllStatus = () => {
    if (loggedUser === "citizenUser") {
      axios
        .get(`${urls.BSUPURL}/mstStatus/getAll`, {
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
    } else {
      axios
        .get(`${urls.BSUPURL}/mstStatus/getAll`, {
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
    }
  };

  // load zone
  const getZoneName = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, { headers: headers })
      .then((r) => {
        setZoneNames(
          r.data.zone.map((row) => ({
            id: row.id,
            zoneName: row.zoneName,
            zoneNameMr: row.zoneNameMr,
          }))
        );
      }).catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // load ward
  const getWardNames = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, { headers: headers })
      .then((r) => {
        setWardNames(
          r.data.ward.map((row) => ({
            id: row.id,
            wardName: row.wardName,
            wardNameMr: row.wardNameMr,
          }))
        );
      }).catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // getAreaName
  const getCRAreaName = () => {
    axios
      .get(`${urls.CfcURLMaster}/area/getAll`, { headers: headers })
      .then((r) => {
        setCRAreaName(
          r.data.area.map((row) => ({
            id: row.id,
            crAreaName: row.areaName,
            crAreaNameMr: row.areaNameMr,
          }))
        );
      }).catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // load registration details
  const getBachatgatCategoryTrn = (_pageSize = 10, _pageNo = 0) => {
    setIsLoading(true);
    {
      loggedUser === "citizenUser"
        ? axios
            .get(
              `${urls.BSUPURL}/trnBachatgatCancellation/getBachatGatDeuForForcedCancellation`,
              {
                headers: headers,
                params: {
                  pageSize: _pageSize,
                  pageNo: _pageNo,
                },
              }
            )
            .then((r) => {
              setIsLoading(false);
              setRegistrationDetails(r.data);
            })
            .catch((err) => {
              setIsLoading(false);
              cfcErrorCatchMethod(err, false);
            })
        : axios
            .get(
              `${urls.BSUPURL}/trnBachatgatCancellation/getBachatGatDeuForForcedCancellation`,
              {
           
                  headers: headers,
              
                params: {
                  pageSize: _pageSize,
                  pageNo: _pageNo,
                },
              }
            )
            .then((r) => {
              setIsLoading(false);
              setRegistrationDetails(r.data);
            })
            .catch((err) => {
              setIsLoading(false);
              cfcErrorCatchMethod(err, false);
            });
    }
  };

  const catchMethod = (err) => {
    if (err.message === "Network Error") {
      sweetAlert(
        language == "en" ? "Network Error" : "नेटवर्क त्रुटी !",
        language == "en"
          ? "Server is unreachable or may be a network issue, please try after sometime"
          : "सर्व्हर पोहोचण्यायोग्य नाही किंवा नेटवर्क समस्या असू शकते, कृपया काही वेळानंतर प्रयत्न करा",
        "error",
        {
          button: language == "en" ? "Ok" : "ठीक आहे",
          allowOutsideClick: false, // Prevent closing on outside click
          allowEscapeKey: false, // Prevent closing on Esc key
          closeOnClickOutside: false,
        }
      );
    } else if (err.message === "Request failed with status code 404") {
      sweetAlert(
        language == "en" ? "Bad Request" : "वाईट विनंती !",
        language == "en" ? "Unauthorized access !" : "अनधिकृत पोहोच !!",
        "error",
        {
          button: language == "en" ? "Ok" : "ठीक आहे",
          allowOutsideClick: false, // Prevent closing on outside click
          allowEscapeKey: false, // Prevent closing on Esc key
          closeOnClickOutside: false,
        }
      );
    } else {
      sweetAlert(
        language == "en" ? "Error" : "त्रुटी !",
        language == "en" ? "Something went to wrong !" : "काहीतरी चूक झाली!",
        "error",
        {
          button: language == "en" ? "Ok" : "ठीक आहे",
          allowOutsideClick: false, // Prevent closing on outside click
          allowEscapeKey: false, // Prevent closing on Esc key
          closeOnClickOutside: false,
        }
      );
    }
  };

  useEffect(() => {
    if (registrationDetails != null) {
      setToDataTable();
    }
  }, [registrationDetails, language]);

  //  set to table
  const setToDataTable = () => {
    let data = registrationDetails;
    let result = data.trnBachatgatRegistrationList;
    if (result.length != 0 && result != null) {
      if (wardNames && zoneNames && crAreaNames) {
        let _res = result?.map((r, i) => {
          return {
            activeFlag: r.activeFlag,
            id: i + 1,
            srNo: i + 1 + data.pageNo * data.pageSize,
            zoneKey: zoneNames?.find((obj) => obj.id == r.zoneKey)?.zoneName
              ? zoneNames?.find((obj) => obj.id == r.zoneKey)?.zoneName
              : "-",
            zoneKeyMr: zoneNames?.find((obj) => obj.id == r.zoneKey)?.zoneNameMr
              ? zoneNames?.find((obj) => obj.id == r.zoneKey)?.zoneNameMr
              : "-",
            wardKey: wardNames?.find((obj) => obj.id == r.wardKey)?.wardName
              ? wardNames?.find((obj) => obj.id == r.wardKey)?.wardName
              : "-",
            wardKeyMr: wardNames?.find((obj) => obj.id == r.wardKey)?.wardNameMr
              ? wardNames?.find((obj) => obj.id == r.wardKey)?.wardNameMr
              : "-",
            areaKey: crAreaNames?.find((obj) => {
              return obj.id == r.areaKey;
            })?.crAreaName
              ? crAreaNames?.find((obj) => obj.id == r.areaKey)?.crAreaName
              : "-",
            areaKeyMr: crAreaNames?.find((obj) => {
              return obj.id == r.areaKey;
            })?.crAreaNameMr
              ? crAreaNames?.find((obj) => obj.id == r.areaKey)?.crAreaNameMr
              : "-",
            cfcApplicationNo: r.cfcApplicationNo,
            applicationNo: r.applicationNo,
            bachatgatName: r.bachatgatName,
            statusVal: r.status,
            totalMembersCount: r.totalMembersCount,
            fullName: r.presidentFirstName + " " + r.presidentLastName,
            createdDate: moment(r?.createDtTm).format("DD/MM/YYYY"),
            startDate: moment(r?.startDate).format("DD/MM/YYYY"),
            currStatus: manageStatus(r.status, language, statusAll),
          };
        });
        setData({
          rows: _res,
          totalRows: data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: data.pageSize,
          page: data.pageNo,
        });
      }
    }
  };

  // columns
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "bachatgatName",
      headerName: <FormattedLabel id="bachatgatName" />,
      width: 250,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "fullName",
      headerName: <FormattedLabel id="presidentName" />,
      width: 250,
      align: "left",
      headerAlign: "center",
    },
    {
      field: language === "en" ? "areaKey" : "areaKeyMr",
      headerName: <FormattedLabel id="areaNm" />,
      width: 250,
      align: "left",
      headerAlign: "center",
    },
    {
      field: language === "en" ? "zoneKey" : "zoneKeyMr",
      headerName: <FormattedLabel id="zoneNames" />,
      width: 200,
      align: "left",
      headerAlign: "center",
    },
    {
      field: language === "en" ? "wardKey" : "wardKeyMr",
      headerName: <FormattedLabel id="wardname" />,
      width: 200,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "applicationNo",
      headerName: <FormattedLabel id="applicationNo" />,
      width: 350,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "totalMembersCount",
      headerName: <FormattedLabel id="totalMembersCount" />,
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "createdDate",
      headerName: <FormattedLabel id="cancelDate" />,
      width: 200,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "currStatus",
      headerName: <FormattedLabel id="currentStatus" />,
      width: 400,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              onClick={() => {
                router.push({
                  pathname:
                    "/BsupNagarvasthi/transaction/bachatGatCancellation/form",
                  query: {
                    id: params.row.applicationNo,
                    isForceful: "true",
                  },
                });
              }}
            >
              <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  // UI
  return (
    <div>
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
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            <FormattedLabel id="bachatgatForceFulCancellation" />
          </h2>
        </Box>
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
            "& .MuiDataGrid-toolbarContainer .MuiButton-root[aria-label='Export']":
              {
                display: "none",
              },
          }}
          density="compact"
          disableColumnFilter
          disableDensitySelector
          disableColumnSelector
          rowHeight={50}
          pagination
          paginationMode="server"
          rowCount={data.totalRows}
          rowsPerPageOptions={data.rowsPerPageOptions}
          page={data.page}
          pageSize={data.pageSize}
          rows={data.rows}
          columns={columns}
          onPageChange={(_data) => {
            getBachatgatCategoryTrn(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            getBachatgatCategoryTrn(_data, data.page);
          }}
        />
      </Paper>
    </div>
  );
};

export default BachatGatCategory;
