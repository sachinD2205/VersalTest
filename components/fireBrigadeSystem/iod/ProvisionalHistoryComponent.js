import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../../../styles/fireBrigadeSystem/history.module.css";
import urls from "../../../URLS/urls";
// Table _ MR
const Index = (props) => {
  const router = useRouter();
  const [authority, setAuthority] = useState([]);
  const [tableData, setTableData] = useState([]);
  let user = useSelector((state) => state.user.user);
  let language = useSelector((state) => state.labels.language);

  useEffect(() => {
    getHistoryDetails();
    console.log("676576765765", tableData);
    // if (props.Id) {
    //   getHistoryDetails();
    // }
  }, []);

  const getHistoryDetails = () => {
    axios
      .get(
        `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/getById?appId=${props.appId}`
      )
      .then((resp) => {
        console.log("re2323", resp);
        setTableData(
          resp?.data?.provisionalFireNocHistoryLst?.map((r, i) => {
            return {
              srNo: i + 1,
              ...r,
            };
          })
        );
      });
  };
  const columns = [
    {
      field: "srNo",
      // headerName: <FormattedLabel id="srNo" />,
      headerName: "Sr No",
      flex: 1,
      //minWidth: 70,
    },
    {
      field: "approverName",
      // headerName: <FormattedLabel id="applicationNo" />,
      headerName: "Sent By User",
      flex: 1,
      // minWidth: 260,
    },
    {
      field: "remark",
      // headerName: <FormattedLabel id="applicationDate" />,
      headerName: "Remark",
      flex: 1,
      // minWwidth: 230,
    },

    {
      field: "sentDate",
      // headerName: <FormattedLabel id="ApplicantName" />,
      headerName: "Date",
      flex: 1,
      // minWidth: 240,
    },

    {
      field: "sentTime",
      // headerName: <FormattedLabel id="statusDetails" />,
      headerName: "Time",
      flex: 1,
      // minWidth: 280,
    },
  ];

  return (
    <>
      {/* <BasicLayout> */}
      <Paper
        sx={{
          marginLeft: 1,
          marginRight: 1,
          //   marginTop: 4,
          marginBottom: 1,
          padding: 1,
          border: 1,
          borderColor: "grey.500",
        }}
      >
        <br />
        <div className={styles.detailsTABLE}>
          <div className={styles.h1TagTABLE}>
            <h2
              style={{
                fontSize: "20",
                color: "white",
                marginTop: "7px",
              }}
            >
              {" "}
              Application History
            </h2>
          </div>
        </div>
        <br />

        <DataGrid
          sx={{
            marginLeft: 3,
            marginRight: 3,
            marginTop: 3,
            marginBottom: 2,
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
          autoHeight
          scrollbarSize={17}
          rows={tableData == undefined || tableData == null ? [] : tableData}
          // rows={tableData}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Paper>
      {/* </BasicLayout> */}
    </>
  );
};
export default Index;
