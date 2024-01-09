import {
  Button,
  InputLabel,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Box,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import sweetAlert from "sweetalert";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { GridToolbar } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import rejectedCatSchema from "../../../../containers/schema/BsupNagarvasthiSchema/rejectedCatSchema";
import Loader from "../../../../containers/Layout/components/Loader";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";

const Index = () => {
  const methods = useForm({ resolver: yupResolver(rejectedCatSchema) });
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;
  const router = useRouter();
  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();
  let user = useSelector((state) => state.user.user);
  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState();
  const language = useSelector((state) => state.labels.language);
  const [dataPageNo, setDataPage] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [rejectCatData, setRejectCatData] = useState(null);
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
  //   loggedUser === "citizenUser"
  //     ? { Userid: user?.id, Authorization: `Bearer ${user?.token}` }
  //     : { Authorization: `Bearer ${user?.token}` };
  const headers = { Authorization: `Bearer ${user?.token}` };

  useEffect(() => {
    getAllZoneOfficeWiseDept();
  }, []);

  const getAllZoneOfficeWiseDept = (_pageSize = 10, _pageNo = 0) => {
    setIsLoading(true);
    axios
      .get(`${urls.BSUPURL}/mstRejectCategory/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: headers,
      })
      .then((res, i) => {
        setIsLoading(false);
        let result = res.data.mstRejectCategoryDao;

        setRejectCatData(result);
        setTotalElements(res.data.totalElements);
        setPageSize(res.data.pageSize);
        setPageNo(res.data.pageNo);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  useEffect(() => {
    if (rejectCatData != null) {
      let result = rejectCatData;
      const _res = result.map((res, i) => {
        // let bachatScheme;
        // if(res.forBachatGatorScheme === 1){
        //   language == 'en' ? bachatScheme = 'For bachat gat' : bachatScheme = 'बचत गटासाठी';
        // }
        // else if(forBachatGatOrScheme == 2){
        //   language == 'en' ? bachatScheme = 'For Scheme' : bachatScheme = 'योजनेसाठी';
        // }
        return {
          srNo: i + 1 + pageNo * pageSize,

          id: res.id,
          rejectCat: res.rejectCat,
          rejectCatMr: res.rejectCatMr,
          activeFlag: res.activeFlag,
          categoryType: res.categoryType,
          forBachatGatorScheme: res.forBachatGatorScheme,
          forBachatGatorSchemeEn:
            res.forBachatGatorScheme === "1"
              ? "For bachat gat"
              : res.forBachatGatorScheme === "2"
              ? "For Scheme"
              : "-",

          forBachatGatorSchemeMr:
            res.forBachatGatorScheme === "1"
              ? "बचत गटासाठी"
              : res.forBachatGatorScheme === "2"
              ? "योजनेसाठी"
              : "-",
          status: res.activeFlag === "Y" ? "Active" : "InActive",
        };
      });
      setDataSource([..._res]);
    }
  }, [rejectCatData, language]);

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    if (_activeFlag === "N") {
      swal({
        title: language == "en" ? "Deactivate?" : "निष्क्रिय करा",
        text:
          language == "en"
            ? "Are you sure you want to deactivate this Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        buttons: [
          language == "en" ? "No" : "नाही",
          language === "en" ? "Yes" : "होय",
        ],
      }).then((willDelete) => {
        setIsLoading(true);
        if (willDelete === true) {
          axios
            .post(`${urls.BSUPURL}/mstRejectCategory/save`, body, {
              headers: headers,
            })
            .then((res) => {
              setIsLoading(false);
              if (res.status == 201) {
                swal(
                  language == "en"
                    ? "Record is Successfully Deactivated!"
                    : "रेकॉर्ड यशस्वीरित्या निष्क्रिय केले आहे!",
                  {
                    icon: "success",
                    button: language === "en" ? "Ok" : "ठीक आहे",
                  }
                );
                getAllZoneOfficeWiseDept();
                setButtonInputState(false);
              }
            })
            .catch((err) => {
              setIsLoading(false);
              cfcErrorCatchMethod(err, false);
            });
        } else if (willDelete == null) {
          swal(language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे", {
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        }
      });
    } else {
      swal({
        title: language == "en" ? "Activate?" : "सक्रिय करा",
        text:
          language == "en"
            ? "Are you sure you want to activate this Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता?",
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
            .post(`${urls.BSUPURL}/mstRejectCategory/save`, body, {
              headers: headers,
            })
            .then((res) => {
              if (res.status == 201) {
                swal(
                  language == "en"
                    ? "Record is Successfully activated!"
                    : "रेकॉर्ड यशस्वीरित्या सक्रिय केले आहे!",
                  {
                    icon: "success",
                    button: language === "en" ? "Ok" : "ठीक आहे",
                  }
                );
                getAllZoneOfficeWiseDept();
                setButtonInputState(false);
              }
            })
            .catch((err) => {
              setIsLoading(false);
              cfcErrorCatchMethod(err, false);
            });
        } else if (willDelete == null) {
          swal(language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे", {
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
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
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
  };

  const onSubmitForm = (formData) => {
    const finalBodyForApi = {
      ...formData,
    };
    setIsLoading(true);
    axios
      .post(`${urls.BSUPURL}/mstRejectCategory/save`, finalBodyForApi, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          formData.id
            ? sweetAlert(
                language == "en" ? "Updated!" : "अपडेट केले",
                language == "en"
                  ? "Record Updated Successfully !"
                  : "रेकॉर्ड यशस्वीरित्या अद्यतनित केले !",
                "success",
                { button: language === "en" ? "Ok" : "ठीक आहे" }
              )
            : sweetAlert(
                language == "en" ? "Saved!" : "जतन केले",
                language == "en"
                  ? "Record Saved Successfully !"
                  : "रेकॉर्ड यशस्वीरित्या जतन केले !",
                "success",
                { button: language === "en" ? "Ok" : "ठीक आहे" }
              );
          getAllZoneOfficeWiseDept();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const resetValuesExit = {
    forBachatGatorScheme: "",
    categoryType: "",
    rejectCat: "",
    rejectCatMr:''
  };

  const cancellButton = () => {
    reset({
      ...resetValuesExit,
      id,
    });
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
    },
    {
      field: "rejectCat",
      headerName: <FormattedLabel id="rejectCat" />,
      flex: 3,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line" }}>{params.value}</div>
      ),
    },
    {
      field: "rejectCatMr",
      headerName: <FormattedLabel id="rejectCatMr" />,
      flex: 3,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-line" }}>{params.value}</div>
      ),
    },
    {
      field:
        language === "en" ? "forBachatGatorSchemeEn" : "forBachatGatorSchemeMr",
      headerName: <FormattedLabel id="forBachatGatOrScheme" />,
      flex: 2,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
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
              <Tooltip title="Edit">
                <EditIcon style={{ color: "#556CD6" }} />
              </Tooltip>
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setSlideChecked(true);
                setButtonInputState(true);
                reset(params.row);
              }}
            >
              {params.row.activeFlag == "Y" ? (
                <Tooltip title="Deactivate">
                  <ToggleOnIcon
                    style={{ color: "green", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "N")}
                  />
                </Tooltip>
              ) : (
                <Tooltip title="Activate">
                  <ToggleOffIcon
                    style={{ color: "red", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "Y")}
                  />
                </Tooltip>
              )}
            </IconButton>
          </>
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
                <FormattedLabel id="rejectCat" />
              </h3>
            </Grid>
          </Grid>
        </Box>
        {isOpenCollapse && (
          <FormProvider {...methods}>
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Grid container spacing={2} style={{ padding: "1rem" }}>
                  {/* reject category english */}
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    {/* <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      label={<FormattedLabel id="rejectCat" required />}
                      id="standard-basic"
                      variant="standard"
                      {...register("rejectCat")}
                      error={!!errors.rejectCat}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                      }}
                      helperText={
                        errors?.rejectCat
                          ? errors.rejectCat.message
                          : null
                      }
                    /> */}
                    <Transliteration
                      variant={"standard"}
                      _key={"rejectCat"}
                      labelName={"rejectCat"}
                      fieldName={"rejectCat"}
                      updateFieldName={"rejectCatMr"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      label={<FormattedLabel id="rejectCat" required />}
                      error={!!errors.rejectCat}
                      helperText={
                        errors?.rejectCat ? errors.rejectCat.message : null
                      }
                    />
                  </Grid>

                  {/* reject category marathi */}
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    {/* <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      label={<FormattedLabel id="rejectCatMr" required />}
                      id="standard-basic"
                      variant="standard"
                      {...register("rejectCatMr")}
                      error={!!errors.rejectCatMr}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                      }}
                      helperText={
                        errors?.rejectCatMr
                          ? errors.rejectCatMr.message
                          : null
                      }
                    /> */}
                    <Transliteration
                      variant={"standard"}
                      _key={"rejectCatMr"}
                      labelName={"rejectCatMr"}
                      fieldName={"rejectCatMr"}
                      updateFieldName={"rejectCat"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      label={<FormattedLabel id="rejectCatMr" required />}
                      error={!!errors.rejectCatMr}
                      helperText={
                        errors?.rejectCatMr ? errors.rejectCatMr.message : null
                      }
                    />
                  </Grid>

                  {/* bachat gat or new scheme application selection */}
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <FormControl
                      error={errors.categoryType}
                      variant="standard"
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="categoryType" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Select Auditorium"
                          >
                            <MenuItem value="1">
                              {language === "en" ? "Approve" : "मंजूर"}
                            </MenuItem>

                            <MenuItem value="2">
                              {language === "en" ? "Revert" : "परत करणे"}
                            </MenuItem>

                            <MenuItem value="3">
                              {language === "en" ? "Reject" : "नाकारणे"}
                            </MenuItem>
                          </Select>
                        )}
                        name="categoryType"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.categoryType
                          ? errors.categoryType.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* bachat gat or new scheme application selection */}
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <FormControl
                      error={errors.forBachatGatorScheme}
                      variant="standard"
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="isForBachatOrScheme" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Select Auditorium"
                          >
                            <MenuItem value="1">
                              {language === "en" ? "Bachat Gat" : "बचत गट"}
                            </MenuItem>

                            <MenuItem value="2">
                              {language === "en"
                                ? "Scheme Application"
                                : "योजना अर्ज"}
                            </MenuItem>
                          </Select>
                        )}
                        name="forBachatGatorScheme"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.forBachatGatorScheme
                          ? errors.forBachatGatorScheme.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* Buttons */}
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
                        size="small"
                        color="error"
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
                        // className={commonStyles.buttonBack}
                        size="small"
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                      >
                        <FormattedLabel id="clear" />
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        type="submit"
                        size="small"
                        // className={commonStyles.buttonSave}
                        variant="contained"
                        color="success"
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
              </form>
            </Slide>
          </FormProvider>
        )}
        <Grid container style={{ padding: "10px" }}>
          <Grid item xs={12} style={{ display: "flex", justifyContent: "end" }}>
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              type="primary"
              className={commonStyles.buttonSave}
              size="small"
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
              <FormattedLabel id="add" />{" "}
            </Button>
          </Grid>
        </Grid>
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
            verflowY: "scroll",
            "& .MuiDataGrid-virtualScrollerContent": {},
            "& .MuiDataGrid-columnHeadersInner": {
              backgroundColor: "#556CD6",
              color: "white",
            },
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
            // "& .MuiDataGrid-toolbarContainer .MuiButton-root[aria-label='Export']":
            // {
            //   display: "none",
            // },
          }}
          density="compact"
          // disableColumnFilter
          // disableDensitySelector
          // disableColumnSelector
          pagination
          paginationMode="server"
          rowCount={totalElements}
          rowsPerPageOptions={[10, 20, 50, 100]}
          pageSize={pageSize}
          rows={dataSource}
          page={pageNo}
          columns={columns}
          onPageChange={(_data) => {
            setDataPage(_data);
            getAllZoneOfficeWiseDept(pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            setDataPage(_data);
            getAllZoneOfficeWiseDept(_data, pageNo);
          }}
        />
      </Paper>
    </>
  );
};

export default Index;
