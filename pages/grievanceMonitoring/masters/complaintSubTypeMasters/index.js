import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Grid,
  Box,
  Select,
  Slide,
  Tooltip,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import sweetAlert from "sweetalert";
import { FormProvider, useForm } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";
import styles from "./view.module.css";
import complaintSubTypeMasterSchema from "../../../../containers/schema/grievanceMonitoring/complaintSubTypeMasterSchema";
import { useSelector } from "react-redux";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil";
import { GridToolbar } from "@mui/x-data-grid";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Index = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(complaintSubTypeMasterSchema),
    mode: "onChange",
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const [loading, setLoading] = useState(false);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [complaintTypes, setcomplaintTypes] = useState([]);
  const router = useRouter();
  const language = useSelector((store) => store.labels.language);
  const userToken = useSelector((state) => {
    return state?.user?.user?.token;
  });
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error,moduleOrCFC) => {
    if (!catchMethodStatus) {
      if(moduleOrCFC){
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }else{
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };

  useEffect(() => {
    getComplaintTypes();
  }, []);

  useEffect(() => {
    getComplaintSubType();
  }, [complaintTypes]);

  const getComplaintTypes = () => {
    setLoading(true);
    axios
      .get(`${urls.GM}/complaintTypeMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setLoading(false);
        let data = res?.data?.complaintTypeMasterList?.map((r, i) => ({
          id: r?.id,
          srNo: i + 1,
          complaintType: r?.complaintType,
          complaintTypeMr: r?.complaintTypeMr,
          description: r?.description,
          descriptionMr: r?.descriptionMr,
        }));
        setcomplaintTypes(data.sort(sortByProperty("complaintType")));
      })
      .catch((err) => {setLoading(false)
        cfcErrorCatchMethod(err,false)});
  };

  const sortByProperty = (property) => {
    return (a, b) => {
      if (a[property] < b[property]) {
        return -1;
      } else if (a[property] > b[property]) {
        return 1;
      }
      return 0;
    };
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
  };

  // Get Table - Data
  const getComplaintSubType = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    axios
      .get(`${urls.GM}/complaintSubTypeMaster/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setLoading(false);
        let _res = res?.data?.complaintSubTypeMasterList?.map((r, i) => {
          return {
            id: r?.id,
            srNo: i + 1,
            complainType: r?.complainType,
            complainTypeMr: r?.complainTypeMr,
            complaintTypeId: r?.complaintTypeId,
            complaintSubType: r?.complaintSubType,
            complaintSubTypeMr: r?.complaintSubTypeMr,
            description: r?.description,
            descriptionMr: r?.descriptionMr,
            categoryKey: r?.categoryKey,
            categoryName: newFunctionForNullValues("en", r?.categoryName),
            categoryNameMr: newFunctionForNullValues("mr", r?.categoryNameMr),
            activeFlag: r?.activeFlag,
            status: r?.activeFlag === "Y" ? "Active" : "InActive",
          };
        });
        setDataSource({
          rows: _res || [],
          totalRows: res?.data?.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res?.data?.pageSize,
          page: res?.data?.pageNo,
        });
      })
      .catch((err) => {
        setLoading(false);
        cfcErrorCatchMethod(err,false)
      });
  };

  const newFunctionForNullValues = (lang, value) => {
    if (lang == "en") {
      return value ? value : "Not Available";
    } else {
      return value ? value : "उपलब्ध नाही";
    }
  };

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    setLoading(true);
    const finalBodyForApi = {
      ...formData,
      activeFlag: "Y",
    };
    axios
      .post(`${urls.GM}/complaintSubTypeMaster/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setLoading(false);
        if (res.status == 201) {
          formData.id
            ? sweetAlert({
                title: language === "en" ? "Updated!" : "अद्यतनित!",
                text:
                  language === "en"
                    ? "Record Updated Successfully !"
                    : "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
                icon: "success",
                button: language === "en" ? "Ok" : "ठीक आहे",
              }).then((will)=>{
                if(will){
                  getComplaintTypes();
                  getComplaintSubType();
                  setButtonInputState(false);
                  setIsOpenCollapse(false);
                  setEditButtonInputState(false);
                }
              })
            : sweetAlert({
                title: language === "en" ? "Saved!" : "जतन केले!",
                text:
                  language === "en"
                    ? "Record Saved Successfully !"
                    : "रेकॉर्ड यशस्वीरित्या जतन केले!",
                icon: "success",
                button: language === "en" ? "Ok" : "ठीक आहे",
              }).then((will)=>{
                if(will){
                  getComplaintTypes();
                  getComplaintSubType();
                  setButtonInputState(false);
                  setIsOpenCollapse(false);
                  setEditButtonInputState(false);
                }
              });
        }
      })
      .catch((err) => {
        setLoading(false);
        cfcErrorCatchMethod(err,false)
      });
  };

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    if (_activeFlag === "N") {
      sweetAlert({
        title: language === "en" ? "Deactivate?" : "निष्क्रिय करायचे?",
        text:
          language === "en"
            ? "Are You Sure You Want To Deactivate This Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        buttons: [
          language === "en" ? "No" : "नाही",
          language === "en" ? "Yes" : "होय",
        ],
      }).then((willDelete) => {
        if (willDelete === true) {
          setLoading(true);
          axios
            .post(`${urls.GM}/complaintSubTypeMaster/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              setLoading(false);
              if (res.status == 201) {
                sweetAlert({
                  title:
                    language === "en" ? "Deactivated!" : "निष्क्रिय केले !",
                  text:
                    language === "en"
                      ? "Record Is Successfully Deactivated!"
                      : "रेकॉर्ड यशस्वीरित्या निष्क्रिय केले आहे!",

                  icon: "success",
                  buttons: [
                    language === "en" ? "No" : "नाही",
                    language === "en" ? "Yes" : "होय",
                  ],
                });
                getComplaintTypes();
                getComplaintSubType();
                setButtonInputState(false);
              }
            })
            .catch((err) => {
              setLoading(false);
              cfcErrorCatchMethod(err,false)
            });
        } else if (willDelete == null) {
          setLoading(false);
          sweetAlert({
            text:
              language === "en" ? "Record Is Safe" : "रेकॉर्ड सुरक्षित आहे",
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        }
      });
    } else {
      sweetAlert({
        title: language === "en" ? "Activate?" : "सक्रिय करू?",
        text:
          language === "en"
            ? "Are You Sure You Want To Activate This Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          setLoading(true);
          axios
            .post(`${urls.GM}/complaintSubTypeMaster/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              setLoading(false);
              if (res.status == 201) {
                sweetAlert({
                  title: language === "en" ? "Activated!" : "सक्रिय झाले!",
                  text:
                    language === "en"
                      ? "Record Is Successfully Activated!"
                      : "रेकॉर्ड यशस्वीरित्या सक्रिय झाले!",
                  button: language === "en" ? "Ok" : "ठीक आहे",
                  icon: "success",
                }).then((will)=>{
                  if(will){
                    getComplaintTypes();
                    getComplaintSubType();
                    setButtonInputState(false);
                  }
                });
              }
            })
            .catch((err) => {
              setLoading(false);
              cfcErrorCatchMethod(err,false)
            });
        } else if (willDelete == null) {
          setLoading(false);
          sweetAlert({
            title:
              language === "en" ? "Record Is Safe" : "रेकॉर्ड सुरक्षित आहे",
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        }
      });
    }
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
    description: "",
    complaintSubType: "",
    descriptionMr: "",
    complaintSubTypeMr: "",
    complaintTypeId: "",
    categoryKey: "",
    id: null,
  };

  // Reset Values Exit
  const resetValuesExit = {
    description: "",
    complaintSubType: "",
    descriptionMr: "",
    complaintSubTypeMr: "",
    complaintTypeId: "",
    categoryKey: "",
    id: null,
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align:'center'
    },
    {
      field: language == "en" ? "complainType" : "complainTypeMr",
      flex: 1,
      headerName: <FormattedLabel id="complaintType" />,
      headerAlign: "center",
      align:'left'
    },
    {
      field: language == "en" ? "complaintSubType" : "complaintSubTypeMr",
      flex: 1,
      headerName: <FormattedLabel id="complaintSubType" />,
      headerAlign: "center",
      align:'left'
    },
    {
      field: language == "en" ? "categoryName" : "categoryNameMr",
      flex: 1,
      headerName: <FormattedLabel id="categories" />,
      headerAlign: "center",
      align:'left'
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      headerAlign: "center",
      align:'left',
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
              <Tooltip title={language == "en" ? "Edit" : '"सुधारणे"'}>
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
                <Tooltip
                  title={language == "en" ? "Deactivate" : "निष्क्रिय करा"}
                >
                  <ToggleOnIcon
                    style={{ color: "green", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "N")}
                  />
                </Tooltip>
              ) : (
                <Tooltip title={language == "en" ? "Activate" : "सक्रिय करा"}>
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


  const [categories, setCategory] = useState([]);
  const getCategory = () => {
    axios
      .get(`${urls.GM}/categoryTypeMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        let data = res.data.categoryTypeMasterList.map((r, i) => ({
          id: r.id,
          srNo: i + 1,
          categoryEn: r.categoryType,
          categoryMr: r.categoryTypeMr,
        }));
        setCategory(data.sort(sortByProperty("categoryEn")));
      }).catch((err)=>{
        cfcErrorCatchMethod(err,false)
      });
  };

  useEffect(() => {
    getCategory();
  }, []);



  // View

  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      {loading && <CommonLoader />}
      <>
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
            <Grid
              container
              style={{
                display: "flex",
                alignItems: "center", // Center vertically
                alignItems: "center",
                width: "100%",
                height: "auto",
                overflow: "auto",
                color: "white",
                fontSize: "18.72px",
                borderRadius: 100,
                fontWeight: 500,
                background:
                  "linear-gradient( 90deg, rgb(72 115 218 / 91%) 2%, rgb(142 122 231) 100%)",
              }}
            >
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
                  <FormattedLabel id="complaintSubType" />
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
                <div>
                  <form onSubmit={handleSubmit(onSubmitForm)}>
                    <Grid
                      container
                      spacing={2}
                      style={{
                        padding: "10px",
                        display: "flex",
                        alignItems: "baseline",
                      }}
                    >
                      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <FormControl
                          sx={{ m: { xs: 0 }, minWidth: "100%" }}
                          variant="standard"
                          error={!!errors.complaintTypeId}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="complaintType" required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                autoFocus
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                              >
                                {complaintTypes &&
                                  complaintTypes.map((value, index) => (
                                    <MenuItem key={index} value={value?.id}>
                                      {language == "en"
                                        ? value?.complaintType
                                        : value?.complaintTypeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="complaintTypeId"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.complaintTypeId
                              ? errors.complaintTypeId.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        lg={6}
                        xl={6}
                        sx={{ marginTop: "-1px" }}
                      >  <Transliteration
                          variant={"standard"}
                          _key={"complaintSubType"}
                          labelName={"complaintSubType"}
                          fieldName={"complaintSubType"}
                          updateFieldName={"complaintSubTypeMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={
                            <FormattedLabel id="complaintSubType" required />
                          }
                          error={!!errors.complaintSubType}
                          helperText={
                            errors?.complaintSubType
                              ? errors.complaintSubType.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <Transliteration
                          variant={"standard"}
                          _key={"complaintSubTypeMr"}
                          labelName={"complaintSubTypeMr"}
                          fieldName={"complaintSubTypeMr"}
                          updateFieldName={"complaintSubType"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          label={
                            <FormattedLabel id="complaintSubTypeMr" required />
                          }
                          error={!!errors.complaintSubTypeMr}
                          helperText={
                            errors?.complaintSubTypeMr
                              ? errors.complaintSubTypeMr.message
                              : null
                          }
                        />
                      </Grid>

                      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <FormControl
                          sx={{ m: { xs: 0 }, minWidth: "100%" }}
                          error={!!errors.categoryKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="categories" required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                variant="standard"
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                fullWidth
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Category"
                              >
                                {categories &&
                                  categories.map((category, index) => (
                                    <MenuItem key={index} value={category.id}>
                                      {language == "en"
                                        ? category.categoryEn
                                        : category?.categoryMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="categoryKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.categoryKey
                              ? errors.categoryKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid container style={{ marginTop: "30px" }} spacing={2}>
                        
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={4}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            endIcon={<ExitToAppIcon />}
                            onClick={() => exitButton()}
                          >
                            <FormattedLabel id="exit" />
                          </Button>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={4}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            endIcon={<ClearIcon />}
                            onClick={() => cancellButton()}
                          >
                            <FormattedLabel id="clear" />
                          </Button>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={4}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            type="submit"
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
                  </form>
                </div>
              </Slide>
            </FormProvider>
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
            autoHeight={dataSource.pageSize}
            components={{ Toolbar: GridToolbar }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
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
            }}
            density="compact"
            pagination
            paginationMode="server"
            rowCount={dataSource.totalRows}
            rowsPerPageOptions={dataSource.rowsPerPageOptions}
            pageSize={dataSource.pageSize}
            columns={columns}
            page={dataSource.page}
            rows={dataSource.rows}
            onPageChange={(_data) => {
              getComplaintSubType(dataSource.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              getComplaintSubType(_data, dataSource.page);
            }}
          />
        </Paper>
      </>
    </>
  );
};

export default Index;
