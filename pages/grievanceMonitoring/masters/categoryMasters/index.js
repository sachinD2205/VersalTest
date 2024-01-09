import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  Paper,
  Slide,
  Grid,
  Tooltip,
} from "@mui/material";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import urls from "../../../../URLS/urls";
import styles from "./view.module.css";
import categoryMasterSchema from "../../../../containers/schema/grievanceMonitoring/categoryMasterSchema";
import { useSelector } from "react-redux";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil";
import { GridToolbar } from "@mui/x-data-grid";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Form = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(categoryMasterSchema),
    mode: "onChange",
  });
  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const language = useSelector((store) => store.labels.language);
  const [page, setPage] = useState(10);
  const [dataPageNo, setDataPage] = useState();
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const router = useRouter();
  const [complaintTypes, setComplaintTypes] = useState([]);
  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState();
  const [isLoading, setIsLoading] = useState(false);
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

  const getComplaintTypes = (_pageSize = 10, _pageNo = 0) => {
    setIsLoading(true);
    axios
      .get(`${urls.GM}/categoryTypeMaster/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setComplaintTypes(
          res.data.categoryTypeMasterList.map((r, i) => ({
            id: r.id,
            srNo: i + 1 + _pageNo * _pageSize,
            categoryType: r.categoryType,
            categoryTypeMr: r.categoryTypeMr,
            description: r.description,
            descriptionMr: r.descriptionMr,
            activeFlag: r.activeFlag,
            status: r.activeFlag === "Y" ? "Active" : "InActive",
          }))
        );
        setTotalElements(res.data.totalElements);
        setPageSize(res.data.pageSize);
        setPageNo(res.data.pageNo);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err,false)
      });
  };

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    setIsLoading(true);
    const finalBodyForApi = {
      ...formData,
      activeFlag: "Y",
    };
    if (btnSaveText === "Save") {
      axios
        .post(`${urls.GM}/categoryTypeMaster/save`, finalBodyForApi, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          if (res.status == 201) {
            sweetAlert({
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
                setButtonInputState(false);
                setIsOpenCollapse(false);
                setEditButtonInputState(false);
              }
            });
          }
        })
        .catch((err) => {
          setIsLoading(false);
          cfcErrorCatchMethod(err,false)
        });
    } else if (btnSaveText === "Update") {
      axios
        .post(`${urls.GM}/categoryTypeMaster/save`, finalBodyForApi, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          if (res.status == 201) {
            sweetAlert({
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
                setButtonInputState(false);
                setIsOpenCollapse(false);
                setEditButtonInputState(false);
              }
            });
          }
        })
        .catch((err) => {
          setIsLoading(false);
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
        title: language === "en" ? "Deactivate?" : "निष्क्रिय करायचे?",
        text:
          language === "en"
            ? "Are You Sure You Want To Deactivate This Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता ? ",
        icon: "warning",
        buttons: true,
        buttons: [
          language === "en" ? "No" : "नाही",
          language === "en" ? "Yes" : "होय",
        ],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          setIsLoading(true);
          axios
            .post(`${urls.GM}/categoryTypeMaster/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              setIsLoading(false);
              if (res.status == 201) {
                sweetAlert({
                  title:
                    language === "en" ? "Deactivated!" : "निष्क्रिय केले !",
                  text:
                    language === "en"
                      ? "Record Is Successfully Deactivated!"
                      : "रेकॉर्ड यशस्वीरित्या निष्क्रिय केले आहे!",
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
              setIsLoading(false);
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
        title: language === "en" ? "Activate?" : "सक्रिय करू?",
        text:
          language === "en"
            ? "Are You Sure You Want To Activate This Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता ? ",
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
            .post(`${urls.GM}/categoryTypeMaster/save`, body, {
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
              setIsLoading(false);
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

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };
  // Reset Values Cancell
  const resetValuesCancell = {
    categoryType: "",
    description: "",
    categoryTypeMr: "",
    descriptionMr: "",
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
    id: null,
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align:'center'
    },
    {
      field: language == "en" ? "categoryType" : "categoryTypeMr",
      headerName: <FormattedLabel id="categoryType" />,
      flex: 1,
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


  // View
  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      <>
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
                  <FormattedLabel id="grievanceCategory" />
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
                  <Grid
                    container
                    spacing={2}
                    style={{
                      padding: "10px",
                      display: "flex",
                      alignItems: "baseline",
                    }}
                  >
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                     <Transliteration
                        variant={"standard"}
                        _key={"categoryType"}
                        labelName={"categoryType"}
                        fieldName={"categoryType"}
                        updateFieldName={"categoryTypeMr"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        label={<FormattedLabel id="categoryType" required />}
                        error={!!errors.categoryType}
                        helperText={
                          errors?.categoryType
                            ? errors.categoryType.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                 
                      <Transliteration
                        variant={"standard"}
                        _key={"categoryTypeMr"}
                        labelName={"categoryTypeMr"}
                        fieldName={"categoryTypeMr"}
                        updateFieldName={"categoryType"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        label={<FormattedLabel id="categoryTypeMr" required />}
                        error={!!errors.categoryTypeMr}
                        helperText={
                          errors?.categoryTypeMr
                            ? errors.categoryTypeMr.message
                            : null
                        }
                      />
                    </Grid>
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
                </form>
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
            }}
            density="compact"
            pagination
            paginationMode="server"
            rowCount={totalElements}
            rowsPerPageOptions={[10, 20, 50, 100]}
            pageSize={pageSize}
            page={pageNo}
            rows={complaintTypes}
            columns={columns}
            onPageChange={(_data) => {
              setPage(_data);
              getComplaintTypes(pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              setDataPage(_data);
              getComplaintTypes(_data, pageNo);
            }}
          />
        </Paper>
      </>
    </>
  );
};

export default Form;
