import Head from "next/head";
import React, { useEffect, useState } from "react";
import styles from "./masters.module.css";
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
  const [runAgain, setRunAgain] = useState(false);

  let schema = yup.object().shape({
    fromDate: yup
      .string()
      .typeError(`Please select a from date`)
      .required(`Please select a from date`),
    // toDate: yup
    //   .string()
    //   .typeError(`Please select a to date`)
    //   .required(`Please select a to date`),
    businessTypePrefix: yup
      .string()
      .required("Please enter a prefix")
      .matches(
        /^[A-Za-z0-9\s]+$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      ),
    businessType: yup
      .string()
      .required("Please enter a business type")
      .matches(
        /^[A-Za-z0-9\s]+$/,
        "Must be only english characters / फक्त इंग्लिश शब्द "
      ),
    subBusinessType: yup
      .string()
      .required("Please enter a sub-business type")
      .matches(
        /^[A-Za-z0-9\s-]+$/,
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
      .get(`${URLs.PTAXURL}/master/businessType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: { pageNo, pageSize },
      })
      .then((res) => {
        setTable(
          res.data.businessType.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            fromDate: j.fromDate,
            toDate: j.toDate,
            remark: j.remark,
            businessTypePrefix: j.businessTypePrefix,
            businessTypeEn: j.businessType,
            // businessTypeMr: j.businessTypeMr,
            subBusinessType: j.subBusinessType,
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
      width: 130,
    },
    {
      headerClassName: "cellColor",

      field: "toDate",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="toDate" />,
      width: 130,
    },
    {
      headerClassName: "cellColor",

      field: "businessTypeEn",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="businessType" />,
      width: 200,
    },
    {
      headerClassName: "cellColor",

      field: "subBusinessType",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="subBusinessType" />,
      width: 220,
    },

    {
      headerClassName: "cellColor",

      field: "remark",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="remark" />,
      minWidth: 220,
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
                  businessTypePrefix: params.row.businessTypePrefix,
                  businessType: params.row.businessTypeEn,
                  subBusinessType: params.row.subBusinessType,
                  // businessTypeMr: params.row.businessTypeMr,
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
            `${URLs.PTAXURL}/master/businessType/save`,
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
        `${URLs.PTAXURL}/master/businessType/save`,
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
          businessType: "",
          businessTypePrefix: "",
          remark: "",
        });
        setCollapse(false);
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));
  };

  return (
    <>
      <Head>
        <title>Business Type Master</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>
          <FormattedLabel id="businessType" />
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
                  label={<FormattedLabel id="businessPrefix" />}
                  variant="standard"
                  {...register("businessTypePrefix")}
                  InputLabelProps={{
                    shrink: watch("businessTypePrefix") ? true : false,
                  }}
                  error={!!errors.businessTypePrefix}
                  helperText={
                    errors?.businessTypePrefix
                      ? errors.businessTypePrefix.message
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
                            // console.log("from date: ", moment(date).format("YYYY-MM-DD"));
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
                  label={<FormattedLabel id="businessType" />}
                  variant="standard"
                  {...register("businessType")}
                  InputLabelProps={{
                    shrink: watch("businessType") ? true : false,
                  }}
                  error={!!errors.businessType}
                  helperText={
                    errors?.businessType ? errors.businessType.message : null
                  }
                />
                <TextField
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="subBusinessType" />}
                  variant="standard"
                  {...register("subBusinessType")}
                  error={!!errors.subBusinessType}
                  helperText={
                    errors?.subBusinessType
                      ? errors.subBusinessType.message
                      : null
                  }
                />
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
                      businessType: "",
                      subBusinessType: "",
                      businessTypePrefix: "",
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
                      businessType: "",
                      subBusinessType: "",
                      businessTypePrefix: "",
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