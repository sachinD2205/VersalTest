import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { Button, Paper, Slide, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Schema } from "../../../../containers/schema/fireBrigadeSystem/usageType";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { Box, Grid, Typography } from "@mui/material";
import { GridToolbar } from "@mui/x-data-grid";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import { useSelector } from "react-redux";
import {
  deleteConfirmation,
  recordDeleted,
  recordIsSafe,
  recordUpdated,
  saveConfirmation,
  saveRecord,
  updateConfirmation,
} from "../../../../containers/Layout/components/messages";
import Loader from "../../../../containers/Layout/components/Loader";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const language = useSelector((state) => state?.labels.language);
  const userToken = useGetToken();

  const router = useRouter();
  const methods = useForm({
    defaultValues: {},
    mode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(Schema(language)),
  });

  const {
    watch,
    setValue,
    getValues,
    register,
    handleSubmit,
    control,
    unregister,
    reset,
    formState: { errors },
  } = methods;

  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   methods,
  //   reset,
  //   formState: { errors },
  // } = useForm({
  //   criteriaMode: "all",
  //   resolver: yupResolver(schema),
  //   mode: "onChange",
  // });

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);

  //2 - loader
  const [loadderState, setLoadderState] = useState(false);

  // 3- Error Handling
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };
  useEffect(() => {
    getData();
  }, [fetchData]);

  // Get Table - Data
  const getData = () => {
    setLoadderState(true);
    axios
      .get(`${urls.FbsURL}/usageTypeMaster/getUsageTypeMasterData`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setLoadderState(false);
        setDataSource(res.data);
        console.log("OfDataSource", res.data);
      })
      .catch((error) => {
        setLoadderState(false);
        callCatchMethod(error, language);
      });
  };

  const onSubmitForm = (formData) => {
    setLoadderState(true);
    console.log("formData", formData);
    sweetAlert(
      formData.id ? updateConfirmation(language) : saveConfirmation(language)
    )
      .then((ok) => {
        setLoadderState(false);
        console.log("Hii", ok);
        if (ok) {
          console.log("hello");
          if (btnSaveText === "Save") {
            setLoadderState(true);
            const tempData = axios
              .post(
                `${urls.FbsURL}/usageTypeMaster/saveUsageTypeMaster`,
                formData,
                {
                  headers: {
                    Authorization: `Bearer ${userToken}`,
                  },
                }
              )
              .then((res) => {
                setLoadderState(false);
                if (res.status == 200 || res.status == 201) {
                  sweetAlert(saveRecord(language));
                  setButtonInputState(false);
                  setIsOpenCollapse(false);
                  setEditButtonInputState(false);
                  setDeleteButtonState(false);
                  setFetchData(tempData);
                  getData();
                  setSlideChecked(false);
                }
              });
          } else if (btnSaveText === "Update") {
            const body = {
              id: formData.id,
              activeFlag: formData.activeFlag,
              nameOfUsage: formData.nameOfUsage,
              nameOfUsageMr: formData.nameOfUsageMr,
              // nocname: formData.nOCName,
              // nocnameMr: formData.nOCNameMr,
            };
            const tempData = axios
              .post(
                `${urls.FbsURL}/usageTypeMaster/saveUsageTypeMaster`,
                body,
                {
                  headers: {
                    Authorization: `Bearer ${userToken}`,
                  },
                }
              )
              .then((res) => {
                setLoadderState(false);
                if (res.status == 200 || res.status == 201) {
                  console.log("33", res);
                  sweetAlert(recordUpdated(language));
                  setButtonInputState(false);
                  setIsOpenCollapse(false);
                  setEditButtonInputState(false);
                  setDeleteButtonState(false);
                  setFetchData(tempData);
                  getData();
                  setSlideChecked(false);
                }
              })
              .catch((error) => {
                setLoadderState(false);
                console.log("err", error);
                callCatchMethod(error, language);
              });
          }
        }
      })
      .catch((error) => {
        setLoadderState(false);
        // 7- Error handling
        callCatchMethod(error, language);
      });
  };

  const deleteById = async (value) => {
    sweetAlert(deleteConfirmation(language)).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `${urls.FbsURL}/usageTypeMaster/discardUsageTypeMaster/${value}`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          .then((res) => {
            if (res.status == 226 || res.status == 200) {
              sweetAlert(recordDeleted(language));
              getData();
              setButtonInputState(false);
            }
          })
          .catch((error) => {
            callCatchMethod(error, language);
          });
      } else if (willDelete == null || willDelete == false) {
        console.log("willDelete", willDelete);
        sweetAlert(recordIsSafe(language));
      }
    });
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
    nameOfUsage: "",
    nameOfUsageMr: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    nameOfUsage: "",
    nameOfUsageMr: "",
  };

  // Row
  const columns = [
    {
      field: "nameOfUsage",
      headerName: <FormattedLabel id="nameOfUsage" />,
      flex: 1,
    },
    {
      field: "nameOfUsageMr",
      headerName: <FormattedLabel id="nameOfUsageMr" />,
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
              className={styles.masterEditBtn}
              disabled={editButtonInputState}
              onClick={() => {
                setIsOpenCollapse(false),
                  setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                setEditButtonInputState(true);
                setDeleteButtonState(true);
                reset(params.row);
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              className={styles.masterDeleteBtn}
              disabled={deleteButtonInputState}
              onClick={() => deleteById(params.id)}
            >
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <>
      {/* 7- add loader */}
      {loadderState && <Loader />}

      {/*8-  Breadcrum  */}
      <BreadcrumbComponent />
      {isOpenCollapse && (
        <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
          <div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    paddingBottom: "20%",
                  }}
                >
                  <Paper
                    sx={{
                      margin: 1,
                      padding: 2,
                      backgroundColor: "#F5F5F5",
                    }}
                    elevation={5}
                  >
                    <Box className={styles.tableHead}>
                      <Box className={styles.feildHead}>
                        <FormattedLabel id="usageTypeMasterTitle" />
                      </Box>
                    </Box>

                    <br />
                    <br />

                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        {/* <TextField
                          autoFocus
                          sx={{ width: 250 }}
                          id="standard-basic"
                          variant="standard"
                          label={<FormattedLabel id="reasonOfFireEn" />}
                          {...register("reasonOfFire")}
                          error={!!errors.reasonOfFire}
                          helperText={
                            errors?.reasonOfFire
                              ? errors.reasonOfFire.message
                              : null
                          }
                        /> */}

                        <Transliteration
                          _key={"nameOfUsage"}
                          labelName={"nameOfUsage"}
                          fieldName={"nameOfUsage"}
                          updateFieldName={"nameOfUsageMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          // variant="standard"
                          label={<FormattedLabel id="nameOfUsage" required />}
                          InputLabelProps={{
                            shrink: watch("nameOfUsage") ? true : false,
                          }}
                          sx={{ width: "100%" }}
                          error={!!errors.nameOfUsage}
                          helperText={
                            errors?.nameOfUsage
                              ? errors.nameOfUsage.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "100%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="nameOfUsageMr" required />}
                          variant="standard"
                          {...register("nameOfUsageMr")}
                          InputLabelProps={{
                            shrink: watch("nameOfUsageMr") ? true : false,
                          }}
                          error={!!errors.nameOfUsageMr}
                          helperText={
                            errors?.nameOfUsageMr
                              ? errors.nameOfUsageMr.message
                              : null
                          }
                        />
                      </Grid>
                    </Grid>
                    <br />
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
                          {btnSaveText == "Update" ? (
                            <FormattedLabel id="update" />
                          ) : (
                            <FormattedLabel id="save" />
                          )}
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          size="small"
                          variant="outlined"
                          className={styles.button}
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                        >
                          {<FormattedLabel id="clear" />}
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          size="small"
                          variant="outlined"
                          className={styles.button}
                          endIcon={<ExitToAppIcon />}
                          onClick={() =>
                            router.push({
                              pathname: "/FireBrigadeSystem/masters/usageType",
                            })
                          }
                        >
                          {<FormattedLabel id="exit" />}
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
              </form>
            </FormProvider>
          </div>
        </Slide>
      )}

      <Box style={{ display: "flex" }}>
        <Box className={styles.tableHead}>
          <Box className={styles.h1Tag}>
            {<FormattedLabel id="usageTypeMasterTitle" />}
          </Box>
        </Box>
        <Box>
          <Button
            variant="contained"
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
            className={styles.adbtn}
            sx={{
              borderRadius: 100,

              padding: 2,
              marginLeft: 1,
              textAlign: "center",
              border: "2px solid #3498DB",
            }}
          >
            <AddIcon />
          </Button>
        </Box>
      </Box>
      <Box style={{ height: "100%", width: "100%" }}>
        <DataGrid
          // disableColumnFilter
          // disableColumnSelector
          // disableExport
          // disableToolbarButton
          // disableDensitySelector
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              // quickFilterProps: { debounceMs: 500 },
              // printOptions: { disableToolbarButton: true },
              // disableExport: true,
              // disableToolbarButton: true,
              // csvOptions: { disableToolbarButton: true },
            },
          }}
          components={{ Toolbar: GridToolbar }}
          autoHeight
          density="compact"
          sx={{
            backgroundColor: "white",
            // paddingLeft: "2%",
            // paddingRight: "2%",
            boxShadow: 2,
            border: 1,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {
              // color: "primary.main",
              transform: "scale(1.1)",
            },
            "& .MuiDataGrid-row:hover": {
              // backgroundColor: "#AED6F1",
              // backgroundColor: "rgb(89 100 100)",
              // backgroundColor: "#9BF9FF",
              backgroundColor: "#E1FDFF",
            },
            "& .MuiDataGrid-columnHeadersInner": {
              // backgroundColor: "#87E9F7",
              backgroundColor: "#2E86C1",
              color: "white",
            },
          }}
          rows={dataSource}
          columns={columns}
          pageSize={7}
          rowsPerPageOptions={[7]}
          //checkboxSelection
        />
      </Box>
    </>
  );
};

export default Index;
