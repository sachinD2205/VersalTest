import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
  Button,
  Paper,
  Slide,
  Tooltip,
  Box,
  Grid,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  FormHelperText,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useForm, FormProvider } from "react-hook-form";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import complaintTypeMasterSchema from "../../../../containers/schema/grievanceMonitoring/complaintTypeMasterSchema";
import urls from "../../../../URLS/urls";
import styles from "./view.module.css";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil";
import { GridToolbar } from "@mui/x-data-grid";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Index = () => {
  const language = useSelector((state) => state?.labels.language);
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(complaintTypeMasterSchema),
    mode: "onChange",
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const userToken = useSelector((state) => {
    return state?.user?.user?.token;
  });
  const [departments, setDepartments] = useState([
    {
      id: 1,
      departmentEn: "",
      departmentMr: "",
    },
  ]);
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
    getDepartment();
  }, []);

  useEffect(() => {
    getComplaintTypes();
  }, [departments]);

  const getComplaintTypes = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    axios
      .get(`${urls.GM}/complaintTypeMaster/getAll`, {
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
        if (res?.status == 200 || res?.status == 201) {
          let _res = res.data.complaintTypeMasterList.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            complaintType: r.complaintType,
            complaintTypeMr: r.complaintTypeMr,
            description: r.description,
            descriptionMr: r.descriptionMr,
            departmentId: r.departmentId,
            departmentNameEn: departments?.find(
              (obj) => obj.id === r.departmentId
            )?.departmentEn,
            departmentNameMr: departments?.find(
              (obj) => obj.id === r.departmentId
            )?.departmentMr,
            activeFlag: r.activeFlag,
            status: r.activeFlag === "Y" ? "Active" : "InActive",
          }));

          setData({
            rows: _res,
            totalRows: res.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res.data.pageSize,
            page: res.data.pageNo,
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        cfcErrorCatchMethod(err,false)
      });
  };

  const getDepartment = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`,{
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((res) => {
      let data = res.data.department.map((r, i) => ({
        id: r.id,
        departmentEn: r.department,
        departmentMr: r.departmentMr,
      }));
      setDepartments(data.sort(sortByProperty("departmentEn")));
    }).catch((err)=>{
      cfcErrorCatchMethod(err,true)
    });
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
  // OnSubmit Form
  const onSubmitForm = (formData) => {
    setLoading(true);
    const finalBodyForApi = {
      ...formData,
      activeFlag: "Y",
    };
    if (btnSaveText === "Save") {
      axios
        .post(`${urls.GM}/complaintTypeMaster/save`, finalBodyForApi, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            setLoading(false);
            sweetAlert({
              title: language === "en" ? "Saved!" : "जतन केले!",
              text:
                language === "en"
                  ? "Record Saved Successfully !"
                  : "रेकॉर्ड यशस्वीरित्या जतन केले!",
              icon: "success",
              button: language === "en" ? "Ok" : "ठीक आहे",
            });
            getComplaintTypes();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setEditButtonInputState(false);
          }
        })
        .catch((err) => {
          setLoading(false);
          cfcErrorCatchMethod(err,false)
        });
    } else if (btnSaveText === "Update") {
      axios
        .post(`${urls.GM}/complaintTypeMaster/save`, finalBodyForApi, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            setLoading(false);
            sweetAlert({
              title: language === "en" ? "Updated!" : "अद्यतनित!",
              text:
                language === "en"
                  ? "Record Updated Successfully !"
                  : "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
              icon: "success",
              button: language === "en" ? "Ok" : "ठीक आहे",
            });
            getComplaintTypes();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setEditButtonInputState(false);
          }
        })
        .catch((err) => {
          setLoading(false);
          cfcErrorCatchMethod(err,false)
        });
    }
  };

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    if (_activeFlag === "N") {
      sweetAlert({
        title: language == "en" ? "Deactivate?" : "निष्क्रिय करा",
        text:
          language == "en"
            ? "Are You Sure You Want To Deactivate This Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता?",
        icon: "warning",
        buttons: true,
        buttons: [
          language === "en" ? "No" : "नाही",
          language === "en" ? "Yes" : "होय",
        ],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          axios
            .post(`${urls.GM}/complaintTypeMaster/save`, body, {
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
                  button: language === "en" ? "Ok" : "ठीक आहे",
                }).then((will)=>{
                  if(will){
                    getComplaintTypes();
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
          sweetAlert({
            text:
              language === "en" ? "Record Is Safe" : "रेकॉर्ड सुरक्षित आहे",
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        }
      });
    } else {
      sweetAlert({
        title: language == "en" ? "Activate?" : "सक्रिय करायचे?",
        text:
          language == "en"
            ? "Are You Sure You Want To Activate This Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता?",
        icon: "warning",
        buttons: true,
        buttons: [
          language === "en" ? "No" : "नाही",
          language === "en" ? "Yes" : "होय",
        ],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          axios
            .post(`${urls.GM}/complaintTypeMaster/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
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
          sweetAlert({
            text:
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
    complaintType: "",
    description: "",
    complaintTypeMr: "",
    descriptionMr: "",
    departmentId: "",
    id: null,
  };

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    businessType: "",
    businessSubType: "",
    businessSubTypePrefix: "",
    complaintType: "",
    departmentId: "",
    id: null,
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language === "en" ? "complaintType" : "complaintTypeMr",
      headerName: <FormattedLabel id="complaintType" />,
      flex: 1,
      headerAlign: "center",
      align:'left'
    },
    {
      field: language === "en" ? "departmentNameEn" : "departmentNameMr",
      headerName: language === "en" ? "Department Name" : "विभाग",
      headerAlign: "center",
      flex: 1,
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
                  <FormattedLabel id="complaintType" />
                </h3>
              </Grid>
            </Grid>
          </Box>

          <form onSubmit={handleSubmit(onSubmitForm)}>
            {isOpenCollapse && (
              <FormProvider {...methods}>
                <Slide
                  direction="down"
                  in={slideChecked}
                  mountOnEnter
                  unmountOnExit
                >
                  <Grid
                    container
                    spacing={2}
                    style={{
                      padding: "10px",
                      display: "flex",
                      alignItems: "baseline",
                    }}
                  >
                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                      <Transliteration
                        variant={"standard"}
                        _key={"complaintType"}
                        labelName={"complaintType"}
                        fieldName={"complaintType"}
                        updateFieldName={"complaintTypeMr"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        label={<FormattedLabel id="complaintType" required />}
                        error={!!errors.complaintType}
                        helperText={
                          errors?.complaintType
                            ? errors.complaintType.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                   <Transliteration
                        variant={"standard"}
                        _key={"complaintTypeMr"}
                        labelName={"complaintTypeMr"}
                        fieldName={"complaintTypeMr"}
                        updateFieldName={"complaintType"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        label={<FormattedLabel id="complaintTypeMr" required />}
                        error={!!errors.complaintTypeMr}
                        helperText={
                          errors?.complaintTypeMr
                            ? errors.complaintTypeMr.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                      <FormControl
                        sx={{ m: { xs: 0, md: 0 }, minWidth: "100%" }}
                        error={!!errors.departmentId}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="departmentName" required />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              variant="standard"
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value);
                              }}
                              label={
                                <FormattedLabel id="departmentName" required />
                              }
                            >
                              {departments &&
                                departments.map((department, index) => (
                                  <MenuItem key={index} value={department.id}>
                                    {language == "en"
                                      ? department.departmentEn
                                      : department?.departmentMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="departmentId"
                          control={control}
                          defaultValue={null}
                        />
                        <FormHelperText>
                          {errors?.departmentId
                            ? errors.departmentId.message
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
                </Slide>
              </FormProvider>
            )}
          </form>
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
            autoHeight={data.pageSize}
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
            rowCount={data.totalRows}
            rowsPerPageOptions={data.rowsPerPageOptions}
            pageSize={data.pageSize}
            rows={data.rows}
            page={data.page}
            columns={columns}
            onPageChange={(_data) => {
              getComplaintTypes(data.pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              getComplaintTypes(_data, data.page);
            }}
          />
        </Paper>
      </>
    </>
  );
};

export default Index;
