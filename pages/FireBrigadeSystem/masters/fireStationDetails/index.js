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
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
// import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import { Box, Grid } from "@mui/material";
import { GridToolbar } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
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
import { fireStationDetailSchema } from "../../../../containers/schema/fireBrigadeSystem/fireStationDetailsMaster";
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
    resolver: yupResolver(fireStationDetailSchema(language)),
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
  const [ward, setWard] = useState([]);
  const [zone, setZone] = useState();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [showText, setShowText] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [name, setName] = useState("React");

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

  const locateButtons = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      // setShowText(true);
    });
  };

  const showDiv = () => {
    setShowText(true);
    setShowButton(false);
    locateButtons();
  };

  const mapStyles = {
    width: 400,
    height: 200,
    position: "static",
  };

  useEffect(() => {
    getData();
  }, [fetchData]);

  useEffect(() => {
    getWard();
    getZone();
  }, []);

  // Get Table - Data
  const getData = () => {
    setLoadderState(true);
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
        if (res.status == 200) {
          setLoadderState(false);
          setDataSource(
            res.data.map((r, i) => {
              return { srNo: i + 1, ...r };
            })
          );
        }
      })
      .catch((error) => {
        setLoadderState(false);
        callCatchMethod(error, language);
      });
  };

  // Get Ward
  const getWard = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setWard(res.data.ward);
        console.log("res.data", res.data);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // Get Zone
  const getZone = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setZone(res.data.zone);
        console.log("res.data", res.data);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    const fromData = {
      ...formData,
      gISID: Number(formData.gISID),
      gisid: Number(formData.gISID),
      activeFlag: "Y",
    };
    sweetAlert(
      fromData.id ? updateConfirmation(language) : saveConfirmation(language)
    )
      .then((ok) => {
        console.log("Hii", ok);
        if (ok) {
          console.log("hello");
          if (btnSaveText === "Save") {
            const tempData = axios
              .post(
                `${urls.FbsURL}/fireStationDetailsMaster/saveFireStationDetailsMaster`,
                fromData,
                {
                  headers: {
                    Authorization: `Bearer ${userToken}`,
                  },
                }
              )
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
              .post(
                `${urls.FbsURL}/fireStationDetailsMaster/saveFireStationDetailsMaster`,
                fromData,
                {
                  headers: {
                    Authorization: `Bearer ${userToken}`,
                  },
                }
              )
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
              })
              .catch((error) => {
                console.log("error123", error);
                callCatchMethod(error, language);
              });
          }
        }
      })

      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // Delete By ID

  const deleteById = async (value) => {
    const finalBody = {
      activeFlag: "N",
      id: value.id,
    };
    console.log("finalBody", finalBody);
    sweetAlert(deleteConfirmation(language)).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `${urls.FbsURL}/fireStationDetailsMaster/discardFireStationDetailsMaster/${value}`,
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
    gISID: "",
    fireStationName: "",
    ward: "",
    zone: "",
    address: "",
    addressMr: "",
    gisLocation: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    gISID: "",
    fireStationName: "",
    ward: "",
    zone: "",
    address: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "fireStationName",
      headerName: <FormattedLabel id="fireStationName" />,
      flex: 1,
    },
    {
      field: "fireStationNameMr",
      headerName: <FormattedLabel id="fireStationNameMr" />,
      flex: 1,
    },
    {
      field: "gISID",
      headerName: <FormattedLabel id="gISID" />,
      flex: 1,
    },
    { field: "address", headerName: <FormattedLabel id="address" />, flex: 1 },
    {
      field: "addressMr",
      headerName: <FormattedLabel id="addressMr" />,
      flex: 1,
    },
    // { field: "ward", headerName: <FormattedLabel id="ward" />, flex: 1 },
    { field: "zone", headerName: <FormattedLabel id="zone" />, flex: 1 },
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
                      padding: 2,
                      backgroundColor: "#F5F5F5",
                    }}
                    elevation={5}
                  >
                    <Box className={styles.tableHead}>
                      <Box className={styles.feildHead}>
                        {btnSaveText == "Update" ? (
                          <FormattedLabel id="updateFireStation" />
                        ) : (
                          <FormattedLabel id="addFireStation" />
                        )}
                      </Box>
                    </Box>
                    <br />

                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={3}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "100%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="gISID" required />}
                          variant="standard"
                          {...register("gISID")}
                          error={!!errors.gISID}
                          helperText={
                            errors?.gISID ? errors.gISID.message : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.fireStationField}>
                        {/* <TextField
                          sx={{ width: "100%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="fireStationName" />}
                          variant="standard"
                          {...register("fireStationName")}
                          error={!!errors.fireStationName}
                          helperText={
                            errors?.fireStationName
                              ? errors.fireStationName.message
                              : null
                          }
                        /> */}

                        <Transliteration
                          _key={"fireStationName"}
                          labelName={"fireStationName"}
                          fieldName={"fireStationName"}
                          updateFieldName={"fireStationNameMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          // variant="standard"
                          label={
                            language == "en" ? (
                              <FormattedLabel id="fireStationName" required />
                            ) : (
                              <FormattedLabel id="fireStationName" />
                            )
                          }
                          InputLabelProps={{
                            shrink: watch("fireStationName") ? true : false,
                          }}
                          error={!!errors.fireStationName}
                          helperText={
                            errors?.fireStationName
                              ? errors.fireStationName.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        {/* <TextField
                          sx={{ width: "100%" }}
                          id='standard-basic'
                          label={<FormattedLabel id='fireStationNameMr' />}
                          variant='standard'
                          {...register("fireStationNameMr")}
                          InputLabelProps={{
                            shrink: watch("fireStationNameMr") ? true : false,
                          }}
                          error={!!errors.fireStationNameMr}
                          helperText={
                            errors?.fireStationNameMr
                              ? errors.fireStationNameMr.message
                              : null
                          }
                        /> */}
                        <Transliteration
                          _key={"fireStationNameMr"}
                          labelName={"fireStationNameMr"}
                          fieldName={"fireStationNameMr"}
                          updateFieldName={"fireStationName"}
                          targetLang={"eng"}
                          sourceLang={"mar"}
                          // variant="standard"
                          label={
                            language == "en" ? (
                              <FormattedLabel id="fireStationNameMr" />
                            ) : (
                              <FormattedLabel id="fireStationNameMr" required />
                            )
                          }
                          InputLabelProps={{
                            shrink: watch("fireStationNameMr") ? true : false,
                          }}
                          error={!!errors.fireStationNameMr}
                          helperText={
                            errors?.fireStationNameMr
                              ? errors.fireStationNameMr.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.fireStationField}>
                        {/* <TextField
                          sx={{ width: "100%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="address" />}
                          variant="standard"
                          {...register("address")}
                          error={!!errors.address}
                          helperText={
                            errors?.address ? errors.address.message : null
                          }
                        /> */}

                        <Transliteration
                          _key={"address"}
                          labelName={"address"}
                          fieldName={"address"}
                          updateFieldName={"addressMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          // variant="standard"
                          label={
                            language == "en" ? (
                              <FormattedLabel id="address" required />
                            ) : (
                              <FormattedLabel id="address" />
                            )
                          }
                          InputLabelProps={{
                            shrink: watch("address") ? true : false,
                          }}
                          width={"100%"}
                          error={!!errors.address}
                          helperText={
                            errors?.address ? errors.address.message : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        {/* <TextField
                          sx={{ width: "100%" }}
                          id='standard-basic'
                          label={<FormattedLabel id='addressMr' />}
                          variant='standard'
                          {...register("addressMr")}
                          InputLabelProps={{
                            shrink: watch("addressMr") ? true : false,
                          }}
                          error={!!errors.addressMr}
                          helperText={
                            errors?.addressMr ? errors.addressMr.message : null
                          }
                        /> */}
                        <Transliteration
                          _key={"addressMr"}
                          labelName={"addressMr"}
                          fieldName={"addressMr"}
                          updateFieldName={"address"}
                          targetLang={"eng"}
                          sourceLang={"mar"}
                          // variant="standard"
                          label={
                            language == "en" ? (
                              <FormattedLabel id="addressMr" />
                            ) : (
                              <FormattedLabel id="addressMr" required />
                            )
                          }
                          InputLabelProps={{
                            shrink: watch("addressMr") ? true : false,
                          }}
                          error={!!errors.addressMr}
                          helperText={
                            errors?.addressMr ? errors.addressMr.message : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          variant="standard"
                          sx={{ width: "100%" }}
                          error={!!errors.zone}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="zone" required />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: "100%" }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="zone" required />}
                              >
                                {console.log("234", zone)}
                                {zone &&
                                  zone.map((zo, index) => {
                                    return (
                                      <MenuItem key={index} value={zo.id}>
                                        {zo.zoneName}
                                      </MenuItem>
                                    );
                                  })}
                              </Select>
                            )}
                            name="zone"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.zone ? errors.zone.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={3}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          variant="standard"
                          sx={{ width: "100%" }}
                          error={!!errors.fireStationName}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="ward" required />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: "100%" }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="ward" required />}
                              >
                                {ward &&
                                  ward.map((wa, index) => (
                                    <MenuItem key={index} value={wa.id}>
                                      {wa.wardName}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="ward"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.ward ? errors.ward.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          autoFocus
                          sx={{ width: "100%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="gislocation" required />}
                          variant="standard"
                          {...register("gisLocation")}
                          error={!!errors.gisLocation}
                          helperText={
                            errors?.gisLocation
                              ? errors.gisLocation.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <Grid item>
                          {showText ? (
                            <div>
                              {/* <Map
                              google={google}
                              zoom={10}
                              style={mapStyles}
                              center={{
                                lat: latitude,
                                lng: longitude,
                              }}
                              disableDefaultUI={true}
                            >
                              {latitude && (
                                <Marker
                                  name={"This is test name"}
                                  position={{ lat: latitude, lng: longitude }}
                                />
                              )}
                            </Map> */}
                            </div>
                          ) : null}

                          {showButton ? (
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              onClick={() => showDiv()}
                            >
                              Locate
                            </Button>
                          ) : null}
                        </Grid>
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
                                "/FireBrigadeSystem/masters/fireStationDetails",
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
            {<FormattedLabel id="fireStationDetailsTitle" />}
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

// export default GoogleApiWrapper({
//   apiKey: "AIzaSyAR6BqYhU-1TrnmRLDWbdOG9alpejmePss",
// })(index);
// export default ComplaintDetails;
