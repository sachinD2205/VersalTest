import { EyeFilled } from "@ant-design/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import EditIcon from "@mui/icons-material/Edit";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { Button, IconButton, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/LegalCaseSchema/newCourtCaseSchema";
import urls from "../../../../URLS/urls";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const PaymentDetails = () => {
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
  const [tableData, setTableData] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [courtNames, setCourtNames] = useState([]);
  const [advocateNames, setAdvocateNames] = useState([]);
  const [id, setID] = useState();
  const [departmentNames, setDepartmentNames] = useState([]);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [years, setYears] = useState([]);
  const [caseTypes, setCaseTypes] = useState([]);
  const [caseSubTypes, setCaseSubTypes] = useState([]);

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

  // For Paginantion
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // courtNames
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
            courtName: r.courtName,
            courtMr: r.courtMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // advocateNames
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

  // departmentNames
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

  // deleteById
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

  // caseTypes
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

  // caseSubTypes
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

  // years
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

  // add Hearing
  const addHearing = (record) => {
    console.log("All Records", record);
    router.push({
      pathname: "/LegalCase/transaction/addHearing/view",
      query: {
        pageMode: "addHearing",
        ...record,
        caseEntry: record.id,
      },
    });
  };

  // caseEntry
  const getAllCaseEntry = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.LCMSURL}/transaction/newCourtCaseEntry/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("r", r);
        let result = r.data.newCourtCaseEntry;
        console.log("result", result);
        let _res = result.map((r, i) => {
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1,
            courtCaseNumber: r.courtCaseNumber,
            caseMainType: r.caseMainType,
            courtName: r.courtName,
            court: r.court,
            courtNameEn: courtNames?.find((obj) => obj.id === r.court)
              ?.courtName,
            courtNameMr: courtNames?.find((obj) => obj.id === r.court)?.courtMr,
            stampNo: r.stampNo,
            fillingDate: moment(r.fillingDate).format("YYYY-MM-DD"),
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
            appearanceDate: moment(r.appearanceDate).format("YYYY-MM-DD"),
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
            caseRefnceNo: r.caseRefnceNo,
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
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
    {
      // field: language === "en" ? "courtNameEn" : "courtNameMr",
      field: "billNo",
      headerName: "Bill No",

      // headerName: <FormattedLabel id="courtName" />,
      width: 250,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      // field: "fillingDate",
      field: "caseFees",
      headerName: <FormattedLabel id="caseFees" />,
      // flex: 1,
      width: 190,
      headerAlign: "center",
      align: "center",
    },
    {
      // field: "stampNo",
      field: "PaidFees",
      headerName: <FormattedLabel id="paidFees" />,
      width: 170,
      // flex: 1,
      headerAlign: "center",
      align: "center",
    },
    ,
    {
      field: "advocateName",
      headerName: <FormattedLabel id="advocateName" />,
      width: 240,
      // flex: 1,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 500,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            {console.log(
              "22",
              language === "en" ? "caseMainType" : "caseMainTypeMr"
            )}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                const record = params.row;

                router.push({
                  pathname: "/LegalCase/transaction/newCourtCaseEntry/view",
                  query: {
                    pageMode: "Edit",
                    ...record,
                  },
                });
                console.log("row", params.row);
                ("");
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            {/* <IconButton onClick={() => deleteById(params.id)}>
              <DeleteIcon />
            </IconButton> */}
            <IconButton
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
            </IconButton>

            {/* for View Icon */}

            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                const record = params.row;

                router.push({
                  pathname: "/LegalCase/transaction/newCourtCaseEntry/view",
                  query: {
                    pageMode: "View",
                    ...record,
                  },
                });
                console.log("row", params.row);
                ("");
              }}
            >
              <EyeFilled style={{ color: "#556CD6" }} />
            </IconButton>

            {/* button for Add Hearing */}

            <IconButton>
              <Button
                variant="outlined"
                onClick={() => addHearing(params.row)}
                // onClick={() =>
                //   router.push(`/LegalCase/transaction/addHearing/view`)
                // }
                //  endIcon={<DeleteIcon />}
                //  disabled={deleteButtonInputState}
                //  onClick={() => deleteById(record.id)}
              >
                {/* Add Hearing */}

                {<FormattedLabel id="addHearing" />}
              </Button>
            </IconButton>

            {/* Button for Case Details */}

            <IconButton>
              <Button
                variant="outlined"
                onClick={() => {
                  const record = params.row;

                  router.push({
                    pathname: "/LegalCase/transaction/newCourtCaseEntry/view",
                    query: {
                      pageMode: "View",
                      ...record,
                    },
                  });
                  console.log("row", params.row);
                  ("");
                }}
              >
                {<FormattedLabel id="caseDetails" />}
              </Button>
            </IconButton>
            <Tooltip title="Opinion against case">
              <IconButton
                disabled={editButtonInputState}
                onClick={() => {
                  const record = params.row;

                  router.push({
                    pathname: "/LegalCase/transaction/opinion/createOpinion",
                    query: {
                      pageMode: "Opinion",
                      ...record,
                    },
                  });
                  console.log("row", params.row);
                  ("");
                }}
              >
                <NewspaperIcon style={{ color: "#556CD6" }} />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  // ------------------ UseEffects

  useEffect(() => {
    getCourtName();
    getAdvocateName();
    getCaseTypes();
    getCaseSubType();
    getYears();
    getDepartmentName();
  }, []);

  useEffect(() => {
    console.log("dataSource=>", dataSource);
  }, [dataSource]);

  useEffect(() => {
    getAllCaseEntry();
  }, [courtNames, advocateNames]);

  // view
  return (
    <>
      <div>
        {/* For Form Name */}
        <div
          style={{
            backgroundColor: "#0084ff",
            color: "white",
            fontSize: 19,
            marginTop: 30,
            marginBottom: 20,
            padding: 8,
            paddingLeft: 30,
            marginLeft: "50px",
            marginRight: "75px",
            borderRadius: 100,
          }}
        >
          <strong style={{ display: "flex", justifyContent: "center" }}>
            <FormattedLabel id="paymentDetails" />
          </strong>
        </div>
        {/* Table */}
        <div
          style={{
            padding: "40px",
          }}
        >
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
                // printOptions: { disableToolbarButton: true },
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
              getAllCaseEntry(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getAllCaseEntry(_data, data.page);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default PaymentDetails;
