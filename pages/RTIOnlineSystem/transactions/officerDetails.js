import {  Grid, Tooltip, IconButton, Box, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../URLS/urls";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import roleId from "../../../components/rtiOnlineSystem/commonRoleId";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import commonStyles from "../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CommonLoader from "../../../containers/reuseableComponents/commonLoader";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../util/commonErrorUtil";

const Index = () => {
  const language = useSelector((state) => state.labels.language);
  const [dataSource, setDataSource] = useState([]);
  const router = useRouter();
  const [pageSize, setPageSize] = useState(10);
  let user = useSelector((state) => state.user.user);
  const [userList, setUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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

  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );
  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roleIds;


  useEffect(() => {
    getRTIUsers();
  }, []);

  // get self application
  const getRTIUsers = () => {
    setIsLoading(true);
    let body = {
      rolesId: [roleId.RTI_ADHIKARI_ROLE_ID, roleId.RTI_APPEALE_ROLE_ID],
    };

    axios
      .post(`${urls.RTI}/report/getAllRtiUsers`, body, {
        headers: headers,
      })
      .then((res, i) => {
        setIsLoading(false);
        if (res.status === 200) {
          setUsers(res?.data);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  useEffect(() => {
    if (userList != null) {
      setDataSourceDetails();
    }
  }, [userList]);

  // set datatable details
  const setDataSourceDetails = () => {
    let result = userList.user;
    const _res = result?.map((res, i) => {
      return {
        srNo: i + 1,
        id: i + 1,
         officerName:
          res.firstNameEn != null &&
          res.middleNameEn != null &&
          res.lastNameEn != null
            ? res.firstNameEn + " " + res.middleNameEn+" " + res.lastNameEn
            : res.firstNameEn != null &&
              res.middleNameEn != null &&
              res.lastNameEn == null
            ? res.firstNameEn + " " + res.middleNameEn + "-"
            : res.firstNameEn != null &&
              res.middleNameEn == null &&
              res.lastNameEn != null
            ? res.firstNameEn + " " + "-" + res.lastNameEn
            : res.firstNameEn == null &&
              res.middleNameEn != null &&
              res.lastNameEn != null
            ? "-" + " " + res.middleNameEn+" " + res.lastNameEn
            : res.firstNameEn != null &&
              res.middleNameEn == null &&
              res.lastNameEn == null
            ? res.firstNameEn + " "
            : res.firstNameEn == null &&
              res.middleNameEn != null &&
              res.lastNameEn == null
            ? "-" + " " + res.middleNameEn + "-"
            : res.firstNameEn == null &&
              res.middleNameEn == null &&
              res.lastNameEn != null
            ? "-" + "-" + res.lastNameEn
            : "-",

        departmentName:
          res.primaryDept != null && res.secondaryDept != null
            ? res.primaryDept + ", " + res.secondaryDept
            : res.primaryDept != null && res.secondaryDept == null
            ? res.primaryDept + ""
            : res.primaryDept == null && res.secondaryDept != null
            ? "" + res.secondaryDept
            : res.primaryDept == null && res.secondaryDept == null
            ? ""
            : "",
        designation: res.designationName != null ? res.designationName : "-",
        officeLocation:
          res.officeLocationName != null ? res.officeLocationName : "-",
        officialAddress:
          res.officeLocationAddress != "" ? res.officeLocationAddress : "-",
      };
    });

    setDataSource(_res);
  };

  // datatable columns
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
      align: "center",
    },

    {
      field: "officeLocation",
      headerName: (
        <Tooltip title={<FormattedLabel id="officeLocation" />}>
          <span>
            <FormattedLabel id="officeLocation" />
          </span>
        </Tooltip>
      ),
      //   flex: 1,
      width: 150,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line" }}>{params.value}</div>
      ),
      headerAlign: "center",
      align: "left",
    },
    {
      field: "departmentName",
      headerName: (
        <Tooltip title={<FormattedLabel id="departmentKey" />}>
          <span>
            <FormattedLabel id="departmentKey" />
          </span>
        </Tooltip>
      ),
      width: 350,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line" }}>{params.value}</div>
      ),
      headerAlign: "center",
      align: "left",
    },
    {
      field: "officerName",
      headerName: (
        <Tooltip title={<FormattedLabel id="officerName" />}>
          <span>
            <FormattedLabel id="officerName" />
          </span>
        </Tooltip>
      ),
      width: 200,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line" }}>{params.value}</div>
      ),
      headerAlign: "center",
      align: "left",
    },
    {
      field: "designation",
      headerName: (
        <Tooltip title={<FormattedLabel id="designation" />}>
          <span>
            <FormattedLabel id="designation" />
          </span>
        </Tooltip>
      ),
      width: 250,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line" }}>{params.value}</div>
      ),
      headerAlign: "center",
      align: "left",
    },
    {
      field: "officialAddress",
      headerName: (
        <Tooltip title={<FormattedLabel id="officialAddress" />}>
          <span>
            <FormattedLabel id="officialAddress" />
          </span>
        </Tooltip>
      ),
      flex:2,
      width: 250,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line" }}>{params.value}</div>
      ),
      headerAlign: "center",
      align: "left",
    },
  ];

  // ui
  return (
    <>
      {isLoading && <CommonLoader />}
      <BreadcrumbComponent />
      <Paper
        elevation={8}
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
                <FormattedLabel id="officerTitle" />
              </h3>
            </Grid>
          </Grid>
        </Box>

        <DataGrid
          components={{ Toolbar: GridToolbar }}
          //   componentsProps={{
          //     toolbar: {
          //       showQuickFilter: true,
          //       quickFilterProps: { debounceMs: 500 },
          //       printOptions: {
          //         copyStyles: true,
          //         hideToolbar: true,
          //         hideFooter: true,
          //       },
          //     },
          //   }}
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
          density="standard"
          pageSize={pageSize}
          rows={dataSource}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[10, 20, 50, 100]}
          pagination
          columns={columns}
          disableSelectionOnClick
        />
      </Paper>
    </>
  );
};

export default Index;
