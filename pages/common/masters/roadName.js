import { yupResolver } from "@hookform/resolvers/yup";
import { Clear, ExitToApp, Save } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
  Backdrop,
  Box,
  Button,
  Card,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import sweetAlert from "sweetalert";
import urls from "../../../URLS/urls";
import Transliteration from "../../../components/common/linguosol/transliteration";
import Loader from "../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import roadNameSchema from "../../../containers/schema/common/roadName";
import styles from "../../../styles/cfc/cfc.module.css";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../util/util";

const Index = () => {
  // import from use Form

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(roadNameSchema),
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

  //   const {
  //     register,
  //     handleSubmit,
  //     control,
  //     // @ts-ignore
  //     methods,
  //     reset,
  //     setValue,
  //     watch,
  //     formState: { errors },
  //   } = useForm({
  //     criteriaMode: "all",
  //     resolver: yupResolver(schema),
  //   });

  const language = useSelector((state) => state?.labels?.language);
  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [id, setID] = useState();
  const [applications, setApplications] = useState([]);
  const token = useSelector((state) => state.user.user.token);
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

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
    getApplications();
  }, []);

  useEffect(() => {
    getAllRoadName();
  }, [applications]);

  // getApplicationName
  const getApplications = () => {
    axios
      .get(`${urls.CFCURL}/master/application/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("res", r);
        setApplications(
          r?.data?.application?.map((row) => ({
            id: row.id,
            applicationNameEng: row.applicationNameEng,
            applicationNameMr: row.applicationNameMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getAllRoadName = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setOpen(true);
    axios
      .get(`${urls.CFCURL}/mstRoadName/getAll`, {
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
        console.log("mstRoadName", res);
        if (res.status == 200 || res.status == 201) {
          setOpen(false);
          let result = res?.data?.roadName;
          let _res = result.map((val, i) => {
            return {
              activeFlag: val.activeFlag,
              srNo: i + 1 + _pageNo * _pageSize,
              id: val.id,
              moduleNameEn: applications?.find(
                (obj) => obj?.id == val?.moduleId
              )?.applicationNameEng,
              moduleNameMr: applications?.find(
                (obj) => obj?.id == val?.moduleId
              )?.applicationNameMr,
              ...val,
              status: val.activeFlag === "Y" ? "Active" : "Inactive",
            };
          });
          console.log("_res", _res);
          setData({
            rows: _res,
            totalRows: res.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res.data.pageSize,
            page: res.data.pageNo,
          });
          setDataSource(res?.data);
          setOpen(false);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setOpen(false);
        callCatchMethod(err, language);
      });
  };

  const onSubmit = async (data) => {
    console.log("Form Data ", data);
    setOpen(true);

    const bodyForAPI = {
      ...data,
      activeFlag: btnSaveText === "Update" ? data.activeFlag : "Y",
    };

    console.log("bodyForAPI", bodyForAPI);

    await axios
      .post(`${urls.CFCURL}/mstRoadName/save`, bodyForAPI, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("save data", response);
        if (response.status == 200) {
          if (response.data?.errors?.length > 0) {
            response.data?.errors?.map((x) => {
              toast(x?.code, {
                type: "error",
              });
              setOpen(false);
            });
          } else {
            data.id
              ? sweetAlert(
                  "Updated!",
                  "Record Updated successfully !",
                  "success"
                )
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            getAllRoadName();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setOpen(false);
          }
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setOpen(false);
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
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.CFCURL}/mstRoadName/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Inactivated!", {
                  icon: "success",
                });
                getAllRoadName();
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
            .post(`${urls.CFCURL}/mstRoadName/save`, body, {
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
                getAllRoadName();
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
  const resetValuesExit = {
    roadNameEn: "",
    roadNameMr: "",
    moduleId: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.4,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language == "en" ? "roadNameEn" : "roadNameMr",
      headerName: <FormattedLabel id="roadName" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: language == "en" ? "moduleNameEn" : "moduleNameMr",
      headerName: <FormattedLabel id="moduleName" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 0.6,
      headerAlign: "center",
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            {params.row.activeFlag == "Y" ? (
              <IconButton
                disabled={editButtonInputState}
                onClick={() => {
                  setBtnSaveText("Update"),
                    setID(params.row.id),
                    setIsOpenCollapse(true),
                    setSlideChecked(true);
                  setButtonInputState(true);
                  reset(params.row);
                }}
              >
                <Tooltip title="Edit">
                  <EditIcon style={{ color: "#556CD6" }} />
                </Tooltip>
              </IconButton>
            ) : (
              <Tooltip>
                <EditIcon style={{ color: "gray" }} disabled={true} />
              </Tooltip>
            )}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true);
                // setButtonInputState(true);
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

  // Reset Values Cancell
  const resetValuesCancell = {
    roadNameEn: "",
    roadNameMr: "",
    moduleId: "",
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
    });
  };
  const onBack = () => {
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

  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      <div
        style={{
          // backgroundColor: "#0084ff",
          backgroundColor: "#757ce8",
          color: "white",
          fontSize: 19,
          padding: "10px",
          borderRadius: 100,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {language === "en" ? "Road Name Master" : "रोडचे नाव मास्टर"}
      </div>
      <div className={styles.main}>
        <div className={styles.left}>
          <Card>
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={open}
              onClick={handleClose}
            >
              <Loader />
            </Backdrop>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                {isOpenCollapse && (
                  <Slide
                    direction="down"
                    in={slideChecked}
                    mountOnEnter
                    unmountOnExit
                  >
                    <div className={styles.fields}>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={4}
                          md={4}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Box sx={{ width: "90%" }}>
                            <Transliteration
                              variant={"outlined"}
                              _key={"roadNameEn"}
                              labelName={"roadNameEn"}
                              fieldName={"roadNameEn"}
                              updateFieldName={"roadNameMr"}
                              sourceLang={"eng"}
                              targetLang={"mar"}
                              label={
                                <FormattedLabel id="roadNameEn" required />
                              }
                              error={!!errors.roadNameEn}
                              helperText={
                                errors?.roadNameEn
                                  ? errors.roadNameEn.message
                                  : null
                              }
                            />
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={4}
                          md={4}
                          lg={4}
                          xl={4}
                          // sx={{ marginTop: 5, marginLeft: 20 }}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Box sx={{ width: "90%" }}>
                            <Transliteration
                              variant={"outlined"}
                              _key={"roadNameMr"}
                              labelName={"roadNameMr"}
                              fieldName={"roadNameMr"}
                              updateFieldName={"roadNameEn"}
                              sourceLang={"mar"}
                              targetLang={"eng"}
                              label={
                                <FormattedLabel id="roadNameMr" required />
                              }
                              error={!!errors.roadNameMr}
                              helperText={
                                errors?.roadNameMr
                                  ? errors.roadNameMr.message
                                  : null
                              }
                            />
                          </Box>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sm={4}
                          md={4}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <FormControl
                            variant="outlined"
                            size="small"
                            sx={{ width: "90%" }}
                            error={errors.moduleId}
                          >
                            <InputLabel id="demo-simple-select-outlined-label">
                              <FormattedLabel id="moduleName" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  label={<FormattedLabel id="moduleName" />}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                >
                                  {applications &&
                                    applications.map(
                                      (ApplicationNameKey, index) => (
                                        <MenuItem
                                          key={index}
                                          value={ApplicationNameKey.id}
                                        >
                                          {language == "en"
                                            ? ApplicationNameKey.applicationNameEng
                                            : ApplicationNameKey.applicationNameMr}
                                        </MenuItem>
                                      )
                                    )}
                                </Select>
                              )}
                              name="moduleId"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.moduleId
                                ? errors.moduleId.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>

                      <Grid container sx={{ padding: "10px" }}>
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
                            size="small"
                            variant="outlined"
                            color="success"
                            type="submit"
                            endIcon={<Save />}
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
                            size="small"
                            variant="outlined"
                            color="primary"
                            endIcon={<Clear />}
                            onClick={cancellButton}
                          >
                            <FormattedLabel id="clear" />
                          </Button>
                        </Grid>
                        <Grid
                          xs={4}
                          item
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={onBack}
                            endIcon={<ExitToApp />}
                          >
                            <FormattedLabel id="exit" />
                          </Button>
                        </Grid>
                      </Grid>
                    </div>
                  </Slide>
                )}

                <Grid
                  container
                  style={{
                    padding: "10px",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <Button
                    variant="contained"
                    endIcon={<AddIcon />}
                    type="primary"
                    size="small"
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

                <Box style={{ height: "auto", overflow: "auto" }}>
                  <DataGrid
                    components={{ Toolbar: GridToolbar }}
                    componentsProps={{
                      toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                      },
                    }}
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
                      getAllRoadName(data.pageSize, _data);
                    }}
                    onPageSizeChange={(_data) => {
                      // updateData("page", 1);
                      getAllRoadName(_data, data.page);
                    }}
                  />
                </Box>
              </form>
            </FormProvider>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Index;
