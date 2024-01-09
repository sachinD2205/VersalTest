import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Box,Tooltip 
} from "@mui/material";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import axios from "axios";
import urls from "../../../../URLS/urls";
import dynamic from "next/dynamic";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CategoryWiseChartCSS from "./CategoryWiseChart.module.css";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
// newChart
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    return (
      <div
        style={{
          background: "white",
          padding: "5px",
          border: "1px solid #ccc",
        }}
      >
        <p>{dataPoint.departmentName}</p>
        <p>Value: {dataPoint.percentage}</p>
      </div>
    );
  }

  return null;
};


const CategoryWiseChart = () => {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const language = useSelector((state) => state?.labels.language);
  const user = useSelector((state) => state?.user?.user);
  const router = useRouter();
  const [CategoryWiseChartTableData, setCateogyWiseChartTable] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [pageSize, setPageSize] = useState(10);
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
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
  };


  // colors
  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7f50",
    "#b0e57c",
    "#cd5c5c",
    "#f08080",
    "#9370db",
    "#90ee90",
    "#ff69b4",
    "#1e90ff",
    "#d3d3d3",
    "#ff1493",
    "#00ced1",
    "#e9967a",
  ];

  // dateWithColors
  const dataWithColors = CategoryWiseChartTableData.map((entry, index) => ({
    ...entry,
    color: colors[index % colors.length],
  }));
  // numRecords
  const numRecords = CategoryWiseChartTableData.length;
  // desiredBarwidth
  const desiredBarWidth = numRecords > 6 ? 60 : numRecords > 4 ? 200 : 150; // Adjust the values as per your preference
  const yAxisDomain = [
    0,
    Math.max(...CategoryWiseChartTableData.map((entry) => entry.percentage)),
  ];

  // ! Chart End ----------

  // cancellButton
  const cancellButton = () => {
    setValue("CategoryWiseChartData", null);
  };

  // Department
  const getDepartment = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          setDepartments(
            res?.data?.department?.map((row) => ({
              id: row?.id,
              departmentEn: row?.department,
              departmentMr: row?.departmentMr,
            }))
          );
        } else {
        }
      })
      .catch((err) => {  cfcErrorCatchMethod(err,true);});
  };

  // DepartmentWiseChartColumns
  const DepartmentWiseChartColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: <FormattedLabel id="srNo" />,
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "departmentName" : "departmentNameMr",
      headerName: language == "en" ? "Department" : "विभाग",
      description: language == "en" ? "Department" : "विभाग",
      headerAlign: "center",
      align: "left",
      flex: 1,
    },
    {
      field: "totalGrievance",
      headerAlign: "center",
      align: "center",
      headerName: language == "en" ? "Received" : "प्राप्त",
      description: language == "en" ? "Received" : "प्राप्त",
      flex: 1,
      renderCell: (params) => {
        const cellStyle = {
          color: "blue",
          textAlign: "center",
          fontWeight: '800'
        };
        return <div style={cellStyle}>{params.value}</div>;
      },
    },
    {
      field: "totalCloseGriv",
      headerAlign: "center",
      align: "center",
      headerName: language == "en" ? "Settled" : "निकाली",
      description: language == "en" ? "Settled" : "निकाली",
      flex: 1,
      renderCell: (params) => {
        const cellStyle = {
          color: "blue",
          textAlign: "center",
          fontWeight: '800'
        };
        return <div style={cellStyle}>{params.value}</div>;
      },
    },
    {
      field: "totalOpenGriv",
      align: "center",
      headerName: language == "en" ? "Pending" : "प्रलंबित",
      description: language == "en" ? "Pending" : "प्रलंबित",
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => {
        const cellStyle = {
          color: "blue",
          textAlign: "center",
          fontWeight: '800'
        };
        return <div style={cellStyle}>{params.value}</div>;
      },
    },
    {
      field: "percentage",
      align: "center",
      headerName:
        language == "en" ? "Completion Percentage" : "पुर्तता टक्केवारी",
      description:
        language == "en" ? "Completion Percentage" : "पुर्तता टक्केवारी",
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => {
        const cellStyle = {
          color: "blue",
          textAlign: "center",
          fontWeight: '800'
        };
        return <div style={cellStyle}>{params.value}</div>;
      },
    },
  ];

  useEffect(() => {
    getDepartment();
  }, []);

  useEffect(() => {
    let chartData = watch("CategoryWiseChartData");
    // tableData
    let srNoWithChartData = chartData?.map((data, index) => {
      return {
        srNo: index + 1,
        ...data,
      };
    });
    setCateogyWiseChartTable(srNoWithChartData);
  }, [watch("CategoryWiseChartData")]);



  // View
  return (
    <>
      {/** Horizontal Line */}
      <hr className={CategoryWiseChartCSS.DayWiseHeaderName}></hr>
      {/** Buttons Start */}
      <Stack
        spacing={5}
        direction="row"
        style={{
          display: "flex",
          justifyContent: "right",
          marginRight: "50px",
          marginTop: "25px",
          marginBottom: "20px",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => cancellButton()}
        >
          <FormattedLabel id="back" />
        </Button>
      </Stack>
      {/** Buttons End */}
      {/** Header Name */}
      <Box>
        <Grid
          container
          style={{
            display: "flex",
            alignItems: "center", // Center vertically
            alignItems: "center",
            width: "100%",
            height: "auto",
            overflow: "auto",
            color: "white",
            fontSize: "18.72px",
            borderRadius: 100,
            fontWeight: 500,
            background:
              "linear-gradient( 90deg, rgb(72 115 218 / 91%) 2%, rgb(142 122 231) 100%)",
          }}
        >
          <Grid item xs={1}>
            <IconButton
              style={{
                color: "white",
              }}
              onClick={() => {
                router.back();
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Grid>
          <Grid item xs={11}>
            <h3
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                marginRight: "2rem",
              }}
            >
              {language == "en"
                ? "Department Performance Chart"
                : "विभाग कामगिरी चार्ट"}
            </h3>
          </Grid>
        </Grid>
      </Box>
      {/** Other Fields */}
      <Grid
        container
        className={CategoryWiseChartCSS.categoryWiseFormDateToDate}
      >
        <Grid
          item
          xs={12}
          sm={6}
          md={6}
          lg={4}
          xl={4}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItem: "center",
          }}
        >
          <FormControl style={{ marginTop: 0 }} error={!!errors?.fromDate}>
            <Controller
              name="fromDate"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    disabled
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id="fromDate" />
                      </span>
                    }
                    value={field.value}
                    onChange={(date) =>
                      field.onChange(moment(date).format("YYYY-MM-DD"))
                    }
                    selected={field.value}
                    center
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          style: {
                            fontSize: 12,
                            marginTop: 3,
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
            <FormHelperText>
              {errors?.fromDate ? errors?.fromDate?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={6}
          lg={4}
          xl={4}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItem: "center",
          }}
        >
          <FormControl style={{ marginTop: 0 }} error={!!errors?.toDate}>
            <Controller
              control={control}
              name="toDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    disabled
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id="toDate" />
                      </span>
                    }
                    value={field.value}
                    onChange={(date) =>
                      field.onChange(moment(date).format("YYYY-MM-DD"))
                    }
                    selected={field.value}
                    center
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          style: {
                            fontSize: 12,
                            marginTop: 3,
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
            <FormHelperText>
              {errors?.toDate ? errors?.toDate?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          className={CategoryWiseChartCSS.GridItem}
        >
          <FormControl
            variant="standard"
            error={!!errors?.selectedDepartmentForChart}
          >
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="departmentName" />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={!watch("searchButtonInputState")}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="departmentName" />}
                >
                  {departments &&
                    departments.map((department, index) => (
                      <MenuItem key={index} value={department?.id}>
                        {language == "en"
                          ? department?.departmentEn
                          : department?.departmentMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="selectedDepartmentForChart"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.selectedDepartmentForChart
                ? errors?.selectedDepartmentForChart?.message
                : null}
            </FormHelperText>
          </FormControl>
        </Grid>
      </Grid>

      {/** Chart Start  */}
      <div className={CategoryWiseChartCSS.ChartMainDiv}>
        <BarChart
          width={desiredBarWidth * numRecords}
          height={400}
          data={dataWithColors}
          margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
        >
          <Text
            x={50} // Adjust the x and y coordinates to position the title
            y={50}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={16}
          >
            sdsd Your Chart Name
          </Text>
          <XAxis />
          <YAxis domain={yAxisDomain} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="percentage" width={desiredBarWidth}>
            {dataWithColors.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </div>
      {/** Chart End */}
      <div className={CategoryWiseChartCSS.ChartDivBelowChart}>
        {dataWithColors.map((entry, index) => (
          <div
            key={`legend-${index}`}
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "20px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: entry.color,
                marginRight: "5px",
              }}
            ></div>
            <span>{entry.departmentName}</span>
          </div>
        ))}
      </div>
      {/** Table  */}
      <div>
        <DataGrid
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 100 },
              printOptions: { disableToolbarButton: true },
              disableExport: false,
              disableToolbarButton: false,
              csvOptions: { disableToolbarButton: true },
            },
          }}
          sx={{
            backgroundColor: "white",
            m: 2,
            overflowY: "scroll",
            "& .MuiDataGrid-columnHeadersInner": {
              backgroundColor: "#556CD6",
              color: "white",
            },
            "& .MuiDataGrid-cell:hover": {
            },
          }}
          density="density"
          getRowId={(row) => row.srNo}
          autoHeight
          rows={
            CategoryWiseChartTableData != undefined &&
            CategoryWiseChartTableData != null
              ? CategoryWiseChartTableData
              : []
          }
          columns={DepartmentWiseChartColumns}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          onPageSizeChange={handlePageSizeChange}
          components={
            {
            }
          }
          title="Goshwara"
        />
      </div>
    </>
  );
};

export default CategoryWiseChart;
