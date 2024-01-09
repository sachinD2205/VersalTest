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
import urls from "../../../../URLS/urls";
import TeacherClassTimeTable from "../../../../components/school/TeacherClassTimeTable";
import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
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
  const [allTeachersList, setAllTeachersList] = useState([]);
  const [classTimetableReport, setClassTimetableReport] = useState();
  const [classTimetableTeachersReport, setClassTimetableTeachersReport] =
    useState();
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState("none");
  const [sub, setSub] = useState([]);

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
  // console.log("ooo",subjectList)
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

  const getSchoolList = () => {
    axios
      .get(`${urls.SCHOOL}/mstSchool/getSchoolByUserId?userId=${user?.id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setSchoolList(
          r.data.map((row) => ({
            id: row.id,
            schoolName: row.schoolName,
            schoolNameMr: row.schoolNameMr,
          }))
        );
      })
      .catch((e) => {
        //catchExceptionHandlingMethod(e, language);
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
        setAllTeachersList(
          r.data.mstTeacherList.map((row) => ({
            id: row.id,
            teacherName: `${row?.firstName} ${row?.middleName} ${row?.lastName}`,
          }))
        );
      })
      .catch((e) => {
        //catchExceptionHandlingMethod(e, language);
        callCatchMethod(e, language);
      });
  };

  const getDivision = () => {
    axios
      .get(`${urls.SCHOOL}/mstDivision/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        // console.log("res", r?.data);
        setDivisionList(r?.data?.mstDivisionList);
      })
      .catch((e) => {
        //catchExceptionHandlingMethod(e, language);
        callCatchMethod(e, language);
      });
  };
  const getSubject = () => {
    axios
      .get(`${urls.SCHOOL}/mstAcademicSubject/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        // console.log("res", r?.data);
        setSub(r?.data?.mstAcademicSubjectList);
      })
      .catch((e) => {
        //catchExceptionHandlingMethod(e, language);
        callCatchMethod(e, language);
      });
    // }
  };
  useEffect(() => {
    getAllTeacherList();
    getSchoolList();
    getSubject();
    getDivision();
  }, []);

  const getTeacherList = () => {
    if (schoolId && allTeachersList) {
      axios
        // .get(`${urls.SCHOOL}/mstTeacher/getTeacherList?schoolKey=${schoolId}`)
        .get(
          `${urls.SCHOOL}/mstTeacherSubjectMapping/getListOfTeacherOnSchoolId?schoolKey=${schoolId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          console.log("mstTeacher", r);
          const teachersList = r.data?.map(({ id, teacherId }) => ({
            value: id,
            teacherId: teacherId,
            label: allTeachersList?.find((i) => i?.id === teacherId)
              ?.teacherName,
          }));
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
    getTeacherList();
    // console.log("teacherList", teacherList);
  }, [schoolId, classId, academicYearId, divisionId, allTeachersList]);

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

  const findReport = async (formValue) => {
    // console.log("ooo", formValue);
    // setLoading(true);
    let body = {
      schoolKey: formValue.schoolId,
      teacherKey: formValue.teacherKey,
    };
    axios
      .post(`${urls.SCHOOL}/trnClassTimetable/teacherTimeTable`, body, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r.status === 200) {
          console.log("main", r?.data?.dayWiseDao);

          if (r?.data?.dayWiseDao?.length > 0) {
            let _classTimeTable = {
              ...r?.data,
              schoolNameMr: schoolList?.find(
                (i) => i?.id === r?.data?.schoolKey
              )?.schoolNameMr,
              dayWiseDao: r?.data?.dayWiseDao?.map((i) => {
                return {
                  ...i,
                  teacherAssginTimeAndDivisionDao:
                    i?.teacherAssginTimeAndDivisionDao?.map((r) => {
                      return {
                        ...r,
                        divisionName: divisionList?.find(
                          (div) => div?.id === r?.divisionKey
                        )?.divisionName,
                        subjectName: sub?.find(
                          (sub) => sub?.id === r?.subjectKey
                        )?.subjectName,
                      };
                    }),
                };
              }),
            };
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
      });
    setIsReady("none");
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
                {labels.teacherClassTimetableReport}
              </h2>
            </Grid>
          </Grid>
          <Paper style={{ display: isReady }}>
            {console.log("ppp", classTimetableReport)}
            {classTimetableReport && (
              <TeacherClassTimeTable
                ref={componentRef}
                data={classTimetableReport}
                sub={sub}
                language={language}
                teacherSubData={classTimetableTeachersReport}
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
                                  {language == "en"
                                    ? school?.schoolName
                                    : school?.schoolNameMr}
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
                      <InputLabel required error={!!errors.teacherKey}>
                        {labels.selectTeacher}
                      </InputLabel>
                      <Controller
                        control={control}
                        name="teacherKey"
                        rules={{ required: true }}
                        defaultValue=""
                        render={({ field }) => (
                          <Select variant="standard" {...field}>
                            {teacherList &&
                              teacherList.map((teacher) => (
                                <MenuItem
                                  key={teacher.value}
                                  value={teacher.teacherId}
                                >
                                  {teacher.label}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                      />
                      <FormHelperText error={!!errors.teacherKey}>
                        {errors.teacherKey ? labels.academicYearRequired : null}
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
                    // disabled={loading}
                  >
                    <span>{labels.generateReport}</span>
                  </Button>

                  <Button
                    // disabled={loading}
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
