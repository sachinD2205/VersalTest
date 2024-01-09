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
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { FormHelperText } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "../../../../containers/schema/libraryManagementSystem/userMaster";
import urls from "../../../../URLS/urls";
import sweetAlert from "sweetalert";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers";
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
  const [citizenUserProfileData, setCitizenUserProfileData] = useState({});
  const [formData, setFormData] = useState({});
  const token = useSelector((state) => state.user.user.token);
  const language = useSelector((state) => state?.labels?.language);

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
  useEffect(() => {
    setCitizenUserProfileData({
      zoneNames: [
        { zoneLabel: "Zone A", value: "zone-a" },
        { zoneLabel: "Zone B", value: "zone-b" },
        { zoneLabel: "Zone C", value: "zone-c" },
      ],
      wardNames: [
        { wardLabel: "Ward A", value: "ward-a" },
        { wardLabel: "Ward B", value: "ward-b" },
        { wardLabel: "Ward C", value: "ward-c" },
      ],
    });
  }, []);

  const genders = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Transgender", value: "transgender" },
  ];

  const handleFormDataChanged = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

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

    { field: "zoneName", headerName: "Zone Name", flex: 3 },
    {
      field: "wardName",
      headerName: "Ward Name",
      //type: "number",
      flex: 3,
    },
    {
      field: "firstName",
      headerName: "First Name",
      // type: "number",
      flex: 3,
    },
    {
      field: "middleName",
      headerName: "Middle Name",
      // type: "number",
      flex: 3,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      // type: "number",
      flex: 3,
    },
    {
      field: "dob",
      headerName: "Date of Birth",
      // type: "number",
      flex: 3,
    },
    {
      field: "email",
      headerName: "Email ID",
      // type: "number",
      flex: 3,
    },
    {
      field: "mobile",
      headerName: "Mobile",
      //type: "number",
      flex: 3,
    },

    {
      field: "loginId",
      headerName: "Login ID",
      //type: "number",
      flex: 3,
    },
    {
      field: "password",
      headerName: "Password",
      //type: "number",
      flex: 3,
    },
    {
      field: "confirmPassword",
      headerName: "Confirm Password",
      //type: "number",
      flex: 3,
    },
    {
      field: "hintQuestion",
      headerName: "Hint Question",
      //type: "number",
      flex: 3,
    },
    {
      field: "answer",
      headerName: "Answer",
      //type: "number",
      flex: 3,
    },
    {
      field: "presentAddress",
      headerName: "Present Address",
      //type: "number",
      flex: 3,
    },
    {
      field: "gender",
      headerName: "Gender",
      //type: "number",
      flex: 3,
    },
    {
      field: "flatNo",
      headerName: "Flat/Bldg no.",
      //type: "number",
      flex: 3,
    },
    {
      field: "buildingName",
      headerName: "Building Name",
      //type: "number",
      flex: 3,
    },
    {
      field: "roadName",
      headerName: "Road Name",
      //type: "number",
      flex: 3,
    },
    {
      field: "landmark",
      headerName: "Landmark",
      //type: "number",
      flex: 3,
    },
    {
      field: "pincode",
      headerName: "Pincode",
      //type: "number",
      flex: 3,
    },
    {
      field: "permanentAddress",
      headerName: "Permanent Address",
      //type: "number",
      flex: 3,
    },
    {
      field: "addEditProperty",
      headerName: "Add / Edit Property",
      //type: "number",
      flex: 3,
    },
    {
      field: "waterConnectionDetails",
      headerName: "Add / Edit Water Connection Details",
      //type: "number",
      flex: 3,
    },
    {
      field: "otherService1",
      headerName: "Other Service 1",
      //type: "number",
      flex: 3,
    },
    {
      field: "otherService2",
      headerName: "Other Service 2",
      //type: "number",
      flex: 3,
    },
    {
      field: "dashboard",
      headerName: "Dashboard",
      //type: "number",
      flex: 3,
    },
    {
      field: "opinionPollParticipation",
      headerName: "Opinion And Poll Participation",
      //type: "number",
      flex: 3,
    },
    {
      field: "suggestionsFeedback",
      headerName: "Suggestions And Feedback",
      //type: "number",
      flex: 3,
    },
    {
      field: "newsLetters",
      headerName: "News letters / Notification registration",
      //type: "number",
      flex: 3,
    },
    {
      field: "applicationStatus",
      headerName: "Application Status",
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
      <LocalizationProvider dateAdapter={AdapterMoment}>
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
                          <Select
                            sx={{ m: 1, width: "100%" }}
                            label="Zone Name"
                            vairant="standard"
                            value={formData.zoneName || ""}
                            onChange={(val) =>
                              handleFormDataChanged("zoneName", val)
                            }
                            {...register("zoneName")}
                            error={!!errors.zoneName}
                            helperText={
                              errors?.zoneName ? errors.zoneName.message : null
                            }
                          >
                            {citizenUserProfileData &&
                            citizenUserProfileData.zoneNames ? (
                              citizenUserProfileData.zoneNames.map((zone) => (
                                <MenuItem value={zone.value}>
                                  {zone.zoneLabel}
                                </MenuItem>
                              ))
                            ) : (
                              <></>
                            )}
                          </Select>
                        </Grid>

                        <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                          <Select
                            sx={{ m: 1, width: "100%" }}
                            label="Ward Name"
                            vairant="standard"
                            value={formData.wardName || ""}
                            onChange={(val) =>
                              handleFormDataChanged("wardName", val)
                            }
                            {...register("wardName")}
                            error={!!errors.wardName}
                            helperText={
                              errors?.wardName ? errors.wardName.message : null
                            }
                          >
                            {citizenUserProfileData &&
                            citizenUserProfileData.wardNames ? (
                              citizenUserProfileData.wardNames.map((ward) => (
                                <MenuItem value={ward.value}>
                                  {ward.wardLabel}
                                </MenuItem>
                              ))
                            ) : (
                              <></>
                            )}
                          </Select>
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
                            label="First Name *"
                            variant="standard"
                            {...register("firstName")}
                            error={!!errors.firstName}
                            helperText={
                              errors?.firstName
                                ? errors.firstName.message
                                : null
                            }
                          />
                        </Grid>

                        <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                          <TextField
                            sx={{ m: 1, width: "100%" }}
                            label="Middle Name *"
                            variant="standard"
                            {...register("middleName")}
                            error={!!errors.middleName}
                            helperText={
                              errors?.middleName
                                ? errors.middleName.message
                                : null
                            }
                          />
                        </Grid>

                        <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                          <TextField
                            sx={{ m: 1, width: "100%" }}
                            label="Last Name *"
                            variant="standard"
                            {...register("lastName")}
                            error={!!errors.lastName}
                            helperText={
                              errors?.lastName ? errors.lastName.message : null
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
                          <DesktopDatePicker
                            sx={{ m: 1, width: "100%" }}
                            label="Date of Birth *"
                            variant="standard"
                            inputFormat="DD/MM/YYYY"
                            renderInput={(params) => <TextField {...params} />}
                            {...register("dob")}
                            error={!!errors.dob}
                            helperText={errors?.dob ? errors.dob.message : null}
                          />
                        </Grid>

                        <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                          <TextField
                            sx={{ m: 1, width: "100%" }}
                            label="Email *"
                            variant="standard"
                            {...register("email")}
                            error={!!errors.email}
                            helperText={
                              errors?.email ? errors.email.message : null
                            }
                          />
                        </Grid>
                        <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                          <TextField
                            sx={{ m: 1, width: "100%" }}
                            label="Mobile *"
                            variant="standard"
                            {...register("mobile")}
                            error={!!errors.mobile}
                            helperText={
                              errors?.mobile ? errors.mobile.message : null
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
                            label="Login ID *"
                            variant="standard"
                            {...register("loginId")}
                            error={!!errors.loginId}
                            helperText={
                              errors?.loginId ? errors.loginId.message : null
                            }
                          />
                        </Grid>
                        <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                          <TextField
                            sx={{ m: 1, width: "100%" }}
                            label="Password *"
                            variant="standard"
                            type="password"
                            {...register("password")}
                            error={!!errors.password}
                            helperText={
                              errors?.password ? errors.password.message : null
                            }
                          />
                        </Grid>
                        <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                          <TextField
                            sx={{ m: 1, width: "100%" }}
                            label="Confirm Password *"
                            variant="standard"
                            type="password"
                            {...register("confirmPassword")}
                            error={!!errors.confirmPassword}
                            helperText={
                              errors?.confirmPassword
                                ? errors.confirmPassword.message
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
                            label="Hint Question *"
                            variant="standard"
                            {...register("hintQuestion")}
                            error={!!errors.hintQuestion}
                            helperText={
                              errors?.hintQuestion
                                ? errors.hintQuestion.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                          <TextField
                            sx={{ m: 1, width: "100%" }}
                            label="Answer *"
                            variant="standard"
                            {...register("answer")}
                            error={!!errors.answer}
                            helperText={
                              errors?.answer ? errors.answer.message : null
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
                            label="Present Address *"
                            variant="standard"
                            {...register("presentAddress")}
                            error={!!errors.presentAddress}
                            helperText={
                              errors?.presentAddress
                                ? errors.presentAddress.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                          <Select
                            sx={{ m: 1, width: "100%" }}
                            vairant="standard"
                            value={formData.gender || ""}
                            onChange={(val) =>
                              handleFormDataChanged("gender", val)
                            }
                            {...register("gender")}
                            error={!!errors.gender}
                            helperText={
                              errors?.gender ? errors.gender.message : null
                            }
                          >
                            {genders.map(({ value, label }) => (
                              <MenuItem value={value}>{label}</MenuItem>
                            ))}
                          </Select>
                        </Grid>
                        <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                          <TextField
                            sx={{ m: 1, width: "100%" }}
                            label="Flat / Bldg No. *"
                            variant="standard"
                            {...register("flatNo")}
                            error={!!errors.flatNo}
                            helperText={
                              errors?.flatNo ? errors.flatNo.message : null
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
                            label="Building Name *"
                            variant="standard"
                            {...register("buildingName")}
                            error={!!errors.buildingName}
                            helperText={
                              errors?.buildingName
                                ? errors.buildingName.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                          <TextField
                            sx={{ m: 1, width: "100%" }}
                            label="Road Name *"
                            variant="standard"
                            {...register("roadName")}
                            error={!!errors.roadName}
                            helperText={
                              errors?.roadName ? errors.roadName.message : null
                            }
                          />
                        </Grid>
                        <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                          <TextField
                            sx={{ m: 1, width: "100%" }}
                            label="Landmark *"
                            variant="standard"
                            {...register("landmark")}
                            error={!!errors.landmark}
                            helperText={
                              errors?.landmark ? errors.landmark.message : null
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
                            label="Pincode *"
                            variant="standard"
                            {...register("pincode")}
                            error={!!errors.pincode}
                            helperText={
                              errors?.pincode ? errors.pincode.message : null
                            }
                          />
                        </Grid>
                        <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                          <TextField
                            sx={{ m: 1, width: "100%" }}
                            label="Permanent Address *"
                            variant="standard"
                            {...register("permanentAddress")}
                            error={!!errors.permanentAddress}
                            helperText={
                              errors?.permanentAddress
                                ? errors.permanentAddress.message
                                : null
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
      </LocalizationProvider>
    </>
  );
};
export default LibraryCompetativeMaster;
