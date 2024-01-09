import React, { useEffect, useState } from "react";

import Stack from "@mui/material/Stack";
import { Box, Collapse, Table } from "@mui/material";
import { useRouter } from "next/router";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { yupResolver } from "@hookform/resolvers/yup";
// import styles from "./view.module.css";
// import styles from "../../../../styles/LegalCase_Styles/parawiseReport.module.css";
import styles from "../../../../styles/LegalCase_Styles/responseToNotice.module.css";

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
} from "@mui/material";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import { Controller, FormProvider, useForm } from "react-hook-form";
// import schema from "./schema";
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
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// import TableRows from "./TableRows";

const ResponseToNotice = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(),
    mode: "onChange",
  });
  const language = useSelector((state) => state.labels.language);

  const router = useRouter();
  const [noticeDate, setNoticeDate] = React.useState(null);
  const [requisitionDate, setRequisitionDate] = React.useState(null);
  const [rowsData, setRowsData] = useState([]);
  const [addButton, setAddButton] = useState(false);

  const [dataSource, setDataSource] = useState([]);
  const token = useSelector((state) => state.user.user.token);

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

  let user = useSelector((state) => state.user.user);
  const authority = user?.menus?.find((r) => {
    return r.id == 28;
  })?.roles;

  let tableData = [];
  let tableData1 = [];
  let tableData2 = [];
  let tableData3 = [];
  let tableData4 = [];
  let tableData5 = [];
  let tableData6 = [];
  let tableData7 = [];
  let tableData8 = [];
  let tableData9 = [];

  useEffect(() => {
    getNoticeDetails();
  }, []);

  useEffect(() => {
    console.log("router.query", router.query);
  }, []);

  const getNoticeDetails = () => {
    let statuses = [];
    statuses = [
      "NOTICE_DRAFT",
      "NOTICE_REASSIGNED",
      "NOTICE_CREATED",
      "NOTICE_APPROVED",
      "PARAWISE_REPORT_CREATED",
      "RESPONSE_TO_NOTICE_APPROVED",
      "RESPONSE_TO_NOTICE_CREATED",
      "PARAWISE_REPORT_APPROVED",
    ];

    // const finalStatuses={
    //   if(authority?.includes("NOTICE_ENTRY")){

    //   }
    // }
    //  In DB -  ["PARAWISE_REPORT_CREATED","RESPONSE_TO_NOTICE_APPROVED","RESPONSE_TO_NOTICE_CREATED","NOTICE_DRAFT","NOTICE_CREATED","PARAWISE_REPORT_APPROVED"]

    axios
      .post(
        `${urls.LCMSURL}/notice/getTrnNoticeByStatus`,
        {
          statuses,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      // .get(`http://localhost:8098/lc/api/notice/getTrnNoticeData`)
      .then((res) => {
        // let tableData = [];

        if (!res.data && res.data.length == 0) {
          return;
        }

        if (authority.find((val) => val === "NOTICE_ENTRY")) {
          tableData1 = res?.data?.filter((data, index) => {
            return data.status === "NOTICE_DRAFT";
          });
        }
        if (authority.find((val) => val === "NOTICE_APPROVAL")) {
          tableData2 = res?.data?.filter((data, index) => {
            return data.status === "NOTICE_CREATED";
          });
        }

        if (authority.find((val) => val === "PARAWISE_REPORT_ENTRY")) {
          tableData3 = res.data.filter((data, index) => {
            return data.status === "NOTICE_APPROVED";
          });
        }

        if (authority.find((val) => val === "PARAWISE_REPORT_ENTRY")) {
          tableData4 = res.data.filter((data, index) => {
            return data.status === "PARAWISE_REPORT_DRAFT";
          });
        }

        if (authority.find((val) => val === "PARAWISE_REPORT_APPROVAL")) {
          tableData5 = res.data.filter((data, index) => {
            return data.status === "PARAWISE_REPORT_CREATED";
          });
        }

        if (authority.find((val) => val === "RESPONSE_TO_NOTICE_ENTRY")) {
          tableData6 = res.data.filter((data, index) => {
            return data.status === "PARAWISE_REPORT_APPROVED";
          });
        }

        if (authority.find((val) => val === "RESPONSE_TO_NOTICE_ENTRY")) {
          tableData7 = res.data.filter((data, index) => {
            return data.status === "RESPONSE_TO_NOTICE_DRAFT";
          });
        }

        if (authority.find((val) => val === "RESPONSE_TO_NOTICE_APPROVAL")) {
          tableData8 = res.data.filter((data, index) => {
            return data.status === "RESPONSE_TO_NOTICE_CREATED";
          });
        }

        if (authority.find((val) => val === "FINAL_APPROVAL")) {
          tableData9 = res.data.filter((data, index) => {
            return data.status === "RESPONSE_TO_NOTICE_APPROVED";
          });
        } else {
          // setDataSource(res.data);
        }

        tableData = [
          ...tableData1,
          ...tableData2,
          ...tableData3,
          ...tableData4,
          ...tableData5,
          ...tableData6,
          ...tableData7,
          ...tableData8,
          ...tableData9,
        ];

        console.log("tableData", tableData);

        let _res = tableData.map((r, i) => {
          return {
            srNo: i + 1,
            id: r.id,
            noticeDate: r.noticeDate,
            // noticeRecivedDate: r.noticeRecivedDate,
            // requisitionDate: r.requisitionDate,
            noticeRecivedFromAdvocatePerson: r.noticeRecivedFromAdvocatePerson
              ? r.noticeRecivedFromAdvocatePerson
              : "-",
            // departmentName: departments?.find((obj) => obj?.id === r.department)
            //   ?.department
            //   ? departments?.find((obj) => obj?.id === r.department)?.department
            //   : "-",
            // attachedFile: r.attachedFile,
            status: r.status,
            // noticeAttachment: r.noticeAttachment,
            // noticeHisotry: r.noticeHisotry,
          };
        });

        console.log("_res", _res);

        setDataSource(_res);
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };
  //   addRows in Table Rows
  const addNewRow = (index) => {
    const rowsInput = {
      fullName: "",
      emailAddress: "",
      salary: "",
    };
    setRowsData([...rowsData, rowsInput]);
  };
  const addTableRows = () => {
    const rowsInput = {
      fullName: "",
      emailAddress: "",
      salary: "",
    };
    setRowsData([...rowsData, rowsInput]);
    setAddButton(true);
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

  const _columns = [
    {
      headerName: "अ. क्र",
      field: "srNo",
      width: 100,
      // dataIndex: "name",
    },
    {
      headerName: "मुद्दा क्रमांक",
      field: "मुद्दा क्रमांक",
      width: 180,
    },

    {
      headerName: "मुद्द्यांच्या परिच्छेद वार उत्तर मसुदा",
      field: "मुद्द्यांच्या परिच्छेद वार उत्तर मसुदा",
      width: 150,
    },
  ];

  const columns = [
    {
      headerName: "Sr.No",
      field: "srNo",
      width: 60,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   headerName: "Notice No.",
    //   field: "noticeNo",
    //   width: 100,
    // },
    {
      headerName: "Notice Date",
      field: "noticeDate",
      // flex: 1,
      width: 150,
      align: "center",
      headerAlign: "center",
    },

    // {
    //   headerName: "Notice Recevied Date",
    //   field: "noticeReceviedDate",
    //   width: 200,
    // },
    {
      headerName: "Notice received from Advocate/Person",
      field: "noticeRecivedFromAdvocatePerson",
      // flex: 1,
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   headerName: "Department Name",
    //   field: "departmentName",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    // {
    //   headerName: "Notice received through",
    //   field: "noticeReceivedThrough",
    //   width: 200,
    // },
    // {
    //   headerName: "Requisition Date",
    //   field: "requisitionDate",
    //   width: 180,
    // },
    // {
    //   headerName: "Attached File",
    //   field: "attachedFile",
    //   width: 130,
    // },
    // {
    //   headerName: "Parawise Information from concern Department",
    //   field: "parawiseInformationFromConcernDepartment",
    //   width: 350,
    // },
    // {
    //   headerName: "Digital Signature",
    //   field: "digitalSignature",
    //   width: 150,
    // },
    {
      headerName: "Status",
      field: "status",
      // flex: 1,
      width: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Action",
      headerName: "Action",
      flex: 1,
      align: "center",
      headerAlign: "center",

      renderCell: (params) => {
        return (
          <>
            {/* NOTICE_DRAFT */}
            {authority?.includes("NOTICE_ENTRY") &&
              params.row.status === "NOTICE_DRAFT" && (
                <Button
                  variant="outlined"
                  sx={{
                    width: "20%",
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    router.push({
                      pathname: "/LegalCase/transaction/newNotice/view",
                      query: {
                        pageMode: "Edit",
                        ...params.row,
                      },
                    });
                  }}
                >
                  EDIT NOTICE
                </Button>
              )}
            {/* NOTICE_APPROVAL */}
            {authority?.includes("NOTICE_APPROVAL") &&
              params.row.status === "NOTICE_CREATED" && (
                <Button
                  variant="outlined"
                  sx={{
                    width: "20%",
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    router.push({
                      pathname: "/LegalCase/transaction/newNotice/sendNotice",
                      query: {
                        pageMode: "Edit",
                        ...params.row,
                      },
                    });
                  }}
                >
                  NOTICE APPROVAL
                </Button>
              )}
            {/* PARAWISE_ENTRY */}
            {authority?.includes("PARAWISE_ENTRY") &&
              (params.row.status === "NOTICE_APPROVED" ||
                params.row.status === "PARAWISE_REPORT_DRAFT") && (
                <Button
                  variant="outlined"
                  sx={{
                    width: "20%",
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    router.push({
                      pathname: "/LegalCase/transaction/parawiseReport/addForm",
                      query: {
                        pageMode: "Edit",
                        authority,
                        ...params.row,
                      },
                    });
                  }}
                >
                  PARAWISE ENTRY
                </Button>
              )}

            {/* PARAWISE_REPORT_EDIT */}
            {authority?.includes("PARAWISE_REPORT_ENTRY") &&
              params.row.status === "PARAWISE_REPORT_DRAFT" && (
                <Button
                  variant="outlined"
                  sx={{
                    width: "20%",
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    router.push({
                      pathname: "/LegalCase/transaction/newNotice/sendNotice",
                      query: {
                        pageMode: "Edit",
                        ...params.row,
                      },
                    });
                  }}
                >
                  EDIT PARAWISE REPORT
                </Button>
              )}

            {/* PARAWISE_APPROVAL */}
            {authority?.includes("PARAWISE_APPROVAL") &&
              params.row.status === "PARAWISE_REPORT_CREATED" && (
                <Button
                  variant="outlined"
                  sx={{
                    width: "20%",
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    router.push({
                      pathname: "/LegalCase/transaction/parawiseReport/addForm",
                      query: {
                        pageMode: "Add",
                        ...params.row,
                      },
                    });
                  }}
                >
                  PARAWISE APPROVAL
                </Button>
              )}

            {/* RESPONSE_TO_NOTICE_ENTRY */}
            {authority?.includes("RESPONSE_TO_NOTICE_ENTRY") &&
              (params.row.status === "PARAWISE_REPORT_APPROVED" ||
                params.row.status === "RESPONSE_TO_NOTICE_DRAFT") && (
                <Button
                  variant="outlined"
                  sx={{
                    width: "40%",
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    router.push({
                      pathname:
                        "/LegalCase/transaction/responseToNotice/addForm",
                      query: {
                        pageMode: "Edit",
                        ...params.row,
                      },
                    });
                  }}
                >
                  RESPONSE TO NOTICE ENTRY
                </Button>
              )}

            {/* RESPONSE_TO_NOTICE_EDIT */}
            {authority?.includes("RESPONSE_TO_NOTICE_ENTRY") &&
              params.row.status === "RESPONSE_TO_NOTICE_DRAFT" && (
                <Button
                  variant="outlined"
                  sx={{
                    width: "40%",
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    router.push({
                      pathname: "/LegalCase/transaction/newNotice/sendNotice",
                      query: {
                        pageMode: "Edit",
                        ...params.row,
                      },
                    });
                  }}
                >
                  EDIT RESPONSE TO NOTICE
                </Button>
              )}

            {/* RESPONSE TO NOTICE APPROVAL */}
            {authority?.includes("RESPONSE_TO_NOTICE_APPROVAL") &&
              params.row.status === "PARAWISE_REPORT_APPROVED" && (
                <Button
                  variant="outlined"
                  sx={{
                    width: "40%",
                    overflow: "hidden",
                    margin: "5px",
                    fontSize: "10px",
                    whiteSpace: "normal",
                  }}
                  onClick={() => {
                    router.push({
                      pathname: "/LegalCase/transaction/newNotice/sendNotice",
                      query: {
                        pageMode: "Edit",
                        ...params.row,
                      },
                    });
                  }}
                >
                  RESPONSE TO NOTICE APPROVAL
                </Button>
              )}
          </>
        );
      },
    },
  ];

  const rows = [
    { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
    { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  ];

  // newTable

  const onSubmitForm = (fromData) => {};
  return (
    <>
      <Paper
        style={{ border: "1px solid black" }}
        sx={{
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5,
          marginBottom: 5,
          padding: 1,
        }}
      >
        <div>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <div className={styles.small}>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid xs={10}></Grid>
                  <Grid xs={2}>
                    {authority?.includes("NOTICE_ENTRY") && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          router.push({
                            pathname:
                              "/LegalCase/transaction/responseToNotice/addForm",
                          });
                        }}
                        endIcon={<AddIcon />}
                      >
                        RESPONSE TO NOTICE ENTRY
                      </Button>
                    )}
                  </Grid>
                </Grid>
                {/* First Row */}
                <div className={styles.row}>
                  <div>
                    <FormControl
                      style={{ marginTop: 10 }}
                      error={!!errors.fromDate}
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
                                  Notice Date
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
                                  // fullWidth
                                  sx={{ width: 230 }}
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
                        {errors?.noticeDate ? errors.noticeDate.message : null}
                      </FormHelperText>
                    </FormControl>
                  </div>

                  <div>
                    <FormControl
                      style={{ marginTop: 10 }}
                      error={!!errors.fromDate}
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
                                  Notice Received date
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
                                  // fullWidth
                                  sx={{ width: 230 }}
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
                  </div>

                  <div>
                    <TextField
                      autoFocus
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label="Notice received from Advocate/Person"
                      variant="standard"
                      // {...register("businessSubTypePrefix")}
                      // error={!!errors.businessSubTypePrefix}
                      // helperText={
                      //   errors?.businessSubTypePrefix
                      //     ? errors.businessSubTypePrefix.message
                      //     : null
                      // }
                    />
                  </div>
                </div>
                {/* 2nd Row */}
                <div className={styles.row}>
                  <div>
                    <TextField
                      //// required
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label="Area"
                      variant="standard"
                    />
                    {/* <TextField
              sx={{ width: 250 }}
              id="standard-basic"
              label="Application Number *"
              variant="standard"
              disabled
              {...register("applicationNumber")}
              error={!!errors.applicationNumber}
              helperText={
                errors?.applicationNumber
                  ? errors.applicationNumber.message
                  : null
              }
            /> */}
                  </div>

                  <div>
                    <TextField
                      //// required
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label="Road Name"
                      variant="standard"
                    />
                    {/* <TextField
              sx={{ width: 250 }}
              id="standard-basic"
              label="Application Number *"
              variant="standard"
              disabled
              {...register("applicationNumber")}
              error={!!errors.applicationNumber}
              helperText={
                errors?.applicationNumber
                  ? errors.applicationNumber.message
                  : null
              }
            /> */}
                  </div>

                  <div>
                    <TextField
                      //// required
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label="Landmark"
                      variant="standard"
                    />
                    {/* <TextField
              sx={{ width: 250 }}
              id="standard-basic"
              label="Application Number *"
              variant="standard"
              disabled
              {...register("applicationNumber")}
              error={!!errors.applicationNumber}
              helperText={
                errors?.applicationNumber
                  ? errors.applicationNumber.message
                  : null
              }
            /> */}
                  </div>
                </div>

                {/* 3rd Row */}
                <div className={styles.row}>
                  <div>
                    <TextField
                      //// required
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label="City/Village"
                      variant="standard"
                    />
                    {/* <TextField
              sx={{ width: 250 }}
              id="standard-basic"
              label="Application Number *"
              variant="standard"
              disabled
              {...register("applicationNumber")}
              error={!!errors.applicationNumber}
              helperText={
                errors?.applicationNumber
                  ? errors.applicationNumber.message
                  : null
              }
            /> */}
                  </div>

                  <div>
                    <TextField
                      //// required
                      sx={{ width: 250 }}
                      id="standard-basic"
                      label="Pin Code"
                      variant="standard"
                    />
                    {/* <TextField
              sx={{ width: 250 }}
              id="standard-basic"
              label="Application Number *"
              variant="standard"
              disabled
              {...register("applicationNumber")}
              error={!!errors.applicationNumber}
              helperText={
                errors?.applicationNumber
                  ? errors.applicationNumber.message
                  : null
              }
            /> */}
                  </div>

                  <div>
                    <FormControl variant="standard" sx={{ minWidth: 250 }}>
                      <InputLabel id="demo-simple-select-standard-label">
                        Department Name
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        // value={age}
                        // onChange={handleChange}
                        label="Department Name"
                      >
                        {/* <MenuItem value="">
                        <em>None</em>
                      </MenuItem> */}
                        <MenuItem>
                          <FormControlLabel
                            control={<Checkbox />}
                            label="property Tax"
                          />
                        </MenuItem>
                        <MenuItem>
                          {" "}
                          <FormControlLabel
                            control={<Checkbox />}
                            label="Town Planning"
                          />
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>

                {/* 4th Row */}
                <div className={styles.row1}>
                  <div>
                    <FormControl
                      style={{ marginTop: 10 }}
                      error={!!errors.fromDate}
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
                                  Requisition Date
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
                                  // fullWidth
                                  sx={{ width: 230 }}
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
                  </div>
                  {/* <div>
                    <label>Attached file</label>
                    <TextField
                      //// required
                      id="standard-basic"
                      //                     label="Upload
                      // Documents/Order "
                      variant="standard"
                      type="file"
                      InputLabelProps={{ style: { fontSize: 10 } }}
                      InputProps={{ style: { fontSize: 12 } }}
                    />
                  </div> */}
                </div>
              </div>
            </form>
          </FormProvider>
        </div>

        <Paper
          style={{ marginLeft: 40, border: "1px solid black" }}
          component={Box}
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginTop: 5,
            marginBottom: 5,
            padding: 1,
          }}
        >
          {console.log("datas", dataSource)}
          <DataGrid
            disableColumnFilter
            disableColumnSelector
            disableToolbarButton
            disableDensitySelector
            components={{ Toolbar: GridToolbar }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                // quickFilterProps: { debounceMs: 500 },
                // printOptions: { disableToolbarButton: false },
                disableExport: true,
                // disableToolbarButton: true,
                // csvOptions: { disableToolbarButton: false },
              },
            }}
            autoHeight
            sx={{
              backgroundColor: "white",
            }}
            rows={dataSource || []}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            //checkboxSelection
          />

          {/* <DataGrid
            mt={5}
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5]}
            // checkboxSelection
          /> */}

          {/* newTable */}
          {/* <div className="container">
            <div className="row">
              <div className="col-sm-8">
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: 200 }}>अ. क्र</th>
                      <th style={{ width: 200 }}>मुद्दा क्रमांक</th>
                      <th style={{ width: 720 }}>
                        मुद्द्यांच्या परिच्छेद वार उत्तर मसुदा
                      </th>
                      <th>
                        <button
                          className="btn btn-outline-success"
                          disabled={addButton}
                          onClick={addTableRows}
                        >
                          +
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <TableRows
                      rowsData={rowsData}
                      addNewRow={addNewRow}
                      deleteTableRows={deleteTableRows}
                      handleChange={handleChange}
                    />
                  </tbody>
                </table>
              </div>
              <div className="col-sm-4"></div>
            </div>
          </div> */}
        </Paper>

        <div className={styles.btn}>
          <Button
            sx={{ marginRight: 8 }}
            type="submit"
            size="small"
            variant="contained"
            color="primary"
          >
            Cancel
          </Button>{" "}
          <Button
            sx={{ marginRight: 8 }}
            variant="contained"
            size="small"
            color="primary"
            // onClick={() => cancellButton()}
          >
            Forward
          </Button>
        </div>
      </Paper>
    </>
  );
};

export default ResponseToNotice;
