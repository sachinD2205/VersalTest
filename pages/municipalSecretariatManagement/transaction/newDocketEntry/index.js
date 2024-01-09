import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Paper,
  TextField,
  Typography,
  Card,
  Grid,
  InputLabel,
  Select,
  FormControlLabel,
  Checkbox,
  Tooltip,
  MenuItem,
  RaisedButton,
} from "@mui/material";
import AttachmentIcon from "@mui/icons-material/Attachment";
import PreviewIcon from "@mui/icons-material/Preview";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Refresh } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import styles from "../../../../components/municipalSecretariatManagement/styles/view.module.css";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import sweetAlert from "sweetalert";
import { LeftOutlined } from "@ant-design/icons";
import { styled, useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Drawer from "@mui/material/Drawer";
import axios from "axios";
import moment from "moment";
import Schema from "../../../../containers/schema/municipalSecretariatManagement/TrnNewDocketEntrySchema";
import urls from "../../../../URLS/urls";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../../../util/util"

let drawerWidth;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: -drawerWidth,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  }),
}));

const Docket = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(Schema),
    mode: "onChange",
  });

  const [data, setData] = useState([]);
  const language = useSelector((state) => state?.labels.language);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);

  const [wardNames, setwardNames] = useState([]);
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


  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getlicenseTypeDetails();
  }, []);

  const getlicenseTypeDetails = () => {
    console.log("getLIC ----");
    axios.get(`${urls.MSURL}/trnNewDocketEntry/getAll`).then((res) => {
      console.log(res.data.newDocketEntry, ">>>>>>>>>>>>>>>>>>>");
      setDataSource(
        res.data.newDocketEntry.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          departmentName: r.departmentName?.toString(),
          docketNo: r.docketNo,
          subjectDate: r.subjectDate,
          subject: r.subject,
          subjectSummary: r.subjectSummary,
          selectCommittees: r.selectCommittees?.toString(),
          financialYear: r.financialYear,
          docketType: r.docketType,
          amount: r.amount,
          uploadDocument: r.uploadDocument,
          remark: r.remark,
          status: r.status,
          digitalSignature: r.digitalSignature,
          approveStatus: r.approveStatus,
          employeeName: r.employeeName,
          remarks: r.remarks,
          employeeNameMr: r.employeeNameMr,
          remarksMr: r.remarksMr,
          activeFlag: r.activeFlag,
        })),
      );
    });
  };
  // Reset Values Cancell
  const resetValuesCancell = {
    id: " ",
    departmentName: " ",
    docketNo: " ",
    subjectDate: " ",
    subject: " ",
    subjectSummary: " ",
    selectCommittees: " ",
    financialYear: " ",
    docketType: " ",
    amount: " ",
    uploadDocument: " ",
    remark: " ",
    status: " ",
    digitalSignature: " ",
  };

  // Reset Values Exit
  const resetValuesExit = {
    id: " ",
    departmentName: " ",
    docketNo: " ",
    subjectDate: " ",
    subject: " ",
    subjectSummary: " ",
    selectCommittees: " ",
    financialYear: " ",
    docketType: " ",
    amount: " ",
    uploadDocument: " ",
    remark: " ",
    status: " ",
    digitalSignature: " ",
  };

  const [comittees1, setcomittees1] = useState([]);

  const getcomittees1 = () => {
    axios.get(`${urls.MSURL}/mstDefineCommittees/getAll`).then((r) => {
      setcomittees1(
        r.data.committees.map((row) => ({
          id: row.id,
          comittee: row.committeeName,
        })),
      );
    }).catch((error) => {
      callCatchMethod(error, language);
    });;
  };
  useEffect(() => {
    getcomittees1();
    //   getwardNames();
    //   getGenders();
    //   getCasts();
    //  // getSubCast();
    //   getReligions();
    //   getPartyNames();
    //   getBankNames();
    //   getBranchNames();
    //   getIdProofs();
    //   getewardNames();
  }, []);

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    event.preventDefault();
    const subjectDate = new Date(formData.subjectDate).toISOString();
    const financialYear = new Date(formData.financialYear).toISOString();
    const selectCommittees = Number(formData.selectCommittees);
    const departmentName = formData.departmentName.toString();
    // Update Form Data
    const finalBodyForApi = {
      ...formData,
      financialYear,
      subjectDate,
      selectCommittees,
      departmentName,
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    };

    // Save - DB
    if (btnSaveText === "Save") {
      console.log("Post -----", finalBodyForApi);
      axios
        .post(
          `${urls.MSURL}/trnNewDocketEntry/save`,

          finalBodyForApi,
        )
        .then((res) => {
          if (res.status == 200) {
            sweetAlert("Saved!", "Record Saved successfully !", "success");
            getlicenseTypeDetails();
            setButtonInputState(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
          }
        }).catch((error) => {
          callCatchMethod(error, language);
        });;
    }

    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      console.log("Put -----", finalBodyForApi);
      axios.post(`${urls.MSURL}/trnNewDocketEntry/save`, finalBodyForApi).then((res) => {
        if (res.status == 200) {
          sweetAlert("Updated!", "Record Updated successfully !", "success");
          getlicenseTypeDetails();
          setButtonInputState(false);
          setIsOpenCollapse(false);
        }
      }).catch((error) => {
        callCatchMethod(error, language);
      });;
    }
  };

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setIsOpenCollapse(false);
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Delete?",
        text: "Are you sure you want to Delete this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios.post(`${urls.MSURL}/trnNewDocketEntry/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getlicenseTypeDetails();
              setButtonInputState(false);
            }
          }).catch((error) => {
            callCatchMethod(error, language);
          });;
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    } else {
      swal({
        title: "Delete?",
        text: "Are you sure you want to Delete this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios.post(`${urls.MSURL}/trnNewDocketEntry/save`, body).then((res) => {
            console.log("delet res", res);
            if (res.status == 200) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getlicenseTypeDetails();
              setButtonInputState(false);
            }
          });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      headerAlign: "center",
      // flex: 1,
      align: "center",
      width: 80,
    },
    {
      field: "departmentName",
      headerName: "Department Name",
      headerAlign: "center",
      // type: "string",
      align: "center",
      // flex: 1,
      width: 155,
    },
    {
      field: "docketNo",
      headerName: "Docket No.",
      headerAlign: "center",
      align: "center",
      // type: "number",
      // flex: 1,
      width: 125,
    },
    {
      field: "subjectDate",
      headerName: "Subject Date",
      headerAlign: "center",
      align: "center",
      type: "date",
      // flex: 1,
      width: 140,
      // width:"150px"
    },
    {
      field: "subject",
      headerName: "Subject",
      type: "string",
      align: "center",
      headerAlign: "center",
      // flex: 1,
      width: 150,
    },
    {
      field: "subjectSummary",
      headerName: "Subject Summary",
      align: "center",
      headerAlign: "center",
      // type: "number",
      // flex: 1,
      width: 170,
    },
    {
      field: "selectCommittees",
      headerName: "Select Committees",
      align: "center",
      headerAlign: "center",

      // flex: 1,
      width: 175,
    },
    {
      field: "financialYear",
      headerName: "Financial Year",
      align: "center",
      headerAlign: "center",
      // type: "number",
      // flex: 1,
      width: 140,
    },
    {
      field: "docketType",
      headerName: "Subject Letter/ Docket Type",
      align: "center",
      // type: "number",
      // flex: 1,
      headerAlign: "center",
      width: 210,
    },
    {
      field: "uploadDocument",
      headerName: "Uploaded Document",
      align: "center",
      // type: "number",
      // flex: 1,
      headerAlign: "center",
      width: 165,
    },
    {
      field: "amount",
      headerName: "Amount",
      align: "center",
      // type: "number",
      headerAlign: "center",
      // flex: 1,
      width: 90,
    },
    {
      field: "remark",
      headerName: "Remark",
      align: "center",
      // type: "number",
      headerAlign: "center",
      // flex: 1,
      width: 100,
    },
    {
      field: "status",
      headerName: "Status",
      align: "center",
      // type: "number",
      headerAlign: "center",
      // flex: 1,
      width: 100,
    },
    {
      field: "digitalSignature",
      headerName: "Digital Signature",
      align: "center",
      // type: "number",
      headerAlign: "center",
      // flex: 1,
      width: 180,
    },

    {
      field: "approveStatus",
      headerName: "Approve Status",
      align: "center",
      // type: "number",
      headerAlign: "center",
      // flex: 1,
      width: 180,
    },
    {
      field: "employeeName",
      headerName: "Employee Name",
      align: "center",
      // type: "number",
      headerAlign: "center",
      // flex: 1,
      width: 180,
    },

    {
      field: "employeeNameMr",
      headerName: "Employee Name in Marathi",
      align: "center",
      // type: "number",
      headerAlign: "center",
      // flex: 1,
      width: 180,
    },

    {
      field: "remarks",
      headerName: "Remarks",
      align: "center",
      // type: "number",
      headerAlign: "center",
      // flex: 1,
      width: 180,
    },
    {
      field: "remarksMr",
      headerName: "Remarks in Marathi",
      align: "center",
      // type: "number",
      headerAlign: "center",
      // flex: 1,
      width: 180,
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      align: "center",
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              backgroundColor: "whitesmoke",
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Tooltip title="Edit details">
              <IconButton
                onClick={() => {
                  setBtnSaveText("Update"),
                    setID(params.row.id),
                    setIsOpenCollapse(true),
                    setButtonInputState(true);
                  console.log("params.row: ", params.row);
                  reset(params.row);
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete details">
              <IconButton onClick={() => deleteById(params.id, params.activeFlag)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <div>
      <BasicLayout titleProp={"none"}>
        <Card>
          <div
            style={{
              display: "fixed",
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
            New Docket Entry
            {/* <strong> Document Upload</strong> */}
          </div>
        </Card>
        <Paper
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginTop: 5,
            marginBottom: 5,
            padding: 1,
          }}
        >
          {isOpenCollapse && (
            <div>
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
                New Docket Entry
                {/* <strong> Document Upload</strong> */}
              </div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <div className={styles.small}>
                    <div className={styles.maindiv}>
                      <Grid
                        container
                        sx={{
                          marginLeft: 5,
                          marginTop: 2,
                          marginBottom: 5,
                          align: "center",
                        }}
                      >
                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <b>
                            <TextField
                              label="Department Name"
                              required
                              {...register("departmentName")}
                              error={!!errors.departmentName}
                              helperText={errors?.departmentName ? errors.departmentName.message : null}
                            // helperText="Please enter department name"
                            />
                          </b>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl
                            variant="standard"
                            sx={{ m: 1, minWidth: 120 }}
                          // error={!!errors.comittee}
                          >
                            {/*  */}
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <b>
                            <TextField
                              label="Docket No."
                              // helperText="Please enter Docket No."
                              {...register("docketNo")}
                              error={!!errors.docketNo}
                              helperText={errors?.docketNo ? errors.docketNo.message : null}
                            />
                          </b>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl sx={{ marginTop: 3, minWidth: 210 }} error={!!errors.selectCommittees}>
                            <InputLabel id="demo-simple-select-standard-label">Select Committees</InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ marginTop: 0 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Select Committees *"
                                >
                                  {comittees1 &&
                                    comittees1.map((comittee, index) => (
                                      <MenuItem key={index} value={comittee.id}>
                                        {comittee.comittee}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="selectCommittees"
                              control={control}
                              defaultValue=""
                              className="mt-0"
                              sx={{ marginTop: "-80 !important" }}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 35, width: 185 }}>
                            <Controller
                              control={control}
                              name="financialYear"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                  <DatePicker
                                    inputFormat="YYYY"
                                    label={<span style={{ fontSize: 16 }}>Financial Year*</span>}
                                    value={field.value}
                                    onChange={(date) => field.onChange(date)}
                                    selected={field.value}
                                    center
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
                                      />
                                    )}
                                  />
                                </LocalizationProvider>
                              )}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 190 }}>
                            <TextField
                              label="Subject Letter/Docket Type*"
                              {...register("docketType")}
                              error={!!errors.docketType}
                              helperText={errors?.docketType ? errors.docketType.message : null}
                            />
                          </FormControl>
                        </Grid>

                        {/* <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
<FormControl style={{ marginTop: 20 ,width :185}}>
<label style={{display:"flex",height: 25}} htmlFor="myfile"> &ensp; Upload Document<p style={{color:"red"}}>*</p></label>
<FormControl sx={{display:"flex",flexDirection:"column-reverse",width:210,border:1,padding:1.5, borderColor:"rgba(133, 133, 133,0.6)",borderRadius:1,'&:hover':{borderColor:"rgb(133, 133, 133)"}}}>

<input type="file" id="myfile" name="myfile" />
</FormControl>

</FormControl> 
</Grid> */}
                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 190 }}>
                            <TextField
                              label="Upload Document*"
                              {...register("uploadDocument")}
                              error={!!errors.uploadDocument}
                              helperText={errors?.uploadDocument ? errors.uploadDocument.message : null}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 185 }}>
                            <TextField
                              {...register("amount")}
                              error={!!errors.amount}
                              helperText={errors?.amount ? errors.amount.message : null}
                              label="Amount*"
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 185 }}>
                            <TextField
                              {...register("remark")}
                              error={!!errors.remark}
                              helperText={errors?.remark ? errors.remark.message : null}
                              label="Remark*"
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 185 }}>
                            <TextField
                              {...register("status")}
                              error={!!errors.status}
                              helperText={errors?.status ? errors.status.message : null}
                              label="Status*"
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 185 }}>
                            <TextField
                              {...register("digitalSignature")}
                              error={!!errors.digitalSignature}
                              helperText={errors?.digitalSignature ? errors.digitalSignature.message : null}
                              label="Digital Signature*"
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 190 }}>
                            <TextField
                              label="remarks*"
                              {...register("remarks")}
                              error={!!errors.remarks}
                              helperText={errors?.remarks ? errors.remarks.message : null}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 30, width: 190 }}>
                            <TextField
                              label="remarks in Marathi*"
                              {...register("remarksMr")}
                              error={!!errors.remarksMr}
                              helperText={errors?.remarksMr ? errors.remarksMr.message : null}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl sx={{ marginTop: 3, minWidth: 210 }} error={!!errors.approveStatus}>
                            <InputLabel id="demo-simple-select-standard-label">Approve Status</InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ marginTop: 0 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Approve Status *"
                                >
                                  <MenuItem value="Yes">Yes</MenuItem>
                                  <MenuItem value="No">NO</MenuItem>
                                </Select>
                              )}
                              name="approveStatus"
                              control={control}
                              defaultValue=""
                              className="mt-0"
                              sx={{ marginTop: "-80 !important" }}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl sx={{ marginTop: 3, minWidth: 210 }} error={!!errors.employeeName}>
                            <InputLabel id="demo-simple-select-standard-label">employeeName</InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ marginTop: 0 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="employee Name Mr *"
                                >
                                  <MenuItem value="emp1">employeeName1</MenuItem>
                                  <MenuItem value="emp2">employeeName2</MenuItem>
                                </Select>
                              )}
                              name="employeeName"
                              control={control}
                              defaultValue=""
                              className="mt-0"
                              sx={{ marginTop: "-80 !important" }}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl sx={{ marginTop: 3, minWidth: 210 }} error={!!errors.employeeNameMr}>
                            <InputLabel id="demo-simple-select-standard-label">employee Name Mr</InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ marginTop: 0 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="employee Name Mr *"
                                >
                                  <MenuItem value="emp1">employeeNameMr1</MenuItem>
                                  <MenuItem value="emp2">employeeNameMr2</MenuItem>
                                </Select>
                              )}
                              name="employeeNameMr"
                              control={control}
                              defaultValue=""
                              className="mt-0"
                              sx={{ marginTop: "-80 !important" }}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                          <FormControl style={{ marginTop: 35, width: 185 }}>
                            <Controller
                              control={control}
                              name="subjectDate"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                  <DatePicker
                                    inputFormat="YYYY/MM/DD"
                                    label={<span style={{ fontSize: 16 }}>Subject Date</span>}
                                    value={field.value}
                                    onChange={(date) => field.onChange(date)}
                                    selected={field.value}
                                    center
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
                                      />
                                    )}
                                  />
                                </LocalizationProvider>
                              )}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}></Grid>
                        <div>
                          <Card
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              color: "white",
                              fontSize: 19,
                              marginTop: 30,
                              width: 750,
                              padding: 12,
                              borderRadius: 10,
                            }}
                          >
                            <FormControl>
                              <b>
                                <TextField
                                  style={{ marginTop: 3, width: 726 }}
                                  label="Subject"
                                  {...register("subject")}
                                  error={!!errors.subject}
                                  helperText={errors?.subject ? errors.subject.message : null}
                                />
                              </b>
                            </FormControl>

                            <FormControl style={{ marginTop: 30 }}>
                              <TextField
                                {...register("subjectSummary")}
                                error={!!errors.subjectSummary}
                                helperText={errors?.subjectSummary ? errors.subjectSummary.message : null}
                                label="subject summary"
                                multiline
                                rows={5}
                              />
                            </FormControl>

                            <div style={{ height: 40, marginTop: 30 }}>
                              <input style={{ display: "none" }} id="contained-button-file" type="file" />
                              <label htmlFor="contained-button-file">
                                <Button variant="contained" color="primary" component="span">
                                  <AttachmentIcon /> &ensp; Attach file
                                </Button>
                              </label>

                              <p></p>
                            </div>
                          </Card>
                        </div>
                      </Grid>
                    </div>

                    <div className={styles.btn}>
                      <Button
                        sx={{ marginRight: 8 }}
                        type="submit"
                        variant="contained"
                        color="success"
                        endIcon={<SaveIcon />}
                      >
                        {btnSaveText}
                      </Button>{" "}
                      <Button
                        sx={{ marginRight: 8 }}
                        variant="contained"
                        color="primary"
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                      >
                        Clear
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitButton()}
                      >
                        Exit
                      </Button>
                    </div>
                  </div>
                </form>
              </FormProvider>
            </div>
          )}

          <div className={styles.addbtn}>
            <Button
              sx={{ backgroundColor: "rgb(0, 132, 255) !important" }}
              variant="contained"
              endIcon={<AddIcon />}
              type="primary"
              disabled={buttonInputState}
              onClick={() => {
                // reset({
                //   ...resetValuesExit,
                // });
                setBtnSaveText("Save");
                setIsOpenCollapse(!isOpenCollapse);
              }}
            >
              Add{" "}
            </Button>
          </div>
          <div style={{ display: "flex", height: "100%" }}>
            <div style={{ flexGrow: 1 }}>
              <DataGrid
                autoHeight
                sx={{
                  marginLeft: 5,
                  marginRight: 5,
                  marginTop: 5,
                  marginBottom: 5,
                }}
                rows={dataSource}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                experimentalFeatures={{ newEditingApi: true }}
              //checkboxSelection
              />
            </div>
          </div>
        </Paper>
      </BasicLayout>
    </div>
  );
};

export default Docket;
