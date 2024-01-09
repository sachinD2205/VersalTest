import {
  ClearOutlined,
  SearchOutlined,
  UpdateOutlined,
} from "@mui/icons-material";
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
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
import urls from "../../../../URLS/urls";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  const [academicYearList, setAcademicYearList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [itiKeys, setItiKeys] = useState([]);
  const [tradeKeys, setTradeKeys] = useState([]);

  const [error, setError] = useState(null);

  const language = useSelector((state) => state?.labels?.language);

  const [labels, setLabels] = useState(schoolLabels[language ?? "en"]);

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
    mode: "onBlur",
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

  const selectedDate = watch("selectedDate");
  const academicYearId = watch("academicYearId");

  const itiKey = watch("itiKey");
  const tradeKey = watch("tradeKey");

  useEffect(() => {
    const getItiKeys = async () => {
      try {
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
        //   setSchoolList(schools);
        setItiKeys(itis);
      } catch (e) {
        setError(e.message);
      }
    };

    const getAcademicYearList = async () => {
      try {
        const { data } = await axios.get(
          `${urls.SCHOOL}/mstAcademicYear/getAll`, {
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
      }
    };
    getItiKeys();
    getAcademicYearList();
  }, [setError]);

  useEffect(() => {
    const getItiTradeKeys = async () => {
      setValue("tradeKey", "");
      if (itiKey == null || itiKey === "") {
        setTradeKeys([]);
        return;
      }
      try {
        const { data } = await axios.get(
          `${urls.SCHOOL}/mstItiTrade/getDataOnItiKey?itiKey=${itiKey}`, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        const trades = data?.map(({ id, tradeName }) => ({
          id,
          tradeName,
        }));
        //   setClassList(classes);
        setTradeKeys(trades);
      } catch (e) {
        setError(e.message);
      }
    };
    getItiTradeKeys();
  }, [itiKey, setValue, setError]);

  const findAttendance = async (formValue) => {
    try {
      setLoading(true);
      const [attRes, divRes] = await Promise.all([
        axios.get(
          `${urls.SCHOOL}/trnItiTraineeAttendacne/getList?tradeKey=${
            formValue.tradeKey
          }&itiKey=${formValue.itiKey}&academicYearKey=${
            formValue.academicYearId
          }&dayKey=${moment(formValue.selectedDate).format(
            "DD"
          )}&monthKey=${moment(formValue.selectedDate).format(
            "MM"
          )}&yearKey=${moment(formValue.selectedDate).format("YYYY")}`, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        ),
        axios.get(
          //   `${urls.SCHOOL}/mstStudent/getAllStudentByDiv?schoolKey=${formValue.schoolId}&acYearKey=${formValue.academicYearId}&classKey=${formValue.classId}&divKey=${formValue.divisionId}`
          `${urls.SCHOOL}/mstItIStudent/getFilterApi?itiAllocatedKey=${formValue.itiKey}&academicYearKey=${formValue.academicYearId}&itiTradeKey=${formValue.tradeKey}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        ),
      ]);
      const students = attRes.data?.map((r, i) => {
        return {
          id: r?.id,
          srNo: i + 1,
          //   studentKey: r.studentKey,
          traineeKey: r.traineeKey,
          traineeFirstName: r.traineeFirstName,
          traineeMiddleName: r.traineeMiddleName,
          traineeLastName: r.traineeLastName,
          grNumber: r.grNumber ?? 0,
          studentGeneralAdmissionNumber: 0,
          present: r.presentAbsent === "P",
        };
      });
      const tradeStudents = divRes?.data?.map((r, i) => {
        return {
          id: nanoid(),
          srNo: i + 1,
          traineeKey: r?.id,
          traineeFirstName: r.traineeFirstName,
          traineeMiddleName: r.traineeMiddleName,
          traineeLastName: r.traineeLastName,
          //   grNumber: r.grNumber ?? 0,
          //   studentGeneralAdmissionNumber: 0,
          present: true,
        };
      });
      const studentKeys = students.map(({ traineeKey }) => traineeKey);
      const missingStudents = tradeStudents.filter(
        ({ traineeKey }) => !studentKeys.includes(traineeKey)
      );
      setStudentList([...students, ...missingStudents]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const updateAttendance = async () => {
    try {
      setLoading(true);
      const isValid = await trigger();
      if (!isValid) {
        setLoading(false);
        return;
      }
      const attendanceList = studentList?.map(({ id, present, ...props }) => {
        const s = {
          itiKey: itiKey,
          academicYearKey: academicYearId,
          tradeKey: tradeKey,
          yearKey: parseInt(moment(selectedDate).format("YYYY")),
          monthKey: parseInt(moment(selectedDate).format("MM")),
          dayKey: parseInt(moment(selectedDate).format("DD")),
          date: moment(selectedDate).toISOString(),
          ...props,
          presentAbsent: present ? "P" : "A",
          //   studentPresentAbsent: present ? "P" : "A",
          activeFlag: "Y",
        };
        if (typeof id === "number") {
          s.id = id;
        }
        return s;
      });
      await axios.post(
        // `${urls.SCHOOL}/trnStudentAttendance/saveList`,
        `${urls.SCHOOL}/trnItiTraineeAttendacne/saveList`,
        attendanceList,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      swal(labels.success, labels.attendanceUpdated, "success");
    } catch (e) {
      swal(labels.error, e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const processRowUpdate = (newRow) => {
    const index = studentList.findIndex(({ id }) => id === newRow.id);
    const updatedStudentList = [...studentList];
    updatedStudentList[index] = newRow;
    setStudentList(updatedStudentList);
    return newRow;
  };

  const columns = [
    {
      field: "srNo",
      headerName: labels.srNo,
      valueGetter: ({ row }) => {
        const srNo = row.srNo;
        return srNo;
      },
      flex: 1,
    },
    {
      field: "traineeName",
      headerName: labels.traineeName,
      valueGetter: ({ row }) =>
        `${row.traineeFirstName} ${row.traineeMiddleName} ${row.traineeLastName}`,
      flex: 1,
    },
    {
      field: "present",
      headerName: labels.presentAbsent,
      type: "boolean",
      editable: true,
      width: 200,
    },
  ];
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
              <h2 style={{ marginBottom: 0 }}>{labels.itiTraineeAttendance}</h2>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <form onSubmit={handleSubmit(findAttendance)}>
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
                            error={!!errors.schoolId}
                          >
                            {itiKeys &&
                              itiKeys.map((iti) => (
                                <MenuItem key={iti.id} value={iti.id}>
                                  {iti?.itiName}
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
                  <Grid item lg={2} md={3} sm={6} xs={12} display="flex" p={1}>
                    <Controller
                      control={control}
                      name="selectedDate"
                      rules={{ required: true }}
                      defaultValue={null}
                      render={({ field: { onChange, ...props } }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            label={
                              <span className="required">{`${labels.date} *`}</span>
                            }
                            variant="standard"
                            inputFormat="DD/MM/YYYY"
                            {...props}
                            onChange={(date) =>
                              onChange(moment(date).format("YYYY-MM-DD"))
                            }
                            selected={selectedDate}
                            disableFuture
                            center
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="standard"
                                fullWidth
                                error={!!errors.selectedDate}
                                helperText={
                                  errors.selectedDate
                                    ? labels.dateRequired
                                    : null
                                }
                              />
                            )}
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
                    <span>{labels.search}</span>
                  </Button>
                  <Button
                    disabled={loading}
                    variant="contained"
                    // color="warning"
                    startIcon={<ClearOutlined />}
                    onClick={() => {
                      reset();
                      setStudentList([]);
                    }}
                  >
                    {labels.clear}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
          <Grid item xs={12}>
            <DataGrid
              components={{ Toolbar: GridToolbar }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              getRowId={(row) => row.id}
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
              processRowUpdate={processRowUpdate}
              onProcessRowUpdateError={(error) =>
                setError(JSON.stringify(error))
              }
              density="compact"
              rows={studentList}
              columns={columns}
              experimentalFeatures={{ newEditingApi: true }}
              hideFooterPagination={true}
            />
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
              startIcon={<UpdateOutlined />}
              disabled={studentList.length == 0 || loading}
              onClick={updateAttendance}
            >
              <span>{labels.updateAttendance}</span>
            </Button>
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
