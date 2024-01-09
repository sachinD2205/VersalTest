import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Link,
  Modal,
  Paper,
  TextareaAutosize,
  Tooltip,
} from "@mui/material";
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
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import BreadcrumbComponent from "../../../../pages/LegalCase/FileUpload/BreadcrumbComponent";

import { catchExceptionHandlingMethod } from "../../../../util/util";

// Created By - Sachin Durge
const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        columnHeader: {
          backgroundColor: "#5856d6", // Change this color to the desired shade of blue
          color: "white", // Change the font color if needed
        },
      },
    },
  },
});

const Index = () => {
  const [loadderState, setLoadderState] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(),
    mode: "onChange",
  });

  const router = useRouter();
  const [dataSource, setDataSource] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [noticeResponse, setNoticeResponse] = useState([]);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [id, setID] = useState();
  const language = useSelector((state) => state.labels.language);
  const userDeatails = useSelector((state) => state?.user?.user);
  const deptIdNew = useSelector(
    (state) => state?.user?.user?.userDao?.department
  );
  const token = useSelector((state) => state.user.user.token);

  const [showDocketSubDetailsModel, setShowDocketSubDetailsModel] =
    useState(false);

  const [noticeNarDetails, setNoticeNarDetails] = useState("");

  const currentDate = new Date();

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
  const currentDateMoment = moment(currentDate);
  // const [loadderState, setLoadderState] = useState(false);
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
  let tableData14 = [];
  let tableData15 = [];
  let tableData16 = [];
  let tableData17 = [];
  let tableData18 = [];
  let tableData19 = [];
  let tableData20 = [];
  let tableData21 = [];

  const [load, setLoad] = useState();

  const handleLoad = () => {
    setLoad(false);
  };

  // drawer
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );
  const [editButtonInputState, setEditButtonInputState] = useState(false);

  // For Column width set
  const ExpandableCell = ({ value }) => {
    const [expanded, setExpanded] = useState(false);
    return (
      <div>
        {expanded ? value : value.slice(0, 40)}{" "}
        {value.length > 40 && (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <Link
            type="button"
            component="button"
            onClick={() => setExpanded(!expanded)}
          >
            <FormattedLabel id={expanded ? "viewLess" : "viewMore"} />
          </Link>
        )}
      </div>
    );
  };

  // columns
  const columns = [
    {
      headerName: <FormattedLabel id="srNo" />,
      field: "srNo",
      width: 100,
      // flex: 1,

      align: "center",
      headerAlign: "center",
    },

    {
      field: "id",
      headerName: <FormattedLabel id="noticeid" />,

      width: 100,

      align: "center",
      headerAlign: "center",

      renderCell: (params) => {
        return (
          <>
            <Button
              type="primary"
              size="medium"
              variant="contained"
              sx={{
                overflow: "hidden",
                margin: "5px",
                fontSize: "12px",
                whiteSpace: "normal",
              }}
              onClick={() => {
                localStorage.setItem(
                  "rowsData",
                  JSON.stringify(params?.row?.concernDeptUserList)
                );

                localStorage.removeItem("noticeAttachment");
                // localStorage.removeItem("rowsData");
                localStorage.setItem("pageMode", "NOTICE_CREATE"),
                  localStorage.setItem(
                    "noticeID",
                    JSON.stringify(params?.row?.id)
                  ),
                  router.push({
                    pathname: "/LegalCase/transaction/Notice/view1",
                    query: {
                      pageMode: "_VIEW",
                    },
                    noticeId: params?.row?.id,
                  });
              }}
            >
              {params?.row?.id}
            </Button>
          </>
        );
      },
    },
    {
      headerName: <FormattedLabel id="noticeDate" />,
      field: "noticeDate",
      width: 150,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      headerName: language == "en" ? "Due to Date" : "देय तारीख",

      field: "requisitionDate",
      valueFormatter: (params) => moment(params?.value).format("DD-MM-YYYY"),
      width: 150,
      // flex: 1,
      align: "center",
      headerAlign: "center",
      cellClassName: "highlighted-cell",
    },
    // noticeDetails , noticeDetailsMr
    {
      headerName: <FormattedLabel id="noticeDetails" />,
      field: language === "en" ? "noticeDetails" : "noticeDetailsMr",
      width: 200,
      // renderCell: (params) => <ExpandableCell {...params} />,
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            console.log(":a2", params?.row?.noticeDetails);

            setNoticeNarDetails(params?.row?.noticeDetails);
            setShowDocketSubDetailsModel(true);
          }}
        >
          <span>{params?.row?.noticeDetails}</span>
        </div>
      ),
    },

    {
      headerName: <FormattedLabel id="applicationStatus" />,
      field: "status",
      width: 500,
      hide: true,
      // flex: 1,

      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        <Tooltip title={params.value}>
          <span>{params.value}</span>
        </Tooltip>;
        return (
          <div
            style={{
              //
              whiteSpace: "nowrap", // Prevent text from wrapping
              overflow: "hidden", // Hide any overflowing content
              textOverflow: "ellipsis", // Show an ellipsis (...) for overflow
              maxWidth: "500px", // Adjust the maximum width as needed

              //
              color:
                params.row.status === "NOTICE_APPROVED_BY_ALL_CNCRNED_HOD"
                  ? "violet"
                  : params.row.status === "OPINIONS_PARTIALLY_SUBMITTED"
                  ? "orange"
                  : params.row.status === "RESPONSE_FROM_NOTICE_APPROVED_BY_HOD"
                  ? "green"
                  : params.row.status === "NOTICE_CREATED"
                  ? "blue"
                  : params.row.status === "NOTICE_APPROVED_BY_LEGAL_HOD"
                  ? "darkgreen"
                  : params.row.status ===
                    "NOTICE_PARTIALLY_APPROVED_BY_CNCRNED_HOD"
                  ? "darkorange"
                  : params.row.status ===
                    "RESPONSE_FROM_NOTICE_APPROVED_BY_CLERK"
                  ? "red"
                  : params.row.status === "NOTICE_REASSIGNED_BY_LEGAL_HOD"
                  ? "darkviolet"
                  : "black",
              // color: "white",
              // padding: "5px",
              // borderRadius: "5px",
              textAlign: "center",
            }}
          >
            {params.row.status === "NOTICE_PARTIALLY_APPROVED_BY_CNCRNED_HOD"
              ? "NOTICE_PARTIALLY_APPROVED_BY_CNCRNED_HOD (" +
                params.row.approvedCount +
                "/" +
                params.row.totalCount +
                ")"
              : params.row.status === "NOTICE_APPROVED_BY_ALL_CNCRNED_HOD"
              ? "NOTICE_APPROVED_BY_ALL_CNCRNED_HOD (" +
                params.row.approvedCount +
                "/" +
                params.row.totalCount +
                ")"
              : params.row.status}
          </div>
        );
      },
    },
    // {
    //   headerName: "Hellojjjjjjjjjjjjjjjjjjjjjj",
    //   field: "statusParawiseReportp",
    //   width: 150,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      headerName: <FormattedLabel id="statusParawiseReport" />,
      field: "statusParawiseReport",
      // width: 300,
      // flex: 1,
      width: 350,
      align: "center",
      headerAlign: "center",
      hide: user?.userDao?.department === 3 ? true : false,
      // renderCell: (params) => {
      //   console.log("__statusParawiseReport", params?.row?.statusParawiseReport);
      //   <Tooltip title={params.value}>
      //     <span>{params.value}</span>
      //   </Tooltip>;
      //   return (
      //     <div
      //       style={{
      //         color:
      //           params.row.statusParawiseReport === "NOTICE_APPROVED_BY_ALL_CNCRNED_HOD"
      //             ? "violet"
      //             : params.row.statusParawiseReport === "OPINIONS_PARTIALLY_SUBMITTED"
      //             ? "orange"
      //             : params.row.statusParawiseReport === "RESPONSE_FROM_NOTICE_APPROVED_BY_HOD"
      //             ? "green"
      //             : params.row.statusParawiseReport === "NOTICE_CREATED"
      //             ? "blue"
      //             : params.row.statusParawiseReport === "NOTICE_APPROVED_BY_LEGAL_HOD"
      //             ? "darkgreen"
      //             : params.row.statusParawiseReport ===
      //               "NOTICE_PARTIALLY_APPROVED_BY_CNCRNED_HOD"
      //             ? "darkorange"
      //             : params.row.statusParawiseReport ===
      //               "RESPONSE_FROM_NOTICE_APPROVED_BY_CLERK"
      //             ? "red"
      //             : params.row.statusParawiseReport === "NOTICE_REASSIGNED_BY_LEGAL_HOD"
      //             ? "darkviolet"
      //             : "black",
      //         // color: "white",
      //         // padding: "5px",
      //         // borderRadius: "5px",
      //         textAlign: "center",
      //       }}
      //     >
      //       {/* console.log("statusParawiseReport",statusParawiseReport) */}
      //     </div>
      //   );
      // },
    },

    //parawiseEntryApproved
    // {
    //   headerName: "parawiseEntryApproved",
    //   field: "parawiseEntryApproved",
    // },
    // {
    //   //<FormattedLabel id="action" />,
    //   headerName: "departmentListString",
    //   field: "departmentListString",
    // },
    // //parawiseCompletedDepartments
    // {
    //   headerName: "parawiseCompletedDepartments",
    //   field: "parawiseCompletedDepartments",
    // },
    // {
    //   headerName: "parawiseApprovedDepartments",
    //   field: "parawiseApprovedDepartments",
    // },
    // {
    //   //isMyDepartment
    //   headerName: "isMyDepartment",
    //   field: "isMyDepartment",
    // },
    {
      field: "Action",
      headerName: <FormattedLabel id="action" />,
      // flex: 2,
      width: 1000,

      // align: "center",
      // headerAlign: "center",

      renderCell: (params) => {
        let record = params.row;

        return (
          <>
            {/*------------------------------- Button for Notice Details ----------------------------------*/}
            {/* <Button
              type="primary"
              size="medium"
              variant="contained"
              sx={{
                overflow: "hidden",
                margin: "5px",
                fontSize: "12px",
                whiteSpace: "normal",
              }}
              onClick={() => {
                let __concernDeptUserList = params?.row?.concernDeptUserList
                  ? params?.row?.concernDeptUserList?.map((data, index) => {
                      return {
                        srNo: index + 1,
                        id: data?.id,
                        activeFlag: data?.activeFlag,
                        departmentId: data?.departmentId,
                        empoyeeId: data?.empoyeeId,
                        id: data?.id,
                        notice: data?.notice,
                        locationId: data?.locationId,
                      };
                    })
                  : [];
                console.log("__data", params?.row);
                localStorage.setItem(
                  "rowsData",
                  JSON.stringify(params?.row?.concernDeptUserList)
                );

                localStorage.removeItem("noticeAttachment");
                // localStorage.removeItem("rowsData");
                localStorage.setItem("pageMode", "NOTICE_CREATE"),
                  localStorage.setItem(
                    "noticeID",
                    JSON.stringify(params?.row?.id)
                  ),
                  router.push({
                    pathname: "/LegalCase/transaction/Notice/view1",
                    query: {
                      pageMode: "_VIEW",
                    },
                    noticeId: params?.row?.id,
                  });
              }}
            >
              Notice Details
            </Button> */}
            {/* ----------------------------------------------------------------------------------- */}
            {/*  */}
            {/**View Button */}
            {/* {authority?.includes("NOTICE_ENTRY") &&
              (params.row.status === "NOTICE_DRAFT" ||
                params.row.status === "NOTICE_CREATED") && (
                <IconButton
                  disabled={editButtonInputState}

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
                  <EyeFilled style={{ color: "#556CD6" }} />

                </IconButton>
              )} */}

            {/* NOTICE_DRAFT */}
            {authority?.includes("NOTICE_ENTRY") &&
              (params.row.status === "NOTICE_DRAFT" ||
                params.row.status === "NOTICE_CREATED") && (
                <Button
                  type="primary"
                  size="medium"
                  variant="contained"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "12px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    let __concernDeptUserList = params?.row?.concernDeptUserList
                      ? params?.row?.concernDeptUserList?.map((data, index) => {
                          return {
                            srNo: index + 1,
                            id: data?.id,
                            activeFlag: data?.activeFlag,
                            departmentId: data?.departmentId,
                            empoyeeId: data?.empoyeeId,
                            id: data?.id,
                            notice: data?.notice,
                            locationId: data?.locationId,
                          };
                        })
                      : [];
                    console.log("__data", params?.row);
                    localStorage.setItem(
                      "rowsData",
                      JSON.stringify(params?.row?.concernDeptUserList)
                    );

                    localStorage.removeItem("noticeAttachment");
                    // localStorage.removeItem("rowsData");
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
                  {/* EDIT NOTICE */}
                  <FormattedLabel id="editNotice" />
                </Button>
              )}

            {/* Edit Button  */}

            {/* {authority?.includes("NOTICE_ENTRY") &&
              (params.row.status === "NOTICE_DRAFT" ||
                params.row.status === "NOTICE_CREATED") && (
                <IconButton
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
                  <EditIcon style={{ color: "#556CD6" }} />

                </IconButton>
              )} */}

            {/* delete button  */}

            {/* <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  console.log("params.row4343434: ", params.row)
                reset(params.row)
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "Y")}
                />
              )}
            </IconButton> */}

            {/* NOTICE_APPROVAL */}
            {authority?.includes("NOTICE_APPROVAL") &&
              authority?.includes("HOD") &&
              params.row.status === "NOTICE_CREATED" && (
                <Button
                  type="primary"
                  variant="contained"
                  size="medium"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "12px",
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
                  {/* NOTICE APPROVAL */}
                  <FormattedLabel id="noticeApproval" />
                </Button>
              )}

            {/* Response To Notice Approval */}
            {authority?.includes("NOTICE_APPROVAL") &&
              // authority?.includes("RESPONSE_TO_NOTICE_APPROVAL") &&
              params.row.status ===
                "RESPONSE_FROM_NOTICE_APPROVED_BY_CLERK" && (
                <Button
                  type="primary"
                  variant="contained"
                  size="medium"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "12px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    console.log("543", params.row);
                    dispatch(setSelectedNotice(params.row));
                    router.push({
                      pathname:
                        "/LegalCase/transaction/Notice/ResponseToNoticeApproval",
                    });
                  }}
                >
                  {/* RESPONSE To NOTICE APPROVAL */}
                  <FormattedLabel id="responseToNoticeApproval" />
                </Button>
              )}
            {/* PARAWISE_ENTRY */}
            {authority?.includes("PARAWISE_REPORT_ENTRY") &&
              (params.row.status === "NOTICE_APPROVED_BY_LEGAL_HOD" ||
                params.row.status ===
                  "NOTICE_PARTIALLY_APPROVED_BY_CNCRNED_HOD") &&
              // ||
              //   params.row.status ===
              //     "NOTICE_PARTIALLY_APPROVED_BY_CNCRNED_HOD" ||
              //   params.row.statusParawiseReport ===
              //     "PARAWISE_REPORT_REASSIGNED" ||
              //   params.row.parawiseEntryCompleted === "false"
              params.row.statusParawiseReport === "" && (
                <Button
                  type="primary"
                  variant="contained"
                  size="medium"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "12px",
                    whiteSpace: "normal",
                    height: "4vh",
                    elevation: "2",
                  }}
                  onClick={() => {
                    console.log("params.row", params.row);
                    dispatch(setSelectedNotice(params.row));

                    router.push({
                      pathname: "/LegalCase/transaction/Notice/ParawiseEntry",
                    });
                  }}
                >
                  {/* PARAWISE ENTRY */}
                  <FormattedLabel id="pARAWISEENTRY" />
                </Button>
              )}

            {/* Exp  */}

            {/* PARAWISE_REPORT_EDIT */}
            {authority?.includes("PARAWISE_REPORT_ENTRY") &&
              params.row.status === "PARAWISE_REPORT_DRAFT" && (
                <Button
                  type="primary"
                  variant="contained"
                  size="medium"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "12px",
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
              (params.row.status === "NOTICE_APPROVED_BY_LEGAL_HOD" ||
                (params.row.status ===
                  "NOTICE_PARTIALLY_APPROVED_BY_CNCRNED_HOD" &&
                  params.row.statusParawiseReport !==
                    "PARAWISE_REPORT_REASSIGNED")) &&
              // NOTICE_PARTIALLY_APPROVED_BY_CNCRNED_HOD
              params.row.parawiseEntryApproved === false && (
                <Button
                  type="primary"
                  variant="contained"
                  size="medium"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "12px",
                    whiteSpace: "normal",
                    height: "4vh",
                  }}
                  onClick={() => {
                    dispatch(setSelectedNotice(params.row));

                    router.push({
                      pathname:
                        "/LegalCase/transaction/Notice/ParawiseApproval",
                    });
                  }}
                >
                  {/* PARAWISE APPROVAL */}
                  <FormattedLabel id="pARAWISEAPPROVAL" />
                </Button>
              )}

            {/* RESPONSE_TO_NOTICE_ENTRY */}
            {authority?.includes("RESPONSE_TO_NOTICE_ENTRY") &&
              params.row.status === "NOTICE_APPROVED_BY_ALL_CNCRNED_HOD" && (
                <Button
                  type="primary"
                  variant="contained"
                  size="medium"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "12px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    dispatch(setSelectedNotice(params.row));

                    router.push({
                      pathname:
                        "/LegalCase/transaction/Notice/ResponseToNotice",
                    });
                  }}
                >
                  {/* RESPONSE TO NOTICE ENTRY */}
                  <FormattedLabel id="responeeToNoticeEntry" />
                </Button>
              )}

            {/* RESPONSE_TO_NOTICE_REASSGIN */}
            {authority?.includes("RESPONSE_TO_NOTICE_ENTRY") &&
              params.row.status === "RESPONSE_TO_NOTICE_REASSGIN" && (
                <Button
                  type="primary"
                  variant="contained"
                  size="medium"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "12px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    const finalData = {
                      ...params?.row,
                    };
                    console.log("paramsROW", finalData);
                    dispatch(setSelectedNotice(finalData));

                    router.push({
                      pathname:
                        "/LegalCase/transaction/Notice/ResponseToNotice",
                      query: {
                        // ...record,
                        paraReqId: record?.id,
                        //
                      },
                    });
                  }}
                >
                  {/* RESPONSE TO NOTICE ENTRY */}
                  <FormattedLabel id="responeeToNoticeEntry" />
                </Button>
              )}

            {/*  */}

            {/* RESPONSE_TO_NOTICE_EDIT */}
            {authority?.includes("RESPONSE_TO_NOTICE_ENTRY") &&
              params.row.status === "RESPONSE_TO_NOTICE_DRAFT" && (
                <Button
                  type="primary"
                  variant="contained"
                  size="medium"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "12px",
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
                  {/* EDIT RESPONSE TO NOTICE */}
                  <FormattedLabel id="eDITRESPONSETONOTICE" />
                </Button>
              )}

            {/* RESPONSE TO NOTICE APPROVAL */}
            {authority?.includes("RESPONSE_TO_NOTICE_APPROVAL") &&
              params.row.status === "RESPONSE_TO_NOTICE_CREATED" && (
                <Button
                  variant="outlined"
                  size="medium"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "12px",
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
                  {/* RESPONSE TO NOTICE APPROVAL */}
                  <FormattedLabel id="responseToNoticeApproval" />
                </Button>
              )}
            {authority?.includes("FINAL_APPROVAL") &&
              params.row.status ===
                "RESPONSE_TO_NOTICE_APPROVED_BY_LEGAL_HOD" && (
                <Button
                  variant="outlined"
                  size="medium"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "12px",
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
                  {/* FINAL APPROVAL */}
                  <FormattedLabel id="fINALAPPROVAL" />
                </Button>
              )}
            {/* {authority?.includes("FINAL_APPROVAL") &&
              params.row.status === "RESPONSE_FROM_NOTICE_APPROVED_BY_HOD" && (
                <Button
                  variant="outlined"
                  size="medium"
                  sx={{
                    cursor: "pointer",
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "12px",
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
            {/* SIGN AND APPROVE */}
            {/* <FormattedLabel id="signAndApprove" />
                </Button> */}

            {/*  New Digital sign */}
            {authority?.includes("PARAWISE_REPORT_APPROVAL") &&
              params.row.status === "RESPONSE_FROM_NOTICE_APPROVED_BY_HOD" &&
              params.row?.concernDeptUserList[0]?.status ===
                "RESPONSE_FROM_NOTICE_APPROVED_BY_HOD" && (
                <Button
                  variant="outlined"
                  size="medium"
                  sx={{
                    cursor: "pointer",
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "12px",
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
                        // pageMode: "Final",
                        ...params.row,
                      },
                    });
                  }}
                >
                  {/* DIGITAL SIGNATURE */}
                  {/* SIGN AND APPROVE */}
                  <FormattedLabel id="signAndApprove" />
                </Button>
              )}

            {/*  */}
            {authority?.includes("NOTICE_ENTRY") &&
              params.row.status === "NOTICE_REASSIGNED" && (
                <Button
                  variant="outlined"
                  size="medium"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "12px",
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
                  {/* EDIT NOTICE */}
                  <FormattedLabel id="editNotice" />
                </Button>
              )}

            {/* NOTICE_REASSIGNED_BY_LEGAL_HOD */}
            {authority?.includes("NOTICE_ENTRY") &&
              params.row.status === "NOTICE_REASSIGNED_BY_LEGAL_HOD" && (
                // "NOTICE_REASSIGNED_BY_LEGAL_HOD"

                <Button
                  type="primary"
                  variant="contained"
                  size="medium"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "12px",
                    whiteSpace: "normal",
                  }}
                  // onClick={() => {
                  //   localStorage.removeItem("noticeAttachment");
                  //   localStorage.removeItem("rowsData");
                  //   localStorage.setItem("pageMode", "NOTICE_CREATE"),
                  //     localStorage.setItem(
                  //       "noticeID",
                  //       JSON.stringify(params?.row?.id)
                  //     ),
                  //     router.push({
                  //       pathname: "/LegalCase/transaction/Notice",
                  //     });
                  // }}
                  onClick={() => {
                    console.log("params32kk", params?.row);
                    localStorage.setItem(
                      "rowsData",
                      JSON?.stringify(params?.row?.concernDeptUserList)
                    );

                    localStorage.removeItem("noticeAttachment");
                    // localStorage.removeItem("rowsData");
                    localStorage.setItem("pageMode", "NOTICE_CREATE"),
                      localStorage.setItem(
                        "noticeID",
                        JSON?.stringify(params?.row?.id)
                      ),
                      router.push({
                        pathname: "/LegalCase/transaction/Notice",
                        // pageMode: "reassign",
                        // query: {
                        //   // ...record,
                        //   pagemode: "reassign",
                        //   //
                        // },
                      });
                  }}
                >
                  {/* EDIT NOTICE */}
                  <FormattedLabel id="recreateNotice" />
                  {/* Recreate Notice */}
                </Button>
              )}

            {/*  */}

            {authority?.includes("RESPONSE_TO_NOTICE_ENTRY") &&
              params.row.status === "RESPONSE_TO_NOTICE_REASSIGNED" && (
                <Button
                  variant="outlined"
                  size="medium"
                  sx={{
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "12px",
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
              params?.row?.statusParawiseReport ===
                "PARAWISE_REPORT_REASSIGNED" && (
                <Button
                  // variant="outlined"
                  // variant="contained"

                  size="medium"
                  sx={{
                    overflow: "hidden",
                    // margin: "5px",
                    fontSize: "12px",
                    // whiteSpace: "normal",
                    // width: "100%",
                    height: "4vh",
                    // color: "red",
                    backgroundColor: "red",
                    color: "white",
                  }}
                  // onClick={() => {
                  //   dispatch(setSelectedNotice(params.row));
                  //   dispatch(
                  //     setSelectedParawisePoints(
                  //       params.row.parawiseTrnParawiseReportDaoLst
                  //     )
                  //   );
                  //   router.push({
                  //     pathname:
                  //       "/LegalCase/transaction/parawiseReport/editParawiseReport",
                  //     query: {
                  //       pageMode: "Edit",
                  //       ...params.row,
                  //     },
                  //   });
                  // }}
                  onClick={() => {
                    dispatch(setSelectedNotice(params.row));
                    router.push({
                      pathname: "/LegalCase/transaction/Notice/ParawiseEntry",
                      query: {
                        ...params?.row?.parawiseTrnParawiseReportDaoLst?.[0],
                      },
                    });
                  }}
                >
                  {/* EDIT PARAWISE REPORT */}
                  Recreate Parawise Entry
                </Button>
              )}
          </>
        );
      },
    },
  ].filter((obj) => {
    if (router?.query?.noticeStatus) {
      return obj?.field !== "Action";
    } else {
      return obj;
    }
  });

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
  // getHODRemark
  // https://noncoreuat.pcmcindia.gov.in/backend/lc/lc/api/notice/getNoticeById/?noticeId=371

  // Notice

  const getNotices = (
    _pageSize = 20,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "Desc"
  ) => {
    setLoadderState(true);
    let statuses = [];
    if (router?.query?.noticeStatus) {
      statuses = [`${router?.query?.noticeStatus}`];
    } else {
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
        "NOTICE_PARTIALLY_APPROVED_BY_CNCRNED_HOD",
        "FINAL_APPROVED",
        "NOTICE_APPROVED_BY_ALL_CNCRNED_HOD",
        "RESPONSE_FROM_NOTICE_APPROVED_BY_HOD",
        "RESPONSE_FROM_NOTICE_APPROVED_BY_CLERK",
        "NOTICE_REASSIGNED_BY_LEGAL_HOD",
        "RESPONSE_TO_NOTICE_REASSGIN",
        // "RESPONSE_FROM_NOTICE_APPROVED_BY_HOD",
      ];
    }

    if (statuses != null || statuses !== undefined) {
      // setLoad(true);
      setLoadderState(true);

      // let testData = userDeatails?.applications?.find(
      //   (data) => data?.id == "5"
      // );

      // for non - Legal Department - pass statuses and department id
      // let dept = user.userDao.department;
      //console.log("sagaruser", user);
      if (deptIdNew != 3) {
        //alert("non legal = " + dept);

        axios
          .get(
            `${urls.LCMSURL}/notice/getTrnNoticeByStatusForConDeptUser?deptId=${deptIdNew}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((resp) => {
            setLoadderState(false);

            setLoad(false);

            console.log("noticeDataewe12345", resp?.data);
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
      // for Legal Departments
      else {
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
            setLoadderState(false);

            setLoad(false);

            console.log("noticeDataewe9999999", resp?.data);
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
    }
  };

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.LCMSURL}/notice/saveTrnNotice`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                // getSubType()
                getNotices();
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              callCatchMethod(err, language);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    } else {
      swal({
        title: "Activate?",
        text: "Are you sure you want to activate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.LCMSURL}/notice/saveTrnNotice`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                // getSubType()
                getNotices();
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              callCatchMethod(err, language);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
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
        return (
          data.status === "NOTICE_APPROVED_BY_LEGAL_HOD" ||
          data.status === "NOTICE_PARTIALLY_APPROVED_BY_CNCRNED_HOD"
        );
      });
    }

    if (authority.find((val) => val === "RESPONSE_TO_NOTICE_ENTRY")) {
      tableData6 = noticeResponse.filter((data, index) => {
        return data.status === "NOTICE_APPROVED_BY_ALL_CNCRNED_HOD";
      });
    }

    if (authority.find((val) => val === "RESPONSE_TO_NOTICE_ENTRY")) {
      tableData7 = noticeResponse.filter((data, index) => {
        return data.status === "RESPONSE_TO_NOTICE_DRAFT";
      });
    }

    if (authority.find((val) => val === "RESPONSE_TO_NOTICE_APPROVAL")) {
      tableData8 = noticeResponse.filter((data, index) => {
        return data.status === "RESPONSE_FROM_NOTICE_APPROVED_BY_CLERK";
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

    if (authority.find((val) => val === "PARAWISE_REPORT_APPROVAL")) {
      tableData10 = noticeResponse.filter((data, index) => {
        return data.status === "RESPONSE_FROM_NOTICE_APPROVED_BY_HOD";
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

    if (authority.find((val) => val === "PARAWISE_REPORT_ENTRY")) {
      tableData14 = noticeResponse.filter((data, index) => {
        return data.status === "NOTICE_PARTIALLY_APPROVED_BY_CNCRNED_HOD";
      });
    }

    //NOTICE_REASSIGNED_BY_LEGAL_HOD
    if (authority.find((val) => val === "NOTICE_ENTRY")) {
      tableData15 = noticeResponse.filter((data, index) => {
        return data.status === "NOTICE_REASSIGNED_BY_LEGAL_HOD";
      });
    }
    //
    // tableData16
    if (authority.find((val) => val === "NOTICE_ENTRY")) {
      tableData16 = noticeResponse.filter((data, index) => {
        return data.status === "RESPONSE_TO_NOTICE_REASSGIN";
      });
    }

    if (authority.find((val) => val === "FINAL_APPROVAL")) {
      tableData17 = noticeResponse.filter((data, index) => {
        return data.status === "RESPONSE_FROM_NOTICE_APPROVED_BY_HOD";
      });
    }
    //NOTICE_APPROVED_BY_LEGAL_HOD
    if (authority.find((val) => val === "NOTICE_APPROVAL")) {
      tableData18 = noticeResponse.filter((data, index) => {
        return data.status === "NOTICE_APPROVED_BY_LEGAL_HOD";
      });
    }

    // PARAWISE_REPORT_SUBMITTED
    // PARAWISE_REPORT_ENTRY
    if (authority.find((val) => val === "PARAWISE_REPORT_ENTRY")) {
      tableData19 = noticeResponse.filter((data, index) => {
        return data.statusParawiseReport === "PARAWISE_REPORT_SUBMITTED";
      });
    }

    // PARAWISE_REPORT_APPROVED
    // PARAWISE_REPORT_APPROVAL
    if (authority.find((val) => val === "PARAWISE_REPORT_APPROVAL")) {
      tableData20 = noticeResponse.filter((data, index) => {
        return data.statusParawiseReport === "PARAWISE_REPORT_APPROVED";
      });
    }

    // RESPONSE_TO_NOTICE_ENTRY
    // RESPONSE_FROM_NOTICE_APPROVED_BY_CLERK
    if (authority.find((val) => val === "RESPONSE_TO_NOTICE_ENTRY")) {
      tableData20 = noticeResponse.filter((data, index) => {
        return data.status === "RESPONSE_FROM_NOTICE_APPROVED_BY_CLERK";
      });
    }

    // NOTICE_APPROVED_BY_ALL_CNCRNED_HOD
    if (authority.find((val) => val === "RESPONSE_TO_NOTICE_ENTRY")) {
      tableData7 = noticeResponse.filter((data, index) => {
        return data.status === "NOTICE_APPROVED_BY_ALL_CNCRNED_HOD";
      });
    }

    console.log("tableData0", tableData0);

    if (router?.query?.noticeStatus) {
      tableData = noticeResponse;
    } else {
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
        ...tableData14,
        ...tableData15,
        ...tableData16,
        ...tableData17,
        ...tableData18,
        ...tableData19,
        ...tableData20,
        ...tableData21,
      ];
    }
    console.log("sdlfjsdf", tableData15);

    console.log("jjkkj", tableData, noticeResponse);

    let _res = tableData.map((r, i) => {
      console.log("noticeResponseTD", r);
      return {
        srNo: i + 1,
        id: r.id,
        // addrejected
        hodRejectionRemark: r?.hodRejectionRemark,
        hodRejectionRemarkMr: r?.hodRejectionRemarkMr,
        reassignRmarkLegalHod: r.reassignRmarkLegalHod,
        reassignRmarkLegalHodMr: r.reassignRmarkLegalHodMr,
        hodRejectionRemarkMr: r.hodRejectionRemarkMr,
        hodRejectionRemark: r.hodRejectionRemark,

        remark: r.remark ? r.remark : "-",
        noticeRecivedDate: r.noticeRecivedDate ? r.noticeRecivedDate : "-",
        requisitionDate: r.requisitionDate ? r.requisitionDate : "-",
        concernDeptUserList: r.concernDeptUserList
          ? r.concernDeptUserList
          : "-",
        // noticeDate: r.noticeDate ? r.noticeDate : "-",
        noticeDate: moment(r.noticeDate).format("DD-MM-YYYY"),

        noticeReceivedFromAdvocatePerson: r.noticeRecivedFromAdvocatePerson
          ? r.noticeRecivedFromAdvocatePerson
          : "-",
        noticeRecivedFromAdvocatePersonMr: r.noticeRecivedFromAdvocatePerson
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
        statusParawiseReport: r.statusParawiseReport,
        noticeAttachment: r.noticeAttachment ? r.noticeAttachment : "-",
        noticeHisotry: r.noticeHisotry ? r.noticeHisotry : "-",
        parawiseTrnParawiseReportDaoLst: r.parawiseTrnParawiseReportDaoLst
          ? r.parawiseTrnParawiseReportDaoLst
          : "-",
        // parawiseRejectionRemarkHodEnglish: r.parawiseRejectionRemarkHodEnglish,
        noticeDetails: r.noticeDetails ? r.noticeDetails : "-",
        noticeDetailsMr: r.noticeDetails ? r.noticeDetailsMr : "-",
        remark: r.remark ? r.remark : "-",
        advocateAddress: r.advocateAddress ? r.advocateAddress : "-",
        advocateAddressMr: r.advocateAddress ? r.advocateAddressMr : "-",
        timeStamp: r.timeStamp ? r.timeStamp : "-",
        inwardNo: r.inwardNo ? r.inwardNo : "-",
        clientNameMr: r.clientNameMr,

        departmentListString: r.departmentListString
          ? r.departmentListString
          : "",
        isMyDepartment: r.departmentListString
          ?.split(",")
          .includes(user.userDao?.department?.toString()),

        parawiseCompletedDepartments: r.parawiseCompletedDepartments
          ? r.parawiseCompletedDepartments
          : "",

        //parawiseEntryCompleted | mark true if parawiseCompletedDepartments.split by comma contains user department
        parawiseEntryCompleted: r.parawiseCompletedDepartments
          ?.split(",")
          .includes(user.userDao?.department?.toString())
          ? true
          : false,

        //parawiseApprovedDepartments
        parawiseEntryApproved: r.parawiseApprovedDepartments
          ?.split(",")
          .includes(user.userDao?.department?.toString())
          ? true
          : false,

        approvedCount: r?.approvedCount,
        totalCount: r?.totalCount,
        clerkApprovalRemarkAfterParawise: r?.clerkApprovalRemarkAfterParawise,
        statusParawiseReport: r?.statusParawiseReport,
      };
    });

    // let removedDuplicate = [
    //   ...new Set(_res?.map((data) => JSON.stringify(data))),
    // ].map((data2) => JSON.parse(data2));
    // console.log("__removedDuplicate", removedDuplicate);
    let removedDuplicate = _res?.filter(
      (object, index, self) =>
        index === self.findIndex((o) => o.id === object.id)
    );
    setDataSource(removedDuplicate);
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
    console.log("_dataSouvvv", dataSource);
  }, [dataSource]);

  useEffect(() => {
    console.log("departments", departments);
    console.log("authority", authority);
    getNotices();
  }, [departments, authority]);

  useEffect(() => {
    console.log("noticeResponse", noticeResponse);
    handleDepartmentAndNoticeData();
  }, [noticeResponse]);

  return (
    <>
      <Box
        sx={{
          marginLeft: "1vw",
        }}
      >
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={load}
          onClick={handleLoad}
        >
          Loading....
          <CircularProgress color="inherit" />
        </Backdrop>
        <div>
          <BreadcrumbComponent />
        </div>
      </Box>

      {/* Loader */}
      {loadderState ? (
        <Loader />
      ) : (
        // <div
        //   style={{
        //     display: "flex",
        //     justifyContent: "center",
        //     alignItems: "center",
        //     height: "60vh", // Adjust itasper requirement.
        //   }}
        // >
        //   <Paper
        //     style={{
        //       display: "flex",
        //       justifyContent: "center",
        //       alignItems: "center",
        //       background: "white",
        //       borderRadius: "50%",
        //       padding: 8,
        //     }}
        //     elevation={8}
        //   >
        //     <CircularProgress color="success" />
        //   </Paper>
        // </div>
        <>
          {/* <ThemeProvider theme={theme}> */}
          {/*  */}
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
            <Grid
              container
              // style={{
              //   background:
              //     "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
              // }}

              style={{
                // backgroundColor: "#0084ff",
                backgroundColor: "#556CD6",
                // backgroundColor: "#1C39BB",
                height: "8vh",

                // #00308F
                // color: "white",

                fontSize: 19,
                // marginTop: 30,
                // marginBottom: "50px",
                // marginTop: ,
                // padding: 8,
                // paddingLeft: 30,
                // marginLeft: "50px",
                marginRight: "75px",
                borderRadius: 100,
              }}
            >
              <IconButton
                style={{
                  // marginTop:"1vh"
                  marginBottom: "2vh",
                  color: "white",
                }}
              >
                <ArrowBackIcon
                  onClick={() => {
                    router?.query?.noticeStatus
                      ? router.push({
                          pathname: "/LegalCase/dashboard",
                          query: { serviceId: router?.query?.serviceId },
                        })
                      : router.back();
                  }}
                />
              </IconButton>

              <Grid item xs={11}>
                <h2
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  {" "}
                  <FormattedLabel id="notice" />
                </h2>
              </Grid>
            </Grid>

            <Box>
              <Grid container sx={{ marginTop: "10px" }}>
                <Grid item xs={9} xl={9} lg={9} md={9} sm={9}></Grid>
                <Grid
                  item
                  xs={3}
                  xl={3}
                  lg={3}
                  md={3}
                  sm={3}
                  sx={{ paddingBottom: "5px" }}
                >
                  {authority?.includes("NOTICE_ENTRY") ? (
                    <Button
                      // type="primary"
                      variant="contained"
                      size="small"
                      style={{
                        marginLeft: "14vw",
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
                      {/* <FormattedLabel id='createNotice' /> */}
                      <FormattedLabel id="add" />
                    </Button>
                  ) : (
                    ""
                  )}
                </Grid>

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
                      border: 1,
                      marginTop: "10px",
                    }}
                  >
                    <ThemeProvider theme={theme}>
                      <DataGrid
                        components={{ Toolbar: GridToolbar }}
                        componentsProps={{
                          toolbar: {
                            showQuickFilter: true,
                            quickFilterProps: { debounceMs: 500 },
                            // printOptions: { disableToolbarButton: true },
                            // disableExport: true,
                            // disableToolbarButton: true,
                            // csvOptions: { disableToolbarButton: true },
                          },
                        }}
                        sx={{
                          backgroundColor: "white",
                          marginTop: "5vh",
                          width: "100%",
                          "& .highlightDate": {
                            backgroundColor: "yellow",
                            // color: "green",
                          },
                        }}
                        // getCellClassName={(params) => {
                        //   if (params.field === "requisitionDate") {
                        //     let requisitionDate = moment(params.value);
                        //     let differenceInDays = currentDateMoment.diff(
                        //       requisitionDate,
                        //       "days"
                        //     );
                        //     // console.log(
                        //     //   "_____t",
                        //     //   params.value,
                        //     //   requisitionDate,
                        //     //   differenceInDays
                        //     // );
                        //     return requisitionDate.month() ===
                        //       currentDateMoment.month() &&
                        //       requisitionDate.year() ===
                        //         currentDateMoment.year() &&
                        //       differenceInDays >= 0 &&
                        //       differenceInDays <= 5
                        //       ? "highlightDate"
                        //       : "";
                        //   }
                        // }}
                        getRowClassName={(params) => {
                          if (params?.row?.requisitionDate) {
                            let requisitionDate = moment(
                              params?.row?.requisitionDate
                            );
                            let differenceInDays = currentDateMoment.diff(
                              requisitionDate,
                              "days"
                            );

                            return requisitionDate.month() ===
                              currentDateMoment.month() &&
                              requisitionDate.year() ===
                                currentDateMoment.year() &&
                              differenceInDays >= 0 &&
                              differenceInDays <= 5
                              ? "highlightDate"
                              : "";
                          }
                          return "";
                        }}
                        getEstimatedRowHeight={() => 50}
                        autoHeight
                        rowHeight={35}
                        headerHeight={40}
                        // sx={{
                        //   backgroundColor: "white",
                        // }}
                        rows={dataSource}
                        columns={columns}
                        getRowId={(row) => row?.id && row?.srNo}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                      />
                    </ThemeProvider>
                  </Box>
                </Grid>
              </Grid>

              <>
                <Modal
                  open={showDocketSubDetailsModel}
                  sx={{
                    padding: 5,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                  }}
                >
                  <Box
                    sx={{
                      width: "50%",
                      bgcolor: "background.paper",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      border: "2px solid black",
                      borderRadius: 5,
                    }}
                  >
                    <TextareaAutosize
                      disabled
                      style={{
                        width: "100%",
                        height: "100%",
                        padding: "15px",
                        resize: "none",
                        overflowY: "auto",
                        borderRadius: 20,
                        marginBottom: "20px",
                        fontWeight: "bold",
                        boxShadow: "0 2px 4px whitesmoke",
                      }}
                      placeholder="Subject Details"
                      value={noticeNarDetails}
                      color="black"
                      minRows={5}
                      maxRows={8}
                    />

                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => {
                        setShowDocketSubDetailsModel(false),
                          setNoticeNarDetails("");
                      }}
                      sx={{ marginBottom: "20px" }}
                    >
                      {language == "en" ? "close" : "बंद करा"}
                    </Button>
                  </Box>
                </Modal>
              </>
            </Box>
          </Paper>
          {/* </ThemeProvider> */}
        </>
      )}

      {/*  */}
    </>
  );
};

export default Index;
