import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { useRouter } from "next/router";

import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputBase,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  Toolbar,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbarDensitySelector, GridToolbarFilterButton } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

// import styles from "../court/view.module.css";
import styles from "../../../styles/LegalCase_Styles/court.module.css";

// import schema from "../../../../containers/schema/LegalCaseSchema/courtSchema";
import schema from "../../../containers/schema/SlbSchema/subParameterSchema";
import sweetAlert from "sweetalert";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { GridToolbar } from "@mui/x-data-grid";
import { border } from "@mui/system";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";

import { ElevatorOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";
import urls from "../../../URLS/urls";
import { EyeFilled } from "@ant-design/icons";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const router = useRouter();

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [moduleNames, setModuleName] = useState([]);
  const [allParameterNames, setAllParameterNames] = useState([]);
  const [parameterNames, setParameterNames] = useState([]);
  let user = useSelector((state) => state.user.user);
  const language = useSelector((state) => state.labels.language);
  const [benchmarkHistory1, setBenchmarkHistory1] = useState([]);
  const [dataModule1, setDataModule1] = useState([]);
  const [paramaterKey, setParamaterKey] = useState();

  // get Parameter
  const getParameterModule1 = () => {
    axios
      .get(`${urls.SLB}/parameter/getByModuleKey?moduleKey=1`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        const data = res?.data.parameterList.map((r, i) => ({
          id: r.id,
          srNo: "B" + (i + 1),
          // name: r.name,
          parameterName: r?.parameterName,
          lastActualBenchmarkValue: parseFloat(r?.lastActualBenchmarkValue).toFixed(0),
          benchmarkValue: r?.benchmarkValue,
          lastActualBenchmarkDate: r?.lastActualBenchmarkDate,
        }));
        setDataModule1(data);
      });
    // iterate dataModule1 and copy the required parameters in series1
  };

  // get Parameter
  const getBenchmarkHistoryByParameter = (pmkey) => {
    if (paramaterKey === null) {
      return;
    }
    axios
      .get(`${urls.SLB}/benchmarkHistory/getAllByParameterId?parameterId=${paramaterKey}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        const data = res?.data.benchmarkHistoryList.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          moduleKey: r?.moduleKey,
          parameterKey: r?.parameterKey,
          parameterName: r?.parameterName,
          benchmarkValue: r?.benchmarkValue,
          calculatedBenchmarkValue: parseFloat(r?.calculatedBenchmarkValue).toFixed(0),
          benchmarkDate: r?.benchmarkDate,

          // convert bemchmarkDate to dd/mm/yyyy HH:mm:ss format
          benchmarkDateFormatted: new Date(r?.benchmarkDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }),

          entryUniqueIdentifier: r?.entryUniqueIdentifier,
        }));

        //sort data by benchmarkDate
        data.sort((a, b) => {
          return new Date(a.benchmarkDate) - new Date(b.benchmarkDate);
        });

        setBenchmarkHistory1(data);

        // Get list of unqiue parameterKey from data
        const parameterKeys = [...new Set(data.map((item) => item.parameterKey))];

        // Create separate lists for each paramaterKey from data by filtering by iterating through parameterKeys
        const series1 = parameterKeys.map((parameterKey) => {
          return {
            parameterKey: parameterKey,
            data: data
              .filter((item) => item.parameterKey === parameterKey)
              .map((item) => item.calculatedBenchmarkValue),
          };
        });
      });
    // iterate dataModule1 and copy the required parameters in series1
  };

  // Exit Button
  const exitButton = () => {
    setButtonInputState(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    moduleName: "",
    parameterName: "",
  };

  useEffect(() => {
    getParameterModule1();
  }, []);

  const columnsBenchMarkHistory = [
    {
      field: "srNo",
      headerName: "Sr.No",
      // flex:1
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "parameterName",
      headerName: "Benchmark",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "benchmarkValue",
      headerName: "Benchmark Value",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "calculatedBenchmarkValue",
      headerName: "Actual Benchmark Value",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "benchmarkDate",
      headerName: "Entry Date",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "entryUniqueIdentifier",
      headerName: "UDID",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
  ];

  const columnsModule1 = [
    {
      field: "srNo",
      headerName: "Sr.No",
      // flex:1
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "parameterName",
      headerName: "Benchmark",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "benchmarkValue",
      headerName: "Benchmark Value",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "lastActualBenchmarkValue",
      headerName: "Actual Benchmark Value",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    // add action column
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div>
            <Button
              variant="contained"
              color="primary"
              size="small"
              style={{ marginLeft: 16 }}
              onClick={() => {
                setParamaterKey(params.row.id);

                // load next set of Data
                getBenchmarkHistoryByParameter(params.row.id);
              }}
            >
              Show History
            </Button>
          </div>
        );
      },
    },
  ];

  return (
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
    >
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "10px",
          background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <h2>SLB Dashboard - History</h2>
      </Box>

      <Box
        style={{
          display: "flex",
          justifyContent: "left",
          paddingTop: "10px",
          paddingLeft: "10px",
        }}
      >
        <h2>Water Supply Management System</h2>
      </Box>

      <Divider />
      <Grid container spacing={2}>
        <Grid item sm={12} md={5}>
          <Chart
            options={{
              chart: {
                horizontal: false,
                stacked: false,
                xaxis: { categories: dataModule1.map((r) => r.parameterName) },
              },
            }}
            xaxis={{
              labels: {
                rotate: -45,
              },
            }}
            series={[
              {
                name: "Benchmark Value",
                data: dataModule1.map((r) => {
                  return {
                    x: r.srNo,
                    y: r.benchmarkValue,
                  };
                }),
              },
              {
                name: "Last Actual Benchmark Value",
                data: dataModule1.map((r) => {
                  return {
                    x: r.srNo,
                    y: r.lastActualBenchmarkValue ? r.lastActualBenchmarkValue : 0,
                  };
                }),
              },
            ]}
            type="bar"
            width={"100%"}
            height={"300px"}
          />
        </Grid>
        <Grid item sm={12} md={7}>
          <div style={{ paddingTop: "1rem" }}>
            <DataGrid
              headerName="Water"
              getRowId={(row) => row.srNo}
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
              rows={dataModule1}
              columns={columnsModule1}
            />
          </div>
        </Grid>

        <Divider />

        <Divider />

        <Grid item sm={12} md={12}>
          <Divider />
          {benchmarkHistory1 && benchmarkHistory1.length > 0 && (
            <Box
              style={{
                display: "flex",
                justifyContent: "left",
                paddingTop: "10px",
                paddingLeft: "10px",
              }}
            >
              <h2>Historical Records - Graphical</h2>
            </Box>
          )}

          <Divider />
          {benchmarkHistory1 && benchmarkHistory1.length > 0 && (
            <Chart
              options={{
                chart: {
                  stacked: false,
                  xaxis: {
                    type: "category",
                    categories: benchmarkHistory1.map((r) => (r.benchmarkDate ? r.benchmarkDate : r.id)),
                  },
                },
              }}
              series={[
                {
                  name: "Benchmark Value",
                  data: benchmarkHistory1.map((r) => {
                    return {
                      x: r.benchmarkDateFormatted ? r.benchmarkDateFormatted : r.id,
                      y: r.benchmarkValue,
                    };
                  }),
                },
                {
                  name: "Actual Benchmark Value",
                  data: benchmarkHistory1.map((r) => {
                    return {
                      x: r.benchmarkDateFormatted ? r.benchmarkDateFormatted : r.id,
                      y: r.calculatedBenchmarkValue ? r.calculatedBenchmarkValue : 0,
                    };
                  }),
                },
              ]}
              type="line"
              width={"100%"}
              height={"500px"}
            />
          )}
        </Grid>

        <Grid item sm={12} md={12}>
          <Divider />
          {benchmarkHistory1 && benchmarkHistory1.length > 0 && (
            <Box
              style={{
                display: "flex",
                justifyContent: "left",
                paddingTop: "10px",
                paddingLeft: "10px",
              }}
            >
              <h2>Historical Records - Tabular</h2>
            </Box>
          )}

          <Divider />
          {benchmarkHistory1 && benchmarkHistory1.length > 0 && (
            <div style={{ paddingTop: "1rem" }}>
              <DataGrid
                headerName="Water"
                getRowId={(row) => row.srNo}
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
                rows={benchmarkHistory1}
                columns={columnsBenchMarkHistory}
              />
            </div>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Index;
