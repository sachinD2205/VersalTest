import { yupResolver } from "@hookform/resolvers/yup";
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
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
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
import { buildingRateChartShema } from "../../../../containers/schema/fireBrigadeSystem/BuildingRateChartSchema";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const language = useSelector((state) => state?.labels.language);

  const router = useRouter();
  const userToken = useGetToken();

  const methods = useForm({
    defaultValues: {},
    mode: "onChange",
    criteriaMode: "all",
    // 1- Passing Language to schema
    resolver: yupResolver(buildingRateChartShema(language)),
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
    // 4- false
    setLoadderState(true);
    axios
      .get(`${urls.FbsURL}/master/rateCharge/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setLoadderState(false);
        let response = res?.data?.rateCharge;
        console.log("response123", response);
        let _res = response.map((r, i) => {
          return {
            id: r?.id,
            srNo: i + 1,
            buildingHeightFrom: r?.buildingHeightFrom,
            buildingHeightTo: r?.buildingHeightTo,
            parishishtha: r?.parishishtha,
            preminumMinimumRate: r?.preminumMinimumRate,
            preminumPerSqm: r?.preminumPerSqm,
            serviceId: r?.serviceId,
            trnId: r?.trnId,

            typeOfUsageId: r?.typeOfUsageId,

            typeOfUsageIdEng: r?.typeOfUsageId
              ? usageTypes?.find((obj) => obj?.id === r?.typeOfUsageId)
                  ?.nameOfUsage
              : "--",

            typeOfUsageIdMr: r?.typeOfUsageId
              ? usageTypes?.find((obj) => obj?.id === r?.typeOfUsageId)
                  ?.nameOfUsageMr
              : "--",

            activeFlag: r?.activeFlag,
            status: r?.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });
        setDataSource(_res);
        console.log("data123", res?.data?.rateCharge);
      })
      .catch((error) => {
        // 5- false
        setLoadderState(false);

        callCatchMethod(error, language);
      });
  };

  // usageType
  const [usageTypes, setUsageType] = useState([]);

  // getUsageType
  const getUsageType = () => {
    setLoadderState(true);

    axios
      .get(`${urls.FbsURL}/usageTypeMaster/getUsageTypeMasterData`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setLoadderState(false);

        console.log("getUsageType", r);
        setUsageType(
          r?.data?.map((row) => ({
            ...row,
            id: row.id,

            nameOfUsage: row.nameOfUsage,
            nameOfUsageMr: row.nameOfUsageMr,
          }))
        );
      })
      .catch((error) => {
        setLoadderState(false);

        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    getUsageType();
  }, []);

  useEffect(() => {
    getData();
  }, [fetchData, usageTypes]);

  // 6-
  const onSubmitForm = (formData) => {
    sweetAlert(
      formData.id ? updateConfirmation(language) : saveConfirmation(language)
    )
      .then((ok) => {
        console.log("Hii", ok);
        if (ok) {
          console.log("hello");
          if (btnSaveText === "Save") {
            const tempData = axios
              .post(`${urls.FbsURL}/master/rateCharge/save`, formData, {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              })
              .then((res) => {
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
              .post(`${urls.FbsURL}/master/rateCharge/save`, formData, {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              })
              .then((res) => {
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
              });
          }
        }
      })
      .catch((error) => {
        // 7- Error handling
        callCatchMethod(error, language);
      });
  };

  // Delete By ID
  const deleteById = async (value) => {
    sweetAlert(deleteConfirmation(language)).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`${urls.FbsURL}/master/rateCharge/rateCharge/${value}`, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((res) => {
            if (res.status == 226 || res.status == 200) {
              getData();
              sweetAlert(recordDeleted(language));
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
    parishishtha: "",
    typeOfUsageId: "",
    buildingHeightFrom: "",
    buildingHeightTo: "",
    preminumPerSqm: "",
    preminumMinimumRate: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    parishishtha: "",
    typeOfUsageId: "",
    buildingHeightFrom: "",
    buildingHeightTo: "",
    preminumPerSqm: "",
    preminumMinimumRate: "",
  };

  // Row
  const columns = [
    {
      field: language == "en" ? "typeOfUsageIdEng" : "typeOfUsageIdMr",
      headerName: <FormattedLabel id="typeOfUsageId" />,
      flex: 1.8,
    },
    {
      field: "parishishtha",
      headerName: <FormattedLabel id="parishishtha" />,
      flex: 1,
    },
    {
      field: "buildingHeightFrom",
      headerName: <FormattedLabel id="buildingHeightFrom" />,
      flex: 1,
    },
    {
      field: "buildingHeightTo",
      headerName: <FormattedLabel id="buildingHeightTo" />,
      flex: 1,
    },
    {
      field: "preminumPerSqm",
      headerName: <FormattedLabel id="preminumPerSqm" />,
      flex: 1,
    },
    {
      field: "preminumMinimumRate",
      headerName: <FormattedLabel id="preminumMinimumRate" />,
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
                        {<FormattedLabel id="buildingRateChart" />}
                      </Box>
                    </Box>

                    <br />

                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          variant="standard"
                          sx={{
                            minWidth: "100%",
                          }}
                          error={!!errors?.typeOfUsageId}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="typeOfUsageId" required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                style={{ variant: "standard" }}
                                label={
                                  <FormattedLabel id="typeOfUsageId" required />
                                }
                                fullWidth
                                value={field.value}
                                onChange={(value) => {
                                  console.log("value", value);
                                  field.onChange(value);
                                }}
                              >
                                {usageTypes &&
                                  usageTypes?.map((val, index) => (
                                    <MenuItem key={index} value={val.id}>
                                      {language == "en"
                                        ? val.nameOfUsage
                                        : val.nameOfUsageMr}
                                      {/* {val.nameOfUsage} */}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="typeOfUsageId"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.typeOfUsageId
                              ? errors?.typeOfUsageId?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          autoFocus
                          sx={{ width: "100%" }}
                          id="standard-basic"
                          variant="standard"
                          label={<FormattedLabel id="parishishtha" required />}
                          {...register("parishishtha")}
                          error={!!errors.parishishtha}
                          helperText={
                            errors?.parishishtha
                              ? errors.parishishtha.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          autoFocus
                          sx={{ width: "100%" }}
                          id="standard-basic"
                          variant="standard"
                          label={
                            <FormattedLabel id="buildingHeightFrom" required />
                          }
                          {...register("buildingHeightFrom")}
                          error={!!errors.buildingHeightFrom}
                          helperText={
                            errors?.buildingHeightFrom
                              ? errors.buildingHeightFrom.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          autoFocus
                          sx={{ width: "100%" }}
                          id="standard-basic"
                          variant="standard"
                          label={
                            <FormattedLabel id="buildingHeightTo" required />
                          }
                          {...register("buildingHeightTo")}
                          error={!!errors.buildingHeightTo}
                          helperText={
                            errors?.buildingHeightTo
                              ? errors.buildingHeightTo.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          autoFocus
                          sx={{ width: "100%" }}
                          id="standard-basic"
                          variant="standard"
                          label={
                            <FormattedLabel id="preminumPerSqm" required />
                          }
                          {...register("preminumPerSqm")}
                          error={!!errors.preminumPerSqm}
                          helperText={
                            errors?.preminumPerSqm
                              ? errors.preminumPerSqm.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          autoFocus
                          sx={{ width: "100%" }}
                          id="standard-basic"
                          variant="standard"
                          label={
                            <FormattedLabel id="preminumMinimumRate" required />
                          }
                          {...register("preminumMinimumRate")}
                          error={!!errors.preminumMinimumRate}
                          helperText={
                            errors?.preminumMinimumRate
                              ? errors.preminumMinimumRate.message
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
                                "/FireBrigadeSystem/masters/buildingRateChart",
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
            {<FormattedLabel id="buildingRateChart" />}
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
      {/* <Box style={{ display: "flex" }}>
        <Box className={styles.tableHead}>
          <Box
            className={styles.h2Tag}
            sx={{
              // marginRight: 30,
              borderRadius: 10,
              // marginTop: 1
              margin: "5px 220px 5px 5px",
              padding: "0px 3px 0px 3px",
            }}
          >
            <BreadcrumbComponent />
          </Box>
          <Box className={styles.h1Tag}>
            {<FormattedLabel id='buildingRateChart' />}
          </Box>
        </Box>
        <Box>
          <Button
            variant='contained'
            type='primary'
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
      </Box> */}

      {/* <Box
        style={{
          display: "flex",
        }}
      >
        <Box className={styles.tableHead}>
          <Box className={styles.h2Tag}>
            <div>
              <BreadcrumbComponent />
            </div>
          </Box>
          <Box
            className={styles.h1Tag}
            sx={{
              paddingLeft: 2,
            }}
          >
            {<FormattedLabel id='buildingRateChart' />}
          </Box>
        </Box>
        <Box
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant='contained'
            type='primary'
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
              border: "2px solid #3498DB",
            }}
          >
            <AddIcon />
          </Button>
        </Box>
      </Box> */}

      {loadderState && <Loader />}
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
              // transform: "scale(1.1)",
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
