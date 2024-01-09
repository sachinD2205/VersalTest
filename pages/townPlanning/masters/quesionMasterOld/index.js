import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
// import urls from "../../../../URLS/urls";

import sweetAlert from "sweetalert";
import styles from "../view.module.css";
// import Transliteration from "../../../components/common/linguosol/transliteration";
import urls from "../../../../URLS/urls";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  const user = useSelector((state) => state?.user.user);
  const language = useSelector((state) => state?.labels.language);

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
  let schema = yup.object().shape({
    questionEng: yup.string().required("Question Eng is Required !!!"),
    questionMr: yup.string().required("Question Mar is Required !!!"),
    // questionType: yup.string().required(" Question Type is Required !!"),
    answerType: yup.string().required(" Answer Type is Required !!"),
    // application: yup
    //   .string()
    //   .nullable()
    //   .required(" Application Name is Required !!"),
    serviceId: yup.string().nullable().required(" Service Name is Required !!"),
  });

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
  const [applications, setApplications] = useState([]);
  const [services, setServices] = useState([]);
  // useEffect(() => {
  //   getApplicationMaster();
  // }, []);

  useEffect(() => {
    getServiceMaster();
  }, []);

  useEffect(() => {
    getQuestionMaster();
  }, [applications, services]);

  // const getApplicationMaster = () => {
  //   axios.get(`${urls.BaseURL}/application/getAll`).then((r) => {
  //     setApplications(
  //       r.data.application.map((row) => ({
  //         id: row.id,
  //         applicationNameEng: row.applicationNameEng,
  //         applicationNameMr: row.applicationNameMr,
  //       }))
  //     );
  //   });
  // };

  const getServiceMaster = () => {
    // axios.get(`${urls.BaseURL}/service/getAll`).then((r) => {
    axios
      .get(
        `${urls.BaseURL}/service/getAllServiceByApplication?applicationId=3`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((r) => {
        setServices(
          r.data.service.map((row) => ({
            id: row.id,
            service: row.serviceName,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // Get Table - Data
  const getQuestionMaster = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc",
  ) => {
    axios
      .get(`${urls.TPURL}/master/siteVisitQuestions/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        let result = res.data.siteVisitQuestionsDaoList;
        console.log("ssssssss", result);
        let _res = result.map((r, i) => {
          return {
            id: r.id,
            srNo: i + 1,
            questionEng: r.questionEng,
            questionMr: r.questionMr,
            // questionType: r.questionType,
            answerType: r.answerType,
            serviceId: r.serviceId,
            serviceName: services.find((obj) => obj?.id === r.serviceId)
              ?.service,
            application: r.application,
            // applicationNameEng: applications.find(
            //   (obj) => obj?.id === r.application
            // )?.applicationNameEng,
            //   applicationNameMr: applications.find(
            //     (obj) => obj?.id === r.application
            //   )?.applicationNameMr,
            activeFlag: r.activeFlag,
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
      .catch((error) => {
        callCatchMethod(error, language);
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
  const onSubmitForm = (data) => {
    console.log("oooooooo", data);
    axios
      .post(`${urls.TPURL}/master/siteVisitQuestions/save`, data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          if (res.data?.errors?.length > 0) {
            res.data?.errors?.map((x) => {
              if (x.field == "questionEng") {
                setError("questionEng", { message: x.code });
              } else if (x.field == "questionMr") {
                setError("questionMr", { message: x.code });
              }
            });
          } else {
            data.id
              ? sweetAlert(
                  "Updated!",
                  "Record Updated successfully !",
                  "success",
                )
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            getQuestionMaster();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
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
  //     axios.delete(`${urls.BaseURL}/question/discard/${value}`).then((res) => {
  //       if (res.status == 226) {
  //         if (willDelete) {
  //           swal("Record is Successfully Deleted!", {
  //             icon: "success",
  //           });
  //         } else {
  //           swal("Record is Safe");
  //         }
  //         getQuestionMaster();
  //         setButtonInputState(false);
  //       }
  //     });
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
            .post(`${urls.CFCURL}/master/question/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deactivated!", {
                  icon: "success",
                });

                getQuestionMaster();
                setButtonInputState(false);
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
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
            .post(`${urls.CFCURL}/master/question/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully activated!", {
                  icon: "success",
                });

                getQuestionMaster();
                setButtonInputState(false);
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
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
    questionEng: "",
    questionMr: "",
    // questionType: "",
    answerType: "",
    application: null,
    serviceId: null,
  };

  // Reset Values Exit
  const resetValuesExit = {
    questionEng: "",
    questionMr: "",
    // questionType: "",
    answerType: "",
    application: null,
    serviceId: null,
    id: null,
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.4,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "questionEng",
      headerName: <FormattedLabel id="questionEn" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "questionMr",
      headerName: <FormattedLabel id="questionMr" />,
      flex: 1,
      headerAlign: "center",
    },

    {
      field: "answerType",
      headerName: <FormattedLabel id="answerType" />,
      flex: 1,
      headerAlign: "center",
    },
    // {
    //   field: "applicationNameEng",
    //   headerName: <FormattedLabel id="applicationName" />,
    //   flex: 0.6,
    //   headerAlign: "center",
    // },
    {
      field: "serviceName",
      headerName: <FormattedLabel id="serviceName" />,
      flex: 0.6,
      headerAlign: "center",
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 0.4,
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            {params.row.activeFlag == "Y" ? (
              <IconButton
                //   disabled={editButtonInputState && params.row.activeFlag === "N" ? false : true}
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
            ) : (
              <Tooltip sx={{ margin: "8px" }}>
                <EditIcon style={{ color: "gray" }} disabled={true} />
              </Tooltip>
            )}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setSlideChecked(true);
                setButtonInputState(true);
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
      <div
        style={{
          // backgroundColor: "#0084ff",
          backgroundColor: "#757ce8",
          color: "white",
          fontSize: 19,
          padding: "10px",
          display: "flex",
          justifyContent: "center",
          borderRadius: 100,
        }}
      >
        <FormattedLabel id="questionMaster" />
      </div>
      <Paper>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <div>
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
                          alignItems: "center",
                        }}
                      >
                        <Transliteration
                          variant={"outlined"}
                          _key={"questionEng"}
                          labelName={"questionEng"}
                          fieldName={"questionEng"}
                          updateFieldName={"questionMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={<FormattedLabel id="questionEn" required />}
                          error={!!errors.questionEng}
                          helperText={
                            errors?.questionEng
                              ? errors.questionEng.message
                              : null
                          }
                        />
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
                          alignItems: "center",
                        }}
                      >
                        <Transliteration
                          variant={"outlined"}
                          _key={"questionMr"}
                          labelName={"questionMr"}
                          fieldName={"questionMr"}
                          updateFieldName={"questionEng"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          label={<FormattedLabel id="questionMr" required />}
                          error={!!errors.questionMr}
                          helperText={
                            errors?.questionMr
                              ? errors.questionMr.message
                              : null
                          }
                        />
                      </Grid>
                    </Grid>
                    <Grid container style={{ padding: "10px" }}>
                      <Grid
                        xs={12}
                        sm={4}
                        md={4}
                        lg={4}
                        xl={4}
                        item
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: "90%" }}
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="answerType" />}
                          variant="outlined"
                          {...register("answerType")}
                          error={!!errors.answerType}
                          helperText={
                            errors?.answerType
                              ? errors.answerType.message
                              : null
                          }
                        />
                      </Grid>
                      {/* <Grid
                        xs={12}
                        sm={4}
                        md={4}
                        lg={4}
                        xl={4}
                        item
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          variant="outlined"
                          sx={{ width: "90%" }}
                          size="small"
                          error={!!errors.application}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="applicationName" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="applicationName" />}
                              >
                                {applications &&
                                  applications.map((application, index) => {
                                    return (
                                      <MenuItem
                                        key={index}
                                        value={application.id}
                                      >
                                        {application.applicationNameEng}
                                      </MenuItem>
                                    );
                                  })}
                              </Select>
                            )}
                            name="application"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.application
                              ? errors.application.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid> */}
                      <Grid
                        xs={12}
                        sm={4}
                        md={4}
                        lg={4}
                        xl={4}
                        item
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          variant="outlined"
                          sx={{ width: "90%" }}
                          error={!!errors.serviceId}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="serviceName" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="serviceName" />}
                              >
                                {services &&
                                  services.map((service, index) => (
                                    <MenuItem key={index} value={service.id}>
                                      {service.service}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="serviceId"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.serviceId
                              ? errors.serviceId.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      className={styles.feildres}
                      sx={{ padding: "10px" }}
                    >
                      <Grid
                        item
                        xs={4}
                        sx={{ display: "flex", justifyContent: "end" }}
                      >
                        <Button
                          size="small"
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
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                        >
                          <FormattedLabel id="clear" />
                        </Button>
                      </Grid>
                      <Grid item xs={4}>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitButton()}
                        >
                          <FormattedLabel id="exit" />
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                </form>
              </FormProvider>
            </div>
          </Slide>
        )}

        <Grid
          container
          sx={{ padding: "10px", display: "flex", justifyContent: "end" }}
        >
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            size="small"
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
        <Box style={{ overflowX: "scroll", display: "flex" }}>
          <DataGrid
            sx={{
              backgroundColor: "white",
              // overflowY: "scroll",

              "& .MuiDataGrid-virtualScrollerContent": {},
              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#556CD6",
                color: "white",
              },

              "& .MuiDataGrid-cell:hover": {
                color: "primary.main",
              },
            }}
            getRowId={(row) => row.srNo}
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
              getQuestionMaster(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              // updateData("page", 1);
              getQuestionMaster(_data, data.page);
            }}
          />
        </Box>
      </Paper>
    </>
  );
};

export default Index;
