import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  Stack,
  ThemeProvider
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import schema from "../../../../components/streetVendorManagementSystem/schema/HawkerAreaZoneWise";
import ItemMasterCSS from "../../../../components/streetVendorManagementSystem/styles/Item.module.css";
import Loader from "../../../../containers/Layout/components/Loader";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      id: null,
    },
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    clearErrors,
    formState: { errors },
  } = methods;
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const language = useSelector((state) => state?.labels.language);
  const [zoneWardAreaKeys, setZoneWardAreaKeys] = useState([]);
  const [roadNameKeys, setRoadNameKeys] = useState([]);
  const [landmarkKeys, setLandmarkKeys] = useState([]);
  const [mappingData, setMappingData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const userToken = useGetToken();
  const [loadderState, setLoadderState] = useState(false);
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

  // get zoneWardAreaMapping getAll from cfc
  const getZoneWardAreaKeys = () => {
    axios
      .get(`${urls.HMSURL}/mstAreaZoneWardRoadLandMarkMapping/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setZoneWardAreaKeys(
            r?.data?.mstAreaZoneWardRoadLandMarkMappingDao?.map((row) => ({
              id: row?.id,
              zone: row?.zone,
              ward: row?.ward,
              area: row?.area,
              zoneWardAreaEn: `${row?.zoneName} - ${row?.wardName} - ${row?.areaName} `,
              zoneWardAreaMr: `${row?.zoneNameMr} - ${row?.wardNameMr} - ${row?.areaNamemr} `,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // get roadName getAll from cfc
  const getRoadNameKeys = () => {
    axios
      .get(`${urls.CFCURL}/mstRoadName/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setRoadNameKeys(
            r?.data?.roadName?.map((row) => ({
              id: row?.id,
              roadNameEn: row?.roadNameEn,
              roadNameMr: row?.roadNameMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // get landmark getAll from cfc
  const getLandMarkKeys = () => {
    axios
      .get(`${urls.CFCURL}/master/locality/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setLandmarkKeys(
            r?.data?.locality?.map((row) => ({
              id: row?.id,
              landmarkEng: row?.landmarkEng,
              landmarkMr: row?.landmarkMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // Get Table - Data
  const getAllAreaZoneWardRoadLandMarkMapping = (
    _pageSize = 10,
    _pageNo = 0
  ) => {
    setLoadderState(true);
    axios
      .get(`${urls.HMSURL}/mstAreaZoneWardRoadLandMarkMapping/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          setLoadderState(false);

          let response = res?.data?.mstAreaZoneWardRoadLandMarkMappingDao;
          let _res = response.map((r, i) => {
            return {
              // ...r,
              id: r?.id,
              srNo: i + 1,

              roadId: r?.roadId,
              landMarkId: r?.landMarkId,
              zoneWardAreaMapping: r?.zoneWardAreaMapping,

              zoneWardAreaEn: zoneWardAreaKeys?.find(
                (obj) => obj?.id == r?.zoneWardAreaMapping
              )?.zoneWardAreaEn,
              zoneWardAreaMr: zoneWardAreaKeys?.find(
                (obj) => obj?.id == r?.zoneWardAreaMapping
              )?.zoneWardAreaMr,

              roadName: roadNameKeys?.find((obj) => obj?.id == r?.roadId)
                ?.roadNameEn,
              roadNameMr: roadNameKeys?.find((obj) => obj?.id == r?.roadId)
                ?.roadNameMr,
              landMarkEng: landmarkKeys?.find((obj) => obj?.id == r?.landMarkId)
                ?.landmarkEng,
              landMarkmr: landmarkKeys?.find((obj) => obj?.id == r?.landMarkId)
                ?.landmarkMr,
              activeFlag: r?.activeFlag,
              status: r?.activeFlag === "Y" ? "Active" : "Inactive",
            };
          });

          setMappingData({
            rows: _res,
            totalRows: res.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res.data.pageSize,
            page: res.data.pageNo,
          });
        }
      })
      .catch((error) => {
        setLoadderState(false);
        callCatchMethod(error, language);
      });
  };

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    const finalBodyForApi = {
      ...fromData,
      activeFlag: "Y",
    };

    console.log(
      "LastCreatedEntryName",
      zoneWardAreaKeys?.find((obj) => obj?.id == fromData?.zoneWardAreaMapping)
        ?.zoneWardAreaEn
    );

    axios
      .post(
        `${urls.HMSURL}/mstAreaZoneWardRoadLandMarkMapping/save`,
        finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }

      )
      .then((res) => {
        if (res?.status == 201 || res?.status == 200) {
          if (fromData?.id) {
            language == "en"
              ? sweetAlert({
                title: "Updated!",
                text: "Record Updated successfully!",
                icon: "success",
                button: "Ok",
              })
              : sweetAlert({
                title: "अपडेट केले!",
                text: "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
                icon: "success",
                button: "ओके",
              });
          } else {
            language == "en"
              ? sweetAlert({
                title: "Saved!",
                text: "Record Saved successfully!",
                icon: "success",
                button: "Ok",
              })
              : sweetAlert({
                title: "जतन केले!",
                text: "रेकॉर्ड यशस्वीरित्या जतन केले!",
                icon: "success",
                button: "ओके",
              });
          }
          getAllAreaZoneWardRoadLandMarkMapping();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // Delete
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };

    if (_activeFlag === "N") {
      swal({
        title: language == "en" ? "Inactivate?" : "निष्क्रिय करायचे?",
        text:
          language == "en"
            ? "Are you sure you want to inactivate this Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता ?",
        icon: "warning",
        buttons: {
          cancel: language === "en" ? "No, Cancel" : "नको, कॅन्सेल",
          confirm: language === "en" ? "Yes, Inactivate" : "होय, निष्क्रिय करा",
        },
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          axios
            .post(
              `${urls.HMSURL}/mstAreaZoneWardRoadLandMarkMapping/save`,
              body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }

            )
            .then((res) => {
              if (res.status == 200 || res?.status == 201) {
                swal({
                  title:
                    language == "en"
                      ? "Record is Successfully Deleted!"
                      : "रेकॉर्ड यशस्वीरित्या हटवले आहे!",
                  text: "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
                  icon: "success",
                  button: "ओके",
                });
                getAllAreaZoneWardRoadLandMarkMapping();
                setButtonInputState(false);
              }
            });
        } else if (willDelete == null) {
          swal({
            title: language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे",
            buttons: {
              confirm: language === "en" ? "OK" : "ओके",
            },
          });
        }
      });
    } else {
      swal({
        title: language == "en" ? "Activate?" : "सक्रिय करा",
        text:
          language == "en"
            ? "Are you sure you want to activate this Record ? "
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता ?",
        icon: "warning",
        buttons: {
          cancel: language === "en" ? "No, Cancel" : "नको, कॅन्सेल",
          confirm: language === "en" ? "Yes, Activate" : "होय, सक्रिय करा",
        },
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete === true) {
          axios
            .post(
              `${urls.HMSURL}/mstAreaZoneWardRoadLandMarkMapping/save`,
              body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }

            )
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200 || res?.status == 201) {
                swal({
                  title:
                    language == "en"
                      ? "Record is Successfully Activated!"
                      : "रेकॉर्ड यशस्वीरित्या सक्रिय केले आहे!",
                  text: "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
                  icon: "success",
                  button: "ओके",
                });
                getAllAreaZoneWardRoadLandMarkMapping();
                setButtonInputState(false);
              }
            }).catch((error) => {
              callCatchMethod(error, language);
            });
        } else if (willDelete == null) {
          swal({
            title: language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे",
            buttons: {
              confirm: language === "en" ? "OK" : "ओके",
            },
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
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    zoneWardAreaMapping: null,
    roadId: null,
    landMarkId: null,
  };

  // Reset Values Exit
  const resetValuesExit = {
    zoneWardAreaMapping: null,
    roadId: null,
    landMarkId: null,
    id: null,
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
      width: 100,
    },

    {
      field: language == "en" ? "zoneWardAreaEn" : "zoneWardAreaMr",
      headerName: <FormattedLabel id="zoneWardArea" />,
      description: <FormattedLabel id="zoneWardArea" />,
      align: "left",
      headerAlign: "center",
      width: 500,
    },
    {
      field: language == "en" ? "roadName" : "roadNameMr",
      headerName: <FormattedLabel id="roadName" />,
      description: <FormattedLabel id="roadName" />,
      align: "left",
      headerAlign: "center",
      width: 440,
    },
    {
      field: language == "en" ? "landMarkEng" : "landMarkmr",
      headerName: <FormattedLabel id="landmark" />,
      description: <FormattedLabel id="landmark" />,
      align: "left",
      headerAlign: "center",
      width: 450,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="action" />,
      description: <FormattedLabel id="action" />,
      align: "left",
      headerAlign: "center",
      width: 141,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              disabled={params.row.activeFlag == "N" || editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update");
                setID(params?.row?.id);
                setIsOpenCollapse(true);
                setSlideChecked(true);
                setButtonInputState(true);
                reset(params?.row);
              }}
            >
              <EditIcon
                sx={{
                  color: params.row.activeFlag === "N" ? "gray" : "#556CD6",
                }}
              />
            </IconButton>

            <IconButton>
              {params.row.activeFlag == "Y" ? (
                <ToggleOnIcon
                  style={{ color: "green", fontSize: 30 }}
                  onClick={() => deleteById(params.row.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.row.id, "Y")}
                />
              )}
            </IconButton>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    getZoneWardAreaKeys();
    getRoadNameKeys();
    getLandMarkKeys();
  }, []);

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getAllAreaZoneWardRoadLandMarkMapping();
  }, [zoneWardAreaKeys, roadNameKeys, landmarkKeys]);

  // View
  return (
    <>
      {loadderState ? (
        <Loader />
      ) : (
        <Paper className={ItemMasterCSS.Paper} elevation={5}>
          <ThemeProvider theme={theme}>
            <div className={ItemMasterCSS.MainHeader}>
              {<FormattedLabel id="areaZoneWardRoadLandMarkMappingMaster" />}
            </div>

            {isOpenCollapse && (
              <Slide
                direction="down"
                in={slideChecked}
                mountOnEnter
                unmountOnExit
              >
                <div>
                  <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmitForm)}>
                      <Grid container style={{ marginBottom: "7vh" }}>
                        {/* zoneWardArea */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItem: "center",
                            marginBottom: "5px",
                          }}
                        >
                          <FormControl
                            variant="standard"
                            error={!!errors?.zoneWardAreaMapping}
                          >
                            <InputLabel shrink={watch("zoneWardAreaMapping") != null && watch("zoneWardAreaMapping") != undefined && watch("zoneWardAreaMapping") != "" ? true : false} id="demo-simple-select-standard-label">
                              <FormattedLabel id="zoneWardArea" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label={<FormattedLabel id="zoneWardArea" />}
                                >
                                  {zoneWardAreaKeys &&
                                    zoneWardAreaKeys.map((item, index) => (
                                      <MenuItem key={index} value={item?.id}>
                                        {language == "en"
                                          ? item?.zoneWardAreaEn
                                          : item?.zoneWardAreaMr}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="zoneWardAreaMapping"
                              control={control}
                              defaultValue={null}
                            />
                            <FormHelperText>
                              {errors?.zoneWardAreaMapping
                                ? errors?.zoneWardAreaMapping?.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        {/* roadName */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItem: "center",
                            marginBottom: "5px",
                          }}
                        >
                          <FormControl
                            variant="standard"
                            error={!!errors?.roadId}
                          >
                            <InputLabel shrink={watch("roadId") != null && watch("roadId") != undefined && watch("roadId") != "" ? true : false} id="demo-simple-select-standard-label">
                              <FormattedLabel id="roadName" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label={<FormattedLabel id="roadName" />}
                                >
                                  {roadNameKeys &&
                                    roadNameKeys.map((item, index) => (
                                      <MenuItem key={index} value={item?.id}>
                                        {language == "en"
                                          ? item?.roadNameEn
                                          : item?.roadNameMr}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="roadId"
                              control={control}
                              defaultValue={null}
                            />
                            <FormHelperText>
                              {errors?.roadId ? errors?.roadId?.message : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        {/* landMark */}
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItem: "center",
                            marginBottom: "5px",
                          }}
                        >
                          <FormControl
                            variant="standard"
                            error={!!errors?.landMarkId}
                          >
                            <InputLabel shrink={watch("landMarkId") != null && watch("landMarkId") != undefined && watch("landMarkId") != "" ? true : false} id="demo-simple-select-standard-label">
                              <FormattedLabel id="landmark" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label={<FormattedLabel id="landmark" />}
                                >
                                  {landmarkKeys &&
                                    landmarkKeys.map((item, index) => (
                                      <MenuItem key={index} value={item?.id}>
                                        {language == "en"
                                          ? item?.landmarkEng
                                          : item?.landmarkMr}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="landMarkId"
                              control={control}
                              defaultValue={null}
                            />
                            <FormHelperText>
                              {errors?.landMarkId
                                ? errors?.landMarkId?.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>

                      <Stack
                        direction={{
                          xs: "column",
                          sm: "row",
                          md: "row",
                          lg: "row",
                          xl: "row",
                        }}
                        spacing={{ xs: 2, sm: 2, md: 5, lg: 5, xl: 5 }}
                        justifyContent="center"
                        alignItems="center"
                        marginTop="5"
                      >
                        <Button
                          className={ItemMasterCSS.ButtonForMobileWidth}
                          size="small"
                          type="submit"
                          variant="contained"
                          color="success"
                          endIcon={<SaveIcon />}
                        >
                          {btnSaveText == "Save" ? (
                            <FormattedLabel id="save" />
                          ) : (
                            <FormattedLabel id="update" />
                          )}
                        </Button>
                        <Button
                          className={ItemMasterCSS.ButtonForMobileWidth}
                          size="small"
                          sx={{ marginRight: 8 }}
                          variant="contained"
                          color="primary"
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                        >
                          <FormattedLabel id="clear" />
                        </Button>
                        <Button
                          className={ItemMasterCSS.ButtonForMobileWidth}
                          size="small"
                          variant="contained"
                          color="error"
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitButton()}
                        >
                          <FormattedLabel id="exit" />
                        </Button>
                      </Stack>
                    </form>
                  </FormProvider>
                </div>
              </Slide>
            )}
            <div className={ItemMasterCSS.AddButton}>
              <Button
                size="small"
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
                {<FormattedLabel id="add" />}
              </Button>
            </div>
          </ThemeProvider>
          <div className={ItemMasterCSS.DataGridDiv}>
            <DataGrid
              componentsProps={{
                toolbar: {
                  searchPlaceholder: "शोधा",
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                  printOptions: { disableToolbarButton: true },
                  // disableExport: true,
                  // disableToolbarButton: true,
                  csvOptions: { disableToolbarButton: true },
                },
              }}
              components={{ Toolbar: GridToolbar }}
              sx={{
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
              columns={columns}
              density="compact"
              autoHeight={true}
              pagination
              paginationMode="server"
              page={mappingData?.page}
              rowCount={mappingData?.totalRows}
              rowsPerPageOptions={mappingData?.rowsPerPageOptions}
              pageSize={mappingData?.pageSize}
              rows={mappingData?.rows}
              onPageChange={(_data) => {
                getAllAreaZoneWardRoadLandMarkMapping(
                  mappingData?.pageSize,
                  _data
                );
              }}
              onPageSizeChange={(_data) => {
                getAllAreaZoneWardRoadLandMarkMapping(_data, mappingData?.page);
              }}
            />
          </div>
        </Paper>
      )}
    </>
  );
};

export default Index;
