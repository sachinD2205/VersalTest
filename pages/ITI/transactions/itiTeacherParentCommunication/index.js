import { EyeFilled } from "@ant-design/icons";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import { GridToolbar } from "@mui/x-data-grid";
import { ClearOutlined } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
// import teacherParentCommSchema from "../../../../containers/schema/school/transactions/teacherParentCommSchema";
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css";
import { ititeacherParentCommSchema } from "../../../../containers/schema/iti/transactions/itistudentBonafideSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import Loader from "../../../../containers/Layout/components/Loader";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(ititeacherParentCommSchema),
    mode: "onChange",
  });
  const [loading, setLoading] = useState(false);

  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [buttonInputState, setButtonInputState] = useState();
  const [showFile, setShowFile] = useState(true);
  const [btnSaveText, setBtnSaveText] = useState("Save");

  const academicYearId = watch("academicYearKey");

  const itiId = watch("itiKey");
  const tradeId = watch("tradeKey");

  const [academicYearList, setAcademicYearList] = useState([]);
  const [traineeList, setTraineeList] = useState([]);
  const [fetchData, setFetchData] = useState(null);
  const [instructorList, setInstructorList] = useState([]);
  const [allInstructorsList, setAllInstructorsList] = useState([]);

  const [itiKeys, setItiKeys] = useState([]);
  const [tradeKeys, setTradeKeys] = useState([]);
  const [allTradeKeys, setAllTradeKeys] = useState([]);
  const [id, setID] = useState();

  // const [error, setError] = useState("");
  const router = useRouter();
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [hanadleStudent, setHanadleStudent] = useState([]);

  const language = useSelector((state) => state?.labels?.language);

  const [labels, setLabels] = useState(schoolLabels[language ?? "en"]);
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
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

  const [commStudentList, setCommStudentList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const style = {
    position: "absolute",
    top: "25%",
    left: "30%",
    // transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const handleSelectedStudents = (event, traineeId) => {
    if (traineeId === "all") {
      if (event.target.checked) {
        setSelectedStudents(traineeList.map((student) => student.id));
        setHanadleStudent(
          traineeList.map((student) => ({ traineeKey: student.id }))
        );
      } else {
        setSelectedStudents([]);
        setHanadleStudent([]);
      }
    } else {
      if (event.target.checked) {
        setSelectedStudents([...selectedStudents, traineeId]);
        setHanadleStudent((old) => [...old, { traineeKey: traineeId }]);
      } else {
        setSelectedStudents(selectedStudents?.filter((id) => id !== traineeId));
        setHanadleStudent(
          hanadleStudent?.filter((item) => item.traineeKey !== traineeId)
        );
      }
    }
  };

  console.log("selectedStudents", selectedStudents);
  // console.log("hanadleStudent", hanadleStudent);

  useEffect(() => {
    setLabels(schoolLabels[language ?? "en"]);
  }, [setLabels, language]);

  //   get ITI Names
  const getItiKeys = () => {
    axios
      .get(`${urls.SCHOOL}/mstIti/getItiOnUserId?userId=${user?.id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setItiKeys(
          r?.data?.map((data) => ({
            id: data?.id,
            itiName: data?.itiName,
            itiType: data?.itiType,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  };
  //   get All tradeKeys Names
  const getAllTradeKeys = () => {
    axios.get(`${urls.SCHOOL}/mstItiTrade/getAll`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      setAllTradeKeys(
        r?.data?.mstItiTradeList?.map((data) => ({
          id: data?.id,
          tradeName: data?.tradeName,
        }))
      );
    })
    .catch((error) => {
      callCatchMethod(error, language);
    })
  };

  const getAcademicYearList = () => {
    axios.get(`${urls.SCHOOL}/mstAcademicYear/getAll`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((r) => {
      setAcademicYearList(
        r.data.mstAcademicYearList.map((row) => ({
          id: row.id,
          academicYear: row.academicYear,
        }))
      );
    })
    .catch((error) => {
      callCatchMethod(error, language);
    })
  };

  const getAllInstructors = () => {
    axios
      .get(`${urls.SCHOOL}/mstItiTeacherAndInstructorController/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setAllInstructorsList(
          r?.data?.mstItiTeacherAndInstructorDao?.map((i) => ({
            id: i.id,
            instructorName: `${i?.firstName} ${i?.middleName} ${i?.lastName}`,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  };

  useEffect(() => {
    getItiKeys();
    getAllTradeKeys();
    getAcademicYearList();
    getAllInstructors();
  }, []);

  //   get  trades
  const getTradeKeysByIti = () => {
    if (itiId) {
      axios
        .get(`${urls.SCHOOL}/mstItiTrade/getDataOnItiKey?itiKey=${itiId}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          setTradeKeys(
            r?.data?.map((data) => ({
              id: data?.id,
              tradeName: data?.tradeName,
            }))
          );
        })
        .catch((error) => {
          callCatchMethod(error, language);
        })
    }
  };
  useEffect(() => {
    getTradeKeysByIti();
  }, [itiId]);
  //   get  instructor
  const getInstructor = () => {
    if (itiId && tradeId) {
      axios
        .get(
          `${urls.SCHOOL}/mstItiTeacherAndInstructorController/getFilterInstructor?itiKey=${itiId}&tradeKey=${tradeId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          setInstructorList(
            r?.data?.map((data) => ({
              id: data?.id,
              instructorName: `${data?.firstName} ${data?.middleName} ${data?.lastName}`,
            }))
          );
        })
        .catch((error) => {
          callCatchMethod(error, language);
        })
    }
  };
  useEffect(() => {
    getInstructor();
  }, [itiId, tradeId]);

  const getStudentList = () => {
    if (
      itiId === "" ||
      itiId === null ||
      academicYearId === "" ||
      academicYearId === null ||
      tradeId === "" ||
      tradeId === null
    ) {
      setTraineeList([]);
    } else if (itiId && academicYearId && tradeId) {
      axios
        .get(
          `${urls.SCHOOL}/mstItIStudent/getFilterApi?itiAllocatedKey=${itiId}&academicYearKey=${academicYearId}&itiTradeKey=${tradeId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          setTraineeList(
            r?.data?.map((row) => ({
              id: row.id,
              traineeName: `${row.traineeFirstName} ${row.traineeMiddleName} ${row.traineeLastName}`,
            }))
          );
        })
        .catch((error) => {
          callCatchMethod(error, language);
        })
    }
  };
  useEffect(() => {
    getStudentList();
  }, [itiId, academicYearId, tradeId]);

  useEffect(() => {
    getItiTeacherParentCommunication();
  }, [itiKeys, allTradeKeys, fetchData, allInstructorsList]);

  // Get Table - Data
  const getItiTeacherParentCommunication = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setLoading(true);
    axios
      .get(
        `${urls.SCHOOL}/trnTeacherParentCommItIController/getAllUserId?userId=${user?.id}`,
        {
          params: {
            pageSize: _pageSize,
            pageNo: _pageNo,
            sortBy: _sortBy,
            sortDir: _sortDir,
          },
          headers: {
              Authorization: `Bearer ${userToken}`,
            },
          
        }
      )
      .then((r) => {
        let result = r?.data?.trnTeacherParentCommItIDao;
        let page = r?.data?.pageSize * r?.data?.pageNo;
        console.log("trnTeacherParentCommItIDao", result);

        let _res = result.map((r, i) => {
          return {
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1 + page,

            itiKey: r.itiKey,
            itiName: itiKeys?.find((i) => i?.id === r?.itiKey)?.itiName,
            tradeKey: r.tradeKey,
            tradeName: allTradeKeys?.find((i) => i?.id === r?.tradeKey)
              ?.tradeName,
            academicYearKey: r.academicYearKey,
            academicYear: academicYearList?.find(
              (i) => i?.id === r?.academicYearKey
            )?.academicYear,

            teacherKey: r.teacherKey,
            instructorName: allInstructorsList?.find(
              (i) => i?.id === r.teacherKey
            )?.instructorName,

            commSubject: r.commSubject,
            commMessage: r.commMessage,
            itiStudentTeacherParentCommDao: r.itiStudentTeacherParentCommDao,
          };
        });
        console.log("Result", _res);
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        sweetAlert(
          "Error",
          e?.message ? e?.message : "Something Went Wrong",
          "error"
        );
        console.log("Eroor", e);
      });
  };

  const onSubmitForm = (formData) => {
    console.log("formData", formData);
    if (hanadleStudent.length == 0) {
      setError("selectedStudents", { message: labels.selectTraineeComm });
      return;
    }
    // Save - DB
    let _body = {
      ...formData,
      itiStudentTeacherParentCommDao: hanadleStudent,
    };
    if (btnSaveText === "Save") {
      setLoading(true);
      console.log("Body", _body);
      const tempData = axios
        .post(`${urls.SCHOOL}/trnTeacherParentCommItIController/save`, _body, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setLoading(false);
          if (res.status == 201) {
            sweetAlert("Saved!", "Record Saved successfully !", "success");
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setShowFile(true);
            setFetchData(tempData);
            setHanadleStudent([]);
            setSelectedStudents([]);
          }
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      setLoading(true);
      const tempData = axios
        .post(`${urls.SCHOOL}/trnTeacherParentCommItIController/save`, _body, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setLoading(false);
          console.log("res", res);
          if (res.status == 201) {
            formData.id
              ? sweetAlert(
                  "Updated!",
                  "Record Updated successfully !",
                  "success"
                )
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            getItiTeacherParentCommunication();
            setFetchData(tempData);
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setShowFile(true);
            setHanadleStudent([]);
            setSelectedStudents([]);
          }
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    }
  };

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setShowFile(true);
    setHanadleStudent([]);
    setSelectedStudents([]);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
    setHanadleStudent([]);
    setSelectedStudents([]);
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    itiKey: "",
    academicYearKey: "",
    tradeKey: "",
    teacherKey: "",
    commSubject: "",
    commMessage: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    id: null,
    itiKey: "",
    academicYearKey: "",
    tradeKey: "",
    teacherKey: "",
    commSubject: "",
    commMessage: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: labels.srNo,
      flex: 1,
    },
    {
      field: "itiName",
      headerName: labels.itiName,
      flex: 1,
    },
    {
      field: "instructorName",
      headerName: labels.instructorName,
      flex: 1,
    },
    {
      field: "academicYear",
      headerName: labels.academicYear,
      flex: 1,
    },
    {
      field: "studentName",
      headerName: labels.studentName,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        // console.log("commStudentList", commStudentList);
        return (
          <Box>
            <Tooltip title={labels.view}>
              <IconButton
                onClick={() => {
                  setIsOpen(true);
                  // for modal rows
                  let _res = params?.row?.itiStudentTeacherParentCommDao?.map(
                    (val, i) => {
                      return {
                        srNo: i + 1,
                        id: val?.id,
                        traineeName: val?.traineeName,
                      };
                    }
                  );
                  setCommStudentList(_res);
                }}
              >
                <EyeFilled style={{ color: "#556CD6" }} />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
    {
      field: "commSubject",
      headerName: labels.subject,
      flex: 1,
    },
    {
      field: "commMessage",
      headerName: labels.message,
      flex: 1,
    },
  ];

  // for modal columns
  const _col = [
    {
      field: "srNo",
      headerName: labels.srNo,
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "traineeName",
      headerName: labels.traineeName,
      flex: 1,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginLeft: "10px",
          marginRight: "10px",
          padding: 1,
        }}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            // backgroundColor:'#0E4C92'
            // backgroundColor:'		#0F52BA'
            // backgroundColor:'		#0F52BA'
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <Grid item>
            <h2>{labels.instructorParentComm}</h2>
          </Grid>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginLeft: 5,
            marginRight: 5,
            // marginTop: 2,
            // marginBottom: 3,
            padding: 2,
            // border:1,
            // borderColor:'grey.500'
          }}
        >
          <Box p={1}>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                {isOpenCollapse && (
                  <Slide
                    direction="down"
                    in={slideChecked}
                    mountOnEnter
                    unmountOnExit
                  >
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          // sx={{ m: 1, minWidth: "50%" }}
                          sx={{ m: 1, minWidth: "50%", maxWidth: "50%" }}
                          error={!!errors.itiKey}
                        >
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
                                  itiKeys?.map((iti) => (
                                    <MenuItem key={iti.id} value={iti.id}>
                                      {iti?.itiName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText>
                            {errors?.itiKey ? labels.itiNameReq : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          sx={{ m: 1, minWidth: "50%" }}
                          error={!!errors.academicYearKey}
                        >
                          <InputLabel required error={!!errors.academicYearKey}>
                            {labels.selectAcademicYear}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="academicYearKey"
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
                          <FormHelperText>
                            {errors?.academicYearKey
                              ? labels.academicYearRequired
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          sx={{ m: 1, minWidth: "50%" }}
                          error={!!errors.tradeKey}
                        >
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
                                  tradeKeys?.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                      {item.tradeName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText>
                            {errors?.tradeKey ? labels.itiTradeReq : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          sx={{ m: 1, minWidth: "50%" }}
                          error={!!errors.teacherKey}
                        >
                          <InputLabel required error={!!errors.teacherKey}>
                            {labels.selectInstructor}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="teacherKey"
                            rules={{ required: true }}
                            defaultValue=""
                            render={({ field }) => (
                              <Select variant="standard" {...field}>
                                {instructorList &&
                                  instructorList?.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                      {item.instructorName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText>
                            {errors?.teacherKey ? labels.instructorReq : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          // error={Boolean(errors.traineeKey)}
                          variant="standard"
                          // sx={{ m: 1, minWidth: "50%", maxWidth: "50%" }}
                          sx={{ width: 230 }}
                          error={!!errors.selectedStudents}
                        >
                          <InputLabel
                            id="selectedStudents-label"
                            required
                            error={!!errors.selectedStudents}
                          >
                            {labels.selectTrainee}
                          </InputLabel>
                          <Controller
                            name="selectedStudents"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => (
                              <Select
                                labelId="selectedStudents-label"
                                id="selectedStudents"
                                multiple
                                value={selectedStudents}
                                onChange={(e) => {
                                  onChange(
                                    handleSelectedStudents(e, e.target.value)
                                  );
                                }}
                                renderValue={(selected) =>
                                  selected.includes("all")
                                    ? "Select All"
                                    : selected
                                        .map(
                                          (id) =>
                                            traineeList.find(
                                              (student) => student.id === id
                                            )?.traineeName
                                        )
                                        .join(", ")
                                }
                              >
                                {traineeList?.length > 0 && (
                                  <MenuItem key="all" value="all">
                                    <Checkbox
                                      checked={
                                        selectedStudents.length ===
                                        traineeList.length
                                      }
                                      indeterminate={
                                        selectedStudents.length > 0 &&
                                        selectedStudents.length <
                                          traineeList.length
                                      }
                                      onChange={(e) =>
                                        handleSelectedStudents(e, "all")
                                      }
                                    />
                                    {labels.selectAll}
                                  </MenuItem>
                                )}

                                {traineeList.map((student) => (
                                  <MenuItem key={student.id} value={student.id}>
                                    <Checkbox
                                      checked={selectedStudents.includes(
                                        student.id
                                      )}
                                      onChange={(e) =>
                                        handleSelectedStudents(e, student.id)
                                      }
                                    />
                                    {student?.traineeName}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                          />
                          <FormHelperText>
                            {errors?.selectedStudents
                              ? errors.selectedStudents.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* <Divider /> */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          // required
                          label={`${labels.subject} *`}
                          // value={firstName}
                          {...register("commSubject")}
                          error={!!errors.commSubject}
                          // sx={{ m: 1, minWidth: "50%" }}
                          sx={{ width: 220 }}
                          InputProps={{ style: { fontSize: 18 } }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            shrink: watch("commSubject") ? true : false,
                          }}
                          helperText={
                            errors?.commSubject ? labels.commSubjectReq : null
                          }
                        />
                      </Grid>
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          variant="standard"
                          // required
                          label={`${labels.message} *`}
                          // value={middleName}
                          {...register("commMessage")}
                          error={!!errors.commMessage}
                          sx={{ m: 1, minWidth: "50%" }}
                          InputProps={{ style: { fontSize: 18 } }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            shrink: watch("commMessage") ? true : false,
                          }}
                          helperText={
                            errors?.commMessage ? labels.commMessageReq : null
                          }
                        />
                      </Grid>

                      <Grid
                        container
                        spacing={5}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          paddingTop: "10px",
                          marginTop: "20px",
                        }}
                      >
                        <Grid item>
                          <Button
                            sx={{ marginRight: 8 }}
                            type="submit"
                            variant="contained"
                            color="primary"
                            endIcon={<SaveIcon />}
                          >
                            {labels.save}
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            sx={{ marginRight: 8 }}
                            variant="contained"
                            color="primary"
                            endIcon={<ClearIcon />}
                            onClick={() => cancellButton()}
                          >
                            {labels.clear}
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="contained"
                            color="primary"
                            endIcon={<ExitToAppIcon />}
                            onClick={() => exitButton()}
                          >
                            {labels.exit}
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Slide>
                )}
              </form>
            </FormProvider>
          </Box>
        </Box>
        <div className={styles.addbtn}>
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            type="primary"
            disabled={buttonInputState}
            onClick={() => {
              reset({
                ...resetValuesExit,
              });
              setBtnSaveText("Save");
              setButtonInputState(true);
              setSlideChecked(true);
              setIsOpenCollapse(!isOpenCollapse);
              setShowFile(false);
            }}
          >
            {labels.add}
          </Button>
        </div>

        <Modal
          open={isOpen}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <DataGrid
              sx={{
                overflowY: "scroll",

                "& .MuiDataGrid-virtualScrollerContent": {},
                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#556CD6",
                  color: "white",
                },

                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
              }}
              density="compact"
              // autoHeight={true}
              autoHeight
              pagination
              // paginationMode="server"
              // hideFooter={true}
              getRowId={(row) => row.srNo}
              rows={commStudentList}
              columns={_col}
              scrollbarSize={17}
              pageSize={5}
              rowsPerPageOptions={[5]}
              // onPageChange={(_data) => {}}
              // onPageSizeChange={(_data) => {}}
            />
            <Grid
              container
              paddingTop={2}
              justifyContent="center"
              alignItems="center"
            >
              <Button
                style={{ justifyContent: "center" }}
                variant="contained"
                // color="warning"
                size="small"
                startIcon={<ClearOutlined />}
                onClick={() => handleClose()}
              >
                {labels.close}
              </Button>
            </Grid>
          </Box>
        </Modal>

        <Box>
          {loading ? (
            <Loader />
          ) : (
            <>
              {showFile && (
                <DataGrid
                  components={{ Toolbar: GridToolbar }}
                  componentsProps={{
                    toolbar: {
                      showQuickFilter: true,
                      quickFilterProps: { debounceMs: 500 },
                      // printOptions: { disableToolbarButton: true },
                      // disableExport: true,
                      // disableToolbarButton: true,
                      // csvOptions: { disableToolbarButton: true },
                    },
                  }}
                  headerName="Water"
                  getRowId={(row) => row.srNo}
                  autoHeight
                  sx={{
                    overflowY: "scroll",
                    "& .MuiDataGrid-virtualScrollerContent": {},
                    "& .MuiDataGrid-columnHeadersInner": {
                      backgroundColor: "#556CD6",
                      color: "white",
                    },
                    "& .MuiDataGrid-cell:hover": {
                      color: "primary.main",
                    },
                  }}
                  density="compact"
                  // rows={traineeList}
                  // columns={columns}
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
                    getItiTeacherParentCommunication(data.pageSize, _data);
                  }}
                  onPageSizeChange={(_data) => {
                    console.log("222", _data);
                    // updateData("page", 1);
                    getItiTeacherParentCommunication(_data, data.page);
                  }}
                />
              )}
            </>
          )}
        </Box>
      </Paper>
    </>
  );
};

export default Index;
