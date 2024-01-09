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
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import ClassTimetableReportToPrint from "../../../../components/school/ClassTimetableReportToPrint";
import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
import urls from "../../../../URLS/urls";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const [schoolList, setSchoolList] = useState([]);
  const [academicYearList, setAcademicYearList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [teacherList, setTeacherList] = useState([]);
  const [classTimetableReport, setClassTimetableReport] = useState();
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
    mode: "onBlur",
  });

  const fromDate = watch("fromDate");
  const toDate = watch("toDate");
  const schoolId = watch("schoolId");
  const academicYearId = watch("academicYearId");
  const classId = watch("classId");
  const divisionId = watch("divisionId");

  console.log("fromDate", fromDate);
  console.log("toDate", toDate);

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

  const getAllSubjectList = () => {
    axios
      .get(`${urls.SCHOOL}/mstAcademicSubject/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setSubjectList(
          r?.data?.mstAcademicSubjectList?.map((sub) => ({
            value: sub.id,
            label: sub.subjectName,
          }))
        );
      })
      .catch((e) => {
        // catchExceptionHandlingMethod(e, language);
        callCatchMethod(e, language);
      });
  };

  const getAllTeacherList = () => {
    axios
      .get(`${urls.SCHOOL}/mstTeacher/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setTeacherList(
          r?.data?.mstTeacherList?.map((tea) => ({
            value: tea.id,
            label: `${tea.firstName} ${tea.middleName} ${tea.lastName}`,
          }))
        );
      })
      .catch((e) => {
        //catchExceptionHandlingMethod(e, language);
        callCatchMethod(e, language);
      });
  };

  const getSchoolList = () => {
    axios
      .get(`${urls.SCHOOL}/mstSchool/getSchoolByUserId?userId=${user?.id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setSchoolList(
          r?.data?.map((school) => ({
            id: school.id,
            schoolName: school.schoolName,
            schoolNameMr: school.schoolNameMr,
          }))
        );
      })
      .catch((e) => {
        //catchExceptionHandlingMethod(e, language);
        callCatchMethod(e, language);
      });
  };

  const getAcademicYearList = () => {
    axios
      .get(`${urls.SCHOOL}/mstAcademicYear/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setAcademicYearList(
          r?.data?.mstAcademicYearList?.map((ay) => ({
            id: ay.id,
            academicYear: ay.academicYear,
          }))
        );
      })
      .catch((e) => {
        //catchExceptionHandlingMethod(e, language);
        callCatchMethod(e, language);
      });
  };

  useEffect(() => {
    getAllSubjectList();
    getAllTeacherList();
    getSchoolList();
    getAcademicYearList();
  }, []);

  const getClassList = () => {
    if (schoolId) {
      axios
        .get(
          `${urls.SCHOOL}/mstClass/getAllClassBySchool?schoolKey=${schoolId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          setClassList(
            r?.data?.mstClassList?.map((i) => ({
              id: i.id,
              className: i.className,
            }))
          );
        })
        .catch((e) => {
          //catchExceptionHandlingMethod(e, language);
          callCatchMethod(e, language);
        });
    }
  };

  useEffect(() => {
    getClassList();
  }, [schoolId, setValue, setError]);

  const getDivisionList = () => {
    if (classId && schoolId) {
      axios
        .get(
          `${urls.SCHOOL}/mstDivision/getAllDivisionByClass?schoolKey=${schoolId}&classKey=${classId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          setDivisionList(
            r?.data?.mstDivisionList?.map((div) => ({
              id: div.id,
              divisionName: div.divisionName,
            }))
          );
        })
        .catch((e) => {
          //catchExceptionHandlingMethod(e, language);
          callCatchMethod(e, language);
        });
    }
  };

  useEffect(() => {
    getDivisionList();
  }, [classId, schoolId, setValue, setError]);

  const componentRef = useRef(null);
  // console.log("componentRef", componentRef);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });
  useEffect(() => {
    if (classTimetableReport) {
      handlePrint();
    }
  }, [classTimetableReport]);

  const findReport = (formValue) => {
    axios
      .get(
        `${urls.SCHOOL}/trnClassTimetable/getTimetableForDivision?schoolKey=${formValue.schoolId}&academicYearKey=${formValue.academicYearId}&classKey=${formValue.classId}&divisionKey=${formValue.divisionId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((r) => {
        console.log("response", r);
        if (r.status === 200) {
          let _classTimeTable = r?.data?.trnClassTimetableList?.map((data) => {
            return {
              ...data,
              academicYearName: academicYearList?.find(
                (i) => i?.id == data?.academicYearKey
              )?.academicYear,
              schoolName: schoolList?.find((i) => i?.id == data?.schoolKey)
                ?.schoolName,
              schoolNameMr: schoolList?.find((i) => i?.id == data?.schoolKey)
                ?.schoolNameMr,
              className: classList?.find((i) => i?.id == data?.classKey)
                ?.className,
              divisionName: divisionList?.find(
                (i) => i?.id == data?.divisionKey
              )?.divisionName,
            };
          });
          console.log("_classTimeTable", _classTimeTable);
          if (_classTimeTable?.length > 0) {
            setClassTimetableReport(_classTimeTable);
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
        // sweetAlert(
        //   "Error",
        //   e?.message ? e?.message : "Something Went Wrong",
        //   "error"
        // );
        console.log("Eroor", e);
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
              <h2 style={{ marginBottom: 0 }}>{labels.classTimetableReport}</h2>
            </Grid>
          </Grid>
          <Paper style={{ display: isReady }}>
            {classTimetableReport && (
              <ClassTimetableReportToPrint
                ref={componentRef}
                data={classTimetableReport}
                subjectList={subjectList}
                teacherList={teacherList}
                language={language}
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
                                  {/* {school.schoolName} */}
                                  {language === "en"
                                    ? school.schoolName
                                    : school.schoolNameMr}
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
                      setClassTimetableReport();
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
