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
  InputBase,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  Stack,
  TextField,
  ThemeProvider,
  Toolbar,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {
  DataGrid,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
// import styles from "../court/view.module.css
// import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css";
import styles from "../../../../styles/ElectricBillingPayment_Styles/billingCycle.module.css";
import sweetAlert from "sweetalert";
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { GridToolbar } from "@mui/x-data-grid";
import { border } from "@mui/system";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
// import urls from "../../../../URLS/urls";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
// import theme from "../../../../theme";
import theme from "../../../../theme";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import Loader from "../../../../containers/Layout/components/Loader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LmsHeader from "../../../../components/lms/lmsHeader";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import * as yup from "yup";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

  // schema - validation
  let schema = yup.object().shape({
    bookType: yup
      .string()
      .nullable()
      .required(
        language == "en"
          ? "Book Type is Required !!!"
          : "पुस्तकाचा प्रकार आवश्यक आहे !!!"
      ),
    bookSubtype: yup
      .string()
      .required(
        language == "en"
          ? "Book Sub Type is Required !!!"
          : "पुस्तक उपप्रकार आवश्यक आहे !!!"
      ),
  });

  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [btnSaveText, setBtnSaveText] = useState("save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const router = useRouter();

  const [bookTypes, setBookTypes] = useState([]);
  const [loading, setLoading] = useState(false);
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
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(
    () => {
      getBookClassifications();
    },
    [fetchData],
    [bookTypes]
  );

  const getBookTypes = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    axios
      .get(`${urls.LMSURL}/bookTypeMaster/getAll`, {
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
      .then((r) => {
        console.log(";r", r);
        let result = r.data.bookTypeMasterList;
        console.log("result", result);
        let _res = result.map((r, i) => {
          console.log("44");
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,

            id: r.id,
            srNo: i + 1,
            bookType: r.bookType,

            status: r.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });
        setBookTypes([..._res]);
      })
      .catch((error) => {
        // setLoading(false);
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    getBookTypes();
  }, []);

  // Get Table - Data
  const getBookClassifications = (_pageSize = 10, _pageNo = 0) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    setLoading(true);
    axios
      .get(`${urls.LMSURL}/bookSubTypeMaster/getAll`, {
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
      .then((r) => {
        setLoading(false);
        console.log(";r", r);
        let result = r.data.bookSubTypeMasterList;
        console.log("result123", result);

        let _res = result.map((r, i) => {
          console.log("44");
          return {
            // r.data.map((r, i) => ({
            activeFlag: r.activeFlag,

            id: r.id,
            srNo: _pageSize * _pageNo + i + 1,
            bookSubtype: r.bookSubtype,
            bookType: r.bookType,

            status: r.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });

        console.log("bookTypes", _res);
        setDataSource([..._res]);
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      })
      .catch((error) => {
        setLoading(false);
        callCatchMethod(error, language);
      });
  };

  const onSubmitForm = (fromData) => {
    setLoading(true);
    console.log("fromData", fromData);
    // Save - DB
    let _body = {
      ...fromData,
      activeFlag: fromData.activeFlag,
    };
    if (btnSaveText === "save") {
      const tempData = axios
        .post(`${urls.LMSURL}/bookSubTypeMaster/save`, _body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            setLoading(false);
            sweetAlert(
              language === "en" ? "Saved!" : "जतन केले!",
              language === "en"
                ? "Record Saved successfully !"
                : "रेकॉर्ड यशस्वीरित्या जतन केले!",
              "success"
            );

            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "update") {
      const tempData = axios
        .post(`${urls.LMSURL}/bookSubTypeMaster/save`, _body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("res", res);
          if (res.status == 201) {
            setLoading(false);
            fromData.id
              ? sweetAlert(
                  language == "en" ? "Updated!" : "अपडेट केले",
                  language == "en"
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
            getBookClassifications();
            // setButtonInputState(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    }
  };

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    setLoading(true);
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
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
            // .delete(`${urls.NRMS}/newspaperRotationGroupMaster/delete/${body.id}`)
            .post(`${urls.LMSURL}/bookSubTypeMaster/save`, body, {
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
                getBookClassifications();
                // setButtonInputState(false);
              }
            })
            .catch((error) => {
              setLoading(false);
              callCatchMethod(error, language);
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
            // .delete(`${urls.LMSURL}/bookSubTypeMaster/delete/${body.id}`)
            .post(`${urls.LMSURL}/bookSubTypeMaster/save`, body, {
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
                // getPaymentRate();
                getBookClassifications();
                // setButtonInputState(false);
              }
            })
            .catch((error) => {
              setLoading(false);
              callCatchMethod(error, language);
            });
        } else if (willDelete == null) {
          swal(language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे");
          setLoading(false);
        }
      });
    }
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
    bookType: "",
    bookSubtype: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    bookType: "",
    bookSubtype: "",

    id: null,
  };

  const columns = [
    {
      field: "srNo",
      // headerName: "id",
      // headerName: <FormattedLabel id="srNo" />,
      headerName: language === "en" ? "Sr.No" : "अनुक्रमांक",
      flex: 1,
    },
    {
      field: "bookType",
      // headerName: "Book Type",
      // headerName: <FormattedLabel id="bookType" />,
      headerName: language === "en" ? "Book Type" : "पुस्तक प्रकार",
      flex: 1,
    },
    {
      field: "bookSubtype",

      // headerName: "Book Sub Type",
      // headerName: <FormattedLabel id="bookSubType" />,
      headerName: language === "en" ? "Book Sub Type" : "पुस्तक उपप्रकार",
      flex: 1,
    },

    {
      field: "actions",
      // headerName: "Actions",
      // headerName: <FormattedLabel id="actions" />,
      headerName: language === "en" ? "Actions" : "क्रिया",
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                // setButtonInputState(true);
                console.log("params.row: ", params.row);
                reset(params.row);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            {/* <IconButton onClick={() => deleteById(params.id)}>
              <DeleteIcon />
            </IconButton> */}
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("update"),
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
          </Box>
        );
      },
    },
  ];

  // Row

  return (
    <Paper
      elevation={8}
      variant="outlined"
      sx={{
        border: 1,
        borderColor: "grey.500",
        marginLeft: "10px",
        marginRight: "10px",
        marginTop: "10px",
        marginBottom: "60px",
        padding: 1,
      }}
    >
      {" "}
      <Box>
        <BreadcrumbComponent />
      </Box>
      <LmsHeader labelName="bookSubTypeMaster" />
      {loading ? (
        <Loader />
      ) : (
        <>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              {isOpenCollapse && (
                <Slide
                  direction="down"
                  in={slideChecked}
                  mountOnEnter
                  unmountOnExit
                >
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                      <FormControl
                        variant="standard"
                        fullWidth
                        error={!!errors.bookType}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {/* Book Type */}
                          {<FormattedLabel id="bookType" required />}
                        </InputLabel>

                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: "90%" }}
                              value={field.value}
                              onChange={(value) => {
                                console.log(value.target.value);
                                field.onChange(value);
                              }}
                              // label="Book Type"
                              label={<FormattedLabel id="bookType" />}
                            >
                              {bookTypes &&
                                bookTypes.map((bookType, index) => (
                                  <MenuItem
                                    key={index}
                                    value={bookType.bookType}
                                  >
                                    {bookType.bookType}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="bookType"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.bookType ? errors.bookType.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                      <TextField
                        // label="Book Sub Type"
                        label={<FormattedLabel id="bookSubType" required />}
                        id="standard-basic"
                        sx={{ width: "90%" }}
                        variant="standard"
                        {...register("bookSubtype")}
                        error={!!errors.bookSubtype}
                        InputProps={{ style: { fontSize: 18 } }}
                        InputLabelProps={{
                          style: { fontSize: 15 },
                          //true
                          shrink:
                            (watch("bookSubtype") ? true : false) ||
                            (router.query.bookSubtype ? true : false),
                        }}
                        helperText={
                          errors?.bookSubtype
                            ? errors.bookSubtype.message
                            : null
                        }
                      />
                    </Grid>

                    <Grid
                      container
                      style={{
                        padding: "10px",
                      }}
                    >
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
                          {/* {btnSaveText === "update" ? (
                                                    "update"
                                                ) : (
                                                    "save"
                                                )} */}
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
                          {/* clear */}
                          {<FormattedLabel id="clear" />}
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitButton()}
                        >
                          {/* exit */}
                          {<FormattedLabel id="exit" />}
                        </Button>
                      </Grid>
                    </Grid>
                    {/* </div> */}
                  </Grid>
                </Slide>
              )}
            </form>
          </FormProvider>

          <div className={styles.addbtn}>
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              // type='primary'
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
              {/* add */}
              {<FormattedLabel id="add" />}
            </Button>
          </div>

          <DataGrid
            // disableColumnFilter
            // disableColumnSelector
            // disableToolbarButton
            // disableDensitySelector
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
            // rows={dataSource}
            // columns={columns}
            // pageSize={5}
            // rowsPerPageOptions={[5]}
            //checkboxSelection

            density="compact"
            // autoHeight={true}
            // rowHeight={50}
            pagination
            paginationMode="server"
            // loading={data.loading}
            rowCount={data.totalRows}
            rowsPerPageOptions={data.rowsPerPageOptions}
            page={data.page}
            pageSize={data.pageSize}
            rows={data.rows}
            columns={columns}
            onPageChange={(_data) => {
              getBookClassifications(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              console.log("222", _data);
              // updateData("page", 1);
              getBookClassifications(_data, data.page);
            }}
          />
        </>
      )}
    </Paper>
  );
};

export default Index;
