import { Visibility } from "@mui/icons-material";
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
import UploadButton from "../../../../components/fileUpload/UploadButton";
import Loader from "../../../../containers/Layout/components/Loader";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import ViewFileButton from "../../../../containers/reuseableComponents/UploadButton";
import styles from "../../../../styles/sportsPortalStyles/addMember.module.css";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// OwnerDetail
const AddMember = ({ view = false, readOnly = false, addButton = true }) => {
  const {
    control,
    register,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const router = useRouter();
  const [btnSaveText, setBtnSaveText] = useState("Save");
  let user = useSelector((state) => state?.user?.user);
  const [finalOwnerDetailsTableData, setFinalOwnerDetailsTableData] = useState(
    []
  );
  const [buttonInputState, setButtonInputState] = useState();
  const userToken = useGetToken();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [viewIconState, setViewIconState] = useState(false);
  const [viewButtonInputState, setViewButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [disabledInputState, setDisabledInputState] = useState(false);
  const [loadderState, setLoadderState] = useState(false);
  const [firm, setFirm] = useState();
  const language = useSelector((state) => state?.labels.language);
  const token = useSelector((state) => state.user.user.token);
  // const [medical, setMedical] = useState(null);
  const [memberMedicalCertificate1, setMedicalCertificate1] = useState(null);
  const [memberAadharCertificate1, setAadharCertificate1] = useState(null);
  const [memberPhotoCertificate1, setPhotoCertificate1] = useState(null);
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

  const [error, setError] = useState(" ");
  const [errorr, setErrorr] = useState(" ");
  const [name, setName] = useState(" ");
  const [aadharNo, setAdharNo] = useState(" ");
  const [gender, setGender] = useState(" ");
  const [genderss, setGenderss] = useState([
    { id: 1, gender: "Male", genderMr: "पुरुष" },
    { id: 2, gender: "Female", genderMr: "स्त्री" },
    { id: 3, gender: "Transgender", genderMr: "त्रितियपंथी" },
  ]);
  const [age, setAge] = useState(" ");
  const [genders, setGenders] = useState([]);

  // getGenders
  const getGenders = () => {
    axios
      .get(`${urls.CFCURL}/master/gender/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setGenders(
          r.data.gender.map((row) => ({
            id: row.id,
            gender: row.gender,
            genderMr: row.genderMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // handleClick
  const handleClick = () => {
    if (watch("memberAadharNo") === "") {
      setError(<FormattedLabel id="VaadharNo" />);
      // setError("Please enter  Aadhar card number");
    } else if (memberMedicalCertificate1 === null) {
      setErrorr("Please upload Medical Certificate");
    } else {
      saveOwner();
      setIsOpenCollapse(isOpenCollapse);
    }
  };

  // resetOwnerValuesId
  const resetOwnerValuesId = () => {
    setValue("id", null);
    setValue("memberName", null);
    setValue("memberMname", null);
    setValue("memberLname", null);
    setValue("memberAadharNo", null);
    setValue("memberGender");
    setValue("memberAge", null);
    setValue("memberMedicalCertificate", null);
    setValue("memberAadharCertificate", null);
    setValue("memberPhotoCertificate", null);
    setMedicalCertificate1(null);
    setAadharCertificate1(null);
    setPhotoCertificate1(null);
  };

  // SetOwnerValues
  const SetOwnerValues = (props) => {
    console.log("11", props?.memberMedicalCertificate);
    setValue("swimmingPoolKey", props?.swimmingPoolKey);
    setValue("memberKey", props?.id);
    setValue("memberName", props?.memberName);
    setValue("memberMname", props?.memberMname);
    setValue("memberLname", props?.memberLname);
    setValue("memberGender", props?.memberGender);
    setValue("memberAadharNo", props?.memberAadharNo);
    setValue("memberAge", props?.memberAge);
    setValue("memberMedicalCertificate", props?.memberMedicalCertificate);
    setValue("memberAadharCertificate", props?.memberAadharCertificate);
    setValue("memberPhotoCertificate", props?.memberPhotoCertificate);
    setValue("memberMedicalCertificate1", props?.memberMedicalCertificate);
    setValue("memberAadharCertificate1", props?.memberAadharCertificate);
    setValue("memberPhotoCertificate1", props?.memberPhotoCertificate);
    setMedicalCertificate1(props?.memberMedicalCertificate);
    setAadharCertificate1(props?.memberAadharCertificate);
    setPhotoCertificate1(props?.memberPhotoCertificate);
  };

  // deleteById
  const deleteById = async (value) => {
    if (language == "en") {
      const ownerDetailDelteId = value;
      console.log("ownerDetailDelteId", value);

      swal({
        title: "Delete ?",
        text: "Are you sure you want to delete this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        // willDelete
        if (willDelete) {
          setLoadderState(true);
          const tempOwnerDTLDao = watch("swimmingPoolDetailsDao");

          if (tempOwnerDTLDao != null || tempOwnerDTLDao != undefined) {
            //!activeFlagYRecords
            const tempDataY = tempOwnerDTLDao.filter((data, index) => {
              if (data?.id != ownerDetailDelteId) {
                return data;
              }
            });

            //! wantToDeletRecord
            const tempData = tempOwnerDTLDao.filter((data, index) => {
              if (data?.id == ownerDetailDelteId) {
                return data;
              }
            });

            // activeFlagNRecord
            const tempDataN = tempData?.map((data) => {
              return {
                ...data,
                activeFlag: "N",
              };
            });

            // updateRecord

            console.log("sdfdslfdsklfj", tempDataY, tempDataN);

            const swimmingPoolDetailsDao = [...tempDataY, ...tempDataN];
            // setValue("swimmingPoolDetailsDao", [...tempDataY, ...tempDataN]);

            // save api
            saveOwner1(swimmingPoolDetailsDao);
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
    } else {
      const ownerDetailDelteId = value;
      console.log("ownerDetailDelteId", value);

      swal({
        title: "हटवायचे?",
        text: "तुमची खात्री आहे की तुम्ही हे रेकॉर्ड हटवू इच्छिता?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        // willDelete
        if (willDelete) {
          setLoadderState(true);
          const tempOwnerDTLDao = watch("swimmingPoolDetailsDao");

          if (tempOwnerDTLDao != null || tempOwnerDTLDao != undefined) {
            //!activeFlagYRecords
            const tempDataY = tempOwnerDTLDao.filter((data, index) => {
              if (data?.id != ownerDetailDelteId) {
                return data;
              }
            });

            //! wantToDeletRecord
            const tempData = tempOwnerDTLDao.filter((data, index) => {
              if (data?.id == ownerDetailDelteId) {
                return data;
              }
            });

            // activeFlagNRecord
            const tempDataN = tempData?.map((data) => {
              return {
                ...data,
                activeFlag: "N",
              };
            });

            // updateRecord

            console.log("sdfdslfdsklfj", tempDataY, tempDataN);

            const swimmingPoolDetailsDao = [...tempDataY, ...tempDataN];
            // setValue("swimmingPoolDetailsDao", [...tempDataY, ...tempDataN]);

            // save api
            saveOwner1(swimmingPoolDetailsDao);
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
    }
  };

  // exitFunction
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
      field: "memberName",
      // headerName: "Name",
      headerName: <FormattedLabel id="name" />,
      flex: 1,
    },
    {
      field: "memberMname",
      // headerName: "Name",
      headerName: <FormattedLabel id="name" />,
      flex: 1,
    },
    {
      field: "memberLname",
      // headerName: "Name",
      headerName: <FormattedLabel id="name" />,
      flex: 1,
    },

    {
      field: "genderss",
      headerName: <FormattedLabel id="gender" />,
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            {language == "en"
              ? genderss?.find((f) => f.id == params.row.memberGender)?.gender
              : genderss?.find((f) => f.id == params.row.memberGender)
                  ?.genderMr}
          </>
        );
      },
    },
    {
      field: "memberAadharNo",
      // headerName: "Aadhar No.",
      headerName: <FormattedLabel id="aadharNo" />,
      flex: 1,
    },
    {
      field: "memberAge",
      // headerName: "Age",
      headerName: <FormattedLabel id="age" />,
      flex: 1,
    },
    // {
    //   field: "memberMedicalCertificate",
    //   // headerName: "Age",
    //   headerName: <FormattedLabel id="medicalCertificate" />,
    //   flex: 1,
    // },
    {
      field: "memberAadharCertificate",
      headerName: <FormattedLabel id="aadharCertificate" />,
      renderCell: (params) => {
        return (
          <>
            <ViewFileButton
              appName="SP"
              serviceName="SP-SPORTSBOOKING"
              // @ts-ignore
              // label={<FormattedLabel id="healthCertificate" />}
              filePath={params.row?.memberAadharCertificate}
              fileUpdater={() => {}}
              view
              readOnly
            />
          </>
        );
      },
    },
    {
      field: "memberPhotoCertificate",
      headerName: <FormattedLabel id="photoCertificate" />,
      renderCell: (params) => {
        return (
          <>
            <ViewFileButton
              appName="SP"
              serviceName="SP-SPORTSBOOKING"
              // @ts-ignore
              filePath={params.row?.memberPhotoCertificate}
              fileUpdater={() => {}}
              view
              readOnly
            />
          </>
        );
      },
    },
    {
      field: "memberMedicalCertificate",
      headerName: <FormattedLabel id="medicalCertificate" />,
      renderCell: (params) => {
        return (
          <>
            {/* <UploadButton
              error={!!errors?.aadharCard}
              appName="SP"
              serviceName="SP-SPORTSBOOKING"
              filePath={setMedicalCertificate1}
              fileName={memberMedicalCertificate1}
            /> */}
            <ViewFileButton
              appName="SP"
              serviceName="SP-SPORTSBOOKING"
              // @ts-ignore
              // label={<FormattedLabel id="healthCertificate" />}
              filePath={params.row?.memberMedicalCertificate}
              fileUpdater={() => {}}
              view
              readOnly
            />
          </>
        );
      },
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        console.log("params", params.row);
        return (
          <>
            <IconButton
              disabled={viewIconState}
              onClick={() => {
                SetOwnerValues(params?.row);
                // editButtonState
                setEditButtonInputState(true);
                // deleteButtonState
                setDeleteButtonState(true);
                // addButtonState
                setButtonInputState(true);
                // viewIconState
                setViewIconState(true);
                // conditionalRendering
                setSlideChecked(true);
                // collpaseOpen/Close
                setIsOpenCollapse(!isOpenCollapse);
                // disabledInputState
                setViewButtonInputState(true);
                // save/updateButtonText
                // setBtnSaveText("Save");
                //!
                setDisabledInputState(true);
              }}
            >
              <Visibility />
            </IconButton>

            {!watch("formPreviewDailogState") && (
              <>
                {router.query?.pageModeNew != "View" && (
                  <>
                    {!view && (
                      <IconButton
                        className={styles.edit}
                        disabled={editButtonInputState}
                        onClick={() => {
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
                          //!
                          setDisabledInputState(false);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </>
                )}
              </>
            )}

            {!watch("formPreviewDailogState") && (
              <>
                {router.query?.pageModeNew != "View" && (
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
            )}
          </>
        );
      },
    },
  ];

  // saveOwner
  const saveOwner = () => {
    setLoadderState(true);
    const url = `${urls.SPURL}/swimmingPool/save`;

    // currentOwnerDTLDao
    const swimmingPoolDetailsDaoTemp = {
      activeFlag: "Y",
      id:
        watch("memberKey") != null &&
        watch("memberKey") != undefined &&
        watch("memberKey") != ""
          ? watch("memberKey")
          : null,
      swimmingPoolKey:
        watch("swimmingPoolKey") != null &&
        watch("swimmingPoolKey") != undefined &&
        watch("swimmingPoolKey") != ""
          ? watch("swimmingPoolKey")
          : null,
      memberName: watch("memberName"),
      memberMname: watch("memberMname"),
      memberLname: watch("memberLname"),
      memberGender: watch("memberGender"),
      memberAadharNo: watch("memberAadharNo"),
      memberAge: watch("memberAge"),
      memberMedicalCertificate: watch("memberMedicalCertificate"),
      memberAadharCertificate: memberPhotoCertificate1,
      memberPhotoCertificate: memberPhotoCertificate1,
    };

    //filteredNewData
    const filteredNewData = watch("swimmingPoolDetailsDao").filter(
      (data) => data?.id != watch("memberKey")
    );

    // swimmingPoolDetailsDao
    const swimmingPoolDetailsDao = [
      ...filteredNewData,
      swimmingPoolDetailsDaoTemp,
    ];

    // swimmingPoolKey
    const swimmingPoolKey =
      watch("id") != null &&
      watch("id") != null &&
      watch("id") != "" &&
      watch("id") != "undefined"
        ? Number(watch("id"))
        : null;

    const pageMode =
      watch("applicationStatus") != null &&
      watch("applicationStatus") != undefined &&
      watch("applicationStatus") != ""
        ? "APPLICATION_CREATED"
        : "DRAFT";

    //! finalBodyForApi
    const finalBodyForApi = {
      ...watch(),
      swimmingPoolDetailsDao: swimmingPoolDetailsDao,
      pageMode: pageMode,
      id: swimmingPoolKey,
      serviceId: 32,
      activeFlag: "Y",
      createdUserId: user?.id,
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
          console.log(
            "res?.data",
            Number(res?.data?.message?.split(":")[1]),
            res?.data?.message
          );
          setLoadderState(false);
          // setId
          setValue("memberId", Number(res?.data?.message?.split(":")[1]));
          // collpaseOpen/Close
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
          //!
          setDisabledInputState(false);

          resetOwnerValuesId();
          language == "en"
            ? sweetAlert("Saved!", "Record Saved successfully !", "success")
            : sweetAlert(
                "जतन केले!",
                "रेकॉर्ड यशस्वीरित्या जतन केले!",
                "success"
              );
        } else {
          setLoadderState(false);
          //!
          setDisabledInputState(false);
        }
      })
      .catch((error) => {
        setLoadderState(false);
        callCatchMethod(error, language);
        console.log("Error", error);
      });
  };

  const saveOwner1 = (props) => {
    setLoadderState(true);
    const url = `${urls.SPURL}/swimmingPool/save`;

    const swimmingPoolKey =
      watch("id") != null &&
      watch("id") != null &&
      watch("id") != "" &&
      watch("id") != "undefined"
        ? Number(watch("id"))
        : null;

    const pageMode =
      watch("applicationStatus") != null &&
      watch("applicationStatus") != undefined &&
      watch("applicationStatus") != ""
        ? "APPLICATION_CREATED"
        : "DRAFT";

    const finalBodyForApi = {
      ...watch(),
      pageMode: pageMode,
      id: swimmingPoolKey,
      serviceId: 32,
      activeFlag: "Y",
      createdUserId: user?.id,
      swimmingPoolDetailsDao: props,
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
          setValue("memberId", Number(res?.data?.message?.split(":")[1]));
          setLoadderState(false);
          console.log(
            "res?.data",
            Number(res?.data?.message?.split(":")[1]),
            res?.data?.message
          );
        } else {
          setLoadderState(false);
        }
      })
      .catch((error) => {
        setLoadderState(false);
        callCatchMethod(error, language);
        console.log("Error", error);
      });
  };

  //! ============> useEffects <=========

  useEffect(() => {
    getGenders();
  }, []);

  useEffect(() => {
    console.log("props", readOnly);
  }, []);

  useEffect(() => {
    console.log(
      "Certificate21",
      watch("memberMedicalCertificate"),
      watch("memberAadharCertificate"),
      watch("memberPhotoCertificate")
    );
  }, []);

  useEffect(() => {
    const tableData = watch("swimmingPoolDetailsDao");
    if (tableData != null && tableData != undefined && tableData.length) {
      // activeFlagYRecord
      const filteredDataActiveFlagY = tableData?.filter(
        (data) => data?.activeFlag == "Y"
      );
      // filteredData
      const filteredData = filteredDataActiveFlagY?.map((data, index) => {
        return {
          ...data,
          srNo: index + 1,
        };
      });

      setFinalOwnerDetailsTableData(filteredData);
    } else {
      setFinalOwnerDetailsTableData([]);
    }
  }, [watch("swimmingPoolDetailsDao")]);

  useEffect(() => {
    setValue("memberMedicalCertificate", memberMedicalCertificate1);
  }, [memberMedicalCertificate1]);

  // view
  return (
    <>
      {loadderState ? (
        <Loader />
      ) : (
        <div>
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
                        // spacing={9}
                      >
                        <Grid item xs={6} className={styles.feildres}>
                          <TextField
                            id="standard-basic"
                            disabled={disabledInputState}
                            label={<FormattedLabel id="fname" />}
                            variant="standard"
                            {...register("memberName")}
                            error={!!errors.memberName}
                            helperText={
                              errors?.memberName ? "Name is Required !!!" : null
                            }
                          />
                        </Grid>
                        <Grid item xs={6} className={styles.feildres}>
                          <TextField
                            id="standard-basic"
                            disabled={disabledInputState}
                            label={<FormattedLabel id="mname" />}
                            variant="standard"
                            {...register("memberMname")}
                            error={!!errors.memberMname}
                            helperText={
                              errors?.memberMname
                                ? "Middle Name is Required !!!"
                                : null
                            }
                          />
                        </Grid>
                        <Grid item xs={6} className={styles.feildres}>
                          <TextField
                            id="standard-basic"
                            disabled={disabledInputState}
                            label={<FormattedLabel id="lname" />}
                            variant="standard"
                            {...register("memberLname")}
                            error={!!errors.memberLname}
                            helperText={
                              errors?.memberLname
                                ? "Last Name is Required !!!"
                                : null
                            }
                          />
                        </Grid>

                        <Grid item xs={6} className={styles.feildres}>
                          <FormControl
                            sx={{ marginTop: 2 }}
                            error={!!errors.memberGender}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              {<FormattedLabel id="gender" />}
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  value={field.value}
                                  disabled={disabledInputState}
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
                              name="memberGender"
                              control={control}
                              defaultValue={null}
                            />
                            <FormHelperText>
                              {errors?.memberGender
                                ? errors.memberGender.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        columns={{ xs: 4, sm: 8, md: 12 }}
                        className={styles.feildres}
                      >
                        <Grid item xs={6} className={styles.feildres}>
                          <TextField
                            id="standard-basic"
                            inputProps={{ maxLength: 12 }}
                            label={<FormattedLabel id="aadharNo" required />}
                            variant="standard"
                            disabled={disabledInputState}
                            {...register("memberAadharNo")}
                            onChange={(event) => {
                              if (error !== "") {
                                setError("");
                              }
                            }}
                            error={!!errors.memberAadharNo}
                            helperText={<p className={styles.error}>{error}</p>}
                          />
                        </Grid>

                        <Grid item xs={6} className={styles.feildres}>
                          <TextField
                            id="standard-basic"
                            label={<FormattedLabel id="age" />}
                            variant="standard"
                            {...register("memberAge")}
                            error={!!errors.memberAge}
                            disabled={disabledInputState}
                            helperText={
                              errors?.memberAge ? "Age is Required !!!" : null
                            }
                          />
                        </Grid>
                        <Grid item xs={6} className={styles.feildres}>
                          {/* <Typography variant="subtitle2"> */}
                          <strong>
                            {<FormattedLabel id="aadharCertificate" required />}
                          </strong>
                          {/* </Typography> */}
                          <UploadButton
                            error={!!errors?.aadharCard}
                            appName="SP"
                            disabled={disabledInputState}
                            serviceName="SP-SPORTSBOOKING"
                            filePath={setAadharCertificate1}
                            fileName={memberAadharCertificate1}
                            // fileData={aadhaarCardPhotoData}
                            // onChange={(event) => {
                            //   if (errorr !== "") {
                            //     setErrorr("");
                            //   }
                            // }}
                            helperText={
                              errorr !== "" ? "Aadhar Card Required !!!" : null
                            }
                          />
                        </Grid>
                        <Grid item xs={6} className={styles.feildres}>
                          {/* <Typography variant="subtitle2"> */}
                          <strong>
                            {<FormattedLabel id="photoCertificate" required />}
                          </strong>
                          {/* </Typography> */}
                          <UploadButton
                            error={!!errors?.aadharCard}
                            appName="SP"
                            disabled={disabledInputState}
                            serviceName="SP-SPORTSBOOKING"
                            filePath={setPhotoCertificate1}
                            fileName={memberPhotoCertificate1}
                            // fileData={aadhaarCardPhotoData}
                            // onChange={(event) => {
                            //   if (errorr !== "") {
                            //     setErrorr("");
                            //   }
                            // }}
                            helperText={
                              errorr !== "" ? "Photo is Required !!!" : null
                            }
                          />
                        </Grid>
                        <Grid item xs={6} className={styles.feildres}>
                          {/* <Typography variant="subtitle2"> */}
                          <strong>
                            {
                              <FormattedLabel
                                id="medicalCertificate"
                                required
                              />
                            }
                          </strong>
                          {/* </Typography> */}
                          <UploadButton
                            error={!!errors?.aadharCard}
                            appName="SP"
                            disabled={disabledInputState}
                            serviceName="SP-SPORTSBOOKING"
                            filePath={setMedicalCertificate1}
                            fileName={memberMedicalCertificate1}
                            // fileData={aadhaarCardPhotoData}
                            // onChange={(event) => {
                            //   if (errorr !== "") {
                            //     setErrorr("");
                            //   }
                            // }}
                            helperText={
                              errorr !== ""
                                ? "Medical Certificate Required !!!"
                                : null
                            }
                          />
                        </Grid>
                      </Grid>
                      {/* <br /> */}
                      <Grid container className={styles.feildres} spacing={2}>
                        <Grid item>
                          {!viewButtonInputState && (
                            // saveButton
                            <Button
                              size="small"
                              variant="outlined"
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
                            className={styles.button}
                            endIcon={<ExitToAppIcon />}
                            onClick={() => exitFunction()}
                          >
                            {<FormattedLabel id="exit" />}
                          </Button>
                        </Grid>
                      </Grid>
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
              {router?.query?.applicationStatus ===
              "APPLICATION_SENT_BACK_TO_CITIZEN" ? (
                <></>
              ) : (
                <>
                  {!watch("formPreviewDailogState") && (
                    <>
                      {router.query?.pageModeNew != "View" && (
                        <>
                          {!view && (
                            <Box>
                              <Button
                                variant="contained"
                                type="primary"
                                disabled={buttonInputState}
                                onClick={() => {
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
                            </Box>
                          )}
                        </>
                      )}
                    </>
                  )}
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
                sx={{
                  backgroundColor: "white",
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
        </div>
      )}
    </>
  );
};

export default AddMember;
