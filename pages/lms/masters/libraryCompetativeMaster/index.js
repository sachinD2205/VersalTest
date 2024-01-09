import {
  Button,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  IconButton,
} from "@mui/material";
import { Paper } from "@mui/material";
import { DataGrid, GridCell, GridRow } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import styles from "../libraryCompetativeMaster/view.module.css";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Slide } from "@mui/material";
import { TextField } from "@mui/material";
import { FormControl } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { FormHelperText } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "../../../../containers/schema/libraryManagementSystem/libraryCompetativeMaster";
import urls from "../../../../URLS/urls";
import sweetAlert from "sweetalert";
import axios from "axios";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const LibraryCompetativeMaster = () => {
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const token = useSelector((state) => state.user.user.token);
  const language = useSelector((state) => state?.labels?.language);

  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };

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

  useEffect(() => {
    getTableData;
  }, []);

  const getTableData = () => {
    axios
      .get(
        `${urls.BaseURL}/competativeStudyMaster/getCompetativeStudyCenterMasterData`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        setDataSource(
          res.data.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            libraryPrefix: r.libraryPrefix,
            studyCenterName: r.studyCenterName,
            serviceName: r.serviceName,
            radioValue: r.radioValue,
            intake: r.intake,
            addressLocation: r.addressLocation,
            gisId: r.gisId,
            contactPerson: r.contactPerson,
            contactNumber: r.contactNumber,
            remark: r.remark,
          }))
        );
      })
      .catch((error) => {
        // setLoading(false);
        callCatchMethod(error, language);
      });
  };

  const onSubmitForm = (formData) => {
    const finalBodyForApi = {
      ...formData,
    };
    // Save - DB
    axios
      .post(
        `${urls.BaseURL}/competativeStudyMaster/saveCompetativeStudyCenterMaster`,
        finalBodyForApi,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getTableData();
          setButtonInputState(false);
          setIsOpenCollapse(true);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      })
      .catch((error) => {
        // setLoading(false);
        callCatchMethod(error, language);
      });
  };

  const deleteById = (value) => {
    swal({
      title: "Delete?",
      text: "Are you sure you want to delete this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `${urls.BaseURL}/competativeStudyMaster/discardCompetativeStudyCenterMaster/${value}`
          )
          .then((res) => {
            if (res.status == 226) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              setButtonInputState(false);
              getTableData();
            }
          })
          .catch((error) => {
            // setLoading(false);
            callCatchMethod(error, language);
          });
      } else {
        swal("Record is Safe");
      }
    });
  };

  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
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

  const resetValuesCancell = {
    libraryPrefix: "",
    studyCenterName: "",
    serviceName: "",
    intake: "",
    addressLocation: "",
    gisId: "",
    contactNumber: "",
    contactPerson: "",
    radioValue: "",
    remark: "",
  };

  const resetValuesExit = {
    libraryPrefix: "",
    studyCenterName: "",
    serviceName: "",
    intake: "",
    addressLocation: "",
    gisId: "",
    contactNumber: "",
    contactPerson: "",
    radioValue: "",
    remark: "",
    id: null,
  };
  const rows = [];

  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      flex: 3,
    },

    { field: "libraryPrefix", headerName: "Library Prefix", flex: 3 },
    {
      field: "studyCenterName",
      headerName: "Library/Competitative Study Center Name",
      //type: "number",
      flex: 3,
    },
    {
      field: "serviceName",
      headerName: "Service Name",
      // type: "number",
      flex: 3,
    },
    {
      field: "radioValue",
      headerName: "Radio Value",
      // type: "number",
      flex: 3,
    },
    {
      field: "intake",
      headerName: "Intake",
      // type: "number",
      flex: 3,
    },
    {
      field: "addressLocation",
      headerName: "Address Location",
      // type: "number",
      flex: 3,
    },
    {
      field: "gisId",
      headerName: "GIS ID",
      // type: "number",
      flex: 3,
    },
    {
      field: "contactPerson",
      headerName: "Contact Person",
      //type: "number",
      flex: 3,
    },

    {
      field: "contactNumber",
      headerName: "Contact Number",
      //type: "number",
      flex: 3,
    },
    {
      field: "remark",
      headerName: "Remark",
      //type: "number",
      flex: 3,
    },
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
      <BasicLayout>
        <Paper
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginTop: 5,
            marginBottom: 5,
            padding: 1,
          }}
        >
          {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <div>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmitForm)}>
                    <Grid
                      container
                      spacing={2}
                      columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                      style={{ justifyContent: "center", marginTop: "1vh" }}
                      columns={16}
                    >
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Library Prefix *"
                          variant="standard"
                          {...register("libraryPrefix")}
                          error={!!errors.libraryPrefix}
                          helperText={
                            errors?.libraryPrefix
                              ? errors.libraryPrefix.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Library/Competitative Study Center Name *"
                          variant="standard"
                          {...register("studyCenterName")}
                          error={!!errors.studyCenterName}
                          helperText={
                            errors?.studyCenterName
                              ? errors.studyCenterName.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Service Name *"
                          variant="standard"
                          {...register("serviceName")}
                          error={!!errors.serviceName}
                          helperText={
                            errors?.serviceName
                              ? errors.serviceName.message
                              : null
                          }
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      spacing={2}
                      columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                      style={{ justifyContent: "center", marginTop: "1vh" }}
                      columns={16}
                    >
                      <Grid item xl={10} lg={10} md={10} sm={12} xs={12}>
                        <FormControl>
                          <RadioGroup
                            style={{ marginTop: 30 }}
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            row
                          >
                            <FormControlLabel
                              value="Library/Competitative Study Center Name"
                              control={<Radio />}
                              label="Library/Competitative Study Center Name"
                              name="RadioButton"
                              {...register("radioValue")}
                              error={!!errors.radioValue}
                              helperText={
                                errors?.radioValue
                                  ? errors.radioValue.message
                                  : null
                              }
                            />
                            <FormControlLabel
                              style={{ marginLeft: 50 }}
                              value="Granted/Non Granted"
                              control={<Radio />}
                              label="Granted/Non Granted"
                              name="RadioButton"
                              {...register("radioValue")}
                              error={!!errors.radioValue}
                              helperText={
                                errors?.radioValue
                                  ? errors.radioValue.message
                                  : null
                              }
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>

                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Intake *"
                          variant="standard"
                          {...register("intake")}
                          error={!!errors.intake}
                          helperText={
                            errors?.intake ? errors.intake.message : null
                          }
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      spacing={2}
                      columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                      style={{ justifyContent: "center", marginTop: "1vh" }}
                      columns={16}
                    >
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Address Location *"
                          variant="standard"
                          {...register("addressLocation")}
                          error={!!errors.addressLocation}
                          helperText={
                            errors?.addressLocation
                              ? errors.addressLocation.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="GIS ID *"
                          variant="standard"
                          {...register("gisId")}
                          error={!!errors.gisId}
                          helperText={
                            errors?.gisId ? errors.gisId.message : null
                          }
                        />
                      </Grid>
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Contact Person *"
                          variant="standard"
                          {...register("contactPerson")}
                          error={!!errors.contactPerson}
                          helperText={
                            errors?.contactPerson
                              ? errors.contactPerson.message
                              : null
                          }
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      spacing={2}
                      columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                      style={{ justifyContent: "center", marginTop: "1vh" }}
                      columns={16}
                    >
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Contact Number *"
                          variant="standard"
                          {...register("contactNumber")}
                          error={!!errors.contactNumber}
                          helperText={
                            errors?.contactNumber
                              ? errors.contactNumber.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Remarks *"
                          variant="standard"
                          {...register("remark")}
                          error={!!errors.remark}
                          helperText={
                            errors?.remark ? errors.remark.message : null
                          }
                        />
                      </Grid>
                    </Grid>

                    <div className={styles.btn}>
                      <div className={styles.btn1}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="success"
                          endIcon={<SaveIcon />}
                          // onClick={() => onSubmitForm()}
                        >
                          {btnSaveText}
                        </Button>{" "}
                      </div>
                      <div className={styles.btn1}>
                        <Button
                          variant="contained"
                          color="primary"
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                        >
                          Clear
                        </Button>
                      </div>
                      <div className={styles.btn1}>
                        <Button
                          variant="contained"
                          color="error"
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitButton()}
                        >
                          Exit
                        </Button>
                      </div>
                    </div>
                  </form>
                </FormProvider>
              </div>
            </Slide>
          )}

          <div className={styles.addbtn}>
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
          </div>
          <DataGrid
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
          />
        </Paper>
      </BasicLayout>
    </>
  );
};
export default LibraryCompetativeMaster;
