import React from "react";

import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import SendIcon from "@mui/icons-material/Send";
import CheckIcon from "@mui/icons-material/Check";
import {
  Card,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Paper,
  IconButton,
  Chip,
  Tooltip,
} from "@mui/material";
import * as yup from "yup";
import { Box } from "@mui/system";
import { DataGrid, GridAddIcon } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import axios from "axios";
import moment from "moment";
// import styles from "./view.module.css";
import styles from "../../../../styles/LegalCase_Styles/parawiseReport.module.css";

import { useRouter } from "next/router";
import swal from "sweetalert";
import { ViewWeek } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// import BasicLayout from "../../../../../pcmcerp-hk/containers/Layout/BasicLayout";

const Index = () => {
  const router = useRouter();
  const language = useSelector((state) => state.labels.language);

  const [dataSource, setDataSource] = useState([]);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [departments, setDepartments] = useState([]);

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
  const token = useSelector((state) => state.user.user.token);

  const authority = user?.menus?.find((r) => r.id === 28)?.roles;

  console.log("autho", authority);

  useEffect(() => {
    getNoticeDetails();
    getDepartments();
  }, [fetchData]);

  useEffect(() => {
    getNoticeDetails();
  }, [departments]);

  // Get Table - Data
  const getNoticeDetails = () => {
    let statuses = [];
    statuses = ["PARAWISE_REPORT_CREATED", "PARAWISE_REPORT_APPROVED"];
    //  In DB -  ["PARAWISE_REPORT_CREATED","RESPONSE_TO_NOTICE_APPROVED","RESPONSE_TO_NOTICE_CREATED","NOTICE_DRAFT","NOTICE_CREATED","PARAWISE_REPORT_APPROVED"]
    console.log("1111", statuses);

    axios
      .post(
        `${urls.LCMSURL}/notice/getTrnNoticeByStatus`,
        {
          statuses,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      // .get(`${urls.LCMSURL}/notice/getTrnNoticeData`)
      .then((res) => {
        console.log(
          "res,",
          res,
          res.data.map((val) => val.status),
          user.menus[0].roles
        );
        let tableData = [];
        console.log(
          "res,",
          res,
          res.data.map((data) => data.status),
          authority.map((val) => {
            console.log("val", val, val === "NOTICE_ENTRY");
            return val === "NOTICE_DRAFT" ? true : false;
          })
        );

        if (authority.find((val) => val === "PARAWISE_REPORT_ENTRY")) {
          tableData.push(
            res.data.filter((data, index) => {
              return data.status === "NOTICE_APPROVED";
            })
          );
        }

        if (authority.find((val) => val === "PARAWISE_REPORT_ENTRY")) {
          tableData.push(
            res.data.filter((data, index) => {
              return data.status === "PARAWISE_REPORT_DRAFT";
            })
          );
        }

        if (authority.find((val) => val === "PARAWISE_REPORT_APPROVAL")) {
          tableData.push(
            res.data.filter((data, index) => {
              return data.status === "PARAWISE_REPORT_CREATED";
            })
          );
        }

        if (authority.find((val) => val === "RESPONSE_TO_NOTICE_ENTRY")) {
          tableData.push(
            res.data.filter((data, index) => {
              return data.status === "PARAWISE_REPORT_APPROVED";
            })
          );
        } else {
          // setDataSource(res.data);
        }

        console.log("tableData", tableData[0]);

        let _res = tableData[0].map((r, i) => {
          return {
            srNo: i + 1,
            id: r.id,
            noticeDate: r.noticeDate,
            noticeRecivedDate: r.noticeRecivedDate,
            requisitionDate: r.requisitionDate,
            // noticeDate: moment(r.noticeDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            // noticeRecivedDate: moment(r.noticeRecivedDate, "YYYY-MM-DD").format(
            //   "YYYY-MM-DD"
            // ),
            // requisitionDate: moment(r.requisitionDate, "YYYY-MM-DD").format(
            //   "YYYY-MM-DD"
            // ),
            // documentOriName: r.documentOriName,
            noticeRecivedFromAdvocatePerson: r.noticeRecivedFromAdvocatePerson,
            department: r.department,
            departmentName: departments?.find((obj) => obj?.id === r.department)
              ?.department,
            attachedFile: r.attachedFile,
            status: r.status,
            noticeAttachment: r.noticeAttachment,
            noticeHisotry: r.noticeHisotry,
          };
        });

        setDataSource(_res);
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getDepartments = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDepartments(
          res.data.department.map((r, i) => ({
            id: r.id,
            department: r.department,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // add Parawise
  const addParawise = (record) => {
    console.log("Record : ---> ", record);

    router.push({
      pathname: "/LegalCase/transaction/parawiseReport/addForm",
      query: {
        pageMode: "Add",
        ...record,

        // noticeDate: moment(record.row.noticeDate, "YYYY-MM-DD").format(
        //   "YYYY-MM-DD"
        // ),
        // noticeRecivedFromAdvocatePerson:
        //   record.row.noticeRecivedFromAdvocatePerson,
        // department: record.row.department,
        // departmentName: departments?.find(
        //   (obj) => obj?.id === record.row.department
        // )?.department,

        // noticeRecivedDate: moment(
        //   record.noticeRecivedDate,
        //   "YYYY-MM-DD"
        // ).format("YYYY-MM-DD"),

        // requisitionDate: moment(record.requisitionDate, "YYYY-MM-DD").format(
        //   "YYYY-MM-DD"
        // ),
      },
    });
  };

  const columns = [
    {
      headerName: "Sr.No",
      field: "srNo",
      width: 100,
      align: "center",
      headerAlign: "center",
      // dataIndex: "name",
    },
    // {
    //   headerName: "Notice No.",
    //   field: "noticeNo",
    //   width: 100,
    // },
    {
      headerName: "Notice Date",
      field: "noticeDate",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    // {
    //   headerName: "Notice Recevied Date",
    //   field: "noticeReceviedDate",
    //   width: 200,
    // },
    {
      headerName: "Notice received from Advocate/Person",
      field: "noticeRecivedFromAdvocatePerson",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      headerName: "Department Name",
      field: "departmentName",

      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   headerName: "Notice received through",
    //   field: "noticeReceivedThrough",
    //   width: 200,
    // },
    // {
    //   headerName: "Requisition Date",
    //   field: "requisitionDate",
    //   width: 180,
    // },
    // {
    //   headerName: "Attached File",
    //   field: "attachedFile",
    //   width: 130,
    // },
    // {
    //   headerName: "Parawise Information from concern Department",
    //   field: "parawiseInformationFromConcernDepartment",
    //   width: 350,
    // },
    // {
    //   headerName: "Digital Signature",
    //   field: "digitalSignature",
    //   width: 150,
    // },

    {
      field: "status",
      headerName: "Status",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Action",
      headerName: "Action",
      width: 300,
      align: "center",
      headerAlign: "center",

      renderCell: (params) => {
        return (
          <>
            {authority?.includes("PARAWISE_APPROVAL") && (
              <Button
                variant="outlined"
                sx={{
                  width: "20%",
                  overflow: "hidden",
                  margin: "5px",
                  fontSize: "10px",
                  whiteSpace: "normal",
                }}
                onClick={() => {
                  router.push({
                    pathname: "/LegalCase/transaction/parawiseReport/addForm",
                    query: {
                      pageMode: "Approve Notice",
                      ...params,
                    },
                  });
                }}
              >
                PARAWISE APPROVAL
              </Button>
            )}

            {/* {authority?.includes("PARAWISE_ENTRY") && (
              <Button
                variant="outlined"
                sx={{
                  width: "20%",
                  overflow: "hidden",
                  margin: "5px",
                  fontSize: "10px",
                  whiteSpace: "normal",
                }}
                onClick={() => {
                  router.push({
                    pathname: "/LegalCase/transaction/parawiseReport",
                    query: {
                      pageMode: "Edit",
                      authority,
                      ...params.row,
                    },
                  });
                }}
              >
                PARAWISE ENTRY
              </Button>
            )} */}
            {/* {(authority.includes("READ") || authority.includes("ADMIN")) && (
                <Tooltip title="Add Notice">
                  <IconButton
                    onClick={(e) => {
                      router.push({
                        pathname:
                          "/LegalCase/transaction/parawiseReport/addForm",
                        query: {
                          pageMode: "Add",
                          ...params.row,
                        },
                      });
                    }}
                  >
                    <AddIcon style={{ fontSize: "20px" }} />
                  </IconButton>
                </Tooltip>
              )} */}
          </>
          // <>
          //   <Button
          //     variant="outlined"
          //     size="small"
          //     startIcon={<VisibilityIcon />}
          //   >
          //     View
          //   </Button>
          //   {/* <VisibilityIcon /> */}
          //   <Button
          //     style={{ marginLeft: 20 }}
          //     onClick={() => addParawise(record.row)}
          //     variant="outlined"
          //     size="small"
          //     // startIcon={<GridAddIcon />}
          //   >
          //     Action
          //   </Button>
          //   {/* <IconButton onClick={() => editRecord(record.row)}>
          //     <EditIcon />
          //   </IconButton> */}
          //   {/* <IconButton onClick={() => deleteById(record.row.id)}>
          //     <DeleteIcon />
          //   </IconButton> */}
          // </>
        );
      },
    },
  ];

  // Row

  return (
    <Paper
    // sx={{ marginLeft: 5, marginRight: 5, marginTop: 5, marginBottom: 5 }}
    >
      <Grid container>
        <Grid item xs={10}></Grid>
        <Grid item xs={2} sx={{ padding: "10px" }}>
          {authority.includes("PARAWISE_ENTRY") &&
            (console.log("Authority", authority),
            (
              <Button
                // type="primary"
                variant="contained"
                onClick={() =>
                  router.push({
                    pathname: "/LegalCase/transaction/parawiseReport/addForm",
                    query: {
                      pageMode: "Add",
                    },
                  })
                }
                endIcon={<AddIcon />}
              >
                Add Parawise Report
              </Button>
            ))}
        </Grid>
      </Grid>
      <DataGrid
        autoHeight
        rows={dataSource}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        //checkboxSelection
      />
    </Paper>
  );
};

export default Index;
