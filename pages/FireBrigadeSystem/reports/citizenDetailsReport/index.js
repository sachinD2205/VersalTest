import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  FormControl,
  Grid,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  capitalize,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState, useRef } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import urls from "../../../../URLS/urls";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";
import { useReactToPrint } from "react-to-print";
import { useRouter } from "next/router";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import ReportLayout from "../../../../containers/reuseableComponents/ReportLayout";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import PrintIcon from "@mui/icons-material/Print";
// import styles from "../styles/[loader].module.css";
import style from "../../../../styles/[loader].module.css";
import * as yup from "yup";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const validationSchema = yup.object({
  toDate: yup
    .date()
    .typeError("To Date is required!")
    .required("To Date is required!"),
  fromDate: yup
    .date()
    .typeError("From Date is required!")
    .required("From Date is required!"),
});

const Index = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      selectedChildOrParent: false,
    },
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    getValues,
    formState: { errors },
  } = methods;

  const language = useSelector((state) => state?.labels.language);
  const userToken = useGetToken();

  const router = useRouter();

  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [vardiTypes, setVardiTypes] = useState([]);
  const [btnSaveText, setBtnSaveText] = useState([]);
  const [nocList, setNocList] = useState([]);

  const [disabledInputState, setDisabledInputState] = useState(false);

  function scrollDown() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  useEffect(() => {
    setDisabledInputState(false);
  }, [watch("fromDate"), watch("toDate")]);

  // const [isOpenCollapse, setIsOpenCollapse] = useState(false);

  const dataGridRef = useRef(null);

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [serviceNames, setServiceNames] = useState([]);

  // getserviceNames
  const getserviceNames = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        console.log("ffffff", r?.data?.service);
        // setServiceNames(
        //   r.data.service.map((row) => ({
        //     id: row.id,
        //     serviceName: row.serviceName,
        //     serviceNameMr: row.serviceNameMr,
        //   }))
        // );
        setServiceNames(
          r.data.service.filter((row) => {
            return row.application == 8; // For example, row.someCondition should be true
          })
        );
      });
  };

  const getNocData = () => {
    axios
      .get(`${urls.FbsURL}/typeOfBusinessMaster/getTypeOfBusinessMasterData`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setNocList(res.data);
        console.log("Bdata", res.data);
      });
  };

  // get Vardi Types
  const getVardiTypes = () => {
    axios
      .get(`${urls.FbsURL}/vardiTypeMaster/getVardiTypeMasterData`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        let vardi = {};
        r.data.map((r) => (vardi[r.id] = r.vardiName));
        setVardiTypes(vardi);
      });
  };

  useEffect(() => {
    getVardiTypes();
    getData();
    getNocData();
    getserviceNames();
  }, []);

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
    });
    setDisabledInputState(false);
  };

  const resetValuesCancell = {
    fromDate: null,
    toDate: null,
    nocType: "",
  };

  const [load, setLoad] = useState();

  const handleLoad = () => {
    setLoad(false);
  };

  console.log("date", getValues("toDate"));
  // Get Table - Data
  const getData = () => {
    setLoad(true);
    setDisabledInputState(true);
    axios
      .get(
        `${urls.FbsURL}/reports/getCitizenDetailsReport?&fromDate=${moment(
          getValues("fromDate")
        ).format("YYYY-MM-DD")}&toDate=${moment(getValues("toDate")).format(
          "YYYY-MM-DD"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        setLoad(false);
        setDisabledInputState(false);

        if (res?.status === 200) {
          scrollDown();
          if (res?.data?.bussiness && res.data.bussiness.length > 0) {
            setDisabledInputState(true);
            // setIsOpenCollapse(true);
            if (dataGridRef.current) {
              dataGridRef.current.scrollIntoView({ behavior: "smooth" });
            }
            // if (accordionRef.current) {
            //   accordionRef.current.scrollIntoView({ behavior: "smooth" });
            // }
            console.log("dattaaa", res.data, vardiTypes);
            setDataSource(
              res?.data?.bussiness?.map((r, i) => ({
                serialNo: i + 1,
                nameOfNoc: "Business Noc",
                nocType: r?.nocType ? r?.nocType : "--",
                applicantName:
                  r?.applicantName +
                  " " +
                  r?.applicantMiddleName +
                  " " +
                  r?.applicantLastName,
                applicantNameMr:
                  r?.applicantNameMr +
                  " " +
                  r?.applicantMiddleNameMr +
                  " " +
                  r?.applicantLastNameMr,
                applicationDate: moment(r?.applicationDate).format(
                  "DD-MM-YYYY"
                ),
                nocEndDate: r?.nocEndDate,
                applicationNo: r?.applicationNo,
                typeOfBusinessEng: r?.typeOfBusinessEng,
                typeOfBusinessMr: r?.typeOfBusinessMr,
                nocIssueDate: r?.nocIssueDate
                  ? moment(r?.nocIssueDate).format("DD-MM-YYYY")
                  : "--",
              }))
            );
          } else {
            setDisabledInputState(false);
            sweetAlert({
              title: "Data Not Available",
              text: "Data is not available up to this date \nplease select another date.",
              icon: "warning",
              buttons: ["Cancel", "Ok"],
            });
          }
        }
        setLoad(false);
        setDisabledInputState(false);
      })
      .catch((err) => {
        setLoad(false);
        setDisabledInputState(false);
      });
  };

  const onSubmitForm = (fromData) => {
    getData();
  };

  // define colums table
  const columns = [
    {
      headerName: <FormattedLabel id="srNoF" />,
      field: "serialNo",
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
    {
      headerName: <FormattedLabel id="applicationNo" />,
      field: "applicationNo",
      width: 210,
    },
    {
      headerName: <FormattedLabel id="applicantName" />,
      field: language ? "applicantName" : "applicantNameMr",
      width: 200,
    },
    {
      headerName: <FormattedLabel id="nameOfNoc" />,
      field: "nameOfNoc",
      width: 200,
    },
    {
      headerName: <FormattedLabel id="businessName" />,
      field: language == "en" ? "typeOfBusinessEng" : "typeOfBusinessMr",
      width: 270,
    },
    {
      headerName: <FormattedLabel id="nocType" />,
      field: "nocType",
      flex: 1,
    },

    {
      headerName: <FormattedLabel id="applicationDate" />,
      field: "applicationDate",
      flex: 1,
    },
    {
      headerName: <FormattedLabel id="sanctionDate" />,
      field: "nocIssueDate",
      flex: 1,
    },
  ];

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <Box style={{ display: "flex" }}>
            <Box className={styles.tableHead}>
              <Box className={styles.h1Tag}>
                {<FormattedLabel id="citizenDetailsReport" />}
              </Box>
            </Box>
          </Box>
          <Paper sx={{ padding: 2, backgroundColor: "#F2F3F4" }}>
            <Grid
              container
              columns={{ xs: 4, sm: 8, md: 12 }}
              className={styles.feildres}
              spacing={2}
            >
              <Grid item xs={2.5} className={styles.feildres}>
                <FormControl
                  // error={!!errors.shiftStartTime}

                  sx={{ width: "100%" }}
                >
                  <Controller
                    control={control}
                    name="fromDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat="DD/MM/YYYY"
                          label={<FormattedLabel id="fromDate" />}
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                          selected={field.value}
                          center
                          renderInput={(params) => (
                            <TextField
                              sx={{ backgroundColor: "white" }}
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
                </FormControl>
              </Grid>
              <Grid item xs={2.5} className={styles.feildres}>
                <FormControl
                  // error={!!errors.shiftStartTime}
                  sx={{ width: "100%" }}
                >
                  <Controller
                    control={control}
                    name="toDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          minDate={watch("fromDate")}
                          inputFormat="DD/MM/YYYY"
                          label={<FormattedLabel id="toDate" />}
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                          selected={field.value}
                          center
                          renderInput={(params) => (
                            <TextField
                              sx={{ backgroundColor: "white" }}
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
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <br />

            <Grid
              container
              columns={{ xs: 4, sm: 8, md: 12 }}
              className={styles.feildres}
            >
              <Grid item xs={4.5} className={styles.feildres}></Grid>

              <Grid item xs={1} className={styles.feildres}>
                <Button
                  type="submit"
                  disabled={disabledInputState}
                  // onClick={getData}
                  variant="outlined"
                  sx={{
                    "&:hover": {
                      backgroundColor: "#498FD5",
                      color: "white",
                    },
                    textTransform: "capitalize",
                  }}
                  size="small"
                >
                  Search
                  <SearchIcon
                    style={{ fontSize: "23px", paddingLeft: "3px" }}
                  />
                </Button>
              </Grid>
              <Grid item xs={1} className={styles.feildres}>
                <Button
                  size="small"
                  onClick={handlePrint}
                  variant="outlined"
                  sx={{
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#5F82CD",
                      color: "white",
                    },
                  }}
                >
                  {language === "en" ? "Print" : "प्रत काढा"}
                  <PrintIcon
                    style={{
                      fontSize: "23px",
                      paddingLeft: "7px",
                    }}
                  />
                </Button>
              </Grid>
              <Grid item xs={1} className={styles.feildres}>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#498FD5",
                      color: "white",
                    },
                  }}
                  endIcon={<ClearIcon />}
                  onClick={() => cancellButton()}
                >
                  {<FormattedLabel id="clear" />}
                </Button>
              </Grid>
              <Grid item xs={4.5} className={styles.feildres}></Grid>
            </Grid>
          </Paper>
        </form>
      </FormProvider>
      {/* <Box style={{ height: 400, width: "100%", marginTop: "2rem" }}>
        <DataGrid
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          components={{ Toolbar: GridToolbar }}
          autoHeight
          density='compact'
          sx={{
            backgroundColor: "white",
            boxShadow: 2,
            // borderColor: "primary.light",
            // "& .MuiDataGrid-cell:hover": {
            //   transform: "scale(1.1)",
            // },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#E1FDFF",
            },
            "& .MuiDataGrid-columnHeadersInner": {
              // backgroundColor: "#87E9F7",
              backgroundColor: "#2E86C1",
              color: "white",
            },
          }}
          rows={dataSource}
          columns={columns}
          pageSize={7}
          rowsPerPageOptions={[7]}
        />
      </Box> */}
      <br />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={load}
        onClick={handleLoad}
      >
        {/* Loading.... */}
        {/* <CircularProgress color='inherit' /> */}
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 50,
            padding: 0.6,
          }}
        >
          <img className={style.loader} src="/NewLoader.gif" alt="" />
        </Box>
      </Backdrop>

      <Box sx={{ backgroundColor: "white" }} ref={dataGridRef}>
        <ReportLayout
          componentRef={componentRef}
          rows={dataSource ? dataSource : []}
          columns={columns}
        />
      </Box>
    </>
  );
};

export default Index;
