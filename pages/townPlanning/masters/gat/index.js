import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
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
  Divider,
  Grid,
  IconButton,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useState } from "react";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useSelector } from "react-redux";

let schema = yup.object().shape({
  gatNameEn: yup
    .string()

    .required(<FormattedLabel id="authorityNameVE" />),
  gisId: yup
    .string()
    .nullable()
    .required(<FormattedLabel id="gisidV" />),
  gatNameMr: yup.string().required(<FormattedLabel id="authorityNameVM" />),
});

const GatMaster = () => {
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

  let isDisabled = false;
  const [runAgain, setRunAgain] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [gatTable, setGatTable] = useState([]);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();

  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [buttonInputState, setButtonInputState] = useState();

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
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getGatMasters();
  }, []);

  const getGatMasters = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc",
  ) => {
    axios
      .get(`${urls.TPURL}/master/mstGat/getAll`, {
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
        console.log("Table data: ", res);

        let result = res.data.mstGat;
        let _res = result.map((val, i) => {
          return {
            activeFlag: val.activeFlag,
            srNo: Number(_pageNo + "0") + i + 1,
            gisId: val.gisId,
            gatNameEn: val.gatNameEn,
            gatNameMr: val.gatNameMr,
            id: val.id,

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
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const onSubmitForm = (formData) => {
    console.log("Form formData ", formData);

    const bodyForAPI = {
      ...formData,
      // activeFlag: btnSaveText === "Update" ? null : null,
    };

    axios
      .post(`${urls.TPURL}/master/mstGat/save`, bodyForAPI, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        console.log("response", response);
        if (response.status === 200) {
          if (response.data?.errors?.length > 0) {
            response.data?.errors?.map((x) => {
              if (x.field == "gatNameMr") {
                setError("gatNameMr", {
                  message: x.code,
                });
              } else if (x.field == "gatNameEn") {
                setError("gatNameEn", {
                  message: x.code,
                });
              }
            });
          } else {
            if (formData.id) {
              sweetAlert(
                language == "en" ? "Updated!" : "अपडेट केले!",
                language == "en"
                  ? "Record Updated successfully !"
                  : " यशस्वीरित्या अपडेट केले गेले",
                "success",
              );
            } else {
              sweetAlert(
                language == "en" ? "Saved!" : "जतन केले!",
                language == "en"
                  ? "Record Saved successfully! "
                  : "रेकॉर्ड यशस्वीरित्या जतन केले!",
                "success",
              );
            }
            getGatMasters();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            // reset({
            //   ...resetValuesCancell,
            //   id: null,
            // });
          }
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const deleteById = (value, _activeFlag) => {
    console.log("value, _activeFlag", value, _activeFlag);
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      const textAlert =
        language == "en"
          ? "Are you sure you want to inactivate this Record ?"
          : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता?";
      const title = language == "en" ? "Inactivate?" : "निष्क्रिय करा";
      sweetAlert({
        title: title,
        text: textAlert,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.TPURL}/master/mstGat/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                language == "en"
                  ? sweetAlert({
                      title: "Inactivate!",
                      text: "The record is Successfully Deleted!",
                      icon: "success",
                      button: "Ok",
                    })
                  : sweetAlert({
                      title: "निष्क्रिय करा!",
                      text: "रेकॉर्ड यशस्वीरित्या निष्क्रिय केला आहे!",
                      icon: "success",
                      button: "Ok",
                    });
                getGatMasters();
                setButtonInputState(false);
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            });
        } else if (willDelete == null) {
          language == "en"
            ? sweetAlert({
                title: "Cancel!",
                text: "Record is Successfully Cancel!!",
                icon: "success",
                button: "Ok",
              })
            : sweetAlert({
                title: "रद्द केले!",
                text: "रेकॉर्ड यशस्वीरित्या रद्द केले!",
                icon: "success",
                button: "ओके",
              });
        }
      });
    } else {
      language == "en"
        ? "Are you sure you want to activate this Record ? "
        : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता?";
      const title = language == "en" ? "Activate?" : "सक्रिय करायचे?";
      sweetAlert({
        title: title,
        text: textAlert,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.TPURL}/master/mstGat/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            // .post(`${urls.CFCURL}/master/gatMaster/save`, body)
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                language == "en"
                  ? sweetAlert({
                      title: "Activate!",
                      text: "The record is Successfully Activated!",
                      icon: "success",
                      button: "Ok",
                    })
                  : sweetAlert({
                      title: "सक्रिय केला!",
                      text: "रेकॉर्ड यशस्वीरित्या सक्रिय केला गेला आहे!",
                      icon: "success",
                      button: "Ok",
                    });
                getGatMasters();
                setButtonInputState(false);
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            });
        } else if (willDelete == null) {
          language == "en"
            ? sweetAlert({
                title: "Cancel!",
                text: "Record is Successfully Cancel!!",
                icon: "success",
                button: "Ok",
              })
            : sweetAlert({
                title: "रद्द केले!",
                text: "रेकॉर्ड यशस्वीरित्या रद्द केले!",
                icon: "success",
                button: "ओके",
              });
        }
      });
    }
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.4,
      headerAlign: "center",
    },
    {
      field: "gatNameEn",
      headerName: <FormattedLabel id="gatName" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "gatNameMr",
      headerName: <FormattedLabel id="gatNameMr" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "gisId",
      headerName: <FormattedLabel id="gisLocation" />,
      flex: 1,
      headerAlign: "center",
    },
    // {
    //   field: "remark",
    //   headerName: <FormattedLabel id="remark" />,
    //   flex: 1,
    //   headerAlign: "center",
    // },
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
      flex: 0.6,
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

  // Reset Values Cancell
  const resetValuesCancell = {
    gisId: null,
    gatNameEn: "",
    remark: "",
  };

  const resetValuesExit = {
    gisId: null,
    gatNameEn: "",
    remark: "",
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
    });
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

  return (
    <>
      <Box>
        <BreadcrumbComponent />
      </Box>
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
          alignItems: "center",
        }}
      >
        <FormattedLabel id="gatMaster" />
      </div>
      <Box>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
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
                      <Transliteration
                        variant={"outlined"}
                        _key={"gatNameEn"}
                        labelName={"gatNameEn"}
                        fieldName={"gatNameEn"}
                        updateFieldName={"gatNameMr"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        label={<FormattedLabel id="gatName" required />}
                        error={!!errors.gatNameEn}
                        helperText={
                          errors?.gatNameEn ? errors.gatNameEn.message : null
                        }
                      />
                      {/* <TextField
                    size="small"
                    style={{ backgroundColor: "white", width: "90%" }}
                    id="outlined-basic"
                    label={<FormattedLabel id="gatName" />}
                    variant="outlined"
                    {...register("gatNameEn")}
                    error={!!errors.gatNameEn}
                    helperText={
                      errors?.gatNameEn ? errors.gatNameEn.message : null
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
                      <Transliteration
                        variant={"outlined"}
                        _key={"gatNameMr"}
                        labelName={"gatNameMr"}
                        fieldName={"gatNameMr"}
                        updateFieldName={"gatNameEn"}
                        sourceLang={"mar"}
                        targetLang={"eng"}
                        label={<FormattedLabel id="gatNameMr" required />}
                        error={!!errors.gatNameMr}
                        helperText={
                          errors?.gatNameMr ? errors.gatNameMr.message : null
                        }
                      />
                      {/* <TextField
                        size="small"
                        style={{ backgroundColor: "white", width: "90%" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="gatNameMr" />}
                        variant="outlined"
                        {...register("gatNameMr")}
                        error={!!errors.gatNameMr}
                        helperText={
                          errors?.gatNameMr ? errors.gatNameMr.message : null
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
                      <TextField
                        size="small"
                        style={{ backgroundColor: "white", width: "90%" }}
                        id="outlined-basic"
                        label={<FormattedLabel id="gisLocation" />}
                        variant="outlined"
                        {...register("gisId")}
                        error={!!errors.gisId}
                        helperText={errors?.gisId ? errors.gisId.message : null}
                      />
                    </Grid>
                  </Grid>
                  {/* <Grid container sx={{ padding: "10px" }}>
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
                      <TextField
                        size="small"
                        style={{ backgroundColor: "white", width: "90%" }}
                        id="outlined-basic"
                        // label="Remark"
                        label={<FormattedLabel id="remark" />}
                        variant="outlined"
                        {...register("remark")}
                      />
                    </Grid>
                  </Grid> */}
                  <Grid container style={{ padding: "10px" }}>
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
                        type="submit"
                        variant="contained"
                        color="success"
                        size="small"
                        endIcon={<SaveIcon />}
                      >
                        <FormattedLabel id="save" />
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
                        color="primary"
                        endIcon={<ClearIcon />}
                        size="small"
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
            components={{ Toolbar: GridToolbar }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            sx={{
              overflowY: "scroll",
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
              getGatMasters(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getGatMasters(_data, data.page);
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default GatMaster;
