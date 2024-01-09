import AddIcon from "@mui/icons-material/Add";
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
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../../styles/sportsPortalStyles/addMember.module.css";
import Loader from "../../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// OwnerDetail
const AddMemberSports = ({ view = false, readOnly = false }) => {
  const {
    control,
    register,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [finalOwnerDetailsTableData, setFinalOwnerDetailsTableData] = useState(
    []
  );

  const [buttonInputState, setButtonInputState] = useState();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [viewIconState, setViewIconState] = useState(false);
  const [viewButtonInputState, setViewButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const language = useSelector((state) => state?.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const [error, setError] = useState(" ");
  const [errorr, setErrorr] = useState(" ");
  const router = useRouter();
  const [genderss, setGenderss] = useState([
    { id: 1, gender: "Male", genderMr: "पुरुष" },
    { id: 2, gender: "Female", genderMr: "स्त्री" },
    { id: 3, gender: "Transgender", genderMr: "त्रितियपंथी" },
  ]);
  const [sportsBookingKey1, setSportsBookingKey1] = useState(null);
  const [sportsBookingAddMemberKey1, setSportsBookingAddMemberKey1] =
    useState(null);
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
  // handleClick
  const handleClick = () => {
    const applicantAadhaarNo = watch("applicantAadhaarNo");
    if (applicantAadhaarNo === "" && applicantAadhaarNo.length < 12) {
      // setError("Please enter  Aadhar card number");
      setError(<FormattedLabel id="VaadharNo" />);
    }
    if (applicantAadhaarNo.length < 12) {
      setError(<FormattedLabel id="VaadharNo" />);
    } else {
      // setValue("loadderState",true);
      saveOwner();
      setIsOpenCollapse(isOpenCollapse);
    }
  };

  // resetOwnerValuesWithId
  const resetOwnerValuesId = () => {
    // alert("dsf")
    setValue("sportsBookingAddMemberKey", null);
    // setValue("sportsBookingKey", null);
    setValue("applicantFirstName", "");
    setValue("applicantMiddleName", "");
    setValue("applicantLastName", "");
    setValue("applicantFirstNameMr", "");
    setValue("applicantMiddleNameMr", "");
    setValue("applicantLastNameMr", "");
    setValue("applicantGender", null);
    setValue("applicantAadhaarNo", "");
    setValue("applicantAge", "");
    setValue("applicantMobile", "");
    setValue("applicantEmailAddress", "");
    setValue("applicantCurrentAddress", "");
    setSportsBookingKey1(null);
    setSportsBookingAddMemberKey1(null);
  };

  // setValues- onUpdate
  const SetOwnerValues = (props) => {
    console.log("props234324", props);

    setValue("sportsBookingAddMemberKey", props?.id);
    setSportsBookingAddMemberKey1(props?.id);

    // setValue("sportsBookingKey",  props?.sportsBookingKey)
    setSportsBookingKey1(props?.sportsBookingKey);

    //  setSportsBookingKey(props?.sportsBookingKey);

    console.log("12chaDAta", props?.id, props?.sportsBookingKey);
    //additona for test

    // setValue("sportsBookingKey",  props?.sportsBookingKey);
    // setValue("sportsBookingAddMemberKey",  props?.id);
    setValue("applicantFirstName", props?.applicantFirstName);
    setValue("applicantMiddleName", props?.applicantMiddleName);
    setValue("applicantLastName", props?.applicantLastName);
    setValue("applicantFirstNameMr", props?.applicantFirstNameMr);
    setValue("applicantMiddleNameMr", props?.applicantMiddleNameMr);
    setValue("applicantLastNameMr", props?.applicantLastNameMr);
    setValue("applicantGender", props?.applicantGender);
    setValue("applicantAadhaarNo", props?.applicantAadhaarNo);
    setValue("applicantAge", props?.applicantAge);
    setValue("applicantMobile", props?.applicantMobile);
    setValue("applicantEmailAddress", props?.applicantEmailAddress);
    setValue("applicantCurrentAddress", props?.applicantCurrentAddress);
  };

  // saveOwner
  const saveOwner = () => {
    setLoadderState(true);
    // setValue("loadderSatat",true);
    const url = `${urls.SPURL}/sportsBooking/saveSportsBooking`;
    console.log(
      "dsfdsfdsf",
      watch("sportsBookingAddMemberKey"),
      watch("sportsBookingKey"),
      watch(),
      sportsBookingKey1,
      sportsBookingAddMemberKey1
    );
    console.log("12chaDAta2", sportsBookingAddMemberKey1, sportsBookingKey1);
    // currentOwnerDTLDao
    const sportsBookingGroupDetailsDaoTemp = {
      activeFlag: "Y",
      id:
        sportsBookingAddMemberKey1 != null &&
        sportsBookingAddMemberKey1 != undefined &&
        sportsBookingAddMemberKey1 != "" &&
        sportsBookingAddMemberKey1 != "undefined"
          ? Number(sportsBookingAddMemberKey1)
          : null,
      sportsBookingKey:
        sportsBookingKey1 != null &&
        sportsBookingKey1 != undefined &&
        sportsBookingKey1 != "" &&
        sportsBookingKey1 != "undefined"
          ? Number(sportsBookingKey1)
          : null,
      applicantFirstName: watch("applicantFirstName"),
      applicantMiddleName: watch("applicantMiddleName"),
      applicantLastName: watch("applicantLastName"),
      applicantFirstNameMr: watch("applicantFirstNameMr"),
      applicantMiddleNameMr: watch("applicantMiddleNameMr"),
      applicantLastNameMr: watch("applicantLastNameMr"),
      applicantGender: Number(watch("applicantGender")),
      applicantAadhaarNo: Number(watch("applicantAadhaarNo")),
      applicantAge: Number(watch("applicantAge")),
      applicantMobile: Number(watch("applicantMobile")),
      applicantEmailAddress: watch("applicantEmailAddress"),
      applicantCurrentAddress: watch("applicantCurrentAddress"),
    };

    console.log(
      "sportsBookingGroupDetailsDaoTemp",
      sportsBookingGroupDetailsDaoTemp
    );

    // filteredNewData
    const filteredNewData = watch("sportsBookingGroupDetailsDao")?.filter(
      (data) => data?.id != sportsBookingAddMemberKey1
    );

    console.log(
      "sportsBookingAddMembers",
      filteredNewData,
      sportsBookingGroupDetailsDaoTemp,
      watch("sportsBookingAddMemberKey")
    );

    const sportsBookingGroupDetailsDao = [
      ...filteredNewData,
      sportsBookingGroupDetailsDaoTemp,
    ];
    // updatedData
    // setValue("sportsBookingGroupDetailsDao", [
    //   ...filteredNewData,
    //   sportsBookingGroupDetailsDaoTemp,
    // ]);

    const sportsBookingKey =
      watch("id") != null &&
      watch("id") != null &&
      watch("id") != "" &&
      watch("id") != "undefined"
        ? Number(watch("id"))
        : null;
    // setValue("pAddressMr",watch("addressMr"))
    // finalBodyForApi
    const finalBodyForApi = {
      ...watch(),
      pageMode: "DRAFT",
      id: sportsBookingKey,
      sportsBookingGroupDetailsDao: sportsBookingGroupDetailsDao,
      serviceId: 29,
    };

    console.log("finalBodyForApi", finalBodyForApi);
    axios
      .post(url, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          // setValue("loadderState",false);
          setLoadderState(false);
          console.log(
            "res?.data",
            Number(res?.data?.message?.split(":")[1]),
            res?.data?.message
          );
          // setId

          setValue(
            "sportsBookingKey",
            Number(res?.data?.message?.split(":")[1])
          );
          setIsOpenCollapse(false);
          // editButtonState
          setEditButtonInputState(false);
          // deleteButtonState
          setDeleteButtonState(false);
          // addButtonState
          setButtonInputState(false);
          // viewIconState
          setViewIconState(false);
          // resetOwnerValuesWithID
          resetOwnerValuesId();

          // swal({
          //   title: language == 'en' ? 'Inactivate?' : 'निष्क्रिय ?',
          //   text:
          //     language == 'en'
          //       ? 'Are you sure you want to activate this Record ?'
          //       : 'तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय  करू इच्छिता?',
          //   icon: 'warning',
          //   buttons: true,
          //   dangerMode: true,
          // }).then
          // setValue("pAddressMr",watch("addressMr"))
          language == "en"
            ? sweetAlert("Saved!", "Record Saved successfully !", "success")
            : sweetAlert(
                "जतन केले!",
                "रेकॉर्ड यशस्वीरित्या जतन केले!",
                "success"
              );
        } else {
          setLoadderState(false);
          // setValue("loadderState",false);
        }
      })
      .catch((error) => {
        // setValue("loadderState",false);
        setLoadderState(false);
        console.log("sportAddMemberApiCatch", error);
        callCatchMethod(error, language);
      });
  };

  //! deleteById
  const deleteById = async (value) => {
    // setValue("loadderState",true);

    const sportBookingDetailDeleteId = value;

    console.log("sportBookingDetailDeleteId", value);

    language == "en"
      ? swal({
          title: "Delete ?",
          text: "Are you sure you want to delete this Record ? ",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
      : swal({
          text: "तुमची खात्री आहे की तुम्ही हे रेकॉर्ड हटवू इच्छिता?",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        }).then((willDelete) => {
          // willDelete
          if (willDelete) {
            // setValue("loadderState",true);
            setLoadderState(true);
            const tempSportBookingDTLDao = watch(
              "sportsBookingGroupDetailsDao"
            );

            if (
              tempSportBookingDTLDao != null ||
              tempSportBookingDTLDao != undefined
            ) {
              //!activeFlagYRecords
              const tempDataY = tempSportBookingDTLDao.filter((data, index) => {
                if (data?.id != sportBookingDetailDeleteId) {
                  return data;
                }
              });

              //! wantToDeletRecord
              const tempData = tempSportBookingDTLDao.filter((data, index) => {
                if (data?.id == sportBookingDetailDeleteId) {
                  return data;
                }
              });

              // activeFlagNRecord
              const tempDataN = tempData.map((data) => {
                return {
                  ...data,
                  activeFlag: "N",
                };
              });

              console.log("tempDataYtempDataN", tempDataY, tempDataN);

              const sportsBookingGroupDetailsDao = [...tempDataY, ...tempDataN];

              // updateRecord
              // setValue("sportsBookingGroupDetailsDao", [
              //   ...tempDataY,
              //   ...tempDataN,
              // ]);

              saveOwner1(sportsBookingGroupDetailsDao);

              // states
              // editButtonState
              setEditButtonInputState(false);
              // // deleteButtonState
              setDeleteButtonState(false);
              // // addButtonState
              setButtonInputState(false);
              // // viewIconState
              setViewIconState(false);
            }
          } else {
            console.log("else part");
            // // editButtonState
            setEditButtonInputState(false);
            // // deleteButtonState
            setDeleteButtonState(false);
            // // addButtonState
            setButtonInputState(false);
            // // viewIconState
            setViewIconState(false);
          }
        });
  };

  //! exitFunction
  const exitFunction = () => {
    // editButtonState
    setEditButtonInputState(false);
    // deleteButtonState
    setDeleteButtonState(false);
    // addButtonState
    setButtonInputState(false);
    // viewIconState
    setViewIconState(false);
    // save/updateButtonText
    setBtnSaveText("Save");
    // conditionalRendering
    setSlideChecked(true);
    // collpaseOpen/Close
    setIsOpenCollapse(false);
    // resetValuesWithId
    resetOwnerValuesId();
    // disabledInputState
    setViewButtonInputState(false);
  };

  // columns
  const columns = [
    {
      field: "srNo",
      // headerName: "Sr No.",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
    },
    {
      field: "applicantFullNameEn",
      // field: language == "en" ? "applicantFullNameEn" : "applicantFullNameMr",
      headerName: <FormattedLabel id="name" />,
      flex: 1,
    },

    {
      field: "applicantGender",
      headerName: <FormattedLabel id="gender" />,
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            {language == "en"
              ? genderss?.find((f) => f.id == params?.row?.applicantGender)
                  ?.gender
              : genderss?.find((f) => f.id == params?.row?.applicantGender)
                  ?.genderMr}
          </>
        );
      },
    },
    {
      field: "applicantAadhaarNo",
      headerName: <FormattedLabel id="aadharNo" />,
      flex: 1,
    },
    {
      field: "applicantAge",
      // headerName: "Age",
      headerName: <FormattedLabel id="age" />,
      flex: 1,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        console.log("params", params.row);
        return (
          <>
            {!watch("formPreviewDailogState") && (
              <>
                {!view && (
                  <IconButton
                    className={styles.edit}
                    disabled={editButtonInputState}
                    onClick={() => {
                      console.log("EditMembers", params?.row);
                      // setValues
                      SetOwnerValues(params?.row);
                      // editButtonState
                      setEditButtonInputState(true);
                      // deleteButtonState
                      setDeleteButtonState(true);
                      // addButtonState
                      setButtonInputState(true);
                      // viewIconState
                      setViewIconState(true);
                      // save/updateButtonText
                      setBtnSaveText("Update");
                      // conditionalRendering
                      setSlideChecked(true);
                      // collpaseOpen/Close
                      setIsOpenCollapse(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </>
            )}

            {!watch("formPreviewDailogState") && (
              <>
                {!view && (
                  <IconButton
                    className={styles.delete}
                    disabled={deleteButtonInputState}
                    onClick={() => {
                      console.log("gfdcgfc", params?.row?.id);
                      deleteById(params?.row?.id);
                      // editButtonState
                      setEditButtonInputState(true);
                      // deleteButtonState
                      setDeleteButtonState(true);
                      // addButtonState
                      setButtonInputState(true);
                      // viewIconState
                      setViewIconState(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </>
            )}
          </>
        );
      },
    },
  ];

  //afterdelete
  const saveOwner1 = (props) => {
    // url
    const url = `${urls.SPURL}/sportsBooking/saveSportsBooking`;

    const sportsBookingKey =
      watch("id") != null &&
      watch("id") != null &&
      watch("id") != "" &&
      watch("id") != "undefined"
        ? Number(watch("id"))
        : null;

    // finalBodyForApi
    const finalBodyForApi = {
      ...watch(),
      pageMode: "DRAFT",
      id: sportsBookingKey,
      sportsBookingGroupDetailsDao: props,
      serviceId: 32,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(url, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          setValue(
            "sportsBookingKey",
            Number(res?.data?.message?.split(":")[1])
          );
          console.log(
            "res?.data",
            Number(res?.data?.message?.split(":")[1]),
            res?.data?.message
          );
          setLoadderState(false);
          // setValue("loadderState",true);
        } else {
          // setValue("loadderState",true);
          setLoadderState(false);
        }
      })
      .catch((error) => {
        // setValue("loadderState",true);
        setLoadderState(false);
        console.log("Error", error);
        callCatchMethod(error, language);
      });
  };
  //! ============> useEffects <=========

  useEffect(() => {
    const tableData = watch("sportsBookingGroupDetailsDao");
    console.log("dsfds", watch("sportsBookingGroupDetailsDao"));

    if (tableData != null && tableData != undefined && tableData.length) {
      // filteredData
      const filteredData = tableData?.map((data, index) => {
        return {
          ...data,
          srNo: index + 1,
        };
      });

      // activeFlagYRecord
      const filteredDataActiveFlagY = filteredData?.filter(
        (data) => data?.activeFlag == "Y"
      );

      const finalArrayWithFullName = filteredDataActiveFlagY?.map((data) => {
        return {
          ...data,
          applicantFullNameEn:
            data?.applicantFirstName +
            " " +
            data?.applicantMiddleName +
            " " +
            data?.applicantLastName,
          applicantFullNameMr:
            data?.applicantFirstNameMr +
            " " +
            data?.applicantLastNameMr +
            " " +
            data?.applicantMiddleNameMr,
        };
      });

      console.log("finalArrayWithFullName", finalArrayWithFullName);
      setFinalOwnerDetailsTableData(finalArrayWithFullName);
    } else {
      setFinalOwnerDetailsTableData([]);
    }
  }, [watch("sportsBookingGroupDetailsDao")]);

  //! second
  useEffect(() => {
    localStorage.setItem("sportsBookingKey", watch("sportsBookingKey"));
  }, [watch("sportsBookingKey")]);

  useEffect(() => {
    localStorage.setItem(
      "sportsBookingAddMemberKey",
      watch("sportsBookingAddMemberKey")
    );
  }, [watch("sportsBookingAddMemberKey")]);

  useEffect(() => {
    setValue("sportsBookingKey", localStorage.getItem("sportsBookingKey"));
    setValue(
      "sportsBookingAddMemberKey",
      localStorage.getItem("sportsBookingAddMemberKey")
    );
  }, []);
  console.log(
    "addressCheckBox111",
    watch("addressCheckBox"),
    watch("pAddressMr"),
    watch("addressMr")
  );

  // view
  return (
    <>
      {loadderState ? (
        <Loader />
      ) : (
        <>
          <Box>
            {isOpenCollapse && (
              <Slide
                direction="down"
                in={slideChecked}
                mountOnEnter
                unmountOnExit
              >
                <div>
                  <Box
                    style={{
                      margin: "4%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
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
                          {language == "en" ? "Add Member" : "सदस्य जोडा"}
                        </Box>
                      </Box>
                      {/* <br /> */}

                      <Grid
                        container
                        columns={{ xs: 4, sm: 8, md: 12 }}
                        className={styles.feildres}
                      >
                        <Grid item xs={4} className={styles.feildres}>
                          <TextField
                            id="standard-basic"
                            label={<FormattedLabel id="firstNamee" />}
                            {...register("applicantFirstName")}
                            error={!!errors.applicantFirstName}
                            helperText={
                              errors?.applicantFirstName
                                ? errors.applicantFirstName.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid item xs={4} className={styles.feildres}>
                          <TextField
                            id="standard-basic"
                            label={<FormattedLabel id="middleNamee" />}
                            {...register("applicantMiddleName")}
                            error={!!errors.applicantMiddleName}
                            helperText={
                              errors?.applicantMiddleName
                                ? errors.applicantMiddleName.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid item xs={4} className={styles.feildres}>
                          <TextField
                            id="standard-basic"
                            label={<FormattedLabel id="lastNamee" />}
                            {...register("applicantLastName")}
                            error={!!errors.applicantLastName}
                            helperText={
                              <p className={styles.error}>{errorr}</p>
                            }
                          />
                        </Grid>

                        {/* <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="firstNamemr" />}
                        {...register("applicantFirstNameMr")}
                        error={!!errors.applicantFirstNameMr}
                        helperText={
                          errors?.applicantFirstNameMr
                            ? errors.applicantFirstNameMr.message
                            : null
                        }
                      />
                    </Grid> */}

                        {/* <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="middleNamemr" />}
                        {...register("applicantMiddleNameMr")}
                        error={!!errors.applicantMiddleNameMr}
                        helperText={
                          errors?.applicantMiddleNameMr
                            ? errors.applicantMiddleNameMr.message
                            : null
                        }
                      />
                    </Grid> */}
                        {/* <Grid item xs={4} className={styles.feildres}>
                      <TextField
                                               id="standard-basic"
                        label={<FormattedLabel id="lastNamemr" />}
                        {...register("applicantLastNameMr")}
                        error={!!errors.applicantLastNameMr}
                        helperText={
                          errors?.applicantLastNameMr ? errors.applicantLastNameMr.message : null
                        }
                      />
                    </Grid> */}
                      </Grid>

                      <Grid
                        container
                        columns={{ xs: 4, sm: 8, md: 12 }}
                        className={styles.feildres}
                      >
                        <Grid item xs={4} className={styles.feildres}>
                          <FormControl error={!!errors.applicantGender}>
                            <InputLabel id="demo-simple-select-standard-label">
                              {<FormattedLabel id="gender" />}
                            </InputLabel>
                            <Controller
                              // width="100%"
                              render={({ field }) => (
                                <Select
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Gender *"
                                >
                                  {genderss.map((menu, index) => {
                                    return (
                                      <MenuItem key={index} value={menu.id}>
                                        {language == "en"
                                          ? menu.gender
                                          : menu.genderMr}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              )}
                              name="applicantGender"
                              control={control}
                              defaultValue={null}
                            />
                            <FormHelperText>
                              {errors?.applicantGender
                                ? errors.applicantGender.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid item xs={4} className={styles.feildres}>
                          <TextField
                            id="standard-basic"
                            inputProps={{ maxLength: 12 }}
                            label={<FormattedLabel id="aadharNo" required />}
                            variant="standard"
                            {...register("applicantAadhaarNo")}
                            onChange={(event) => {
                              if (error !== "") {
                                setError("");
                              }
                            }}
                            error={!!errors.adharNo}
                            // helperText={
                            //   errors?.name ? "Aadhar no. is Required !!!" : null
                            // }
                            helperText={<p className={styles.error}>{error}</p>}
                          />
                        </Grid>

                        <Grid item xs={4} className={styles.feildres}>
                          <TextField
                            id="standard-basic"
                            label={<FormattedLabel id="age" />}
                            variant="standard"
                            {...register("applicantAge")}
                            error={!!errors.applicantAge}
                            helperText={
                              errors?.name ? "Age is Required !!!" : null
                            }
                          />
                        </Grid>

                        <Grid item xs={4} className={styles.feildres}>
                          <TextField
                            id="standard-basic"
                            inputProps={{ maxLength: 10 }}
                            label={<FormattedLabel id="mobileNo" />}
                            {...register("applicantMobile")}
                            error={!!errors.applicantMobile}
                            helperText={
                              errors?.applicantMobile
                                ? errors.applicantMobile.message
                                : null
                            }
                          />
                        </Grid>

                        <Grid item xs={4} className={styles.feildres}>
                          <TextField
                            id="standard-basic"
                            label={<FormattedLabel id="emailAddress" />}
                            {...register("applicantEmailAddress")}
                            error={!!errors.applicantEmailAddress}
                            helperText={
                              errors?.applicantEmailAddress
                                ? errors.applicantEmailAddress.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid item xs={4} className={styles.feildres}>
                          <TextField
                            id="standard-basic"
                            label={<FormattedLabel id="currentAddress" />}
                            {...register("applicantCurrentAddress")}
                            error={!!errors.applicantCurrentAddress}
                            helperText={
                              errors?.applicantCurrentAddress
                                ? errors.applicantCurrentAddress.message
                                : null
                            }
                          />
                        </Grid>
                      </Grid>

                      <Grid
                        container
                        columns={{ xs: 4, sm: 8, md: 12 }}
                        className={styles.feildres}
                      >
                        <Grid item xs={4} className={styles.feildres}></Grid>
                        {/* <br /> */}
                        <Grid container className={styles.feildres} spacing={2}>
                          <Grid item>
                            {!viewButtonInputState && (
                              <Button
                                size="small"
                                variant="outlined"
                                type="button"
                                className={styles.button}
                                endIcon={<SaveIcon />}
                                onClick={() => {
                                  handleClick();
                                }}
                              >
                                {btnSaveText == "Update" ? (
                                  <FormattedLabel id="update" />
                                ) : (
                                  <FormattedLabel id="save" />
                                )}
                              </Button>
                            )}
                          </Grid>

                          <Grid item>
                            <Button
                              size="small"
                              variant="outlined"
                              type="button"
                              className={styles.button}
                              endIcon={<ExitToAppIcon />}
                              onClick={() => exitFunction()}
                            >
                              {<FormattedLabel id="exit" />}
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                      <br />
                    </Paper>
                  </Box>
                </div>
              </Slide>
            )}
            <Box style={{ display: "flex", justifyContent: "center" }}>
              <Box className={styles.tableHead}>
                <Box className={styles.h1Tag}>
                  {/* Add Member */}
                  <FormattedLabel id="addMember" />
                </Box>
              </Box>

              {router?.query?.pageMode != "View" && (
                <>
                  {!view &&
                    (watch("totalGroupMember") <=
                    finalOwnerDetailsTableData.length ? (
                      <></>
                    ) : (
                      <>
                        <Box>
                          {!watch("formPreviewDailogState") && (
                            <>
                              <Button
                                variant="contained"
                                type="button"
                                // disabled={buttonInputState}
                                onClick={() => {
                                  // resetValues
                                  resetOwnerValuesId();
                                  // editButtonState
                                  setEditButtonInputState(true);
                                  // deleteButtonState
                                  setDeleteButtonState(true);
                                  // addButtonState
                                  setButtonInputState(true);
                                  // viewIconState
                                  setViewIconState(true);
                                  // save/updateButtonText
                                  setBtnSaveText("Save");
                                  // conditionalRendering
                                  setSlideChecked(true);
                                  // collpaseOpen/Close
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
                            </>
                          )}
                        </Box>
                      </>
                    ))}
                </>
              )}
            </Box>
            <Box
              style={{
                display: "flex",
                marginLeft: 20,
                marginRight: 20,
                marginBottom: 20,
              }}
            >
              <DataGrid
                getRowId={(row) => row.srNo}
                disableColumnFilter
                disableColumnSelector
                disableExport
                autoHeight
                // density="compact"
                sx={{
                  backgroundColor: "white",
                  // paddingLeft: "2%",
                  // paddingRight: "2%",
                  boxShadow: 2,
                  border: 1,
                  borderColor: "primary.light",
                  "& .MuiDataGrid-cell:hover": {},
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "#E1FDFF",
                  },
                  "& .MuiDataGrid-columnHeadersInner": {
                    backgroundColor: "#87E9F7",
                  },
                }}
                rows={
                  finalOwnerDetailsTableData == null ||
                  finalOwnerDetailsTableData == undefined
                    ? []
                    : finalOwnerDetailsTableData
                }
                columns={columns}
                pageSize={7}
                rowsPerPageOptions={[7]}
              />
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default AddMemberSports;
