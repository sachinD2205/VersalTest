import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  Autocomplete,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/fireBrigadeSystem/documentAndBusinessType";
import { Box, Grid, Typography } from "@mui/material";
import { GridToolbar } from "@mui/x-data-grid";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";
import { useSelector } from "react-redux";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Loader from "../../../../containers/Layout/components/Loader";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import {
  deleteConfirmation,
  saveConfirmation,
  recordDeleted,
  recordIsSafe,
  saveRecord,
  recordUpdated,
  updateConfirmation,
} from "../../../../containers/Layout/components/messages";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const router = useRouter();
  const userToken = useGetToken();

  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
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
  const [companyType, setCompanyType] = useState();
  const [typeOfBusiness, setTypeOfBusiness] = useState();
  const language = useSelector((state) => state?.labels.language);

  const [businessTypes, setBusinessTypes] = useState([]);
  const [documents, setDocuments] = useState([]);

  const [loadingDept, setLoadingDept] = useState(false);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const [selectedValuesOfDepartments, setSelectedValuesOfDepartments] =
    useState([]);

  // 2- Add Loader
  const [loadderState, setLoadderState] = useState(false);

  // 3- Error Handling
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

  const handleSelect = (evt, value) => {
    console.log(":values", value);
    const selectedIds = value.map((val) => val?.id);

    // setSelectedValuesOfDepartments(selectedIds);
    setSelectedValuesOfDepartments(value);
  };

  // Get Table - Data
  const getBusinessTypes = () => {
    axios
      .get(`${urls.FbsURL}/typeOfBusinessMaster/getTypeOfBusinessMasterData`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setBusinessTypes(res?.data);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getDocuments = () => {
    setLoadingDept(true);
    axios
      .get(`${urls.FbsURL}/master/documentMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setLoadingDept(false);

        console.log("getDocument", res?.data?.documentMaster);
        setDocuments(
          res?.data?.documentMaster?.filter((d) => d.application == 8)
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    getBusinessTypes();
    getDocuments();
  }, []);

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getCompanyType();
    getTypeOfBusiness();
  }, []);

  useEffect(() => {
    getData();
  }, [companyType, typeOfBusiness]);

  // const getData = (_pageSize = 10, _pageNo = 0) => {
  const getData = () => {
    setLoadderState(true);

    axios
      .get(
        `${urls.FbsURL}/businessAndServiceMapping/getAll`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
        //  {
        //   params: {
        //     pageSize: _pageSize,
        //     pageNo: _pageNo,
        //   },
        // }
      )
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          setLoadderState(false);

          console.log(
            "0990999",
            res?.data?.typeOfBusinessAndServiceWiseChecklistMappingList
          );
          let response =
            res?.data?.typeOfBusinessAndServiceWiseChecklistMappingList;
          let _res = response?.map((r, i) => {
            return {
              id: r?.id,
              srNo: i + 1,

              serviceWiseChecklist: r?.serviceWiseChecklist,

              documentKey: r?.documentKey,

              // serviceArray: r?.serviceWiseChecklist.split(","),

              // documentName: documents?.find(
              //   (obj) =>  obj.id === r.serviceWiseChecklist
              // )?.documentChecklistEn,

              documentName: r?.serviceWiseChecklist
                ?.split(",") // Split the string into an array of IDs
                .map((value) => {
                  documents.find((f) => f.id === value)?.documentChecklistEn;
                  // const document = documents.find((f) => {
                  //   console.log("result", f.id, value);
                  // }); // Use strict equality (===) here
                  // return document ? document.documentChecklistEn : "--";
                }),

              //    caseMainType: caseTypes?.find((obj) => obj.id === r.caseMainType)
              // ?.caseMainType,

              // documentNameCol: r?.documentKey
              //   ? documents?.find((d) => d.id == r?.serviceWiseChecklist)
              //       ?.documentChecklistEn
              //   : "--",

              typeOfBusinessEng: r.documentKey
                ? typeOfBusiness?.find((obj) => obj?.id == r.documentKey)
                    ?.typeOfBusiness
                : "-",

              typeOfBusinessMr: r.documentKey
                ? typeOfBusiness?.find((obj) => obj?.id == r.documentKey)
                    ?.typeOfBusinessMr
                : "-",

              activeFlag: r?.activeFlag,
              status: r?.activeFlag === "Y" ? "Active" : "Inactive",
            };
          });
          console.log("_res", _res);
          setDataSource(_res);
        }
        setLoadderState(false);
      })
      .catch((error) => {
        setLoadderState(false);
        callCatchMethod(error, language);
      });
  };

  // Get companyType
  const getCompanyType = () => {
    axios
      .get(`${urls.FbsURL}/master/typeOfCompany/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setCompanyType(res.data.typeOfCompany);
        console.log("res.data", res.data);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // Get companyType
  const getTypeOfBusiness = () => {
    axios
      .get(`${urls.FbsURL}/typeOfBusinessMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setTypeOfBusiness(res.data.typeOfBusiness);
        console.log("bbbbbbbbb", res.data);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  console.log(
    "selectedValuesOfDepartments",
    selectedValuesOfDepartments.toString()
  );

  // // OnSubmit Form
  // const onSubmitForm = (fromData) => {
  //   console.log("Form Data ", fromData);

  //   const serviceWiseChecklistIds = selectedValuesOfDepartments.toString();

  // let finalBody = {
  //   id: fromData.id,
  //   activeFlag: fromData.activeFlag,
  //   ...fromData,
  //   serviceWiseChecklist: serviceWiseChecklistIds,
  // };

  //   console.log("finalBody", finalBody);
  //   sweetAlert(
  //     fromData.id ? updateConfirmation(language) : saveConfirmation(language)
  //   )
  //     .then((ok) => {
  //       if (ok) {
  //         const tempData = axios
  //           .post(`${urls.FbsURL}/businessAndServiceMapping/save`, finalBody)
  //           .then((res) => {
  //             if (res.status == 201 || res.status == 200) {
  //               fromData.id
  //                 ? sweetAlert(
  //                     "Update!",
  //                     "Record Updated successfully !",
  //                     "success"
  //                   )
  //                 : sweetAlert(
  //                     "Saved!",
  //                     "Record Saved successfully !",
  //                     "success"
  //                   );
  //               setButtonInputState(false);
  //               setIsOpenCollapse(false);
  //               setFetchData(tempData);
  //               setEditButtonInputState(false);
  //               setDeleteButtonState(false);
  //             }
  //           });
  //       }
  //     })
  //     .catch((error) => {
  //       callCatchMethod(error, language);
  //     });
  // };

  const onSubmitForm = (fromData) => {
    // const serviceWiseChecklistIds = selectedValuesOfDepartments?.toString();
    const serviceWiseChecklistIds = selectedValuesOfDepartments
      ?.map((d) => d?.id)
      ?.toString();

    const finalBody = {
      id: fromData.id,
      activeFlag: fromData.activeFlag,
      ...fromData,
      serviceWiseChecklist: serviceWiseChecklistIds,
    };
    sweetAlert(
      fromData.id ? updateConfirmation(language) : saveConfirmation(language)
    )
      .then((ok) => {
        console.log("Hii", ok);
        console.log("finalBody", finalBody);
        if (ok) {
          console.log("hello");
          if (btnSaveText === "Save") {
            const tempData = axios
              .post(
                `${urls.FbsURL}/businessAndServiceMapping/save`,
                finalBody,
                {
                  headers: {
                    Authorization: `Bearer ${userToken}`,
                  },
                }
              )
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
            console.log("finalBody", finalBody);
            const tempData = axios
              .post(
                `${urls.FbsURL}/businessAndServiceMapping/save`,
                finalBody,
                {
                  headers: {
                    Authorization: `Bearer ${userToken}`,
                  },
                }
              )
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
            `${urls.FbsURL}/businessAndServiceMapping/delete/${value}`,
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
    serviceWiseChecklist: "",
    documentKey: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    serviceWiseChecklist: "",
    documentKey: "",
  };

  const columns = [
    {
      field: language == "en" ? "typeOfBusinessEng" : "typeOfBusinessMr",
      // field: "documentKey",
      headerName: <FormattedLabel id="typeOfBusinessId" />,
      flex: 1,
    },
    {
      field: "serviceWiseChecklist",
      // field: "documentName",
      headerName: <FormattedLabel id="documentName" />,
      flex: 1,
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
                console.log("params.row12", params.row.serviceWiseChecklist);
                setIsOpenCollapse(false),
                  setBtnSaveText("Update"),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true);
                setButtonInputState(true);
                setEditButtonInputState(true);
                setDeleteButtonState(true);
                reset(params.row);
                let _aa = params.row.serviceWiseChecklist
                  ?.split(",")
                  ?.map((data, index) => {
                    let kk = documents?.find((obj) => obj?.id == data);
                    return kk;
                  });
                console.log("_aa_aa", _aa);
                setSelectedValuesOfDepartments(_aa ?? []);
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
      {/* 7- add loader */}
      {loadderState && <Loader />}

      {/*8-  Breadcrum  */}
      <BreadcrumbComponent />
      {isOpenCollapse && (
        <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
          <div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    paddingBottom: "20%",
                  }}
                >
                  <Paper
                    sx={{
                      padding: 2,
                      backgroundColor: "#F5F5F5",
                    }}
                    elevation={5}
                  >
                    <Box className={styles.tableHead}>
                      <Box className={styles.feildHead}>
                        <FormattedLabel id="documentAndBusinessTypeMapping" />
                      </Box>
                    </Box>

                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                    >
                      <Grid item xs={8} className={styles.feildres}>
                        <FormControl
                          size="small"
                          sx={{
                            marginTop: 2,
                            width: "100%",
                          }}
                          variant="outlined"
                          error={!!errors?.documentKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="typeOfBusinessId" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{
                                  backgroundColor: "white",
                                }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
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
                            name="documentKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.documentKey
                              ? errors?.documentKey?.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
                    </Grid>
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      className={styles.feildres}
                    >
                      <Grid item xs={12} className={styles.feildres}>
                        {loadingDept ? (
                          <>
                            <FormControl fullWidth size="small">
                              <InputLabel>
                                <FormattedLabel id="documentName" />
                              </InputLabel>
                              <Select
                                autoFocus
                                variant="standard"
                                multiple
                                // fullWidth
                              ></Select>
                            </FormControl>
                            <CircularProgress size={15} color="error" />
                          </>
                        ) : (
                          <Autocomplete
                            size="small"
                            fullWidth
                            multiple
                            value={selectedValuesOfDepartments}
                            id="checkboxes-tags-demo"
                            options={documents}
                            disableCloseOnSelect
                            onChange={handleSelect}
                            getOptionLabel={
                              (option) =>
                                language === "en"
                                  ? option?.documentChecklistEn
                                  : // ?.split(" ")
                                    // .map((word) => word.charAt(0))
                                    // .join("")
                                    // .toUpperCase()
                                    option?.documentChecklistMr
                              // ?.split(" ")
                              // .map((word) => word.charAt(0))
                              // .join(" ")
                            }
                            renderOption={(props, option, { selected }) => (
                              <li {...props}>
                                <Checkbox
                                  icon={icon}
                                  checkedIcon={checkedIcon}
                                  checked={selected}
                                  // checked={
                                  //   selected ||
                                  //   selectedValuesOfDepartments.includes(option)
                                  // }
                                />
                                {language === "en"
                                  ? option.documentChecklistEn
                                  : option.documentChecklistMr}
                              </li>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                sx={{
                                  margin: 0,
                                  width: "100%",
                                  backgroundColor: "white",
                                }}
                                variant="outlined"
                                label={<FormattedLabel id="documentName" />}
                              />
                            )}
                          />
                        )}
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}></Grid>
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
                                "/FireBrigadeSystem/masters/ServiceWiseChecklistAndBusinessTypeMapping",
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

      <Box style={{ display: "flex" }}>
        <Box className={styles.tableHead}>
          <Box className={styles.h1Tag}>
            {<FormattedLabel id="documentAndBusinessTypeMapping" />}
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
          pageSize={10}
          rowsPerPageOptions={[10]}
          //checkboxSelection
        />
      </Box>
    </>
  );
};

export default Index;
