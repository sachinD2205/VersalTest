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
import * as yup from "@hookform/resolvers/yup";
import urls from "../../../../URLS/urls";
import sweetAlert from "sweetalert";
import axios from "axios";
import schema from "../../../../containers/schema/libraryManagementSystem/chargeTypeMaster";
import Loader from "../../../../containers/Layout/components/Loader";
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
  const [loading, setLoading] = useState(false);
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
  // let schema = {};
  // let schema = yup.object().shape({
  //     //libraryId: yup.string().required("Library Id is Required !!!"),
  //     libraryPrefix: yup
  //       .string()
  //       .nullable()
  //       .required("Library Prefix is Required !!!"),
  //     studyCenterName: yup.string().required("Study Center Name is Required !!!"),
  //     serviceName: yup.string().required("Service Name is Required !!!"),
  //     intake: yup.string().required("intake is Required !!!"),
  //     addressLocation: yup.string().required("Address Location is Required !!!"),
  //     gisId: yup.string().required("GIS Id is Required !!!"),
  //     contactNumber: yup.string().required("Contact Number is Required !!!"),
  //     contactPerson: yup.string().required("Contact Person is Required !!!"),
  //     radioValue: yup.string().required("Radio Value is Required !!!"),
  //     remark: yup.string().required("Remark is Required !!!"),
  //   });

  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yup.yupResolver(schema),
    mode: "onChange",
  });

  const getTableData = () => {
    setLoading(true);
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
        console.log("RES:::::::::", res);
        setLoading(false);
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
        setLoading(false);
        callCatchMethod(error, language);
      });
  };

  const onSubmitForm = (formData) => {
    setLoading(true);
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
          setLoading(false);
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
        setLoading(false);
        callCatchMethod(error, language);
      });
  };

  const deleteById = (value) => {
    setLoading(true);
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
              setLoading(false);
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              setButtonInputState(false);
              getTableData();
            }
          })
          .catch((error) => {
            setLoading(false);
            callCatchMethod(error, language);
          });
      } else {
        swal("Record is Safe");
        setLoading(false);
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

    { field: "chargeType", headerName: "Charge Type", flex: 3 },
    {
      field: "chargeTypePrefix",
      headerName: "Charge Type Prefix",
      //type: "number",
      flex: 3,
    },
    {
      field: "chargeName",
      headerName: "Charge Name",
      // type: "number",
      flex: 3,
    },
    {
      field: "mapWithGlAccountCode",
      headerName: "Map With GL Account Code",
      // type: "number",
      flex: 3,
    },
    {
      field: "remark",
      headerName: "Remark",
      // type: "number",
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
                          label="Charge Type Prefix *"
                          variant="standard"
                          {...register("chargeTypePrefix")}
                          error={!!errors.chargeTypePrefix}
                          helperText={
                            errors?.chargeTypePrefix
                              ? errors.chargeTypePrefix.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Charge Name *"
                          variant="standard"
                          {...register("chargeName")}
                          error={!!errors.chargeName}
                          helperText={
                            errors?.chargeName
                              ? errors.chargeName.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Map With GL Account Code *"
                          variant="standard"
                          {...register("mapWithGlAccountCode")}
                          error={!!errors.mapWithGlAccountCode}
                          helperText={
                            errors?.mapWithGlAccountCode
                              ? errors.mapWithGlAccountCode.message
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
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}></Grid>
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Remark *"
                          variant="standard"
                          {...register("remark")}
                          error={!!errors.remark}
                          helperText={
                            errors?.remark ? errors.remark.message : null
                          }
                        />
                      </Grid>
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}></Grid>
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
