import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import BasicLayout from "../../../../containers/Layout/BasicLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import {
  Backdrop,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Link,
  Modal,
  // Card,data
  // Checkbox,
  // FormControl,
  // FormControlLabel,
  // FormHelperText,
  // FormLabel,
  // Grid,
  // InputLabel,
  // MenuItem,
  // Radio,
  // RadioGroup,
  // Select,
  // TextField,
  Paper,
  TextareaAutosize,
  Tooltip,
} from "@mui/material";
// import * as yup from 'yup'
import { Box } from "@mui/system";
import { DataGrid, GridToolbar, GridViewStreamIcon } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import axios from "axios";
import swal from "sweetalert";
import moment from "moment";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import schema from "../../../../containers/schema/LegalCaseSchema/opinionSchema";

import urls from "../../../../URLS/urls";

// import { Direction } from "react-toastify/dist/utils";
import { Style, Visibility } from "@mui/icons-material";
import BreadcrumbComponent from "../../../../pages/LegalCase/FileUpload/BreadcrumbComponent";
import Loader from "../../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  const token = useSelector((state) => state.user.user.token);
  const [loadderState, setLoadderState] = useState(true);
  const [displayOpinionDetails, setDisplayOpinionDetails] = useState("");
  const [showDocketSubDetailsModel, setShowDocketSubDetailsModel] =
    useState(false);
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
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const language = useSelector((state) => state.labels.language);
  const router = useRouter();
  const [tableData, setTableData] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [courtNames, setCourtNames] = useState([]);
  const [advocateNames, setAdvocateNames] = useState([]);
  const [id, setID] = useState();
  const [concenDeptNames, setconcenDeptName] = useState([]);

  const [officeName, setOfficeName] = useState([]);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [advocateId, setAdvocateId] = useState([]);

  const [editButtonInputState, setEditButtonInputState] = useState(false);

  const [load, setLoad] = useState();

  // Handle cathch method to display Error sweetalert
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

  const handleLoad = () => {
    setLoad(false);
  };

  //   let selectedMenuFromDrawer = Number(
  //     localStorage.getItem("selectedMenuFromDrawer")
  //   );

  // const authority = user?.menus?.find((r) => {
  //   return r.id == selectedMenuFromDrawer;
  // })?.roles;

  const [authority, setAuthority] = useState([]);
  let user = useSelector((state) => state.user.user);
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");

  useEffect(() => {
    let auth = user?.menus?.find((r) => {
      if (r.id == selectedMenuFromDrawer) {
        console.log("r.roles", r.roles);
        return r;
      }
    })?.roles;
    console.log("auth0000", auth);
    setAuthority(auth);

    console.log("userData", user);

    let advId = user?.userDao?.advocateId;
    // set only of advId is not null
    if (advId) setAdvocateId(advId);

    console.log("advId", advId);
  }, []);

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
  // For Paginantion
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [20, 50, 100],
    pageSize: 20,
    page: 1,
  });

  const getAllOpinion = (
    _pageSize = 20,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "Desc"
  ) => {
    console.log(
      "_pageSize,_pageNo",
      router?.query?.opinionStatus,
      _pageSize,
      _pageNo,
      `${urls.LCMSURL}/transaction/opinion/getAll`
    );

    let axiosUrl = `${urls.LCMSURL}/transaction/opinion/getAll`;

    let advId = user?.userDao?.advocateId;
    if (advId) setAdvocateId(advId);
    if (advId)
      axiosUrl = `${urls.LCMSURL}/transaction/opinion/getAllByAdvocateId?advocateId=${advId}`;
    router?.query?.opinionStatus
      ? (axiosUrl = `${urls.LCMSURL}/transaction/opinion/getAllByStatus?status=${router?.query?.opinionStatus}`)
      : axiosUrl;
    console.log("axiosUrl", axiosUrl);
    // setLoad(true);
    setLoadderState(true);

    axios
      .get(
        axiosUrl,
        {
          params: {
            pageSize: _pageSize,
            pageNo: _pageNo,
            sortBy: _sortBy,
            sortDir: _sortDir,
          },

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        {}
      )
      .then((r) => {
        // setLoad(false);
        setLoadderState(false);

        console.log("r765", r);
        let result = r.data.opinion;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log("44", r);
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,
            advPanel: r.advPanel,
            reportAdvPanel: r.reportAdvPanel,
            id: r.id,
            srNo: i + 1,
            opinionRequestDate: moment(r.opinionRequestDate).format(
              "DD-MM-YYYY"
            ),

            searchTitleRptDate: moment(r.searchTitleRptDate).format(
              "DD-MM-YYYY"
            ),

            finalDraftDeliveryDate: moment(r.finalDraftDeliveryDate).format(
              "DD-MM-YYYY"
            ),
            requisitionDate: moment(r.requisitionDate).format("DD-MM-YYYY"),
            opinionSubject: r.opinionSubject,
            // concenDeptName: r.concenDeptName,
            concenDeptId: r.concenDeptId,
            concenDeptName: concenDeptNames?.find(
              (obj) => obj?.id === r.concenDeptId
            )?.department,

            advPanel: r.advPanel,
            reportAdvPanel: r.reportAdvPanel,

            panelRemarks: r.panelRemarks,
            reportRemarks: r.reportRemarks,
            remarks: r.remarks,
            opinionSubmisionDate: moment(r.opinionSubmisionDate).format(
              "YYYY-MM-DD"
            ),
            opinion: r.opinion,
            officeLocation: r.officeLocation,
            officeLocationNameText: officeName?.find(
              (obj) => obj?.id === r.officeLocation
            )?.officeLocationName,
            officeLocationNameTextMr: officeName?.find(
              (obj) => obj?.id === r.officeLocation
            )?.officeLocationNameMr,

            department: r.department,
            department: concenDeptNames?.find(
              (obj) => obj?.id === r.concenDeptId
            )?.department,
            departmentMr: concenDeptNames?.find(
              (obj) => obj?.id === r.concenDeptId
            )?.departmentMr,

            opinionMr: r.opinionMr,

            panelRemarks: r.panelRemarks,
            panelRemarksMr: r.panelRemarksMr,
            reportRemarksMr: r.reportRemarksMr,

            courtCaseNumber: r.courtCaseNumber,

            filedBy: r.filedBy,
            filedByMr: r.filedByMr,
            caseDetails: r.caseDetails,
            caseDetailsMr: r.caseDetailsMr,
            caseNumber: r?.courtCaseEntry?.caseNumber,
            role: r.status,

            // advPanel: true,

            // status: r.activeFlag === "Y" ? "Active" : "Inactive",

            status: r.status,
            advPanelremark: r.advPanelremark,
            advRptRemark: r.advRptRemark,
            opinionAdvPanelList: r.opinionAdvPanelList,
            reportAdvPanelList: r.reportAdvPanelList,

            reportAdvPanelCompletedIds: r.reportAdvPanelCompletedIds,
            opinionAdvPanelCompletedIds: r.opinionAdvPanelCompletedIds,

            reportAdvPanelCompletedCount: r.reportAdvPanelCompletedCount,
            opinionAdvPanelCompletedCount: r.opinionAdvPanelCompletedCount,

            opinionAdvPanelAssignedCount: r.opinionAdvPanelAssignedCount,
            reportAdvPanelAssignedCount: r.reportAdvPanelAssignedCount,

            opinionAdvPanelAssignedIds: r.opinionAdvPanelAssignedIds,
            reportAdvPanelAssignedIds: r.reportAdvPanelAssignedIds,

            clerkRemarkEn: r.clerkRemarkEn,
            clerkRemarkMr: r.clerkRemarkMr,

            hodReassignRemarkEn: r.hodReassignRemarkEn,
            hodReassignRemarkMr: r.hodReassignRemarkMr,
            inwardNo: r.inwardNo,
            trnOpinionAttachmentDao: r?.trnOpinionAttachmentDao
              ? r?.trnOpinionAttachmentDao?.map((daia, i) => {
                  return {
                    ...daia,
                    srNo: i + 1,
                  };
                })
              : [],

            // opinionNo: r.opinionNo,
            opinionNo: r.opinionNo?.substring(
              Math.max(0, r.opinionNo.length - 10)
            ),

            // if advocate id is present in opinionAdvPanelAssignedIds or reportAdvPanelAssignedIds and not present in both reportAdvPanelCompletedIds as well as opinionAdvPanelCompletedIds then show add opinion button
            showAddOpinionButton:
              (r.opinionAdvPanelAssignedIds?.includes(advocateId) &&
                !r.opinionAdvPanelCompletedIds?.includes(advocateId)) ||
              (r.reportAdvPanelAssignedIds?.includes(advocateId) &&
                !r.reportAdvPanelCompletedIds?.includes(advocateId))
                ? true
                : false,
          };
        });
        setDataSource([..._res]);
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getDeptName = () => {
    // alert("HEllo");
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setconcenDeptName(
          res.data.department.map((r, i) => ({
            id: r.id,
            department: r.department,
            departmentMr: r.departmentMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // get Location Name

  const getOfficeName = () => {
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("ghfgf", res);
        setOfficeName(
          res.data.officeLocation.map((r, i) => ({
            id: r.id,
            officeLocationName: r.officeLocationName,
            officeLocationNameMr: r.officeLocationNameMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  //Delete By ID

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
      role: "OPINION_SAVE_AS_DRAFT",
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
            .post(`${urls.LCMSURL}/transaction/opinion/save`, body, {
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
                getAllOpinion();
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
            .post(`${urls.LCMSURL}/transaction/opinion/save`, body, {
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
                getAllOpinion();
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

  // Edit Record
  const actionOnRecord = (record, pageMode) => {
    console.log("Record : ---> ", record);
    router.push({
      pathname: "/LegalCase/transaction/newCourtCaseEntry/view",
      query: {
        pageMode: pageMode,
        ...record,
      },
    });
  };

  // opinion Submission
  const opinionSubmission = (record) => {
    console.log("All Records", record);
    router.push({
      pathname: "/LegalCase/transaction/opinion/opinionSubmission",
      query: {
        pageMode: "opinionSubmission",
        ...record,
        // caseEntry: record.id,
      },
    });
  };

  // opinion Submission
  const opinionApprove = (record) => {
    console.log("All Records", record);
    router.push({
      pathname: "/LegalCase/transaction/opinion/approveOpinion",
      query: {
        pageMode: "opinionApprove",
        ...record,
        // caseEntry: record.id,
      },
    });
  };

  // Add OPinion

  const addOpinion = (record) => {
    console.log("All Records", record);
    router.push({
      pathname: "/LegalCase/transaction/addOpinion/addOpinion",
      query: {
        pageMode: "addOpinion",
        ...record,
        // caseEntry: record.id,
      },
    });
  };

  // add Hearing
  const addHearing = (record) => {
    console.log("All Records", record);
    router.push({
      pathname: "/LegalCase/transaction/opinion/approveOpinion",
      query: {
        pageMode: "addHearing",
        ...record,
        caseEntry: record.id,
      },
    });
  };

  useEffect(() => {
    getDeptName();
    getOfficeName();
  }, []);

  useEffect(() => {
    getAllOpinion();
  }, [concenDeptNames, officeName, authority]);

  useEffect(() => {
    console.log("advocateName", advocateNames);
  }, []);

  // set columns occopying full width of the grid

  const columns = [
    {
      // headerName: "Sr.No",
      headerName: <FormattedLabel id="srNo" />,
      field: "srNo",

      width: 100,
      //   flex:2
      // headerAlign: "center",
      // align: "center",

      // dataIndex: "name",
    },
    // Serial Number
    {
      // headerName: "Sr.No",
      headerName: language == "en" ? "Opinion Number" : "मत क्रमांक",
      field: "opinionNo",

      width: 220,

      renderCell: (params) => {
        return (
          <>
            <IconButton>
              <Button
                sx={{
                  height: "4vh",
                  border: "1px solid blue",
                }}
                variant="contained"
                size="small"
                onClick={() => {
                  router.push({
                    pathname: "/LegalCase/transaction/opinion/view",
                    query: {
                      id: params?.row?.id,
                      pageMode: "Opinion",
                    },
                  });
                }}
              >
                {/* {<FormattedLabel id="opinionDetailsBtn" />} */}
                {params?.row?.opinionNo}
              </Button>
            </IconButton>
          </>
        );
      },
    },

    // inwardNo
    {
      // headerName: "Sr.No",
      headerName: <FormattedLabel id="inwardNo" />,
      field: "inwardNo",

      width: 120,
      //   flex:2
      // headerAlign: "center",
      // align: "center",

      // dataIndex: "name",
    },

    {
      // headerName: "Opinion Request date",
      headerName: <FormattedLabel id="opinionRequestDate" />,
      field: "opinionRequestDate",
      width: 210,
      //   flex:4

      // headerAlign: "center",
      // align: "center",
    },
    {
      headerName: <FormattedLabel id="opinionSubject" />,
      field: "opinionSubject",
      width: 300,
      // renderCell: (params) => <ExpandableCell {...params} />,
      renderCell: (params) => (
        <div
          style={{
            cursor: "pointer",
            overflow: "hidden", // or overflow: "wrap" if you want to allow text wrapping
            whiteSpace: "nowrap", // or whiteSpace: "normal" if you want to allow text wrapping
            textOverflow: "ellipsis", // or remove this line if you don't want to show ellipsis for overflowed text
          }}
          onClick={() => {
            console.log(":a2", params?.row?.opinionSubject);

            setDisplayOpinionDetails(params?.row?.opinionSubject);
            setShowDocketSubDetailsModel(true);
          }}
        >
          <span>{params?.row?.opinionSubject}</span>
        </div>
      ),
      // flex: 5,
    },

    // {
    //   headerName: <FormattedLabel id="locationName" />,

    //   field: language === "en" ? "officeLocationNameText" : "officeLocationNameTextMr",

    //   // width: 210,
    //   flex:4

    // },

    // {
    //   headerName: <FormattedLabel id="deptName" />,

    //   field: language === "en" ? "department" : "departmentMr",

    //   width: 300,
    // },
    // {
    //   headerName: "R - C",
    //   field: "reportAdvPanelCompletedIds",
    // },
    // {
    //   headerName: "O - C",
    //   field: "opinionAdvPanelCompletedIds",
    // },
    // {
    //   headerName: "R - A",
    //   field: "reportAdvPanelAssignedIds",
    // },
    // {
    //   headerName: "O - A",
    //   field: "opinionAdvPanelAssignedIds",
    // },
    // {
    //   headerName: "showAddOpinionButton",
    //   field: "showAddOpinionButton",
    // },

    {
      headerName: <FormattedLabel id="statuDetails" />,
      // headerName:"Status",
      hide: "true",

      // field: "concenDeptName",
      // flex: 3,
      width: 300,

      // flex:6,
      wrap: true,

      field: "status",

      // apply different colors based on the status
      renderCell: (params) => {
        return (
          <div
            style={{
              color:
                params.row.status === "OPINION_APPROVED"
                  ? "green"
                  : params.row.status === "OPINIONS_PARTIALLY_SUBMITTED"
                  ? "orange"
                  : params.row.status === "OPINIONS_SUBMITTED_BY_ALL"
                  ? "violet"
                  : params.row.status === "OPINION_SUBMITTED"
                  ? "blue"
                  : "black",
              // color: "white",
              // padding: "5px",
              // borderRadius: "5px",
              textAlign: "center",
            }}
          >
            {params.row.status}
          </div>
        );
      },

      // headerAlign: "center",
      // align: "center",
    },

    {
      field: "actions",
      // headerName: "Actions",
      headerName: <FormattedLabel id="action" />,
      // width: 250,

      // flex: 25,
      width: 350,
      // flex: 1,
      // background: "red",

      wrap: true,
      sortable: false,
      disableColumnMenu: true,
      // headerAlign: "center",
      // align: "center",
      renderCell: (params) => {
        return (
          <Box>
            {/* {console.log("22", params.row)} */}

            {/* For Opinion Submission */}
            {/* <IconButton>
              <Button
                variant="outlined"
                onClick={() => opinionSubmission(params.row)}
              >
              
                Opinion Submission
              </Button>
            </IconButton> */}

            {/* OPinion Submission Role wise */}

            {/* {console.log(
              "authority",
              authority,
              params.row.role,
              authority?.includes("ADD_OPINION") &&
                // params.row.role === "OPINION_CREATED"
            )} */}

            {/* {authority?.includes("OPINION_SUBMISSION") &&
              params.row.role === "ADD_OPINION_SUBMITTED" && (
                <IconButton>
                  <Button
                    variant="outlined"
                    onClick={() => opinionSubmission(params.row)}
                  >
                    Opinion Submission
                  </Button>
                </IconButton>
              )} */}

            {/* {authority?.includes("ADD_OPINION") &&
              // params.row.status==='OPINION_CREATED'
              // params.row.role === "OPINION_CREATED" && 
              (
                <IconButton>
                  <Button
                    variant="outlined"
                    onClick={() => addOpinion(params.row)}
                  >
                    Add Opinion
                  </Button>
                </IconButton>
              )} */}

            {/* View Icon */}

            {authority?.includes("CREATE_OPINION") &&
              (params.row.status === "OPINION_CREATED" ||
                params.row.status === "OPINIONS_PARTIALLY_SUBMITTED") && (
                <>
                  <IconButton
                    disabled={editButtonInputState}
                    onClick={() => {
                      const record = params.row;

                      router.push({
                        pathname:
                          "/LegalCase/transaction/opinion/createOpinion",
                        query: {
                          pageMode: "View",
                          ...record,
                        },
                      });
                      console.log("row", params.row);
                      ("");
                    }}
                  >
                    {/* <EyeFilled style={{ color: "#556CD6" }} /> */}
                    <Visibility style={{ color: "#556CD6" }}></Visibility>
                  </IconButton>
                </>
              )}

            {/* For Edit */}

            {authority?.includes("OPINION_SAVE_AS_DRAFT") &&
              params.row.status === "OPINION_SAVE_AS_DRAFT" && (
                <>
                  <IconButton
                    disabled={editButtonInputState}
                    onClick={() => {
                      const record = params.row;

                      router.push({
                        pathname:
                          "/LegalCase/transaction/opinion/createOpinion",
                        query: {
                          pageMode: "Edit",
                          ...record,
                          role: "OPINION_SAVE_AS_DRAFT",
                        },
                      });
                      console.log("row", params.row);
                      ("");
                    }}
                  >
                    {/* <EditIcon style={{ color: "#556CD6" }} /> */}
                    <EditIcon style={{ color: "#556CD6" }}></EditIcon>
                  </IconButton>

                  {/* <IconButton
                    disabled={editButtonInputState}
                    onClick={() => {
                      setBtnSaveText("Update"),
                        setID(params.row.id),
                        //   setIsOpenCollapse(true),
                        // setButtonInputState(true);
                        console.log("params.row: ", params.row);
                      reset(params.row);
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
                </>
              )}

            {/** case details button */}
            {/* {(authority?.includes("ENTRY") ||
              (authority?.includes("HOD") &&
                authority?.includes("ADD_HEARING")) ||
              authority?.includes("ADMIN")) && ( */}
            {/* <IconButton>
              <Button
                sx={{
                  height: "4vh",
                  border: "1px solid blue",
                }}
                variant="contained"
                size="small"
                onClick={() => {
                  router.push({
                    pathname: "/LegalCase/transaction/opinion/view",
                    query: {
                      id: params?.row?.id,
                      pageMode: "Opinion",
                    },
                  });
                }}
              >
                {<FormattedLabel id="opinionDetailsBtn" />}
              </Button>
            </IconButton> */}
            {/* )}  */}

            {authority?.includes("OPINION_SUBMISSION") &&
              params.row.status == "OPINIONS_SUBMITTED_BY_ALL" && (
                <Tooltip title="Opinion Submission">
                  <IconButton>
                    <Button
                      variant="contained"
                      sx={{ width: "180px", height: "30px" }}
                      // disabled={editButtonInputState}
                      onClick={() => opinionSubmission(params.row)}
                    >
                      {/* Opinion Submission */}
                      <FormattedLabel id="opinionSubmission" />
                    </Button>
                  </IconButton>
                </Tooltip>
              )}

            {/* Exp  */}

            {/* reassign Button */}

            {authority?.includes("OPINION_SUBMISSION") &&
              params.row.status == "OPINION_REASSIGNED" && (
                // New Button

                <Tooltip title="Opinion Submission">
                  <IconButton
                  // sx={{
                  //   "&:hover": {
                  //     backgroundColor: "transparent",
                  //     cursor: "default"
                  //     }
                  // }}
                  >
                    <Button
                      variant="contained"
                      sx={{ width: "180px", height: "30px" }}
                      // disabled={editButtonInputState}
                      onClick={() => opinionSubmission(params.row)}
                    >
                      Opinion Submission
                    </Button>
                  </IconButton>
                </Tooltip>
              )}

            {/* partially submitted  */}
            {authority?.includes("OPINION_SUBMISSION") &&
              params.row.status == "ADV_OPINION_PARTIALLY_SUBMITTED" && (
                <>
                  <Tooltip title="Opinion Submission">
                    <IconButton
                    // sx={{
                    //   "&:hover": {
                    //     backgroundColor: "transparent",
                    //     cursor: "default"
                    //     }
                    // }}
                    >
                      <Button
                        variant="contained"
                        sx={{ width: "180px", height: "30px" }}
                        // disabled={editButtonInputState}
                        onClick={() => opinionSubmission(params.row)}
                      >
                        Opinion Submission
                      </Button>
                    </IconButton>
                  </Tooltip>
                </>
              )}

            {/* Report/Panel Advocate start */}
            {console.log(
              "test",
              authority,
              params.row.status,
              authority?.includes("ADD_OPINION"),
              params.row.status == "OPINION_CREATED"
            )}
            {authority?.includes("ADVOCATE") &&
              (params.row.status == "OPINION_CREATED" ||
                params.row.status == "OPINIONS_PARTIALLY_SUBMITTED") &&
              params.row.showAddOpinionButton && (
                <>
                  <Tooltip title="Add Opinion">
                    <IconButton
                    // sx={{
                    //   "&:hover": {
                    //     backgroundColor: "transparent",
                    //     cursor: "default"
                    //     }
                    // }}
                    >
                      <Button
                        variant="contained"
                        sx={{ width: "150px", height: "30px" }}
                        disabled={editButtonInputState}
                        onClick={() => {
                          const record = params?.row;
                          localStorage.setItem(
                            "trnOpinionAttachmentDao",
                            params?.row?.trnOpinionAttachmentDao
                              ? JSON.stringify(
                                  params?.row?.trnOpinionAttachmentDao
                                )
                              : []
                          );
                          router.push(
                            {
                              pathname: `/LegalCase/transaction/addOpinion/addOpinion`,
                              query: {
                                pageMode: "Edit",
                                ...record,
                              },
                            },
                            `/LegalCase/transaction/addOpinion/addOpinion`
                          );

                          console.log("rowSagar", params.row);
                          ("");
                        }}
                      >
                        Add Opinion234
                        {/* <FormattedLabel id="addOpinion" /> */}
                      </Button>
                    </IconButton>
                  </Tooltip>
                </>
              )}

            {/* Paritally Submitted  OLD CODE*/}
            {authority?.includes("ADD_OPINION") &&
              params.row.status == "ADV_OPINION_PARTIALLY_SUBMITTED" && (
                <>
                  <Tooltip title="Add Opinion">
                    <IconButton
                    // sx={{
                    //   "&:hover": {
                    //     backgroundColor: "transparent",
                    //     cursor: "default"
                    //     }
                    // }}
                    >
                      <Button
                        variant="contained"
                        sx={{ width: "150px", height: "30px" }}
                        disabled={editButtonInputState}
                        onClick={() => {
                          const record = params.row;
                          router.push(
                            {
                              pathname: `/LegalCase/transaction/addOpinion/addOpinion`,
                              query: {
                                pageMode: "Edit",
                                ...record,
                              },
                            },
                            `/LegalCase/transaction/addOpinion/addOpinion`
                          );

                          console.log("row", params.row);
                          ("");
                        }}
                      >
                        Add Opinion123
                      </Button>
                    </IconButton>
                  </Tooltip>
                </>
              )}

            {authority?.includes("OPINION_APPROVAL") &&
              params.row.status == "OPINION_APPROVED" && (
                // params.row.role === "ADD_OPINION_SUBMITTED" &&
                <Tooltip title="Opinion Submission">
                  <IconButton>
                    <Button
                      size="small"
                      variant="contained"
                      sx={{ width: "180px", height: "30px" }}
                      onClick={() =>
                        router.push({
                          pathname:
                            "/LegalCase/transaction/opinion/digitalSignature",
                          query: {
                            pageMode: "Final",
                            ...params.row,
                          },
                        })
                      }
                    >
                      DIGITAL SIGNATURE
                    </Button>
                  </IconButton>
                </Tooltip>
              )}

            {/* latest */}

            {authority?.includes("OPINION_APPROVAL") &&
              // &&  params.row.role === "OPINION_SUBMITTED"
              params.row.status == "OPINION_SUBMITTED" && (
                // <IconButton>
                //   <Button
                //     variant="outlined"
                //     onClick={() => opinionApprove(params.row)}
                //   >
                //     Opinion Approval
                //   </Button>
                // </IconButton>

                // New Button
                <Tooltip title="Opinion Submission">
                  <IconButton>
                    <Button
                      variant="contained"
                      sx={{ width: "180px", height: "30px" }}
                      // disabled={editButtonInputState}
                      onClick={() => opinionApprove(params.row)}
                    >
                      {/* Opinion Approval */}
                      <FormattedLabel id="opinionApproval" />
                    </Button>
                  </IconButton>
                </Tooltip>
              )}

            {/* Approve Button */}
            {/* {authority?.includes("OPINION_SUBMISSION") &&
              params.row.role === "OPINION_APPROVED" && (
                <IconButton>
                  <Button
                    variant="outlined"
                    // onClick={() => opinionSubmission(params.row)}
                  >
                    Approved
                  </Button>
                </IconButton>
            )} */}
          </Box>
        );
      },
    },
  ];

  return (
    <>
      <div>
        <BreadcrumbComponent />
      </div>
      {/* <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={load}
        onClick={handleLoad}
      >
        Loading....
        <CircularProgress color='inherit' />
      </Backdrop> */}

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
              // marginLeft: "10px",
              marginRight: "10px",
              marginTop: "10px",
              marginBottom: "60px",
              padding: 1,
            }}
          >
            <Grid
              container
              // style={{
              //   // background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",

              //   background: " #1976d2",
              // }}

              style={{
                // backgroundColor: "#0084ff",
                backgroundColor: "#556CD6",
                // backgroundColor: "#1C39BB",

                // #00308F
                color: "white",
                fontSize: 15,
                // marginTop: 30,
                // marginBottom: "50px",
                // marginTop: ,
                padding: 4,
                // paddingLeft: 30,
                // marginLeft: "50px",
                height: "8vh",
                marginRight: "75px",
                borderRadius: 100,
              }}
            >
              <IconButton
                style={{
                  color: "white",

                  marginBottom: "4vh",
                }}
              >
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
                    color: "white",
                  }}
                >
                  {" "}
                  <FormattedLabel id="opinion" />
                </h2>
              </Grid>
            </Grid>

            {/* <Divider /> */}

            <div
              style={{
                // width:"100%",
                // overflowX: 'auto'

                width: "100%",
                height: "100%",
                overflowX: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "right",
                  marginTop: 10,
                  marginRight: "10px",
                }}
              >
                {console.log("authority77", authority)}

                {authority?.includes("CREATE_OPINION") ? (
                  <Button
                    // type="primary"
                    variant="contained"
                    onClick={() =>
                      router.push({
                        pathname: `/LegalCase/transaction/opinion/createOpinion`,
                        // query: {
                        //   pageMode: pageMode,
                        //   role:"OPINION_SAVE_AS_DRAFT"
                        // },
                      })
                    }
                    endIcon={<AddIcon />}
                  >
                    <FormattedLabel id="add" />
                  </Button>
                ) : (
                  ""
                )}

                {/* old */}

                {/* <Button
              // type="primary"
              variant="contained"
              onClick={() =>
                router.push(`/LegalCase/transaction/opinion/createOpinion`)
              }
            >
              <FormattedLabel id="add" />
            </Button>  */}
              </div>

              {/* </Paper> */}

              {/* New Table */}
              <Box
                sx={{
                  // height: "100%",
                  // width: 1000,
                  // marginLeft: 10,
                  // marginTop: "10px",
                  border: 1,
                  marginTop: "10px",

                  width: "100%",
                  // overflowX: 'auto'
                  // overflowX: "scroll",

                  // overflowX: 'auto',
                }}
              >
                <DataGrid
                  // scrollbarSize={17}

                  // disableColumnFilter
                  // disableColumnSelector
                  // disableToolbarButton
                  // disableDensitySelector
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
                  autoHeight
                  sx={{
                    // width:"100%",
                    width: "auto",

                    // overflowY: "scroll",
                    overflowX: "scroll",

                    overflowX: "auto",

                    "& .MuiDataGrid-virtualScrollerContent": {},
                    "& .MuiDataGrid-columnHeadersInner": {
                      backgroundColor: "#556CD6",
                      color: "white",
                    },

                    "& .MuiDataGrid-cell:hover": {
                      color: "primary.main",
                    },
                  }}
                  getEstimatedRowHeight={() => 50}
                  // getRowHeight={() => "auto"}
                  // density="compact"
                  // autoHeight={true}
                  // rowHeight={50}
                  pagination
                  paginationMode="server"
                  // loading={data.loading}
                  rowCount={data.totalRows}
                  rowsPerPageOptions={data.rowsPerPageOptions}
                  page={data.page}
                  pageSize={data.pageSize}
                  rows={data.rows}
                  columns={columns}
                  onPageChange={(_data) => {
                    // getCaseType(data.pageSize, _data);
                    getAllOpinion(data.pageSize, _data);
                  }}
                  onPageSizeChange={(_data) => {
                    console.log("222", _data);
                    // updateData("page", 1);
                    getAllOpinion(_data, data.page);
                  }}
                />
                {/* Displya  Opinion Details */}
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
                        value={displayOpinionDetails}
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
                            setDisplayOpinionDetails("");
                        }}
                        sx={{ marginBottom: "20px" }}
                      >
                        {language == "en" ? "close" : "बंद करा"}
                      </Button>
                    </Box>
                  </Modal>
                </>
              </Box>
            </div>
          </Paper>
          {/* </ThemeProvider> */}
        </>
      )}

      {/*  */}
    </>
  );
};

export default Index;
