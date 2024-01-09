import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment/moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import * as yup from "yup";
import urls from "../../../URLS/urls";
import styles from "../../../styles/cfc/cfc.module.css";
import Transliteration from "../../../components/common/linguosol/transliteration";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import schema from "../../../containers/schema/common/genderSchema";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../../util/util";

const Index = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {},
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    getValues,
    formState: { errors },
  } = methods;

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [runAgain, setRunAgain] = useState(false);
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

  useEffect(() => {
    setRunAgain(false);
    getGender();
  }, [runAgain]);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const [load, setLoad] = useState();

  const router = useRouter();

  // Exit Button
  const exitBack = () => {
    router.back();
  };

  const handleLoad = () => {
    setLoad(false);
  };

  // Get Table - Data
  const getGender = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    axios
      .get(`${urls.CFCURL}/master/gender/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        let result = res.data.gender;
        let _res = result.map((r, i) => {
          return {
            id: r.id,
            // srNo: i + 1,
            srNo: Number(_pageNo + "0") + i + 1,
            gender: r.gender ? r.gender : "-",
            activeFlag: r.activeFlag,
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
            genderMr: r.genderMr ? r.genderMr : "-",
            displayOrder: r.displayOrder ? r.displayOrder : "-",
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
      .post(`${urls.CFCURL}/master/gender/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          if (res.data?.errors?.length > 0) {
            res.data?.errors?.map((x) => {
              if (x.field == "gender") {
                setError("gender", {
                  message:
                    x.code == "field.gender.alreadyExist" &&
                    "Gender already exist",
                });
              } else if (x.field == "genderMr") {
                setError("genderMr", {
                  message:
                    x.code == "field.genderMr.alreadyExist" &&
                    "Gender (In marathi) already exist",
                });
              }
            });
          } else {
            formData.id
              ? sweetAlert(
                  "Updated!",
                  "Record Updated successfully !",
                  "success"
                )
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            getGender();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        }
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
            .post(`${urls.CFCURL}/master/gender/save`, body, {
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

                getGender();
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
            .post(`${urls.CFCURL}/master/gender/save`, body, {
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
                getGender();
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
    gender: "",
    genderMr: "",
    displayOrder: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    gender: "",
    genderMr: "",
    displayOrder: "",
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      flex: 0.3,
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "gender",
      headerName: <FormattedLabel id="gender" />,
      headerAlign: "center",
      flex: 1,
    },

    {
      field: "genderMr",
      headerName: <FormattedLabel id="genderMr" />,
      headerAlign: "center",
      flex: 1,
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
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
              <EditIcon style={{ color: "#556CD6" }} />
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
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.row.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.row.id, "Y")}
                />
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
      <>
        <BreadcrumbComponent />
      </>
      <Box style={{ display: "flex" }}>
        <Box className={styles.tableHead} sx={{ display: "flex" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{
              mr: 2,
              paddingLeft: "30px",
              color: "white",
            }}
            onClick={() => exitBack()}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box className={styles.h1Tag} sx={{ paddingLeft: "38%" }}>
            <FormattedLabel id="genderMaster" />
          </Box>
        </Box>
        <Box>
          <Button
            className={styles.adbtn}
            variant="contained"
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
            <AddIcon size="70" />
          </Button>
        </Box>
      </Box>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={load}
        onClick={handleLoad}
      >
        Loading....
        <CircularProgress color="inherit" />
      </Backdrop>

      <Paper style={{ paddingTop: isOpenCollapse ? "20px" : "0px" }}>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <Box>
              <br />
              <br />
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <Grid container style={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sm={2}
                      md={2}
                      lg={2}
                      xl={2}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        size="small"
                        sx={{
                          width: "90%",
                          backgroundColor: "white",
                        }}
                        placeholder="1"
                        id="outlined-basic"
                        label={<FormattedLabel id="displayOrder" />}
                        variant="outlined"
                        // value={dataInForm && dataInForm.gender}
                        {...register("displayOrder")}
                        error={!!errors.displayOrder}
                        helperText={
                          errors?.displayOrder
                            ? errors.displayOrder.message
                            : null
                        }
                        InputLabelProps={{
                          shrink: watch("displayOrder") ? true : false,
                        }}
                      />

                      {/* <FormControl
                        variant="outlined"
                        size="small"
                        // fullWidth
                        sx={{ width: "90%", backgroundColor: "white" }}
                        error={!!errors.department}
                      >
                        <InputLabel id="demo-simple-select-outlined-label">
                          <FormattedLabel id="displayOrder" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              variant="outlined"
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="displayOrder" />}
                            >
                              <MenuItem value={1}>1</MenuItem>
                              <MenuItem value={2}>2</MenuItem>
                              <MenuItem value={3}>3</MenuItem>
                            </Select>
                          )}
                          name="displayOrder"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.displayOrder
                            ? errors.displayOrder.message
                            : null}
                        </FormHelperText>
                      </FormControl> */}
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={5}
                      md={5}
                      lg={5}
                      xl={5}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {" "}
                      <Box sx={{ width: "90%" }}>
                        <Transliteration
                          variant={"outlined"}
                          _key={"gender"}
                          labelName={"gender"}
                          fieldName={"gender"}
                          updateFieldName={"genderMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={<FormattedLabel id="gender" required />}
                          error={!!errors.gender}
                          helperText={
                            errors?.gender ? errors.gender.message : null
                          }
                        />
                      </Box>
                      {/* <TextField
                        size="small"
                        sx={{
                          width: "90%",
                          backgroundColor: "white",
                        }}
                        id="outlined-basic"
                        label={<FormattedLabel id="gender" />}
                        variant="outlined"
                        {...register("gender")}
                        error={!!errors.gender}
                        helperText={
                          errors?.gender ? errors.gender.message : null
                        }
                      /> */}
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={5}
                      md={5}
                      lg={5}
                      xl={5}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {" "}
                      <Box sx={{ width: "90%" }}>
                        <Transliteration
                          variant={"outlined"}
                          _key={"genderMr"}
                          labelName={"genderMr"}
                          fieldName={"genderMr"}
                          updateFieldName={"gender"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          label={<FormattedLabel id="genderMr" required />}
                          error={!!errors.genderMr}
                          helperText={
                            errors?.genderMr ? errors.genderMr.message : null
                          }
                        />
                      </Box>
                      {/* <TextField
                        size="small"
                        sx={{
                          width: "90%",
                          backgroundColor: "white",
                        }}
                        id="outlined-basic"
                        label={<FormattedLabel id="genderMr" />}
                        variant="outlined"
                        {...register("genderMr")}
                        error={!!errors.genderMr}
                        helperText={
                          errors?.genderMr ? errors.genderMr.message : null
                        }
                      /> */}
                    </Grid>
                    <Grid
                      item
                      xs={2}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    ></Grid>
                  </Grid>

                  {/* </div> */}

                  <br />
                  <br />
                  <Grid container className={styles.feildres} spacing={2}>
                    <Grid item>
                      <Button
                        type="submit"
                        size="small"
                        variant="outlined"
                        className={styles.button}
                        endIcon={<SaveIcon />}
                      >
                        <FormattedLabel id="Save" />
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        size="small"
                        variant="outlined"
                        className={styles.button}
                        endIcon={<ClearIcon />}
                        onClick={() => {
                          reset({
                            ...resetValuesExit,
                          });
                        }}
                      >
                        {<FormattedLabel id="clear" />}
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        size="small"
                        variant="outlined"
                        className={styles.button}
                        // color="primary"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitButton()}
                      >
                        {<FormattedLabel id="exit" />}
                      </Button>
                    </Grid>
                  </Grid>
                  <br />
                </form>
              </FormProvider>
            </Box>
          </Slide>
        )}

        <Box
          style={{
            height: "auto",
            overflow: "auto",
            width: "100%",
          }}
        >
          <DataGrid
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={(row) => row.srNo}
            components={{ Toolbar: GridToolbar }}
            autoHeight={data.pageSize}
            density="compact"
            sx={{
              "& .super-app-theme--cell": {
                backgroundColor: "#E3EAEA",
                borderLeft: "10px solid white",
                borderRight: "10px solid white",
                borderTop: "4px solid white",
              },
              backgroundColor: "white",
              boxShadow: 2,
              border: 1,
              borderColor: "primary.light",
              "& .MuiDataGrid-cell:hover": {},
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#E3EAEA",
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
            rowCount={data.totalRows}
            rowsPerPageOptions={data.rowsPerPageOptions}
            page={data.page}
            pageSize={data.pageSize}
            rows={data.rows}
            columns={columns}
            onPageChange={(_data) => {
              getGender(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              getGender(_data, data.page);
            }}
          />
        </Box>
      </Paper>
    </>
  );
};

export default Index;
