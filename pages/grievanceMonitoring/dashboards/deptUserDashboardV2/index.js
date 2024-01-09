import React, { useState, useEffect } from "react";
import * as MuiIcons from "@mui/icons-material";
import {
  Box,
  Paper,
  Tooltip,
  IconButton,
} from "@mui/material";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import {  useSelector } from "react-redux";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useForm } from "react-hook-form";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import moment from "moment";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";

const DashboardHome = (props) => {
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (props?.data?.length != 0) {
      let result = props?.data;
      setLoading(false);
      let _res = result?.map((val, i) => {
        return {
          id: val.id,
          srNo: i + 1,
          firstName: val.firstName,
          complaintType: val.complaintType,
          complaintTypeMr: val.complaintTypeMr,
          citizenName: val.citizenName,
          city: val.city,
          complaintDescription: val.complaintDescription,
          complaintSubType:
            val.complaintSubType != null ? val.complaintSubType : "-",
          complaintSubTypeMr:
            val.complaintSubTypeMr != null ? val.complaintSubTypeMr : "-",
          deptName: val.deptName,
          deptNameMr: val.deptNameMr,
          email: val.email,
          mobileNumber: val.mobileNumber,
          subDepartment: val.subDepartment,
          subDepartmentText: val.subDepartmentText,
          complaintStatus: val.complaintStatus,
          grievanceDate: moment(val.createDtTm).format("DD-MM-YYYY H:mm:ss"),
          escDate: moment(val.escDate).format("DD-MM-YYYY H:mm:ss"),
          complaintType: val.complaintType,
          complaintStatusText:
            val.reopenCount > 0 && val.complaintStatusText === "Open"
              ? "Reopen"
              : val.complaintStatusText,
          complaintStatusTextMr:
            val.reopenCount > 0 && val.complaintStatusTextMr === "उघडा"
              ? "पुन्हा उघडले"
              : val.complaintStatusTextMr,
          createdBy: val.createdBy,
          applicationNo: val.applicationNo,
        };
      });
      setTransData(result);
    } else {
      setTransData([]);
    }
  }, [props]);
  const [transData, setTransData] = useState([]);
  const [loading, setLoading] = useState(false);
  const language = useSelector((state) => state.labels.language);
  const router1 = useRouter();

  const {
    formState: { errors },
  } = useForm({});


  const columns = [
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
      field: language === "en" ? "complaintType" : "complaintTypeMr",
      headerName: <FormattedLabel id="complaintType" />,
      minWidth: "20%",
      maxWidth: "20%",
      flex: 1.75,
      headerAlign: "center",
      align: "left",
    },
    {
      field: language == "en" ? "complaintSubType" : "complaintSubTypeMr",
      headerName: <FormattedLabel id="grievanceSubType" />,
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
      field:
        language === "en" ? "complaintStatusText" : "complaintStatusTextMr",
      headerName: <FormattedLabel id="complaintStatusText" />,
      minWidth: "5%",
      maxWidth: "5%",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <>
            {params?.row?.complaintStatusText === "Open" ||
            params?.row?.complaintStatusText === "Reopen" ? (
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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
            }}
          >
            <IconButton
              onClick={() => {
                router1.push({
                  pathname:
                    "/grievanceMonitoring/transactions/RegisterComplaint/viewGrievance",
                  query: {
                    id: params?.row?.applicationNo,
                    isDashboard: props?.isDashboard,
                  },
                });
              }}
            >
              {language === "en" ? (
                <Tooltip
                  title={`VIEW GRIEVANCE AGAINST THIS ID : ${params?.row?.applicationNo}`}
                >
                  <VisibilityIcon style={{ color: "#556CD6" }} />
                </Tooltip>
              ) : (
                <Tooltip
                  title={`${params?.row?.applicationNo} : या आयडी विरुद्ध तक्रार पहा `}
                >
                  <VisibilityIcon style={{ color: "#556CD6" }} />
                </Tooltip>
              )}
            </IconButton>

            {(params?.row?.complaintStatusText === "Open" ||
              params?.row?.complaintStatusText === "Reopen") &&
              !props?.isDashboard && (
                <IconButton
                  onClick={() => {
                    router1.push({
                      pathname:
                        "/grievanceMonitoring/transactions/forwardComplaint",
                      query: { id: params?.row?.applicationNo },
                    });
                  }}
                >
                  {language === "en" ? (
                    <Tooltip
                      title={`FORWARD GRIEVANCE AGAINST THIS ID : ${params?.row?.applicationNo}`}
                    >
                      <ArrowForwardIosIcon style={{ color: "green" }} />
                    </Tooltip>
                  ) : (
                    <Tooltip
                      title={`${params?.row?.applicationNo} : या आयडी विरुद्ध तक्रार पाठवा `}
                    >
                      <ArrowForwardIosIcon style={{ color: "green" }} />
                    </Tooltip>
                  )}
                </IconButton>
              )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      {loading && <CommonLoader />}
      <hr />
      <Box
        component={Paper}
        style={{
          width: "100%",
        }}
      >
        <>
          <DataGrid
            autoHeight
            sx={{
              overflowY: "scroll",
              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#556CD6",
                color: "white",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                textOverflow: "unset !important",
                whiteSpace: "break-spaces !important",
                lineHeight: "1 !important",
              },
              "& .MuiDataGrid-cellContent": {
                textOverflow: "unset !important",
                whiteSpace: "break-spaces !important",
                lineHeight: "1 !important",
              },
              "& .MuiDataGrid-cell:hover": {
              },
              "& .MuiSvgIcon-root": {
                color: "black", // change the color of the check mark here
              },
              "& .MuiDataGrid-toolbar": {
                backgroundColor: "transparent", // Set the background color to transparent here
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
            rows={transData || []}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[10, 20, 50, 100]}
            columns={columns}
            disableSelectionOnClick
          />
        </>
      </Box>
    </>
  );
};

DashboardHome.propTypes = {
  window: PropTypes.func,
};

export default DashboardHome;
