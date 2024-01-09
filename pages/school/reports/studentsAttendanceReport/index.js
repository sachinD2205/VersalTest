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
import StudentsAttendanceReportToPrint from "../../../../components/school/StudentsAttendanceReportToPrint";
import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
import { yupResolver } from "@hookform/resolvers/yup";
import studentAttendanceReportSchema from "../../../../containers/schema/school/transactions/studentAttendanceReportSchema";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const [schoolList, setSchoolList] = useState([]);
  const [academicYearList, setAcademicYearList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [studentAttendance, setStudentAttendance] = useState();
  const [schoolDetails, setSchoolDetails] = useState();
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState("none");

  const [error, setError] = useState(null);

  const language = useSelector((state) => state?.labels?.language);

  const [labels, setLabels] = useState(schoolLabels[language ?? "en"]);

  useEffect(
    () => setLabels(schoolLabels[language ?? "en"]),
    [setLabels, language]
  );

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

  const {
    watch,
    control,
    handleSubmit,
    reset,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(studentAttendanceReportSchema),
    mode: "onChange",
  });

  const fromDate = watch("fromDate");
  const toDate = watch("toDate");
  const schoolId = watch("schoolId");
  const academicYearId = watch("academicYearId");
  const classId = watch("classId");
  const divisionId = watch("divisionId");

  useEffect(() => {
    let maxDate = fromDate
      ? moment(fromDate).add(1, "months").format("YYYY-MM-DD")
      : null;
    setValue("toDate", maxDate);
  }, [watch("fromDate")]);

  // --------------------Getting logged in authority roles -----------------------

  const [authority, setAuthority] = useState([]);
  let user = useSelector((state) => state.user.user);
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");

  useEffect(() => {
    let auth = user?.menus?.find((r) => {
      if (r.id == selectedMenuFromDrawer) {
        console.log("r.roles", r.roles);
        return r;
      }
    })?.roles;
    console.log("auth0000", auth);
    setAuthority(auth);
  }, []);
  console.log("authority", authority);
  // -------------------------------------------------------------------

  useEffect(() => {
    const getSchoolList = async () => {
      try {
        // const { data } = await axios.get(`${urls.SCHOOL}/mstSchool/getAll`);
        const { data } = await axios.get(
          `${urls.SCHOOL}/mstSchool/getSchoolByUserId?userId=${user?.id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        const schools = data?.map(({ id, schoolName, schoolNameMr }) => ({
          id,
          schoolName,
          schoolNameMr,
        }));
        setSchoolList(schools);
      } catch (e) {
        setError(e.message);
        //catchExceptionHandlingMethod(e, language);
        callCatchMethod(e, language);
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
      } catch (e) {
        setError(e.message);
        //catchExceptionHandlingMethod(e, language);
        callCatchMethod(e, language);
      }
    };
    getSchoolList();
    getAcademicYearList();
  }, [setError]);

  useEffect(() => {
    const getClassList = async () => {
      setValue("classId", "");
      if (schoolId == null || schoolId === "") {
        setClassList([]);
        return;
      }
      try {
        const { data } = await axios.get(
          `${urls.SCHOOL}/mstClass/getAllClassBySchool?schoolKey=${schoolId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        const classes = data.mstClassList.map(({ id, className }) => ({
          id,
          className,
        }));
        setClassList(classes);
      } catch (e) {
        setError(e.message);
        //catchExceptionHandlingMethod(e, language);
        callCatchMethod(e, language);
      }
    };
    getClassList();
  }, [schoolId, setValue, setError]);

  useEffect(() => {
    const getDivisionList = async () => {
      setValue("divisionId", "");
      if (
        schoolId == null ||
        schoolId === "" ||
        classId == null ||
        classId === ""
      ) {
        setDivisionList([]);
        return;
      }
      try {
        const { data } = await axios.get(
          `${urls.SCHOOL}/mstDivision/getAllDivisionByClass?schoolKey=${schoolId}&classKey=${classId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        const divisions = data.mstDivisionList.map(({ id, divisionName }) => ({
          id,
          divisionName,
        }));
        setDivisionList(divisions);
      } catch (e) {
        setError(e.message);
        //catchExceptionHandlingMethod(e, language);
        callCatchMethod(e, language);
      }
    };
    getDivisionList();
  }, [classId, schoolId, setValue, setError]);

  const componentRef = useRef(null);

  console.log("componentRef", componentRef);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });

  useEffect(() => {
    handlePrint();
  }, [studentAttendance, schoolDetails]);

  const findReport = async (formValue) => {
    let _data = {
      schoolKey: formValue.schoolId,
      academicYearKey: formValue.academicYearId,
      classKey: formValue.classId,
      divisionKey: formValue.divisionId,
      fromDate: moment(formValue.fromDate).format("YYYY-MM-DD"),
      toDate: moment(formValue.toDate).format("YYYY-MM-DD"),
    };
    axios
      .post(`${urls.SCHOOL}/trnStudentAttendance/report`, _data, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          console.log("_attendanceRes", res.data);
          let a = res?.data;
          let _schoolData = {
            schoolName: schoolList?.find((i) => i?.id === a?.schoolKey)
              ?.schoolName,
            schoolNameMr: schoolList?.find((i) => i?.id === a?.schoolKey)
              ?.schoolNameMr,
            academicYearName: academicYearList?.find(
              (i) => i?.id === a?.academicYearKey
            )?.academicYear,
            className: classList?.find((i) => i?.id === a?.classKey)?.className,
            divisionName: divisionList?.find((i) => i?.id === a?.divisionKey)
              ?.divisionName,
            fromDate: moment(formValue.fromDate).format("YYYY-MM-DD"),
            toDate: moment(formValue.toDate).format("YYYY-MM-DD"),
          };
          let _attendanceReport = res?.data?.dateWiseAttenDao;
          console.log("_attendanceReport", _attendanceReport);
          if (_attendanceReport?.length > 0) {
            setStudentAttendance(_attendanceReport);
            setSchoolDetails(_schoolData);
            // handlePrint();
            setIsReady("none");
          } else {
            // swal("Not Found", "Record not Found", "error");
            sweetAlert({
              title: language === "en" ? "Not Found !" : "सापडले नाही !",
              text:
                language === "en"
                  ? "Record Not found !"
                  : "रेकॉर्ड सापडले नाही !",
              button: language === "en" ? "Ok" : "ठीक आहे",
              icon: "error",
            });
          }
        }
      })
      .catch((e) => {
        //catchExceptionHandlingMethod(e, language);
        callCatchMethod(e, language);
        // swal(
        //   "Error",
        //   e?.message ? e?.message : "Something Went Wrong",
        //   "error"
        // );
        // console.log("Eroor", e);
      });
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
                {labels.studentsAttendanceReport}
              </h2>
            </Grid>
          </Grid>
          <Paper style={{ display: isReady }}>
            {studentAttendance && schoolDetails && (
              <StudentsAttendanceReportToPrint
                ref={componentRef}
                studentAttendance={studentAttendance}
                schoolDetails={schoolDetails}
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
                      <InputLabel required error={!!errors.schoolId}>
                        {labels.selectSchool}
                      </InputLabel>
                      <Controller
                        control={control}
                        name="schoolId"
                        rules={{ required: true }}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            variant="standard"
                            {...field}
                            error={!!errors.schoolId}
                          >
                            {schoolList &&
                              schoolList.map((school) => (
                                <MenuItem key={school.id} value={school.id}>
                                  {school.schoolName}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                      />
                      <FormHelperText error={!!errors.schoolId}>
                        {errors.schoolId ? labels.schoolRequired : null}
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
                      <InputLabel required error={!!errors.classId}>
                        {labels.selectClass}
                      </InputLabel>
                      <Controller
                        control={control}
                        name="classId"
                        rules={{ required: true }}
                        defaultValue=""
                        render={({ field }) => (
                          <Select variant="standard" {...field}>
                            {classList &&
                              classList.map((classN) => (
                                <MenuItem key={classN.id} value={classN.id}>
                                  {classN.className}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                      />
                      <FormHelperText error={!!errors.classId}>
                        {errors.classId ? labels.classRequired : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item lg={2} md={3} sm={6} xs={12} display="flex">
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
                    <Controller
                      control={control}
                      name="fromDate"
                      rules={{ required: true }}
                      defaultValue={null}
                      render={({ field: { onChange, ...props } }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            label={
                              <span className="required">
                                {labels.fromDate} *
                              </span>
                            }
                            disableFuture
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
                            disabled={true}
                            disableFuture
                            label={
                              <span className="required">
                                {labels.toDate} *
                              </span>
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
                            maxDate={
                              watch("fromDate")
                                ? moment(watch("fromDate"))
                                    .add(1, "months")
                                    .format("YYYY-MM-DD")
                                : null
                            }
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
                      setStudentAttendance();
                      setSchoolDetails();
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
