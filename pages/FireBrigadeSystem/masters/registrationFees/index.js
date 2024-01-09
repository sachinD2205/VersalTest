import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { registrationFeesSchema } from "../../../../containers/schema/fireBrigadeSystem/registrationFees";
import { useSelector } from "react-redux";
import { Box, Grid, Typography } from "@mui/material";
import { GridToolbar } from "@mui/x-data-grid";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";
import {
  Services,
  BusinessTypes,
  NocTypes,
} from "../../../../components/fireBrigadeSystem/NocTypes";
import Loader from "../../../../containers/Layout/components/Loader";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
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
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const router = useRouter();
  const language = useSelector((state) => state?.labels.language);
  const userToken = useGetToken();

  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(registrationFeesSchema(language)),
    mode: "onChange",
  });
  //2: For Loader
  const [loadderState, setLoadderState] = useState(false);
  // 3:Error Handling
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
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [serviceName, setServiceName] = useState([]);
  const [finalType, setFinalType] = useState([]);

  useEffect(() => {
    if (watch("serviceId") == 78) {
      setFinalType(BusinessTypes);
    } else if (watch("serviceId") == 76) {
      setFinalType(NocTypes);
    }
  }, [watch("serviceId")]);

  useEffect(() => {
    getData();
  }, [fetchData]);

  // useEffect(() => {
  //   getServiceName();
  // }, []);

  const getServiceName = () => {
    setLoadderState(true);

    axios
      .get(`${urls.CFCURL}/master/service/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })

      .then((r) => {
        setServiceName(r.data.service);
      });
  };

  // Get Table - Data
  const getData = () => {
    // 4- false

    setLoadderState(true);

    axios
      .get(`${urls.FbsURL}/master/registrationFees/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setLoadderState(false);

        setDataSource(
          res?.data?.registrationFees?.map((u) => {
            return {
              ...u,
              serviceName: Services.find((x) => x.id == u.serviceId)?.name,
              serviceNameMr: Services.find((x) => x.id == u.serviceId)?.nameMr,
              nocTypeTxt:
                u.serviceId == 78
                  ? BusinessTypes.find((x) => x.id == u.nocType)?.name
                  : NocTypes.find((x) => x.id == u.nocType)?.name,
              nocTypeTxtMr:
                u.serviceId == 78
                  ? BusinessTypes.find((x) => x.id == u.nocType)?.nameMr
                  : NocTypes.find((x) => x.id == u.nocType)?.nameMr,
            };
          })
        );
      })
      .catch((err) => {
        console.log("err", err);
        setLoadderState(false);
      });
  };

  // useEffect(() => {
  //   getServiceName();
  // }, [serviceName]);

  // OnSubmit Form
  // const onSubmitForm = (fromData) => {
  //   console.log("Form Data ", fromData);
  //   const tempData = axios
  //     .post(`${urls.FbsURL}/master/registrationFees/save`, fromData)
  //     .then((res) => {
  //       if (res.status == 200) {
  //         fromData.id
  //           ? sweetAlert("Update!", "Record Updated successfully !", "success")
  //           : sweetAlert("Saved!", "Record Saved successfully !", "success");
  //         setButtonInputState(false);
  //         setIsOpenCollapse(false);
  //         setFetchData(tempData);
  //         setEditButtonInputState(false);
  //         setDeleteButtonState(false);
  //       }
  //     });
  // };

  //  New Code
  const onSubmitForm = (formData) => {
    const body = {
      id: formData.id,
      nocType: formData.nocType,
      registrationAmount: formData.registrationAmount,
      serviceId: formData.serviceId,
    };
    const updateBody = {
      activeFlag: "Y",
      id: formData.id,
      nocType: formData.nocType,
      registrationAmount: formData.registrationAmount,
      serviceId: formData.serviceId,
    };
    sweetAlert(
      formData.id ? updateConfirmation(language) : saveConfirmation(language)
    )
      .then((ok) => {
        console.log("Hii", ok);
        if (ok) {
          console.log("hello");
          if (btnSaveText === "Save") {
            const tempData = axios
              .post(`${urls.FbsURL}/master/registrationFees/save`, body, {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              })
              .then((res) => {
                if (res.status == 200 || res.status == 201) {
                  getData();
                  sweetAlert(saveRecord(language));
                  setButtonInputState(false);
                  setIsOpenCollapse(false);
                  setEditButtonInputState(false);
                  setDeleteButtonState(false);
                  setFetchData(tempData);
                  setSlideChecked(false);
                }
              });
          } else if (btnSaveText === "Update") {
            const tempData = axios
              .post(`${urls.FbsURL}/master/registrationFees/save`, updateBody, {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              })
              .then((res) => {
                if (res.status == 200 || res.status == 201) {
                  getData();
                  sweetAlert(recordUpdated(language));
                  setButtonInputState(false);
                  setIsOpenCollapse(false);
                  setEditButtonInputState(false);
                  setDeleteButtonState(false);
                  setFetchData(tempData);
                  setSlideChecked(false);
                }
              });
            // .catch((error) => {
            //   callCatchMethod(error, language);
            // });
          }
        }
      })
      .catch((error) => {
        // 7- Error handling
        callCatchMethod(error, language);
      });
  };

  //

  // // Delete By ID
  // const deleteById = async (value) => {
  //   swal({
  //     title: "Delete ?",
  //     text: "Are you sure you want to delete this Record ? ",
  //     icon: "warning",
  //     buttons: true,
  //     dangerMode: true,
  //   }).then((willDelete) => {
  //     if (willDelete) {
  //       // await
  //       axios
  //         .post(
  //           `${urls.FbsURL}/master/registrationFees/save`
  //         )
  //         .then((res) => {
  //           if (res.status == 200) {
  //             swal("Record is Successfully Deleted!", {
  //               icon: "success",
  //             });
  //             getData();
  //             setButtonInputState(false);
  //           } else {
  //             swal("Record is Safe");
  //           }
  //         });
  //     }
  //   });
  // };

  const deleteById = async (value) => {
    sweetAlert(deleteConfirmation(language)).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `${urls.FbsURL}/master/registrationFees/discardRegistrationFees/${value}`,
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
    nocType: "",
    serviceId: "",
    registrationAmount: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    nocType: "",
    serviceId: "",
    registrationAmount: "",
  };

  const columns = [
    {
      field: language == "en" ? "nocTypeTxt" : "nocTypeTxtMr",
      headerName: <FormattedLabel id="nocType" />,
      flex: 1,
    },
    {
      // field: "serviceName",
      field: language == "en" ? "serviceName" : "serviceNameMr",
      headerName: <FormattedLabel id="serviceId" />,
      flex: 1,
    },
    {
      field: "registrationAmount",
      headerName: <FormattedLabel id="registrationAmount" />,
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

  // Row

  return (
    <>
      {/* Add Loader */}
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
                    // margin: "4%",
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
                        {<FormattedLabel id="registrationFees" />}
                      </Box>
                    </Box>
                    <br />
                    <br />

                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      spacing={4}

                      //   className={styles.feildres}
                    >
                      {/* <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: 250 }}
                          label={<FormattedLabel id='serviceId' />}
                          variant='standard'
                          {...register("serviceId")}
                          error={!!errors.serviceId}
                          helperText={
                            errors?.serviceId
                              ? errors.serviceId.message
                              : null
                          }
                        />
                      </Grid> */}
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          variant="standard"
                          sx={{
                            minWidth: "100%",
                          }}
                          error={!!errors.serviceId}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="serviceName" required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                // sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="serviceId"
                              >
                                {Services &&
                                  Services.map((appId, index) => (
                                    <MenuItem key={index} value={appId.id}>
                                      {language === "en"
                                        ? appId.name
                                        : appId.nameMr}
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

                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          variant="standard"
                          error={!!errors.nocType}
                          sx={{
                            minWidth: "100%",
                          }}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {/* <FormattedLabel id="nameOfUsage" /> */}
                            {/* Select NOC Type */}
                            <FormattedLabel id="selectNOCType" required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                // sx={{
                                //   minWidth: 220,
                                // }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                                // onChange={(
                                //   value
                                // ) => {
                                //   field.onChange(
                                //     value
                                //   ),
                                //     // getZoneWardID();
                                //   // getTypeNameKeys();
                                // }}
                                label="nocType"
                              >
                                {finalType?.map((nameOfUsage, index) => (
                                  <MenuItem key={index} value={nameOfUsage.id}>
                                    {language == "en"
                                      ? nameOfUsage?.name
                                      : nameOfUsage?.nameMr}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                            name="nocType"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.nocType ? errors.nocType.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/* <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: 250 }}
                          id='standard-basic'
                          label={<FormattedLabel id='nocType' />}
                          variant='standard'
                          {...register("nocType")}
                          error={!!errors.nocType}
                          helperText={
                            errors?.nocType
                              ? errors.nocType.message
                              : null
                          }
                        />
                      </Grid> */}
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ minWidth: "100%" }}
                          label={
                            <FormattedLabel id="registrationAmount" required />
                          }
                          variant="standard"
                          {...register("registrationAmount")}
                          error={!!errors.registrationAmount}
                          helperText={
                            errors?.registrationAmount
                              ? errors.registrationAmount.message
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
                                "/FireBrigadeSystem/masters/registrationFees",
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

      <Box style={{ display: "flex", marginTop: "1%" }}>
        <Box className={styles.tableHead}>
          <Box className={styles.h1Tag}>
            {<FormattedLabel id="registrationFees" />}
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
              transform: "scale(1.1)",
            },
            "& .MuiDataGrid-row:hover": {
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
