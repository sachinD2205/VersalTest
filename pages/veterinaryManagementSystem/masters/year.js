import Head from "next/head";
import React, { useEffect, useState } from "react";
import styles from "./vetMasters.module.css";
import URLs from "../../../URLS/urls";

import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  Paper,
  Slide,
  TextField,
} from "@mui/material";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useSelector } from "react-redux";
import {
  Add,
  Clear,
  Edit,
  ExitToApp,
  Save,
  ToggleOff,
  ToggleOn,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import sweetAlert from "sweetalert";
import moment from "moment";

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language);

  const [data, setData] = useState({
    totalRows: 0,
    rowsPerPageOptions: [5, 10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const [collapse, setCollapse] = useState(false);
  const [table, setTable] = useState([]);
  const [runAgain, setRunAgain] = useState(false);

  let schema = yup.object().shape({
    fromDate: yup
      .string()
      .typeError(
        language === "en" ? "Please select a from date" : "कृपया तारीख निवडा"
      )
      .required(
        language === "en" ? "Please select a from date" : "कृपया तारीख निवडा"
      ),
    // toDate: yup.string().typeError(`Please select a to date`).required(`Please select a to date`),
    yearPrefix: yup
      .string()
      .required(
        language === "en"
          ? "Please enter a prefix"
          : "कृपया उपसर्ग प्रविष्ट करा"
      )
      .matches(
        /^[A-Za-z0-9\s]+$/,
        language === "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द"
      ),
    year: yup
      .string()
      .required("Please enter year in english")
      .matches(
        /^[A-Za-z0-9\s]+$/,
        language === "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द"
      ),
    yearMr: yup
      .string()
      .required(
        language === "en"
          ? "Please enter year in marathi"
          : "कृपया वर्ष मराठीत टाका"
      )
      .matches(
        /^[A-Za-z0-9\s]+$/,
        language === "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द"
      ),
    remarks: yup
      .string()
      .required(
        language === "en"
          ? "Please enter a remark"
          : "कृपया एक टिप्पणी प्रविष्ट करा"
      )
      .matches(
        /^[A-Za-z0-9\s]+$/,
        language === "en"
          ? "Must be only english characters"
          : "फक्त इंग्लिश शब्द"
      ),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors: errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setRunAgain(false);
    getTableData();
  }, [runAgain]);

  const getTableData = (pageSize = 10, pageNo = 0) => {
    axios
      .get(
        `${URLs.CFCURL}/master/year/getAll?pageNo=${pageNo}&pageSize=${pageSize}`
      )
      .then((res) => {
        setTable(
          res.data.year.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            fromDate: j.fromDate,
            toDate: j.toDate,
            remarks: j.remarks,
            yearPrefix: j.yearPrefix,
            yearEn: j.year,
            yearMr: j.yearMr,
            activeFlag: j.activeFlag,
            status: j.activeFlag == "Y" ? "Active" : "Inactive",
          }))
        );

        setData({
          ...data,
          totalRows: res.data.totalElements,
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      })
      .catch((error) => sweetAlert("Error!", "Something went wrong", "error"));
  };

  const columns = [
    {
      headerClassName: "cellColor",

      field: "srNo",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
    },
    {
      headerClassName: "cellColor",

      field: "fromDate",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="fromDate" />,
      width: 150,
    },
    {
      headerClassName: "cellColor",

      field: "toDate",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="toDate" />,
      width: 150,
    },
    {
      headerClassName: "cellColor",

      field: language == "en" ? "yearEn" : "yearMr",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="year" />,
      minWidth: 250,
      flex: 1,
    },
    {
      headerClassName: "cellColor",

      field: "remarks",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="remark" />,
      minWidth: 200,
      flex: 1,
    },
    {
      headerClassName: "cellColor",

      field: "status",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="status" />,
      width: 180,
    },

    {
      headerClassName: "cellColor",

      field: "action",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="actions" />,
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              sx={{ color: "#1976d2" }}
              disabled={params.row.activeFlag == "N" ? true : false}
              onClick={() => {
                console.table({ ...params.row });
                reset({
                  id: params.row.id,
                  fromDate: params.row.fromDate,
                  toDate: params.row.toDate,
                  remarks: params.row.remarks,
                  yearPrefix: params.row.yearPrefix,
                  year: params.row.yearEn,
                  yearMr: params.row.yearMr,
                });
                setCollapse(true);
              }}
            >
              <Edit />
            </IconButton>
            <IconButton
              sx={{ color: params.row.activeFlag == "Y" ? "green" : "red" }}
              onClick={() => deleteById(params.row, params.row.activeFlag)}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOn
                  sx={{
                    fontSize: 30,
                  }}
                />
              ) : (
                <ToggleOff
                  sx={{
                    fontSize: 30,
                  }}
                />
              )}
            </IconButton>
          </>
        );
      },
    },
  ];

  const deleteById = (rowData, flag) => {
    sweetAlert({
      title: "Confirmation",
      text: "Do you really want to change the status of this record ?",
      icon: "warning",
      buttons: ["No", "Yes"],
    }).then((ok) => {
      if (ok) {
        axios
          .post(`${URLs.CFCURL}/master/year/save`, {
            ...rowData,
            activeFlag: flag == "Y" ? "N" : "Y",
          })
          .then((res) => {
            sweetAlert(
              "Success",
              flag == "Y"
                ? "Record successfully deactivated"
                : "Record successfully activated",
              "success"
            );
            setRunAgain(true);
          })
          .catch((error) =>
            sweetAlert("Error!", "Something went wrong", "error")
          );
      }
    });
  };

  const finalSubmit = (data) => {
    axios
      .post(`${URLs.CFCURL}/master/year/save`, {
        ...data,
        activeFlag: "Y",
      })
      .then((res) => {
        data.id
          ? sweetAlert("Success", "Data successfully updated", "success")
          : sweetAlert("Success", "Data successfully saved", "success");
        setRunAgain(true);
        reset({
          id: null,
          fromDate: null,
          toDate: null,
          year: "",
          yearMr: "",
          yearPrefix: "",
          remarks: "",
        });
        setCollapse(false);
      })
      .catch((error) => sweetAlert("Error!", "Something went wrong", "error"));
  };

  return (
    <>
      <Head>
        <title>Year Master</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>
          <FormattedLabel id="yearMaster" />
        </div>
        <div className={styles.row} style={{ justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            endIcon={<Add />}
            onClick={() => setCollapse(!collapse)}
          >
            <FormattedLabel id="add" />
          </Button>
        </div>
        <form onSubmit={handleSubmit(finalSubmit)}>
          <Slide direction="down" in={collapse} mountOnEnter unmountOnExit>
            <div>
              <div className={styles.row}>
                <TextField
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="yearPrefix" />}
                  variant="standard"
                  {...register("yearPrefix")}
                  InputLabelProps={{
                    shrink: watch("yearPrefix") ? true : false,
                  }}
                  error={!!errors.yearPrefix}
                  helperText={
                    errors?.yearPrefix ? errors.yearPrefix.message : null
                  }
                />

                <FormControl error={!!errors.fromDate}>
                  <Controller
                    control={control}
                    name="fromDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          inputFormat="dd/MM/yyyy"
                          label={<FormattedLabel id="fromDate" />}
                          value={field.value}
                          onChange={(date) => {
                            console.log(
                              "from date: ",
                              moment(date).format("YYYY-MM-DD")
                            );
                            field.onChange(moment(date).format("YYYY-MM-DD"));
                          }}
                          renderInput={(params) => (
                            <TextField
                              sx={{ width: "250px" }}
                              {...params}
                              size="small"
                              fullWidth
                              variant="standard"
                              error={!!errors.fromDate}
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
                <FormControl error={!!errors.toDate}>
                  <Controller
                    control={control}
                    name="toDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          inputFormat="dd/MM/yyyy"
                          label={<FormattedLabel id="toDate" />}
                          value={field.value}
                          onChange={(date) => {
                            console.log(
                              "to date: ",
                              moment(date).format("YYYY-MM-DD")
                            );
                            field.onChange(moment(date).format("YYYY-MM-DD"));
                          }}
                          renderInput={(params) => (
                            <TextField
                              sx={{ width: "250px" }}
                              {...params}
                              size="small"
                              fullWidth
                              variant="standard"
                              error={!!errors.toDate}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {errors?.toDate ? errors.toDate.message : null}
                  </FormHelperText>
                </FormControl>
              </div>

              <div className={styles.row}>
                <TextField
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="yearEn" />}
                  variant="standard"
                  {...register("year")}
                  InputLabelProps={{
                    shrink: watch("year") ? true : false,
                  }}
                  error={!!errors.year}
                  helperText={errors?.year ? errors.year.message : null}
                />
                <TextField
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="yearMr" />}
                  variant="standard"
                  {...register("yearMr")}
                  InputLabelProps={{
                    shrink: watch("yearMr") ? true : false,
                  }}
                  error={!!errors.yearMr}
                  helperText={errors?.yearMr ? errors.yearMr.message : null}
                />
                <TextField
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="remark" />}
                  variant="standard"
                  {...register("remarks")}
                  InputLabelProps={{
                    shrink: watch("remarks") ? true : false,
                  }}
                  error={!!errors.remarks}
                  helperText={errors?.remarks ? errors.remarks.message : null}
                />
                {/* <div style={{ width: '250px' }}></div> */}
              </div>

              <div className={styles.buttons}>
                <Button
                  color="success"
                  variant="contained"
                  type="submit"
                  endIcon={<Save />}
                >
                  <FormattedLabel id="save" />
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  endIcon={<Clear />}
                  onClick={() => {
                    reset((old) => ({
                      ...old,
                      fromDate: null,
                      toDate: null,
                      year: "",
                      yearMr: "",
                      yearPrefix: "",
                      remarks: "",
                    }));
                  }}
                >
                  <FormattedLabel id="clear" />
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  endIcon={<ExitToApp />}
                  onClick={() => {
                    reset({
                      fromDate: null,
                      toDate: null,
                      year: "",
                      yearMr: "",
                      yearPrefix: "",
                      remarks: "",
                    });
                    setCollapse(false);
                  }}
                >
                  <FormattedLabel id="exit" />
                </Button>
              </div>
            </div>
          </Slide>
        </form>
        <DataGrid
          autoHeight={true}
          sx={{
            marginTop: "5vh",
            width: "100%",

            "& .cellColor": {
              backgroundColor: "#1976d2",
              color: "white",
            },
          }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 0 },
              disableExport: false,
              disableToolbarButton: false,
              csvOptions: { disableToolbarButton: false },
              printOptions: { disableToolbarButton: true },
            },
          }}
          rows={table}
          //@ts-ignore
          columns={columns}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
          paginationMode="server"
          rowCount={data?.totalRows}
          rowsPerPageOptions={data?.rowsPerPageOptions}
          page={data?.page}
          pageSize={data?.pageSize}
          onPageChange={(pageNo) => {
            getTableData(data?.pageSize, pageNo);
          }}
          onPageSizeChange={(pageSize) => {
            setData({ ...data, pageSize });
            getTableData(pageSize, data?.page);
          }}
        />
      </Paper>
    </>
  );
};

export default Index;
