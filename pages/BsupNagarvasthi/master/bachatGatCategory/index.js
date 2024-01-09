import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import SaveIcon from "@mui/icons-material/Save";
import { Box, Button, Grid, Paper, Slide, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import styles from "../../../../styles/BsupNagarvasthi/masters/[bachatGatCategory].module.css";
import { schema } from "../../../../containers/schema/BsupNagarvasthiSchema/bachatGatCategorySchema";
import sweetAlert from "sweetalert";
import { GridToolbar } from "@mui/x-data-grid";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
import Loader from "../../../../containers/Layout/components/Loader";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";

const Index = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = methods;

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [pageNo, setPage] = useState(10);
  const [dataPageNo, setDataPage] = useState();
  const router = useRouter();
  const user = useSelector((state) => state.user.user);
  const language = useSelector((state) => state.labels.language);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const loggedUser = localStorage.getItem("loggedInUser");

  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error, moduleOrCFC) => {
    if (!catchMethodStatus) {
      if (moduleOrCFC) {
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      } else {
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };

  // const headers =
  // loggedUser === "citizenUser"
  //   ? { Userid: user?.id, Authorization: `Bearer ${user?.token}` }
  //   : { Authorization: `Bearer ${user?.token}` };
  const headers = { Authorization: `Bearer ${user?.token}` };

  useEffect(() => {
    getBachatgatCategory();
  }, [fetchData]);

  // Get Table - Data
  const getBachatgatCategory = (_pageSize = 10, _pageNo = 0) => {
    setIsLoading(true);
    axios
      .get(`${urls.BSUPURL}/mstBachatGatCategory/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: headers,
      })
      .then((r) => {
        setIsLoading(false);
        let result = r.data.mstBachatGatCategoryList;
        let _res = result.map((r, i) => {
          return {
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1 + _pageNo * _pageSize,
            bgCategoryPrefix: r.bgCategoryPrefix,
            bgCategoryPrefixMr: r.bgCategoryPrefixMr,
            bgCategoryNo: r.bgCategoryNo,
            bgCategoryName: r.bgCategoryName,
            bgCategoryMr: r.bgCategoryMr,
            status: r.activeFlag === "Y" ? "Active" : "Inactive",
          };
        });
        setDataSource([..._res]);
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  // on submit
  const onSubmitForm = (fromData) => {
    let _body = {
      ...fromData,
      activeFlag: fromData.activeFlag,
    };
    if (btnSaveText === "Save") {
      setIsLoading(true);
      const tempData = axios
        .post(`${urls.BSUPURL}/mstBachatGatCategory/save`, _body, {
          headers: headers,
        })
        .then((res) => {
          setIsLoading(false);
          if (res.status == 201) {
            sweetAlert(
              language === "en" ? "Saved!" : "जतन केले!",
              language === "en"
                ? "Record Saved Successfully !"
                : "रेकॉर्ड यशस्वीरित्या जतन केले!",
              "success",
              { button: language === "en" ? "Ok" : "ठीक आहे" }
            );
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    }
    // Update Data Based On ID
    else if (btnSaveText === "Update") {
      setIsLoading(true);
      const tempData = axios
        .post(`${urls.BSUPURL}/mstBachatGatCategory/save`, _body, {
          headers: headers,
        })
        .then((res) => {
          setIsLoading(false);
          if (res.status == 201) {
            fromData.id
              ? sweetAlert(
                  language === "en" ? "Updated!" : "अद्ययावत केले!",
                  language === "en"
                    ? "Record Updated Successfully !"
                    : "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
                  "success",
                  { button: language === "en" ? "Ok" : "ठीक आहे" }
                )
              : sweetAlert(
                  language === "en" ? "Saved!" : "जतन केले!",
                  language === "en"
                    ? "Record Saved Successfully !"
                    : "रेकॉर्ड यशस्वीरित्या जतन केले!",
                  "success",
                  { button: language === "en" ? "Ok" : "ठीक आहे" }
                );
            getBachatgatCategory();
            setEditButtonInputState(false);
            setDeleteButtonState(false);
            setIsOpenCollapse(false);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    if (_activeFlag === "N") {
      swal({
        title: language === "en" ? "Inactivate?" : "निष्क्रिय करायचे?",
        text:
          language === "en"
            ? "Are you sure you want to inactivate this Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        buttons: [
          language == "en" ? "No" : "नाही",
          language === "en" ? "Yes" : "होय",
        ],
      }).then((willDelete) => {
        if (willDelete === true) {
          setIsLoading(true);
          axios
            .post(`${urls.BSUPURL}/mstBachatGatCategory/save/`, body, {
              headers: headers,
            })
            .then((res) => {
              setIsLoading(false);
              if (res.status == 201) {
                swal(
                  language === "en"
                    ? "Record is Successfully Inactivated!"
                    : "रेकॉर्ड यशस्वीरित्या निष्क्रिय आहे!",
                  {
                    icon: "success",
                    button: language === "en" ? "Ok" : "ठीक आहे",
                  }
                );
                getBachatgatCategory();
              }
            })
            .catch((err) => {
              setIsLoading(false);
              cfcErrorCatchMethod(err, false);
            });
        } else if (willDelete == null) {
          swal(language === "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे", {
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        }
      });
    } else {
      swal({
        title: language === "en" ? "Activate?" : "सक्रिय करू?",
        text:
          language === "en"
            ? "Are you sure you want to activate this Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        buttons: [
          language == "en" ? "No" : "नाही",
          language === "en" ? "Yes" : "होय",
        ],
      }).then((willDelete) => {
        if (willDelete === true) {
          setIsLoading(true);
          axios
            .post(`${urls.BSUPURL}/mstBachatGatCategory/save`, body, {
              headers: headers,
            })
            .then((res) => {
              setIsLoading(false);
              if (res.status == 201) {
                swal(
                  language === "en"
                    ? "Record is Successfully Activated!"
                    : "रेकॉर्ड यशस्वीरित्या सक्रिय केले आहे!",
                  {
                    icon: "success",
                    button: language === "en" ? "Ok" : "ठीक आहे",
                  }
                );
                getBachatgatCategory();
              }
            })
            .catch((err) => {
              setIsLoading(false);
              cfcErrorCatchMethod(err, false);
            });
        } else if (willDelete == null) {
          swal(language === "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे", {
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
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
    bgCategoryPrefix: "",
    bgCategoryPrefixMr: "",
    bgCategoryNo: "",
    bgCategoryNoMr: "",
    bgCategoryName: "",
    bgCategoryNameMr: "",
    bgCategoryMr: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    bgCategoryPrefix: "",
    bgCategoryPrefixMr: "",
    bgCategoryNo: "",
    bgCategoryNoMr: "",
    bgCategoryName: "",
    bgCategoryNameMr: "",
    bgCategoryMr: "",
    id: null,
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
    },
    {
      field: "bgCategoryPrefix",
      headerName: <FormattedLabel id="categoryPrefix" />,
      flex: 1,
    },
    {
      field: language === "en" ? "bgCategoryName" : "bgCategoryMr",
      headerName: <FormattedLabel id="categoryName" />,
      flex: 1,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                reset(params.row);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setSlideChecked(true);
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

  const catchMethod = (err) => {
    if (err.message === "Network Error") {
      sweetAlert(
        language == "en" ? "Network Error" : "नेटवर्क त्रुटी !",
        language == "en"
          ? "Server is unreachable or may be a network issue, please try after sometime"
          : "सर्व्हर पोहोचण्यायोग्य नाही किंवा नेटवर्क समस्या असू शकते, कृपया काही वेळानंतर प्रयत्न करा",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else if (err.message === "Request failed with status code 404") {
      sweetAlert(
        language == "en" ? "Bad Request" : "वाईट विनंती !",
        language == "en" ? "Unauthorized access !" : "अनधिकृत पोहोच !!",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else {
      sweetAlert(
        language == "en" ? "Error" : "त्रुटी !",
        language == "en" ? "Something went to wrong !" : "काहीतरी चूक झाली!",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    }
  };

  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      {isLoading && <CommonLoader />}
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
          "@media (max-width: 500px)": {
            marginTop: "7rem",
          },
        }}
      >
        <Box>
          <Grid container className={commonStyles.title}>
            <Grid item xs={1}>
              <IconButton
                style={{
                  color: "white",
                }}
                onClick={() => {
                  router.back();
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Grid>
            <Grid item xs={10}>
              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  marginRight: "2rem",
                }}
              >
                <FormattedLabel id="bachatGatCategory" />
              </h3>
            </Grid>
          </Grid>
        </Box>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitForm)}>
            {isOpenCollapse && (
              <Slide
                direction="down"
                in={slideChecked}
                mountOnEnter
                unmountOnExit
              >
                <Grid container spacing={2} style={{ padding: "1rem" }}>
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    {/* <TextField
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    label={<FormattedLabel id="categoryNameEn" required />}
                    id="standard-basic"
                    variant="standard"
                    {...register("bgCategoryName")}
                    error={!!errors.bgCategoryName}
                    inputProps={{  maxLength: 500 }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      shrink:
                        (watch("bgCategoryName") ? true : false) ||
                        (router.query.bgCategoryName ? true : false),
                    }}
                    helperText={
                      errors?.bgCategoryName
                        ? errors.bgCategoryName.message
                        : null
                    }
                  /> */}

                    <Transliteration
                      variant={"standard"}
                      _key={"bgCategoryName"}
                      labelName={"bgCategoryName"}
                      fieldName={"bgCategoryName"}
                      updateFieldName={"bgCategoryMr"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      label={<FormattedLabel id="categoryNameEn" required />}
                      error={!!errors.bgCategoryName}
                      helperText={
                        errors?.bgCategoryName
                          ? errors.bgCategoryName.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    {/* <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      label={<FormattedLabel id="categoryNameMr" required />}
                      id="standard-basic"
                      variant="standard"
                      {...register("bgCategoryMr")}
                      error={!!errors.bgCategoryMr}
                      inputProps={{ maxLength: 500 }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        shrink:
                          (watch("bgCategoryMr") ? true : false) ||
                          (router.query.bgCategoryMr ? true : false),
                      }}
                      helperText={
                        errors?.bgCategoryMr
                          ? errors.bgCategoryMr.message
                          : null
                      }
                    /> */}
                    <Transliteration
                      variant={"standard"}
                      _key={"bgCategoryMr"}
                      labelName={"bgCategoryMr"}
                      fieldName={"bgCategoryMr"}
                      updateFieldName={"bgCategoryName"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      label={<FormattedLabel id="categoryNameMr" required />}
                      error={!!errors.bgCategoryMr}
                      helperText={
                        errors?.bgCategoryMr
                          ? errors.bgCategoryMr.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      label={<FormattedLabel id="categoryPrefixEn" required />}
                      id="standard-basic"
                      variant="standard"
                      {...register("bgCategoryPrefix")}
                      error={!!errors.bgCategoryPrefix}
                      inputProps={{ maxLength: 15 }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        shrink:
                          (watch("bgCategoryPrefix") ? true : false) ||
                          (router.query.bgCategoryPrefix ? true : false),
                      }}
                      helperText={
                        errors?.bgCategoryPrefix
                          ? errors.bgCategoryPrefix.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid
                    container
                    spacing={5}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      paddingTop: "10px",
                      marginTop: "20px",
                    }}
                  >
                     <Grid item>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        // className={commonStyles.buttonExit}
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitButton()}
                      >
                        <FormattedLabel id="exit" />
                      </Button>
                    </Grid>
                      <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        // className={commonStyles.buttonBack}
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                      >
                        <FormattedLabel id="clear" />
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        type="submit"
                        // className={commonStyles.buttonSave}
                        variant="contained"
                        color="success"
                        size="small"
                        endIcon={<SaveIcon />}
                      >
                        {btnSaveText === "Update" ? (
                          <FormattedLabel id="update" />
                        ) : (
                          <FormattedLabel id="save" />
                        )}
                      </Button>
                    </Grid>
                  
                   
                  </Grid>
                </Grid>
              </Slide>
            )}
          </form>
        </FormProvider>
        <div className={styles.addbtn}>
          <Button
            variant="contained"
            className={commonStyles.buttonSave}
            size="small"
            endIcon={<AddIcon />}
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
            <FormattedLabel id="add" />
          </Button>
        </div>

        <DataGrid
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          autoHeight
          sx={{
            overflowY: "scroll",
            marginTop: "20px",
            "& .MuiDataGrid-virtualScrollerContent": {},
            "& .MuiDataGrid-columnHeadersInner": {
              backgroundColor: "#556CD6",
              color: "white",
            },
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
            // "& .MuiDataGrid-toolbarContainer .MuiButton-root[aria-label='Export']":
            //   {
            //     display: "none",
            //   },
          }}
          density="compact"
          pagination
          // disableColumnFilter
          // disableDensitySelector
          // disableColumnSelector
          paginationMode="server"
          rowCount={data.totalRows}
          rowsPerPageOptions={data.rowsPerPageOptions}
          page={data.page}
          pageSize={data.pageSize}
          rows={data.rows}
          columns={columns}
          onPageChange={(_data) => {
            setPage(_data);
            getBachatgatCategory(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            setDataPage(_data);
            getBachatgatCategory(_data, data.page);
          }}
        />
      </Paper>
    </>
  );
};

export default Index;
