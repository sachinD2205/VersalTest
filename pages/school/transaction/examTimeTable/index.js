import { EditFilled, SaveFilled } from "@ant-design/icons";
import {
  Add,
  CancelOutlined,
  ClearOutlined,
  Delete,
  SearchOutlined,
  UpdateOutlined,
} from "@mui/icons-material";
import axios from "axios";
import * as yup from "yup";
import {
  Alert,
  Autocomplete,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowModes,
  GridToolbar,
  useGridApiContext,
} from "@mui/x-data-grid";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { nanoid } from "nanoid";
import moment from "moment";

import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useRef, useState } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import swal from "sweetalert";
import StudentsMarksReportToPrint from "../../../../components/school/StudentsMarksReportToPrint";
import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
import urls from "../../../../URLS/urls";
import { Divider, Typography } from "antd";
import examtimeTableSchema from "../../../../containers/schema/school/transactions/examTimeTableScema";
import EditIcon from "@mui/icons-material/Edit";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import Loader from "../../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const [schoolList, setSchoolList] = useState([]);
  const [academicYearList, setAcademicYearList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [examList, setExamList] = useState([]);
  const [grades, setGrades] = useState([]);
  const [termList, setTermList] = useState([
    { id: 1, termName: "Term 1" },
    { id: 2, termName: "Term 2" },
  ]);
  const [marks, setMarks] = useState([]);
  const [rowModes, setRowModes] = useState({});
  const [loading, setLoading] = useState(false);

  const [sem1MarksPrintData, setSem1MarksPrintData] = useState();
  const [sem2MarksPrintData, setSem2MarksPrintData] = useState();
  const [finalGrade, setFinalGrade] = useState();
  const [studentPrintData, setStudentPrintData] = useState();
  const [isReady, setIsReady] = useState("none");

  const [error, setError] = useState(null);

  // **********my states************
  const [updateId, setupdateId] = useState();
  const [deleteId, setdeleteId] = useState();
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [isDisabledSaveButton, setIsDisabledSaveButton] = useState(true);
  const [newRowTimetableText, setNewRowTimetableText] = useState("New");
  const [examTimeTableDao, setexamTimeTableDao] = useState([]);
  const [timeTableArray, settimeTableArray] = useState([]);
  // **********my states************
  const [id, setId] = useState();
  const language = useSelector((state) => state?.labels?.language);

  const [labels, setLabels] = useState(schoolLabels[language ?? "en"]);

  useEffect(
    () => setLabels(schoolLabels[language ?? "en"]),
    [setLabels, language]
  );
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(examtimeTableSchema),
    mode: "onChange",
    defaultValues: {
      id: null,
    },
  });
  const {
    watch,
    control,
    trigger,
    reset,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = methods;

  // const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
  //   control, // control props comes from useForm (optional: if you are using FormContext)
  //   // name: "timeTableData", // unique name for your Field Array
  // });

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

  const schoolKey = watch("schoolKey");
  const academicYearKey = watch("academicYearKey");
  const classKey = watch("classKey");
  const examKey = watch("examName");
  const termKey = watch("term");
  const student = watch("student");

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
        // catchExceptionHandlingMethod(e, language);
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
        // catchExceptionHandlingMethod(e, language);
        callCatchMethod(e, language);
      }
    };
    Promise.all([getSchoolList(), getAcademicYearList()]);
  }, [setError, setValue]);

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
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  useEffect(() => {
    getExamList();
  }, [termKey]);

  const [subjectList, setSubjectList] = useState([]);
  const getSubjectList = () => {
    if (schoolKey && classKey && academicYearKey) {
      axios
        .get(
          // `${urls.SCHOOL}/mstAcademicSubject/getFilterSubject?schoolKey=${schoolId}&academicYearKey=${academicYearId}&classKey=${classId}&divisionKey=${divisionId}`,
          `${urls.SCHOOL}/mstAcademicSubject/getFilterSubjectOnClassKeySchoolAndacademicYear?schoolKey=${schoolKey}&academicYearKey=${academicYearKey}&classKey=${classKey}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          console.log("res");
          const subjectList = r.data?.map(({ id, subjectName }) => ({
            value: id,
            label: subjectName,
          }));
          setSubjectList(subjectList);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };
  useEffect(() => {
    getSubjectList();
  }, [schoolKey, classKey, academicYearKey]);
  useEffect(() => {
    console.log("btnSaveText", btnSaveText);
  }, [btnSaveText]);
  // console.log("subjectList", subjectList);

  const getExamTimetableList = () => {
    if (schoolKey && academicYearKey && classKey && termKey && examKey) {
      axios
        .get(
          // `${urls.SCHOOL}/mstExam/getDataAsperTerm?schoolKey=${schoolId}&academicYearKey=${academicYearId}&classKey=${classId}&divisionKey=${divisionId}&termKey=${term}`
          // `${urls.SCHOOL}/mstExam/getDataAsperTerm1?schoolKey=${schoolKey}&academicYearKey=${academicYearKey}&classKey=${classKey}&termKey=${term}`
          `${urls.SCHOOL}/trnExamClassTimeTableController/getClassTimeTable?classKey=${classKey}&schoolkey=${schoolKey}&academicYearKey=${academicYearKey}&term=${termKey}&examName=${examKey}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          console.log("Reuuuuuuu", r);
          if (r?.data?.examTimeTableDao?.length > 0) {
            setBtnSaveText("Update");
            setId(r.data.id);
            settimeTableArray(
              r?.data?.examTimeTableDao?.map((row) => ({
                id: row.id,
                activeFlag: row.activeFlag,
                dateOfExam: row.dateOfExam,
                fromTime: row.fromTime,
                toTime: row.toTime,
                subjectKey: row.subjectKey,
                subjectName: subjectList?.find(
                  (sub) => sub.value === row.subjectKey
                )?.label,
                outOfMarks: row.outOfMarks,
                minimumMark: row.minimumMark,
              }))
            );
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  useEffect(() => {
    getExamTimetableList();
  }, [
    schoolKey,
    academicYearKey,
    classKey,
    termKey,
    examKey,
    setValue,
    setError,
  ]);

  const isDisableAddSubndTime = () => {};
  const resetValues = () => {
    // setValue()
    setValue("dateOfExam", null),
      setValue("fromTime", null),
      setValue("toTime", null),
      setValue("subjectKey", "");
    setValue("minimumMark", "");
    setValue("outOfMarks", "");
  };

  // useEffect(() => {
  //   if (
  //     watch("fromTime") === "" ||
  //     watch("fromTime") === null ||
  //     watch("toTime") === "" ||
  //     watch("toTime" === null) ||
  //     watch("subjectKey") === "" ||
  //     watch("subjectKey" === null) ||
  //     watch("minimumMark") === "" ||
  //     watch("minimumMark" === null) ||
  //     watch("outOfMarks") === "" ||
  //     watch("outOfMarks" === null)
  //   ) {
  //     setIsDisabledSaveButton(true);
  //   } else {
  //     return setIsDisabledSaveButton(false);
  //   }
  // }, [
  //   watch("fromTime"),
  //   watch("toTime"),
  //   watch("subjectKey"),
  //   watch("minimumMark"),
  //   watch("outOfMarks"),
  // ]);

  // console.log("timeTableArray",timeTableArray);
  const finalSubmit = (formData) => {
    console.log("23423", formData);
    let tempdata = {
      fromTime: moment(formData?.fromTime).format("HH:mm:ss"),
      toTime: moment(formData?.toTime).format("HH:mm:ss"),
      subjectKey: formData?.subjectKey,
      minimumMark: formData?.minimumMark,
      outOfMarks: formData?.outOfMarks,
      dateOfExam: formData?.dateOfExam,
      activeFlag: "Y",
    };

    // if previous data not exist
    if (btnSaveText == "Save") {
      let _data = {
        ...formData,
        // id: id,
        activeFlag: "Y",
        examTimeTableDao: [...examTimeTableDao, tempdata],
      };
      console.log("formData", _data);
      setLoading(true);
      axios
        .post(`${urls.SCHOOL}/trnExamClassTimeTableController/save`, _data, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setLoading(false);
          if (res.status == 200 || res.status == 201) {
            setId(res?.data?.message.slice(4));
            // sweetAlert(
            //   "Success!",
            //   "Class Timetable Created Successfully !",
            //   "success"
            // );
            sweetAlert({
              title: language === "en" ? "Saved " : "जतन केले",
              text:
                language === "en"
                  ? "Class Timetable Added Successfully !"
                  : "वर्ग वेळापत्रक यशस्वीरित्या तयार केले !",
              icon: "success",
            });
            isDisableAddSubndTime();
            getExamTimetableList();
            resetValues();
          }
        })
        .catch((e) => {
          setLoading(false);
          callCatchMethod(e, language);
          // catchExceptionHandlingMethod(e, language);
          // sweetAlert(
          //   "Error",
          //   e?.message ? e?.message : "Something Went Wrong",
          //   "error"
          // );
          // console.log("Eroor", e);
        });

      // if data exist then Update timetable
    }
    // if previous data exist then updating only examTimeTableDao
    else if (btnSaveText === "Update") {
      let _updatedTimetable;
      // for editing the examTimeTableDao row
      if (newRowTimetableText === "UpdateRow") {
        _updatedTimetable = timeTableArray?.map((obj) => {
          if (obj.id === updateId) {
            return {
              ...tempdata,
              id: updateId,
            };
          } else {
            return obj;
          }
        });
      }
      // for adding the new examTimeTableDao row into the existing data
      else {
        _updatedTimetable = [...timeTableArray, { ...tempdata, id: null }];
      }
      let _timetableData = {
        ...formData,
        activeFlag: "Y",
        id: id,
        examTimeTableDao: _updatedTimetable,
      };
      setLoading(true);
      axios
        .post(
          `${urls.SCHOOL}/trnExamClassTimeTableController/save`,
          _timetableData,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          setLoading(false);
          if (res.status == 200 || res.status == 201) {
            // sweetAlert(
            //   "Success!",
            //   "Class Timetable updated Successfully !",
            //   "success"
            // );
            sweetAlert({
              title: language === "en" ? "Saved " : "जतन केले",
              text:
                language === "en"
                  ? "Class Timetable Updated Successfully !"
                  : "वर्गाचे वेळापत्रक यशस्वीरित्या अपडेट केले!",
              icon: "success",
            });
            isDisableAddSubndTime();
            getExamTimetableList();
            setNewRowTimetableText("New");
            resetValues();
          }
        })
        .catch((e) => {
          setLoading(false);
          // catchExceptionHandlingMethod(e, language);
          callCatchMethod(e, language);
          // sweetAlert(
          //   "Error",
          //   e?.message ? e?.message : "Something Went Wrong",
          //   "error"
          // );
          // console.log("Eroor", e);
        });
    }
  };

  // delete timetable row
  const handleDelete = (deleteData) => {
    console.log("deleteData", deleteData);
    let _deletedRow = timeTableArray?.map((obj) => {
      if (obj.id === deleteData?.id) {
        return {
          ...obj,
          activeFlag: "N",
        };
      } else {
        return obj;
      }
    });
    console.log("_deletedRow", _deletedRow);

    let _body = {
      activeFlag: "Y",
      schoolKey: schoolKey,
      academicYearKey: academicYearKey,
      classKey: classKey,
      term: termKey,
      examName: examKey,
      id: id,
      examTimeTableDao: _deletedRow,
    };
    setLoading(true);

    axios
      .post(`${urls.SCHOOL}/trnExamClassTimeTableController/save`, _body, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setLoading(false);
        if (res.status == 200 || res.status == 201) {
          console.log("delRes", res);
          sweetAlert({
            title: language === "en" ? "Success ! " : "यशस्वी !",
            text:
              language === "en"
                ? "Deleted Successfully !"
                : "यशस्वीरित्या हटवले !",
            icon: "success",
          });
          // sweetAlert("Success!", "Deleted Successfully !", "success");
          // setId(res.data.message.slice(4));
          isDisableAddSubndTime();
          getExamTimetableList();
          setNewRowTimetableText("New");
        }
      })
      .catch((e) => {
        setLoading(false);
        callCatchMethod(e, language);
        // catchExceptionHandlingMethod(e, language);
        // sweetAlert(
        //   "Error",
        //   e?.message ? e?.message : "Something Went Wrong",
        //   "error"
        // );
        console.log("Eroor", e);
      });
  };

  const columns = [
    {
      field: "dateOfExam",
      align: "center",
      headerAlign: "center",
      headerName: labels.date,
      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
      flex: 1,
    },
    {
      field: "fromTime",
      align: "center",
      headerAlign: "center",
      headerName: labels.fromTime,
      flex: 1,
    },
    {
      field: "toTime",
      align: "center",
      headerAlign: "center",
      headerName: labels.toTime,
      flex: 1,
    },
    {
      field: "subjectName",
      align: "center",
      headerAlign: "center",
      headerName: labels.subject,
      flex: 1,
    },
    {
      field: "minimumMark",
      align: "center",
      headerAlign: "center",
      headerName: labels.minimumMarks,
      flex: 1,
    },
    {
      field: "outOfMarks",
      align: "center",
      headerAlign: "center",
      headerName: labels.outOfMarks,
      flex: 1,
    },

    {
      field: "actions",
      align: "center",
      headerAlign: "center",
      headerName: labels.actions,
      width: 80,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              sx={{ color: "red" }}
              onClick={() => {
                handleDelete(params.row);
                console.log("delParams", params.row);
              }}
            >
              <Delete />
            </IconButton>

            <IconButton
              onClick={() => {
                console.log("params", params?.row);
                setValue("fromTime", moment(params?.row?.fromTime, "HH:mm a"));
                setValue("toTime", moment(params?.row?.toTime, "HH:mm a"));
                setValue("dateOfExam", params?.row?.dateOfExam);
                setValue("minimumMark", params?.row?.minimumMark);
                setValue("outOfMarks", params?.row?.outOfMarks);
                setValue("subjectKey", params?.row?.subjectKey);
                setupdateId(params?.row?.id);
                setNewRowTimetableText("UpdateRow");
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    console.log("timeTableArray");
  }, [timeTableArray]);

  // view
  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      {loading ? (
        <Loader />
      ) : (
        <Paper
          variant="outlined"
          sx={{
            border: 1,
            borderColor: "grey.500",
            marginLeft: "10px",
            marginRight: "10px",
            padding: 1,
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
                <h2 style={{ marginBottom: 0 }}>{labels.examTimetable}</h2>
              </Grid>
            </Grid>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(finalSubmit)}>
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
                                  <MenuItem key={school.id} value={school?.id}>
                                    {language == "en"
                                      ? school?.schoolName
                                      : school?.schoolNameMr}
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
                  </Grid>
                  <Grid
                    container
                    direction="row"
                    display="flex"
                    spacing={4}
                    justifyContent="center"
                  >
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
                                termList.map((term) => (
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
                                examList.map((exam) => (
                                  <MenuItem key={exam.id} value={exam.id}>
                                    {exam.examName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText error={!!errors.examName}>
                          {errors.examName ? labels.examRequired : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>

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
                      {/* <h2 style={{ marginBottom: 0 }}>{labels.timeAndSub}</h2> */}
                      <h2 style={{ marginBottom: 0 }}>{labels.addTimetable}</h2>
                    </Grid>
                  </Grid>
                  {/* {fields.map((item, index) => ( */}

                  <Grid
                    container
                    spacing={2}
                    style={{
                      // padding: "10px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {/* ////////////////////////////////////////// */}
                    <Grid
                      item
                      lg={4}
                      md={4}
                      sm={6}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Controller
                        control={control}
                        name="dateOfExam"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              disablePast
                              inputFormat="DD/MM/YYYY"
                              renderInput={(props) => (
                                <TextField
                                  {...props}
                                  variant="standard"
                                  fullWidth
                                  sx={{ width: 130 }}
                                  size="small"
                                  error={errors.dateOfExam}
                                  helperText={
                                    errors.dateOfExam
                                      ? labels.examDateRequired
                                      : null
                                  }
                                />
                              )}
                              // label={labels.dateOfExam}
                              label={labels.examDate}
                              value={field.value}
                              onChange={(date) =>
                                field.onChange(
                                  moment(date).format("YYYY-MM-DD")
                                )
                              }
                            />
                          </LocalizationProvider>
                        )}
                      />
                    </Grid>
                    {/* ////////////////////////////////////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={2}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl>
                        <Controller
                          control={control}
                          name="fromTime"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <TimePicker
                                label={labels.fromTime}
                                value={field.value}
                                inputFormat="HH:mm a"
                                onChange={(time) => {
                                  field.onChange(
                                    moment(time).format("YYYY-MM-DDTHH:mm")
                                  );
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    error={!!errors.fromTime}
                                    fullWidth
                                    variant="standard"
                                    sx={{ width: 120 }}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText error={!!errors.fromTime}>
                          {errors.fromTime ? labels.examFromTimeRequired : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl>
                        <Controller
                          control={control}
                          name="toTime"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <TimePicker
                                label={labels.toTime}
                                inputFormat="HH:mm a"
                                value={field.value}
                                onChange={(time) => {
                                  field.onChange(
                                    moment(time).format("YYYY-MM-DDTHH:mm")
                                  );
                                  // field.onChange(moment(time).format("HH:mm a"));
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    error={!!errors.toTime}
                                    fullWidth
                                    variant="standard"
                                    sx={{ width: 120 }}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText error={!!errors.toTime}>
                          {errors.toTime ? labels.examToTimeRequired : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl>
                        <InputLabel required error={!!errors.subjectKey}>
                          {labels.selectSubject}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="subjectKey"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select
                              sx={{ width: 150 }}
                              variant="standard"
                              {...field}
                            >
                              {subjectList &&
                                subjectList.map((sub, i) => (
                                  <MenuItem key={i} value={sub.value}>
                                    {sub.label}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText error={!!errors.subjectKey}>
                          {errors.subjectKey ? labels.subNameRequired : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={2}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        // marginLeft:"60px"
                      }}
                    >
                      <TextField
                        style={{ backgroundColor: "white", width: "130px" }}
                        id="minimumMark"
                        rules={{ required: true }}
                        name="minimumMark"
                        label={labels.minimumMarks}
                        variant="standard"
                        {...register(`minimumMark`)}
                        error={!!errors.minimumMark}
                        InputLabelProps={{
                          shrink:
                            watch("minimumMark") == "" || null ? false : true,
                        }}
                        helperText={
                          errors.minimumMark
                            ? labels.minimumMarksRequired
                            : null
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        style={{ backgroundColor: "white", width: "130px" }}
                        id="outOfMarks"
                        rules={{ required: true }}
                        name="outOfMarks"
                        label={labels.outOfMarks}
                        variant="standard"
                        {...register(`outOfMarks`)}
                        error={!!errors.outOfMarks}
                        InputLabelProps={{
                          shrink:
                            watch("outOfMarks") == "" || null ? false : true,
                        }}
                        helperText={
                          errors.outOfMarks ? labels.outOfMarksRequired : null
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={2}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={
                          watch("fromTime") &&
                          watch("toTime") &&
                          watch("subjectKey") &&
                          watch("minimumMark") &&
                          watch("outOfMarks")
                            ? false
                            : true
                        }
                        // disabled={isDisableAddSubndTime()}
                        endIcon={<Add />}
                      >
                        {labels.save}
                      </Button>
                    </Grid>

                    {/* table************ */}
                    <Grid
                      container
                      display="flex"
                      justifyContent="center"
                      justifyItems="center"
                      marginTop="30px"
                      marginLeft="15px"
                      padding={2}
                      sx={{
                        background:
                          "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                      }}
                    >
                      <Grid item>
                        <h2 style={{ marginBottom: 0 }}>{labels.timetable}</h2>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <DataGrid
                        autoHeight
                        sx={{
                          "& .cellColor": {
                            backgroundColor: "#556CD6",
                            color: "white",
                          },
                        }}
                        rows={timeTableArray ? timeTableArray : []}
                        //@ts-ignore
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        disableSelectionOnClick
                        experimentalFeatures={{ newEditingApi: true }}
                      />
                    </Grid>

                    {/* table************ */}
                  </Grid>
                  {/* ))} */}
                </Grid>
              </form>
            </FormProvider>
          </Grid>
        </Paper>
      )}
    </>
  );
};

export default Index;
