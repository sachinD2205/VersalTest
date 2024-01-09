import {
  Checkbox,
  FormControlLabel,
  Paper
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import styles from "../../../../styles/sportsPortalStyles/history.module.css";
import { catchExceptionHandlingMethod } from "../../../../util/util";
// Table _ MR
const Index = (props) => {
  let language = useSelector((state) => state?.labels?.language);
  const userToken = useGetToken();
  const {
    control,
    register,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  const router = useRouter();
  const [slot, setSlot] = useState([]);
  const [tableData, setTableData] = useState([]);
  let user = useSelector((state) => state.user.user);
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


  // getSlotDetails
  const getSlotDetails = () => {
    axios
      .get(
        `${urls.SPURL}/groundBooking/getSlotsDtlByFromDateAndToDate?fromDate=${props.fromDate}&toDate=${props.toDate}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },

      })
      .then((res) => {
        setTableData(
          res?.data?.groundSlotsDaos?.map((r, i) => {
            return {
              srNo: i + 1,
              ...r,
            };
          })
        );

      }).catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // columns
  const columns = [
    {
      field: "srNo",
      headerName: "Sr No",
      flex: 1,
    },
    {
      field: "fromDate",
      headerName: "Date",
      flex: 1,
    },
    {
      field: "fromBookingTime",
      headerName: "From Booking Time",
      flex: 1,
    },

    {
      field: "toBookingTime",
      headerName: "To Booking Time",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Action",
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <FormControlLabel
            control={<Checkbox />}
            onChange={(value) => {
              setSlot([...slot, params.row]);
              console.log("checked1", [...slot, params.row]);
            }}
          />
        );
      },
    },
  ];


  //!=============================== useEffect

  useEffect(() => {
    getSlotDetails();
  }, []);

  useEffect(() => {
    setValue("groundSlotsLst", slot);
  }, [slot]);

  //!=====================================> view
  return (
    <div>
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
              Slot Details
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
          columns={columns}
        />
      </Paper>
    </div>
  );
};
export default Index;
