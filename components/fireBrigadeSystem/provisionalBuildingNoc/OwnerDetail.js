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
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import sweetAlert from "sweetalert";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../styles/fireBrigadeSystem/view.module.css";

/** Sachin Durge */
// OwnerDetail
const OwnerDetail = ({ view = false }) => {
  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [ownerDetailsTableData, setOwnerDetailsTableData] = useState([]);
  const [finalOwnerDetailsTableData, setFinalOwnerDetailsTableData] = useState(
    []
  );
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [viewButtonInputState, setViewButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [firm, setFirm] = useState();

  // saveOwner
  const saveOwner = () => {
    // ownerDTLDao

    console.log("getValuesODTL", getValues());
    const ownerDTLDao = {
      ownerName: getValues("ownerName"),
      ownerNameMr: getValues("ownerNameMr"),
      ownerMiddleName: getValues("ownerMiddleName"),
      ownerLastName: getValues("ownerLastName"),
      ownerMiddleNameMr: getValues("ownerMiddleNameMr"),
      ownerLastNameMr: getValues("ownerLastNameMr"),
      ownerMobileNo: getValues("ownerMobileNo"),
      ownerEmailId: getValues("ownerEmailId"),
    };

    console.log("ownerDTLDao", ownerDTLDao);

    const body = {
      ...getValues(),
      id: getValues("id"),
      ownerDTLDao: [...ownerDetailsTableData, ownerDTLDao],
      // applicantDTLDao: getValues("applicantDTLDao"),
    };

    console.log("666666", body);
    // console.table("prevData", getValues("prevData"));

    axios
      .post(`${urls.FbsURL}/transaction/provisionalBuildingFireNOC/save`, body)
      .then((res) => {
        // if (res?.status == 200 || res?.status == 201) {
        //   let provisionalBuildingNocId = res?.data?.status?.split("$")[1];
        //   console.log("provisionalBuildingNocId", provisionalBuildingNocId);
        //   const tempData = axios
        //     .get(
        //       `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/getById?appId=${provisionalBuildingNocId}`
        //     )
        //     .then((res) => {
        //       if (res?.status == 200 || res?.status == 201) {
        //         setOwnerDetailsTableData(res?.data?.ownerDTLDao);
        //         setValue("prevData", res?.data);
        //         setValue("id", res?.data?.id);
        //         setValue("ownerDTLDao", res?.data?.ownerDTLDao);
        //         setValue("formDTLDao", null);
        //         setValue("applicantDTLDao", res?.data?.applicantDTLDao);
        //         setValue("buildingDTLDao", res?.data?.buildingDTLDao);
        //         setValue("attachments", res?.data?.attachments);
        //       } else {
        //         //
        //       }
        //     })
        //     .catch((error) => {
        //       console.log("Error", error);
        //       //
        //     });

        //   } else {
        //     ////
        //   }
        sweetAlert("Saved!", "Record Saved successfully !", "success");
        setButtonInputState(false);
        setIsOpenCollapse(false);
        setFetchData(tempData);
        setEditButtonInputState(false);
        setDeleteButtonState(false);
        resetValuesOnSave();
      })
      .catch((error) => {
        console.log("Error", error);
        //
      });
  };

  // deleteById
  const deleteById = async (value) => {
    swal({
      title: "Delete ?",
      text: "Are you sure you want to delete this Record ? ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `${urls.BaseURL}/typeOfNOCMaster/discardTypeOfNOCMaster/${value}`
          )
          .then((res) => {
            if (res.status == 226) {
              swal("Record is Successfully Deleted!", {
                icon: "success",
              });
              getData();
              setButtonInputState(false);
            } else {
              swal("Record is Safe");
            }
          });
      }
    });
  };

  // cancellButton
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // exitFunction
  const exitFunction = () => {
    setButtonInputState(false);
    setIsOpenCollapse(false);
    setViewButtonInputState(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
    setSlideChecked(true);
  };

  // resetValuesOnSave
  const resetValuesOnSave = () => {
    reset({
      ...resetValues,
      id,
    });
  };

  // ResetValues
  const resetValues = {
    formName: "",
    ownerName: "",
    ownerNameMr: "",
    ownerMiddleNameMr: "",
  };

  // resetValuesCancell
  const resetValuesCancell = {
    formName: "",
    firmRegistrationNo: "",
    jvName: "",
    jvRegistrationNo: "",
    ownerName: "",
    ownerMiddleName: "",
    ownerEmailId: "",
    ownerMobileNo: "",
    ownerLastNameMr: "",
    ownerMiddleNameMr: "",
    ownerNameMr: "",
    ownerLastName: "",
  };

  // columns
  const columns = [
    {
      field: "srNo",
      headerName: "Sr No.",
      flex: 1,
    },
    {
      field: "ownerName",
      headerName: "Owner Name",
      flex: 1,
    },
    {
      field: "ownerMobileNo",
      headerName: "Mobile No.",
      flex: 1,
    },
    {
      field: "ownerEmailId",
      headerName: "Email ID",
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
                setIsOpenCollapse(false),
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

  // =============================> useEffect ========================================>

  useEffect(() => {
    console.log("nocIdOwnerDaetail", getValues("nocId"));
  }, [watch("nocId")]);

  useEffect(() => {
    if (getValues("ownerDTLDao")?.length > 0) {
      setOwnerDetailsTableData(getValues("ownerDTLDao"));
    }
  }, [fetchData]);

  useEffect(() => {
    const tempTableData = ownerDetailsTableData?.map((data, index) => {
      return {
        srNo: index + 1,
        ...data,
      };
    });

    console.log("tempTableData", tempTableData);

    setFinalOwnerDetailsTableData(tempTableData);
  }, [ownerDetailsTableData]);

  useEffect(() => {
    console.log("finalOwnerDetailsTableData", finalOwnerDetailsTableData);
  }, [finalOwnerDetailsTableData]);

  // view
  return (
    <>
      <Box>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <Box
                style={{
                  margin: "4%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
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
                      {btnSaveText == "Update"
                        ? // <FormattedLabel id="updateNocName" />
                          "Update Buliding Details"
                        : // <FormattedLabel id="addNocName" />
                          "Owner Details"}
                    </Box>
                  </Box>
                  <br />

                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    className={styles.feildres}
                  >
                    {/* Building Fields */}
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                    ></Grid>
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl sx={{ width: "80%" }}>
                          <InputLabel
                            variant="standard"
                            htmlFor="uncontrolled-native"
                          >
                            OwnerShip Type
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled={viewButtonInputState}
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                  setFirm(value.target.value);
                                }}
                                name="previouslyAnyFireNocTaken"
                                fullWidth
                                size="small"
                                variant="standard"
                              >
                                <MenuItem value="Firm">Firm </MenuItem>
                                <MenuItem value="JV">JV</MenuItem>
                                <MenuItem value="Individual">
                                  Individual
                                </MenuItem>
                              </Select>
                            )}
                            name="previouslyAnyFireNocTaken"
                            control={control}
                            defaultValue=""
                          />
                        </FormControl>
                      </Grid>

                      {firm === "Individual" && (
                        <>
                          <Grid item xs={4} className={styles.feildres}></Grid>
                          <Grid item xs={4} className={styles.feildres}></Grid>
                        </>
                      )}
                      {firm === "Firm" && (
                        <>
                          <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              label={<FormattedLabel id="firmName" />}
                              variant="standard"
                              // key={groupDetails.id}
                              {...register("firmName")}
                              error={!!errors.firmName}
                              helperText={
                                errors?.firmName
                                  ? errors.firmName.message
                                  : null
                              }
                            />
                          </Grid>
                          <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              label="Firm Registration No."
                              // label={<FormattedLabel id="firmName" />}
                              variant="standard"
                              // key={groupDetails.id}
                              {...register("firmRegistrationNo")}
                              error={!!errors.firmRegistrationNo}
                              helperText={
                                errors?.firmRegistrationNo
                                  ? errors.firmRegistrationNo.message
                                  : null
                              }
                            />
                          </Grid>
                        </>
                      )}

                      {firm === "JV" && (
                        <>
                          <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              // label={<FormattedLabel id="firmName" />}
                              label="JV Name"
                              variant="standard"
                              // key={groupDetails.id}
                              {...register("jvName")}
                              error={!!errors.jvName}
                              helperText={
                                errors?.jvName ? errors.jvName.message : null
                              }
                            />
                          </Grid>
                          <Grid item xs={4} className={styles.feildres}>
                            <TextField
                              sx={{ width: "80%" }}
                              id="standard-basic"
                              label="JV Registration No."
                              // label={<FormattedLabel id="firmName" />}
                              variant="standard"
                              // key={groupDetails.id}
                              {...register("jvRegistrationNo")}
                              error={!!errors.jvRegistrationNo}
                              helperText={
                                errors?.jvRegistrationNo
                                  ? errors.jvRegistrationNo.message
                                  : null
                              }
                            />
                          </Grid>
                        </>
                      )}
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}></Grid>
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={viewButtonInputState}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          // label={<FormattedLabel id="ownerName" />}
                          label="Owner First Name"
                          variant="standard"
                          {...register("ownerName")}
                          error={!!errors.ownerName}
                          helperText={
                            errors?.ownerName ? errors.ownerName.message : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={viewButtonInputState}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          // label={<FormattedLabel id="ownerMiddleName" />}
                          label="Owner Middle Name"
                          variant="standard"
                          {...register("ownerMiddleName")}
                          error={!!errors.ownerMiddleName}
                          helperText={
                            errors?.ownerMiddleName
                              ? errors.ownerMiddleName.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={viewButtonInputState}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          // label={<FormattedLabel id="ownerLastName" />}
                          label="Owner Last Name"
                          variant="standard"
                          {...register("ownerLastName")}
                          error={!!errors.ownerLastName}
                          helperText={
                            errors?.ownerLastName
                              ? errors.ownerLastName.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={viewButtonInputState}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          // label={<FormattedLabel id="ownerNameMr" />}
                          label="Owner First Name (In Marathi)"
                          variant="standard"
                          {...register("ownerNameMr")}
                          error={!!errors.ownerNameMr}
                          helperText={
                            errors?.ownerNameMr
                              ? errors.ownerNameMr.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={viewButtonInputState}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          // label={<FormattedLabel id="ownerMiddleNameMr" />}
                          label="Owner Middle Name (In Marathi)"
                          variant="standard"
                          {...register("ownerMiddleNameMr")}
                          error={!!errors.ownerMiddleNameMr}
                          helperText={
                            errors?.ownerMiddleNameMr
                              ? errors.ownerMiddleNameMr.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={viewButtonInputState}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          // label={<FormattedLabel id="ownerLastNameMr" />}
                          label="Owner Last Name (In Marathi)"
                          variant="standard"
                          {...register("ownerLastNameMr")}
                          error={!!errors.ownerLastNameMr}
                          helperText={
                            errors?.ownerLastNameMr
                              ? errors.ownerLastNameMr.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={viewButtonInputState}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="mobileNo" />}
                          variant="standard"
                          {...register("ownerMobileNo")}
                          // type="number"
                          error={!!errors.mobileNo}
                          helperText={
                            errors?.mobileNo ? errors.mobileNo.message : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          disabled={viewButtonInputState}
                          sx={{ width: "80%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="emailId" />}
                          variant="standard"
                          {...register("ownerEmailId")}
                          error={!!errors.emailId}
                          helperText={
                            errors?.emailId ? errors.emailId.message : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container className={styles.feildres} spacing={2}>
                    <Grid item>
                      {!viewButtonInputState && (
                        <Button
                          size="small"
                          variant="outlined"
                          className={styles.button}
                          endIcon={<SaveIcon />}
                          onClick={() => {
                            saveOwner();
                            setIsOpenCollapse(isOpenCollapse);
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

        <Box style={{ display: "flex" /* marginTop: "5%" */ }}>
          <Box className={styles.tableHead}>
            <Box className={styles.h1Tag}>Owner Details</Box>
          </Box>
          {!view && (
            <Box>
              <Button
                variant="contained"
                type="primary"
                disabled={buttonInputState}
                onClick={() => {
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
          )}
        </Box>
        <Box style={{ marginBottom: "10px" }}>
          <DataGrid
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
            rows={
              finalOwnerDetailsTableData == null ||
              finalOwnerDetailsTableData == undefined
                ? []
                : finalOwnerDetailsTableData
            }
            columns={columns}
            pageSize={7}
            rowsPerPageOptions={[7]}
          />
        </Box>
      </Box>
    </>
  );
};

export default OwnerDetail;
