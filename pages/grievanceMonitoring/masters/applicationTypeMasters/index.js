import {
  Button,
  Box,
  Grid,
  IconButton,
  Paper,
  Slide,
  Tooltip,
} from "@mui/material";
import sweetAlert from "sweetalert";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import applicantTypeMasterSchema from "../../../../containers/schema/grievanceMonitoring/applicantTypeMasterSchema";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import { GridToolbar } from "@mui/x-data-grid";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import urls from "../../../../URLS/urls";
import { useSelector } from "react-redux";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil";

const Index = () => {
  const language = useSelector((store) => store.labels.language);
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(applicantTypeMasterSchema),
    mode: "onChange",
  });
  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const router = useRouter();

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();
  const [pageSize, setPageSize] = useState();
  const [totalElements, setTotalElements] = useState();
  const [pageNo, setPageNo] = useState();
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const userToken = useSelector((state) => {
    return state?.user?.user?.token;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getOwnershipType();
  }, []);

  const getOwnershipType = (_pageSize = 10, _pageNo = 0) => {
    setIsLoading(true);
    axios
      .get(`${urls.GM}/master/applicantType/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res, i) => {
        setIsLoading(false);
        let result = res.data.applicantType;
        const _res = result.map((res, i) => {
          return {
            srNo: i + 1 + _pageNo * _pageSize,
            id: res.id,
            applicantType: res.applicantType,
            applicantTypeMr: res.applicantTypeMr,
            templateData: res.templateData,
            templateDataMr: res.templateDataMr,
            remark: res.remark,
            remarkMr: res.remarkMr,
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
        cfcErrorCatchMethod(err,false)
      });
  };

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
            .post(`${urls.GM}/master/applicantType/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              setIsLoading(false);
              if (res.status == 200) {
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
                    getOwnershipType();
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
        dangerMode: true,
        buttons: [
          language === "en" ? "No" : "नाही",
          language === "en" ? "Yes" : "होय",
        ],
      }).then((willDelete) => {
        if (willDelete === true) {
          setIsLoading(true);
          axios
            .post(`${urls.GM}/master/applicantType/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              setIsLoading(false);
              if (res.status == 200) {
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
                    getOwnershipType();
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

  const onSubmitForm = (formData) => {
    const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
    const toDate = moment(formData.toDate).format("YYYY-MM-DD");
    const finalBodyForApi = {
      ...formData,
      fromDate,
      toDate,
    };
    setIsLoading(true);
    axios
      .post(`${urls.GM}/master/applicantType/save`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 200) {
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
                  getOwnershipType();
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
                  getOwnershipType();
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
  };

  const resetValuesExit = {
    applicantTypeMr: "",
    applicantType: "",
    templateData: "",
    templateDataMr: "",
    remark: "",
    remarkMr: "",
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    applicantTypeMr: "",
    applicantType: "",
    templateData: "",
    templateDataMr: "",
    remark: "",
    remarkMr: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      minWidth: 150,
      headerAlign: "center",
      align:'center'
    },
    {
      field: language == "en" ? "applicantType" : "applicantTypeMr",
      headerName: <FormattedLabel id="applicantType" />,
      headerAlign: "center",
      flex: 1,
      align:'left'
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      minWidth: 250,
      headerAlign: "center",
      align:'left',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              gap: 20,
            }}
          >
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
          </div>
        );
      },
    },
  ];


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
                  <FormattedLabel id="applicantTypeHeading" />
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
                        _key={"applicantType"}
                        labelName={"applicantType"}
                        fieldName={"applicantType"}
                        updateFieldName={"applicantTypeMr"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        label={<FormattedLabel id="applicantType" required />}
                        error={!!errors.applicantType}
                        helperText={
                          errors?.applicantType
                            ? errors.applicantType.message
                            : null
                        }
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    
                      <Transliteration
                        variant={"standard"}
                        _key={"applicantTypeMr"}
                        labelName={"applicantTypeMr"}
                        fieldName={"applicantTypeMr"}
                        updateFieldName={"applicantType"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        label={<FormattedLabel id="applicantTypeMr" required />}
                        error={!!errors.applicantTypeMr}
                        helperText={
                          errors?.applicantTypeMr
                            ? errors.applicantTypeMr.message
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
                        size="small"
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
                </form>
              </Slide>
            </FormProvider>
          )}

          <Grid container style={{ padding: "10px" }}>
            <Grid
              item
              xs={12}
              style={{ display: "flex", justifyContent: "end" }}
            >
              <Button
                variant="contained"
                endIcon={<AddIcon />}
                type="primary"
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
            rows={dataSource}
            columns={columns}
            onPageChange={(_data) => {
              getOwnershipType(pageSize, _data);
            }}
            onPageSizeChange={(_data) => {
              getOwnershipType(_data, pageNo);
            }}
          />
        </Paper>
      </>
    </>
  );
};

export default Index;
