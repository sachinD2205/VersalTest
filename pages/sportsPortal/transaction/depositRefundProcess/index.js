import React, { useEffect, useState } from "react";
import styles from "./deposit.module.css";
import Head from "next/head";
import router from "next/router";

import { IconButton, Paper } from "@mui/material";
import Title from "../../../../containers/VMS_ReusableComponents/Title";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import {
  useGetToken,
  useLanguage,
} from "../../../../containers/reuseableComponents/CustomHooks";
import urls from "../../../../URLS/urls";
import { Visibility } from "@mui/icons-material";
import { useSelector } from "react-redux";

const Index = () => {
  const language = useLanguage();
  const userToken = useGetToken();

  const [table, setTable] = useState([
    // {
    //   srNo: 1,
    //   id: 1,
    //   applicationNumber: "PCMC7122023SP000000000989",
    //   applicantName: "Karan N. Sable",
    //   applicantNameMr: "करण न. साबळे",
    //   amount: 2500,
    // },
  ]);
  const [loadingState, setLoadingState] = useState(false);
  const [data, setData] = useState({
    totalRows: 0,
    rowsPerPageOptions: [5, 10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    //fetch table data
    getTableData();
  }, []);

  const columns = [
    {
      headerClassName: "cellColor",

      field: "srNo",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 75,
    },
    {
      headerClassName: "cellColor",

      field: "applicationNumber",
      //   align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="applicationNumber" />,
      width: 275,
    },
    {
      headerClassName: "cellColor",

      field: language == "en" ? "applicantName" : "applicantNameMr",
      //   align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="applicantName" />,
      minWidth: 250,
      flex: 1,
    },
    {
      headerClassName: "cellColor",

      field: "amount",
      //   align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="amount" />,
      width: 125,
    },
    {
      headerClassName: "cellColor",

      field: "status",
      //   align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="applicationStatus" />,
      width: 325,
    },
    {
      headerClassName: "cellColor",

      field: "action",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="action" />,
      width: 100,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              style={{
                color: "#1976d2",
              }}
              onClick={() => {
                router.push({
                  pathname: `/sportsPortal/transaction/depositRefundProcess/scrutiny`,
                  query: {
                    id: params.row?.id,
                  },
                });
              }}
            >
              <Visibility />
            </IconButton>
          </>
        );
      },
    },
  ];

  const getTableData = (pageSize = 10, pageNo = 0) => {
    setLoadingState(true);
    axios
      .get(`${urls.SPURL}/depositRefund/getAllForRefundProcess`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: { pageNo, pageSize, sortBy: "id", sortDir: "desc" },
      })
      .then((res) => {
        setTable(() => {
          return res.data?.depositRefundProcess?.map((j, i) => ({
            srNo: i + 1,
            id: j?.id,
            applicationNumber: j?.applicationNumber,
            applicantName:
              j?.firstName + " " + j?.middleName + " " + j?.lastName,
            amount: j?.amount,
            status: j?.status,
          }));
        });

        setData({
          ...data,
          totalRows: res.data.totalElements,
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
        setLoadingState(false);
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language);
        setLoadingState(false);
      });
  };

  return (
    <>
      <Head>
        <title>Deposit Refund Process</title>
      </Head>
      <Paper className={styles.main}>
        <Title titleLabel={<FormattedLabel id="depositRefundProcess" />} />
        <DataGrid
          loading={loadingState}
          autoHeight
          sx={{
            marginTop: "5vh",
            width: "100%",

            "& .cellColor": {
              backgroundColor: "#1976d2",
              color: "white",
            },
          }}
          rows={table}
          //@ts-ignore
          columns={columns}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 0 },
              disableExport: false,
              disableToolbarButton: false,
              csvOptions: { disableToolbarButton: false },
              printOptions: { disableToolbarButton: true },
            },
          }}
          paginationMode="server"
          rowCount={data?.totalRows}
          rowsPerPageOptions={data?.rowsPerPageOptions}
          page={data?.page}
          pageSize={data?.pageSize}
          onPageChange={(pageNo) => {
            getTableData(data?.pageSize, pageNo);
          }}
          onPageSizeChange={(pageSize) => {
            setData({ ...data, pageSize });
            getTableData(pageSize, data?.page);
          }}
        />
      </Paper>
    </>
  );
};

export default Index;
