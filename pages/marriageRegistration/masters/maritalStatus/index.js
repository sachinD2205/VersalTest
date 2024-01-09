import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import { Box, Button, CircularProgress, Paper, Slide } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import { useSelector } from "react-redux";
// import swal from "sweetalert";
import sweetAlert from "sweetalert";

import urls from "../../../../URLS/urls";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import Transliteration from "../../../../components/marriageRegistration/transliteration";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/marriageRegistration/maritalStatus";
import styles from "../maritalStatus/view.module.css";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// func
const Index = () => {
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
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    watch,
    handleSubmit,
    formState: { errors },
  } = methods;

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [loaderState, setLoaderState] = useState(false);
  const language = useSelector((state) => state?.labels.language);
  let user = useSelector((state) => state.user.user);
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const getMaritalStatusDetails = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc",
  ) => {
    setLoaderState(true);
    axios
      .get(
        `${urls.MR}/master/maritalstatus/getAll`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
        {
          params: {
            pageSize: _pageSize,
            pageNo: _pageNo,
            sortBy: _sortBy,
            sortDir: _sortDir,
          },
        },
      )
      .then((res) => {
        setLoaderState(false);
        let _res = res.data.maritalStatus.map((r, i) => ({
          id: r.id,
          srNo: i + 1 + _pageNo * _pageSize,
          statusDetails: r.statusDetails,
          statusDetailsMar: r.statusDetailsMar,
          //serialNo: r.serialNo,
          activeFlag: r.activeFlag,
        }));
        setDataSource([..._res]);
        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    //   } else {
    //     toast.error('Filed Load Data !! Please Try Again !', {
    //       position: toast.POSITION.TOP_RIGHT,
    //     })
    //   }
    //   setHawkerTypeData({
    //     rows: _res,
    //     totalRows: res.data.totalElements,
    //     rowsPerPageOptions: [10, 20, 50, 100],
    //     pageSize: res.data.pageSize,
    //     page: res.data.pageNo,
    //   })
    // })
    // .catch((err) => {
    //   console.log('err', err)
    //   toast.error('Filed Load Data !! Please Try Again !', {})
    // })
  };

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getMaritalStatusDetails();
  }, [fetchData]);
  console.log("marr", data);
  // OnSubmit Form
  const onSubmitForm = (fromData) => {
    // Save - DB
    if (btnSaveText === "Save") {
      setLoaderState(true);
      axios
        .post(
          `${urls.MR}/master/maritalstatus/saveMaritalStatus`,
          fromData,

          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((res) => {
          if (res.status == 201 || res.status == 200) {
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
            // swal("Saved!", "Record Saved successfully !", "success");
            getMaritalStatusDetails();
            setLoaderState(false);
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setEditButtonInputState(false);
            setDeleteButtonState(false);
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    } else if (btnSaveText === "Update") {
      setLoaderState(true);
      const tempData = axios
        .post(`${urls.MR}/master/maritalstatus/saveMaritalStatus`, fromData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res.status == 201 || res.status == 200) {
            setLoaderState(false);
            getMaritalStatusDetails();
            setButtonInputState(false);
            setIsOpenCollapse(false);
            setFetchData(tempData);
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  // Delete By ID
  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", _activeFlag);
    if (_activeFlag === "N") {
      const textAlert =
        language == "en"
          ? "Are you sure you want to inactivate this Record ?"
          : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता?";
      const title = language == "en" ? "Inactivate?" : "निष्क्रिय करा";

      sweetAlert({
        title: title,
        text: textAlert,
        icon: "warning",
        buttons: true,
        dangerMode: true,
        // swal({
        //   title: "Inactivate?",
        //   text: "Are you sure you want to inactivate this Record ? ",
        //   icon: "warning",
        //   buttons: true,
        //   dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          setLoaderState(true);
          axios
            .post(`${urls.MR}/master/maritalstatus/saveMaritalStatus`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              setLoaderState(false);
              console.log("delet res", res);
              if (res.status == 201) {
                language == "en"
                  ? sweetAlert({
                      title: "Deleted!",
                      text: "The record is Successfully Deleted!",
                      icon: "success",
                      button: "Ok",
                    })
                  : sweetAlert({
                      title: "हटवले!",
                      text: "रेकॉर्ड यशस्वीरित्या हटवला गेला आहे!",
                      icon: "success",
                      button: "Ok",
                    });

                // swal("Record is Successfully Deleted!", {
                //   icon: "success",
                // });
                getMaritalStatusDetails();
                // setButtonInputState(false)
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            });
        } else if (willDelete == null) {
          language == "en"
            ? sweetAlert({
                title: "Cancel!",
                text: "Record is Successfully Cancel!!",
                icon: "success",
                button: "Ok",
              })
            : sweetAlert({
                title: "रद्द केले!",
                text: "रेकॉर्ड यशस्वीरित्या रद्द केले!",
                icon: "success",
                button: "ओके",
              });
        }
      });
    } else {
      const textAlert =
        language == "en"
          ? "Are you sure you want to activate this Record ? "
          : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता?";
      const title = language == "en" ? "Activate?" : "सक्रिय करायचे?";

      sweetAlert({
        title: title,
        text: textAlert,
        icon: "warning",
        buttons: true,
        dangerMode: true,

        // swal({
        //   title: "Activate?",
        //   text: "Are you sure you want to activate this Record ? ",
        //   icon: "warning",
        //   buttons: true,
        //   dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          setLoaderState(true);
          axios
            .post(`${urls.MR}/master/maritalstatus/saveMaritalStatus`, body, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 201 || res.status == 201) {
                language == "en"
                  ? sweetAlert({
                      title: "Activate!",
                      text: "The record is Successfully Activated!",
                      icon: "success",
                      button: "Ok",
                    })
                  : sweetAlert({
                      title: "सक्रिय केला!",
                      text: "रेकॉर्ड यशस्वीरित्या सक्रिय केला गेला आहे!",
                      icon: "success",
                      button: "Ok",
                    });

                setLoaderState(false);
                getMaritalStatusDetails();
                // setButtonInputState(false)
              }
            })
            .catch((error) => {
              callCatchMethod(error, language);
            });
        } else if (willDelete == null) {
          language == "en"
            ? sweetAlert({
                title: "Cancel!",
                text: "Record is Successfully Cancel!!",
                icon: "success",
                button: "Ok",
              })
            : sweetAlert({
                title: "रद्द केले!",
                text: "रेकॉर्ड यशस्वीरित्या रद्द केले!",
                icon: "success",
                button: "ओके",
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
    setDeleteButtonState(false);
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
    statusDetails: "",
    statusDetailsMar: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    statusDetails: "",
    statusDetailsMar: "",
    id: null,
  };

  // define colums table
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
    },
    // {
    //   field: 'serialNo',
    //   headerName: 'serialNo',
    //   flex: 1,
    // },

    {
      field: "statusDetails",
      headerName: <FormattedLabel id="statusDetailsEng" />,
      //type: "number",
      flex: 1,
    },

    {
      field: "statusDetailsMar",
      headerName: <FormattedLabel id="statusDetailsMr" />,
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
              <EditIcon color="primary" />
            </IconButton>
            <IconButton
              disabled={deleteButtonInputState}
              onClick={() => deleteById(params.row.id, "N")}
            >
              {/* {params.row.activeFlag == "Y" ? (
              <ToggleOnIcon
                style={{ color: "green", fontSize: 30 }}
                onClick={() => deleteById(params.id, "N")}
              />
            ) : (
              <ToggleOffIcon
                style={{ color: "red", fontSize: 30 }}
                onClick={() => deleteById(params.id, "Y")}
              />
            )} */}
              <DeleteIcon color="error" />
            </IconButton>
          </>
        );
      },
    },
  ];

  // View
  return (
    <>
      {/* <BasicLayout> */}
      {loaderState ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh", // Adjust itasper requirement.
          }}
        >
          <Paper
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "white",
              borderRadius: "50%",
              padding: 8,
            }}
            elevation={8}
          >
            <CircularProgress color="success" />
          </Paper>
        </div>
      ) : (
        <>
          <Box>
            <BreadcrumbComponent />
          </Box>
          <Paper
            sx={{
              marginLeft: 1,
              marginRight: 1,
              marginTop: 2,
              marginBottom: 2,
              padding: 1,
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
            autoHeight
            // sx={{
            //   marginLeft: 1,
            //   marginRight: 1,
            //   marginTop: 1,
            //   marginBottom: 1,
            //   padding: 1,
            // }}
          >
            <div
              className={styles.details}
              style={
                {
                  // marginTop: "20vh",
                }
              }
            >
              <div className={styles.h1Tag}>
                <h2
                  style={{
                    color: "white",
                    // paddingBottom: "30vh",
                  }}
                >
                  {/* {<FormattedLabel id="boardDetail" />} */}
                  {language == "en" ? "Marital Status" : "वैवाहिक स्थिती"}
                </h2>
              </div>
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
                      <div className={styles.small}>
                        <div className={styles.row}>
                          {/* <div>
                          <TextField
                            autoFocus
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label="serialNo *"
                            variant="standard"
                            {...register('serialNo')}
                            error={!!errors.serialNo}
                            helperText={
                              errors?.serialNo ? errors.serialNo.message : null
                            }
                          />
                        </div> */}

                          <div>
                            <Transliteration
                              style={{
                                backgroundColor: "white",
                                margin: "250px",
                              }}
                              _key={"statusDetails"}
                              labelName={"statusDetails"}
                              fieldName={"statusDetails"}
                              updateFieldName={"statusDetailsMar"}
                              sourceLang={"eng"}
                              targetLang={"mar"}
                              targetError={"statusDetailsMar"}
                              width={250}
                              // disabled={disabled}
                              // label="Status Details"
                              label={
                                <FormattedLabel id="statusDetails" required />
                              }
                              error={!!errors.statusDetails}
                              helperText={
                                errors?.statusDetails
                                  ? errors.statusDetails.message
                                  : null
                              }
                            />
                            {/* <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="Status Details "
                          variant="standard"
                          // value={dataInForm && dataInForm.remark}
                          {...register('statusDetails')}
                          error={!!errors.statusDetails}
                          helperText={
                            errors?.statusDetails
                              ? errors.statusDetails.message
                              : null
                          }
                        /> */}
                          </div>

                          <div>
                            <Transliteration
                              style={{
                                backgroundColor: "white",
                                margin: "250px",
                              }}
                              _key={"statusDetailsMar"}
                              labelName={"statusDetailsMar"}
                              fieldName={"statusDetailsMar"}
                              updateFieldName={"statusDetails"}
                              sourceLang={"mar"}
                              targetLang={"eng"}
                              targetError={"statusDetails"}
                              width={250}
                              // disabled={disabled}
                              // label="स्थिती तपशील "
                              label={
                                <FormattedLabel id="statusDetailsMr" required />
                              }
                              error={!!errors.statusDetailsMar}
                              helperText={
                                errors?.statusDetailsMar
                                  ? errors.statusDetailsMar.message
                                  : null
                              }
                            />
                            {/* <TextField
                          sx={{ width: 250 }}
                          id="standard-basic"
                          label="स्थिती तपशील "
                          variant="standard"
                          {...register('statusDetailsMar')}
                          error={!!errors.statusDetailsMar}
                          helperText={
                            errors?.statusDetailsMar
                              ? errors.statusDetailsMar.message
                              : null
                          }
                        /> */}
                          </div>
                        </div>

                        <div className={styles.btn}>
                          <div className={styles.btn1}>
                            <Button
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
                            </Button>{" "}
                          </div>
                          <div className={styles.btn1}>
                            <Button
                              variant="contained"
                              color="primary"
                              endIcon={<ClearIcon />}
                              onClick={() => cancellButton()}
                            >
                              <FormattedLabel id="clear" />
                            </Button>
                          </div>
                          <div className={styles.btn1}>
                            <Button
                              variant="contained"
                              color="error"
                              endIcon={<ExitToAppIcon />}
                              onClick={() => exitButton()}
                            >
                              <FormattedLabel id="exit" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </FormProvider>
                </div>
              </Slide>
            )}
            <div className={styles.addbtn} style={{ marginTop: "25px" }}>
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
                  setDeleteButtonState(true);
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
              rowCount={data.totalRows}
              rowsPerPageOptions={data.rowsPerPageOptions}
              page={data.page}
              pageSize={data.pageSize}
              rows={dataSource}
              columns={columns}
              onPageChange={(_data) => {
                console.log("222", data.pageSize, _data);
                getMaritalStatusDetails(data.pageSize, _data);
              }}
              onPageSizeChange={(_data) => {
                // console.log("222", _data);
                // updateData("page", 1);
                getMaritalStatusDetails(_data, data.page);
              }}
            />
            {/* <DataGrid
          autoHeight
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginTop: 5,
            marginBottom: 5,
          }}
          rows={dataSource}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          //checkboxSelection
        /> */}
          </Paper>
        </>
      )}
      {/* </BasicLayout> */}
    </>
  );
};

export default Index;
