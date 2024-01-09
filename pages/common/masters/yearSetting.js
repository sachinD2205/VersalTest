import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import sweetAlert from "sweetalert";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import schema from "../../../containers/schema/common/yearSetting";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import styles from "../../../styles/[yearSetting].module.css";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import CheckIcon from "@mui/icons-material/Check";
import { yupResolver } from "@hookform/resolvers/yup";
// import { useDemoData } from '@mui/x-data-grid-generator';
// import FormattedLabel from "../../../../containers/CFC_ReusableComponent/reusableComponents/FormattedLabel";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { GridToolbar } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import urls from "../../../URLS/urls";
import BasicLayout from "../../../containers/Layout/BasicLayout";
import { catchExceptionHandlingMethod } from "../../../util/util";

const YearType = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();

  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState(0);
  const [yearTypes, setYearTypes] = useState([]);
  const language = useSelector((state) => state?.labels.language);
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

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  let abc = [];

  useEffect(() => {
    // console.log("yearTypes", yearTypes);
    getYearSetting();
  }, [yearTypes]);

  useEffect(() => {
    getYearType();
  }, []);

  const getYearSetting = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.CFCURL}/master/yearSetting/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(";res", res);
        let result = res.data.yearSetting;
        let _res = result.map((val, i) => {
          return {
            srNo: val.id,
            id: val.id,
            startDate: moment(val.startDate).format("llll"),
            endDate: moment(val.endDate).format("llll"),
            remark: val.remark,
            yearType: val.yearType,
            yearTypeName: yearTypes?.find((obj) => obj?.id === val.yearType)
              ?.yearType,
            activeFlag: val.activeFlag,
            status: val.activeFlag === "Y" ? "Active" : "InActive",
          };
        });
        console.log("result", _res);

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getYearType = () => {
    axios
      .get(`${urls.CFCURL}/master/yearType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setYearTypes(
          res.data.yearType.map((r, i) => ({
            id: r.id,
            yearType: r.yearType,
            yearTypeMr: r.yearTypeMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
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
        title: "Deactivate?",
        text: "Are you sure you want to deactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.CFCURL}/master/yearSetting/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deactivated!", {
                  icon: "success",
                });
                getYearSetting();
                setButtonInputState(false);
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              callCatchMethod(err, language);
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
          axios
            .post(`${urls.CFCURL}/master/yearSetting/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully activated!", {
                  icon: "success",
                });
                getYearSetting();
                setButtonInputState(false);
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              callCatchMethod(err, language);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    yearType: null,
    startDate: null,
    endDate: null,
    remark: "",
    remarkMr: "",
  };

  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
  };

  const onSubmitForm = (formData) => {
    console.log("formData", formData);
    const startDate = moment(formData.startDate).format("YYYY-MM-DD");
    const endDate = moment(formData.endDate).format("YYYY-MM-DD");
    const finalBodyForApi = {
      ...formData,
      startDate,
      endDate,
      // activeFlag: btnSaveText === "Update" ? null : formData.activeFlag,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(`${urls.CFCURL}/master/yearSetting/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("save data", res);
        if (res.status == 200) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getYearSetting();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const resetValuesExit = {
    yearType: null,
    startDate: null,
    endDate: null,
    remark: "",
    remarkMr: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: "yearType",
    //   headerName: <FormattedLabel id="yearType" />,
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "startDate",
      headerName: <FormattedLabel id="startDate" />,
      // type: "number",
      flex: 1,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "endDate",
      headerName: <FormattedLabel id="endDate" />,
      // type: "number",
      flex: 1,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "yearTypeName",
      headerName: <FormattedLabel id="yearType" />,
      // type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      // type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      // type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              <Tooltip title="Edit">
                <EditIcon style={{ color: "#556CD6" }} />
              </Tooltip>
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <Tooltip title="Deactivate">
                  <ToggleOnIcon
                    style={{ color: "green", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "N")}
                  />
                </Tooltip>
              ) : (
                <Tooltip title="Activate">
                  <ToggleOffIcon
                    style={{ color: "red", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "Y")}
                  />
                </Tooltip>
              )}
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <>
      <div
        style={{
          // backgroundColor: "#0084ff",
          backgroundColor: "#757ce8",
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
        Year Setting
        {/* <FormattedLabel id='aadharAuthentication' /> */}
      </div>
      <Paper style={{ margin: "50px" }}>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <Grid container style={{ padding: "10px" }}>
                <Grid
                  item
                  xs={6}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    style={{ backgroundColor: "white", marginTop: 15 }}
                    error={!!errors.startDate}
                  >
                    <Controller
                      control={control}
                      name="startDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                <FormattedLabel id="startDate" />
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
                    <FormHelperText>
                      {errors?.startDate ? errors.startDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid
                  item
                  xs={6}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    style={{ backgroundColor: "white", marginTop: 15 }}
                    error={!!errors.endDate}
                  >
                    <Controller
                      control={control}
                      name="endDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                <FormattedLabel id="endDate" />
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
                    <FormHelperText>
                      {errors?.endDate ? errors.endDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container style={{ padding: "10px" }}>
                <Grid
                  Year
                  Type
                  xs={4}
                  // sx={{ marginTop: 5 }}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    variant="outlined"
                    size="small"
                    // fullWidth
                    sx={{ width: "40%", marginLeft: 30 }}
                    error={!!errors.yearType}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="yearType" />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          variant="standard"
                          onChange={(value) => field.onChange(value)}
                          // label="Payment Mode"
                        >
                          {yearTypes &&
                            yearTypes.map((yearType, index) => {
                              return (
                                <MenuItem key={index} value={yearType.id}>
                                  {language == "en"
                                    ? yearType?.yearType
                                    : yearType?.yearTypeMr}
                                  {/* {cfcName.cfcName} */}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      )}
                      name="yearType"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.yearType ? errors.yearType.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid
                  item
                  xs={6}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    size="small"
                    style={{ backgroundColor: "white", marginLeft: 470 }}
                    id="outlined-basic"
                    // label="Remark"
                    label={<FormattedLabel id="remark" />}
                    variant="standard"
                    {...register("remark")}
                  />
                </Grid>
              </Grid>

              <Grid container style={{ padding: "10px" }}>
                <Grid
                  item
                  xs={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    sx={{ marginRight: 8 }}
                    type="submit"
                    variant="contained"
                    color="success"
                    endIcon={<SaveIcon />}
                  >
                    <FormattedLabel id={btnSaveText} />
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    sx={{ marginRight: 8 }}
                    variant="contained"
                    color="primary"
                    endIcon={<ClearIcon />}
                    onClick={() => cancellButton()}
                  >
                    <FormattedLabel id="clear" />
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    endIcon={<ExitToAppIcon />}
                    onClick={() => exitButton()}
                  >
                    <FormattedLabel id="exit" />
                  </Button>
                </Grid>
              </Grid>
              <Divider />
            </form>
          </Slide>
        )}

        <Grid container style={{ padding: "10px" }}>
          <Grid item xs={9}></Grid>
          <Grid
            item
            xs={2}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              type="primary"
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
                setIsOpenCollapse(!isOpenCollapse);
              }}
            >
              <FormattedLabel id="add" />
            </Button>
          </Grid>
        </Grid>

        <Box style={{ height: "auto", overflow: "auto" }}>
          <DataGrid
            sx={{
              // fontSize: 16,
              // fontFamily: 'Montserrat',
              // font: 'center',
              // backgroundColor:'yellow',
              // // height:'auto',
              // border: 2,
              // borderColor: "primary.light",
              overflowY: "scroll",

              "& .MuiDataGrid-virtualScrollerContent": {
                // backgroundColor:'red',
                // height: '800px !important',
                // display: "flex",
                // flexDirection: "column-reverse",
                // overflow:'auto !important'
              },
              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#556CD6",
                color: "white",
              },

              "& .MuiDataGrid-cell:hover": {
                color: "primary.main",
              },
            }}
            density="compact"
            autoHeight={true}
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
              getYearSetting(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getYearSetting(_data, data.page);
            }}
          />
        </Box>

        {/* <DataGrid
            autoHeight
            sx={{
              margin: 5,
            }}
            rows={dataSource}
            columns={columns}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => {
              getYearSetting(newPageSize);
              setPageSize(newPageSize);
            }}
            onPageChange={(e) => {
              console.log("event", e);
              setPageNo(e);
              setTotalElements(res.data.totalElements);
              console.log("dataSource->", dataSource);
            }}
            rowsPerPageOptions={[10, 20, 50, 100]}
            pagination
            rowCount={totalElements}
          /> */}
      </Paper>
    </>
  );
};

export default YearType;
