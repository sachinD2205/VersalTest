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
import ExamTimeTableReportPrint from "../../../../components/school/examTimeTableReportPrint";
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
  const [examList, setExamList] = useState([]);
  const [examTimeTableReport, setExamTimeTableReport] = useState();
  useState();
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState("none");
  const [sub, setSub] = useState([]);
  const [termList, setTermList] = useState([
    { id: 1, termName: "Term 1" },
    { id: 2, termName: "Term 2" },
  ]);
  console.log("999", teacherList, classList, academicYearList);

  const [error, setError] = useState(null);

  const language = useSelector((state) => state?.labels?.language);

  const [labels, setLabels] = useState(schoolLabels[language ?? "en"]);

  useEffect(
    () => setLabels(schoolLabels[language ?? "en"]),
    [setLabels, language]
  );
  // console.log("ooo",subjectList)

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
  const schoolKey = watch("schoolKey");
  const academicYearId = watch("academicYearId");
  const classId = watch("classId");
  const divisionId = watch("divisionId");
  const termKey = watch("term");

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

  // const getSubjectList = () => {
  //   if (schoolKey && classKey && academicYearKey) {
  //     axios
  //       .get(
  //         // `${urls.SCHOOL}/mstAcademicSubject/getFilterSubject?schoolKey=${schoolKey}&academicYearKey=${academicYearId}&classKey=${classId}&divisionKey=${divisionId}`,
  //         `${urls.SCHOOL}/mstAcademicSubject/getFilterSubjectOnClassKeySchoolAndacademicYear?schoolKey=${schoolKey}&academicYearKey=${academicYearKey}&classKey=${classKey}`
  //       )
  //       .then((r) => {
  //         console.log("res");
  //         const subjectList = r.data?.map(({ id, subjectName }) => ({
  //           value: id,
  //           label: subjectName,
  //         }));
  //         setSubjectList(subjectList);
  //       });
  //   }
  // };

  useEffect(() => {
    const getClassList = async () => {
      if (schoolKey == null || schoolKey.length === 0) {
        setValue("classKey", "");
        setClassList([]);
        return;
      }
      try {
        const { data } = await axios.get(
          `${urls.SCHOOL}/mstClass/getAllClassBySchool?schoolKey=${schoolKey}`,
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
        // catchExceptionHandlingMethod(e, language);
        callCatchMethod(e, language);
      }
    };
    getClassList();
  }, [schoolKey, setValue, setError]);

  const getSubject = () => {
    // if (schoolKey && classId && academicYearId && divisionId) {
    axios
      .get(`${urls.SCHOOL}/mstAcademicSubject/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        console.log("res", r.data);

        setSubjectList(r.data.mstAcademicSubjectList);
      })
      .catch((e) => {
        //catchExceptionHandlingMethod(e, language);
        callCatchMethod(e, language);
      });
    // }
  };
  useEffect(() => {
    getSubject();
  }, []);

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

  const getTeacherList = () => {
    if (schoolKey) {
      axios
        .get(
          `${urls.SCHOOL}/mstTeacher/getTeacherList?schoolKey=${schoolKey}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          console.log("mstTeacher", r);
          const teachersList = r.data?.map(
            ({ id, firstName, middleName, lastName }) => ({
              value: id,
              label: `${firstName} ${middleName} ${lastName}`,
            })
          );
          setTeacherList(teachersList);
        })
        .catch((e) => {
          //catchExceptionHandlingMethod(e, language);
          callCatchMethod(e, language);
        });
    }
  };
  console.log("000", teacherList);

  useEffect(() => {
    getAcademicYearList();
    getTeacherList();
  }, [schoolKey, classId, academicYearId, divisionId]);

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
        const schools = data?.map(({ id, schoolName }) => ({
          id,
          schoolName,
        }));
        setSchoolList(schools);
      } catch (e) {
        setError(e.message);
        //catchExceptionHandlingMethod(e, language);
        callCatchMethod(e, language);
      }
    };

    getSchoolList();
  }, [setError]);

  const getExamList = () => {
    if (termKey) {
      axios
        .get(
          `${urls.SCHOOL}/mstExam/getDataThroughTermKey?termKey=${termKey}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          setExamList(
            r?.data?.map((i) => ({
              id: i.id,
              examName: i.examName,
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
    getExamList();
  }, [termKey]);

  const componentRef = useRef(null);

  console.log("componentRef", componentRef);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });
  useEffect(() => {
    if (examTimeTableReport) {
      handlePrint();
    }
  }, [examTimeTableReport]);

  const findReport = async (formValue) => {
    console.log("ooo", formValue);
    setLoading(true);
    // let body = {
    //   "schoolKey": formValue.schoolKey,
    //   "teacherKey": formValue.teacherKey,
    // };
    try {
      await axios
        // .get(`${urls.SCHOOL}/mstExam/getDataAsperTerm1?schoolKey=${formValue.schoolKey}&academicYearKey=${formValue.academicYearKey}&classKey=${formValue.classKey}&termKey=${formValue.term}`,
        .get(
          `${urls.SCHOOL}/trnExamClassTimeTableController/getClassTimeTable?classKey=${formValue.classKey}&schoolkey=${formValue.schoolKey}&academicYearKey=${formValue.academicYearKey}&term=${formValue.term}&examName=${formValue.examName}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          if (r.status === 200) {
            // let _examTimeTableReport = r?.data;
            let _examTimeTableReport = {
              ...r?.data,
              schoolName: schoolList?.find((i) => i.id === r?.data?.schoolKey)
                ?.schoolName,
              className: classList?.find((i) => i.id === r?.data?.classKey)
                ?.className,
            };
            console.log("response 11", _examTimeTableReport);
            if (_examTimeTableReport) {
              setExamTimeTableReport(_examTimeTableReport);
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
        });
      // setIsReady("none");
    } catch (e) {
      setError(e.message);
      sweetAlert({
        title: language === "en" ? "Not Found !" : "सापडले नाही !",
        text:
          language === "en" ? "Record Not found !" : "रेकॉर्ड सापडले नाही !",
        button: language === "en" ? "Ok" : "ठीक आहे",
        icon: "error",
      });
      // swal("Not Found", "Record not Found", "error");
      // catchExceptionHandlingMethod(e, language);
    } finally {
      setLoading(false);
    }
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
              <h2 style={{ marginBottom: 0 }}>{labels.examTimeTableReport}</h2>
            </Grid>
          </Grid>
          <Paper style={{ display: isReady }}>
            {console.log("ppp", examTimeTableReport)}
            {examTimeTableReport && (
              <ExamTimeTableReportPrint
                ref={componentRef}
                data={examTimeTableReport}
                sub={subjectList}
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
                  <Grid item lg={4} md={4} sm={6} xs={12} display="flex">
                    <FormControl fullWidth>
                      <InputLabel required error={!!errors.schoolKey}>
                        {labels.selectSchool}
                      </InputLabel>
                      <Controller
                        control={control}
                        name="schoolKey"
                        rules={{ required: true }}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            variant="standard"
                            {...field}
                            error={!!errors.schoolKey}
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
                      <FormHelperText error={!!errors.schoolKey}>
                        {errors.schoolKey ? labels.schoolRequired : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item lg={4} md={4} sm={6} xs={12} display="flex">
                    <FormControl fullWidth>
                      <InputLabel required error={!!errors.academicYearKey}>
                        {labels.selectAcademicYear}
                      </InputLabel>
                      <Controller
                        control={control}
                        name="academicYearKey"
                        rules={{ required: true }}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            variant="standard"
                            {...field}
                            error={!!errors.academicYearKey}
                          >
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
                      <FormHelperText error={!!errors.academicYearKey}>
                        {errors.academicYearKey
                          ? labels.academicYearRequired
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item lg={4} md={4} sm={6} xs={12} display="flex">
                    <FormControl fullWidth>
                      <InputLabel required error={!!errors.classKey}>
                        {labels.selectClass}
                      </InputLabel>
                      <Controller
                        control={control}
                        name="classKey"
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
                      <FormHelperText error={!!errors.classKey}>
                        {errors.classKey ? labels.classRequired : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item lg={4} md={4} sm={6} xs={12} display="flex">
                    <FormControl fullWidth>
                      <InputLabel required error={!!errors.term}>
                        {labels.selectTerm}
                      </InputLabel>
                      <Controller
                        control={control}
                        name="term"
                        rules={{ required: true }}
                        defaultValue=""
                        render={({ field }) => (
                          <Select variant="standard" {...field}>
                            {termList &&
                              termList?.map((term) => (
                                <MenuItem key={term.id} value={term.id}>
                                  {term.termName}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                      />
                      <FormHelperText error={!!errors.term}>
                        {errors.term ? labels.termRequired : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item lg={4} md={4} sm={6} xs={12} display="flex">
                    <FormControl fullWidth>
                      <InputLabel required error={!!errors.examName}>
                        {labels.selectExam}
                      </InputLabel>
                      <Controller
                        control={control}
                        name="examName"
                        rules={{ required: true }}
                        defaultValue=""
                        render={({ field }) => (
                          <Select variant="standard" {...field}>
                            {examList &&
                              examList?.map((exam) => (
                                <MenuItem key={exam.id} value={exam.id}>
                                  {exam.examName}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                      />
                      <FormHelperText error={!!errors.examName}>
                        {errors.examName ? labels.examNameRequired : null}
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
                      setExamTimeTableReport();
                    }}
                  >
                    {labels.clear}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
        {/* <Snackbar
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
      </Snackbar> */}
      </Paper>
    </>
  );
};

export default Index;
