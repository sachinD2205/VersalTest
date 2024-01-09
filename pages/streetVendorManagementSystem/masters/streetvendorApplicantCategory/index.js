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
  TextField,
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
import Translation from "../../../../components/streetVendorManagementSystem/components/Translation";
import schema from "../../../../components/streetVendorManagementSystem/schema/StreetvendorApplicantCategorySchema";
import ItemMasterCSS from "../../../../components/streetVendorManagementSystem/styles/Item.module.css";
import Loader from "../../../../containers/Layout/components/Loader";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// func
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
  const userToken = useGetToken();
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const language = useSelector((state) => state?.labels?.language);

  // Hawker Type Data
  const [streetVendorApplicantType, setStreetVendorApplicantType] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const [loadderState, setLoadderState] = useState(false);
  const [applicationNames, setApplicationNames] = useState([]);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };

  const getModuleName = () => {
    const url = `${urls.CFCURL}/master/application/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          console.log("applicationApiData", res?.data);
          let temp = [res?.data?.application?.find((data) => data?.id == "4")];
          console.log("tem123", temp);
          setApplicationNames(
            temp?.map((row) => ({
              id: row?.id,
              applicationNameEn: row?.applicationNameEng,
              applictionNameMr: row?.applicationNameMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
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
            .post(`${urls.HMSURL}/mstStreetVendorApplicantCategory/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
            )
            .then((res) => {
              if (res.status == 200) {
                swal({
                  title:
                    language == "en"
                      ? "Record is Successfully Deleted!"
                      : "रेकॉर्ड यशस्वीरित्या हटवले आहे!",
                  text: "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
                  icon: "success",
                  button: "ओके",
                });
                getApplicantTypeDetails();
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
            .post(`${urls.HMSURL}/mstStreetVendorApplicantCategory/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
            )
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal({
                  title:
                    language == "en"
                      ? "Record is Successfully Activated!"
                      : "रेकॉर्ड यशस्वीरित्या सक्रिय केले आहे!",
                  text: "रेकॉर्ड यशस्वीरित्या अद्यतनित केले!",
                  icon: "success",
                  button: "ओके",
                });
                getApplicantTypeDetails();
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

  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    // Update Form Data
    const finalBodyForApi = {
      ...fromData,
      // activeFlag: btnSaveText === "Update" ? null : null,
      activeFlag: "Y",
      applicationName: Number(fromData.applicationName),
    };

    // Save - DB
    axios
      .post(
        `${urls.HMSURL}/mstStreetVendorApplicantCategory/save`,
        finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
      )
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
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
          getApplicantTypeDetails();
          setButtonInputState(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
          setIsOpenCollapse(false);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setButtonInputState(false);
    setIsOpenCollapse(false);
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
    applicationName: null,
    type: "",
    typeMr: "",
    subtype: "",
    subtypeMr: "",
    remark: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    applicationName: null,
    type: "",
    typeMr: "",
    subtype: "",
    subtypeMr: "",
    remark: "",
    id: null,
  };

  // Get Table
  const getApplicantTypeDetails = (_pageSize = 10, _pageNo = 0) => {
    setLoadderState(true);
    axios
      .get(`${urls.HMSURL}/mstStreetVendorApplicantCategory/getAll`, {
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

          let response = res?.data?.streetVendorApplicantCategory;
          console.log("streetVendorApplicantCategory", response);
          let _res = response.map((r, i) => {
            return {
              id: r.id,
              srNo: i + 1,
              type: r.type,
              applicationName: r?.applicationName,
              applicationNameEn: applicationNames?.find(
                (data) => data?.id == r?.applicationName
              )?.applicationNameEn,
              applicationNameMr: applicationNames?.find(
                (data) => data?.id == r?.applicationName
              )?.applictionNameMr,

              typeMr: r.typeMr,
              applicantPrefixMr: r.applicantPrefixMr,
              applicantPrefix: r.applicantPrefix,
              subtype: r.subtype,
              subtypeMr: r.subtypeMr,
              remarkMr: r.remarkMr,
              remark: r.remark,
              activeFlag: r?.activeFlag,
              status: r?.activeFlag === "Y" ? "Active" : "Inactive",
            };
          });
          setStreetVendorApplicantType({
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

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: <FormattedLabel id="srNo" />,
      width: 20,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language == "en" ? "applicationNameEn" : "applicationNameMr",
      headerName: <FormattedLabel id="applicationName" />,
      description: <FormattedLabel id="applicationName" />,
      width: 200,
    },

    {
      field: "type",
      headerName: <FormattedLabel id="applicantTypeEn" />,
      description: <FormattedLabel id="applicantTypeEn" />,
      width: 220,
    },
    {
      field: "typeMr",
      headerName: <FormattedLabel id="applicantTypeMr" />,
      description: <FormattedLabel id="applicantTypeMr" />,
      width: 220,
    },

    {
      field: "subtype",
      headerName: <FormattedLabel id="applicantSubTypeEn" />,
      description: <FormattedLabel id="applicantSubTypeEn" />,
      width: 300,
    },
    {
      field: "subtypeMr",
      headerName: <FormattedLabel id="applicantSubTypeMr" />,
      description: <FormattedLabel id="applicantSubTypeMr" />,
      width: 300,
    },

    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      description: <FormattedLabel id="remark" />,
      width: 300,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="action" />,
      description: <FormattedLabel id="action" />,
      align: "left",
      headerAlign: "center",
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              size="small"
              disabled={params.row.activeFlag == "N" || editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setID(params?.row?.id),
                  setIsOpenCollapse(true),
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
                  onClick={() => deleteById(params.id, "N")}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: "red", fontSize: 30 }}
                  onClick={() => deleteById(params.id, "Y")}
                />
              )}
            </IconButton>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    getApplicantTypeDetails();
    getModuleName();
  }, []);

  // View
  return (
    <>
      {loadderState ? (
        <Loader />
      ) : (
        <Paper className={ItemMasterCSS.Paper} elevation={5}>
          <ThemeProvider theme={theme}>
            <div className={ItemMasterCSS.MainHeader}>
              {<FormattedLabel id="streetvendorApplicantCategory" />}
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
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          className={ItemMasterCSS.GridItem}
                        >
                          <FormControl
                            variant="standard"
                            error={!!errors?.applicationName}
                          >
                            <InputLabel
                              shrink={
                                watch("applicationName") !== null &&
                                  watch("applicationName") !== "" &&
                                  watch("applicationName") !== undefined
                                  ? true
                                  : false
                              }
                              id="demo-simple-select-standard-label"
                            >
                              <FormattedLabel id="applicationName" required />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  className={ItemMasterCSS.FiledWidth}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label={
                                    <FormattedLabel
                                      id="applicationName"
                                      required
                                    />
                                  }
                                >
                                  {applicationNames &&
                                    applicationNames.map(
                                      (applicationName, index) => (
                                        <MenuItem
                                          key={applicationName?.id + 1}
                                          value={applicationName?.id}
                                        >
                                          {language == "en"
                                            ? applicationName?.applicationNameEn
                                            : applicationName?.applictionNameMr}
                                        </MenuItem>
                                      )
                                    )}
                                </Select>
                              )}
                              name="applicationName"
                              control={control}
                              defaultValue={null}
                            />
                            <FormHelperText>
                              {errors?.applicationName
                                ? errors?.applicationName?.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          className={ItemMasterCSS.GridItem}
                        >
                          <Translation
                            labelName={
                              <FormattedLabel id="applicantTypeEn" required />
                            }
                            label={
                              <FormattedLabel id="applicantTypeEn" required />
                            }
                            width={270}
                            // disabled={watch("businessSubType")}
                            error={!!errors?.type}
                            helperText={
                              errors?.type ? errors?.type?.message : null
                            }
                            key={"type"}
                            fieldName={"type"}
                            updateFieldName={"typeMr"}
                            sourceLang={"en-US"}
                            targetLang={"mr-IN"}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          className={ItemMasterCSS.GridItem}
                        >
                          <Translation
                            labelName={
                              <FormattedLabel id="applicantTypeMr" required />
                            }
                            label={
                              <FormattedLabel id="applicantTypeMr" required />
                            }
                            width={270}
                            // disabled={watch("businessSubType")}
                            error={!!errors?.typeMr}
                            helperText={
                              errors?.typeMr ? errors?.typeMr?.message : null
                            }
                            key={"typeMr"}
                            fieldName={"typeMr"}
                            updateFieldName={"type"}
                            sourceLang={"mr-IN"}
                            targetLang={"en-US"}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          className={ItemMasterCSS.GridItem}
                        >
                          <Translation
                            labelName={
                              <FormattedLabel
                                id="applicantSubTypeEn"
                                required
                              />
                            }
                            label={
                              <FormattedLabel
                                id="applicantSubTypeEn"
                                required
                              />
                            }
                            width={270}
                            error={!!errors?.subtype}
                            helperText={
                              errors?.subtype ? errors?.subtype?.message : null
                            }
                            key={"subtype"}
                            fieldName={"subtype"}
                            updateFieldName={"subtypeMr"}
                            sourceLang={"en-US"}
                            targetLang={"mr-IN"}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          className={ItemMasterCSS.GridItem}
                        >
                          <Translation
                            labelName={
                              <FormattedLabel
                                id="applicantSubTypeMr"
                                required
                              />
                            }
                            label={
                              <FormattedLabel
                                id="applicantSubTypeMr"
                                required
                              />
                            }
                            width={270}
                            error={!!errors?.subtypeMr}
                            helperText={
                              errors?.subtypeMr
                                ? errors?.subtypeMr?.message
                                : null
                            }
                            key={"subtypeMr"}
                            fieldName={"subtypeMr"}
                            updateFieldName={"subtype"}
                            sourceLang={"mr-IN"}
                            targetLang={"en-US"}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          className={ItemMasterCSS.GridItem}
                        >
                          <TextField
                            InputLabelProps={{
                              shrink:
                                watch("remark") !== null &&
                                  watch("remark") !== "" &&
                                  watch("remark") !== undefined
                                  ? true
                                  : false,
                            }}
                            sx={{ width: 270 }}
                            id="standard-basic"
                            label={<FormattedLabel id="remark" />}
                            variant="standard"
                            {...register("remark")}
                            error={!!errors.remark}
                            helperText={
                              errors?.remark ? errors.remark.message : null
                            }
                          />
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
                        className={ItemMasterCSS.ButtonStack}
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
                <FormattedLabel id="add" />
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
              page={streetVendorApplicantType?.page}
              rowCount={streetVendorApplicantType?.totalRows}
              rowsPerPageOptions={streetVendorApplicantType?.rowsPerPageOptions}
              pageSize={streetVendorApplicantType?.pageSize}
              rows={streetVendorApplicantType?.rows}
              onPageChange={(_data) => {
                getApplicantTypeDetails(
                  streetVendorApplicantType?.pageSize,
                  _data
                );
              }}
              onPageSizeChange={(_data) => {
                getApplicantTypeDetails(_data, streetVendorApplicantType?.page);
              }}
            />
          </div>
        </Paper>
      )}
    </>
  );
};

export default Index;
