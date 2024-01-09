import { Box, Button, Grid, Paper, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import urls from "../../../../URLS/urls";
import styles from "./[helpdeskAndEnquiry].module.css";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

const HelpdeskAndEnquiry = () => {
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getHelpdeskAndEnquiry();
  }, []);

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
      flex: 0.6,

      cellClassName: "super-app-theme--cell",
    },
    {
      field: "applicationNo",
      headerName: "Application Number",
      flex: 0.6,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "getDetails",
      headerName: "Details",
      flex: 0.6,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "remarks",
      headerName: <FormattedLabel id="remark" />,
      flex: 0.6,
      align: "center",
      headerAlign: "center",
    },
  ];

  const getHelpdeskAndEnquiry = () => {
    axios
      .get(
        `${urls.CFCURL}/transaction/helpdeskAndEnquiry/getHelpdeskAndEnquiryDetails`
      )
      .then((res) => {
        console.log("res getHelpdeskAndEnquiry", res);

        let _res = res.data.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          applicationNo: r.applicationNo,
          getDetails: r.getDetails,
          remarks: r.remarks,
        }));

        setData({
          rows: _res,
          totalRows: 10,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: 10,
          page: 1,
        });
      });
  };

  return (
    <Paper>
      <Box
        className={styles.tableHead}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Box className={styles.h1Tag}>Helpdesk And Enquiry</Box>
      </Box>
      {/* <Grid
        container
        sx={{ padding: "10px", display: "flex", justifyContent: "end" }}
      >
        <Button size="small" variant="outlined" endIcon={<AddIcon />}>
          Add
        </Button>
      </Grid> */}
      <Grid
        container
        sx={{
          padding: "10px",
        }}
      >
        <Grid
          xs={6}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <TextField
            id="outlined-basic"
            label="Applicant Name"
            variant="outlined"
            size="small"
            sx={{
              backgroundColor: "#FFFFFF",
              width: "90%",
            }}
          />
        </Grid>
        <Grid
          xs={6}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <TextField
            id="outlined-basic"
            label="Application Number"
            variant="outlined"
            size="small"
            sx={{
              backgroundColor: "#FFFFFF",
              width: "90%",
            }}
          />
        </Grid>
      </Grid>
      <Grid
        container
        sx={{ padding: "10px", display: "flex", justifyContent: "center" }}
      >
        <Button sx={{ width: "10%" }} variant="outlined" size="small">
          Get Details
        </Button>
      </Grid>
      <Box
        style={{
          height: "auto",
          overflow: "auto",
          width: "100%",
        }}
      >
        <DataGrid
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          getRowId={(row) => row.srNo}
          components={{ Toolbar: GridToolbar }}
          // autoHeight={true}
          autoHeight={data.pageSize}
          density="compact"
          sx={{
            "& .super-app-theme--cell": {
              backgroundColor: "#E3EAEA",
              borderLeft: "10px solid white",
              borderRight: "10px solid white",
              borderTop: "4px solid white",
            },
            backgroundColor: "white",
            boxShadow: 2,
            border: 1,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {},
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#E3EAEA",
            },
            "& .MuiDataGrid-columnHeadersInner": {
              backgroundColor: "#556CD6",
              color: "white",
            },

            "& .MuiDataGrid-column": {
              backgroundColor: "red",
            },
          }}
          pagination
          paginationMode="server"
          rowCount={data.totalRows}
          rowsPerPageOptions={data.rowsPerPageOptions}
          page={data.page}
          pageSize={data.pageSize}
          rows={data.rows}
          columns={columns}
          onPageChange={(_data) => {
            // getBillType(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            console.log("222", _data);
            // getBillType(_data, data.page);
          }}
        />
      </Box>
    </Paper>
  );
};

export default HelpdeskAndEnquiry;
