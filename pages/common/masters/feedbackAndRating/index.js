import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  Paper,
  Rating,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/common/feedbackAndRatingSchema";
import styles from "../../../../styles/cfc/cfc.module.css";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = (props) => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {},
  });
  const {
    register,
    control,
    watch,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors },
  } = methods;

  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);

  const [load, setLoad] = useState();
  let language = useSelector((state) => state.labels.language);
  const user = useSelector((state) => {
    return state.user.user;
  });
  const token = useSelector((state) => state.user.user.token);
  const router = useRouter();
  const [serviceList, setServiceList] = useState([]);
  const [applicationList, setApplicationList] = useState([]);
  const [showForm, setShowForm] = useState(true);
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

  // Exit Button
  const exitBack = () => {
    router.back();
  };

  const handleLoad = () => {
    setLoad(false);
  };

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    // Update Form Data

    sweetAlert({
      title:
        language === "en"
          ? "Feedback And Rating"
          : "अभिप्राय आणि मानांकन श्रेणी",
      text:
        language === "en"
          ? "Do you really want to submit feedback and rating?"
          : "तुम्हाला खरोखर अभिप्राय आणि मानांकन श्रेणी सबमिट करायचे आहे का?",
      dangerMode: false,
      closeOnClickOutside: false,
      buttons: [
        language === "en" ? "No" : "नाही",
        language === "en" ? "Yes" : "होय",
      ],
    }).then((will) => {
      if (will) {
        const finalBodyForApi = {
          appId:
            router?.query?.showData &&
            JSON.parse(router?.query?.showData)?.applicationUniqueId,
          serviceId:
            router?.query?.showData &&
            JSON.parse(router?.query?.showData)?.serviceId,
          feedback: fromData?.feedbackEnt,
          rating: fromData?.ratingVal,
          userId: user?.id,
          applicationNo:
            router?.query?.showData &&
            JSON.parse(router?.query?.showData)?.applicationNumber,
        };
        console.log("fromData", fromData);
        axios
          .post(
            `${urls.CFCURL}/master/feedbackAndRating/save`,
            finalBodyForApi,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            console.log("save data", res);
            if (res.status == 200) {
              if (res.data?.errors?.length > 0) {
                res.data?.errors?.map((x) => {
                  if (x.field == "paymentType") {
                    console.log("x.code", x.code);
                    setError("paymentType", { message: x.code });
                  } else if (x.field == "paymentTypeMr") {
                    setError("paymentTypeMr", { message: x.code });
                  }
                });
              } else {
                fromData.id
                  ? sweetAlert(
                      "Updated!",
                      "Record Updated successfully !",
                      "success"
                    )
                  : sweetAlert(
                      "Saved!",
                      "Record Saved successfully !",
                      "success"
                    );
                getPaymentTypeDetails();
                setButtonInputState(false);
                setIsOpenCollapse(false);
                setEditButtonInputState(false);
                setDeleteButtonState(false);
              }
            }
          })
          ?.catch((err) => {
            console.log("err", err);
            setLoad(false);
            callCatchMethod(err, language);
          });
      }
    });
  };

  // Exit Button
  const exitButton = () => {
    reset();
    setValue("ratingVal", 0);
    setButtonInputState(false);
    setIsOpenCollapse(false);
    router.push("/dashboard");
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
    fromDate: null,
    toDate: null,
    paymentType: "",
    paymentTypeMr: "",
  };

  // Reset Values Exit
  const resetValuesExit = {};

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    console.log("api", router?.query);
    getServiceName();
    getApplicationsName();
  }, []);

  useEffect(() => {
    getPaymentTypeDetails();
  }, [serviceList, applicationList]);

  const getServiceName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/service/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          setServiceList(r.data.service);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getApplicationsName = () => {
    axios
      .get(`${urls.CFCURL}/master/application/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((r) => {
        if (r.status == 200) {
          console.log("res application", r);
          setApplicationList(r?.data?.application);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoad(false);
        callCatchMethod(err, language);
      });
  };

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // Get Table - Data
  const getPaymentTypeDetails = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    axios
      .get(`${urls.CFCURL}/master/feedbackAndRating/userFeedbackDetails`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
          appId:
            router?.query?.showData &&
            JSON.parse(router?.query?.showData)?.applicationUniqueId,
          serviceId:
            router?.query?.showData &&
            JSON.parse(router?.query?.showData)?.serviceId,
          userId: user?.id,
          applicationNo:
            router?.query?.showData &&
            JSON.parse(router?.query?.showData)?.applicationNumber,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        let result = res?.data?.feedbackAndRating;
        console.log("result", result);
        if (result?.length == 0) {
          setShowForm(true);
          //   toast("No feedback submitted yet", {
          //     type: "error",
          //   });
          //   return;
          setButtonInputState(false);
        } else {
          setShowForm(false);
          setButtonInputState(true);
        }
        let _res = result?.map((val, i) => {
          return {
            activeFlag: val?.activeFlag,
            srNo: i + 1 + _pageNo * _pageSize,
            rating:
              val?.rating == 1
                ? " * "
                : val?.rating == 2
                ? " * * "
                : val?.rating == 3
                ? " * * * "
                : val?.rating == 4
                ? " * * * * "
                : val?.rating == 5
                ? " * * * * * "
                : "",
            serviceName: serviceList.find((obj) => obj.id === val?.serviceId)
              ?.serviceName,
            id: val?.id,
            feedback: val?.feedback,
            feedbackDate: val?.submitteDateTime
              ? moment(val?.submitteDateTime).format("DD/MM/YYYY")
              : "NA",
            applicationName: applicationList.find(
              (obj) => obj.id === val?.appId
            )?.applicationNameEng,
          };
        });

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoad(false);
        callCatchMethod(err, language);
      });
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
      minWidth: 70,
      flex: 0.3,
    },
    {
      field: "feedbackDate",
      flex: 0.4,
      headerAlign: "center",
      minWidth: 120,
      headerName: <FormattedLabel id="feedbackDate" />,
    },
    {
      field: "feedback",
      headerName: <FormattedLabel id="feedback" />,
      flex: 1,
      headerAlign: "center",
      minWidth: 220,
    },
    {
      field: "applicationName",
      headerName: <FormattedLabel id="feedbackApplicationName" />,
      flex: 1,
      headerAlign: "center",
      minWidth: 220,
    },
    {
      field: "serviceName",
      headerName: <FormattedLabel id="feedbackServiceName" />,
      flex: 1,
      headerAlign: "center",
      minWidth: 220,
    },
    {
      field: "rating",
      headerName: <FormattedLabel id="rating" />,
      flex: 0.5,
      headerAlign: "center",
      minWidth: 120,
    },
  ];

  const labels = {
    1: "Poor",
    2: "Ok",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  // View
  return (
    <>
      <>
        <Box style={{ display: "flex" }}>
          <Box className={styles.tableHead} sx={{ display: "flex" }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{
                mr: 2,
                paddingLeft: "30px",
                color: "white",
              }}
              onClick={() => exitBack()}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box className={styles.h1Tag} sx={{ paddingLeft: "34%" }}>
              {<FormattedLabel id="feedbackAndRating" />}
            </Box>
          </Box>
          <Box>
            <Button
              className={styles.adbtn}
              variant="contained"
              disabled={buttonInputState}
              onClick={() => {
                reset();
                setValue("ratingVal", 0);
                setEditButtonInputState(true);
                setDeleteButtonState(true);
                setButtonInputState(true);
                setSlideChecked(true);
                setIsOpenCollapse(!isOpenCollapse);
              }}
            >
              <AddIcon size="70" />
            </Button>
          </Box>
        </Box>

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={load}
          onClick={handleLoad}
        >
          Loading....
          <CircularProgress color="inherit" />
        </Backdrop>

        <Paper
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: "10px",
            backgroundColor: "#AFC8F9",
          }}
        >
          {showForm && (
            <>
              <Paper
                sx={{
                  backgroundColor: "#D8E4FD",
                  width: "40%",
                }}
                elevation={5}
              >
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmitForm)}>
                    <Grid
                      container
                      sx={{
                        padding: "10px",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Typography
                          sx={{ fontWeight: "700", fontSize: "18px" }}
                        >
                          <FormattedLabel id="rateYourExperience" />
                        </Typography>
                      </Box>
                      <Box>
                        <Typography>
                          <FormattedLabel id="ratingText" />
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <FormControl
                          error={!!errors.ratingVal}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Controller
                            name="ratingVal" // Name for the rating field
                            control={control}
                            defaultValue={0} // Initial value for the Rating component
                            render={({ field }) => (
                              <Rating
                                name="simple-controlled"
                                value={field.value}
                                onChange={(event, newValue) => {
                                  field.onChange(newValue); // Update the field value
                                }}
                                size="large"
                              />
                            )}
                          />
                          <Box>{labels[watch("ratingVal")]}</Box>
                          <FormHelperText>
                            {errors?.ratingVal
                              ? errors.ratingVal.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                        {/* <Rating
                          name="simple-controlled"
                          value={ratingValue}
                          onChange={(event, newValue) => {
                            setRatingValue(newValue);
                          }}
                          size="large"
                        /> */}
                      </Grid>
                    </Grid>
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <TextField
                          size="small"
                          fullWidth
                          multiline
                          rows={4}
                          placeholder={
                            language == "en"
                              ? "Tell us about your experience!"
                              : "तुमच्या अनुभवाबद्दल आम्हाला सांगा!"
                          }
                          sx={{ width: "90%", backgroundColor: "#E3ECFE" }}
                          id="outlined-basic"
                          //   label={<FormattedLabel id="branchName" />}
                          variant="outlined"
                          //   value={feedbackEntered}
                          //   onChange={(e) => {
                          //     setFeedbackEntered(e.target.value);
                          //   }}
                          {...register("feedbackEnt")}
                          error={!!errors.feedbackEnt}
                          helperText={
                            errors?.feedbackEnt
                              ? errors.feedbackEnt.message
                              : null
                          }
                          InputLabelProps={{
                            shrink: watch("feedbackEnt") ? true : false,
                          }}
                        />
                      </Grid>
                    </Grid>
                    <br />
                    <Grid
                      container
                      className={styles.feildres}
                      sx={{ padding: "10px" }}
                    >
                      <Grid
                        item
                        xs={4}
                        sx={{ display: "flex", justifyContent: "end" }}
                      >
                        <Button
                          type="submit"
                          size="small"
                          color="success"
                          variant="outlined"
                          className={styles.button}
                          endIcon={<SaveIcon />}
                        >
                          <FormattedLabel id="Save" />
                        </Button>
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          className={styles.button}
                          endIcon={<ClearIcon />}
                          onClick={() => {
                            reset();
                            setValue("ratingVal", 0);
                          }}
                        >
                          {<FormattedLabel id="clear" />}
                        </Button>
                      </Grid>
                      <Grid item xs={4}>
                        <Button
                          size="small"
                          variant="outlined"
                          className={styles.button}
                          color="error"
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitButton()}
                        >
                          {<FormattedLabel id="exit" />}
                        </Button>
                      </Grid>
                    </Grid>
                    <br />
                  </form>
                </FormProvider>
              </Paper>
            </>
          )}

          {showForm == false && (
            <Box
              style={{
                height: "auto",
                overflow: "auto",
                width: "100%",
              }}
            >
              <DataGrid
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                  },
                }}
                getRowId={(row) => row.srNo}
                components={{ Toolbar: GridToolbar }}
                autoHeight={true}
                density="compact"
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
                  "& .MuiDataGrid-cell:hover": {
                    // transform: "scale(1.1)",
                  },
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

                  "& .orangeText": {
                    color: "red",
                    fontSize: "20px",
                    fontWeight: "900",
                  },
                }}
                getCellClassName={(params) => {
                  if (params.field === "rating") {
                    return "orangeText";
                  }
                }}
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
                  getPaymentTypeDetails(data.pageSize, _data);
                }}
                onPageSizeChange={(_data) => {
                  console.log("222", _data);
                  // updateData("page", 1);
                  getPaymentTypeDetails(_data, data.page);
                }}
              />
            </Box>
          )}
        </Paper>
      </>
    </>
  );
};

export default Index;

// export default index
