/* eslint-disable react/jsx-key */
import {
  Button,
  Link,
  Grid,
  Tooltip,
  IconButton,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import * as MuiIcons from "@mui/icons-material";
import moment from "moment";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { GridToolbar } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import styles from "../dashboard/dashboard.module.css";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../URLS/urls";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../util/commonErrorUtil";

import dynamic from "next/dynamic";

const BachatgatDashboard = () => {
  const router = useRouter();
  const language = useSelector((state) => state.labels.language);
  const [totalCount, setTotalCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalElements, setTotalElements] = useState();
  const [bachatGatRegData, setBachatGatRegData] = useState([]);
  const [modificationTotalCount, setModificationTotalCount] = useState(0);
  const [modificationPendingCount, setModificationPendingCount] = useState(0);
  const [modificationCompletedCount, setModificationCompletedCount] =
    useState(0);
  const [pageSize, setPageSize] = useState();
  const [renewalTotalCount, setRenewalTotalCount] = useState(0);
  const [renewalPendingCount, setRenewalPendingCount] = useState(0);
  const [renewalCompletedCount, setRenewalCompletedCount] = useState(0);
  const [cancelTotalCount, setCancelTotalCount] = useState(0);
  const [cancelPendingCount, setCancelPendingCount] = useState(0);
  const [cancelCompletedCount, setCancelCompletedCount] = useState(0);
  const user = useSelector((state) => state.user.user);
  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [crAreaNames, setCRAreaName] = useState([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [routerCall, setRouterCall] = useState("");
  const [title, setTitle] = useState(null);

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

  const headers = {
    Authorization: `Bearer ${user.token}`,
  };

  const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

  const user1 = useSelector((state) => {
    let userNamed =
      state?.user?.user?.userDao && language === "en"
        ? state?.user?.user?.userDao.firstNameEn
        : state?.user?.user?.userDao && state?.user?.user?.userDao.firstNameMr;
    return userNamed;
  });

  const ComponentWithIcon = ({ iconName }) => {
    const Icon = MuiIcons[iconName];
    return <Icon style={{ fontSize: "30px" }} />;
  };

  useEffect(() => {
    getBachatgatRegistrationCount();
    getBachatgatCancellationCount();
    getBachatgatModificationCount();
    getBachatgatRenewalCount();
  }, []);

  useEffect(() => {
    getZoneName();
    getWardNames();
    getCRAreaName();
  }, []);

  useEffect(() => {
    getBachatgatRegistrationDetails();
    setHeader();
  }, [zoneNames && wardNames && crAreaNames]);

  // set Header
  const setHeader = () => {
    if (cardIndex == 0) {
      setTitle(<FormattedLabel id="titlaBRegTotal" />);
    } else if (cardIndex == 1) {
      setTitle(<FormattedLabel id="titleBRegPending" />);
    } else if (cardIndex == 2) {
      setTitle(<FormattedLabel id="titleBRegComplete" />);
    } else if (cardIndex == 3) {
      setTitle(<FormattedLabel id="titleBCancelTotal" />);
    } else if (cardIndex == 4) {
      setTitle(<FormattedLabel id="titleBCancelPending" />);
    } else if (cardIndex == 5) {
      setTitle(<FormattedLabel id="titleBCancelComplete" />);
    } else if (cardIndex == 6) {
      setTitle(<FormattedLabel id="titleBModiTotal" />);
    } else if (cardIndex == 7) {
      setTitle(<FormattedLabel id="titleBModiPending" />);
    } else if (cardIndex == 8) {
      setTitle(<FormattedLabel id="titleBModiComplete" />);
    } else if (cardIndex == 9) {
      setTitle(<FormattedLabel id="titleRenewalTotal" />);
    } else if (cardIndex == 10) {
      setTitle(<FormattedLabel id="titleRenewalPending" />);
    } else if (cardIndex == 10) {
      setTitle(<FormattedLabel id="titleRenewalComplete" />);
    }
  };

  // get zone
  const getZoneName = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, { headers: headers })
      .then((r) => {
        setZoneNames(
          r.data.zone.map((row) => ({
            id: row.id,
            zoneName: row.zoneName,
            zoneNameMr: row.zoneNameMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // get ward
  const getWardNames = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, { headers: headers })
      .then((r) => {
        setWardNames(
          r.data.ward.map((row) => ({
            id: row.id,
            wardName: row.wardName,
            wardNameMr: row.wardNameMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // get area
  const getCRAreaName = () => {
    axios
      .get(`${urls.CfcURLMaster}/area/getAll`, { headers: headers })
      .then((r) => {
        setCRAreaName(
          r.data.area.map((row) => ({
            id: row.id,
            crAreaName: row.areaName,
            crAreaNameMr: row.areaNameMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // get bachatgat reg count
  const getBachatgatRegistrationCount = () => {
    axios
      .get(`${urls.BSUPURL}/dashboard/getCountsForBachatGatRegistration`, {
        headers: headers,
      })
      .then((r) => {
        setTotalCount(r.data.totalApplicationsCount);
        setPendingCount(r.data.pendingApplicationsCount);
        setCompletedCount(r.data.completedApplicationsCount);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get bachatgat cancellation count
  const getBachatgatCancellationCount = () => {
    axios
      .get(`${urls.BSUPURL}/dashboard/getCountsForBachatGatancellation`, {
        headers: headers,
      })
      .then((r) => {
        setCancelTotalCount(r.data.totalApplicationsCount);
        setCancelPendingCount(r.data.pendingApplicationsCount);
        setCancelCompletedCount(r.data.completedApplicationsCount);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get bachatgat modification count
  const getBachatgatModificationCount = () => {
    axios
      .get(`${urls.BSUPURL}/dashboard/getCountsForBachatModification`, {
        headers: headers,
      })
      .then((r) => {
        setModificationTotalCount(r.data.totalApplicationsCount);
        setModificationPendingCount(r.data.pendingApplicationsCount);
        setModificationCompletedCount(r.data.completedApplicationsCount);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get bachatgat renewal count
  const getBachatgatRenewalCount = () => {
    axios
      .get(`${urls.BSUPURL}/dashboard/getCountsForBachatRenewal`, {
        headers: headers,
      })
      .then((r) => {
        setRenewalTotalCount(r.data.totalApplicationsCount);
        setRenewalPendingCount(r.data.pendingApplicationsCount);
        setRenewalCompletedCount(r.data.completedApplicationsCount);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get bachatgat reg details
  const getBachatgatRegistrationDetails = () => {
    axios
      .get(`${urls.BSUPURL}/dashboard/getTotalBachatGatRegistrationList`, {
        headers: headers,
      })
      .then((r) => {
        setRegDetails(r.data);
        setTotalElements(r.data.length);
        setRouterCall("bachatgatRegistration");

        // let result = r.data.trnBachatgatRegistrationList;
        // setRegDetails(result);
        // setTotalElements(r.data.totalElements);
        // setPageSize(r.data.pageSize);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // on card click get details
  const getRegDetails = (index) => {
    if (index == 1) {
      axios
        .get(`${urls.BSUPURL}/dashboard/getPendingBachatGatRegistrationList`, {
          headers: headers,
        })
        .then((r) => {
          setRegDetails(r.data);
          setTotalElements(r.data.length);
          setRouterCall("bachatgatRegistration");
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    } else if (index == 2) {
      axios
        .get(
          `${urls.BSUPURL}/dashboard/getCompletedBachatGatRegistrationList`,
          {
            headers: headers,
          }
        )
        .then((r) => {
          setRegDetails(r.data);
          setTotalElements(r.data.length);
          setRouterCall("bachatgatRegistration");
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    } else if (index == 3) {
      getBachatgatCancelDetails();
    } else if (index == 4) {
      axios
        .get(`${urls.BSUPURL}/dashboard/getPendingBachatGatCancellationList`, {
          headers: headers,
        })
        .then((r) => {
          setRegDetails(r.data);
          setTotalElements(r.data.length);
          setRouterCall("bachatgatCancellation");
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    } else if (index == 5) {
      axios
        .get(
          `${urls.BSUPURL}/dashboard/getCompletedBachatGatCancellationList`,
          {
            headers: headers,
          }
        )
        .then((r) => {
          setRegDetails(r.data);
          setTotalElements(r.data.length);
          setRouterCall("bachatgatCancellation");
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    } else if (index == 6) {
      getModificationDetails();
    } else if (index == 7) {
      axios
        .get(`${urls.BSUPURL}/dashboard/getPendingBachatModificationList`, {
          headers: headers,
        })
        .then((r) => {
          setRegDetails(r.data);
          setTotalElements(r.data.length);
          setRouterCall("bachatgatModification");
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    } else if (index == 8) {
      axios
        .get(`${urls.BSUPURL}/dashboard/getCompletedBachatModificationList`, {
          headers: headers,
        })
        .then((r) => {
          setRegDetails(r.data);
          setTotalElements(r.data.length);
          setRouterCall("bachatgatModification");
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    } else if (index == 9) {
      getRenewalDetails();
    } else if (index == 10) {
      axios
        .get(`${urls.BSUPURL}/dashboard/getPendingBachatRenewalList`, {
          headers: headers,
        })
        .then((r) => {
          setRegDetails(r.data);
          setTotalElements(r.data.length);
          setRouterCall("bachatgatRenewal");
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    } else if (index === 11) {
      axios
        .get(`${urls.BSUPURL}/dashboard/getCompletedBachatRenewalList`, {
          headers: headers,
        })
        .then((r) => {
          setRegDetails(r.data);
          setTotalElements(r.data.length);
          setRouterCall("bachatgatRenewal");
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  // get all bachatgat cancellation details
  const getBachatgatCancelDetails = () => {
    axios
      .get(`${urls.BSUPURL}/dashboard/getTotalBachatGatCancellationList`, {
        headers: headers,
      })
      .then((r) => {
        setRegDetails(r.data);
        setTotalElements(r.data.length);
        setRouterCall("bachatgatCancellation");

        // let result = r.data.trnBachatgatCancellationList;
        // setRegDetails(result);
        // setTotalElements(r.data.totalElements);
        // setPageSize(r.data.pageSize);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get all modiffication details
  const getModificationDetails = () => {
    axios
      .get(`${urls.BSUPURL}/dashboard/getTotalBachatGatModificationList`, {
        headers: headers,
      })
      .then((r) => {
        setRegDetails(r.data);
        setTotalElements(r.data.length);
        setRouterCall("bachatgatModification");

        // let result = r.data.trnBachatgatModificationList;
        // setRegDetails(result);
        // setTotalElements(r.data.totalElements);
        // setPageSize(r.data.pageSize);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get all renewal details
  const getRenewalDetails = () => {
    axios
      .get(`${urls.BSUPURL}/dashboard/getTotalBachatGatRenewalList`, {
        headers: headers,
      })
      .then((r) => {
        setRegDetails(r.data);
        setTotalElements(r.data.length);
        setRouterCall("bachatgatRenewal");

        // let result = r.data.trnBachatgatRenewalList;
        // setRegDetails(result);
        // setTotalElements(r.data.totalElements);
        // setPageSize(r.data.pageSize);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // Set regdetails on UI
  const setRegDetails = (result) => {
    let _res = result?.map((r, i) => {
      return {
        activeFlag: r.activeFlag,
        id: r.id,
        srNo: i + 1,
        zoneKey: zoneNames?.find((obj) => obj.id == r.zoneKey)?.zoneName
          ? zoneNames?.find((obj) => obj.id == r.zoneKey)?.zoneName
          : "-",
        zoneKeyMr: zoneNames?.find((obj) => obj.id == r.zoneKey)?.zoneNameMr
          ? zoneNames?.find((obj) => obj.id == r.zoneKey)?.zoneNameMr
          : "-",
        wardKey: wardNames?.find((obj) => obj.id == r.wardKey)?.wardName
          ? wardNames?.find((obj) => obj.id == r.wardKey)?.wardName
          : "-",
        wardKeyMr: wardNames?.find((obj) => obj.id == r.wardKey)?.wardNameMr
          ? wardNames?.find((obj) => obj.id == r.wardKey)?.wardNameMr
          : "-",
        areaKey: crAreaNames?.find((obj) => obj.id == r.areaKey)?.crAreaName
          ? crAreaNames?.find((obj) => obj.id == r.areaKey)?.crAreaName
          : "-",
        areaKeyMr: crAreaNames?.find((obj) => obj.id == r.areaKey)?.crAreaNameMr
          ? crAreaNames?.find((obj) => obj.id == r.areaKey)?.crAreaNameMr
          : "-",
        applicationNo: r.applicationNo,
        startDate: moment(r.startDate).format("DD-MM-YYYY"),
        fullName:
          r.applicantFirstName +
          " " +
          r.applicantMiddleName +
          " " +
          r.applicantLastName,
        totalMembersCount: r.totalMembersCount,
        currStatus:
          r.status === null
            ? "pending"
            : r.status === 0
            ? "Save As Draft"
            : r.status === 1
            ? "Send Bank To Citizen"
            : r.status === 2
            ? "Send To Samuha Sanghatak"
            : r.status === 3
            ? "Send To Dept Clerk"
            : r.status === 4
            ? "Send Back To Dept Clerk"
            : r.status === 5
            ? "Send To Asst Commissioner"
            : r.status === 6
            ? "Send Back To Asst Commissioner"
            : r.status === 7
            ? "Send To Dy Commissioner"
            : r.status === 8
            ? "Send Back To Dy Commissioner"
            : r.status === 9
            ? "Send To Accountant"
            : r.status === 16
            ? "Send Back To Dept Clerk After Approval Dy Commissioner"
            : r.status === 10
            ? "Complete"
            : r.status === 11
            ? "Close"
            : r.status === 12
            ? "Duplicate"
            : r.status === 22
            ? "Rejected"
            : r.status === 23
            ? "Send Back to Samuh Sanghtak"
            : r.status === 17
            ? "Modification In Progress "
            : r.status === 18
            ? "Modified"
            : "Invalid",
      };
    });
    setBachatGatRegData([..._res]);
  };

  // datatable columns
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language == "en" ? "zoneKey" : "zoneKeyMr",
      headerName: <FormattedLabel id="zoneName" />,
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language == "en" ? "wardKey" : "wardKeyMr",
      headerName: <FormattedLabel id="wardname" />,
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language == "en" ? "areaKey" : "areaKeyMr",
      headerName: <FormattedLabel id="areaNm" />,
      width: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "applicationNo",
      headerName: <FormattedLabel id="applicationNo" />,
      width: 350,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "totalMembersCount",
      headerName: <FormattedLabel id="totalMembersCount" />,
      width: 220,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "fullName",
      headerName: <FormattedLabel id="applicantName" />,
      width: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "startDate",
      headerName: <FormattedLabel id="startDate" />,
      width: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "currStatus",
      headerName: <FormattedLabel id="currentStatus" />,
      width: 350,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: "actions",
    //   headerName: <FormattedLabel id="actions" />,
    //   width: 150,
    //   sortable: false,
    //   disableColumnMenu: true,
    //   renderCell: (params) => {
    //     return (
    //       <Box>
    //         <IconButton
    //           onClick={() => {
    //             // handleViewActions(params.row);
    //             // addDataToLocalStorage("BachatgatData", params?.row);
    //             // setSendData(params.row);
    //             router.push({
    //               pathname:
    //                 "/BsupNagarvasthi/transaction/bachatgatRegistration/view",
    //               query: {
    //                 id: params.row.id,
    //               },
    //             });
    //           }}
    //         >
    //           <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
    //         </IconButton>
    //       </Box>
    //     );
    //   },
    // },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const handleRouteChange = (id) => {
          let pathname = "";
          if (routerCall === "bachatgatRegistration") {
            pathname =
              "/BsupNagarvasthi/transaction/bachatgatRegistration/view";
          } else if (routerCall === "bachatgatCancellation") {
            pathname =
              "/BsupNagarvasthi/transaction/bachatGatCancellation/view";
          } else if (routerCall === "bachatgatModification") {
            pathname =
              "/BsupNagarvasthi/transaction/bachatgatModification/view";
          } else if (routerCall === "bachatgatRenewal") {
            pathname = "/BsupNagarvasthi/transaction/bachatgatRenewal/view";
          }

          router.push({
            pathname,
            query: {
              id: params.row.id,
            },
          });
        };

        return (
          <Box>
            <IconButton onClick={() => handleRouteChange(params.row.id)}>
              <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  // ui
  return (
    <>
      {/* <Paper
        elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginLeft: "10px",
          marginRight: "10px",
          marginTop: "10px",
          marginBottom: "60px",
          padding: 1,
        }}
      >*/}
      <Box>
        <Box
          sx={{
            display: "flex",
            padding: "30px",

            flexDirection: "column",
          }}
        >
          {/*<Typography>
              <p className={styles.fancy_link}>
                <>
                  <FormattedLabel id="welcomeToTheDashboard" />{" "}
                  <strong>{user1}</strong>{" "}
                </>
              </p>
            </Typography> */}
          {/* .......................CARDS............................ */}
          <Grid container style={{ display: "flex", justifyContent: "center" }}>
            {[
              {
                id: 1,
                icon: "Menu",
                count: totalCount,
                name: <FormattedLabel id="bachatGatRegTotalCount" />,
                bg: "#7F00FF",
              },
              {
                id: 2,
                icon: "Menu",
                count: pendingCount,
                name: <FormattedLabel id="bachatGatRegPendingCount" />,
                bg: "#00FF00",
              },
              {
                id: 3,
                icon: "Menu",
                count: completedCount,
                name: <FormattedLabel id="bachatGatRegCompletedCount" />,
                bg: "#dc143c",
              },
              {
                id: 4,
                icon: "Menu",
                count: cancelTotalCount,
                name: <FormattedLabel id="bachatGatCancelTotalCount" />,
                bg: "#FFC0CB",
              },
              {
                id: 5,
                icon: "Menu",
                count: cancelPendingCount,
                name: <FormattedLabel id="bachatGatCancelPendingCount" />,
                bg: "red",
              },
              {
                id: 6,
                icon: "Menu",
                count: cancelCompletedCount,
                name: <FormattedLabel id="bachatGatCancelCompleteCount" />,
                bg: "#FFA500",
              },
              {
                id: 7,
                icon: "Menu",
                count: modificationTotalCount,
                name: <FormattedLabel id="bachatGatModiTotalCount" />,
                bg: "#7F00FF",
              },
              {
                id: 8,
                icon: "Menu",
                count: modificationPendingCount,
                name: <FormattedLabel id="bachatGatModiPendingCount" />,
                bg: "#00FF00",
              },
              {
                id: 9,
                icon: "Menu",
                count: modificationCompletedCount,
                name: <FormattedLabel id="bachatGatModiCompleteCount" />,
                bg: "#dc143c",
              },
              {
                id: 10,
                icon: "Menu",
                count: renewalTotalCount,
                name: <FormattedLabel id="bachatGatRenewTotalCount" />,
                bg: "#FFC0CB",
              },
              {
                id: 11,
                icon: "Menu",
                count: renewalPendingCount,
                name: <FormattedLabel id="bachatGatRenewPendingCount" />,
                bg: "red",
              },
              {
                id: 12,
                icon: "Menu",
                count: renewalCompletedCount,
                name: <FormattedLabel id="bachatGatRenewCompleteCount" />,
                bg: "#FFA500",
              },
            ].map((val, id) => {
              return (
                <Tooltip title={val.name}>
                  <Grid
                    key={id}
                    item
                    xs={4}
                    style={{
                      paddingTop: "10px",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      paddingBottom: "0px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Grid
                      container
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "10px",
                        borderRadius: "15px",
                        backgroundColor: "white",
                        height: "100%",
                      }}
                      sx={{
                        ":hover": {
                          boxShadow: "0px 5px #556CD6",
                        },
                      }}
                      boxShadow={3}
                    >
                      <Grid
                        item
                        xs={2}
                        style={{
                          padding: "5px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: val.bg,
                          color: "white",
                          borderRadius: "7px",
                        }}
                        boxShadow={2}
                      >
                        <ComponentWithIcon iconName={val.icon} />
                      </Grid>
                      <Grid
                        item
                        xs={10}
                        style={{
                          padding: "10px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          style={{
                            fontWeight: "500",
                            fontSize: "25px",
                            color: "#556CD6",
                          }}
                        >
                          {val.count}
                        </Typography>
                        {val.id === 1 && (
                          <Link
                            style={{ fontWeight: "600" }}
                            onClick={() => {
                              setCardIndex(0);
                              getBachatgatRegistrationDetails();
                            }}
                            tabIndex={0}
                            component="button"
                          >
                            {val.name}
                          </Link>
                        )}
                        {val.id === 2 && (
                          <Link
                            style={{ fontWeight: "600" }}
                            onClick={() => {
                              setCardIndex(1);
                              getRegDetails(1);
                            }}
                            tabIndex={0}
                            component="button"
                          >
                            {val.name}
                          </Link>
                        )}

                        {val.id === 3 && (
                          <Link
                            style={{ fontWeight: "600" }}
                            onClick={() => {
                              setCardIndex(2);
                              getRegDetails(2);
                            }}
                            tabIndex={0}
                            component="button"
                          >
                            {val.name}
                          </Link>
                        )}
                        {val.id === 4 && (
                          <Link
                            style={{ fontWeight: "600" }}
                            onClick={() => {
                              setCardIndex(3);
                              getRegDetails(3);
                            }}
                            tabIndex={0}
                            component="button"
                          >
                            {val.name}
                          </Link>
                        )}
                        {val.id === 5 && (
                          <Link
                            style={{ fontWeight: "600" }}
                            onClick={() => {
                              setCardIndex(4);
                              getRegDetails(4);
                            }}
                            tabIndex={0}
                            component="button"
                          >
                            {val.name}
                          </Link>
                        )}
                        {val.id === 6 && (
                          <Link
                            style={{ fontWeight: "600" }}
                            onClick={() => {
                              setCardIndex(5);
                              getRegDetails(5);
                            }}
                            tabIndex={0}
                            component="button"
                          >
                            {val.name}
                          </Link>
                        )}
                        {val.id === 7 && (
                          <Link
                            style={{ fontWeight: "600" }}
                            onClick={() => {
                              setCardIndex(6);
                              getRegDetails(6);
                            }}
                            tabIndex={0}
                            component="button"
                          >
                            {val.name}
                          </Link>
                        )}
                        {val.id === 8 && (
                          <Link
                            style={{ fontWeight: "600" }}
                            onClick={() => {
                              setCardIndex(7);
                              getRegDetails(7);
                            }}
                            tabIndex={0}
                            component="button"
                          >
                            {val.name}
                          </Link>
                        )}
                        {val.id === 9 && (
                          <Link
                            style={{ fontWeight: "600" }}
                            onClick={() => {
                              setCardIndex(8);
                              getRegDetails(8);
                            }}
                            tabIndex={0}
                            component="button"
                          >
                            {val.name}
                          </Link>
                        )}
                        {val.id === 10 && (
                          <Link
                            style={{ fontWeight: "600" }}
                            onClick={() => {
                              setCardIndex(9);
                              getRegDetails(9);
                            }}
                            tabIndex={0}
                            component="button"
                          >
                            {val.name}
                          </Link>
                        )}
                        {val.id === 11 && (
                          <Link
                            style={{ fontWeight: "600" }}
                            onClick={() => {
                              setCardIndex(10);
                              getRegDetails(10);
                            }}
                            tabIndex={0}
                            component="button"
                          >
                            {val.name}
                          </Link>
                        )}
                        {val.id === 12 && (
                          <Link
                            style={{ fontWeight: "600" }}
                            onClick={() => {
                              setCardIndex(11);
                              getRegDetails(11);
                            }}
                            tabIndex={0}
                            component="button"
                          >
                            {val.name}
                          </Link>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Tooltip>
              );
            })}
          </Grid>
        </Box>

        {/* <Grid container style={{ display: "flex", justifyContent: "center" }}>
            
                <Tooltip >
                  <Grid
                    item
                    xs={4}
                    style={{
                      paddingTop: "10px",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      paddingBottom: "0px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Grid
                      container
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "10px",
                        borderRadius: "15px",
                        backgroundColor: "white",
                        height: "100%",
                      }}
                      sx={{
                        ":hover": {
                          boxShadow: "0px 5px #556CD6",
                        },
                      }}
                      boxShadow={3}
                    >
                      
                      <Grid
                        item
                        xs={12}
                        style={{
                          padding: "10px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          style={{
                            fontWeight: "500",
                            fontSize: "25px",
                            color: "#556CD6",
                          }}
                        >
                          <Chart
                      options={{
                        chart: {
                          id: "basic-pie",
                        },
                        labels: ["Total Applications", "Pending Applications","Completed Applications"],
                        responsive: [
                          {
                            breakpoint: 480,
                            options: {
                              chart: {
                                width: 200,
                              },
                              legend: {
                                position: "bottom",
                              },
                            },
                          },
                        ],
                      }}
                      series={[200,30,10]}
                      overflowX='hide'
                      type="pie"
                      width={400}
                      height={400}
                    />
                        </Typography>
                        
                      </Grid>
                    </Grid>
                  </Grid>
                </Tooltip>
              
          </Grid> */}

        {/* 2 charts try */}
        {/* <Box sx={{
            display: "flex",
            padding: "30px",

            flexDirection: "column",
          }}>
            
                    <Chart
                      options={{
                        chart: {
                          id: "basic-pie",
                        },
                        labels: ["Total Applications", "Pending Applications","Completed Applications"],
                        responsive: [
                          {
                            breakpoint: 480,
                            options: {
                              chart: {
                                width: 200,
                              },
                              legend: {
                                position: "bottom",
                              },
                            },
                          },
                        ],
                      }}
                      series={[200,30,10]}

                      type="pie"
                      width={400}
                      height={600}
                    />
                  
                    <Chart
                      options={{
                        chart: {
                          id: "basic-pie",
                        },
                        labels: ["Total Applications", "Pending Applications","Completed Applications"],
                        responsive: [
                          {
                            breakpoint: 480,
                            options: {
                              chart: {
                                width: 200,
                              },
                              legend: {
                                position: "bottom",
                              },
                            },
                          },
                        ],
                      }}
                      series={[200,30,10]}

                      type="pie"
                      width={400}
                      height={600}
                    />
                  
            </Box> */}

        {/* New try for 2 charts in same row and responsive */}
        {/* <Box sx={{
  display: "flex",
  padding: "30px",
  flexDirection: ["column", "row"], // Set the flexDirection to "row" for larger screen sizes
  flexWrap: "wrap", // Allow charts to wrap to the next row if necessary
  justifyContent: "space-around", // Distribute the charts evenly along the row

  // Add any other styling properties you may need...
}}>
  <Chart
    options={{
      chart: {
        id: "basic-pie-1", // Use a unique id for each chart
      },
      labels: ["Total Applications", "Pending Applications", "Completed Applications"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    }}
    series={[200, 30, 10]}
    type="pie"
    width={400}
    height={300} // Adjust the height to your preference
  />

  <Chart
    options={{
      chart: {
        id: "basic-pie-2", // Use a unique id for each chart
      },
      labels: ["Total Applications", "Pending Applications", "Completed Applications"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    }}
    series={[200, 30, 10]}
    type="pie"
    width={400}
    height={300} // Adjust the height to your preference
  />
</Box> */}

        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            {cardIndex == 0
              ? "Bachatgat Registration (Total)"
              : cardIndex == 1
              ? "Bachatgat Registration (Pending)"
              : cardIndex == 2
              ? "Bachatgat Registration (Completed)"
              : cardIndex == 3
              ? "Bachatgat Cancellation (Total)"
              : cardIndex == 4
              ? "Bachatgat Cancellation (Pending)"
              : cardIndex == 5
              ? "Bachatgat Cancellation (Completed)"
              : cardIndex == 6
              ? "Bachatgat Modification (Total)"
              : cardIndex == 7
              ? "Bachatgat Modification (Pending)"
              : cardIndex == 8
              ? "Bachatgat Modification (Completed)"
              : cardIndex == 9
              ? "Bachatgat Renewal (Total)"
              : cardIndex == 10
              ? "Bachatgat Renewal (Pending)"
              : cardIndex == 11
              ? "Bachatgat Renewal (Completed)"
              : ""}
          </h2>
        </Box>
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
            "& .MuiDataGrid-toolbarContainer .MuiButton-root[aria-label='Export']":
              {
                display: "none",
              },
          }}
          density="standard"
          pagination
          rowCount={bachatGatRegData.length}
          pageSize={10}
          rowsPerPageOptions={[10]}
          rows={bachatGatRegData}
          columns={columns}
          onPageChange={(_data) => {}}
          onPageSizeChange={(_data) => {}}
        />
      </Box>
      {/* // </Paper> */}
    </>
  );
};

export default BachatgatDashboard;
