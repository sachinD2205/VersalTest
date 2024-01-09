import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import styles from "../history.module.css";
// import urls from "../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../util/util";
// Table _ MR
const Index = (props) => {
  const router = useRouter();
  const [serviceId, setServiceId] = useState(null);
  const [authority, setAuthority] = useState([]);
  const [tableData, setTableData] = useState([]);
  let user = useSelector((state) => state.user.user);
  let language = useSelector((state) => state.labels.language);
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
  const userToken = useGetToken();
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
    let auth = user?.menus?.find((r) => r.id == selectedMenuFromDrawer)?.roles;
    let service = user?.menus?.find(
      (r) => r.id == selectedMenuFromDrawer,
    )?.serviceId;
    console.log("serviceId-<>", serviceId);
    console.log("auth0000", auth);
    setAuthority(auth);
    setServiceId(service);
  }, [selectedMenuFromDrawer, user?.menus]);

  useEffect(() => {
    console.log("tableData", tableData);
  }, [tableData]);

  useEffect(() => {
    console.log("authority", authority);
    if (router?.query?.serviceId && router?.query?.applicationId) {
      getNewMarriageRegistractionHistoryDetails();
    }
    console.log("tujya tr", props);
  }, [router?.query]);

  let applicationId;
  if (router?.query?.applicationId) {
    applicationId = router?.query?.applicationId;
  } else if (router?.query?.id) {
    applicationId = router?.query?.id;
  }

  // console.log(
  //   "appid",
  //   applicationId,
  //   router?.query?.applicationId,
  //   router?.query?.id,
  // );

  const getNewMarriageRegistractionHistoryDetails = () => {
    if (router?.query?.serviceId == 19) {
      console.log(ID, "applicationId------19");
      let ID = router.query.applicationId;
      axios
        .get(
          `${urls.TPURL}/developmentPlanOpinion/getDevelopmentPlanOpinionById?id=${ID}`,{
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((resp) => {
          console.log("history--->", resp.data);

          let tempData = resp?.data?.history?.map((r, i) => {
            return {
              srNo: i + 1,
              ...r,
            };
          });

          console.log("shdfsdf", tempData);
          setTableData(tempData);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    } else if (router?.query?.serviceId == 18) {
      console.log(ID, "applicationId------18");
      let ID = router.query.applicationId;
      axios
        .get(`${urls.TPURL}/transaction/zoneCertificate/getById?id=${ID}`,{
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((resp) => {
          console.log("history--->zone", resp.data);

          let tempData = resp?.data?.history?.map((r, i) => {
            return {
              srNo: i + 1,
              ...r,
            };
          });

          console.log("zone certificate==", tempData);
          setTableData(tempData);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    } else if (router?.query?.serviceId == 20) {
      console.log(ID, "applicationId------18");
      let ID = router.query.applicationId;
      axios
        .get(`${urls.TPURL}/setBackCertificate/getsetBackCertificate?id=${ID}`,{
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((resp) => {
          console.log("history--->zone", resp.data);

          let tempData = resp?.data?.history?.map((r, i) => {
            return {
              srNo: i + 1,
              ...r,
            };
          });

          console.log("setback certificate==", tempData);
          setTableData(tempData);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    } else if (router?.query?.serviceId == 17) {
      axios
        .get(`${urls.TPURL}/partplan/getById/${router?.query?.applicationId}`,{
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((resp) => {
          console.log("history--->partplan", resp.data);

          let tempData = resp?.data?.history?.map((r, i) => {
            return {
              srNo: i + 1,
              ...r,
            };
          });

          console.log("partplan certificate==", tempData);
          setTableData(tempData);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      // headerName: "Sr No",
      flex: 1,
      //minWidth: 70,
    },
    {
      field: "sentByUser",
      // headerName: <FormattedLabel id="applicationNo" />,
      headerName: <FormattedLabel id="sentbyuser" />,
      flex: 1,
      // minWidth: 260,
    },
    {
      field: "remark",
      // headerName: <FormattedLabel id="applicationDate" />,
      headerName: <FormattedLabel id="remark" />,
      flex: 1,
      // minWwidth: 230,
    },

    {
      field: "sentDate",
      // headerName: <FormattedLabel id="ApplicantName" />,
      headerName: <FormattedLabel id="date" />,
      flex: 1,
      // minWidth: 240,
      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
    },

    {
      field: "applicationSentTime",
      // headerName: <FormattedLabel id="statusDetails" />,
      headerName: <FormattedLabel id="time" />,
      flex: 1,
      // minWidth: 280,
    },
  ];

  useEffect(() => {
    console.log("tableData1212", tableData);
  }, [tableData]);

  useEffect(() => {
    console.log("props1212", props?.serviceId, props);
  }, [props]);

  return (
    <>
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
              <FormattedLabel id="applicationHis" />
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
          rows={tableData}
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
