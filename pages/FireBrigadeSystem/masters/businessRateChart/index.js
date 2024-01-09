import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import Loader from "../../../../containers/Layout/components/Loader";
import {
  deleteConfirmation,
  recordDeleted,
  recordIsSafe,
  recordUpdated,
  saveConfirmation,
  saveRecord,
  updateConfirmation,
} from "../../../../containers/Layout/components/messages";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { businessRateChartShema } from "../../../../containers/schema/fireBrigadeSystem/businessRateChart";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const router = useRouter();
  const userToken = useGetToken();

  const language = useSelector((state) => state?.labels.language);

  const {
    register,
    control,
    handleSubmit,
    watch,
    methods,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(businessRateChartShema(language)),
    mode: "onChange",
  });

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [companyType, setCompanyType] = useState([]);
  const [typeOfBusiness, setTypeOfBusiness] = useState([]);

  const [typeOfBusinessId, setTypeOfBusinessId] = useState();

  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const [loadderState, setLoadderState] = useState(false);

  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const getData = () => {
    setLoadderState(true);
    axios
      .get(`${urls.FbsURL}/master/businessRateCharge/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          let response = res?.data?.businessRateCharge;
          console.log("response123", response);
          let _res = response.map((r, i) => {
            return {
              id: r?.id,
              srNo: i + 1,
              capacityFrom: r?.capacityFrom,
              capacityTo: r?.capacityTo,
              rate: r.rate,
              renewRatePercentage: r?.renewRatePercentage,
              companyType: r?.companyType,
              companyTypeEng: r?.companyType
                ? companyType?.find((obj) => obj?.id === r.companyType)
                    ?.typeOfCompany
                : "--",
              companyTypeMr: r?.companyType
                ? companyType?.find((obj) => obj?.id === r.companyType)
                    ?.typeOfCompanyMr
                : "--",

              typeOfBusinessId: r?.typeOfBusinessId,

              typeOfBusinessEng: r?.typeOfBusinessId
                ? typeOfBusiness?.find((obj) => obj?.id === r.typeOfBusinessId)
                    ?.typeOfBusiness
                : "--",

              typeOfBusinessMr: r?.typeOfBusinessId
                ? typeOfBusiness?.find((obj) => obj?.id === r.typeOfBusinessId)
                    ?.typeOfBusinessMr
                : "--",

              activeFlag: r?.activeFlag,
              status: r?.activeFlag === "Y" ? "Active" : "Inactive",
            };
          });
          setDataSource(_res);
          setLoadderState(false);
        }
      })
      .catch((error) => {
        setLoadderState(false);

        callCatchMethod(error, language);
      });
  };

  // Get companyType
  const getCompanyType = () => {
    setLoadderState(true);

    axios
      .get(`${urls.FbsURL}/master/typeOfCompany/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setLoadderState(false);

        setCompanyType(res.data.typeOfCompany);
        console.log("res.data", res.data);
      })
      .catch((error) => {
        // 5- false
        setLoadderState(false);

        callCatchMethod(error, language);
      });
  };

  // Get companyType
  const getTypeOfBusiness = () => {
    setLoadderState(true);
    axios
      .get(`${urls.FbsURL}/typeOfBusinessMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setLoadderState(false);
        setTypeOfBusiness(res.data.typeOfBusiness);
        console.log("bbbbbbbbb", res.data);
      })
      .catch((error) => {
        // 5- false
        setLoadderState(false);

        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    getCompanyType();
    getTypeOfBusiness();
  }, []);

  useEffect(() => {
    getData();
  }, [companyType, typeOfBusiness]);

  // // OnSubmit Form
  const onSubmitForm = (fromData) => {
    sweetAlert(
      fromData.id ? updateConfirmation(language) : saveConfirmation(language)
    )
      .then((ok) => {
        console.log("Hii", ok);
        if (ok) {
          console.log("hello");
          if (btnSaveText === "Save") {
            const tempData = axios
              .post(`${urls.FbsURL}/master/businessRateCharge/save`, fromData, {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              })
              .then((res) => {
                if (res.status == 200 || res.status == 201) {
                  sweetAlert(saveRecord(language));
                  setButtonInputState(false);
                  setIsOpenCollapse(false);
                  setEditButtonInputState(false);
                  setDeleteButtonState(false);
                  setFetchData(tempData);
                  getData();
                  setSlideChecked(false);
                }
              });
          } else if (btnSaveText === "Update") {
            const tempData = axios
              .post(`${urls.FbsURL}/master/businessRateCharge/save`, fromData, {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              })
              .then((res) => {
                if (res.status == 200 || res.status == 201) {
                  getData();
                  sweetAlert(recordUpdated(language));
                  setButtonInputState(false);
                  setIsOpenCollapse(false);
                  setEditButtonInputState(false);
                  setDeleteButtonState(false);
                  setFetchData(tempData);
                  setSlideChecked(false);
                }
              })
              .catch((error) => {
                callCatchMethod(error, language);
              });
          }
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // if (btnSaveText === "Save") {
  //   const tempData = axios
  //     .post(`${urls.FbsURL}/master/businessRateCharge/save`, _body)
  //     .then((res) => {
  //       if (res.status == 200) {
  //         sweetAlert("Saved!", "Record Saved successfully !", "success");

  //         setButtonInputState(false);
  //         setIsOpenCollapse(false);
  //         setFetchData(tempData);
  //         setEditButtonInputState(false);
  //         setDeleteButtonState(false);
  //       }
  //     });
  // }
  // // Update Data Based On ID
  // else if (btnSaveText === "update") {
  //   console.log("update data", _body);
  //   // const tempData = axios
  //   axios.post(`${urls.FbsURL}/master/businessRateCharge/save`, _body).then((res) => {
  //     console.log("res", res);
  //     if (res.status == 200) {
  //       fromData.id
  //         ? sweetAlert("Updated!", "Record Updated successfully !", "success")
  //         : sweetAlert("Saved!", "Record Saved successfully !", "success");
  //       getType();

  //       setIsOpenCollapse(false);
  //     }
  //   });
  // }

  // // Delete By ID
  // const deleteById = async (value) => {
  //   swal({
  //     title: "Delete ?",
  //     text: "Are you sure you want to delete this Record ? ",
  //     icon: "warning",
  //     buttons: true,
  //     dangerMode: true,
  //   }).then((willDelete) => {
  //     if (willDelete) {
  //       // await
  //       axios
  //         .delete(
  //           `${urls.FbsURL}/master/businessRateCharge/save`
  //         )
  //         .then((res) => {
  //           if (res.status == 226) {
  //             swal("Record is Successfully Deleted!", {
  //               icon: "success",
  //             });
  //             getData();
  //             setButtonInputState(false);
  //           } else {
  //             swal("Record is Safe");
  //           }
  //         });
  //     }
  //   });
  // };

  // Delete Record
  const deleteById = async (value) => {
    const finalBody = {
      // activeFlag: "N",
      id: value,
    };
    console.log("finalBody", finalBody);
    sweetAlert(deleteConfirmation(language)).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `${urls.FbsURL}/master/businessRateCharge/businessRateChargeMaster/${value}`,
            finalBody,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          .then((res) => {
            if (res.status == 226 || res.status == 200) {
              getData();
              sweetAlert(recordDeleted(language));
              // getType();
              setButtonInputState(false);
            }
          })
          .catch((error) => {
            callCatchMethod(error, language);
          });
      } else if (willDelete == null || willDelete == false) {
        console.log("willDelete", willDelete);
        sweetAlert(recordIsSafe(language));
      }
    });
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
    capacityFrom: "",
    capacityTo: "",
    rate: "",
    renewRatePercentage: "",
    companyType: "",
    typeOfBusinessId: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    capacityFrom: "",
    capacityTo: "",
    rate: "",
    renewRatePercentage: "",
    companyType: "",
    typeOfBusinessId: "",
  };

  const columns = [
    {
      field: language == "en" ? "typeOfBusinessEng" : "typeOfBusinessMr",
      // field: "typeOfBusinessId",
      headerName: <FormattedLabel id="typeOfBusinessId" />,
      flex: 1.9,
    },
    {
      field: "capacityFrom",
      headerName: <FormattedLabel id="capacityFrom" />,
      flex: 0.7,
    },
    {
      field: "capacityTo",
      headerName: <FormattedLabel id="capacityTo" />,
      flex: 0.7,
    },
    {
      field: "rate",
      headerName: <FormattedLabel id="rate" />,
      flex: 1,
    },
    {
      field: "renewRatePercentage",
      headerName: <FormattedLabel id="renewRatePercentage" />,
      flex: 1,
    },
    {
      field: language == "en" ? "companyTypeEng" : "companyTypeMr",
      headerName: <FormattedLabel id="companyType" />,
      flex: 1.3,
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
              className={styles.masterEditBtn}
              disabled={editButtonInputState}
              onClick={() => {
                setIsOpenCollapse(false),
                  setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                setEditButtonInputState(true);
                setDeleteButtonState(true);
                reset(params.row);
              }}
            >
              <EditIcon style={{ color: "#556CD6" }} />
            </IconButton>
            <IconButton
              className={styles.masterDeleteBtn}
              disabled={editButtonInputState}
              // onClick={() => {
              //   setBtnSaveText("Update"),
              //     setID(params.row.id),
              //     //   setIsOpenCollapse(true),
              //     setSlideChecked(true);
              //   setButtonInputState(true);
              //   console.log("params.row: ", params.row);
              //   reset(params.row);
              // }}
              onClick={() => deleteById(params.id)}
            >
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  // Row

  return (
    <>
      {isOpenCollapse && (
        <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
          <div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Box
                  style={{
                    margin: "4%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    paddingBottom: "20%",
                  }}
                >
                  <Paper
                    sx={{
                      margin: 1,
                      padding: 2,
                      backgroundColor: "#F5F5F5",
                    }}
                    elevation={5}
                  >
                    <Box className={styles.tableHead}>
                      <Box className={styles.feildHead}>
                        <FormattedLabel id="businessRateChart" />
                      </Box>
                    </Box>
                    <br />
                    <br />

                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                      spacing={4}
                    >
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{ width: "100%" }}
                          variant="standard"
                          error={!!errors?.typeOfBusinessId}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="typeOfBusinessId" required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                  console.log(
                                    "value.target.value",
                                    value.target.value
                                  );
                                  setTypeOfBusinessId(value.target.value);
                                }}
                                label={<FormattedLabel id="typeOfBusinessId" />}
                              >
                                {typeOfBusiness &&
                                  typeOfBusiness.map((typeOfCompany, index) => (
                                    <MenuItem
                                      key={index}
                                      value={typeOfCompany?.id}
                                    >
                                      {language == "en"
                                        ? typeOfCompany?.typeOfBusiness
                                        : typeOfCompany?.typeOfBusinessMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="typeOfBusinessId"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.typeOfBusinessId
                              ? errors?.typeOfBusinessId?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {typeOfBusinessId == 12 && (
                        <Grid item xs={4} className={styles.feildres}>
                          <FormControl
                            sx={{ width: "100%" }}
                            variant="standard"
                            error={!!errors?.companyType}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="companyType" required />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label={
                                    <FormattedLabel id="companyType" required />
                                  }
                                >
                                  {companyType &&
                                    companyType.map((typeOfCompany, index) => (
                                      <MenuItem
                                        key={index}
                                        value={typeOfCompany?.id}
                                      >
                                        {language == "en"
                                          ? typeOfCompany?.typeOfCompany
                                          : typeOfCompany?.typeOfCompanyMr}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="companyType"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.companyType
                                ? errors?.companyType?.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      )}

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "100%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="capacityFrom" required />}
                          variant="standard"
                          {...register("capacityFrom")}
                          error={!!errors.capacityFrom}
                          helperText={
                            errors?.capacityFrom
                              ? errors.capacityFrom.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "100%" }}
                          label={<FormattedLabel id="capacityTo" required />}
                          variant="standard"
                          {...register("capacityTo")}
                          error={!!errors.capacityTo}
                          helperText={
                            errors?.capacityTo
                              ? errors.capacityTo.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "100%" }}
                          label={<FormattedLabel id="rate" required />}
                          variant="standard"
                          {...register("rate")}
                          error={!!errors.rate}
                          helperText={errors?.rate ? errors.rate.message : null}
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          sx={{ width: "100%" }}
                          label={
                            <FormattedLabel id="renewRatePercentage" required />
                          }
                          variant="standard"
                          {...register("renewRatePercentage")}
                          error={!!errors.renewRatePercentage}
                          helperText={
                            errors?.renewRatePercentage
                              ? errors.renewRatePercentage.message
                              : null
                          }
                        />
                      </Grid>
                      {typeOfBusinessId == 12 ? (
                        <></>
                      ) : (
                        <>
                          <Grid item xs={4} className={styles.feildres}></Grid>
                        </>
                      )}
                    </Grid>
                    <br />
                    <br />
                    <br />
                    <Grid container className={styles.feildres} spacing={2}>
                      <Grid item>
                        <Button
                          type="submit"
                          size="small"
                          variant="outlined"
                          className={styles.button}
                          endIcon={<SaveIcon />}
                        >
                          {btnSaveText == "Update" ? (
                            <FormattedLabel id="update" />
                          ) : (
                            <FormattedLabel id="save" />
                          )}
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          size="small"
                          variant="outlined"
                          className={styles.button}
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                        >
                          {<FormattedLabel id="clear" />}
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          size="small"
                          variant="outlined"
                          className={styles.button}
                          endIcon={<ExitToAppIcon />}
                          onClick={() =>
                            router.push({
                              pathname:
                                "/FireBrigadeSystem/masters/businessRateChart",
                            })
                          }
                        >
                          {<FormattedLabel id="exit" />}
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
              </form>
            </FormProvider>
          </div>
        </Slide>
      )}

      {loadderState && <Loader />}
      <BreadcrumbComponent />

      <Box style={{ display: "flex" }}>
        <Box className={styles.tableHead}>
          <Box className={styles.h1Tag}>
            {<FormattedLabel id="businessRateChart" />}
          </Box>
        </Box>
        <Box>
          <Button
            variant="contained"
            type="primary"
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
            className={styles.adbtn}
            sx={{
              borderRadius: 100,

              padding: 2,
              marginLeft: 1,
              textAlign: "center",
              border: "2px solid #3498DB",
            }}
          >
            <AddIcon />
          </Button>
        </Box>
      </Box>

      <Box style={{ height: "100%", width: "100%" }}>
        <DataGrid
          // disableColumnFilter
          // disableColumnSelector
          // disableExport
          // disableToolbarButton
          // disableDensitySelector
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              // quickFilterProps: { debounceMs: 500 },
              // printOptions: { disableToolbarButton: true },
              // disableExport: true,
              // disableToolbarButton: true,
              // csvOptions: { disableToolbarButton: true },
            },
          }}
          components={{ Toolbar: GridToolbar }}
          autoHeight
          density="compact"
          sx={{
            backgroundColor: "white",
            // paddingLeft: "2%",
            // paddingRight: "2%",
            boxShadow: 2,
            border: 1,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {
              transform: "scale(1.1)",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#E1FDFF",
            },
            "& .MuiDataGrid-columnHeadersInner": {
              // backgroundColor: "#87E9F7",
              backgroundColor: "#2E86C1",
              color: "white",
            },
          }}
          rows={dataSource}
          columns={columns}
          pageSize={7}
          rowsPerPageOptions={[7]}
          //checkboxSelection
        />
      </Box>
    </>
  );
};

export default Index;
