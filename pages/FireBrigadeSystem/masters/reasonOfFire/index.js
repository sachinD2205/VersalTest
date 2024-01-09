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
import { reasonOfFireSchema } from "../../../../containers/schema/fireBrigadeSystem/reasonOfFireMaster";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { Box, Grid, Typography } from "@mui/material";
import { GridToolbar } from "@mui/x-data-grid";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import {
  deleteConfirmation,
  recordDeleted,
  recordIsSafe,
  recordUpdated,
  saveConfirmation,
  saveRecord,
  updateConfirmation,
} from "../../../../containers/Layout/components/messages";
import { useSelector } from "react-redux";
import Loader from "../../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const language = useSelector((state) => state?.labels.language);
  const userToken = useGetToken();

  const router = useRouter();
  const methods = useForm({
    defaultValues: {},
    mode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(reasonOfFireSchema(language)),
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

  // Get Table - Data
  const getData = () => {
    setLoadderState(true);
    axios
      .get(`${urls.FbsURL}/mstReasonOfFire/get`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setLoadderState(false);

        setDataSource(res.data);
        console.log("data", res.data);
      })
      .catch((error) => {
        setLoadderState(false);
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    getData();
  }, [fetchData]);

  const onSubmitForm = (formData) => {
    sweetAlert(
      formData.id ? updateConfirmation(language) : saveConfirmation(language)
    )
      .then((ok) => {
        if (ok) {
          if (btnSaveText === "Save") {
            const tempData = axios
              .post(`${urls.FbsURL}/mstReasonOfFire/save`, formData, {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              })
              .then((res) => {
                if (res.status == 201) {
                  sweetAlert(saveRecord(language));
                  setButtonInputState(false);
                  setIsOpenCollapse(false);
                  setEditButtonInputState(false);
                  setDeleteButtonState(false);
                  setFetchData(tempData);
                  setSlideChecked(false);
                  getData();
                }
              })
              .catch((error) => {
                // 7- Error handling
                callCatchMethod(error, language);
              });
          } else if (btnSaveText === "Update") {
            const tempData = axios
              .post(`${urls.FbsURL}/mstReasonOfFire/save`, formData, {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              })
              .then((res) => {
                if (res.status == 201 || res.status == 200) {
                  getData();
                  sweetAlert(recordUpdated(language));
                  setButtonInputState(false);
                  setIsOpenCollapse(false);
                  setEditButtonInputState(false);
                  setDeleteButtonState(false);
                  setFetchData(update);
                  setSlideChecked(false);
                }
              })
              .catch((error) => {
                // 7- Error handling
                callCatchMethod(error, language);
              });
          }
        }
      })
      .catch((error) => {
        // 7- Error handling
        callCatchMethod(error, language);
      });
  };

  const deleteById = async (value) => {
    sweetAlert(deleteConfirmation(language)).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`${urls.FbsURL}/mstReasonOfFire/discard/${value}`, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })

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
    reasonOfFire: "",
    reasonOfFireMr: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    reasonOfFire: "",
    reasonOfFireMr: "",
  };

  // Row
  const columns = [
    {
      field: "reasonOfFire",
      headerName: <FormattedLabel id="reasonOfFireEn" />,
      flex: 1,
    },
    {
      field: "reasonOfFireMr",
      headerName: <FormattedLabel id="reasonOfFireMr" />,
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
                        {btnSaveText == "Update" ? (
                          <FormattedLabel id="updateReasonOfFire" />
                        ) : (
                          <FormattedLabel id="reasonOfFireEn" />
                        )}
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
                          _key={"reasonOfFire"}
                          labelName={"reasonOfFire"}
                          fieldName={"reasonOfFire"}
                          updateFieldName={"reasonOfFireMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          // variant="standard"
                          label={
                            language == "en" ? (
                              <FormattedLabel id="reasonOfFireEnF" required />
                            ) : (
                              <FormattedLabel id="reasonOfFireEnF" />
                            )
                          }
                          InputLabelProps={{
                            shrink: watch("reasonOfFire") ? true : false,
                          }}
                          error={!!errors.reasonOfFire}
                          helperText={
                            errors?.reasonOfFire
                              ? errors.reasonOfFire.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        {/* <TextField
                          sx={{ width: 250 }}
                          id='standard-basic'
                          label={<FormattedLabel id='reasonOfFireMr' />}
                          variant='standard'
                          {...register("reasonOfFireMr")}
                          InputLabelProps={{
                            shrink: watch("reasonOfFireMr") ? true : false,
                          }}
                          error={!!errors.reasonOfFireMr}
                          helperText={
                            errors?.reasonOfFireMr
                              ? errors.reasonOfFireMr.message
                              : null
                          }
                        /> */}

                        <Transliteration
                          _key={"reasonOfFireMr"}
                          labelName={"reasonOfFireMr"}
                          fieldName={"reasonOfFireMr"}
                          updateFieldName={"reasonOfFire"}
                          sourceLang={"mar"}
                          targetLang={"eng"}
                          // variant="standard"
                          label={
                            language == "en" ? (
                              <FormattedLabel id="reasonOfFireMr" />
                            ) : (
                              <FormattedLabel id="reasonOfFireMr" required />
                            )
                          }
                          InputLabelProps={{
                            shrink: watch("reasonOfFireMr") ? true : false,
                          }}
                          error={!!errors.reasonOfFireMr}
                          helperText={
                            errors?.reasonOfFireMr
                              ? errors.reasonOfFireMr.message
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
                              pathname:
                                "/FireBrigadeSystem/masters/reasonOfFire",
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
            {<FormattedLabel id="reasonOfFireEn" />}
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
