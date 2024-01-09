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
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import schema from "../../../containers/schema/common/DocumentMaster";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import styles from "../../../styles/[documentMaster].module.css";
import urls from "../../../URLS/urls";
import BasicLayout from "../../../containers/Layout/BasicLayout";
import Transliteration from "../../../components/common/linguosol/transliteration";
import Loader from "../../../containers/Layout/components/Loader";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../../util/util";

const DocumentMaster = () => {
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

  const [laoding, setLoading] = useState(false);
  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();
  const token = useSelector((state) => state.user.user.token);

  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState(0);
  const [applications, setApplications] = useState([]);
  const [services, setServices] = useState([]);
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

  useEffect(() => {
    getApplication();
    getServices();
    getDocumentType();
  }, []);

  useEffect(() => {
    getAgeProofDocument();
  }, [documentTypes, applications, services]);

  // get document type
  const [documentTypes, setDocumentTypes] = useState([]);

  const getDocumentType = () => {
    axios
      .get(`${urls.CFCURL}/master/documentType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("application res", res);
        setDocumentTypes(res.data.documentType);
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getApplication = () => {
    axios
      .get(`${urls.CFCURL}/master/application/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((res) => {
        console.log("applications 22", res);

        setApplications(res.data.application);
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getServices = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((res) => {
        console.log("service res", res);

        setServices(res.data.service);
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getAgeProofDocument = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setLoading(true);
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.CFCURL}/master/documentMaster/getAll`, {
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
        setLoading(false);
        console.log("resss", res);
        let result = res.data.documentMaster;
        let _res = result.map((val, i) => {
          return {
            activeFlag: val.activeFlag,
            srNo: i + 1 + _pageNo * _pageSize,

            application: val.application,
            // applicationCol:
            //   applications[val.application] &&
            //   applications[val.application].applicationNameEng,
            applicationCol: applications?.find(
              (obj) => obj.id == val.application
            )?.applicationNameEng,
            documentChecklistEn: val.documentChecklistEn,

            documentChecklistMr: val.documentChecklistMr,

            id: val.id,
            service: val.service,
            // serviceName: services[val.service] && services[val.service].serviceName,
            serviceName: services.find((f) => f.id == val.service)?.serviceName,

            typeOfDocument: val.typeOfDocument,
            typeOfDocumentCol: documentTypes.find(
              (f) => f.id == val.typeOfDocument
            )?.documentTypeEng,

            // typeOfDocumentMr: val.typeOfDocumentMr ,
            status: val.activeFlag === "Y" ? "Active" : "Inactive",
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
        setLoading(false);
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
            .post(`${urls.CFCURL}/master/documentMaster/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                swal("Record is Successfully Deactivated!", {
                  icon: "success",
                });
                getAgeProofDocument();
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
            .post(`${urls.CFCURL}/master/documentMaster/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("act res", res);
              if (res.status == 201) {
                swal("Record is Successfully activated!", {
                  icon: "success",
                });
                getAgeProofDocument();
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
    application: "",
    service: "",
    documentChecklistEn: "",
    documentChecklistMr: "",
    typeOfDocument: "",
    // typeOfDocumentMr: "",
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
    const finalBodyForApi = {
      ...formData,
      application: Number(formData.application),
      service: Number(formData.service),
      typeOfDocument: Number(formData.typeOfDocument),

      // activeFlag
      // activeFlag: btnSaveText === "Update" ? null : formData.activeFlag,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(`${urls.CFCURL}/master/documentMaster/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("save data", res);
        if (res.status == 201) {
          if (res.data?.errors?.length > 0) {
            res.data?.errors?.map((x) => {
              if (x.field == "documentChecklistEn") {
                setError("documentChecklistEn", { message: x.code });
              } else if (x.field == "documentChecklistMr") {
                setError("documentChecklistMr", { message: x.code });
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
            getAgeProofDocument();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            getServices();
          }
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const resetValuesExit = {
    application: "",
    service: "",
    documentChecklistEn: "",
    documentChecklistMr: "",
    typeOfDocument: "",
    // typeOfDocumentMr: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
      maxWidth: 100,
    },
    {
      field: "applicationCol",
      headerName: <FormattedLabel id="application" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "serviceName",
      headerName: <FormattedLabel id="service" />,
      // type: "number",
      flex: 1,
      // minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "documentChecklistEn",
      // headerName: "Document Checklist(In English)",
      headerName: <FormattedLabel id="documentChecklistEn" />,
      // type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "documentChecklistMr",
      headerName: <FormattedLabel id="documentChecklistMr" />,
      // type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "typeOfDocumentCol",
      headerName: <FormattedLabel id="typeOfDocument" />,
      // type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    // {
    //     field: "typeOfDocumentMr",
    //     headerName: "Type Of Document(In Marathi)",
    //     // type: "number",
    //     flex: 1,
    //     align: "center",
    //     headerAlign: "center",
    //   },
    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      // type: "number",
      flex: 1,
      align: "center",
      headerAlign: "center",
      maxWidth: 100,
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
        <FormattedLabel id="documentMaster" />
      </div>
      {laoding ? (
        <Loader />
      ) : (
        <>
          <Paper>
            {isOpenCollapse && (
              <Slide
                direction="down"
                in={slideChecked}
                mountOnEnter
                unmountOnExit
              >
                <div>
                  <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmitForm)}>
                      <Grid
                        container
                        style={{ padding: "10px", paddingTop: "40px" }}
                      >
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
                          <FormControl
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ width: "90%" }}
                            error={!!errors.application}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="application" />{" "}
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  //   sx={{ width: 250 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  // label="Module Name"
                                  label={<FormattedLabel id="application" />}
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
                          <FormControl
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ width: "90%" }}
                            error={!!errors.service}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="service" />{" "}
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  //   sx={{ width: 250 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  // label="Module Name"
                                  label={<FormattedLabel id="serviceName" />}
                                >
                                  {services &&
                                    services.map((serviceName, index) => {
                                      return (
                                        <MenuItem
                                          key={index}
                                          value={serviceName.id}
                                        >
                                          {serviceName.serviceName}
                                        </MenuItem>
                                      );
                                    })}
                                </Select>
                              )}
                              name="service"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.service ? errors.service.message : null}
                            </FormHelperText>
                          </FormControl>
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
                          {" "}
                          <Box sx={{ width: "90%" }}>
                            <Transliteration
                              variant={"outlined"}
                              _key={"documentChecklistEn"}
                              labelName={"documentChecklistEn"}
                              fieldName={"documentChecklistEn"}
                              updateFieldName={"documentChecklistMr"}
                              sourceLang={"eng"}
                              targetLang={"mar"}
                              label={
                                <FormattedLabel
                                  id="documentChecklistEn"
                                  required
                                />
                              }
                              error={!!errors.documentChecklistEn}
                              helperText={
                                errors?.documentChecklistEn
                                  ? errors.documentChecklistEn.message
                                  : null
                              }
                            />
                          </Box>
                          {/* <TextField
                    sx={{ width: "80%" }}
                    id="standard-basic"
                    label={<FormattedLabel id="documentChecklistEn" />}
                    variant="outlined"
                    size="small"
                    {...register("documentChecklistEn")}
                    error={!!errors.documentChecklistEn}
                    helperText={
                      errors?.documentChecklistEn
                        ? errors.documentChecklistEn.message
                        : null
                    }
                  /> */}
                        </Grid>
                      </Grid>

                      <Grid container style={{ padding: "10px" }}>
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
                          {" "}
                          <Box sx={{ width: "90%" }}>
                            <Transliteration
                              variant={"outlined"}
                              _key={"documentChecklistMr"}
                              labelName={"documentChecklistMr"}
                              fieldName={"documentChecklistMr"}
                              updateFieldName={"documentChecklistEn"}
                              sourceLang={"mar"}
                              targetLang={"eng"}
                              label={
                                <FormattedLabel
                                  id="documentChecklistMr"
                                  required
                                />
                              }
                              error={!!errors.documentChecklistMr}
                              helperText={
                                errors?.documentChecklistMr
                                  ? errors.documentChecklistMr.message
                                  : null
                              }
                            />
                          </Box>
                          {/* <TextField
                    sx={{ width: "80%" }}
                    id="standard-basic"
                    label={<FormattedLabel id="documentChecklistMr" />}
                    variant="outlined"
                    size="small"
                    {...register("documentChecklistMr")}
                    error={!!errors.documentChecklistMr}
                    helperText={
                      errors?.documentChecklistMr
                        ? errors.documentChecklistMr.message
                        : null
                    }
                  /> */}
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
                          <FormControl
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ width: "90%" }}
                            error={!!errors.typeOfDocument}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="typeOfDocument" />{" "}
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  //   sx={{ width: 250 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  // label="Module Name"
                                  label={<FormattedLabel id="typeOfDocument" />}
                                >
                                  {documentTypes &&
                                    documentTypes.map((doc, index) => {
                                      return (
                                        <MenuItem key={index} value={doc.id}>
                                          {doc.documentTypeEng}
                                        </MenuItem>
                                      );
                                    })}
                                </Select>
                              )}
                              name="typeOfDocument"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.typeOfDocument
                                ? errors.typeOfDocument.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>
                      {/* <Grid container style={{ padding: "10px" }}>
               
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
sx={{width: "80%"}}
                    size="small"
                    style={{ backgroundColor: "white" }}
                    id="outlined-basic"
                    // label="Type Of Document(In Marathi)"
                    label={<FormattedLabel id="typeOfDocument" />}
                    variant="outlined"
                    {...register("typeOfDocumentMr")}
                    error={!!errors.typeOfDocumentMr}
                    helperText={
                      errors?.typeOfDocumentMr
                        ? errors.typeOfDocumentMr.message
                        : null
                    }
                  />
                </Grid>
              </Grid> */}

                      <Grid
                        container
                        style={{ padding: "10px", paddingTop: "40px" }}
                      >
                        <Grid
                          item
                          xs={4}
                          style={{
                            display: "flex",
                            justifyContent: "end",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            size="small"
                            type="submit"
                            variant="outlined"
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
                            size="small"
                            variant="outlined"
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
                            alignItems: "center",
                          }}
                        >
                          <Button
                            size="small"
                            variant="outlined"
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
                  </FormProvider>
                </div>
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
            </Grid>

            <Box style={{ height: "auto", overflow: "auto" }}>
              <DataGrid
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                  },
                }}
                components={{ Toolbar: GridToolbar }}
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
                autoHeight={data.pageSize}
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
                  getAgeProofDocument(data.pageSize, _data);
                }}
                onPageSizeChange={(_data) => {
                  console.log("222", _data);
                  // updateData("page", 1);
                  getAgeProofDocument(_data, data.page);
                }}
              />
            </Box>
          </Paper>
        </>
      )}
    </>
  );
};

export default DocumentMaster;
