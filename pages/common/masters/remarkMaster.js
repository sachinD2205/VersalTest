import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  Box,
  TextField,
  Grid,
  Tooltip,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../containers/Layout/BasicLayout";
// import urls from "../../../../URLS/urls";
import urls from "../../../URLS/urls";
import schema from "../../../containers/schema/common/RemarkMaster";
import styles from "../../../styles/[remarkMaster].module.css";
import sweetAlert from "sweetalert";
import * as yup from "yup";
// import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../util/util";

const Index = () => {
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
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  let schema = yup.object().shape({
    department: yup.string().required("Department  is Required !!!"),
    approvalRemark: yup.string().required("Remark is Required !!!"),
    rejectionRemark: yup.string().required("Remark  is Required !!"),
  });

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [typeOfRemarks, settypeOfRemarks] = useState([]);
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
    gettypeOfRemarks();
  }, []);

  useEffect(() => {
    getRemarkMaster();
  }, [typeOfRemarks]);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const gettypeOfRemarks = () => {
    axios
      .get(`${urls.BaseURL}/department/getAll`)
      .then((r) => {
        settypeOfRemarks();
        // r.data.map((row) => ({
        //   id: row.id,
        //   department: row.department,
        // }))
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // Get Table - Data
  const getRemarkMaster = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    axios
      .get(`${urls.BaseURL}/remarkMaster/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
      })
      .then((res) => {
        let result = res.data.remarkMaster;
        let _res = result.map((res, i) => {
          console.log("res payment mode", res);
          return {
            srNo: Number(_pageNo + "0") + i + 1,
            activeFlag: res.activeFlag,
            id: res.id,
            status: res.activeFlag === "Y" ? "Active" : "InActive",
            ...res,
          };
        });

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

  const editRecord = (rows) => {
    console.log("Edit cha data:", rows);
    setBtnSaveText("Update"),
      setID(rows.id),
      setIsOpenCollapse(true),
      setSlideChecked(true);
    reset(rows);
  };

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    const finalBodyForApi = {
      ...formData,
    };

    axios
      .post(`${urls.BaseURL}/remarkMaster/save`, finalBodyForApi)
      .then((res) => {
        if (res.status == 200) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getRemarkMaster();
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

  // Delete By ID
  // const deleteById = (value) => {
  //   swal({
  //     title: "Delete?",
  //     text: "Are you sure you want to delete this Record ? ",
  //     icon: "warning",
  //     buttons: true,
  //     dangerMode: true,
  //   }).then((willDelete) => {
  //     axios
  //       .delete(`${urls.BaseURL}/approvalRejectionRemarks/discard/${value}`)
  //       .then((res) => {
  //         if (res.status == 226) {
  //           if (willDelete) {
  //             swal("Record is Successfully Deleted!", {
  //               icon: "success",
  //             });
  //           } else {
  //             swal("Record is Safe");
  //           }
  //           getDepartment();
  //           getServiceName();
  //           setButtonInputState(false);
  //         }
  //       });
  //   });
  // };
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
            .post(`${urls.CFCURL}/master/remarkMaster/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deactivated!", {
                  icon: "success",
                });

                setButtonInputState(false);
                getRemarkMaster();
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
            .post(`${urls.CFCURL}/master/remarkMaster/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully activated!", {
                  icon: "success",
                });
                setButtonInputState(false);
                getRemarkMaster();
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

  // Exit Button
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

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    department: null,
    service: null,
    remarkEn: "",
    remarkMa: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    department: null,
    service: null,
    remarkEn: "",
    remarkMa: "",
    id: null,
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.NO",
      flex: 1,
    },
    // {
    //   field: "departmentName",
    //   headerName: "Department ",
    //   flex: 1,
    // },

    // {
    //     field: "villageNameEng",
    //     headerName: "Village",
    //     // type: "number",
    //     flex: 1,
    //   },
    {
      field: "remarkEn",
      headerName: "Remark(English)",
      // type: "number",
      flex: 1,
    },
    {
      field: "remarkMa",
      headerName: "Remark(Marathi)",
      //type: "number",
      flex: 1,
    },
    {
      field: "typeOfRemarks",
      headerName: "Type Of Remarks",
      // type: "number",
      flex: 1,
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
                const { departmentName, ...rest } = params.row;
                reset({ ...rest });
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

  // View
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
        Remark Master
        {/* <FormattedLabel id='aadharAuthentication' /> */}
      </div>
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
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <div>
                    <Grid
                      container
                      spacing={2}
                      style={{ marginTop: "5px", marginLeft: "5%" }}
                    >
                      <Grid item xs={4}>
                        <TextField
                          sx={{ width: 250, marginTop: 5 }}
                          id="standard-basic"
                          label="Remark Eng*"
                          variant="standard"
                          {...register("remarkEn")}
                          error={!!errors.remarkEn}
                          helperText={
                            errors?.remarkEn ? errors.remarkEn.message : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          sx={{ width: 250, marginTop: 5 }}
                          id="standard-basic"
                          label="Remark Mr"
                          variant="standard"
                          {...register("remarkMa")}
                          error={!!errors.remarkMa}
                          helperText={
                            errors?.remarkMa ? errors.remarkMa.message : null
                          }
                        />
                      </Grid>

                      <Grid
                        Type
                        Of
                        Remarks
                        item
                        xs={4}
                        // sx={{ marginTop: 5 }}
                        // style={{
                        //   display: "flex",
                        //   justifyContent: "center",
                        //   alignItems: "center",
                        // }}
                        sx={{ width: 250, marginTop: 5 }}
                      >
                        <FormControl
                          variant="outlined"
                          size="small"
                          // fullWidth
                          sx={{ width: "35%" }}
                          error={!!errors.typeOfRemarks}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="typeOfRemarks" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                variant="standard"
                                onChange={(value) => field.onChange(value)}
                                // label="Payment Mode"
                              >
                                {typeOfRemarks &&
                                  typeOfRemarks.map((typeOfRemarks, index) => {
                                    return (
                                      <MenuItem
                                        key={index}
                                        value={typeOfRemarks.id}
                                      >
                                        {typeOfRemarks.typeOfRemarks}
                                      </MenuItem>
                                    );
                                  })}
                              </Select>
                            )}
                            name="typeOfRemarks"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.typeOfRemarks
                              ? errors.typeOfRemarks.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      spacing={2}
                      style={{ marginTop: "5%", marginLeft: "20%" }}
                    >
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
                    </Grid>
                  </div>
                </form>
              </FormProvider>
            </div>
          </Slide>
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
              setEditButtonInputState(true);
              setDeleteButtonState(true);
              setBtnSaveText("Save");
              setButtonInputState(true);
              setSlideChecked(true);
              setIsOpenCollapse(!isOpenCollapse);
            }}
          >
            Add{" "}
          </Button>
        </div>
        {/* <DataGrid
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
          //checkboxSelection
        /> */}
        <Box
          style={{
            height: "auto",
            overflow: "auto",
            width: "100%",
          }}
        >
          <DataGrid
            // componentsProps={{
            //   toolbar: {
            //     showQuickFilter: true,
            //   },
            // }}
            getRowId={(row) => row.srNo}
            // components={{ Toolbar: GridToolbar }}
            autoHeight
            density="compact"
            sx={{
              "& .super-app-theme--cell": {
                backgroundColor: "#87E9F7",
                border: "1px solid white",
              },
              backgroundColor: "white",
              boxShadow: 2,
              border: 1,
              borderColor: "primary.light",
              "& .MuiDataGrid-cell:hover": {
                transform: "scale(1.1)",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#E1FDFF",
              },
              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#556CD6",
                color: "white",
              },

              "& .MuiDataGrid-column": {
                backgroundColor: "red",
              },
            }}
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
              getRemarkMaster(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getRemarkMaster(_data, data.page);
            }}
          />
        </Box>
      </Paper>
    </>
  );
};

export default Index;
