import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Grid, IconButton, Paper, Tooltip } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import urls from "../../../../URLS/urls";

import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { setSelectedNotice } from "../../../../features/userSlice";

import { catchExceptionHandlingMethod } from "../../../../util/util";

// Created By - Sachin Durge
const ConcernDeptNoticeTable = () => {
  const router = useRouter();
  const language = useSelector((state) => state.labels.language);

  const [dataSource, setDataSource] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [noticeResponse, setNoticeResponse] = useState([]);
  const [loadderState, setLoadderState] = useState(false);
  let user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [authority, setAuthority] = useState([]);
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
    { headerName: "departmentListString", field: "departmentListString" },
    {
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
            {/* PARAWISE_ENTRY */}
            {authority?.includes("PARAWISE_REPORT_ENTRY") &&
              (params.row.status === "NOTICE_APPROVED_BY_LEGAL_HOD" ||
                params.row.status ===
                  "NOTICE_PARTIALLY_APPROVED_BY_CNCRNED_HOD") && (
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

            {/* PARAWISE_APPROVAL */}
            {authority?.includes("PARAWISE_REPORT_APPROVAL") &&
              (params.row.status === "NOTICE_APPROVED_BY_LEGAL_HOD" ||
                params.row.status ===
                  "NOTICE_PARTIALLY_APPROVED_BY_CNCRNED_HOD") && (
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

  // Notice
  const getNotices = () => {
    setLoadderState(true);
    let statuses = [];

    if (
      authority.includes("PARAWISE_REPORT_APPROVAL") ||
      authority.includes("PARAWISE_REPORT_ENTRY")
    ) {
      statuses.push("NOTICE_APPROVED_BY_LEGAL_HOD");
    }

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

    let _res = noticeResponse.map((r, i) => {
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

    console.log("dsjfdsklf", res);

    setDataSource(res);
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
              }}
            >
              {" "}
              <FormattedLabel id="notice" />
            </h2>
          </Grid>
        </Grid>

        <Box>
          {loadderState ? (
            <Loader />
          ) : (
            <Grid container sx={{ marginTop: "10px" }}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    border: 1,
                    marginTop: "10px",
                  }}
                >
                  <DataGrid
                    components={{ Toolbar: GridToolbar }}
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

export default ConcernDeptNoticeTable;
