// import { yupResolver } from "@hookforpostm/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputBase,
  InputLabel,
  Paper,
  Slide,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {
  DataGrid,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import styles from "../court/view.module.css
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css";
import schema from "../../../../containers/schema/securityManagementSystemSchema/masters/otherDepartment";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { GridToolbar } from "@mui/x-data-grid";
import { border } from "@mui/system";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
// import { yupResolver } from "@hookform/resolvers/yup";
// import urls from "../../../../URLS/urls";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import Loader from "../../../../containers/Layout/components/Loader";
import { yupResolver } from "@hookform/resolvers/yup";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   methods,
  //   reset,
  //   watch,
  //   formState: { errors },
  // } = useForm({
  //   criteriaMode: "all",
  //   resolver: yupResolver(schema(language)),
  //   mode: "onChange",
  // });

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

  const [loading, setLoading] = useState(false);

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const router = useRouter();

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );

  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

  let user = useSelector((state) => state.user.user);

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  console.log("authority", authority);

  useEffect(() => {
    getOtherDepartments();
  }, [fetchData]);

  // Get Table - Data
  const getOtherDepartments = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    setLoading(true);
    axios
      .get(`${urls.SMURL}/mstOtherDepartment/getAll`, {
        params: {
          sortKey: "id",
          sortDir: "dsc",
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log(";r", r);
        let result = r.data.mstOtherDepartmentList;
        console.log("result", result);

        let _res = result?.map((r, i) => {
          console.log("44");
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: _pageSize * _pageNo + i + 1,
            otherDepartment: r.otherDepartment,
            otherDepartmentMr: r.otherDepartmentMr,

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
        setLoading(false);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const onSubmitForm = (fromData) => {
    console.log("fromData", fromData);
    // Save - DB
    let _body = {
      ...fromData,
      // activeFlag: fromData.activeFlag,
      activeFlag: btnSaveText === "Update" ? fromData.activeFlag : null,
    };
    if (btnSaveText === "Save") {
      const tempData = axios
        .post(`${urls.SMURL}/mstOtherDepartment/save`, _body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert("Saved!", "Record Saved successfully !", "success");

            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          setLoading(false);
          callCatchMethod(err, language);
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      const tempData = axios
        .post(`${urls.SMURL}/mstOtherDepartment/save`, _body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("res", res);
          if (res.status == 201) {
            fromData.id
              ? sweetAlert(
                  "Updated!",
                  "Record Updated successfully !",
                  "success"
                )
              : sweetAlert("Saved!", "Record Saved successfully !", "success");
            getOtherDepartments();
            // setButtonInputState(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          setLoading(false);
          callCatchMethod(err, language);
        });
    }
  };

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    console.log("value", value, "_activeFlag", _activeFlag);
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: language === "en" ? "Inactivate?" : "निष्क्रिय करायचे?",
        text:
          language == "en"
            ? "Are you sure you want to inactivate this Record?"
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.SMURL}/mstOtherDepartment/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                language == "en"
                  ? sweetAlert({
                      title: "Inactivated!",
                      text: "Record is Successfully Inactivated!",
                      icon: "success",
                      button: "Ok",
                    })
                  : sweetAlert({
                      title: "निष्क्रिय केले!",
                      text: "रेकॉर्ड यशस्वीरित्या निष्क्रिय केले आहे!",
                      icon: "success",
                      button: "Ok",
                    });
                getOtherDepartments();
                // setButtonInputState(false);
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              setLoading(false);
              callCatchMethod(err, language);
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
      const textAlert =
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
            .post(`${urls.SMURL}/mstOtherDepartment/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                language == "en"
                  ? sweetAlert({
                      title: "Activate!",
                      text: "The record is Successfully Activated!",
                      icon: "success",
                      button: "Ok",
                    })
                  : sweetAlert({
                      title: "सक्रिय!",
                      text: "रेकॉर्ड यशस्वीरित्या सक्रिय केला गेला आहे!",
                      icon: "success",
                      button: "Ok",
                    });
                // getPaymentRate();
                getOtherDepartments();
                // setButtonInputState(false);
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              setLoading(false);
              callCatchMethod(err, language);
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
    otherDepartment: "",
    otherDepartmentMr: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    otherDepartment: "",
    otherDepartmentMr: "",
    id: null,
  };

  const columns = [
    { field: "srNo", headerName: <FormattedLabel id="srNo" />, flex: 0.5 },
    {
      field: language === "en" ? "otherDepartment" : "otherDepartment",

      headerName: <FormattedLabel id="otherDepartment" />,
      flex: 1,
    },
    {
      field: language === "en" ? "otherDepartmentMr" : "otherDepartmentMr",

      headerName: <FormattedLabel id="otherDepartmentMr" />,
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
          <Box>
            {authority?.includes("HOD") && (
              <>
                <IconButton
                  disabled={editButtonInputState}
                  onClick={() => {
                    setBtnSaveText("Update"),
                      setID(params.row.id),
                      setIsOpenCollapse(true),
                      setSlideChecked(true);
                    // setButtonInputState(true);
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
            )}
          </Box>
        );
      },
    },
  ];
  // Row

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

  return (
    <Paper
      elevation={8}
      variant="outlined"
      sx={{
        border: 1,
        borderColor: "grey.500",
        marginLeft: "10px",
        marginRight: "10px",
        marginTop: "10px",
        marginBottom: "60px",
        padding: 1,
      }}
    >
      <Box>
        <BreadcrumbComponent />
      </Box>

      <Box
        sx={{
          backgroundColor: "#556CD6",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 30,
          padding: "5px",
          // background:
          //   "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <Typography
          style={{
            color: "white",
            fontSize: "19px",
          }}
        >
          <strong>
            {" "}
            <FormattedLabel id="otherDepartmentMaster" />
          </strong>
        </Typography>
      </Box>

      <Box>
        {loading ? (
          <Loader />
        ) : (
          <>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                {isOpenCollapse && (
                  <Slide
                    direction="down"
                    in={slideChecked}
                    mountOnEnter
                    unmountOnExit
                  >
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={6}
                        xl={6}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: "90%",
                          }}
                        >
                          <Transliteration
                            variant={"outlined"}
                            _key={"otherDepartment"}
                            labelName={"otherDepartment"}
                            fieldName={"otherDepartment"}
                            updateFieldName={"otherDepartmentMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            label={
                              <FormattedLabel id="otherDepartment" required />
                            }
                            error={!!errors.otherDepartment}
                            helperText={
                              errors?.otherDepartment
                                ? errors.otherDepartment.message
                                : null
                            }
                          />
                        </Box>
                        {/* <TextField
                          label={<FormattedLabel id="otherDepartment" />}
                          id="standard-basic"
                          variant="standard"
                          {...register("otherDepartment")}
                          error={!!errors.otherDepartment}
                          InputProps={{ style: { fontSize: 18 } }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink:
                              (watch("otherDepartment") ? true : false) ||
                              (router.query.otherDepartment ? true : false),
                          }}
                          helperText={
                            errors?.otherDepartment
                              ? errors?.otherDepartment.message
                              : null
                          }
                        /> */}
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={6}
                        xl={6}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: "90%",
                          }}
                        >
                          <Transliteration
                            variant={"outlined"}
                            _key={"otherDepartmentMr"}
                            labelName={"otherDepartmentMr"}
                            fieldName={"otherDepartmentMr"}
                            updateFieldName={"otherDepartment"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            label={
                              <FormattedLabel id="otherDepartmentMr" required />
                            }
                            error={!!errors.otherDepartmentMr}
                            helperText={
                              errors?.otherDepartmentMr
                                ? errors.otherDepartmentMr.message
                                : null
                            }
                          />
                        </Box>
                        {/* <TextField
                          label={<FormattedLabel id="otherDepartmentMr" />}
                          id="standard-basic"
                          variant="standard"
                          {...register("otherDepartmentMr")}
                          error={!!errors.otherDepartmentMr}
                          InputProps={{ style: { fontSize: 18 } }}
                          InputLabelProps={{
                            style: { fontSize: 15 },
                            //true
                            shrink:
                              (watch("otherDepartmentMr") ? true : false) ||
                              (router.query.otherDepartmentMr ? true : false),
                          }}
                          helperText={
                            errors?.otherDepartmentMr
                              ? errors?.otherDepartmentMr.message
                              : null
                          }
                        /> */}
                      </Grid>

                      <Grid
                        container
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          padding: "10px",
                        }}
                      >
                        <Grid
                          item
                          xs={4}
                          sx={{ display: "flex", justifyContent: "end" }}
                        >
                          <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            endIcon={<SaveIcon />}
                            size="small"
                          >
                            {btnSaveText === "Update" ? (
                              <FormattedLabel id="update" />
                            ) : (
                              <FormattedLabel id="save" />
                            )}
                          </Button>
                        </Grid>
                        <Grid
                          item
                          xs={4}
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            endIcon={<ClearIcon />}
                            onClick={() => cancellButton()}
                            size="small"
                          >
                            <FormattedLabel id="clear" />
                          </Button>
                        </Grid>
                        <Grid item xs={4}>
                          <Button
                            variant="contained"
                            color="error"
                            endIcon={<ExitToAppIcon />}
                            onClick={() => exitButton()}
                            size="small"
                          >
                            <FormattedLabel id="exit" />
                          </Button>
                        </Grid>
                      </Grid>
                      {/* </div> */}
                    </Grid>
                  </Slide>
                )}
              </form>
            </FormProvider>

            {authority?.includes("HOD") && (
              <div className={styles.addbtn}>
                <Button
                  variant="contained"
                  endIcon={<AddIcon />}
                  // type='primary'
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
              </div>
            )}
            <DataGrid
              // disableColumnFilter
              // disableColumnSelector
              // disableToolbarButton
              // disableDensitySelector
              components={{ Toolbar: GridToolbar }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                  // printOptions: { disableToolbarButton: true },
                  // disableExport: true,
                  // disableToolbarButton: true,
                  // csvOptions: { disableToolbarButton: true },
                },
              }}
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
                getOtherDepartments(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                console.log("222", _data);
                // updateData("page", 1);
                getOtherDepartments(_data, data.page);
              }}
            />
          </>
        )}
      </Box>
    </Paper>
  );
};

export default Index;
