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
import {
  deleteConfirmation,
  recordDeleted,
  recordIsSafe,
  recordUpdated,
  saveConfirmation,
  saveRecord,
  updateConfirmation,
} from "../../../../containers/Layout/components/messages";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import Loader from "../../../../containers/Layout/components/Loader";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

// import schema from "../../../../containers/schema/fireBrigadeSystem/externalServiceNameMaster";

import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { Box, Grid, Typography } from "@mui/material";
import { GridToolbar } from "@mui/x-data-grid";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";
import { useSelector } from "react-redux";
import { externalServiceSchema } from "../../../../containers/schema/fireBrigadeSystem/externalServiceSchema";
const Index = () => {
  const router = useRouter();

  const language = useSelector((state) => state?.labels.language);
  //
  const userToken = useGetToken();

  const methods = useForm({
    defaultValues: {},
    mode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(externalServiceSchema(language)),
  });

  //

  const {
    watch,
    error,

    setValue,
    getValues,
    register,
    handleSubmit,
    control,
    unregister,
    reset,
    formState: { errors },
  } = methods;

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);

  // 2- Add Loader
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
      .get(`${urls.FbsURL}/master/externalService/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setDataSource(res?.data?.externalService);
        console.log("data", res?.data?.externalService);
        setLoadderState(false);
      })
      .catch((err) => {
        console.log("err", err);
        callCatchMethod(error, language);

        setLoadderState(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const onSubmitForm = (formData) => {
    setLoadderState(true);

    const finalBody = {
      ...formData,
      // activeFlag: formData.activeFlag ? formData.activeFlag : null,
      id: formData.id ? formData.id : null,
      serviceType: "",
    };

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
              .post(`${urls.FbsURL}/master/externalService/save`, finalBody, {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              })
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
            setLoadderState(true);

            const tempData = axios
              .post(`${urls.FbsURL}/master/externalService/save`, finalBody, {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              })
              .then((res) => {
                setLoadderState(false);

                if (res.status == 200 || res.status == 201) {
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
                callCatchMethod(error, language);
                setLoadderState(false);
              });
          }
        }
      })
      .catch((error) => {
        // 7- Error handling
        setLoadderState(false);

        callCatchMethod(error, language);
      });
  };

  // Delete
  const deleteById = async (value) => {
    sweetAlert(deleteConfirmation(language)).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `${urls.FbsURL}/master/externalService/discardMstExternalService/${value}`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
            // http://localhost:8092/fbs/api/master/externalService/discardMstExternalService/1
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

  // const deleteById = (value, _activeFlag) => {
  //   let body = {
  //     activeFlag: "N",
  //     id: value,
  //   };
  //   console.log("body", body);
  //   if (_activeFlag === "N") {
  //     swal({
  //       title: "Inactivate?",
  //       text: "Are you sure you want to inactivate this Record ? ",
  //       icon: "warning",
  //       buttons: true,
  //       dangerMode: true,
  //     }).then((willDelete) => {
  //       console.log("inn", willDelete);
  //       if (willDelete === true) {
  //         axios
  //           .post(`${urls.FbsURL}/master/externalService/save`, body)
  //           .then((res) => {
  //             console.log("delet res", res);
  //             if (res.status == 200) {
  //               setEditButtonInputState(true);
  //               swal("Record is Successfully Deleted!", {
  //                 icon: "success",
  //               });
  //               // getSubType()
  //               getData();
  //             }
  //           });
  //       } else if (willDelete == null) {
  //         swal("Record is Safe");
  //       }
  //     });
  //   } else {
  //     swal({
  //       title: "Activate?",
  //       text: "Are you sure you want to activate this Record ? ",
  //       icon: "warning",
  //       buttons: true,
  //       dangerMode: true,
  //     }).then((willDelete) => {
  //       console.log("inn", willDelete);
  //       if (willDelete === true) {
  //         axios
  //           .post(`${urls.FbsURL}/master/externalService/save`, body)
  //           .then((res) => {
  //             console.log("delet res", res);
  //             if (res.status == 200) {
  //               setEditButtonInputState(false);
  //               swal("Record is Successfully Activated!", {
  //                 icon: "success",
  //               });
  //               // getSubType()
  //               getData();
  //             }
  //           });
  //       } else if (willDelete == null) {
  //         swal("Record is Safe");
  //       }
  //     });
  //   }
  // };

  // Delete By ID
  // const deleteById = async (value) => {
  //   const data = {
  //     id: value.id,
  //     ...value,
  //     activeFlag: "N",
  //   };
  //   sweetAlert(deleteConfirmation(language)).then((willDelete) => {
  //     if (willDelete) {
  //       axios
  //         .post(`${urls.FbsURL}/master/externalService/save`, data)
  //         .then((res) => {
  //           console.log("willDelete", willDelete);
  //           if (res.status == 226 || res.status == 200) {
  //             getData();
  //             sweetAlert(recordDeleted(language));
  //             setButtonInputState(false);
  //           }
  //         })
  //         .catch((error) => {
  //           console.log("1212", error);
  //           callCatchMethod(error, language);
  //         });
  //     } else if (willDelete == null || willDelete == false) {
  //       console.log("willDelete", willDelete);
  //       sweetAlert(recordIsSafe(language));
  //     }
  //   });
  // };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    externalServiceName: "",
    externalServiceNameMr: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    externalServiceName: "",
    externalServiceNameMr: "",
  };

  // Row
  const columns = [
    {
      field: "externalServiceName",
      headerName: <FormattedLabel id="externalServiceNameFeilds" />,
      flex: 1,
    },
    {
      field: "externalServiceNameMr",
      headerName: <FormattedLabel id="externalServiceNameMr" />,
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
              onClick={() => deleteById(params?.row?.id)}
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
                        <FormattedLabel id="externalServiceName" />
                      </Box>
                    </Box>

                    <br />
                    <br />

                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={5}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          autoFocus
                          sx={{ width: "100%" }}
                          id="standard-basic"
                          variant="standard"
                          label={
                            <FormattedLabel id="externalServiceNameFeilds" />
                          }
                          {...register("externalServiceName")}
                          error={!!errors.externalServiceName}
                          helperText={
                            errors?.externalServiceName
                              ? errors.externalServiceName.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "100%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="externalServiceNameMr" />}
                          variant="standard"
                          {...register("externalServiceNameMr")}
                          error={!!errors.externalServiceNameMr}
                          helperText={
                            errors?.externalServiceNameMr
                              ? errors.externalServiceNameMr.message
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
                                "/FireBrigadeSystem/masters/externalServices",
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
            {<FormattedLabel id="externalServiceName" />}
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
