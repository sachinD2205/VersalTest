import { Box, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import styles from "../../../styles/fireBrigadeSystem/history.module.css";
// import styles from "../../../../../styles/fireBrigadeSystem/history.module.css";
// import styles from "../../../../../styles/fireBrigadeSystem/view.module.css";
import styles from "../../../styles/fireBrigadeSystem/view.module.css";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";

import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import moment from "moment";
// Table _ MR
const HistoryComponent = (props) => {
  const router = useRouter();
  const [authority, setAuthority] = useState([]);
  const [tableData, setTableData] = useState([]);
  let user = useSelector((state) => state.user.user);
  let language = useSelector((state) => state.labels.language);
  const userToken = useGetToken();

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
        `${urls.FbsURL}/transaction/trnBussinessNOC/getById?id=${props?.appId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((resp) => {
        console.log("re2323", resp?.data?.businessNocHistorylst);
        setTableData(
          resp?.data?.businessNocHistorylst?.map((r, i) => {
            return {
              srNo: i + 1,
              ...r,
              sentDate: moment(r.sentDate).format("DD-MM-YYYY"),
            };
          })
        );
      });
  };
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.4,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "sentDate",
      headerName: <FormattedLabel id="date" />,
      flex: 0.6,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "sentTime",
      headerName: <FormattedLabel id="time" />,
      flex: 0.6,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "approverName",
      headerName: <FormattedLabel id="approverName" />,
      headerName: "Sent By User",
      flex: 1.3,
      // minWidth: 260,
    },
    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      flex: 1,
      // minWwidth: 230,
    },
  ];

  return (
    <>
      {/* <BasicLayout> */}
      {/* <Paper
        sx={{
          marginLeft: 1,
          marginRight: 1,
          //   marginTop: 4,
          marginBottom: 1,
          padding: 1,
          //   border: 1,
          //   borderColor: "grey.500",
        }}
      > */}
      {/* <div className={styles.detailsTABLE}>
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
        </div> */}

      {/* <Box style={{ display: "flex" }}>
        <Box className={styles.tableHead}>
          <Box className={styles.h1Tag}>
            {<FormattedLabel id='addBusinessNoc' />}
          </Box>
        </Box>
      </Box> */}
      <h3 style={{ textAlign: "center" }}>Application History</h3>
      <br />

      {/* <DataGrid
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
          density='compact'
          autoHeight
          scrollbarSize={17}
          rows={tableData == undefined || tableData == null ? [] : tableData}
          // rows={tableData}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        /> */}

      <Box style={{ height: "100%", width: "100%" }}>
        <DataGrid
          // componentsProps={{
          //   toolbar: {
          //     showQuickFilter: true,
          //   },
          // }}
          // components={{ Toolbar: GridToolbar }}
          autoHeight
          // autoHeight={data.pageSize}
          density="compact"
          sx={{
            backgroundColor: "white",
            boxShadow: 2,
            border: 1,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {
              transform: "scale(1.1)",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#E1FDFF",
            },
            "& .MuiDataGrid-columnHeadersInner": {
              // backgroundColor: "#87E9F7",
              backgroundColor: "#2E86C1",
              color: "white",
            },
          }}
          scrollbarSize={17}
          rows={tableData == undefined || tableData == null ? [] : tableData}
          // rows={tableData}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Box>
      {/* </Paper> */}
      {/* </BasicLayout> */}
    </>
  );
};
export default HistoryComponent;
