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
// import schema from "../../../../containers/schema/fireBrigadeSystem/fireEquipmentsMaster";
import { fireEquipmentsShema } from "../../../../containers/schema/fireBrigadeSystem/fireEquipmentsSchema";
import {
  deleteConfirmation,
  recordDeleted,
  recordIsSafe,
  recordUpdated,
  saveConfirmation,
  saveRecord,
  updateConfirmation,
} from "../../../../containers/Layout/components/messages";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { Box, Grid, Typography } from "@mui/material";
import { GridToolbar } from "@mui/x-data-grid";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";
import Loader from "../../../../containers/Layout/components/Loader";
import { useSelector } from "react-redux";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const language = useSelector((state) => state?.labels.language);
  const router = useRouter();
  const userToken = useGetToken();

  const methods = useForm({
    defaultValues: {},
    mode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(fireEquipmentsShema(language)),
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
  // 2- Add Loader
  const [loadderState, setLoadderState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);

  // callCatchMethod
  const callCatchMethod = (err, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(err, language);
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
      .get(`${urls.FbsURL}/master/fireEquipments/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setDataSource(res?.data?.fireEquipments);
        setLoadderState(false);

        console.log("data", res?.data?.fireEquipments);
      });
  };

  const onSubmitForm = (formData) => {
    setLoadderState(true);

    if (btnSaveText === "Save") {
      setLoadderState(true);

      const tempData = axios
        .post(`${urls.FbsURL}/master/fireEquipments/save`, formData, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setLoadderState(false);

          if (res.status == 200 || res.status == 201) {
            // sweetAlert("Saved!", "Record Saved successfully !", "success");
            sweetAlert(saveRecord(language));
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setFetchData(tempData);
            getData();
          }
        });
    } else if (btnSaveText === "Update") {
      setLoadderState(true);

      axios
        .post(`${urls.FbsURL}/master/fireEquipments/save`, formData, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setLoadderState(false);

          if (res.status == 201 || res.status == 200) {
            // sweetAlert("Updated!", "Record Updated successfully !", "success");
            sweetAlert(recordUpdated(language));
            getData();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setFetchData(tempData);
          }
        })
        .catch((err) => console.log(err));
      // callCatchMethod(err, language);

      setLoadderState(false);
    }
  };

  // Delete By ID
  const deleteById = async (value) => {
    swal({
      title: "Delete ?",
      text: "Are you sure you want to delete this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        // await
        axios
          .delete(
            `${urls.FbsURL}/master/fireEquipments/discardFireEquipments/${value}`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          // http://localhost:8092/fbs/api/master/externalService/discardMstExternalService/
          .then((res) => {
            if (res.status == 226 || res.status == 200) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getData();
              setButtonInputState(false);
            } else {
              swal("Record is Safe");
            }
          });
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
    fireEquipments: "",
    fireEquipmentsMr: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    fireEquipments: "",
    fireEquipmentsMr: "",
  };

  // Row
  const columns = [
    {
      field: "fireEquipments",
      headerName: <FormattedLabel id="fireEquipments" />,
      flex: 1,
    },
    {
      field: "fireEquipmentsMr",
      headerName: <FormattedLabel id="fireEquipmentsMr" />,
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
      {loadderState && <Loader />}
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
                          <FormattedLabel id="updatefireEquipments" />
                        ) : (
                          <FormattedLabel id="fireEquipments" />
                        )}
                      </Box>
                    </Box>

                    <br />

                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={6}
                    >
                      <Grid item xs={6} className={styles.feildres}>
                        <TextField
                          autoFocus
                          fullWidth
                          //   sx={{ width: 250 }}
                          id="standard-basic"
                          variant="standard"
                          label={<FormattedLabel id="fireEquipmentsFeilds" />}
                          {...register("fireEquipments")}
                          error={!!errors.fireEquipments}
                          helperText={
                            errors?.fireEquipments
                              ? errors.fireEquipments.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={6} className={styles.feildres}>
                        <TextField
                          fullWidth
                          //   sx={{ width: 250 }}
                          id="standard-basic"
                          label={<FormattedLabel id="fireEquipmentsMrFeilds" />}
                          variant="standard"
                          {...register("fireEquipmentsMr")}
                          error={!!errors.fireEquipmentsMr}
                          helperText={
                            errors?.fireEquipmentsMr
                              ? errors.fireEquipmentsMr.message
                              : null
                          }
                        />
                      </Grid>
                    </Grid>
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
                                "/FireBrigadeSystem/masters/fireEquipments",
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
            {<FormattedLabel id="fireEquipments" />}
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
              // color: "primary.main",
              // transform: "scale(1.1)",
            },
            "& .MuiDataGrid-row:hover": {
              // backgroundColor: "#AED6F1",
              // backgroundColor: "rgb(89 100 100)",
              // backgroundColor: "#9BF9FF",
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
          //checkboxSelection
        />
      </Box>
    </>
  );
};

export default Index;
