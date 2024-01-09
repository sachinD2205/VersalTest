import Head from "next/head";
import React, { useEffect, useState } from "react";
import styles from "./masters.module.css";
import URLs from "../../../URLS/urls";

import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
import { catchExceptionHandlingMethod } from "../../../util/util";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";

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
  const [taxName, setTaxName] = useState([
    { id: 1, taxNameEn: "", taxNameMr: "" },
  ]);
  const [gatName, setGatName] = useState([
    { id: 1, gatNameEn: "", gatNameMr: "" },
  ]);
  const [usageType, setUsageType] = useState([
    { id: 1, usageTypeEn: "", usageTypeMr: "" },
  ]);
  const [propertyType, setPropertyType] = useState([
    { id: 1, propertyTypeEn: "", propertyTypeMr: "" },
  ]);

  const userToken = useGetToken();

  let schema = yup.object().shape({
    fromDate: yup
      .string()
      .typeError(`Please select a from date`)
      .required(`Please select a from date`),
    // toDate: yup.string().typeError(`Please select a to date`).required(`Please select a to date`),
    taxRateChartPrefix: yup
      .string()
      .required("Please enter a prefix")
      .matches(
        /^[A-Za-z0-9\s]+$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      ),
    percentage: yup.number().required("Please enter a percentage"),
    remark: yup
      .string()
      .required("Please enter a remark")
      .matches(
        /^[A-Za-z0-9\s]+$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
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
    //Get Gat Names
    axios
      .get(`${URLs.CFCURL}/master/gatMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) =>
        setGatName(
          res.data.gatMaster.map((obj) => ({
            id: obj.id,
            gatNameEn: obj.gatNameEn,
            gatNameMr: obj.gatNameMr,
          }))
        )
      )
      .catch((error) => catchExceptionHandlingMethod(error, language));

    //Get Tax Names
    axios
      .get(`${URLs.PTAXURL}/master/taxName/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) =>
        setTaxName(
          res.data.taxName.map((obj) => ({
            id: obj.id,
            taxNameEn: obj.taxName,
            taxNameMr: obj.taxNameMr,
          }))
        )
      )
      .catch((error) => catchExceptionHandlingMethod(error, language));

    //Get Usage Types
    axios
      .get(`${URLs.PTAXURL}/master/usageType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) =>
        setUsageType(
          res.data.usageType.map((obj) => ({
            id: obj.id,
            usageTypeEn: obj.usageType,
            usageTypeMr: obj.usageTypeMr,
          }))
        )
      )
      .catch((error) => catchExceptionHandlingMethod(error, language));

    //Get Property Types
    axios
      .get(`${URLs.PTAXURL}/master/propertyType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) =>
        setPropertyType(
          res.data.propertyType.map((obj) => ({
            id: obj.id,
            propertyTypeEn: obj.propertyType,
            propertyTypeMr: obj.propertyTypeMr,
          }))
        )
      )
      .catch((error) => catchExceptionHandlingMethod(error, language));
  }, []);

  useEffect(() => {
    setRunAgain(false);
    getTableData();
  }, [taxName, runAgain]);

  const getTableData = (pageSize = 10, pageNo = 0) => {
    axios
      .get(`${URLs.PTAXURL}/master/taxRateChartMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: { pageNo, pageSize },
      })
      .then((res) => {
        setTable(
          res.data.taxRateChart.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            fromDate: j.fromDate,
            toDate: j.toDate,
            remark: j.remark,
            taxRateChartPrefix: j.taxRateChartPrefix,
            taxName: j.taxName,
            usageType: j.usageType,
            propertyType: j.propertyType,
            taxNameEn: taxName.find((obj) => obj.id == j.taxName)?.taxNameEn,
            taxNameMr: taxName.find((obj) => obj.id == j.taxName)?.taxNameMr,
            gatNameEn: gatName.find((obj) => obj.id == j.gat)?.gatNameEn,
            gatNameMr: gatName.find((obj) => obj.id == j.gat)?.gatNameMr,
            usageTypeEn: usageType.find((obj) => obj.id == j.usageType)
              ?.usageTypeEn,
            usageTypeMr: usageType.find((obj) => obj.id == j.usageType)
              ?.usageTypeMr,
            propertyTypeEn: propertyType.find((obj) => obj.id == j.propertyType)
              ?.propertyTypeEn,
            propertyTypeMr: propertyType.find((obj) => obj.id == j.propertyType)
              ?.propertyTypeMr,
            rate: j.rate,
            percentage: j.percentage,
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
      .catch((error) => catchExceptionHandlingMethod(error, language));

    // .catch((error) => sweetAlert("Error!", "Something went wrong", "error"));
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

      field: language == "en" ? "taxNameEn" : "taxNameMr",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="taxName" />,
      minWidth: 200,
      flex: 1,
    },
    {
      headerClassName: "cellColor",

      field: language == "en" ? "gatNameEn" : "gatNameMr",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="gatName" />,
      minWidth: 200,
      flex: 1,
    },
    // {
    //   headerClassName: "cellColor",

    //   field: language == "en" ? "dependsOnEn" : "dependsOnMr",
    //   align: "center",
    //   headerAlign: "center",
    //   headerName: <FormattedLabel id="dependsOn" />,
    //   width: 180,
    // },

    {
      headerClassName: "cellColor",

      field: "percentage",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="percentage" />,
      width: 100,
    },
    {
      headerClassName: "cellColor",

      field: "status",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="status" />,
      width: 120,
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
                  taxRateChartPrefix: params.row.taxRateChartPrefix,
                  percentage: params.row.percentage,
                  taxName: params.row.taxName,
                  rate: params.row.rate,
                  gat: params.row.gat,
                  usageType: params.row.usageType,
                  propertyType: params.row.propertyType,
                  remark: params.row.remark,
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
          .post(
            `${URLs.PTAXURL}/master/taxRateChartMaster/save`,
            {
              ...rowData,
              activeFlag: flag == "Y" ? "N" : "Y",
            },
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
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
          .catch((error) => catchExceptionHandlingMethod(error, language));
      }
    });
  };

  const finalSubmit = (data) => {
    axios
      .post(
        `${URLs.PTAXURL}/master/taxRateChartMaster/save`,
        {
          ...data,
          activeFlag: "Y",
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        data.id
          ? sweetAlert("Success", "Data successfully updated", "success")
          : sweetAlert("Success", "Data successfully saved", "success");
        setRunAgain(true);
        reset({
          id: null,
          taxRateChartPrefix: "",
          fromDate: null,
          toDate: null,
          taxName: "",
          gat: "",
          percentage: "",
          rate: "",
          usageType: "",
          propertyType: "",
          remark: "",
        });
        setCollapse(false);
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));
  };

  return (
    <>
      <Head>
        <title>Tax Rate Chart Master</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>
          <FormattedLabel id="taxRateChartMaster" />
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
                  label={<FormattedLabel id="taxRateChartPrefix" />}
                  variant="standard"
                  {...register("taxRateChartPrefix")}
                  InputLabelProps={{
                    shrink: watch("taxRateChartPrefix") ? true : false,
                  }}
                  error={!!errors.taxRateChartPrefix}
                  helperText={
                    errors?.taxRateChartPrefix
                      ? errors.taxRateChartPrefix.message
                      : null
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
                <FormControl variant="standard" error={!!errors.taxName}>
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="taxName" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: "250px" }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="taxName"
                      >
                        {taxName &&
                          taxName.map((obj, i) => (
                            <MenuItem key={i} value={obj.id}>
                              {language == "en" ? obj.taxNameEn : obj.taxNameMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="taxName"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.taxName ? errors.taxName.message : null}
                  </FormHelperText>
                </FormControl>

                <FormControl variant="standard" error={!!errors.gat}>
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="gatName" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: "250px" }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="gat"
                      >
                        {gatName &&
                          gatName.map((obj, i) => (
                            <MenuItem key={i} value={obj.id}>
                              {language == "en" ? obj.gatNameEn : obj.gatNameMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="gat"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.gat ? errors.gat.message : null}
                  </FormHelperText>
                </FormControl>
                <TextField
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="percentage" />}
                  variant="standard"
                  {...register("percentage")}
                  InputLabelProps={{
                    shrink: watch("percentage") ? true : false,
                  }}
                  error={!!errors.percentage}
                  helperText={
                    errors?.percentage ? errors.percentage.message : null
                  }
                />
              </div>
              <div className={styles.row}>
                <TextField
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="rate" />}
                  variant="standard"
                  {...register("rate")}
                  InputLabelProps={{
                    shrink: watch("rate") ? true : false,
                  }}
                  error={!!errors.rate}
                  helperText={errors?.rate ? errors.rate.message : null}
                />
                <FormControl variant="standard" error={!!errors.usageType}>
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="usageType" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: "250px" }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="usageType"
                      >
                        {usageType &&
                          usageType.map((obj, i) => (
                            <MenuItem key={i} value={obj.id}>
                              {language == "en"
                                ? obj.usageTypeEn
                                : obj.usageTypeMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="usageType"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.usageType ? errors.usageType.message : null}
                  </FormHelperText>
                </FormControl>

                <FormControl variant="standard" error={!!errors.propertyType}>
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="propertyType" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: "250px" }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="propertyType"
                      >
                        {propertyType &&
                          propertyType.map((obj, i) => (
                            <MenuItem key={i} value={obj.id}>
                              {language == "en"
                                ? obj.propertyTypeEn
                                : obj.propertyTypeMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="propertyType"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.propertyType ? errors.propertyType.message : null}
                  </FormHelperText>
                </FormControl>
              </div>

              <div className={styles.row}>
                <TextField
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="remark" />}
                  variant="standard"
                  {...register("remark")}
                  InputLabelProps={{
                    shrink: watch("remark") ? true : false,
                  }}
                  error={!!errors.remark}
                  helperText={errors?.remark ? errors.remark.message : null}
                />
                <div style={{ width: "250px" }}></div>
                <div style={{ width: "250px" }}></div>
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
                      taxRateChartPrefix: "",
                      fromDate: null,
                      toDate: null,
                      taxName: "",
                      gat: "",
                      percentage: "",
                      rate: "",
                      usageType: "",
                      propertyType: "",
                      remark: "",
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
                      id: null,
                      taxRateChartPrefix: "",
                      fromDate: null,
                      toDate: null,
                      taxName: "",
                      gat: "",
                      percentage: "",
                      rate: "",
                      usageType: "",
                      propertyType: "",
                      remark: "",
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
