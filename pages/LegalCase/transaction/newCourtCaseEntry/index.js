import { EyeFilled } from "@ant-design/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import EditIcon from "@mui/icons-material/Edit";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
  Button,
  Grid,
  IconButton,
  Paper,
  Typography,
  Tooltip,
  Backdrop,
  CircularProgress,
  Modal,
  Link,
} from "@mui/material";
import { Box } from "@mui/system";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/LegalCaseSchema/newCourtCaseSchema";
// import writtenStatementToPrint from "../../../../pages/LegalCase/transaction/newCourtCaseEntry/parawiseRequest/printWrittenStatement";
import PRINTWRITTENSTATEMENT from "./parawiseRequest/printWrittenStatement";
import urls from "../../../../URLS/urls";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import BreadcrumbComponent from "../../../../pages/LegalCase/FileUpload/BreadcrumbComponent";
import { ClearOutlined, DoneAllOutlined } from "@mui/icons-material";
import Loader from "../../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
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
  const token = useSelector((state) => state.user.user.token);

  const router = useRouter();
  const [loadderState, setLoadderState] = useState(true);

  const [tableData, setTableData] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [courtNames, setCourtNames] = useState([]);
  const [advocateNames, setAdvocateNames] = useState([]);
  const [id, setID] = useState();
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [departmentNames, setDepartmentNames] = useState([]);
  const [caseNumbers1, setCaseNumbers1] = useState([]);
  const [caseMainTypes, setCaseMainTypes] = useState([]);
  const [caseTypes, setCaseTypes] = useState([]);
  const [caseSubTypes, setCaseSubTypes] = useState([]);
  const [years, setYears] = useState([]);
  const [isReady, setIsReady] = useState("none");
  const [printData, setPrintData] = useState("none");

  const [caseEntry, setCaseEntry] = useState([]);
  const [paramsData, setParamsdata] = useState();
  const [allParaReqData, setAllParaReqdata] = useState([]);

  const [authority, setAuthority] = useState([]);
  const user = useSelector((state) => state.user.user);
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");

  const [userNames, setUserNames] = useState([]);

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

  useEffect(() => {
    let auth = user?.menus?.find((r) => {
      if (r.id == selectedMenuFromDrawer) {
        console.log("r.roles", r.roles);
        return r;
      }
    })?.roles;
    console.log("auth0000", auth);
    setAuthority(auth);
  }, []);
  const currentUserId = user?.userDao?.department;
  // For Paginantion

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 20,
    page: 1,
  });

  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);
  const styleForModal = {
    // position: "absolute",

    top: "20%",
    // left: "15%",
    marginLeft: "15%",

    // transform: "translate(-50%, -50%)",
    width: "66%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  /* Case Type  - Case Main Type*/
  const getCaseNumberAll = () => {
    axios
      .get(`${urls.LCMSURL}/transaction/newCourtCaseEntry/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCaseNumbers1(
          res.data.newCourtCaseEntry.map((r, i) => ({
            id: r.id,
            caseNumber: r.caseNumber,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // Case Types
  const getCaseTypes = () => {
    axios
      .get(`${urls.LCMSURL}/master/caseMainType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCaseTypes(
          res.data.caseMainType.map((r, i) => ({
            id: r.id,
            caseMainType: r.caseMainType,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // Case Sub Types
  const getCaseSubType = () => {
    axios
      .get(`${urls.LCMSURL}/master/caseSubType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCaseSubTypes(
          res.data.caseSubType.map((r, i) => ({
            id: r.id,
            subType: r.subType,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // Gete Years
  const getYears = () => {
    axios
      .get(`${urls.CFCURL}/master/year/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setYears(
          res.data.year.map((r, i) => ({
            id: r.id,
            year: r.year,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // Court Names
  const getCourtName = () => {
    axios
      .get(`${urls.LCMSURL}/master/court/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCourtNames(
          res.data.court.map((r, i) => ({
            id: r.id,
            // caseMainType: r.caseMainType,
            courtNameEn: r.courtName,
            courtNameMr: r.courtMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // Advocate Name
  const getAdvocateName = () => {
    axios
      .get(`${urls.LCMSURL}/master/advocate/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAdvocateNames(
          res.data.advocate.map((r, i) => ({
            id: r.id,
            advocateName: r.firstName + " " + r.middleName + " " + r.lastName,
            advocateNameMr:
              r.firstNameMr + " " + r.middleNameMr + " " + r.lastNameMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // get Concern Person NamedNodeMap(UserList)
  const getUserList = async (value) => {
    try {
      const { data } = await axios.get(
        `${urls.LCMSURL}/master/user/getUserByDpt?dptId=${value}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("dataaaaaa", data);
      setUserNames(
        data?.map((r, i) => ({
          id: r.id,
          userName: r.firstNameEn + " " + r.middleNameEn + " " + r.lastNameEn,
          userNameMr: r.firstNameMr + " " + r.middleNameMr + " " + r.lastNameMr,
        }))
      );
    } catch (e) {
      console.log("error", e);

      callCatchMethod(e, language);
    }
  };

  // DepartmentName
  const getDepartmentName = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDepartmentNames(
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

  // mark as completed

  const approveWrittenStatementByHod = (Data) => {
    console.log("dataSagar", Data);
    let body = {
      id: Data.id,
      updateUserId: user?.id,
    };
    console.log("body", body);
    axios
      .post(
        `${urls.LCMSURL}/transaction/newCourtCaseEntry/printWrittenStatementByLawyer`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("createWrittenStatementByLawyer", res);
        if (res.status == 201) {
          sweetAlert("Saved!", "Record Submitted successfully !", "success");
          router.push(`/LegalCase/transaction/newCourtCaseEntry`);
        } else if (res.status == 200) {
          sweetAlert("Updated!", "Record Updated successfully !", "success");
          router.push(`/LegalCase/transaction/newCourtCaseEntry`);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const [load, setLoad] = useState();

  const handleLoad = () => {
    setLoad(false);
  };

  // Case entry
  const getAllCaseEntry = (
    _pageSize = 20,
    // _pageSize = 1,

    _pageNo = 0,
    // _pageNo = 20,

    _sortBy = "id",
    _sortDir = "Desc"
  ) => {
    setLoadderState(true);

    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    //user
    // console.log("user", user, authority);
    let urlEndPoint;
    router?.query?.caseStatusFromDashboard
      ? (urlEndPoint = `/getAllByCaseStatus?caseStatus=${router?.query?.caseStatusFromDashboard}`)
      : authority?.includes("ENTRY") && authority?.includes("WRITTEN_STATEMENT")
      ? (urlEndPoint = `/getNewCourtCaseEntryDetails`)
      : (urlEndPoint = "/getAll");

    setLoad(true);

    axios
      .get(`${urls.LCMSURL}/transaction/newCourtCaseEntry${urlEndPoint}`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setLoadderState(false);
        console.log("r", r);
        let neww = [];
        let result = r.data.newCourtCaseEntry;
        console.log("result", result);
        let _res;

        if (
          advocateNames?.length > 0 &&
          caseTypes?.length > 0 &&
          courtNames?.length > 0 &&
          userNames?.length > 0
        ) {
          _res = result.map((r, i) => {
            console.log("44");
            setLoadderState(false);
            return {
              ...r,
              // r.data.map((r, i) => ({
              activeFlag: r.activeFlag,
              id: r.id,

              // Generate Sr No based on the page size and page no
              srNo: _pageSize * _pageNo + i + 1,

              caseNumber: r.caseNumber,
              caseNoYear: r.caseNoYear,
              courtCaseNumber: r.courtCaseNumber,
              caseReference: r.caseReference,
              caseMainType: r.caseMainType,
              courtName: r.courtName,
              court: r.court,
              stampNo: r.stampNo,
              fillingDate: r.fillingDate,
              fillingDateT: moment(r.fillingDate).format("DD-MM-YYYY"),
              advocateName: r.advocateName,
              advocateName1: advocateNames?.find(
                (obj) => obj.id == r.advocateName
              )?.advocateName,
              advocateNameMr: advocateNames?.find(
                (obj) => obj.id === r.advocateName
              )?.advocateNameMr,
              filedBy: r.filedBy,
              filedByMr: r.filedByMr,
              filedAgainst: r.filedAgainst,
              caseDetails: r.caseDetails,
              caseDetailsMr: r.caseDetailsMr,
              caseMainType: r.caseMainType,
              caseMainTypeName: caseTypes?.find(
                (obj) => obj.id === r.caseMainType
              )?.caseMainType,
              subType: r.subType,
              year: r.year,
              opponentAdvocate: r.opponentAdvocate,
              concernPerson: r.concernPerson,
              concernPersonId: r?.concernPersonId,
              //appearanceDate
              appearanceDate: r.appearanceDate,
              // appearanceDate: moment(r.appearanceDate).format("DD-MM-YYYY"),
              location: r.location,
              department: r.department,
              priviouseCourtName: r.priviouseCourtName,
              courtCaseNumber: r.courtCaseNumber,
              caseEntry: r.caseEntry,
              filedAgainstMr: r.filedAgainstMr,
              opponentAdvocateMr: r.opponentAdvocateMr,
              concernPersonMr: r.concernPersonMr,
              fixAmount: r.fixAmount,
              paidAmountDate: moment(r.paidAmountDate).format("YYYY-MM-DD"),
              pendingAmount: r.pendingAmount,
              paidAmount: r.paidAmount,
              caseNumber: r.caseNumber,
              caseStatus: r.caseStatus,
              caseRefnceNo: r.caseRefnceNo,
              parawiseDepartmentAssignedCount:
                r.parawiseDepartmentAssignedCount,
              parawiseDepartmentCompletedCount:
                r.parawiseDepartmentCompletedCount,
              lawyerRemarkEn: r.lawyerRemarkEn,
              lawyerRemarkMr: r.lawyerRemarkMr,

              advocateName2: r.advocateName2,
              advocateNameMr2: r.advocateNameMr2,

              // If case status is PARAWISE_RPT_SENT_TO_DEPARTMENT_CLERKS then append count to case status
              caseStatus:
                r.caseStatus === "PARAWISE_RPT_SENT_TO_DEPARTMENT_CLERKS"
                  ? `${r.caseStatus} (${r.parawiseDepartmentCompletedCount} / ${r.parawiseDepartmentAssignedCount})`
                  : r.caseStatus,

              //CONCRND_DPT_HOD_APPROVED
              caseStatus:
                r.caseStatus === "CONCRND_DPT_HOD_APPROVED"
                  ? `${r.caseStatus} (${r.parawiseDepartmentCompletedCount} / ${r.parawiseDepartmentAssignedCount})`
                  : r.caseStatus,

              NewCourtCaseEntryAttachmentList: JSON.stringify(
                r.NewCourtCaseEntryAttachmentList.map((r, i) => {
                  return { ...r, srNo: i + 1 };
                })
              ),
              trnDptLocationDao: JSON.stringify(
                r?.trnDptLocationDao?.map((r, i) => {
                  return { ...r, srNo: i + 1 };
                })
              ),

              billDetails: r?.billDtls,
              trnParawiseRequestDao: r?.trnParawiseRequestDao,
              trnParawiseRequestDao1: r?.trnParawiseRequestDao1,

              // billDetails: JSON.stringify(
              //   r?.billDtls?.map((r, i) => {
              //     return { ...r, srNO: i + 1 };
              //   }),
              // ),
              courtNameMr: courtNames?.find((obj) => obj.id == r.court)
                ?.courtNameMr,
              courtNameEn: courtNames?.find((obj) => obj.id == r.court)
                ?.courtNameEn,

              // concernPersonMr: r.concernPersonMr,
              concernPersonMr: userNames?.find((obj) => obj.id)?.userName,

              status: r.activeFlag === "Y" ? "Active" : "Inactive",
            };
          });

          console.log("res1212", _res);
          setDataSource([..._res]);
          setData({
            rows: _res ?? [],
            totalRows: r.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: r.data.pageSize,
            page: r.data.pageNo,
          });
        }
      })
      // .catch((e) => {
      //   swal(
      //     "Error",
      //     e?.message ? e?.message : "Something Went Wrong",
      //     "error"
      //   );
      //   setLoad(false);
      //   setLoadderState(false);
      // });
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };
  // useEffect(() => {
  //   setData((prevData) => prevData.sort((a, b) => b.id - a.id));
  // }, [data]);

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
            .post(`${urls.LCMSURL}/transaction/newCourtCaseEntry/save`, body, {
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
                getAllCaseEntry();
              }
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
            .post(`${urls.LCMSURL}/transaction/newCourtCaseEntry/save`, body, {
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
                getAllCaseEntry();
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

  // add Hearing
  const addHearing = (record) => {
    console.log("All Records", record);
    router.push({
      pathname: "/LegalCase/transaction/addHearing/view",
      query: {
        pageMode: "addHearing",
        ...record,
        // caseNumber: record.id,
        caseEntry: record.id,
      },
    });
  };

  const componentRef = useRef(null);

  // console.log("componentRef", componentRef);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });

  useEffect(() => {
    console.log("authority", authority);
  }, [authority]);
  useEffect(() => {
    if (printData?._advRemarks) {
      handlePrint();
    }
    // console.log("authority", authority);
  }, [printData]);

  const _col = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "parawiseNumber",
      headerName: <FormattedLabel id="parawiseNo" />,
      width: 180,
      align: "center",
      headerAlign: "center",
    },
    // parawiseCreatedDate
    {
      field: "parawiseCreatedDate",
      headerName: <FormattedLabel id="parawiseDate" />,
      width: 150,
      align: "center",
      headerAlign: "center",
      valueFormatter: (params) => {
        // Format the date using Moment.js
        const formattedDate = moment(params.value).format("DD-MM-YYYY");
        return formattedDate;
      },
    },
    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      flex: 1,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="action" />,
      flex: 1,
      minWidth: 350,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            {/* legal hod approval */}
            {authority?.includes("ENTRY") &&
              authority?.includes("HOD") &&
              params?.row?.status == "parawiseCreated" && (
                <IconButton>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      const record = paramsData;
                      console.log("row1111", params?.row?.id, record);
                      return router.push({
                        pathname:
                          "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest/parawiseReportLcHod",
                        query: {
                          ...record,
                          paraReqId: params?.row?.id,
                        },
                      });
                    }}
                  >
                    <FormattedLabel id="hodRemarks" />
                  </Button>
                </IconButton>
              )}
            {/* legal clerk after revert by legal hod  */}
            {((authority?.includes("ENTRY") &&
              authority?.includes("ADD_HEARING") &&
              params?.row?.status == "REASSIGN_BY_LEGAL_HOD") ||
              (authority?.includes("ADMIN") &&
                params?.row?.status == "REASSIGN_BY_LEGAL_HOD")) && (
              <IconButton>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    const record = paramsData;
                    // localStorage.setItem(
                    //   "trnDptLocationDao",
                    //   params?.row?.trnDptLocationDao
                    // );
                    // console.log("row1111", params.row);
                    return router.push({
                      pathname:
                        "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest/parawiseReportLcClerk",
                      query: {
                        ...record,
                        paraReqId: params?.row?.id,
                      },
                    });
                  }}
                >
                  Recreate Parawise Request
                </Button>
              </IconButton>
            )}
            {((authority?.includes("WRITTEN_STATEMENT") &&
              params?.row?.status == "APPROVE_BY_CONSERN_DPT_HOD") ||
              authority?.includes("ADMIN")) && (
              <IconButton>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    const record = params.row;
                    console.log("row1111", params.row);
                    return router.push({
                      pathname:
                        "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest/advocateWrittenStatement",
                      query: {
                        ...record,
                        paraReqId: params?.row?.id,
                      },
                    });
                  }}
                >
                  {<FormattedLabel id="writtenStatememt" />}
                </Button>
              </IconButton>
            )}

            {((authority?.includes("HOD") &&
              authority?.includes("ENTRY") &&
              params?.row?.status == "APPROVE_BY_ADVOCATE") ||
              (authority?.includes("ADMIN") &&
                params?.row?.status == "APPROVE_BY_ADVOCATE")) && (
              <IconButton>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    const record = params.row;
                    console.log("row1111", params.row);
                    return router.push({
                      pathname:
                        "/LegalCase/transaction/newCourtCaseEntry/writtenStatementApprovedByHOD",
                      query: {
                        // ...record,
                        paraReqId: params?.row?.id,
                      },
                    });
                  }}
                >
                  Written Approval
                </Button>
              </IconButton>
            )}
            {((authority?.includes("WRITTEN_STATEMENT") &&
              authority?.includes("ENTRY") &&
              params?.row?.status == "DIGITAL_SIGNATURE_APPROVE") ||
              (authority?.includes("ADMIN") &&
                params?.row?.status == "DIGITAL_SIGNATURE_APPROVE")) && (
              <IconButton>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    // this state for emptying prev print data
                    setPrintData({});
                    let _advRemarks = params?.row?.advocateRemark
                      ? JSON?.parse(params?.row?.advocateRemark)?.filter(
                          (object, index, self) =>
                            index ===
                            self?.findIndex(
                              (o) => o?.departmentId === object?.departmentId
                            )
                        )
                      : [];
                    console.log("_advRemarks", _advRemarks);
                    // this state for set new print data
                    setPrintData({ ...params.row, _advRemarks: _advRemarks });
                    // handlePrint();
                    setIsReady("none");
                    // console.log("params.row", params.row);
                  }}
                >
                  {<FormattedLabel id="printWrittenStatement" />}
                </Button>
              </IconButton>
            )}
          </Box>
        );
      },
    },
  ];

  // For Column width set
  const ExpandableCell = ({ value }) => {
    const [expanded, setExpanded] = useState(false);
    return (
      <div>
        {expanded ? value : value?.slice(0, 40)}{" "}
        {value?.length > 40 && (
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
    // old
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
      // width: 120,
    },
    //courtCaseNumber
    {
      field: "caseNoYear",
      headerName: <FormattedLabel id="courtCaseNumber" />,
      align: "center",
      headerAlign: "center",
      width: 230,
    },
    {
      field: language === "en" ? "courtNameEn" : "courtNameMr",
      headerName: <FormattedLabel id="courtName" />,
      width: 250,
      // flex: 1,
      align: "center",
      headerAlign: "center",

      renderCell: (params) => <ExpandableCell {...params} />,
    },

    {
      field: "fillingDateT",
      headerName: <FormattedLabel id="fillingDate" />,
      // flex: 1,
      width: 190,
      headerAlign: "center",
      align: "center",
    },
    // filedBy
    {
      field: language === "en" ? "filedBy" : "filedByMr",
      headerName: <FormattedLabel id="filedBy" />,
      // flex: 1,
      width: 190,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <ExpandableCell {...params} />,
    },
    // {
    //   field: "stampNo",
    //   headerName: <FormattedLabel id="stampNo" />,
    //   width: 170,
    //   // flex: 1,
    //   headerAlign: "center",
    //   align: "center",
    // },
    {
      field: language === "en" ? "advocateName1" : "advocateNameMr",
      headerName: <FormattedLabel id="advocateName" />,
      width: 240,
      // flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      //
      field: language === "en" ? "caseStatus" : "caseStatus",
      headerName: <FormattedLabel id="caseStatus" />,
      width: 660,
      // flex: 1,
      hide: true,
      headerAlign: "center",
      align: "center",

      renderCell: (params) => <ExpandableCell {...params} />,

      // add colours depending on the status of the case and default colour as black
      renderCell: (params) => {
        <div
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            maxWidth: "200px",
          }}
        >
          let data = params.row; // console.log("data", data); return (
          <Box>
            {data.caseStatus === "CASE CREATED" ? (
              <Typography style={{ color: "blue" }}>
                {data.caseStatus}
              </Typography>
            ) : data.caseStatus === "WRITTEN_STATEMENT_APPROVED_BY_HOD" ? (
              <Typography style={{ color: "green" }}>
                {data.caseStatus}
              </Typography>
            ) : data.caseStatus === "DIGITILY_SIGNED_BY_CONCERNED_HOD" ? (
              <Typography style={{ color: "purple" }}>
                {data.caseStatus}
              </Typography>
            ) : data.caseStatus === "WS_PROCESS_COMPLETED" ? (
              <Typography style={{ color: "darkgreen" }}>
                {data.caseStatus}
              </Typography>
            ) : data.caseStatus === "PARAWISE_RPT_SENT_TO_DEPARTMENT_CLERKS" ? (
              <Typography style={{ color: "orange" }}>
                {data.caseStatus}
              </Typography>
            ) : data.caseStatus ===
              "PARAWISE_REPORT_DEPARTMENT_ASSIGNED_AND_SENT_TO_HOD" ? (
              <Typography style={{ color: "brown" }}>
                {data.caseStatus}
              </Typography>
            ) : (
              <Typography style={{ color: "black" }}>
                {data.caseStatus}
              </Typography>
            )}
          </Box>
          );
        </div>;
      },

      // renderCell: (params) => (
      //   <Tooltip title={params.row.caseStatus} placement="top">
      //     <span>{params.row.caseStatus}</span>
      //   </Tooltip>
      // ),
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      headerAlign: "center",
      // align: "center",
      width: "1000",
      // flex: 5,

      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        let data = params.row;
        // console.log(
        //   "paramsData",
        //   data?.caseStatus,
        //   data?.isVakalatnamaApproved
        // );
        return (
          <Box>
            {/**View Button */}
            {((authority?.includes("ENTRY") &&
              authority?.includes("ADD_HEARING")) ||
              authority?.includes("ADMIN")) && (
              <Tooltip title="View">
                <IconButton
                  disabled={editButtonInputState}
                  onClick={() => {
                    const tempBillDetail = params?.row?.billDetails;

                    console.log("tempBillDetail1212", params?.row);

                    const billDetail = tempBillDetail.map((data, index) => {
                      return {
                        ...data,
                        srNo: index + 1,

                        caseNumberName: caseNumbers1.find((data1) => {
                          return data?.caseNumber == data1?.id;
                        })?.caseNumber,

                        caseMainTypeEng: caseMainTypes.find((data1) => {
                          return data?.caseMainType == data1?.id;
                        })?.caseMainType,

                        caseMainTypeMar: caseMainTypes.find((data1) => {
                          return data?.caseMainType == data1?.id;
                        })?.caseMainTypeMr,

                        caseSubTypeEng: caseSubTypes.find((data1) => {
                          return data?.caseSubType == data1?.id;
                        })?.subType,

                        caseSubTypeMar: caseSubTypes.find((data1) => {
                          return data?.caseSubType == data1?.id;
                        })?.caseSubTypeMr,

                        // concernPerson
                        concernPerson: userNames.find((data1) => {
                          return data?.userName == data1?.id;
                        })?.concernPerson,
                      };
                    });

                    // console.log("bill12", billDetail);

                    localStorage.setItem(
                      "billDetail",
                      JSON.stringify(billDetail)
                    );

                    // localStorage.setItem("billDetail", params?.row?.billDetails);
                    localStorage.setItem("pageMode", "View");
                    localStorage.setItem("buttonInputStateNew", false);
                    localStorage.setItem("deleteButtonInputState", false);
                    localStorage.setItem("btnInputStateDemandBill", false);
                    localStorage.setItem("addButtonInputState", false);
                    localStorage.setItem("buttonInputState", true);
                    localStorage.setItem("disabledButtonInputState", true);
                    localStorage.setItem(
                      "newCourtCaseEntry",
                      JSON.stringify(params?.row)
                    );
                    localStorage.setItem(
                      "NewCourtCaseEntryAttachmentList",
                      params?.row?.NewCourtCaseEntryAttachmentList
                    );
                    localStorage.setItem(
                      "trnDptLocationDao",
                      params?.row?.trnDptLocationDao
                    );

                    router.push({
                      pathname: "/LegalCase/transaction/newCourtCaseEntry/view",
                      pageMode: "View",
                    });
                  }}
                >
                  <EyeFilled style={{ color: "#556CD6" }} />
                </IconButton>
              </Tooltip>
            )}

            {/*** Edit Button */}
            {((authority?.includes("ENTRY") &&
              authority?.includes("ADD_HEARING")) ||
              authority?.includes("ADMIN")) && (
              <Tooltip title="Edit">
                <IconButton
                  disabled={editButtonInputState}
                  onClick={() => {
                    console.log("params32323", params?.row);
                    const tempBillDetail = params?.row?.billDetails;
                    console.log("tempBillDetail", params?.row?.billDetails);
                    const billDetail = tempBillDetail.map((data, index) => {
                      return {
                        ...data,
                        srNo: index + 1,
                        caseNumberName: caseNumbers1.find((data1) => {
                          return data?.caseNumber == data1?.id;
                        })?.caseNumber,
                        caseMainTypeEng: caseMainTypes.find((data1) => {
                          return data?.caseMainType == data1?.id;
                        })?.caseMainType,
                        caseMainTypeMar: caseMainTypes.find((data1) => {
                          return data?.caseMainType == data1?.id;
                        })?.caseMainTypeMr,
                        caseSubTypeEng: caseSubTypes.find((data1) => {
                          return data?.caseSubType == data1?.id;
                        })?.subType,
                        caseSubTypeMar: caseSubTypes.find((data1) => {
                          return data?.caseSubType == data1?.id;
                        })?.caseSubTypeMr,

                        // concernPerson: userNames.find((data1) => {
                        //   return data?.user == data1?.id;
                        // }),

                        // concernPerson: r.concernPerson,
                      };
                    });
                    localStorage.setItem(
                      "billDetail",
                      JSON.stringify(billDetail)
                    );
                    localStorage.setItem("deleteButtonInputState", true);
                    localStorage.setItem("btnInputStateDemandBill", true);
                    localStorage.setItem("buttonInputState", false);
                    localStorage.setItem("buttonInputStateNew", true);
                    // localStorage.setItem("pageMode", "EDIT");
                    localStorage.setItem("disabledButtonInputState", false);
                    localStorage.setItem(
                      "newCourtCaseEntry",
                      JSON.stringify(params?.row)
                    );
                    localStorage.setItem(
                      "NewCourtCaseEntryAttachmentList",
                      params?.row?.NewCourtCaseEntryAttachmentList
                    );
                    localStorage.setItem(
                      "trnDptLocationDao",
                      params?.row?.trnDptLocationDao
                    );
                    router.push({
                      pathname: "/LegalCase/transaction/newCourtCaseEntry/view",
                    });
                  }}
                >
                  <EditIcon style={{ color: "#556CD6" }} />
                </IconButton>
              </Tooltip>
            )}

            {/** case details button */}
            {/* {(authority?.includes("ENTRY") ||
              (authority?.includes("HOD") &&
                authority?.includes("ADD_HEARING")) ||
              authority?.includes("ADMIN")) && ( */}
            <IconButton>
              <Button
                sx={{
                  height: "4vh",
                  border: "1px solid blue",
                }}
                variant="contained"
                size="small"
                onClick={() => {
                  console.log("2323423", params?.row);
                  localStorage.setItem("pageMode", "View");
                  localStorage.setItem("buttonInputStateNew", false);
                  localStorage.setItem("deleteButtonInputState", false);
                  localStorage.setItem("btnInputStateDemandBill", false);
                  localStorage.setItem("buttonInputState", true);
                  localStorage.setItem("disabledButtonInputState", true);
                  localStorage.setItem(
                    "newCourtCaseEntry",
                    JSON.stringify(params?.row)
                  );
                  localStorage.setItem(
                    "NewCourtCaseEntryAttachmentList",
                    params?.row?.NewCourtCaseEntryAttachmentList
                  );
                  localStorage.setItem(
                    "trnDptLocationDao",
                    params?.row?.trnDptLocationDao
                  );

                  router.push({
                    pathname: "/LegalCase/transaction/newCourtCaseEntry/view1",
                    query: {
                      caseId: params?.row?.id,
                      // status: params?.row?.caseStatus,

                      pageMode: "CaseDetails",
                    },
                  });
                }}
              >
                {<FormattedLabel id="caseDetailsBtn" />}
              </Button>
            </IconButton>
            {/* )} */}

            {/** add hearing button */}
            {((authority?.includes("ENTRY") &&
              authority?.includes("ADD_HEARING")) ||
              authority?.includes("ADMIN")) && (
              <IconButton>
                <Button
                  sx={{
                    height: "4vh",
                    border: "1px solid blue",
                  }}
                  variant="contained"
                  size="small"
                  onClick={() => {
                    console.log("__addHearing", params?.row);
                    addHearing(params.row);
                  }}
                >
                  {<FormattedLabel id="addHearing" />}
                </Button>
              </IconButton>
            )}

            {/* **Vakalatnama Button ** */}

            {/* {((data.vakalatnamaStatus !== "VAKALATNAMA_CREATED" &&
              authority?.includes("ENTRY") &&
              authority?.includes("ADD_HEARING")) ||
              authority?.includes("ADMIN")) &&
              data.caseStatus == "CASE CREATED" && ( */}

            {/* (authority?.includes("ENTRY") || authority?.includes("ADMIN")) */}

            {((data?.caseStatus === "CASE CREATED" &&
              data?.isVakalatnamaApproved === null) ||
              data?.isVakalatnamaApproved === "N") &&
              (authority?.includes("CLERK") ||
                authority?.includes("ADMIN")) && (
                <IconButton>
                  <Button
                    // variant="contained"
                    sx={{
                      // backgroundColor: "#789BF9",
                      color: "white",
                      border: "1px solid blue",
                      height: "4vh",
                    }}
                    variant="contained"
                    size="small"
                    onClick={() => {
                      const record = params.row;
                      console.log("row1111", params.row);
                      return router.push({
                        pathname:
                          "/LegalCase/transaction/newCourtCaseEntry/vakalatnama",

                        query: {
                          // pageMode: "Final",

                          id: record?.id,
                          // getById:record.row.id
                        },
                      });
                    }}
                  >
                    <FormattedLabel id="vakalatnama" />
                    {/* Vakalatnama */}
                  </Button>
                </IconButton>
              )}

            {/* )} 

            {/* ***Vakalatnama Approval */}

            {/* Exp */}
            {authority?.includes("HOD") &&
              // authority?.includes("ADD_HEARING") &&
              // data.caseStatus == "CASE CREATED" &&
              authority?.includes("HOD") &&
              data.vakalatnamaStatus == "VAKALATNAMA_CREATED" && (
                <IconButton>
                  <Button
                    sx={{
                      height: "4vh",
                      // backgroundColor: "green",
                      border: "1px solid blue",
                    }}
                    variant="contained"
                    size="small"
                    onClick={() => {
                      const record = params.row;
                      console.log("row1111", params.row);
                      return router.push({
                        pathname:
                          "/LegalCase/transaction/newCourtCaseEntry/vakalatnamaApproved",

                        query: {
                          // pageMode: "Final",

                          id: record?.id,
                          // getById:record.row.id
                        },
                      });
                    }}
                    endIcon={<DoneAllOutlined />}
                  >
                    {/* Approve Vakalatnama */}
                    <FormattedLabel id="approvevakalatnama" />
                  </Button>
                </IconButton>
              )}

            {/** parawise report button */}

            {/* {((authority?.includes("ENTRY") &&
              authority?.includes("ADD_HEARING") &&
              data.caseStatus == "CASE CREATED") ||
              (authority?.includes("ADMIN") &&
                data.caseStatus == "CASE CREATED")) && ( */}
            {params?.row?.isVakalatnamaApproved === "Y" && (
              <IconButton>
                <Button
                  sx={{
                    // backgroundColor: "#5EB8E6",
                    border: "1px solid blue",
                    height: "4vh",
                  }}
                  variant="contained"
                  size="small"
                  onClick={() => {
                    const record = params.row;
                    setParamsdata(record);
                    let _parawiseReqData = record?.trnParawiseRequestDao1 ?? [];
                    console.log("setParamsdata", _parawiseReqData);
                    console.log("____record", record);
                    setAllParaReqdata(_parawiseReqData);
                    handleOpen();
                    // console.log("row1111", params.row);
                    // localStorage.setItem(
                    //   "trnDptLocationDao",
                    //   params?.row?.trnDptLocationDao
                    // );
                    // return router.push({
                    //   pathname:
                    //     "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest/parawiseReportLcClerk",
                    //   query: {
                    //     ...record,
                    //   },
                    // });
                  }}
                >
                  <FormattedLabel id="parawiseRequest" />
                  {/* Parawise Request */}
                </Button>
              </IconButton>
            )}
            {/* )} */}

            {/* Reassign button */}
            {((authority?.includes("ENTRY") &&
              authority?.includes("ADD_HEARING") &&
              data.caseStatus == "PARAWISE_RPT_REASSIGNED_TO_LEGAL_CLERK") ||
              (authority?.includes("ADMIN") &&
                data.caseStatus ==
                  "PARAWISE_RPT_REASSIGNED_TO_LEGAL_CLERK")) && (
              <IconButton>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    const record = params.row;
                    localStorage.setItem(
                      "trnDptLocationDao",
                      params?.row?.trnDptLocationDao
                    );
                    console.log("row1111", params.row);
                    return router.push({
                      pathname:
                        "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest/parawiseReportLcClerk",
                      // below path for testing the hod UI
                      // "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest/parawiseReportLcHod",
                      // below path for testing the conc dpt UI
                      // "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest/parawiseReportConcDptClerk",
                      // "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest",
                      query: {
                        ...record,
                      },
                    });
                  }}
                >
                  {/* <FormattedLabel id="clerkRemark" /> */}
                  Recreate Parawise Request
                </Button>
              </IconButton>
            )}

            {/* {authority?.includes("ENTRY") &&
              user?.roles?.includes("HOD") &&
              data.caseStatus ==
                "PARAWISE_REPORT_DEPARTMENT_ASSIGNED_AND_SENT_TO_HOD" && (
                <IconButton>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      const record = params.row;
                      console.log("row1111", params.row);
                      return router.push({
                        pathname:
                          // "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest/parawiseReportLcClerk",
                          // below path for testing the hod UI
                          "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest/parawiseReportLcHod",
                        // below path for testing the conc dpt UI
                        // "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest/parawiseReportConcDptClerk",
                        // "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest",
                        query: {
                          ...record,
                        },
                      });
                    }}
                  >
                    <FormattedLabel id="hodRemarks" />
                  </Button>
                </IconButton>
              )} */}

            {/* for concern Dept Clerk */}
            {/* {authority?.includes("CONCERN DEPARTMENT CLERK") &&
              data.caseStatus == "PARAWISE_RPT_SENT_TO_DEPARTMENT_CLERKS" && (
                <IconButton>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      const record = params.row;
                      console.log("row1111", params.row);
                      return router.push({
                        pathname:
                          
                          "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest/parawiseReportConcDptClerk",

                        query: {
                          ...record,
                        },
                      });
                    }}
                  >
                    Parawise Remark
                  </Button>
                </IconButton>
              )} */}

            {/* for Concern Department HOD digital signature */}

            {authority?.includes("CONCERN DEPARTMENT HOD") &&
              data.caseStatus ==
                "WRITTEN_STATEMENT_CREATED_SENT_TO_CONCRND_DPT_HOD" && (
                // data.caseStatus == "WRITTEN_STATEMENT_APPROVED_BY_HOD" && (

                <IconButton>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      const record = params.row;
                      console.log("row1111", params.row);
                      return router.push({
                        pathname:
                          "/LegalCase/transaction/newCourtCaseEntry/digitalSignature",

                        query: {
                          ...record,
                        },
                      });
                    }}
                  >
                    Digital signature
                  </Button>
                </IconButton>
              )}

            {/* {authority?.includes("CONCERN DEPARTMENT HOD") &&
              data.caseStatus == "WRITTEN_STATEMENT_CREATED" && (
                // data.caseStatus == "WRITTEN_STATEMENT_APPROVED_BY_HOD" && (

                <IconButton>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      const record = params.row;
                      console.log("row1111", params.row);
                      return router.push({
                        pathname:
                          "/LegalCase/transaction/newCourtCaseEntry/digitalSignature",

                        query: {
                          ...record,
                        },
                      });
                    }}
                  >
                    Digital signature
                  </Button>
                </IconButton>
              )} */}

            {/* {console.log("Auth Exists",authority?.includes("CONCERN DEPARTMENT HOD"))} */}
            {/* EXP  */}

            {params.row.caseNumber == 500 && (
              <>
                {console.log("dataaaaaa", data)}
                {console.log(
                  "Final Dept ",
                  params.row.finalAssignedDepartmentId
                )}
                {console.log("userId ", params.row.finalAssignedDepartmentId)}
              </>
            )}

            {authority?.includes("CONCERN DEPARTMENT HOD") &&
              params.row.caseStatus == "WRITTEN_STATEMENT_APPROVED_BY_HOD" && (
                <>
                  {params.row.finalAssignedDepartmentId ==
                    user.userDao.department && (
                    <>
                      <IconButton>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {
                            const record = params.row;
                            console.log("row1111", params.row);
                            return router.push({
                              pathname:
                                "/LegalCase/transaction/newCourtCaseEntry/digitalSignature",

                              query: {
                                ...record,
                              },
                            });
                          }}
                        >
                          Digital signature
                        </Button>
                      </IconButton>
                    </>
                  )}
                </>
              )}

            {/** Written Statement button only for advocate logIn */}
            {/* {console.log("dkfdsfkjsdkf", data.caseStatus.split(" ")[0])} */}
            {((authority?.includes("WRITTEN_STATEMENT") &&
              data.caseStatus?.split(" ")[0] == "CONCRND_DPT_HOD_APPROVED") ||
              authority?.includes("ADMIN")) && (
              <IconButton>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    const record = params.row;
                    console.log("row1111", params.row);
                    return router.push({
                      pathname:
                        "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest/advocateWrittenStatement",
                      query: {
                        ...record,
                      },
                    });
                  }}
                >
                  {<FormattedLabel id="writtenStatememt" />}
                </Button>
              </IconButton>
            )}

            {/* ws for lc HOD */}

            {((authority?.includes("HOD") &&
              authority?.includes("ENTRY") &&
              data.caseStatus ==
                "WRITTEN_STATEMENT_CREATED _SENT_TO_LEGAL_HOD") ||
              (authority?.includes("ADMIN") &&
                data.caseStatus ==
                  "WRITTEN_STATEMENT_CREATED _SENT_TO_LEGAL_HOD")) && (
              <IconButton>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    const record = params.row;
                    console.log("row1111", params.row);
                    return router.push({
                      pathname:
                        "/LegalCase/transaction/newCourtCaseEntry/writtenStatementApprovedByHOD",
                      query: {
                        // ...record,
                        caseNumber: record?.caseNumber,
                        fillingDate: record?.fillingDate,
                        id: record?.id,
                        parawiseReportRemarkClerk:
                          record?.parawiseReportRemarkClerk,
                        parawiseReportRemarkClerkMr:
                          record?.parawiseReportRemarkClerkMr,
                        parawiseReportRemarkHod:
                          record?.parawiseReportRemarkHod,
                        parawiseReportRemarkHodMr:
                          record?.parawiseReportRemarkHodMr,
                        finalAssignedRemarkByLegalHod:
                          record?.finalAssignedRemarkByLegalHod,
                        finalAssignedRemarkByLegalHodMr:
                          record?.finalAssignedRemarkByLegalHodMr,
                      },
                    });
                  }}
                >
                  {/* {<FormattedLabel id="printWrittenStatement" />}
                   */}
                  Written Approval
                </Button>
              </IconButton>
            )}

            {/* Print button for Advocate */}
            {authority?.includes("WRITTEN_STATEMENT") &&
              data.caseStatus == "DIGITILY_SIGNED_BY_CONCERNED_HOD" && (
                <>
                  <IconButton>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setPrintData(params.row);
                        handlePrint();
                        setIsReady("none");
                        console.log("params.row", params.row);
                      }}
                    >
                      {<FormattedLabel id="printWrittenStatement" />}
                    </Button>
                  </IconButton>

                  {/* Mark as completed  / approveWrittenStatementByHod*/}
                  <IconButton>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        // setPrintData(params.row);
                        // handlePrint();
                        // setIsReady("none");
                        approveWrittenStatementByHod(params.row);

                        console.log("params.row", params.row);
                      }}
                    >
                      {/* {<FormattedLabel id="printWrittenStatement" />} */}
                      {/* Mark as WS Completed */}
                      <FormattedLabel id="markasWSCompleted" />
                    </Button>
                  </IconButton>
                </>
              )}

            {authority?.includes("WRITTEN_STATEMENT") &&
              data.caseStatus == "WRITTEN_STATEMENT_APPROVED_BY_HOD" && (
                <>
                  <IconButton>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setPrintData(params.row);
                        handlePrint();
                        setIsReady("none");
                        console.log("params.row", params.row);
                      }}
                    >
                      {<FormattedLabel id="printWrittenStatement" />}
                    </Button>
                  </IconButton>

                  {/* Mark as completed  /approveWrittenStatementByHod*/}
                  <IconButton>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        // setPrintData(params.row);
                        // handlePrint();
                        // setIsReady("none");
                        approveWrittenStatementByHod(params.row);

                        console.log("params.row", params.row);
                      }}
                    >
                      {/* {<FormattedLabel id="printWrittenStatement" />} */}
                      Mark as WS Completed
                    </Button>
                  </IconButton>
                </>
              )}

            {/* Document Upload  */}
            {/* {authority?.includes("WRITTEN_STATEMENT") &&
              data.caseStatus == "WRITTEN_STATEMENT_APPROVED_BY_HOD" && (
                <>
                  <IconButton>
                    <Button
                      variant="contained"
                      size="small"
                      // onClick={() => {
                      //   approveWrittenStatementByHod(params.row);

                      //   console.log("params.row", params.row);
                      // }}
                    >
                      Document Upload
                    </Button>
                  </IconButton>
                </>
              )} */}

            {/* Print Vakalatnama  */}
            {/* {authority?.includes("HOD") &&
              authority?.includes("ADD_HEARING") && */}
            {/* // ADVOCATE
              // data.caseStatus == "CASE CREATED") ||

              // authority?.includes("ADVOCATE") &&
              // data.vakalatnamaStatus == "VAKALATNAMA_SIGNED_BY_LEGAL_HOD" )&& ( */}

            {/* {authority?.includes("HOD") &&
              authority?.includes("ADD_HEARING") &&
              data.caseStatus == "CASE CREATED" &&
              data.vakalatnamaStatus == "VAKALATNAMA_SIGNED_BY_LEGAL_HOD" && (
                //  ||
                // // authority?.includes("HOD") ||
                // (authority?.includes("ENTRY") &&
                //   data.vakalatnamaStatus ==
                //     "VAKALATNAMA_SIGNED_BY_LEGAL_HOD")
                <IconButton>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      const record = params.row;
                      console.log("row1111", params.row);
                      return router.push({
                        pathname:
                          "/LegalCase/transaction/newCourtCaseEntry/printVakalatnama",

                        query: {
                          // pageMode: "Final",

                          id: record?.id,
                          // getById:record.row.id
                        },
                      });
                    }}
                  >
                    Print Vakalatnama
                  </Button>
                </IconButton>
              )} */}

            {/* Print vakalatnama  */}
            {
              // authority?.includes("HOD") &&
              // authority?.includes("ADD_HEARING") &&
              // data.caseStatus == "CASE CREATED" &&
              data.vakalatnamaStatus == "VAKALATNAMA_SIGNED_BY_LEGAL_HOD" && (
                <IconButton>
                  <Button
                    sx={{
                      // backgroundColor: "#78A7F9",
                      border: "1px solid blue",
                      height: "4vh",
                    }}
                    variant="contained"
                    size="small"
                    onClick={() => {
                      const record = params.row;
                      console.log("row1111", params.row);
                      return router.push({
                        pathname:
                          "/LegalCase/transaction/newCourtCaseEntry/printVakalatnama",

                        query: {
                          // pageMode: "Final",

                          id: record?.id,
                          // getById:record.row.id
                        },
                      });
                    }}
                  >
                    {/* Print Vakalatnama */}
                    <FormattedLabel id="printvakalatnama" />
                  </Button>
                </IconButton>
              )
            }
          </Box>
        );
      },
    },
  ].filter((obj) => {
    if (router?.query?.caseStatusFromDashboard) {
      return obj?.field !== "actions";
    } else {
      return obj;
    }
  });

  // -------------------- useEffect ---------

  useEffect(() => {
    console.log("dataSource=>", dataSource);
  }, [dataSource]);

  useEffect(() => {
    console.log("authority123", authority);
  }, [authority]);

  useEffect(() => {
    getAllCaseEntry();
  }, [courtNames, advocateNames, userNames, authority]);

  useEffect(() => {
    getCourtName();
    getAdvocateName();
    getCaseTypes();
    getCaseSubType();
    getYears();
    getCaseNumberAll();
    getDepartmentName();
    getUserList(currentUserId);
  }, []);

  // View
  return (
    <>
      {/* BreadcrumbComponent */}
      <Box
        sx={{
          marginLeft: "1vw",
        }}
      >
        <div>
          <BreadcrumbComponent />
        </div>
      </Box>
      {/* <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={load}
        onClick={handleLoad}
      >
        Loading....
        <CircularProgress color="inherit" />
      </Backdrop> */}
      {loadderState ? (
        <Loader />
      ) : (
        <Paper
          component={Box}
          elevation={5}
          sx={{
            marginLeft: "10px",
            marginRight: "10px",
            marginTop: "10px",
            marginBottom: "60px",
            padding: "10vh",
          }}
        >
          <Grid
            container
            style={{
              backgroundColor: "#556CD6",
              height: "8vh",
              fontSize: 19,
              marginRight: "75px",
              borderRadius: 100,
            }}
          >
            <IconButton
              style={{
                marginBottom: "1vh",
                marginLeft: "0%",
                color: "white",
              }}
            >
              <ArrowBackIcon
                onClick={() => {
                  router?.query?.caseStatusFromDashboard
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
                {router?.query?.caseStatusFromDashboard ? (
                  <FormattedLabel id="caseDetailsBtn" />
                ) : (
                  <FormattedLabel id="caseEntry" />
                )}
              </h2>
            </Grid>
          </Grid>
          {/* new Header */}
          {/* <Grid
      container
      style={{
        background: "#556CD6",
        // "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
      }}
    >
      <IconButton>
        <ArrowBackIcon
          onClick={() => {
            router?.query?.caseStatusFromDashboard
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
            // background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          {router?.query?.caseStatusFromDashboard ? (
            <FormattedLabel id="caseDetailsBtn" />
          ) : (
            <FormattedLabel id="caseEntry" />
          )}
        </h2>
      </Grid>
    </Grid> */}
          <Paper style={{ display: isReady }}>
            <PRINTWRITTENSTATEMENT ref={componentRef} data={printData} />
          </Paper>

          {/* old Header */}
          {/* <div
      style={{
        backgroundColor: "#0084ff",
        color: "white",
        fontSize: 19,
        marginBottom: 40,
        padding: 8,
        paddingLeft: 30,
        borderRadius: 100,
      }}
    >
      <strong style={{ display: "flex", justifyContent: "center" }}>
        <FormattedLabel id='caseEntry' />
      </strong>
    </div> */}

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "right",
                marginTop: "10px",
                marginBottom: "20px",
              }}
            >
              {/* {authority == "CLERK" ? (
          <>
          </>
        ) : (
          <Button
            variant="contained"
            onClick={() => {
              localStorage.removeItem("NewCourtCaseEntryAttachmentList");
              localStorage.setItem("pageMode", "Add");
              localStorage.setItem("buttonInputStateNew", true);
              router.push({
                pathname: "/LegalCase/transaction/newCourtCaseEntry/view",
              });
            }}
          >
            <FormattedLabel id="add" />
          </Button>
        )} */}
              {router?.query?.caseStatusFromDashboard ? (
                <></>
              ) : (
                <>
                  {authority?.includes("CLERK") &&
                    authority?.includes("ENTRY") && (
                      <Button
                        sx={{
                          width: "7vw",
                        }}
                        variant="contained"
                        onClick={() => {
                          localStorage.removeItem(
                            "NewCourtCaseEntryAttachmentList"
                          );
                          localStorage.setItem("pageMode", "Add");
                          localStorage.setItem("buttonInputStateNew", true);
                          router.push({
                            pathname:
                              "/LegalCase/transaction/newCourtCaseEntry/view",
                          });
                        }}
                      >
                        <FormattedLabel id="add" />
                      </Button>
                    )}
                </>
              )}
            </div>

            <Modal
              open={isOpen}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={styleForModal}>
                <>
                  <div
                    style={{
                      // backgroundColor: "#0084ff",
                      backgroundColor: "#556CD6",

                      color: "white",
                      fontSize: 19,
                      marginTop: 30,
                      marginBottom: 50,

                      // padding: 8,
                      height: "8vh",

                      paddingLeft: 30,
                      // marginLeft: "50px",
                      // marginRight: "75px",
                      borderRadius: 100,
                      width: "100%",
                    }}
                  >
                    {/* <strong style={{ display: "flex", justifyContent: "center" }}> */}
                    {/* All Parawise Requests */}
                    {/* </strong> */}

                    {/* New Header */}
                    <h2
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                      }}
                    >
                      {/* All Parawise Requests */}
                      <FormattedLabel id="allParawiseRequests" />
                    </h2>
                  </div>
                  <DataGrid
                    sx={{
                      overflowY: "scroll",

                      "& .MuiDataGrid-virtualScrollerContent": {},
                      "& .MuiDataGrid-columnHeadersInner": {
                        backgroundColor: "#556CD6",
                        color: "white",
                        wordWrap: "break-word",
                      },

                      "& .MuiDataGrid-cell:hover": {
                        color: "primary.main",
                        wordWrap: "break-word",
                      },
                    }}
                    // density="compact"
                    getRowId={(row) => row.srNo}
                    autoHeight
                    scrollbarSize={17}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    // pagination
                    // paginationMode="server"
                    // hideFooter={true}
                    rows={allParaReqData?.map((data, i) => {
                      return {
                        ...data,
                        srNo: i + 1,
                      };
                    })}
                    columns={_col}
                    // onPageChange={(_data) => {}}
                    // onPageSizeChange={(_data) => {}}
                  />
                  <Grid
                    container
                    paddingTop={2}
                    justifyContent="center"
                    alignItems="center"
                    display="flex"
                  >
                    {((authority?.includes("ENTRY") &&
                      authority?.includes("ADD_HEARING")) ||
                      authority?.includes("ADMIN")) && (
                      // paramsData?.isVakalatnamaApproved === "Y" &&
                      <Button
                        style={{
                          justifyContent: "center",
                          marginRight: "10px",
                        }}
                        variant="contained"
                        // color="warning"
                        size="small"
                        // startIcon={<ClearOutlined />}
                        onClick={() => {
                          localStorage.setItem(
                            "trnDptLocationDao",
                            paramsData?.trnDptLocationDao ?? []
                          );
                          return router.push({
                            pathname:
                              "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest/parawiseReportLcClerk",
                            query: {
                              ...paramsData,
                            },
                          });
                        }}
                      >
                        {/* Add New Parawise Request */}
                        <FormattedLabel id="addNewParawiseRequest" />
                      </Button>
                    )}
                    <Button
                      style={{ justifyContent: "center", marginLeft: "10px" }}
                      variant="contained"
                      // color="warning"
                      size="small"
                      startIcon={<ClearOutlined />}
                      onClick={() => handleClose()}
                    >
                      {/* Close */}
                      <FormattedLabel id="close" />
                    </Button>
                  </Grid>
                </>
              </Box>
            </Modal>

            {/* New Table */}
            <DataGrid
              // disableColumnFilter
              // disableColumnSelector
              // disableToolbarButton
              // disableDensitySelector
              components={{ Toolbar: GridToolbar }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                  printOptions: { disableToolbarButton: true },
                  // disableExport: true,
                  // disableToolbarButton: true,
                  // csvOptions: { disableToolbarButton: true },
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
              }}
              // density="compact"
              getEstimatedRowHeight={() => 50}
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
                getAllCaseEntry(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                // updateData("page", 1);
                getAllCaseEntry(_data, data.page);
              }}
            />
          </div>
        </Paper>
      )}
    </>
  );
};

export default Index;
