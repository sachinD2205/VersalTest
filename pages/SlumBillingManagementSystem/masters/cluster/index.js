// import { yupResolver } from "@hookforpostm/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  Grid,
  Paper,
  Select,
  Slide,
  TextField,
  Toolbar,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import schema from "../../../../containers/schema/slumManagementSchema/clusterSchema";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { GridToolbar } from "@mui/x-data-grid";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import urls from "../../../../URLS/urls";
import { useRouter } from "next/router";
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
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [editData, setEditData] = useState({});
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [dataPageNo, setDataPage] = useState();

  const language = useSelector((state) => state.labels.language);

  //get logged in user
  const user = useSelector((state) => state.user.user);
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
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

  useEffect(() => {
    getAllClusterData();
  }, [fetchData, id]);

  useEffect(() => {
    let _res = editData;
    setValue("slumName", _res?.slumName ? _res?.slumName : "");
    setValue("slumKey", _res?.slumKey ? _res?.slumKey : "");
    setValue(
      "clusterNameEng",
      _res?.clusterNameEng ? _res?.clusterNameEng : ""
    );
    setValue("clusterNameMr", _res?.clusterNameMr ? _res?.clusterNameMr : "");

    setValue("gisId", _res?.gisId ? _res?.gisId : "");
    setValue("noOfHuts", _res?.noOfHuts ? _res?.noOfHuts : "");

    setValue(
      "totalPopulation",
      _res?.totalPopulation ? _res?.totalPopulation : ""
    );
  }, [editData]);

  const getClusterDataById = (id) => {
    axios
      .get(`${urls.SLUMURL}/mstCluster/getById?id=${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setEditData(res.data);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // Get Table - Data
  const getAllClusterData = (_pageSize = 10, _pageNo = 0) => {
    setIsLoading(true);
    axios
      .get(`${urls.SLUMURL}/mstCluster/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setIsLoading(false);
        let result = r.data.mstClusterDaoList;
        let _res = result.map((r, i) => {
          return {
            activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1 + _pageNo * _pageSize,
            clusterNameEng: r.clusterNameEng,
            clusterNameMr: r.clusterNameMr,
            gisId: r.gisId,
            noOfHuts: r.noOfHuts,
            population: r.totalPopulation,
          };
        });
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

  const onSubmitForm = (fromData) => {
    let _body = {
      ...fromData,
    };
    const tempData = axios
      .post(`${urls.SLUMURL}/mstCluster/save`, _body, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          btnSaveText === "Save"
            ? sweetAlert(
                language === "en" ? "Updated!" : "अद्ययावत केले!",
                language === "en"
                  ? "Record Updated Successfully !"
                  : "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
                "success",
                { button: language === "en" ? "Ok" : "ठीक आहे" }
              ).then((will) => {
                if (will) {
                  setButtonInputState(false);
                  setIsOpenCollapse(false);
                  setFetchData(tempData);
                  setEditButtonInputState(false);
                }
              })
            : sweetAlert(
                language === "en" ? "Saved!" : "जतन केले!",
                language === "en"
                  ? "Record Saved Successfully !"
                  : "रेकॉर्ड यशस्वीरित्या जतन केले!",
                "success",
                { button: language === "en" ? "Ok" : "ठीक आहे" }
              ).then((will) => {
                if (will) {
                  setButtonInputState(false);
                  setIsOpenCollapse(false);
                  setFetchData(tempData);
                  setEditButtonInputState(false);
                }
              });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
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
        buttons: [
          language == "en" ? "No" : "नाही",
          language === "en" ? "Yes" : "होय",
        ],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          axios
            .post(`${urls.SLUMURL}/mstCluster/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
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
                getAllClusterData();
              }
            })
            .catch((err) => {
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
        buttons: [
          language == "en" ? "No" : "नाही",
          language === "en" ? "Yes" : "होय",
        ],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          axios
            .post(`${urls.SLUMURL}/mstCluster/save`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
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
                getAllClusterData();
              }
            })
            .catch((err) => {
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
  };

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      // slumKey: "",
      ownershipKey: "",
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    // slumKey: "",
    clusterNameEng: "",
    clusterNameMr: "",
    gisId: "",
    noOfHuts: "",
    totalPopulation: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    // slumKey: "",
    clusterNameEng: "",
    clusterNameMr: "",
    gisId: "",
    noOfHuts: "",
    totalPopulation: "",
    id: null,
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
      width: 70,
    },

    // {
    //   field: language === "en" ? "slumName" : "slumNameMr",
    //   headerAlign: "center",
    //   align: "center",
    //   headerName: <FormattedLabel id="slumKey" />,
    //   flex: 1,
    //   minWidth: 250,
    // },
    {
      field: language === "en" ? "clusterNameEng" : "clusterNameMr",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="clusterName" />,
      flex: 1,
      minWidth: 250,
    },

    {
      field: "noOfHuts",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="noOfHuts" />,
      flex: 1,
      minWidth: 100,
    },

    {
      field: "population",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="population" />,
      flex: 1,
      minWidth: 100,
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"), getClusterDataById(params.row.id);
                setIsOpenCollapse(true), setSlideChecked(true);
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

  // Row

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
                <FormattedLabel id="cluster" />
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
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Grid container spacing={2} sx={{ padding: "1rem" }}>
                  {/* slum name */}

                  {/* <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <FormControl
                      variant="standard"
                      size="small"
                      sx={{ minWidth: "90%" }}
                      error={!!errors.slumKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="slumKey" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            disabled={router?.query?.pageMode === "View"}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            {...register("slumKey")}
                            InputLabelProps={{
                              //true
                              shrink:
                                (watch("slumKey") ? true : false) ||
                                (router.query.slumKey ? true : false),
                            }}
                          >
                            {slumDropDown &&
                              slumDropDown.map((value, index) => (
                                <MenuItem key={index} value={value.id}>
                                  {language == "en"
                                    ? value.slumName
                                    : value.slumNameMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="slumKey"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.slumKey ? errors.slumKey.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid> */}

                  {/* cluster Name */}

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <Transliteration
                      variant={"standard"}
                      _key={"clusterNameEng"}
                      width={"90%"}
                      labelName={"clusterName"}
                      fieldName={"clusterNameEng"}
                      updateFieldName={"clusterNameMr"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      label={<FormattedLabel id="clusterName" required />}
                      error={!!errors.clusterNameEng}
                      helperText={
                        errors?.clusterNameEng
                          ? errors.clusterNameEng.message
                          : null
                      }
                    />
                  </Grid>

                  {/* Cluster Name Mr */}

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <Transliteration
                      variant={"standard"}
                      _key={"clusterNameMr"}
                      width={"90%"}
                      labelName={"clusterName"}
                      fieldName={"clusterNameMr"}
                      updateFieldName={"clusterNameEng"}
                      sourceLang={"eng"}
                      targetLang={"mar"}
                      label={<FormattedLabel id="clusterNameMr" required />}
                      error={!!errors.clusterNameMr}
                      helperText={
                        errors?.clusterNameMr
                          ? errors.clusterNameMr.message
                          : null
                      }
                    />
                  </Grid>

                  {/* GIS ID */}

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <TextField
                      sx={{ minWidth: "90%" }}
                      label={<FormattedLabel id="gisId" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("gisId")}
                      error={!!errors.gisId}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("gisId") ? true : false) ||
                          (router.query.gisId ? true : false),
                      }}
                      helperText={errors?.gisId ? errors.gisId.message : null}
                    />
                  </Grid>

                  {/* No of Huts */}

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <TextField
                      sx={{ minWidth: "90%" }}
                      label={<FormattedLabel id="noOfHuts" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("noOfHuts")}
                      error={!!errors.noOfHuts}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("noOfHuts") ? true : false) ||
                          (router.query.noOfHuts ? true : false),
                      }}
                      helperText={
                        errors?.noOfHuts ? errors.noOfHuts.message : null
                      }
                    />
                  </Grid>

                  {/* Population */}

                  <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                    <TextField
                      sx={{ minWidth: "90%" }}
                      label={<FormattedLabel id="population" />}
                      id="standard-basic"
                      variant="standard"
                      {...register("totalPopulation")}
                      error={!!errors.totalPopulation}
                      InputProps={{ style: { fontSize: 18 } }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
                        //true
                        shrink:
                          (watch("totalPopulation") ? true : false) ||
                          (router.query.totalPopulation ? true : false),
                      }}
                      helperText={
                        errors?.totalPopulation
                          ? errors.totalPopulation.message
                          : null
                      }
                    />
                  </Grid>
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
                      // sx={{ marginRight: 8 }}
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
                      // sx={{ marginRight: 8 }}
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
                {/* </div> */}
              </form>
            </Slide>
          )}
        </FormProvider>

        {/* <div className={styles.addbtn}> */}
        <Grid container style={{ padding: "10px" }}>
          <Grid item xs={12} style={{ display: "flex", justifyContent: "end" }}>
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
        {/* </div> */}

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
            // "& .MuiDataGrid-toolbarContainer .MuiButton-root[aria-label='Export']":
            //   {
            //     display: "none",
            //   },
          }}
          density="compact"
          pagination
          paginationMode="server"
          rowCount={data.totalRows}
          rowsPerPageOptions={data.rowsPerPageOptions}
          page={data.page}
          pageSize={data.pageSize}
          rows={data.rows}
          columns={columns}
          onPageChange={(_data) => {
            setDataPage(_data);
            getAllClusterData(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            setDataPage(_data);
            getAllClusterData(_data, data.page);
          }}
        />
      </Paper>
    </>
  );
};

export default Index;
