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
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import Transliteration from "../../../../components/common/linguosol/transliteration";
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
import schema from "../../../../containers/schema/fireBrigadeSystem/employeeShiftMaster";
import styles from "../../../../styles/fireBrigadeSystem/view.module.css";
import Loader from "../../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const methods = useForm({
    defaultValues: {},
    mode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });

  const {
    watch,
    setValue,
    getValues,
    register,
    handleSubmit,
    control,
    unregister,
    reset,
    formState: { errors },
  } = methods;

  const router = useRouter();
  const userToken = useGetToken();

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState([]);
  const [userLst, setUserLst] = useState([]);
  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [id, setID] = useState();
  const [fetchData, setFetchData] = useState(null);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);

  const [demo, setDemo] = useState([]);

  const language = useSelector((state) => state?.labels.language);

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

  // Get Table - Data
  const getData = () => {
    setLoadderState(true);
    axios
      .get(`${urls.FbsURL}/employeeShiftMaster/getEmployeeShiftMasterData`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setLoadderState(false);

        setDataSource(
          res.data.map((r, i) => {
            return {
              id: r.id,
              srNo: i + 1,
              shiftName: r.shiftName,
              shiftNameMr: r.shiftNameMr,
              shiftStartTime: r.shiftStartTime,
              shiftEndTime: r.shiftEndTime,
              shiftStartTimeCol: moment(r.shiftStartTime, "hh:mm a").format(
                "hh:mm A"
              ),
              shiftEndTimeCol: moment(r.shiftEndTime, "hh:mm a").format(
                "hh:mm A"
              ),

              shiftStartTime: moment(r.shiftStartTime, "hh:mm (a|p)m").format(
                "hh:mm (a|p) m"
              ),
              shiftEndTime: moment(r.shiftEndTime, "hh:mm (a|p)m").format(
                "hh:mm (a|p)m"
              ),
              nameOfCFO: r.nameOfCFO,
              nameOfSFO: r.nameOfSFO,

              nameOfCFOCol: `${
                typeof userLst.find((u) => u.id === r.nameOfCFO)
                  ?.firstNameEn === "string"
                  ? userLst.find((u) => u.id === r.nameOfCFO)?.firstNameEn
                  : " - "
              }
              ${
                typeof userLst.find((u) => u.id === r.nameOfCFO)
                  ?.middleNameEn === "string"
                  ? userLst.find((u) => u.id === r.nameOfCFO)?.middleNameEn
                  : " - "
              }
              ${
                typeof userLst.find((u) => u.id === r.nameOfCFO)?.lastNameEn ===
                "string"
                  ? userLst.find((u) => u.id === r.nameOfCFO)?.lastNameEn
                  : " - "
              }`,

              // nameOfCFOCol: userLst.find((u) => u.id === r.nameOfCFO)
              //   ?.firstNameEn,

              // nameOfCFOColMr: userLst.find((u) => u.id === r.nameOfCFO)
              //   ?.firstNameMr,

              nameOfCFOColMr: `${
                typeof userLst.find((u) => u.id === r.nameOfCFO)
                  ?.firstNameMr === "string"
                  ? userLst.find((u) => u.id === r.nameOfCFO)?.firstNameMr
                  : ""
              } ${
                typeof userLst.find((u) => u.id === r.nameOfCFO)
                  ?.middleNameMr === "string"
                  ? userLst.find((u) => u.id === r.nameOfCFO)?.middleNameMr
                  : ""
              } ${
                typeof userLst.find((u) => u.id === r.nameOfCFO)?.lastNameMr ===
                "string"
                  ? userLst.find((u) => u.id === r.nameOfCFO)?.lastNameMr
                  : ""
              }`,

              nameOfSFOCol: `${
                typeof userLst.find((u) => u.id === r.nameOfSFO)
                  ?.firstNameEn === "string"
                  ? userLst.find((u) => u.id === r.nameOfSFO)?.firstNameEn
                  : " - "
              }
            ${
              typeof userLst.find((u) => u.id === r.nameOfSFO)?.middleNameEn ===
              "string"
                ? userLst.find((u) => u.id === r.nameOfSFO)?.middleNameEn
                : " - "
            }
            ${
              typeof userLst.find((u) => u.id === r.nameOfSFO)?.lastNameEn ===
              "string"
                ? userLst.find((u) => u.id === r.nameOfSFO)?.lastNameEn
                : " - "
            }`,

              nameOfSFOColMr: `${
                typeof userLst.find((u) => u.id === r.nameOfSFO)
                  ?.firstNameMr === "string"
                  ? userLst.find((u) => u.id === r.nameOfSFO)?.firstNameMr
                  : ""
              } ${
                typeof userLst.find((u) => u.id === r.nameOfSFO)
                  ?.middleNameMr === "string"
                  ? userLst.find((u) => u.id === r.nameOfSFO)?.middleNameMr
                  : ""
              } ${
                typeof userLst.find((u) => u.id === r.nameOfSFO)?.lastNameMr ===
                "string"
                  ? userLst.find((u) => u.id === r.nameOfSFO)?.lastNameMr
                  : ""
              }`,

              nameOfOtherEmployee: r.nameOfOtherEmployee,
            };
          })
        );
      })
      .catch((error) => {
        setLoadderState(false);
        callCatchMethod(error, language);
      });
  };

  const [des, setDes] = useState();

  // Get desg
  const getDesg = () => {
    axios
      .get(`${urls.CFCURL}/master/designation/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("res.data", res.data?.designation);
        setDes(res?.data?.designation);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getUser = () => {
    axios
      .get(`${urls.CFCURL}/master/user/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("res.dataUser", res?.data?.user);
        setUserLst(res?.data?.user);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    getUser();
    getDesg();
  }, []);

  useEffect(() => {
    getData();
  }, [fetchData, userLst]);

  const onSubmitForm = (fromData) => {
    let newBody = {
      ...fromData,
      id: fromData.id,
      // activeFlag: fromData.activeFlag,
      shiftStartTime: moment(fromData.shiftStartTime).format("HH:mm:ss"),
      shiftEndTime: moment(fromData.shiftEndTime).format("HH:mm:ss"),
    };
    let newBodyUpdate = {
      ...fromData,
      id: fromData.id,
      activeFlag: "Y",
      shiftStartTime: moment(fromData.shiftStartTime).format("HH:mm:ss"),
      shiftEndTime: moment(fromData.shiftEndTime).format("HH:mm:ss"),
    };
    sweetAlert(
      fromData.id ? updateConfirmation(language) : saveConfirmation(language)
    )
      .then((ok) => {
        if (ok) {
          if (btnSaveText === "Save") {
            const tempData = axios
              .post(
                `${urls.FbsURL}/employeeShiftMaster/saveEmployeeShiftMaster`,
                newBody,
                {
                  headers: {
                    Authorization: `Bearer ${userToken}`,
                  },
                }
              )
              .then((res) => {
                if (res.status == 201) {
                  sweetAlert(saveRecord(language));
                  setButtonInputState(false);
                  setIsOpenCollapse(false);
                  setEditButtonInputState(false);
                  setDeleteButtonState(false);
                  setFetchData(tempData);
                  setSlideChecked(false);
                  getData();
                }
              })
              .catch((error) => {
                // 7- Error handling
                callCatchMethod(error, language);
              });
          } else if (btnSaveText === "Update") {
            console.log("upadte", newBodyUpdate);
            const tempData = axios
              .post(
                `${urls.FbsURL}/employeeShiftMaster/saveEmployeeShiftMaster`,
                newBodyUpdate,
                {
                  headers: {
                    Authorization: `Bearer ${userToken}`,
                  },
                }
              )
              .then((res) => {
                if (res.status == 201 || res.status == 200) {
                  sweetAlert(recordUpdated(language));
                  setButtonInputState(false);
                  setIsOpenCollapse(false);
                  setEditButtonInputState(false);
                  setDeleteButtonState(false);
                  setFetchData(tempData);
                  setSlideChecked(false);
                  getData();
                }
              })
              .catch((error) => {
                // 7- Error handling
                callCatchMethod(error, language);
              });
          }
        }
      })
      .catch((error) => {
        // 7- Error handling
        callCatchMethod(error, language);
      });
  };

  // const onSubmitForm = (fromData) => {
  // let newBody = {
  //   ...fromData,
  //   activeFlag: fromData.activeFlag,
  //   shiftStartTime: moment(fromData.shiftStartTime).format("HH:mm:ss"),
  //   shiftEndTime: moment(fromData.shiftEndTime).format("HH:mm:ss"),
  // };
  //   sweetAlert(
  //     fromData.id ? updateConfirmation(language) : saveConfirmation(language)
  //   )
  //     .then((ok) => {
  //       console.log("Hii", ok);
  //       if (ok) {
  //         console.log("hello");
  //         // if (btnSaveText === "Save") {
  //         fromData.id
  //           ? axios
  //               .post(
  //                 `${urls.FbsURL}/employeeShiftMaster/saveEmployeeShiftMaster`,
  //                 newBody
  //               )
  //               .then((res) => {
  //                 if (res.status == 200 || res.status == 201) {
  //                   sweetAlert(recordUpdated(language));
  //                   setButtonInputState(false);
  //                   setIsOpenCollapse(false);
  //                   setEditButtonInputState(false);
  //                   setDeleteButtonState(false);
  //                   getData();
  //                   setSlideChecked(false);
  //                 }
  //               })
  //           : // .catch((error) => {
  //             //   //   callCatchMethod(error, language);
  //             //   //   console.log("error", error);
  //             //   // })
  //             axios
  //               .post(
  //                 `${urls.FbsURL}/employeeShiftMaster/saveEmployeeShiftMaster`,
  //                 newBody
  //               )
  //               .then((res) => {
  //                 if (res.status == 200 || res.status == 201) {
  //                   sweetAlert(saveRecord(language));
  //                   setButtonInputState(false);
  //                   setIsOpenCollapse(false);
  //                   setEditButtonInputState(false);
  //                   setDeleteButtonState(false);
  //                   getData();
  //                   setSlideChecked(false);
  //                 }
  //               })
  //               .catch((error) => {
  //                 callCatchMethod(error, language);
  //               });
  //       }
  //     })
  //     .catch((error) => {
  //       callCatchMethod(error, language);
  //     });
  // };

  const deleteById = async (value) => {
    sweetAlert(deleteConfirmation(language)).then((willDelete) => {
      console.log("willDelete123", willDelete);

      if (willDelete) {
        axios
          .delete(
            `${urls.FbsURL}/employeeShiftMaster/discardEmployeeShiftMaster/${value}`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          .then((res) => {
            if (res.status == 226 || res.status == 200) {
              sweetAlert(recordDeleted(language));
              getData();
              setButtonInputState(false);
            }
          })
          .catch((error) => {
            callCatchMethod(error, language);
          });
      } else if (willDelete == null || willDelete == false) {
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
    shiftName: "",
    shiftNameMr: "",
    shiftStartTime: null,
    shiftEndTime: null,
    nameOfCFO: "",
    nameOfSFO: "",
    nameOfOtherEmployee: "",
  };

  // Reset Values Exit
  const resetValuesExit = {
    shiftName: "",
    shiftStartTime: null,
    shiftEndTime: null,
    nameOfCFO: "",
    nameOfSFO: "",
    nameOfOtherEmployee: "",
  };

  const columns = [
    {
      field: "shiftName",
      headerName: <FormattedLabel id="shiftName" />,
      flex: 1,
    },
    {
      field: "shiftStartTimeCol",
      headerName: <FormattedLabel id="shiftStartTime" />,
      flex: 1,
    },
    {
      field: "shiftEndTimeCol",
      headerName: <FormattedLabel id="shiftEndTime" />,
      flex: 1,
    },
    {
      field: language == "en" ? "nameOfCFOCol" : "nameOfCFOColMr",
      headerName: <FormattedLabel id="nameOfCFO" />,
      flex: 1,
    },
    {
      field: language == "en" ? "nameOfSFOCol" : "nameOfSFOColMr",
      headerName: <FormattedLabel id="nameOfSFO" />,
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
              <EditIcon />
            </IconButton>
            <IconButton
              className={styles.masterDeleteBtn}
              disabled={deleteButtonInputState}
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
      {loadderState && <Loader />}
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
                      margin: 1,
                      padding: 2,
                      backgroundColor: "#F5F5F5",
                    }}
                    elevation={5}
                  >
                    <Box className={styles.tableHead}>
                      <Box className={styles.feildHead}>
                        {btnSaveText == "Update" ? (
                          <FormattedLabel id="updateEmp" />
                        ) : (
                          <FormattedLabel id="addEmp" />
                        )}
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
                      <Grid item xs={4} className={styles.shiftNameField}>
                        {/* <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="shiftName" />}
                          variant="standard"
                          {...register("shiftName")}
                          error={!!errors.shiftName}
                          helperText={
                            errors?.shiftName ? errors.shiftName.message : null
                          }
                        /> */}

                        <Transliteration
                          _key={"shiftName"}
                          labelName={"shiftName"}
                          fieldName={"shiftName"}
                          updateFieldName={"shiftNameMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          // variant="standard"
                          label={<FormattedLabel id="shiftName" required />}
                          InputLabelProps={{
                            shrink: !!watch("shiftName") ? true : false,
                          }}
                          sx={{ width: "100%" }}
                          error={!!errors.shiftName}
                          helperText={
                            errors?.shiftName ? errors.shiftName.message : null
                          }
                        />
                      </Grid>

                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{ width: "100%" }}
                          error={!!errors.shiftStartTime}
                          variant="standard"
                        >
                          <Controller
                            control={control}
                            name="shiftStartTime"
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <TimePicker
                                  label={
                                    <FormattedLabel
                                      id="shiftStartTime"
                                      required
                                    />
                                  }
                                  value={field.value}
                                  onChange={(time) => field.onChange(time)}
                                  selected={field.value}
                                  renderInput={(params) => (
                                    <TextField
                                      variant="standard"
                                      size="small"
                                      {...params}
                                      error={
                                        errors.shiftStartTime ? true : false
                                      }
                                    />
                                  )}
                                  defaultValue={null}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.shiftStartTime
                              ? errors.shiftStartTime.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{ width: "100%" }}
                          error={!!errors.shiftEndTime}
                          variant="standard"
                        >
                          <Controller
                            control={control}
                            name="shiftEndTime"
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <TimePicker
                                  label={
                                    <FormattedLabel
                                      id="shiftEndTime"
                                      required
                                    />
                                  }
                                  value={field.value}
                                  onChange={(time) => field.onChange(time)}
                                  selected={field.value}
                                  renderInput={(params) => (
                                    <TextField
                                      variant="standard"
                                      size="small"
                                      {...params}
                                      error={errors.shiftEndTime ? true : false}
                                    />
                                  )}
                                  defaultValue={null}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.shiftEndTime
                              ? errors.shiftEndTime.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="shiftNameMr" required />}
                          variant="standard"
                          {...register("shiftNameMr")}
                          error={!!errors.shiftNameMr}
                          InputLabelProps={{
                            shrink: watch("shiftNameMr") ? true : false,
                          }}
                          sx={{ width: "100%" }}
                          helperText={
                            errors?.shiftNameMr
                              ? errors.shiftNameMr.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          sx={{ width: "100%" }}
                          variant="standard"
                          error={errors.nameOfCFO}
                        >
                          {/* <label>Officer Name to Release Vehicle</label><br/> */}
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="nameOfCFO" required />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="nameOfCFO" />}
                              >
                                {/* {des &&
                                  des.map((d) => (
                                    <MenuItem key={index} value={d.id}>
                                      {d.designation}
                                    </MenuItem>
                                  ))} */}
                                {console.log("userLst", userLst)}
                                {userLst &&
                                  userLst

                                    .filter(
                                      (u) =>
                                        u.id == 40 || u.id == 41 || u.id == 42
                                    ) // .filter((u) => u.id === "13")
                                    .map((user, index) => (
                                      <MenuItem key={index} value={user.id}>
                                        {console.log(
                                          "MarathiNav",
                                          user.middleNameMr
                                        )}
                                        {language === "en"
                                          ? [
                                              user.firstNameEn,
                                              user.middleNameEn,
                                              user.lastNameEn,
                                            ]
                                              .filter(
                                                (namePart) =>
                                                  typeof namePart ===
                                                    "string" &&
                                                  namePart.trim() !== ""
                                              )
                                              .join(" ")
                                          : [
                                              user.firstNameMr,
                                              user.middleNameMr,
                                              user.lastNameMr,
                                            ]
                                              .map((namePart) =>
                                                typeof namePart === "string"
                                                  ? namePart
                                                  : "-"
                                              )
                                              .join(" ")}
                                      </MenuItem>
                                    ))}
                              </Select>
                            )}
                            name="nameOfCFO"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText
                            style={errors?.nameOfCFO ? { color: "red" } : {}}
                          >
                            {errors?.nameOfCFO
                              ? errors.nameOfCFO.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} className={styles.feildres}>
                        <FormControl
                          variant="standard"
                          sx={{ width: "100%" }}
                          error={!!errors.nameOfSFO}
                        >
                          {/* <label>Officer Name to Release Vehicle</label><br/> */}
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="nameOfSFO" required />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="nameOfSFO" />}
                              >
                                {userLst &&
                                  userLst
                                    .filter(
                                      (u) =>
                                        u.id == 40 || u.id == 41 || u.id == 42
                                    )
                                    .map((user, index) => (
                                      <MenuItem
                                        // size="small"
                                        key={index}
                                        value={user.id}
                                      >
                                        {language === "en"
                                          ? [
                                              user.firstNameEn,
                                              user.middleNameEn,
                                              user.lastNameEn,
                                            ]
                                              .filter(
                                                (namePart) =>
                                                  typeof namePart ===
                                                    "string" &&
                                                  namePart.trim() !== ""
                                              )
                                              .join(" ")
                                          : [
                                              user.firstNameMr,
                                              user.middleNameMr,
                                              user.lastNameMr,
                                            ]
                                              .map((namePart) =>
                                                typeof namePart === "string"
                                                  ? namePart
                                                  : "-"
                                              )
                                              .join(" ")}
                                      </MenuItem>
                                    ))}
                              </Select>
                            )}
                            name="nameOfSFO"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText
                            style={errors?.nameOfSFO ? { color: "red" } : {}}
                          >
                            {errors?.nameOfSFO
                              ? errors.nameOfSFO.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid
                      container
                      columns={{ xs: 4, sm: 8, md: 12 }}
                      spacing={4}
                    >
                      <Grid item xs={4} sx={{ paddingLeft: "5%" }}>
                        {/* <h4>{<FormattedLabel id='nameOfOtherEmployee' />}</h4> */}

                        {/* <Multiselect
                          // options={userLst}
                          selectedValues={(w) => {
                            console.log("w", w);
                          }}
                          onSelect={(e) => {
                            console.log("e", e);
                          }}
                          // displayValue="firstNameEn"
                          // selectedValues={(w) => {
                          //   console.log("ww", w);
                          // }}
                          // onChange={setDemo}
                          // isObject={false}
                          // value={demo}
                          // labelledBy="select"
                          // onRemove={(event) => {
                          //   console.log(event);
                          // }}
                          // onSelect={(event) => {
                          //   console.log("event", event);
                          // }}
                          // options={userLst}
                          // options={userLst.map((user) => user.firstNameEn)}
                          options={userLst.map(
                            (user) =>
                              user.firstNameEnEn &&
                              user.firstNameEnEn + " " + user.middleNameEn &&
                              user.middleNameEn + " " + user.lastNameEn &&
                              user.lastNameEn
                          )}
                          showCheckbox
                        /> */}
                        {/* <FormHelperText
                           style={
                             errors?.nameOfOtherEmployee?.message
                               ? {}
                          : { color: "red" }
                      }
                    >
                      {errors?.nameOfOtherEmployee
                            ? errors.nameOfOtherEmployee.message
                            : null}
                      </FormHelperText>  */}
                      </Grid>
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
                                "/FireBrigadeSystem/masters/employeeShiftMaster",
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
            {<FormattedLabel id="employeeShiftMasterTitle" />}
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
            // paddingLeft: "2%",
            // paddingRight: "2%",
            // width: "60%",
            backgroundColor: "white",
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
        />
      </Box>
    </>
  );
};

export default Index;
