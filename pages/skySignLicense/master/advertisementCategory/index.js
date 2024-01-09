import { yupResolver } from "@hookform/resolvers/yup";
import { Refresh } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";

import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Paper,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Slide,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { message } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import urls from "../../../../URLS/urls";
import styles from "../../../../styles/skysignstyles/view.module.css";
import schema from "../../../../containers/schema/skysignschema/advertisementCategoryschema";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import sweetAlert from "sweetalert";

// func
const Index = () => {
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
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // state for name
  const [mediaTypes, setmediaTypes] = useState([]);

  const getmediaTypes = () => {
    axios.get(`${urls.SSLM}/master/MstMediaType/getAll`).then((r) => {
      setmediaTypes(
        r.data.MstMediaType.map((row) => ({
          id: row.id,
          mediaType: row.mediaType,
        }))
      );
    });
  };

  useEffect(() => {
    getmediaTypes();
  }, []);

  // state for name
  const [mediaSubType, setmediaSubType] = useState([]);

  const getmediaSubType = () => {
    axios.get(`${urls.SSLM}/master/MstMediaSubType/getAll`).then((r) => {
      setmediaSubType(
        r.data.MstMediaSubType.map((row) => ({
          id: row.id,
          mediaSubType: row.mediaSubType,
        }))
      );
    });
  };

  useEffect(() => {
    getmediaSubType();
  }, []);

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
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.SSLM}/master/MstAdvertisementCategory/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getAdvertisementCategoryDetails();
                setButtonInputState(false);
              }
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
            .post(`${urls.SSLM}/master/MstAdvertisementCategory/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getAdvertisementCategoryDetails();
                setButtonInputState(false);
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    console.log("formData", fromData);
    const fromDate = moment(fromData.fromDate).format("YYYY-MM-DD");
    const toDate = moment(fromData.toDate).format("YYYY-MM-DD");
    const finalBodyForApi = {
      ...fromData,
      fromDate,
      toDate,
      activeFlag: btnSaveText === "Update" ? null : fromData.activeFlag,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    // Save - DB
    console.log("Post -----");
    axios
      .post(
        `${urls.SSLM}/master/MstAdvertisementCategory/save`,
        finalBodyForApi
      )
      .then((res) => {
        console.log("res", res);
        if (res.status == 200) {
          fromData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getAdvertisementCategoryDetails();
          setButtonInputState(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
          setIsOpenCollapse(false);
        }
      });
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

  // Reset Values Cancell
  const resetValuesCancell = {
    fromDate: null,
    toDate: null,
    advertisementCategory: "",

    mediaType: "",
    mediaSubType: "",
    advertisementCategoryPrefix: "",
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,

    advertisementCategory: "",
    mediaType: "",
    mediaSubType: "",
    advertisementCategoryPrefix: "",
    remark: "",
    id: "",
  };

  // Get Table - Data
  const getAdvertisementCategoryDetails = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    console.log("getLIC ----");
    axios
      .get(`${urls.SSLM}/master/MstAdvertisementCategory/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        console.log(";r", r);
        let result = r.data.MstAdvertisementCategory;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log("44");
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1,
            advertisementCategoryPrefix: r.advertisementCategoryPrefix,
            toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),

            mediaType: r.mediaType,
            mediaSubType: r.mediaSubType,
            advertisementCategory: r.advertisementCategory,
            remark: r.remark,
            mediaTypeName: mediaTypes?.find((obj) => obj?.id == r.mediaType)
              ?.mediaType,
            mediaSubTypeName: mediaSubType?.find(
              (obj) => obj?.id == r.mediaSubType
            )?.mediaSubType,
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });
        setDataSource([..._res]);
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      });
  };
  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getAdvertisementCategoryDetails();
  }, [mediaTypes, mediaSubType]);

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      flex: 1,
    },
    {
      field: "advertisementCategoryPrefix",
      headerName: "Advertisement Category  Prefix",
      flex: 1,
    },
    {
      field: "advertisementCategory",
      headerName: "Advertisement Category",
      // type: "number",
      flex: 1,
    },
    {
      field: "fromDate",
      headerName: "From Date",
    },
    {
      field: "toDate",
      headerName: "To Date",
      //type: "number",
      flex: 1,
    },

    {
      field: "mediaTypeName",
      headerName: "Media Type",
      // type: "number",
      flex: 1,
    },
    {
      field: "mediaSubTypeName",
      headerName: "Media SubType ",
      // type: "number",
      flex: 1,
    },
    {
      field: "remark",
      headerName: "Remark",
      //type: "number",
      flex: 1,
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
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            {/* <IconButton onClick={() => deleteById(params.id)}>
              <DeleteIcon />
            </IconButton> */}
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

  // View
  return (
    <>
      {/* <BasicLayout titleProp={"none"}> */}
      <Paper
        sx={{
          marginLeft: "10px",
          marginRight: "10px",
          padding: 1,
        }}
      >
        {isOpenCollapse && (
          <div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <div className={styles.small}>
                  <div className={styles.row}>
                    <div>
                      <TextField
                        id="standard-basic"
                        label="Advertisement Category  Prefix *"
                        variant="standard"
                        {...register("advertisementCategoryPrefix")}
                        error={!!errors.advertisementCategoryPrefix}
                        helperText={
                          errors?.advertisementCategoryPrefix
                            ? errors.advertisementCategoryPrefix.message
                            : null
                        }
                      />
                    </div>

                    <div>
                      <TextField
                        id="standard-basic"
                        label="Advertisement Category *"
                        variant="standard"
                        {...register("advertisementCategory")}
                        error={!!errors.advertisementCategory}
                        helperText={
                          errors?.advertisementCategory
                            ? errors.advertisementCategory.message
                            : null
                        }
                      />
                    </div>
                  </div>
                  <div className={styles.row}>
                    <div>
                      <FormControl style={{ marginTop: 10 }}>
                        <Controller
                          control={control}
                          name="fromDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="YYYY/MM/DD"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    From Date
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
                      </FormControl>
                    </div>
                    <div>
                      <FormControl style={{ marginTop: 10 }}>
                        <Controller
                          control={control}
                          name="toDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="YYYY/MM/DD"
                                label={
                                  <span style={{ fontSize: 16 }}>To Date</span>
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
                      </FormControl>
                    </div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.fieldss}>
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.mediaType}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Media Type *
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: 250 }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="Media Type *"
                            >
                              {mediaTypes &&
                                mediaTypes.map((mediaType, index) => (
                                  <MenuItem key={index} value={mediaType.id}>
                                    {mediaType.mediaType}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="mediaType"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.mediaType ? errors.mediaType.message : null}
                        </FormHelperText>
                      </FormControl>
                    </div>
                    <div className={styles.fieldss}>
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.mediaSubType}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Media SubType *
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: 250 }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="Media SubType *"
                            >
                              {mediaSubType &&
                                mediaSubType.map((mediaSubType, index) => (
                                  <MenuItem key={index} value={mediaSubType.id}>
                                    {mediaSubType.mediaSubType}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="mediaSubType"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.mediaSubType
                            ? errors.mediaSubType.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </div>
                  <div className={styles.row}>
                    <div>
                      <TextField
                        id="standard-basic"
                        label="Remark"
                        variant="standard"
                        // value={dataInForm && dataInForm.remark}
                        {...register("remark")}
                        error={!!errors.remark}
                        helperText={
                          errors?.remark ? errors.remark.message : null
                        }
                      />
                    </div>
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
            variant="contained"
            endIcon={<AddIcon />}
            type="primary"
            disabled={buttonInputState}
            onClick={() => {
              reset({
                ...resetValuesExit,
              });
              setBtnSaveText("Save");
              setIsOpenCollapse(!isOpenCollapse);
            }}
          >
            Add{" "}
          </Button>
        </div>
        <DataGrid
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
          // columns={columns}
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
            getAdvertisementCategoryDetails(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            console.log("222", _data);
            // updateData("page", 1);
            getAdvertisementCategoryDetails(_data, data.page);
          }}
        />
      </Paper>
      {/* </BasicLayout> */}
    </>
  );
};

export default Index;
