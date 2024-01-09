import Head from "next/head";
import React, { useEffect, useState } from "react";
import styles from "./masters.module.css";
import URLs from "../../../URLS/urls";

// import { MenuProps, useStyles, options } from "./utils";

import {
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  ListItemText,
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

  const userToken = useGetToken();

  const [data, setData] = useState({
    totalRows: 0,
    rowsPerPageOptions: [5, 10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const [collapse, setCollapse] = useState(false);
  const [table, setTable] = useState([]);
  const [applicability, setApplicability] = useState([
    { id: 1, name: "Circle" },
    { id: 2, name: "Amenities" },
    { id: 3, name: "Bill Type" },
  ]);

  const [selected, setSelected] = useState([]);
  const [runAgain, setRunAgain] = useState(false);

  let schema = yup.object().shape({
    fromDate: yup
      .string()
      .typeError(`Please select a from date`)
      .required(`Please select a from date`),
    // toDate: yup.string().typeError(`Please select a to date`).required(`Please select a to date`),
    formulaePrefix: yup
      .string()
      .required("Please enter a prefix")
      .matches(
        /^[A-Za-z0-9\s]+$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      ),
    billType: yup
      .string()
      .required("Please enter a bill type")
      .matches(
        /^[A-Za-z0-9\s]+$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      ),
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
    setRunAgain(false);
    getTableData();
  }, [runAgain]);

  const getTableData = (pageSize = 10, pageNo = 0) => {
    axios
      .get(`${URLs.PTAXURL}/master/billType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: { pageNo, pageSize },
      })
      .then((res) => {
        setTable(
          res.data.billType.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            fromDate: j.fromDate,
            toDate: j.toDate,
            formulaePrefix: j.formulaePrefix,
            formulaeForCalculation: j.formulaeForCalculation,
            calculationDate: j.calculationDate,
            fromDateForCalculation: j.fromDateForCalculation,
            toDateForCalculation: j.toDateForCalculation,
            applicabilityOn: j.applicabilityOn ?? ["Bill Type", "Amenities"],
            remark: j.remark,
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

      field: "formulaeForCalculation",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="formulaeForCalculation" />,
      width: 180,
    },
    {
      headerClassName: "cellColor",

      field: "calculationDate",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="calculationDate" />,
      width: 180,
    },
    {
      headerClassName: "cellColor",

      field: "fromDateForCalculation",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="fromDateForCalculation" />,
      width: 180,
    },
    {
      headerClassName: "cellColor",

      field: "toDateForCalculation",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="toDateForCalculation" />,
      width: 180,
    },
    {
      headerClassName: "cellColor",

      field: "applicabilityOn",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="applicabilityOn" />,
      width: 180,

      renderCell: (params) => {
        return <>{params.row.applicabilityOn.join(", ")}</>;
      },
    },

    {
      headerClassName: "cellColor",

      field: "remark",
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
                  remark: params.row.remark,
                  formulaePrefix: params.row.formulaePrefix,
                  billType: params.row.billTypeEn,
                  // billTypeMr: params.row.billTypeMr,
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
            `${URLs.PTAXURL}/master/billType/save`,
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
        `${URLs.PTAXURL}/master/billType/save`,
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
          fromDate: null,
          toDate: null,
          billType: "",
          formulaePrefix: "",
          remark: "",
        });
        setCollapse(false);
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));
  };

  //   //   const classes = useStyles();
  //   const [selected, setSelected] = useState([]);
  //   //   const isAllSelected = options.length > 0 && selected.length === options.length;

  //   const handleChange = (event) => {

  //     const value = event.target.value;
  //     if (value[value.length - 1] === "all") {
  //       setSelected(selected.length === options.length ? [] : options);
  //     } else {
  //       setSelected(value);
  //     }
  //   };

  return (
    <>
      <Head>
        <title>Formulae Master</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>
          <FormattedLabel id="formulaeMaster" />
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
                  label={<FormattedLabel id="formulaePrefix" />}
                  variant="standard"
                  {...register("formulaePrefix")}
                  InputLabelProps={{
                    shrink: watch("formulaePrefix") ? true : false,
                  }}
                  error={!!errors.formulaePrefix}
                  helperText={
                    errors?.formulaePrefix
                      ? errors.formulaePrefix.message
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
                <TextField
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="formulaeForCalculation" />}
                  variant="standard"
                  {...register("formulaeForCalculation")}
                  InputLabelProps={{
                    shrink: watch("formulaeForCalculation") ? true : false,
                  }}
                  error={!!errors.formulaeForCalculation}
                  helperText={
                    errors?.formulaeForCalculation
                      ? errors.formulaeForCalculation.message
                      : null
                  }
                />
                <FormControl error={!!errors.calculationDate}>
                  <Controller
                    control={control}
                    name="calculationDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          inputFormat="dd/MM/yyyy"
                          label={<FormattedLabel id="calculationDate" />}
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
                              error={!!errors.calculationDate}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {errors?.calculationDate
                      ? errors.calculationDate.message
                      : null}
                  </FormHelperText>
                </FormControl>

                <FormControl error={!!errors.fromDateForCalculation}>
                  <Controller
                    control={control}
                    name="fromDateForCalculation"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          inputFormat="dd/MM/yyyy"
                          label={<FormattedLabel id="fromDateForCalculation" />}
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
                              error={!!errors.fromDateForCalculation}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {errors?.fromDateForCalculation
                      ? errors.fromDateForCalculation.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </div>

              <div className={styles.row}>
                <FormControl error={!!errors.toDateForCalculation}>
                  <Controller
                    control={control}
                    name="toDateForCalculation"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          inputFormat="dd/MM/yyyy"
                          label={<FormattedLabel id="toDateForCalculation" />}
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
                              error={!!errors.toDateForCalculation}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {errors?.toDateForCalculation
                      ? errors.toDateForCalculation.message
                      : null}
                  </FormHelperText>
                </FormControl>

                <FormControl
                  variant="standard"
                  error={!!errors.applicabilityOn}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="applicabilityOn" required />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: "250px" }}
                        multiple
                        value={selected}
                        renderValue={(val) => {
                          return val.map((obj) => obj.name).join(", ");
                        }}
                        onChange={(value) => {
                          console.log(selected);
                          setSelected(value.target.value);
                        }}
                        label="applicabilityOn"
                      >
                        {applicability.map((obj) => (
                          <MenuItem key={obj.id} value={obj}>
                            <Checkbox
                              checked={
                                selected.findIndex(
                                  (item) => item.name === obj.name
                                ) >= 0
                              }
                            />
                            <ListItemText primary={obj.name} />
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                    name="applicabilityOn"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.applicabilityOn
                      ? errors.applicabilityOn.message
                      : null}
                  </FormHelperText>
                </FormControl>

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
                      billType: "",
                      formulaePrefix: "",
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
                      fromDate: null,
                      toDate: null,
                      billType: "",
                      formulaePrefix: "",
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
