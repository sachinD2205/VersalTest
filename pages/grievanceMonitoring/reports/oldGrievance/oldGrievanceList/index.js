import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Tooltip,
  IconButton,
} from "@mui/material";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import {  useSelector } from "react-redux";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useForm } from "react-hook-form";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../../util/commonErrorUtil";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};


const DashboardHome = (props) => {
  const router = useRouter();
  const language = useSelector((state) => state.labels.language);
  const [loading, setLoading] = useState(false);
  const [uIData, setUIData] = useState([]);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error,moduleOrCFC) => {
    if (!catchMethodStatus) {
      if(moduleOrCFC){
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }else{
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };

  // user1
  const phoneNo = useSelector((state) => {
    return state?.user?.user?.mobile;
  });

  const userToken = useSelector((state) => {
    return state?.user?.user?.token;
  });
  const headers = { Authorization: `Bearer ${userToken}` };
  const {
    formState: { errors },
  } = useForm({});

  const getTransactions = async () => {
    try {
      setLoading(true); // Set loading before sending API request
      const response = await axios.post(
        `${urls.GM}/archieveData/getByMobileNumber?mobileNo=${phoneNo}`,
        {},
        {
          headers: headers,
        }
      );
      let result = response?.data?.oldGrievance;
      let _res = result?.map((val, i) => {
        return {
          id: val.grievanceKey,
          srNo: i + 1,
          applicantName:
            val.firstName === null &&
            val.middleName === null &&
            val.lastName === null
              ? "-"
              : val.firstName + " " + val.middleName + " " + val.lastName,
          grievanceDate: moment(val.entryDate).format("DD-MM-YYYY"),
          escDate: moment(val.expectedCompletionDate).format("DD-MM-YYYY"),
          mobileNo: val.mobileNo === null ? "-" : val.mobileNo,
          eventType: val.event === null ? "-" : val.event,
          complaintType: val.subject,
          complaintStatusText: val.stage,
          applicationNo: val.tokenNumber,
        };
      });
      setUIData(_res);
      setLoading(false); // Stop loading
    } catch (error) {
      setLoading(false); // Stop loading in case of error
      cfcErrorCatchMethod(error,false);
    }
  };

  useEffect(() => {
    if (phoneNo != undefined && phoneNo != null) {
      getTransactions();
    }
  }, [phoneNo]);


  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "applicationNo",
      headerName: language === "en" ? "Complaint Number" : "तक्रार क्रमांक",
      minWidth: "15%",
      maxWidth: "15%",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "grievanceDate",
      headerName: <FormattedLabel id="grievanceRaiseDate" />,
      minWidth: "5%",
      maxWidth: "5%",
      flex: 1,
      headerAlign: "center",
      align: "left",
    },
    {
        field: 'applicantName',
        headerName: <FormattedLabel id="applicantName" />,
        minWidth: "20%",
        maxWidth: "20%",
        flex: 1.75,
        headerAlign: "center",
        align: "left",
      },
    {
      field:"complaintType",
      headerName: <FormattedLabel id="subject" />,
      minWidth: "20%",
      maxWidth: "20%",
      flex: 1.75,
      headerAlign: "center",
      align: "left",
    },
    
    {
      field: "escDate",
      headerName:
        language === "en"
          ? "Tentative Resolution Date"
          : "तात्पुरत्या ठरावाची तारीख",
      minWidth: "5%",
      maxWidth: "5%",
      flex: 1,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "complaintStatusText",
      headerName: <FormattedLabel id="complaintStatusText" />,
      minWidth: "5%",
      maxWidth: "5%",
      flex: 0.5,
      headerAlign: "center",
      align: "left",
      renderCell: (params) => {
        return (
          <>
            {params?.row?.complaintStatusText === "Open" ? (
              <div style={{ color: "orange" }}>
                {language === "en"
                  ? params?.row?.complaintStatusText
                  : params?.row?.complaintStatusTextMr}
              </div>
            ) : (
              <div style={{ color: "green" }}>
                {language === "en"
                  ? params?.row?.complaintStatusText
                  : params?.row?.complaintStatusTextMr}
              </div>
            )}
          </>
        );
      },
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 0.5,
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
                  "/grievanceMonitoring/transactions/oldGrievance/trackOldGrievance",
                  query: { id: params.row.applicationNo },
                });
              }}
            >
              {language === "en" ? (
                <Tooltip
                  title={`VIEW GRIEVANCE AGAINST THIS ID ${params?.row?.id}`}
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
      {loading && <CommonLoader />}
      <>
        <Paper
          elevation={8}
          variant="outlined"
          sx={{
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
                  <FormattedLabel id="oldGrievanceList" />
                </h3>
              </Grid>
            </Grid>
          </Box>

          <DataGrid
            autoHeight
            sx={{
              overflowY: "scroll",
              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#556CD6",
                color: "white",
              },

              "& .MuiDataGrid-cell:hover": {
              },
              "& .MuiSvgIcon-root": {
                color: "black", // change the color of the check mark here
              },
            }}
            components={{ Toolbar: GridToolbar }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 0 },
                disableExport: true,
                disableToolbarButton: false,
                csvOptions: { disableToolbarButton: false },
                printOptions: { disableToolbarButton: true },
              },
            }}
            density="standard"
            rows={uIData || []}
            pageSize={10}
            rowsPerPageOptions={[10]}
            columns={columns}
            disableSelectionOnClick
          />
        </Paper>
      </>
    </>
  );
};

DashboardHome.propTypes = {
  window: PropTypes.func,
};

export default DashboardHome;
