import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";

import moment from "moment";

import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
import timeTableSchema from "../../../../containers/schema/school/transactions/timeTableSchema";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import Loader from "../../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

// const schema = {

//   teacherKey: yup.string().required("required"),
//   subjectKey: yup.string().required("required"),

// }
// let fieldArraySchema = yup.object().shape({
//   excavationData: yup.array().of(yup.object().shape(schema)),
//   timeTableSchema: yup.array().of(yup.object().shape(timeTableSchema)),
// })

const Index = () => {
  const language = useSelector((state) => state?.labels?.language);
  const userToken = useGetToken();

  const [labels, setLabels] = useState(schoolLabels[language ?? "en"]);

  const [timeTableDao, setTimeTableDao] = useState([]);
  const [timeTableDaoTable, setTimeTableDaoTable] = useState([]);
  const [allDays, setAllDays] = useState([]);

  useEffect(
    () => setLabels(schoolLabels[language ?? "en"]),
    [setLabels, language]
  );

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(timeTableSchema),
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
    getValues,
    append,
    formState: { errors },
  } = methods;
  const router = useRouter();

  //all states
  const [btnSaveText, setBtnSaveText] = useState("Add");
  const [ID, setId] = useState();
  const [loading, setLoading] = useState(false);
  const [schoolList, setSchoolList] = useState([]);
  const [teacherList, setTeacherList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [error, setError] = useState(null);
  const [academicYearList, setAcademicYearList] = useState([]);
  const [fillteredTeacherList, setFillteredTeacherList] = useState([]);
  const [teacherWiseSubjectList, setTeacherWiseSubjectList] = useState([]);
  const [authority, setAuthority] = useState([]);
  let user = useSelector((state) => state.user.user);
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
  const schoolKey = watch("schoolKey");
  const academicYearId = watch("academicYearId");
  const classId = watch("classId");
  const divisionKey = watch("divisionKey");

  let dayList = [
    { value: 1, lable: "Monday" },
    { value: 2, lable: "Tuesday" },
    { value: 3, lable: "Wednesday" },
    { value: 4, lable: "Thursday" },
    { value: 5, lable: "Friday" },
    { value: 6, lable: "Saturday" },
  ];

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

  //All api calls
  useEffect(() => {
    // getSchoolList();
    getTeacherList();
    getSubjectList();
    // getAcademicYearList();
  }, []);
  // let schoolKey = watch("schoolKey")

  useEffect(() => {
    const getSchoolList = async () => {
      try {
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
        const academicYears = data?.mstAcademicYearList.map(
          ({ id, academicYear }) => ({ id, academicYear })
        );
        setAcademicYearList(academicYears);
      } catch (e) {
        setError(e.message);
        callCatchMethod(e, language);
      }
    };
    Promise.all([getSchoolList(), getAcademicYearList()]);
  }, [setError, setValue]);
  const getTeacherList = () => {
    axios
      .get(`${urls.SCHOOL}/mstTeacher/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        console.log("mstTeacher", r.data.mstTeacherList);
        setTeacherList(
          r.data.mstTeacherList.map((row) => ({
            id: row.id,
            teacherName:
              row.firstName + " " + row.middleName + " " + row.lastName,
          }))
        );
      })
      .catch((e) => {
        callCatchMethod(e, language);
      });
  };
  console.log("teacherList", teacherList);

  const getSubjectList = () => {
    axios
      .get(`${urls.SCHOOL}/mstAcademicSubject/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        console.log("mstsub", r.data.mstAcademicSubjectList);
        setSubjectList(
          r.data.mstAcademicSubjectList.map((row) => ({
            id: row.id,
            subjectId: row.subjectName,
          }))
        );
      })
      .catch((e) => {
        callCatchMethod(e, language);
      });
  };
  console.log("11subjectList", subjectList);
  useEffect(() => {
    const getClassList = async () => {
      if (schoolKey == null || schoolKey === "") {
        // setValue("classId", "");

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
        const classes = data?.mstClassList.map(({ id, className }) => ({
          id,
          className,
        }));
        setClassList(classes);
      } catch (e) {
        setError(e.message);
        callCatchMethod(e, language);
      }
    };
    getClassList();
  }, [schoolKey, setValue, setError]);

  const getdivList = () => {
    // console.log("iii",schoolKey,classId);
    if (schoolKey && classId) {
      axios
        .get(
          `${urls.SCHOOL}/mstDivision/getAllDivisionByClass?schoolKey=${schoolKey}&classKey=${classId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          console.log("iiiii", r.data.mstDivisionList);
          setDivisionList(
            r.data.mstDivisionList.map((row) => ({
              id: row.id,
              divisionName: row.divisionName,
            }))
          );
        })
        .catch((e) => {
          callCatchMethod(e, language);
        });
    }
  };

  const handleGo = () => {
    // console.log(";", watch("fromTime"));
    // console.log(";", watch("toTime"));
    // console.log(";", watch("weekDayKey"));
    // console.log("schoolId", watch("schoolKey"));
    let _body = {
      fromTime: watch("fromTime"),
      toTime: watch("toTime"),
      weekDayKey: watch("weekDayKey"),
      schoolKey: watch("schoolKey"),
    };
    if (watch("fromTime") && watch("toTime") && watch("weekDayKey")) {
      setLoading(true);
      axios
        .post(`${urls.SCHOOL}/mstTeacherSubjectMapping/getTeacherList`, _body, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          setLoading(false);
          console.log("1iiiii1", r?.data);
          setFillteredTeacherList(
            r?.data
              ?.filter((obj) => obj?.teacherId !== null)
              ?.map((row) => ({
                id: row?.id,
                teacherId: row?.teacherId,
              }))
          );
        })
        .catch((e) => {
          setLoading(false);
          callCatchMethod(e, language);
          // sweetAlert(
          //   "Error",
          //   e?.message ? e?.message : "Something Went Wrong",
          //   "error"
          // );
          console.log("Eroor", e);
        });
    }
  };
  // console.log("fillteredTeacherList", fillteredTeacherList);
  // console.log("teacherkeyyy", watch("teacherKey"));

  const getTeacherWiseSubjectList = () => {
    if (watch(`teacherKey${watch("weekDayKey")}`)) {
      setLoading(true);
      axios
        .get(
          `${
            urls.SCHOOL
          }/mstTeacherSubjectMapping/getSubjectOnTeacher?teacherId=${watch(
            `teacherKey${watch("weekDayKey")}`
          )}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          setLoading(false);
          console.log("teasub", r);
          setTeacherWiseSubjectList(
            r?.data?.map((row) => ({
              id: row.id,
              subjectId: row.subjectId,
            }))
          );
        })
        .catch((e) => {
          setLoading(false);
          callCatchMethod(e, language);
        });
    }
  };
  console.log("teacherWiseSubjectList", teacherWiseSubjectList);
  useEffect(() => {
    getdivList();
    getTeacherWiseSubjectList();
  }, [schoolKey, classId, watch(`teacherKey${watch("weekDayKey")}`)]);

  const updateTimeTableDao = () => {
    console.log("timeTableDao", allDays);
    setTimeTableDao([
      ...timeTableDao,
      {
        fromTime: moment(watch("fromTime")).format("HH:mm:ss"),
        toTime: moment(watch("toTime")).format("HH:mm:ss"),
        periodDao: allDays,
      },
    ]);

    let subjectKey1 = allDays?.find((day) => day?.weekDayKey === 1)?.subjectKey;
    let teacherKey1 = allDays?.find((day) => day?.weekDayKey === 1)?.teacherKey;
    let monSubName = subjectList?.find(
      (sub) => sub.id === subjectKey1
    )?.subjectId;
    let monTeacherName = teacherList?.find(
      (i) => i.id === teacherKey1
    )?.teacherName;

    let subjectKey2 = allDays?.find((day) => day?.weekDayKey === 2)?.subjectKey;
    let teacherKey2 = allDays?.find((day) => day?.weekDayKey === 2)?.teacherKey;
    let tueSubName = subjectList?.find(
      (sub) => sub.id === subjectKey2
    )?.subjectId;
    let tueTeacherName = teacherList?.find(
      (i) => i.id === teacherKey2
    )?.teacherName;

    let subjectKey3 = allDays?.find((day) => day?.weekDayKey === 3)?.subjectKey;
    let teacherKey3 = allDays?.find((day) => day?.weekDayKey === 3)?.teacherKey;
    let wedSubName = subjectList?.find(
      (sub) => sub.id === subjectKey3
    )?.subjectId;
    let wedTeacherName = teacherList?.find(
      (i) => i.id === teacherKey3
    )?.teacherName;

    let subjectKey4 = allDays?.find((day) => day?.weekDayKey === 4)?.subjectKey;
    let teacherKey4 = allDays?.find((day) => day?.weekDayKey === 4)?.teacherKey;
    let thuSubName = subjectList?.find(
      (sub) => sub.id === subjectKey4
    )?.subjectId;
    let thuTeacherName = teacherList?.find(
      (i) => i.id === teacherKey4
    )?.teacherName;

    let subjectKey5 = allDays?.find((day) => day?.weekDayKey === 5)?.subjectKey;
    let teacherKey5 = allDays?.find((day) => day?.weekDayKey === 5)?.teacherKey;
    let friSubName = subjectList?.find(
      (sub) => sub.id === subjectKey5
    )?.subjectId;
    let friTeacherName = teacherList?.find(
      (i) => i.id === teacherKey5
    )?.teacherName;

    let subjectKey6 = allDays?.find((day) => day?.weekDayKey === 6)?.subjectKey;
    let teacherKey6 = allDays?.find((day) => day?.weekDayKey === 6)?.teacherKey;
    let satSubName = subjectList?.find(
      (sub) => sub.id === subjectKey6
    )?.subjectId;
    let satTeacherName = teacherList?.find(
      (i) => i.id === teacherKey6
    )?.teacherName;

    setTimeTableDaoTable([
      ...timeTableDaoTable,
      {
        fromTime: moment(watch("fromTime")).format("HH:mm:ss"),
        toTime: moment(watch("toTime")).format("HH:mm:ss"),

        subjectKey1,
        teacherKey1,
        mon:
          monSubName && monTeacherName
            ? `${monSubName} ( ${monTeacherName} )`
            : "",

        subjectKey2,
        teacherKey2,
        tue:
          tueSubName && tueTeacherName
            ? `${tueSubName} ( ${tueTeacherName} )`
            : "",

        subjectKey3,
        teacherKey3,
        wed:
          wedSubName && wedTeacherName
            ? `${wedSubName} ( ${wedTeacherName} )`
            : "",

        subjectKey4,
        teacherKey4,
        thu:
          thuSubName && thuTeacherName
            ? `${thuSubName} ( ${thuTeacherName} )`
            : "",

        subjectKey5,
        teacherKey5,
        fri:
          friSubName && friTeacherName
            ? `${friSubName} ( ${friTeacherName} )`
            : "",

        subjectKey6,
        teacherKey6,
        sat:
          satSubName && satTeacherName
            ? `${satSubName} ( ${satTeacherName} )`
            : "",

        // @ts-ignore
        id: (timeTableDaoTable[timeTableDaoTable?.length - 1]?.id ?? 0) + 1,
      },
    ]);

    setDefaulValues();
    setAllDays([]);
  };

  console.log("TableData", timeTableDaoTable);

  const finalSubmit = () => {
    if (timeTableDao?.length > 0) {
      let _body = {
        divisionKey: watch("divisionKey"),
        schoolKey: watch("schoolKey"),
        academicYearKey: watch("academicYearId"),
        classKey: watch("classId"),
        timeTableDao: timeTableDao,
      };

      sweetAlert({
        title: "Confirmation",
        text: "Are you sure you want to add ?",
        icon: "warning",
        buttons: ["Cancel", "Save"],
      }).then((ok) => {
        if (ok) {
          setLoading(true);
          axios
            .post(`${urls.SCHOOL}/trnClassTimetable/save`, _body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((r) => {
              setLoading(false);
              console.log("aaaaa", "Successs");
              if (r.status == 200 || r.status == 201) {
                sweetAlert({
                  title: language === "en" ? "Saved ! " : "जतन केले !",
                  text:
                    language === "en"
                      ? "Class Timetable Created Successfully !"
                      : "वर्ग वेळापत्रक यशस्वीरित्या तयार केले !",
                  icon: "success",
                });
                // sweetAlert(
                //   "Success!",
                //   "Class Timetable Created Successfully !",
                //   "success"
                // );
                router.push({
                  pathname: "/school/dashboard",
                });
                // getTimetableData()
              }
            })
            .catch((e) => {
              setLoading(false);
              callCatchMethod(e, language);
              // sweetAlert(
              //   "Error",
              //   e?.message ? e?.message : "Something Went Wrong",
              //   "error"
              // );
              console.log("Eroor", e);
            });
        }
      });
    } else {
      sweetAlert("Alert!", "Please fill the all data !", "error");
    }
  };

  const setDefaulValues = () => {
    setValue("fromTime", null);
    setValue("toTime", null);
    setValue("weekDayKey", "");
    setValue("teacherKey1", "");
    setValue("subjectKey1", "");
    setValue("teacherKey2", "");
    setValue("subjectKey2", "");
    setValue("teacherKey3", "");
    setValue("subjectKey3", "");
    setValue("teacherKey4", "");
    setValue("subjectKey4", "");
    setValue("teacherKey5", "");
    setValue("subjectKey5", "");
    setValue("teacherKey6", "");
    setValue("subjectKey6", "");
  };
  console.log("timeTableDao111", timeTableDao);
  const onSubmit = () => {
    const body = {
      ...getValues(),
      timeTableDao,
    };
    // final wala api call karne and pass above body
  };

  const saveDay = (weekDay) => {
    let body = {
      teacherKey: watch(`teacherKey${weekDay}`),
      subjectKey: watch(`subjectKey${weekDay}`),
      divisionKey: watch("divisionKey"),
      schoolKey: watch("schoolKey"),
      academicYearId: watch("academicYearId"),
      // fromTime:watch("fromTime"),
      fromTime: moment(watch("fromTime")).format("HH:mm:ss"),
      toTime: moment(watch("toTime")).format("HH:mm:ss"),

      // toTime:watch("toTime"),
      weekDayKey: watch("weekDayKey"),
    };
    console.log("bodyyyyy", body);

    setAllDays([
      ...(allDays && allDays?.filter((r) => r.weekDayKey != body?.weekDayKey)),
      { ...body },
    ]);

    sweetAlert({
      title: language === "en" ? "Confirmation !" : "पुष्टी !",
      text:
        language === "en"
          ? "Are you sure you want to add ?"
          : "तुम्हाला नक्की जोडायचे आहे का?",
      icon: "warning",
      buttons: {
        ok: language === "en" ? "Ok" : "ठीक आहे",
        cancel: language === "en" ? "Cancel" : "रद्द करा",
      },
    }).then((ok) => {
      if (ok) {
        setLoading(true);
        axios
          .post(
            `${urls.SCHOOL}/trnClassTimetable/saveSubjectWiseTeacher`,
            body,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          .then((r) => {
            setLoading(false);
            if (r.status == 200 || r.status == 201) {
              console.log("res", r);
              sweetAlert({
                title: language === "en" ? "Saved " : "जतन केले",
                text:
                  language === "en"
                    ? "Class Timetable Added Successfully !"
                    : "वर्ग वेळापत्रक यशस्वीरित्या जोडले!",
                icon: "success",
                button: language === "en" ? "Ok" : "ठीक आहे",
              });
            }
          })
          .catch((e) => {
            setLoading(false);
            callCatchMethod(e, language);
            console.log("Eroor", e);
          });
      }
    });

    // axios
    //   .post(`${urls.SCHOOL}/trnClassTimetable/saveSubjectWiseTeacher`, body)
    //   .then((res) => {
    //     if (res.status == 200 || res.status == 201) {
    //       sweetAlert(
    //         "Success!",
    //         "Class Timetable Added Successfully !",
    //         "success"
    //       );
    //       // getTimetableData()
    //     }
    //   })
    //   .catch((e) => {
    //     // console.error("error", e);
    //     sweetAlert(e.response.data.status, e.response.data.message, "error");
    //   });
  };

  useEffect(() => {
    console.log(":allDays", allDays);
  }, [allDays]);

  // table
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "Fromtime", headerName: "Fromtime", width: 100 },
    { field: "Totime", headerName: "Totime", width: 100 },
    { field: "Monday", headerName: "Monday", width: 100 },
    { field: "Tuesday", headerName: "Tuesday", width: 100 },
    { field: "Wednesday", headerName: "Wednesday", width: 100 },
    { field: "Thursday", headerName: "Thursday", width: 100 },
    { field: "Friday", headerName: "Friday", width: 100 },
    { field: "Saturday", headerName: "Saturday", width: 100 },
  ];

  // const rows = [
  //   {timeTableDao ?. timeTableDao.map((item,i)=>{

  //     { id: i+1,
  //       FromTime:{item.fromTime},
  //       ToTime:{item.toTime},
  //       item.periodDao.map((period)=>{
  //         Monday:{subjectList.find((subject)=>subject.id === item.subjectId).subjectId}

  //       })
  //       Tuesday
  //       Wednesday
  //       Thursday
  //       Friday
  //       Saturday },
  //   }) }

  // ];
  const rows = [
    { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
    { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
    { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
    { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
    { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
    { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
    { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
    { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  ];

  const timeTableColumns = [
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
      field: "mon",
      align: "center",
      headerAlign: "center",
      headerName: labels.Monday,
      flex: 1,
    },
    {
      field: "tue",
      align: "center",
      headerAlign: "center",
      headerName: labels.Tuesday,
      flex: 1,
    },
    {
      field: "wed",
      align: "center",
      headerAlign: "center",
      headerName: labels.Wednesday,
      flex: 1,
    },
    {
      field: "thu",
      align: "center",
      headerAlign: "center",
      headerName: labels.Thursday,
      flex: 1,
    },
    {
      field: "fri",
      align: "center",
      headerAlign: "center",
      headerName: labels.Friday,
      flex: 1,
    },
    {
      field: "sat",
      align: "center",
      headerAlign: "center",
      headerName: labels.Saturday,
      flex: 1,
    },
    // {
    //   field: "actions",
    //   align: "center",
    //   headerAlign: "center",
    //   headerName: labels.actions,
    //   width: 80,
    //   renderCell: (params) => {
    //     return (
    //       <>
    //         <IconButton
    //           onClick={() => {
    //             console?.log("paramsRow", params?.row);
    //             setTimetableId(params?.row?.id);
    //             setTimetableText("UpdateTimetable");
    //             console.log("params.row: ", params.row);
    //             setValue("fromTime", moment(params?.row?.fromTime, "HH:mm a"));
    //             setValue("toTime", moment(params?.row?.toTime, "HH:mm a"));
    //             setValue("monDay", params?.row?.monDay);
    //             setValue("tuesDay", params?.row?.tuesDay);
    //             setValue("wednesDay", params?.row?.wednesDay);
    //             setValue("thursday", params?.row?.thursday);
    //             setValue("friDay", params?.row?.friDay);
    //             setValue("saturDay", params?.row?.saturDay);
    //             reset(params.row);
    //           }}
    //         >
    //           <EditIcon style={{ color: "#556CD6" }} />
    //         </IconButton>
    //       </>
    //     );
    //   },
    // },
  ];

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
                {/* <h2 style={{ marginBottom: 0 }}>{labels.classTimetable}</h2> */}
                <h2 style={{ marginBottom: 0 }}>{labels.classTimetable}</h2>
              </Grid>
            </Grid>
            {/* <Paper style={{ display: isReady }}>
          {studentPrintData && (
            <StudentsMarksReportToPrint
              ref={componentRef}
              term1={sem1MarksPrintData}
              term2={sem2MarksPrintData}
              stuData={studentPrintData}
              grades={grades}
              finalGrade={finalGrade}
              language={language}
            />
          )}
        </Paper> */}

            <FormProvider {...methods}>
              {/* <form onSubmit={handleSubmit(finalSubmit)}> */}
              <form>
                <Grid container display="flex" direction="column" gap={2}>
                  <Grid
                    container
                    direction="row"
                    display="flex"
                    spacing={4}
                    justifyContent="center"
                  >
                    <Grid item lg={4} md={6} sm={6} xs={12} display="flex">
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
                    <Grid item lg={4} md={6} sm={6} xs={12} display="flex">
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
                            <Select
                              variant="standard"
                              {...field}
                              error={!!errors.academicYearId}
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
                        <FormHelperText error={!!errors.academicYearId}>
                          {errors.academicYearId
                            ? labels.academicYearRequired
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12} display="flex">
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
                    <Grid item lg={4} md={6} sm={6} xs={12} display="flex">
                      <FormControl fullWidth>
                        <InputLabel required error={!!errors.divisionKey}>
                          {labels.selectDivision}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="divisionKey"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select variant="standard" {...field}>
                              {divisionList &&
                                divisionList.map((div) => (
                                  <MenuItem key={div.id} value={div.id}>
                                    {div.divisionName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText error={!!errors.divisionKey}>
                          {errors.divisionKey ? labels.classRequired : null}
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
                      <h2 style={{ marginBottom: 0 }}>
                        {labels?.addDailyTimetable}
                      </h2>
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

                    {/* ////////////////////////////////////////// */}
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={3}
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
                                inputFormat="hh:mm a"
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
                                    fullWidth
                                    variant="standard"
                                    sx={{ width: 120 }}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={3}
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
                                inputFormat="hh:mm a"
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
                                    fullWidth
                                    variant="standard"
                                    sx={{ width: 120 }}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        {/* <FormHelperText>{error?.ipdOpeningTime ? error.ipdOpeningTime.message : null}</FormHelperText> */}
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl sx={{ width: 130 }}>
                        <InputLabel required>{labels.day}</InputLabel>
                        <Controller
                          control={control}
                          name="weekDayKey"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select variant="standard" {...field}>
                              {dayList &&
                                dayList.map((day, i) => (
                                  <MenuItem key={i} value={day.value}>
                                    {day.lable}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        {/* <FormHelperText>{errors?.friDayid ? errors.friDayid.message : null}</FormHelperText> */}
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        disabled=""
                        onClick={handleGo}
                      >
                        {labels?.go}
                      </Button>
                    </Grid>
                    {/* monday */}
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "50px",
                      }}
                    >
                      {labels?.[2]}
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "50px",
                      }}
                    >
                      <FormControl fullWidth>
                        <InputLabel required error={!!errors.teacherKey}>
                          {labels.selectTeacher}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="teacherKey1"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select variant="standard" {...field}>
                              {fillteredTeacherList &&
                                fillteredTeacherList?.map((teacher) => (
                                  <MenuItem
                                    key={teacher.teacherId}
                                    value={teacher.teacherId}
                                  >
                                    {
                                      teacherList.find(
                                        (teach) =>
                                          teach.id === teacher.teacherId
                                      )?.teacherName
                                    }
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText error={!!errors.teacherKey}>
                          {errors.teacherKey ? labels.classRequired : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "50px",
                      }}
                    >
                      <FormControl fullWidth>
                        <InputLabel required error={!!errors.subjectKey}>
                          {labels.selectSubject}
                        </InputLabel>
                        <Controller
                          control={control}
                          name="subjectKey1"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select variant="standard" {...field}>
                              {teacherWiseSubjectList &&
                                teacherWiseSubjectList.map((sub) => (
                                  <MenuItem
                                    key={sub.subjectId}
                                    value={sub.subjectId}
                                  >
                                    {sub.divisionName}
                                    {
                                      subjectList.find(
                                        (subject) =>
                                          subject.id === sub.subjectId
                                      ).subjectId
                                    }
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText error={!!errors.subjectKey}>
                          {errors.subjectKey ? labels.classRequired : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "50px",
                      }}
                    >
                      <Button
                        variant="contained"
                        disabled={watch("weekDayKey") !== 1}
                        onClick={() => saveDay(watch("weekDayKey"))}
                      >
                        {labels?.save}
                      </Button>
                    </Grid>
                    {/* tuesday */}
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "50px",
                      }}
                    >
                      {labels?.[3]}
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "50px",
                      }}
                    >
                      <FormControl fullWidth>
                        <InputLabel required error={!!errors.teacherKey}>
                          {labels.selectTeacher}
                        </InputLabel>

                        <Controller
                          control={control}
                          name="teacherKey2"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select variant="standard" {...field}>
                              {fillteredTeacherList &&
                                fillteredTeacherList.map((teacher) => (
                                  <MenuItem
                                    key={teacher.teacherId}
                                    value={teacher.teacherId}
                                  >
                                    {
                                      teacherList.find(
                                        (teach) =>
                                          teach.id === teacher.teacherId
                                      ).teacherName
                                    }
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText error={!!errors.teacherKey}>
                          {errors.teacherKey ? labels.classRequired : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "50px",
                      }}
                    >
                      <FormControl fullWidth>
                        <InputLabel required error={!!errors.subjectKey}>
                          {labels.selectSubject}
                        </InputLabel>

                        <Controller
                          control={control}
                          name="subjectKey2"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select variant="standard" {...field}>
                              {teacherWiseSubjectList &&
                                teacherWiseSubjectList.map((sub) => (
                                  <MenuItem
                                    key={sub.subjectId}
                                    value={sub.subjectId}
                                  >
                                    {sub.divisionName}
                                    {
                                      subjectList.find(
                                        (subject) =>
                                          subject.id === sub.subjectId
                                      ).subjectId
                                    }
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText error={!!errors.subjectKey}>
                          {errors.subjectKey ? labels.classRequired : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "50px",
                      }}
                    >
                      <Button
                        variant="contained"
                        disabled={watch("weekDayKey") !== 2}
                        onClick={() => saveDay(watch("weekDayKey"))}
                      >
                        {labels?.save}
                      </Button>
                    </Grid>
                    {/* Wednesday */}
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "50px",
                      }}
                    >
                      {labels?.[4]}
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "50px",
                      }}
                    >
                      <FormControl fullWidth>
                        <InputLabel required error={!!errors.teacherKey}>
                          {labels.selectTeacher}
                        </InputLabel>

                        <Controller
                          control={control}
                          name="teacherKey3"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select variant="standard" {...field}>
                              {fillteredTeacherList &&
                                fillteredTeacherList.map((teacher) => (
                                  <MenuItem
                                    key={teacher.teacherId}
                                    value={teacher.teacherId}
                                  >
                                    {
                                      teacherList.find(
                                        (teach) =>
                                          teach.id === teacher.teacherId
                                      ).teacherName
                                    }
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText error={!!errors.teacherKey}>
                          {errors.teacherKey ? labels.classRequired : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "50px",
                      }}
                    >
                      <FormControl fullWidth>
                        <InputLabel required error={!!errors.subjectKey}>
                          {labels.selectSubject}
                        </InputLabel>

                        <Controller
                          control={control}
                          name="subjectKey3"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select variant="standard" {...field}>
                              {teacherWiseSubjectList &&
                                teacherWiseSubjectList.map((sub) => (
                                  <MenuItem
                                    key={sub.subjectId}
                                    value={sub.subjectId}
                                  >
                                    {sub.divisionName}
                                    {
                                      subjectList.find(
                                        (subject) =>
                                          subject.id === sub.subjectId
                                      ).subjectId
                                    }
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText error={!!errors.subjectKey}>
                          {errors.subjectKey ? labels.classRequired : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "50px",
                      }}
                    >
                      <Button
                        variant="contained"
                        disabled={watch("weekDayKey") !== 3}
                        // onClick={handleGo}
                        onClick={() => saveDay(watch("weekDayKey"))}
                      >
                        {labels?.save}
                      </Button>
                    </Grid>

                    {/* Thursday */}
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "50px",
                      }}
                    >
                      {labels?.[5]}
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "50px",
                      }}
                    >
                      <FormControl fullWidth>
                        <InputLabel required error={!!errors.teacherKey}>
                          {labels.selectTeacher}
                        </InputLabel>

                        <Controller
                          control={control}
                          name="teacherKey4"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select variant="standard" {...field}>
                              {fillteredTeacherList &&
                                fillteredTeacherList.map((teacher) => (
                                  <MenuItem
                                    key={teacher.teacherId}
                                    value={teacher.teacherId}
                                  >
                                    {
                                      teacherList.find(
                                        (teach) =>
                                          teach.id === teacher.teacherId
                                      ).teacherName
                                    }
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText error={!!errors.teacherKey}>
                          {errors.teacherKey ? labels.classRequired : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "50px",
                      }}
                    >
                      <FormControl fullWidth>
                        <InputLabel required error={!!errors.subjectKey}>
                          {labels.selectSubject}
                        </InputLabel>

                        <Controller
                          control={control}
                          name="subjectKey4"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select variant="standard" {...field}>
                              {teacherWiseSubjectList &&
                                teacherWiseSubjectList.map((sub) => (
                                  <MenuItem
                                    key={sub.subjectId}
                                    value={sub.subjectId}
                                  >
                                    {sub.divisionName}
                                    {
                                      subjectList.find(
                                        (subject) =>
                                          subject.id === sub.subjectId
                                      ).subjectId
                                    }
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText error={!!errors.subjectKey}>
                          {errors.subjectKey ? labels.classRequired : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "50px",
                      }}
                    >
                      <Button
                        variant="contained"
                        disabled={watch("weekDayKey") !== 4}
                        // onClick={handleGo}
                        onClick={() => saveDay(watch("weekDayKey"))}
                      >
                        {labels?.save}
                      </Button>
                    </Grid>

                    {/* Friday */}
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "50px",
                      }}
                    >
                      {labels?.[6]}
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "50px",
                      }}
                    >
                      <FormControl fullWidth>
                        <InputLabel required error={!!errors.teacherKey}>
                          {labels.selectTeacher}
                        </InputLabel>

                        <Controller
                          control={control}
                          name="teacherKey5"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select variant="standard" {...field}>
                              {fillteredTeacherList &&
                                fillteredTeacherList.map((teacher) => (
                                  <MenuItem
                                    key={teacher.teacherId}
                                    value={teacher.teacherId}
                                  >
                                    {
                                      teacherList.find(
                                        (teach) =>
                                          teach.id === teacher.teacherId
                                      ).teacherName
                                    }
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText error={!!errors.teacherKey}>
                          {errors.teacherKey ? labels.classRequired : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "50px",
                      }}
                    >
                      <FormControl fullWidth>
                        <InputLabel required error={!!errors.subjectKey}>
                          {labels.selectSubject}
                        </InputLabel>

                        <Controller
                          control={control}
                          name="subjectKey5"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select variant="standard" {...field}>
                              {teacherWiseSubjectList &&
                                teacherWiseSubjectList.map((sub) => (
                                  <MenuItem
                                    key={sub.subjectId}
                                    value={sub.subjectId}
                                  >
                                    {sub.divisionName}
                                    {
                                      subjectList.find(
                                        (subject) =>
                                          subject.id === sub.subjectId
                                      ).subjectId
                                    }
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText error={!!errors.subjectKey}>
                          {errors.subjectKey ? labels.classRequired : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "50px",
                      }}
                    >
                      <Button
                        variant="contained"
                        disabled={watch("weekDayKey") !== 5}
                        // onClick={handleGo}
                        onClick={() => saveDay(watch("weekDayKey"))}
                      >
                        {labels?.save}
                      </Button>
                    </Grid>
                    {/* Saturday */}
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "50px",
                        paddingBottom: "50px",
                      }}
                    >
                      {labels?.[7]}
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "50px",
                        paddingBottom: "50px",
                      }}
                    >
                      <FormControl fullWidth>
                        <InputLabel required error={!!errors.teacherKey}>
                          {labels.selectTeacher}
                        </InputLabel>

                        <Controller
                          control={control}
                          name="teacherKey6"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select variant="standard" {...field}>
                              {fillteredTeacherList &&
                                fillteredTeacherList.map((teacher) => (
                                  <MenuItem
                                    key={teacher.teacherId}
                                    value={teacher.teacherId}
                                  >
                                    {
                                      teacherList.find(
                                        (teach) =>
                                          teach.id === teacher.teacherId
                                      ).teacherName
                                    }
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText error={!!errors.teacherKey}>
                          {errors.teacherKey ? labels.classRequired : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "50px",
                        paddingBottom: "50px",
                      }}
                    >
                      <FormControl fullWidth>
                        <InputLabel required error={!!errors.subjectKey}>
                          {labels.selectSubject}
                        </InputLabel>

                        <Controller
                          control={control}
                          name="subjectKey6"
                          rules={{ required: true }}
                          defaultValue=""
                          render={({ field }) => (
                            <Select variant="standard" {...field}>
                              {teacherWiseSubjectList &&
                                teacherWiseSubjectList.map((sub) => (
                                  <MenuItem
                                    key={sub.subjectId}
                                    value={sub.subjectId}
                                  >
                                    {sub.divisionName}
                                    {
                                      subjectList.find(
                                        (subject) =>
                                          subject.id === sub.subjectId
                                      ).subjectId
                                    }
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                        />
                        <FormHelperText error={!!errors.subjectKey}>
                          {errors.subjectKey ? labels.classRequired : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "50px",
                        paddingBottom: "50px",
                      }}
                    >
                      <Button
                        variant="contained"
                        disabled={watch("weekDayKey") !== 6}
                        // onClick={handleGo}
                        onClick={() => saveDay(watch("weekDayKey"))}
                      >
                        {labels?.save}
                      </Button>
                    </Grid>

                    {/* Timetable Table */}

                    <Grid item xs={12}>
                      <Grid
                        container
                        xs={12}
                        sm={12}
                        md={12}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: "20px",
                          paddingBottom: "50px",
                        }}
                      >
                        <Button
                          variant="contained"
                          disabled=""
                          onClick={updateTimeTableDao}
                        >
                          {labels?.saveWeekelyTimetable}
                        </Button>
                      </Grid>
                      <DataGrid
                        autoHeight
                        sx={{
                          "& .cellColor": {
                            backgroundColor: "#556CD6",
                            color: "white",
                          },
                        }}
                        // rows={newStateTableData ? newStateTableData : []}
                        rows={timeTableDaoTable}
                        //@ts-ignore
                        columns={timeTableColumns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        disableSelectionOnClick
                        experimentalFeatures={{ newEditingApi: true }}
                      />
                    </Grid>

                    <Grid
                      container
                      xs={12}
                      sm={12}
                      md={12}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "50px",
                        paddingBottom: "50px",
                      }}
                    >
                      {/* <Grid
                      item
                      xs={12}
                      sm={3}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "50px",
                        paddingBottom: "50px",
                      }}
                    >
                      <Button
                        variant="contained"
                        disabled=""
                        onClick={updateTimeTableDao}
                      >
                        {labels?.save}
                      </Button>
                    </Grid> */}

                      <Button
                        // type="submit"
                        variant="contained"
                        disabled=""
                        onClick={finalSubmit}
                      >
                        {labels.finalSubmit}
                      </Button>
                      {/* <table>
  <tr>
    <th>sr.no</th>
    <th>FromTime</th>
    <th>Totime</th>
    <th>Moday</th>
    <th>Tuesday</th>
    <th>Wednesday</th>
    <th>Thursday</th>
    <th>Friday</th>
    <th>Saturday</th>
  </tr>
  <tr>
    <td>sdsdf</td>
    {
    console.log(":100",timeTableDao?.map((item,i)=>{
       return  <td>{ item.fromTime}</td>
        //  { item.map((o)=> {return <td>{ o.teacherKey}</td> })}
      })
      ) 
    }
    
  </tr>
  
 
</table> */}
                    </Grid>
                    {/* <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </div> */}

                    {/*                 
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
                    // disabled={isDisableAddSubndTime()}
                    disabled=""
                    endIcon={<Add />}
                 
                  >
                    {labels.save}
                  </Button>
                </Grid>
                 */}

                    {/* table************ */}
                    {/* <Grid
                container
                display="flex"
                justifyContent="center"
                justifyItems="center"
                marginTop="30px"
                // marginBottom="200px"
                padding={2}
                sx={{
                  background:
                    "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                }}
              >
                <Grid item>
                  {/* <h2 style={{ marginBottom: 0 }}>{labels.timeAndSub}</h2> */}
                    {/* <h2 style={{ marginBottom: 0 }}>Timetable</h2>
                </Grid>
              </Grid> */}

                    {/* <Grid item xs={12}>
              
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
              </Grid> */}

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
