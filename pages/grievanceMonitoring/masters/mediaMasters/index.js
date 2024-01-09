import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
  Box,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import mediaMasterSchema from "../../../../containers/schema/grievanceMonitoring/mediaMasterSchema";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Index = () => {
  const language = useSelector((store) => store.labels.language);
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(mediaMasterSchema),
    mode: "onChange",
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [mediaNames, setMediaNames] = useState([]);
  const router = useRouter();
  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState();
  const [loading, setLoading] = useState(false);

  const userToken = useSelector((state) => {
    return state?.user?.user?.token;
  });
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

  // // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getMediaNames();
  }, []);

  const getMediaNames = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);
    axios
      .get(`${urls.GM}/mediaMaster/getAll`, {
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
        setMediaNames(
          res.data.mediaMasterList.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            mediaName: r.mediaName,
            mediaNameMr: r.mediaNameMr,
            activeFlag: r.activeFlag,
            status: r.activeFlag === "Y" ? "Active" : "InActive",
            prefix: r.prefix,
            prefixMr: r.prefixMr,
          }))
        );
        setTotalElements(res.data.totalElements);
        setPageSize(res.data.pageSize);
        setPageNo(res.data.pageNo);
      })
      .catch((err) => {
        setLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    setLoading(true);
    const finalBodyForApi = {
      ...formData,
    };
    if (btnSaveText === "Save") {
      axios
        .post(`${urls.GM}/mediaMaster/save`, finalBodyForApi, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setLoading(false);
          if (res.status == 201) {
            sweetAlert({
              title: language === "en" ? "Saved!" : "जतन केले!",
              text:
                language === "en"
                  ? "Record Saved Successfully !"
                  : "रेकॉर्ड यशस्वीरित्या जतन केले!",
              icon: "success",
              button: language === "en" ? "Ok" : "ठीक आहे",
            }).then((will) => {
              if (will) {
                getMediaNames();
                setIsOpenCollapse(false);
                setEditButtonInputState(false);
              }
            });
          }
        })
        .catch((err) => {
          setLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    } else if (btnSaveText === "Update") {
      axios
        .post(`${urls.GM}/mediaMaster/save`, finalBodyForApi, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setLoading(false);
          if (res.status == 201) {
            sweetAlert({
              title: language === "en" ? "Updated!" : "अद्यतनित!",
              text:
                language === "en"
                  ? "Record Updated Successfully !"
                  : "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
              icon: "success",
              button: language === "en" ? "Ok" : "ठीक आहे",
            }).then((will) => {
              if (will) {
                getMediaNames();
                setIsOpenCollapse(false);
                setEditButtonInputState(false);
              }
            });
          }
        })
        .catch((err) => {
          setLoading(false);
          cfcErrorCatchMethod(err, false);
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
        buttons: [
          language === "en" ? "No" : "नाही",
          language === "en" ? "Yes" : "होय",
        ],
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        setLoading(true);
        if (willDelete === true) {
          axios
            .post(`${urls.GM}/mediaMaster/save`, body, {
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
                  button: language === "en" ? "Ok" : "ठीक आहे",
                  icon: "success",
                }).then((will) => {
                  if (will) {
                    getMediaNames();
                  }
                });
              }
            })
            .catch((err) => {
              setLoading(false);
              cfcErrorCatchMethod(err, false);
            });
        } else if (willDelete == null) {
          setLoading(false);
          sweetAlert({
            text: language === "en" ? "Record Is Safe" : "रेकॉर्ड सुरक्षित आहे",
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
        dangerMode: true,
        buttons: [
          language === "en" ? "No" : "नाही",
          language === "en" ? "Yes" : "होय",
        ],
      }).then((willDelete) => {
        setLoading(true);
        if (willDelete === true) {
          axios
            .post(`${urls.GM}/mediaMaster/save`, body, {
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
                }).then((will) => {
                  if (will) {
                    getMediaNames();
                  }
                });
              }
            })
            .catch((err) => {
              setLoading(false);
              cfcErrorCatchMethod(err, false);
            });
        } else if (willDelete == null) {
          setLoading(false);
          sweetAlert({
            text: language === "en" ? "Record Is Safe" : "रेकॉर्ड सुरक्षित आहे",
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
    remark: "",
    prefix: "",
    mediaName: "",
    mediaNameMr: "",
    prefixMr: "",
    id: null,
  };

  // Reset Values Exit
  const resetValuesExit = {
    mediaName: "",
    remark: "",
    mediaNameMr: "",
    prefixMr: "",
    prefix: "",
    id: null,
  };
  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "prefix",
      headerName: language == "en" ? "Event Code" : "कार्यक्रम कोड",
      flex: 1,
      headerAlign: "center",
      align: "left",
    },
    {
      field: language == "en" ? "mediaName" : "mediaNameMr",
      headerName:
        language == "en" ? (
          <FormattedLabel id="eventName" />
        ) : (
          <FormattedLabel id="eventNameMr" />
        ),
      flex: 1,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      headerAlign: "center",
      align: "left",
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            {/* <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                reset(params.row);
              }}
            >
              <Tooltip title={language == "en" ? "Edit" : '"सुधारणे"'}>
                <EditIcon style={{ color: "#556CD6" }} />
              </Tooltip>
            </IconButton> */}
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

  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
  };


  // View
  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      <>
        {loading && <CommonLoader />}
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
                    // marginBottom: "2vh",
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
                  <FormattedLabel id="MediaMaster" />
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
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                      <Transliteration
                        variant={"standard"}
                        _key={"mediaName"}
                        labelName={"mediaName"}
                        fieldName={"mediaName"}
                        updateFieldName={"mediaNameMr"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        label={<FormattedLabel id="eventName" required />}
                        error={!!errors.mediaName}
                        helperText={
                          errors?.mediaName ? errors.mediaName.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                      <Transliteration
                        variant={"standard"}
                        _key={"mediaNameMr"}
                        labelName={"mediaNameMr"}
                        fieldName={"mediaNameMr"}
                        updateFieldName={"mediaName"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        label={<FormattedLabel id="eventNameMr" required />}
                        error={!!errors.mediaNameMr}
                        helperText={
                          errors?.mediaNameMr
                            ? errors.mediaNameMr.message
                            : null
                        }
                      />
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
          {/* <div className={styles.addbtn}>
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
                setBtnSaveText("Save");
                setButtonInputState(true);
                setSlideChecked(true);
                setIsOpenCollapse(!isOpenCollapse);
              }}
            >
              <FormattedLabel id="add" />
            </Button>
          </div> */}

          <DataGrid
            autoHeight
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
            rowCount={totalElements}
            rowsPerPageOptions={[10, 20, 50, 100]}
            pageSize={pageSize}
            rows={mediaNames}
            columns={columns}
            page={pageNo}
            onPageChange={(_data) => {
              getMediaNames(pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              getMediaNames(_data, pageNo);
            }}
          />
        </Paper>
      </>
    </>
  );
};

export default Index;
