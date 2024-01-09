import { yupResolver } from "@hookform/resolvers/yup";
import { Refresh } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ToggleOffSharpIcon from "@mui/icons-material/ToggleOffSharp";
import CheckIcon from "@mui/icons-material/Check";
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
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { message, Typography } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import urls from "../../../../URLS/urls";
// import styles from "../formType/view.module.css";
// import schema from "./formTypeschema";
import styles from "../../../../styles/skysignstyles/view.module.css";
import schema from "../../../../containers/schema/skysignschema/formTypeschema";
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

  //Active By ID
  const activeById = (value) => {
    swal({
      title: "Active?",
      text: "Are you sure you want to inactive this record ?",
      icone: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willInactive) => {
      if (willInactive) {
        axios
          .delete(`${urls.SSLM}/master/MstFormType/save/ ${value} `)
          .then((res) => {
            if (res.status == 226) {
              getFormTypeDetails();
              swal("Record is Successfully Inactive!", {
                icon: "success",
              });
              setButtonInputState(false);
              //getcast();
            }
          });
      } else {
        swal("Record is Safe");
      }
    });
  };

  //Delete
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
            .post(`${urls.SSLM}/master/MstFormType/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getFormTypeDetails();
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
            .post(`${urls.SSLM}/master/MstFormType/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getFormTypeDetails();
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
      .post(`${urls.SSLM}/master/MstFormType/save`, finalBodyForApi)
      .then((res) => {
        console.log("res", res);
        if (res.status == 200) {
          fromData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getFormTypeDetails();
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
    formType: "",
    formtypemr: "",
    formTypePrefix: "",
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    formType: "",
    formtypemr: "",
    formTypePrefix: "",
    remark: "",
    id: "",
  };

  // Get Table - Data
  const getFormTypeDetails = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    console.log("getLIC ----");
    axios
      .get(`${urls.SSLM}/master/MstFormType/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((r) => {
        console.log(";r", r);
        let result = r.data.MstFormType;
        console.log("result", result);

        let _res = result.map((r, i) => {
          console.log("44");
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1,
            formTypePrefix: r.formTypePrefix,
            toDate: moment(r.toDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            fromDate: moment(r.fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
            formType: r.formType,
            formtypemr: r.formtypemr,
            remark: r.remark,
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
    getFormTypeDetails();
  }, []);

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      flex: 1,
    },
    {
      field: "formTypePrefix",
      headerName: "Form Type Prefix",
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
      field: "formType",
      headerName: "Form Type",
      // type: "number",
      flex: 1,
    },
    {
      field: "formtypemr",
      headerName: "Form Type Marathi",
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
    <Box>
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
                        label="Form Type Prefix *"
                        variant="standard"
                        {...register("formTypePrefix")}
                        error={!!errors.formTypePrefix}
                        helperText={
                          errors?.formTypePrefix
                            ? errors.formTypePrefix.message
                            : null
                        }
                      />
                    </div>
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
                    <div>
                      <TextField
                        id="standard-basic"
                        label="FormType *"
                        variant="standard"
                        // value={dataInForm && dataInForm.formType}
                        {...register("formType")}
                        error={!!errors.formType}
                        helperText={
                          errors?.formType ? errors.formType.message : null
                        }
                      />
                    </div>
                    <div>
                      <TextField
                        id="standard-basic"
                        label="Form type marathi *"
                        variant="standard"
                        // value={dataInForm && dataInForm.formtypemr}
                        {...register("formtypemr")}
                        error={!!errors.formtypemr}
                        helperText={
                          errors?.formtypemr ? errors.formtypemr.message : null
                        }
                      />
                    </div>
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
          rows={data.rows}
          columns={columns}
          onPageChange={(_data) => {
            getFormTypeDetails(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            console.log("222", _data);
            // updateData("page", 1);
            getFormTypeDetails(_data, data.page);
          }}
        />
      </Paper>
    </Box>
  );
};

export default Index;
