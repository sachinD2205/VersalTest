import React, { useRef } from "react";
import { yupResolver } from "@hookform/resolvers/yup";

import BasicLayout from "../../../../containers/Layout/BasicLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Divider, Grid, IconButton, Paper } from "@mui/material";
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
// import schema from "./schema";
// import { addHearingSchema } from "../../../../containers/schema/LegalCaseSchema/addHearingSchema";

import urls from "../../../../URLS/urls";
import { useReactToPrint } from "react-to-print";
import Image from "next/image";
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
    resolver: yupResolver(),
    mode: "onChange",
  });
  const language = useSelector((state) => state.labels.language);
  const router = useRouter();
  const [tableData, setTableData] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [courtNames, setCourtNames] = useState([]);
  const [advocateNames, setAdvocateNames] = useState([]);
  const [id, setID] = useState();

  const [caseTypes, setCaseTypes] = useState([]);
  const [caseStages, setCaseStages] = useState([]);

  const [btnSaveText, setBtnSaveText] = useState("Save");

  const [editButtonInputState, setEditButtonInputState] = useState(false);

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

  const componentRef = useRef(null);
  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Vakalatnama",
    pageStyle: "A4",
    // onAfterPrint: () => alert('Print success'),
  });

  useEffect(() => {
    getCaseTypes();

    getCaseStage();
  }, []);

  useEffect(() => {
    console.log("dataSource=>", dataSource);
  }, [dataSource]);

  useEffect(() => {
    getAddHearing();
  }, [caseTypes, caseStages]);

  useEffect(() => {
    console.log("advocateName", advocateNames);
  }, []);

  const getCaseStage = () => {
    axios
      .get(`${urls.LCMSURL}/master/caseStages/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCaseStages(
          res.data.caseStages.map((r, i) => ({
            id: r.id,
            caseStages: r.caseStages,
            caseStagesMr: r.caseStagesMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getAddHearing = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.LCMSURL}/trnsaction/addHearing/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        console.log("r", r);
        let result = r.data.addHearing;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log("44");
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,

            id: r.id,

            // generate sr no based on page no and page size
            srNo: i + 1 + _pageNo * _pageSize,

            // caseMainType:caseTypes?.find((obj) =>obj.id ===caseMainType)?.caseMainType,

            caseMainType: caseTypes?.find((obj) => obj.id === r.caseMainType)
              ?.caseMainType,

            caseMainTypeMr: caseTypes?.find((obj) => obj.id === r.caseMainType)
              ?.caseMainTypeMr,
            caseMainType: r.caseMainType,

            // filingDate:moment.(r.filingDate).format("YYYY-MM-DD"),

            filingDate: moment(r.filingDate).format("DD-MM-YYYY"),

            fillingDate: moment(r.fillingDate).format("DD-MM-YYYY"),

            hearingDate: moment(r.hearingDate).format("DD-MM-YYYY"),

            caseStage: r.caseStage,

            // caseStages:caseStages?.find((obj) =>obj.id === r.caseStages)?.caseStages,

            caseStagesMr: caseStages?.find((obj) => obj.id === r.caseStages)
              ?.caseStagesMr,
            courtCaseNumber: r.courtCaseNumber,
            caseEntry: r.caseEntry,
            caseStatus: r.caseStatus,

            AddHearingMr: r.AddHearingMr,
            remark: r.remark,
            remarkMr: r.remarkMr,

            // caseStages:r.caseStages,

            caseNumber: r.caseNumber,
            caseNoYear: r.caseNoYear,

            // caseMainType:r.caseMainType,

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

  //Delete by Id
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
            .post(`${urls.LCMSURL}/trnsaction/addHearing/save`, body, {
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
                getAddHearing();
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
            .post(`${urls.LCMSURL}/trnsaction/addHearing/save`, body, {
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
                getAddHearing();
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

  // get Case Type

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
            caseMainTypeMr: r.caseMainTypeMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
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

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",

      width: 140,

      // width: 120,
    },
    {
      field: "caseNoYear",

      headerName: <FormattedLabel id="courtCaseNo" />,
      width: 250,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "caseStatus",
      headerName: <FormattedLabel id="caseStatus" />,
      width: 250,
      align: "center",
      headerAlign: "center",

      //   { id: 1, caseStatus: "Running" },
      //{ id: 2, caseStatus: "Intrim Order" },
      //{ id: 3, caseStatus: "Final Order" },
      // show status based on above id and caseStatus
      renderCell: (params) => {
        return (
          <div>
            {params.row.caseStatus === "1" ? (
              <span className="badge badge-success">Running</span>
            ) : params.row.caseStatus === "2" ? (
              <span className="badge badge-warning">Intrim Order</span>
            ) : params.row.caseStatus === "3" ? (
              <span className="badge badge-danger">Final Order</span>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    // {
    //   // field: "caseMainType",

    //   field: language === "en" ? "caseMainType" : "caseMainTypeMr",

    //   headerName: <FormattedLabel id="caseType" />,add
    // },

    {
      field: "filingDate",
      headerName: <FormattedLabel id="filingDate" />,
      // flex: 1,
      width: 260,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "hearingDate",
      headerName: <FormattedLabel id="hearingDate" />,
      width: 260,
      // flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      width: 460,
      // flex: 1,
      headerAlign: "center",
      align: "center",
    },
    // {
    //   field: language === "en" ? "caseStages" : "caseStagesMr",
    //   headerName: <FormattedLabel id="caseStages" />,
    //   width: 240,
    //   // flex: 1,
    //   headerAlign: "center",
    //   align: "center",
    // },
  ];

  return (
    <>
      <Grid container>
        <Grid item xl={11} lg={11}></Grid>
        <Grid item>
          <Button
            style={
              {
                // float: "right",
              }
            }
            variant="contained"
            // endIcon={<Print />}
            onClick={handleToPrint}
          >
            {/* <FormattedLabel id="print" /> */}
            Print
          </Button>
        </Grid>
      </Grid>

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
        ref={componentRef}
      >
        {/* <Box
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            // backgroundColor:'#0E4C92'
            // backgroundColor:'		#0F52BA'
            // backgroundColor:'		#0F52BA'
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            <FormattedLabel id="addHearing" />
          </h2>
        </Box> */}

        <Grid
          container
          style={{
            // marginLeft: "60px",
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Grid item>
            <Image
              src="/logo.png"
              alt="PCMC Logo"
              width={80}
              height={80}
              objectFit="contain"
            />
          </Grid>
          <Grid item xl={1} lg={1}></Grid>
          <Grid item>
            <Grid container>
              <Grid item>
                <h2>
                  {language == "en"
                    ? "Pimpri-Chinchwad Municipal Corporation"
                    : "पिंपरी चिंचवड महानगरपालिका"}
                </h2>
              </Grid>
            </Grid>
            <Grid container>
              <Grid
                item
                style={{
                  marginLeft: "50px",
                }}
              >
                <h3>
                  {language == "en"
                    ? "Mumbai-Pune Road, Pimpri - 411018"
                    : "मुंबई-पुणे रोड, पिंपरी - ४११ ०१८"}
                </h3>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xl={0.5} lg={0.5}></Grid>

          <Grid item>
            <Image
              src="/smartCityPCMC.png"
              alt="Pimpri Smart City"
              width={110}
              height={60}
              objectFit="contain"
            />
          </Grid>
        </Grid>
        <Grid
          container
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Grid item></Grid>
        </Grid>
        <Divider
          style={{
            marginTop: "20px",
          }}
        />

        <div>
          {/* <div
            style={{
              display: "flex",
              justifyContent: "right",
              marginTop: 10,
            }}
          >
            <Button
              // type="primary"
              variant="contained"
              onClick={() => router.push(`/LegalCase/transaction/addHearing/view`)}
            >
              <FormattedLabel id="add" />
            </Button>
          </div> */}

          {/* </Paper> */}

          {/* New Table */}
          <Box
            sx={{
              // height: 400,
              marginTop: "10px",
              // width: 1000,
              //  marginLeft: 10,

              // width: '100%',

              // overflowX: 'auto',
            }}
          >
            <DataGrid
              //  disableColumnFilter
              //  disableColumnSelector
              // disableToolbarButton
              //  disableDensitySelector

              components={{ Toolbar: GridToolbar }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                  printOptions: { disableToolbarButton: true },
                  disableExport: true,
                  disableToolbarButton: true,
                  csvOptions: { disableToolbarButton: true },
                },
              }}
              autoHeight
              sx={{
                // marginLeft: 5,
                // marginRight: 5,
                // marginTop: 5,
                // marginBottom: 5,

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
                getAddHearing(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                // updateData("page", 1);
                getAddHearing(_data, data.page);
              }}
            />
          </Box>
        </div>
      </Paper>
    </>
  );
};

export default Index;
