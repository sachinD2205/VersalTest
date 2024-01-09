import { ClearOutlined, SearchOutlined } from "@mui/icons-material";
import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import swal from "sweetalert";
import urls from "../../../../URLS/urls";
// import StudentsAttendanceReportToPrint from "../../../../components/school/StudentsAttendanceReportToPrint";
import ItiTraineeAttendanceReportToPrint from "../../../../components/school/ItiTraineeAttendanceReportToPrint";
import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
import { yupResolver } from "@hookform/resolvers/yup";
// import studentAttendanceReportSchema from "../../../../containers/schema/school/transactions/studentAttendanceReportSchema";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  const [traineeAttendance, setTraineeAttendance] = useState();
  const [ItiDetails, setItiDetails] = useState();
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState("none");

  const [itiKeys, setItiKeys] = useState([]);
  const [academicYearList, setAcademicYearList] = useState([]);
  const [tradeKeys, setTradeKeys] = useState([]);

  const [error, setError] = useState(null);

  const language = useSelector((state) => state?.labels?.language);

  const [labels, setLabels] = useState(schoolLabels[language ?? "en"]);
  let user = useSelector((state) => state.user.user);
  const userToken = useGetToken();
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

  useEffect(
    () => setLabels(schoolLabels[language ?? "en"]),
    [setLabels, language]
  );

  const {
    watch,
    control,
    handleSubmit,
    reset,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(studentAttendanceReportSchema),
    mode: "onChange",
  });

  const itiKey = watch("itiKey");
  const fromDate = watch("fromDate");
  const toDate = watch("toDate");

  useEffect(() => {
    let maxDate = fromDate
      ? moment(fromDate).add(1, "months").format("YYYY-MM-DD")
      : null;
    setValue("toDate", maxDate);
  }, [watch("fromDate")]);

  useEffect(() => {
    const getItiKeys = async () => {
      try {
        // const { data } = await axios.get(`${urls.SCHOOL}/mstSchool/getAll`);
        const { data } = await axios.get(
          `${urls.SCHOOL}/mstIti/getItiOnUserId?userId=${user?.id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        const itis = data?.map(({ id, itiName }) => ({
          id,
          itiName,
        }));
        setItiKeys(itis);
      } catch (error) {
        setError(error.message);
        callCatchMethod(error, language);
      }
    };

    const getAcademicYearList = async () => {
      try {
        const { data } = await axios.get(
          `${urls.SCHOOL}/mstAcademicYear/getAll`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        const academicYears = data.mstAcademicYearList.map(
          ({ id, academicYear }) => ({ id, academicYear })
        );
        setAcademicYearList(academicYears);
      } catch (error) {
        setError(error.message);
        callCatchMethod(error, language);
      }
    };
    getItiKeys();
    getAcademicYearList();
  }, [setError]);

  useEffect(() => {
    const getTradeKeys = async () => {
      setValue("tradeKey", "");
      if (itiKey == null || itiKey === "") {
        setTradeKeys([]);
        return;
      }
      try {
        const { data } = await axios.get(
          `${urls.SCHOOL}/mstItiTrade/getDataOnItiKey?itiKey=${itiKey}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        const trades = data?.map(({ id, tradeName }) => ({
          id,
          tradeName,
        }));
        setTradeKeys(trades);
      } catch (e) {
        setError(e.message);
        callCatchMethod(e, language);
      }
    };
    getTradeKeys();
  }, [itiKey, setValue, setError]);

  const componentRef = useRef(null);

  console.log("componentRef", componentRef);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });

  useEffect(() => {
    handlePrint();
  }, [traineeAttendance, ItiDetails]);

  const findReport = async (formValue) => {
    let _data = {
      academicYearKey: formValue.academicYearId,
      itiKey: formValue.itiKey,
      tradekey: formValue.tradeKey,
      fromDate: moment(formValue.fromDate).format("YYYY-MM-DD"),
      toDate: moment(formValue.toDate).format("YYYY-MM-DD"),
    };
    axios
      .post(`${urls.SCHOOL}/trnItiTraineeAttendacne/attendanceReport`, _data, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          console.log("_attendanceRes", res.data);
          let a = res?.data;
          let _itiData = {
            itiName: itiKeys?.find((i) => i?.id === a?.itiKey)?.itiName,
            academicYearName: academicYearList?.find(
              (i) => i?.id === a?.academicYearKey
            )?.academicYear,
            tradeName: tradeKeys?.find((i) => i?.id === a?.tradekey)?.tradeName,
            fromDate: moment(formValue.fromDate).format("YYYY-MM-DD"),
            toDate: moment(formValue.toDate).format("YYYY-MM-DD"),
          };
          let _attendanceReport = res?.data?.itiStudentInfor;
          console.log("_attendanceReport", _attendanceReport);
          console.log("_itiData", _itiData);
          if (_attendanceReport?.length > 0) {
            setTraineeAttendance(_attendanceReport);
            setItiDetails(_itiData);
            setIsReady("none");
          } else {
            swal("Not Found", "Record not Found", "error");
          }
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  };

  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      <Paper
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginLeft: "10px",
          marginRight: "10px",
          padding: 1,
          paddingBottom: "30px",
        }}
      >
        <Grid container gap={4} direction="column">
          <Grid
            container
            display="flex"
            justifyContent="center"
            justifyItems="center"
            padding={2}
            sx={{
              background:
                "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <Grid item>
              <h2 style={{ marginBottom: 0 }}>
                {labels.itiTraineeAttendanceReport}
              </h2>
            </Grid>
          </Grid>
          <Paper style={{ display: isReady }}>
            {traineeAttendance && ItiDetails && (
              <ItiTraineeAttendanceReportToPrint
                ref={componentRef}
                traineeAttendance={traineeAttendance}
                ItiDetails={ItiDetails}
              />
            )}
          </Paper>
          <Grid item xs={12}>
            <form onSubmit={handleSubmit(findReport)}>
              <Grid container display="flex" direction="column" gap={2}>
                <Grid
                  container
                  direction="row"
                  display="flex"
                  spacing={4}
                  justifyContent="center"
                >
                  <Grid item lg={2} md={3} sm={6} xs={12} display="flex">
                    <FormControl fullWidth>
                      <InputLabel required error={!!errors.itiKey}>
                        {labels.selectIti}
                      </InputLabel>
                      <Controller
                        control={control}
                        name="itiKey"
                        rules={{ required: true }}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            variant="standard"
                            {...field}
                            error={!!errors.itiKey}
                          >
                            {itiKeys &&
                              itiKeys.map((iti) => (
                                <MenuItem key={iti.id} value={iti.id}>
                                  {iti.itiName}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                      />
                      <FormHelperText error={!!errors.itiKey}>
                        {errors.itiKey ? labels.itiNameReq : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item lg={2} md={3} sm={6} xs={12} display="flex">
                    <FormControl fullWidth>
                      <InputLabel required error={!!errors.academicYearId}>
                        {labels.selectAcademicYear}
                      </InputLabel>
                      <Controller
                        control={control}
                        name="academicYearId"
                        rules={{ required: true }}
                        defaultValue=""
                        render={({ field }) => (
                          <Select variant="standard" {...field}>
                            {academicYearList &&
                              academicYearList.map((academicYear) => (
                                <MenuItem
                                  key={academicYear.id}
                                  value={academicYear.id}
                                >
                                  {academicYear.academicYear}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                      />
                      <FormHelperText error={!!errors.academicYearId}>
                        {errors.academicYearId
                          ? labels.academicYearRequired
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid
                  container
                  direction="row"
                  display="flex"
                  spacing={4}
                  justifyContent="center"
                >
                  <Grid item lg={2} md={3} sm={6} xs={12} display="flex">
                    <FormControl fullWidth>
                      <InputLabel required error={!!errors.tradeKey}>
                        {labels.selectTrade}
                      </InputLabel>
                      <Controller
                        control={control}
                        name="tradeKey"
                        rules={{ required: true }}
                        defaultValue=""
                        render={({ field }) => (
                          <Select variant="standard" {...field}>
                            {tradeKeys &&
                              tradeKeys.map((trd) => (
                                <MenuItem key={trd.id} value={trd.id}>
                                  {trd.tradeName}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                      />
                      <FormHelperText error={!!errors.tradeKey}>
                        {errors.tradeKey ? labels.itiTradeReq : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  {/* <Grid item lg={2} md={3} sm={6} xs={12} display="flex">
                  <FormControl fullWidth>
                    <InputLabel required error={!!errors.divisionId}>
                      {labels.selectDivision}
                    </InputLabel>
                    <Controller
                      control={control}
                      name="divisionId"
                      rules={{ required: true }}
                      defaultValue=""
                      render={({ field }) => (
                        <Select variant="standard" {...field}>
                          {divisionList &&
                            divisionList.map((division) => (
                              <MenuItem key={division.id} value={division.id}>
                                {division.divisionName}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                    />
                    <FormHelperText error={!!errors.divisionId}>
                      {errors.divisionId ? labels.divisionRequired : null}
                    </FormHelperText>
                  </FormControl>
                </Grid> */}
                </Grid>
                <Grid
                  container
                  direction="row"
                  display="flex"
                  spacing={4}
                  justifyContent="center"
                >
                  <Grid item lg={2} md={3} sm={6} xs={12} display="flex">
                    <Controller
                      control={control}
                      name="fromDate"
                      rules={{ required: true }}
                      defaultValue={null}
                      render={({ field: { onChange, ...props } }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            disableFuture
                            label={
                              <span className="required">{`${labels.fromDate} *`}</span>
                            }
                            variant="standard"
                            inputFormat="DD/MM/YYYY"
                            {...props}
                            onChange={(date) =>
                              onChange(moment(date).format("YYYY-MM-DD"))
                            }
                            selected={fromDate}
                            center
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="standard"
                                fullWidth
                                error={!!errors.fromDate}
                                helperText={
                                  errors.fromDate ? labels.dateRequired : null
                                }
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                  </Grid>
                  <Grid item lg={2} md={3} sm={6} xs={12} display="flex">
                    <Controller
                      control={control}
                      name="toDate"
                      rules={{ required: true }}
                      defaultValue={null}
                      // defaultValue={new Date().toISOString()}
                      render={({ field: { onChange, ...props } }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            disableFuture
                            disabled={true}
                            label={
                              <span className="required">{`${labels.toDate} *`}</span>
                            }
                            variant="standard"
                            inputFormat="DD/MM/YYYY"
                            {...props}
                            onChange={(date) =>
                              onChange(moment(date).format("YYYY-MM-DD"))
                            }
                            selected={toDate}
                            center
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="standard"
                                fullWidth
                                error={!!errors.toDate}
                                helperText={
                                  errors.toDate ? labels.dateRequired : null
                                }
                              />
                            )}
                            minDate={watch("fromDate")}
                          />
                        </LocalizationProvider>
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  direction="row"
                  display="flex"
                  spacing={4}
                  gap={2}
                  justifyContent="center"
                  paddingTop={4}
                >
                  <Button
                    variant="contained"
                    startIcon={<SearchOutlined />}
                    type="submit"
                    disabled={loading}
                  >
                    <span>{labels.generateReport}</span>
                  </Button>

                  <Button
                    disabled={loading}
                    variant="contained"
                    // color="warning"
                    startIcon={<ClearOutlined />}
                    onClick={() => {
                      reset();
                      setTraineeAttendance();
                      setItiDetails();
                    }}
                  >
                    {labels.clear}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
        <Snackbar
          open={error?.length > 0}
          autoHideDuration={10000}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          onClose={() => setError(null)}
        >
          <Alert
            severity="error"
            sx={{ width: "100%" }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        </Snackbar>
      </Paper>
    </>
  );
};

export default Index;
