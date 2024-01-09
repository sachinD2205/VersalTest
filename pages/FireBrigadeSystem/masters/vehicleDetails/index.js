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
import { Schema } from "../../../../containers/schema/fireBrigadeSystem/vehicleDetailsMaster";
import { Box, Grid } from "@mui/material";
import { GridToolbar } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import Loader from "../../../../containers/Layout/components/Loader";
import {
  deleteConfirmation,
  recordDeleted,
  recordIsSafe,
  recordUpdated,
  saveConfirmation,
  saveRecord,
  updateConfirmation,
} from "../../../../containers/Layout/components/messages";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const language = useSelector((state) => state?.labels.language);
  const userToken = useGetToken();

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

  const router = useRouter();

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
  const [fireStation, setfireStation] = useState([]);
  const [type, setType] = useState();

  // {
  // "vTSSystemID":1,
  // "gPSDeviceId":"fv",
  // "fireStationName":1,
  // "vehicleName":"dfgh",
  // "vehicleType":"dsf",
  // "vehicleNumber":"asdefg",
  // "remark":"sd"
  //  }
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
  // Get Table - Data
  const getData = () => {
    setLoadderState(true);
    axios
      .get(
        `${urls.FbsURL}/VehicleDetailsMasterMaster/getVehicleDetailsMasterData`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        setLoadderState(false);
        if (res?.status == 200 || res?.status == 201) {
          console.log("0990999", res?.data);
          let response = res?.data;
          let _res = response?.map((r, i) => {
            return {
              ...r,
              id: r?.id,
              srNo: i + 1,
              vehicleType: r.vehicleType,
              vehicleTypeCol: type?.find((d) => d.id == r.vehicleType)
                ?.vehicleType,
              vehicleTypeColMr: type?.find((d) => d.id == r.vehicleType)
                ?.vehicleTypeMr,
              fireStationNamecol: fireStation?.find(
                (d) => d.id == r.fireStationName
              )?.fireStationName,
              fireStationNamecolMr: fireStation?.find(
                (d) => d.id == r.fireStationName
              )?.fireStationNameMr,
              activeFlag: r?.activeFlag,
              status: r?.activeFlag === "Y" ? "Active" : "Inactive",
            };
          });
          setDataSource(_res);
        }
      })
      .catch((error) => {
        setLoadderState(false);
        callCatchMethod(error, language);
      });
  };
  console.log("Vehicle Details watch", watch("vehicleType"));

  // get Fire Station Name
  const getFireStation = () => {
    axios
      .get(
        `${urls.FbsURL}/fireStationDetailsMaster/getFireStationDetailsMasterData`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        console.log("fireStation", res?.data);
        setfireStation(res?.data);
      });
  };

  // get Vehicle Type
  const getVehicleType = () => {
    axios
      .get(`${urls.FbsURL}/mstVehicleType/get`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("Vehicle Details.....", res?.data);
        setType(res?.data);
      });
  };

  useEffect(() => {
    getData();
  }, [fetchData, type]);

  useEffect(() => {
    getFireStation();
    getVehicleType();
  }, []);

  // const onSubmitForm = (fromData) => {

  //   const tempData = axios
  //     .post(
  //       `${urls.FbsURL}/VehicleDetailsMasterMaster/saveVehicleDetailsMaster`,
  //       fromData
  //     )
  //     .then((res) => {
  //       if (res.status == 201) {
  //         fromData.id
  //           ? sweetAlert("Update!", "Record Updated successfully !", "success")
  //           : sweetAlert("Saved!", "Record Saved successfully !", "success");
  //         setButtonInputState(false);
  //         setIsOpenCollapse(false);
  //         setFetchData(tempData);
  //         setEditButtonInputState(false);
  //         setDeleteButtonState(false);
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // };

  // 6-
  const onSubmitForm = (formData) => {
    const finalBody = {
      ...formData,
      fireStationName: Number(formData.fireStationName),
      vehicleType: Number(formData.vehicleType),
    };
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
                `${urls.FbsURL}/VehicleDetailsMasterMaster/saveVehicleDetailsMaster`,
                finalBody,
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
              vTSSystemID: formData.vTSSystemID,
              vehicleName: formData.vehicleName,
              vehicleNameMr: formData.vehicleNameMr,
              vehicleNumber: formData.vehicleNumber,
              vehicleType: Number(formData.vehicleType),
              fireStationName: Number(formData.fireStationName),
              gPSDeviceId: formData.gPSDeviceId,
            };
            const tempData = axios
              .post(
                `${urls.FbsURL}/VehicleDetailsMasterMaster/saveVehicleDetailsMaster`,
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

  // Delete By ID

  const deleteById = async (value) => {
    sweetAlert(deleteConfirmation(language)).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `${urls.FbsURL}/VehicleDetailsMasterMaster/discardVehicleDetailsMaster/${value}`,
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
    vTSSystemID: "",
    gPSDeviceId: "",
    fireStationName: "",
    fireStationNameMr: "",
    vehicleName: "",
    vehicleNameMr: "",
    vehicleType: "",
    vehicleTypeMr: "",
    vehicleNumber: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    vTSSystemID: "",
    gPSDeviceId: "",
    fireStationName: "",
    fireStationNameMr: "",
    vehicleName: "",
    vehicleNameMr: "",
    vehicleType: "",
    vehicleTypeMr: "",
    vehicleNumber: "",
  };

  const columns = [
    {
      field: "vTSSystemID",
      headerName: <FormattedLabel id="vTSSystemID" />,
      flex: 1,
    },
    {
      field: "vehicleName",
      headerName: <FormattedLabel id="vehicleName" />,
      flex: 1,
    },
    {
      field: "vehicleNameMr",
      headerName: <FormattedLabel id="vehicleNameMr" />,
      flex: 1,
    },
    {
      field: "vehicleNumber",
      headerName: <FormattedLabel id="vehicleNumber" />,
      flex: 1,
    },

    {
      field: language == "en" ? "vehicleTypeCol" : "vehicleTypeColMr",
      headerName: <FormattedLabel id="vehicalTypeName" />,
      flex: 1,
    },
    // {
    //   field: "vehicleTypeMr",
    //   headerName: <FormattedLabel id='vehicleTypeMr' />,
    //   flex: 1,
    // },
    {
      field: "gPSDeviceId",
      headerName: <FormattedLabel id="gPSDeviceId" />,
      flex: 1,
    },
    {
      field: language == "en" ? "fireStationNamecol" : "fireStationNamecolMr",
      headerName: <FormattedLabel id="fireStationName" />,
      flex: 1,
    },
    // {
    //   field: "fireStationNameMr",
    //   headerName: <FormattedLabel id='fireStationNameMr' />,
    //   flex: 1,
    // },
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
                          <FormattedLabel id="updateVehicleDetails" />
                        ) : (
                          <FormattedLabel id="addVehicleDetails" />
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
                        <TextField
                          sx={{ width: "100%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="vTSSystemID" required />}
                          variant="standard"
                          {...register("vTSSystemID")}
                          error={!!errors.vTSSystemID}
                          helperText={
                            errors?.vTSSystemID
                              ? errors.vTSSystemID.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.vehicleField}>
                        {/* <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="vehicleName" />}
                          variant="standard"
                          {...register("vehicleName")}
                          error={!!errors.vehicleName}
                          helperText={
                            errors?.vehicleName
                              ? errors.vehicleName.message
                              : null
                          }
                        /> */}

                        <Transliteration
                          _key={"vehicleName"}
                          labelName={"vehicleName"}
                          fieldName={"vehicleName"}
                          updateFieldName={"vehicleNameMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          // variant="standard"
                          label={<FormattedLabel id="vehicleName" required />}
                          InputLabelProps={{
                            shrink: watch("vehicleName") ? true : false,
                          }}
                          sx={{ width: "100%" }}
                          error={!!errors.vehicleName}
                          helperText={
                            errors?.vehicleName
                              ? errors.vehicleName.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "100%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="vehicleNameMr" required />}
                          variant="standard"
                          {...register("vehicleNameMr")}
                          InputLabelProps={{
                            shrink: watch("vehicleNameMr") ? true : false,
                          }}
                          error={!!errors.vehicleNameMr}
                          helperText={
                            errors?.vehicleNameMr
                              ? errors.vehicleNameMr.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="vehicleNumber" required />}
                          variant="standard"
                          {...register("vehicleNumber")}
                          error={!!errors.vehicleNumber}
                          sx={{ width: "100%" }}
                          helperText={
                            errors?.vehicleNumber
                              ? errors.vehicleNumber.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          variant="standard"
                          sx={{ width: "100%" }}
                          error={!!errors.vehicleType}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="vehicleType" required />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Vehicle Type"
                              >
                                {type &&
                                  type.map((typ, index) => (
                                    <MenuItem key={index} value={typ.id}>
                                      {language == "en"
                                        ? typ.vehicleType
                                        : typ.vehicleTypeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="vehicleType"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.vehicleType
                              ? errors.vehicleType.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          variant="standard"
                          sx={{ width: "100%" }}
                          error={!!errors.fireStationName}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="fireStationName" required />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={
                                  <FormattedLabel
                                    id="fireStationName"
                                    required
                                  />
                                }
                              >
                                {fireStation &&
                                  fireStation.map((fire, index) => (
                                    <MenuItem key={index} value={fire.id}>
                                      {language == "en"
                                        ? fire.fireStationName
                                        : fire.fireStationNameMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="fireStationName"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.fireStationName
                              ? errors.fireStationName.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      // className={styles.feildres}
                      spacing={4}
                    >
                      <Grid
                        item
                        xs={4}
                        sx={{ paddingLeft: "8%", marginTop: 2 }}
                      >
                        <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="gPSDeviceId" required />}
                          variant="standard"
                          sx={{ width: "100%" }}
                          {...register("gPSDeviceId")}
                          error={!!errors.gPSDeviceId}
                          helperText={
                            errors?.gPSDeviceId
                              ? errors.gPSDeviceId.message
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
                                "/FireBrigadeSystem/masters/vehicleDetails",
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
            {<FormattedLabel id="vehicleDetailsTitle" />}
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
            // paddingLeft: "2%",
            // paddingRight: "2%",
            // width: "60%",
            backgroundColor: "white",
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
        />
      </Box>
    </>
  );
};

export default Index;
