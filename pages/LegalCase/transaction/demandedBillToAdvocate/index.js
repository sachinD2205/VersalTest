import { Button, Grid, IconButton, Paper } from "@mui/material";
import { Box } from "@mui/system";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BreadcrumbComponent from "../../../../pages/LegalCase/FileUpload/BreadcrumbComponent";
import { Visibility } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  const router = useRouter();
  const [dataSource, setDataSource] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [pageMode, setPageMode] = useState("Add");
  const language = useSelector((state) => state.labels.language);
  const user = useSelector((state) => state?.user?.user);
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

  // For Paginantion
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // console.log("uuuuuuuuuu", user?.userDao?.advocateId);
  useEffect(() => {
    console.log("query", router?.query);
    // Array.isArray(router?.query?.serviceId) ? alert("Yes") : alert("No");
  }, [router?.query]);

  // demandedBillandPaymentToAdvocate
  const getDemandedBill = (_pageSize = 10, _pageNo = 0) => {
    if (user?.userDao?.advocateId || router?.query?.billStatus) {
      // alert("router?.query?.billStatus");
      let axiosUrl = `transaction/demandedBillAndPaymentToAdvocate/getBillDetailsByAdvocateId?advId=${user?.userDao?.advocateId}`;
      router?.query?.billStatus
        ? (axiosUrl = `transaction/demandedBillAndPaymentToAdvocate/getAllByStatus?status=${router?.query?.billStatus}`)
        : axiosUrl;
      axios
        .get(
          // `${urls.LCMSURL}/transaction/demandedBillAndPaymentToAdvocate/getAll`,
          `${urls.LCMSURL}/${axiosUrl}`,
          {
            params: {
              pageSize: _pageSize,
              pageNo: _pageNo,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((r) => {
          let result = r?.data?.demandedBillAndPaymentToAdvocate;

          let _res = result
            // ?.sort((a, b) => b?.id - a?.id)
            ?.map((r, i) => {
              return {
                // r.data.map((r, i) => ({
                activeFlag: r.activeFlag,
                id: r.id,
                // createDtTm: r.createDtTm,
                createDtTm: moment(r.createDtTm).format("DD-MM-YYYY"),
                srNo: i + 1,
                advocateName: r.advocateName,
                status: r.status,
                billDetail: r.billDetail,
                attachments: r.attachments,

                // courtCaseNumber: r.courtCaseNumber,
                // caseMainType: r.caseMainType,

                // courtName: r.courtName,

                // court: r.court,

                // courtNameEn: courtNames?.find((obj) => obj.id === r.court)
                //   ?.courtName,

                // courtNameMr: courtNames?.find((obj) => obj.id === r.court)?.courtMr,

                // stampNo: r.stampNo,

                // fillingDate: moment(r.fillingDate).format("YYYY-MM-DD"),

                // advocateNameEn:
                //   r?.advocate?.firstName +
                //   " " +
                //   r?.advocate?.middleName +
                //   " " +
                //   r?.advocate?.lastName,

                // advocateNameMar:
                //   r?.advocate?.firstName +
                //   " " +
                //   r?.advocate?.middleName +
                //   " " +
                //   r?.advocate?.lastName,

                // advocateName1: advocateNames?.find(
                //   (obj) => obj.id === r.advocateName,
                // )?.advocateName,

                // advocateNameMr: advocateNames?.find(
                //   (obj) => obj.id === r.advocateName,
                // )?.advocateNameMr,

                // filedBy: r.filedBy,

                // filedByMr: r.filedByMr,

                // filedAgainst: r.filedAgainst,
                // caseDetails: r.caseDetails,
                // caseMainType: r.caseMainType,

                // caseMainTypeName: caseTypes?.find(
                //   (obj) => obj.id === r.caseMainType,
                // )?.caseMainType,

                // subType: r.subType,
                // year: r.year,
                // opponentAdvocate: r.opponentAdvocate,
                // concernPerson: r.concernPerson,
                // appearanceDate: moment(r.appearanceDate).format("YYYY-MM-DD"),

                // // fillingDate: moment(r.fillingDate).format("YYYY-MM-DD"),

                // department: r.department,
                // priviouseCourtName: r.priviouseCourtName,

                // courtCaseNumber: r.courtCaseNumber,

                // caseEntry: r.caseEntry,
                // filedAgainstMr: r.filedAgainstMr,

                // opponentAdvocateMr: r.opponentAdvocateMr,
                // concernPersonMr: r.concernPersonMr,

                // fixAmount: r.fixAmount,

                // paidAmountDate: moment(r.paidAmountDate).format("YYYY-MM-DD"),

                // pendingAmount: r.pendingAmount,
                // paidAmount: r.paidAmount,
                // caseNumber: r.caseNumber,
                // caseRefnceNo: r.caseRefnceNo,

                // status: r.activeFlag === "Y" ? "Active" : "Inactive",
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

  // colulmns
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
      // width: 120,
      flex: 1,
    },
    {
      headerName: <FormattedLabel id="billNo" />,
      field: "id",
      // width: 250,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      headerName: "Bill Date",
      field: "createDtTm",
      // width: 250,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      headerName: "Bill Status",
      field: "status",
      // width: 250,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      headerName: "Advocate Name",
      field: "advocateName",
      // width: 250,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="action" />,
      minWidth: 350,
      sortable: false,
      disableColumnMenu: true,
      flex: 1,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              color="primary"
              size="small"
              onClick={() => {
                console.log("row1111", params?.row);
                localStorage.removeItem("pageMode");
                localStorage.setItem(
                  "attachments",
                  JSON?.stringify(params?.row?.attachments ?? [])
                );
                localStorage.setItem(
                  "billDetail",
                  JSON?.stringify(params?.row?.billDetail ?? [])
                );
                localStorage.setItem("role", "BillCreate");
                localStorage.setItem("buttonInputStateNew", true);
                router.push({
                  pathname:
                    "/LegalCase/transaction/demandedBillToAdvocate/view",
                  query: {
                    billID: params?.row?.id,
                    pageMode: "VIEW_ONLY",
                    // pageMode: "Add",
                  },
                });
              }}
            >
              <Visibility />
            </IconButton>
            {params?.row?.status == "BILL_RAISED" && (
              <IconButton
                color="primary"
                size="small"
                onClick={() => {
                  console.log("row1111", params?.row);
                  localStorage.removeItem("pageMode");
                  // localStorage.removeItem("attachments");
                  // localStorage.removeItem("billDetail");
                  localStorage.setItem(
                    "attachments",
                    JSON?.stringify(params?.row?.attachments ?? [])
                  );
                  localStorage.setItem(
                    "billDetail",
                    JSON?.stringify(params?.row?.billDetail ?? [])
                  );
                  localStorage.setItem("role", "BillCreate");
                  localStorage.setItem("buttonInputStateNew", true);
                  router.push({
                    pathname:
                      "/LegalCase/transaction/demandedBillToAdvocate/view",
                    query: {
                      billID: params?.row?.id,
                      pageMode: "EDIT_ONLY",
                    },
                  });
                }}
              >
                <EditIcon />
              </IconButton>
            )}
            {params?.row?.status == "REASSIGN_BY_LEGAL_CLERK" && (
              <IconButton>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    console.log("row1111", params?.row);
                    localStorage.removeItem("pageMode");
                    // localStorage.removeItem("attachments");
                    // localStorage.removeItem("billDetail");
                    localStorage.setItem(
                      "attachments",
                      JSON?.stringify(params?.row?.attachments ?? [])
                    );
                    localStorage.setItem(
                      "billDetail",
                      JSON?.stringify(params?.row?.billDetail ?? [])
                    );
                    localStorage.setItem("role", "BillCreate");
                    localStorage.setItem("buttonInputStateNew", true);
                    router.push({
                      pathname:
                        "/LegalCase/transaction/demandedBillToAdvocate/view",
                      query: {
                        billID: params?.row?.id,
                        pageMode: "REASSIGN_BY_LEGAL_CLERK",
                        // pageMode: "Add",
                      },
                    });
                  }}
                >
                  Recreate Bill
                </Button>
              </IconButton>
            )}
          </Box>
        );
      },
    },
    // {
    //   headerName: <FormattedLabel id="status" />,
    //   field: "status",
    //   // width: 250,
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },

    // {
    //   headerName: "Court Case Number",
    //   field: "courtCaseNumber",
    //   width: 190,
    //   headerAlign: "center",
    //   align: "center",
    // },
    // {
    //   headerName: "Case Type",
    //   field: "caseType",
    //   width: 170,
    //   // flex: 1,
    //   headerAlign: "center",
    //   align: "center",
    // },
    // ,
    // {
    //   headerName: "Case-Sub Type",
    //   field: "advocateNcaseSubType",
    //   width: 240,
    //   // flex: 1,
    //   headerAlign: "center",
    //   align: "center",
    // },

    // {
    //   headerName: "Payment",
    //   field: "payment",
    //   width: 240,
    //   // flex: 1,
    //   headerAlign: "center",
    //   align: "center",
    // },

    // {
    //   headerName: "Paid Amount",
    //   field: "paidAmount",
    //   width: 240,
    //   // flex: 1,
    //   headerAlign: "center",
    //   align: "center",
    // },

    // {
    //   headerName: "Bill Amount",
    //   field: "billAmount",
    //   width: 240,
    //   // flex: 1,
    //   headerAlign: "center",
    //   align: "center",
    // },
  ].filter((obj) => {
    if (router?.query?.billStatus) {
      return obj;
    } else {
      return obj?.field !== "advocateName";
    }
  });

  // ------------------- useEffect ---------------

  useEffect(() => {
    getDemandedBill();
  }, [user?.userDao?.advocateId]);

  // view
  return (
    <>
      <Box>
        <div>
          <BreadcrumbComponent />
        </div>
      </Box>
      <Paper component={Box} elevation={5} padding="40px">
        {/* Header */}
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

            // #00308F
            color: "white",
            height: "8vh",
            // fontSize: 19,
            // marginTop: 30,
            // marginBottom: "50px",
            // marginTop: ,
            // padding: 8,
            // paddingLeft: 30,
            // marginLeft: "50px",
            // marginRight: "75px",
            borderRadius: 100,
          }}
        >
          <IconButton
            style={{
              color: "white",
              // marginTop:"1vh"
            }}
          >
            <ArrowBackIcon
              onClick={() => {
                router?.query?.billStatus
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
                marginTop: "1vh",
                // background:
                //   "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
              }}
            >
              {" "}
              <FormattedLabel id="advocateBills" />
            </h2>
          </Grid>
        </Grid>

        {/** Heading */}
        {/* <div
          style={{
            backgroundColor: "#0084ff",
            color: "white",
            fontSize: 19,
            marginBottom: 40,
            padding: 8,
            paddingLeft: 30,
            marginLeft: "50px",
            marginRight: "75px",
            borderRadius: 100,
          }}
        >
          <strong style={{ display: "flex", justifyContent: "center" }}>
            Advocate Bill
          </strong>
        </div> */}
        {router?.query?.billStatus ? (
          <> </>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "right",
              marginRight: "3vh",
              marginTop: "3vh",
            }}
          >
            {/** AddButton */}
            <Button
              variant="contained"
              onClick={() => {
                localStorage.removeItem("pageMode");
                localStorage.removeItem("attachments");
                localStorage.removeItem("billDetail");
                localStorage.setItem("role", "BillCreate");
                localStorage.setItem("buttonInputStateNew", true);
                router.push({
                  pathname:
                    "/LegalCase/transaction/demandedBillToAdvocate/view",
                  query: {
                    pageMode: "Add",
                  },
                });
              }}
            >
              <FormattedLabel id="add" />
            </Button>
          </div>
        )}
        {/** Table */}
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
      </Paper>
    </>
  );
};

export default Index;
