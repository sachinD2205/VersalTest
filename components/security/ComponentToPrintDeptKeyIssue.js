import { Grid, Typography, Divider } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import moment from "moment";
import { default as React, useEffect, useRef, useState } from "react";
import styles from "./ComponentToPrint.module.css";
// class component To Print
export default class ComponentToPrint extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        rows: [],
        totalRows: 0,
        rowsPerPageOptions: [10, 20, 50, 100],
        pageSize: 10,
        page: 1,
      },
    };

    this.columns = [
      {
        field: "srNo",
        headerName: "Sr No",
        flex: 1,
        maxWidth: 40,
        align: "center",
        headerAlign: "center",
      },
      {
        hide: false,
        field: "departmentKey",
        headerName: "Department Name",
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      // {
      //   hide: false,
      //   field: "employeeKey",
      //   headerName: "Employee Key",
      //   flex: 1,
      //   align: "center",
      //   headerAlign: "center",
      // },
      {
        hide: false,
        field: "employeeName",
        headerName: "Employee Name",
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        hide: false,
        field: "keyIssueAt",
        headerName: "Key Issue At",
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        hide: false,
        field: "keyReceivedAt",
        headerName: "Key Received At",
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        hide: false,
        field: "keyStatus",
        headerName: "Key Status",
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        hide: false,
        field: "mobileNumber",
        headerName: "Mobile Number",
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        hide: true,
        field: "subDepartmentKey",
        headerName: "Sub Department Key",
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
    ];
  }

  render() {
    console.log(this.props.data, "props");
    return (
      <>
        <div className={styles.main}>
          <div className={styles.small}>
            <Grid container sx={{ padding: "10px" }}>
              <Grid
                item
                xs={3}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img src="/logo.png" alt="" height="100vh" width="100vw" />
              </Grid>
              <Grid
                item
                xs={6}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h4">पिंपरी चिंचवड महानगरपालिका</Typography>
              </Grid>
              <Grid
                item
                xs={3}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src="/smartCityPCMC.png"
                  alt=""
                  height="100vh"
                  width="100vw"
                />
              </Grid>
            </Grid>
            <Grid container sx={{ padding: "10px" }}>
              <Grid item xs={12}>
                <h2 className={styles.heading}>
                  <b>की इन आउट करण्यासाठी नोंदणीपुस्तक</b>
                </h2>
              </Grid>
            </Grid>

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
              rowCount={this.state.data.totalRows}
              rowsPerPageOptions={this.state.data.rowsPerPageOptions}
              page={this.state.data.page}
              pageSize={this.state.data.pageSize}
              rows={this.state.data.rows}
              columns={this.columns}
              onPageChange={(_data) => {
                // getAllVisitors(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                // updateData("page", 1);
                // getAllVisitors(_data, data.page);
              }}
            />

            <Divider />

            <Grid container sx={{ padding: "10px" }}>
              <Grid
                item
                xs={3}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography>पिंपरी चिंचवड महानगरपलिका,</Typography>
                <Typography>
                  मुंबई-पुणे महामार्ग पिंपरी पुणे 411-018,
                </Typography>
                <Typography>महाराष्ट्र, भारत</Typography>
              </Grid>
              <Grid
                item
                xs={5}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography>फोन क्रमांक:91-020-2742-5511/12/13/14</Typography>
                <Typography>
                  इमेल: egov@pcmcindia.gov.in / sarathi@pcmcindia.gov.in
                </Typography>
              </Grid>
              <Grid
                item
                xs={2}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img src="/qrcode1.png" alt="" height="70vh" width="70vw" />
              </Grid>
              <Grid
                item
                xs={2}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img src="/barcode.png" alt="" height="50vh" width="100vw" />
              </Grid>
            </Grid>
          </div>
        </div>
      </>
    );
  }
}
