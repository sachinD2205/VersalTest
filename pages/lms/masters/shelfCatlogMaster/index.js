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
  Box,
  ThemeProvider,
} from "@mui/material";
import { Paper } from "@mui/material";
import { DataGrid, GridCell, GridRow, GridToolbar } from "@mui/x-data-grid";
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
import schema from "../../../../containers/schema/libraryManagementSystem/shelfCatlogMaster";
import axios from "axios";
import urls from "../../../../URLS/urls";
import sweetAlert from "sweetalert";
import theme from "../../../../theme";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import Loader from "../../../../containers/Layout/components/Loader";
import LmsHeader from "../../../../components/lms/lmsHeader";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const ShelfCatlogMaster = () => {
  const [btnSaveText, setBtnSaveText] = useState("save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [libraryNameState, setLibraryNameState] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.user.user.token);
  const languagee = useSelector((state) => state.labels.language);

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
    getLibraryName();
  }, []);

  useEffect(() => {
    getTableData();
  }, [libraryNameState]);

  const getLibraryName = () => {
    axios
      .get(`${urls.LMSURL}/libraryMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        // console.log("Library names: ", r.data);
        setLibraryNameState(
          r.data?.libraryMasterList.map((row) => ({
            id: row.id,
            libraryName: row.libraryName,
            libraryType: row.libraryType,
            studyCenter: row.studyCenterName,
          }))
        );
      })
      .catch((error) => {
        // setLoading(false);
        callCatchMethod(error, languagee);
      });
  };

  const getTableData = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    axios
      .get(`${urls.LMSURL}/ShelfCatlogMaster/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: "id",
          sortDir: "dsc",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setLoading(false);
        console.log("Table: ", res.data);
        let temp = res.data?.shelfCatlogMasterList.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          libraryName: libraryNameState?.find((obj) => obj?.id == r.libraryKey)
            ?.libraryName,
          shelfNo: r.shelfNo,
          shelfCatlogSection: r.shelfCatlogSection,
          // shelfCatlogName: r.shelfCatlogName,
          remark: r.remark,
          bookCaseNo: r.bookCaseNo,
          accessionNo: r.accessionNo,
          activeFlag: r.activeFlag,
          status: r.activeFlag === "Y" ? "Active" : "Inactive",
        }));
        console.log("temp", temp);
        setDataSource(temp);
      })
      .catch((error) => {
        setLoading(false);
        callCatchMethod(error, languagee);
      });
  };

  const onSubmitForm = (formData) => {
    setLoading(true);
    const finalBodyForApi = {
      ...formData,
    };
    // Save - DB

    console.log("FinalBody", finalBodyForApi);
    axios
      .post(`${urls.LMSURL}/ShelfCatlogMaster/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status == 201) {
          setLoading(false);
          formData.id
            ? sweetAlert(
                laguage == "en" ? "Updated!" : "अपडेट केले",
                laguage == "en"
                  ? "Record Updated successfully !"
                  : "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
                "success"
              )
            : sweetAlert(
                language === "en" ? "Saved!" : "जतन केले!",
                language === "en"
                  ? "Record Saved successfully !"
                  : "रेकॉर्ड यशस्वीरित्या जतन केले!",
                "success"
              );
          getTableData();
          setButtonInputState(false);
          setIsOpenCollapse(true);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        callCatchMethod(error, languagee);
      });
  };

  // const deleteById = (value) => {
  //   swal({
  //     title: "Delete?",
  //     text: "Are you sure you want to delete this Record ? ",
  //     icon: "warning",
  //     buttons: true,
  //     dangerMode: true,
  //   }).then((willDelete) => {
  //     if (willDelete) {
  //       axios
  //         .delete(
  //           `${urls.LMSURL}/ShelfCatlogMaster/delete/${value}`
  //         )
  //         .then((res) => {
  //           if (res.status == 226) {
  //             swal("Record is Successfully Deleted!", {
  //               icon: "success",
  //             });
  //             setButtonInputState(false);
  //             getTableData();
  //           }
  //         });
  //     } else {
  //       swal("Record is Safe");
  //     }
  //   });
  // };

  const deleteById = (value, _activeFlag) => {
    setLoading(true);
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("active", body);
    // swal({
    //   title: "Delete?",
    //   text: "Are you sure you want to delete this Record ? ",
    //   icon: "warning",
    //   buttons: true,
    //   dangerMode: true,
    // }).then((willDelete) => {
    //   if (willDelete) {
    //     axios
    //       // .delete(
    //       //   `${urls.LMSURL}/bookMaster/delete/${value}`
    //       // )
    //       .post(`${urls.LMSURL}/bookClassificationMaster/save`, body)
    //       .then((res) => {
    //         if (res.status == 226) {
    //           swal("Record is Successfully Deleted!", {
    //             icon: "success",
    //           });
    //           setButtonInputState(false);
    //           getTableData();
    //         }
    //       });
    //   } else {
    //     swal("Record is Safe");
    //   }
    // });
    if (_activeFlag === "N") {
      swal({
        title: language == "en" ? "Inactivate?" : "निष्क्रिय करा?",
        text:
          language == "en"
            ? "Are you sure you want to inactivate this Record?"
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.LMSURL}/ShelfCatlogMaster/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                setLoading(false);
                swal(
                  language == "en"
                    ? "Record is Successfully Inactivated!"
                    : "रेकॉर्ड यशस्वीरित्या निष्क्रिय केले आहे!",
                  {
                    icon: "success",
                  }
                );
                setButtonInputState(false);
                getTableData();
              }
            })
            .catch((error) => {
              setLoading(false);
              callCatchMethod(error, languagee);
            });
        } else if (willDelete == null) {
          swal(language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे");
          setLoading(false);
        }
      });
    } else {
      swal({
        title: language == "en" ? "Activate?" : "सक्रिय करा?",
        text:
          language == "en"
            ? "Are you sure you want to activate this Record?"
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.LMSURL}/ShelfCatlogMaster/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201) {
                setLoading(false);
                swal(
                  language == "en"
                    ? "Record is Successfully Activated!"
                    : "रेकॉर्ड यशस्वीरित्या सक्रिय केले आहे!",
                  {
                    icon: "success",
                  }
                );
                setButtonInputState(false);
                getTableData();
              }
            })
            .catch((error) => {
              setLoading(false);
              callCatchMethod(error, languagee);
            });
        } else if (willDelete == null) {
          swal(language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे");
          setLoading(false);
        }
      });
    }
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
    libraryKey: "",
    shelfNo: "",
    shelfCatlogSection: "",
    bookCaseNo: "",
    accessionNo: "",
    remark: "",
  };

  const resetValuesExit = {
    libraryKey: "",
    shelfNo: "",
    shelfCatlogSection: "",
    bookCaseNo: "",
    accessionNo: "",
    remark: "",
    id: null,
  };

  const columns = [
    {
      field: "srNo",
      // headerName: "Sr.No",
      // headerName: <FormattedLabel id="srNo" />,
      headerName: languagee === "en" ? "Sr.No" : "अनुक्रमांक",

      flex: 1,
    },
    // {
    //   field: "shelfCatlogCodeId",
    //   headerName: "Shelf Catlog Code Id",
    //   flex: 3,
    // },
    {
      field: "libraryName",
      // headerName: "Library Name",
      // headerName: <FormattedLabel id="lib" />,
      headerName: languagee === "en" ? "Library Name" : "ग्रंथालयाचे नाव",

      //type: "number",
      flex: 1,
    },
    {
      field: "shelfNo",
      // headerName: "Shelf No.",
      // headerName: <FormattedLabel id="shelfNo" />,
      headerName: languagee === "en" ? "Shelf No" : "शेल्फ क्र",
      //type: "number",
      flex: 1,
    },
    {
      field: "shelfCatlogSection",
      // headerName: "Shelf Catlog Section",
      // headerName: <FormattedLabel id="shelfCatlogSection" />,
      headerName:
        languagee === "en" ? "Shelf Catlog Section" : "शेल्फ कॅटलॉग विभाग",
      //type: "number",
      flex: 1,
    },
    {
      field: "bookCaseNo",
      // headerName: "Shelf Catlog Section",
      // headerName: <FormattedLabel id="bookCaseNo" />,
      headerName: languagee === "en" ? "Book Case No" : "पुस्तक प्रकरण क्र",
      //type: "number",
      flex: 1,
    },
    {
      field: "accessionNo",
      // headerName: "Shelf Catlog Section",
      // headerName: <FormattedLabel id="accessionNo" />,
      headerName: languagee === "en" ? "Accession No" : "प्रवेश क्रमांक",
      //type: "number",
      flex: 1,
    },
    {
      field: "remark",
      // headerName: "Remark",
      // headerName: <FormattedLabel id="remark" />,
      headerName: languagee === "en" ? "Remarks" : "टिप्पणी",
      //type: "number",
      flex: 1,
    },

    {
      field: "actions",
      // headerName: "Actions",
      // headerName: <FormattedLabel id="actions" />,
      headerName: languagee === "en" ? "Actions" : "क्रिया",
      // width: 120,
      flex: 2,
      align: "right",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                reset(params.row);
              }}
            >
              <EditIcon />
            </IconButton>
            {/* <IconButton
              disabled={deleteButtonInputState}
              onClick={() => deleteById(params.id)}
            >
              <DeleteIcon />
            </IconButton> */}
            <IconButton
              disabled={deleteButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true);
                // setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "Y")}
                />
              )}
            </IconButton>
          </>
        );
      },
    },
  ];
  return (
    <>
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
        <LmsHeader labelName="shelfCatlogMaster" />

        {loading ? (
          <Loader />
        ) : (
          <>
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
                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          <FormControl
                            variant="standard"
                            sx={{ m: 1, width: "100%" }}
                            error={!!errors.libraryKey}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              {/* Library Name */}
                              {<FormattedLabel id="lib" />}
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: "100%" }}
                                  value={field.value}
                                  onChange={(value) => {
                                    console.log(value.target.value);
                                    field.onChange(value);
                                  }}
                                  // label="Library Name"
                                  label={<FormattedLabel id="lib" />}
                                >
                                  {libraryNameState &&
                                    libraryNameState.map(
                                      (libraryName, index) => (
                                        <MenuItem
                                          key={index}
                                          value={libraryName.id}
                                        >
                                          {libraryName.libraryName}
                                        </MenuItem>
                                      )
                                    )}
                                </Select>
                              )}
                              name="libraryKey"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.libraryKey
                                ? errors.libraryKey.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>

                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          <TextField
                            sx={{ m: 1, width: "100%" }}
                            id="standard-basic"
                            // label="Shelf No. *"
                            label={<FormattedLabel id="shelfNo" />}
                            variant="standard"
                            {...register("shelfNo")}
                            error={!!errors.shelfNo}
                            helperText={
                              errors?.shelfNo ? errors.shelfNo.message : null
                            }
                          />
                        </Grid>
                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          <TextField
                            sx={{ m: 1, width: "100%" }}
                            id="standard-basic"
                            // label="Shelf Catlog Section *"
                            label={<FormattedLabel id="shelfCatlogSection" />}
                            variant="standard"
                            {...register("shelfCatlogSection")}
                            error={!!errors.shelfCatlogSection}
                            helperText={
                              errors?.shelfCatlogSection
                                ? errors.shelfCatlogSection.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          <TextField
                            sx={{ m: 1, width: "96%" }}
                            id="standard-basic"
                            // label="Remark *"
                            label={<FormattedLabel id="bookCaseNo" />}
                            variant="standard"
                            {...register("bookCaseNo")}
                            error={!!errors.bookCaseNo}
                            helperText={
                              errors?.bookCaseNo
                                ? errors.bookCaseNo.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          <TextField
                            sx={{ m: 1, width: "96%" }}
                            id="standard-basic"
                            // label="Remark *"
                            label={<FormattedLabel id="accessionNo" />}
                            variant="standard"
                            {...register("accessionNo")}
                            error={!!errors.accessionNo}
                            helperText={
                              errors?.accessionNo
                                ? errors.accessionNo.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          <TextField
                            sx={{ m: 1, width: "96%" }}
                            id="standard-basic"
                            // label="Remark *"
                            label={<FormattedLabel id="remark" />}
                            variant="standard"
                            {...register("remark")}
                            error={!!errors.remark}
                            helperText={
                              errors?.remark ? errors.remark.message : null
                            }
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
                            type="submit"
                            variant="contained"
                            color="success"
                            size="small"
                            endIcon={<SaveIcon />}
                          >
                            {/* {btnSaveText} */}
                            {<FormattedLabel id={btnSaveText} />}
                          </Button>
                        </Grid>
                        <Grid
                          item
                          xs={4}
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
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
                        </Grid>
                        <Grid item xs={4}>
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
                        </Grid>
                      </Grid>
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
                size="small"
                disabled={buttonInputState}
                onClick={() => {
                  reset({
                    ...resetValuesExit,
                  });
                  setEditButtonInputState(true);
                  setDeleteButtonState(true);
                  setBtnSaveText("save");
                  setButtonInputState(true);
                  setSlideChecked(true);
                  setIsOpenCollapse(!isOpenCollapse);
                }}
              >
                {/* Add{" "} */}
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
              rows={dataSource}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              //checkboxSelection
            />
          </>
        )}
      </Paper>
    </>
  );
};
export default ShelfCatlogMaster;
