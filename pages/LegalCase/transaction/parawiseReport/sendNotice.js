import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  Modal,
  Paper,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import urls from "../../../../URLS/urls";
import FileTable from "../../FileUpload/FileTableLcWithoutAddButton";
import { Visibility } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { toast, ToastContainer } from "react-toastify";
import UndoIcon from "@mui/icons-material/Undo";
import sweetAlert from "sweetalert";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const SendNotice = () => {
  const methods = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      parawiseTrnParawiseReportDaoLst: [
        {
          issueNo: "",
          paragraphWiseAanswerDraftOfIssues: "",
          paragraphWiseAanswerDraftOfIssuesMarathi: "",
        },
      ],
    },
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
  const [noticeId, setNoticeId] = React.useState(null);
  const router = useRouter();

  const [requisitionDate, setRequisitionDate] = React.useState(null);
  let pageType = false;
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [officeLocationList, setOfficeLocationList] = useState([]);
  const [mode, setMode] = useState();
  const token = useSelector((state) => state.user.user.token);
  const [employeeList, setEmployeeList] = useState([]);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [finalFiles, setFinalFiles] = useState([]);
  const [attachedFile, setAttachedFile] = useState("");
  const [mainFiles, setMainFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [authority, setAuthority] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [audienceSample, setAudienceSample] = useState(selectedNotice);
  const [noticeData, setNoticeData] = useState();
  const language = useSelector((state) => state.labels.language);
  // noticeData
  const [concerDeptList, setConcernDeptList] = useState([]);
  const [noticeHistoryList, setNoticeHistoryList] = useState([]);
  const handleOpen = (mode) => {
    setOpen(true);
    setMode(mode);
  };
  const handleClose = () => setOpen(false);
  const [parawiseReportList, setParawiseReportList] = useState([]);
  const [open, setOpen] = useState(false);

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
  const onFinish = () => {};
  // userName
  // const getUserName = async () => {
  //   await axios
  //     .get(`${urls.CFCURL}/master/user/getAll`, {
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

  // departments
  const getDepartments = () => {
    axios
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
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // authority
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
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // Location
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
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const onSubmitForm = (data) => {
    const _data = {
      ...noticeData,
      pageMode: "EDIT",
      // noticeAttachment: selectedNotice.noticeAttachment,
      id: noticeId,
      receiverUser: data.employeeName,
      receiverDesignation: data.designationName,
      receiverDepartment: data.departmentName,
      remark: data.parawiseRemark,
      departmentName: null,
      pageMode:
        mode === "Reassign"
          ? "PARAWISE_REPORT_REASSIGN"
          : "PARAWISE_REPORT_APPROVE",
      timeStamp: moment(new Date()).unix().toString(),
    };

    console.log("data", data, _data);

    axios
      .post(`${urls.LCMSURL}/notice/saveTrnNotice`, _data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 201 || r.status == 200) {
          sweetAlert("Saved!", "Record Saved successfully !", "success");
          router.push(`/LegalCase/transaction/newNotice`);
        } else {
          console.log("Login Failed ! Please Try Again !");
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // Notice Attachments
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
      field: language === "en" ? "attachedNameEn" : "attachedNameMr",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: <FormattedLabel id="action" />,
      headerName: "Action",
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
                  `${urls.CFCURL}/file/preview?filePath=${record.row.filePath}`,

                  "_blank"
                );
              }}
            >
              <Visibility />
            </IconButton>
          </>
        );
      },
    },
  ];

  // Notice Remark
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
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "noticeRecivedFromPerson",
      headerName: <FormattedLabel id="user" />,
      width: 250,
      align: "center",
      headerAlign: "center",
    },

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
  ];

  // concer Dept noticeAttachment
  const _col = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language === "en" ? "locationNameEn" : "locationNameMr",
      headerName: <FormattedLabel id="deptName" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language === "en" ? "departmentNameEn" : "departmentNameMr",
      headerName: <FormattedLabel id="subDepartment" />,
      flex: 1,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
  ];

  const parawiseRportColums = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "issueNo",
      headerName: <FormattedLabel id="issueNo" />,
      flex: 1,
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "paragraphWiseAanswerDraftOfIssues",
      headerName: <FormattedLabel id="pointsExp" />,
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "paragraphWiseAanswerDraftOfIssuesMarathi",
      headerName: <FormattedLabel id="pointsExp" />,
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
  ];

  useEffect(() => {
    getDepartments();
    getOfficeLocation();
    // getUserName();
    getAuthority();
    setNoticeData(selectedNotice);
  }, []);

  useEffect(() => {
    console.log("Notice DAta", noticeData);
    reset(noticeData);

    // notice id
    setNoticeId(noticeData?.id);

    // concernDept - Details
    let _ress = noticeData?.concernDeptUserList?.map((val, i) => {
      console.log("resd", val);
      return {
        srNo: i + 1,
        id: i,
        departmentNameEn: departments?.find(
          (obj) => obj?.id === val.departmentId
        )?.department,
        departmentNameMr: departments?.find(
          (obj) => obj?.id === val.departmentId
        )?.departmentMr,
        locationNameEn: officeLocationList?.find(
          (obj) => obj?.id === val.locationId
        )?.officeLocationName,
        locationNameMr: officeLocationList?.find(
          (obj) => obj?.id === val.locationId
        )?.officeLocationNameMar,
        departmentId: val?.departmentId,
        locationId: val?.locationId,
      };
    });
    setConcernDeptList(_ress);

    // Notice History
    let _noticeHisotry = noticeData?.noticeHisotry?.map((file, index) => {
      return {
        id: index,
        srNo: index + 1,
        remark: file.remark ? file.remark : "-",
        designation: file.designation ? file.designation : "Not Available",
        noticeRecivedFromPerson: employeeList.find(
          (obj) => obj.id === file.noticeRecivedFromPerson
        )?.firstNameEn
          ? employeeList.find((obj) => obj.id === file.noticeRecivedFromPerson)
              ?.firstNameEn
          : "Not Available",
        department: departments?.find(
          (obj) =>
            obj.id === selectedNotice.concernDeptUserList[0]?.departmentId
        )?.department
          ? departments?.find(
              (obj) =>
                obj.id === selectedNotice.concernDeptUserList[0]?.departmentId
            )?.department
          : "Not Available",
        noticeSentDate: file.noticeSentDate
          ? file.noticeSentDate
          : "Not Available",
      };
    });

    setNoticeHistoryList(_noticeHisotry);

    // Notice Attachment
    if (employeeList.length > 0 && departments.length > 0) {
      const noticeAttachment = [...selectedNotice.noticeAttachment];
      let _noticeAttachment = noticeAttachment.map((file, index) => {
        console.log("23", file);
        return {
          id: file.id ? file.id : "Not Available",
          srNo: file.id ? file.id : "Not Available",
          originalFileName: file.originalFileName
            ? file.originalFileName
            : "Not Available",
          extension: file.extension ? file.extension : "Not Available",
          attachedNameEn: file.attachedNameEn
            ? file.attachedNameEn
            : "Not Available",
          attachedNameMr: file.attachedNameMr
            ? file.attachedNameMr
            : "Not Available",
          filePath: file.filePath ? file.filePath : "-",
        };
      });
      _noticeAttachment !== null && setMainFiles([..._noticeAttachment]);
    }

    // Parawise Report
    let _parawiseReport = noticeData?.parawiseTrnParawiseReportDaoLst?.map(
      (val, i) => {
        console.log("resd", val);
        return {
          srNo: i + 1,
          id: i,
          paragraphWiseAanswerDraftOfIssues:
            val?.paragraphWiseAanswerDraftOfIssues,
          paragraphWiseAanswerDraftOfIssuesMarathi:
            val?.paragraphWiseAanswerDraftOfIssuesMarathi,
          issueNo: val?.issueNo,
        };
      }
    );
    setParawiseReportList(_parawiseReport);
  }, [officeLocationList, departments, employeeList, authority, noticeData]);

  useEffect(() => {
    console.log("parawiseReportList", parawiseReportList);
    console.log("concerDeptList", concerDeptList);
  }, [concerDeptList, noticeHistoryList, finalFiles, parawiseReportList]);

  useEffect(() => {
    setFinalFiles([...mainFiles, ...additionalFiles]);
  }, [mainFiles, additionalFiles]);

  // view
  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmitForm)}>
          <Paper
            sx={{
              margin: 3,
              padding: 2,
            }}
            elevation={5}
          >
            {loading ? (
              <Loader />
            ) : (
              <>
                <Box
                  style={{
                    marginTop: "10px",
                  }}
                >
                  {/* Form Header */}
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
                    <h2>
                      <FormattedLabel id="parawiseResponse" />
                    </h2>
                  </Box>
                </Box>
                <div
                  style={{
                    backgroundColor: "#0084ff",
                    color: "white",
                    fontSize: 19,
                    marginTop: 30,
                    marginBottom: 30,
                    padding: 8,
                    paddingLeft: 30,
                    marginLeft: "40px",
                    marginRight: "65px",
                    borderRadius: 100,
                  }}
                >
                  <strong>{<FormattedLabel id="noticeDetails" />}</strong>
                </div>

                <ThemeProvider theme={theme}>
                  <div style={{ marginBottom: "5vh" }}>
                    <Grid container>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <FormControl
                          sx={{ marginTop: 0 }}
                          error={!!errors.noticeDate}
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
                                    <span
                                      style={{ fontSize: 16, marginTop: 2 }}
                                    >
                                      <FormattedLabel id="noticeDate" />
                                    </span>
                                  }
                                  value={field.value}
                                  disabled
                                  onChange={(date) => {
                                    field.onChange(
                                      moment(date).format("YYYY-MM-DD")
                                    );
                                  }}
                                  // selected={field.value}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size="small"
                                      fullWidth
                                      InputLabelProps={{
                                        style: {
                                          fontSize: 12,
                                          marginTop: 3,
                                        },
                                      }}
                                      error={!!errors.noticeDate}
                                      helperText={
                                        errors?.noticeDate
                                          ? errors?.noticeDate.message
                                          : null
                                      }
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
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <TextField
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
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <TextField
                          disabled
                          id="standard-basic"
                          label={
                            <FormattedLabel id="noticeRecivedFromAdvocatePerson" />
                          }
                          variant="standard"
                          InputLabelProps={{ shrink: true }}
                          {...register("noticeRecivedFromAdvocatePerson")}
                          error={!!errors.noticeRecivedFromAdvocatePerson}
                          helperText={
                            errors?.noticeRecivedFromAdvocatePerson
                              ? errors.noticeRecivedFromAdvocatePerson.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <FormControl
                          error={!!errors.noticeRecivedDate}
                          sx={{ marginTop: 0 }}
                        >
                          <Controller
                            control={control}
                            name="noticeRecivedDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="DD/MM/YYYY"
                                  disabled
                                  label={
                                    <span
                                      style={{ fontSize: 16, marginTop: 2 }}
                                    >
                                      <FormattedLabel id="noticeRecivedDate" />
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(date) =>
                                    field.onChange(
                                      moment(date).format("YYYY-MM-DD")
                                    )
                                  }
                                  // selected={field.value}
                                  // center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      error={!!errors.noticeRecivedDate}
                                      helperText={
                                        errors?.noticeRecivedDate
                                          ? errors?.noticeRecivedDate.message
                                          : null
                                      }
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
                          {/* <FormHelperText>
                                {errors?.noticeRecivedDate
                                  ? errors.noticeRecivedDate.message
                                  : null}
                              </FormHelperText> */}
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <FormControl
                          error={!!errors.requisitionDate}
                          sx={{ marginTop: 0 }}
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
                                    <span
                                      style={{ fontSize: 16, marginTop: 2 }}
                                    >
                                      <FormattedLabel id="requisitionDate" />
                                    </span>
                                  }
                                  disabled
                                  value={field.value}
                                  onChange={(date) =>
                                    field.onChange(
                                      moment(date).format("YYYY-MM-DD")
                                    )
                                  }
                                  // selected={field.value}
                                  // center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      error={!!errors.requisitionDate}
                                      helperText={
                                        errors?.requisitionDate
                                          ? errors?.requisitionDate.message
                                          : null
                                      }
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
                          {/* <FormHelperText>
                                {errors?.requisitionDate
                                  ? errors?.requisitionDate.message
                                  : null}
                              </FormHelperText> */}
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <TextField
                          disabled
                          id="standard-basic"
                          variant="standard"
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.noticeDetails}
                          helperText={
                            errors?.noticeDetails
                              ? errors.noticeDetails.message
                              : null
                          }
                          size="small"
                          {...register("noticeDetails")}
                          label={<FormattedLabel id="noticeDetails" />}
                        />
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      style={{
                        padding: "10px",
                        paddingLeft: "5vh",
                        paddingRight: "5vh",
                      }}
                    >
                      <DataGrid
                        getRowId={(row) => row.srNo}
                        density="compact"
                        autoHeight={true}
                        pagination
                        paginationMode="server"
                        rows={
                          concerDeptList == [] ||
                          concerDeptList == undefined ||
                          concerDeptList == ""
                            ? []
                            : concerDeptList
                        }
                        columns={_col}
                        onPageChange={(_data) => {}}
                        onPageSizeChange={(_data) => {}}
                      />
                    </Grid>
                  </div>
                </ThemeProvider>

                <div style={{ marginBottom: "5vh" }}>
                  <div
                    style={{
                      backgroundColor: "#0084ff",
                      color: "white",
                      fontSize: 19,
                      marginTop: 30,
                      marginBottom: 30,
                      padding: 8,
                      paddingLeft: 30,
                      marginLeft: "40px",
                      marginRight: "65px",
                      borderRadius: 100,
                    }}
                  >
                    <strong>{<FormattedLabel id="noticeAttachment" />}</strong>
                  </div>
                  <Grid
                    container
                    style={{
                      padding: "10px",
                      paddingLeft: "5vh",
                      paddingRight: "5vh",
                    }}
                  >
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
                        showNoticeAttachment={router.query.showNoticeAttachment}
                      />
                    </Grid>
                  </Grid>
                </div>

                <div style={{ marginBottom: "5vh" }}>
                  <div
                    style={{
                      backgroundColor: "#0084ff",
                      color: "white",
                      fontSize: 19,
                      marginTop: 30,
                      marginBottom: 30,
                      padding: 8,
                      paddingLeft: 30,
                      marginLeft: "40px",
                      marginRight: "65px",
                      borderRadius: 100,
                    }}
                  >
                    <strong>{<FormattedLabel id="noticeHistory" />}</strong>
                  </div>
                  <Grid
                    container
                    style={{
                      padding: "10px",
                      paddingLeft: "5vh",
                      paddingRight: "5vh",
                    }}
                  >
                    <Grid item xs={12}>
                      <DataGrid
                        disableColumnFilter
                        disableColumnSelector
                        disableDensitySelector
                        components={{ Toolbar: GridToolbar }}
                        autoHeight
                        rows={
                          noticeHistoryList == [] ||
                          noticeHistoryList == undefined ||
                          noticeHistoryList == ""
                            ? []
                            : noticeHistoryList
                        }
                        columns={_columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        //checkboxSelection
                      />
                    </Grid>
                  </Grid>
                </div>

                <div style={{ marginBottom: "5vh" }}>
                  <div
                    style={{
                      backgroundColor: "#0084ff",
                      color: "white",
                      fontSize: 19,
                      marginTop: 30,
                      marginBottom: 30,
                      padding: 8,
                      paddingLeft: 30,
                      marginLeft: "40px",
                      marginRight: "65px",
                      borderRadius: 100,
                    }}
                  >
                    <strong>{<FormattedLabel id="parawiseReport" />}</strong>
                  </div>
                  <Grid
                    container
                    style={{
                      padding: "10px",
                      paddingLeft: "5vh",
                      paddingRight: "5vh",
                    }}
                  >
                    <Grid item xs={12}>
                      <DataGrid
                        disableColumnFilter
                        disableColumnSelector
                        disableDensitySelector
                        components={{ Toolbar: GridToolbar }}
                        autoHeight
                        rows={
                          parawiseReportList == [] ||
                          parawiseReportList == undefined ||
                          parawiseReportList == ""
                            ? []
                            : parawiseReportList
                        }
                        columns={parawiseRportColums}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        //checkboxSelection
                      />
                    </Grid>
                  </Grid>
                </div>

                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                    md: "row",
                    lg: "row",
                    xl: "row",
                  }}
                  spacing={{ xs: 2, sm: 2, md: 5, lg: 5, xl: 5 }}
                  justifyContent="center"
                  alignItems="center"
                  marginTop="5"
                >
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleOpen("Approve")}
                    sx={{ backgroundColor: "#00A65A" }}
                    name="Approve"
                    endIcon={<TaskAltIcon />}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleOpen("Reassign")}
                    sx={{ backgroundColor: "#00A65A" }}
                    name="Reassign"
                    endIcon={<UndoIcon />}
                  >
                    Reassign
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{ backgroundColor: "#DD4B39" }}
                    endIcon={<CloseIcon />}
                    onClick={() => {
                      router.push("/LegalCase/transaction/newNotice");
                    }}
                  >
                    Exit
                  </Button>
                </Stack>

                {/** Modal */}
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <form onSubmit={handleSubmit(onFinish)}>
                    <Box sx={style}>
                      <Box sx={{ padding: "10px" }}>
                        <Typography
                          id="modal-modal-title"
                          variant="h6"
                          component="h2"
                        >
                          Enter Remark
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          padding: "10px",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          fullWidth
                          size="small"
                          {...register("parawiseRemark")}
                          label={<FormattedLabel id="enterRemarkEn" />}
                        />
                      </Box>

                      {/* remarks in Marathi */}
                      <Box
                        sx={{
                          padding: "10px",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {/* remarks in Marathi */}
                        <TextField
                          fullWidth
                          size="small"
                          {...register("parawiseRemarkMr")}
                          label={<FormattedLabel id="enterRemarkMr" />}
                        />
                      </Box>
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          padding: "10px",
                        }}
                      >
                        <Button variant="contained" size="small" type="submit">
                          Submit
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={handleClose}
                        >
                          CANCEL
                        </Button>
                      </Box>
                    </Box>
                  </form>
                </Modal>
              </>
            )}
          </Paper>
        </form>
      </FormProvider>
    </>
  );
};

export default SendNotice;
