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
// import PRINTWRITTENSTATEMENT from "./parawiseRequest/printWrittenStatement";
import urls from "../../../../URLS/urls";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
  const router = useRouter();
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

  const [authority, setAuthority] = useState([]);
  let user = useSelector((state) => state.user.user);
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
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
  const token = useSelector((state) => state.user.user.token);

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

  // For Paginantion
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 20,
    page: 1,
  });

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

  // Case entry
  const getAllByCourtId = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    //user
    console.log("user", user);
    console.log("aala nai");
    axios
      .get(
        `${urls.LCMSURL}/transaction/newCourtCaseEntry/getCaseEntryByCourtId?courtId=${router?.query?.courtId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            pageSize: _pageSize,
            pageNo: _pageNo,
          },
        }
      )
      .then((r) => {
        console.log("r", r);
        let neww = [];
        let result = r.data;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log("44");
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,
            id: r.id,

            // Generate Sr No based on the page size and page no
            srNo: _pageSize * _pageNo + i + 1,

            caseNumber: r.caseNumber,
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
              (obj) => obj.id === r.advocateName
            )?.advocateName,
            advocateNameMr: advocateNames?.find(
              (obj) => obj.id === r.advocateName
            )?.advocateNameMr,
            filedBy: r.filedBy,
            filedByMr: r.filedByMr,
            filedAgainst: r.filedAgainst,
            caseDetails: r.caseDetails,
            caseMainType: r.caseMainType,
            caseMainTypeName: caseTypes?.find(
              (obj) => obj.id === r.caseMainType
            )?.caseMainType,
            subType: r.subType,
            year: r.year,
            opponentAdvocate: r.opponentAdvocate,
            concernPerson: r.concernPerson,
            appearanceDate: moment(r.appearanceDate).format("DD-MM-YYYY"),
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
            parawiseDepartmentAssignedCount: r.parawiseDepartmentAssignedCount,
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

            // NewCourtCaseEntryAttachmentList: JSON.stringify(
            //   r.NewCourtCaseEntryAttachmentList.map((r, i) => {
            //     return { ...r, srNo: i + 1 };
            //   })
            // ),

            billDetails: r?.billDtls,

            // billDetails: JSON.stringify(
            //   r?.billDtls?.map((r, i) => {
            //     return { ...r, srNO: i + 1 };
            //   }),
            // ),
            courtNameMr: courtNames?.find((obj) => obj.id === r.court)
              ?.courtNameMr,
            courtNameEn: courtNames?.find((obj) => obj.id === r.court)
              ?.courtNameEn,
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });

        console.log("res1212", _res);
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

  useEffect(() => {
    getAllByCourtId();
  }, [router?.query?.courtId]);

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
                // getAllCaseEntry();
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
        caseNumber: record.id,
        caseEntry: record.id,
      },
    });
  };

  const componentRef = useRef(null);

  console.log("componentRef", componentRef);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });

  // columns
  const columns = [
    // old
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
      // width: 120,
      flex: 1,
    },
    //courtCaseNumber
    {
      field: "caseNumber",
      headerName: <FormattedLabel id="courtCaseNumber" />,
      align: "center",
      headerAlign: "center",
      // width: 200,
      flex: 1,

      renderCell: (params) => (
        <Typography
          // onClick={() =>
          //   router.push(
          //     `/LegalCase/transaction/newCourtCaseEntry/view1?caseId=${params?.row?.id}`
          //   )
          // }

          // New Exp
          onClick={() => {
            router.push({
              pathname: "/LegalCase/transaction/newCourtCaseEntry/view1",
              query: {
                caseId: params?.row?.id,
                // status: params?.row?.caseStatus,

                pageMode: "CaseDetails",
              },
            });
          }}
          style={{ cursor: "pointer" }}
        >
          {params.value}
        </Typography>
      ),
    },

    {
      field: language === "en" ? "courtNameEn" : "courtNameMr",
      headerName: <FormattedLabel id="courtName" />,
      // width: 300,
      flex: 2,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "fillingDateT",
      headerName: <FormattedLabel id="fillingDate" />,
      flex: 2,
      // width: 200,
      headerAlign: "center",
      align: "center",
    },
    // {
    //   field: "stampNo",
    //   headerName: <FormattedLabel id="stampNo" />,
    //   width: 170,
    //   // flex: 1,
    //   headerAlign: "center",
    //   align: "center",
    // },
    // {
    //   field: language === "en" ? "advocateName1" : "advocateNameMr",
    //   headerName: <FormattedLabel id="advocateName" />,
    //   // width: 300,
    //   flex: 2,
    //   headerAlign: "center",
    //   align: "center",
    // },
    // {
    //   //
    //   field: language === "en" ? "caseStatus" : "caseStatus",
    //   headerName: <FormattedLabel id="caseStatus" />,
    //   width: 460,
    //   // flex: 1,
    //   headerAlign: "center",
    //   align: "center",

    //   // add colours depending on the status of the case and default colour as black
    //   renderCell: (params) => {
    //     let data = params.row;
    //     console.log("data", data);
    //     return (
    //       <Box>
    //         {data.caseStatus === "CASE CREATED" ? (
    //           <Typography style={{ color: "blue" }}>{data.caseStatus}</Typography>
    //         ) : data.caseStatus === "WRITTEN_STATEMENT_APPROVED_BY_HOD" ? (
    //           <Typography style={{ color: "green" }}>{data.caseStatus}</Typography>
    //         ) : data.caseStatus === "DIGITILY_SIGNED_BY_CONCERNED_HOD" ? (
    //           <Typography style={{ color: "purple" }}>{data.caseStatus}</Typography>
    //         ) : data.caseStatus === "WS_PROCESS_COMPLETED" ? (
    //           <Typography style={{ color: "darkgreen" }}>{data.caseStatus}</Typography>
    //         ) : data.caseStatus === "PARAWISE_RPT_SENT_TO_DEPARTMENT_CLERKS" ? (
    //           <Typography style={{ color: "orange" }}>{data.caseStatus}</Typography>
    //         ) : data.caseStatus === "PARAWISE_REPORT_DEPARTMENT_ASSIGNED_AND_SENT_TO_HOD" ? (
    //           <Typography style={{ color: "brown" }}>{data.caseStatus}</Typography>
    //         ) : (
    //           <Typography style={{ color: "black" }}>{data.caseStatus}</Typography>
    //         )}
    //       </Box>
    //     );
    //   },

    // renderCell: (params) => (
    //   <Tooltip title={params.row.caseStatus} placement="top">
    //     <span>{params.row.caseStatus}</span>
    //   </Tooltip>
    // ),
    // },
  ];

  // -------------------- useEffect ---------

  useEffect(() => {
    getCourtName();
    getAdvocateName();
    getCaseTypes();
    getCaseSubType();
    getYears();
    getCaseNumberAll();
    getDepartmentName();
  }, []);

  useEffect(() => {
    console.log("dataSource=>", dataSource);
  }, [dataSource]);

  // useEffect(() => {
  //   getAllByCourtId();
  // }, [courtNames, advocateNames]);

  useEffect(() => {
    setValue("", router.query.passCourtNames);
  }, []);

  useEffect(() => {
    console.log("authority123");
  }, [authority]);

  // View
  return (
    <>
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
        {/* new Header */}
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
                // color:"white"
                // background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
              }}
            >
              {" "}
              <FormattedLabel id="caseEntryReport" />
              {/* Case Entry Report */}
            </h2>
          </Grid>
        </Grid>

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

            {authority?.includes("CLERK") && authority?.includes("ENTRY") && (
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
            )}
          </div>

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
            density="compact"
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
              // getAllCaseEntry(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              // getAllCaseEntry(_data, data.page);
            }}
          />
        </div>
      </Paper>
    </>
  );
};

export default Index;
