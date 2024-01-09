import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Grid, IconButton, Paper, Tooltip } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import {
  setSelectedNotice,
  setSelectedParawisePoints,
} from "../../../../features/userSlice";
import urls from "../../../../URLS/urls";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// Created By - Sachin Durge
const Index = () => {
  const router = useRouter();
  const [dataSource, setDataSource] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [noticeResponse, setNoticeResponse] = useState([]);
  const [loadderState, setLoadderState] = useState(false);
  let user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [authority, setAuthority] = useState([]);
  let tableData0 = [];
  let tableData = [];
  let tableData1 = [];
  let tableData2 = [];
  let tableData3 = [];
  let tableData4 = [];
  let tableData5 = [];
  let tableData6 = [];
  let tableData7 = [];
  let tableData8 = [];
  let tableData9 = [];
  let tableData10 = [];
  let tableData11 = [];
  let tableData12 = [];
  let tableData13 = [];

  // drawer
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );
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

  // authority

  // columns
  const columns = [
    {
      headerName: <FormattedLabel id="srNo" />,
      field: "srNo",
      width: 60,
      align: "center",
      headerAlign: "center",
    },
    {
      headerName: <FormattedLabel id="noticeDate" />,
      field: "noticeDate",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   headerName: <FormattedLabel id="timeStamp" />,
    //   field: "timeStamp",
    //   width: 120,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      headerName: <FormattedLabel id="noticeReceivedFromAdvocatePerson" />,
      field: "noticeReceivedFromAdvocatePerson",
      width: 250,
      align: "center",
      headerAlign: "center",
    },

    {
      headerName: "Status",
      field: "status",
      width: 280,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span>{params.value}</span>
        </Tooltip>
      ),
    },
    {
      //<FormattedLabel id="action" />,
      headerName: "departmentListString",
      field: "departmentListString",
    },
    {
      //isMyDepartment
      headerName: "isMyDepartment",
      field: "isMyDepartment",
    },
    {
      field: "Action",
      headerName: "Action",
      flex: 1,
      align: "center",
      headerAlign: "center",

      renderCell: (params) => {
        return (
          <>
            {/* NOTICE_DRAFT */}
            {(authority?.includes("NOTICE_ENTRY") ||
              authority?.includes("NOTICE_CREATED")) &&
              (params.row.status === "NOTICE_DRAFT" ||
                params.row.status === "NOTICE_CREATED") && (
                <Button
                  variant="outlined"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    localStorage.removeItem("noticeAttachment");
                    localStorage.removeItem("rowsData");
                    localStorage.setItem("pageMode", "NOTICE_CREATE"),
                      localStorage.setItem(
                        "noticeID",
                        JSON.stringify(params?.row?.id)
                      ),
                      router.push({
                        pathname: "/LegalCase/transaction/Notice",
                      });
                  }}
                >
                  EDIT NOTICE
                </Button>
              )}

            {/* NOTICE_APPROVAL */}
            {authority?.includes("NOTICE_APPROVAL") &&
              params.row.status === "NOTICE_CREATED" && (
                <Button
                  variant="outlined"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    console.log("543", params.row);
                    dispatch(setSelectedNotice(params.row));
                    router.push({
                      pathname: "/LegalCase/transaction/Notice/NoticeApproval",
                    });
                  }}
                >
                  NOTICE APPROVAL
                </Button>
              )}
            {/* PARAWISE_ENTRY */}
            {authority?.includes("PARAWISE_REPORT_ENTRY") &&
              params.row.status === "NOTICE_APPROVED_BY_LEGAL_HOD" && (
                // params.row.status === "PARAWISE_REPORT_DRAFT") && (
                <Button
                  variant="outlined"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    dispatch(setSelectedNotice(params.row));

                    router.push({
                      pathname: "/LegalCase/transaction/Notice/ParawiseEntry",
                    });
                  }}
                >
                  PARAWISE ENTRY
                </Button>
              )}

            {/* PARAWISE_REPORT_EDIT */}
            {authority?.includes("PARAWISE_REPORT_ENTRY") &&
              params.row.status === "PARAWISE_REPORT_DRAFT" && (
                <Button
                  variant="outlined"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    dispatch(setSelectedNotice(params.row));
                    router.push({
                      pathname:
                        "/LegalCase/transaction/parawiseReport/editParawiseReport",
                    });
                  }}
                >
                  EDIT PARAWISE REPORT
                </Button>
              )}

            {/* PARAWISE_APPROVAL */}
            {authority?.includes("PARAWISE_REPORT_APPROVAL") &&
              params.row.status === "NOTICE_APPROVED_BY_LEGAL_HOD" && (
                <Button
                  variant="outlined"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    dispatch(setSelectedNotice(params.row));

                    router.push({
                      pathname:
                        "/LegalCase/transaction/Notice/ParawiseApproval",
                    });
                  }}
                >
                  PARAWISE APPROVAL
                </Button>
              )}

            {/* RESPONSE_TO_NOTICE_ENTRY */}
            {authority?.includes("RESPONSE_TO_NOTICE_ENTRY") &&
              params.row.status === "PARAWISE_REPORT_APPROVED" && (
                <Button
                  variant="outlined"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    dispatch(setSelectedNotice(params.row));

                    router.push({
                      pathname:
                        "/LegalCase/transaction/responseToNotice/addForm",
                    });
                  }}
                >
                  RESPONSE TO NOTICE ENTRY
                </Button>
              )}

            {/* RESPONSE_TO_NOTICE_EDIT */}
            {authority?.includes("RESPONSE_TO_NOTICE_ENTRY") &&
              params.row.status === "RESPONSE_TO_NOTICE_DRAFT" && (
                <Button
                  variant="outlined"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    dispatch(setSelectedNotice(params.row));
                    router.push({
                      pathname:
                        "/LegalCase/transaction/responseToNotice/editResponseToNotice",
                      query: {
                        showNoticeAttachment: false,
                        pageMode: "Edit",
                        ...params.row,
                      },
                    });
                  }}
                >
                  EDIT RESPONSE TO NOTICE
                </Button>
              )}

            {/* RESPONSE TO NOTICE APPROVAL */}
            {authority?.includes("RESPONSE_TO_NOTICE_APPROVAL") &&
              params.row.status === "RESPONSE_TO_NOTICE_CREATED" && (
                <Button
                  variant="outlined"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    dispatch(setSelectedNotice(params.row));

                    router.push({
                      pathname:
                        "/LegalCase/transaction/responseToNotice/sendNotice",
                      query: {
                        showNoticeAttachment: false,
                        pageMode: "Edit",
                        ...params.row,
                      },
                    });
                  }}
                >
                  RESPONSE TO NOTICE APPROVAL
                </Button>
              )}
            {authority?.includes("FINAL_APPROVAL") &&
              params.row.status ===
                "RESPONSE_TO_NOTICE_APPROVED_BY_LEGAL_HOD" && (
                <Button
                  variant="outlined"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    dispatch(setSelectedNotice(params.row));

                    router.push({
                      pathname:
                        "/LegalCase/transaction/responseToNotice/sendNotice",
                      query: {
                        showNoticeAttachment: false,
                        pageMode: "Final",
                        ...params.row,
                      },
                    });
                  }}
                >
                  FINAL APPROVAL
                </Button>
              )}
            {authority?.includes("FINAL_APPROVAL") &&
              params.row.status === "FINAL_APPROVED" && (
                <Button
                  variant="outlined"
                  sx={{
                    cursor: "pointer",
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                    backgroundColor: "green",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#fff",
                      color: "#556CD6",
                    },
                  }}
                  onClick={() => {
                    dispatch(setSelectedNotice(params.row));
                    router.push({
                      pathname:
                        "/LegalCase/transaction/newNotice/digitalSignature",
                      query: {
                        pageMode: "Final",
                        ...params.row,
                      },
                    });
                  }}
                >
                  {/* DIGITAL SIGNATURE */}
                  SIGN AND APPROVE
                </Button>
              )}
            {authority?.includes("NOTICE_ENTRY") &&
              params.row.status === "NOTICE_REASSIGNED" && (
                <Button
                  variant="outlined"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    console.log(" params.row.", params.row.id);
                    // // dispatch(setSelectedNotice(params.row));
                    // localStorage.removeItem("noticeAttachment");
                    // localStorage.removeItem("rowsData");
                    // localStorage.setItem("noticeID", null);
                    // localStorage.setItem("pageMode", "NOTICE_CREATE"),
                    router.push({
                      pathname: "/LegalCase/transaction/newNotice/editNotice",
                      query: {
                        pageMode: "Edit",
                        ...params.row,
                      },
                    });
                  }}
                >
                  EDIT NOTICE
                </Button>
              )}

            {authority?.includes("RESPONSE_TO_NOTICE_ENTRY") &&
              params.row.status === "RESPONSE_TO_NOTICE_REASSIGNED" && (
                <Button
                  variant="outlined"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    dispatch(setSelectedNotice(params.row));
                    router.push({
                      pathname:
                        "/LegalCase/transaction/responseToNotice/editResponseToNotice",
                      query: {
                        pageMode: "Edit",
                        ...params.row,
                      },
                    });
                  }}
                >
                  EDIT RESPONSE TO NOTICE
                </Button>
              )}
            {authority?.includes("PARAWISE_REPORT_ENTRY") &&
              params.row.status === "PARAWISE_REPORT_REASSIGNED" && (
                <Button
                  variant="outlined"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    dispatch(setSelectedNotice(params.row));
                    dispatch(
                      setSelectedParawisePoints(
                        params.row.parawiseTrnParawiseReportDaoLst
                      )
                    );
                    router.push({
                      pathname:
                        "/LegalCase/transaction/parawiseReport/editParawiseReport",
                      query: {
                        pageMode: "Edit",
                        ...params.row,
                      },
                    });
                  }}
                >
                  EDIT PARAWISE REPORT
                </Button>
              )}
          </>
        );
      },
    },
  ];

  // departments
  const getDepartments = () => {
    setLoadderState(true);
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (
          res?.status == 200 ||
          res?.status == 201 ||
          res?.status == "SUCCESS"
        ) {
          setDepartments(
            res.data.department.map((r) => ({
              id: r.id,
              department: r.department,
              departmentMr: r.departmentMr,
            }))
          );
          setLoadderState(false);
        } else {
          setLoadderState(false);
          //
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  let tempStatues = [];

  if (authority.includes("") || authority.includes("")) {
    if (authority.includes("NOTICE_APPROVAL")) {
      tempStatues = push("NOTICE_CREATED");
    }
    if (authority.includes("NOTICE_ENTRY")) {
      tempStatues = push("NOTICE_DRAFT");
    }
    if (authority.includes("NOTICE_ENTRY")) {
      tempStatues = push("NOTICE_DRAFT");
    }
  }

  // Notice
  const getNotices = () => {
    setLoadderState(true);
    let statuses = [];
    statuses = [
      "NOTICE_DRAFT",
      "NOTICE_REASSIGNED",
      "NOTICE_CREATED",
      "NOTICE_APPROVED_BY_LEGAL_HOD",
      "PARAWISE_REPORT_DRAFT",
      "PARAWISE_REPORT_REASSIGNED",
      "PARAWISE_REPORT_CREATED",
      "PARAWISE_REPORT_APPROVED",
      "RESPONSE_TO_NOTICE_DRAFT",
      "RESPONSE_TO_NOTICE_REASSIGNED",
      "RESPONSE_TO_NOTICE_CREATED",
      "RESPONSE_TO_NOTICE_APPROVED_BY_LEGAL_HOD",
      "FINAL_APPROVED",
    ];

    if (statuses != null || statuses !== undefined) {
      axios
        .post(
          `${urls.LCMSURL}/notice/getTrnNoticeByStatus`,
          { statuses },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((resp) => {
          console.log("noticeDataewe", resp?.data);
          if (
            resp?.status == 200 ||
            resp?.status == 201 ||
            resp?.status == "SUCCESS"
          ) {
            setNoticeResponse(resp?.data);
            setLoadderState(false);
          } else {
            setLoadderState(false);
            //
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    }
  };

  // filter notice based on role
  const handleDepartmentAndNoticeData = () => {
    console.log("user", user);

    console.log("noticeResponse.length", noticeResponse);
    setLoadderState(false);

    if (authority.find((val) => val === "NOTICE_CREATED")) {
      console.log("rljflfdldfkdfldfdsf", noticeResponse);
      tableData0 = noticeResponse?.filter((data, index) => {
        return data.status === "NOTICE_CREATED";
      });
    }

    if (authority.find((val) => val === "NOTICE_ENTRY")) {
      tableData1 = noticeResponse?.filter((data, index) => {
        return data.status === "NOTICE_DRAFT";
      });
    }
    if (authority.find((val) => val === "NOTICE_APPROVAL")) {
      tableData2 = noticeResponse?.filter((data, index) => {
        return data.status === "NOTICE_CREATED";
      });
    }

    if (authority.find((val) => val === "PARAWISE_REPORT_ENTRY")) {
      tableData3 = noticeResponse.filter((data, index) => {
        return data.status === "NOTICE_APPROVED_BY_LEGAL_HOD";
      });
    }

    if (authority.find((val) => val === "PARAWISE_REPORT_ENTRY")) {
      tableData4 = noticeResponse.filter((data, index) => {
        return data.status === "PARAWISE_REPORT_DRAFT";
      });
    }

    if (authority.find((val) => val === "PARAWISE_REPORT_APPROVAL")) {
      tableData5 = noticeResponse.filter((data, index) => {
        return data.status === "NOTICE_APPROVED_BY_LEGAL_HOD";
      });
    }

    if (authority.find((val) => val === "RESPONSE_TO_NOTICE_ENTRY")) {
      tableData6 = noticeResponse.filter((data, index) => {
        return data.status === "PARAWISE_REPORT_APPROVED";
      });
    }

    if (authority.find((val) => val === "RESPONSE_TO_NOTICE_ENTRY")) {
      tableData7 = noticeResponse.filter((data, index) => {
        return data.status === "RESPONSE_TO_NOTICE_DRAFT";
      });
    }

    if (authority.find((val) => val === "RESPONSE_TO_NOTICE_APPROVAL")) {
      tableData8 = noticeResponse.filter((data, index) => {
        return data.status === "RESPONSE_TO_NOTICE_CREATED";
      });
    }

    if (authority.find((val) => val === "FINAL_APPROVAL")) {
      tableData9 = noticeResponse.filter((data, index) => {
        return data.status === "RESPONSE_TO_NOTICE_APPROVED_BY_LEGAL_HOD";
      });
    }

    if (authority.find((val) => val === "FINAL_APPROVAL")) {
      tableData10 = noticeResponse.filter((data, index) => {
        return data.status === "FINAL_APPROVED";
      });
    }

    if (authority.find((val) => val === "NOTICE_ENTRY")) {
      tableData11 = noticeResponse.filter((data, index) => {
        return data.status === "NOTICE_REASSIGNED";
      });
    }

    if (authority.find((val) => val === "RESPONSE_TO_NOTICE_ENTRY")) {
      tableData12 = noticeResponse.filter((data, index) => {
        return data.status === "RESPONSE_TO_NOTICE_REASSIGNED";
      });
    }

    if (authority.find((val) => val === "PARAWISE_REPORT_ENTRY")) {
      tableData13 = noticeResponse.filter((data, index) => {
        return data.status === "PARAWISE_REPORT_REASSIGNED";
      });
    }

    console.log("tableData0", tableData0);

    tableData = [
      ...tableData0,
      ...tableData1,
      ...tableData2,
      ...tableData3,
      ...tableData4,
      ...tableData5,
      ...tableData6,
      ...tableData7,
      ...tableData8,
      ...tableData9,
      ...tableData10,
      ...tableData11,
      ...tableData12,
      ...tableData13,
    ];

    console.log("tableData324234", tableData);

    let _res = tableData.map((r, i) => {
      console.log("noticeResponse TD", r);
      return {
        srNo: i + 1,
        id: r.id,
        remark: r.remark ? r.remark : "-",
        noticeRecivedDate: r.noticeRecivedDate ? r.noticeRecivedDate : "-",
        requisitionDate: r.requisitionDate ? r.requisitionDate : "-",
        concernDeptUserList: r.concernDeptUserList
          ? r.concernDeptUserList
          : "-",
        noticeDate: r.noticeDate ? r.noticeDate : "-",
        noticeReceivedFromAdvocatePerson: r.noticeRecivedFromAdvocatePerson
          ? r.noticeRecivedFromAdvocatePerson
          : "-",
        noticeReceivedFromAdvocatePersonMr: r.noticeRecivedFromAdvocatePerson
          ? r.noticeRecivedFromAdvocatePersonMr
          : "-",
        departmentName: departments?.data?.department?.find(
          (obj) => obj?.id === r.department
        )?.department
          ? departments?.data?.department?.find(
              (obj) => obj?.id === r.department
            )?.department
          : "-",
        attachedFile: r.attachedFile ? r.attachedFile : "-",
        status: r.status ? r.status : "-",
        noticeAttachment: r.noticeAttachment ? r.noticeAttachment : "-",
        noticeHisotry: r.noticeHisotry ? r.noticeHisotry : "-",
        parawiseTrnParawiseReportDaoLst: r.parawiseTrnParawiseReportDaoLst
          ? r.parawiseTrnParawiseReportDaoLst
          : "-",
        noticeDetails: r.noticeDetails ? r.noticeDetails : "-",
        noticeDetailsMr: r.noticeDetails ? r.noticeDetailsMr : "-",
        remark: r.remark ? r.remark : "-",
        advocateAddress: r.advocateAddress ? r.advocateAddress : "-",
        advocateAddressMr: r.advocateAddress ? r.advocateAddressMr : "-",
        timeStamp: r.timeStamp ? r.timeStamp : "-",
        inwardNo: r.inwardNo ? r.inwardNo : "-",
        departmentListString: r.departmentListString
          ? r.departmentListString
          : "",
        isMyDepartment: r.departmentListString
          ?.split(",")
          .includes(user.userDao?.department?.toString()),
      };
    });

    // filter _res where isMyDepartment is true
    let res = _res.filter((r) => r.isMyDepartment);

    setDataSource(_res);
    setLoadderState(false);
  };

  useEffect(() => {
    const authority = user?.menus?.find((r) => {
      return r.id == selectedMenuFromDrawer;
    })?.roles;
    setAuthority(authority);
    getDepartments();
  }, []);

  useEffect(() => {
    console.log("departments", departments);
    getNotices();
  }, [departments, authority]);

  useEffect(() => {
    console.log("noticeResponse", noticeResponse);
    handleDepartmentAndNoticeData();
  }, [noticeResponse]);

  useEffect(() => {
    console.log("dataSource", dataSource);
  }, [dataSource]);

  useEffect(() => {
    console.log("loadderState", loadderState);
  }, [loadderState]);

  return (
    <>
      <Paper
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
      >
        {/* New Header */}

        <Grid
          container
          style={{
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <IconButton>
            <ArrowBackIcon
              onClick={() => {
                router.back();
              }}
            />
          </IconButton>

          <Grid item xs={11}>
            <h2
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                //background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
              }}
            >
              {" "}
              <FormattedLabel id="notice" />
            </h2>
          </Grid>
        </Grid>

        {/* For Header */}
        {/* <Box
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            {" "}
            <FormattedLabel id="notice" />
          </h2>
        </Box> */}

        <Box>
          {loadderState ? (
            // <Box sx={{}}>
            <Loader />
          ) : (
            // </Box>
            <Grid container sx={{ marginTop: "10px" }}>
              <Grid item xs={10}></Grid>
              <Grid item xs={2} sx={{ paddingBottom: "5px" }}>
                {authority?.includes("NOTICE_ENTRY") ? (
                  <Button
                    // type="primary"
                    variant="contained"
                    size="small"
                    style={{
                      marginLeft: "50px",
                    }}
                    onClick={() => {
                      localStorage.removeItem("noticeAttachment");
                      localStorage.removeItem("rowsData");
                      localStorage.setItem("noticeID", null);
                      localStorage.setItem("pageMode", "NOTICE_CREATE"),
                        router.push({
                          pathname: "/LegalCase/transaction/Notice",
                        });
                    }}
                    endIcon={<AddIcon />}
                  >
                    {/* Create Notice */}
                    <FormattedLabel id="createNotice" />
                  </Button>
                ) : (
                  ""
                )}
              </Grid>
              {console.log("dataSource", dataSource)}

              <Grid item xs={12}>
                {/* <Box
            sx={{
              margin: 5,
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <FormControl
              // error={!!errors.department}
              variant="standard"
              sx={{
                width: "40%",
                backgroundColor: "white",
              }}
            >
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Select Notice Type"
                value={selectedNoticeType}
                sx={{ backgroundColor: "white" }}
                onChange={(value) => {
                  setSelectedNoticeType(value.target.value);
                  if ("Inbox Notice" === value.target.value) {
                    getIncomingNoticesByUser();
                  } else if ("Outbox Notice" === value.target.value) {
                    getSentNoticesByUser();
                  } else {
                    getCreatedNoticeByUser();
                  }
                }}
              >
                {["Created Notice", "Inbox Notice", "Outbox Notice"].map(
                  (department, index) => (
                    <MenuItem key={index} value={department}>
                      {department}
                    </MenuItem>
                  )
                )}
              </Select>

              <FormHelperText>
                {errors?.department ? errors?.department.message : null}
              </FormHelperText>
            </FormControl>
          </Box> */}

                <Box
                  sx={{
                    // height: "100%",
                    // width: 1000,
                    // marginLeft: 10,
                    // marginTop: "10px",
                    border: 1,
                    marginTop: "10px",

                    // width: '100%',

                    // overflowX: 'auto',
                  }}
                >
                  <DataGrid
                    // disableColumnFilter
                    // disableColumnSelector
                    // disableToolbarButton
                    // disableDensitySelector
                    components={{ Toolbar: GridToolbar }}
                    // componentsProps={{
                    //   toolbar: {
                    //     showQuickFilter: false,
                    //     disableExport: true,
                    //     disableToolbarButton: true,
                    //   },
                    // }}
                    autoHeight
                    rowHeight={35}
                    headerHeight={40}
                    sx={{
                      backgroundColor: "white",
                    }}
                    rows={dataSource || []}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    //checkboxSelection
                  />
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>
    </>
  );
};

export default Index;
