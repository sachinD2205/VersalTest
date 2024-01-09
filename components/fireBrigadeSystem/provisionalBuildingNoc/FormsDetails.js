import { Visibility } from "@mui/icons-material";
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
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../styles/fireBrigadeSystem/view.module.css";
// 
/** Sachin Durge */
// FormsDetials
const FormsDetails = ({ view = false, readOnly = false }) => {
  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const [tank, setTank] = useState();
  const [fetchData, setFetchData] = useState(null);
  const language = useSelector((state) => state?.labels.language);
  const router = useRouter();
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [dataSourcee, setDataSourcee] = useState([]);
  const [currentFormId, setCurrentFormId] = useState(null);
  const [isOpenProperty, setIsOpenProperty] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [buttonInputState, setButtonInputStates] = useState();
  const [isOpenWaterTank, setIsOpenWaterTank] = useState(false);
  const [slideCheckedT, setSlideCheckedT] = useState(false);
  const [buttonInputStateT, setButtonInputStateT] = useState();
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [viewButtonInputState, setViewButtonInputState] = useState(false);
  const [viewButtonInputStateT, setViewButtonInputStateT] = useState(false);
  const [roadWidth, setRoadWidth] = useState([]);
  let cnt = 0;

  // columns
  const columns = [
    {
      field: "srNo",
      headerName: "Sr No.",
      flex: 1,
    },
    {
      field: "length",
      headerName: "Length",
      flex: 1,
    },
    {
      field: "height",
      headerName: "Height",
      flex: 1,
    },
    {
      field: "breadth",
      headerName: "Breadth",
      flex: 1,
    },
    {
      field: "capacity",
      headerName: "Capacity",
      flex: 1,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        console.log("params", params.row);
        return (
          <>
            <IconButton
              disabled={viewButtonInputStateT}
              onClick={() => {
                setIsOpenCollapse(false),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                setViewButtonInputStateT(true);
                setDeleteButtonState(true);
                reset(params.row);
              }}
            >
              <Visibility />
            </IconButton>

            {!view && (
              <IconButton
                className={styles.edit}
                disabled={editButtonInputState}
                onClick={() => {
                  setIsOpenWaterTank(false),
                    setBtnSaveText("Update"),
                    setID(params.row.id),
                    setIsOpenWaterTank(true),
                    setSlideChecked(true);
                  setButtonInputState(true);
                  setEditButtonInputState(true);
                  setDeleteButtonState(true);
                  reset(params.row);
                }}
              >
                <EditIcon />
              </IconButton>
            )}
            {!view && (
              <IconButton
                className={styles.delete}
                disabled={deleteButtonInputState}
                onClick={() => deleteById(params.id)}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </>
        );
      },
    },
  ];

  // columnss
  const columnss = [
    {
      field: "srNo",
      headerName: "Sr No.",
      flex: 1,
    },
    {
      field: "propertyNo",
      headerName: "Property No.",
      flex: 1,
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        console.log("params", params.row);
        return (
          <>
            <IconButton
              disabled={viewButtonInputState}
              onClick={() => {
                setIsOpenProperty(false),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                setViewButtonInputState(true);
                setDeleteButtonState(true);
                reset(params.row);
              }}
            >
              <Visibility />
            </IconButton>

            {!view && (
              <IconButton
                className={styles.edit}
                disabled={editButtonInputState}
                onClick={() => {
                  setIsOpenWaterTank(false),
                    setBtnSaveText("Update"),
                    setID(params.row.id),
                    setIsOpenWaterTank(true),
                    setSlideChecked(true);
                  setButtonInputState(true);
                  setEditButtonInputState(true);
                  setDeleteButtonState(true);
                  reset(params.row);
                }}
              >
                <EditIcon />
              </IconButton>
            )}

            {!view && (
              <IconButton
                className={styles.delete}
                disabled={deleteButtonInputState}
                onClick={() => deleteById(params.id)}
              >
                <DeleteIcon />
              </IconButton>
            )}
            {!view && (
              <IconButton>
                <Visibility />
              </IconButton>
            )}
          </>
        );
      },
    },
  ];

  // getRoadWidth
  const getRoadWidth = () => {
    axios
      .get(`${urls.FbsURL}/master/accessRoadWidth/getAll`)
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          setRoadWidth(res?.data?.accessRoadWidth);
        } else {
         //
        }
      })
      .catch((error) => {
        console.log(error);
       //
      });
  };

  // savePropertyDetails
  const savePropertyDetails = () => {
    const propertyDTLDao = {
      propertyNo: getValues("propertyNo"),
    };

    const formDTLDao = {
      id: currentFormId,
      propertyDTLDao: [...dataSource, propertyDTLDao],
    };

    //
    const body = {
      ...getValues("prevData"),
      id: localStorage.getItem("pNocId"),
      formDTLDao,
    };

    // post
    axios
      .post(`${urls.FbsURL}/transaction/provisionalBuildingFireNOC/save`, body)
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          let appId = res?.data?.status?.split("$")[1];
          const tempData = axios
            .get(`${urls.FbsURL}/transaction/provisionalBuildingFireNOC/getById?appId=${appId}`)
            .then((res) => {
              if (res?.status == 200 || res?.status == 201) {
                setDataSourcee(
                  res?.data?.formDTLDao?.propertyDTLDao.map((o, i) => {
                    return {
                      srNo: i + 1,
                      ...o,
                    };
                  }),
                );
                setValue("prevData", res.data);
                setValue("nocId", res.data.id);
                setCurrentFormId(res.data.formDTLDao.id);
                setValue("formId", res.data.formDTLDao.id);
                setValue("ownerDTLDao", res.data.ownerDTLDao);
                setValue("applicantDTLDao", res.data.applicantDTLDao);
                setValue("propertyDTLDao", res.data.propertyDTLDao);
                setValue("applicantDTLDao", res.data.applicantDTLDao);
                setValue("buildingDTLDao", res.data.buildingDTLDao);
                setValue("attachments", res.data.attachments);
              } else {
               //
              }
            })
            .catch((error) => {
             //
              console.log("error", error);
            });
          sweetAlert("Saved!", "Record Saved successfully !", "success");
          setFetchData(tempData);
          setButtonInputStates(false);
          setIsOpenProperty(false);
        } else {
         //
        }
      })
      .catch((error) => {
        console.log("error", error);
       //
      });
  };

  // saveTankDetails
  const saveTankDetails = () => {
    cnt = cnt + 1;
    const underGroundWaterTankDao = {
      srNo: cnt,
      length: getValues("length"),
      breadth: getValues("breadth"),
      height: getValues("height"),
      capacity: getValues("capacity"),
    };
    const formDTLDao = {
      id: currentFormId,
      isPlanhaveUnderGroundWaterTank: tank,
      underGroundWaterTankDao: [...dataSource, underGroundWaterTankDao],
    };

    const body = {
      ...getValues("prevData"),
      id: localStorage.getItem("pNocId"),
      formDTLDao,
    };

    axios
      .post(`${urls.FbsURL}/transaction/provisionalBuildingFireNOC/save`, body)
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          let appId = res?.data?.status?.split("$")[1];
          const tempData = axios
            .get(`${urls.FbsURL}/transaction/provisionalBuildingFireNOC/getById?appId=${appId}`)
            .then((res) => {
              if (res?.status == 200 || res?.status == 201) {
                setDataSource(
                  res?.data?.formDTLDao?.underGroundWaterTankDao.map((o, i) => {
                    return {
                      srNo: i + 1,
                      ...o,
                    };
                  }),
                );
                setCurrentFormId(res.data.formDTLDao.id);
                setValue("prevData", res.data);
                setValue("id", res.data.id);
                setValue("ownerDTLDao", res.data.ownerDTLDao);
                setValue("formDTLDao", res.data.formDTLDao);
                setValue("formId", res.data.formDTLDao.id);
                setValue("applicantDTLDao", res.data.applicantDTLDao);
                setValue("buildingDTLDao", res.data.buildingDTLDao);
                setValue("attachments", res.data.attachments);
              } else {
               //
              }
            })
            .catch((error) => {
             //
              console.log("error", error);
            });
          sweetAlert("Saved!", "Record Saved successfully !", "success");
          setButtonInputStateT(false);
          setIsOpenWaterTank(false);
          setFetchData(tempData);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
          resetValuesOnSave();
        } else {
         //
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  // deleteById
  const deleteById = (value) => {
    swal({
      title: "Delete?",
      text: "Are you sure you want to delete this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          axios.delete(`${urls.FbsURL}/businessSubType/discardBusinessSubType/${value}`).then((res) => {
            if (res?.status == 226) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              setButtonInputState(false);
            }
          });
        } else {
          swal("Record is Safe");
        }
      })
      .catch((error) => {
       //
        console.log("error", error);
      });
  };

  // cancellButton
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // resetValuesCancell
  const resetValuesCancell = {
    appliedFor: "",
    architectName: "",
    architectFirmName: "",
    architectRegistrationNo: "",
    applicantPermanentAddress: "",
    siteAddress: "",
    applicantContactNo: "",
    finalPlotNo: "",
    revenueSurveyNo: "",
    buildingLocation: "",
    townPlanningNo: "",
    blockNo: "",
    opNo: "",
    citySurveyNo: "",
    typeOfBuilding: "",
  };

  // resetValuesExit
  const resetValuesExit = {
    appliedFor: "",
    architectName: "",
    architectFirmName: "",
    architectRegistrationNo: "",
    applicantPermanentAddress: "",
    siteAddress: "",
    applicantContactNo: "",
    finalPlotNo: "",
    revenueSurveyNo: "",
    buildingLocation: "",
    townPlanningNo: "",
    blockNo: "",
    opNo: "",
    citySurveyNo: "",
    typeOfBuilding: "",
  };

  // resetValuesOnSave
  const resetValuesOnSave = () => {
    reset({
      ...resetValues,
      id,
    });
  };

  // exitFunction
  const exitFunction = () => {
    setButtonInputStates(false);
    setIsOpenProperty(false);
    setSlideChecked(true);
  };

  // exitFunctionT
  const exitFunctionT = () => {
    setSlideCheckedT(true);
    setButtonInputStateT(false);
    setIsOpenWaterTank(false);
  };

  // resetValues
  const resetValues = {
    formName: "",
    ownerName: "",
    ownerNameMr: "",
    ownerMiddleNameMr: "",
  };

  // ================================>

  useEffect(() => {
    getRoadWidth();
  }, []);

  useEffect(() => {
    console.log("777777", getValues("nocId"), watch("nocId"));
    if (getValues("formDTLDao.id")) {
      setCurrentFormId(getValues("formDTLDao.id"));
    }
  }, [roadWidth]);

  useEffect(() => {}, [isOpenProperty]);

  useEffect(() => {
    if (getValues("formDTLDao.underGroundWaterTankDao")?.length > 0) {
      setDataSource(getValues("formDTLDao.underGroundWaterTankDao"));
    }
  }, [fetchData]);

  // View
  return (
    <>
      {/** FormDetailsFirstPart */}
      <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="firmName" />}
            variant="standard"
            {...register("formDTLDao.formName")}
            error={!!errors.formName}
            helperText={errors?.formName ? errors.formName.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label="Final plot no"
            variant="standard"
            {...register("formDTLDao.finalPlotNo")}
            error={!!errors.finalPlotNo}
            helperText={errors?.finalPlotNo ? errors.finalPlotNo.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label="Plot Area In Square Meter"
            variant="standard"
            {...register("formDTLDao.plotAreaSquareMeter")}
            error={!!errors.plotAreaSquareMeter}
            helperText={errors?.plotAreaSquareMeter ? errors.plotAreaSquareMeter.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label="Construction Area In Square Meter"
            variant="standard"
            {...register("formDTLDao.constructionAreSqMeter")}
            error={!!errors.constructionAreSqMeter}
            helperText={errors?.constructionAreSqMeter ? errors.constructionAreSqMeter.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label="No. of Approched Road"
            variant="standard"
            {...register("formDTLDao.noOfApprochedRoad")}
            error={!!errors.noOfApprochedRoad}
            helperText={errors?.noOfApprochedRoad ? errors.noOfApprochedRoad.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="highTensionLine" />}
            variant="standard"
            {...register("formDTLDao.highTensionLine")}
            error={!!errors.highTensionLine}
            helperText={errors?.highTensionLine ? errors.highTensionLine.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <FormControl sx={{ width: "80%" }}>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              {<FormattedLabel id="previouslyAnyFireNocTaken" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  name="previouslyAnyFireNocTaken"
                  fullWidth
                  size="small"
                  variant="standard"
                >
                  <MenuItem value={1}>Yes</MenuItem>
                  <MenuItem value={2}>No</MenuItem>
                  <MenuItem value={3}>Revised</MenuItem>
                </Select>
              )}
              name="formDTLDao.previouslyAnyFireNocTaken"
              control={control}
              defaultValue=""
            />
          </FormControl>
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="underTheGroundWaterTankCapacityLighter" />}
            variant="standard"
            {...register("formDTLDao.underTheGroundWaterTankCapacityLitre")}
            error={!!errors.underTheGroundWaterTankCapacityLitre}
            helperText={
              errors?.underTheGroundWaterTankCapacityLitre
                ? errors.underTheGroundWaterTankCapacityLitre.message
                : null
            }
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <FormControl variant="standard" sx={{ width: "80%" }} error={!!errors.businessType}>
            <InputLabel id="demo-simple-select-standard-label">Access road Width</InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="List"
                  error={!!errors.typeOfBuilding}
                  helperText={errors?.typeOfBuilding ? errors.typeOfBuilding.message : null}
                >
                  {roadWidth &&
                    roadWidth.map((type, index) => (
                      <MenuItem key={index} value={type.id}>
                        {type.accessWidth}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="formDTLDao.accessRoadWidth"
              control={control}
              defaultValue=""
            />
            <FormHelperText>{errors?.typeOfBuilding ? errors.typeOfBuilding.message : null}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="revenueSurveyNo" />}
            variant="standard"
            {...register("formDTLDao.revenueSurveyNo")}
            error={!!errors.revenueSurveyNo}
            helperText={errors?.revenueSurveyNo ? errors.revenueSurveyNo.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            label={<FormattedLabel id="blockNo" />}
            variant="standard"
            {...register("formDTLDao.blockNo")}
            error={!!errors.blockNo}
            helperText={errors?.blockNo ? errors.blockNo.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            // label={<FormattedLabel id="opNo" />}
            label="dp op no"
            variant="standard"
            {...register("formDTLDao.dpOpNo")}
            error={!!errors.dpOpNo}
            helperText={errors?.dpOpNo ? errors.dpOpNo.message : null}
          />
        </Grid>
        <Grid item xs={4} className={styles.feildres}>
          <TextField
            disabled={readOnly}
            sx={{ width: "80%" }}
            id="standard-basic"
            // label={<FormattedLabel id="citySurveyNo" />}
            label="Site Address"
            variant="standard"
            {...register("formDTLDao.siteAddress")}
            error={!!errors.siteAddress}
            helperText={errors?.siteAddress ? errors.siteAddress.message : null}
          />
        </Grid>

        <Grid item xs={4} className={styles.feildres}></Grid>
        <Grid item xs={4} className={styles.feildres}></Grid>
      </Grid>

      {/** Property Details */}
      <Grid item xs={12} sx={{ margin: "6%" }}>
        <div>
          <Box
            style={{
              display: "flex",
            }}
          >
            <Box className={styles.tableHead}>
              <Box className={styles.h1Tag}>Property Details</Box>
            </Box>
            {!view && (
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
                    setButtonInputStates(true);
                    setSlideChecked(true);
                    setIsOpenProperty(true);
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
            )}
          </Box>

          {/** Property Details */}
          {isOpenProperty && (
            <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
              <div>
                <Box
                  style={{
                    margin: "3vh 0vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Paper
                    sx={{
                      // margin: 1,
                      padding: 2,
                      // backgroundColor: "#F5F5F5",
                    }}
                    elevation={5}
                  >
                    <Box className={styles.tableHead}>
                      <Box className={styles.feildHead}>
                        {btnSaveText == "Update" ? "Update Property Details" : "Property Details"}
                      </Box>
                    </Box>
                    <br />
                    <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={readOnly}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label="Property No."
                          variant="standard"
                          {...register("propertyNo")}
                          error={!!errors.volumeLBHIn}
                          helperText={errors?.volumeLBHIn ? errors.volumeLBHIn.message : null}
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                    </Grid>
                    <br />
                    <br />

                    <div></div>

                    <Grid container className={styles.feildres} spacing={2}>
                      <Grid item>
                        {!viewButtonInputState && (
                          <Button
                            size="small"
                            variant="outlined"
                            className={styles.button}
                            endIcon={<SaveIcon />}
                            onClick={() => {
                              savePropertyDetails();
                            }}
                          >
                            {btnSaveText == "Update" ? (
                              <FormattedLabel id="update" />
                            ) : (
                              <FormattedLabel id="save" />
                            )}
                          </Button>
                        )}
                      </Grid>
                      <Grid item>
                        {!viewButtonInputState && (
                          <Button
                            size="small"
                            variant="outlined"
                            className={styles.button}
                            endIcon={<ClearIcon />}
                            onClick={() => cancellButton()}
                          >
                            {<FormattedLabel id="clear" />}
                          </Button>
                        )}
                      </Grid>
                      <Grid item>
                        <Button
                          size="small"
                          variant="outlined"
                          className={styles.button}
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitFunction()}
                        >
                          {<FormattedLabel id="exit" />}
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
              </div>
            </Slide>
          )}

          {/** PropertyDetailsTable */}
          <Box>
            <DataGrid
              getRowId={(row) => row.srNo}
              disableColumnFilter
              disableColumnSelector
              disableExport
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                  printOptions: { disableToolbarButton: true },
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
                "& .MuiDataGrid-cell:hover": {},
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#E1FDFF",
                },
                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#87E9F7",
                },
              }}
              rows={dataSourcee}
              columns={columnss}
              pageSize={7}
              rowsPerPageOptions={[7]}
            />
          </Box>
        </div>
      </Grid>

      {/** WaterTankDetails */}

      <Grid item xs={4} sx={{ margin: "6%" }}>
        <FormControl component="fieldset" sx={{ marginTop: "8%" }}>
          <FormLabel component="legend">Is Plan have Common Underground Water Tank</FormLabel>
          <Controller
            rules={{ required: true }}
            control={control}
            name="formDTLDao.isPlanhaveUnderGroundWaterTank"
            render={({ field }) => (
              <RadioGroup {...field}>
                <FormControlLabel
                  value="Y"
                  control={<Radio />}
                  label="Yes"
                  onChange={(value) => {
                    console.log("value", value.target.value);
                    setTank(value.target.value);
                  }}
                />
                <FormControlLabel
                  value="No"
                  control={<Radio />}
                  label="No"
                  onChange={(value) => {
                    console.log("value", value.target.value);
                    setTank(value.target.value);
                  }}
                />
              </RadioGroup>
            )}
          />
        </FormControl>

        {tank == "Y" && (
          <div>
            <Box style={{ display: "flex", marginTop: "5%" }}>
              <Box className={styles.tableHead}>
                <Box className={styles.h1Tag}>Tank Details</Box>
              </Box>
              {!view && (
                <Box>
                  <Button
                    variant="contained"
                    type="primary"
                    disabled={buttonInputStateT}
                    onClick={() => {
                      reset({
                        ...resetValuesExit,
                      });
                      setEditButtonInputState(true);
                      setDeleteButtonState(true);
                      setBtnSaveText("Save");
                      setButtonInputStateT(true);
                      setSlideCheckedT(true);
                      setIsOpenWaterTank(true);
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
              )}
            </Box>
            {isOpenWaterTank && (
              <Slide direction="down" in={slideCheckedT} mountOnEnter unmountOnExit>
                <div>
                  <Box
                    style={{
                      margin: "3vh 0vh",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Paper
                      sx={{
                        // margin: 1,
                        padding: 2,
                        // backgroundColor: "#F5F5F5",
                      }}
                      elevation={5}
                    >
                      <Box className={styles.tableHead}>
                        <Box className={styles.feildHead}>
                          {btnSaveText == "Update" ? "Update Floor Details" : " Tank Details"}
                        </Box>
                      </Box>
                      <br />
                      <Grid container columns={{ xs: 4, sm: 8, md: 12 }} className={styles.feildres}>
                        <Grid item xs={4} className={styles.feildres}>
                          <TextField
                            disabled={(viewButtonInputStateT, readOnly)}
                            sx={{ width: "80%" }}
                            id="standard-basic"
                            label="L"
                            variant="standard"
                            {...register("length")}
                            error={!!errors.volumeLBHIn}
                            helperText={errors?.volumeLBHIn ? errors.volumeLBHIn.message : null}
                          />
                        </Grid>

                        <Grid item xs={4} className={styles.feildres}>
                          <TextField
                            disabled={(viewButtonInputStateT, readOnly)}
                            sx={{ width: "80%" }}
                            id="standard-basic"
                            label="B"
                            variant="standard"
                            {...register("breadth")}
                            error={!!errors.volumeLBHIn}
                            helperText={errors?.volumeLBHIn ? errors.volumeLBHIn.message : null}
                          />
                        </Grid>
                        <Grid item xs={4} className={styles.feildres}>
                          <TextField
                            disabled={(viewButtonInputStateT, readOnly)}
                            sx={{ width: "80%" }}
                            id="standard-basic"
                            label="height"
                            variant="standard"
                            {...register("height")}
                            error={!!errors.volumeLBHIn}
                            helperText={errors?.volumeLBHIn ? errors.volumeLBHIn.message : null}
                          />
                        </Grid>
                        <Grid item xs={4} className={styles.feildres}>
                          <TextField
                            disabled={(viewButtonInputStateT, readOnly)}
                            sx={{ width: "80%" }}
                            id="standard-basic"
                            label="Capacity"
                            variant="standard"
                            {...register("capacity")}
                            error={!!errors.volumeLBHIn}
                            helperText={errors?.volumeLBHIn ? errors.volumeLBHIn.message : null}
                          />
                        </Grid>
                        <Grid item xs={4} className={styles.feildres}></Grid>
                        <Grid item xs={4} className={styles.feildres}></Grid>
                      </Grid>
                      <br />
                      <br />
                      <div></div>
                      <Grid container className={styles.feildres} spacing={2}>
                        <Grid item>
                          <Button
                            size="small"
                            variant="outlined"
                            className={styles.button}
                            endIcon={<SaveIcon />}
                            onClick={() => {
                              saveTankDetails();
                            }}
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
                            onClick={() => exitFunctionT()}
                          >
                            {<FormattedLabel id="exit" />}
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Box>
                </div>
              </Slide>
            )}
            {/** TankDetailsTable */}
            <Box>
              <DataGrid
                getRowId={(row) => row.srNo}
                disableColumnFilter
                disableColumnSelector
                disableExport
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                    printOptions: { disableToolbarButton: true },
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
                  "& .MuiDataGrid-cell:hover": {},
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
          </div>
        )}
      </Grid>

      <br />
      <br />
      <br />
    </>
  );
};

export default FormsDetails;
