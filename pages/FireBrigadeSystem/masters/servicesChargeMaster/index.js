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
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/fireBrigadeSystem/servicesChargeMaster";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";
import { GridToolbar } from "@mui/x-data-grid";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import Loader from "../../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useSelector } from "react-redux";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const userToken = useGetToken();
  const language = useSelector((state) => state?.labels.language);

  // dropdown
  const [age, setAge] = React.useState("");

  const router = useRouter();

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  //...
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
  const [isDisabled, setIsDisabled] = useState(true);
  const [businessTypes, setBusinessTypes] = useState([]);
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
  useEffect(() => {
    getCourt();
  }, [fetchData]);

  // Get Table - Data
  //   http://localhost:8098/lc/api/court/getCourtData
  const getCourt = () => {
    // axios
    //   .get(``)
    //   .then((res) => {
    //     setDataSource(
    //     //   res.data.map((r, i) => ({
    //     //     id: r.id,
    //     //     srNo: i + 1,
    //     //     courtNo: r.courtNo,
    //     //     courtName: r.courtName,
    //     //     area: r.area,
    //     //     roadName: r.roadName,
    //     //     landmark: r.landmark,
    //     //     city: r.city,
    //     //     pinCode: r.pinCode,
    //     //   }))
    //     );
    //   });
  };

  // OnSubmit Form
  // const onSubmitForm = (fromData) => {
  //   console.log("Form Data ", fromData.data);
  //   // let bodyForApi = {
  //   //   ...fromData,
  //   // };

  //   // Save - DB
  //   // http://localhost:8098/lc/api/court/saveCourt
  //   if (btnSaveText === "Save") {
  //     console.log("Save Clicked !!!!");
  //     const tempData = axios
  //       // .post(`${urls.BaseURL}/religionMaster/saveReligionMaster`, fromData)
  //       .post(``, fromData)
  //       .then((res) => {
  //         if (res.status == 200) {
  //           // message.success("Data Saved !!!");
  //           sweetAlert("Saved!", "Record Saved successfully !", "success");
  //           setButtonInputState(false);
  //           setIsOpenCollapse(false);
  //           setFetchData(tempData);
  //           setEditButtonInputState(false);
  //           setDeleteButtonState(false);
  //         }
  //       });
  //   }
  //   // Update Data Based On ID
  //   //   http://localhost:8098/lc/api/court/editCourt
  //   else if (btnSaveText === "Update") {
  //     console.log("Update ---");
  //     const tempData = axios.put(``, fromData).then((res) => {
  //       if (res.status == 200) {
  //         // message.success("Data Updated !!!");
  //         sweetAlert("Updated!", "Record Updated successfully !", "success");

  //         setButtonInputState(false);
  //         setIsOpenCollapse(false);
  //         setFetchData(tempData);
  //       }
  //     });
  //   }
  // };
  const onSubmitForm = (fromData) => {
    console.log("Form Data ", fromData);
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
        console.log(res);
        if (res.status == 201) {
          fromData.id
            ? sweetAlert("Update!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setFetchData(tempData);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      });
  };

  // Delete By ID
  //   http://localhost:8098/lc/api/court/discardCourt/${value}
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
          .delete(``, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((res) => {
            if (res.status == 226) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getCourt();
              setButtonInputState(false);
            } else {
              swal("Record is Safe");
            }
          });
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
    servicesChargeMaster: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    servicesChargeMaster: "",
  };

  const columns = [
    { field: "serviceName", headerName: "Service Name", flex: 1 },
    { field: "usageType", headerName: "Usage Type", flex: 1 },
    { field: "chargeType", headerName: "Charge Name", flex: 1 },
    { field: "businessType", headerName: "Business Type", flex: 1 },
    { field: "typeOfSelection", headerName: "Type Of Selection", flex: 1 },
    {
      field: "buildingHeightFrom",
      headerName: "Building Height From",
      flex: 1,
    },
    { field: "buildingHeightTo", headerName: "Building Height To", flex: 1 },
    { field: "fromDate", headerName: "From Date", flex: 1 },
    // { field: "courtNo", headerName: "Court No", flex: 1 },

    {
      field: "actions",
      headerName: "Actions",
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
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
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
                        {<FormattedLabel id="serviceChargeMaster" />}
                      </Box>
                    </Box>

                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          variant="standard"
                          sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.businessType}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Service Name *
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Services"
                              >
                                {businessTypes &&
                                  businessTypes.map((businessType, index) => (
                                    <MenuItem
                                      key={index}
                                      value={businessType.id}
                                    >
                                      {businessType.businessType}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="businessType"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.businessType
                              ? errors.businessType.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          variant="standard"
                          sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.businessType}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Usage Type *
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Services"
                              >
                                {businessTypes &&
                                  businessTypes.map((businessType, index) => (
                                    <MenuItem
                                      key={index}
                                      value={businessType.id}
                                    >
                                      {businessType.businessType}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="businessType"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.businessType
                              ? errors.businessType.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="Building Type *"
                          variant="standard"
                          {...register("typeOfBusiness")}
                          error={!!errors.lastName}
                          helperText={
                            errors?.lastName ? errors.lastName.message : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          variant="standard"
                          sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.businessType}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Charge Name *
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Services"
                              >
                                {businessTypes &&
                                  businessTypes.map((businessType, index) => (
                                    <MenuItem
                                      key={index}
                                      value={businessType.id}
                                    >
                                      {businessType.businessType}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="businessType"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.businessType
                              ? errors.businessType.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          variant="standard"
                          sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.businessType}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Business Type *
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Services"
                              >
                                {businessTypes &&
                                  businessTypes.map((businessType, index) => (
                                    <MenuItem
                                      key={index}
                                      value={businessType.id}
                                    >
                                      {businessType.businessType}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="businessType"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.businessType
                              ? errors.businessType.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          variant="standard"
                          sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.businessType}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Operation *
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Services"
                              >
                                {businessTypes &&
                                  businessTypes.map((businessType, index) => (
                                    <MenuItem
                                      key={index}
                                      value={businessType.id}
                                    >
                                      {businessType.businessType}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="businessType"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.businessType
                              ? errors.businessType.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="Building Height From *"
                          variant="standard"
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
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="Builing Height To *"
                          variant="standard"
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
                        <FormControl
                          style={{ marginTop: 10 }}
                          error={!!errors.fromDate}
                          variant="standard"
                        >
                          <Controller
                            control={control}
                            name="fromDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  required
                                  inputFormat="YYYY-DD-MM"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      From Date
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(date) =>
                                    field.onChange(
                                      moment(date, "YYYY-MM-DD").format(
                                        "YYYY-MM-DD"
                                      )
                                    )
                                  }
                                  selected={field.value}
                                  center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size="small"
                                      fullWidth
                                      InputLabelProps={{
                                        style: {
                                          fontSize: 12,
                                          marginTop: 3,
                                        },
                                      }}
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.fromDate ? errors.fromDate.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          style={{ marginTop: 10 }}
                          error={!!errors.fromDate}
                          variant="standard"
                        >
                          <Controller
                            control={control}
                            name="fromDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  required
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      To Date
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(date) =>
                                    field.onChange(
                                      moment(
                                        date,
                                        "YYYY-MM-DD hh:mm:ss a"
                                      ).format("YYYY-MM-DD hh:mm:ss a")
                                    )
                                  }
                                  selected={field.value}
                                  center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size="small"
                                      fullWidth
                                      InputLabelProps={{
                                        style: {
                                          fontSize: 12,
                                          marginTop: 3,
                                        },
                                      }}
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.fromDate ? errors.fromDate.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          variant="standard"
                          sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.businessType}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Depends On *
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: 250 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Services"
                              >
                                {businessTypes &&
                                  businessTypes.map((businessType, index) => (
                                    <MenuItem
                                      key={index}
                                      value={businessType.id}
                                    >
                                      {businessType.businessType}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="businessType"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.businessType
                              ? errors.businessType.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="Rate/Charge *"
                          variant="standard"
                          {...register("typeOfBusiness")}
                          error={!!errors.lastName}
                          helperText={
                            errors?.lastName ? errors.lastName.message : null
                          }
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="Minimum Rate *"
                          variant="standard"
                          {...register("typeOfBusiness")}
                          error={!!errors.lastName}
                          helperText={
                            errors?.lastName ? errors.lastName.message : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <label>Remark</label>
                        <Paper style={{ maxHeight: 250, overflow: "auto" }}>
                          <TextField
                            multiline
                            minRows={3}
                            maxRows={3}
                            sx={{ width: 250 }}
                            id="standard-basic"
                            // label="Remark"
                            // variant="outlined"
                            {...register("businessSubTypePrefix")}
                            error={!!errors.businessSubTypePrefix}
                            helperText={
                              errors?.businessSubTypePrefix
                                ? errors.businessSubTypePrefix.message
                                : null
                            }
                          />
                        </Paper>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
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
                                "/FireBrigadeSystem/masters/servicesChargeMaster",
                            })
                          }
                        >
                          {<FormattedLabel id="exit" />}
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>

                <br />
              </form>
            </FormProvider>
          </div>
        </Slide>
      )}
      {/* <div className={styles.addbtn}>
        <Button
          variant="contained"
          endIcon={<AddIcon />}
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
        >
          Add{" "}
        </Button>
      </div> */}
      <Box style={{ display: "flex" }}>
        <Box className={styles.tableHead}>
          <Box className={styles.h1Tag}>
            {<FormattedLabel id="serviceCharge" />}
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
      {/* <DataGrid
        autoHeight
        sx={{
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5,
          marginBottom: 5,
        }}
        rows={dataSource}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        //checkboxSelection
      /> */}
    </>
  );
};

export default Index;
