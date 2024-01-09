import { ThemeProvider } from "@emotion/react";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import sweetAlert from "sweetalert";
import styles from "./view.module.css";
import ClearIcon from "@mui/icons-material/Clear";
import { useSelector } from "react-redux";
import axios from "axios";
import urls from "../../../../URLS/urls";
import moment from "moment";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import jsPDF from "jspdf";
import "jspdf-autotable";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import gmLabels from "../../../../containers/reuseableComponents/labels/modules/gmLabels";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil";

const Index = () => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedValuesOfDepartments, setSelectedValuesOfDepartments] =
    useState([]);
  const [departments, setDepartments] = useState([]);
  const [eventes, setEvents] = useState([1, 2, 3]);
  const [subDepartments, setSubDepartment] = useState([]);
  const [selectedValuesOfSubDept, setSelectedValuesOfSubDept] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState();
  const language = useSelector((store) => store.labels.language);
  const [labels, setLabels] = useState(gmLabels[language ?? "en"]);
  const userToken = useSelector((state) => {
    return state?.user?.user?.token;
  });
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error,moduleOrCFC) => {
    if (!catchMethodStatus) {
      if(moduleOrCFC){
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }else{
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };
  useEffect(() => {
    setLabels(gmLabels[language ?? "en"]);
  }, [setLabels, language]);

  let resetValuesCancell = {
    fromDate: null,
    toDate: null,
  };

  let onCancel = () => {
    reset({
      ...resetValuesCancell,
    });
    setSelectedValuesOfDepartments([]);
  };

  const getDepartments = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`,{
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      setDepartments(
        r.data.department.map((row) => ({
          id: row.id,
          department: row.department,
          departmentMr: row.departmentMr,
        }))
      );
    }).catch((err)=>{
      cfcErrorCatchMethod(err,false);
    });
  };

  const getSubDepartments = () => {
    axios.get(`${urls.CFCURL}/master/subDepartment/getAll`,{
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      setSubDepartment(
        r.data.subDepartment.map((row) => ({
          id: row.id,
          subDepartmentName: row.subDepartment,
          subDepartmentNameMr: row.subDepartmentMr,
          department: row.department,
          departmentMr: row.departmentMr,
        }))
      );
    });
  };

  useEffect(() => {
    getDepartments();
    getSubDepartments();
  }, []);

  const onSubmitFunc = () => {
    if (watch("fromDate") && watch("toDate")) {
      let sendFromDate =
        moment(watch("fromDate")).format("YYYY-MM-DDT") + "00:00:01";
      let sendToDate =
        moment(watch("toDate")).format("YYYY-MM-DDT") + "23:59:59";

      let apiBodyToSend = {
        lstDepartment:
          selectedValuesOfDepartments?.length > 0
            ? selectedValuesOfDepartments
            : [],
        lstSubDepartment:
          selectedValuesOfSubDept?.length > 0 ? selectedValuesOfSubDept : [],
        fromDate: sendFromDate,
        toDate: sendToDate,
      };
      setLoading(true);
      axios
        .post(
          `${urls.GM}/report/getReportDepartmentWiseComplaintStatusV4`,
          apiBodyToSend,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          console.log(":log", res);
          if (res?.status === 200 || res?.status === 201) {
            if (res?.data.length > 0) {
              setData(
                res?.data?.map((r, i) => ({
                  id: i + 1,
                  // srNo: i + 1,

                  departmentName: newFunctionForNullValues(
                    "en",
                    r.departmentName
                  ),
                  departmentNameMr: newFunctionForNullValues(
                    "mr",
                    r.departmentNameMr
                  ),

                  subDepartmentName: newFunctionForNullValues(
                    "en",
                    r.subDepartmentName
                  ),
                  subDepartmentNameMr: newFunctionForNullValues(
                    "mr",
                    r.subDepartmentNameMr
                  ),

                  totalOpenGriv: r.totalOpenGriv,
                  totalCloseGriv: r.totalCloseGriv,
                  totalGrievance: r.totalGrievance,
                  percentage: r.percentage,

                  ////////////////////NEWLY ADDED FIELDS////////////////
                  areaName: newFunctionForNullValues("en", r.areaName),
                  areaNameMr: newFunctionForNullValues("mr", r.areaNameMr),
                  wardName: newFunctionForNullValues("en", r.wardName),
                  wardNameMr: newFunctionForNullValues("mr", r.wardNameMr),
                  zoneName: newFunctionForNullValues("en", r.zoneName),
                  zoneNameMr: newFunctionForNullValues("mr", r.zoneNameMr),
                }))
              );
              setLoading(false);
            } else {
              sweetAlert({
                title: language === "en" ? "OOPS!" : "क्षमस्व!",
                text: language === "en"
                ? "There is nothing to show you!"
                : "माहिती उपलब्ध नाही",
                icon: "warning",
                // buttons: ["No", "Yes"],
                dangerMode: false,
                closeOnClickOutside: false,
              });
              setData([]);
              setLoading(false);
            }
          } else {
            setData([]);
            sweetAlert(  language == "en" ? "Something Went To Wrong !" : "काहीतरी चूक झाली!",);
            setLoading(false);
          }
        })
          .catch((err) => {
            setData([]);
            setLoading(false);
            cfcErrorCatchMethod(err,false);
        });
    } else {
      sweetAlert({
        title: language === "en" ? "OOPS!" : "क्षमस्व!",
        text:language === "en" ? "Both Dates Are Required!":"दोन्ही तारखा आवश्यक आहेत!",
        icon: "warning",
        dangerMode: false,
        closeOnClickOutside: false,
      });
      setData([]);
    }
  };

  const newFunctionForNullValues = (lang, value) => {
    if (lang == "en") {
      return value ? value : "Not Available";
    } else {
      return value ? value : "उपलब्ध नाही";
    }
  };


  const columns = [
    {
      field: "id",
      headerName: labels.srNo,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "departmentName" : "departmentNameMr",
      headerName: labels.departmentName,
      minWidth: 250,
      headerAlign: "center",
      align: "left",
    },
    {
      field: language == "en" ? "subDepartmentName" : "subDepartmentNameMr",
      headerName: labels.subDepartmentName,
      minWidth: 200,
      headerAlign: "center",
      align: "left",
    },
    {
      field: language === "en" ? "areaName" : "areaNameMr",
      headerName: <FormattedLabel id="areaName" />,
      headerName: labels.areaName,
      minWidth: 200,
      headerAlign: "center",
      align: "left",
    },
    {
      field: language === "en" ? "wardName" : "wardNameMr",
      headerName: <FormattedLabel id="wardName" />,
      headerName: labels.wardName,
      minWidth: 200,
      headerAlign: "center",
      align: "left",
    },
    {
      field: language === "en" ? "zoneName" : "zoneNameMr",
      headerName: <FormattedLabel id="zoneName" />,
      headerName: labels.zoneName,
      minWidth: 200,
      headerAlign: "center",
      align: "left",
      
    },
    {
      field: "totalCloseGriv",
      headerName: <FormattedLabel id="totalCloseGriv" />,
      headerName: labels.totalCloseGriv,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "totalOpenGriv",
      headerName: <FormattedLabel id="totalOpenGriv" />,
      headerName: labels.totalOpenGriv,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "totalGrievance",
      headerName: <FormattedLabel id="totalGrievance" />,
      headerName: labels.totalGrievance,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "percentage",
      headerName: <FormattedLabel id="completionPercentage" />,
      headerName: labels.completionPercentage,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div>
            {" "}
            {params?.row?.percentage ? params?.row?.percentage + "%" : ""}
          </div>
        );
      },
    },
  ];


  const handleSelect = (evt, value) => {
    console.log(":values", value);
    const selectedIds = value.map((val) => val.id);

    setSelectedValuesOfDepartments(selectedIds);
  };

  const currDate = new Date();

  return (
    <ThemeProvider theme={theme}>
      <>
        <BreadcrumbComponent />
      </>
      <Paper
        style={{
          margin: "30px",
        }}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1%",
          }}
        >
          <Box
            className={styles.details1}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "98%",
              height: "auto",
              overflow: "auto",
              padding: "0.5%",
              color: "black",
              fontSize: 19,
              fontWeight: 500,
              border: "1px solid black",
            }}
          >
            <strong className={styles.fancy_link1}>
              {labels.allEventsPendingDeatils}
            </strong>
          </Box>
        </Box>
        <Box
          style={{
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper elevation={3} style={{ margin: "10px", width: "80%" }}>
            <form onSubmit={handleSubmit(onSubmitFunc)}>
              <Grid
                container
                spacing={2}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "baseline",
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  <FormControl variant="standard" error={!!errors.department}>
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="department" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: 220 }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                            console.log("value: ", value.target.value);
                            setSelectedDepartment(value.target.value);
                          }}
                          label="department"
                        >
                          {departments &&
                            departments.map((department, index) => (
                              <MenuItem key={index} value={department.id}>
                                {language == "en"
                                  ? department?.department
                                  : department?.departmentMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="department"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.department ? errors.department.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  <FormControl
                    variant="standard"
                    error={!!errors.subDepartment}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="subDepartment" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: 220 }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="subDepartment"
                        >
                          {subDepartments &&
                            subDepartments
                              .filter((department) => {
                                return (
                                  department.department === selectedDepartment
                                );
                              })
                              .map((subDepartmentName, index) => (
                                <MenuItem
                                  key={index}
                                  value={subDepartmentName.id}
                                >
                                  {language == "en"
                                    ? subDepartmentName?.subDepartmentName
                                    : subDepartmentName?.subDepartmentNameMr}
                                </MenuItem>
                              ))}
                        </Select>
                      )}
                      name="subDepartment"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.subDepartment
                        ? errors.subDepartment.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    options={eventes}
                    disableCloseOnSelect
                    getOptionLabel={(option) =>
                      language === "en"
                        ? option.departmentEn
                            ?.split(" ")
                            .map((word) => word.charAt(0))
                            .join("")
                            .toUpperCase()
                        : option.departmentMr
                            ?.split(" ")
                            .map((word) => word.charAt(0))
                            .join(" ")
                    }
                    onChange={handleSelect}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          checked={selected}
                        />
                        "Events"
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        sx={{ width: "320px", margin: 0 }}
                        variant="standard"
                        {...params}
                        label={<FormattedLabel id="events" />}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid
                container
                spacing={2}
                style={{
                  padding: "10px",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "baseline",
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    style={{ backgroundColor: "white" }}
                    error={!!errors.fromDate}
                  >
                    <Controller
                      control={control}
                      name="fromDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            disableFuture
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                <FormattedLabel id="fromDate" />
                              </span>
                            }
                            value={field.value || null}
                            onChange={(date) => field.onChange(date)}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                sx={{ width: "320px" }}
                                {...params}
                                size="small"
                                fullWidth
                                variant="standard"
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>
                      {errors?.fromDate ? errors.fromDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    style={{ backgroundColor: "white" }}
                    error={!!errors.toDate}
                  >
                    <Controller
                      control={control}
                      name="toDate"
                      defaultValue={currDate}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            disableFuture
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                <FormattedLabel id="toDate" />
                              </span>
                            }
                            value={field.value || null}
                            onChange={(date) => field.onChange(date)}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                sx={{ width: "320px" }}
                                {...params}
                                size="small"
                                fullWidth
                                variant="standard"
                              />
                            )}
                            minDate={watch("fromDate")}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>
                      {errors?.toDate ? errors.toDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid
                container
                style={{
                  padding: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "baseline",
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Paper
                    elevation={4}
                    style={{ margin: "30px", width: "auto" }}
                  >
                    <Button variant="contained">PointWise</Button>
                  </Paper>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Paper
                    elevation={4}
                    style={{ margin: "30px", width: "auto" }}
                  >
                    <Button>Categorywise</Button>
                  </Paper>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Paper
                    elevation={4}
                    style={{ margin: "30px", width: "auto" }}
                  >
                    <Button>Reset</Button>
                  </Paper>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Paper
                    elevation={4}
                    style={{ margin: "30px", width: "auto" }}
                  >
                    <Button
                      size="small"
                      type="button"
                      variant="contained"
                      color="error"
                      endIcon={<ClearIcon />}
                      onClick={onCancel}
                    >
                      {<FormattedLabel id="cancel" />}
                    </Button>
                  </Paper>
                </Grid>
              </Grid>
            </form>
          </Paper>
          {loading ? (
            <>
              <CommonLoader />
            </>
          ) : data.length !== 0 ? (
            <div style={{ width: "100%" }}>
              <DataGrid
                autoHeight={true}
                sx={{
                  overflowY: "scroll",
                  backgroundColor: "white",
                  "& .MuiDataGrid-columnHeadersInner": {
                    backgroundColor: "#556CD6",
                    color: "white",
                  },

                  "& .MuiDataGrid-cell:hover": {
                    color: "primary.main",
                  },
                  "& .mui-style-levciy-MuiTablePagination-displayedRows": {
                    marginTop: "17px",
                  },

                  "& .MuiSvgIcon-root": {
                    color: "black", // change the color of the check mark here
                  },
                }}
                components={{ Toolbar: GridToolbar }}
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 0 },
                    disableExport: true,
                    disableToolbarButton: false,
                    csvOptions: { disableToolbarButton: false },
                    printOptions: { disableToolbarButton: true },
                  },
                }}
                rows={data ? data : []}
                columns={columns}
                density="compact"
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
              />
            </div>
          ) : (
            ""
          )}
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default Index;
