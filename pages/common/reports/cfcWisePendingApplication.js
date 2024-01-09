import React, { useEffect, useRef, useState } from "react";
import styles from "../../../styles/common/reports/listOfDepartment.module.css";
import Head from "next/head";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import ReportLayout from "../../../containers/reuseableComponents/ReportLayout";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";
import { Print, Search } from "@mui/icons-material";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import axios from "axios";
import URLs from "../../../URLS/urls";
import urls from "../../../URLS/urls";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import schema from "../../../containers/schema/common/reports/cfcWisePendingApplicationSchema";
import Loader from "../../../containers/Layout/components/Loader";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../util/util";

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);
  const user = useSelector((state) => state.user.user);
  const componentRef = useRef(null);
  const [table, setTable] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [fetchedData, setFetchedData] = useState([]);
  const [cfcs, setCfcs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    watch,
    handleSubmit,
    register,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });
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

  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    // @ts-ignore
    documentTitle: watch("departmentType") + " Report",
  });

  useEffect(() => {
    getCfcs();
    getDepartment();
  }, []);

  const getCfcs = () => {
    setLoading(true);
    axios
      .get(`${urls.CFCURL}/master/cfcCenters/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setLoading(false);
        console.log("cfcs", r);
        setCfcs(
          r.data.cfcCenters.map((row) => ({
            ...row,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getTableData = () => {};

  const getDepartment = () => {
    setLoading(true);
    axios
      .get(`${urls.CFCURL}/master/application/getAll`)
      .then((res) => {
        setLoading(false);
        setDepartments(
          res.data.application.map((r, i) => ({
            id: r.id,
            applicationNameEng: r.applicationNameEng,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const columns = [
    {
      field: "srNo",
      headerName: language == "en" ? "Sr No" : "अनु क्र",
      flex: 0.5,
    },
    {
      field: "centerId",
      headerName: language == "en" ? "Center Id" : "केंद्र आयडी",
      flex: 1,
    },
    {
      field: "cfcCenterName",
      headerName: language == "en" ? "CFC Center Name" : "सीएफसी केंद्राचे नाव",
      flex: 1,
    },
    {
      field: "departmentName",
      headerName: language == "en" ? "Department Name" : "विभागाचे नाव",
      flex: 1,
    },
    {
      field: "dueCount",
      headerName: language == "en" ? "Due Count" : "देय गणना",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowTable(true)}
            >
              {params.row.dueCount}
            </Link>
          </>
        );
      },
    },
    {
      field: "overDueCount",
      headerName:
        language == "en" ? "Over Due Count" : "मुदत संपुन गेलेला रक्कम",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowTable(true)}
            >
              {params.row.overDueCount}
            </Link>
          </>
        );
      },
    },
  ];

  const _columns = [
    {
      headerClassName: "cellColor",
      field: "srNo",
      headerAlign: "center",
      formattedLabel: "srNo",
      width: 50,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "subject",
      headerAlign: "center",
      formattedLabel: "subject",
      width: 400,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "applicationNumber",
      headerAlign: "center",
      formattedLabel: "applicationNumber",
      width: 150,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "applicationDate",
      headerAlign: "center",
      formattedLabel: "applicationDate",
      width: 110,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "completionDate",
      headerAlign: "center",
      formattedLabel: "completionDate",
      width: 110,
      align: "center",
    },

    {
      headerClassName: "cellColor",
      field: "pendingWith",
      headerAlign: "center",
      formattedLabel: "pendingWith",
      width: 150,
      align: "center",
    },
  ];

  const finalSubmit = (data) => {
    setLoading(true);
    let _cfc = cfcs?.map((val) => {
      return val.id;
    });
    let selectedcfcName =
      watch("selectedcfcName") == "All"
        ? _cfc?.toString()
        : watch("selectedcfcName");

    axios
      .get(
        `${
          urls.CFCURL
        }/trasaction/report/cfcWisePendingApplication?cfcId=${selectedcfcName}&deptId=${watch(
          "departmentKey"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res, index) => {
        console.log("post", res);
        setLoading(false);
        if (res.status == 200) {
          let data = res?.data?.reportResponceList;
          setFetchedData(
            data?.map((val, index) => {
              return {
                srNo: index + 1,
                subject: val?.subjectName,
                applicationNumber: val?.applicationNo,
                applicationDate: val?.applicationDate,
                completionDate: val?.applicationDate,
                pendingWith: cfcs?.find((obj) => obj.id == val?.pendingAtCfc)
                  ?.cfcCenterName
                  ? cfcs?.find((obj) => obj.id == val?.pendingAtCfc)
                      ?.cfcCenterName
                  : "-",
              };
            })
          );
          if (data?.length > 0) {
            setShowTable(true);
          } else {
            sweetAlert("Info", "No records found", "info");
          }
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  console.log("table", fetchedData);

  return (
    <>
      <Head>
        <title>CFC Wise Pending Application</title>
      </Head>
      <BreadcrumbComponent />
      <Paper className={styles.main}>
        <div className={styles.title}>
          <FormattedLabel id="cfcWisePendingApplication" />
        </div>
        <Box>
          {loading ? (
            <Loader />
          ) : (
            <>
              <form onSubmit={handleSubmit(finalSubmit)}>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={6}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl
                      variant="outlined"
                      error={!!errors.selectedcfcName}
                      size="small"
                      sx={{ width: "90%" }}
                    >
                      <InputLabel id="demo-simple-select-outlined-label">
                        <FormattedLabel id="cfcCenterName" />
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        label={<FormattedLabel id="cfcCenterName" />}
                        {...register("selectedcfcName")}
                        onChange={(e) => {
                          setValue("selectedcfcName", e.target.value, {
                            shouldValidate: true,
                          });
                        }}
                        value={watch("selectedcfcName")}
                      >
                        <MenuItem value="All" key="none">
                          All
                        </MenuItem>
                        {cfcs &&
                          cfcs.map((department, index) => (
                            <MenuItem key={index} value={department.cfcId}>
                              {department.cfcName}
                            </MenuItem>
                          ))}
                      </Select>
                      <FormHelperText>
                        {errors?.selectedcfcName
                          ? errors.selectedcfcName.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl
                      fullWidth
                      size="small"
                      sx={{ width: "90%" }}
                      error={errors.departmentKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="department" />
                      </InputLabel>
                      <Controller
                        name="departmentKey"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            // {...field}
                            onChange={(value) => field.onChange(value)}
                            value={field.value}
                            label={<FormattedLabel id="department" />}
                          >
                            {departments?.map((item, i) => {
                              return (
                                <MenuItem key={i} value={item.id}>
                                  {item.applicationNameEng}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        )}
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {errors?.departmentKey
                          ? errors.departmentKey.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                <div
                  className={styles.centerDiv}
                  style={{ gap: 20, marginTop: 20 }}
                >
                  <Button
                    variant="contained"
                    type="submit"
                    endIcon={<Search />}
                    size="small"
                  >
                    <FormattedLabel id="search" />
                    {/* Search */}
                  </Button>
                  <Button
                    disabled={table.length == 0}
                    variant="contained"
                    onClick={handleToPrint}
                    endIcon={<Print />}
                    size="small"
                  >
                    <FormattedLabel id="print" />
                    {/* Print */}
                  </Button>
                </div>
              </form>
              <Box sx={{ padding: "10px" }}>
                {table.length > 0 && (
                  <div className={styles.centerDiv}>
                    <DataGrid
                      componentsProps={{
                        toolbar: {
                          hideDensitySelector: true,
                          showQuickFilter: false,
                          hideRowCount: true,
                          hideShowColumnsButton: true,
                          hideSettings: true,
                          hideFilterIcon: true,
                          hideColumnSelector: true,
                          hideExportButton: true,
                        },
                      }}
                      getRowId={(row) => row.srNo}
                      autoHeight={true}
                      density="compact"
                      pagination={false}
                      sx={{
                        "& .super-app-theme--cell": {
                          backgroundColor: "#E3EAEA",
                          borderLeft: "10px solid white",
                          borderRight: "10px solid white",
                          borderTop: "4px solid white",
                        },
                        backgroundColor: "white",
                        boxShadow: 2,
                        border: 1,
                        borderColor: "primary.light",
                        "& .MuiDataGrid-cell:hover": {},
                        "& .MuiDataGrid-row:hover": {
                          backgroundColor: "#E3EAEA",
                        },
                        "& .MuiDataGrid-columnHeadersInner": {
                          backgroundColor: "#556CD6",
                          color: "white",
                        },

                        "& .MuiDataGrid-column": {
                          backgroundColor: "red",
                        },
                        "& .MuiDataGrid-toolbarContainer": {
                          display: "none",
                        },
                      }}
                      rows={table}
                      columns={columns}
                    />
                  </div>
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {" "}
                {showTable && (
                  <ReportLayout
                    centerHeader
                    showDates={watch("fromDate") && watch("toDate")}
                    date={{
                      from: moment(watch("fromDate")).format("DD-MM-YYYY"),
                      to: moment(watch("toDate")).format("DD-MM-YYYY"),
                    }}
                    style={{
                      marginTop: "5vh",
                      boxShadow: "0px 2px 10px 0px rgba(0,0,0,0.75)",
                    }}
                    componentRef={componentRef}
                    rows={fetchedData}
                    customReportName={{
                      en: "CFC Wise Pending Application",
                      mr: "सीएफसी नुसार प्रलंबित अर्ज",
                    }}
                    columns={_columns}
                  />
                )}
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </>
  );
};

export default Index;
