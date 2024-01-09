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
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "../../../../containers/schema/libraryManagementSystem/transaction/departmentalProcessNewMembership";
import { Paper } from "@mui/material";
import { DataGrid, GridCell, GridRow } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import styles from "../../../../pages/marriageRegistration/transactions/newMarriageRegistration/scrutiny/view.module.css";
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
import axios from "axios";
import urls from "../../../../URLS/urls";
import sweetAlert from "sweetalert";

const DepartmentalProcess = () => {
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [libraryMasterName, setLibraryMasterName] = useState([]);
  const token = useSelector((state) => state.user.user.token);

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
    getLibraryNameData();
  }, []);

  useEffect(() => {
    getTableData();
  }, [libraryMasterName]);

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
    studyCenterName: "",
    wardName: "",
    radioValue: "",
    membershipRegistrationNo: "",
    firstName: "",
    middleName: "",
    surnameName: "",
    gender: "",
    address: "",
    pincode: "",
    contactDetails: "",
    emailId: "",
    membershipPeriod: "",
    educationalRadioValue: "",
    additionalInformation: "",
    aadharCard: "",
  };

  const resetValuesExit = {
    studyCenterName: "",
    wardName: "",
    radioValue: "",
    membershipRegistrationNo: "",
    firstName: "",
    middleName: "",
    surnameName: "",
    gender: "",
    address: "",
    pincode: "",
    contactDetails: "",
    emailId: "",
    membershipPeriod: "",
    educationalRadioValue: "",
    additionalInformation: "",
    aadharCard: "",
    id: null,
  };

  const getLibraryNameData = () => {
    axios
      .get(
        `${urls.BaseURL}/competativeStudyMaster/getCompetativeStudyCenterMasterData`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((r) => {
        setLibraryMasterName(
          r.data.map((r) => ({
            id: r.id,
            studyCenterName: r.studyCenterName,
          }))
        );
      });
  };

  const onSubmitForm = (formData) => {
    const finalBodyForApi = {
      ...formData,
    };

    axios
      .post(
        `${urls.BaseURL}/trnDepartmentNewMembership/saveRegistrationData`,
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
      });
  };

  const getTableData = () => {
    axios
      .get(`${urls.BaseURL}/trnDepartmentNewMembership/getRegistrationData`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDataSource(
          res.data.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            studyCenterName: r.studyCenterName,
            actionType: r.actionType,
            membershipRegistrationNo: r.membershipRegistrationNo,
            firstName: r.firstName,
            middleName: r.middleName,
            surnameName: r.surnameName,
            gender: r.gender,
            address: r.address,
            pincode: r.pincode,
            contactDetails: r.contactDetails,
            emailId: r.emailId,
            membershipPeriod: r.membershipPeriod,
            educationalRadioValue: r.educationalRadioValue,
            additionalInformation: r.additionalInformation,
            aadharCard: r.aadharCard,
          }))
        );
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
            `${urls.BaseURL}/trnDepartmentNewMembership/discardRegistrationData/${value}`
          )
          .then((res) => {
            if (res.status == 226) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              setButtonInputState(false);
              getTableData();
            }
          });
      } else {
        swal("Record is Safe");
      }
    });
  };

  const columns = [
    {
      field: "srNo",
      headerName: "Sr.No",
      flex: 3,
    },

    {
      field: "studyCenterName",
      headerName: "Study Center Name",
      flex: 3,
    },

    {
      field: "membershipRegistrationNo",
      headerName: "Membership Registration Number",
      //type: "number",
      flex: 3,
    },
    {
      field: "firstName",
      headerName: "Applicant First Name",
      // type: "number",
      flex: 3,
    },
    {
      field: "middleName",
      headerName: "Applicant Middle Name",
      // type: "number",
      flex: 3,
    },
    {
      field: "surnameName",
      headerName: "Applicant Surname",
      // type: "number",
      flex: 3,
    },
    {
      field: "gender",
      headerName: "Gender",
      // type: "number",
      flex: 3,
    },
    {
      field: "address",
      headerName: "Address",
      // type: "number",
      flex: 3,
    },
    {
      field: "pincode",
      headerName: "Pincode",
      //type: "number",
      flex: 3,
    },

    {
      field: "contactDetails",
      headerName: "Contact Details",
      //type: "number",
      flex: 3,
    },
    {
      field: "emailId",
      headerName: "Email-Id",
      //type: "number",
      flex: 3,
    },
    {
      field: "educationalRadioValue",
      headerName: "Education",
      //type: "number",
      flex: 3,
    },
    {
      field: "membershipPeriod",
      headerName: "Membership Period",
      //type: "number",
      flex: 3,
    },

    {
      field: "additionalInformation",
      headerName: "Additional Information",
      //type: "number",
      flex: 3,
    },
    {
      field: "aadharCard",
      headerName: "Aadhar Card",
      //type: "number",
      flex: 3,
    },
    {
      field: "actionType",
      headerName: "Action Type",
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
                      style={{ marginTop: "1vh" }}
                      columns={16}
                    >
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <FormControl
                          variant="standard"
                          sx={{ m: 1, width: "100%" }}
                          error={!!errors.businessType}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Library Name *
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: "100%" }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Library Name"
                              >
                                {libraryMasterName &&
                                  libraryMasterName.map(
                                    (studyCenterName, index) => (
                                      <MenuItem
                                        key={index}
                                        value={studyCenterName.id}
                                      >
                                        {studyCenterName.studyCenterName}
                                      </MenuItem>
                                    )
                                  )}
                              </Select>
                            )}
                            name="studyCenterName"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.studyCenterName
                              ? errors.studyCenterName.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Membership Registration Number *"
                          variant="standard"
                          {...register("membershipRegistrationNo")}
                          error={!!errors.membershipRegistrationNo}
                          helperText={
                            errors?.membershipRegistrationNo
                              ? errors.membershipRegistrationNo.message
                              : null
                          }
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      spacing={2}
                      columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                      style={{ marginTop: "1vh" }}
                      columns={16}
                    >
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Applicant First Name *"
                          variant="standard"
                          {...register("firstName")}
                          error={!!errors.firstName}
                          helperText={
                            errors?.firstName ? errors.firstName.message : null
                          }
                        />
                      </Grid>
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Applicant Middle Name *"
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
                          id="standard-basic"
                          label="Applicant Surname Name *"
                          variant="standard"
                          {...register("surnameName")}
                          error={!!errors.surnameName}
                          helperText={
                            errors?.surnameName
                              ? errors.surnameName.message
                              : null
                          }
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      spacing={2}
                      columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                      style={{ marginTop: "1vh" }}
                      columns={16}
                    >
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Gender *"
                          variant="standard"
                          {...register("gender")}
                          error={!!errors.gender}
                          helperText={
                            errors?.gender ? errors.gender.message : null
                          }
                        />
                      </Grid>
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Address *"
                          variant="standard"
                          {...register("address")}
                          error={!!errors.address}
                          helperText={
                            errors?.address ? errors.address.message : null
                          }
                        />
                      </Grid>

                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Pin Code *"
                          variant="standard"
                          {...register("pincode")}
                          error={!!errors.pincode}
                          helperText={
                            errors?.pincode ? errors.pincode.message : null
                          }
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      spacing={2}
                      columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                      style={{ marginTop: "1vh" }}
                      columns={12}
                    >
                      <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Contact Details *"
                          variant="standard"
                          {...register("contactDetails")}
                          error={!!errors.contactDetails}
                          helperText={
                            errors?.contactDetails
                              ? errors.contactDetails.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Email Id *"
                          variant="standard"
                          {...register("emailId")}
                          error={!!errors.emailId}
                          helperText={
                            errors?.emailId ? errors.emailId.message : null
                          }
                        />
                      </Grid>

                      <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                        <FormControl>
                          <FormLabel
                            id="demo-controlled-radio-buttons-group"
                            style={{ marginTop: 10 }}
                          >
                            Education *
                          </FormLabel>
                          <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            row
                          >
                            <FormControlLabel
                              style={{ paddingRight: "20px" }}
                              value="Library"
                              control={<Radio />}
                              label="Educated"
                              name="RadioButton"
                              {...register("educationalRadioValue")}
                              error={!!errors.educationalRadioValue}
                              helperText={
                                errors?.educationalRadioValue
                                  ? errors.educationalRadioValue.message
                                  : null
                              }
                            />

                            <FormControlLabel
                              value="Competative Study Center"
                              control={<Radio />}
                              label="Uneducated"
                              name="RadioButton"
                              {...register("educationalRadioValue")}
                              error={!!errors.educationalRadioValue}
                              helperText={
                                errors?.educationalRadioValue
                                  ? errors.educationalRadioValue.message
                                  : null
                              }
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      spacing={2}
                      columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                      style={{ marginTop: "1vh" }}
                      columns={16}
                    >
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Requested Membership Period *"
                          variant="standard"
                          {...register("membershipPeriod")}
                          error={!!errors.membershipPeriod}
                          helperText={
                            errors?.membershipPeriod
                              ? errors.membershipPeriod.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Additional Information *"
                          variant="standard"
                          {...register("additionalInformation")}
                          error={!!errors.additionalInformation}
                          helperText={
                            errors?.additionalInformation
                              ? errors.additionalInformation.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <TextField
                          sx={{ m: 1, width: "100%" }}
                          id="standard-basic"
                          label="Aadhar Card *"
                          variant="standard"
                          {...register("aadharCard")}
                          error={!!errors.aadharCard}
                          helperText={
                            errors?.aadharCard
                              ? errors.aadharCard.message
                              : null
                          }
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      spacing={2}
                      columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 12, xl: 12 }}
                      style={{ marginTop: "1vh" }}
                      columns={16}
                    >
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <FormControl
                          variant="standard"
                          sx={{ m: 1, width: "100%" }}
                          error={!!errors.actionType}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            Action Type *
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ width: "100%" }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Library Name"
                              >
                                <MenuItem value="Revert">Revert</MenuItem>
                                <MenuItem value="Challan Generation">
                                  Challan Generation
                                </MenuItem>
                                <MenuItem value="Process Done">
                                  Process Done
                                </MenuItem>
                              </Select>
                            )}
                            name="actionType"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.actionType
                              ? errors.actionType.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <div className={styles.btn}>
                      <div className={styles.btn1}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="success"
                          endIcon={<SaveIcon />}
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
export default DepartmentalProcess;
