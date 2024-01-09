import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../../../../styles/sportsPortalStyles/history.module.css";
import urls from "../../../../URLS/urls";
import moment from "moment";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// Table _ MR
const Index = (props) => {
  const router = useRouter();
  const [authority, setAuthority] = useState([]);
  const [tableData, setTableData] = useState([]);
  let user = useSelector((state) => state.user.user);
  let language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };
  useEffect(() => {
    getHistoryDetails();
    console.log("676576765765", tableData);
    // if (props.Id) {
    //   getHistoryDetails();
    // }
  }, []);

  const getHistoryDetails = () => {
    axios
      .get(`${urls.SPURL}/gymBooking/getById?id=${props.id}`,{
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((resp) => {
        console.log("re2323", resp);
        setTableData(
          resp?.data?.trnGymBookingHistoryDaos?.map((r, i) => {
            return {
              srNo: i + 1,
              ...r,
            };
          })
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
      //minWidth: 70,
    },
    {
      field: "approverName",
      // headerName: <FormattedLabel id="applicationNo" />,
      headerName: <FormattedLabel id="sentByUser" />,
      flex: 1,
      // minWidth: 260,
    },
    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      flex: 1,
      // minWwidth: 230,
    },

    {
      field: "sentDate",
      headerName: <FormattedLabel id="date" />,
      flex: 1,
      // minWidth: 240,
      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
    },

    {
      field: "sentTime",
      headerName: <FormattedLabel id="time" />,
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
          marginTop: 1,
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
              <FormattedLabel id="applicationHistory" />
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
