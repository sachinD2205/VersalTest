// import { yupResolver } from "@hookforpostm/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css";
import urls from "../../../../URLS/urls";
import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
import teacherSubjectMappingSchema from "../../../../containers/schema/school/transactions/teacherSubjectMappingSchema";
import { GridToolbar } from "@mui/x-data-grid";
import Loader from "../../../../containers/Layout/components/Loader";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(teacherSubjectMappingSchema),
    mode: "onChange",
  });

  const [loading, setLoading] = useState(false);

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const router = useRouter();
  const [schoolList, setSchoolList] = useState([]);
  const [teacherList, setTeacherList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  // const [schoolName, setSchoolName] = useState();
  const schoolKey = watch("schoolKey");
  const language = useSelector((state) => state.labels.language);
  const [labels, setLabels] = useState(schoolLabels[language ?? "en"]);

  useEffect(() => {
    setLabels(schoolLabels[language ?? "en"]);
  }, [setLabels, language]);

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

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getSchoolList();
    getTeacherList();
    getSubjectList();
    // getAcademicYearList();
  }, []);

  const getSchoolList = () => {
    axios
      .get(`${urls.SCHOOL}/mstSchool/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        console.log("mstSchool", r.data.mstSchoolList);
        setSchoolList(
          r.data.mstSchoolList.map((row) => ({
            id: row.id,
            schoolName: row.schoolName,
            schoolNameMr: row.schoolNameMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
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
      .catch((error) => {
        callCatchMethod(error, language);
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
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  console.log("11subjectList", subjectList);
  // Get Table - Data

  useEffect(() => {
    console.log("p");
    getTeacherSubjectMapping();
  }, []);

  useEffect(() => {
    console.log("p");
    getTeacherSubjectMapping();
  }, [fetchData, schoolList, subjectList, teacherList]);

  const getTeacherSubjectMapping = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    // console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    setLoading(true);
    axios
      .get(`${urls.SCHOOL}/mstTeacherSubjectMapping/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        // console.log("mstSubject", r);
        let result = r.data.mstTeacherSubjectMappingDao;
        let page = r?.data?.pageSize * r?.data?.pageNo;
        console.log("mstSubjectList111", result);

        let _res = result.map((r, i) => {
          return {
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1 + page,
            schoolKey: schoolList?.find((item) => item?.id == r?.schoolKey)
              ?.schoolName,
            subjectId: subjectList?.find((item) => item?.id == r?.subjectId)
              ?.subjectId,
            teacherId: teacherList?.find((item) => item?.id == r?.teacherId)
              ?.teacherName,
            remark: r.remark,
          };
        });
        console.log("resss", _res);
        setDataSource([..._res]);
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
        callCatchMethod(e, language);
        // sweetAlert(
        //   "Error",
        //   e?.message ? e?.message : "Something Went Wrong",
        //   "error"
        // );
        console.log("Eroor", e);
      });
  };

  const getTeacherSubjectMappingById = (id) => {
    console.log("___", id);
    axios
      .get(`${urls.SCHOOL}/mstTeacherSubjectMapping/getById?id=${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        // console.log("mstSubject", r);
        let result = r.data;
        console.log("________", result);
        reset(result);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const onSubmitForm = (fromData) => {
    console.log("fromData", fromData);
    // console.log("froma", fromData.schoolName.schoolName);
    // Save - DB
    let _body = {
      ...fromData,
      activeFlag: fromData.activeFlag,
      schoolKey: schoolKey,
      // schoolName: schoolList?.find((item) => item?.id === schoolKey)?.schoolName,
    };
    if (btnSaveText === "Save") {
      setLoading(true);
      const tempData = axios
        .post(`${urls.SCHOOL}/mstTeacherSubjectMapping/save`, _body, {
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
            setShowTable(true);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
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
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      // setValue("subjectId")
      setLoading(true);
      axios
        .post(`${urls.SCHOOL}/mstTeacherSubjectMapping/save`, _body, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setLoading(false);
          console.log("res", res);
          if (res.status == 201 || res.status == 200) {
            fromData.id
              ? sweetAlert(
                  "Updated!",
                  "Record Updated successfully !",
                  "success"
                )
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            getTeacherSubjectMapping();
            setButtonInputState(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
            setShowTable(true);
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
  };

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn1", willDelete);
        if (willDelete === true) {
          setLoading(true);
          axios
            .post(`${urls.SCHOOL}/mstTeacherSubjectMapping/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              setLoading(false);
              console.log("delet res", res);
              if (res.status == 201 || res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getTeacherSubjectMapping();
                // setButtonInputState(false);
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
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    } else {
      swal({
        title: "Activate?",
        text: "Are you sure you want to activate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          setLoading(true);
          axios
            .post(`${urls.SCHOOL}/mstTeacherSubjectMapping/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              setLoading(false);
              console.log("delet res", res);
              if (res.status == 201 || res.status == 200) {
                swal("Record is Successfully Activated!", {
                  icon: "success",
                });
                // getPaymentRate();
                getTeacherSubjectMapping();
                // setButtonInputState(false);
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
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
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
    setShowTable(true);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
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
    schoolKey: "",
    subjectId: "",
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    id: null,
    schoolKey: "",
    subjectId: "",
    remark: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: labels.srNo,
      flex: 1,
    },
    {
      field: "schoolKey",
      headerName: labels.schoolName,
      flex: 1,
    },

    {
      field: "teacherId",
      headerName: labels.teacher,
      flex: 1,
    },
    {
      field: "subjectId",
      headerName: labels.subject,
      flex: 1,
    },
    {
      field: "remark",
      headerName: labels.remark,
      flex: 1,
    },
    {
      field: "actions",
      headerName: labels.actions,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        console.log("pppp1", params);
        console.log("pppp12", params.row.id);
        return (
          <Box>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  // setValue("schoolKey",params.row.schoolKey)
                  // setValue("subjectId",params.row.subjectId)
                  // setValue("teacherId",params.row.teacherId)
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setShowTable(false),
                  setSlideChecked(true);
                setButtonInputState(true);
                // console.log("params.row: ", params.row);
                getTeacherSubjectMappingById(params.row.id);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            {/* <IconButton onClick={() => deleteById(params.id)}>
              <DeleteIcon />
            </IconButton> */}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                console.log("params.row", params.row);
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true);
                // setButtonInputState(true);
                // console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.row.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.row.id, "Y")}
                />
              )}
            </IconButton>
          </Box>
        );
      },
    },
  ];
  // Row

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
          // marginTop: "50px",
          // marginBottom: "60px",
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
          <h2>{labels.subjectTeacherMapping}</h2>
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
                    <Grid container>
                      {/* select school */}
                      <Grid
                        item
                        xl={6}
                        lg={6}
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
                        <FormControl
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          // sx={{ m: 1, minWidth: "50%" }}
                          error={!!errors.schoolKey}
                        >
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
                                sx={{ width: 220 }}
                                variant="standard"
                                {...field}
                                error={!!errors.schoolKey}
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
                          <FormHelperText>
                            {errors?.schoolKey ? labels.schoolRequired : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/* select teacher */}
                      <Grid
                        item
                        xl={6}
                        lg={6}
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
                        <FormControl
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          // sx={{ m: 1, minWidth: "50%" }}
                          error={!!errors.teacherId}
                        >
                          <InputLabel required error={!!errors.teacherId}>
                            {labels.selectTeacher}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="teacherId"
                            rules={{ required: true }}
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                sx={{ width: 220 }}
                                variant="standard"
                                {...field}
                                error={!!errors.teacherId}
                              >
                                {teacherList &&
                                  teacherList.map((teacher) => (
                                    <MenuItem
                                      key={teacher.id}
                                      value={teacher.id}
                                    >
                                      {teacher.teacherName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText>
                            {errors?.teacherId ? labels.teacherKeyReq : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/* select subject */}
                      <Grid
                        item
                        xl={6}
                        lg={6}
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
                        <FormControl
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          // sx={{ m: 1, minWidth: "50%" }}
                          error={!!errors.subjectId}
                        >
                          <InputLabel required error={!!errors.subjectId}>
                            {labels.selectSubject}
                          </InputLabel>
                          <Controller
                            control={control}
                            name="subjectId"
                            rules={{ required: true }}
                            defaultValue=""
                            render={({ field }) => (
                              <Select
                                sx={{ width: 220 }}
                                variant="standard"
                                {...field}
                                error={!!errors.subjectId}
                              >
                                {subjectList &&
                                  subjectList.map((subject) => (
                                    <MenuItem
                                      key={subject.id}
                                      value={subject.id}
                                    >
                                      {subject.subjectId}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                          />
                          <FormHelperText>
                            {errors?.subjectId ? labels.subjectReq : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xl={6}
                        lg={6}
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
                          // label={<FormattedLabel id="bookClassification" />}
                          id="standard-basic"
                          variant="standard"
                          label={labels.remark}
                          {...register("remark")}
                          error={!!errors.remark}
                          sx={{ width: 220 }}
                          InputProps={{ style: { fontSize: 18 } }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink: watch("remark") ? true : false,
                          }}
                          helperText={
                            errors?.remark ? errors.remark.message : null
                          }
                        />
                      </Grid>

                      {/* <Grid item xs={12} sm={6} md={3} lg={3} xl={3}></Grid> */}
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
                            // sx={{ marginRight: 8 }}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
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
                            // sx={{ marginRight: 8 }}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
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
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            variant="contained"
                            color="primary"
                            endIcon={<ExitToAppIcon />}
                            onClick={() => exitButton()}
                          >
                            {labels.exit}
                          </Button>
                        </Grid>
                      </Grid>
                      {/* </div> */}
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
            // type='primary'
            disabled={buttonInputState}
            onClick={() => {
              reset({
                ...resetValuesExit,
              });
              setEditButtonInputState(true);
              setDeleteButtonState(true);
              setBtnSaveText("Save");
              setButtonInputState(true);
              setSlideChecked(true);
              setShowTable(false);
              setIsOpenCollapse(!isOpenCollapse);
            }}
          >
            {labels.add}
          </Button>
        </div>

        <Box>
          {loading ? (
            <Loader />
          ) : (
            <>
              {showTable && (
                <DataGrid
                  components={{ Toolbar: GridToolbar }}
                  componentsProps={{
                    toolbar: {
                      showQuickFilter: true,
                      quickFilterProps: { debounceMs: 500 },
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
                    getTeacherSubjectMapping(data.pageSize, _data);
                  }}
                  onPageSizeChange={(_data) => {
                    console.log("222", _data);
                    // updateData("page", 1);
                    getTeacherSubjectMapping(_data, data.page);
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
