import styles from "../../visitorEntry.module.css";

import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PrintIcon from "@mui/icons-material/Print";
import SearchIcon from "@mui/icons-material/Search";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  DateTimePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import Head from "next/head";
import { default as React, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
// import schema from "../../../../containers/schema/securityManagementSystemSchema/securityManagementSystemSchema";
import urls from "../../../../URLS/urls";
import {
  options,
  priorityList,
} from "../../../../components/security/contsants";
import moment from "moment";
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

function MaterialEntry() {
  const [loading, setLoading] = useState(false);
  const [priority, setPriority] = useState(priorityList[0].value);
  // const [departmentName, setDepartmentName] = useState(options[0].value);
  // const { control, handleSubmit } = useForm({
  //   defaultValues: { notoriousEntry: false },
  // });
  // const onSubmit = (data) => console.log(data);

  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
  });
  const language = useSelector((state) => state.labels.language);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [fetchData, setFetchData] = useState(null);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [rowId, setRowId] = useState("");
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const [open, setOpen] = useState(false);
  const [paramsData, setParamsData] = useState(false);

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

  useEffect(() => {
    getAllVisitors();
  }, [fetchData]);

  const getAllVisitors = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.SMURL}/trnVisitorEntryPass/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        console.log("visitor entry", r);
        let result = r.data.trnVisitorEntryPassList;
        let _res = result?.map((r, i) => {
          return {
            ...r,
            inTime: r.inTime
              ? moment(r.inTime, "DD-MM-YYYY").format("DD-MM-YYYY")
              : "-",
            outTime: r.outTime
              ? moment(r.outTime, "DD-MM-YYYY").format("DD-MM-YYYY")
              : "-",
            id: r.id,
            srNo: i + 1,
            visitorStatus: r.visitorStatus === "I" ? "In" : "Out",
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });
        console.log(_res);
        // setDataSource([..._res]);
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      })
      ?.catch((err) => {
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const onSubmitForm = (formData, btnType) => {
    console.log("formData", formData);
    // Save - DB
    let _body;
    if (btnSaveText === "Save" && btnType !== "Checkout") {
      console.log("save");
      _body = {
        departmentKey: formData?.departmentKey,
        subDepartmentKey: 2,
        visitorPhoto: formData?.visitorPhoto,
        visitorName: formData?.visitorName,
        toWhomWantToMeet: formData?.toWhomWantToMeet,
        purpose: formData?.purpose,
        priority: formData?.priority,
        mobileNumber: formData?.mobileNumber,
        notoriousEntry: formData?.notoriousEntry ? "T" : "F",
        visitorStatus: formData?.visitorStatus,
        documentType: "Adhaar Card",
        departmentName: departments?.find(
          (obj) => obj?.id === formData?.departmentKey
        )?.department,
        inTime: formData?.inTime?.toISOString(),
        personalEquipments: formData.personalEquipments,
        visitorStatus: "I",
      };
    } else {
      console.log("update");
      _body = {
        id: formData?.id,
        departmentKey: formData?.departmentKey,
        subDepartmentKey: 2,
        visitorPhoto: formData?.visitorPhoto,
        visitorName: formData?.visitorName,
        toWhomWantToMeet: formData?.toWhomWantToMeet,
        purpose: formData?.purpose,
        priority: formData?.priority,
        mobileNumber: formData?.mobileNumber,
        notoriousEntry: formData?.notoriousEntry ? "T" : "F",
        documentType: "Adhaar Card",
        departmentName: departments?.find(
          (obj) => obj?.id === formData?.departmentKey
        )?.department,
        inTime: formData?.inTime,
        personalEquipments: formData.personalEquipments,
        visitorStatus: "O",
      };
    }

    console.log("_body", _body);
    console.log("123", btnSaveText, btnType);

    if (btnSaveText === "Save" && btnType !== "Checkout") {
      const tempData = axios
        .post(`${urls.SMURL}/trnVisitorEntryPass/save`, {
          ..._body,
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Saved!", "Record Saved successfully !", "success");
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        })
        ?.catch((err) => {
          setLoading(false);
          callCatchMethod(err, language);
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Checkout" || btnType === "Checkout") {
      var d = new Date(); // for now
      const currentTime = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
      const tempData = axios
        .post(`${urls.SMURL}/trnVisitorEntryPass/save`, {
          _body,
        })
        .then((res) => {
          if (res.status == 201) {
            formData.id
              ? sweetAlert(
                  "Updated!",
                  "Record Updated successfully !",
                  "success"
                )
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            setFetchData(tempData);
            setIsOpenCollapse(false);
            setOpen(false);
          }
        })
        ?.catch((err) => {
          setLoading(false);
          callCatchMethod(err, language);
        });
    }
  };

  const createColumn = () => {
    if (data?.rows[0]) {
      return Object?.keys(data?.rows[0]).map((row) => {
        return {
          field: row,
          headerName: row
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, function (str) {
              return str.toUpperCase();
            }),
          flex: 1,
        };
      });
    } else {
      return [];
    }
  };

  const handleOpen = (_data) => {
    setOpen(true);
    setParamsData(_data);
  };

  const handleClose = () => setOpen(false);

  const columns = [
    {
      field: "srNo",
      headerName: "Sr No",
      flex: 1,
      maxWidth: 40,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: true,
      field: "visitorPhoto",
      headerName: "Visitor Photo",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "visitorName",
      headerName: "Visitor Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "departmentName",
      headerName: "Department Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "subDepartmentName",
      headerName: "Sub Department Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "toWhomWantToMeet",
      headerName: "To Whom Want To Meet",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "purpose",
      headerName: "Purpose",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "priority",
      headerName: "Priority",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: true,
      field: "mobileNumber",
      headerName: "Mobile Number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "inTime",
      headerName: "In Time",
      flex: 1,
      // minWidth:200,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "outTime",
      headerName: "Out Time",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: true,
      field: "notoriousEntry",
      headerName: "Notorious Entry",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: false,
      field: "visitorStatus",
      headerName: "Visitor Status",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      hide: true,
      field: "documentType",
      headerName: "Document Type",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      hide: true,
      field: "personalEquipments",
      headerName: "Personal Equipments",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              // disabled={editButtonInputState}
              onClick={() => {
                console.log("print");
              }}
            >
              <PrintIcon style={{ color: "#556CD6" }} />
            </IconButton>
            {params.row.visitorStatus == "In" && (
              <IconButton
                onClick={() => {
                  handleOpen(params);
                }}
              >
                <ExitToAppIcon style={{ color: "#556CD6" }} />
              </IconButton>
            )}
          </Box>
        );
      },
    },
  ];
  const getDepartment = () => {
    axios
      .get(`${urls.CfcURLMaster}/department/getAll`)
      .then((res) => {
        setDepartments(
          res.data.department.map((r, i) => ({
            id: r.id,
            department: r.department,
          }))
        );
      })
      ?.catch((err) => {
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  useEffect(() => {
    getAllVisitors();
    getDepartment();
  }, []);

  return (
    <Paper
      elevation={8}
      variant="outlined"
      sx={{
        border: 1,
        borderColor: "grey.500",
        marginLeft: "10px",
        marginRight: "10px",
        marginTop: "10px",
        marginBottom: "60px",
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
        <h2>
          Material Entry
          {/* <FormattedLabel id="bookClassification" /> */}
        </h2>
      </Box>

      <Head>
        <title>visitor-entry</title>
      </Head>
      {isOpenCollapse ? (
        <>
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                clear: "both",
              }}
            >
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: ".9vh 0",
                  }}
                >
                  <Typography
                    sx={{
                      margin: "0 20px",
                    }}
                  >
                    Visitor Name
                  </Typography>
                  <Controller
                    name="visitorName"
                    control={control}
                    render={({ field }) => <TextField required {...field} />}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: ".9vh 0",
                  }}
                >
                  <Typography
                    sx={{
                      margin: "0 20px",
                    }}
                  >
                    Department Name
                  </Typography>
                  <Controller
                    name="departmentKey"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} value={field.value}>
                        {departments?.map((item, i) => {
                          return (
                            <MenuItem key={i} value={item.id}>
                              {item.department}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    )}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: ".9vh 0",
                  }}
                >
                  <Typography
                    sx={{
                      margin: "0 20px",
                    }}
                  >
                    Whoom to meet
                  </Typography>
                  <Controller
                    name="toWhomWantToMeet"
                    control={control}
                    render={({ field }) => <TextField required {...field} />}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: ".9vh 0",
                  }}
                >
                  <Typography
                    sx={{
                      margin: "0 20px",
                    }}
                  >
                    Priority
                  </Typography>

                  <Controller
                    name="priority"
                    control={control}
                    defaultValue="Emergency Visit"
                    render={({ field }) => (
                      <Select
                        {...field}
                        defaultValue="Emergency Visit"
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                      >
                        {priorityList.map((item, i) => {
                          return (
                            <MenuItem key={i} value={item.label}>
                              {item.label}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    )}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: ".9vh 0",
                  }}
                >
                  <Typography
                    sx={{
                      margin: "0 20px",
                    }}
                  >
                    Mobile No
                  </Typography>
                  <Controller
                    name="mobileNumber"
                    control={control}
                    render={({ field }) => (
                      <TextField type="number" required {...field} />
                    )}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    placeContent: "flex-end",
                    margin: ".9vh 0",
                  }}
                >
                  <Controller
                    name="notoriousEntry"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        {...field}
                        control={<Checkbox />}
                        label="Notorious Entry"
                      />
                    )}
                  />
                </Box>
              </Box>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: "2vh 0",
                  }}
                >
                  <Typography
                    sx={{
                      margin: "0 20px",
                    }}
                  >
                    Visitor Photo
                  </Typography>
                  <Controller
                    name="visitorPhoto"
                    control={control}
                    render={({ field }) => (
                      <Button variant="contained" component="label">
                        Upload
                        <input
                          {...field}
                          hidden
                          accept="image/*"
                          multiple
                          type="file"
                        />
                      </Button>
                    )}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: ".9vh 0",
                  }}
                >
                  <Typography
                    sx={{
                      margin: "0 20px",
                    }}
                  >
                    Purpose
                  </Typography>
                  <Controller
                    name="purpose"
                    control={control}
                    render={({ field }) => <TextField required {...field} />}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: ".9vh 0",
                  }}
                >
                  <Typography
                    sx={{
                      margin: "0 20px",
                    }}
                  >
                    Aadhar Card No
                  </Typography>
                  <Controller
                    name="aadhar_card_no"
                    control={control}
                    render={({ field }) => (
                      <TextField type="number" required {...field} />
                    )}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: ".9vh 0",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      margin: ".9vh 0",
                    }}
                  >
                    <Typography
                      sx={{
                        margin: "0 20px",
                      }}
                    >
                      IN Time
                    </Typography>
                    <Controller
                      control={control}
                      name="inTime"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DateTimePicker
                            renderInput={(props) => <TextField {...props} />}
                            label="Visitor In Date Time"
                            value={field.value}
                            onChange={(date) => field.onChange(date)}
                          />
                        </LocalizationProvider>
                      )}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box sx={{ padding: "10px" }}>
              <Divider style={{ background: "black" }} variant="middle" />
              <Box
                sx={{
                  padding: "10px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TextField
                  sx={{ width: "70%" }}
                  id="outlined-basic"
                  label="Personal Equipment"
                  size="small"
                  variant="outlined"
                  fullWidth
                  {...register("personalEquipments")}
                  error={!!errors.personalEquipments}
                  helperText={
                    errors?.personalEquipments
                      ? errors.personalEquipments.message
                      : null
                  }
                />
              </Box>
            </Box>
            <Box className={styles.btns}>
              <Button variant="contained" type="submit">
                Save
              </Button>
              <Button variant="contained" onClick={() => reset()}>
                Clear
              </Button>
              <Button
                variant="contained"
                onClick={() => setIsOpenCollapse(!isOpenCollapse)}
              >
                Exit
              </Button>
            </Box>
          </form>
        </>
      ) : (
        <>
          <Grid container sx={{ padding: "10px" }}>
            <Grid item xs={11}></Grid>
            <Grid item xs={1}>
              <Button
                variant="contained"
                endIcon={<AddIcon />}
                // type='primary'
                // disabled={buttonInputState}
                onClick={() => {
                  // reset({
                  //   ...resetValuesExit,
                  // });
                  setEditButtonInputState(true);
                  setDeleteButtonState(true);
                  setBtnSaveText("Save");
                  // setButtonInputState(true);
                  // setSlideChecked(true);
                  setIsOpenCollapse(!isOpenCollapse);
                }}
              >
                Add
              </Button>
            </Grid>
          </Grid>

          <DataGrid
            // disableColumnFilter
            // disableColumnSelector
            // disableToolbarButton
            // disableDensitySelector
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
            autoHeight
            sx={{
              // marginLeft: 5,
              // marginRight: 5,
              // marginTop: 5,
              // marginBottom: 5,
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
            // rows={dataSource}
            // pageSize={5}
            // rowsPerPageOptions={[5]}
            //checkboxSelection

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
              getAllVisitors(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getAllVisitors(_data, data.page);
            }}
          />
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Box
                sx={{
                  padding: "10px",
                }}
              >
                <Controller
                  control={control}
                  name="outTime"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        renderInput={(props) => (
                          <TextField {...props} size="small" fullWidth />
                        )}
                        label="Visitor Out Date Time"
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "10px",
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    setBtnSaveText("Checkout");
                    setRowId(paramsData.row.id);
                    onSubmitForm(paramsData.row, "Checkout");
                  }}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </Modal>
        </>
      )}
    </Paper>
  );
}
export default MaterialEntry;
