// import { yupResolver } from "@hookforpostm/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  Divider,
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
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import sweetAlert from "sweetalert";
import schema from "../../../../containers/schema/ElelctricBillingPaymentSchema/subDivisionSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { GridToolbar } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import schoolLabels from "../../../../containers/reuseableComponents/labels/modules/schoolLabels";
import urls from "../../../../URLS/urls";
import teacherSchema from "../../../../containers/schema/school/masters/teacherSchema";
import UploadButton from "../../transaction/fileUpload/UploadButton";
import Loader from "../../../../containers/Layout/components/Loader";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import DocumentsUpload from "../../../../components/school/documentsUploadVishal";

const Index = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(teacherSchema),
    mode: "onChange",
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = methods;
  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   methods,
  //   reset,
  //   watch,
  //   getValues,
  //   setValue,
  //   formState: { errors },
  // } = useForm({
  //   criteriaMode: "all",
  //   resolver: yupResolver(teacherSchema),
  //   mode: "onChange",
  // });
  const [loading, setLoading] = useState(false);
  const language = useSelector((state) => state.labels.language);
  const router = useRouter();
  const [dataSource, setDataSource] = useState([]);
  const [id, setID] = useState();

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [fetchData, setFetchData] = useState(null);

  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [buttonInputState, setButtonInputState] = useState();
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [labels, setLabels] = useState(schoolLabels[language ?? "en"]);
  const [schoolList, setSchoolList] = useState([]);
  const [showTable, setShowTable] = useState(true);
  const [error, setError] = useState("");
  const schoolId = watch("schoolKey");

  const [teacherPhotograph, setTeacherPhotograph] = useState();
  const [encrptTeacherPhotograph, setEncrptTeacherPhotograph] = useState(null);

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

  // For Paginantion
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getSchoolList();
  }, []);

  const getSchoolList = () => {
    axios
      .get(`${urls.SCHOOL}/mstSchool/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        // console.log("mstSchooldata", r.data);
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

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
    setTeacherPhotograph("");
  };

  useEffect(() => {
    getTeachersMaster();
  }, [fetchData, schoolList]);

  // Get Table - Data
  const getTeachersMaster = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    // console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    setLoading(true);
    axios
      .get(`${urls.SCHOOL}/mstTeacher/getAll`, {
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
        let result = r.data.mstTeacherList;
        let page = r?.data?.pageSize * r?.data?.pageNo;
        console.log("mstTeacherList", result);

        let _res = result.map((r, i) => {
          return {
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1 + page,
            schoolName: r.schoolName,
            schoolNameMr: schoolList.find((item) => item.id === r.schoolKey)
              ?.schoolNameMr,
            schoolKey: r.schoolKey,
            employeeId: r.employeeId,
            teacherName: `${r.firstName} ${r.middleName} ${r.lastName}`,
            contactDetails: r.contactDetails,
            emailDetails: r.emailDetails,
            aadharNumber: r.aadharNumber,
            firstName: r.firstName,
            middleName: r.middleName,
            lastName: r.lastName,
            gender: r.gender,
            motherTongueName: r.motherTongueName,
            permanentAddress: r.permanentAddress,
            pincode: r.pincode,
            photograph: r.photograph,
          };
        });
        console.log("Result", _res);
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

  const onSubmitForm = (formData) => {
    console.log("fromData", formData);
    // Save - DB
    let _body = {
      ...formData,
      activeFlag: formData.activeFlag,
      // photograph: teacherPhotograph,
      photograph: encrptTeacherPhotograph,
      schoolName: schoolList?.find((item) => item?.id === schoolId)?.schoolName,
    };
    if (btnSaveText === "Save") {
      setLoading(true);
      console.log("_body", _body);
      const tempData = axios
        .post(`${urls.SCHOOL}/mstTeacher/save`, _body, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setLoading(false);
          console.log("res---", res);
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
      setLoading(true);
      console.log("_body", _body);
      const tempData = axios
        .post(`${urls.SCHOOL}/mstTeacher/save`, _body, {
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
            getTeachersMaster();
            // setButtonInputState(false);
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

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to Inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          setLoading(true);
          axios
            .post(`${urls.SCHOOL}/mstTeacher/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              setLoading(false);
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getTeachersMaster();
                setButtonInputState(false);
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
        text: "Are you sure you want to Activate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          setLoading(true);
          axios
            .post(`${urls.SCHOOL}/mstTeacher/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              setLoading(false);
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Activated!", {
                  icon: "success",
                });
                // getPaymentRate();
                getTeachersMaster();
                setButtonInputState(false);
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

  const resetValuesCancell = {
    schoolKey: "",
    employeeId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    contactDetails: "",
    emailDetails: "",
    aadharNumber: "",
    motherTongueName: "",
    permanentAddress: "",
    pincode: "",
  };

  const resetValuesExit = {
    id: null,
    schoolKey: "",
    employeeId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    contactDetails: "",
    emailDetails: "",
    aadharNumber: "",
    motherTongueName: "",
    permanentAddress: "",
    pincode: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: labels.srNo,
      align: "center",
      headerAlign: "center",
      width: 100,
    },
    {
      field: language == "en" ? "schoolName" : "schoolNameMr",
      headerName: labels.schoolName,
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "teacherName",
      headerName: labels.teacherName,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "contactDetails",
      headerName: labels.mobileNumber,
      minWidth: 50,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "emailDetails",
      headerName: labels.emailId,
      minWidth: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "aadharNumber",
      headerName: labels.aadharNumber,
      minWidth: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "actions",
      headerName: labels.actions,
      headerAlign: "center",
      width: 50,
      align: "center",
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setTeacherPhotograph(params?.row?.photograph),
                  setIsOpenCollapse(true),
                  setShowTable(false),
                  setSlideChecked(true);

                // setButtonInputState(true);
                reset(params.row);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>

            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  // setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "Y")}
                />
              )}
            </IconButton>
          </Box>
        );
      },
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
          // marginTop: "10px",
          // marginBottom: "60px",
          padding: 1,
        }}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2> {labels.schoolTeacher} </h2>
        </Box>
        <Divider />
        <Box
          sx={{
            marginLeft: 5,
            marginRight: 5,
            // marginTop: 2,
            // marginBottom: 5,
            padding: 1,
            // border:1,
            // borderColor:'grey.500'
          }}
        >
          <Box>
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
                      {/* School Key */}
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
                          alignItems: "start",
                        }}
                      >
                        <FormControl
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          // sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.schoolKey}
                        >
                          <InputLabel>{labels.selectSchool} *</InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 220 }}
                                // sx={{ width: 200 }}
                                value={field.value}
                                {...register("schoolKey")}
                              >
                                {schoolList &&
                                  schoolList.map((school, index) => (
                                    <MenuItem key={index} value={school.id}>
                                      {language == "en"
                                        ? school?.schoolName
                                        : school?.schoolNameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="schoolKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText error={!!errors.schoolKey}>
                            {errors?.schoolKey ? labels.schoolReq : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* employeeId */}
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
                          alignItems: "start",
                        }}
                      >
                        <TextField
                          id="standard-textarea"
                          label={labels.empId}
                          sx={{ width: 220 }}
                          variant="standard"
                          {...register("employeeId")}
                          error={!!errors.employeeId}
                          helperText={
                            errors?.employeeId
                              ? errors.employeeId.message
                              : null
                          }
                          // InputLabelProps={{
                          //     //true
                          //     shrink:
                          //         (watch("label2") ? true : false) ||
                          //         (router.query.label2 ? true : false),
                          // }}
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
                          alignItems: "start",
                        }}
                      ></Grid>
                      {/* firstName */}
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
                          alignItems: "start",
                        }}
                      >
                        <TextField
                          id="standard-textarea"
                          label={`${labels.firstName} *`}
                          // value={approvalId}
                          sx={{ width: 220 }}
                          variant="standard"
                          {...register("firstName")}
                          error={!!errors.firstName}
                          helperText={
                            errors?.firstName ? labels.firstNameReq : null
                          }
                          InputLabelProps={{
                            shrink: watch("firstName") ? true : false,
                          }}
                        />
                      </Grid>
                      {/* middleName */}
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
                          alignItems: "start",
                        }}
                      >
                        <TextField
                          id="standard-textarea"
                          label={`${labels.middleName} *`}
                          // value={approvalId}
                          sx={{ width: 220 }}
                          variant="standard"
                          {...register("middleName")}
                          error={!!errors.middleName}
                          helperText={
                            errors?.middleName ? labels.middleNameReq : null
                          }
                          InputLabelProps={{
                            //true
                            shrink: watch("middleName") ? true : false,
                          }}
                        />
                      </Grid>
                      {/* lastName */}
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
                          alignItems: "start",
                        }}
                      >
                        <TextField
                          id="standard-textarea"
                          label={`${labels.surnameName} *`}
                          // value={approvalId}
                          sx={{ width: 220 }}
                          variant="standard"
                          {...register("lastName")}
                          error={!!errors.lastName}
                          helperText={
                            errors?.lastName ? labels.lastNameReq : null
                          }
                          InputLabelProps={{
                            //true
                            shrink: watch("lastName") ? true : false,
                          }}
                        />
                      </Grid>
                      {/* gender */}
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
                          alignItems: "start",
                        }}
                      >
                        <FormControl>
                          <FormLabel error={!!errors.gender}>
                            {labels.gender} *
                          </FormLabel>

                          <Controller
                            name="gender"
                            control={control}
                            render={({ field }) => (
                              <RadioGroup
                                {...field}
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                // {...register("gender")}
                              >
                                <FormControlLabel
                                  value="M"
                                  control={<Radio />}
                                  label={labels.male}
                                />
                                <FormControlLabel
                                  value="F"
                                  control={<Radio />}
                                  label={labels.female}
                                />
                                <FormControlLabel
                                  value="O"
                                  control={<Radio />}
                                  label={labels.other}
                                />
                              </RadioGroup>
                            )}
                          />
                          <FormHelperText error={!!errors.gender}>
                            {errors?.gender ? labels.genderReq : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/* contactDetails */}
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
                          alignItems: "start",
                        }}
                      >
                        <TextField
                          id="standard-textarea"
                          label={`${labels.mobileNumber} *`}
                          // value={approvalId}
                          sx={{ width: 220 }}
                          variant="standard"
                          {...register("contactDetails")}
                          error={!!errors.contactDetails}
                          helperText={
                            errors?.contactDetails
                              ? labels.contactDetailsReq
                              : null
                          }
                          InputLabelProps={{
                            //true
                            shrink: watch("contactDetails") ? true : false,
                          }}
                        />
                      </Grid>
                      {/* emailDetails */}
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
                          alignItems: "start",
                        }}
                      >
                        <TextField
                          id="standard-textarea"
                          label={`${labels.emailId} *`}
                          // value={approvalId}
                          sx={{ width: 220 }}
                          variant="standard"
                          {...register("emailDetails")}
                          error={!!errors.emailDetails}
                          helperText={
                            errors?.emailDetails ? labels.emailDetailsReq : null
                          }
                          InputLabelProps={{
                            //true
                            shrink: watch("emailDetails") ? true : false,
                          }}
                        />
                      </Grid>
                      {/* aadharNumber */}
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
                          alignItems: "start",
                        }}
                      >
                        <TextField
                          id="standard-textarea"
                          label={`${labels.aadharNumber} *`}
                          // value={approvalId}
                          sx={{ width: 220 }}
                          variant="standard"
                          {...register("aadharNumber")}
                          error={!!errors.aadharNumber}
                          helperText={
                            errors?.aadharNumber ? labels.aadharNumberReq : null
                          }
                          InputLabelProps={{
                            //true
                            shrink: watch("aadharNumber") ? true : false,
                          }}
                        />
                      </Grid>
                      {/* motherTongueName */}
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
                          alignItems: "start",
                        }}
                      >
                        <TextField
                          id="standard-textarea"
                          label={`${labels.motherTongue} *`}
                          // value={approvalId}
                          sx={{ width: 220 }}
                          variant="standard"
                          {...register("motherTongueName")}
                          error={!!errors.motherTongueName}
                          helperText={
                            errors?.motherTongueName
                              ? labels.motherTongueNameReq
                              : null
                          }
                          InputLabelProps={{
                            //true
                            shrink: watch("motherTongueName") ? true : false,
                          }}
                        />
                      </Grid>
                      {/* permanentAddress */}
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
                          alignItems: "start",
                        }}
                      >
                        <TextField
                          id="standard-textarea"
                          label={`${labels.permanentAddress} *`}
                          // value={approvalId}
                          sx={{ width: 220 }}
                          variant="standard"
                          {...register("permanentAddress")}
                          error={!!errors.permanentAddress}
                          helperText={
                            errors?.permanentAddress
                              ? labels.permanentAddressReq
                              : null
                          }
                          InputLabelProps={{
                            //true
                            shrink: watch("permanentAddress") ? true : false,
                          }}
                        />
                      </Grid>
                      {/* pincode */}
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
                          alignItems: "start",
                        }}
                      >
                        <TextField
                          id="standard-textarea"
                          label={`${labels.pincode} *`}
                          // value={approvalId}
                          sx={{ width: 220 }}
                          variant="standard"
                          {...register("pincode")}
                          error={!!errors.pincode}
                          helperText={
                            errors?.pincode ? labels.pincodeReq : null
                          }
                          InputLabelProps={{
                            //true
                            shrink: watch("pincode") ? true : false,
                          }}
                        />
                      </Grid>

                      {/* photograph */}
                      <Divider />
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        p={1}
                        style={{ marginTop: 22 }}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={4}
                          sm={4}
                          xs={4}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <label>{labels.teacherPhotograph}</label>
                        </Grid>
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={4}
                          sm={4}
                          xs={4}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <DocumentsUpload
                            error={!!errors?.photograph}
                            appName="TP"
                            serviceName="PARTMAP"
                            fileDtl={watch("photograph")}
                            fileKey={"photograph"}
                            // showDel={!props.onlyDoc ? true : false}
                            showDel={true}
                            view={false}
                            fileNameEncrypted={(path) => {
                              setEncrptTeacherPhotograph(path);
                            }}
                            // appName="TP"
                            // serviceName="PARTMAP"
                            // fileUpdater={setstudentDisabilityCertificate}
                            // filePath={studentDisabilityCertificate}
                          />
                          {/* <UploadButton
                            view={false}
                            appName="TP"
                            serviceName="PARTMAP"
                            fileUpdater={setTeacherPhotograph}
                            filePath={teacherPhotograph}
                          /> */}
                        </Grid>
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
                            type="submit"
                            variant="contained"
                            color="primary"
                            endIcon={<SaveIcon />}
                            // sx={{ marginRight: 8 }}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {labels.save}
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="contained"
                            color="primary"
                            endIcon={<ClearIcon />}
                            onClick={() => cancellButton()}
                            // sx={{ marginRight: 8 }}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
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
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
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
        <div
          // className={styles.addbtn}
          style={{
            display: "flex",
            justifyContent: "right",
            marginTop: 10,
            marginRight: 40,
            marginBottom: 10,
          }}
        >
          <div>
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              // type='primary'
              disabled={buttonInputState}
              onClick={() => {
                reset({
                  ...resetValuesExit,
                });
                setTeacherPhotograph("");
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
        </div>
        <Box>
          {loading ? (
            <Loader />
          ) : (
            <>
              {showTable && (
                <Box
                  sx={{
                    height: 500,
                    // width: 1000,
                    // marginLeft: 10,

                    // width: '100%',

                    overflowX: "auto",
                  }}
                >
                  <DataGrid
                    components={{ Toolbar: GridToolbar }}
                    componentsProps={{
                      toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                      },
                    }}
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
                    // autoHeight={true}
                    // rowHeight={50}
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
                      getTeachersMaster(data.pageSize, _data);
                    }}
                    onPageSizeChange={(_data) => {
                      console.log("222", _data);
                      // updateData("page", 1);
                      getTeachersMaster(_data, data.page);
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </Box>
      </Paper>
    </>
  );
};

export default Index;
