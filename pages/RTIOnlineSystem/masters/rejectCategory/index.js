import {
  Button,
  Grid,
  IconButton,
  Box,
  Paper,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import sweetAlert from "sweetalert";
import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
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
import rejectedCatSchema from "../../../../containers/schema/rtiOnlineSystemSchema/rejectedCatSchema";
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
  const methods = useForm({
    resolver: yupResolver(rejectedCatSchema),
  });
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
  const [slideChecked, setSlideChecked] = useState(true);
  const [id, setID] = useState();
  let user = useSelector((state) => state.user.user);
  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState();
  const language = useSelector((state) => state.labels.language);
  const [dataPageNo, setDataPage] = useState();
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    getAllZoneOfficeWiseDept();
  }, []);

  const getAllZoneOfficeWiseDept = (_pageSize = 10, _pageNo = 0) => {
    setIsLoading(true);
    axios
      .get(`${urls.RTI}/mstRejectCategory/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res, i) => {
        setIsLoading(false);
        let result = res.data.mstRejectCategoryDao;
        const _res = result.map((res, i) => {
          return {
            srNo: i + 1 + _pageNo * _pageSize,
            id: res.id,
            rejectCat: res.rejectCat,
            rejectCatMr: res.rejectCatMr,
            activeFlag: res.activeFlag,
            status: res.activeFlag === "Y" ? "Active" : "InActive",
          };
        });
        setDataSource([..._res]);
        setTotalElements(res.data.totalElements);
        setPageSize(res.data.pageSize);
        setPageNo(res.data.pageNo);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

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
            .post(`${urls.RTI}/mstRejectCategory/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
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
                    button: language == "en" ? "Ok" : "ठीक आहे",
                  }
                ).then((will) => {
                  if (will) {
                    getAllZoneOfficeWiseDept();
                    setButtonInputState(false);
                  }
                });
              }
            })
            .catch((err) => {
              setIsLoading(false);
              cfcErrorCatchMethod(err, false);
            });
        } else if (willDelete == null) {
          swal(language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे", {
            button: language == "en" ? "Ok" : "ठीक आहे",
          });
        }
      });
    } else {
      swal({
        title: language == "en" ? "Activate?" : "सक्रिय करू इच्छिता?",
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
            .post(`${urls.RTI}/mstRejectCategory/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              if (res.status == 201) {
                setIsLoading(false);
                swal(
                  language == "en"
                    ? "Record is Successfully activated!"
                    : "रेकॉर्ड यशस्वीरित्या सक्रिय केले आहे!",
                  {
                    icon: "success",
                    button: language == "en" ? "Ok" : "ठीक आहे",
                  }
                ).then((will) => {
                  if (will) {
                    getAllZoneOfficeWiseDept();
                    setButtonInputState(false);
                  }
                });
              }
            })
            .catch((err) => {
              setIsLoading(false);
              cfcErrorCatchMethod(err, false);
            });
        } else if (willDelete == null) {
          swal(language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे", {
            button: language == "en" ? "Ok" : "ठीक आहे",
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
      .post(`${urls.RTI}/mstRejectCategory/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
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
              ).then((will) => {
                if (will) {
                  getAllZoneOfficeWiseDept();
                  setButtonInputState(false);
                  setIsOpenCollapse(false);
                  setEditButtonInputState(false);
                  setDeleteButtonState(false);
                }
              })
            : sweetAlert(
                language == "en" ? "Saved!" : "जतन केले",
                language == "en"
                  ? "Record Saved Successfully !"
                  : "रेकॉर्ड यशस्वीरित्या जतन केले !",
                "success",
                { button: language === "en" ? "Ok" : "ठीक आहे" }
              ).then((will) => {
                if (will) {
                  getAllZoneOfficeWiseDept();
                  setButtonInputState(false);
                  setIsOpenCollapse(false);
                  setEditButtonInputState(false);
                  setDeleteButtonState(false);
                }
              });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  const resetValuesExit = {
    rejectCat: "",
    rejectCatMr: "",
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
      headerAlign: "center",
      align: "center",
    },
    {
      field: "rejectCat",
      headerName: <FormattedLabel id="rejectCat" />,
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "rejectCatMr",
      headerName: <FormattedLabel id="rejectCatMr" />,
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "left",
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

  return (
    <>
      {isLoading && <CommonLoader />}
      <BreadcrumbComponent />
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
        <FormProvider {...methods}>
          {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <form
                //  onSubmit={methods.handleSubmit(onSubmitForm)}
                onSubmit={handleSubmit(onSubmitForm)}
              >
                <Grid container spacing={2} style={{ padding: "1rem" }}>
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
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
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <Transliteration
                      variant={"standard"}
                      _key={"rejectCatMr"}
                      labelName={"rejectCatMr"}
                      fieldName={"rejectCatMr"}
                      updateFieldName={"rejectCat"}
                      sourceLang={"mar"}
                      targetLang={"eng"}
                      label={<FormattedLabel id="rejectCatMr" required />}
                      error={!!errors.rejectCatMr}
                      helperText={
                        errors?.rejectCatMr ? errors.rejectCatMr.message : null
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
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                      >
                        <FormattedLabel id="clear" />
                      </Button>
                    </Grid>

                    <Grid item>
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
            </Slide>
          )}
        </FormProvider>
        <Grid container style={{ padding: "10px" }}>
          <Grid item xs={12} style={{ display: "flex", justifyContent: "end" }}>
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
              printOptions: {
                copyStyles: true,
                hideToolbar: true,
                hideFooter: true,
              },
            },
          }}
          autoHeight
          sx={{
            marginTop: "20px",
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
          density="compact"
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
