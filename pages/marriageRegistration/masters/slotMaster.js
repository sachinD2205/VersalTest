import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { ThemeProvider, styled } from "@mui/material/styles";
import {
  CalendarPicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
// import swal from "sweetalert";
import sweetAlert from "sweetalert";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import urls from "../../../URLS/urls";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css";
import theme from "../../../theme";
const SlotMaster = () => {
  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { tokenNo: "" },
  });
  const [fetchData, setFetchData] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [loaderState, setLoaderState] = useState(false);
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const getMaritalStatusDetails = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc",
  ) => {
    setLoaderState(true);
    axios
      .get(`${urls.MR}/master/slot/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
      })
      .then((res) => {
        setLoaderState(false);
        console.log("MR: getAll =", res.data);
        let _res = res.data.slots.map((r, i) => ({
          id: r.id,
          srNo: i + 1 + _pageNo * _pageSize,
          slotDate: r.slotDate,
          fromTime: r.fromTime,
          toTime: r.toTime,
          noOfSlots: r.noOfSlots,
          activeFlag: r.activeFlag,
        }));
        setDataSource([..._res]);
        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      });
  };

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getMaritalStatusDetails();
  }, [fetchData]);

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      // width: 80,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "slotDate",
      headerName: <FormattedLabel id="slotdate" />,
      //type: "number",
      flex: 1,
      // width: 130,
      headerAlign: "center",
      valueFormatter: (params) => {
        console.log(params, "bhava");
        return moment(params.value).format("DD-MM-YYYY");
      },
    },

    {
      field: "fromTime",
      headerName: <FormattedLabel id="fromTime" />,
      // width: 130,
      flex: 1,
      headerAlign: "center",
      valueFormatter: (params) =>
        moment(params.value, "hh:mm:ss").format("h:mm:ss A"),
    },

    {
      field: "toTime",
      headerName: <FormattedLabel id="toTime" />,
      // width: 130,
      flex: 1,
      headerAlign: "center",
      valueFormatter: (params) =>
        moment(params.value, "hh:mm:ss").format("h:mm:ss A"),
    },

    {
      field: "noOfSlots",
      headerName: <FormattedLabel id="noOfSlot" />,
      flex: 1,
      headerAlign: "center",
      // width: 100,
    },

    // {
    //   field: "actions",
    //   headerName: <FormattedLabel id="actions" />,
    //   // width: 120,
    //   flex: 1,
    //   sortable: false,
    //   disableColumnMenu: true,
    //   renderCell: (params) => {
    //     return (
    //       <>
    //         <IconButton
    //           // disabled={editButtonInputState}
    //           onClick={() => {
    //             // setBtnSaveText("Update"),
    //             setID(params.row.id),
    //               setIsOpenCollapse(true),
    //               setSlideChecked(true);
    //             setButtonInputState(true);
    //             reset(params.row);
    //           }}
    //         >
    //           <EditIcon color="primary" />
    //         </IconButton>
    //         {/* <IconButton
    //           disabled={deleteButtonInputState}
    //           onClick={() => deleteById(params.row.id, 'N')}
    //         > */}
    //         {params.row.activeFlag == "Y" ? (
    //           <ToggleOnIcon
    //             style={{ color: "green", fontSize: 30 }}
    //             onClick={() => deleteById(params.id, "N")}
    //           />
    //         ) : (
    //           <ToggleOffIcon
    //             style={{ color: "red", fontSize: 30 }}
    //             onClick={() => deleteById(params.id, "Y")}
    //           />
    //         )}
    //         {/* <DeleteIcon color='error' /> */}
    //         {/* </IconButton> */}
    //       </>
    //     );
    //   },
    // },
  ];

  const router = useRouter();

  // let language = useSelector((state) => state.labels.language);
  const language = useSelector((state) => state?.labels.language);

  const [suffiecient, setSuffiecient] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalforBook, setmodalforBook] = useState(false);
  const { fields, append, remove } = useFieldArray({ name: "slotss", control });
  const [btnValue, setButtonValue] = useState(false);

  const CustomizedCalendarPicker = styled(CalendarPicker)`
    & .css-1n2mv2k {
      display: 'flex',
      justifyContent: 'spaceAround',
      backgroundColor: 'red',
    }
    & mui-style-mvmu1r{
      display: 'flex',
      justifyContent: 'spaceAround',
      backgroundColor: 'red',
    }
  `;

  const isWeekend = (date) => {
    const day = date.day();
    return day === 0 || day === 6;
  };

  // Append UI
  const appendUI = (id, fromTime, toTime, noOfSlots) => {
    console.log("id", id);
    console.log(`sdf ${getValues(`slotss.length`)}`);
    console.log("fromTime,toTime", fromTime, toTime);
    append({
      id: id,
      fromTime: fromTime,
      toTime: toTime,
      noOfSlots: noOfSlots,
    });
  };

  // Button
  const buttonValueSetFun = () => {
    if (getValues(`slotss.length`) >= 7) {
      setButtonValue(true);
    } else {
      appendUI(null, null, null, null);
      setButtonValue(false);
    }
  };

  // Final Data
  const onFinish = (data) => {
    console.log("yetoy ka deta ki nhi ", data);

    let slots = [];

    let selectedDate = data.slotDate;

    // Array - Updated Data
    data.slotss.forEach((data, i) => {
      slots.push({
        i: i + 1,
        fromTime: data.fromTime
          ? moment(data.fromTime).format("HH:mm:ss")
          : null,
        toTime: data.toTime ? moment(data.toTime).format("HH:mm:ss") : null,
        noOfSlots: data.noOfSlots ? data.noOfSlots : null,
        slotDate: selectedDate,
      });
    });

    const reqBody = { slots: [...slots], slotDate: selectedDate };
    console.log("reqBody", reqBody);
    // if (btnSaveText === 'Save') {
    axios.post(`${urls.MR}/master/slot/save`, reqBody).then((r) => {
      if (r.status == 200) {
        // swal("Submited!", "Record Submited successfully !", "success");
        language == "en"
          ? sweetAlert({
              title: "Saved!",
              text: "Record Saved successfully!",
              icon: "success",
              button: "Ok",
            })
          : sweetAlert({
              title: "जतन केले!",
              text: "रेकॉर्ड यशस्वीरित्या जतन केले!",
              icon: "success",
              button: "ओके",
            });
        console.log("res", r);
        setValue("slotss", []);
        setmodalforBook(false);
      }
    });
    // }
  };

  const getSlot = (selectedDate) => {
    axios
      .get(`${urls.MR}/master/slot/getByDate?slotDate=${selectedDate}`)
      .then((r) => {
        console.log("MR: getByDate =", r.data);
        if (r.data.slots.length != 0) {
          r.data.slots.map((row) => {
            appendUI(
              row.id,
              moment(row.fromTime, "HH:mm:ss"),
              moment(row.toTime, "HH:mm:ss") /* .format('hh:mm:ss A') */,
              row.noOfSlots,
            );
          });
          if (r.data.slots.length < 7) {
            setSuffiecient(false);
            appendUI(null, null, null, null);
          } else {
            setSuffiecient(true);
          }
        } else {
          setSuffiecient(false);
          appendUI(null, null, null, null);
        }
      });
  };

  return (
    <>
      <div className={styles.model}>
        {/* Slot View/Add */}
        <Modal
          open={modalforBook}
          onClose={() => {
            setValue("slotss", []), setmodalforBook(false);
          }}
        >
          <form onSubmit={handleSubmit(onFinish)}>
            <div className={styles.box}>
              <div
                className={styles.titlemodelT}
                style={{ marginLeft: "25px" }}
              >
                <Typography
                  className={styles.titleOne}
                  variant="h6"
                  component="h2"
                  color="#f7f8fa"
                  style={{ marginLeft: "25px" }}
                >
                  <FormattedLabel id="SlotMasterHead" /> {selectedDate}
                </Typography>
                <IconButton>
                  <CloseIcon
                    onClick={() => {
                      setValue("slotss", []), setmodalforBook(false);
                    }}
                  />
                </IconButton>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  marginRight: "20px",
                }}
              >
                {!suffiecient && (
                  <Button
                    disabled={btnValue}
                    variant="contained"
                    size="small"
                    type="button"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      buttonValueSetFun();
                    }}
                  >
                    <FormattedLabel id="add" />
                  </Button>
                )}
              </div>

              <div
                container
                style={{ padding: "10px", backgroundColor: "#F9F9F9" }}
              >
                {fields.map((slot, index) => {
                  return (
                    <>
                      <div className={styles.row1}>
                        <div>
                          <FormControl
                            style={{ marginTop: 10 }}
                            error={!!errors.fromTime}
                          >
                            <Controller
                              format="HH:mm:ss"
                              control={control}
                              name={`slotss.${index}.fromTime`}
                              defaultValue={null}
                              key={slot.id}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <TimePicker
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        <FormattedLabel id="fromTime" />,
                                      </span>
                                    }
                                    value={field.value}
                                    onChange={(time) => {
                                      moment(
                                        field.onChange(time),
                                        "HH:mm:ss a",
                                      ).format("HH:mm:ss a");
                                    }}
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
                              {errors?.fromTime
                                ? errors.fromTime.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </div>

                        <div style={{ marginLeft: "50px" }}>
                          <FormControl
                            style={{ marginTop: 10 }}
                            error={!!errors.toTime}
                          >
                            <Controller
                              control={control}
                              name={`slotss.${index}.toTime`}
                              defaultValue={null}
                              key={slot.id}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <TimePicker
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        <FormattedLabel id="toTime" />,
                                      </span>
                                    }
                                    value={field.value}
                                    onChange={(time) => {
                                      moment(
                                        field.onChange(time),
                                        "HH:mm:ss a",
                                      ).format("HH:mm:ss a");
                                    }}
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
                              {errors?.toTime ? errors.toTime.message : null}
                            </FormHelperText>
                          </FormControl>
                        </div>
                        <div style={{ marginLeft: "50px" }}>
                          <TextField
                            defaultValue={null}
                            key={slot.id}
                            id="standard-basic"
                            label={
                              language === "en"
                                ? "Add No. Of Slot's"
                                : "स्लॉटची संख्या जोडा"
                            }
                            variant="standard"
                            {...register(`slotss.${index}.noOfSlots`)}
                            // error={!!errors.noOfSlots}
                            // helperText={
                            //   errors?.noOfSlots
                            //     ? errors.noOfSlots.message
                            //     : null
                            // }
                          />
                          <TextField
                            hidden
                            sx={{ opacity: "0%" }}
                            key={slot.id}
                            {...register(`slotss.${index}.id`)}
                          />
                        </div>
                        <div
                          item
                          xs={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginLeft: "50px",
                          }}
                        >
                          <Button
                            variant="contained"
                            size="small"
                            // startIcon={<DeleteIcon />}
                            style={{
                              color: "white",
                              backgroundColor: "red",
                              height: "30px",
                            }}
                            onClick={() => {
                              remove(index);
                            }}
                          >
                            <FormattedLabel id="delete" />
                          </Button>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>

              <div className={styles.btnappr}>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  endIcon={<CancelIcon />}
                  // type="primary"
                  onClick={() => {
                    // setBtnSaveText('Save')
                  }}
                >
                  <FormattedLabel id="save" />
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  endIcon={<CancelIcon />}
                  onClick={() => {
                    {
                      setValue("slotss", []), setmodalforBook(false);
                    }
                  }}
                >
                  <FormattedLabel id="exit" />
                </Button>
              </div>
            </div>
          </form>
        </Modal>
      </div>

      {/* <BasicLayout> */}
      <ThemeProvider theme={theme}>
        <Box>
          <BreadcrumbComponent />
        </Box>
        <Paper
          sx={{
            marginLeft: 4,
            marginRight: 4,
            marginTop: 2,
            marginBottom: 1,
            padding: 5,
            border: 1,
          }}
        >
          <div className={styles.small}>
            <div className={styles.detailsApot}>
              <div className={styles.h1TagApot}>
                <h1
                  style={{
                    color: "white",
                    marginTop: "1px",
                  }}
                >
                  {/* <FormattedLabel id="SlotMasterHead" /> */}
                  {language == "en" ? "Slot Master" : "स्लॉट मास्टर"}
                </h1>
              </div>
            </div>

            <div className={styles.appoitment} style={{ marginTop: "25px" }}>
              {/* <Controller
                control={control}
                name="slotDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <CustomizedCalendarPicker
                      sx={{
                        ".mui-style-1n2mv2k": {
                          display: "flex",
                          justifyContent: "space-evenly",
                        },
                        ".css-mvmu1r": {
                          display: "flex",
                          justifyContent: "space-evenly",
                        },
                        ".css-1dozdou": {
                          backgroundColor: "red",
                          marginLeft: "5px",
                        },
                        ".mui-style-mvmu1r": {
                          display: "flex",
                          justifyContent: "space-evenly",
                        },
                      }}
                      orientation="landscape"
                      openTo="day"
                      inputFormat="DD/MM/YYYY"
                      shouldDisableDate={isWeekend}
                      minDate={new Date()}
                      value={field.value}
                      onChange={(date) => {
                        setSelectedDate(moment(date).format("DD-MM-YY"));
                        getSlot(moment(date).format("YYYY-MM-DD"));
                        setmodalforBook(true),
                          field.onChange(moment(date).format("YYYY-MM-DD"));
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                )}
              /> */}

              <Controller
                control={control}
                name="slotDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <CustomizedCalendarPicker
                      sx={{
                        border: "1px solid #ccc", // Add this border style
                        padding: "8px",
                      }}
                      orientation="landscape"
                      openTo="day"
                      inputFormat="DD/MM/YYYY"
                      shouldDisableDate={isWeekend}
                      minDate={new Date()}
                      value={field.value}
                      onChange={(date) => {
                        setSelectedDate(moment(date).format("DD-MM-YY"));
                        getSlot(moment(date).format("YYYY-MM-DD"));
                        setmodalforBook(true),
                          field.onChange(moment(date).format("YYYY-MM-DD"));
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                )}
              />
            </div>
          </div>
          <Divider
            sx={{
              // marginLeft: 1,
              // marginRight: 1,
              marginTop: 2,
              // marginBottom: 1,
              // padding: 1,
              border: "1px solid #8E8E8E",
            }}
          />
          <Paper
            sx={{
              marginLeft: 1,
              marginRight: 1,
              marginTop: 2,
              // marginBottom: 1,
              padding: 1,
              border: "1px solid #8E8E8E",
            }}
          >
            {/* <DataGrid
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
              pagination
              paginationMode="server"
              rowCount={data.totalRows}
              rowsPerPageOptions={data.rowsPerPageOptions}
              page={data.page}
              pageSize={data.pageSize}
              rows={dataSource}
              columns={columns}
              onPageChange={(_data) => {
                console.log("222", data.pageSize, _data);
                getMaritalStatusDetails(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                // console.log("222", _data);
                // updateData("page", 1);
                getMaritalStatusDetails(_data, data.page);
              }}
            /> */}

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
                "& .MuiDataGrid-cell": {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                },
                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
              }}
              density="compact"
              pagination
              paginationMode="server"
              rowCount={data.totalRows}
              rowsPerPageOptions={data.rowsPerPageOptions}
              page={data.page}
              pageSize={data.pageSize}
              rows={dataSource}
              columns={columns}
              onPageChange={(_data) => {
                console.log("222", data.pageSize, _data);
                getMaritalStatusDetails(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                getMaritalStatusDetails(_data, data.page);
              }}
            />
          </Paper>
        </Paper>
      </ThemeProvider>
      {/* </BasicLayout> */}
    </>
  );
};

export default SlotMaster;
