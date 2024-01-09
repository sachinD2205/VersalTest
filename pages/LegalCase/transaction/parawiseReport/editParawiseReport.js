import React, { useEffect, useState } from "react";

import Stack from "@mui/material/Stack";
import {
  Box,
  Collapse,
  IconButton,
  Slide,
  Table,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { yupResolver } from "@hookform/resolvers/yup";
// import styles from "./view.module.css";
import styles from "../../../../styles/LegalCase_Styles/parawiseReport.module.css";

// import schema from "./schema";
import {
  Card,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Paper,
  Divider,
} from "@mui/material";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
// import schema from "../parawiseReport/schema.js";
import schema from "../../../../containers/schema/LegalCaseSchema/parawiseReportSchema";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import TableRows from "./TableRow";
import axios from "axios";
import moment from "moment";
import UploadButton from "../../FileUpload/UploadButton";
import ParawiseReportAdd from "./ParawiseReportAdd";
import sweetAlert from "sweetalert";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import FileTable from "../../FileUpload/FileTable";
import { Delete, Visibility } from "@mui/icons-material";
import Loader from "../../../../containers/Layout/components/Loader";
import urls from "../../../../URLS/urls";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const ParawiseReport = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
    // defaultValues: {
    //   parawiseTrnParawiseReportDaoLst: [
    //     { issueNo: "", paragraphWiseAanswerDraftOfIssues: "" },
    //   ],
    // },
  });

  const {
    getValues,
    setValue,
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = methods;

  // const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
  //   {
  //     control,
  //     name: "parawiseTrnParawiseReportDaoLst",
  //   }
  // );

  const {
    fields: ParawiseFields,
    append: ParawiseAppend,
    remove: ParawiseRemove,
  } = useFieldArray({ control, name: "parawiseTrnParawiseReportDaoLst" });
  const {
    fields: noticeFields,
    append: noticeAppend,
    remove: noticeRemove,
  } = useFieldArray({ control, name: "testconcernDeptUserList" });
  const language = useSelector((state) => state.labels.language);

  const [noticeId, setNoticeId] = React.useState(null);
  const router = useRouter();
  const [requisitionDate, setRequisitionDate] = React.useState(null);
  const [rowsData, setRowsData] = useState([]);
  let pageType = false;
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [officeLocationList, setOfficeLocationList] = useState([]);

  const token = useSelector((state) => state.user.user.token);
  const [employeeList, setEmployeeList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [finalFiles, setFinalFiles] = useState([]);
  const [attachedFile, setAttachedFile] = useState("");
  const [mainFiles, setMainFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [loading, setLoading] = useState(false);

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

  const selectedNotice = useSelector((state) => {
    console.log("selectedNotice", state.user.selectedNotice);
    return state.user.selectedNotice;
  });

  const [audienceSample, setAudienceSample] = useState(selectedNotice);

  if (router.query.pageMode === "Add" || router.query.pageMode === "View") {
    pageType = true;
  }

  useEffect(() => {
    setLoading(true);
    getDepartments();
    // getAuthority();
    getOfficeLocation();
    // getUserName();
    getDepartmentName();

    pageType = true;
    setNoticeId(router?.query?.id);
    selectedNotice.parawiseTrnParawiseReportDaoLst?.map((val, index) => {
      console.log("2321", val);
      return ParawiseAppend({
        issueNo: index + 1,
        paragraphWiseAanswerDraftOfIssues:
          val?.paragraphWiseAanswerDraftOfIssues,
        id: val?.id,
      });
    });

    setAudienceSample(selectedNotice);
    let _res = audienceSample;

    console.log("_res", _res.concernDeptUserList[0]?.locationId);

    setValue(
      "noticeRecivedDate",
      _res.noticeRecivedDate ? _res.noticeRecivedDate : "Not Available"
    );
    setValue("noticeDate", _res.noticeDate ? _res.noticeDate : "Not Available");
    setValue(
      "noticeRecivedFromAdvocatePerson",
      _res.noticeRecivedFromAdvocatePerson
        ? _res.noticeRecivedFromAdvocatePerson
        : "Not Available"
    );
    setValue(
      "requisitionDate",
      _res.requisitionDate ? _res.requisitionDate : "Not Available"
    );
    setValue(
      "department",
      _res.concernDeptUserList[0]?.departmentId
        ? _res.concernDeptUserList[0]?.departmentId
        : "Not Available"
    );
    setValue(
      "locationName",
      _res.concernDeptUserList[0]?.locationId
        ? _res.concernDeptUserList[0]?.locationId
        : "Not Available"
    );
    setValue(
      "noticeDetails",
      _res.noticeDetails ? _res.noticeDetails : "Not Available"
    );
    setValue("remark", _res.remark ? _res.remark : "-");
    setValue("inwardNo", _res.inwardNo ? _res.inwardNo : "-");

    selectedNotice.concernDeptUserList?.map((val, index) => {
      return noticeAppend({
        issueNo: index + 1,
        departmentId: val?.departmentId,
        locationId: val?.locationId,
      });
    });

    // reset({
    //   noticeRecivedFromAdvocatePerson:
    //     router.query.noticeRecivedFromAdvocatePerson,
    //   noticeDate: router.query.noticeDate,
    //   department: router.query.department,
    //   noticeRecivedDate: router.query.noticeRecivedDate,
    //   requisitionDate: router.query.requisitionDate,
    //   locationName: selectedNotice.concernDeptUserList[0].locationId,
    //   remark: router.query.remark,
    //   noticeDetails: router.query.noticeDetails,
    // });
  }, [selectedNotice]);

  // const getUserName = async () => {
  //   await axios
  //     .get(`${urls.CFCURL}/master/user/getAllOLD`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((r) => {
  //       if (r.status == 200) {
  //         console.log("res user", r);
  //         setEmployeeList(r.data.user);
  //       }
  //     })
  //     ?.catch((err) => {
  //       console.log("err", err);
  //       callCatchMethod(err, language);
  //     });
  // };

  const getDepartmentName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("res department", r);
        if (r.status == 200) {
          setDepartmentList(r.data.department);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const addTableRows = () => {
    const rowsInput = {
      fullName: "",
      emailAddress: "",
      salary: "",
    };
    setRowsData([...rowsData, rowsInput]);
  };
  const deleteTableRows = (index) => {
    const rows = [...rowsData];
    rows.splice(index, 1);
    setRowsData(rows);
  };
  const handleChange = (index, evnt) => {
    const { name, value } = evnt.target;
    const rowsInput = [...rowsData];
    rowsInput[index][name] = value;
    setRowsData(rowsInput);
  };

  const columns = [
    {
      headerName: <FormattedLabel id="srNo" />,
      field: "srNo",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
    },
    {
      headerName: <FormattedLabel id="fileName" />,
      field: "originalFileName",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      headerName: <FormattedLabel id="fileType" />,
      field: "extension",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      headerName: <FormattedLabel id="uploadedBy" />,
      field: "attachedName",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Action",
      headerName: <FormattedLabel id="action" />,
      flex: 1,
      align: "center",
      headerAlign: "center",

      renderCell: (record) => {
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                window.open(
                  `${urls.CFCURL}/preview?filePath=${record.row.filePath}`,
                  "_blank"
                );
              }}
            >
              <Visibility
                sx={{
                  "@media (max-width: 400px)": {
                    fontSize: "16px",
                  },
                }}
              />
            </IconButton>

            <IconButton
              color="error"
              onClick={() =>
                discard(record.row.attachmentName, record.row.srNo)
              }
            >
              <Delete
                sx={{
                  "@media (max-width: 400px)": {
                    fontSize: "16px",
                  },
                }}
              />
            </IconButton>
          </>
        );
      },
    },
  ];

  const _columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "noticeSentDate",
      headerName: <FormattedLabel id="remarkDate" />,
      // type: "number",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "noticeRecivedFromPerson",
      headerName: <FormattedLabel id="user" />,
      // type: "number",
      width: 250,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: "designation",
    //   headerName: "Designation",
    //   // type: "number",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "department",
      headerName: <FormattedLabel id="deptName" />,
      // type: "number",
      width: 150,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: "Remark Time",
    //   headerName: "Remark Time",
    //   width: 120,
    //   align: "center",
    //   headerAlign: "center",
    // },
  ];

  const exitButton = () => {
    // reset({
    //   ...resetValuesExit,
    // });
    // setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    // setEditButtonInputState(false);
    // setDeleteButtonState(false);
  };

  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    const noticeAttachment = [...selectedNotice.noticeAttachment];
    const noticeHisotry = [...selectedNotice.noticeHisotry];

    if (employeeList.length > 0 && departmentList.length > 0) {
      setLoading(false);
      let _noticeAttachment = noticeAttachment.map((file, index) => {
        console.log("23", file);
        return {
          id: file.id ? file.id : "Not Available",
          srNo: file.id ? file.id : "Not Available",
          originalFileName: file.originalFileName
            ? file.originalFileName
            : "Not Available",
          extension: file.extension ? file.extension : "Not Available",
          attachedName: file.attachmentNameEng
            ? file.attachmentNameEng
            : "Not Available",
          filePath: file.filePath ? file.filePath : "-",
        };
      });

      let _noticeHisotry = noticeHisotry.map((file, index) => {
        console.log("24", file);
        return {
          id: index,
          srNo: index + 1,
          remark: file.remark ? file.remark : "-",
          designation: file.designation ? file.designation : "Not Available",
          noticeRecivedFromPerson: employeeList.find(
            (obj) => obj.id === file.noticeRecivedFromPerson
          )?.firstNameEn
            ? employeeList.find(
                (obj) => obj.id === file.noticeRecivedFromPerson
              )?.firstNameEn
            : "Not Available",
          department: departmentList?.find(
            (obj) =>
              obj.id === selectedNotice.concernDeptUserList[0]?.departmentId
          )?.department
            ? departmentList?.find(
                (obj) =>
                  obj.id === selectedNotice.concernDeptUserList[0]?.departmentId
              )?.department
            : "Not Available",
          noticeSentDate: file.noticeSentDate
            ? file.noticeSentDate
            : "Not Available",
        };
      });

      _noticeAttachment !== null && setMainFiles([..._noticeAttachment]);
      console.log("test1", _noticeAttachment);
      _noticeHisotry !== null && setDataSource([..._noticeHisotry]);
      console.log("test2", _noticeHisotry);
    }
  }, [employeeList, departmentList]);

  useEffect(() => {
    setFinalFiles([...mainFiles, ...additionalFiles]);
  }, [mainFiles, additionalFiles]);

  useEffect(() => {
    // getNoticeDetails();
  }, [departments]);

  // Get Table - Data
  const getNoticeDetails = () => {
    axios
      .get(`${urls.LCMSURL}/notice/getTrnNoticeData`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setDataSource(
          res.data.map((r, i) => ({
            srNo: i + 1,
            id: r.id,
            noticeDate: moment(r.noticeDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            noticeRecivedDate: moment(r.noticeRecivedDate, "YYYY-MM-DD").format(
              "YYYY-MM-DD"
            ),
            requisitionDate: moment(r.requisitionDate, "YYYY-MM-DD").format(
              "YYYY-MM-DD"
            ),
            documentOriName: r.documentOriName,
            noticeRecivedFromAdvocatePerson: r.noticeRecivedFromAdvocatePerson,
            department: r.department,
            departmentName: departments?.find((obj) => obj?.id === r.department)
              ?.department,
            firstName: r.firstName,

            // department: r.department,
          }))
        );
      });
  };
  const [departments, setDepartments] = useState([]);

  const getDepartments = () => {
    axios
      // .get(`http://localhost:8090/cfc/api/master/department/getAll`)
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((res) => {
        setDepartments(
          res.data.department.map((r, i) => ({
            id: r.id,
            department: r.department,
          }))
        );
      });
  };
  const [authority, setAuthority] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");

  const getAuthority = () => {
    axios
      .get(`${urls.CFCURL}/master/employee/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Authority yetayt ka re: ", res.data);
        setAuthority(
          res.data.map((r, i) => ({
            id: r.id,
            firstName: r.firstName,
            middleName: r.middleName,
            lastName: r.lastName,
            department: r.department,
            departmentName: departments?.find((obj) => obj?.id === r.department)
              ?.department,
          }))
        );
      });
  };

  const getOfficeLocation = () => {
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          console.log("res office location", r);
          setOfficeLocationList(r.data.officeLocation);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const onSubmitForm = (fromData) => {
    const finalBody = {
      ...fromData,
      id: Number(noticeId),
      activeFlag: "Y",
      pageMode:
        window.event.submitter.name == "save"
          ? "PARAWISE_REPORT_CREATE"
          : "PARAWISE_REPORT_DRAFT",
      timeStamp: moment(new Date()).unix().toString(),
      parawiseTrnParawiseReportDaoLst:
        fromData?.parawiseTrnParawiseReportDaoLst.map((val, index) => ({
          issueNo: val.issueNo,
          paragraphWiseAanswerDraftOfIssues:
            val.paragraphWiseAanswerDraftOfIssues,
          id: val.id,
        })),
    };

    console.log("finalBody", finalBody);

    axios
      .post(`http://localhost:8098/lc/api/notice/saveTrnNotice`, finalBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((res) => {
        if (res.status == 201) {
          sweetAlert("Saved!", "Record Saved successfully !", "success");
          router.push(`/LegalCase/transaction/newNotice`);
        } else {
          sweetAlert("Erro!", "Record Not save successfully !", "erroe");
        }
      });
  };
  return (
    <Box>
      {loading ? (
        <Loader />
      ) : (
        <Box>
          <Paper
            style={{ border: "1px solid black" }}
            sx={{
              marginY: "10px",
              paddingY: "5px",
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "600" }}>
              {/* Parawise Report */}
              <FormattedLabel id="parawiseReport" />
            </Typography>
          </Paper>
          <Paper style={{ border: "1px solid black" }}>
            {/* Notice Form */}
            <div>
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmitForm)}>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sm={8}
                      md={6}
                      lg={4}
                      xl={2}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        style={{ marginTop: 10 }}
                        error={!!errors.noticeDate}
                        fullWidth
                        sx={{ width: "90%" }}
                      >
                        <Controller
                          control={control}
                          name="noticeDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    {/* Notice Date */}
                                    <FormattedLabel id="noticeDatae" />
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    disabled
                                    InputLabelProps={{
                                      style: {
                                        fontSize: 12,
                                        marginTop: 3,
                                      },
                                    }}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.noticeDate
                            ? errors.noticeDate.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={8}
                      md={6}
                      lg={4}
                      xl={2}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        fullWidth
                        sx={{ width: "90%" }}
                        autoFocus
                        disabled
                        InputLabelProps={{ shrink: true }}
                        id="standard-basic"
                        label={<FormattedLabel id="inwardNo" />}
                        variant="standard"
                        {...register("inwardNo")}
                        error={!!errors.inwardNo}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={8}
                      md={6}
                      lg={4}
                      xl={2}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        autoFocus
                        sx={{ width: "90%" }}
                        id="standard-basic"
                        disabled
                        label={
                          <FormattedLabel id="noticeReceviedFromAdvocate" />
                        }
                        variant="standard"
                        {...register("noticeRecivedFromAdvocatePerson")}
                        error={!!errors.noticeRecivedFromAdvocatePerson}
                        helperText={
                          errors?.noticeRecivedFromAdvocatePerson
                            ? errors.noticeRecivedFromAdvocatePerson.message
                            : null
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    style={{
                      padding: "10px",
                      backgroundColor: "white",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      sm={8}
                      md={6}
                      lg={4}
                      xl={2}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        style={{ marginTop: 10 }}
                        error={!!errors.noticeReceivedDate}
                        fullWidth
                        sx={{ width: "90%" }}
                      >
                        <Controller
                          control={control}
                          name="noticeRecivedDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    {/* Notice Received date */}
                                    <FormattedLabel id="noticeReceviedDate" />
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    disabled
                                    InputLabelProps={{
                                      style: {
                                        fontSize: 12,
                                        marginTop: 3,
                                      },
                                    }}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.noticeReceivedDate
                            ? errors.noticeReceivedDate.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    {noticeFields.map((parawise, index) => {
                      return (
                        <>
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={6}
                            xl={6}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <FormControl
                              variant="standard"
                              fullWidth
                              size="small"
                              sx={{ width: "90%" }}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                {/* Department Name */}
                                <FormattedLabel id="deptName" />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    // label="Department Name"
                                    label={<FormattedLabel id="deptName" />}
                                    disabled
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                  >
                                    {departments &&
                                      departments.map((department, index) => (
                                        <MenuItem
                                          key={index}
                                          value={department.id}
                                        >
                                          {department.department}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                // name="department"
                                {...register(
                                  `testconcernDeptUserList.${index}.departmentId`
                                )}
                                control={control}
                                defaultValue=""
                              />
                            </FormControl>
                          </Grid>

                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={6}
                            lg={6}
                            xl={6}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <FormControl
                              variant="standard"
                              fullWidth
                              size="small"
                              sx={{ width: "90%" }}
                            >
                              <InputLabel
                                id="demo-simple-select-standard-label"
                                shrink
                              >
                                <FormattedLabel id="subDepartment" />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    label="Office Location"
                                    disabled
                                    value={field.value}
                                    onChange={(value) => {
                                      field.onChange(value);
                                    }}
                                  >
                                    {officeLocationList &&
                                      officeLocationList.map((val, id) => (
                                        <MenuItem key={id} value={val.id}>
                                          {val.officeLocationName}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                // name="locationName"
                                {...register(
                                  `testconcernDeptUserList.${index}.locationId`
                                )}
                                control={control}
                                defaultValue=""
                              />
                            </FormControl>
                          </Grid>
                        </>
                      );
                    })}
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      xl={6}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FormControl
                        style={{ marginTop: 10 }}
                        error={!!errors.requisitionDate}
                        fullWidth
                        size="small"
                        sx={{ width: "90%" }}
                      >
                        <Controller
                          control={control}
                          name="requisitionDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    {/* Requisition Date */}
                                    <FormattedLabel id="requisitionDate" />
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                disabled
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    InputLabelProps={{
                                      style: {
                                        fontSize: 12,
                                        marginTop: 3,
                                      },
                                    }}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.fromDate
                            ? errors.requisitionDate.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      xl={6}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        autoFocus
                        fullWidth
                        sx={{ width: "90%" }}
                        multiline
                        InputLabelProps={{ shrink: true }}
                        id="standard-basic"
                        disabled
                        label={<FormattedLabel id="noticeDetails" />}
                        variant="standard"
                        {...register("noticeDetails")}
                        error={!!errors.noticeDetails}
                        helperText={
                          errors?.noticeDetails
                            ? errors.noticeDetails.message
                            : null
                        }
                      />
                    </Grid>
                  </Grid>
                  <Box>
                    <Divider />
                    <Grid
                      container
                      style={{
                        paddingTop: "10px",
                        backgroundColor: "white",
                      }}
                    >
                      <Grid
                        item
                        xs={12}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Typography
                          style={{ fontWeight: 900, fontSize: "20px" }}
                        >
                          <FormattedLabel id="noticeAttachment" />
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <FileTable
                          appName="LCMS" //Module Name
                          serviceName={"L-Notice"} //Transaction Name
                          fileName={attachedFile} //State to attach file
                          filePath={setAttachedFile} // File state upadtion function
                          newFilesFn={setAdditionalFiles} // File data function
                          columns={columns} //columns for the table
                          rows={finalFiles} //state to be displayed in table
                          uploading={setUploading}
                        />
                      </Grid>
                    </Grid>
                    <Divider />
                    <Grid
                      container
                      style={{ padding: "10px", backgroundColor: "white" }}
                    >
                      <Grid
                        item
                        xs={12}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Typography
                          style={{ fontWeight: 900, fontSize: "20px" }}
                        >
                          <FormattedLabel id="noticeHistory" />
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <DataGrid
                          disableColumnFilter
                          disableColumnSelector
                          // disableToolbarButton
                          disableDensitySelector
                          components={{ Toolbar: GridToolbar }}
                          componentsProps={{
                            toolbar: {
                              showQuickFilter: true,
                              quickFilterProps: { debounceMs: 500 },
                              printOptions: { disableToolbarButton: true },
                              // disableExport: true,
                              // disableToolbarButton: true,
                              csvOptions: { disableToolbarButton: true },
                            },
                          }}
                          autoHeight
                          rows={dataSource}
                          columns={_columns}
                          pageSize={5}
                          rowsPerPageOptions={[5]}
                        />
                      </Grid>
                    </Grid>

                    {/* Parawise Report */}
                    <Paper
                      style={{
                        border: "1px solid black",
                        padding: 1,
                      }}
                    >
                      <Box>
                        <Grid container>
                          <Grid
                            item
                            xs={1}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <h3>
                              <FormattedLabel id="pointNo" />
                            </h3>
                          </Grid>
                          <Grid
                            item
                            xs={10}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <h3>
                              <FormattedLabel id="pointExp" />
                            </h3>
                          </Grid>
                          <Grid
                            item
                            xs={1}
                            sx={{
                              display: "flex",
                              justifyContent: "end",
                              alignItems: "center",
                            }}
                          >
                            <Button
                              size="small"
                              onClick={() =>
                                ParawiseAppend({
                                  // srNO: "",
                                  issueNo: "",
                                  paragraphWiseAanswerDraftOfIssues: "",
                                })
                              }
                              // color="#e0e0e0"
                              style={{
                                // background: "#e0e0e0",
                                backgroundColor: "LightGray",
                                // background: "#89CFF0",
                              }}
                            >
                              Add Points
                            </Button>
                          </Grid>
                        </Grid>
                        <Box
                          overflow="auto"
                          height={250}
                          flex={1}
                          flexDirection="column"
                          display="flex"
                          p={2}
                          padding="0px"
                        >
                          {ParawiseFields.map((parawise, index) => {
                            return (
                              <>
                                <Grid
                                  container
                                  className={styles.theme2}
                                  component={Box}
                                  style={{ marginTop: "10px" }}
                                >
                                  <Grid
                                    item
                                    xs={1}
                                    sx={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <TextField
                                      sx={{
                                        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                                          {
                                            display: "none",
                                          },
                                        "& input[type=number]": {
                                          MozAppearance: "textfield",
                                        },
                                      }}
                                      placeholder="Point No."
                                      size="small"
                                      fullWidth
                                      type="number"
                                      defaultValue=""
                                      // oninput="auto_height(this)"
                                      {...register(
                                        `parawiseTrnParawiseReportDaoLst.${index}.issueNo`
                                      )}
                                    ></TextField>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={8}
                                    sm={7}
                                    md={9}
                                    lg={9}
                                    xl={9}
                                    sx={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <TextField
                                      sx={{ width: "95%" }}
                                      multiline
                                      defaultValue=""
                                      placeholder="Parawise point"
                                      size="small"
                                      {...register(
                                        `parawiseTrnParawiseReportDaoLst.${index}.paragraphWiseAanswerDraftOfIssues`
                                      )}
                                    ></TextField>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={2}
                                    sx={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Button
                                      variant="contained"
                                      size="small"
                                      startIcon={<DeleteIcon />}
                                      sx={{
                                        color: "white",
                                        backgroundColor: "red",

                                        "@media (max-width: 400px)": {
                                          fontSize: "10px",
                                        },
                                      }}
                                      onClick={() => {
                                        // remove({
                                        //   applicationName: "",
                                        //   roleName: "",
                                        // });
                                        // remove(index);
                                        ParawiseRemove(index);
                                      }}
                                    >
                                      {/* Delete */}
                                      <FormattedLabel id="delete" />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </>
                            );
                          })}
                          {/* </ThemeProvider> */}
                        </Box>
                      </Box>
                    </Paper>
                  </Box>
                  <Box
                    style={{
                      padding: "20px",
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      size="small"
                      type="submit"
                      variant="contained"
                      color="error"
                      onClick={() =>
                        router.push(`/LegalCase/transaction/newNotice`)
                      }
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      type="submit"
                      name="save"
                    >
                      {/* Save */}
                      <FormattedLabel id="save" />
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      type="submit"
                      name="draft"
                    >
                      {/* Save As Draft */}
                      <FormattedLabel id="saveAsDraft" />
                    </Button>
                    {/* <Button
                  size="small"
                  sx={{ marginRight: 8 }}
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setSlideChecked(true);
                    setIsOpenCollapse(!isOpenCollapse);
                  }}
                >
                  Action
                </Button> */}
                  </Box>
                  {/* <div className={styles.btn}>
                <Button
                  sx={{ marginRight: 8 }}
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    router.push(`/LegalCase/transaction/parawiseReport`)
                  }
                >
                  Back
                </Button>{" "}
                <Button
                  sx={{ marginRight: 8 }}
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Save
                </Button>
                <Button
                  sx={{ marginRight: 8 }}
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setSlideChecked(true);
                    setIsOpenCollapse(!isOpenCollapse);
                  }}
                >
                  Action
                </Button>
              </div> */}

                  {/* action paper */}
                  <Slide
                    direction="down"
                    in={slideChecked}
                    mountOnEnter
                    unmountOnExit
                  >
                    <Paper style={{ border: "1px solid black" }}>
                      <div className={styles.container}>
                        <div className={styles.col1}>
                          <FormControl
                            variant="standard"
                            sx={{ m: 1, minWidth: 120 }}
                            error={!!errors.caseMainType}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Status
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: 280 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Status"
                                >
                                  <MenuItem value="s">
                                    Forward to next Authority with Approval
                                  </MenuItem>

                                  <MenuItem value="s">
                                    Forward to next Authority with Reject
                                  </MenuItem>
                                  {/* {caseMainTypes &&
                                caseMainTypes.map((caseMainType, index) => (
                                  <MenuItem key={index} value={caseMainType.id}>
                                    {caseMainType.caseMainType}
                                  </MenuItem>
                                ))} */}
                                </Select>
                              )}
                              name="caseMainType"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.caseMainType
                                ? errors.caseMainType.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </div>

                        <div className={styles.col2}>
                          <FormControl
                            variant="standard"
                            sx={{ minWidth: 230 }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              {/* Department Name */}
                              <FormattedLabel id="deptName" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  // label="Department Name"
                                  label={<FormattedLabel id="deptName" />}
                                  value={field.value}
                                  onChange={(event) => {
                                    setSelectedDept(event.target.value);
                                    field.onChange(event);
                                  }}
                                >
                                  {departments &&
                                    departments.map((department, index) => (
                                      <MenuItem
                                        key={index}
                                        value={department.id}
                                      >
                                        {department.department}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="department"
                              control={control}
                              defaultValue=""
                            />
                          </FormControl>
                        </div>

                        <div className={styles.col2}>
                          <FormControl
                            variant="standard"
                            sx={{ m: 1, minWidth: 120 }}
                            error={!!errors.caseMainType}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Authority
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: 200 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Authority"
                                >
                                  {authority &&
                                    authority
                                      .filter((object) => {
                                        return (
                                          object.department === selectedDept
                                        );
                                      })
                                      .map((authority, index) => (
                                        <MenuItem
                                          key={index}
                                          value={authority.id}
                                        >
                                          {authority.firstName +
                                            " " +
                                            authority.middleName +
                                            " " +
                                            authority.lastName}
                                        </MenuItem>
                                      ))}
                                </Select>
                              )}
                              name="caseMainType"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.caseMainType
                                ? errors.caseMainType.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </div>

                        <div style={styles.col3}>
                          {/* <label>Remarks</label> */}
                          <TextareaAutosize
                            aria-label="empty textarea"
                            placeholder="Remarks"
                            style={{ width: 200, marginTop: 20 }}
                          />
                        </div>
                      </div>

                      <div className={styles.btn1}>
                        <Button
                          sx={{ marginRight: 8 }}
                          // type="submit"
                          variant="contained"
                          color="primary"
                          onClick={() => exitButton()}

                          // onClick={() =>
                          //   router.push(`/LegalCase/transaction/parawiseReport`)
                          // }
                        >
                          Cancel
                        </Button>
                        <Button
                          sx={{ marginRight: 8 }}
                          variant="contained"
                          color="primary"
                          // onClick={() => cancellButton()}
                        >
                          Forward
                        </Button>
                      </div>
                    </Paper>
                  </Slide>
                </form>
              </FormProvider>
            </div>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default ParawiseReport;

// Table Rows
