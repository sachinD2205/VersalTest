// /marriageRegistration/transactions/newMarriageRegistration/scrutiny/index.js
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, IconButton, Paper } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// Table _ MR
const Index = () => {
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
  let user = useSelector((state) => state.user.user);
  const router = useRouter();
  const [authority, setAuthority] = useState([]);
  const [tableData, setTableData] = useState([]);

  let language = useSelector((state) => state.labels.language);
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
  const [loadderState, setLoadderState] = useState(true);
  const [serviceId, setServiceId] = useState(null);

  useEffect(() => {
    let auth = user?.menus?.find((r) => r.id == selectedMenuFromDrawer)?.roles;
    let service = user?.menus?.find(
      (r) => r.id == selectedMenuFromDrawer,
    )?.serviceId;
    console.log("serviceId-<>", service);
    console.log("auth0000", auth);
    setAuthority(auth);
    setServiceId(service);
  }, [selectedMenuFromDrawer, user?.menus]);

  // // Get Table - Data
  const getNewMarriageRegistractionDetails = () => {
    console.log("loader", loadderState);
    // setLoadderState(true);
    console.log("userToken", user.token);
    axios
      .get(`${urls.TPURL}/reservationDetail/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((resp) => {
        setLoadderState(false);
        setTableData(
          resp.data.reservationDetail.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            applicationNumber: r.applicationNumber,
            surveyNo: r.surveyNo,
            remark: r.remark,
            activeFlag: r.activeFlag,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  const handleViewActions = (paramsRow) => {
    // console.log("paramsRow", paramsRow);
    router.push({
      pathname:
        "/townPlanning/transactions/reservationDetail/reservationDetailsView",
      query: {
        id: paramsRow.id,
      },
    });
  };

  useEffect(() => {
    console.log("authority", authority);
    if (authority) {
      getNewMarriageRegistractionDetails();
    }
  }, [authority]);

  // Columns
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      // width: 70,
      flex: 1,
      headerAlign: "center",
    },
    // {
    //   field: "applicationNumber",
    //   headerName: <FormattedLabel id="applicationNo" />,
    //   // width: 260,
    //   flex: 1,
    //   headerAlign: "center",
    // },
    {
      field: "applicationDate",
      headerName: <FormattedLabel id="applicationDate" />,
      // width: 130,
      flex: 1,
      headerAlign: "center",
      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
    },

    {
      field: "surveyNo",
      headerName: "SurveyNo",
      // width: 240,
      flex: 1,
      headerAlign: "center",
    },

    // {
    //   field: "remark",
    //   headerName: "Remark",
    //   // width: 280,
    //   flex: 1,
    //   headerAlign: "center",
    // },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 300,
      // flex: 1,
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
            //   onClick={() =>
            //     router.push({
            //       pathname:
            //         "/townPlanning/transactions/partPlan/scrutiny/scrutiny",
            //       query: {
            //         disabled: true,
            //         applicationId: record.row.id,
            //         serviceId: record.row.serviceId,
            //         // ...record.row,
            //         role: "CLERK",

            //         pageHeader: "CLERK VERIFICATION",
            //         // pageHeaderMr: "कागदपत्र तपासणी",
            //       },
            //     })
            //   }
            >
              <Button
                style={{
                  height: "30px",
                  width: "200px",
                }}
                onClick={() => {
                  handleViewActions(params.row);
                }}
                variant="contained"
                color="primary"
              >
                View
              </Button>
            </IconButton>
          </>
        );
      },
    },
  ];
  useEffect(() => {}, [loadderState]);
  return (
    <>
      {/* {loadderState ? (
        <Loader />
      ) : ( */}
      <Box>
        <BreadcrumbComponent />
      </Box>
      <Paper
        sx={{
          marginLeft: 1,
          marginRight: 1,
          marginTop: 1,
          marginBottom: 10,
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
              Reservation Details
              {/* {<FormattedLabel id="partMap" />} */}
            </h2>
          </div>
        </div>

        <div className={styles.addbtn}>
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            onClick={() => {
              router.push({
                pathname: "/townPlanning/transactions/reservationDetail",
              });
            }}
          >
            {/* Add */}
            <FormattedLabel id="add" />
          </Button>
        </div>

        <DataGrid
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          rowHeight={70}
          sx={{
            marginLeft: 3,
            marginRight: 3,
            marginTop: 3,
            marginBottom: 15,
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
          rows={tableData}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Paper>
      {/* )} */}
    </>
  );
};
export default Index;
