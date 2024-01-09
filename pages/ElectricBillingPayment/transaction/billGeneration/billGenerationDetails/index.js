import { yupResolver } from "@hookform/resolvers/yup";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  IconButton,
} from "@mui/material";
import Tipani from "../documents/tipani";
import moment from "moment";
import Loader from "../../../../../containers/Layout/components/Loader";
import BreadCrumb from "../../../../../components/common/BreadcrumbComponent";
import { useRouter } from "next/router";
import commonStyles from "../../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../../util/commonErrorUtil";

const Index = () => {
  const {
    register,
    setValue,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
  });
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    height: "90%",
    overflow: "scroll",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const [commonObject, setCommonObject] = useState({
    zone: "",
    subDivision: "",
    msedclCategory: "",
    departmentCategory: "",
  });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [zoneDropDown, setZoneDropDown] = useState([]);
  const [subDivisionDropDown, setSubDivisionDropDown] = useState([]);
  const [departmentCategoryDropDown, setDepartmentCategoryDropDown] = useState(
    []
  );
  const [msedclCategoryDropDown, setMsedclCategoryDropDown] = useState([]);
  const [commonData, setCommonData] = useState({});
  const [selectionModel, setSelectionModel] = useState([]);
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

  const language = useSelector((state) => state.labels.language);
  const user = useSelector((state) => state.user.user);
  const router = useRouter();
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    // getCreatedBillData();
    getZone();
    getMsedclCategory();
    getSubDivision();
    getDepartmentCategory();
  }, []);

  useEffect(() => {
    getZone();
    getMsedclCategory();
    getSubDivision();
    getDepartmentCategory();
  }, [language]);

  useEffect(() => {
    let _res = commonData;

    let zone, subDivision, msedclCategory, departmentCategory;

    if (zoneDropDown && subDivisionDropDown) {
      zone =
        zoneDropDown &&
        zoneDropDown.find((each) => each.id == _res?.zoneKey)?.zoneNameMr;
      subDivision =
        subDivisionDropDown &&
        subDivisionDropDown.find((each) => each.id == _res?.subDivisionKey)
          ?.subDivisionMr;
      msedclCategory =
        msedclCategoryDropDown &&
        msedclCategoryDropDown.find((each) => each.id == _res?.msedclCategory)
          ?.msedclCategoryMr;
      departmentCategory =
        departmentCategoryDropDown &&
        departmentCategoryDropDown.find(
          (each) => each.id == _res?.departmentCategory
        )?.departmentCategoryMr;

      setCommonObject({
        zone,
        subDivision,
        msedclCategory,
        departmentCategory,
      });
    }
  }, [commonData]);

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

  /////// function to handle All select from table

  const handleSelectionModelChange = (newSelectionModel) => {
    setSelectionModel(newSelectionModel);
  };

  const handleClear = () => {
    setValue("zoneKey", "");

    setValue("consumerNo", "");

    setValue("subDivisionKey", "");

    setValue("msedclCategory", "");
  };

  // get Zone Name
  const getZone = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        let temp = res.data.zone;
        setZoneDropDown(temp);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // get Msedcl Category
  const getMsedclCategory = () => {
    axios
      .get(`${urls.EBPSURL}/mstMsedclCategory/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        let temp = res.data.mstMsedclCategoryList;
        setMsedclCategoryDropDown(temp);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get SubDivision
  const getSubDivision = () => {
    axios
      .get(`${urls.EBPSURL}/mstSubDivision/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        let temp = res.data.mstSubDivisionList;
        setSubDivisionDropDown(temp);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get Department Category
  const getDepartmentCategory = () => {
    axios
      .get(`${urls.EBPSURL}/mstDepartmentCategory/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        let temp = res.data.mstDepartmentCategoryList;
        setDepartmentCategoryDropDown(temp);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const handleGenerateTipani = () => {
    handleOpen();
  };

  const onSubmitForm = (formdata) => {
    setCommonData(formdata);
    getCreatedBillData();
  };

  // Get Table - Data
  const getCreatedBillData = (_pageSize = 10, _pageNo = 0, type) => {
    setLoading(true);
    let data = {
      consumerNumber: watch("consumerNo") ? watch("consumerNo") : null,
      zone: watch("zoneKey") ? watch("zoneKey") : null,
      subDivision: watch("subDivisionKey") ? watch("subDivisionKey") : null,
      category: watch("departmentCategory")
        ? watch("departmentCategory")
        : null,
      MsdclDivision: watch("msedclCategory") ? watch("msedclCategory") : null,
    };

    if (watch("zoneKey")) {
      axios
        .post(
          `${urls.EBPSURL}/trnMeterReadingAndBillGenerate/getAllByWardSubDivCategoryConsumerNo`,
          data,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            params: {
              pageSize: _pageSize,
              pageNo: _pageNo,
            },
          }
        )
        .then((r) => {
          setLoading(false);
          let result = r.data.trnMeterReadingAndBillGenerateList;

          if (result.length > 0 && zoneDropDown.length > 0) {
            let _res = result.map((r, i) => {
              return {
                activeFlag: r.activeFlag,
                id: r.id,
                srNo: i + 1 + _pageNo * _pageSize,

                meterAddress: r?.newConnectionEntryDao?.consumerAddress,
                meterAddressMr: r?.newConnectionEntryDao?.consumerAddressMr,

                consumerName: r?.newConnectionEntryDao?.consumerName,
                consumerNameMr: r?.newConnectionEntryDao?.consumerNameMr,

                zone:
                  zoneDropDown &&
                  zoneDropDown.find((each) => each.id == r?.zoneKey).zoneName,
                zoneMr:
                  zoneDropDown &&
                  zoneDropDown.find((each) => each.id == r?.zoneKey).zoneNameMr,

                consumerNo: r?.consumerNo,
                applicationNo: r?.applicationNo,
                vanNo: r?.newConnectionEntryDao?.vanNo,
                meterNo: r?.newConnectionEntryDao?.meterNo,
                consumedUnit: r?.consumedUnit,
                billedAmount: r?.billedAmount,
                amountToBePaid: r?.amountToBePaid,
                meterReadingKey: r?.id,
                newConnectionKey: r?.newConnectionKey,
                billDueDate: moment(r?.billDueDate).format("DD-MM-YYYY"),
                fromDiscountDate: moment(r?.fromDiscountDate).format(
                  "DD-MM-YYYY"
                ),
              };
            });
            setData({
              rows: _res,
              totalRows: r.data.totalElements,
              rowsPerPageOptions: [10, 20, 50, 100],
              pageSize: r.data.pageSize,
              page: r.data.pageNo,
            });
          } else {
            setLoading(false);
            if (type === "after Tipani generated") {
            } else {
              sweetAlert(
                language == "en" ? "Oops!" : "अरेरे!",
                language == "en"
                  ? "No Records Found!"
                  : "कोणतेही रेकॉर्ड आढळले नाही!",
                "warning",
                { button: language === "en" ? "Ok" : "ठीक आहे" }
              );
            }
          }
        })
        .catch((err) => {
          setLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    } else {
      setLoading(false);
      sweetAlert(
        language == "en" ? "Oops!" : "अरेरे!",
        language == "en"
          ? "Please Select Zone To search Bill!"
          : "बिल शोधण्यासाठी कृपया झोन प्रविष्ट करा!",
        "warning",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    }
  };

  const handleResetValues = () => {
    reset({
      consumerNo: "",
      zoneKey: "",
      subDivisionKey: "",
      departmentCategory: "",
      msedclCategory: "",
    });
  };

  const columns = [
    //Sr No
    { field: "srNo", width: 70, headerName: <FormattedLabel id="srNo" /> },

    // Application No
    {
      field: "applicationNo",
      headerName: <FormattedLabel id="applicationNo" />,
      width: 150,
    },

    // Zone
    {
      field: language == "en" ? "zone" : "zoneMr",
      headerName: <FormattedLabel id="zone" />,
      width: 150,
    },

    // consumerNo
    {
      field: "consumerNo",
      headerName: <FormattedLabel id="consumerNo" />,
      width: 150,
    },

    // Consumer name
    {
      field: language == "en" ? "consumerName" : "consumerNameMr",
      headerName: <FormattedLabel id="consumerName" />,
      width: 200,
    },

    // meter Address
    {
      field: language == "en" ? "meterAddress" : "meterAddressMr",
      headerName: <FormattedLabel id="meterAddress" />,
      width: 150,
    },

    // vanNo
    {
      field: "vanNo",
      headerName: <FormattedLabel id="vanNo" />,
      width: 100,
    },

    // meterNo
    {
      field: "meterNo",
      headerName: <FormattedLabel id="meterNo" />,
      width: 130,
    },

    // consumedUnit
    {
      field: "consumedUnit",
      headerName: <FormattedLabel id="consumedUnit" />,
      width: 130,
    },

    // billDueDate
    {
      field: "billDueDate",
      headerName: <FormattedLabel id="billDueDate" />,
      width: 130,
    },

    // From discount date
    {
      field: "fromDiscountDate",
      headerName: <FormattedLabel id="fromDiscountDate" />,
      width: 150,
    },

    // billedAmount
    {
      field: "billedAmount",
      headerName: <FormattedLabel id="billedAmount" />,
      width: 120,
    },

    // amountToBePaid
    {
      field: "amountToBePaid",
      headerName: <FormattedLabel id="amountToBePaid" />,
      width: 150,
    },

    // {
    //   field: "actions",
    //   headerName: <FormattedLabel id="actions" />,
    //   width: 130,
    //   headerAlign: "center",
    //   align: "center",
    //   sortable: false,
    //   disableColumnMenu: true,
    //   renderCell: (params) => {
    //     return (
    //       <Box>
    //         <Tooltip title="View">
    //           <IconButton
    //             onClick={() => {
    //               handleViewActions(params.row);
    //             }}
    //           >
    //             <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
    //           </IconButton>
    //         </Tooltip>

    //         <Tooltip title="Edit">
    //           <IconButton
    //             onClick={() => {
    //               router.push({
    //                 pathname: "/ElectricBillingPayment/transaction/newConnectionEntry/editDemandGeneration",
    //                 query: {
    //                   id: params.row.id,
    //                 },
    //               });
    //             }}
    //           >
    //             <EditIcon style={{ color: "#556CD6" }} />
    //           </IconButton>
    //         </Tooltip>
    //       </Box>
    //     );
    //   },
    // },
  ];

  return loading ? (
    <CommonLoader />
  ) : (
    <>
      <Box>
        <div>
          <BreadCrumb />
        </div>
      </Box>
      <div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitForm)}>
            {/* Firts Row */}

            {/* search conneaction entry by consumer number */}

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
                    <FormattedLabel id="billGeneration" />
                  </h3>
                </Grid>
              </Grid>
            </Box>

            <Grid
              container
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px",
              }}
            >
              {/* Zone Name */}

              <Grid
                item
                xl={2}
                lg={2}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl
                  // variant="outlined"
                  variant="standard"
                  size="small"
                  sx={{ m: 1, minWidth: "75%" }}
                  error={!!errors.zoneKey}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {<FormattedLabel id="zone" required />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        // sx={{ width: 200 }}
                        value={field.value}
                        {...register("zoneKey")}
                        label={<FormattedLabel id="zone" />}
                        // InputLabelProps={{
                        //   //true
                        //   shrink:
                        //     (watch("officeLocation") ? true : false) ||
                        //     (router.query.officeLocation ? true : false),
                        // }}
                      >
                        {zoneDropDown &&
                          zoneDropDown.map((each, index) => (
                            <MenuItem key={index} value={each.id}>
                              {language == "en"
                                ? each.zoneName
                                : each.zoneNameMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="zoneKey"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.zoneKey ? errors.zoneKey.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* Consumer No  */}

              <Grid
                item
                xl={2}
                lg={2}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  id="standard-textarea"
                  label={<FormattedLabel id="consumerNo" />}
                  sx={{ m: 1, minWidth: "75%" }}
                  variant="standard"
                  {...register("consumerNo")}
                  error={!!errors.consumerNo}
                  helperText={
                    errors?.consumerNo ? errors.consumerNo.message : null
                  }
                  InputLabelProps={{
                    //true
                    shrink: watch("consumerNo") ? true : false,
                  }}
                />
              </Grid>

              {/* Subdivision */}

              <Grid
                item
                xl={2}
                lg={2}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl
                  // variant="outlined"
                  variant="standard"
                  size="small"
                  sx={{ m: 1, minWidth: "75%" }}
                  error={!!errors.subDivisionKey}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {<FormattedLabel id="subDivision" />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        // sx={{ width: 200 }}
                        value={field.value}
                        {...register("subDivisionKey")}
                        label={<FormattedLabel id="subDivision" />}
                      >
                        {subDivisionDropDown &&
                          subDivisionDropDown.map((each, index) => (
                            <MenuItem key={index} value={each.id}>
                              {language == "en"
                                ? each.subDivision
                                : each.subDivisionMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="subDivisionKey"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.subDivisionKey
                      ? errors.subDivisionKey.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* MSEDCL Category */}

              <Grid
                item
                xl={2}
                lg={2}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl
                  // variant="outlined"
                  variant="standard"
                  size="small"
                  sx={{ m: 1, minWidth: "75%" }}
                  error={!!errors.msedclCategory}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {<FormattedLabel id="msedclCategory" />}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        // sx={{ width: 200 }}
                        value={field.value}
                        {...register("msedclCategory")}
                        label={<FormattedLabel id="msedclCategory" />}
                      >
                        {msedclCategoryDropDown &&
                          msedclCategoryDropDown.map((each, index) => (
                            <MenuItem key={index} value={each.id}>
                              {language == "en"
                                ? each.msedclCategory
                                : each.msedclCategoryMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="msedclCategory"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.msedclCategory
                      ? errors.msedclCategory.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* search button */}

              <Grid
                item
                xl={2}
                lg={2}
                md={12}
                sm={12}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button variant="contained" size="small" type="submit">
                  <FormattedLabel id="search" />
                </Button>
              </Grid>
            </Grid>

            <Grid container>
              <DataGrid
                components={{ Toolbar: GridToolbar }}
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                    // printOptions: { disableToolbarButton: true },
                    // disableExport: true,
                    // disableToolbarButton: true,
                    // csvOptions: { disableToolbarButton: true },
                  },
                }}
                autoHeight={data.pageSize}
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
                // rows={dataSource}
                // columns={columns}
                // pageSize={5}
                // rowsPerPageOptions={[5]}
                // checkboxSelection

                density="compact"
                // autoHeight={200}
                // rowHeight={50}
                pagination
                paginationMode="server"
                loading={data.loading}
                rowCount={data.totalRows}
                rowsPerPageOptions={data.rowsPerPageOptions}
                page={data.page}
                pageSize={data.pageSize}
                rows={data.rows}
                columns={columns}
                onPageChange={(_data) => {
                  getCreatedBillData(data.pageSize, _data);
                }}
                onPageSizeChange={(_data) => {
                  getCreatedBillData(_data, data.page);
                }}
                checkboxSelection
                selectionModel={selectionModel}
                onSelectionModelChange={(value) => {
                  handleSelectionModelChange(value);
                }}
              />
            </Grid>

            <Grid
              container
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "30px",
              }}
            >
              {selectionModel.length > 0 ? (
                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    color="success"
                    onClick={handleGenerateTipani}
                  >
                    <FormattedLabel id="generateDocuments" />
                  </Button>
                </Grid>
              ) : (
                <></>
              )}

              <Grid
                item
                xl={4}
                lg={4}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button variant="contained" size="small" onClick={handleClear}>
                  <FormattedLabel id="clear" />
                </Button>
              </Grid>

              <Grid
                item
                xl={4}
                lg={4}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  onClick={() => {
                    router.push({
                      pathname: "/ElectricBillingPayment/dashboard",
                    });
                  }}
                >
                  <FormattedLabel id="exit" />
                </Button>
              </Grid>
            </Grid>

            <Grid container>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Tipani
                    commonObject={commonObject}
                    selectedData={selectionModel}
                    setSelectionModel={setSelectionModel}
                    handleClose={handleClose}
                    getCreatedBillDataSearch={getCreatedBillData}
                    setData={setData}
                    handleResetValues={handleResetValues}
                  />
                </Box>
              </Modal>
            </Grid>
          </form>
        </FormProvider>
      </div>
    </>
  );
};

export default Index;
