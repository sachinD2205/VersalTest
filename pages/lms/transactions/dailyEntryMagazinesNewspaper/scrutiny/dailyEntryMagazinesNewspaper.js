import { Box, Button, Grid, Autocomplete, ThemeProvider } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
// import schema from "./schema";
import { Paper } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import styles from "../../../../../styles/lms/[dailyEntryMagazines]view.module.css";
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
import urls from "../../../../../URLS/urls";
import swal from "sweetalert";
import moment from "moment";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../../theme";
import LmsHeader from "../../../../../components/lms/lmsHeader";
import BreadcrumbComponent from "../../../../../components/common/BreadcrumbComponent";
import { useSelector } from "react-redux";

const DepartmentalProcess = () => {
  const [btnSaveText, setBtnSaveText] = useState("save");
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
  const [allMagazineTypes, setAllMagazineTypes] = useState([]);
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [selectedMagazine, setSelectedMagazine] = useState(null);
  const [selectedMagazineType, setSelectedMagazineType] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [selectedDate, setSelectedDate] = useState(moment().toDate());
  const [selectedSuppliedDate, setSelectedSuppliedDate] = useState(
    moment().toDate()
  );
  const language = useSelector((state) => state?.labels?.language);
  const token = useSelector((state) => state.user.user.token);

  useEffect(() => {
    setAllLibrarysList();
    setAllEntriesList();
    // setMasterList();
    getMagazineNewspaperType();
  }, []);
  useEffect(() => {
    setMasterList();
  }, [selectedMagazineType]);

  const setMasterList = () => {
    if (selectedMagazineType) {
      // const url = urls.LMSURL + "/magazineNewspaperMaster/getAll";
      const url = `${urls.LMSURL}/magazineNewspaperMaster/getAllByMagazineTypeKey?magazineTypeKey=${selectedMagazineType?.id}`;
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
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
          swal(err.message, { icon: "error" });
        });
    }
  };

  const setAllEntriesList = () => {
    const url = urls.LMSURL + "/trnDailyMagazineNewsPaperEntry/getAll";
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(
          "magazine123",
          response.data.trnDailyMagazineNewsPaperEntryList
        );
        setMagazineNewspaperEntriesList(
          response.data.trnDailyMagazineNewsPaperEntryList
            .sort((a, b) => b.id - a.id)
            .map((entry, i) => ({
              srNo: i + 1,
              ...entry,
              receivedAt: entry.receivedAt
                ? moment(entry.receivedAt).format("DD/MM/YYYY")
                : "-",
              suppliedAt: entry.suppliedAt
                ? moment(entry.suppliedAt).format("DD/MM/YYYY")
                : "-",
            }))
        );
      })
      .catch((err) => {
        console.error(err);
        swal(err.message, { icon: "error" });
      });
  };

  const setAllLibrarysList = () => {
    const url = urls.LMSURL + "/libraryMaster/getAll";
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
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
        console.error(err);
        swal(err.message, { icon: "error" });
      });
  };

  const getMagazineNewspaperType = () => {
    axios
      .get(`${urls.LMSURL}/magazineNewspaperType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((rs) => {
        let _res = rs?.data?.magazineNewspaperTypeMasterDaoList?.sort(
          (a, b) => b.id - a.id
        );
        setAllMagazineTypes(_res ?? []);
      })
      .catch((er) => {
        swal(er?.message, { icon: "error" });
      });
  };

  const {
    register,
    methods,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
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
    setSelectedMagazineType(null);
    setMagazineNewspaperMasterList([]);
    setSelectedDate(moment().toDate());
    setQuantity("");
    setPrice("");
    setSelectedSuppliedDate(null);
    setSelectedDate(null);
  };

  const onSubmitForm = () => {
    if (
      !selectedLibrary ||
      !selectedMagazine ||
      !selectedMagazineType ||
      !selectedDate ||
      !selectedSuppliedDate ||
      !quantity
    ) {
      // swal("Please enter all values", { icon: "warning" });
      swal({
        // title: language === "en" ? "Saved " : "जतन केले",
        text:
          language === "en"
            ? "Please Enter All Values"
            : "कृपया सर्व मूल्ये प्रविष्ट करा",
        icon: "warning",
        button: language === "en" ? "Ok" : "ठीक आहे",
        dangerMode: false,
        closeOnClickOutside: false,
      });

      return;
    }
    const payload = {
      libraryMasterKey: selectedLibrary.id,
      libraryName: selectedLibrary.libraryName,
      magazineNewspaperMasterKey: selectedMagazine.id,
      magazineNewspaperName: selectedMagazine.magazineName,
      magazineNewspaperSupplierMasterKey:
        selectedMagazine.magazineNewspaperSupplierMasterKey,
      supplierName: selectedMagazine.supplierName,
      quantity: +quantity,
      magazineNewspaperTypeKey: selectedMagazineType?.id,
      magazineNewspaperTypeName:
        selectedMagazineType?.magazineNewspaperTypeName,
      price: price,
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
        console.log(response.data);
        setAllEntriesList();
        swal(language == "en" ? "Entry saved." : "प्रवेश जतन केला.", {
          icon: "success",
        });
        return exitButton();
      })
      .catch((err) => {
        console.error(err);
        swal(err.message, { icon: "error" });
      });
  };

  const columns = [
    {
      // headerName: "Sr. No.",
      headerName: <FormattedLabel id="srNo" />,
      field: "srNo",
      flex: 3,
    },
    {
      // headerName: "Magazine/Newspaper Name",
      headerName: <FormattedLabel id="magazinesNewspaperName" />,
      field: "magazineNewspaperName",
      flex: 3,
    },
    // {
    //   headerName: "Supplier Name",
    //   field: "supplierName",
    //   flex: 3
    // },
    // { headerName: "Supplier Contact Number", field: "contactNumber", flex: 3 },
    {
      // headerName: "Date of Publishing",
      headerName: <FormattedLabel id="publishedDate" />,
      field: "suppliedAt",
      flex: 3,
    },
    {
      // headerName: "Date of Receipt",
      headerName: <FormattedLabel id="receivedDate" />,
      field: "receivedAt",
      flex: 3,
    },
    {
      // headerName: "Quantity",
      headerName: <FormattedLabel id="quantity" />,
      field: "quantity",
      flex: 3,
    },
  ];

  return (
    <>
      {/* <Box
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "10px",
          // backgroundColor:'#0E4C92'
          // backgroundColor:'		#0F52BA'
          // backgroundColor:'		#0F52BA'
          background:
            "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <h2>
          <FormattedLabel id="dailyEntryMagazineNewspaper" />
        </h2>
      </Box> */}
      <LocalizationProvider dateAdapter={AdapterMoment}>
        {/* <ThemeProvider theme={theme}> */}
        <Paper
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginTop: 5,
            marginBottom: 5,
            padding: 1,
          }}
        >
          <Box>
            <BreadcrumbComponent />
          </Box>
          <LmsHeader labelName="dailyEntryMagazineNewspaper" />
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
                      <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                        <Autocomplete
                          sx={{
                            m: 1,
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          // label="Library ID *"
                          label={<FormattedLabel id="libraryCSC" />}
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
                            <TextField
                              {...params}
                              // sx={{ width: "20vw", paddingRight: "1vw" }}
                              sx={{ width: 300, paddingRight: "1vw" }}
                              variant="standard"
                              // label="Choose a library"
                              label={<FormattedLabel id="libraryCSC" />}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                        <Autocomplete
                          sx={{
                            m: 1,
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          // label="Magazine/Newspaper *"
                          label={<FormattedLabel id="magazineNewspaperType" />}
                          disablePortal
                          options={allMagazineTypes}
                          value={selectedMagazineType}
                          onChange={(_e, mag) => {
                            setSelectedMagazineType(mag);
                            console.log("mag", mag);
                          }}
                          getOptionLabel={({ magazineNewspaperTypeName }) =>
                            magazineNewspaperTypeName || ""
                          }
                          isOptionEqualToValue={(opt, sel) => {
                            return opt.id === sel.id;
                          }}
                          renderOption={(props, option) => (
                            <span {...props}>
                              {option.magazineNewspaperTypeName}
                            </span>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              // sx={{ width: "20vw", paddingRight: "1vw" }}
                              sx={{ width: 300, paddingRight: "1vw" }}
                              variant="standard"
                              // label="Choose a magazine/newspaper"
                              label={
                                <FormattedLabel id="magazineNewspaperType" />
                              }
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                        <Autocomplete
                          sx={{
                            m: 1,
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          // label="Magazine/Newspaper *"
                          label={<FormattedLabel id="magazinesNewspaperName" />}
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
                              // sx={{ width: "20vw", paddingRight: "1vw" }}
                              sx={{ width: 300, paddingRight: "1vw" }}
                              variant="standard"
                              // label="Choose a magazine/newspaper"
                              label={
                                <FormattedLabel id="magazinesNewspaperName" />
                              }
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      style={{
                        padding: "10px",
                      }}
                    >
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={4}
                        sm={12}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          // sx={{ m: 1, width: "100%" }}
                          // label="Quantity *"
                          label={<FormattedLabel id="quantity" />}
                          // sx={{ width: "20vw", paddingRight: "1vw" }}
                          sx={{ width: 300, paddingRight: "1vw" }}
                          variant="standard"
                          // type="number"
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
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <DesktopDatePicker
                          sx={{ m: 1, width: "100%" }}
                          // label="Published Date *"
                          label={<FormattedLabel id="publishedDate" />}
                          // variant="standard"
                          inputFormat="DD/MM/YYYY"
                          value={selectedSuppliedDate || null}
                          onChange={(d) => {
                            setSelectedSuppliedDate(d);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              // sx={{ width: "20vw", paddingRight: "1vw" }}
                              sx={{ width: 300, paddingRight: "1vw" }}
                              variant="standard"
                            />
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
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <DesktopDatePicker
                          sx={{ m: 1, width: "100%" }}
                          // label="Received Date *"
                          label={<FormattedLabel id="receivedDate" />}
                          variant="standard"
                          inputFormat="DD/MM/YYYY"
                          value={selectedDate || null}
                          onChange={(d) => {
                            setSelectedDate(d);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              // sx={{ width: "20vw", paddingRight: "1vw" }}
                              sx={{ width: 300, paddingRight: "1vw" }}
                              variant="standard"
                            />
                          )}
                          minDate={selectedSuppliedDate}
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      style={{
                        padding: "10px",
                      }}
                    >
                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={4}
                        sm={12}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          // sx={{ m: 1, width: "100%" }}
                          // label="Quantity *"
                          label={<FormattedLabel id="price" />}
                          // sx={{ width: "20vw", paddingRight: "1vw" }}
                          sx={{ width: 300, paddingRight: "1vw" }}
                          variant="standard"
                          // type="number"
                          value={price}
                          onChange={(e) => {
                            setPrice(e.target.value);
                          }}
                          error={!!errors.price}
                          helperText={
                            errors?.price ? errors.price.message : null
                          }
                        />
                      </Grid>
                    </Grid>

                    <div className={styles.btn}>
                      <div className={styles.btn1}>
                        <Button
                          type="button"
                          onClick={onSubmitForm}
                          variant="contained"
                          color="success"
                          size="small"
                          endIcon={<SaveIcon />}
                        >
                          {/* {btnSaveText} */}
                          {<FormattedLabel id={btnSaveText} />}
                        </Button>
                      </div>
                      <div className={styles.btn1}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                        >
                          {/* Clear */}
                          {<FormattedLabel id="clear" />}
                        </Button>
                      </div>
                      <div className={styles.btn1}>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitButton()}
                        >
                          {/* Exit */}
                          {<FormattedLabel id="exit" />}
                        </Button>
                      </div>
                    </div>
                  </form>
                </FormProvider>
              </div>
            </Slide>
          ) : (
            <>
              <div className={styles.addbtn}>
                <Button
                  variant="contained"
                  endIcon={<AddIcon />}
                  size="small"
                  type="primary"
                  disabled={buttonInputState}
                  onClick={() => {
                    reset({});
                    setEditButtonInputState(true);
                    setDeleteButtonState(true);
                    setBtnSaveText("save");
                    setButtonInputState(true);
                    setSlideChecked(true);
                    setIsOpenCollapse(!isOpenCollapse);
                  }}
                >
                  {/* Add */}
                  {<FormattedLabel id="add" />}
                </Button>
              </div>
              <DataGrid
                components={{ Toolbar: GridToolbar }}
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                    // printOptions: { disableToolbarButton: true },
                    // disableExport: true,
                    // disableToolbarButton: true,
                    // csvOptions: { disableToolbarButton: true },
                  },
                }}
                autoHeight
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
                rows={magazineNewspaperEntriesList}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                //checkboxSelection
              />
            </>
          )}
        </Paper>
        {/* </ThemeProvider> */}
      </LocalizationProvider>
    </>
  );
};
export default DepartmentalProcess;
