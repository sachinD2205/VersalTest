import { Box, Button, Grid, Autocomplete } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "../../../../containers/schema/libraryManagementSystem/transaction/dailyEntryMagazinesNewspaper";
import { Paper } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import styles from "../../../../pages/marriageRegistration/transactions/newMarriageRegistration/scrutiny/view.module.css";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { FormProvider, useForm } from "react-hook-form";
import { Slide } from "@mui/material";
import { TextField } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import urls from "../../../../URLS/urls";
import swal from "sweetalert";
import moment from "moment";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import Loader from "../../../../containers/Layout/components/Loader";
import LmsHeader from "../../../../components/lms/lmsHeader";
import { useSelector } from "react-redux";

const DepartmentalProcess = () => {
  const language = useSelector((lang) => lang?.labels?.language);
  const token = useSelector((state) => state.user.user.token);

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);

  const [libraryIdsList, setLibraryIdsList] = useState([]);
  const [magazineNewspaperEntriesList, setMagazineNewspaperEntriesList] =
    useState([]);
  const [magazineNewspaperMasterList, setMagazineNewspaperMasterList] =
    useState([]);
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [selectedMagazine, setSelectedMagazine] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [selectedDate, setSelectedDate] = useState(moment().toDate());
  const [selectedSuppliedDate, setSelectedSuppliedDate] = useState(
    moment().toDate()
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAllLibrarysList();
    setAllEntriesList();
    setMasterList();
  }, []);

  const setMasterList = () => {
    setLoading(true);
    const url = urls.LMSURL + "/magazineNewspaperMaster/getAll";
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLoading(false);
        console.log(response.data);
        if (
          !response.data ||
          !response.data.masterMagazineNewspaperList ||
          response.data.masterMagazineNewspaperList.length === 0
        ) {
          throw new Error("Magazine/Newspaper entries not found");
        }
        setMagazineNewspaperMasterList(
          response.data.masterMagazineNewspaperList
        );
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        swal(err.message, { icon: "error" });
      });
  };

  const setAllEntriesList = () => {
    setLoading(true);
    const url = urls.LMSURL + "/trnDailyMagazineNewsPaperEntry/getAll";
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLoading(false);
        console.log(response.data);
        setMagazineNewspaperEntriesList(
          response.data.trnDailyMagazineNewsPaperEntryList
        );
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
        swal(err.message, { icon: "error" });
      });
  };

  const setAllLibrarysList = () => {
    setLoading(true);
    const url = urls.LMSURL + "/libraryMaster/getAll";
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLoading(false);
        if (
          !response.data ||
          !response.data.libraryMasterList ||
          response.data.libraryMasterList.length === 0
        ) {
          throw new Error("No libraries found");
        }
        setLibraryIdsList(response.data.libraryMasterList);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
        swal(err.message, { icon: "error" });
      });
  };

  const {
    register,
    methods,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const exitButton = () => {
    cancellButton();
    setButtonInputState(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
  };

  // cancell Button
  const cancellButton = () => {
    setSelectedLibrary(null);
    setSelectedMagazine(null);
    setSelectedDate(moment().toDate());
    setQuantity("");
  };

  const onSubmitForm = () => {
    setLoading(true);
    if (
      !selectedLibrary ||
      !selectedMagazine ||
      !selectedDate ||
      !selectedSuppliedDate ||
      !quantity
    ) {
      swal(
        language == "en"
          ? "Please enter all values"
          : "कृपया सर्व मूल्ये प्रविष्ट करा",
        { icon: "warning" }
      );
      return;
    }
    const payload = {
      libraryMasterKey: selectedLibrary.id,
      libraryName: selectedLibrary.libraryName,
      magazineNewspaperMasterKey: selectedMagazine.id,
      magazineName: selectedMagazine.magazineName,
      magazineNewspaperSupplierMasterKey:
        selectedMagazine.magazineNewspaperSupplierMasterKey,
      supplierName: selectedMagazine.supplierName,
      quantity: +quantity,
      remark: "",
      supplierContactNumber: selectedMagazine.supplierContactNumber,
      receivedAt: selectedDate.toISOString(),
      suppliedAt: selectedSuppliedDate.toISOString(),
      createdUserId: 1,
      updateDtTm: null,
      updateUserid: 1,
      version: 1,
    };
    const url = urls.LMSURL + "/trnDailyMagazineNewsPaperEntry/save";
    console.log("Payload:", payload);
    axios
      .post(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLoading(false);
        console.log(response.data);
        setAllEntriesList();
        swal(language == "en" ? "Entry saved." : "प्रवेश जतन केला.", {
          icon: "success",
        });
        return exitButton();
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
        swal(err.message, { icon: "error" });
      });
  };

  const columns = [
    { headerName: "Sr. No.", field: "id", flex: 3 },
    { headerName: "Magazine/Newspaper Name", field: "magazineName", flex: 3 },
    { headerName: "Supplier Name", field: "supplierName", flex: 3 },
    { headerName: "Supplier Contact Number", field: "contactNumber", flex: 3 },
    { headerName: "Date of Publishing", field: "suppliedAt", flex: 3 },
    { headerName: "Date of Receipt", field: "receivedAt", flex: 3 },
    { headerName: "Quantity", field: "quantity", flex: 3 },
  ];

  return (
    <>
      <LmsHeader labelName="dailyEntryMagazineNewspaper" />
      {loading ? (
        <Loader />
      ) : (
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <Paper
            sx={{
              marginLeft: 5,
              marginRight: 5,
              marginTop: 5,
              marginBottom: 5,
              padding: 1,
            }}
          >
            {isOpenCollapse ? (
              <Slide
                direction="down"
                in={slideChecked}
                mountOnEnter
                unmountOnExit
              >
                <div>
                  <FormProvider {...methods}>
                    <form>
                      <Grid container style={{ padding: "10px" }}>
                        <Grid
                          item
                          xl={6}
                          lg={6}
                          md={6}
                          sm={12}
                          xs={12}
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          <Autocomplete
                            fullWidth
                            sx={{ width: "90%" }}
                            size="small"
                            label="Library ID *"
                            disablePortal
                            options={libraryIdsList}
                            value={selectedLibrary}
                            onChange={(_e, library) => {
                              setSelectedLibrary(library);
                            }}
                            getOptionLabel={({ libraryName }) =>
                              libraryName || ""
                            }
                            isOptionEqualToValue={(opt, sel) => {
                              return opt.id === sel.id;
                            }}
                            renderOption={(props, option) => (
                              <span {...props}>{option.libraryName}</span>
                            )}
                            renderInput={(params) => (
                              <TextField {...params} label="Choose a library" />
                            )}
                          />
                        </Grid>
                        <Grid
                          item
                          xl={6}
                          lg={6}
                          md={6}
                          sm={12}
                          xs={12}
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          <Autocomplete
                            label="Magazine/Newspaper *"
                            size="small"
                            fullWidth
                            sx={{ width: "90%" }}
                            disablePortal
                            options={magazineNewspaperMasterList}
                            value={selectedMagazine}
                            onChange={(_e, mag) => {
                              setSelectedMagazine(mag);
                            }}
                            getOptionLabel={({ magazineName }) =>
                              magazineName || ""
                            }
                            isOptionEqualToValue={(opt, sel) => {
                              return opt.id === sel.id;
                            }}
                            renderOption={(props, option) => (
                              <span {...props}>{option.magazineName}</span>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Choose a magazine/newspaper"
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                      <Grid container style={{ padding: "10px" }}>
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={4}
                          sm={12}
                          xs={12}
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          <TextField
                            label="Quantity *"
                            variant="outlined"
                            size="small"
                            type="number"
                            value={quantity}
                            onChange={(e) => {
                              setQuantity(e.target.value);
                            }}
                            error={!!errors.quantity}
                            helperText={
                              errors?.quantity ? errors.quantity.message : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={4}
                          sm={12}
                          xs={12}
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          <DesktopDatePicker
                            size="small"
                            label="Published Date *"
                            variant="standard"
                            inputFormat="DD/MM/YYYY"
                            value={selectedSuppliedDate || ""}
                            onChange={(d) => {
                              setSelectedSuppliedDate(d);
                            }}
                            renderInput={(params) => (
                              <TextField size="small" {...params} />
                            )}
                          />
                        </Grid>
                        <Grid
                          item
                          xl={4}
                          lg={4}
                          md={4}
                          sm={12}
                          xs={12}
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          <DesktopDatePicker
                            label="Received Date *"
                            variant="standard"
                            inputFormat="DD/MM/YYYY"
                            value={selectedDate || ""}
                            onChange={(d) => {
                              setSelectedDate(d);
                            }}
                            renderInput={(params) => (
                              <TextField size="small" {...params} />
                            )}
                          />
                        </Grid>
                      </Grid>

                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={4}
                          sx={{ display: "flex", justifyContent: "end" }}
                        >
                          <Button
                            type="button"
                            onClick={onSubmitForm}
                            variant="contained"
                            size="small"
                            color="success"
                            endIcon={<SaveIcon />}
                          >
                            {btnSaveText}
                          </Button>
                        </Grid>
                        <Grid
                          item
                          xs={4}
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            endIcon={<ClearIcon />}
                            onClick={() => cancellButton()}
                          >
                            Clear
                          </Button>
                        </Grid>
                        <Grid item xs={4}>
                          <Button
                            variant="contained"
                            size="small"
                            color="error"
                            endIcon={<ExitToAppIcon />}
                            onClick={() => exitButton()}
                          >
                            Exit
                          </Button>
                        </Grid>
                      </Grid>
                    </form>
                  </FormProvider>
                </div>
              </Slide>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <Button
                    variant="contained"
                    endIcon={<AddIcon />}
                    type="primary"
                    size="small"
                    disabled={buttonInputState}
                    onClick={() => {
                      reset({});
                      setEditButtonInputState(true);
                      setDeleteButtonState(true);
                      setBtnSaveText("Save");
                      setButtonInputState(true);
                      setSlideChecked(true);
                      setIsOpenCollapse(!isOpenCollapse);
                    }}
                  >
                    Add
                  </Button>
                </div>
                <DataGrid
                  autoHeight
                  components={{ Toolbar: GridToolbar }}
                  sx={{
                    // marginLeft: 5,
                    // marginRight: 5,
                    // marginTop: 5,
                    // marginBottom: 5,

                    overflowY: "scroll",

                    "& .MuiDataGrid-virtualScrollerContent": {},
                    "& .MuiDataGrid-columnHeadersInner": {
                      backgroundColor: "#556CD6",
                      color: "white",
                    },

                    "& .MuiDataGrid-cell:hover": {
                      color: "primary.main",
                    },
                  }}
                  rows={magazineNewspaperEntriesList.map((entry) => ({
                    ...entry,
                    receivedAt:
                      entry.receivedAt &&
                      moment(entry.receivedAt).format("DD/MM/YYYY"),
                    suppliedAt:
                      entry.suppliedAt &&
                      moment(entry.suppliedAt).format("DD/MM/YYYY"),
                  }))}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  //checkboxSelection
                />
              </>
            )}
          </Paper>
        </LocalizationProvider>
      )}
    </>
  );
};
export default DepartmentalProcess;
