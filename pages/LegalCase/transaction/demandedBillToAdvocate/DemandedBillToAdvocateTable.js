import { Box, Button, IconButton, Paper } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";
import BreadcrumbComponent from "../../../../pages/LegalCase/FileUpload/BreadcrumbComponent";

import { catchExceptionHandlingMethod } from "../../../../util/util";

// DemandedBillToAdvocateTable
const DemandedBillToAdvocateTable = () => {
  const router = useRouter();
  const [authority, setAuthority] = useState();
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
  const user1 = useSelector((state) => state?.user?.user);
  const user = useSelector((state) => state?.user?.user?.userDao);
  // const 'user' = useSelector((state) => state.user.user.userDao);
  const token = useSelector((state) => state?.user?.user?.token);
  const [dataSource, setDataSource] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [pageMode, setPageMode] = useState("Add");
  const language = useSelector((state) => state.labels.language);
  const [caseMainTypes, setCaseMainTypes] = useState([]);
  const [caseSubTypes, setcaseSubTypes] = useState([]);
  const [caseNumbers, setCaseNumbers] = useState([]);
  const [caseNumbers1, setCaseNumbers1] = useState([]);
  const [temp, setTemp] = useState();
  const [statuses, setStatuses] = useState();
  const [bankNames, setBankNames] = useState([]);

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

  // getBank Names
  const getBankName = () => {
    axios
      .get(`${urls.CFCURL}/master/bank/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("22", res);
        setBankNames(
          res.data.bank.map((r, i) => ({
            id: r.id,
            bankName: r.bankName,
            bankNameMr: r.bankNameMr,
            branchName: r.branchName,
            branchNameMr: r.branchNameMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  /* Case Number  - Court Case Number*/
  const getcaseNumber = () => {
    // alert("demandedBilltoAdv");
    axios
      .get(
        `${urls.LCMSURL}/transaction/newCourtCaseEntry/getCourtCaseEntryByAdvocateId?advocateId=${user?.userDao?.advocateId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setTemp(res.data.newCourtCaseEntry);
        setCaseNumbers(
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

  /* Case Type  - Case Main Type*/
  const getCaseMainTypes = () => {
    axios
      .get(`${urls.LCMSURL}/master/caseMainType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCaseMainTypes(
          res.data.caseMainType.map((r, i) => ({
            id: r.id,
            caseMainType: r.caseMainType,
            caseMainTypeMr: r.caseMainTypeMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
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

  /* Case Sub Type */
  const getCaseSubTypes = () => {
    axios
      .get(`${urls.LCMSURL}/master/caseSubType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setcaseSubTypes(
          res.data.caseSubType.map((r, i) => ({
            id: r.id,
            // caseMainType: r.caseMainType,
            subType: r.subType,
            caseSubTypeMr: r.caseSubTypeMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  useEffect(() => {
    console.log("authority", authority);
  }, [authority]);

  useEffect(() => {
    console.log("query", router?.query);
    // setStatuses(router?.query?.name);
  }, [router?.query]);

  // get Table Data
  const getDemandedBill = (_pageSize = 10, _pageNo = 0) => {
    if (router?.query?.billStatus) {
      setStatuses(router?.query?.billStatus);
    } else if (authority == "BILL_SUBMISSION") {
      // Dept Clerk
      setStatuses("BILL_RAISED");
    } else if (authority == "BILL_APPROVAL") {
      // HOD
      setStatuses("BILL_SUBMITTED");
    } else if (authority == "ACCOUNTANT") {
      // Accountant
      setStatuses("BILL_APPROVED");
    }

    const body = {
      status: statuses,
      // statuses: [statuses],
    };
    if (statuses != null || statuses) {
      axios
        .get(
          // .post(
          `${urls.LCMSURL}/transaction/demandedBillAndPaymentToAdvocate/getBillDetailsByStatus?status=${statuses}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
          // body,
          // {
          //   headers: {
          //     Authorization: `Bearer ${token}`,
          //   },
          // }
        )
        .then((r) => {
          let result = r?.data?.demandedBillAndPaymentToAdvocate;

          let _res = result?.map((data, index) => {
            return {
              ...data,
              advocate: {
                ...data?.advocate,
                bankName: bankNames?.find(
                  (obj) => obj.id == data?.advocate?.bankName
                )?.bankName,
              },
              srNo: index + 1,
              advocateName:
                data?.advocate?.firstName +
                "  " +
                data?.advocate?.middleName +
                "  " +
                data?.advocate?.lastName,
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
    }
  };

  const _getBillDetail = (advId, url) => {
    // alert(advId);
    if (advId) {
      axios
        .get(
          `${urls.LCMSURL}/transaction/demandedBillAndPaymentToAdvocate/${url}?advId=${advId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          let response = res.data?.demandedBillAndPaymentToAdvocate;
          console.log("_billData", response);
          if (response !== null || response !== undefined) {
            // alert("aaya");
            // localStorage.setItem("billDetailComponent", false);
            localStorage.setItem("billDetail", JSON.stringify(response));
          } else {
            // alert("nhi hai");
            localStorage.setItem("billDetail", JSON.stringify([]));
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    }
  };

  // columns
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
      // width: 120,
    },
    {
      field: "status",
      // headerName: "Application Status",
      // applicationStatus
      headerName: <FormattedLabel id="applicationStatus" />,

      align: "center",
      headerAlign: "center",
      // width: 150,
      flex: 1,
    },
    {
      // headerName: "Advocate Name",
      headerName: <FormattedLabel id="advocateName" />,

      // advocateName
      // width: 250,
      flex: 1,
      field: "advocateName",
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      // width: 500,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <Box>
              {/** Depet cleark */}
              {params?.row?.status === "BILL_RAISED" &&
                authority?.find(
                  (r) => r === "BILL_SUBMISSION" || r === "ADMIN"
                ) && (
                  <>
                    <IconButton>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                          console.log("params?.row11212", params?.row);

                          // const attachments = params?.row?.attachments;
                          // console.log(
                          //   "const attachments = params?.row?.attachments",
                          //   attachments.map((data, index) => {
                          //     return { ...data, srNo: index + 1 };
                          //   })
                          // );
                          // localStorage.setItem(
                          //   "attachments",
                          //   JSON.stringify(
                          //     attachments.map((data, index) => {
                          //       return { ...data, srNo: index + 1 };
                          //     })
                          //   )
                          // );

                          const advocateId = params?.row?.advocateId;
                          const tempBillDetail = params?.row?.billDetail;
                          console.log("tempBillDetail", params?.row);

                          const billDetail = tempBillDetail?.map(
                            (data, index) => {
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
                              };
                            }
                          );
                          const tableRowData = {
                            ...params?.row,
                            pageMode: "View",
                            advocateId: advocateId,
                            role: "BILL_SUBMISSION",
                            designation: "dept_Clerk",
                          };
                          localStorage.setItem("role", "BILL_SUBMISSION");
                          localStorage.setItem("deleteButtonInputState", false);
                          localStorage.setItem("billDetailComponent", false);

                          localStorage.setItem("paidAmountTableState", true);
                          localStorage.setItem(
                            "approvalAmountDisabledState",
                            "false"
                          );
                          localStorage.setItem(
                            "btnInputStateDemandBill",
                            "false"
                          );
                          localStorage.setItem(
                            "tableRowData",
                            JSON.stringify(tableRowData)
                          );

                          _getBillDetail(
                            params.row?.advocateId,
                            "getBillDetailsByAdvocateIdForClerk"
                          );

                          // localStorage.setItem(
                          //   "billDetail",
                          //   JSON.stringify(billDetail)
                          // );
                          localStorage.setItem(
                            "approvalAmountTableState",
                            false
                          );
                          localStorage.setItem("paidAmountInputState", false);
                          localStorage.setItem(
                            "demandedBillTableActionButtonInputState",
                            false
                          );
                          router.push({
                            pathname:
                              "/LegalCase/transaction/demandedBillToAdvocate/Scrutiny",
                            query: params.row,
                          });
                          console.log("HHHH", params.row?.advocateId);
                        }}
                      >
                        {/* Action */}
                        <FormattedLabel id="billDetails" />
                      </Button>
                    </IconButton>
                  </>
                )}
              {/** HOD */}
              {params?.row?.status === "BILL_SUBMITTED" &&
                authority?.find(
                  (r) => r === "BILL_APPROVAL" || r === "ADMIN"
                ) && (
                  <IconButton>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        const advocateId = params?.row?.advocateId;
                        const tempBillDetail = params?.row?.billDetail;
                        const attachments = params?.row?.attachments;
                        localStorage.setItem(
                          "attachments",
                          JSON.stringify(
                            attachments.map((data, index) => {
                              return { ...data, srNo: index + 1 };
                            })
                          )
                        );
                        const billDetail = tempBillDetail?.map(
                          (data, index) => {
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
                            };
                          }
                        );
                        const tableRowData = {
                          ...params?.row,
                          pageMode: "View",
                          advocateId: advocateId,
                          designation: "dept_Clerk",
                          role: "BILL_APPROVAL",
                        };
                        localStorage.setItem("role", "BILL_APPROVAL");
                        localStorage.setItem("deleteButtonInputState", false);
                        localStorage.setItem("paidAmountInputState", false);
                        localStorage.setItem("paidAmountTableState", true);
                        localStorage.setItem("billDetailComponent", false);
                        localStorage.setItem(
                          "approvalAmountDisabledState",
                          "false"
                        );
                        localStorage.setItem(
                          "btnInputStateDemandBill",
                          "false"
                        );
                        localStorage.setItem(
                          "tableRowData",
                          JSON.stringify(tableRowData)
                        );

                        _getBillDetail(
                          params.row?.advocateId,
                          "getBillDetailsByAdvocateIdForHod"
                        );

                        // localStorage.setItem(
                        //   "billDetail",
                        //   JSON.stringify(billDetail)
                        // );
                        router.push({
                          pathname:
                            "/LegalCase/transaction/demandedBillToAdvocate/Scrutiny",
                        });
                      }}
                    >
                      Action
                    </Button>
                  </IconButton>
                )}
              {/** Accountant */}
              {params?.row?.status === "BILL_APPROVED" &&
                authority?.find((r) => r === "ACCOUNTANT" || r === "ADMIN") && (
                  <IconButton>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        const tempBillDetail = params?.row?.billDetail;
                        const attachments = params?.row?.attachments;
                        const advocateId = params?.row?.advocateId;
                        localStorage.setItem(
                          "attachments",
                          JSON.stringify(
                            attachments.map((data, index) => {
                              return { ...data, srNo: index + 1 };
                            })
                          )
                        );
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
                          };
                        });
                        const tableRowData = {
                          ...params?.row,
                          pageMode: "View",
                          advocateId: advocateId,
                          designation: "dept_Clerk",
                          role: "BILL_PAID",
                        };
                        localStorage.setItem("role", "BILL_PAID");
                        localStorage.setItem("paidAmountTableState", false);
                        localStorage.setItem("billDetailComponent", false);
                        localStorage.setItem("deleteButtonInputState", false);
                        localStorage.setItem(
                          "approvalAmountDisabledState",
                          "true"
                        );
                        localStorage.setItem(
                          "btnInputStateDemandBill",
                          "false"
                        );
                        localStorage.setItem(
                          "tableRowData",
                          JSON.stringify(tableRowData)
                        );

                        _getBillDetail(
                          params.row?.advocateId,
                          "getBillDetailsByAdvocateIdForAccountant"
                        );

                        // localStorage.setItem(
                        //   "billDetail",
                        //   JSON.stringify(billDetail)
                        // );
                        router.push({
                          pathname:
                            "/LegalCase/transaction/demandedBillToAdvocate/Scrutiny",
                        });
                      }}
                    >
                      Action
                    </Button>
                  </IconButton>
                )}
            </Box>
          </>
        );
      },
    },
  ];

  // -------------------- useEffect -------------

  // useEffect
  useEffect(() => {
    let auth = user1?.menus?.find((r) => {
      if (r.id == selectedMenuFromDrawer) {
        return r;
      }
    })?.roles;
    setAuthority(auth);
    getcaseNumber();
    getBankName();
    getCaseMainTypes();
    getCaseSubTypes();
    getCaseNumberAll();
  }, []);

  useEffect(() => {
    getDemandedBill();
  }, [caseMainTypes, caseSubTypes, caseNumbers, authority, caseNumbers1]);

  // View
  return (
    <>
      <Box>
        <div>
          <BreadcrumbComponent />
        </div>
      </Box>
      <Paper elevation={5} style={{ height: "900px" }}>
        <br />
        <div
          style={{
            // backgroundColor: "#0084ff",
            backgroundColor: "#556CD6",
            // backgroundColor: "#1C39BB",

            // #00308F
            color: "white",
            fontSize: 19,
            marginTop: 30,
            marginBottom: "50px",
            // marginTop: ,
            padding: 8,
            paddingLeft: 30,
            marginLeft: "50px",
            marginRight: "75px",
            borderRadius: 100,
          }}
        >
          <strong style={{ display: "flex", justifyContent: "center" }}>
            {/* Demand Bill Payment To Advocate Table */}
            <FormattedLabel id="advocateBills" />
          </strong>
        </div>
        <div
          style={{
            margin: "50px",
            marginBottom: "50px",
            // border: "2px solid red",
          }}
        >
          {/** Table **/}
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
            getRowId={(row) => row.srNo}
            sx={{
              margin: "20px",
              marginRight: "20px",
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
              getDemandedBill(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              // updateData("page", 1);
              getDemandedBill(_data, data.page);
            }}
          />
        </div>
      </Paper>
    </>
  );
};

export default DemandedBillToAdvocateTable;
