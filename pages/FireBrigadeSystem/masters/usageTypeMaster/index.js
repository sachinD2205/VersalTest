import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  AppBar,
  Box,
  Button,
  Paper,
  Slide,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/fireBrigadeSystem/usageTypeMaster";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

import { Grid } from "@mui/material";
import { GridToolbar } from "@mui/x-data-grid";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";
import {
  deleteConfirmation,
  recordDeleted,
  recordIsSafe,
  recordUpdated,
  saveConfirmation,
  saveRecord,
  updateConfirmation,
} from "../../../../containers/Layout/components/messages";

const Index = () => {
  const router = useRouter();
  const userToken = useGetToken();

  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
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
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);

  useEffect(() => {
    getData();
  }, [fetchData]);

  // Get Table - Data
  const getData = () => {
    axios
      .get(`${urls.FbsURL}/usageTypeMaster/getUsageTypeMasterData`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setDataSource(res.data);
        console.log("data", res.data);
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

  // Delete By ID
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

  // Rows
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
      {isOpenCollapse && (
        <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
          <div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Box
                  style={{
                    margin: "4%",
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
                          <FormattedLabel id="updateUsage" />
                        ) : (
                          <FormattedLabel id="addUsage" />
                        )}
                      </Box>
                    </Box>
                    <br />
                    <br />

                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label={<FormattedLabel id="nameOfUsage" />}
                          variant="standard"
                          {...register("nameOfUsage")}
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
                          sx={{ width: 250 }}
                          label={<FormattedLabel id="nameOfUsageMr" />}
                          variant="standard"
                          {...register("nameOfUsageMr")}
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
                              pathname:
                                "/FireBrigadeSystem/masters/usageTypeMaster",
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

      <Box style={{ display: "flex", marginTop: "5%" }}>
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
      <Box>
        <DataGrid
          disableColumnFilter
          disableColumnSelector
          disableExport
          // disableToolbarButton
          // disableDensitySelector
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
              printOptions: { disableToolbarButton: true },
              // disableExport: true,
              // disableToolbarButton: true,
              csvOptions: { disableToolbarButton: true },
            },
          }}
          components={{ Toolbar: GridToolbar }}
          autoHeight
          density="compact"
          sx={{
            backgroundColor: "white",
            paddingLeft: "2%",
            paddingRight: "2%",
            boxShadow: 2,
            border: 1,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {
              // transform: "scale(1.1)",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#E1FDFF",
            },
            "& .MuiDataGrid-columnHeadersInner": {
              backgroundColor: "#87E9F7",
            },
          }}
          rows={dataSource}
          columns={columns}
          pageSize={7}
          rowsPerPageOptions={[7]}
        />
      </Box>
    </>
  );
};

export default Index;
