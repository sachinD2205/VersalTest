import React, { useState, useEffect } from "react";
import moment from "moment";
import { Box, Grid, Tooltip, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import { DataGrid } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useForm } from "react-hook-form";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../../util/commonErrorUtil";

const DashboardHome = () => {
  const router = useRouter();
  // ............................................API CALSS................................
  const language = useSelector((state) => state.labels.language);
  const [isLoading, setIsLoading] = useState(false);
  const [transData, setTransData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const user7 = useSelector((state) => state.user.user);
  const headers = { Authorization: `Bearer ${user7?.token}` };
  const phoneNo = useSelector((state) => {
    return state?.user?.user?.mobile;
  });

  // .............>>>>>>>>>>>>>>><<<<<<<<<<<<<<.................
  const {
    formState: { errors },
  } = useForm({});

  useEffect(() => {
    if (phoneNo != undefined && phoneNo != null) getTransactions();
  }, [phoneNo]);

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

  const getTransactions = () => {
    axios
      .get(
        `${urls.RTI}/applicationDetails/getByCitizenMobileNumber?mobileNumber=${phoneNo}`,
        {
          headers: headers,
        }
      )
      .then((res) => {
        setIsLoading(false);
        let result = res?.data?.applicationDetailsList;
        let _res = res?.data?.applicationDetailsList?.map((val, i) => {
          return {
            id: val.key,
            srNo: i + 1,
            applicantName:
              val.citizenFirstName != null &&
              val.citizenMiddleName != null &&
              val.citizenLastName != null
                ? val.citizenFirstName +
                  " " +
                  val.citizenMiddleName +
                  " " +
                  val.citizenLastName
                : "-",
            applicationDateOld:
              val.createDtTm === null
                ? "-"
                : moment(val.createDtTm).format("DD-MM-YYYY"),
            citizenMobileNumber:
              val.citizenMobileNumber != null &&
              val.citizenMobileNumber != "null"
                ? val.citizenMobileNumber
                : "-",
            departmentName:
              val.departmentName != null ? val.departmentName : "-",
            subjectName: val.subjectName != null ? val.subjectName : "-",
            status: val.status != null ? val.status : "-",
            applicationNo: val.applicationNo != null ? val.applicationNo : "-",
          };
        });
        setTransData(_res);
        setPageSize(10);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

 

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "applicationNo",
      headerName: <FormattedLabel id="applicationNo" />,
      width: 300,
      flex: 2,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "applicationDateOld",
      headerName: <FormattedLabel id="applicationDateOld" />,
      minWidth: "5%",
      maxWidth: "5%",
      flex: 1,
      headerAlign: "center",
      align: "left",
    },

    {
      field: "applicantName",
      headerName: <FormattedLabel id="applicantName" />,
      flex: 2,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "citizenMobileNumber",
      headerName: <FormattedLabel id="mobileNo" />,
      width: 150,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "subjectName",
      headerName: <FormattedLabel id="subjectName" />,

      flex: 3,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "departmentName",
      headerName: <FormattedLabel id="departmentName" />,
      flex: 2,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      flex: 1.75,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 1,
      headerAlign: "center",
      align: "right",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={() => {
                router.push({
                  pathname:
                    "/RTIOnlineSystem/reports/oldRTIApplication/trackOldRTIApplication",
                  query: { id: params.row.id },
                });
              }}
            >
              {language === "en" ? (
                <Tooltip
                  title={`VIEW RTI APPLICATION AGAINST THIS ID ${params?.row?.id}`}
                >
                  <VisibilityIcon style={{ color: "#556CD6" }} />
                </Tooltip>
              ) : (
                <Tooltip
                  title={`${params?.row?.id} या आयडी विरुद्ध तक्रार पहा `}
                >
                  <VisibilityIcon style={{ color: "#556CD6" }} />
                </Tooltip>
              )}
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <>
      {isLoading && <CommonLoader />}
      <>
        <Box>
          <Grid
            container
            style={{
              display: "flex",
              alignItems: "center", // Center vertically
              alignItems: "center",
              width: "100%",
              height: "auto",
              overflow: "auto",
              color: "white",
              fontSize: "18.72px",
              borderRadius: 100,
              fontWeight: 500,
              background:
                "linear-gradient( 90deg, rgb(72 115 218 / 91%) 2%, rgb(142 122 231) 100%)",
            }}
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
                <FormattedLabel id="OldRTIApplication" />
              </h3>
            </Grid>
          </Grid>
        </Box>
        <>
          <DataGrid
            autoHeight
            sx={{
              overflowY: "scroll",
              marginTop: "20px",
              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#556CD6",
                color: "white",
              },
              "& .MuiDataGrid-cell:hover": {},
              "& .MuiSvgIcon-root": {
                color: "black",
              },
            }}
            paginationMode="client"
            density="standard"
            rows={transData || []}
            rowCount={transData?.length}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[10, 20, 50, 100]}
            columns={columns}
            disableSelectionOnClick
          />
        </>
      </>
    </>
  );
};

export default DashboardHome;
